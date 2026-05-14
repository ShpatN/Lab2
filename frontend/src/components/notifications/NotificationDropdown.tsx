import { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationsContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead } = useNotifications();

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) markAllRead();
  };

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative text-muted-foreground hover:text-foreground"
          aria-label="Toggle notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] leading-[18px] text-center px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[10000] w-80 max-h-80 overflow-y-auto rounded-xl border border-border bg-card p-0 shadow-lg"
      >
        <div className="p-3 border-b border-border">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
        </div>
        {notifications.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">No notifications yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {notifications.map((n) => (
              <li key={n.id} className="p-3">
                {n.title && <p className="text-xs font-semibold text-primary mb-1">{n.title}</p>}
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
