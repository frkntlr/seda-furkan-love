/**
 * HTTP API Entegrasyon Testi
 * Demir Kafes: <300 satır, fonksiyonlar <40 satır
 */

const http = require('http');
const assert = require('assert');
const { server } = require('../server');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function testHttpEndpoints() {
  console.log('🌐 [HTTP Test] Endpointler test ediliyor...');

  const health = await makeRequest('/api/health');
  assert.strictEqual(health.status, 200);
  assert.strictEqual(health.data.status, 'online');
  console.log('  ✅ /api/health OK (Status: online)');

  const memories = await makeRequest('/api/memories');
  assert.strictEqual(memories.status, 200);
  assert.strictEqual(memories.data.length, 39);
  console.log('  ✅ /api/memories OK (Count: 39)');

  const chapters = await makeRequest('/api/chapters');
  assert.strictEqual(chapters.status, 200);
  assert.strictEqual(chapters.data.length, 4);
  console.log('  ✅ /api/chapters OK (Chapters: 4)');

  const stats = await makeRequest('/api/stats');
  assert.strictEqual(stats.status, 200);
  assert.strictEqual(stats.data.totalMemories, 39);
  console.log('  ✅ /api/stats OK (Memories: 39)');

  const memoryOne = await makeRequest('/api/memories/1');
  assert.strictEqual(memoryOne.status, 200);
  assert.strictEqual(memoryOne.data.id, 1);
  console.log('  ✅ /api/memories/1 OK');
}

async function main() {
  try {
    await testHttpEndpoints();
    console.log('\n🎉 TÜM HTTP ENDPOINT TESTLERİ BAŞARIYLA TAMAMLANDI!');
  } catch (err) {
    console.error('❌ HTTP Test Hatası:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

// Sunucunun dinlemeye geçmesini bekle
setTimeout(main, 300);
