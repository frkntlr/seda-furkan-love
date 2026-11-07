/**
 * Coraline İnteraktif Galeri & Polaroid Modalı
 * Stop-motion polaroid stili, filtreleme ve modal gezinimi
 */

class CoralineGallery {
  constructor() {
    this.memories = [];
    this.filteredMemories = [];
    this.currentIndex = 0;
    this.grid = document.getElementById('gallery-grid');
    this.modal = document.getElementById('memory-modal');
    this.threadSvg = document.getElementById('thread-svg');

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
      console.error('Memories fetch error:', err);
    }
  }

  bindFilters() {
    const filterButtons = document.querySelectorAll('.filter-chip');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
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

  render() {
    if (!this.grid) return;
    this.grid.innerHTML = '';

    this.filteredMemories.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      const tilt = (index % 5 - 2) * 2.2;
      card.style.setProperty('--card-tilt', `${tilt}deg`);
      const imgSrc = item.image || item.filename;

      card.innerHTML = `
        <div class="polaroid-pin">
          <span class="button-pin"></span>
        </div>
        <div class="polaroid-image-wrapper">
          <img src="${imgSrc}" alt="${item.title}" loading="lazy" class="polaroid-img" />
          <div class="button-eyes-overlay">
            <span class="btn-eye left-eye"></span>
            <span class="btn-eye right-eye"></span>
          </div>
        </div>
        <div class="polaroid-caption">
          <h3 class="polaroid-title">${item.title}</h3>
          <p class="polaroid-date">🕸️ ${item.date} • ${item.location}</p>
        </div>
      `;

      card.addEventListener('click', () => this.openModal(index));
      this.grid.appendChild(card);
    });

    this.drawThread();
  }

  openModal(index) {
    this.currentIndex = index;
    const item = this.filteredMemories[this.currentIndex];
    if (!item || !this.modal) return;

    document.getElementById('modal-img').src = item.image || item.filename;
    document.getElementById('modal-title').textContent = item.title;
    document.getElementById('modal-date').textContent = item.date;
    document.getElementById('modal-location').textContent = item.location;
    document.getElementById('modal-note').textContent = `"${item.note || item.caption}"`;

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

  drawThread() {
    if (!this.threadSvg) return;
    const cards = document.querySelectorAll('.polaroid-card');
    if (cards.length < 2) {
      this.threadSvg.innerHTML = '';
      return;
    }

    const rectGrid = this.grid.getBoundingClientRect();
    this.threadSvg.setAttribute('width', `${this.grid.scrollWidth}`);
    this.threadSvg.setAttribute('height', `${this.grid.scrollHeight}`);

    let pathD = '';
    cards.forEach((card, idx) => {
      const pin = card.querySelector('.polaroid-pin');
      if (!pin) return;
      const pRect = pin.getBoundingClientRect();
      const x = pRect.left - rectGrid.left + pRect.width / 2;
      const y = pRect.top - rectGrid.top + pRect.height / 2;

      if (idx === 0) {
        pathD += `M ${x} ${y}`;
      } else {
        const prev = cards[idx - 1].querySelector('.polaroid-pin').getBoundingClientRect();
        const px = prev.left - rectGrid.left + prev.width / 2;
        const py = prev.top - rectGrid.top + prev.height / 2;
        const cx = (px + x) / 2;
        const cy = Math.min(py, y) + 40;
        pathD += ` Q ${cx} ${cy} ${x} ${y}`;
      }
    });

    this.threadSvg.innerHTML = `
      <path d="${pathD}" class="golden-thread-path" />
    `;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.coralineGallery = new CoralineGallery();
});
