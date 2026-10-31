// Protein Pan service worker: works offline, refreshes in the background
const VERSION='protein-pan-v6';
const CORE=["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "img/acai.webp", "img/avotoast.webp", "img/bhurji.webp", "img/bowl.webp", "img/burrito.webp", "img/chaat.webp", "img/chickpeas.webp", "img/chilla.webp", "img/eggsand.webp", "img/hummus.webp", "img/lassi.webp", "img/muffins.webp", "img/oats.webp", "img/omelette.webp", "img/overnight.webp", "img/padthai.webp", "img/pancakes.webp", "img/paneersand.webp", "img/peachtoast.webp", "img/pulao.webp", "img/quinoa.webp", "img/salad.webp", "img/shakshuka.webp", "img/soba.webp", "img/sub.webp", "img/tikka.webp", "img/tofu.webp", "img/yogurt.webp"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);
  const isFont=url.host==='fonts.googleapis.com'||url.host==='fonts.gstatic.com';
  if(url.origin!==location.origin&&!isFont)return;
  e.respondWith(caches.open(VERSION).then(async cache=>{
    const hit=await cache.match(req,{ignoreSearch:req.mode==='navigate'})||(req.mode==='navigate'?await cache.match('index.html'):undefined);
    const net=fetch(req).then(res=>{if(res&&(res.ok||res.type==='opaque'))cache.put(req,res.clone());return res}).catch(()=>hit);
    return hit||net;
  }));
});
