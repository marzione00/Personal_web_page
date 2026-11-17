from pathlib import Path
import re, json, subprocess, html, shutil, hashlib

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT
ORIGINAL=ROOT/'docs/sources/equilibrio/equilibrio-originale.tex'
SLUG='lequilibrio-sul-tappetino'
tex=ORIGINAL.read_text()

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

body=body.replace(r'\frontespizio',r'\begin{quote}\emph{sthira-sukham āsanam}\\La posizione sia stabile e piacevole.\\Patañjali, Yogasūtra II.46\end{quote}')
body=re.sub(r'\\paragraph\{([^}]+)\}',r'\\textbf{\1.}',body)
body=refs(body)
body=re.sub(r'\\label\{[^}]+\}','',body)
# The supplied file contains the coordinates, but no separate Python attachment.
body=body.replace(r'Le coordinate sono già incluse nel sorgente; lo script allegato \textsf{rigenera\_grafici.py} permette di rigenerarle.', 'Le coordinate numeriche sono incluse nel sorgente LaTeX, conservato nel pacchetto del sito insieme agli strumenti per esportare le figure.')
boxes=[]
def box(m):
    kind=m[1]; arg=m[2] or ''; content=m[3]
    title='Per chi ama le formule' if kind=='formule' else arg[1:-1]
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
    i=f['number']; label=f'Figura {i}. '+f['alt']; asset='assets/articles/equilibrio/'+f['file']
    import xml.etree.ElementTree as ET
    svg=ET.parse(SOURCE/'public'/asset).getroot()
    dims=svg.attrib['viewBox'].split()
    dimension=f'width="{round(float(dims[2]))}" height="{round(float(dims[3]))}"'
    markup=f'''<figure class="science-figure" id="figura-{i:02d}">
<a class="science-figure-link" href="{asset}" data-travel-photo data-science-figure aria-label="{html.escape('Ingrandisci la figura '+str(i),quote=True)}"><img src="{asset}" {dimension} alt="{html.escape(label,quote=True)}" loading="lazy" decoding="async"><span class="science-expand" aria-hidden="true">↗ Ingrandisci la figura {i}</span></a>
<figcaption><strong>Figura {i}.</strong> {f['caption']}</figcaption></figure>'''
    result=result.replace(f'<p>EQUILIBRIUMFIGURE{i:02d}</p>',markup)
result='<div class="scientific-article" lang="it" data-travel-gallery>\n'+result+'\n</div>'
# Pandoc emits redundant inline style on definition-list terms. CSS owns styling.
result=re.sub(r' style="[^"]*"','',result)
assert not re.search(r'EQUILIBRIUM(?:BOX|FIGURE)|<script|onload=',result)
target=SOURCE/'src/scientific-articles';target.mkdir(exist_ok=True)
(target/(SLUG+'.html')).write_text(result)
(target/(SLUG+'.json')).write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
plain=pandoc(body,'gfm')
for i,(_,title,content) in enumerate(boxes,1):
    text=subprocess.run(['pandoc','-f','html','-t','gfm','--wrap=none'],input=content,text=True,capture_output=True,check=True).stdout
    plain=plain.replace(f'EQUILIBRIUMBOX{i:02d}','**'+title+'**\n\n'+text)
for f in manifest: plain=plain.replace(f'EQUILIBRIUMFIGURE{f["number"]:02d}',f'Figura {f["number"]}. '+f['alt'])
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
(SOURCE/'content/markdown/posts'/ (SLUG+'.md')).write_text(front+plain)
archive=SOURCE/'docs/sources/equilibrio';archive.mkdir(parents=True,exist_ok=True)
# The immutable author source is already at ORIGINAL.
print(json.dumps({'figures':len(manifest),'boxes':len(boxes),'sections':len(sections),'htmlBytes':len(result.encode()),'originalSha256':hashlib.sha256(ORIGINAL.read_bytes()).hexdigest()},indent=2))
