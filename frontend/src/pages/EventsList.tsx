import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import EventCard from "@/components/EventCard";
import { useEvents } from "@/hooks/useEvents";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";

const EventsList = () => {
  const [params, setParams] = useSearchParams();
  const search = params.get("q") ?? "";
  const sortDirection = (params.get("sort") as "asc" | "desc" | null) ?? "asc";
  const dateFrom = params.get("date") ?? params.get("dateFrom") ?? "";
  const timeFrom = params.get("time") ?? "";
  const [searchInput, setSearchInput] = useState(search);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const { data: events = [], isLoading, isError, error } = useEvents({
    keyword: search || undefined,
    sortBy: "date",
    sortDirection,
    dateFrom: dateFrom || undefined,
    timeFrom: timeFrom || undefined,
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
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">Events</h1>
        <p className="text-muted-foreground mb-8">Find your next unforgettable night out</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search events..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Date</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setParam("date", e.target.value)}
              className="px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Filter by date"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Time (from)</span>
            <input
              type="time"
              value={timeFrom}
              onChange={(e) => setParam("time", e.target.value)}
              className="px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Filter by time"
            />
          </div>
          <select
            value={sortDirection}
            onChange={(e) => setParam("sort", e.target.value)}
            className="px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="asc">Date soonest</option>
            <option value="desc">Date latest</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">Loading events…</p>
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-destructive font-medium">Could not load events.</p>
            <p className="text-sm text-muted-foreground mt-2">{error instanceof Error ? error.message : "Unknown error"}</p>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e) => <EventCard key={e.id} event={e} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground"><p className="text-lg">No events found.</p></div>
        )}
      </div>
    </div>
  );
};

export default EventsList;
