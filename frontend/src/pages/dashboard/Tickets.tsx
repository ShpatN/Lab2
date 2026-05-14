import { mockTickets } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { matchesMockUserId } from "@/lib/authUser";

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  used: "bg-primary/20 text-primary",
  expired: "bg-muted text-muted-foreground",
  refunded: "bg-red-500/20 text-red-400",
};

const Tickets = () => {
  const { user } = useAuth();
  const tickets = mockTickets.filter((t) => user && matchesMockUserId(t.userId, user.id));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">My Tickets</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tickets.map((t) => (
          <div key={t.id} className="glass rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[t.status]}`}>{t.status}</span>
              <span className="text-xs text-muted-foreground">{t.purchasedAt}</span>
            </div>
            <h3 className="font-display font-bold text-foreground">{t.eventName}</h3>
            <p className="text-sm text-muted-foreground">{t.venueName}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t.ticketType} × {t.quantity}</span>
              <span className="font-bold text-foreground">{t.totalPrice > 0 ? `€${t.totalPrice}` : "Free"}</span>
            </div>
            <p className="text-xs text-muted-foreground">📅 {t.date}</p>
          </div>
        ))}
        {tickets.length === 0 && <p className="text-muted-foreground col-span-2 text-center py-12">No tickets yet.</p>}
      </div>
    </div>
  );
};

export default Tickets;
