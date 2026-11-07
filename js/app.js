/**
 * Seda & Furkan Coraline Evreni - Ana Uygulama & Sayaç Motoru
 */

const START_DATE = new Date('2025-01-20T00:00:00');

class CoralineApp {
  constructor() {
    this.startDate = START_DATE;
    this.quoteElement = document.getElementById('coraline-quote');
    this.buttonEyeMode = false;
    this.quotes = [
      "Seninle geçirdiğimiz her an, sonsuzluğa atılan sımsıkı bir düğüm...",
      "En karanlık tüneller bile senin gülüşünle aydınlanıyor Seda'm.",
      "Dünyadaki tüm kapılar kapansa da, kalbimin kapısı hep sana açık.",
      "İki ruh, tek bir masal: Bizim Other World'ümüz sadece aşkla dolu.",
      "Gözlerinin içine her baktığımda, kaybolmaktan korkmadığım tek evrendeyim."
    ];
    this.quoteIndex = 0;

    this.init();
  }

  init() {
    this.startLoveCounter();
    this.bindMusicToggle();
    this.bindButtonEyesMode();
    this.startQuoteCycle();
    this.bindSmoothScroll();
  }

  startLoveCounter() {
    const update = () => {
      const now = new Date();
      const diff = now - this.startDate;
      if (diff < 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const dEl = document.getElementById('count-days');
      const hEl = document.getElementById('count-hours');
      const mEl = document.getElementById('count-minutes');
      const sEl = document.getElementById('count-seconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    };

    update();
    setInterval(update, 1000);
  }

  bindMusicToggle() {
    const musicBtn = document.getElementById('music-toggle-btn');
    if (!musicBtn) return;

    musicBtn.addEventListener('click', () => {
      if (window.coralineAudio) {
        window.coralineAudio.toggleMusic((playing) => {
          musicBtn.classList.toggle('playing', playing);
          musicBtn.setAttribute('aria-label', playing ? 'Müziği Durdur' : 'Müziği Çal');
          const statusText = musicBtn.querySelector('.music-status-text');
          if (statusText) {
            statusText.textContent = playing ? 'Coraline Ninni Çalıyor' : 'Müziği Çal';
          }
        });
      }
    });
  }

  bindButtonEyesMode() {
    const eyeBtn = document.getElementById('button-eyes-toggle');
    if (!eyeBtn) return;

    eyeBtn.addEventListener('click', () => {
      this.buttonEyeMode = !this.buttonEyeMode;
      document.body.classList.toggle('button-eyes-active', this.buttonEyeMode);
      eyeBtn.classList.toggle('active', this.buttonEyeMode);

      if (window.coralineAudio) {
        window.coralineAudio.playKeyUnlockSound();
      }

      const text = eyeBtn.querySelector('.btn-label');
      if (text) {
        text.textContent = this.buttonEyeMode ? '👁️ Düğme Gözler Aktif!' : '👁️ Düğme Göz Modu';
      }
    });
  }

  startQuoteCycle() {
    if (!this.quoteElement) return;

    setInterval(() => {
      this.quoteElement.classList.add('quote-fade-out');
      setTimeout(() => {
        this.quoteIndex = (this.quoteIndex + 1) % this.quotes.length;
        this.quoteElement.textContent = `"${this.quotes[this.quoteIndex]}"`;
        this.quoteElement.classList.remove('quote-fade-out');
      }, 500);
    }, 6000);
  }

  bindSmoothScroll() {
    const exploreBtn = document.getElementById('explore-memories-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const gallerySection = document.getElementById('memories-section');
        if (gallerySection) {
          gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.coralineApp = new CoralineApp();
});
