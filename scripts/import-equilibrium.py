from pathlib import Path
import argparse, re, json, subprocess, html, hashlib

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT
ORIGINAL=ROOT/'docs/sources/equilibrio/equilibrio-originale.tex'
SLUG='lequilibrio-sul-tappetino'
parser=argparse.ArgumentParser(description='Generate the web article and its Markdown mirror.')
parser.add_argument('--language', choices=['it','en'], default='it')
language=parser.parse_args().language
english=language=='en'
source_dir=ROOT/'docs/sources/equilibrio'
tex=(source_dir/('equilibrio-en.tex' if english else 'equilibrio-editoriale.tex')).read_text()

# Both versions use the same vector geometry. Translate only visible SVG text.
labels=dict(line.split('\t',1) for line in (source_dir/'etichette-en.tsv').read_text().splitlines()) if english else {}
shared_labels={'Śīrṣāsana','Śavāsana','Samasthiti','Utthita Hasta','Pādāṅguṣṭhāsana','Ūrdhva Dhanurāsana','θ','āsana','dropback','+','='}

def english_label(match):
    label=html.unescape(match[2])
    if label in shared_labels or re.fullmatch(r'[0-9., ]+',label):
        return match[0]
    return match[1]+html.escape(labels[label])+match[3]

# Keep all paths and commands, rounding only path coordinates in inline SVG.
# Exported SVGs remain untouched. Maximum rounding error is 0.0005 SVG units.
def compact_paths(svg):
    def compact(match):
        def rounded(number):
            value = round(float(number[0]), 3)
            return f'{value:.3f}'.rstrip('0').rstrip('.') if value else '0'
        coordinates = re.sub(r'-?(?:[0-9]+\.[0-9]+|\.[0-9]+)(?:[eE][+-]?[0-9]+)?', rounded, match[2])
        return match[1] + coordinates + match[3]
    return re.sub(r'(<path\b[^>]*?\sd=")([^"]+)(")', compact, svg)

def brace(s, pos):
    assert s[pos]=='{'
    depth=1; start=pos+1; pos+=1
    while depth:
        if s[pos]=='\\': pos+=2; continue
        if s[pos]=='{': depth+=1
        if s[pos]=='}': depth-=1
        pos+=1
    return s[start:pos-1],pos

def pandoc(s, target='html5'):
    return subprocess.run(['pandoc','-f','latex','-t',target,'--mathml','--shift-heading-level-by=1','--wrap=none'],input=s,text=True,capture_output=True,check=True).stdout

figs=re.findall(r'\\begin\{figure\}.*?\\end\{figure\}',tex,re.S)
assert len(figs)==44
if english:
    italian=json.loads((ROOT/'src/scientific-articles'/ (SLUG+'.json')).read_text())
    assert [re.search(r'\\label\{([^}]+)\}',f)[1] for f in figs]==[f['label'] for f in italian]
figlabels={re.search(r'\\label\{([^}]+)\}',f)[1]:i for i,f in enumerate(figs,1)}
body=tex.split(r'\begin{document}',1)[1].split(r'\end{document}')[0]
sections=re.findall(r'\\section\*?\{([^}]+)\}(?:\\label\{([^}]+)\})?',body)
seclabels={label:(i,title) for i,(title,label) in enumerate(sections,1) if label}

def refs(s):
    def replace(m):
        k=m[1]
        if k in figlabels:
            n=figlabels[k]; return r'\href{articolo-'+SLUG+f'.html#figura-{n:02d}'+'}{'+str(n)+'}'
        i,title=seclabels[k]
        return r'\href{articolo-'+SLUG+f'.html#capitolo-{i}'+'}{'+str(i-1)+'}'
    return re.sub(r'\\ref\{([^}]+)\}',replace,s)

