// Post-build script: injects AdSense + manifest into dist/index.html
const fs = require('fs');
const path = require('path');

const distIndex = path.join(__dirname, 'dist', 'index.html');

if (!fs.existsSync(distIndex)) {
  console.log('dist/index.html not found, skipping');
  process.exit(0);
}

let html = fs.readFileSync(distIndex, 'utf8');

// 1. Inject AdSense
const adSenseTag = `
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9819885249600712"
         crossorigin="anonymous"></script>`;

if (!html.includes('ca-pub-9819885249600712')) {
  html = html.replace('</head>', adSenseTag + '\n  </head>');
  console.log('✓ AdSense injected into dist/index.html');
} else {
  console.log('AdSense already present, skipping');
}

// 2. Inject manifest inline (avoids Vercel 403 on /manifest.json)
const manifestData = {
  name: 'ReefPulse',
  short_name: 'ReefPulse',
  description: 'Reef Aquarium Intelligence — Track, Diagnose, Thrive',
  start_url: '/',
  display: 'standalone',
  background_color: '#020617',
  theme_color: '#06b6d4',
  orientation: 'portrait',
  categories: ['lifestyle', 'utilities'],
  icons: [
    { src: '/assets/icon.png', sizes: '1024x1024', type: 'image/png' }
  ]
};

const manifestTag = `
    <link rel="manifest" href="data:application/manifest+json,${encodeURIComponent(JSON.stringify(manifestData))}" />`;

if (!html.includes('rel="manifest"')) {
  html = html.replace('</head>', manifestTag + '\n  </head>');
  console.log('✓ Manifest injected inline into dist/index.html');
}

fs.writeFileSync(distIndex, html, 'utf8');

// 3. Copy ads.txt to dist
const fs2 = require('fs');
const adsTxt = path.join(__dirname, 'public', 'ads.txt');
const adsDist = path.join(__dirname, 'dist', 'ads.txt');
if (fs2.existsSync(adsTxt)) {
  fs2.copyFileSync(adsTxt, adsDist);
  console.log('✓ ads.txt copied to dist/');
}
