/* A short, decorative terminal transition. No commands are executed and no remote checks
 * or preload claims are made. Real links remain usable without this enhancement. */
(() => {
  'use strict';
  const dialog = document.querySelector('[data-app-launch-dialog]');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const title = dialog.querySelector('[data-launch-title]');
  const status = dialog.querySelector('[data-launch-status]');
  const destination = dialog.querySelector('[data-launch-destination]');
  const direct = dialog.querySelector('[data-launch-direct]');
  const cancel = dialog.querySelector('[data-launch-cancel]');
  const rows = Array.from(dialog.querySelectorAll('[data-launch-line]'));
  if (!title || !status || !destination || !direct || !cancel || rows.length !== 3) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const en = document.documentElement.lang === 'en';
  let active = null;

  function cleanup(restoreFocus = true) {
    const previous = active;
    active = null;
    if (previous) {
      clearTimeout(previous.timeout);
      cancelAnimationFrame(previous.frame);
    }
    dialog.classList.remove('is-running', 'is-opening');
    if (dialog.open) dialog.close();
    if (restoreFocus && previous?.trigger?.isConnected) previous.trigger.focus({preventScroll:true});
  }

  function navigate() {
    if (!active) return;
    const url = active.url;
    cleanup(false);
    location.assign(url);
  }

  function animate(now) {
    const state = active;
    if (!state) return;
    const elapsed = now - state.started;
    state.commands.forEach((command, i) => {
      const progress = Math.max(0, Math.min(1, (elapsed - 150 - i * 320) / 280));
      rows[i].textContent = command.slice(0, Math.ceil(command.length * progress));
    });
    if (elapsed >= 1250) dialog.classList.add('is-opening');
    if (elapsed >= 1500) { navigate(); return; }
    state.frame = requestAnimationFrame(animate);
  }

  function allowedToAnimate() {
    // Site preferences are read at click time, after all existing runtime modules initialise.
    return !reduced.matches && !document.hidden && window.MDCEffects?.transitions !== false;
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest?.('a[data-app-launch]');
    if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download') || !allowedToAnimate()) return;
    let url;
    try { url = new URL(link.href); } catch { return; }
    if (url.protocol !== 'https:' || url.username || url.password) return;
    const id = link.dataset.launchId;
    if (!id || id.length > 60 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) return;
    if (active) { event.preventDefault(); return; }
    const name = (link.dataset.launchName || 'Quantum Lab').slice(0,90);
    title.textContent = name;
    status.textContent = (en ? 'Opening ' : 'Apertura di ') + name + '…';
    destination.textContent = url.host + url.pathname;
    direct.href = url.href;
    rows.forEach(row => { row.textContent = ''; });
    try { dialog.showModal(); } catch { return; } // If enhancement fails, keep native navigation.
    event.preventDefault();
    active = {url:url.href, trigger:link, started:performance.now(), frame:0, timeout:0,
      commands:['cd didattica', 'open ' + id, 'navigate --same-tab']};
    dialog.classList.add('is-running');
    direct.focus({preventScroll:true});
    // Hard upper bound independent of animation frames; cancellation always clears it.
    active.timeout = setTimeout(navigate, 1850);
    active.frame = requestAnimationFrame(animate);
  });

  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || !active) return;
    if (event.shiftKey && document.activeElement === cancel) { event.preventDefault(); direct.focus(); }
    else if (!event.shiftKey && document.activeElement === direct) { event.preventDefault(); cancel.focus(); }
  });
  cancel.addEventListener('click', () => cleanup());
  dialog.addEventListener('cancel', event => { event.preventDefault(); cleanup(); });
  dialog.addEventListener('close', () => { if (!dialog.open && active) cleanup(); });
  direct.addEventListener('click', event => {
    if (event.button !== 0) return;
    // Preserve modifiers too: opening a new tab must not also redirect the original tab.
    // Preserve the real anchor's native navigation; stop its pending automatic counterpart.
    cleanup(false);
  });
  direct.addEventListener('auxclick', event => { if (event.button === 1) cleanup(false); });
  window.addEventListener('pagehide', () => cleanup(false));
  window.addEventListener('pageshow', () => cleanup(false));
  reduced.addEventListener?.('change', () => { if (active && reduced.matches) navigate(); });
  window.MDCEffects?.subscribe?.(() => { if (active && window.MDCEffects.transitions === false) navigate(); });
})();
