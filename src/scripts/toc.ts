const HEADER_OFFSET = 150;

interface TOCState {
  headings: HTMLElement[];
  regions: { id: string; start: number; end: number }[];
  activeIds: string[];
  scrollArea: HTMLElement | null;
  links: NodeListOf<Element>;
}

function createState(): TOCState {
  return {
    headings: [],
    regions: [],
    activeIds: [],
    scrollArea: null,
    links: document.querySelectorAll("[data-heading-link]"),
  };
}

function buildRegions(state: TOCState) {
  state.headings = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".prose h2, .prose h3, .prose h4, .prose h5, .prose h6"
    )
  );

  if (state.headings.length === 0) {
    state.regions = [];
    return;
  }

  state.regions = state.headings.map((heading, index) => {
    const nextHeading = state.headings[index + 1];
    return {
      id: heading.id,
      start: heading.offsetTop,
      end: nextHeading ? nextHeading.offsetTop : document.body.scrollHeight,
    };
  });
}

function getVisibleIds(state: TOCState): string[] {
  if (state.headings.length === 0) return [];

  const viewportTop = window.scrollY + HEADER_OFFSET;
  const viewportBottom = window.scrollY + window.innerHeight;
  const visibleIds = new Set<string>();

  const isInViewport = (top: number, bottom: number) =>
    (top >= viewportTop && top <= viewportBottom) ||
    (bottom >= viewportTop && bottom <= viewportBottom) ||
    (top <= viewportTop && bottom >= viewportBottom);

  state.headings.forEach((heading) => {
    const headingBottom = heading.offsetTop + heading.offsetHeight;
    if (isInViewport(heading.offsetTop, headingBottom)) {
      visibleIds.add(heading.id);
    }
  });

  state.regions.forEach((region) => {
    if (region.start <= viewportBottom && region.end >= viewportTop) {
      const heading = document.getElementById(region.id);
      if (heading) {
        const headingBottom = heading.offsetTop + heading.offsetHeight;
        if (
          region.end > headingBottom &&
          (headingBottom < viewportBottom || viewportTop < region.end)
        ) {
          visibleIds.add(region.id);
        }
      }
    }
  });

  return Array.from(visibleIds);
}

function updateScrollMask(scrollArea: HTMLElement | null) {
  if (!scrollArea) return;

  const { scrollTop, scrollHeight, clientHeight } = scrollArea;
  const threshold = 5;
  const isAtTop = scrollTop <= threshold;
  const isAtBottom = scrollTop >= scrollHeight - clientHeight - threshold;

  scrollArea.classList.toggle("mask-t-from-90%", !isAtTop);
  scrollArea.classList.toggle("mask-b-from-90%", !isAtBottom);
}

function scrollToActive(
  state: TOCState,
  container: string,
  headingIds: string[]
) {
  if (!state.scrollArea || !headingIds.length) return;

  const activeLink = document.querySelector(
    `${container} [data-heading-link="${headingIds[0]}"], ${container} [data-heading-id="${headingIds[0]}"]`
  );
  if (!activeLink) return;

  const { top: areaTop, height: areaHeight } =
    state.scrollArea.getBoundingClientRect();
  const { top: linkTop, height: linkHeight } =
    activeLink.getBoundingClientRect();

  const currentLinkTop = linkTop - areaTop + state.scrollArea.scrollTop;
  const targetScroll = Math.max(
    0,
    Math.min(
      currentLinkTop - (areaHeight - linkHeight) / 2,
      state.scrollArea.scrollHeight - state.scrollArea.clientHeight
    )
  );

  if (Math.abs(targetScroll - state.scrollArea.scrollTop) > 5) {
    state.scrollArea.scrollTop = targetScroll;
  }
}

