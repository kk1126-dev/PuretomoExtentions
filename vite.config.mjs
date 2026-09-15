import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import fs from 'node:fs';

// manifest.json を安全に読み込む
const manifest = JSON.parse(
    fs.readFileSync(new URL('./manifest.json', import.meta.url), 'utf8')
);

export default defineConfig({
    plugins: [
        crx({ manifest }),
    ],
});