/**
 * Coraline Other World - Yıldız, Ateşböceği & Sihirli Kıvılcım Motoru
 * Fare/dokunuşu takip eden ateşböcekleri ve çift renkli parçacıklar
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

class CoralineSky {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.fireflies = [];
    this.sparks = [];
    this.pointer = { x: -100, y: -100, active: false };
    this.width = 0;
    this.height = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createStars(85);
    this.createFireflies(30);
    this.bindPointer();
    this.loop();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.45 ? '#00f3ff' : '#ff3388'
      });
    }
  }

  createFireflies(count) {
    this.fireflies = [];
    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        glow: Math.random() * Math.PI,
        color: Math.random() > 0.4 ? '#39ff14' : '#00f3ff'
      });
    }
  }

  bindPointer() {
    const trigger = (x, y) => {
      this.pointer.x = x;
      this.pointer.y = y;
      this.pointer.active = true;
      this.addSparks(x, y, 5);
    };

    window.addEventListener('pointermove', (e) => trigger(e.clientX, e.clientY));
    window.addEventListener('pointerdown', (e) => trigger(e.clientX, e.clientY));
    window.addEventListener('pointerleave', () => { this.pointer.active = false; });
  }

  addSparks(x, y, count) {
    const colors = ['#00f3ff', '#ff3388', '#ffd700', '#39ff14'];
    for (let i = 0; i < count; i++) {
      this.sparks.push({
        x, y,
        vx: (Math.random() - 0.5) * 3.5,
        vy: (Math.random() - 0.5) * 3.5 - 0.5,
        alpha: 1,
        size: Math.random() * 3 + 1.2,
        decay: Math.random() * 0.035 + 0.015,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  renderStars() {
    for (const s of this.stars) {
      s.alpha += s.speed;
      const currentAlpha = Math.abs(Math.sin(s.alpha));
      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = currentAlpha * 0.85;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  renderFireflies() {
    for (const f of this.fireflies) {
      // Fareye/dokunmaya nazik yönelim
      if (this.pointer.active) {
        const dx = this.pointer.x - f.x;
        const dy = this.pointer.y - f.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 30 && dist < 320) {
          f.vx += (dx / dist) * 0.04;
          f.vy += (dy / dist) * 0.04;
        }
      }

      f.vx *= 0.98;
      f.vy *= 0.98;
      f.x += f.vx;
      f.y += f.vy;
      f.glow += 0.04;

      if (f.x < 0) f.x = this.width;
      if (f.x > this.width) f.x = 0;
      if (f.y < 0) f.y = this.height;
      if (f.y > this.height) f.y = 0;

      const alpha = 0.35 + Math.sin(f.glow) * 0.45;
      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0.1, alpha);
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = f.color;
      this.ctx.fillStyle = f.color;
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  renderSparks() {
    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const p = this.sparks[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.sparks.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.renderStars();
    this.renderFireflies();
    this.renderSparks();
    requestAnimationFrame(() => this.loop());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.coralineSky = new CoralineSky('stars-canvas');
});
