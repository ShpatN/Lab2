/** GET /api/reservations response item (camelCase from API). */
export interface ReservationListItem {
  id: number;
  userId: number;
  venueId: number;
  venueName: string;
  eventId?: number | null;
  eventName?: string | null;
  tableType: string;
  guests: number;
  date: string;
  time: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

export interface CreateReservationBody {
  venueId: number;
  tableId?: number | null;
  eventId?: number | null;
  reservationDate: string;
  numberOfPeople: number;
  specialRequests?: string | null;
}

export interface UpdateReservationStatusBody {
  status: "accepted" | "declined";
}

export interface ReservationStatusUpdateResult {
  reservationId: number;
  userId: number;
  venueId: number;
  status: "accepted" | "declined";
}
