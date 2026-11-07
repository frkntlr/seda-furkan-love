/**
 * Coraline İnteraktif Galeri - Seda & Furkan Aşk Evreni
 * Göz Hizalı Düğme Gözler, Ahşap Mandallar & Stop-Motion Polaroidler
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

class CoralineGallery {
  constructor() {
    this.memories = [];
    this.filteredMemories = [];
    this.currentIndex = 0;
    this.grid = document.getElementById('gallery-grid');
    this.modal = document.getElementById('memory-modal');
    this.init();
  }

  async init() {
    await this.fetchMemories();
    this.bindFilters();
    this.bindModalControls();
    this.render();
  }

  async fetchMemories() {
    try {
      const res = await fetch('data/memories.json');
      this.memories = await res.json();
      this.filteredMemories = [...this.memories];
    } catch (err) {
      console.error('[CoralineGallery] Veri okuma hatası:', err);
    }
  }

  bindFilters() {
    const filterButtons = document.querySelectorAll('.filter-chip');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.getAttribute('data-category');
        this.filterCategory(cat);
      });
    });
  }

  filterCategory(category) {
    if (category === 'all') {
      this.filteredMemories = [...this.memories];
    } else {
      this.filteredMemories = this.memories.filter(m => m.category === category);
    }
    this.render();
  }

  renderEyesHtml(eyes) {
    const list = (eyes && eyes.length > 0) ? eyes : [
      { x: 42.5, y: 38.0 }, { x: 57.5, y: 38.0 }
    ];
    return list.map((eye, i) => `
      <div class="coraline-button-eye" style="left: ${eye.x}%; top: ${eye.y}%; animation-delay: ${i * 0.3}s;">
        <div class="button-eye-inner">
          <span class="b-hole h1"></span><span class="b-hole h2"></span>
          <span class="b-hole h3"></span><span class="b-hole h4"></span>
          <div class="thread-cross"></div>
        </div>
      </div>
    `).join('');
  }

  renderCard(item, index) {
    const card = document.createElement('div');
    card.className = 'polaroid-card puppet-wobble';
    const tilt = (index % 5 - 2) * 2.2;
    card.style.setProperty('--card-tilt', `${tilt}deg`);
    const thumbSrc = item.thumb || item.image || item.filename;

    card.innerHTML = `
      <div class="polaroid-mandal" title="Coraline Dikiş Mandalı">
        <div class="wooden-peg"><span class="peg-spring"></span></div>
      </div>
      <div class="polaroid-image-wrapper">
        <img src="${thumbSrc}" alt="${item.title}" loading="lazy" class="polaroid-img" />
        <div class="button-eyes-overlay">
          ${this.renderEyesHtml(item.eyes)}
        </div>
        <div class="secret-rune-overlay">
          <span class="secret-rune-icon">${item.secretRune || '✨'}</span>
          <p class="secret-rune-note">"${item.secretMessage || ''}"</p>
          <span class="secret-rune-tag">🗝️ Furkan'ın Gizli Sırrı</span>
        </div>
      </div>
      <div class="polaroid-caption">
        <h3 class="polaroid-title">${item.title}</h3>
        <p class="polaroid-date">🕸️ ${item.date} • ${item.location}</p>
      </div>
    `;

    card.addEventListener('click', (e) => {
      // Gören taş modu aktifken sırrı tıkla aç veya modala git
      this.openModal(index);
    });

    return card;
  }

  render() {
    if (!this.grid) return;
    this.grid.innerHTML = '';
    this.filteredMemories.forEach((item, index) => {
      this.grid.appendChild(this.renderCard(item, index));
    });
  }

  openModal(index) {
    this.currentIndex = index;
    const item = this.filteredMemories[this.currentIndex];
    if (!item || !this.modal) return;

    const optSrc = item.optimized || item.image || item.filename;
    document.getElementById('modal-img').src = optSrc;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-date').textContent = item.date;
    const locText = item.location_name ? `${item.location_name}` : item.location;
    document.getElementById('modal-location').textContent = `📍 ${locText}`;
    document.getElementById('modal-note').textContent = `"${item.note || item.caption}"`;

    const modalMedia = this.modal.querySelector('.modal-media');
    if (modalMedia) {
      let eyeOverlay = modalMedia.querySelector('.button-eyes-overlay');
      if (!eyeOverlay) {
        eyeOverlay = document.createElement('div');
        eyeOverlay.className = 'button-eyes-overlay';
        modalMedia.appendChild(eyeOverlay);
      }
      eyeOverlay.innerHTML = this.renderEyesHtml(item.eyes);
    }

    this.modal.classList.add('modal-visible');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('modal-visible');
    document.body.style.overflow = '';
  }

  navigateModal(direction) {
    if (!this.filteredMemories.length) return;
    this.currentIndex = (this.currentIndex + direction + this.filteredMemories.length) % this.filteredMemories.length;
    this.openModal(this.currentIndex);
  }

  bindModalControls() {
    const closeBtn = document.getElementById('modal-close-btn');
    const prevBtn = document.getElementById('modal-prev-btn');
    const nextBtn = document.getElementById('modal-next-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
    if (prevBtn) prevBtn.addEventListener('click', () => this.navigateModal(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => this.navigateModal(1));

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeModal();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('modal-visible')) return;
      if (e.key === 'Escape') this.closeModal();
      if (e.key === 'ArrowLeft') this.navigateModal(-1);
      if (e.key === 'ArrowRight') this.navigateModal(1);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.coralineGallery = new CoralineGallery();
});
