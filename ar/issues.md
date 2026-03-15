I’ll guide you through fixing each issue step by step, providing code examples where needed. Let's begin with the **critical** and **high‑priority** items, then move to medium and low.

---

## 🔴 1. Add Static Fallback for JavaScript Failure

### Problem

All pages rely on JavaScript to inject header, footer, and sections. Without JS, the page shows only empty `<div>`s.

### Solution

The most robust approach is to **pre‑render components at build time** using a simple static site generator (like Eleventy, Astro, or even a custom Node script). This eliminates client‑side injection entirely and gives you full control over fallback content.

If you cannot add a build step now, you can include **static HTML inside each placeholder** and let JavaScript enhance it (instead of replacing it). For example:

```html
<!-- index.html -->
<div id="header">
  <!-- Static fallback header -->
  <nav>...</nav>
</div>
```

Then in `loadComponent()`, you would **not** replace the content, but rather enhance it (e.g., add mobile menu behavior). However, this duplicates the header across all pages, making maintenance harder. I strongly recommend the build‑time approach.

### Action Plan

1. Install a simple build tool like **Eleventy** or **Vite** with a static HTML plugin.
2. Move your component HTML files into a `_includes` directory.
3. Create a template that includes the components.
4. Build the site, producing fully static HTML files.
5. Remove all client‑side `loadComponent` calls.

If you want to keep client‑side loading for now, at least add a `<noscript>` warning with essential links:

```html
<noscript>
  <div style="padding:2rem; text-align:center">
    <p>
      JavaScript is disabled. Please enable it for full functionality, or use
      the navigation below:
    </p>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/products.html">Products</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="/contact.html">Contact</a></li>
    </ul>
  </div>
</noscript>
```

Add this inside each page’s `<body>`.

---

## 🔴 2. Remove Dead / Unused Code

### Files to Delete

- `js/gallery.js` – not used (logic is inline in `gallery.html`).
- `js/products-slider.js` and `js/load-products.js` – remnants of an old slider.
- `components/neo-header.html` – unused alternative header.

### How to Delete

