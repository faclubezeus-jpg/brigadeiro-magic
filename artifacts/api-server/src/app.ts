import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";

const PostgresStore = connectPgSimple(session);

// Universal path resolution for local and cloud (Netlify)
const __dirname = path.resolve();

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: process.env.DATABASE_URL
      ? new PostgresStore({
        conString: process.env.DATABASE_URL,
        tableName: "session",
        createTableIfMissing: true,
      })
      : undefined, // Falls back to MemoryStore if no DB is available
    secret: process.env.SESSION_SECRET ?? "docinho-secret-key-muito-seguro-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24h
      sameSite: "lax",
    },
  }),
);

// Serve uploaded files
const DB_PATH_U = process.env.DATABASE_PATH || path.join(process.cwd(), "sqlite.db");
const DB_DIR_U = DB_PATH_U.startsWith("file:") ? path.dirname(DB_PATH_U.replace("file:", "")) : path.dirname(DB_PATH_U);
const UPLOADS_DIR = path.join(DB_DIR_U, "uploads");
app.use("/api/uploads", express.static(UPLOADS_DIR));

app.use("/api", router);
// Support for Netlify Functions where the /api prefix might be stripped in the function path
app.use("/", router);

// Serve static frontend files (Vite build)
const clientPath = path.join(process.cwd(), "client");
app.use(express.static(clientPath));

// Fallback for SPA (Single Page Application)
app.use((req, res) => {
  if (req.method === 'GET') {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.sendFile(path.join(clientPath, "index.html"));
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

export default app;
