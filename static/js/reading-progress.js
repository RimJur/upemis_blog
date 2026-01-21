(function () {
  "use strict";

  // Reading Progress Bar
  function initProgressBar() {
    const progressBar = document.getElementById("reading-progress-bar");
    const article = document.querySelector("article.prose");

    if (!progressBar || !article) return;

    function updateProgress() {
      const articleRect = article.getBoundingClientRect();
      const articleTop = articleRect.top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Calculate how far we've scrolled through the article
      const start = articleTop - windowHeight * 0.1;
      const end = articleTop + articleHeight - windowHeight * 0.9;
      const progress = Math.min(
        Math.max((scrollY - start) / (end - start), 0),
        1
      );

      progressBar.style.transform = `scaleX(${progress})`;
    }

    let ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            updateProgress();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial update
    updateProgress();
  }

  // Table of Contents Active Section Highlighting
  function initTocHighlighting() {
    const tocLinks = document.querySelectorAll(".toc-sidebar a");
    const headings = [];

    if (tocLinks.length === 0) return;

    // Build list of heading elements that match TOC links
    tocLinks.forEach(function (link) {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        const heading = document.getElementById(href.slice(1));
        if (heading) {
          headings.push({ element: heading, link: link });
        }
      }
    });

    if (headings.length === 0) return;

    // Intersection Observer for detecting visible headings
    let activeIndex = -1;

    function updateActiveLink(index) {
      if (index === activeIndex) return;

      tocLinks.forEach(function (link) {
        link.classList.remove("active");
      });

      if (index >= 0 && index < headings.length) {
        headings[index].link.classList.add("active");
      }

      activeIndex = index;
    }

    // Find the heading that's currently most relevant
    function findActiveHeading() {
      const scrollY = window.scrollY;
      const offset = 100; // Account for fixed header

      // Find the last heading that's above our scroll position + offset
      let active = -1;
      for (let i = 0; i < headings.length; i++) {
        const rect = headings[i].element.getBoundingClientRect();
        const headingTop = rect.top + scrollY;

        if (headingTop <= scrollY + offset) {
          active = i;
        } else {
          break;
        }
      }

      // If we're at the very top, highlight first item
      if (active === -1 && scrollY < 200) {
        active = 0;
      }

      updateActiveLink(active);
    }

    let ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            findActiveHeading();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial update
    findActiveHeading();

    // Smooth scroll for TOC links
    tocLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const target = document.getElementById(href.slice(1));
          if (target) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }
      });
    });
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initProgressBar();
      initTocHighlighting();
    });
  } else {
    initProgressBar();
    initTocHighlighting();
  }
})();
