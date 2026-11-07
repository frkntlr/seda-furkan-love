/**
 * Seda & Furkan - Memory Service
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'public', 'data', 'memories.json');

class MemoryService {
  constructor(dataPath = DATA_PATH) {
    this.dataPath = dataPath;
    this.cache = null;
    this.lastMtime = 0;
  }

  getMemories() {
    try {
      const stats = fs.statSync(this.dataPath);
      if (!this.cache || stats.mtimeMs > this.lastMtime) {
        const raw = fs.readFileSync(this.dataPath, 'utf8');
        this.cache = JSON.parse(raw);
        this.lastMtime = stats.mtimeMs;
      }
      return this.cache;
    } catch (err) {
      console.error('[MemoryService] Veri okuma hatası:', err.message);
      return this.cache || [];
    }
  }

  getById(id) {
    const memories = this.getMemories();
    const numId = parseInt(id, 10);
    return memories.find((m) => m.id === numId) || null;
  }

  getChapters() {
    const memories = this.getMemories();
    const map = new Map();
    memories.forEach((m) => {
      const chapter = m.coraline_chapter || 'Diğer Hatıralar';
      if (!map.has(chapter)) {
        map.set(chapter, []);
      }
      map.get(chapter).push(m);
    });

    const result = [];
    for (const [name, items] of map.entries()) {
      result.push({
        name,
        count: items.length,
        items
      });
    }
    return result;
  }

  getStats() {
    const memories = this.getMemories();
    const chapters = this.getChapters();
    const startDate = memories.length > 0 ? memories[0].date : null;
    const endDate = memories.length > 0 ? memories[memories.length - 1].date : null;

    return {
      totalMemories: memories.length,
      totalChapters: chapters.length,
      firstMemoryDate: startDate,
      latestMemoryDate: endDate,
      device: memories.length > 0 ? memories[0].device : 'Nothing Phone (1)',
      serverTime: new Date().toISOString()
    };
  }
}

module.exports = new MemoryService();
