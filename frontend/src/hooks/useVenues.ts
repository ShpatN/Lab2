import { useQuery } from "@tanstack/react-query";
import { fetchVenues } from "@/lib/api";
import { mapVenueApiToDisplay } from "@/lib/venueEventMappers";
import type { VenueDisplay, VenueSearchParams } from "@/types/venueEvent";

export const venuesQueryKey = (params?: VenueSearchParams) => ["venues", params ?? {}] as const;

export function useVenues(params: VenueSearchParams = {}, enabled = true) {
  return useQuery({
    queryKey: venuesQueryKey(params),
    enabled,
    queryFn: async (): Promise<VenueDisplay[]> => {
      const rows = await fetchVenues(params);
      return rows.map(mapVenueApiToDisplay);
    },
  });
}
