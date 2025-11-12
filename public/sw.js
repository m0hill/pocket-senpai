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
  event.respondWith(
    fetch(event.request).catch(function (error) {
      console.error('Fetch failed:', error)
      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
      })
    })
  )
})
