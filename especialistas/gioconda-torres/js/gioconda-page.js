// gioconda-page.js
// Minimal, defensive script to provide video placeholder behavior and dynamic years
(function () {
  "use strict";

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
      return "../thumb.php?id=" + encodeURIComponent(info.id);
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

    wrapper.addEventListener("click", function () {
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
          "https://www.dailymotion.com/embed/video/" + info.id + "?autoplay=1";
      if (!srcUrl) srcUrl = src;
      newIframe.src = srcUrl;
      iframe.parentNode.replaceChild(newIframe, wrapper);
    });

    return wrapper;
  }

  function initPlaceholders() {
    var iframes = document.querySelectorAll("iframe[data-lazy]");
    if (!iframes.length) return;
    iframes.forEach(function (iframe) {
      // wrap iframe in placeholder
      var ph = makePlaceholderFromIframe(iframe);
      iframe.parentNode.replaceChild(ph, iframe);
    });
  }

  function setCurrentYear(selector) {
    var el = document.querySelector(selector || ".current-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
      initPlaceholders();
    } catch (e) {}
    try {
      setCurrentYear(".current-year");
    } catch (e) {}
  });
})();
