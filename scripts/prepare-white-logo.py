"""Remove the black JPEG matte; usage: python scripts/prepare-white-logo.py INPUT."""
from pathlib import Path
import sys
from PIL import Image

source = Image.open(sys.argv[1]).convert("RGB")
inks = ((255, 255, 255), (240, 242, 237), (90, 124, 185))

def unmatte(rgb):
    if max(rgb) <= 16:
        return (0, 0, 0, 0)
    # Leave solid artwork intact; unpremultiply only black-matted edge pixels.
    if min(sum((rgb[i] - ink[i]) ** 2 for i in range(3)) for ink in inks) < 900:
        return (*rgb, 255)
    candidates = []
    for ink in inks:
        coverage = min(1, sum(rgb[i] * ink[i] for i in range(3)) / sum(c*c for c in ink))
        error = sum((rgb[i] - coverage * ink[i]) ** 2 for i in range(3))
        candidates.append((error, coverage, ink))
    _, coverage, ink = min(candidates)
    return (*ink, round(coverage * 255))

result = Image.new("RGBA", source.size)
result.putdata([unmatte(rgb) for rgb in source.get_flattened_data()])
output = Path(__file__).resolve().parents[1] / "public/images/jej-logo-white.png"
result.save(output, optimize=True)
print(f"{output.name}: {result.size}, alpha={result.getchannel('A').getextrema()}")
