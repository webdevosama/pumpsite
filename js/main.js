import { configureTailwind } from "./tailwind.js";
import { loadComponent } from "./load-scripts.js";
import { initMap } from "./load-map.js";
import { initGallery } from "./gallery.js";
import { initProductSlider } from "./products-slider.js";


configureTailwind();

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

  // Map only the elements present on the page
  const tasks = components
    .filter((comp) => document.getElementById(comp.id))
    .map((comp) => loadComponent(comp.id, comp.path));

  try {
    await Promise.all(tasks);
  } catch (err) {
    console.warn("Some components failed to load, revealing page anyway.");
  } finally {
    // This is the "magic" line that prevents the messy loading look
    document.body.classList.add("loaded");
  }

  // Only initialize the map if the specific container exists (Contact Page)
  if (document.getElementById("map-container")) {
    initMap("map-container");
  }

  // Initialize Gallery only if the lightbox exists
  if (document.getElementById("lightbox")) {
    initGallery();
  }

  // Only run if we are on the products page
  if (document.getElementById("catalog")) {
    initProductSlider();
  }
});
