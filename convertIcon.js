const fs = require('fs');

async function run() {
  const mod = await import('png-to-ico');
  const pngToIco = typeof mod === 'function' ? mod : mod.default || mod.pngToIco;
  const buf = await pngToIco('public/logo.png');
  fs.writeFileSync('public/logo.ico', buf);
  console.log('Icon created successfully');
}
run().catch(console.error);
