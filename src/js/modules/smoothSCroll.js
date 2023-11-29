export class SmoothAnchorScroll {
  init() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    for (const anchor of anchors) {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
          });

          if (
            this.getAttribute("href") === "#contacts" &&
            document
              .querySelector(".nav-icon")
              .classList.contains("nav-icon--active")
          ) {
            document.querySelector(".mobile-nav-btn").click();
          }
        }
      });
    }
  }
}
