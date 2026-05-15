// This file is a dedicated entry point for serverless environments (Netlify/Vercel).
// It exports the Express app WITHOUT calling app.listen(), which is not needed in serverless.
export { default } from "./app";
