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
  assert.strictEqual(memories.length, 39, `Beklenen 39 anı, bulunan: ${memories.length}`);

  const first = memories[0];
  assert.strictEqual(first.id, 1, 'İlk anı id 1 olmalı');
  assert.ok(first.filename, 'filename alanı bulunmalı');
  assert.ok(first.title, 'title alanı bulunmalı');
  assert.ok(first.date, 'date alanı bulunmalı');
  assert.ok(first.location, 'location alanı bulunmalı');
  assert.ok(first.caption, 'caption alanı bulunmalı');
  assert.ok(first.coraline_chapter, 'coraline_chapter alanı bulunmalı');
  console.log('  ✅ MemoryService tüm alanları eksiksiz yükledi.');
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
  assert.strictEqual(totalInChapters, 39, `Bölümlerdeki toplam görsel sayısı 39 olmalı`);
  console.log('  ✅ 4 Coraline bölümü ve 39 görsel başarıyla gruplandı:');
  chapters.forEach((c) => console.log(`     - ${c.name}: ${c.count} hatıra`));
}

function testStats() {
  console.log('🧪 [Test 4] İstatistik hesaplama testi...');
  const stats = memoryService.getStats();
  assert.strictEqual(stats.totalMemories, 39);
  assert.strictEqual(stats.totalChapters, 4);
  assert.ok(stats.firstMemoryDate);
  assert.ok(stats.latestMemoryDate);
  console.log(`  ✅ İstatistikler: ${stats.firstMemoryDate} -> ${stats.latestMemoryDate}`);
}

function runAllTests() {
  console.log('🚀 Coraline Aşk Sitesi - Test Paketi Başlatılıyor...\n');
  testMemoryService();
  testAssetExistence();
  testChapterGrouping();
  testStats();
  console.log('\n✨ BÜTÜN TESTLER BAŞARIYLA GEÇTİ (4/4)!');
}

runAllTests();
