// Submit URLs to IndexNow (Bing, Yandex, Seznam, etc.)
// Run with: npm run indexnow

const HOST = 'www.odaidh.dev';
const KEY = 'c67d8fd4cc46a9a074c6639f33760a92';

// Fetch the live sitemap and extract URLs
const sitemapRes = await fetch(`https://${HOST}/sitemap.xml`);
const xml = await sitemapRes.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

if (urls.length === 0) {
  console.error('No URLs found in sitemap');
  process.exit(1);
}

console.log(`Submitting ${urls.length} URLs to IndexNow…`);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});

if (res.ok || res.status === 202) {
  console.log(`✅ Done (${res.status} ${res.statusText})`);
  urls.forEach(u => console.log(`   ${u}`));
} else {
  console.error(`❌ Failed: ${res.status} ${res.statusText}`);
  console.error(await res.text());
  process.exit(1);
}
