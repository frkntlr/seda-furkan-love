/**
 * Coraline Büyülü Müzik Kutusu & Ses Motoru (Web Audio API)
 * Sıfır harici dosya bağımlılığı - Saf Web Audio sentezleyici
 */

class CoralineAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentNoteIndex = 0;
    this.timerId = null;
    this.tempo = 140; // BPM
    this.lullabyNotes = [
      // Coraline "Dreaming" Lullaby Melodisi
      { note: 'E5', dur: 0.6 }, { note: 'G5', dur: 0.6 }, { note: 'B5', dur: 0.8 },
      { note: 'C6', dur: 0.6 }, { note: 'B5', dur: 0.6 }, { note: 'G5', dur: 0.6 },
      { note: 'A5', dur: 0.9 }, { note: 'F#5', dur: 0.6 }, { note: 'D5', dur: 0.6 },
      { note: 'E5', dur: 1.2 }, { note: 'B4', dur: 0.6 }, { note: 'E5', dur: 0.6 },
      { note: 'G5', dur: 0.6 }, { note: 'A5', dur: 0.6 }, { note: 'B5', dur: 0.8 },
      { note: 'D6', dur: 0.6 }, { note: 'C6', dur: 0.6 }, { note: 'B5', dur: 0.6 },
      { note: 'A5', dur: 0.8 }, { note: 'G5', dur: 0.6 }, { note: 'E5', dur: 1.4 }
    ];
    this.noteFrequencies = {
      'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25,
      'F#5': 739.99, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
      'C6': 1046.50, 'D6': 1174.66, 'E6': 1318.51
    };
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMusicBoxTone(freq, duration) {
    if (!this.ctx || !freq) return;
    const now = this.ctx.currentTime;
    
    // Ana osilatör: celesta tınısı
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // İkinci osilatör: parlak çan tınısı (oktav + hafif detune)
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    // Zarf: Hızlı vuruş ve uzun süzülen yankı (Music Box Enveloping)
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.28, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration * 1.6);
    osc2.stop(now + duration * 1.6);
  }

  stepSequence() {
    if (!this.isPlaying) return;
    const item = this.lullabyNotes[this.currentNoteIndex];
    const freq = this.noteFrequencies[item.note];
    this.playMusicBoxTone(freq, item.dur);

    this.currentNoteIndex = (this.currentNoteIndex + 1) % this.lullabyNotes.length;
    const stepTime = (item.dur * 1000) * 0.9;
    this.timerId = setTimeout(() => this.stepSequence(), stepTime);
  }

  toggleMusic(onStateChange) {
    this.initContext();
    this.isPlaying = !this.isPlaying;

    if (this.isPlaying) {
      this.stepSequence();
    } else {
      clearTimeout(this.timerId);
    }

    if (typeof onStateChange === 'function') {
      onStateChange(this.isPlaying);
    }
    return this.isPlaying;
  }

  playKeyUnlockSound() {
    this.initContext();
    const now = this.ctx.currentTime;
    
    // Metalik anahtar tıkırtısı ve altın tını
    [880, 1320, 1760].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.22, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  }

  playDoorCreakSound() {
    this.initContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.3);
    osc.frequency.linearRampToValueAtTime(130, now + 0.7);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.85);
  }
}

// Global tekil nesne
window.coralineAudio = new CoralineAudioEngine();
