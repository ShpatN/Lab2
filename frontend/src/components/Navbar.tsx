import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authAvatarUrl, dashboardPathForUser } from "@/lib/authUser";
import LogoutIconButton from "./auth/LogoutIconButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (!user) return "/login";
    return dashboardPathForUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Venues", href: "/venues" },
    { label: "Events", href: "/events" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 group">
            <Sparkles className="w-5 h-5 text-neon-purple group-hover:text-neon-pink transition-colors" />
            <span className="text-lg sm:text-xl font-display font-bold text-foreground">
              Prishtina <span className="text-primary">Nights</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.label} to={link.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full">Dashboard</Link>
                <img src={authAvatarUrl(user!)} alt="" className="w-8 h-8 rounded-full border-2 border-primary/50" />
                <LogoutIconButton onClick={handleLogout} />
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Login</Link>
                <Link to="/register" className="gradient-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity">Register</Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground p-2" aria-label="Toggle menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link key={link.label} to={link.href} onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-base font-medium px-2 py-2">{link.label}</Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors text-base font-medium px-2 py-2">Dashboard</Link>
                  <button onClick={handleLogout} className="text-left text-muted-foreground hover:text-foreground transition-colors text-base font-medium px-2 py-2">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground text-base font-medium px-2 py-2">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="gradient-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-lg text-center hover:opacity-90 transition-opacity">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
