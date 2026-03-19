import { defineConfig, fontProviders } from 'astro/config';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { minify } from 'html-minifier-next';

// Before `defineConfig`:
function htmlMinifier() {
  return {
    name: 'html-minifier-next',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const distDir = fileURLToPath(dir);
        const files = readdirSync(distDir, { recursive: true, encoding: 'utf-8' })
          .filter(f => f.endsWith('.html'))
          .map(f => join(distDir, f));
        for (const file of files) {
          const minified = await minify(readFileSync(file, 'utf-8'), {
            preset: 'comprehensive'
            // Options: https://github.com/j9t/html-minifier-next?tab=readme-ov-file#options-quick-reference
          });
          writeFileSync(file, minified);
        }
      }
    }
  };
}

// https://astro.build/config
export default defineConfig({
    site: 'https://byeagley.github.io',
    base: '/hbthings',
    integrations: [htmlMinifier()],
    fonts: [{
    provider: fontProviders.local(),
    name: "Charter",
    cssVariable: "--font-charter",
    options: {
      variants: [{
        src: ['./src/fonts/charter_regular.woff2'],
        weight: '500',
        style: 'normal'
      }, {
        src: ['./src/fonts/charter_bold.woff2'],
        weight: '700',
        style: 'normal'
      }]
    }
  }, 
]
});
