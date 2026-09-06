"""Build the transparent white header/footer wordmark and favicon mark from the supplied logo.

Usage: python scripts/make-brand-logos.py "로고 간단.png"
Requires Pillow. The source PNG keeps its original proportions; only colours are remapped
for the dark header (navy text -> white, centre bar -> light grey, side bars -> lighter blue).
"""
from pathlib import Path
import sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
source = Image.open(sys.argv[1]).convert("RGB")
width, height = source.size
BG = (245, 245, 240)
NAVY, GREY = (42, 63, 115), (74, 74, 74)
MARK_LIMIT = int(width * 0.29)  # everything left of this is the three-bar mark


def dist(a, b):
    return sum((a[i] - b[i]) ** 2 for i in range(3)) ** 0.5


def remap(x, rgb):
    coverage_navy = min(1.0, dist(rgb, BG) / dist(NAVY, BG))
    coverage_grey = min(1.0, dist(rgb, BG) / dist(GREY, BG))
    is_grey = dist(rgb, GREY) < dist(rgb, NAVY)
    coverage = coverage_grey if is_grey else coverage_navy
    if coverage < 0.04:
        return (0, 0, 0, 0)
    if x < MARK_LIMIT:
        ink = (236, 234, 227) if is_grey else (96, 132, 196)
    else:
        ink = (255, 255, 255)
    return (*ink, round(coverage * 255))


pixels = list(source.get_flattened_data())
out = Image.new("RGBA", source.size)
out.putdata([remap(i % width, rgb) for i, rgb in enumerate(pixels)])
bbox = out.getchannel("A").getbbox()
pad = 6
out = out.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(width, bbox[2] + pad), min(height, bbox[3] + pad)))
target = ROOT / "public/images/jej-logo-white.png"
out.save(target, optimize=True)
print(f"{target.name}: {out.size}")

# Measure the three bars for the SVG favicon.
mask = source.crop((0, 0, MARK_LIMIT, height)).convert("L").point(lambda v: 255 if v < 200 else 0)
cols = [x for x in range(MARK_LIMIT) if any(mask.getpixel((x, y)) for y in range(height))]
bars, start = [], cols[0]
for a, b in zip(cols, cols[1:] + [None]):
    if b is None or b != a + 1:
        ys = [y for y in range(height) for x in (start, a) if mask.getpixel((x, y))]
        bars.append((start, a + 1, min(ys), max(ys) + 1))
        start = b
print("bars:", bars)
