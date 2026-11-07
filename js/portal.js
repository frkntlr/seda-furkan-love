/**
 * Coraline Gizli Kapı, 360 Anahtar & Vortex Tüneli Kontrolcüsü
 * Pink Palace vintage kapısı, düğme anahtar ve Other World geçişi
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

class CoralinePortal {
  constructor() {
    this.portalOverlay = document.getElementById('portal-overlay');
    this.keyElement = document.getElementById('button-key');
    this.doorElement = document.getElementById('vintage-door');
    this.vortexTunnel = document.getElementById('vortex-tunnel');
    this.mainUniverse = document.getElementById('main-universe');
    this.keyHint = document.getElementById('key-hint');
    this.isUnlocked = false;

    this.bindEvents();
  }

  bindEvents() {
    if (!this.keyElement || !this.doorElement) return;

    this.keyElement.addEventListener('click', () => this.unlockDoor());
    this.keyElement.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.unlockDoor();
    });

    this.doorElement.addEventListener('click', () => this.unlockDoor());

    const returnBtn = document.getElementById('return-door-btn');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => this.returnToDoor());
    }
  }

  unlockDoor() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    if (window.coralineAudio) {
      window.coralineAudio.playKeyUnlockSound();
      setTimeout(() => window.coralineAudio.playDoorCreakSound(), 350);
    }

    // 360 derece dönerek deliğe girme animasyonu
    this.keyElement.classList.add('key-inserting');
    if (this.keyHint) {
      this.keyHint.textContent = "Kapı aralanıyor... Diğer Dünyaya geçiliyor!";
    }

    setTimeout(() => {
      this.doorElement.classList.add('door-opening');
      this.vortexTunnel.classList.add('vortex-active');
    }, 600);

    setTimeout(() => {
      this.enterMainUniverse();
    }, 2200);
  }

  enterMainUniverse() {
    this.portalOverlay.classList.add('portal-hidden');
    this.mainUniverse.classList.remove('universe-hidden');
    this.mainUniverse.classList.add('universe-visible');

    if (window.coralineAudio && !window.coralineAudio.isPlaying) {
      window.coralineAudio.toggleMusic((playing) => {
        const musicBtn = document.getElementById('music-toggle-btn');
        if (musicBtn) {
          musicBtn.classList.toggle('playing', playing);
          musicBtn.setAttribute('aria-label', playing ? 'Müziği Durdur' : 'Müziği Çal');
        }
      });
    }

    // Harita Leaflet boyutunu tazele
    if (window.coralineMap && window.coralineMap.map) {
      setTimeout(() => window.coralineMap.map.invalidateSize(), 300);
    }
  }

  returnToDoor() {
    this.isUnlocked = false;
    this.mainUniverse.classList.remove('universe-visible');
    this.mainUniverse.classList.add('universe-hidden');

    this.portalOverlay.classList.remove('portal-hidden');
    this.doorElement.classList.remove('door-opening');
    this.vortexTunnel.classList.remove('vortex-active');
    this.keyElement.classList.remove('key-inserting');

    if (this.keyHint) {
      this.keyHint.textContent = "Düğme Anahtara Dokun ve Kapıyı Aç";
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.coralinePortal = new CoralinePortal();
});