Simply remove these files from your project. Ensure no imports reference them (e.g., in `main.js` there's no import of `products-slider` – it's commented out? Actually it's imported but not used – you also need to remove those import lines from `main.js` and `main-ar.js`).

In `main.js`, remove:

```js
import { initProductSlider } from "./products-slider.js";
```

and the line `if (document.getElementById("catalog")) initProductSlider();`

---

## 🟠 3. Unify Arabic / English Scripts

### Problem

`main.js` and `main-ar.js` are nearly identical.

### Solution

Use a single `main.js` that detects language and sets the component base path accordingly. You already have detection logic; just remove `main-ar.js` and point all Arabic pages to `main.js`.

Update `index-ar.html`, `about-ar.html`, etc. to use:

```html
<script type="module" src="/js/main.js"></script>
```

Then modify `main.js` to use the detected language for component paths:

```js
// main.js
import { loadComponent } from "./load-scripts.js";
import { initMap } from "./load-map.js";
import { initCounters } from "./counters.js";

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;
  const isArabic =
    path.includes("-ar.") ||
    path.startsWith("/ar") ||
    document.documentElement.lang === "ar";

  const componentBase = isArabic ? "/ar/components/" : "/components/";

  const components = [
    { id: "header", path: `${componentBase}header.html` },
    { id: "footer", path: `${componentBase}footer.html` },
    { id: "hero", path: `${componentBase}section-hero.html` },
    { id: "highlights", path: `${componentBase}section-highlights.html` },
    { id: "partners", path: `${componentBase}section-partners.html` },
    { id: "about", path: `${componentBase}section-about.html` },
    { id: "contact", path: `${componentBase}section-contact.html` },
    { id: "products", path: `${componentBase}section-products.html` },
  ];

  const tasks = components
    .filter((comp) => document.getElementById(comp.id))
    .map((comp) => loadComponent(comp.id, comp.path));

  try {
    await Promise.all(tasks);
  } catch (err) {
    console.warn("Some components failed to load.");
  } finally {
    document.body.classList.add("loaded");
  }

  if (document.getElementById("map-container")) initMap("map-container");
  if (document.getElementById("highlights")) initCounters();
});
```

Also remove the import of `initProductSlider` and `initGallery` (since gallery is handled inline). Ensure `load-map.js` and `counters.js` are language‑agnostic.

---

## 🟡 4. Consolidate CSS Files

### Problem

Multiple small CSS files increase HTTP requests.

### Solution

Merge related files into `main.css`. For example:

- `animations.css` → into `main.css` or a separate `animations.css` if large.
- `components.css` → into `main.css`.
- `marquees.css` → already part of `main.css`? Actually your `main.css` contains marquee styles, so you can delete `marquees.css`.
- `waves.css` → into `main.css`.

Update HTML files to only link `main.css`, `variables.css`, `header.css`, and `gallery.css` (if needed).

**Example new `main.css`** – incorporate all styles from the smaller files.

After merging, remove the now‑unused CSS files.

---

## 🟡 5. Fix Inconsistent Paths & Broken Images

### Problem

Some images use absolute paths starting with `/assets/...`, others use relative. Placeholder images are missing.

### Fix

- Use **root‑relative paths** everywhere (e.g., `/assets/partners-logos/caprari.webp`).
- For missing logos (A&M, SlovPump, Vladimir Motors), either add the actual images or remove the references. If you want to keep placeholders, create a generic placeholder image (e.g., `placeholder-logo.png`) and point to that.

**Example correction in `about.html`**:

```html
<img src="/assets/partners-logos/caprari.webp" alt="Caprari Italy" />
<!-- instead of assets/partners-logos/caprari.webp -->
```

Update all HTML files accordingly.

---

## 🟠 6. Optimise Hero Video

### Problem

`background.mp4` may be large, affecting load time.

### Fix

1. **Compress the video** using HandBrake:
   - Format: MP4
   - Codec: H.264
   - Constant Quality: RF 28
   - Audio: none (or remove audio track)
2. Add `preload="metadata"` to the `<video>` tag to avoid downloading the whole file immediately.
3. Provide a static image fallback using the `poster` attribute.

Example:

```html
<video
  autoplay
  muted
  loop
  playsinline
  preload="metadata"
  poster="/assets/hero-poster.jpg"
>
  <source src="/assets/background-compressed.mp4" type="video/mp4" />
</video>
```

---

## 🟠 7. Image Optimisation

### Convert to WebP

Use a tool like `cwebp` or an online converter to convert `.jpg` / `.jfif` images to WebP. Update the `src` attributes accordingly.

### Add `srcset` for responsive images

For the gallery grid, you can use the `srcset` attribute with different widths. Since you're already appending `?width=600` to the Supabase URL, that helps, but you can also specify multiple sizes:

```html
<img
  srcset="image.jpg?width=400 400w, image.jpg?width=800 800w"
  sizes="(max-width: 600px) 400px, 800px"
  src="image.jpg?width=800"
  alt="..."
/>
```

This ensures the browser downloads the most appropriate size.

---

## 🟡 8. Reduce Cumulative Layout Shift (CLS)

### Problem

Dynamic content injection may cause layout shifts.

### Fix

Set **minimum heights** on containers that will be replaced. For example:

```css
#header {
  min-height: 80px; /* adjust to your header height */
}
#hero {
  min-height: 100vh; /* or a specific height */
}
```

Use `min-height` to reserve space.

---

## 🟡 9. Build Custom Tailwind CSS

### Problem

Tailwind is loaded via CDN, which adds extra requests and may cause flicker.

### Solution

1. Install Tailwind locally:
   ```bash
   npm init -y
   npm install tailwindcss
   npx tailwindcss init
   ```
2. Configure `tailwind.config.js` with your custom colors.
3. Create a `src/input.css` with `@tailwind` directives.
4. Build the CSS:
   ```bash
   npx tailwindcss -i ./src/input.css -o ./styles/tailwind.css --minify
   ```
5. Link to `tailwind.css` instead of the CDN.

Remove the CDN script from all HTML files and add `<link rel="stylesheet" href="/styles/tailwind.css">`.

---

## 🟠 10. SEO: JavaScript‑Rendered Content & Canonical URLs

### JavaScript‑Rendered Content

Search engines may not index content loaded dynamically. The best fix is **pre‑rendering** (as suggested in #1). If you keep client‑side loading, ensure your pages have static text (like the `<noscript>` fallback) and that your meta tags are present.

### Canonical URLs / Sitemap Mismatch

Update your sitemap to either:

- Include the `.html` extension: `<loc>https://.../about.html</loc>`
- Or use clean URLs and set up redirects in `netlify.toml` (which you already have). But your internal links should also use clean URLs. Currently, they point to `about.html`, etc. Decide on one style and stick to it.

If you want clean URLs (without `.html`), change all internal links to `/about/`, `/products/`, etc., and create corresponding redirects in `netlify.toml` (you already have a rule for `/ar/*`). You'll also need to update the `canonical` meta tags.

If you prefer to keep `.html`, update the sitemap accordingly.

---

## 🟡 11. Add Missing Meta Descriptions

Check each page and write unique, compelling meta descriptions. For example, `products.html`:

```html
<meta
  name="description"
  content="Explore our comprehensive range of submersible, industrial, irrigation, and drinking water pumps. Trusted solutions since 1966."
/>
```

---

## 🟡 12. Improve Image Alt Text

Add descriptive `alt` attributes to all images, especially in the partner marquee. For example:

```html
<img
  src="/assets/partners-logos/sapar.png"
  alt="Sapar Pumps – international partner"
/>
```

---

## 🟠 13. Mobile Menu Accessibility

### Fix

- Toggle `aria-expanded` when menu opens/closes.
- Manage focus: when menu opens, focus the first link; when closes, return focus to the toggle button.

Update `load-scripts.js` `initMobileMenu`:

```js
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const menu = document.getElementById("mobile-menu");

  if (btn && menu) {
    btn.onclick = () => {
      const isOpen = menu.classList.toggle("active");
      btn.setAttribute("aria-expanded", isOpen);
      btn.innerText = isOpen ? "✕" : "☰";

      if (isOpen) {
        // Focus first link after a short delay to allow rendering
        setTimeout(() => {
          const firstLink = menu.querySelector("a");
          if (firstLink) firstLink.focus();
        }, 100);
      } else {
        btn.focus();
      }
    };
  }
}
```

Also ensure the menu is keyboard‑navigable (use arrow keys? optional).

---

## 🟠 14. Keyboard Navigation & Modal Focus Trap

### Gallery Modal

Currently, the modal can be closed with Escape, but focus is not trapped inside. Implement a focus trap.

Add this to your gallery script (inside the IIFE):

```js
// After opening modal
function trapFocus(e) {
  if (!modal.classList.contains("show")) return;
  const focusable = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
}

document.addEventListener("keydown", trapFocus);
```

Remember to remove the listener when modal closes.

---

## 🟡 15. Form Validation & Feedback

Add client‑side validation with inline messages and a success/error handler. For example, using the Constraint Validation API:

```js
const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  // Submit via fetch
  // Show loading, then success/error message
});
```

Add a placeholder for messages near the form.

---

## 🟡 16. Touch Targets

Ensure all interactive elements are at least 44×44px. Use CSS:

```css
button,
a,
[role="button"] {
  min-width: 44px;
  min-height: 44px;
}
```

For filter buttons, adjust padding if needed.

---

## 🟠 17. Hero Section Clarity

Add a sub‑headline that explicitly states your core services. For example:

```html
<p class="...">
  Import, supply, and installation of high‑performance pumps and electric motors
  for agriculture, irrigation, and industry.
</p>
```

Place it below the main headline.

---

## 🟠 18. Enhance Product Descriptions

In `products.html`, include key specs directly in the card. You can add a small list or tooltip. For example:

```html
<div class="text-xs text-gray-400 mt-2">
  <span>Max Flow: 100 m³/h</span> • <span>Head: 80 m</span> •
  <span>Power: 15 kW</span>
</div>
```

Fetch these from the database and display.

---

## 🟠 19. Add Trust Badges

In the highlights section or footer, add badges like:

- ISO 9001 Certified
- 60+ Years of Excellence
- Authorized Distributor (Caprari, Sigma, etc.)

Use icons and text.

---

## 🟡 20. Consistent Brand Colors

Define global hover states in your CSS. For example:

```css
button,
.btn {
  transition:
    background-color 0.3s,
    color 0.3s;
}
.bg-main:hover {
  background-color: var(--white);
  color: var(--main-color);
}
.border-main:hover {
  background-color: var(--main-color);
  color: var(--white);
}
```

Apply these classes consistently.

---

## 🟠 21. Centralise Supabase Configuration

Create a file `js/config.js`:

```js
export const SUPABASE_URL = "https://alsmjjizeoquuciyuhaf.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJ...";
```

Then import it in `gallery.html` and `products.html` scripts.

---

## 🟠 22. Move Inline Scripts to External Modules

Refactor the long `<script>` blocks in `gallery.html` and `products.html` into separate module files, e.g., `gallery-page.js` and `products-page.js`. Import them with `type="module"`. This improves readability and caching.

Example `gallery-page.js`:

```js
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
const { createClient } = supabase;
// ... rest of the logic
```

Then in `gallery.html`:

```html
<script type="module" src="/js/gallery-page.js"></script>
```

---

## 🟡 23. Use a Build Tool

Consider adopting **Vite** for development and building. It can:

- Bundle JS modules.
- Process CSS with PostCSS (including Tailwind).
- Optimize images.
- Support component‑based includes (via HTML partials).

I can provide a basic Vite setup if you'd like.

---

## 📋 Summary of Priority Actions

| Priority  | Action                                   | Status |
| --------- | ---------------------------------------- | ------ |
| 🔴 High   | Add JS fallback (build tool recommended) | ⬜     |
| 🔴 High   | Remove dead files                        | ✅     |
| 🔴 High   | Unify language scripts                   | ⬜     |
| 🔴 High   | Fix image paths & missing logos          | ⬜     |
| 🟠 Medium | Optimise hero video & images             | ⬜     |
| 🟠 Medium | Reduce CLS (min‑heights)                 | ⬜     |
| 🟠 Medium | Build custom Tailwind                    | ⬜     |
| 🟠 Medium | Update sitemap / canonical URLs          | ⬜     |
| 🟠 Medium | Add meta descriptions & alt text         | ⬜     |
| 🟠 Medium | Improve mobile menu & keyboard a11y      | ⬜     |
| 🟠 Medium | Add form validation                      | ⬜     |
| 🟠 Medium | Enhance hero & product content           | ⬜     |
| 🟡 Low    | Consolidate CSS                          | ⬜     |
| 🟡 Low    | Centralise Supabase config               | ⬜     |
| 🟡 Low    | Move inline scripts to modules           | ⬜     |

---

## 🚀 Next Steps

1. **Start with the high‑priority items** – they have the biggest impact on user experience and SEO.
2. **Implement the build tool** first if you choose that path, as it will simplify many other fixes.
3. Work through the list, testing each change on your development site before deploying.

If you need help with any specific step – for example, setting up Vite, writing the unified `main.js`, or fixing the gallery modal – just ask, and I'll provide the exact code. Let's make your site rock‑solid!
