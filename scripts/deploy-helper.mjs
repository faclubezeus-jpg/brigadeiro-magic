import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function run() {
  const action = process.argv[2];

  if (action === 'prepare-netlify') {
    const src = path.resolve(rootDir, 'artifacts/doce-site/dist/public');
    const dest = path.resolve(rootDir, 'artifacts/api-server/client');

    console.log(`Copying frontend from ${src} to ${dest}...`);
    
    // Clean destination first
    await fs.rm(dest, { recursive: true, force: true });
    await fs.mkdir(dest, { recursive: true });

    try {
      await copyDir(src, dest);
      console.log('Successfully prepared Netlify client folder.');
    } catch (err) {
      console.error('Error during Netlify preparation:', err);
      process.exit(1);
    }
  } else {
    console.error('Unknown action. Use "prepare-netlify".');
    process.exit(1);
  }
}

run();
