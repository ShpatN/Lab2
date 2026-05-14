import { Users, Building2, CalendarDays, DollarSign } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { mockUsers, mockLogs } from "@/data/mockData";
import { useVenues } from "@/hooks/useVenues";
import { useEvents } from "@/hooks/useEvents";

const AdminDashboard = () => {
  const { data: venues = [] } = useVenues();
  const { data: events = [] } = useEvents();

  return (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Platform overview and management</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Total Users" value={mockUsers.length} icon={<Users className="w-5 h-5" />} trend="2 new this week" trendUp />
      <StatsCard title="Total Venues" value={venues.length} icon={<Building2 className="w-5 h-5" />} />
      <StatsCard title="Active Events" value={events.length} icon={<CalendarDays className="w-5 h-5" />} trend="3 this week" trendUp />
      <StatsCard title="Total Revenue" value="€8,500" icon={<DollarSign className="w-5 h-5" />} trend="18% growth" trendUp />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass rounded-xl p-6">
        <h2 className="font-display font-bold text-lg mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {mockLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <div className={`w-2 h-2 rounded-full ${log.type === "error" ? "bg-red-400" : log.type === "warning" ? "bg-amber-400" : log.type === "success" ? "bg-emerald-400" : "bg-neon-blue"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{log.action} — {log.target}</p>
                <p className="text-xs text-muted-foreground">{log.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="font-display font-bold text-lg mb-4">Platform Health</h2>
        <div className="space-y-4">
          {[
            { label: "Server Uptime", value: "99.9%", color: "bg-emerald-400" },
            { label: "API Response Time", value: "45ms", color: "bg-emerald-400" },
            { label: "Error Rate", value: "0.2%", color: "bg-emerald-400" },
            { label: "Active Sessions", value: "124", color: "bg-neon-blue" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${s.color}`} />
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default AdminDashboard;
