"""Restore approved original JPEG files byte-for-byte. Never decode/re-encode photographs.
Usage: python scripts/import-personal-photos.py /folder/with/originals
Optional: --portrait /path/to/the/approved-original.jpeg
A different image must be approved and its manifest deliberately updated separately.
"""
import argparse, hashlib, json, os, tempfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('source_dir',type=Path)
    ap.add_argument('--portrait',type=Path)
    args=ap.parse_args()
    manifest=json.loads((ROOT/'content/photo-manifest.json').read_text())
    pending=[]
    for entry in manifest:
        source=args.portrait if entry['id']=='homepage' and args.portrait else args.source_dir/entry['originalName']
        if not source.is_file():raise SystemExit(f'Originale assente: {source}')
        raw=source.read_bytes()
        if len(raw)!=entry['bytes'] or hashlib.sha256(raw).hexdigest()!=entry['sha256']:
            raise SystemExit(f'Il file non corrisponde all’originale approvato: {source}')
        target=(ROOT/'public'/entry['path']).resolve()
        if not target.is_relative_to((ROOT/'public/media/images').resolve()):raise SystemExit('Destinazione non consentita')
        pending.append((target,raw))
    for target,raw in pending:
        target.parent.mkdir(parents=True,exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=target.parent,delete=False) as f:
            f.write(raw);tmp=f.name
        os.replace(tmp,target)
    print(f'{len(pending)} fotografie copiate senza ricodifica; impronte SHA-256 verificate.')
if __name__=='__main__':main()
