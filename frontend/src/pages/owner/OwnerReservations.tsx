import { useReservations, useUpdateReservationStatus } from "@/hooks/useReservations";
import ExportActions from "@/components/exports/ExportActions";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  accepted: "bg-emerald-500/20 text-emerald-400",
  pending: "bg-amber-500/20 text-amber-400",
  declined: "bg-red-500/20 text-red-400",
  completed: "bg-primary/20 text-primary",
};

const OwnerReservations = () => {
  const { data: reservations = [], isLoading, isError, error } = useReservations(true);
  const updateStatusMutation = useUpdateReservationStatus();

  const handleStatusChange = (reservationId: number, status: "accepted" | "declined") => {
    updateStatusMutation.mutate(
      { reservationId, body: { status } },
      {
        onSuccess: () => {
          toast.success(status === "accepted" ? "Reservation accepted." : "Reservation declined.");
        },
        onError: (e) => {
          toast.error(e instanceof Error ? e.message : "Could not update reservation.");
        },
      },
    );
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading reservations…</p>;
  }
  if (isError) {
    return (
      <p className="text-destructive">
        {error instanceof Error ? error.message : "Failed to load reservations"}
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-display font-bold">Reservations</h1>
        <div className="flex flex-wrap items-center gap-2">
          <ExportActions dataset="reservations" defaultScope="venue" label="Reservations" />
          <ExportActions dataset="payments" defaultScope="venue" label="Payments" />
        </div>
      </div>
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-muted-foreground font-medium">Venue</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Table</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Date</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Guests</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Revenue</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                <th className="text-left p-4 text-muted-foreground font-medium">Actions</th>
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
                  <td className="p-4">
                    {(r.status ?? "").toLowerCase() === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusChange(r.id, "accepted")}
                          disabled={updateStatusMutation.isPending}
                          className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-60"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(r.id, "declined")}
                          disabled={updateStatusMutation.isPending}
                          className="text-xs px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-60"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reservations.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">No reservations for your venues yet.</p>
        )}
      </div>
    </div>
  );
};

export default OwnerReservations;
