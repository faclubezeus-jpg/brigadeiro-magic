import { Router, type IRouter } from "express";
import { AdminLoginBody, AdminLoginResponse, AdminMeResponse } from "@workspace/api-zod";

const ADMIN_LOGIN = "docinho";
const ADMIN_PASSWORD = "docinho321";
const SESSION_KEY = "admin_authenticated";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { login, password } = parsed.data;
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    (req.session as Record<string, unknown>)[SESSION_KEY] = true;
    res.json(AdminLoginResponse.parse({ authenticated: true }));
    return;
  }

  res.status(401).json({ error: "Credenciais inválidas" });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  (req.session as Record<string, unknown>)[SESSION_KEY] = false;
  res.json({ authenticated: false });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const authenticated = (req.session as Record<string, unknown>)[SESSION_KEY] === true;
  if (!authenticated) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json(AdminMeResponse.parse({ authenticated: true }));
});

export default router;
