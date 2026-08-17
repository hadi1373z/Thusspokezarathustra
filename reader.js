const root = document.documentElement;
const progress = document.querySelector("[data-progress]");
const chapters = [...document.querySelectorAll("[data-chapter]")];
const tocLinks = [...document.querySelectorAll(".contents a")];
const fontButtons = [...document.querySelectorAll("[data-font]")];

const savedSize = Number(localStorage.getItem("zarathustra-reader-size"));
let readerSize = Number.isFinite(savedSize) && savedSize >= 17 && savedSize <= 25 ? savedSize : 20;

function applyReaderSize() {
  root.style.setProperty("--reader-size", `${readerSize}px`);
  localStorage.setItem("zarathustra-reader-size", String(readerSize));
}

function updateProgress() {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
  progress.style.width = `${percentage}%`;
}

function markCurrentChapter(id) {
  tocLinks.forEach((link) => {
    const current = link.hash === `#${id}`;
    link.classList.toggle("current", current);
    if (current) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}

fontButtons.forEach((button) => {
  button.addEventListener("click", () => {
    readerSize += button.dataset.font === "increase" ? 1 : -1;
    readerSize = Math.min(25, Math.max(17, readerSize));
    applyReaderSize();
  });
});

const chapterObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    if (visible[0]) markCurrentChapter(visible[0].target.id);
  },
  { rootMargin: "-18% 0px -65% 0px", threshold: 0 },
);

chapters.forEach((chapter) => chapterObserver.observe(chapter));
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

applyReaderSize();
updateProgress();
