#!/usr/bin/env python3
"""Safely stage an Overleaf ZIP into a blog *draft*, never auto-publish.

Requires Pandoc for LaTeX -> Markdown conversion. No LaTeX code is executed.
The output is subject to an editorial review, especially citations, tables,
footnotes, equations, figures, URLs and Markdown unsupported by this site.
"""
from __future__ import annotations
import argparse
import datetime as dt
import json
import re
import shutil
import stat
import subprocess
import sys
import tempfile
import unicodedata
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
SLUG = 'colpire-i-nervi-del-sistema'
TITLE = 'Colpire i nervi del sistema'
POST = ROOT / 'content' / 'posts' / f'{SLUG}.json'
SOURCES = ROOT / 'source-materials' / SLUG
ALLOWED = {'.tex','.bib','.bst','.sty','.cls','.png','.jpg','.jpeg','.pdf','.txt','.md'}
MAX_FILES = 120
MAX_TOTAL = 50 * 1024 * 1024
MAX_ONE = 18 * 1024 * 1024


def safe_members(archive: zipfile.ZipFile):
    infos = []
    total = 0
    for info in archive.infolist():
        if info.is_dir():
            continue
        p = PurePosixPath(info.filename.replace('\\','/'))
        if p.is_absolute() or '..' in p.parts or len(p.parts) > 10 or not p.parts or p.parts[0].startswith('.'):
            raise ValueError('Percorso archivio non consentito: ' + info.filename)
        if any(part.startswith('.') or part == '__MACOSX' for part in p.parts):
            continue
        if p.suffix.lower() not in ALLOWED:
            raise ValueError('Tipo di file non previsto: ' + info.filename)
        mode = info.external_attr >> 16
        if stat.S_ISLNK(mode):
            raise ValueError('Link simbolici vietati: ' + info.filename)
        if info.file_size > MAX_ONE or info.compress_size == 0 and info.file_size > 0:
            raise ValueError('File troppo grande o archivio anomalo: ' + info.filename)
        total += info.file_size
        infos.append((info,p))
    if len(infos)>MAX_FILES or total>MAX_TOTAL or not infos:
        raise ValueError('Archivio troppo grande o vuoto')
    return infos


def extract_into(archive: zipfile.ZipFile, infos, dest: Path):
    for info,p in infos:
        target = dest.joinpath(*p.parts)
        target.parent.mkdir(parents=True,exist_ok=True)
        # zipfile.open handles decompression; size was checked above.
        with archive.open(info) as src, target.open('wb') as out:
            shutil.copyfileobj(src,out)


def choose_main(dest:Path, arg:str|None):
    tex_files = sorted(dest.rglob('*.tex'))
    if not tex_files:
        raise ValueError('Nessun sorgente .tex nell’archivio')
    if arg:
        result=(dest/arg).resolve()
        if not result.is_relative_to(dest.resolve()) or result not in tex_files:
            raise ValueError('Il file --main deve essere un .tex interno all’archivio')
        return result
    ranked=[]
    for f in tex_files:
        t=f.read_text(encoding='utf-8-sig',errors='replace')
        score=3*('\\documentclass' in t)+2*('\\begin{document}' in t)+int(f.stem.lower() in ('main','article','paper'))
        if score:
            ranked.append((score,f))
    ranked.sort(reverse=True,key=lambda s:s[0]); maximum=ranked[0][0] if ranked else 0
    winners=[f for score,f in ranked if score==maximum]
    if len(winners)!=1:
        raise ValueError('Sorgente principale ambiguo; specifica --main. Candidati: '+', '.join(str(p.relative_to(dest)) for p in tex_files))
    return winners[0]


def inline_inputs(tex:Path, base:Path, seen:set[Path],depth:int=0)->str:
    tex=tex.resolve()
    if not tex.is_relative_to(base.resolve()) or depth>12 or tex in seen:
        raise ValueError('Inclusione LaTeX ricorsiva o non consentita: '+str(tex))
    seen.add(tex)
    content=tex.read_text(encoding='utf-8-sig',errors='replace')
    def replace(m):
        rel=m.group(1).strip()
        if not rel or '\\' in rel or rel.startswith('/'):
            raise ValueError('Inclusione LaTeX non valida: '+rel)
        p=(tex.parent / (rel if Path(rel).suffix else rel+'.tex')).resolve()
        if not p.exists():
            raise ValueError('File di inclusione mancante: '+rel)
        return '\n'+inline_inputs(p,base,seen,depth+1)+'\n'
    return re.sub(r'\\(?:input|include)\s*\{([^{}]+)\}',replace,content)


