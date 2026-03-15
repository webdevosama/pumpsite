// main.js
import { loadComponent } from "./load-scripts.js";
import { initMap } from "./load-map.js";
import { initCounters } from "./counters.js";

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;
  const isArabic =
    path.includes("-ar.") ||
    path.startsWith("/ar") ||
    document.documentElement.lang === "ar";

  const componentBase = isArabic ? "/ar/components/" : "/components/";

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
    console.warn("Some components failed to load.");
  } finally {
    document.body.classList.add("loaded");
  }

  if (document.getElementById("map-container")) initMap("map-container");
  if (document.getElementById("highlights")) initCounters();
});
