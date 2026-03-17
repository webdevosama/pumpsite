/**
 * js/hero-bg-carousel.js
 * Background image carousel for hero section.
 */
const BG_IMAGES = [
  '/assets/gallery/hero.jpg',
  '/assets/gallery/1.jfif',
  '/assets/gallery/2.jfif',
  '/assets/gallery/3.jfif',
  '/assets/gallery/4.jfif',
  '/assets/gallery/5.jfif',
  '/assets/gallery/6.jfif',
  '/assets/gallery/7.png',
  '/assets/gallery/8.jfif',
  '/assets/gallery/9.jfif',
  '/assets/gallery/10.jfif',
  '/assets/gallery/11.jfif',
  '/assets/gallery/12.jfif',
  '/assets/gallery/13.jfif',
  '/assets/gallery/14.jfif',
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