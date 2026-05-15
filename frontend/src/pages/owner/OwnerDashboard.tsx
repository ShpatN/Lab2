import { DollarSign, CalendarCheck, Users, TrendingUp, Building2 } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { useAuth } from "@/context/AuthContext";
import { useVenues } from "@/hooks/useVenues";
import { useEvents } from "@/hooks/useEvents";
import { useReservations } from "@/hooks/useReservations";
import { venueOwnedByUser } from "@/lib/venueEventMappers";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const { data: venues = [], isLoading: vLoading, isError: vErr, error: vError } = useVenues();
  const { data: events = [], isLoading: eLoading, isError: eErr, error: eError } = useEvents();
  const { data: myReservations = [], isLoading: rLoading, isError: rErr, error: rError } = useReservations(true);
  const myVenues = venues.filter((v) => venueOwnedByUser(v, user?.id));
  const myEvents = events.filter((e) => myVenues.some((v) => v.id === e.venueId));

  if (vLoading || eLoading || rLoading) {
    return <p className="text-muted-foreground">Loading…</p>;
  }
  if (vErr || eErr || rErr) {
    const msg =
      (vError instanceof Error ? vError.message : null) ||
      (eError instanceof Error ? eError.message : null) ||
      (rError instanceof Error ? rError.message : null) ||
      "Failed to load data";
    return <p className="text-destructive">{msg}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Owner Dashboard</h1>
        <p className="text-muted-foreground">Manage your venues and track performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value="€4,250" icon={<DollarSign className="w-5 h-5" />} trend="12% vs last month" trendUp />
        <StatsCard title="Venues" value={myVenues.length} icon={<Building2 className="w-5 h-5" />} />
        <StatsCard title="Active Events" value={myEvents.length} icon={<CalendarCheck className="w-5 h-5" />} />
        <StatsCard title="Reservations" value={myReservations.length} icon={<Users className="w-5 h-5" />} trend="8% vs last week" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6">
          <h2 className="font-display font-bold text-lg mb-4">Recent Reservations</h2>
          <div className="space-y-3">
            {myReservations.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                <div>
                  <p className="text-sm font-semibold text-foreground">{r.venueName} — {r.tableType}</p>
                  <p className="text-xs text-muted-foreground">{r.date} · {r.guests} guests</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400" : r.status === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
              </div>
            ))}
            {myReservations.length === 0 && (
              <p className="text-sm text-muted-foreground py-2">No reservations yet.</p>
            )}
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="font-display font-bold text-lg mb-4">Revenue Overview</h2>
          <div className="space-y-4">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const val = [20, 35, 25, 45, 70, 95, 60][i];
              return (
                <div key={day} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-8">{day}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full gradient-primary" style={{ width: `${val}%` }} />
                  </div>
                  <span className="text-xs text-foreground font-medium w-12 text-right">€{Math.round(val * 4.5)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
