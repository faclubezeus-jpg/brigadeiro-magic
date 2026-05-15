/**
 * bundle-netlify-function.mjs
 *
 * Compiles netlify/functions/api-src.ts into a self-contained api.mjs bundle.
 * Runs as the last step of `pnpm run build:netlify`.
 */
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");

// Resolve esbuild and plugins from the api-server package (where they are installed)
const apiServerDir = path.join(rootDir, "artifacts", "api-server");
const localRequire = createRequire(path.join(apiServerDir, "package.json"));
globalThis.require = localRequire;

// On Windows, absolute paths must be converted to file:// URLs for ESM dynamic import
const { build } = await import(pathToFileURL(localRequire.resolve("esbuild")).href);
const esbuildPluginPino = (await import(pathToFileURL(localRequire.resolve("esbuild-plugin-pino")).href)).default;

const entryPoint = path.join(rootDir, "netlify", "functions-src", "api.ts");
const outDir = path.join(rootDir, "netlify", "functions");

console.log("📦 Bundling Netlify function...");

await build({
  entryPoints: [entryPoint],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outdir: outDir,
  outExtension: { ".js": ".mjs" },
  external: [
    "*.node",
    "pg-native",
    "better-sqlite3",
    "canvas",
    "bcrypt",
    "argon2",
    "fsevents",
    "re2",
    "sharp",
    "sqlite3",
  ],
  banner: {
    js: `import { createRequire as __crReq } from 'node:module';
import __path from 'node:path';
import __url from 'node:url';
const __metaUrl = (typeof import.meta !== 'undefined' && import.meta.url) ? import.meta.url : 'file://' + __path.resolve('api.mjs');
globalThis.require = __crReq(__metaUrl);
try { globalThis.__filename = __url.fileURLToPath(__metaUrl); } catch { globalThis.__filename = __path.resolve('api.mjs'); }
globalThis.__dirname = __path.dirname(globalThis.__filename);
`,
  },
  plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
  logLevel: "info",
});

console.log("✅ Netlify function bundled → netlify/functions/api.mjs");
