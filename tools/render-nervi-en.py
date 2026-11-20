"""Typeset the seven English figures from the author's original TikZ drawings.
Requires pdfLaTeX with TikZ and the standalone class, and Poppler.
"""
from collections import defaultdict
from pathlib import Path
from subprocess import run
from tempfile import TemporaryDirectory
from zipfile import ZipFile

root = Path(__file__).resolve().parents[1]
translations = defaultdict(list)
for line in (root / 'docs/sources/colpire-i-nervi/etichette-en.tsv').read_text().splitlines():
    number, original, english = line.split('\t')
    translations[number].append((original, english))

with ZipFile(root / 'source-materials/Colpire_i_nervi_del_sistema_Overleaf.zip') as archive, TemporaryDirectory() as directory:
    work = Path(directory)
    main = archive.read('main.tex').decode()
    colours = main[main.index(r'\definecolor{ink}'):main.index(r'\hypersetup')]
    styles = main[main.index(r'\tikzset{'):main.index(r'\newcommand{\figura}')]
    layout = r'''\documentclass[border=4pt]{standalone}
\usepackage{xcolor,tikz}
\pdfmapfile{+cm.map}
\usetikzlibrary{arrows.meta,calc,positioning,backgrounds,decorations.pathreplacing,fit}
''' + colours + styles + '\\begin{document}\n'
    for number, labels in sorted(translations.items()):
        [filename] = [name for name in archive.namelist() if name.startswith('figure/'+number+'-')]
        drawing = archive.read(filename).decode()
        for original, english in labels:
            if original not in drawing:
                raise ValueError(f'{filename}: missing label {original}')
            drawing = drawing.replace(original, english)
        tex = work / 'diagram.tex'
        tex.write_text(layout + drawing + '\\end{document}\n')
        result = run(['pdflatex','-halt-on-error','-interaction=nonstopmode',tex.name],cwd=work,capture_output=True,text=True)
        if result.returncode:
            raise RuntimeError(result.stdout[-4500:])
        name = root / f'public/media/images/colpire-nervi-fig-{number}-en'
        run(['pdftocairo','-png','-r','175','-singlefile',str(work/'diagram.pdf'),str(name)],check=True)
        print(name.name)
