import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AssetList from "@/pages/AssetList";
import AssetForm from "@/pages/AssetForm";
import AssetDetail from "@/pages/AssetDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      setLocation("/login");
    }
  }, [loading, session, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(222,47%,11%)]">
        <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <AuthGuard><Dashboard /></AuthGuard>}
      </Route>
      <Route path="/assets">
        {() => <AuthGuard><AssetList /></AuthGuard>}
      </Route>
      <Route path="/assets/new">
        {() => <AuthGuard><AssetForm /></AuthGuard>}
      </Route>
      <Route path="/assets/:id/edit">
        {(params) => (
          <AuthGuard>
            <AssetForm assetId={parseInt(params.id, 10)} />
          </AuthGuard>
        )}
      </Route>
      <Route path="/assets/:id">
        {(params) => (
          <AuthGuard>
            <AssetDetail assetId={parseInt(params.id, 10)} />
          </AuthGuard>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
