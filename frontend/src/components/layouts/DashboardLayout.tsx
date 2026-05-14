import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, CalendarCheck, Ticket, Heart, User, Menu, Sparkles } from "lucide-react";
import DashboardSidebar, { type SidebarLink } from "./DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { authAvatarUrl, authDisplayName } from "@/lib/authUser";
import LogoutIconButton from "@/components/auth/LogoutIconButton";

const links: SidebarLink[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Reservations", href: "/dashboard/reservations", icon: <CalendarCheck className="w-4 h-4" /> },
  { label: "Tickets", href: "/dashboard/tickets", icon: <Ticket className="w-4 h-4" /> },
  { label: "Favorites", href: "/dashboard/favorites", icon: <Heart className="w-4 h-4" /> },
  { label: "Profile", href: "/dashboard/profile", icon: <User className="w-4 h-4" /> },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar links={links} title="My Account" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card/50 backdrop-blur-sm relative z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-sm text-foreground">Prishtina <span className="text-primary">Nights</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user ? authDisplayName(user) : ""}</span>
            <img src={user ? authAvatarUrl(user) : ""} alt="" className="w-8 h-8 rounded-full" />
            <LogoutIconButton onClick={handleLogout} />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
