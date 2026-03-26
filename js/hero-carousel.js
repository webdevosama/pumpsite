/**
 * js/hero-bg-carousel.js
 * Background image carousel for hero section.
 */
const BG_IMAGES = [
  '/assets/hd (1).jpg',
  '/assets/hd (2).jpg',
  '/assets/hd (3).jpg',
  '/assets/hd (4).jpg',
  '/assets/hd (5).jpg',
  '/assets/hd (6).jpg',
];

export function initHeroCarousel() {
  const slidesContainer = document.getElementById('hero-bg-slides');
  if (!slidesContainer) return;

  slidesContainer.innerHTML = BG_IMAGES.map((src, idx) => `
    <div class="hero-bg-slide absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${idx === 0 ? 'opacity-100' : 'opacity-0'}"
         style="background-image: url('${src}');"></div>
  `).join('');

  let currentIndex = 0;
  const slides = slidesContainer.querySelectorAll('.hero-bg-slide');
  if (slides.length === 0) return;

  function nextSlide() {
    slides[currentIndex].classList.replace('opacity-100', 'opacity-0');
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.replace('opacity-0', 'opacity-100');
  }

  setInterval(nextSlide, 5000);
}

// Auto‑initialize when element appears
const observer = new MutationObserver(() => {
  if (document.getElementById('hero-bg-slides')) {
    initHeroCarousel();
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });