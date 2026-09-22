#!/usr/bin/env python3
"""Reconstruit un PDF « image + couche texte LOGIQUE » depuis un PDF source.

Contexte : les PDF dzexams ont une couche texte irrécupérable (ordre visuel
+ paires de lettres échangées). tesseract reconnaît juste mais sérialise les
mots de gauche à droite (couche visuelle), avec ou sans ocrmypdf. Ce script
prend donc le TSV tesseract (mots logiques + boîtes) et écrit lui-même la
couche invisible avec PyMuPDF : lignes RTL triées droite→gauche, mots en
ordre logique, render_mode=3 (invisible). Fusion image+texte via qpdf.

Usage (sur le runner CI) :
    python3 scripts/ocr-logical-layer.py <src.pdf> <dest.pdf> <qa.txt>

Dépendances runner : tesseract-ocr + langs, qpdf, python3 + pymupdf.
Police arabe : cherchée sur le système, sinon téléchargée (Amiri, OFL).
Tout diagnostic part dans le QA (commité).
"""

import csv
import glob
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

import fitz  # pymupdf

DPI = 300
ARABIC_RE = re.compile(r"[\u0600-\u06FF]")
LATIN_RE = re.compile(r"[A-Za-z]")
AMIRI_URL = "https://github.com/google/fonts/raw/main/ofl/amiri/Amiri-Regular.ttf"
QA: list = []


def qa(msg: str) -> None:
    QA.append(msg)
    print(msg, flush=True)


def roundtrip_ok(fontfile: str) -> bool:
    try:
        d = fitz.open()
        p = d.new_page(width=400, height=100)
        p.insert_text(
            fitz.Point(10, 50), "الجمهورية ابتث 2019", fontfile=fontfile, fontsize=12, render_mode=0
        )
        t = p.get_text()
        d.close()
        return "الجمهورية" in t and "ابتث" in t
    except Exception:  # noqa: BLE001
        return False


def arabic_font(tmpdir: Path) -> str:
    cands = sorted(glob.glob("/usr/share/fonts/**/*.ttf", recursive=True))
    cands.sort(key=lambda c: (0 if re.search(r"amir|arab|naskh|lateef|kacst|scheher|noto", c, re.I) else 1))
    qa(f"polices candidates : {len(cands)}")
    for cand in cands[:40]:
        if roundtrip_ok(cand):
            qa(f"police système OK : {cand}")
            return cand
    dest = tmpdir / "Amiri-Regular.ttf"
    urllib.request.urlretrieve(AMIRI_URL, str(dest))
    if roundtrip_ok(str(dest)):
        qa(f"police téléchargée OK : Amiri OFL ({dest.stat().st_size} o)")
        return str(dest)
    raise RuntimeError("aucune police arabe utilisable")


def read_tsv(path: Path):
    words = []
    with open(path, encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t", quoting=csv.QUOTE_NONE)
        for row in reader:
            try:
                if int(row["level"]) != 5:
                    continue
                text = (row["text"] or "").strip()
                if not text:
                    continue
                words.append(
                    {
                        "line": (int(row["block_num"]), int(row["par_num"]), int(row["line_num"])),
                        "left": int(row["left"]),
                        "top": int(row["top"]),
                        "w": int(row["width"]),
                        "h": int(row["height"]),
                        "conf": float(row["conf"]),
                        "text": text,
                    }
                )
            except (ValueError, KeyError):
                continue
    return words


def main(src: str, dest: str, qa_path: str) -> int:
    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        try:
            fontfile = arabic_font(tmpdir)
        except Exception as e:  # noqa: BLE001
            qa(f"POLICE INTROUVABLE : {type(e).__name__}: {e}")
            Path(qa_path).write_text("\n".join(QA) + "\n", encoding="utf-8")
            return 2
        doc = fitz.open(src)
        qa(f"SRC {src} : {doc.page_count} pages")
        img_doc = fitz.open()
        txt_doc = fitz.open()
        for pno in range(doc.page_count):
            try:
                page = doc[pno]
                pix = page.get_pixmap(dpi=DPI)
                w_pt, h_pt = pix.width * 72 / DPI, pix.height * 72 / DPI
                img = tmpdir / f"p{pno}.jpg"
                pix.save(str(img), jpg_quality=85)
                ip = img_doc.new_page(width=w_pt, height=h_pt)
                ip.insert_image(fitz.Rect(0, 0, w_pt, h_pt), stream=img.read_bytes())
                base = tmpdir / f"p{pno}"
                r = subprocess.run(
                    ["tesseract", str(img), str(base), "-l", "ara+fra+eng", "tsv"],
                    capture_output=True,
                    text=True,
                    timeout=600,
                )
                if r.returncode != 0:
                    qa(f"page {pno + 1} : TESSERACT EXIT {r.returncode} :: {r.stderr[:200]}")
                    failures += 1
                    txt_doc.new_page(width=w_pt, height=h_pt)
                    continue
                words = read_tsv(base.with_suffix(".tsv"))
                lines: dict = {}
                for w in words:
                    lines.setdefault(w["line"], []).append(w)
                tp = txt_doc.new_page(width=w_pt, height=h_pt)
                rtl_count = 0
                for key in sorted(lines, key=lambda k: min(w["top"] for w in lines[k])):
                    line = lines[key]
                    joined = " ".join(w["text"] for w in line)
                    rtl = len(ARABIC_RE.findall(joined)) >= len(LATIN_RE.findall(joined))
                    rtl_count += 1 if rtl else 0
                    ordered = sorted(line, key=lambda w: w["left"], reverse=rtl)
                    for w in ordered:
                        x_pt = w["left"] * 72 / DPI
                        h_pt_w = max(w["h"] * 72 / DPI, 4)
                        baseline = h_pt - (w["top"] + 0.8 * w["h"]) * 72 / DPI
                        tp.insert_text(
                            fitz.Point(x_pt, baseline),
                            w["text"],
                            fontfile=fontfile,
                            fontsize=max(h_pt_w * 0.72, 4),
                            render_mode=3,
                        )
                confs = [w["conf"] for w in words]
                lo = sum(1 for c in confs if c < 30)
                qa(f"page {pno + 1} : mots={len(words)} lignes={len(lines)} rtl={rtl_count} conf<30={lo}")
                if pno == 0:
                    first = sorted(lines, key=lambda k: min(w["top"] for w in lines[k]))[0]
                    qa("  ligne1 : " + " | ".join(w["text"] for w in lines[first][:8]))
            except Exception as e:  # noqa: BLE001
                qa(f"page {pno + 1} : ERREUR {type(e).__name__}: {str(e)[:300]}")
                failures += 1
        img_path = tmpdir / "img.pdf"
        txt_path = tmpdir / "txt.pdf"
        img_doc.save(str(img_path))
        txt_doc.save(str(txt_path))
        qa(f"img={img_path.stat().st_size} txt={txt_path.stat().st_size} échecs={failures}")
        r = subprocess.run(
            ["qpdf", str(img_path), "--overlay", str(txt_path), "--", dest],
            capture_output=True,
            text=True,
            timeout=300,
        )
        qa(f"qpdf exit={r.returncode} {r.stderr[:200]}")
        if r.returncode != 0:
            Path(qa_path).write_text("\n".join(QA) + "\n", encoding="utf-8")
            return 2
        final = fitz.open(dest)
        qa(f"FINAL {dest} : {final.page_count} pages, {Path(dest).stat().st_size} octets")
        for pno in range(min(final.page_count, 2)):
            qa(f"--- page {pno + 1} couche finale ---")
            qa(final[pno].get_text()[:500].replace("\n", " / "))
        qa(f"HEADER_LOGIQUE={'OUI' if 'الجمهورية الجزائرية الديمقراطية الشعبية' in final[0].get_text() else 'NON'}")
        final.close()
    Path(qa_path).write_text("\n".join(QA) + "\n", encoding="utf-8")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    try:
        code = main(sys.argv[1], sys.argv[2], sys.argv[3])
    except Exception as e:  # noqa: BLE001
        Path(sys.argv[3]).write_text(
            "\n".join(QA) + f"\nPLANTAGE SCRIPT: {type(e).__name__}: {e}\n", encoding="utf-8"
        )
        raise
    sys.exit(code)
