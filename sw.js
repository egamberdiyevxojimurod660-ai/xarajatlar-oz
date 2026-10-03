// Service worker: avval internetdan oladi (doim yangi versiya), internet yo'q bo'lsa keshdan ochadi.
// Endi har yangilanishda versiyani o'zgartirish shart emas.
const KESH = "oz-v3";
const FAYLLAR = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(KESH).then(function (k) { return k.addAll(FAYLLAR); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (nomlar) {
    return Promise.all(nomlar
      .filter(function (n) { return n.indexOf("oz-") === 0 && n !== KESH; })
      .map(function (n) { return caches.delete(n); }));
  }));
  self.clients.claim();
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then(function (javob) {
        if (javob.ok && javob.type === "basic") {
          const nusxa = javob.clone();
          caches.open(KESH).then(function (k) { k.put(e.request, nusxa); });
        }
        return javob;
      })
      .catch(function () {
        return caches.match(e.request).then(function (r) { return r || caches.match("./index.html"); });
      })
  );
});