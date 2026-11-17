"""Compile passive, theme-aware SVG geometry and readable labels from the figure PDF.
The PDF owns all coordinates; the website owns colour, typography and interaction.
"""
from pathlib import Path
import re, math, colorsys, unicodedata, xml.etree.ElementTree as ET
import fitz

NS='http://www.w3.org/2000/svg'
ET.register_namespace('',NS); ET.register_namespace('xlink','http://www.w3.org/1999/xlink')
def tag(s):return '{'+NS+'}'+s

def label(text,number):
    for old,new in [('´S¯irs.¯asana','Śīrṣāsana'),('´Sav¯asana','Śavāsana'),('P¯ad¯a˙ngus.t.h¯asana','Pādāṅguṣṭhāsana'),('¯Urdhva Dhanur¯asana','Ūrdhva Dhanurāsana'),('¯asana','āsana'),('`a','à'),('`e','è'),('`u','ù'),('´e','é'),('ﬁ','fi'),('ﬀ','ff')]:text=text.replace(old,new)
    if number==4:text=text.replace('si torna','richiamo al fondo')
    if number==8:text=text.replace('conca: la pallina torna','conca: richiamo al fondo').replace('cupola: la pallina si allontana','cupola: allontanamento')
    if number==23:text=text.replace('18 centimetri','15 centimetri').replace('0,08','0,07')
    if number==44:text=text.replace('mappa (cap. 8)','mappa degli stati')
    return unicodedata.normalize('NFC',text)

def colour(c):
    if c=='#ffffff':return 'var(--panel,#ffffff)'
    rgb=tuple(int(c[i:i+2],16)/255 for i in (1,3,5))
    h,l,s=colorsys.rgb_to_hls(*rgb)
    if s<.12:
        if l<.3:return 'var(--ink,#222222)'
        if l<.68:return 'var(--muted,#595959)'
        return 'var(--line,#bfbfbf)'
    name='motion' if .48<h<.75 else 'energy' if .2<h<=.48 else 'correction' if .04<h<.2 else 'boundary'
    fallback={'motion':'#315b87','energy':'#2f6b4f','correction':'#9a6512','boundary':'#c60000'}[name]
    # Tints in the paper become translucent-looking layers on the native panel.
    amount=max(12,min(100,round((1-min(rgb))*135)))
    return f'color-mix(in srgb,var(--sd-{name},{fallback}) {amount}%,var(--panel,#ffffff))' if amount<98 else f'var(--sd-{name},{fallback})'

def native_svg(page,number):
    root=ET.fromstring(page.get_svg_image(text_as_path=False))
    for parent in root.iter():
        for child in list(parent):
            if child.tag==tag('text'):parent.remove(child)
    # The 64×64 basin is exactly the same finite grid, merged into two compound paths.
    if number==43:
        paints={'#e8edf2','#ebe0d0'}
        for parent in root.iter():
            for child in list(parent):
                if child.get('fill') in paints or child.get('stroke') in paints:parent.remove(child)
        groups={}
        for d in page.get_drawings()[:4096]:
            assert d['fill'] is not None
            key='#'+''.join(f'{round(v*255):02x}' for v in d['fill'])
            r=d['rect']; groups.setdefault(key,[]).append(f'M{r.x0:.3f} {r.y0:.3f}h{r.width:.3f}v{r.height:.3f}h{-r.width:.3f}Z')
        for key,paths in groups.items():
            root.insert(0,ET.Element(tag('path'),{'fill':key,'d':' '.join(paths)}))
        # Empty clip wrappers and definitions disappear after their cells are merged.
        for _ in range(3):
            for parent in root.iter():
                for child in list(parent):
                    if child.tag==tag('g') and not len(child):parent.remove(child)
        used=set(re.findall(r'url\(#([^)]*)\)',ET.tostring(root,encoding='unicode')))
        for parent in root.iter():
            for child in list(parent):
                if child.tag==tag('clipPath') and child.get('id') not in used:parent.remove(child)
    # PDF text extraction preserves word spaces; recombine diacritics in Sanskrit names.
    texts=ET.SubElement(root,tag('g'),{'class':'science-labels'})
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines',[]):
            spans=line['spans']; value=label(''.join(s['text'] for s in spans),number)
            if not value.strip():continue
            dominant=max(spans,key=lambda s:len(s['text']))
            x=min(s['bbox'][0] for s in spans);y=max(s['origin'][1] for s in spans)
            size=dominant['size']*.98
            attrs={'x':f'{x:.3f}','y':f'{y:.3f}','font-size':f'{size:.3f}','font-family':'sans-serif','fill':f'#{dominant["color"]:06x}'}
            width=line['bbox'][2]-line['bbox'][0]
            if len(value)>1:attrs.update({'textLength':f'{width:.3f}','lengthAdjust':'spacingAndGlyphs'})
            angle=math.degrees(math.atan2(line['dir'][1],line['dir'][0]))
            if abs(angle)>.1:attrs['transform']=f'rotate({angle:.3f} {x:.3f} {y:.3f})'
            ET.SubElement(texts,tag('text'),attrs).text=value
    # Crop the TeX page margins, preserving a small breathing space around the marks.
    rectangles=[d['rect'] for d in page.get_drawings()]+[fitz.Rect(b['bbox']) for b in page.get_text('dict')['blocks']]
    x0=max(0,min(r.x0 for r in rectangles)-8);y0=max(0,min(r.y0 for r in rectangles)-8)
    x1=min(page.rect.width,max(r.x1 for r in rectangles)+8);y1=min(page.rect.height,max(r.y1 for r in rectangles)+8)
    root.attrib={'viewBox':f'{x0:.3f} {y0:.3f} {x1-x0:.3f} {y1-y0:.3f}','class':'science-svg','data-density':('wide' if x1-x0>380 else 'compact' if x1-x0<280 else 'normal'),'role':'img','aria-labelledby':f'eq-{number:02d}-title'}
    title=ET.Element(tag('title'),{'id':f'eq-{number:02d}-title'});title.text=f'Diagramma {number}';root.insert(0,title)
    for node in root.iter():
        for k,v in list(node.attrib.items()):
            if k in ('fill','stroke') and re.fullmatch('#[a-fA-F0-9]{6}',v):node.set(k,'var(--sd-correction,#9a6512)' if number==27 and v.lower()=='#c60000' else colour(v.lower()))
            if k=='id' and not v.startswith('eq-'):node.set(k,f'eq-{number:02d}-{v}')
            if 'url(#' in v:node.set(k,re.sub(r'url\(#([^)]*)\)',rf'url(#eq-{number:02d}-\1)',v))
            if k.endswith('href') and v.startswith('#'):node.set(k,f'#eq-{number:02d}-{v[1:]}')
    return ET.tostring(root,encoding='unicode')

def export(pdf,destination):
    destination=Path(destination);destination.mkdir(parents=True,exist_ok=True)
    doc=fitz.open(pdf);assert len(doc)==44
    for number,page in enumerate(doc,1):(destination/f'figure-{number:02d}.svg').write_text(native_svg(page,number))

if __name__=='__main__':
    import sys
    export(sys.argv[1],sys.argv[2])
