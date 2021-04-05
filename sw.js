const staticCacheName = 's-app-v-2';
const dynamicCacheName = 'd-app-v-2';

// const assetUrls = [
//     'index.html',
//     'app.js',
//     'style.css',
//     'backcity.jpg',
//     'offline.html'
// ];

// self.addEventListener('install', async event => {
//     const cache = await caches.open(staticCacheName)
//     await cache.addAll(assetUrls)
// });

// self.addEventListener('activate', async event =>{
//     const cacheNames = await caches.keys()
//     await Promise.all(
//         cacheNames
//             .filter( name => name !== staticCacheName)
//             .filter(name =>  name !== dynamicCacheName)
//             .map(name => caches.delete(name))
//     )
// });

// self.addEventListener('fetch', event => {
//     const {request} = event;
//     const url = new URL(request.url);
//     if (url.origin === location.origin) {
//        event.respondWith(cacheFirst(event.request));
//     } 
//     else {
//         event.respondWith(networkFirst(request));
//     }
// });

// async function cacheFirst(request) {
//     try{
//         const cached = await caches.match(request)
//         return cached ?? await fetch(request)
//     }
//     catch(e){
//         console.log(e,'Something happend incorrect')
//     }

// }

// async function networkFirst(request) {
//     const cache = await caches.open(dynamicCacheName);
//     try {
//         const response = await fetch(request);
//         await cache.put(request, response.clone());
//         return response; 
//     } catch(e) {
//         const cached = await cache.match(request);
// lis        return cached ?? await caches.match('offline.html');
//     }


// }

const CACHE_NAME = "version-1";
 const urlsToCache = [
        'index.html',
        'app.js',
        'style.css',
        'backcity.jpg',
        'offline.html'
    ];

const self = this;

// Install SW
self.addEventListener('install', (event) =>{
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('open');
                return cache.addAll(urlsToCache);
            })
    )
});

//Listen for request
self.addEventListener('fetch', (event) =>{
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => {
                        return caches.match('offline.html')
                    })
            })
    )
    
});


// Activate the SW 
self.addEventListener('activate', (event) =>{
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);
    cacheWhiteList.push(dynamicCacheName);
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) =>{
                if(!cacheWhiteList.includes(cacheName)){
                    return caches.delete(cacheName);
                }
            })
        ))
    )
});