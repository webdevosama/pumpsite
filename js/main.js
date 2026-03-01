import { loadComponent } from "./load-scripts.js";
import { initMap } from "./load-map.js";
import { initGallery } from "./gallery.js";
import { initProductSlider } from "./products-slider.js";
import { initCounters } from "./counters.js";

// Note: If you moved to Tailwind CLI, you can likely remove configureTailwind()
// as Tailwind is now handled by the CSS compiler, not a JS script.

document.addEventListener("DOMContentLoaded", async () => {
  const components = [
    { id: "header", path: "/components/header.html" },
    { id: "footer", path: "/components/footer.html" },
    { id: "hero", path: "/components/section-hero.html" },
    { id: "highlights", path: "/components/section-highlights.html" },
    { id: "partners", path: "/components/section-partners.html" },
    { id: "about", path: "/components/section-about.html" },
    { id: "contact", path: "/components/section-contact.html" },
    { id: "products", path: "/components/section-products.html" },
  ];

  const tasks = components
    .filter((comp) => document.getElementById(comp.id))
    .map((comp) => loadComponent(comp.id, comp.path));

  try {
    await Promise.all(tasks);
  } catch (err) {
    console.warn("Some components failed to load, revealing page anyway.");
  } finally {
    // Reveal the site
    document.body.classList.add("loaded");
  }

  if (document.getElementById("map-container")) initMap("map-container");
  if (document.getElementById("lightbox")) initGallery();
  if (document.getElementById("catalog")) initProductSlider();

  // Correct spelling: "highlights"
  if (document.getElementById("highlights")) {
    initCounters(); 
  }
});
