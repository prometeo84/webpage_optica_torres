/**
 * Template Name: Medilab
 * Template URL: https://bootstrapmade.com/medilab-free-medical-bootstrap-theme/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

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
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Frequently Asked Questions Toggle
   */
  document
    .querySelectorAll(".faq-item h3, .faq-item .faq-toggle")
    .forEach((faqItem) => {
      faqItem.addEventListener("click", () => {
        faqItem.parentNode.classList.toggle("faq-active");
      });
    });

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

  /*
   * Lazy placeholders for iframes with `data-lazy` (replicate Gioconda page behavior)
   * Replaces iframe[data-lazy] with a clickable thumbnail that injects the iframe with autoplay only after click.
   */
  function parseVideo(src) {
    if (!src) return null;
    try {
      var u = new URL(src, window.location.href);
      if (/dailymotion/.test(u.hostname))
        return {
          provider: "dailymotion",
          id: u.pathname.split("/").pop() || "",
        };
      if (/youtube/.test(u.hostname) || u.hostname === "youtu.be") {
        var id = u.searchParams.get("v") || u.pathname.split("/").pop();
        return { provider: "youtube", id: id };
      }
    } catch (e) {
      return null;
    }
    return null;
  }

  function thumbnailFor(info) {
    if (!info) return "";
    if (info.provider === "youtube")
      return "https://img.youtube.com/vi/" + info.id + "/hqdefault.jpg";
    if (info.provider === "dailymotion")
      return (
        "especialistas/gioconda-torres/thumb.php?id=" +
        encodeURIComponent(info.id)
      );
    return "";
  }

  function makePlaceholderFromIframe(iframe) {
    var src =
      iframe.getAttribute("data-src") ||
      iframe.src ||
      iframe.getAttribute("src");
    var info = parseVideo(src);
    var thumb = thumbnailFor(info) || "";
    var wrapper = document.createElement("button");
    wrapper.className = "video-placeholder";
    wrapper.setAttribute("aria-label", "Reproducir vídeo");
    wrapper.style.border = "0";
    wrapper.style.background = "transparent";
    wrapper.style.cursor = "pointer";
    wrapper.innerHTML =
      '<span class="vp-thumb" style="display:block;background-size:cover;background-position:center;width:100%;height:100%;"></span><span class="vp-play" aria-hidden="true">▶</span>';
    var thumbEl = wrapper.querySelector(".vp-thumb");
    if (thumb) thumbEl.style.backgroundImage = 'url("' + thumb + '")';

    wrapper.addEventListener(
      "click",
      function () {
        var newIframe = document.createElement("iframe");
        newIframe.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        );
        newIframe.setAttribute("allowfullscreen", "");
        newIframe.style.width = "100%";
        newIframe.style.height = "100%";
        var srcUrl = "";
        if (info && info.provider === "youtube")
          srcUrl = "https://www.youtube.com/embed/" + info.id + "?autoplay=1";
        if (info && info.provider === "dailymotion")
          srcUrl =
            "https://www.dailymotion.com/embed/video/" +
            info.id +
            "?autoplay=1";
        if (!srcUrl) srcUrl = src;
        newIframe.src = srcUrl;
        wrapper.parentNode.replaceChild(newIframe, wrapper);
      },
      { once: true },
    );

    return wrapper;
  }

  function initPlaceholders() {
    var iframes = document.querySelectorAll("iframe[data-lazy]");
    if (!iframes.length) return;
    iframes.forEach(function (iframe) {
      try {
        var ph = makePlaceholderFromIframe(iframe);
        iframe.parentNode.replaceChild(ph, iframe);
      } catch (e) {}
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
      initPlaceholders();
    } catch (e) {}
  });
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
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();
