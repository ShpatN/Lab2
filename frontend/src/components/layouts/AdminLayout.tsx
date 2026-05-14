import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Building2, CalendarDays, FileBarChart, ScrollText, Menu, Shield } from "lucide-react";
import DashboardSidebar, { type SidebarLink } from "./DashboardSidebar";
import { useAuth } from "@/context/AuthContext";
import { authAvatarUrl, authDisplayName } from "@/lib/authUser";
import LogoutIconButton from "@/components/auth/LogoutIconButton";

const links: SidebarLink[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Users", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
  { label: "Venues", href: "/admin/venues", icon: <Building2 className="w-4 h-4" /> },
  { label: "Events", href: "/admin/events", icon: <CalendarDays className="w-4 h-4" /> },
  { label: "Reports", href: "/admin/reports", icon: <FileBarChart className="w-4 h-4" /> },
  { label: "Logs", href: "/admin/logs", icon: <ScrollText className="w-4 h-4" /> },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar links={links} title="Admin Panel" open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-4 lg:px-6 bg-card/50 backdrop-blur-sm relative z-40">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-foreground"><Menu className="w-5 h-5" /></button>
            <Link to="/" className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-neon-pink" />
              <span className="font-display font-bold text-sm text-foreground">Admin <span className="text-neon-pink">Panel</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded-full bg-neon-pink/20 text-neon-pink font-semibold">Admin</span>
            <span className="text-sm text-muted-foreground hidden sm:block">{user ? authDisplayName(user) : ""}</span>
            <img src={user ? authAvatarUrl(user) : ""} alt="" className="w-8 h-8 rounded-full" />
            <LogoutIconButton onClick={handleLogout} />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
