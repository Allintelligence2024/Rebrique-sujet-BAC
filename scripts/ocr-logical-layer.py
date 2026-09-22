#!/usr/bin/env python3
"""Reconstruit un PDF « image + couche texte LOGIQUE » depuis un PDF source.

Contexte : les PDF dzexams ont une couche texte irrécupérable (ordre visuel
+ paires de lettres échangées : « اجلمهورية »). ocrmypdf seul produit une
couche visuelle (mots miroirs) car il sérialise les mots hOCR de gauche à
droite. Ce script réordonne les mots de chaque ligne RTL de droite à gauche
AVANT la transformation hOCR→PDF (ocrmypdf.hocrtransform), puis fusionne la
couche texte invisible avec le rendu 300 dpi via qpdf --overlay.

Usage (sur le runner CI, jamais dans le sandbox) :
    python3 scripts/ocr-logical-layer.py <src.pdf> <dest.pdf> <qa.txt> <hocr_p1.html>

Dépendances runner : tesseract-ocr + tesseract-ocr-{ara,fra,eng}, qpdf,
python3 + ocrmypdf + pymupdf (pip). Tout échec de page est consigné dans le
fichier QA (jamais silencieux) car les logs Actions sont inaccessibles depuis
le sandbox.
"""

import re
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz  # pymupdf
from lxml import etree

ARABIC_RE = re.compile(r"[\u0600-\u06FF]")
LATIN_RE = re.compile(r"[A-Za-z]")
BBOX_RE = re.compile(r"bbox (\d+) (\d+) (\d+) (\d+)")
DPI = 300

qa_lines: list = []


def qa(msg: str) -> None:
    qa_lines.append(msg)
    print(msg, flush=True)


def bbox_of(word) -> tuple:
    m = BBOX_RE.search(word.get("title", ""))
    return tuple(map(int, m.groups())) if m else (0, 0, 0, 0)


def is_rtl_line(words) -> bool:
    text = " ".join((w.text or "") for w in words)
    return len(ARABIC_RE.findall(text)) >= len(LATIN_RE.findall(text))


def reorder_hocr_rtl(hocr_path: Path) -> tuple:
    """Réordonne les mots (RTL : droite→gauche) et retourne (octets, stats)."""
    parser = etree.HTMLParser()
    tree = etree.parse(str(hocr_path), parser)
    lines = tree.xpath("//*[contains(@class, 'ocr_line')]")
    rtl_lines = 0
    words_moved = 0
    sample_before = ""
    sample_after = ""
    for li, line in enumerate(lines):
        words = line.xpath(".//*[contains(@class, 'ocrx_word')]")
        if len(words) < 2:
            continue
        if not is_rtl_line(words):
            continue
        rtl_lines += 1
        before = [w.text or "" for w in words]
        if li < 3 and not sample_before:
            sample_before = " | ".join(before[:6])
        ordered = sorted(words, key=lambda w: bbox_of(w)[0], reverse=True)
        if [w.text for w in ordered] != [w.text for w in words]:
            words_moved += 1
        for w in words:
            line.remove(w)
        for w in ordered:
            line.append(w)
        if li < 3 and not sample_after:
            sample_after = " | ".join((w.text or "") for w in ordered[:6])
    stats = f"lignes={len(lines)} rtl={rtl_lines} réordonnées={words_moved}"
    return etree.tostring(tree, encoding="utf-8"), stats, sample_before, sample_after


def load_hocr_transform():
    import ocrmypdf

    qa(f"ocrmypdf version={ocrmypdf.__version__}")
    try:
        from ocrmypdf.hocrtransform import HocrTransform

        qa("HocrTransform via ocrmypdf.hocrtransform")
        return HocrTransform
    except ImportError as e:
        qa(f"import direct impossible : {e}")
    import ocrmypdf.hocrtransform as ht

    qa("exports hocrtransform : " + ", ".join(n for n in dir(ht) if not n.startswith("_"))[:300])
    from ocrmypdf.hocrtransform.hocrtransform import HocrTransform

    qa("HocrTransform via ocrmypdf.hocrtransform.hocrtransform")
    return HocrTransform


