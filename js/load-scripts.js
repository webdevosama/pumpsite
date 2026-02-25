/**
 * Loads an external HTML file into a placeholder element
 * @param {string} id - The ID of the placeholder div
 * @param {string} file - Path to the HTML file
 */
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

function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.onclick = () => {
      // Toggle 'active' to match your CSS .mobile-menu.active
      const isOpen = menu.classList.toggle("active");
      btn.innerText = isOpen ? "✕" : "☰";
    };
  }
}

function highlightActiveLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll("nav a");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(path)) {
      link.classList.add("text-secondary", "font-bold");
    }
  });
}
