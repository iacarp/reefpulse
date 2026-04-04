// Post-build script: injects AdSense into dist/index.html
const fs = require('fs');
const path = require('path');

const distIndex = path.join(__dirname, 'dist', 'index.html');

if (!fs.existsSync(distIndex)) {
  console.log('dist/index.html not found, skipping AdSense injection');
  process.exit(0);
}

let html = fs.readFileSync(distIndex, 'utf8');

const adSenseTag = `
    <!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9819885249600712"
         crossorigin="anonymous"></script>`;

// Inject before closing </head>
if (html.includes('ca-pub-9819885249600712')) {
  console.log('AdSense already present, skipping');
} else {
  html = html.replace('</head>', adSenseTag + '\n  </head>');
  fs.writeFileSync(distIndex, html, 'utf8');
  console.log('✓ AdSense injected into dist/index.html');
}

// Copy ads.txt to dist
const fs2 = require('fs');
const adsTxt = path.join(__dirname, 'public', 'ads.txt');
const adsDist = path.join(__dirname, 'dist', 'ads.txt');
if (fs2.existsSync(adsTxt)) {
  fs2.copyFileSync(adsTxt, adsDist);
  console.log('✓ ads.txt copied to dist/');
}
