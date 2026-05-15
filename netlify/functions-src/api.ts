import serverless from "serverless-http";
import app from "../../artifacts/api-server/src/app-export";

// Wrap the Express app for Netlify's serverless environment.
// 'app-export' exports only the Express instance — no listen() call.
export const handler = serverless(app, {
  // Strip the /.netlify/functions/api prefix so Express routes work as expected
  request(request) {
    request.url = request.url?.replace(/^\/.netlify\/functions\/api/, "") || "/";
    return request;
  },
});
