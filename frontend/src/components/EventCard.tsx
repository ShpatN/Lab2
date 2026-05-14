import { Link } from "react-router-dom";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { EventDisplay } from "@/types/venueEvent";

const typeColors: Record<string, string> = {
  Techno: "bg-neon-purple/20 text-neon-purple",
  "Live Music": "bg-neon-blue/20 text-neon-blue",
  "DJ Set": "bg-neon-pink/20 text-neon-pink",
  Festival: "bg-amber-500/20 text-amber-400",
  "Jazz Night": "bg-cyan-500/20 text-cyan-400",
  "Themed Party": "bg-emerald-500/20 text-emerald-400",
  Karaoke: "bg-rose-500/20 text-rose-400",
};

const EventCard = ({ event }: { event: EventDisplay }) => (
  <Link to={`/events/${event.id}`} className="group glass rounded-2xl overflow-hidden hover-lift block">
    <div className="relative h-48 overflow-hidden">
      <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
      <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${typeColors[event.type] || "bg-primary/20 text-primary"}`}>
        {event.type}
      </span>
      {event.ticketPrice > 0 && (
        <span className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full bg-card/80 text-foreground">€{event.ticketPrice}</span>
      )}
    </div>
    <div className="p-5 space-y-3">
      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
      <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {event.venueName}</span>
        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {event.date} · {event.time}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-muted-foreground">{event.attendees}/{event.maxCapacity} attending</span>
        <span className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
          View Details <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </Link>
);

export default EventCard;
