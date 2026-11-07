/**
 * Coraline Gizli Kapı & Vortex Tüneli Kontrolcüsü
 * Pink Palace vintage kapısı, düğme anahtar ve Other World geçişi
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

    // Anahtar tıklaması veya dokunması
    this.keyElement.addEventListener('click', () => this.unlockDoor());
    this.keyElement.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.unlockDoor();
    });

    // Kapıya doğrudan tıklama desteği
    this.doorElement.addEventListener('click', () => this.unlockDoor());

    // Yeniden kapıya dönme butonu
    const returnBtn = document.getElementById('return-door-btn');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => this.returnToDoor());
    }
  }

  unlockDoor() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    // Ses efektlerini çal
    if (window.coralineAudio) {
      window.coralineAudio.playKeyUnlockSound();
      setTimeout(() => window.coralineAudio.playDoorCreakSound(), 250);
    }

    // Anahtar animasyonu: deliğe girip dönme
    this.keyElement.classList.add('key-inserting');
    if (this.keyHint) {
      this.keyHint.textContent = "Kapı aralanıyor... Diğer Dünyaya geçiliyor!";
    }

    setTimeout(() => {
      this.doorElement.classList.add('door-opening');
      this.vortexTunnel.classList.add('vortex-active');
    }, 450);

    // Vortex tünelinden evrene giriş
    setTimeout(() => {
      this.enterMainUniverse();
    }, 1800);
  }

  enterMainUniverse() {
    this.portalOverlay.classList.add('portal-hidden');
    this.mainUniverse.classList.remove('universe-hidden');
    this.mainUniverse.classList.add('universe-visible');

    // Müziği otomatik başlat
    if (window.coralineAudio && !window.coralineAudio.isPlaying) {
      window.coralineAudio.toggleMusic((playing) => {
        const musicBtn = document.getElementById('music-toggle-btn');
        if (musicBtn) {
          musicBtn.classList.toggle('playing', playing);
          musicBtn.setAttribute('aria-label', playing ? 'Müziği Durdur' : 'Müziği Çal');
        }
      });
    }

    // İplik ve dikiş efektini tetikle
    if (window.coralineGallery) {
      window.coralineGallery.drawThread();
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
