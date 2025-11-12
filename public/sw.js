// Service Worker for PWA
// This enables the app to be installable on devices

self.addEventListener('install', function (event) {
  console.log('Service Worker installed')
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  console.log('Service Worker activated')
  event.waitUntil(clients.claim())
})

self.addEventListener('fetch', function (event) {
  // Basic fetch handler - you can add caching strategies here if needed
  event.respondWith(fetch(event.request))
})
