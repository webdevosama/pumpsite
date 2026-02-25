export function initMap(containerId) {
    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) return;

    // The official location for Ibrahim Abu Hassanein & Partners
    const location = "JG49+8V9, Gamhoria Ave, Khartoum, Sudan";
    const encodedLocation = encodeURIComponent(location);
    
    // Using a reliable Google Maps Embed URL
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY_HERE&q=${encodedLocation}`;
    
    // Note: If you don't have an API key yet, you can use the standard Iframe share link:
    const standardUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;

    mapContainer.innerHTML = `
      <iframe 
        width="100%" 
        height="100%" 
        style="border:0;" 
        allowfullscreen="" 
        loading="lazy" 
        referrerpolicy="no-referrer-when-downgrade"
        src="${standardUrl}">
      </iframe>`;
}