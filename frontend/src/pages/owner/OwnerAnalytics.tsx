import { DollarSign, Users, TrendingUp, Eye } from "lucide-react";
import StatsCard from "@/components/StatsCard";

const OwnerAnalytics = () => {
  const monthlyData = [
    { month: "Jan", revenue: 2100, visitors: 450 },
    { month: "Feb", revenue: 2800, visitors: 520 },
    { month: "Mar", revenue: 3200, visitors: 610 },
    { month: "Apr", revenue: 4250, visitors: 780 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Analytics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Monthly Revenue" value="€4,250" icon={<DollarSign className="w-5 h-5" />} trend="32% vs last month" trendUp />
        <StatsCard title="Total Visitors" value="780" icon={<Users className="w-5 h-5" />} trend="15% vs last month" trendUp />
        <StatsCard title="Avg. Ticket Price" value="€14.50" icon={<TrendingUp className="w-5 h-5" />} />
        <StatsCard title="Page Views" value="3,420" icon={<Eye className="w-5 h-5" />} trend="22% vs last month" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h2 className="font-display font-bold text-lg mb-4">Monthly Revenue</h2>
          <div className="space-y-4">
            {monthlyData.map((m) => (
              <div key={m.month} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-8">{m.month}</span>
                <div className="flex-1 h-3 rounded-full bg-secondary">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${(m.revenue / 5000) * 100}%` }} />
                </div>
                <span className="text-xs text-foreground font-medium w-16 text-right">€{m.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="font-display font-bold text-lg mb-4">Top Events by Revenue</h2>
          <div className="space-y-3">
            {[
              { name: "Neon Dreams — DJ Arton", revenue: "€1,200" },
              { name: "Sunset Sessions Vol. 8", revenue: "€850" },
              { name: "Techno Underground", revenue: "€720" },
              { name: "Warehouse Rave", revenue: "€680" },
            ].map((e, i) => (
              <div key={e.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  <span className="text-sm font-medium text-foreground">{e.name}</span>
                </div>
                <span className="text-sm font-bold text-primary">{e.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalytics;
