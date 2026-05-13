import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRegisterMutation } from "@/hooks/useAuthMutations";
import { dashboardPathForUser } from "@/lib/authUser";

function splitFullName(full: string): { firstName: string; lastName: string } {
  const t = full.trim();
  const parts = t.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  if (isAuthenticated && user) {
    return <Navigate to={dashboardPathForUser(user)} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { firstName, lastName } = splitFullName(name);
    if (!firstName) {
      setError("Please enter your name.");
      return;
    }
    registerMutation.mutate(
      { email, password, firstName, lastName },
      {
        onSuccess: (data) => {
          navigate(dashboardPathForUser(data.user), { replace: true });
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : "Registration failed");
        },
      },
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-20">
      <div className="w-full max-w-md glass rounded-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-display font-bold text-xl text-foreground">Prishtina <span className="text-primary">Nights</span></span>
          </Link>
          <p className="text-muted-foreground">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={registerMutation.isPending} className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60">
            {registerMutation.isPending ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-sm text-muted-foreground text-center">Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
};

export default Register;
