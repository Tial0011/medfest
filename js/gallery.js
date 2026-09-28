/** Gallery page: edition filters + keyboard-friendly lightbox. */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("gallery-grid");
  const box = document.getElementById("lightbox");
  if (!grid || !box) return;

  const items = [...grid.querySelectorAll(".gpage__item")];
  const filters = [...document.querySelectorAll(".gpage__filter")];
  const img = box.querySelector(".lightbox__img");
  const edition = box.querySelector(".lightbox__edition");
  const count = box.querySelector(".lightbox__count");
  const closeBtn = box.querySelector(".lightbox__close");
  const prevBtn = box.querySelector(".lightbox__nav--prev");
  const nextBtn = box.querySelector(".lightbox__nav--next");

  let current = 0;
  let lastFocus = null;

  const visible = () => items.filter((item) => !item.hidden);

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.filter;
      filters.forEach((f) => {
        const on = f === btn;
        f.classList.toggle("is-active", on);
        f.setAttribute("aria-pressed", String(on));
      });
      items.forEach((item) => {
        item.hidden = key !== "all" && item.dataset.edition !== key;
      });
    });
  });

  function show(index) {
    const list = visible();
    current = (index + list.length) % list.length;
    const item = list[current];
    const photo = item.querySelector("img");
    img.src = photo.currentSrc || photo.src;
    img.alt = photo.alt;
    edition.textContent = item.querySelector(".gpage__tag").textContent;
    count.textContent = `${current + 1} / ${list.length}`;
  }

  function open(item) {
    lastFocus = document.activeElement;
    box.hidden = false;
    document.body.classList.add("lightbox-open");
    show(visible().indexOf(item));
    closeBtn.focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove("lightbox-open");
    img.src = "";
    if (lastFocus) lastFocus.focus();
  }

  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest(".gpage__open");
    if (trigger) open(trigger.closest(".gpage__item"));
  });

  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => show(current - 1));
  nextBtn.addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (event) => {
    if (event.target === box) close();
  });

  document.addEventListener("keydown", (event) => {
    if (box.hidden) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowLeft") show(current - 1);
    else if (event.key === "ArrowRight") show(current + 1);
    else if (event.key === "Tab") {
      const focusable = [closeBtn, prevBtn, nextBtn];
      const idx = focusable.indexOf(document.activeElement);
      event.preventDefault();
      const step = event.shiftKey ? -1 : 1;
      focusable[(idx + step + focusable.length) % focusable.length].focus();
    }
  });

  let startX = 0;
  box.addEventListener("touchstart", (e) => (startX = e.changedTouches[0].clientX), { passive: true });
  box.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });
});
