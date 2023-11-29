export function collectionsTabs() {
  const tabs = document.querySelectorAll(".collections__nav-button");
  const lists = document.querySelectorAll(".collections__list");
  if (!tabs.length) return;

  tabs.forEach((el) => {
    el.addEventListener("click", (e) => {
      const type = e.target.dataset.view;
      [...tabs, ...lists].forEach((el) => {
        el.classList.remove("active");
      });
      e.target.classList.add("active");
      document
        .querySelector(`.collections__list[data-type=${type}]`)
        .classList.add("active");
    });
  });
}
