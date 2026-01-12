// ===== Mobile menu =====
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

if (burger && nav) {
  burger.addEventListener("click", () => {
    const opened = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", opened ? "true" : "false");
  });

  // close menu after click
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // close menu on outside click
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !burger.contains(e.target)) {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
}

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Fake form send =====
const fakeSend = document.getElementById("fakeSend");
const formHint = document.getElementById("formHint");
if (fakeSend && formHint) {
  fakeSend.addEventListener("click", () => {
    formHint.textContent = "Демо: сообщение не отправляется (для проекта можно подключить обработчик).";
  });
}

// ===== Slider / Carousel =====
const viewport = document.getElementById("sliderViewport");
const slides = viewport ? Array.from(viewport.querySelectorAll(".slide")) : [];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("dots");
const autoplayToggle = document.getElementById("autoplayToggle");

let index = 0;
let autoplayTimer = null;

function renderDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot" + (i === index ? " is-active" : "");
    d.type = "button";
    d.setAttribute("aria-label", `Слайд ${i + 1}`);
    d.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(d);
  });
}

function update() {
  if (!viewport) return;
  viewport.style.transform = `translateX(-${index * 100}%)`;
  slides.forEach((s, i) => s.classList.toggle("is-active", i === index));
  // dots
  if (dotsWrap) {
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  }
}

function goTo(i) {
  index = (i + slides.length) % slides.length;
  update();
}

function next() { goTo(index + 1); }
function prev() { goTo(index - 1); }

if (slides.length) {
  renderDots();
  update();
}

if (nextBtn) nextBtn.addEventListener("click", next);
if (prevBtn) prevBtn.addEventListener("click", prev);

// Autoplay
function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = null;
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    next();
  }, 4500);
}

if (autoplayToggle) {
  if (autoplayToggle.checked) startAutoplay();

  autoplayToggle.addEventListener("change", () => {
    if (autoplayToggle.checked) startAutoplay();
    else stopAutoplay();
  });
}

// Pause autoplay on hover (desktop)
const sliderRoot = document.querySelector(".slider");
if (sliderRoot) {
  sliderRoot.addEventListener("mouseenter", () => stopAutoplay());
  sliderRoot.addEventListener("mouseleave", () => {
    if (autoplayToggle && autoplayToggle.checked) startAutoplay();
  });
}

// Swipe (mobile)
let startX = 0;
let isDown = false;

if (viewport) {
  viewport.addEventListener("pointerdown", (e) => {
    isDown = true;
    startX = e.clientX;
    viewport.setPointerCapture(e.pointerId);
  });

  viewport.addEventListener("pointerup", (e) => {
    if (!isDown) return;
    isDown = false;
    const dx = e.clientX - startX;
    const threshold = 40; // px
    if (dx > threshold) prev();
    else if (dx < -threshold) next();
  });

  viewport.addEventListener("pointercancel", () => {
    isDown = false;
  });
}
