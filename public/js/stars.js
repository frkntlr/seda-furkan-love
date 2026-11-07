/**
 * Coraline Other World - Yıldız & Ateşböceği Canvas Motoru
 * Gece mavisi gökyüzü, süzülen ateşböcekleri ve sihirli parçacıklar
 */

class CoralineSky {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.fireflies = [];
    this.sparks = [];
    this.width = 0;
    this.height = 0;
    this.animId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.createStars(90);
    this.createFireflies(25);
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
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005,
        color: Math.random() > 0.4 ? '#00f3ff' : '#e02875'
      });
    }
  }

  createFireflies(count) {
    this.fireflies = [];
    for (let i = 0; i < count; i++) {
      this.fireflies.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2.5 + 1.2,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        glow: Math.random() * Math.PI,
        color: Math.random() > 0.3 ? '#62ffc4' : '#ffd700'
      });
    }
  }

  bindPointer() {
    const trigger = (x, y) => this.addSparks(x, y, 6);
    window.addEventListener('pointermove', (e) => {
      if (Math.random() > 0.6) trigger(e.clientX, e.clientY);
    });
    window.addEventListener('pointerdown', (e) => trigger(e.clientX, e.clientY));
  }

  addSparks(x, y, count) {
    for (let i = 0; i < count; i++) {
      this.sparks.push({
        x, y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        alpha: 1,
        size: Math.random() * 3 + 1.5,
        decay: Math.random() * 0.03 + 0.015
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
      f.x += f.vx;
      f.y += f.vy;
      f.glow += 0.04;

      if (f.x < 0) f.x = this.width;
      if (f.x > this.width) f.x = 0;
      if (f.y < 0) f.y = this.height;
      if (f.y > this.height) f.y = 0;

      const alpha = 0.4 + Math.sin(f.glow) * 0.4;
      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.shadowBlur = 12;
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
      this.ctx.fillStyle = '#ffd700';
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
    this.animId = requestAnimationFrame(() => this.loop());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.coralineSky = new CoralineSky('stars-canvas');
});
