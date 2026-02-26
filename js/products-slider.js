import { products } from "./load-products.js";

let currentFilteredProducts = [...products];
let currentIndex = 0;

export function initProductSlider() {
  const featuredCard = document.querySelector(".z-20"); // The main card
  const leftCard = document.querySelector(".absolute.left-10");
  const rightCard = document.querySelector(".absolute.right-10");
  const prevBtn = document.querySelectorAll("button")[4]; // Adjust based on HTML index
  const nextBtn = document.querySelectorAll("button")[5];
  const filterBtns = document.querySelectorAll(
    ".flex.justify-center.gap-3 button",
  );

  function updateUI() {
    if (currentFilteredProducts.length === 0) return;

    // 1. Update Featured Card
    const current = currentFilteredProducts[currentIndex];
    featuredCard.querySelector("img").src = current.img;
    featuredCard.querySelector("h3").innerText = current.name;
    featuredCard.querySelector("p.text-gray-500").innerText = current.desc;
    featuredCard.querySelector(".text-secondary.uppercase").innerText =
      current.brand;
    featuredCard.querySelector(".text-8xl").innerText = current.id;

    // 2. Update Peeking Cards (Left/Right)
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
      const category = btn.innerText.toLowerCase();

      // Update button styles for active state
      filterBtns.forEach((b) => {
        b.classList.remove("bg-main", "text-white", "shadow-md");
        b.classList.add("border-gray-100", "text-gray-500");
      });
      btn.classList.add("bg-main", "text-white", "shadow-md");
      btn.classList.remove("border-gray-100", "text-gray-500");

      // Filter logic
      if (category === "all products") {
        currentFilteredProducts = [...products];
      } else {
        currentFilteredProducts = products.filter((p) => p.type === category);
      }

      currentIndex = 0; // Reset to first item in new list
      updateUI();
    });
  });

  updateUI(); // Initial render
}
