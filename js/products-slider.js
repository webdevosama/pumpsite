import { products } from "./load-products.js";

let currentFilteredProducts = [...products];
let currentIndex = 0;

export function initProductSlider() {
  // Using IDs now to guarantee we select the right elements
  const featuredCard = document.getElementById("card-center");
  const leftCard = document.getElementById("card-left");
  const rightCard = document.getElementById("card-right");
  const filterBtns = document.querySelectorAll(
    ".flex.justify-center.gap-3 button",
  );

  function updateUI() {
    if (currentFilteredProducts.length === 0) return;

    // STEP 1: Fade out & shrink slightly (The Animation Start)
    [featuredCard, leftCard, rightCard].forEach((card) => {
      if (card) {
        card.style.opacity = "0";
        card.style.transform =
          card.id === "card-center" ? "scale(0.95)" : "scale(0.70)";
      }
    });

    // STEP 2: Wait for fade out, swap data, then fade back in
    setTimeout(() => {
      const current = currentFilteredProducts[currentIndex];

      // Update Center Card
      featuredCard.querySelector("img").src = current.img;
      featuredCard.querySelector("h3").innerText = current.name;
      featuredCard.querySelector("p.text-gray-500").innerText = current.desc;
      featuredCard.querySelector(".text-secondary.uppercase").innerText =
        current.brand;
      featuredCard.querySelector(".text-8xl").innerText = current.id;

      // Update Side Cards
      const prevIndex =
        (currentIndex - 1 + currentFilteredProducts.length) %
        currentFilteredProducts.length;
      const nextIndex = (currentIndex + 1) % currentFilteredProducts.length;

      if (leftCard)
        leftCard.querySelector("img").src =
          currentFilteredProducts[prevIndex].img;
      if (rightCard)
        rightCard.querySelector("img").src =
          currentFilteredProducts[nextIndex].img;

      // STEP 3: Fade back in (The Animation End)
      [featuredCard, leftCard, rightCard].forEach((card) => {
        if (card) {
          if (card.id === "card-center") {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          } else {
            card.style.opacity = "0.4"; // The soft visibility for side cards
            card.style.transform = "scale(0.75)";
          }
        }
      });
    }, 300); // 300ms matches our CSS duration
  }

  // --- Navigation Logic ---
  window.moveSlider = (direction) => {
    if (direction === "next") {
      currentIndex = (currentIndex + 1) % currentFilteredProducts.length;
    } else {
      currentIndex =
        (currentIndex - 1 + currentFilteredProducts.length) %
        currentFilteredProducts.length;
    }
    updateUI();
  };

  // --- Filter Logic ---
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.innerText.toLowerCase().trim();

      filterBtns.forEach((b) => {
        b.classList.remove("bg-main", "text-white", "shadow-md");
        b.classList.add("border-gray-100", "text-gray-500");
      });
      btn.classList.add("bg-main", "text-white", "shadow-md");
      btn.classList.remove("border-gray-100", "text-gray-500");

      if (category === "all products" || category === "all") {
        currentFilteredProducts = [...products];
      } else {
        currentFilteredProducts = products.filter(
          (p) => p.type.toLowerCase() === category,
        );
      }

      currentIndex = 0;
      updateUI();
    });
  });

  updateUI(); // Run once on load
}
