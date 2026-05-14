import { Heart } from "lucide-react";
import VenueCard from "@/components/VenueCard";
import { useVenues } from "@/hooks/useVenues";

const Favorites = () => {
  const { data: venues = [], isLoading, isError, error } = useVenues();
  const favorites = venues.slice(0, 3);

  if (isLoading) {
    return <p className="text-muted-foreground">Loading favorites…</p>;
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
      <h1 className="text-2xl font-display font-bold flex items-center gap-2"><Heart className="w-6 h-6 text-neon-pink" /> My Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((v) => <VenueCard key={v.id} venue={v} />)}
      </div>
    </div>
  );
};

export default Favorites;
