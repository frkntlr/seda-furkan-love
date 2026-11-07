/**
 * API ve Veri Bütünlüğü Testi
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const memoryService = require('../src/memory-service');

function testMemoryService() {
  console.log('🧪 [Test 1] MemoryService veri yükleme testi...');
  const memories = memoryService.getMemories();
  assert.strictEqual(memories.length, 40, `Beklenen 40 anı, bulunan: ${memories.length}`);

  const first = memories[0];
  assert.strictEqual(first.id, 1, 'İlk anı id 1 olmalı');
  assert.ok(first.filename, 'filename alanı bulunmalı');
  assert.ok(first.title, 'title alanı bulunmalı');
  assert.strictEqual(first.date, '25 Ocak 2025', 'İlk anı 25 Ocak 2025 tarihli olmalı');
  assert.ok(first.location, 'location alanı bulunmalı');
  assert.ok(first.caption, 'caption alanı bulunmalı');
  assert.ok(first.coraline_chapter, 'coraline_chapter alanı bulunmalı');
  console.log('  ✅ MemoryService tüm 40 anıyı ve 25 Ocak ilk anıyı eksiksiz yükledi.');
}

function testAssetExistence() {
  console.log('🧪 [Test 2] Görsel dosyalarının varlık testi...');
  const memories = memoryService.getMemories();
  const publicDir = path.join(__dirname, '..', 'public');

  memories.forEach((m) => {
    const fullPath = path.join(publicDir, m.filename);
    assert.ok(fs.existsSync(fullPath), `Görsel dosyası bulunamadı: ${m.filename}`);
  });
  console.log(`  ✅ Tüm ${memories.length} görsel dosyası public dizininde mevcut.`);
}

function testChapterGrouping() {
  console.log('🧪 [Test 3] Coraline bölümleri gruplama testi...');
  const chapters = memoryService.getChapters();
  assert.strictEqual(chapters.length, 4, `4 bölüm bekleniyordu, bulunan: ${chapters.length}`);

  const totalInChapters = chapters.reduce((acc, c) => acc + c.count, 0);
  assert.strictEqual(totalInChapters, 40, `Bölümlerdeki toplam görsel sayısı 40 olmalı`);
  console.log('  ✅ 4 Coraline bölümü ve 40 görsel başarıyla gruplandı:');
  chapters.forEach((c) => console.log(`     - ${c.name}: ${c.count} hatıra`));
}

function testStats() {
  console.log('🧪 [Test 4] İstatistik & 20 Ocak Yıldönümü testi...');
  const stats = memoryService.getStats();
  assert.strictEqual(stats.totalMemories, 40);
  assert.strictEqual(stats.totalChapters, 4);
  assert.strictEqual(stats.anniversaryDate, '20 Ocak 2025', 'Yıldönümü 20 Ocak 2025 olmalı');
  assert.strictEqual(stats.firstMemoryDate, '25 Ocak 2025', 'İlk anı tarihi 25 Ocak 2025 olmalı');
  assert.ok(stats.latestMemoryDate);
  console.log(`  ✅ İstatistikler: Yıldönümü ${stats.anniversaryDate} | İlk Anı: ${stats.firstMemoryDate} -> ${stats.latestMemoryDate}`);
}

function testWebPAndCoordinates() {
  console.log('🧪 [Test 5] WebP optimizasyonu, Göz koordinatları ve Harita testi...');
  const memories = memoryService.getMemories();
  const publicDir = path.join(__dirname, '..', 'public');

  memories.forEach((m) => {
    // 1. WebP dosya varlığı
    assert.ok(m.thumb, `thumb alanı eksik: id=${m.id}`);
    assert.ok(m.optimized, `optimized alanı eksik: id=${m.id}`);
    const thumbPath = path.join(publicDir, m.thumb);
    const optPath = path.join(publicDir, m.optimized);
    assert.ok(fs.existsSync(thumbPath), `Thumbnail bulunamadı: ${m.thumb}`);
    assert.ok(fs.existsSync(optPath), `Optimize görsel bulunamadı: ${m.optimized}`);

    // 2. Göz koordinatları doğrulama
    assert.ok(Array.isArray(m.eyes), `eyes dizi olmalı: id=${m.id}`);
    assert.strictEqual(m.eyes.length, 2, `2 göz koordinatı olmalı: id=${m.id}`);
    m.eyes.forEach((eye, i) => {
      assert.strictEqual(typeof eye.x, 'number', `eyes[${i}].x sayı olmalı`);
      assert.strictEqual(typeof eye.y, 'number', `eyes[${i}].y sayı olmalı`);
      assert.ok(eye.x >= 0 && eye.x <= 100, `eyes[${i}].x %0-100 aralığında olmalı: ${eye.x}`);
      assert.ok(eye.y >= 0 && eye.y <= 100, `eyes[${i}].y %0-100 aralığında olmalı: ${eye.y}`);
    });

    // 3. Harita GPS ve lokasyon doğrulama
    assert.strictEqual(typeof m.lat, 'number', `lat sayı olmalı: id=${m.id}`);
    assert.strictEqual(typeof m.lng, 'number', `lng sayı olmalı: id=${m.id}`);
    assert.ok(m.location_name && m.location_name.length > 2, `location_name geçerli olmalı: id=${m.id}`);
    assert.ok(m.lat >= 40.0 && m.lat <= 42.0, `İstanbul enlem aralığında olmalı: ${m.lat}`);
    assert.ok(m.lng >= 28.0 && m.lng <= 30.0, `İstanbul boylam aralığında olmalı: ${m.lng}`);
  });
  console.log(`  ✅ Tüm ${memories.length} anının WebP görselleri, Göz koordinatları ve GPS harita verisi eksiksiz!`);
}

function runAllTests() {
  console.log('🚀 Coraline Aşk Sitesi - Test Paketi Başlatılıyor...\n');
  testMemoryService();
  testAssetExistence();
  testChapterGrouping();
  testStats();
  testWebPAndCoordinates();
  console.log('\n✨ BÜTÜN TESTLER BAŞARIYLA GEÇTİ (5/5)!');
}

runAllTests();
