/**
 * Coraline Gece Haritası - Seda & Furkan Aşk Coğrafyası
 * Leaflet.js ve CartoDB Dark Matter motoru
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

class CoralineMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.memories = [];
    this.init();
  }

  async init() {
    if (!window.L) return;
    this.setupMap();
    await this.loadData();
    this.bindQuickJumps();
  }

  setupMap() {
    const mapEl = document.getElementById('coraline-map');
    if (!mapEl) return;

    this.map = L.map('coraline-map', {
      center: [41.015, 29.02],
      zoom: 11,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(this.map);
  }

  async loadData() {
    try {
      const res = await fetch('data/memories.json');
      this.memories = await res.json();
      this.renderMarkers();
    } catch (err) {
      console.error('[CoralineMap] Veri yuklenemedi:', err);
    }
  }

  createButtonIcon() {
    return L.divIcon({
      className: 'custom-coraline-pin',
      html: `
        <div class="map-button-pin">
          <div class="pin-hole-grid">
            <span class="pin-hole"></span><span class="pin-hole"></span>
            <span class="pin-hole"></span><span class="pin-hole"></span>
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });
  }

  renderMarkers() {
    if (!this.map) return;
    const icon = this.createButtonIcon();

    this.memories.forEach((mem, index) => {
      if (!mem.lat || !mem.lng) return;
      const marker = L.marker([mem.lat, mem.lng], { icon }).addTo(this.map);
      marker.bindPopup(this.createPopupHtml(mem, index));

      marker.on('click', () => {
        this.map.flyTo([mem.lat, mem.lng], 14, { duration: 1.2 });
      });

      this.markers.push({ marker, location: mem.location, id: mem.id });
    });
  }

  createPopupHtml(mem, index) {
    const thumb = mem.thumb || `images/thumbs/memory-${String(mem.id).padStart(2, '0')}.webp`;
    return `
      <div class="map-popup-card">
        <img src="${thumb}" alt="${mem.title}" class="map-popup-thumb" loading="lazy" />
        <h4 class="map-popup-title">${mem.title}</h4>
        <p class="map-popup-meta">📍 ${mem.location} • ${mem.date}</p>
        <p class="map-popup-note">"${mem.note || mem.caption}"</p>
        <button class="map-popup-btn" onclick="window.coralineGallery.openModal(${index})">
          ✨ Tam Boyutta Gör
        </button>
      </div>
    `;
  }

  bindQuickJumps() {
    const chips = document.querySelectorAll('.map-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const lat = parseFloat(chip.getAttribute('data-lat'));
        const lng = parseFloat(chip.getAttribute('data-lng'));
        const zoom = parseInt(chip.getAttribute('data-zoom') || '13', 10);
        if (this.map && !isNaN(lat) && !isNaN(lng)) {
          this.map.flyTo([lat, lng], zoom, { duration: 1.5 });
        }
      });
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.coralineMap = new CoralineMap();
});
