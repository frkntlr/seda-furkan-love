# -*- coding: utf-8 -*-
"""
EXIF Metadata Çıkarıcı & Veri Tabanı Oluşturucu
Demir Kafes Kuralı: <300 satır, fonksiyonlar <40 satır
"""

import os
import shutil
import json
from PIL import Image, ExifTags

MONTHS_TR = {
    "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan",
    "05": "Mayıs", "06": "Haziran", "07": "Temmuz", "08": "Ağustos",
    "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık"
}


def load_descriptions(json_path):
    """Açıklamalar ve metadata şablonunu UTF-8 olarak okur."""
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def parse_dms_coordinate(dms, ref):
    """GPS DMS formatını ondalık dereceye çevirir."""
    deg = float(dms[0])
    minute = float(dms[1])
    sec = float(dms[2])
    dec = deg + (minute / 60.0) + (sec / 3600.0)
    return -dec if ref in ["S", "W"] else dec


def extract_gps_coords(gps_ifd):
    """GPS IFD sözlüğünden koordinatları ayıklar."""
    if not gps_ifd:
        return None
    lat = gps_ifd.get(2)
    lat_ref = gps_ifd.get(1)
    lon = gps_ifd.get(4)
    lon_ref = gps_ifd.get(3)
    if not (lat and lat_ref and lon and lon_ref):
        return None
    if any(str(x) == "nan" for x in lat) or any(str(x) == "nan" for x in lon):
        return None
    return {
        "latitude": parse_dms_coordinate(lat, lat_ref),
        "longitude": parse_dms_coordinate(lon, lon_ref)
    }


def format_turkish_date(raw_date_str):
    """EXIF tarihini Türkçe metne biçimlendirir."""
    if not raw_date_str or len(raw_date_str) < 10:
        return "Bilinmeyen Tarih"
    clean_date = raw_date_str[:10].replace("-", ":")
    parts = clean_date.split(":")
    if len(parts) >= 3:
        year, month, day = parts[0], parts[1], parts[2]
        month_name = MONTHS_TR.get(month, month)
        return f"{int(day)} {month_name} {year}"
    return raw_date_str[:10]


def extract_exif_info(image_path):
    """Görselden tarih, cihaz, boyut ve GPS bilgilerini toplar."""
    with Image.open(image_path) as im:
        width, height = im.size
        exif = im.getexif()
        date_str = None
        device = "Nothing Phone (1)"
        gps_data = None
        if exif:
            exif_ifd = exif.get_ifd(ExifTags.IFD.Exif)
            gps_ifd = exif.get_ifd(ExifTags.IFD.GPSInfo)
            date_str = (
                exif_ifd.get(0x9003) or
                exif_ifd.get(0x9004) or
                exif.get(0x0132)
            )
            make = exif.get(0x010F, "").strip()
            model = exif.get(0x0110, "").strip()
            if make or model:
                device = f"{make} {model}".strip()
            gps_data = extract_gps_coords(gps_ifd)
        return {
            "date_str": date_str or fallback_date_from_name(image_path),
            "device": device,
            "gps": gps_data,
            "width": width,
            "height": height
        }


def fallback_date_from_name(filename):
    """Dosya adındaki IMG_YYYYMMDD_HHMMSS şablonundan tarih çıkarır."""
    base = os.path.basename(filename)
    parts = base.split("_")
    if len(parts) >= 3:
        d = parts[1]
        t = parts[2][:6]
        return f"{d[:4]}:{d[4:6]}:{d[6:8]} {t[:2]}:{t[2:4]}:{t[4:6]}"
    return "2025:01:01 12:00:00"


def copy_image_assets(src_path, dst_dir, memory_name, orig_name):
    """Görselleri hem web-dostu hem orijinal adla hedefe kopyalar."""
    os.makedirs(dst_dir, exist_ok=True)
    dst_memory = os.path.join(dst_dir, memory_name)
    dst_orig = os.path.join(dst_dir, orig_name)
    shutil.copy2(src_path, dst_memory)
    if not os.path.exists(dst_orig):
        shutil.copy2(src_path, dst_orig)


def build_memory_item(idx, orig_file, info, detail):
    """Tek bir anı objesini standart formata dönüştürür."""
    mem_filename = f"memory-{idx:02d}.jpg"
    return {
        "id": idx,
        "filename": f"images/{mem_filename}",
        "image": f"images/{mem_filename}",
        "originalFilename": orig_file,
        "date": format_turkish_date(info["date_str"]),
        "rawDate": info["date_str"],
        "location": detail["location"],
        "title": detail["title"],
        "caption": detail["caption"],
        "note": detail["caption"],
        "coraline_chapter": detail["chapter"],
        "category": detail["category"],
        "device": info["device"],
        "gps": info["gps"],
        "width": info["width"],
        "height": info["height"]
    }


def process_all_images(src_dir, dest_img_dir, dest_json_file, desc_file):
    """Tüm fotoğrafları tarar, sıralar, kopyalar ve JSON üretir."""
    descriptions = load_descriptions(desc_file)
    files = [f for f in sorted(os.listdir(src_dir)) if f.lower().endswith(".jpg")]
    scan_results = []
    for f in files:
        full_path = os.path.join(src_dir, f)
        info = extract_exif_info(full_path)
        scan_results.append((info["date_str"], f, info))

    scan_results.sort(key=lambda x: x[0])
    memories = []
    for idx, (raw_date, f, info) in enumerate(scan_results, 1):
        mem_filename = f"memory-{idx:02d}.jpg"
        copy_image_assets(os.path.join(src_dir, f), dest_img_dir, mem_filename, f)
        detail = descriptions.get(f, {
            "title": f"Büyülü An #{idx}",
            "location": "İstanbul",
            "chapter": "Sonsuz Bağımız",
            "category": "sweet-moments",
            "caption": "Seda'm, seninle geçen her an masalsı bir sonsuzluk."
        })
        memories.append(build_memory_item(idx, f, info, detail))

    os.makedirs(os.path.dirname(dest_json_file), exist_ok=True)
    with open(dest_json_file, "w", encoding="utf-8", newline="\n") as out:
        json.dump(memories, out, ensure_ascii=False, indent=2)
    print(f"Toplam {len(memories)} anı başarıyla işlendi: {dest_json_file}")


if __name__ == "__main__":
    BASE_DIR = r"C:\Users\Lenovo\.gemini\antigravity\scratch\seda-furkan-love"
    SRC_DIR = os.path.join(BASE_DIR, "downloaded_images")
    DEST_IMG = os.path.join(BASE_DIR, "public", "images")
    DEST_JSON = os.path.join(BASE_DIR, "public", "data", "memories.json")
    DESC_JSON = os.path.join(BASE_DIR, "scripts", "photo_descriptions.json")
    process_all_images(SRC_DIR, DEST_IMG, DEST_JSON, DESC_JSON)
