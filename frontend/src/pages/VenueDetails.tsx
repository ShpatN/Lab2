import { useParams, Link } from "react-router-dom";
import { MapPin, Star, ArrowLeft, Users, CheckCircle } from "lucide-react";
import { mockReviews } from "@/data/mockData";
import { useVenues } from "@/hooks/useVenues";
import { useEvents } from "@/hooks/useEvents";

const VenueDetails = () => {
  const { id } = useParams();
  const { data: venues = [], isLoading, isError, error } = useVenues();
  const { data: events = [] } = useEvents();
  const venue = venues.find((v) => v.id === id);
  const venueEvents = events.filter((e) => e.venueId === id);
  const reviews = mockReviews.filter((r) => r.venueId === id);

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 text-center text-muted-foreground">Loading venue…</div>
    );
  }

  if (isError) {
    return (
      <div className="pt-24 pb-16 text-center">
        <p className="text-destructive font-medium">Could not load venue.</p>
        <p className="text-sm text-muted-foreground mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
        <Link to="/venues" className="text-primary font-semibold mt-4 inline-block">← Back to Venues</Link>
      </div>
    );
  }

  if (!venue) return (
    <div className="pt-24 pb-16 text-center">
      <p className="text-muted-foreground text-lg">Venue not found.</p>
      <Link to="/venues" className="text-primary font-semibold mt-4 inline-block">← Back to Venues</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/venues" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Venues
        </Link>

        {/* Header */}
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
          <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary">{venue.category}</span>
              {venue.isVerified && <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>}
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">{venue.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {venue.address}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-400 fill-amber-400" /> {venue.rating} ({venue.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-xl p-6">
              <h2 className="font-display font-bold text-xl mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{venue.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {venue.features.map((f) => (
                  <span key={f} className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground">{f}</span>
                ))}
              </div>
            </div>

            {/* Tables */}
            <div className="glass rounded-xl p-6">
              <h2 className="font-display font-bold text-xl mb-4">Tables & Seating</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {venue.tables.map((t) => (
                  <div key={t.type} className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <h3 className="font-semibold text-foreground">{t.type}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> Up to {t.capacity}</span>
                      <span>{t.price > 0 ? `€${t.price}` : "Free"}</span>
                    </div>
                    <span className={`text-xs font-medium ${t.available > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {t.available > 0 ? `${t.available} available` : "Fully booked"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="glass rounded-xl p-6">
              <h2 className="font-display font-bold text-xl mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-secondary/30 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <img src={r.userAvatar} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{r.userName}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-auto">{r.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-bold text-lg mb-3">Opening Hours</h3>
              <div className="space-y-2">
                {venue.openingHours.map((h) => (
                  <div key={h.day} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{h.day}</span>
                    <span className={`font-medium ${h.hours === "Closed" ? "text-red-400" : "text-foreground"}`}>{h.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="font-display font-bold text-lg mb-3">Upcoming Events</h3>
              {venueEvents.length > 0 ? (
                <div className="space-y-3">
                  {venueEvents.slice(0, 3).map((e) => (
                    <Link key={e.id} to={`/events/${e.id}`} className="block bg-secondary/30 rounded-lg p-3 hover:bg-secondary/50 transition-colors">
                      <p className="text-sm font-semibold text-foreground">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.date} · {e.time}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming events.</p>
              )}
            </div>

            <Link to={`/dashboard/reservations?venueId=${venue.id}`} className="block w-full text-center gradient-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity">
              Reserve a Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
