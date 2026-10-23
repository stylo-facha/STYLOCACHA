import cv2, os, numpy as np

BASE = r'F:\Viernes\clientes\stilo facha\fotos local'
OUT = os.path.join(BASE, 'Stylo-Facha-recorrido.mp4')
W, H, FPS = 720, 1280, 24
SECONDS = 3.0
FADE = 0.45

# Fotos originales del local; solo se animan con zoom/desplazamiento, sin IA generativa.
shots = [
    ('WhatsApp Image 2026-10-13 at 18.53.05.jpeg', (0.53, 0.46), 1.00, 1.30), # fachada hacia la puerta
    ('WhatsApp Image 2026-10-13 at 18.53.11.jpeg', (0.48, 0.52), 1.02, 1.12), # interior
    ('estante2.jpeg', (0.50, 0.53), 1.00, 1.15), # gorras y calzado
    ('estantezapas.jpeg', (0.45, 0.55), 1.12, 1.00), # detalle calzado
    ('perchas.jpeg', (0.47, 0.47), 1.00, 1.13), # remeras
    ('perchas2.jpeg', (0.50, 0.52), 1.12, 1.00), # exhibidor central
]

def frame_for(img, t, start_center, z0, z1):
    ih, iw = img.shape[:2]
    # Escala base para cubrir 9:16; el zoom se anima suavemente.
    base = max(W / iw, H / ih)
    z = z0 + (z1 - z0) * t
    sw, sh = int(W / (base*z)), int(H / (base*z))
    sw, sh = min(iw, max(2, sw)), min(ih, max(2, sh))
    # Movimiento de cámara leve alrededor del punto de interés indicado.
    cx = start_center[0] * iw
    cy = start_center[1] * ih
    # En acercamiento, desplaza suavemente hacia el punto de interés.
    cx = iw*0.5 + (cx-iw*0.5)*t
    cy = ih*0.5 + (cy-ih*0.5)*t
    x = int(np.clip(cx-sw/2, 0, iw-sw))
    y = int(np.clip(cy-sh/2, 0, ih-sh))
    crop = img[y:y+sh, x:x+sw]
    return cv2.resize(crop, (W,H), interpolation=cv2.INTER_LANCZOS4)

loaded=[]
for name, center, z0, z1 in shots:
    path=os.path.join(BASE,name)
    img=cv2.imread(path)
    if img is None:
        raise RuntimeError('No se pudo leer la foto: '+path)
    loaded.append((img,center,z0,z1,name))

fourcc=cv2.VideoWriter_fourcc(*'mp4v')
writer=cv2.VideoWriter(OUT,fourcc,FPS,(W,H))
if not writer.isOpened():
    raise RuntimeError('No se pudo crear el video MP4 en esta computadora.')

frames_per=int(SECONDS*FPS)
fade_frames=int(FADE*FPS)
previous=None
for img,center,z0,z1,name in loaded:
    frames=[frame_for(img, i/max(1,frames_per-1), center, z0, z1) for i in range(frames_per)]
    if previous is not None:
        for k in range(fade_frames):
            a=(k+1)/(fade_frames+1)
            blend=cv2.addWeighted(previous[-fade_frames+k],1-a,frames[k],a,0)
            writer.write(blend)
        for fr in frames[fade_frames:]: writer.write(fr)
    else:
        for fr in frames: writer.write(fr)
    previous=frames
writer.release()
print('VIDEO CREADO:', OUT)
print('Duracion aproximada:', round((len(loaded)*frames_per-(len(loaded)-1)*fade_frames)/FPS,1),'segundos')
print('Formato: vertical 9:16, 720x1280, 24 fps. Fotos originales con zoom/paneo y fundidos; sin reconstruccion generativa.')
