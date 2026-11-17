"""Optional authoring tool; deployment and CI use the checked-in SVG/PDF files.

Requires pdflatex (TikZ, pgfplots, tcolorbox, standalone) and PyMuPDF.
Run from any directory: python scripts/export-equilibrium.py
"""
from pathlib import Path
import subprocess, tempfile, shutil, xml.etree.ElementTree as ET
import fitz

root=Path(__file__).resolve().parents[1]
sources=root/'docs/sources/equilibrio'
destination=root/'public/assets/articles/equilibrio'
allowed={'svg','defs','g','path','use','clipPath','rect','pattern'}
with tempfile.TemporaryDirectory(prefix='equilibrio-') as temporary:
    work=Path(temporary)
    for name,passes in [('equilibrio-figure-web',1),('equilibrio-stampa',2)]:
        shutil.copyfile(sources/(name+'.tex'),work/(name+'.tex'))
        for _ in range(passes):
            result=subprocess.run(['pdflatex','-no-shell-escape','-interaction=nonstopmode','-halt-on-error',name+'.tex'],cwd=work,capture_output=True,text=True)
            if result.returncode:
                raise RuntimeError(result.stdout[-5000:])
    document=fitz.open(work/'equilibrio-figure-web.pdf')
    if len(document)!=44: raise ValueError('Expected 44 figure pages')
    vectors=[]
    for page in document:
        svg=page.get_svg_image(text_as_path=True)
        if any(node.tag.rsplit('}',1)[-1] not in allowed for node in ET.fromstring(svg).iter()):
            raise ValueError('Only passive vector geometry is allowed')
        vectors.append(svg)
    destination.mkdir(parents=True,exist_ok=True)
    for i,svg in enumerate(vectors,1):
        (destination/f'figure-{i:02d}.svg').write_text(svg)
    shutil.copyfile(work/'equilibrio-stampa.pdf',root/'public/media/docs/equilibrio-sul-tappetino.pdf')
print('Exported 44 vector diagrams and the print PDF.')
