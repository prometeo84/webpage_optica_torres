/**
 * Customized for Óptica Torres (based on Medilab template)
 * Original Template: https://bootstrapmade.com/medilab-free-medical-bootstrap-theme/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  const _body = document.querySelector("body");
  function toggleScrolled() {
    const selectHeader = document.querySelector("#header");
    if (!selectHeader || !_body) return;
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? _body.classList.add("scrolled")
      : _body.classList.remove("scrolled");
  }

  // Use rAF batching for scroll handlers to avoid layout thrashing
  let _scrollTicking = false;
  function onScrollBatch() {
    if (_scrollTicking) return;
    _scrollTicking = true;
    window.requestAnimationFrame(() => {
      try {
        toggleScrolled();
      } catch (e) {}
      _scrollTicking = false;
    });
  }
  document.addEventListener("scroll", onScrollBatch, { passive: true });
  window.addEventListener("load", () => {
    try {
      toggleScrolled();
    } catch (e) {}
  });

  /**
   * Mobile nav toggle
   */
  let mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");
  function mobileNavToogle() {
    if (_body) _body.classList.toggle("mobile-nav-active");
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle("bi-list");
      mobileNavToggleBtn.classList.toggle("bi-x");
    }
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  const _navmenuLinks = document.querySelectorAll("#navmenu a");
  if (_navmenuLinks && _navmenuLinks.length) {
    _navmenuLinks.forEach((navmenu) => {
      navmenu.addEventListener("click", () => {
        if (document.querySelector(".mobile-nav-active")) {
          mobileNavToogle();
        }
      });
    });
  }

  /**
   * Toggle mobile nav dropdowns
   */
  const _toggleDropdowns = document.querySelectorAll(
    ".navmenu .toggle-dropdown",
  );
  if (_toggleDropdowns && _toggleDropdowns.length) {
    _toggleDropdowns.forEach((navmenu) => {
      navmenu.addEventListener("click", function (e) {
        e.preventDefault();
        if (this.parentNode) this.parentNode.classList.toggle("active");
        if (this.parentNode && this.parentNode.nextElementSibling)
          this.parentNode.nextElementSibling.classList.toggle(
            "dropdown-active",
          );
        e.stopImmediatePropagation();
      });
    });
  }

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Batch toggleScrollTop into the same rAF loop to avoid multiple reflows
    function onScrollBatchScrollTop() {
      if (_scrollTicking) return;
      _scrollTicking = true;
      window.requestAnimationFrame(() => {
        try {
          toggleScrollTop();
        } catch (e) {}
        _scrollTicking = false;
      });
    }

    window.addEventListener("load", () => {
      try {
        toggleScrollTop();
      } catch (e) {}
    });
    document.addEventListener("scroll", onScrollBatchScrollTop, {
      passive: true,
    });
  }

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== "undefined" && AOS && typeof AOS.init === "function") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  var glightbox = null;
  if (typeof GLightbox !== "undefined") {
    glightbox = GLightbox({ selector: ".glightbox" });
  }

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }

  /**
   * Frequently Asked Questions Toggle
   */
  var faqItems = document.querySelectorAll(
    ".faq-item h3, .faq-item .faq-toggle",
  );
  if (faqItems && faqItems.length) {
    faqItems.forEach(function (faqItem) {
      faqItem.addEventListener("click", function () {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });
  }

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim(),
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  // Batch navmenu scrollspy with rAF as well
  function onScrollBatchNavmenu() {
    if (_scrollTicking) return;
    _scrollTicking = true;
    window.requestAnimationFrame(() => {
      try {
        navmenuScrollspy();
      } catch (e) {}
      _scrollTicking = false;
    });
  }
  window.addEventListener("load", () => {
    try {
      navmenuScrollspy();
    } catch (e) {}
  });
  document.addEventListener("scroll", onScrollBatchNavmenu, { passive: true });
})();
