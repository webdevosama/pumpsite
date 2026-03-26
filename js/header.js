// js/header.js
export function initMobileMenu() {
  const openBtn = document.getElementById("mobile-menu-btn");
  const closeBtn = document.getElementById("close-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (!openBtn || !menu) return;

  const toggleMenu = (isOpen) => {
    menu.classList.toggle("active", isOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  openBtn.onclick = () => toggleMenu(true);

  if (closeBtn) {
    closeBtn.onclick = () => toggleMenu(false);
  }

  // Close when clicking any link
  menu.querySelectorAll("a").forEach((link) => {
    link.onclick = () => toggleMenu(false);
  });

  // CLEANUP: If the screen is resized to desktop, reset the menu state
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      toggleMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggleMenu(false);
  });
}

export function highlightActiveLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll("nav a");
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.includes(path)) {
      link.classList.add("text-secondary", "font-bold");
    }
  });
}
