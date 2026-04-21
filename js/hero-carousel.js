/**
 * js/hero-bg-carousel.js
 * Image carousel with auto-play, manual arrows, and dots.
 */
const BG_IMAGES = [
  '/assets/no_bg/image7.png',
  '/assets/no_bg/image2.png',
  '/assets/no_bg/image18.png',
  '/assets/no_bg/image5.png',
  '/assets/no_bg/image7.png',
  '/assets/no_bg/image11.png',
  '/assets/no_bg/image10.png',
  '/assets/no_bg/image12.png',
  '/assets/no_bg/image13.png',
  '/assets/no_bg/image22.png',
  '/assets/no_bg/image25.png',
  '/assets/no_bg/image27.png',
];

export function initHeroCarousel() {
  const slidesContainer = document.getElementById('hero-bg-slides');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!slidesContainer) return;

  // Build slides
  slidesContainer.innerHTML = BG_IMAGES.map((src, idx) => `
    <div class="hero-bg-slide absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${idx === 0 ? 'opacity-100' : 'opacity-0'}">
      <img src="${src}" alt="Hero product" class="w-full h-full object-contain p-4">
    </div>
  `).join('');

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = BG_IMAGES.map((_, idx) => `
      <button class="w-2 h-2 rounded-full transition-all duration-300 ${idx === 0 ? 'bg-secondary w-6' : 'bg-gray-300 hover:bg-gray-400'}" data-index="${idx}"></button>
    `).join('');
  }

  let currentIndex = 0;
  const slides = slidesContainer.querySelectorAll('.hero-bg-slide');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('button') : [];
  let interval;

  function goToSlide(index) {
    if (index === currentIndex) return;
    slides[currentIndex].classList.replace('opacity-100', 'opacity-0');
    if (dots[currentIndex]) dots[currentIndex].classList.replace('bg-secondary', 'bg-gray-300');
    if (dots[currentIndex]) dots[currentIndex].classList.remove('w-6');

    currentIndex = index;
    slides[currentIndex].classList.replace('opacity-0', 'opacity-100');
    if (dots[currentIndex]) dots[currentIndex].classList.replace('bg-gray-300', 'bg-secondary');
    if (dots[currentIndex]) dots[currentIndex].classList.add('w-6');
  }

  function nextSlide() { goToSlide((currentIndex + 1) % slides.length); }
  function prevSlide() { goToSlide((currentIndex - 1 + slides.length) % slides.length); }

  function startAutoPlay() {
    if (interval) clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  }

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(interval); prevSlide(); startAutoPlay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(interval); nextSlide(); startAutoPlay(); });
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { clearInterval(interval); goToSlide(i); startAutoPlay(); });
  });

  // Pause on hover (optional)
  const carousel = document.getElementById('hero-carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => clearInterval(interval));
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

const observer = new MutationObserver(() => {
  if (document.getElementById('hero-bg-slides')) {
    initHeroCarousel();
    observer.disconnect();
  }
});
observer.observe(document.body, { childList: true, subtree: true });