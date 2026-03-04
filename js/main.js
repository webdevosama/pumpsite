import { loadComponent } from "./load-scripts.js";
import { initMap } from "./load-map.js";
import { initGallery } from "./gallery.js";
import { initProductSlider } from "./products-slider.js";
import { initCounters } from "./counters.js";

// Note: If you moved to Tailwind CLI, you can likely remove configureTailwind()
// as Tailwind is now handled by the CSS compiler, not a JS script.

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  // IMPROVED DETECTION:
  // 1. Checks if URL contains "-ar"
  // 2. Checks if URL starts with "/ar" (for clean URLs)
  // 3. Checks if the <html> tag has lang="ar" (safest)
  const isArabic =
    path.includes("-ar") ||
    path.startsWith("/ar") ||
    document.documentElement.lang === "ar";

  const componentBase = isArabic ? "/ar/" : "/components/";

  console.log("Language Detected:", isArabic ? "Arabic" : "English");
  console.log("Loading components from:", componentBase);
  // Then in your components array, use componentBase:
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
