/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./**/*.html",                 // all HTML files in root and subfolders
        "./components/**/*.html",      // your component partials (English)
        "./ar/**/*.html",              // Arabic HTML files
        "./ar/components/**/*.html",   // Arabic component partials
        "./js/**/*.js",                // if you have Tailwind classes in JS
    ],
    theme: {
        extend: {
            colors: {
                'main': '#1e3575',
                'secondary': '#879ab3',
                'bg-color': '#ffffff',
                'white': '#ffffff',
            },
            // any other custom extensions you have in variables.css
        },
    },
    plugins: [],
}