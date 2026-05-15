import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReservation, fetchMyReservations, updateReservationStatus } from "@/lib/api";
import type { CreateReservationBody, UpdateReservationStatusBody } from "@/types/reservation";

export const reservationQueryKeys = {
  all: ["reservations"] as const,
  list: (asVenueOwner: boolean) => [...reservationQueryKeys.all, asVenueOwner] as const,
};

export function useReservations(asVenueOwner = false) {
  return useQuery({
    queryKey: reservationQueryKeys.list(asVenueOwner),
    queryFn: () => fetchMyReservations(asVenueOwner),
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateReservationBody) => createReservation(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationQueryKeys.all });
    },
  });
}

export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reservationId, body }: { reservationId: number; body: UpdateReservationStatusBody }) =>
      updateReservationStatus(reservationId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationQueryKeys.all });
    },
  });
}
