import { DollarSign, Users, Building2, CalendarDays } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { mockPayments } from "@/data/mockData";

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  refunded: "bg-red-500/20 text-red-400",
  failed: "bg-red-500/20 text-red-400",
};

const AdminReports = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-display font-bold">Reports & Payments</h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="Total Revenue" value="€8,500" icon={<DollarSign className="w-5 h-5" />} trend="18% growth" trendUp />
      <StatsCard title="Transactions" value={mockPayments.length} icon={<CalendarDays className="w-5 h-5" />} />
      <StatsCard title="Avg. Transaction" value="€40.40" icon={<Users className="w-5 h-5" />} />
      <StatsCard title="Refund Rate" value="5.2%" icon={<Building2 className="w-5 h-5" />} trend="Low" trendUp />
    </div>

    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-display font-bold text-lg">Recent Transactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted-foreground font-medium">ID</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Description</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Type</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Amount</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Method</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockPayments.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/20">
                <td className="p-4 text-muted-foreground font-mono text-xs">{p.id}</td>
                <td className="p-4 font-semibold text-foreground">{p.description}</td>
                <td className="p-4 text-muted-foreground capitalize">{p.type}</td>
                <td className="p-4 text-foreground font-semibold">€{p.amount}</td>
                <td className="p-4 text-muted-foreground">{p.method}</td>
                <td className="p-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[p.status]}`}>{p.status}</span></td>
                <td className="p-4 text-muted-foreground">{p.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminReports;
