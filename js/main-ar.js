import { loadComponent } from "./load-scripts.js";
import { initMap } from "./load-map.js";
import { initGallery } from "./gallery.js";
import { initProductSlider } from "./products-slider.js";
import { initCounters } from "./counters.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Since this script is only for Arabic pages,
  // we know exactly where the components are.
  const componentBase = "/ar/components/";

  const components = [
    { id: "header", path: `${componentBase}header.html` },
    { id: "footer", path: `${componentBase}footer.html` },
    { id: "hero", path: `${componentBase}section-hero.html` },
    { id: "highlights", path: `${componentBase}section-highlights.html` },
    { id: "partners", path: `${componentBase}section-partners.html` },
    { id: "about", path: `${componentBase}section-about.html` },
    { id: "contact", path: `${componentBase}section-contact.html` },
    { id: "products", path: `${componentBase}section-products.html` },
  ];

  const tasks = components
    .filter((comp) => document.getElementById(comp.id))
    .map((comp) => loadComponent(comp.id, comp.path));

  try {
    await Promise.all(tasks);
  } catch (err) {
    console.warn("Arabic components failed to load.");
  } finally {
    document.body.classList.add("loaded");
  }

  // Initialize features
  if (document.getElementById("map-container")) initMap("map-container");
  if (document.getElementById("lightbox")) initGallery();
  if (document.getElementById("catalog")) initProductSlider();
  if (document.getElementById("highlights")) initCounters();
});