manifest=[]
for i,f in enumerate(figs,1):
    caption=brace(f,f.index('{',f.index(r'\caption')))[0]
    caphtml=pandoc(refs(caption)).strip()
    caphtml=re.sub(r'^<p>|</p>$','',caphtml)
    plain=pandoc(caption,'plain').strip()
    manifest.append({'number':i,'label':re.search(r'\\label\{([^}]+)\}',f)[1],'caption':caphtml,'alt':plain,'file':f'figure-{i:02d}.svg'})
    body=body.replace(f,'\n\nEQUILIBRIUMFIGURE'+f'{i:02d}'+'\n\n')

body=body.replace(r'\frontespizio',r'\begin{quote}\emph{sthira-sukham āsanam}\\'+('Let the asana be steady and comfortable.' if english else 'La posizione sia stabile e piacevole.')+r'\\Patañjali, Yogasūtra II.46\end{quote}')
body=re.sub(r'\\paragraph\{([^}]+)\}',r'\\textbf{\1.}',body)
body=refs(body)
body=re.sub(r'\\label\{[^}]+\}','',body)
# The supplied file contains the coordinates, but no separate Python attachment.
body=body.replace(r'Le coordinate sono già incluse nel sorgente; lo script allegato \textsf{rigenera\_grafici.py} permette di rigenerarle.', 'Le coordinate numeriche sono incluse nel sorgente LaTeX, conservato nel pacchetto del sito insieme agli strumenti per esportare le figure.')
boxes=[]
def box(m):
    kind=m[1]; arg=m[2] or ''; content=m[3]
    title=arg[1:-1]
    boxes.append((kind,title,pandoc(content)))
    return '\n\nEQUILIBRIUMBOX'+f'{len(boxes):02d}'+'\n\n'
body=re.sub(r'\\begin\{(riquadro|parola|formule)\}(\{[^}]*\})?([\s\S]*?)\\end\{\1\}',box,body)
result=pandoc(body)
assert 'EQUILIBRIUMFIGURE44' in result
for i,(kind,title,content) in enumerate(boxes,1):
    if kind=='formule':
        markup=f'<details class="science-formula"><summary>{html.escape(title)}</summary><div>{content}</div></details>'
    else:
        markup=f'<aside class="science-note"><p class="science-note-title">{html.escape(title)}</p>{content}</aside>'
    result=result.replace(f'<p>EQUILIBRIUMBOX{i:02d}</p>',markup)
for f in manifest:
    i=f['number']; asset='assets/articles/equilibrio/'+f['file']
    svg=compact_paths((SOURCE/'public'/asset).read_text())
    if english:
        svg=re.sub(r'(<text\b[^>]*>)([^<]*)(</text>)',english_label,svg)
    svg=svg.replace(f'<title id="eq-{i:02d}-title">Diagramma {i}</title>',f'<title id="eq-{i:02d}-title">{html.escape(f["alt"])}</title>')
    heading='DIAGRAM' if english else 'DIAGRAMMA'
    explore='Explore' if english else 'Esplora'
    expand=f'Enlarge diagram {i}' if english else f'Ingrandisci il diagramma {i}'
    board=f'Diagram {i}, scrollable area' if english else f'Diagramma {i}, area scorrevole'
    figure='Figure' if english else 'Figura'
    markup=f'''<figure class="science-figure" id="figura-{i:02d}">
<div class="science-figure-head"><span>{heading} {i:02d}</span><a href="#figura-{i:02d}" data-travel-photo data-science-figure aria-haspopup="dialog" aria-label="{expand}">{explore} ↗</a></div>
<div class="science-board" tabindex="0" role="region" aria-label="{board}">{svg}</div>
<figcaption><strong>{figure} {i}.</strong> {f['caption']}</figcaption></figure>'''
    result=result.replace(f'<p>EQUILIBRIUMFIGURE{i:02d}</p>',markup)
