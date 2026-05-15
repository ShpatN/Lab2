import { Link } from "react-router-dom";
import { CalendarCheck, Ticket, Heart, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import { mockTickets } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { useEvents } from "@/hooks/useEvents";
import { useReservations } from "@/hooks/useReservations";
import { matchesMockUserId } from "@/lib/authUser";

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { data: events = [], isLoading: eventsLoading, isError: eventsError, error: eventsErr } = useEvents();
  const { data: myReservations = [] } = useReservations(false);
  const myTickets = mockTickets.filter((t) => user && matchesMockUserId(t.userId, user.id));
  const upcoming = events.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Welcome back, {user?.firstName?.trim() || user?.email?.split("@")[0] || "friend"} 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your nightlife</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Active Reservations" value={myReservations.filter((r) => r.status === "confirmed").length} icon={<CalendarCheck className="w-5 h-5" />} />
        <StatsCard title="Active Tickets" value={myTickets.filter((t) => t.status === "active").length} icon={<Ticket className="w-5 h-5" />} />
        <StatsCard title="Favorites" value={3} icon={<Heart className="w-5 h-5" />} />
        <StatsCard title="Events Attended" value={myTickets.filter((t) => t.status === "used").length} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="font-display font-bold text-lg mb-4">Upcoming Events You Might Like</h2>
        {eventsLoading ? (
          <p className="text-sm text-muted-foreground">Loading events…</p>
        ) : eventsError ? (
          <p className="text-sm text-destructive">
            {eventsErr instanceof Error ? eventsErr.message : "Failed to load events"}
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((e) => (
              <Link key={e.id} to={`/events/${e.id}`} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <img src={e.image} alt="" className="w-16 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.date} · {e.venueName}</p>
                </div>
                <span className="text-xs font-bold text-primary">{e.ticketPrice > 0 ? `€${e.ticketPrice}` : "Free"}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
