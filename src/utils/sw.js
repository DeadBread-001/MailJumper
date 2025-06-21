/**
 * Название основного кеша приложения.
 */
const CACHE_NAME = 'MailJumper';
/**
 * Название динамического кеша.
 */
const CACHE_NAME_DYNAMIC = 'MailJumper-dynamic';
/**
 * URL для предварительного кеширования.
 */
const CACHE_URLS = ['/'];
/**
 * Регулярное выражение для статических ресурсов (кеш-первый подход).
 */
const CACHE_FIRST_AND_UPDATE_REGEX =
    /\.(webp|svg|jpg|jpeg|gif|png|css|js|ttf|woff2)$/i;

/**
 * Удаляет старые кеши, оставляя только текущие.
 * @async
 */
const deleteOldCaches = async () => {
    const keys = await caches.keys();
    await Promise.all(
        keys.map((key) => {
            if (key !== CACHE_NAME && key !== CACHE_NAME_DYNAMIC) {
                return caches.delete(key);
            }
        })
    );
};

/**
 * Получает ответ из кеша.
 * @param {Request} request - Запрос
 * @param {string} cacheName - Название кеша
 * @returns {Promise<Response>} Ответ из кеша
 */
const fromCache = async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    return cachedResponse || Promise.reject('no response in cache');
};

/**
 * Обновляет кеш для указанного запроса.
 * @param {Request} request - Запрос для обновления
 * @async
 */
const update = async (request) => {
    try {
        if (request.url.startsWith('http')) {
            const cache = await caches.open(CACHE_NAME);
            const response = await fetch(request);
            if (response.status !== 206) {
                cache.put(request, response.clone());
            }
        }
    } catch (error) {
        console.error(error);
    }
};

/**
 * Стратегия "кеш-первый" с обновлением в фоне.
 * @param {FetchEvent} event - Событие fetch
 */
const cacheFirstAndUpdate = (event) => {
    event.respondWith(
        (async () => {
            try {
                const cachedResponse = await fromCache(
                    event.request,
                    CACHE_NAME
                );
                update(event.request);
                return cachedResponse;
            } catch (e) {
                const cache = await caches.open(CACHE_NAME);
                const response = await fetch(event.request);
                if (
                    event.request.url.startsWith('http') &&
                    response.status !== 206
                ) {
                    cache.put(event.request, response.clone());
                }
                return response;
            }
        })()
    );
};

/**
 * Стратегия "сеть-первый" с кешированием.
 * @param {FetchEvent} event - Событие fetch
 */
const networkFirst = (event) => {
    event.respondWith(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            try {
                const response = await fetch(event.request);
                if (
                    event.request.url.startsWith('http') &&
                    response.status !== 206
                ) {
                    cache.put(event.request, response.clone());
                }
                return response;
            } catch (e) {
                return fromCache(event.request, CACHE_NAME);
            }
        })()
    );
};

/**
 * Стратегия для не-GET запросов: сеть-первый с fallback.
 * @param {FetchEvent} event - Событие fetch
 */
const nonGetRequestNetworkFirst = (event) => {
    event.respondWith(
        (async () => {
            try {
                return await fetch(event.request);
            } catch (e) {
                if (event.request.method === 'GET') {
                    try {
                        return await fromCache(
                            event.request,
                            CACHE_NAME_DYNAMIC
                        );
                    } catch {
                        return new Response('Offline', { status: 503 });
                    }
                }
                return new Response('Offline', { status: 503 });
            }
        })()
    );
};

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHE_URLS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (e) => {
    if (!e.request.url.startsWith('http')) return;

    if (e.request.method !== 'GET') {
        nonGetRequestNetworkFirst(e);
        return;
    }

    if (CACHE_FIRST_AND_UPDATE_REGEX.test(e.request.url)) {
        cacheFirstAndUpdate(e);
    } else {
        networkFirst(e);
    }
});
