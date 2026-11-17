#!/usr/bin/env python3
"""
The paperback as an object, for the website: renders each edition's real print cover (out/*-cover.pdf) into a
standing book — front face, spine, page block, floor shadow — on a transparent background.
Writes public/print/book-{lang}.webp (and .png). Run after build.py:  python3 print/mockup.py
Needs: pdftoppm (poppler), Pillow, numpy.
"""
import json
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'out'
PUBLIC = ROOT.parent / 'public' / 'print'
DPI, BLEED, TW, TH = 200, 0.125, 5.5, 8.5


def coeffs(src, dst):
    a, b = [], []
    for (x, y), (X, Y) in zip(dst, src):
        a += [[x, y, 1, 0, 0, 0, -X * x, -X * y], [0, 0, 0, x, y, 1, -Y * x, -Y * y]]
        b += [X, Y]
    return np.linalg.solve(np.array(a, float), np.array(b, float)).tolist()


def render(lang: str, spine_in: float) -> Image.Image:
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['pdftoppm', '-r', str(DPI), '-png', '-singlefile', str(OUT / f'broken-collective-{lang}-cover.pdf'), f'{tmp}/c'], check=True)
        im = Image.open(f'{tmp}/c.png').convert('RGB')
    px = lambda v: int(v * DPI)
    top, bottom = px(BLEED), px(BLEED + TH)
    spine = im.crop((px(BLEED + TW), top, px(BLEED + TW + spine_in), bottom))
    if lang == 'en':  # back | spine | front
        front = im.crop((px(BLEED + TW + spine_in), top, px(BLEED + 2 * TW + spine_in), bottom))
    else:  # right-to-left: front | spine | back
        front = im.crop((px(BLEED), top, px(BLEED + TW), bottom))
    fw, fh = front.size
    canvas = Image.new('RGBA', (1600, 1900), (0, 0, 0, 0))

    def place(img, quad):
        w, h = img.size
        t = img.convert('RGBA').transform(canvas.size, Image.PERSPECTIVE, coeffs([(0, 0), (w, 0), (w, h), (0, h)], quad), Image.BICUBIC)
        canvas.alpha_composite(t)

    ox, oy, depth, fW = 330, 180, int(spine.size[0] * 0.9), int(fw * 0.92)
    shadow = Image.new('RGBA', canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(shadow).polygon([(ox + 60, oy + fh + 10), (ox + fW + depth + 80, oy + fh - 20), (ox + fW + depth + 200, oy + fh + 60), (ox + 120, oy + fh + 90)], fill=(40, 25, 15, 120))
    canvas.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(40)))
    pages = Image.new('RGB', (40, fh), (238, 228, 206))
    d = ImageDraw.Draw(pages)
    for y in range(0, fh, 3):
        d.line([(0, y), (40, y)], fill=(222, 210, 186))
    dark = Image.blend(spine, Image.new('RGB', spine.size, (0, 0, 0)), 0.18)
    if lang == 'en':  # spine on the left
        fx = ox + depth
        place(pages, [(fx + fW, oy + 28), (fx + fW + 14, oy + 40), (fx + fW + 14, oy + fh - 4), (fx + fW, oy + fh - 10)])
        place(dark, [(ox, oy + 18), (fx, oy), (fx, oy + fh), (ox, oy + fh - 14)])
        place(front, [(fx, oy), (fx + fW, oy + 28), (fx + fW, oy + fh - 10), (fx, oy + fh)])
    else:  # spine on the right
        place(pages, [(ox - 14, oy + 40), (ox, oy + 28), (ox, oy + fh - 10), (ox - 14, oy + fh - 4)])
        place(dark, [(ox + fW, oy), (ox + fW + depth, oy + 18), (ox + fW + depth, oy + fh - 14), (ox + fW, oy + fh)])
        place(front, [(ox, oy + 28), (ox + fW, oy), (ox + fW, oy + fh), (ox, oy + fh - 10)])
    bb = canvas.getbbox()
    out = canvas.crop((bb[0] - 30, bb[1] - 30, bb[2] + 30, bb[3] + 30))
    return out.resize((out.size[0] * 900 // out.size[1], 900), Image.LANCZOS)


if __name__ == '__main__':
    editions = json.loads((OUT / 'editions.json').read_text())
    PUBLIC.mkdir(parents=True, exist_ok=True)
    for lang, e in editions.items():
        img = render(lang, e['spine_in'])
        img.save(PUBLIC / f'book-{lang}.webp', quality=88)
        img.save(PUBLIC / f'book-{lang}.png', optimize=True)
        print(lang, img.size)
