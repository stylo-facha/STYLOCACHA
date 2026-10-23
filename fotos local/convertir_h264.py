import av
from pathlib import Path
from fractions import Fraction

source = Path(r"F:\Viernes\clientes\stilo facha\fotos local\Stylo-Facha-recorrido-2.mp4")
target = source.with_name("Stylo-Facha-recorrido-2-h264.mp4")
inp = av.open(str(source))
out = av.open(str(target), mode="w", options={"movflags": "+faststart"})
stream = out.add_stream("libx264", rate=24)
stream.width = 720
stream.height = 1280
stream.pix_fmt = "yuv420p"
stream.time_base = Fraction(1, 24)
stream.options = {"crf": "20", "preset": "fast"}
count = 0
for frame in inp.decode(video=0):
    frame = frame.reformat(width=720, height=1280, format="yuv420p")
    frame.pts = count
    frame.time_base = Fraction(1, 24)
    for packet in stream.encode(frame):
        out.mux(packet)
    count += 1
for packet in stream.encode():
    out.mux(packet)
inp.close()
out.close()
print("H264_OK", count, target.stat().st_size)