def main(src: str, dest: str, qa_path: str, hocr_sample_path: str) -> int:
    HocrTransform = load_hocr_transform()

    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        doc = fitz.open(src)
        qa(f"SRC {src} : {doc.page_count} pages")
        img_pdf = fitz.open()
        txt_pdf = fitz.open()
        for pno in range(doc.page_count):
            try:
                page = doc[pno]
                pix = page.get_pixmap(dpi=DPI)
                png = tmpdir / f"p{pno}.png"
                pix.save(str(png))
                w_pt, h_pt = pix.width * 72 / DPI, pix.height * 72 / DPI
                ip = img_pdf.new_page(width=w_pt, height=h_pt)
                ip.insert_image(fitz.Rect(0, 0, w_pt, h_pt), stream=png.read_bytes())
                base = tmpdir / f"p{pno}"
                r = subprocess.run(
                    ["tesseract", str(png), str(base), "-l", "ara+fra+eng", "hocr"],
                    capture_output=True,
                    text=True,
                    timeout=600,
                )
                if r.returncode != 0:
                    qa(f"page {pno + 1} : TESSERACT EXIT {r.returncode} :: {r.stderr[:300]}")
                    failures += 1
                    continue
                hocr_bytes, stats, before, after = reorder_hocr_rtl(base.with_suffix(".hocr"))
                qa(f"page {pno + 1} : {stats}")
                if before:
                    qa(f"  avant : {before[:160]}")
                    qa(f"  après : {after[:160]}")
                if pno == 0:
                    Path(hocr_sample_path).write_bytes(hocr_bytes)
                fixed = tmpdir / f"p{pno}.fixed.hocr"
                fixed.write_bytes(hocr_bytes)
                try:
                    tr = HocrTransform(str(fixed), dpi=DPI)
                except TypeError:
                    tr = HocrTransform(str(fixed))
                try:
                    pdf_bytes = tr.to_pdf()
                except TypeError:
                    tmp_pdf = tmpdir / f"p{pno}.txt.pdf"
                    tr.to_pdf(str(tmp_pdf))
                    pdf_bytes = tmp_pdf.read_bytes()
                tp = fitz.open(stream=pdf_bytes, filetype="pdf")
                txt_pdf.insert_pdf(tp, from_page=0, to_page=0)
                tp.close()
            except Exception as e:  # noqa: BLE001 - tout échec est consigné
                qa(f"page {pno + 1} : ERREUR {type(e).__name__}: {str(e)[:300]}")
                failures += 1
                # Page blanche de même taille : garde l'alignement img/txt.
                try:
                    w_pt, h_pt = pix.width * 72 / DPI, pix.height * 72 / DPI
                    txt_pdf.new_page(width=w_pt, height=h_pt)
                except Exception:  # noqa: BLE001, S110
                    pass
        img_path = tmpdir / "img.pdf"
        txt_path = tmpdir / "txt.pdf"
        img_pdf.save(str(img_path))
        txt_pdf.save(str(txt_path))
        qa(f"img.pdf={img_path.stat().st_size} txt.pdf={txt_path.stat().st_size} échecs={failures}")
        r = subprocess.run(
            ["qpdf", str(img_path), "--overlay", str(txt_path), "--", dest],
            capture_output=True,
            text=True,
            timeout=300,
        )
        qa(f"qpdf overlay exit={r.returncode} {r.stderr[:200]}")
        if r.returncode != 0:
            return 2
        # QA : extrait le texte final (doit être logique : الجمهورية…).
        final = fitz.open(dest)
        qa(f"FINAL {dest} : {final.page_count} pages, {Path(dest).stat().st_size} octets")
        for pno in range(min(final.page_count, 2)):
            t = final[pno].get_text()[:500].replace("\n", " / ")
            qa(f"--- page {pno + 1} couche finale ---")
            qa(t)
        probe = "الجمهورية الجزائرية الديمقراطية الشعبية"
        qa(f"HEADER_LOGIQUE={'OUI' if probe in final[0].get_text() else 'NON'}")
        final.close()
    Path(qa_path).write_text("\n".join(qa_lines) + "\n", encoding="utf-8")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    try:
        code = main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    except Exception as e:  # noqa: BLE001
        Path(sys.argv[3]).write_text(
            "\n".join(qa_lines) + f"\nPLANTAGE SCRIPT: {type(e).__name__}: {e}\n", encoding="utf-8"
        )
        raise
    sys.exit(code)
