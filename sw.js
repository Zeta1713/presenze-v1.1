// service worker minimo: rende l'app installabile e carica subito la grafica.
// Le pagine si scaricano sempre dalla rete se disponibile (così gli aggiornamenti arrivano subito).
const C = 'presenze-v1';
const FILE = ['./', './index.html', './operaio.js', './operaio.css', './firebase-config.js', './manifest.webmanifest', './icona-192.png'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(FILE)).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
});