export function initSidebarTOC() {
  const container = "#toc-sidebar-container";
  const state = createState();
  state.scrollArea = document.getElementById("toc-sidebar-scroll-area");
  state.links = document.querySelectorAll(`${container} [data-heading-link]`);

  buildRegions(state);

  if (state.headings.length === 0) return () => {};

  const handleScroll = () => {
    const newActiveIds = getVisibleIds(state);
    if (JSON.stringify(newActiveIds) !== JSON.stringify(state.activeIds)) {
      state.activeIds = newActiveIds;
      state.links.forEach((link) => link.classList.remove("text-foreground"));
      newActiveIds.forEach((id) => {
        document
          .querySelector(`${container} [data-heading-link="${id}"]`)
          ?.classList.add("text-foreground");
      });
      scrollToActive(state, container, newActiveIds);
    }
  };

  const handleResize = () => {
    buildRegions(state);
    handleScroll();
    updateScrollMask(state.scrollArea);
  };

  const handleTOCScroll = () => updateScrollMask(state.scrollArea);

  handleScroll();
  setTimeout(() => updateScrollMask(state.scrollArea), 100);

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  state.scrollArea?.addEventListener("scroll", handleTOCScroll, {
    passive: true,
  });

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
    state.scrollArea?.removeEventListener("scroll", handleTOCScroll);
  };
}

export function initMobileTOC() {
  const container = "#mobile-toc-container";
  const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * 10;

  const state = createState();
  state.scrollArea = document.getElementById("mobile-toc-scroll-area");

  const progressCircle = document.getElementById("mobile-toc-progress-circle");
  const currentSectionText = document.getElementById(
    "mobile-toc-current-section"
  );
  const detailsElement = document.querySelector<HTMLDetailsElement>(
    `${container} details`
  );
  const listElement = document.getElementById("mobile-table-of-contents");

  buildRegions(state);

  if (!currentSectionText) return () => {};

  const updateProgress = () => {
    if (!progressCircle) return;
    const scrollableDistance =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress =
      scrollableDistance > 0
        ? Math.min(Math.max(window.scrollY / scrollableDistance, 0), 1)
        : 0;
    progressCircle.style.strokeDashoffset = (
      PROGRESS_CIRCUMFERENCE *
      (1 - scrollProgress)
    ).toString();
  };

  const updateMobileLinks = (headingIds: string[]) => {
    listElement?.querySelectorAll(".mobile-toc-item").forEach((item) => {
      const tocItem = item as HTMLElement;
      const headingId = tocItem.dataset.headingId;
      tocItem.classList.toggle(
        "text-foreground",
        headingId !== undefined && headingIds.includes(headingId)
      );
    });

    if (headingIds.length > 0) {
      scrollToActive(state, container, headingIds);
      const activeTexts = state.headings
        .filter((h) => headingIds.includes(h.id) && h.textContent)
        .map((h) => h.textContent!.trim());
      currentSectionText.textContent =
        activeTexts.length > 0 ? activeTexts.join(", ") : "Overview";
    } else {
      currentSectionText.textContent = "Overview";
    }
  };

  if (state.headings.length === 0) {
    currentSectionText.textContent = "Overview";
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }

  const handleScroll = () => {
    const newActiveIds = getVisibleIds(state);
    if (JSON.stringify(newActiveIds) !== JSON.stringify(state.activeIds)) {
      state.activeIds = newActiveIds;
      updateMobileLinks(state.activeIds);
    }
    updateProgress();
  };

  const handleResize = () => {
    buildRegions(state);
    handleScroll();
  };

  state.activeIds = getVisibleIds(state);
  updateMobileLinks(state.activeIds);
  updateProgress();

  listElement?.querySelectorAll(".mobile-toc-item").forEach((item) => {
    item.addEventListener("click", () => {
      if (detailsElement) detailsElement.open = false;
    });
  });

  state.scrollArea?.addEventListener(
    "scroll",
    () => updateScrollMask(state.scrollArea),
    { passive: true }
  );

  detailsElement?.addEventListener("toggle", () => {
    if (detailsElement.open) {
      setTimeout(() => updateScrollMask(state.scrollArea), 100);
    }
  });

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
  };
}
