# -*- coding: utf-8 -*-
"""
Memories Veri Güncelleyici
OpenCV göz koordinatları, GPS harita verisi ve WebP görsel yollarını işler.
Demir Kafes Kuralı: <300 satır, fonksiyonlar <40 satır
"""

import os
import json
from detect_eyes import calculate_eye_positions

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(BASE_DIR, "public", "data", "memories.json")
IMG_DIR = os.path.join(BASE_DIR, "public", "images")

ROMANTIC_LOCATIONS = {
    1: {"name": "Kadıköy Rıhtım & Çarşı", "lat": 40.9904, "lng": 29.0253},
    2: {"name": "Moda Sahili", "lat": 40.9822, "lng": 29.0275},
    3: {"name": "Fenerbahçe Parkı", "lat": 40.9697, "lng": 29.0371},
    4: {"name": "Kalamış Marina", "lat": 40.9765, "lng": 29.0402},
    5: {"name": "Moda Çay Bahçesi & Burnu", "lat": 40.9806, "lng": 29.0248},
    6: {"name": "Bostancı İskelesi & Sahil", "lat": 40.9525, "lng": 29.0945},
    7: {"name": "Bağdat Caddesi", "lat": 40.9634, "lng": 29.0689},
    8: {"name": "Emirgan Korusu Lale Bahçeleri", "lat": 41.1086, "lng": 29.0558},
    9: {"name": "Emirgan Sahili", "lat": 41.1042, "lng": 29.0572},
    10: {"name": "Bebek Parkı & Koyu", "lat": 41.0772, "lng": 29.0436},
    11: {"name": "Arnavutköy Boğaz Kıyısı", "lat": 41.0673, "lng": 29.0439},
    12: {"name": "Karaköy Rıhtımı", "lat": 41.0232, "lng": 28.9778},
    13: {"name": "Beşiktaş Abbasağa Parkı", "lat": 41.0478, "lng": 29.0042},
    14: {"name": "Ortaköy Meydanı & Boğaz", "lat": 41.0472, "lng": 29.0270},
    15: {"name": "Galata Kulesi Meydanı", "lat": 41.0256, "lng": 28.9741},
    16: {"name": "Caddebostan Dalyan Parkı", "lat": 40.9658, "lng": 29.0573},
    17: {"name": "Caddebostan Sahil Şeridi", "lat": 40.9622, "lng": 29.0638},
    18: {"name": "Heybeliada Çamlimanı", "lat": 40.8719, "lng": 29.0934},
    19: {"name": "Büyükada Dilburnu", "lat": 40.8625, "lng": 29.1172},
    20: {"name": "Marmara Denizi Vapur Yolu", "lat": 40.9250, "lng": 29.0550},
    21: {"name": "Kınalıada Açıkları Vapur", "lat": 40.9067, "lng": 29.0528},
    22: {"name": "Kuzguncuk İcadiye Caddesi", "lat": 41.0347, "lng": 29.0298},
    23: {"name": "Tarihi Kuzguncuk Bostanı", "lat": 41.0335, "lng": 29.0315},
    24: {"name": "Üsküdar Salacak & Kız Kulesi", "lat": 41.0211, "lng": 29.0061},
    25: {"name": "Cihangir Merdivenleri", "lat": 41.0314, "lng": 28.9863},
    26: {"name": "Tarihi Galata Köprüsü", "lat": 41.0202, "lng": 28.9733},
    27: {"name": "Karaköy Fransız Geçidi", "lat": 41.0245, "lng": 28.9790},
    28: {"name": "Galata Bereketzade Sokağı", "lat": 41.0263, "lng": 28.9732},
    29: {"name": "Galata Kulesi Seyir Terası", "lat": 41.0258, "lng": 28.9744},
    30: {"name": "Beyoğlu Çiçek Pasajı", "lat": 41.0342, "lng": 28.9765},
    31: {"name": "Taksim Gezi Parkı", "lat": 41.0384, "lng": 28.9875},
    32: {"name": "İstiklal Caddesi Nostalji", "lat": 41.0337, "lng": 28.9779},
    33: {"name": "Beyoğlu Asmalımescit", "lat": 41.0298, "lng": 28.9748},
    34: {"name": "Haliç Balat Sahili", "lat": 41.0318, "lng": 28.9489},
    35: {"name": "Kandilli İskelesi & Sahili", "lat": 41.0744, "lng": 29.0583},
    36: {"name": "Ortaköy Boğaziçi Köprüsü Manzarası", "lat": 41.0489, "lng": 29.0345},
    37: {"name": "Yıldız Parkı Çadır Köşkü", "lat": 41.0494, "lng": 29.0152},
    38: {"name": "Büyük Çamlıca Tepesi", "lat": 41.0269, "lng": 29.0681},
    39: {"name": "Gülhane Parkı Tarihi Bahçe", "lat": 41.0131, "lng": 28.9814}
}


def load_memories():
    """Mevcut memories.json dosyasını okur."""
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def enrich_memory_item(item):
    """Tek bir anıyı göz koordinatları, harita ve optimize WebP ile zenginleştirir."""
    mid = item["id"]
    mem_name = f"memory-{mid:02d}.jpg"
    webp_name = f"memory-{mid:02d}.webp"
    full_img_path = os.path.join(IMG_DIR, mem_name)

    # 1. Göz koordinatları tespiti
    eyes = calculate_eye_positions(full_img_path)
    item["eyes"] = eyes

    # 2. Harita koordinatları ve lokasyon adı
    loc_info = ROMANTIC_LOCATIONS.get(mid, {
        "name": item.get("location", "İstanbul"),
        "lat": 41.0082,
        "lng": 28.9784
    })
    item["lat"] = loc_info["lat"]
    item["lng"] = loc_info["lng"]
    item["location_name"] = loc_info["name"]

    # 3. Optimize WebP ve Thumb yolları
    item["thumb"] = f"images/thumbs/{webp_name}"
    item["optimized"] = f"images/optimized/{webp_name}"
    item["image"] = f"images/optimized/{webp_name}"
    item["original"] = f"images/{mem_name}"
    return item


def save_memories(memories):
    """Güncellenmiş anıları UTF-8 JSON olarak kaydeder."""
    with open(JSON_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(memories, f, ensure_ascii=False, indent=2)
    print(f"Başarıyla güncellendi: {JSON_PATH}")


def run_pipeline():
    """Tüm anıları tarar ve JSON veritabanını günceller."""
    memories = load_memories()
    print(f"Toplam {len(memories)} anı zenginleştiriliyor...")

    for idx, item in enumerate(memories, 1):
        enrich_memory_item(item)
        eyes_str = f"L:({item['eyes'][0]['x']}, {item['eyes'][0]['y']}) R:({item['eyes'][1]['x']}, {item['eyes'][1]['y']})"
        print(
            f"[{idx:02d}] {item['title']} -> {item['location_name']} "
            f"[{item['lat']}, {item['lng']}] | Gözler: {eyes_str}"
        )

    save_memories(memories)


if __name__ == "__main__":
    run_pipeline()
