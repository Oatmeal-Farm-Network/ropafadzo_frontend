/* Oatmeal Farm Network — Web Push Service Worker */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Oatmeal Farm Network', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Oatmeal Farm Network';
  const options = {
    body: data.body || '',
    icon: data.icon || '/images/AI-agent-logo-saige.svg',
    badge: data.badge || '/images/AI-agent-logo-saige.svg',
    data: { url: data.url || '/', ...data },
    tag: data.tag || 'ofn-generic',
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
    const allClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of allClients) {
      if (client.url.includes(targetUrl) && 'focus' in client) {
        return client.focus();
      }
    }
    if (self.clients.openWindow) {
      return self.clients.openWindow(targetUrl);
    }
  })());
});
