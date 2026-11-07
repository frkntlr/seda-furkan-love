/**
 * Coraline Gören Taş (Seeing Stone) Motoru
 * Yeşil üçgen delikli taş, gizli aşk mesajlarını aydınlatır
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

class SeeingStone {
  constructor() {
    this.isActive = false;
    this.cursorEl = null;
    this.toggleBtn = document.getElementById('seeing-stone-toggle');
    this.init();
  }

  init() {
    this.createCursorElement();
    this.bindEvents();
  }

  createCursorElement() {
    this.cursorEl = document.createElement('div');
    this.cursorEl.className = 'seeing-stone-cursor';
    this.cursorEl.innerHTML = `
      <svg class="seeing-stone-svg" viewBox="0 0 100 100">
        <!-- Yeşil Üçgen Coraline Gören Taşı -->
        <polygon points="50,8 92,85 8,85" fill="#1b4d2e" stroke="#39ff14" stroke-width="4" stroke-linejoin="round" />
        <polygon points="50,14 86,81 14,81" fill="#0f2b1a" stroke="#267344" stroke-width="2" stroke-linejoin="round" />
        <!-- Ortadaki Büyülü Delik -->
        <circle cx="50" cy="58" r="18" fill="#080711" stroke="#39ff14" stroke-width="3" />
        <circle cx="50" cy="58" r="13" fill="none" stroke="#00f3ff" stroke-width="1.5" stroke-dasharray="3 3" />
      </svg>
      <div class="seeing-stone-lens"></div>
    `;
    document.body.appendChild(this.cursorEl);
    this.createBannerElement();
  }

  createBannerElement() {
    const banner = document.createElement('div');
    banner.className = 'seeing-stone-banner';
    banner.innerHTML = `<span>🟢</span><span>Gören Taş Aktif: Fotoğrafların üzerindeki sırları keşfet!</span>`;
    document.body.appendChild(banner);
  }

  bindEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggleStone());
    }

    window.addEventListener('pointermove', (e) => {
      if (!this.isActive) return;
      this.updateCursor(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isActive || !e.touches[0]) return;
      this.updateCursor(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  }

  updateCursor(x, y) {
    if (!this.cursorEl) return;
    this.cursorEl.style.left = `${x}px`;
    this.cursorEl.style.top = `${y}px`;
  }

  toggleStone() {
    this.isActive = !this.isActive;
    document.body.classList.toggle('seeing-stone-active', this.isActive);
    if (this.toggleBtn) {
      this.toggleBtn.classList.toggle('active', this.isActive);
      const label = this.toggleBtn.querySelector('.btn-label');
      if (label) {
        label.textContent = this.isActive ? '🟢 Gören Taş Açık' : '🟢 Gören Taş';
      }
    }
    if (window.coralineAudio) {
      window.coralineAudio.playKeyUnlockSound();
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.seeingStone = new SeeingStone();
});
