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
// ... (Tailwind config remains the same)

async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (!element) return;

  // Add the base animation class before content loads
  element.classList.add('fade-in-up');

  try {
    const response = await fetch(file);
    if (response.ok) {
      const content = await response.text();
      element.innerHTML = content;

      // Small timeout to allow the browser to "paint" the new content
      // then add the 'visible' class to trigger the transition
      setTimeout(() => {
        element.classList.add('visible');
      }, 100);

      if (id === "header") {
        initMobileMenu();
        highlightActiveLink();
      }
    }
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
  }
}

function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.onclick = () => {
      // Toggle the 'active' class to trigger CSS transition
      menu.classList.toggle("active");

      // Update icon: ☰ to ✕
      if (menu.classList.contains("active")) {
        btn.innerText = "✕";
      } else {
        btn.innerText = "☰";
      }
    };
  }
}
// ... (highlightActiveLink remains the same)

window.onload = async () => {
  // Load the header first so the user can navigate immediately
  await loadComponent("header", "/components/header.html");
  
  // Load the rest of the components
  const components = [
    ["hero", "/components/hero.html"],
    ["highlights", "/components/highlights.html"],
    ["partners", "/components/partners.html"],
    ["featured-products", "/components/products.html"],
    ["about", "/components/about.html"],
    ["contact", "/components/contact.html"],
    ["footer", "/components/footer.html"]
  ];

  // This loop adds a slight staggered delay so they don't all appear at once
  for (let i = 0; i < components.length; i++) {
    const [id, path] = components[i];
    // Wait 150ms between starting each load for a "cascading" effect
    await new Promise(resolve => setTimeout(resolve, 150));
    loadComponent(id, path);
  }
};