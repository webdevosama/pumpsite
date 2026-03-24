/**
 * Loads an external HTML file into a placeholder element
 * @param {string} id - The ID of the placeholder div
 * @param {string} file - Path to the HTML file
 */
import { initMobileMenu, highlightActiveLink } from "./header.js";

export async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;

  element.classList.add("fade-in-up");

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to fetch ${file}`);

    const content = await response.text();
    element.innerHTML = content;

    setTimeout(() => {
      element.classList.add("visible");
    }, 100);

    // Re-initialize logic if the header was loaded
    if (id === "header") {
      initMobileMenu();
      highlightActiveLink();
    }
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
    throw error; // Important: pass error to main.js Promise.all
  }
}

