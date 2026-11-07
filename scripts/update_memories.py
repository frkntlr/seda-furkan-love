# -*- coding: utf-8 -*-
"""
Memories Veri Güncelleyici
Demir Kafes Kuralı: <300 satır, fonksiyonlar <40 satır
"""

import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(BASE_DIR, "public", "data", "memories.json")

# Merkezi romantik hat: Kadıköy / Moda / Boğaz Vapuru / Ortaköy / Kuzguncuk
ROMANTIC_LOCATIONS = {
    0: ("Kadıköy", "Birlikte İlk Adımlar", 40.9904, 29.0253),
    1: ("Kadıköy", "Bizim Gizli Köşemiz", 40.9882, 29.0245),
    2: ("Moda Sahili", "Sahil Yürüyüşü & Günbatımı", 40.9822, 29.0275),
    3: ("Moda Sahili", "Sıcak Bir Kahve & Gülüşün", 40.9835, 29.0268),
    4: ("Kadıköy", "El Ele Büyülü Adımlar", 40.9868, 29.0282),
    5: ("Moda Sahili", "Deniz Kıyısında Bir Masal", 40.9806, 29.0248),
    6: ("Moda Sahili", "Kızıl Gökyüzü & Huzur", 40.9792, 29.0235),
    7: ("Kadıköy", "Yıldızların Altında", 40.9875, 29.0298),
    8: ("Ortaköy Sahili", "İlk Çiçekler & Tebessümün", 41.0472, 29.0270),
    9: ("Ortaköy Sahili", "Boğaz Kıyısında Masum Bir Bakış", 41.0485, 29.0282),
    10: ("Moda Parkı", "Ağaçlar Altında Kahkahalarımız", 40.9842, 29.0290),
    11: ("Boğaz Kıyısı", "Mavi Dalgalar ve Sessizliğimiz", 41.0458, 29.0262),
    12: ("Boğaz Hattı", "Gece Işıklarının Dansı", 41.0435, 29.0248),
    13: ("Ortaköy", "Tatlı Bir Mola & Sıcak Sohbet", 41.0465, 29.0276),
    14: ("Ortaköy Sahili", "Göz Göze Sessiz Bir An", 41.0478, 29.0285),
    15: ("Boğaz Kıyısı", "Bizim Masamız & Mum Işığı", 41.0492, 29.0298),
    16: ("Moda Sahili", "Baharla Gelen Melodimiz", 40.9815, 29.0262),
    17: ("Moda Sahili", "Rüzgarda Uçuşan Saçların", 40.9802, 29.0251),
    18: ("Boğaz Vapuru", "Güneşin Sıcaklığı & Gülüşün", 41.0185, 29.0142),
    19: ("Boğaz Vapuru", "Deniz Kokusu & Mutluluğumuz", 41.0152, 29.0168),
    20: ("Boğaz Vapuru", "Vapurda İki Çay, Bir Masal", 41.0125, 29.0185),
    21: ("Boğaz Vapuru", "Vapurda Martılar ve Aşkımız", 41.0105, 29.0210),
    22: ("Kuzguncuk", "Kuzguncuk Sokaklarında Sevdamız", 41.0347, 29.0298),
    23: ("Kuzguncuk", "Tarihi Çınar Altı & Huzur", 41.0335, 29.0312),
    24: ("Üsküdar Sahili", "Kız Kulesi Karşısında Fısıltılar", 41.0211, 29.0061),
    25: ("Ortaköy", "En Uzun Günün En Güzel Hatırası", 41.0482, 29.0268),
    26: ("Ortaköy Sahili", "Boğaz Köprüsü Altında Parıltın", 41.0495, 29.0278),
    27: ("Kadıköy", "Adım Adım Mutluluğa Doğru", 40.9892, 29.0265),
    28: ("Kadıköy", "Işıltılı Bakışların Aynası", 40.9880, 29.0272),
    29: ("Moda Sahili", "İçimizi Isıtan O Gülüşün", 40.9828, 29.0260),
    30: ("Moda Sahili", "Kalplerimizin Düğümlendiği Yer", 40.9818, 29.0255),
    31: ("Moda Parkı", "Bizim Şarkımızın Çaldığı Köşe", 40.9848, 29.0285),
    32: ("Kadıköy", "Birlikte Kaybolduğumuz Sokaklar", 40.9870, 29.0278),
    33: ("Kadıköy", "Aşkla Çarpan Kalplerimiz", 40.9862, 29.0268),
    34: ("Moda Sahili", "Altın Sarısı Akşamüstü", 40.9798, 29.0242),
    35: ("Boğaz Kıyısı", "Dünyanın En Huzurlu Limanı", 41.0505, 29.0305),
    36: ("Ortaköy Sahili", "Büyülü Bir Boğaz Akşamı", 41.0489, 29.0320),
    37: ("Ortaköy Sahili", "Sonsuzluğa Bakan Köşemiz", 41.0475, 29.0275),
    38: ("Moda Sahili", "Yıldızlara Fısıldanan Sözler", 40.9810, 29.0249),
    39: ("Kadıköy Rıhtım", "Sonsuz Masalımızın Mührü", 40.9912, 29.0248),
}