def clean_excerpt(body:str)->str:
    s=re.sub(r'\!\[[^]]*\]\([^)]*\)','',body)
    s=re.sub(r'\[[^]]*\]\([^)]*\)',lambda m:m.group(0).split(']')[0][1:],s)
    s=re.sub(r'[#*_>`{}$\\]','',s)
    s=re.sub(r'\s+',' ',s).strip()
    return (s[:237].rsplit(' ',1)[0]+'…') if len(s)>240 else s[:240]


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('zip',type=Path,help='Archivio Overleaf scaricato, senza eseguire sorgenti')
    ap.add_argument('--main',help='Sorgente .tex principale relativo alla radice dell’archivio')
    ap.add_argument('--date',default=dt.date.today().isoformat(),help='Data ISO proposta per la bozza')
    ap.add_argument('--dry-run',action='store_true',help='Ispeziona senza modificare il progetto')
    args=ap.parse_args()
    dt.date.fromisoformat(args.date)
    if not args.zip.is_file():
        ap.error('Archivio non trovato: '+str(args.zip))
    with tempfile.TemporaryDirectory(prefix='mdc-overleaf-') as temp:
        dest=Path(temp)
        with zipfile.ZipFile(args.zip) as z:
            infos=safe_members(z);extract_into(z,infos,dest)
        main_file=choose_main(dest,args.main)
        raw=inline_inputs(main_file,dest,set())
        if args.dry_run:
            print('Sorgente principale:',main_file.relative_to(dest))
            print('File presenti:',len(infos),'| Testo:',len(raw),'caratteri')
            print('Contiene riferimenti:',bool(re.search(r'\\(?:cite\w*|bibliography|addbibresource)\b',raw)))
            return
        if shutil.which('pandoc') is None:
            raise RuntimeError('Pandoc non trovato: installarlo prima dell’importazione')
        result=subprocess.run(['pandoc','-f','latex','-t','markdown','--wrap=none'],input=raw,stdout=subprocess.PIPE,stderr=subprocess.PIPE,text=True,cwd=str(dest),timeout=45)
        if result.returncode:
            raise RuntimeError('Pandoc: '+result.stderr[:1200])
        body=result.stdout.strip()
        if len(body)<150:
            raise ValueError('Conversione troppo breve: controllare il sorgente principale')
        warnings=[]
        checks={
            'formule matematiche':r'(?<!\\)\${1,2}|\\\(|\\\[',
            'citazioni bibliografiche':r'\[@[A-Za-z]|\\cite\b',
            'riferimenti o comandi LaTeX':r'\\(?:ref|label|url|footnote|begin|end|includegraphics)\b',
            'figure e immagini esterne':r'!\[[^]]*\]\((?!/?media/images/)',
            'tabelle Markdown':r'(?m)^\|.*\|\s*$',
            'note e blocchi speciali':r'(?m)^\[\^[^]]+\]:|^:::',
        }
        for label,pattern in checks.items():
            if re.search(pattern,body): warnings.append(label)
        post={
          'id':SLUG,'title':TITLE,'date':args.date,'category':'Saggi',
          'tags':[],'excerpt':clean_excerpt(body) or 'Saggio in revisione editoriale.',
          'draft':True,'demo':False,'sourceStatus':'needs-review','body':body
        }
        # Do not mutate until all checks and conversion have succeeded.
        SOURCES.mkdir(parents=True,exist_ok=True)
        shutil.copy2(args.zip,SOURCES/'archivio-overleaf-originale.zip')
        (SOURCES/'sorgente-principale.tex').write_text(raw,encoding='utf-8')
        POST.write_text(json.dumps(post,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        print('Importata BOZZA:',POST.relative_to(ROOT))
        print('Originale preservato in:',SOURCES.relative_to(ROOT))
        if warnings:
            print('ATTENZIONE: elementi da verificare nella pagina web: '+', '.join(warnings))
        print('Revisione richiesta; il contenuto NON è pubblicato (draft=true).')

if __name__=='__main__':
    try: main()
    except (ValueError,RuntimeError,zipfile.BadZipFile,subprocess.TimeoutExpired) as exc:
        print('Errore:',exc,file=sys.stderr)
        raise SystemExit(2)
