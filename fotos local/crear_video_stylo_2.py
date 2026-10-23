from pathlib import Path
import cv2
import numpy as np
import math

BASE = Path(r"F:\Viernes\clientes\stilo facha\fotos local")
OUT = BASE / "Stylo-Facha-recorrido-2.mp4"
W, H, FPS = 720, 1280, 24
SECONDS = 3.2
FADE = 0.45

# Prefer the enhanced photos added to the folder; fall back to original photos.
# Mantener la secuencia mejorada, quitar las dos fotos de perchas solicitadas
# y sumar las dos fotos nuevas al recorrido del hero.
excluded = {
    "perchas2_upscayl_1x_upscayl-lite-4x.jpg",
    "perchas3_upscayl_1x_upscayl-lite-4x.jpg",
    "WhatsApp Image 2026-10-13 at 18.53.05_upscayl_1x_upscayl-lite-4x.jpg",
}
files = sorted(p for p in BASE.glob("*_upscayl*.jpg") if p.name not in excluded)
files.extend([BASE / "zapaas.jpeg", BASE / "perchero.jpeg"])
files = [p for p in files if p.is_file()]
if not files:
    raise SystemExit("No encontré fotos en la carpeta.")

def frame_for(img, t, seed):
    ih, iw = img.shape[:2]
    # Cover the vertical canvas, then add a restrained camera-like zoom/pan.
    scale0 = max(W / iw, H / ih)
    base_w, base_h = int(iw * scale0), int(ih * scale0)
    resized = cv2.resize(img, (base_w, base_h), interpolation=cv2.INTER_LANCZOS4)
    zoom = 1.04 + 0.10 * t
    cw, ch = max(W, int(base_w * zoom)), max(H, int(base_h * zoom))
    resized = cv2.resize(resized, (cw, ch), interpolation=cv2.INTER_LANCZOS4)
    max_x, max_y = cw - W, ch - H
    # Smooth alternating pan; no overlays or generated content.
    phase = t * math.pi
    fx = 0.5 + 0.22 * math.sin(phase + seed * 0.8)
    fy = 0.5 + 0.17 * math.cos(phase + seed * 0.6)
    x = int(max_x * min(1, max(0, fx)))
    y = int(max_y * min(1, max(0, fy)))
    return resized[y:y+H, x:x+W].copy()

images = []
for p in files:
    im = cv2.imread(str(p))
    if im is not None:
        images.append((p.name, im))
if not images:
    raise SystemExit("No pude abrir las fotos.")

frames_per = round(SECONDS * FPS)
fade_frames = round(FADE * FPS)
writer = cv2.VideoWriter(str(OUT), cv2.VideoWriter_fourcc(*"mp4v"), FPS, (W, H))
if not writer.isOpened():
    raise SystemExit("No se pudo crear el MP4.")

for i, (name, img) in enumerate(images):
    for n in range(frames_per):
        t = n / max(1, frames_per - 1)
        current = frame_for(img, t, i)
        if i > 0 and n < fade_frames:
            prev_name, prev_img = images[i-1]
            previous = frame_for(prev_img, 0.78 + 0.22 * (n / max(1, fade_frames-1)), i-1)
            alpha = (n + 1) / fade_frames
            current = cv2.addWeighted(previous, 1-alpha, current, alpha, 0)
        writer.write(current)
writer.release()
print("VIDEO_OK")
print("Salida:", OUT)
print("Fotos usadas:", len(images))
for name, _ in images:
    print("-", name)
print("Tamaño:", OUT.stat().st_size, "bytes")
