"""Generuje ikony aplikacji: kobaltowe tło, biała litera „Я” ze złotym znakiem akcentu.
Uruchom: python tools/make_icons.py"""
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = Path(__file__).resolve().parent.parent / 'icons'
OUT.mkdir(exist_ok=True)
FONT = 'C:/Windows/Fonts/seguibl.ttf'
S = 1024  # rysujemy w dużej rozdzielczości i skalujemy


def background(size):
    img = Image.new('RGB', (size, size))
    px = img.load()
    c0, c1, c2 = (0x3A, 0x63, 0xE8), (0x1F, 0x44, 0xB8), (0x13, 0x2A, 0x7A)
    for y in range(size):
        for x in range(size):
            d = math.hypot(x - size, y) / (size * 1.45)  # światło z prawego górnego rogu
            d = min(1, d)
            if d < .45:
                t = d / .45; c = tuple(round(c0[i] + (c1[i] - c0[i]) * t) for i in range(3))
            else:
                t = (d - .45) / .55; c = tuple(round(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
            px[x, y] = c
    return img


def petals(draw, cx, cy, r, alpha):
    """delikatny kwiat gżelski w tle"""
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for i in range(8):
        a = math.radians(i * 45)
        px, py = cx + math.cos(a) * r * .55, cy + math.sin(a) * r * .55
        ell = Image.new('RGBA', (S, S), (0, 0, 0, 0))
        de = ImageDraw.Draw(ell)
        de.ellipse([px - r * .16, py - r * .38, px + r * .16, py + r * .38], fill=(255, 255, 255, alpha))
        ell = ell.rotate(-math.degrees(a) - 90, center=(px, py))
        layer = Image.alpha_composite(layer, ell)
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - r * .2, cy - r * .2, cx + r * .2, cy + r * .2], fill=(255, 255, 255, int(alpha * 1.6)))
    return layer


def make(scale_letter=1.0):
    bg = background(S).convert('RGBA')
    bg = Image.alpha_composite(bg, petals(None, S * .86, S * .14, S * .42, 30))
    font = ImageFont.truetype(FONT, int(S * .62 * scale_letter))
    txt = 'Я'
    layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    l, t, r, b = d.textbbox((0, 0), txt, font=font)
    w, h = r - l, b - t
    x = (S - w) / 2 - l - S * .01
    y = (S - h) / 2 - t + S * .085 * scale_letter
    # cień
    sh = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((x, y + S * .02), txt, font=font, fill=(8, 20, 70, 120))
    sh = sh.filter(ImageFilter.GaussianBlur(S * .02))
    layer = Image.alpha_composite(layer, sh)
    d = ImageDraw.Draw(layer)
    d.text((x, y), txt, font=font, fill=(255, 255, 255, 255))
    # złoty znak akcentu nad literą
    ax, ay = x + l + w * .58, y + t - S * .175 * scale_letter
    aw, ah = S * .08 * scale_letter, S * .13 * scale_letter
    d.polygon([(ax, ay + ah), (ax + aw * .45, ay + ah), (ax + aw * 1.25, ay), (ax + aw * .55, ay)], fill=(0xFF, 0xC2, 0x3D, 255))
    return Image.alpha_composite(bg, layer)


icon = make(1.0)
for size in (32, 180, 192, 512):
    icon.resize((size, size), Image.LANCZOS).convert('RGB').save(OUT / f'icon-{size}.png', optimize=True)
make(.78).resize((512, 512), Image.LANCZOS).convert('RGB').save(OUT / 'icon-maskable-512.png', optimize=True)
print('ikony zapisane')
