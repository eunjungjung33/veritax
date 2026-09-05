"""Run with Pillow and the original Korean-named logo PNGs in the repo root."""

from collections import Counter
from pathlib import Path
import json

from PIL import Image, ImageChops


ROOT = Path(__file__).resolve().parents[1]
BACKGROUND = (245, 245, 240)
FOREGROUND = ((20, 30, 60), (42, 63, 115), (74, 74, 74))


def unmatte(color):
    if color == BACKGROUND:
        return (0, 0, 0, 0)
    if color in FOREGROUND:
        return (*color, 255)

    # The source edge pixels are blends of a flat ink and the background.
    # Recover their ink and coverage instead of retaining a pale edge matte.
    candidates = []
    for ink in FOREGROUND:
        direction = [ink[i] - BACKGROUND[i] for i in range(3)]
        coverage = sum((color[i] - BACKGROUND[i]) * direction[i] for i in range(3))
        coverage /= sum(value * value for value in direction)
        alpha = max(1, min(254, round(coverage * 255)))
        reconstructed = tuple(round((ink[i] * alpha + BACKGROUND[i] * (255 - alpha)) / 255) for i in range(3))
        error = sum((color[i] - reconstructed[i]) ** 2 for i in range(3))
        candidates.append((error, (*ink, alpha)))
    return min(candidates, key=lambda candidate: candidate[0])[1]


for variant in ("simple", "full"):
    source_path = ROOT / ("로고 간단.png" if variant == "simple" else "로고 full.png")
    output_path = ROOT / "public" / "images" / f"jej-logo-{variant}-transparent.png"
    source = Image.open(source_path).convert("RGB")
    pixels = list(source.get_flattened_data())
    colors = Counter(pixels)
    assert all(source.getpixel(point) == BACKGROUND for point in (
        (0, 0), (source.width - 1, 0), (0, source.height - 1),
        (source.width - 1, source.height - 1),
    )), "Unexpected background"
    mapping = {color: unmatte(color) for color in colors}
    result = Image.new("RGBA", source.size)
    result.putdata([mapping[color] for color in pixels])

    recomposed = Image.new("RGBA", source.size, (*BACKGROUND, 255))
    recomposed.alpha_composite(result)
    difference = ImageChops.difference(source, recomposed.convert("RGB"))
    max_error = max(extrema[1] for extrema in difference.getextrema())
    assert max_error <= 1, "Unexpected source color; do not alter this logo"
    assert all(mapping[color] == (*color, 255) for color in FOREGROUND)
    assert all(mapping[color][3] > 0 for color in colors if color != BACKGROUND)

    result.save(output_path, optimize=True)
    alpha_counts = Counter(result.getchannel("A").get_flattened_data())
    print(json.dumps({
        "file": output_path.name, "size": source.size, "mode": result.mode,
        "transparent_pixels": alpha_counts[0], "opaque_pixels": alpha_counts[255],
        "antialiased_pixels": sum(count for alpha, count in alpha_counts.items() if 0 < alpha < 255),
        "max_recomposition_error_per_channel": max_error,
        "original_background_pixels": colors[BACKGROUND],
    }))
