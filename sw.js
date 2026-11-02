/* Dubel Team — retired service worker.
   An older app on this domain once registered a worker here. This version
   clears its caches and unregisters itself, so returning visitors get the
   live site straight from the network. Safe to delete after a few months. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then((clients) => clients.forEach((c) => c.navigate(c.url)))
  );
});
