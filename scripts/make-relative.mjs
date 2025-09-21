import { promises as fs } from 'fs';
import path from 'path';

// Simple post-build adjuster: rewrites leading asset slashes to relative references in built HTML.
// Designed ONLY for local file:// preview. Do not deploy this variant if you need absolute-root references.

const distDir = path.resolve('dist');

(async () => {
  const entries = await fs.readdir(distDir, { withFileTypes: true });
  const htmlFiles = entries.filter(e => e.isFile() && e.name.endsWith('.html')).map(e => path.join(distDir, e.name));

  for (const file of htmlFiles) {
    let html = await fs.readFile(file, 'utf8');
    // Replace ONLY our known root-based assets (avoid external https:// links)
    html = html
      .replace(/href="\/_astro\//g, 'href="_astro/')
      .replace(/src="\/_astro\//g, 'src="_astro/')
      .replace(/href="\/favicon.svg"/g, 'href="favicon.svg"')
      .replace(/src="\/scripts\//g, 'src="scripts/')
      .replace(/src="\/avatars\//g, 'src="avatars/')
      .replace(/src="\/robots.txt"/g, 'src="robots.txt"');

    await fs.writeFile(file, html, 'utf8');
    console.log('[make-relative] Rewrote root asset paths in', path.basename(file));
  }
})();
