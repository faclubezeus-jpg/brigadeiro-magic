import { Router, type IRouter } from "express";
import { AdminLoginBody, AdminLoginResponse, AdminMeResponse } from "@workspace/api-zod";

const ADMIN_LOGIN = "docinho";
const ADMIN_PASSWORD = "docinho321";
const SESSION_KEY = "admin_authenticated";

const router: IRouter = Router();

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    console.error("Login validation failed:", parsed.error.message);
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { login, password } = parsed.data;
  console.log(`Login attempt for user: ${login}`);

  const isValid = 
    (login === "docinho" && password === "docinho321") || 
    (login === "docinho doce" && password === "docinho digital 321");

  if (isValid) {
    console.log("Login successful, setting session...");
    (req.session as any)[SESSION_KEY] = true;
    res.json(AdminLoginResponse.parse({ authenticated: true }));
    return;
  }

  console.warn(`Invalid credentials for user: ${login}`);
  res.status(401).json({ error: "Credenciais inválidas" });
});

router.post("/admin/logout", async (req, res): Promise<void> => {
  (req.session as any)[SESSION_KEY] = false;
  res.json({ authenticated: false });
});

router.get("/admin/me", async (req, res): Promise<void> => {
  const authenticated = (req.session as any)[SESSION_KEY] === true;
  if (!authenticated) {
    res.status(401).json({ authenticated: false });
    return;
  }
  res.json(AdminMeResponse.parse({ authenticated: true }));
});

export default router;
