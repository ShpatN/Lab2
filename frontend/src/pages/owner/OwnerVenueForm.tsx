import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createVenue, fetchVenueById, updateVenue } from "@/lib/api";
import { fileToDataUrl, getVenueImageOverride, setVenueImageOverride } from "@/lib/imageOverrides";

const categories = ["Club", "Bar", "Lounge", "Rooftop", "Live Music"];

type Props = { mode?: "create" | "edit" };

const OwnerVenueForm = ({ mode = "create" }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const editing = mode === "edit";
  const venueId = id ? Number.parseInt(id, 10) : NaN;
  const { data: existing, isLoading: existingLoading } = useQuery({
    queryKey: ["owner-venue-edit", venueId],
    enabled: editing && Number.isFinite(venueId),
    queryFn: async () => fetchVenueById(venueId),
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Lounge");
  const [imageUrl, setImageUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setDescription(existing.description);
    setAddress(existing.address);
    setCity(existing.city);
    setCategory(existing.category || "Lounge");
    setImageUrl(getVenueImageOverride(existing.id) ?? "");
  }, [existing]);

  if (editing && existingLoading) return <p className="text-muted-foreground">Loading venue...</p>;
  if (editing && !existing) return <p className="text-destructive">Venue not found.</p>;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setIsSaving(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        address: address.trim(),
        city: city.trim(),
        category,
        ownerId: user.id,
        isActive: true,
      };
      const saved = editing && existing
        ? await updateVenue(existing.id, payload)
        : await createVenue(payload);
      if (imageUrl.trim()) {
        setVenueImageOverride(saved.id, imageUrl.trim());
      }
      toast.success(editing ? "Venue updated successfully." : "Venue created successfully.");
      navigate("/owner/venues");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save venue.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">{editing ? "Edit Venue" : "Add Venue"}</h1>
      <form onSubmit={onSubmit} className="glass rounded-xl p-6 space-y-4 max-w-2xl">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Venue name" className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground min-h-[120px]" required />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground" required />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground" required />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground">
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
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
          src={imageUrl || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=80"}
          alt="Venue preview"
          className="w-full h-40 object-cover rounded-xl border border-border"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={isSaving} className="gradient-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60">
            {isSaving ? "Saving..." : editing ? "Update Venue" : "Create Venue"}
          </button>
          <button type="button" onClick={() => navigate("/owner/venues")} className="px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default OwnerVenueForm;
