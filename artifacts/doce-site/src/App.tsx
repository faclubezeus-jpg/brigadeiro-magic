import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import AdminLoginPage from "@/pages/admin-login";
import AdminDashboardPage from "@/pages/admin-dashboard";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { CartProvider } from "@/context/CartContext";
import { CartSidebar } from "@/components/CartSidebar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

/** Redirects to /admin if not authenticated. Must be used inside QueryClientProvider. */
function PrivateRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center holographic-bg">
        <div className="text-foreground font-serif text-xl animate-pulse">Verificando acesso...</div>
      </div>
    );
  }

  if (!session) {
    return <Redirect to="/admin" />;
  }

  return <Component />;
}

/** Redirects to /admin/dashboard if already authenticated. */
function PublicAdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
  });

  if (isLoading) return null;

  if (session) {
    return <Redirect to="/admin/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin">
        <PublicAdminRoute component={AdminLoginPage} />
      </Route>
      <Route path="/admin/dashboard">
        <PrivateRoute component={AdminDashboardPage} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <CustomCursor />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <CartSidebar />
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
