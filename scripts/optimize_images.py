# -*- coding: utf-8 -*-
"""
Görsel Optimizasyonu & WebP Dönüştürücü
Demir Kafes Kuralı: <300 satır, fonksiyonlar <40 satır
"""

import os
from PIL import Image, ImageOps

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_IMG_DIR = os.path.join(BASE_DIR, "public", "images")
THUMB_DIR = os.path.join(SRC_IMG_DIR, "thumbs")
OPTIMIZED_DIR = os.path.join(SRC_IMG_DIR, "optimized")

THUMB_SIZE = (400, 400)
OPTIMIZED_MAX_DIM = 1200
THUMB_QUALITY = 80
OPTIMIZED_QUALITY = 82


def ensure_directories():
    """Çıktı klasörlerini oluşturur."""
    os.makedirs(THUMB_DIR, exist_ok=True)
    os.makedirs(OPTIMIZED_DIR, exist_ok=True)


def create_thumbnail(img, out_path):
    """400x400 süper hafif kare/fit WebP küçük resim üretir (~25-40 KB)."""
    thumb = ImageOps.fit(
        img,
        THUMB_SIZE,
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.4)
    )
    thumb.save(out_path, format="WEBP", quality=THUMB_QUALITY, method=6)


def create_optimized_image(img, out_path):
    """1200px genişlik/yükseklik optimize WebP üretir (~120-180 KB)."""
    w, h = img.size
    scale = OPTIMIZED_MAX_DIM / max(w, h)
    if scale < 1.0:
        new_w, new_h = int(w * scale), int(h * scale)
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    else:
        resized = img.copy()
    resized.save(out_path, format="WEBP", quality=OPTIMIZED_QUALITY, method=6)


def get_target_files():
    """İşlenecek orijinal JPG dosyalarını listeler."""
    files = []
    for f in sorted(os.listdir(SRC_IMG_DIR)):
        if f.lower().endswith((".jpg", ".jpeg")) and not os.path.isdir(
            os.path.join(SRC_IMG_DIR, f)
        ):
            files.append(f)
    return files


def process_single_image(filename):
    """Tek bir görseli açıp hem thumb hem optimize webp olarak kaydeder."""
    src_path = os.path.join(SRC_IMG_DIR, filename)
    name_no_ext = os.path.splitext(filename)[0]
    thumb_path = os.path.join(THUMB_DIR, f"{name_no_ext}.webp")
    optimized_path = os.path.join(OPTIMIZED_DIR, f"{name_no_ext}.webp")

    with Image.open(src_path) as img:
        img_rgb = img.convert("RGB")
        create_thumbnail(img_rgb, thumb_path)
        create_optimized_image(img_rgb, optimized_path)

    orig_sz = os.path.getsize(src_path)
    thumb_sz = os.path.getsize(thumb_path)
    opt_sz = os.path.getsize(optimized_path)
    return orig_sz, thumb_sz, opt_sz


def run_optimization():
    """Tüm görselleri optimize eder ve tasarruf raporu basar."""
    ensure_directories()
    files = get_target_files()
    print(f"Toplam {len(files)} görsel işleniyor...")

    total_orig, total_thumb, total_opt = 0, 0, 0
    for idx, f in enumerate(files, 1):
        orig_sz, thumb_sz, opt_sz = process_single_image(f)
        total_orig += orig_sz
        total_thumb += thumb_sz
        total_opt += opt_sz
        print(
            f"[{idx}/{len(files)}] {f} -> Thumb: {thumb_sz // 1024} KB | "
            f"Opt: {opt_sz // 1024} KB (Orig: {orig_sz // 1024} KB)"
        )

    print("\n" + "=" * 50)
    print(f"Orijinal Toplam Boyut:  {total_orig / (1024*1024):.2f} MB")
    print(f"Optimize Toplam Boyut:  {total_opt / (1024*1024):.2f} MB")
    print(f"Thumbnail Toplam Boyut: {total_thumb / (1024*1024):.2f} MB")
    saved_mb = (total_orig - total_opt) / (1024 * 1024)
    print(f"Tasarruf: {saved_mb:.2f} MB ({100 * (1 - total_opt/total_orig):.1f}%)")
    print("=" * 50)


if __name__ == "__main__":
    run_optimization()
