// js/gallery.js

export function initGallery() {
  window.openLightbox = function (src) {
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    img.src = src;
    lightbox.classList.remove("hidden");
    lightbox.classList.add("flex");
    document.body.style.overflow = "hidden"; // Stop scrolling
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.add("hidden");
    lightbox.classList.remove("flex");
    document.body.style.overflow = "auto"; // Resume scrolling
  };
}

console.log("✅ gallery.js loaded");

(async function () {
  try {
    console.log("⏳ Starting gallery initialization...");

    const SUPABASE_URL = "https://alsmjjizeoquuciyuhaf.supabase.co";
    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsc21qaml6ZW9xdXVjaXl1aGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzMzMjAsImV4cCI6MjA4ODU0OTMyMH0.rjnOo6ToIOwGcuRzhgyE9pkff2s3KcHrRvextt7gdeQ";

    const path = window.location.pathname;
    const isArabic = path.includes("-ar.") || path.includes("/ar/");
    console.log("🌐 Language:", isArabic ? "Arabic" : "English");

    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("🔌 Supabase client created");

    // DOM elements
    const filterContainer = document.getElementById("filter-buttons");
    const gridContainer = document.getElementById("gallery-grid");
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalCategory = document.getElementById("modal-category");
    const closeModalBtn = document.getElementById("close-modal");
    const backdrop = document.getElementById("modal-backdrop");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    console.log("📦 DOM elements:", {
      filterContainer: !!filterContainer,
      gridContainer: !!gridContainer,
      modal: !!modal,
    });

    if (!gridContainer || !filterContainer) {
      throw new Error("Required DOM elements missing");
    }

    // Category display names
    const categoryNames = {
      irrigation: { en: "Irrigation", ar: "الري" },
      industrial: { en: "Industrial", ar: "صناعي" },
      municipal: { en: "Municipal", ar: "بلدي" },
      installation: { en: "Installation", ar: "تركيب" },
    };

    let allItems = [];
    let currentFiltered = [];
    let currentIndex = 0;

    // Fetch data
    console.log("📡 Fetching gallery data...");
    const { data, error } = await supabaseClient
      .from("gallery")
      .select("*")
      .order("order", { ascending: true });

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    console.log(`✅ Fetched ${data.length} items`);
    allItems = data;

    // Generate filter buttons
    const categories = [
      ...new Set(allItems.map((i) => i.category).filter(Boolean)),
    ];
    const allText = isArabic ? "الكل" : "All Projects";

    filterContainer.innerHTML = `
      <button class="filter-btn active px-6 py-2 rounded-full text-sm font-bold transition-all" data-filter="all">
        ${allText}
      </button>
      ${categories
        .map((cat) => {
          const display = categoryNames[cat]
            ? categoryNames[cat][isArabic ? "ar" : "en"]
            : cat;
          return `
          <button class="filter-btn px-6 py-2 rounded-full text-sm font-bold transition-all" data-filter="${cat}">
            ${display}
          </button>
        `;
        })
        .join("")}
    `;
    console.log("🔘 Filter buttons rendered");

    // Render gallery grid
    function renderGallery(filter = "all") {
      console.log(`🖼️ Rendering gallery with filter: ${filter}`);
      currentFiltered =
        filter === "all"
          ? allItems
          : allItems.filter((i) => i.category === filter);

      if (currentFiltered.length === 0) {
        gridContainer.innerHTML =
          '<p class="text-center col-span-full py-20 text-gray-500">No images in this category.</p>';
        return;
      }

      gridContainer.innerHTML = currentFiltered
        .map((item, idx) => {
          const title = isArabic
            ? item.title_ar || item.title_en
            : item.title_en || item.title_ar;
          const catLabel = categoryNames[item.category]
            ? categoryNames[item.category][isArabic ? "ar" : "en"]
            : item.category;

          return `
            <div class="gallery-card relative" onclick="openModal(${idx})">
              <img src="${item.image_url}?width=600" alt="${title}" class="w-full h-full aspect-[4/5] object-cover">
              <div class="overlay absolute inset-0 flex flex-col justify-end p-5">
                <span class="text-secondary text-xs font-bold uppercase tracking-wider">${catLabel}</span>
                <h3 class="text-white font-semibold text-base mt-1">${title}</h3>
              </div>
            </div>
          `;
        })
        .join("");
      console.log(`✅ Grid updated with ${currentFiltered.length} items`);
    }

    // Modal functions
    window.openModal = (idx) => {
      console.log(`🔍 Opening modal for index ${idx}`);
      currentIndex = idx;
      updateModalContent();
      modal.style.display = "flex";
      setTimeout(() => modal.classList.add("show"), 10);
      document.body.style.overflow = "hidden";
    };

    function updateModalContent() {
      const item = currentFiltered[currentIndex];
      if (!item) return;

      modalImg.style.opacity = "0";
      setTimeout(() => {
        modalImg.src = item.image_url;
        modalTitle.textContent = isArabic
          ? item.title_ar || item.title_en
          : item.title_en || item.title_ar;
        modalDesc.textContent = isArabic
          ? item.description_ar || item.description_en
          : item.description_en || item.description_ar;
        modalCategory.textContent = categoryNames[item.category]
          ? categoryNames[item.category][isArabic ? "ar" : "en"]
          : item.category;
        modalImg.style.opacity = "1";
      }, 200);
    }

    function closeModal() {
      modal.classList.remove("show");
      setTimeout(() => {
        modal.style.display = "none";
      }, 300);
      document.body.style.overflow = "auto";
    }

    function nextImage() {
      currentIndex = (currentIndex + 1) % currentFiltered.length;
      updateModalContent();
    }

    function prevImage() {
      currentIndex =
        (currentIndex - 1 + currentFiltered.length) % currentFiltered.length;
      updateModalContent();
    }

    // Event listeners
    if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);
    if (backdrop) backdrop.addEventListener("click", closeModal);
    if (nextBtn) nextBtn.addEventListener("click", nextImage);
    if (prevBtn) prevBtn.addEventListener("click", prevImage);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("show")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });

    // Filter clicks
    filterContainer.addEventListener("click", (e) => {
      if (!e.target.classList.contains("filter-btn")) return;
      document
        .querySelectorAll(".filter-btn")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      renderGallery(e.target.dataset.filter);
    });

    // Initialize
    renderGallery("all");
    console.log("🎉 Gallery initialization complete");
  } catch (err) {
    console.error("❌ Gallery initialization failed:", err);
    const gridContainer = document.getElementById("gallery-grid");
    if (gridContainer) {
      gridContainer.innerHTML = `<p class="text-center col-span-full py-20 text-red-500">Error: ${err.message}</p>`;
    }
  }
})();
