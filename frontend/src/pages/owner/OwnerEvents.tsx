import { useAuth } from "@/context/AuthContext";
import { Users } from "lucide-react";
import { useVenues } from "@/hooks/useVenues";
import { useEvents } from "@/hooks/useEvents";
import { venueOwnedByUser } from "@/lib/venueEventMappers";
import { Link } from "react-router-dom";
import ExportActions from "@/components/exports/ExportActions";

const OwnerEvents = () => {
  const { user } = useAuth();
  const { data: venues = [], isLoading: vLoading, isError: vErr, error: vError } = useVenues();
  const { data: events = [], isLoading: eLoading, isError: eErr, error: eError } = useEvents();
  const myVenues = venues.filter((v) => venueOwnedByUser(v, user?.id));
  const myEvents = events.filter((e) => myVenues.some((v) => v.id === e.venueId));

  if (vLoading || eLoading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }
  if (vErr || eErr) {
    const msg =
      (vError instanceof Error ? vError.message : null) ||
      (eError instanceof Error ? eError.message : null) ||
      "Failed to load data";
    return <p className="text-destructive">{msg}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">My Events</h1>
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <ExportActions dataset="events" defaultScope="venue" label="Events" />
          <Link to="/owner/events/new" className="gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">+ Create Event</Link>
        </div>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-muted-foreground font-medium">Event</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Venue</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Capacity</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myEvents.map((e) => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-secondary/20">
                  <td className="p-4">
                    <p className="font-semibold text-foreground">{e.title}</p>
                    <span className="text-xs text-muted-foreground">{e.type}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{e.venueName}</td>
                  <td className="p-4 text-muted-foreground">{e.date}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" /> {e.attendees}/{e.maxCapacity}
                    </div>
                  </td>
                  <td className="p-4">
                    <Link to={`/owner/events/${e.id}/edit`} className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">Edit</Link>
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

export default OwnerEvents;
