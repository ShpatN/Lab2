import { mockUsers } from "@/data/mockData";

const roleColors: Record<string, string> = {
  customer: "bg-neon-blue/20 text-neon-blue",
  owner: "bg-neon-purple/20 text-neon-purple",
  admin: "bg-neon-pink/20 text-neon-pink",
};

const AdminUsers = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-display font-bold">User Management</h1>
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted-foreground font-medium">User</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Email</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Role</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Joined</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((u) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-secondary/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <span className="font-semibold text-foreground">{u.name}</span>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{u.email}</td>
                <td className="p-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${roleColors[u.role]}`}>{u.role}</span></td>
                <td className="p-4 text-muted-foreground">{u.joinedDate}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">Edit</button>
                    <button className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminUsers;
