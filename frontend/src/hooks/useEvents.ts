import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEventCategories, fetchEvents, fetchVenues } from "@/lib/api";
import {
  buildVenueNameLookup,
  mapEventApiToDisplay,
  mapVenueApiToDisplay,
} from "@/lib/venueEventMappers";
import type { EventDisplay, VenueDisplay } from "@/types/venueEvent";
import { venuesQueryKey } from "@/hooks/useVenues";
import type { EventSearchParams } from "@/types/venueEvent";

export const eventsQueryKey = ["events"] as const;

export function useEvents(params: EventSearchParams = {}) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...eventsQueryKey, params],
    queryFn: async (): Promise<EventDisplay[]> => {
      const venueDisplays = await queryClient.fetchQuery({
        queryKey: venuesQueryKey(),
        queryFn: async (): Promise<VenueDisplay[]> => {
          const rows = await fetchVenues();
          return rows.map(mapVenueApiToDisplay);
        },
      });
      const eventRows = await fetchEvents(params);
      const lookup = buildVenueNameLookup(venueDisplays);
      return eventRows.map((e) => mapEventApiToDisplay(e, lookup));
    },
  });
}

export function useEventCategories() {
  return useQuery({
    queryKey: ["event-categories"],
    queryFn: fetchEventCategories,
  });
}
