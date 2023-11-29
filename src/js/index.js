import mobileNav from "./modules/mobile-nav.js";
import { Forms } from "./modules/Forms.js";
import { collectionsTabs } from "./modules/collectionsTabs.js";
import { faqAccordion } from "./modules/faq.js";
import { SmoothAnchorScroll } from "./modules/smoothSCroll.js";
document.addEventListener("DOMContentLoaded", (e) => {
  mobileNav();
  collectionsTabs();
  faqAccordion();

  const smoothAnchorScroll = new SmoothAnchorScroll();
  smoothAnchorScroll.init();
  const forms = new Forms();
});
