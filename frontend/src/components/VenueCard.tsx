import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";
import type { VenueDisplay } from "@/types/venueEvent";

const categoryColors: Record<string, string> = {
  Club: "bg-neon-purple/20 text-neon-purple",
  Bar: "bg-amber-500/20 text-amber-400",
  Lounge: "bg-neon-pink/20 text-neon-pink",
  Rooftop: "bg-cyan-500/20 text-cyan-400",
  "Live Music": "bg-neon-blue/20 text-neon-blue",
};

const VenueCard = ({ venue }: { venue: VenueDisplay }) => (
  <Link to={`/venues/${venue.id}`} className="group glass rounded-2xl overflow-hidden hover-lift block">
    <div className="relative h-48 overflow-hidden">
      <img src={venue.image} alt={venue.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
      <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[venue.category] || "bg-primary/20 text-primary"}`}>
        {venue.category}
      </span>
      {venue.isVerified && (
        <span className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">✓ Verified</span>
      )}
    </div>
    <div className="p-5 space-y-2">
      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">{venue.name}</h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="w-4 h-4" /> {venue.location}
      </div>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
        <span className="text-sm font-semibold text-foreground">{venue.rating}</span>
        <span className="text-sm text-muted-foreground">({venue.reviewCount} reviews)</span>
      </div>
    </div>
  </Link>
);

export default VenueCard;
