self.addEventListener(`install`, (evt) => {
  const openCache = caches.open(`STATIC_V1.0`)
    .then((cache) => {
      return cache.addAll([
        `/`,
        `/css/normalize.css`,
        `/css/main.css`,
        `/images/icon-favorite.png`,
        `/images/icon-watched.png`,
        `/images/icon-watchlist.png`,
        `/images/icon-favorite.svg`,
        `/images/icon-watched.svg`,
        `/images/icon-watchlist.svg`,
        `/images/posters/accused.jpg`,
        `/images/posters/blackmail.jpg`,
        `/images/posters/blue-blazes.jpg`,
        `/images/posters/fuga-da-new-york.jpg`,
        `/images/posters/moonrise.jpg`,
        `/images/posters/three-friends.jpg`,
        `/index.html`,
        `/bundle.js`
      ]);
    });

  evt.waitUntil(openCache);
});

self.addEventListener(`fetch`, (evt) => {
  evt.respondWith(
      caches.match(evt.request)
      .then((response) => response ? response : fetch(evt.request))
  );
});
