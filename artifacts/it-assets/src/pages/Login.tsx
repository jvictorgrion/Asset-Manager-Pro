import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        setLocation("/");
      }
    } catch {
      toast({ title: "Sign in failed", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[hsl(222,47%,11%)]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 border-r border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-blue-500/20">
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">IT Asset Inventory</p>
            <p className="text-xs text-slate-400">Enterprise Management</p>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-white mb-3 leading-tight">
            Track every asset,<br />every change, every time.
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            A purpose-built system for IT teams to manage hardware assets, monitor status changes, and maintain a complete audit trail.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { label: "Asset tracking", desc: "Full lifecycle visibility" },
              { label: "Change history", desc: "Complete audit trail" },
              { label: "Notes", desc: "Contextual annotations" },
            ].map((f) => (
              <div key={f.label} className="border border-slate-700/50 rounded-xl p-3 bg-slate-800/30">
                <p className="text-xs font-semibold text-blue-400 mb-1">{f.label}</p>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">
          IT Asset Inventory System &copy; {new Date().getFullYear()}
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/20">
              <Shield className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-sm font-semibold text-white">IT Asset Inventory</p>
          </div>

          <h2 className="text-xl font-bold text-white mb-1">Sign in</h2>
          <p className="text-sm text-slate-400 mb-6">Access your asset inventory</p>

          <Card className="bg-slate-800/50 border-slate-700/50 shadow-xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-300 text-xs font-medium">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    data-testid="input-email"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-300 text-xs font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      data-testid="input-password"
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-400 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
                  disabled={loading}
                  data-testid="button-login"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing in...</>
                  ) : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-xs text-slate-500 text-center mt-4">
            Use your Supabase account credentials to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
