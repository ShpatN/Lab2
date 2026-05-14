import { mockLogs } from "@/data/mockData";

const typeColors: Record<string, string> = {
  info: "bg-neon-blue/20 text-neon-blue",
  success: "bg-emerald-500/20 text-emerald-400",
  warning: "bg-amber-500/20 text-amber-400",
  error: "bg-red-500/20 text-red-400",
};

const dotColors: Record<string, string> = {
  info: "bg-neon-blue",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
};

const AdminLogs = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-display font-bold">System Logs</h1>
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted-foreground font-medium">Type</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Action</th>
              <th className="text-left p-4 text-muted-foreground font-medium">User</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Target</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {mockLogs.map((log) => (
              <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/20">
                <td className="p-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[log.type]}`}>{log.type}</span>
                </td>
                <td className="p-4 font-semibold text-foreground">{log.action}</td>
                <td className="p-4 text-muted-foreground">{log.user}</td>
                <td className="p-4 text-muted-foreground">{log.target}</td>
                <td className="p-4 text-muted-foreground font-mono text-xs">{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminLogs;
