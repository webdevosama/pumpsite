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

// Script to load external HTML components
async function loadComponent(id, file) {
  const element = document.getElementById(id);
  const response = await fetch(file);
  if (response.ok) {
    element.innerHTML = await response.text();
  }
}

window.onload = () => {
  loadComponent("header", "/components/header.html");
  loadComponent("footer", "/components/footer.html");
  loadComponent("hero", "/components/hero.html");
  loadComponent("highlights", "/components/highlights.html");
  loadComponent("contact", "/components/contact.html");
  loadComponent("featured-products", "/components/products.html");
  loadComponent("about", "/components/about.html");
};
