self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    self.caches.match(event.request).then((response) => response || fetch(event.request))
  )
})
