/**
 * Seda & Furkan - Coraline Temalı Web Sunucusu
 * Port: 3000
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const memoryService = require('./src/memory-service');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const MANIFESTO_PATH = path.join(__dirname, 'docs', 'SEDA_VE_FURKAN_ASK_MANIFESTOSU.md');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// API: Sağlık Kontrolü
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Seda & Furkan Coraline Aşk Sitesi',
    port: PORT,
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// API: Tüm Hatıralar
app.get('/api/memories', (req, res) => {
  try {
    const list = memoryService.getMemories();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Hatıralar okunamadı', detail: err.message });
  }
});

// API: Tekil Hatıra
app.get('/api/memories/:id', (req, res) => {
  const item = memoryService.getById(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Hatıra bulunamadı', id: req.params.id });
  }
  return res.json(item);
});

// API: Coraline Bölümlerine Göre Gruplanmış
app.get('/api/chapters', (req, res) => {
  try {
    const chapters = memoryService.getChapters();
    res.json(chapters);
  } catch (err) {
    res.status(500).json({ error: 'Bölümler okunamadı', detail: err.message });
  }
});

// API: İstatistikler
app.get('/api/stats', (req, res) => {
  try {
    const stats = memoryService.getStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'İstatistikler okunamadı', detail: err.message });
  }
});

// API: Aşk Manifestosu
app.get('/api/manifesto', (req, res) => {
  try {
    if (fs.existsSync(MANIFESTO_PATH)) {
      const text = fs.readFileSync(MANIFESTO_PATH, 'utf8');
      res.type('text/markdown; charset=utf-8').send(text);
    } else {
      res.status(404).json({ error: 'Manifesto bulunamadı' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Manifesto okunamadı', detail: err.message });
  }
});

// SPA Fallback
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.status(200).send(`
    <!DOCTYPE html>
    <html lang="tr">
    <head><meta charset="UTF-8"><title>Seda & Furkan - Coraline</title></head>
    <body style="background:#090a10;color:#c084fc;font-family:sans-serif;text-align:center;padding:50px;">
      <h1>🗝️ Seda & Furkan Coraline Aşk Sitesi</h1>
      <p>API Motoru Aktif: Port 3000</p>
      <p><a style="color:#f472b6;" href="/api/health">Sağlık Kontrolü</a> | <a style="color:#f472b6;" href="/api/memories">Hatıralar (JSON)</a> | <a style="color:#f472b6;" href="/api/chapters">Bölümler</a></p>
    </body>
    </html>
  `);
});

// Global Hata Yakalayıcı
app.use((err, req, res, next) => {
  console.error('[Sunucu Hatası]:', err);
  res.status(500).json({ error: 'İç Sunucu Hatası', message: err.message });
});

// Sunucuyu Başlat
const server = app.listen(PORT, () => {
  console.log(`🗝️ [Aegis Server] Coraline Aşk Sitesi http://localhost:${PORT} adresinde yayında!`);
});

// Graceful Shutdown
function handleShutdown(signal) {
  console.log(`\n🛑 [Aegis Server] ${signal} sinyali alındı, kapatılıyor...`);
  server.close(() => {
    console.log('✅ [Aegis Server] Sunucu güvenle kapatıldı.');
    process.exit(0);
  });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

module.exports = { app, server };
