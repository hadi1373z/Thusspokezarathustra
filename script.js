const reflections = {
  stuck: {
    passage: "The snake which cannot cast its skin has to die.",
    thought:
      "Name one identity you keep defending even though it no longer helps you grow. What small act would loosen it today?",
  },
  failure: {
    passage: "You must be ready to burn yourself in your own flame.",
    thought:
      "Failure is not always a verdict; sometimes it is the cost of becoming precise. What attempt would still matter even if nobody applauded?",
  },
  direction: {
    passage: "Become who you are.",
    thought:
      "Do not begin with a final destination. Notice where your attention becomes most alive, then give that place one uninterrupted hour.",
  },
};

const tabs = [...document.querySelectorAll("[data-reflection]")];
const panel = document.querySelector("#reflection-panel");
const passage = panel?.querySelector("[data-passage]");
const thought = panel?.querySelector("[data-thought]");

function activateTab(tab) {
  const reflection = reflections[tab.dataset.reflection];
  if (!reflection || !panel || !passage || !thought) return;

  tabs.forEach((item) => {
    const selected = item === tab;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });

  panel.setAttribute("aria-labelledby", tab.id);
  panel.classList.remove("reveal");
  void panel.offsetWidth;
  passage.textContent = `“${reflection.passage}”`;
  thought.textContent = reflection.thought;
  panel.classList.add("reveal");
}

tabs.forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    const next = tabs[(index + direction + tabs.length) % tabs.length];
    activateTab(next);
    next.focus();
  });
});
