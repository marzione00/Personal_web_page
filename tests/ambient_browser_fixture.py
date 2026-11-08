from pathlib import Path
from playwright.sync_api import sync_playwright
from urllib.parse import urlparse,unquote
import re,html,mimetypes,json
R=Path(__file__).resolve().parents[1];(R/'reports').mkdir(exist_ok=True);(R/'anteprime').mkdir(exist_ok=True)
def setup(page,name='index.html'):
 errors=[];req=[]
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 def handle(route):
  req.append(route.request.url)
  rel=unquote(urlparse(route.request.url).path).removeprefix('/Personal_web_page/');f=(R/'dist'/rel).resolve()
  if not f.is_relative_to((R/'dist').resolve()):route.abort();return
  if f.is_file():route.fulfill(body=f.read_bytes(),headers={'Access-Control-Allow-Origin':'*'},content_type=mimetypes.guess_type(str(f))[0] or 'application/octet-stream')
  else:route.fulfill(status=404,body='Not found')
 page.route('https://mdc.test/**',handle)
 s=(R/'dist'/name).read_text()
 def policy(m):return 'content="'+html.escape(html.unescape(m.group(1)).replace("'self'",'https://mdc.test').replace("base-uri 'none'",'base-uri https://mdc.test'),quote=True)+'"'
 s=re.sub(r'content="(default-src [^"]+)"',policy,s)
 base='https://mdc.test/Personal_web_page/'+('en/' if name.startswith('en/') else '')
 s=s.replace('<head>','<head><base href="'+base+'">')
 page.set_content(s,wait_until='load');return errors,req
