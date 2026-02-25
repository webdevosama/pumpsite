// Tailwind custom config
tailwind.config = {
  theme: {
    extend: {
      colors: {
        main: "var(--main-color)",
        secondary: "var(--secondary-color)",
        bgCustom: "var(--bg-color)",
      },
    },
  },
};

/**
 * Loads an external HTML file into a placeholder element
 * @param {string} id - The ID of the placeholder div
 * @param {string} file - Path to the HTML file
 */
async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;

  // Add base animation class before content loads
  element.classList.add("fade-in-up");

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to fetch ${file}`);

    const content = await response.text();
    element.innerHTML = content;

    // Trigger fade-in transition
    setTimeout(() => {
      element.classList.add("visible");
    }, 100);

    // Special handling for header
    if (id === "header") {
      initMobileMenu();
      highlightActiveLink();
    }
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

/**
 * Initializes mobile menu toggle
 */
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.onclick = () => {
      menu.classList.toggle("active");
      btn.innerText = menu.classList.contains("active") ? "✕" : "☰";
    };
  }
}

/**
 * Highlights the active link in the header based on current URL
 */
function highlightActiveLink() {
  const currentPath = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll("nav a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(currentPath)) {
      link.classList.add("text-secondary", "font-bold");
    }
  });
}

// Load all components once DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("header", "components/header.html");
  loadComponent("hero", "components/hero.html");
  loadComponent("highlights", "components/highlights.html");
  loadComponent("partners", "components/partners.html");
  loadComponent("featured-products", "components/products.html");
  loadComponent("about", "components/about.html");
  loadComponent("contact", "components/contact.html");
  loadComponent("footer", "components/footer.html");
});
