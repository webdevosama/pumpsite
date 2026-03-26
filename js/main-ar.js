// main-ar.js
import { loadComponent } from "./load-scripts.js";
import { initCounters } from "./counters.js";
import { initHeroCarousel } from "./hero-carousel.js";
import { initScrollReveal } from "./scroll-reveal.js";

document.addEventListener("DOMContentLoaded", async () => {
  const componentBase = "/ar/components/";

  const components = [
    { id: "header", path: `${componentBase}header.html` },
    { id: "footer", path: `${componentBase}footer.html` },
    { id: "hero", path: `${componentBase}section-hero.html` },
    { id: "highlights", path: `${componentBase}section-highlights.html` },
    { id: "services", path: `${componentBase}section-services.html` },
    { id: "products", path: `${componentBase}section-products.html` },
    { id: "about", path: `${componentBase}section-about.html` },
    { id: "partners", path: `${componentBase}section-partners.html` },
    { id: "testimonials", path: `${componentBase}section-testimonials.html` },
    { id: "faq", path: `${componentBase}section-faq.html` },
    { id: "contact", path: `${componentBase}section-contact.html` },
  ];

  const activeTasks = components
    .filter((comp) => document.getElementById(comp.id))
    .map((comp) => loadComponent(comp.id, comp.path));

  try {
    await Promise.all(activeTasks);
    if (document.getElementById("hero")) initHeroCarousel();
    if (document.getElementById("highlights")) initCounters();
    initScrollReveal();
  } catch (err) {
    console.warn("Component loading failed.", err);
  } finally {
    document.body.classList.add("loaded");
  }
});

// what to do next.