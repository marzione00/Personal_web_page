/** Linked laboratories: a validated registry, independent editorial paragraphs and one renderer.
 * No remote requests, generated HTML inputs, shared builds or imported lab implementation.
 */
import fs from 'node:fs';
import path from 'node:path';

const keys = ['id', 'title', 'url', 'repository', 'interfaceLanguage', 'enabled', 'launch'];
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.length <= max && !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);
const fail = message => { throw new Error('Laboratori: ' + message); };

function checkedUrl(value, field, required) {
  if (value === '' && !required) return '';
  if (typeof value !== 'string' || value.length > 1024 || !value.startsWith('https://') || /[\s\\<>"']/.test(value)) fail(field + ': usare un URL HTTPS assoluto.');
  let u;
  try { u = new URL(value); } catch { fail(field + ': URL non valido.'); }
  if (u.protocol !== 'https:' || u.username || u.password || u.port) fail(field + ': credenziali e porte personalizzate non ammesse.');
  if (required && (/^(?:localhost|example\.(?:com|org|net))$/.test(u.hostname) || /\.(?:invalid|test|localhost)$/.test(u.hostname))) fail(field + ': destinazione dimostrativa non pubblicabile.');
  if (field.endsWith('.url') && /^(?:www\.)?github\.com$/.test(u.hostname)) fail(field + ': indicare il sito pubblicato, non la repository.');
  return u.href;
}

export function validateTeachingRegistry(registry) {
  if (!registry || registry.schemaVersion !== 1 || !Array.isArray(registry.apps) || registry.apps.length > 24 || Object.keys(registry).some(k => !['schemaVersion','apps'].includes(k))) fail('schema non valido.');
  const ids = new Set();
  return registry.apps.map(app => {
    if (!app || typeof app !== 'object' || Object.keys(app).some(k => !keys.includes(k)) || keys.some(k => !(k in app))) fail('campi mancanti o sconosciuti.');
    if (!text(app.id, 60) || !idPattern.test(app.id) || ids.has(app.id)) fail('id non valido o duplicato.');
    ids.add(app.id);
    if (!text(app.title, 90) || /[\r\n]/.test(app.title)) fail(app.id + ': titolo non valido.');
    if (typeof app.enabled !== 'boolean' || !['it','en'].includes(app.interfaceLanguage) || !['terminal','none'].includes(app.launch)) fail(app.id + ': opzioni non valide.');
    return {...app,
      url: checkedUrl(app.url, app.id + '.url', app.enabled),
      repository: checkedUrl(app.repository, app.id + '.repository', false)
    };
  });
}

/** Plain paragraphs in independent IT/EN Markdown files; HTML is always escaped. */
export function loadTeachingApps(root, language = 'it', {includeDisabled = false} = {}) {
  if (!['it','en'].includes(language)) fail('lingua non supportata.');
  const file = path.join(root, 'content/teaching-apps.json');
  if (fs.statSync(file).size > 32768) fail('registro troppo grande.');
  const apps = validateTeachingRegistry(JSON.parse(fs.readFileSync(file, 'utf8')));
  return apps.filter(app => app.enabled || includeDisabled).map(app => {
    const relative = 'content/markdown/' + (language === 'en' ? 'en/' : '') + 'laboratori/' + app.id + '.md';
    const full = path.join(root, relative);
    if (!fs.existsSync(full)) fail('testo mancante: ' + relative);
    if (fs.statSync(full).size > 12000) fail('testo troppo grande: ' + relative);
    const source = fs.readFileSync(full, 'utf8').trim();
    if (!text(source, 4000)) fail('testo vuoto o non valido: ' + relative);
    return {...app, paragraphs: source.split(/\n\s*\n/).map(p => p.replace(/\s*\n\s*/g,' ').trim())};
  });
}

const copy = language => language === 'en' ? {
  eyebrow:'Explore and experiment', title:'Interactive laboratories', intro:'Independent environments to explore alongside the course materials.',
  type:'Interactive laboratory', launch:'Enter the laboratory', code:'Source code', note:'Opens in this tab, with its own interface.',
  italian:'Laboratory interface: Italian.', english:'Laboratory interface: English.', draft:'Unpublished template',
  dialog:'Opening the laboratory', visual:'Visual transition', status:'Opening', direct:'Open now', cancel:'Cancel', destination:'Destination'
} : {
  eyebrow:'Esplora e sperimenta', title:'Laboratori interattivi', intro:'Ambienti autonomi da esplorare accanto ai materiali del corso.',
  type:'Laboratorio interattivo', launch:'Entra nel laboratorio', code:'Codice sorgente', note:'Si apre in questa scheda, con la propria interfaccia.',
  italian:'Interfaccia del laboratorio: italiano.', english:'Interfaccia del laboratorio: inglese.', draft:'Modello non pubblicato',
  dialog:'Apertura del laboratorio', visual:'Transizione visiva', status:'Apertura di', direct:'Apri subito', cancel:'Annulla', destination:'Destinazione'
};

export function teachingAppSearchEntries(data) {
  return (data.teachingApps || []).filter(app => app.enabled).map(app => ({
    url: 'didattica.html#laboratorio-' + app.id, title: app.title,
    kind: data.language === 'en' ? 'Teaching / laboratory' : 'Didattica / laboratorio'
  }));
}

function card(app, language, preview) {
  const c = copy(language), disabled = !app.enabled;
  if (disabled && !preview) return '';
  const action = disabled ? `<span class="tm-app-draft-label">${c.draft}</span>` :
    `<a class="button primary tm-app-enter" href="${escape(app.url)}"${app.launch === 'terminal' ? ` data-app-launch data-launch-id="${escape(app.id)}" data-launch-name="${escape(app.title)}"` : ''}>${c.launch} <span aria-hidden="true">→</span></a>`;
  const languageNote = app.interfaceLanguage !== language ? `<p class="tm-app-language">${app.interfaceLanguage === 'it' ? c.italian : c.english}</p>` : '';
  return `<article class="tm-app-card${disabled ? ' tm-app-card-draft' : ''}" id="laboratorio-${escape(app.id)}">
    <div class="tm-app-card-top"><span class="label">${disabled ? c.draft : c.type}</span><span class="tm-app-mark" aria-hidden="true">&gt;_</span></div>
    <h3>${escape(app.title)}</h3>
    ${app.paragraphs.map(p => `<p>${escape(p)}</p>`).join('')}${languageNote}
    <div class="tm-app-card-actions">${action}${!disabled && app.repository ? `<a class="text-link" href="${escape(app.repository)}" target="_blank" rel="noopener noreferrer">${c.code} <span aria-hidden="true">↗</span></a>` : ''}</div>
    ${disabled ? '' : `<p class="tm-app-card-note">${c.note}</p>`}
  </article>`;
}

export function renderTeachingApps(data, {previewDisabled = false} = {}) {
  const apps = (data.teachingApps || []).filter(app => app.enabled || previewDisabled);
  if (!apps.length) return '';
  const c = copy(data.language);
  return `<section class="tm-apps" aria-labelledby="tm-apps-title"><div class="section-head"><div><span class="label">${c.eyebrow}</span><h2 id="tm-apps-title">${c.title}</h2><p class="tm-apps-intro">${c.intro}</p></div></div><div class="tm-app-grid">${apps.map(app => card(app, data.language, previewDisabled)).join('')}</div></section>`;
}

/** Only pages containing a launch link receive the dialog, including the portable preview. */
export function renderAppLaunchDialog(data, body) {
  if (!body.includes('data-app-launch')) return '';
  const c = copy(data.language);
  const initial = (data.teachingApps || []).find(app => app.enabled && app.launch === 'terminal');
  if (!initial) return '';
  return `<dialog class="tm-launch" data-app-launch-dialog aria-labelledby="tm-launch-title" aria-describedby="tm-launch-status">
    <div class="tm-launch-window">
      <div class="tm-launch-chrome"><span class="tm-launch-lights" aria-hidden="true"><i></i><i></i><i></i></span><span>topological-manifolds / terminal</span><button type="button" class="tm-launch-cancel" data-launch-cancel aria-label="${c.cancel}">×</button></div>
      <div class="tm-launch-content">
        <div class="tm-launch-rain" aria-hidden="true"><span>0101<br>1001<br>0010<br>1010<br>0110</span><span>1010<br>0011<br>1100<br>0101<br>1001</span><span>0011<br>1010<br>0110<br>1001<br>0101</span></div>
        <span class="label">${c.visual}</span><h2 id="tm-launch-title" data-launch-title>${c.dialog}</h2>
        <p id="tm-launch-status" role="status" aria-live="polite" aria-atomic="true" data-launch-status>${c.dialog}…</p>
        <div class="tm-launch-code" aria-hidden="true"><div><span class="tm-launch-prompt">$</span> <span data-launch-line></span></div><div><span class="tm-launch-prompt">$</span> <span data-launch-line></span></div><div><span class="tm-launch-prompt">›</span> <span data-launch-line></span><span class="tm-launch-cursor">▍</span></div></div>
        <div class="tm-launch-progress" aria-hidden="true"><span></span></div>
        <p class="tm-launch-destination"><span>${c.destination}</span><span data-launch-destination></span></p>
      </div>
      <div class="tm-launch-footer"><span aria-hidden="true">ESC · ${c.cancel}</span><a class="button" data-launch-direct href="${escape(initial.url)}">${c.direct} <span aria-hidden="true">→</span></a></div>
    </div>
  </dialog>`;
}
