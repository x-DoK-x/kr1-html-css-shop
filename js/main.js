(function () {
  "use strict";

  var carousel = document.querySelector("[data-carousel]");
  if (!carousel) {
    return;
  }

  var slides = Array.prototype.slice.call(
    carousel.querySelectorAll(".carousel__slide")
  );
  var title = carousel.querySelector(".carousel__caption-title");
  var text = carousel.querySelector(".carousel__caption-text");
  var interval = 5000;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = 0;
  var timer = null;
  var paused = false;

  function render() {
    var total = slides.length;

    slides.forEach(function (slide, index) {
      slide.classList.toggle("is-current", index === current);
      slide.classList.toggle("is-prev", index === (current + total - 1) % total);
      slide.classList.toggle("is-next", index === (current + 1) % total);
    });

    var link = slides[current].querySelector(".carousel__link");
    title.textContent = link.dataset.title;
    text.textContent = link.dataset.text;
  }

  function stop() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function start() {
    stop();
    if (paused || reduced) {
      return;
    }
    timer = window.setInterval(function () {
      current = (current + 1) % slides.length;
      render();
    }, interval);
  }

  function select(index) {
    current = index;
    render();
    start();
  }

  slides.forEach(function (slide, index) {
    slide.querySelector(".carousel__link").addEventListener("click", function (event) {
      if (index === current) {
        return;
      }
      event.preventDefault();
      select(index);
    });
  });

  carousel.addEventListener("mouseenter", function () {
    paused = true;
    stop();
  });

  carousel.addEventListener("mouseleave", function () {
    paused = false;
    start();
  });

  carousel.addEventListener("focusin", function () {
    paused = true;
    stop();
  });

  carousel.addEventListener("focusout", function (event) {
    if (!carousel.contains(event.relatedTarget)) {
      paused = false;
      start();
    }
  });

  render();
  start();
})();
