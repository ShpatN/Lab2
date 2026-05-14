import { useParams, Link } from "react-router-dom";
import { MapPin, Clock, ArrowLeft, Users, Ticket } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";

const EventDetails = () => {
  const { id } = useParams();
  const { data: events = [], isLoading, isError, error } = useEvents();
  const event = events.find((e) => e.id === id);

  if (isLoading) {
    return <div className="pt-24 pb-16 text-center text-muted-foreground">Loading event…</div>;
  }

  if (isError) {
    return (
      <div className="pt-24 pb-16 text-center">
        <p className="text-destructive font-medium">Could not load event.</p>
        <p className="text-sm text-muted-foreground mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
        <Link to="/events" className="text-primary font-semibold mt-4 inline-block">← Back to Events</Link>
      </div>
    );
  }

  if (!event) return (
    <div className="pt-24 pb-16 text-center">
      <p className="text-muted-foreground text-lg">Event not found.</p>
      <Link to="/events" className="text-primary font-semibold mt-4 inline-block">← Back to Events</Link>
    </div>
  );

  const capacityPercent =
    event.maxCapacity > 0 ? Math.round((event.attendees / event.maxCapacity) * 100) : 0;

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary mb-2 inline-block">{event.type}</span>
            <h1 className="text-3xl font-display font-bold text-foreground">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.venueName}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {event.date} · {event.time}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {event.attendees} attending</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-xl p-6">
              <h2 className="font-display font-bold text-xl mb-3">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed">{event.description}</p>
            </div>

            <div className="glass rounded-xl p-6">
              <h2 className="font-display font-bold text-xl mb-3">Capacity</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{event.attendees} / {event.maxCapacity}</span>
                  <span className="text-foreground font-semibold">{capacityPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary">
                  <div className="h-full rounded-full gradient-primary" style={{ width: `${capacityPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h2 className="font-display font-bold text-xl mb-3">Venue</h2>
              <Link to={`/venues/${event.venueId}`} className="text-primary font-semibold hover:underline">{event.venueName} →</Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2"><Ticket className="w-5 h-5" /> Tickets</h3>
              <div className="space-y-3">
                {event.ticketTypes.map((t) => (
                  <div key={t.name} className="bg-secondary/50 rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.available > 0 ? `${t.available} left` : "Sold out"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{t.price > 0 ? `€${t.price}` : "Free"}</p>
                      {t.available > 0 ? (
                        <button className="mt-1 text-xs font-semibold text-primary hover:underline">Get Ticket</button>
                      ) : (
                        <span className="text-xs text-red-400">Unavailable</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity">
              Buy Tickets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
