"""
Seda & Furkan Coraline Evreni - Medya & Koordinat İşleme Scripti
WebP Optimizasyonu, Göz Tespiti & Harita Koordinatları
"""

import json
import os
import cv2
from PIL import Image

BASE_DIR = r"C:\Users\Lenovo\.gemini\antigravity\scratch\seda-furkan-love"
IMAGES_DIR = os.path.join(BASE_DIR, "public", "images")
THUMBS_DIR = os.path.join(IMAGES_DIR, "thumbs")
OPTIMIZED_DIR = os.path.join(IMAGES_DIR, "optimized")
DATA_FILE = os.path.join(BASE_DIR, "public", "data", "memories.json")

os.makedirs(THUMBS_DIR, exist_ok=True)
os.makedirs(OPTIMIZED_DIR, exist_ok=True)

# Lokasyon Koordinatları (İstanbul)
LOCATIONS_GEO = {
    "Kadıköy": {"lat": 40.9912, "lng": 29.0270},
    "Moda Sahili": {"lat": 40.9785, "lng": 29.0260},
    "Fenerbahçe Parkı": {"lat": 40.9695, "lng": 29.0375},
    "Kalamış Marina": {"lat": 40.9740, "lng": 29.0430},
    "Moda": {"lat": 40.9820, "lng": 29.0275},
    "Bostancı İskelesi": {"lat": 40.9525, "lng": 29.0945},
    "Bağdat Caddesi": {"lat": 40.9630, "lng": 29.0710},
    "Emirgan Korusu": {"lat": 41.1080, "lng": 29.0545},
    "Emirgan": {"lat": 41.1055, "lng": 29.0530},
    "Bebek Parkı": {"lat": 41.0770, "lng": 29.0435},
    "Boğaz Kıyısı": {"lat": 41.0795, "lng": 29.0450},
    "Karaköy": {"lat": 41.0230, "lng": 28.9770},
    "Beşiktaş": {"lat": 41.0425, "lng": 29.0065},
    "Ortaköy": {"lat": 41.0480, "lng": 29.0270},
    "Galata": {"lat": 41.0255, "lng": 28.9740},
    "Caddebostan": {"lat": 40.9640, "lng": 29.0620},
    "Caddebostan Sahil": {"lat": 40.9605, "lng": 29.0600},
    "Heybeliada": {"lat": 40.8770, "lng": 29.0960},
    "Büyükada": {"lat": 40.8600, "lng": 29.1250},
    "Marmara Denizi": {"lat": 40.9200, "lng": 29.0700},
    "Adalar Vapuru": {"lat": 40.9400, "lng": 29.0500},
    "Kuzguncuk": {"lat": 41.0360, "lng": 29.0305},
    "Kuzguncuk Bostanı": {"lat": 41.0345, "lng": 29.0315},
    "Üsküdar": {"lat": 41.0265, "lng": 29.0155},
    "Cihangir": {"lat": 41.0325, "lng": 28.9830},
    "Galata Köprüsü": {"lat": 41.0200, "lng": 28.9735},
    "Karaköy Sokakları": {"lat": 41.0245, "lng": 28.9760},
    "Beyoğlu": {"lat": 41.0340, "lng": 28.9775},
    "Taksim": {"lat": 41.0370, "lng": 28.9850},
    "İstiklal Caddesi": {"lat": 41.0335, "lng": 28.9770},
    "Haliç": {"lat": 41.0280, "lng": 28.9600},
    "Kandilli Sahili": {"lat": 41.0740, "lng": 29.0580},
    "Boğaziçi": {"lat": 41.0500, "lng": 29.0350},
    "Yıldız Parkı": {"lat": 41.0490, "lng": 29.0160},
    "Çamlıca Tepesi": {"lat": 41.0285, "lng": 29.0680},
    "Gizli Bahçe": {"lat": 41.0450, "lng": 29.0200}
}

SECRET_MESSAGES = [
    "Seda'm, senin gözlerinde kaybolmak bu evrenin en güzel büyüsü...",
    "Gizli kapının ardındaki bütün yıldızlar senin için parıldıyor sevgilim.",
    "Altın bir iğneyle kalbime işlendin; hiçbir fırtına koparamaz.",
    "Gören Taş bile senin bu saf ve benzersiz güzelliğini tarif edemez.",
    "Pembe Saray'ın en zarif prensesi sensin Seda'm.",
    "Gözlerindeki siyah düğmeler bile senin parıltını söndüremez.",
    "Birlikte attığımız her adım, sonsuzluğa doğru yazılmış bir mısra.",
    "Coraline Other World'ü aradı, ben ise sende tüm dünyayı buldum.",
    "Seda & Furkan: Her boyutta, her tünelin ucunda el eleyiz.",
    "Sen güldüğünde içimde binlerce mavi ateşböceği havalanıyor."
]

