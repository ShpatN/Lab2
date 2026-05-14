import { Star, CheckCircle, XCircle } from "lucide-react";
import { useVenues } from "@/hooks/useVenues";

const AdminVenues = () => {
  const { data: venues = [], isLoading, isError, error } = useVenues();

  if (isLoading) {
    return <p className="text-muted-foreground">Loading venues…</p>;
  }
  if (isError) {
    return (
      <p className="text-destructive">
        {error instanceof Error ? error.message : "Failed to load venues"}
      </p>
    );
  }

  return (
  <div className="space-y-6">
    <h1 className="text-2xl font-display font-bold">Venue Management</h1>
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted-foreground font-medium">Venue</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Category</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Rating</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {venues.map((v) => (
              <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/20">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={v.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold text-foreground">{v.name}</p>
                      <p className="text-xs text-muted-foreground">{v.location}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">{v.category}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-foreground">{v.rating}</span>
                  </div>
                </td>
                <td className="p-4">
                  {v.isVerified
                    ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="w-3 h-3" /> Verified</span>
                    : <span className="flex items-center gap-1 text-xs text-amber-400"><XCircle className="w-3 h-3" /> Pending</span>}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {!v.isVerified && <button className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">Approve</button>}
                    <button className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">Suspend</button>
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
};

export default AdminVenues;
