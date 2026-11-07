# -*- coding: utf-8 -*-
"""
Memories Veri Güncelleyici
Demir Kafes Kuralı: <300 satır, fonksiyonlar <40 satır
"""

import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSON_PATH = os.path.join(BASE_DIR, "public", "data", "memories.json")

# Merkezi Romantik Hat: Kadıköy / Moda / Boğaz Vapuru / Ortaköy / Kuzguncuk
ROMANTIC_LOCATIONS = {
    1: ("Kadıköy", "Birlikte İlk Adımlar", 40.9904, 29.0253),
    2: ("Kadıköy", "Bizim Gizli Köşemiz", 40.9882, 29.0245),
    3: ("Moda Sahili", "Sahil Yürüyüşü & Günbatımı", 40.9822, 29.0275),
    4: ("Moda Sahili", "Sıcak Bir Kahve & Gülüşün", 40.9835, 29.0268),
    5: ("Kadıköy", "El Ele Büyülü Adımlar", 40.9868, 29.0282),
    6: ("Moda Sahili", "Deniz Kıyısında Bir Masal", 40.9806, 29.0248),
    7: ("Moda Sahili", "Kızıl Gökyüzü & Huzur", 40.9792, 29.0235),
    8: ("Kadıköy", "Yıldızların Altında", 40.9875, 29.0298),
    9: ("Ortaköy Sahili", "İlk Çiçekler & Tebessümün", 41.0472, 29.0270),
    10: ("Ortaköy Sahili", "Boğaz Kıyısında Masum Bir Bakış", 41.0485, 29.0282),
    11: ("Moda Parkı", "Ağaçlar Altında Kahkahalarımız", 40.9842, 29.0290),
    12: ("Boğaz Kıyısı", "Mavi Dalgalar ve Sessizliğimiz", 41.0458, 29.0262),
    13: ("Boğaz Hattı", "Gece Işıklarının Dansı", 41.0435, 29.0248),
    14: ("Ortaköy", "Tatlı Bir Mola & Sıcak Sohbet", 41.0465, 29.0276),
    15: ("Ortaköy Sahili", "Göz Göze Sessiz Bir An", 41.0478, 29.0285),
    16: ("Boğaz Kıyısı", "Bizim Masamız & Mum Işığı", 41.0492, 29.0298),
    17: ("Moda Sahili", "Baharla Gelen Melodimiz", 40.9815, 29.0262),
    18: ("Moda Sahili", "Rüzgarda Uçuşan Saçların", 40.9802, 29.0251),
    19: ("Boğaz Vapuru", "Güneşin Sıcaklığı & Gülüşün", 41.0185, 29.0142),
    20: ("Boğaz Vapuru", "Deniz Kokusu & Mutluluğumuz", 41.0152, 29.0168),
    21: ("Boğaz Vapuru", "Vapurda İki Çay, Bir Masal", 41.0125, 29.0185),
    22: ("Boğaz Vapuru", "Vapurda Martılar ve Aşkımız", 41.0105, 29.0210),
    23: ("Kuzguncuk", "Kuzguncuk Sokaklarında Sevdamız", 41.0347, 29.0298),
    24: ("Kuzguncuk", "Tarihi Çınar Altı & Huzur", 41.0335, 29.0312),
    25: ("Üsküdar Sahili", "Kız Kulesi Karşısında Fısıltılar", 41.0211, 29.0061),
    26: ("Ortaköy", "En Uzun Günün En Güzel Hatırası", 41.0482, 29.0268),
    27: ("Ortaköy Sahili", "Boğaz Köprüsü Altında Parıltın", 41.0495, 29.0278),
    28: ("Kadıköy", "Adım Adım Mutluluğa Doğru", 40.9892, 29.0265),
    29: ("Kadıköy", "Işıltılı Bakışların Aynası", 40.9880, 29.0272),
    30: ("Moda Sahili", "İçimizi Isıtan O Gülüşün", 40.9828, 29.0260),
    31: ("Moda Sahili", "Kalplerimizin Düğümlendiği Yer", 40.9818, 29.0255),
    32: ("Moda Parkı", "Bizim Şarkımızın Çaldığı Köşe", 40.9848, 29.0285),
    33: ("Kadıköy", "Birlikte Kaybolduğumuz Sokaklar", 40.9870, 29.0278),
    34: ("Kadıköy", "Aşkla Çarpan Kalplerimiz", 40.9862, 29.0268),
    35: ("Moda Sahili", "Altın Sarısı Akşamüstü", 40.9798, 29.0242),
    36: ("Boğaz Kıyısı", "Dünyanın En Huzurlu Limanı", 41.0505, 29.0305),
    37: ("Ortaköy Sahili", "Büyülü Bir Boğaz Akşamı", 41.0489, 29.0320),
    38: ("Ortaköy Sahili", "Sonsuzluğa Bakan Köşemiz", 41.0475, 29.0275),
    39: ("Moda Sahili", "Yıldızlara Fısıldanan Sözler", 40.9810, 29.0249),
    40: ("Kadıköy Rıhtım", "Sonsuz Masalımızın Mührü", 40.9912, 29.0248),
}


def update_first_photo(item):
    """İlk fotoğraf metinlerini ve kategorisini günceller."""
    item["title"] = "İlk Bakış: Her Şeyin Başladığı An"
    item["date"] = "25 Ocak 2025"
    item["rawDate"] = "2025:01:25 14:57:18"
    item["device"] = "Samsung SM-A145F"
    item["caption"] = (
        "Sevgili olduğumuz o 20 Ocak gününden sadece birkaç gün sonra... "
        "Gözlerinde kaybolduğum, kalbimin seninle atmaya başladığı ilk karemiz. "
        "Dünyanın en güzel başlangıcı..."
    )
    item["note"] = item["caption"]
    item["coraline_chapter"] = "Kapının Anahtarı"
    item["category"] = "first_sparks"
    item["secretMessage"] = (
        "20 Ocak'ta başlayan masalımızın ölümsüzleştiği ilk an Seda'm..."
    )
    item["secretRune"] = "🗝️"
    return item


def run_update():
    """Tüm anıları okur ve konumları/bilgileri günceller."""
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        memories = json.load(f)

    # memory-00 varsa kaldır veya 1-40 olarak normalize et
    clean_memories = [m for m in memories if m.get("id") != "memory-00"]

    for idx, item in enumerate(clean_memories, 1):
        item["id"] = idx
        if idx == 1:
            update_first_photo(item)
        if idx in ROMANTIC_LOCATIONS:
            loc, loc_name, lat, lng = ROMANTIC_LOCATIONS[idx]
            item["location"] = loc
            item["location_name"] = loc_name
            item["lat"] = lat
            item["lng"] = lng

    with open(JSON_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(clean_memories, f, ensure_ascii=False, indent=2)

    print(f"Toplam {len(clean_memories)} anı başarıyla güncellendi.")


if __name__ == "__main__":
    run_update()