cascade_path = cv2.data.haarcascades
face_cascade = cv2.CascadeClassifier(cascade_path + 'haarcascade_frontalface_default.xml')
eye_cascade = cv2.CascadeClassifier(cascade_path + 'haarcascade_eye.xml')

def extract_face_eyes(gray, face, w, h):
    fx, fy, fw, fh = face
    roi_gray = gray[fy:fy+int(fh*0.65), fx:fx+fw]
    eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.1, minNeighbors=4, minSize=(15, 15))
    if len(eyes) >= 2:
        eyes = sorted(eyes, key=lambda e: e[0])[:2]
        return [
            {"x": round(((fx + ex + ew // 2) / w) * 100, 1),
             "y": round(((fy + ey + eh // 2) / h) * 100, 1)}
            for (ex, ey, ew, eh) in eyes
        ]
    return [
        {"x": round(((fx + fw * 0.35) / w) * 100, 1),
         "y": round(((fy + fh * 0.38) / h) * 100, 1)},
        {"x": round(((fx + fw * 0.65) / w) * 100, 1),
         "y": round(((fy + fh * 0.38) / h) * 100, 1)}
    ]

def detect_eyes_in_image(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return [{"x": 42.0, "y": 38.0}, {"x": 58.0, "y": 38.0}]
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.15, minNeighbors=5, minSize=(60, 60))
    detected = []
    if len(faces) > 0:
        faces = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[:2]
        for face in faces:
            detected.extend(extract_face_eyes(gray, face, w, h))
    if not detected:
        detected = [{"x": 42.5, "y": 38.0}, {"x": 57.5, "y": 38.0}]
    return detected[:4]

def process_image_variants(orig_jpg, thumb_webp, opt_webp):
    with Image.open(orig_jpg) as im:
        im = im.convert("RGB")
        opt_im = im.copy()
        opt_im.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
        opt_im.save(opt_webp, "WEBP", quality=85)
        thumb_im = im.copy()
        thumb_im.thumbnail((420, 420), Image.Resampling.LANCZOS)
        thumb_im.save(thumb_webp, "WEBP", quality=78)

def enrich_memory_fields(mem, i, img_id):
    mem["thumb"] = f"images/thumbs/{img_id}.webp"
    mem["optimized"] = f"images/optimized/{img_id}.webp"
    mem["image"] = f"images/optimized/{img_id}.webp"
    loc_name = mem.get("location", "Kadıköy")
    geo = LOCATIONS_GEO.get(loc_name, {"lat": 40.9850, "lng": 29.0300})
    offset_lat = ((mem["id"] % 5) - 2) * 0.0012
    offset_lng = (((mem["id"] * 3) % 5) - 2) * 0.0012
    mem["lat"] = round(geo["lat"] + offset_lat, 5)
    mem["lng"] = round(geo["lng"] + offset_lng, 5)
    mem["secretMessage"] = SECRET_MESSAGES[i % len(SECRET_MESSAGES)]
    mem["secretRune"] = ["🌀", "🗝️", "✨", "🖤", "🧵", "🪡", "👁️", "🌙"][i % 8]

def process():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        memories = json.load(f)
    print(f"Toplam {len(memories)} anı işleniyor...")
    for i, mem in enumerate(memories):
        img_id = f"memory-{mem['id']:02d}"
        orig_jpg = os.path.join(IMAGES_DIR, f"{img_id}.jpg")
        thumb_webp = os.path.join(THUMBS_DIR, f"{img_id}.webp")
        opt_webp = os.path.join(OPTIMIZED_DIR, f"{img_id}.webp")
        if os.path.exists(orig_jpg):
            process_image_variants(orig_jpg, thumb_webp, opt_webp)
            mem["eyes"] = detect_eyes_in_image(orig_jpg)
        else:
            mem["eyes"] = [{"x": 42.0, "y": 38.0}, {"x": 58.0, "y": 38.0}]
        enrich_memory_fields(mem, i, img_id)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(memories, f, ensure_ascii=False, indent=2)
    print("[OK] Tum gorseller WebP'ye donusturuldu, goz koordinatlari ve harita konumlari islendi!")

if __name__ == "__main__":
    process()
