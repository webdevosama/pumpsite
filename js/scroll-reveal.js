// js/scroll-reveal.js
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: unobserve after animation to save resources
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }); // trigger when 20% visible

  const revealElements = document.querySelectorAll('.reveal-left');
  revealElements.forEach(el => observer.observe(el));
}