def build_first_photo_item():
    """25 Ocak 2025 tarihli Seda ve Furkan'ın ilk fotoğraf kaydı."""
    return {
        "id": "memory-00",
        "filename": "images/memory-00.webp",
        "image": "images/optimized/memory-00.webp",
        "originalFilename": "first_photo.jpg",
        "date": "25 Ocak 2025",
        "rawDate": "2025:01:25 14:57:18",
        "location": "Kadıköy",
        "title": "İlk Bakış: Her Şeyin Başladığı An",
        "caption": (
            "Sevgili olduğumuz o 20 Ocak gününden sadece birkaç gün sonra... "
            "Gözlerinde kaybolduğum, kalbimin seninle atmaya başladığı ilk karemiz. "
            "Dünyanın en güzel başlangıcı..."
        ),
        "note": (
            "Sevgili olduğumuz o 20 Ocak gününden sadece birkaç gün sonra... "
            "Gözlerinde kaybolduğum, kalbimin seninle atmaya başladığı ilk karemiz. "
            "Dünyanın en güzel başlangıcı..."
        ),
        "coraline_chapter": "Kapının Anahtarı",
        "category": "first_sparks",
        "device": "Samsung SM-A145F",
        "gps": None,
        "width": 2854,
        "height": 3730,
        "eyes": [{"x": 48.8, "y": 51.33}, {"x": 61.22, "y": 52.17}],
        "thumb": "images/thumbs/memory-00.webp",
        "optimized": "images/optimized/memory-00.webp",
        "lat": 40.9904,
        "lng": 29.0253,
        "secretMessage": "20 Ocak'ta başlayan masalımızın ölümsüzleştiği ilk an Seda'm...",
        "secretRune": "🗝️",
        "fallback_jpg": "images/memory-00.jpg",
        "location_name": "Birlikte İlk Adımlar",
        "original": "images/memory-00.jpg",
    }


def update_memory_location(item, index_or_id):
    """Tekil anının konumunu ve koordinatlarını günceller."""
    if index_or_id in ROMANTIC_LOCATIONS:
        loc, loc_name, lat, lng = ROMANTIC_LOCATIONS[index_or_id]
        item["location"] = loc
        item["location_name"] = loc_name
        item["lat"] = lat
        item["lng"] = lng
    return item


def run_update():
    """Tüm anıları okur, ilk fotoğrafı başa ekler ve konumları günceller."""
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        existing = json.load(f)

    # memory-00 zaten eklenmiş mi kontrol et
    clean_items = [m for m in existing if m.get("id") not in ("memory-00", 0)]
    first_item = build_first_photo_item()
    all_memories = [first_item] + clean_items

    for item in all_memories:
        mid = item.get("id")
        key = 0 if mid in ("memory-00", 0) else int(mid)
        update_memory_location(item, key)

    with open(JSON_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(all_memories, f, ensure_ascii=False, indent=2)

    print(f"Toplam {len(all_memories)} anı başarıyla güncellendi: {JSON_PATH}")


if __name__ == "__main__":
    run_update()
