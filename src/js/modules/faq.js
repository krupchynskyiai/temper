export function faqAccordion() {
  const triggers = document.querySelectorAll(".faq__btn");
  if (!triggers.length) return;
  triggers.forEach(
    (el) =>
      (el.onclick = () => {
        el.classList.toggle("open");
      })
  );
}
