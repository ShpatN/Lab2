import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import VenueCard from "@/components/VenueCard";
import EventCard from "@/components/EventCard";
import heroImg from "@/assets/hero-bg.jpg";
import { useVenues } from "@/hooks/useVenues";
import { useEvents } from "@/hooks/useEvents";
import { useAuth } from "@/context/AuthContext";
import { authAppRole } from "@/lib/authUser";

const categories = [
  { label: "Club", icon: "🎵", color: "from-purple-500/20 to-purple-900/20" },
  { label: "Bar", icon: "🍸", color: "from-amber-500/20 to-amber-900/20" },
  { label: "Lounge", icon: "🛋️", color: "from-emerald-500/20 to-emerald-900/20" },
  { label: "Rooftop", icon: "🌆", color: "from-cyan-500/20 to-cyan-900/20" },
  { label: "Live Music", icon: "🎸", color: "from-blue-500/20 to-blue-900/20" },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: venues = [], isLoading: venuesLoading, isError: venuesError, error: venuesErr } = useVenues();
  const { data: events = [], isLoading: eventsLoading, isError: eventsError, error: eventsErr } = useEvents();
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const featuredVenues = useMemo(
    () =>
      venues
        .filter((v) => !normalizedSearch || v.name.toLowerCase().includes(normalizedSearch) || v.location.toLowerCase().includes(normalizedSearch))
        .slice(0, 4),
    [venues, normalizedSearch],
  );
  const featuredEvents = useMemo(
    () =>
      events
        .filter((e) => e.isFeatured)
        .filter((e) => !normalizedSearch || e.title.toLowerCase().includes(normalizedSearch) || e.venueName.toLowerCase().includes(normalizedSearch))
        .slice(0, 6),
    [events, normalizedSearch],
  );
  const canShowAddVenue = !isAuthenticated || (user && (authAppRole(user) === "owner" || authAppRole(user) === "admin"));

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-20 pb-20 sm:pt-32 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-foreground neon-text leading-tight">
            Discover Prishtina's<br /><span className="text-primary">Nightlife</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the best clubs, bars, rooftop parties, and live music events happening tonight in Prishtina.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search venues or events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    navigate(`/venues?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-card/60 backdrop-blur border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/events" className="gradient-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
              Explore Events <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/venues" className="bg-secondary text-secondary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-secondary/80 transition-colors">
              Browse Venues
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-8">Explore by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((c) => (
              <Link
                key={c.label}
                to={`/venues?category=${c.label}`}
                className={`glass rounded-xl px-6 py-4 flex items-center gap-3 hover-lift cursor-pointer bg-gradient-to-br ${c.color}`}
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="font-semibold text-foreground">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold">Featured Venues</h2>
            <Link to="/venues" className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {venuesLoading ? (
            <p className="text-center text-muted-foreground py-12">Loading venues…</p>
          ) : venuesError ? (
            <p className="text-center text-destructive py-12">
              {venuesErr instanceof Error ? venuesErr.message : "Failed to load venues"}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVenues.map((v) => (
                <VenueCard key={v.id} venue={v} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-display font-bold">Featured Events</h2>
            <Link to="/events" className="text-sm font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          {eventsLoading ? (
            <p className="text-center text-muted-foreground py-12">Loading events…</p>
          ) : eventsError ? (
            <p className="text-center text-destructive py-12">
              {eventsErr instanceof Error ? eventsErr.message : "Failed to load events"}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {canShowAddVenue && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="glass rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto neon-glow">
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">Are you a venue owner?</h2>
              <p className="text-muted-foreground mb-6">List your club, bar, or venue on Prishtina Nights and reach thousands of nightlife enthusiasts.</p>
              <Link to="/owner/venues/new" className="inline-flex gradient-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">
                Add Your Venue
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
