#!/usr/bin/env python3
"""Reconstruit un PDF « image + couche texte LOGIQUE » depuis un PDF source.

Contexte : les PDF dzexams ont une couche texte irrécupérable (ordre visuel
+ paires de lettres échangées : « اجلمهورية »). ocrmypdf sérialise les mots
de gauche à droite (couche visuelle). En revanche tesseract émet les mots
hOCR en ordre logique — et son moteur PDF propre (`tesseract … pdf`) écrit
la couche dans cet ordre : on l'utilise directement, sans ocrmypdf.

Pipeline : rendu 300 dpi (JPEG q85) → tesseract pdf par page → fusion.
Le diagnostic part dans le fichier QA (commité) car les logs Actions sont
inaccessibles depuis le sandbox.

Usage (sur le runner CI) :
    python3 scripts/ocr-logical-layer.py <src.pdf> <dest.pdf> <qa.txt> <hocr_p1.html>
"""

import subprocess
import sys
import tempfile
from pathlib import Path

import fitz  # pymupdf

DPI = 300
QA: list = []


def qa(msg: str) -> None:
    QA.append(msg)
    print(msg, flush=True)


def main(src: str, dest: str, qa_path: str, hocr_sample_path: str) -> int:
    failures = 0
    with tempfile.TemporaryDirectory() as tmp:
        tmpdir = Path(tmp)
        doc = fitz.open(src)
        qa(f"SRC {src} : {doc.page_count} pages")
        merged = fitz.open()
        for pno in range(doc.page_count):
            try:
                pix = doc[pno].get_pixmap(dpi=DPI)
                img = tmpdir / f"p{pno}.jpg"
                pix.save(str(img), jpg_quality=85)
                base = tmpdir / f"p{pno}"
                r = subprocess.run(
                    ["tesseract", str(img), str(base), "-l", "ara+fra+eng", "pdf"],
                    capture_output=True,
                    text=True,
                    timeout=600,
                )
                if r.returncode != 0:
                    qa(f"page {pno + 1} : TESSERACT EXIT {r.returncode} :: {r.stderr[:300]}")
                    failures += 1
                    continue
                one = fitz.open(tmpdir / f"p{pno}.pdf")
                merged.insert_pdf(one)
                one.close()
                if pno == 0:
                    h = subprocess.run(
                        ["tesseract", str(img), str(tmpdir / "p0h"), "-l", "ara+fra+eng", "hocr"],
                        capture_output=True,
                        text=True,
                        timeout=600,
                    )
                    if h.returncode == 0:
                        Path(hocr_sample_path).write_bytes((tmpdir / "p0h.hocr").read_bytes())
                        qa("hocr p1 : OK")
                    else:
                        qa(f"hocr p1 : EXIT {h.returncode}")
            except Exception as e:  # noqa: BLE001 - tout échec est consigné
                qa(f"page {pno + 1} : ERREUR {type(e).__name__}: {str(e)[:300]}")
                failures += 1
        if merged.page_count == 0:
            qa("AUCUNE PAGE PRODUITE")
            Path(qa_path).write_text("\n".join(QA) + "\n", encoding="utf-8")
            return 2
        merged.save(dest, garbage=4, deflate=True)
        qa(f"FINAL {dest} : {merged.page_count} pages, {Path(dest).stat().st_size} octets, échecs={failures}")
        for pno in range(min(merged.page_count, 2)):
            t = merged[pno].get_text()[:500].replace("\n", " / ")
            qa(f"--- page {pno + 1} couche finale ---")
            qa(t)
        probe = "الجمهورية الجزائرية الديمقراطية الشعبية"
        qa(f"HEADER_LOGIQUE={'OUI' if probe in merged[0].get_text() else 'NON'}")
        merged.close()
    Path(qa_path).write_text("\n".join(QA) + "\n", encoding="utf-8")
    return 0 if failures == 0 else 1


if __name__ == "__main__":
    try:
        code = main(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
    except Exception as e:  # noqa: BLE001
        Path(sys.argv[3]).write_text(
            "\n".join(QA) + f"\nPLANTAGE SCRIPT: {type(e).__name__}: {e}\n", encoding="utf-8"
        )
        raise
    sys.exit(code)
