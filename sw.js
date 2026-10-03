// Bu o'zimizning ilova uchun. Kesh nomi eskisidan boshqa ("oz-"),
// shuning uchun eski ilovaning keshiga tegmaydi.
const KESH = "oz-v2";
const FAYLLAR = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(KESH).then(function (k) { return k.addAll(FAYLLAR); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (nomlar) {
    return Promise.all(nomlar
      .filter(function (n) { return n.startsWith("oz-") && n !== KESH; })
      .map(function (n) { return caches.delete(n); }));
  }));
  self.clients.claim();
});
self.addEventListener("fetch", function (e) {
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});