import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createEvent, fetchEventById, updateEvent } from "@/lib/api";
import { useEventCategories } from "@/hooks/useEvents";
import { useVenues } from "@/hooks/useVenues";
import { venueOwnedByUser } from "@/lib/venueEventMappers";
import { fileToDataUrl, getEventImageOverride, setEventImageOverride } from "@/lib/imageOverrides";

type Props = { mode: "create" | "edit" };

const OwnerEventForm = ({ mode }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { data: venues = [] } = useVenues();
  const { data: categories = [] } = useEventCategories();
  const myVenues = useMemo(() => venues.filter((v) => venueOwnedByUser(v, user?.id)), [venues, user?.id]);
  const editing = mode === "edit";
  const eventId = id ? Number.parseInt(id, 10) : NaN;
  const {
    data: existing,
    isLoading: existingLoading,
  } = useQuery({
    queryKey: ["owner-event-edit", eventId],
    enabled: editing && Number.isFinite(eventId),
    queryFn: async () => fetchEventById(eventId),
  });

  const [venueId, setVenueId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) {
      setVenueId((prev) => prev || String(myVenues[0]?.id ?? ""));
      return;
    }
    if (!existing) return;
    setVenueId(String(existing.venueId));
    setName(existing.name);
    setDescription(existing.description);
    setStartDate(existing.startDate.slice(0, 16));
    setCategoryId(existing.categoryId ? String(existing.categoryId) : "");
    setImageUrl(getEventImageOverride(existing.id) ?? "");
    setIsActive(existing.isActive);
  }, [editing, existing, categories, myVenues]);

  if (editing && existingLoading) return <p className="text-muted-foreground">Loading event…</p>;
  if (editing && !existing) return <p className="text-destructive">Event not found.</p>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const parsedVenueId = Number.parseInt(venueId, 10);
    if (Number.isNaN(parsedVenueId)) {
      setError("Please select a venue.");
      return;
    }
    if (!startDate) {
      setError("Start date is required.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        venueId: parsedVenueId,
        categoryId: categoryId ? Number.parseInt(categoryId, 10) : null,
        name: name.trim(),
        description: description.trim(),
        startDate: new Date(startDate).toISOString(),
        endDate: editing && existing?.endDate ? existing.endDate : null,
        isActive,
      };
      if (editing && existing) {
        const updated = await updateEvent(existing.id, payload);
        if (imageUrl.trim()) setEventImageOverride(updated.id, imageUrl.trim());
        toast.success("Event updated successfully.");
      } else {
        const created = await createEvent(payload);
        if (imageUrl.trim()) setEventImageOverride(created.id, imageUrl.trim());
        toast.success("Event created successfully.");
      }
      navigate("/owner/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">{editing ? "Edit Event" : "Create Event"}</h1>
      <form onSubmit={onSubmit} className="glass rounded-xl p-6 space-y-4 max-w-2xl">
        <select value={venueId} onChange={(e) => setVenueId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground" required>
          <option value="">Select venue</option>
          {myVenues.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground">
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Event name" className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground min-h-[120px]" />
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="Image URL (optional)"
          className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const dataUrl = await fileToDataUrl(file);
            setImageUrl(dataUrl);
          }}
          className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-secondary file:text-secondary-foreground"
        />
        <img
          src={imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=80"}
          alt="Event preview"
          className="w-full h-40 object-cover rounded-xl border border-border"
        />
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Event start</label>
          <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground" required />
        </div>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active
        </label>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={isSaving} className="gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60">
            {isSaving ? "Saving..." : editing ? "Update Event" : "Create Event"}
          </button>
          <button type="button" onClick={() => navigate("/owner/events")} className="px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default OwnerEventForm;
