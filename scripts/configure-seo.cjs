const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const input = process.argv[2];
if (!input) throw new Error('Pass the final public HTTPS URL.');
const parsed = new URL(input);
if (parsed.protocol !== 'https:' || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error('Use a public HTTPS URL without credentials, query or fragment.');
if (['localhost', 'example.com', 'example.org', 'example.net'].includes(parsed.hostname)) throw new Error('Use the real public domain.');
const base = parsed.href.replace(/\/$/, '') + '/';
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const pages = ['index.html', 'pages/clases.html', 'pages/produccion.html', 'pages/eventos.html', 'pages/nosotros.html', 'pages/contacto.html'];
const changes = pages.map((file) => {
    let html = fs.readFileSync(path.join(root, file), 'utf8');
    const url = new URL(file === 'index.html' ? './' : file, base).href;
    const image = new URL('imagenes/social-preview.jpg', base).href;
    const block = '<!-- SEO_PUBLIC_URLS_START -->\n' +
        '    <link rel="canonical" href="' + escape(url) + '">\n' +
        '    <meta property="og:url" content="' + escape(url) + '">\n' +
        '    <meta property="og:image" content="' + escape(image) + '">\n' +
        '    <meta property="og:image:width" content="1200">\n' +
        '    <meta property="og:image:height" content="630">\n' +
        '    <meta property="og:image:alt" content="NovaStage — música, creatividad y aprendizaje en Mendoza">\n' +
        '    <meta name="twitter:image" content="' + escape(image) + '">\n' +
        '    <meta name="twitter:image:alt" content="NovaStage — música, creatividad y aprendizaje en Mendoza">\n' +
        '    <!-- SEO_PUBLIC_URLS_END -->';
    if (!html.includes('<!-- SEO_PUBLIC_URLS_START -->')) throw new Error('SEO marker missing: ' + file);
    html = html.replace(/<!-- SEO_PUBLIC_URLS_START -->[\s\S]*?<!-- SEO_PUBLIC_URLS_END -->/, block);
    if (file === 'index.html') {
        html = html.replace(/(<script id="organization-data" type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, start, data, end) => {
            const org = JSON.parse(data); org.url = base; org.logo = new URL('imagenes/header-logonovastage-removebg-preview.png', base).href; org.image = image;
            return start + '\n' + JSON.stringify(org, null, 4) + '\n    ' + end;
        });
        const site = { '@context': 'https://schema.org', '@type': 'WebSite', name: 'NovaStage', url: base, inLanguage: 'es-AR' };
        html = html.replace(/\s*<script id="website-data" type="application\/ld\+json">[\s\S]*?<\/script>/, '');
        html = html.replace('</head>', '    <script id="website-data" type="application/ld+json">\n' + JSON.stringify(site, null, 4) + '\n    </script>\n</head>');
    }
    return { file, html, url };
});
for (const change of changes) fs.writeFileSync(path.join(root, change.file), change.html);
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + changes.map(c => '    <url><loc>' + escape(c.url) + '</loc></url>').join('\n') + '\n</urlset>\n';
fs.writeFileSync(path.join(root, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(root, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: ' + new URL('sitemap.xml', base).href + '\n');
console.log('Configured canonical URLs, social images, structured data and sitemap for ' + base);
