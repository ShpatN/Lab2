import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface Props {
  links: SidebarLink[];
  title: string;
  open: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ links, title, open, onClose }: Props) => (
  <>
    {/* Mobile overlay */}
    {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}

    <aside
      className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        <span className="font-display font-bold text-foreground">{title}</span>
        <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  </>
);

export default DashboardSidebar;
