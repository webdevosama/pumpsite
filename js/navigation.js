export function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.onclick = () => {
      const isOpen = menu.classList.toggle("active");
      btn.innerText = isOpen ? "✕" : "☰";
    };
  }
}

export function highlightActiveLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll("nav a");

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(currentPath)) {
      link.classList.add("text-secondary", "font-bold");
    }
  });
}
