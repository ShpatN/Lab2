import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import VenueCard from "@/components/VenueCard";
import { useVenues } from "@/hooks/useVenues";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

const allCategories = ["All", "Club", "Bar", "Lounge", "Rooftop", "Live Music"];

const VenuesList = () => {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const category = params.get("category") ?? "All";
  const sortDirection = (params.get("sort") as "asc" | "desc" | null) ?? "asc";
  const [searchInput, setSearchInput] = useState(search);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { data: venues = [], isLoading, isError, error } = useVenues({
    keyword: search || undefined,
    category: category === "All" ? undefined : category,
    sortBy: "name",
    sortDirection,
  });

  const setParam = (key: string, value?: string) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!value || value === "All") next.delete(key);
      else next.set(key, value);
      return next;
    }, { replace: true });
  };

  useEffect(() => {
    const isFocused = document.activeElement === searchInputRef.current;
    if (!isFocused) setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== search) setParam("q", searchInput);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchInput, search]);

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">Browse Venues</h1>
        <p className="text-muted-foreground mb-8">Discover the best nightlife spots in Prishtina</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search venues..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={sortDirection}
            onChange={(e) => setParam("sort", e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="asc">Name A-Z</option>
            <option value="desc">Name Z-A</option>
          </select>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {allCategories.map((c) => (
              <button key={c} onClick={() => setParam("category", c)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${category === c ? "gradient-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Loading venues…</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-destructive font-medium">Could not load venues.</p>
            <p className="text-sm text-muted-foreground mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
          </div>
        ) : venues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((v) => <VenueCard key={v.id} venue={v} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No venues found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenuesList;
