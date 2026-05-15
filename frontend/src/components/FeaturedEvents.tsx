import EventCard from "./EventCard";
import { useEvents } from "@/hooks/useEvents";

const FeaturedEvents = () => {
  const { data: events = [], isLoading, isError, error } = useEvents();
  const featured = events.filter((e) => e.isFeatured).slice(0, 6);

  return (
    <section id="events" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">Featured Events</h2>
          <p className="text-muted-foreground">The hottest happenings this week in Prishtina</p>
        </div>
        {isLoading ? (
          <p className="text-center text-muted-foreground py-12">Loading events…</p>
        ) : isError ? (
          <p className="text-center text-destructive py-12">
            {error instanceof Error ? error.message : "Failed to load events"}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;
