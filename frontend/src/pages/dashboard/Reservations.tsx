import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useVenues } from "@/hooks/useVenues";
import { useCreateReservation, useReservations } from "@/hooks/useReservations";
import ReservationCheckout from "@/components/payments/ReservationCheckout";
import ExportActions from "@/components/exports/ExportActions";

const statusColors: Record<string, string> = {
  accepted: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  declined: "bg-red-500/20 text-red-400",
  completed: "bg-primary/20 text-primary",
};

const defaultDate = () => new Date().toISOString().slice(0, 10);

const Reservations = () => {
  const [searchParams] = useSearchParams();
  const { data: reservations = [], isLoading, isError, error, refetch } = useReservations(false);
  const { data: venues = [] } = useVenues();
  const createMutation = useCreateReservation();

  const [venueId, setVenueId] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("20:00");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");
  const [checkoutReservationId, setCheckoutReservationId] = useState<number | null>(null);
  const [checkoutAmountCents, setCheckoutAmountCents] = useState(0);
  const [showPaid, setShowPaid] = useState(false);
  const [reservationNotice, setReservationNotice] = useState("");

  const venueOptions = useMemo(
    () => venues.map((v) => ({ id: Number.parseInt(v.id, 10), name: v.name })).filter((v) => !Number.isNaN(v.id)),
    [venues],
  );

  useEffect(() => {
    const prefillVenueId = searchParams.get("venueId");
    if (prefillVenueId && venueOptions.some((v) => String(v.id) === prefillVenueId)) {
      setVenueId(prefillVenueId);
    }
  }, [searchParams, venueOptions]);

  const createReservationFlow = (withPayment: boolean) => {
    setFormError("");
    setReservationNotice("");
    const vid = Number.parseInt(venueId, 10);
    if (!venueId || Number.isNaN(vid)) {
      setFormError("Please select a venue.");
      return;
    }
    const when = new Date(`${date}T${time}`);
    if (Number.isNaN(when.getTime())) {
      setFormError("Invalid date or time.");
      return;
    }
    createMutation.mutate(
      {
        venueId: vid,
        tableId: null,
        eventId: null,
        reservationDate: when.toISOString(),
        numberOfPeople: guests,
        specialRequests: notes.trim() || null,
      },
      {
        onSuccess: (result) => {
          if (withPayment) {
            const estimatedAmountCents = Math.max(500, guests * 2000);
            setCheckoutReservationId(result.reservationId);
            setCheckoutAmountCents(estimatedAmountCents);
          } else {
            setCheckoutReservationId(null);
            setCheckoutAmountCents(0);
            setReservationNotice("Reservation created without payment. It is now pending owner confirmation.");
          }
          setShowPaid(false);
          setNotes("");
          void refetch();
        },
        onError: (err) => {
          setFormError(err instanceof Error ? err.message : "Could not create reservation");
        },
      },
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-display font-bold">My Reservations</h1>
        <div className="flex flex-wrap items-center gap-2">
          <ExportActions dataset="reservations" defaultScope="mine" label="Reservations" />
          <ExportActions dataset="payments" defaultScope="mine" label="Payments" />
        </div>
      </div>

      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-foreground">New reservation</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-foreground mb-1">Venue</label>
            <select
              value={venueId}
              onChange={(e) => setVenueId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select venue…</option>
              {venueOptions.map((v) => (
                <option key={v.id} value={String(v.id)}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Guests</label>
            <input
              type="number"
              min={1}
              max={500}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Special requests (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Birthday, seating preference…"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              type="button"
              onClick={() => createReservationFlow(true)}
              disabled={createMutation.isPending}
              className="gradient-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {createMutation.isPending ? "Booking…" : "Reserve & Pay"}
            </button>
            <button
              type="button"
              onClick={() => createReservationFlow(false)}
              disabled={createMutation.isPending}
              className="bg-secondary text-secondary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-secondary/80 transition-colors disabled:opacity-60"
            >
              {createMutation.isPending ? "Booking…" : "Reserve Without Payment"}
            </button>
            {formError && <p className="text-sm text-red-400">{formError}</p>}
            {!formError && reservationNotice && <p className="text-sm text-amber-300">{reservationNotice}</p>}
          </div>
        </form>
      </div>

      {checkoutReservationId && (
        <div className="space-y-3">
          <ReservationCheckout
            reservationId={checkoutReservationId}
            amountCents={checkoutAmountCents}
            onPaid={() => {
              setShowPaid(true);
              void refetch();
            }}
          />
          {showPaid && (
            <p className="text-sm text-emerald-400">
              Payment confirmed. Your reservation is now updated.
            </p>
          )}
        </div>
      )}

      <div className="glass rounded-xl overflow-hidden">
        {isLoading && <p className="p-6 text-sm text-muted-foreground">Loading reservations…</p>}
        {isError && (
          <p className="p-6 text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load reservations"}
          </p>
        )}
        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-muted-foreground font-medium">Venue</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Table</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Guests</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Price</th>
                    <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((r) => (
                    <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/20">
                      <td className="p-4 font-semibold text-foreground">{r.venueName}</td>
                      <td className="p-4 text-muted-foreground">{r.tableType}</td>
                      <td className="p-4 text-muted-foreground">
                        {r.date} · {r.time}
                      </td>
                      <td className="p-4 text-muted-foreground">{r.guests}</td>
                      <td className="p-4 text-foreground">€{r.totalPrice}</td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors[r.status] ?? "bg-secondary/40 text-muted-foreground"}`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {reservations.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">No reservations yet.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Reservations;
