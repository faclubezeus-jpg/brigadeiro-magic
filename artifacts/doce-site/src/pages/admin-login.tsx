import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useAdminLogin, useAdminMe, getAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: session } = useAdminMe({ query: { queryKey: getAdminMeQueryKey() } });
  const loginMutation = useAdminLogin();

  if (session?.authenticated) {
    setLocation("/admin/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(
      { data: { login, password } },
      {
        onSuccess: (data) => {
          if (data.authenticated) {
            queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
            setLocation("/admin/dashboard");
          } else {
            setError("Credenciais inválidas");
          }
        },
        onError: () => {
          setError("Credenciais inválidas. Verifique o login e senha.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center holographic-bg p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="glass-heavy rounded-3xl p-10 w-full max-w-md shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4">🍫</div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Área DM</h1>
          <p className="text-muted-foreground text-sm">Acesso restrito — equipe interna</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-medium text-foreground mb-1.5">Login</label>
            <input
              data-testid="input-login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Seu login"
              required
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-foreground mb-1.5">Senha</label>
            <input
              data-testid="input-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-white/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Sua senha"
              required
            />
          </motion.div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-destructive text-sm text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            data-testid="button-login"
            type="submit"
            disabled={loginMutation.isPending}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-base shadow-md hover:shadow-lg transition-all disabled:opacity-60"
          >
            {loginMutation.isPending ? "Entrando..." : "Entrar"}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Voltar ao site
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