key_title='Diagram key' if english else 'Come leggere le figure'
key_label='Diagram key' if english else 'Legenda dei diagrammi'
key_items=['Motion','Energy','Equilibria and boundaries','Disturbances and corrections'] if english else ['Movimento','Energia','Equilibri e frontiere','Perturbazioni e correzioni']
legend=''.join(f'<span class="sd-{kind}">{label}</span>' for kind,label in zip(['motion','energy','boundary','correction'],key_items))
result=re.sub(r'<aside class="science-note"><p class="science-note-title">'+key_title+r'</p>.*?</aside>', f'<div class="science-legend" aria-label="{key_label}">{legend}</div>',result,flags=re.S)
assert not re.search(r'<span class="math (?:display|inline)"|\$\$',result), 'Unconverted mathematics'
result=f'<div class="scientific-article" lang="{language}" data-travel-gallery>\n'+result+'\n</div>'
# Share entry anchors between the rendered glossary and the bilingual search index.
terms=iter(range(1,100))
result=re.sub(r'<dt>',lambda _:f'<dt id="glossario-{next(terms):02d}" tabindex="-1">',result)
# Pandoc emits redundant inline style on definition-list terms. CSS owns styling.
result=re.sub(r' style="[^"]*"','',result)
assert not re.search(r'EQUILIBRIUM(?:BOX|FIGURE)|<script|onload=',result)
target=SOURCE/'src/scientific-articles';target.mkdir(exist_ok=True)
stem=SLUG+('.en' if english else '')
(target/(stem+'.html')).write_text(result)
(target/(stem+'.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
plain=pandoc(body,'gfm')
for i,(_,title,content) in enumerate(boxes,1):
    text=subprocess.run(['pandoc','-f','html','-t','gfm','--wrap=none'],input=content,text=True,capture_output=True,check=True).stdout
    plain=plain.replace(f'EQUILIBRIUMBOX{i:02d}','**'+title+'**\n\n'+text)
for f in manifest: plain=plain.replace(f'EQUILIBRIUMFIGURE{f["number"]:02d}',f'{figure} {f["number"]}. '+f['alt'])
front='''---
title: L’equilibrio sul tappetino
subtitle: Un’introduzione illustrata alla teoria della stabilità di Lyapunov attraverso quattro esempi della pratica.
category: Saggi
excerpt: Che cosa significa restare in equilibrio? Palline, pendoli e quattro esempi della pratica yoga accompagnano un percorso illustrato fra stabilità, energia, retroazione e geometria degli stati.
date: 2026-11-17
tags: Geometria, Yoga, Lyapunov, Stabilità, Sistemi dinamici
draft: false
sourceStatus: approved
pdf: media/docs/equilibrio-sul-tappetino.pdf
---

'''
if english:
    front="""---
title: Balance on the Mat
subtitle: An illustrated introduction to Lyapunov stability through four examples from yoga practice.
category: Essays
excerpt: What does it mean to keep your balance? A ball in a bowl, an inverted pendulum and four examples from yoga illustrate stability, energy, feedback and the geometry of state space.
---

"""
posts=SOURCE/('content/markdown/en/posts' if english else 'content/markdown/posts')
(posts/(SLUG+'.md')).write_text(front+plain)
inputs=[Path(__file__),source_dir/('equilibrio-en.tex' if english else 'equilibrio-editoriale.tex')]
if english:
    inputs.extend([source_dir/'etichette-en.tsv',target/(SLUG+'.json')])
inputs.extend(SOURCE/'public/assets/articles/equilibrio'/f['file'] for f in manifest)
outputs=[target/(stem+'.html'),target/(stem+'.json'),posts/(SLUG+'.md')]
fingerprints={str(f.relative_to(ROOT)):hashlib.sha256(f.read_bytes()).hexdigest() for f in inputs+outputs}
(target/(stem+'.build.json')).write_text(json.dumps(fingerprints,indent=2)+'\n')
print(json.dumps({'figures':len(manifest),'boxes':len(boxes),'sections':len(sections),'htmlBytes':len(result.encode()),'originalSha256':hashlib.sha256(ORIGINAL.read_bytes()).hexdigest()},indent=2))
