import { Users } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import ExportActions from "@/components/exports/ExportActions";

const AdminEvents = () => {
  const { data: events = [], isLoading, isError, error } = useEvents();

  if (isLoading) {
    return <p className="text-muted-foreground">Loading events…</p>;
  }
  if (isError) {
    return (
      <p className="text-destructive">
        {error instanceof Error ? error.message : "Failed to load events"}
      </p>
    );
  }

  return (
  <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <h1 className="text-2xl font-display font-bold">Event Management</h1>
      <div className="flex flex-wrap items-center gap-2">
        <ExportActions dataset="events" defaultScope="all" label="Events" />
        <ExportActions dataset="reservations" defaultScope="all" label="Reservations" />
        <ExportActions dataset="payments" defaultScope="all" label="Payments" />
      </div>
    </div>
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 text-muted-foreground font-medium">Event</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Type</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Venue</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Capacity</th>
              <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-secondary/20">
                <td className="p-4 font-semibold text-foreground">{e.title}</td>
                <td className="p-4 text-muted-foreground">{e.type}</td>
                <td className="p-4 text-muted-foreground">{e.venueName}</td>
                <td className="p-4 text-muted-foreground">{e.date}</td>
                <td className="p-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-3 h-3" /> {e.attendees}/{e.maxCapacity}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground hover:bg-secondary/80">View</button>
                    <button className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30">Cancel</button>
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

export default AdminEvents;
