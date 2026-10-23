import cv2
import av
import numpy as np
from pathlib import Path
from fractions import Fraction

base = Path(r"F:\Viernes\clientes\stilo facha\fotos local")
night = base / "WhatsApp Video 2026-10-10 at 14.51.32.mp4"
tour = base / "Stylo-Facha-recorrido-2.mp4"
out = base / "Stylo-Facha-hero-combinado.mp4"
W, H, FPS = 720, 1280, 24
CROSS = 18  # 0.75 s transition

def frames(path, max_seconds=None):
    cap = cv2.VideoCapture(str(path))
    if not cap.isOpened():
        raise RuntimeError(f"No se pudo abrir: {path}")
    srcfps = cap.get(cv2.CAP_PROP_FPS) or 24
    allf = []
    idx = 0
    while True:
        if max_seconds is not None and idx >= max_seconds * srcfps:
            break
        ok, bgr = cap.read()
        if not ok:
            break
        # Remuestrear a 24 fps sin cambiar el contenido original
        if int(idx * FPS / srcfps) != int((idx - 1) * FPS / srcfps) if idx else True:
            h, w = bgr.shape[:2]
            scale = max(W / w, H / h)
            nw, nh = int(round(w * scale)), int(round(h * scale))
            img = cv2.resize(bgr, (nw, nh), interpolation=cv2.INTER_AREA if scale < 1 else cv2.INTER_CUBIC)
            x, y = (nw - W) // 2, (nh - H) // 2
            img = img[y:y+H, x:x+W]
            allf.append(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        idx += 1
    cap.release()
    if not allf:
        raise RuntimeError(f"Video vacío: {path}")
    return allf

print("Leyendo video nocturno...")
a = frames(night, max_seconds=6)
print("Fachada nocturna recortada a 6 segundos para darle más ritmo.")
print("Leyendo recorrido...")
b = frames(tour)
n = min(CROSS, len(a), len(b))
sequence = a[:-n]
for i in range(n):
    alpha = (i + 1) / (n + 1)
    mix = cv2.addWeighted(a[-n+i], 1-alpha, b[i], alpha, 0)
    sequence.append(mix)
sequence.extend(b[n:])
print(f"Frames totales: {len(sequence)} ({len(sequence)/FPS:.1f} segundos)")

container = av.open(str(out), mode="w", options={"movflags": "+faststart"})
stream = container.add_stream("libx264", rate=FPS)
stream.time_base = Fraction(1, FPS)
stream.width = W
stream.height = H
stream.pix_fmt = "yuv420p"
stream.options = {"crf": "20", "preset": "medium", "movflags": "+faststart"}
for i, rgb in enumerate(sequence):
    frame = av.VideoFrame.from_ndarray(rgb, format="rgb24")
    frame.pts = i
    frame.time_base = Fraction(1, FPS)
    for packet in stream.encode(frame):
        container.mux(packet)
for packet in stream.encode():
    container.mux(packet)
container.close()
print(f"OK: {out}")
print(f"Peso: {out.stat().st_size:,} bytes")
