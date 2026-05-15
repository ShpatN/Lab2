import { useAuth } from "@/context/AuthContext";
import { MapPin, Star, CheckCircle } from "lucide-react";
import { useVenues } from "@/hooks/useVenues";
import { venueOwnedByUser } from "@/lib/venueEventMappers";
import { Link } from "react-router-dom";

const OwnerVenues = () => {
  const { user } = useAuth();
  const { data: venues = [], isLoading, isError, error } = useVenues();
  const myVenues = venues.filter((v) => venueOwnedByUser(v, user?.id));

  if (isLoading) {
    return <p className="text-muted-foreground">Loading venues…</p>;
  }
  if (isError) {
    return (
      <p className="text-destructive">
        {error instanceof Error ? error.message : "Failed to load venues"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">My Venues</h1>
        <Link to="/owner/venues/new" className="gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity">+ Add Venue</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myVenues.map((v) => (
          <div key={v.id} className="glass rounded-xl overflow-hidden">
            <img src={v.image} alt={v.name} className="w-full h-40 object-cover" />
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-foreground">{v.name}</h3>
                {v.isVerified && <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle className="w-3 h-3" /> Verified</span>}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> {v.location}</p>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-foreground">{v.rating}</span>
                <span className="text-muted-foreground">({v.reviewCount})</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Link to={`/owner/venues/${v.id}/edit`} className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">Edit</Link>
                <button className="text-xs px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">Manage Tables</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnerVenues;
