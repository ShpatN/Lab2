import type { EventApi, EventDisplay, VenueApi, VenueDisplay } from "@/types/venueEvent";
import { getEventImageOverride, getVenueImageOverride } from "@/lib/imageOverrides";

const venueCategories: VenueDisplay["category"][] = [
  "Club",
  "Bar",
  "Lounge",
  "Rooftop",
  "Live Music",
];

const venueImages = [
  "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=80",
  "https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=600&q=80",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
];

const eventTypes: EventDisplay["type"][] = [
  "Techno",
  "Live Music",
  "DJ Set",
  "Festival",
  "Karaoke",
  "Jazz Night",
  "Themed Party",
];

function normalizeEventType(raw?: string | null): EventDisplay["type"] | null {
  if (!raw) return null;
  const lc = raw.trim().toLowerCase();
  if (lc.includes("techno")) return "Techno";
  if (lc.includes("live")) return "Live Music";
  if (lc.includes("dj")) return "DJ Set";
  if (lc.includes("festival")) return "Festival";
  if (lc.includes("karaoke")) return "Karaoke";
  if (lc.includes("jazz")) return "Jazz Night";
  if (lc.includes("theme")) return "Themed Party";
  return null;
}

function pickVenueImage(id: number): string {
  return venueImages[Math.abs(id) % venueImages.length];
}

export function mapVenueApiToDisplay(v: VenueApi): VenueDisplay {
  const img = getVenueImageOverride(v.id) ?? pickVenueImage(v.id);
  const normalizedCategory = (v.category?.trim() || "Lounge") as VenueDisplay["category"];
  return {
    id: String(v.id),
    name: v.name,
    category: venueCategories.includes(normalizedCategory) ? normalizedCategory : "Lounge",
    description: v.description || "",
    location: v.city || "",
    address: [v.address, v.city].filter(Boolean).join(", ") || v.address,
    rating: 4.5,
    reviewCount: 0,
    image: img,
    images: [img],
    ownerId: String(v.ownerId),
    openingHours: [{ day: "Hours", hours: "Contact venue for details" }],
    tables: [],
    features: [],
    isVerified: v.isActive,
  };
}

export function mapEventApiToDisplay(e: EventApi, venueNameById: Map<string, string>): EventDisplay {
  const start = new Date(e.startDate);
  const date = Number.isNaN(start.getTime())
    ? e.startDate.slice(0, 10)
    : start.toISOString().slice(0, 10);
  const time = Number.isNaN(start.getTime())
    ? ""
    : start.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const vid = String(e.venueId);
  const venueName = venueNameById.get(vid) ?? "Venue";
  const type =
    normalizeEventType(e.categoryName) ??
    eventTypes[Math.abs(e.id + (e.categoryId ?? 0)) % eventTypes.length];
  const img = getEventImageOverride(e.id) ?? pickVenueImage(e.id);

  return {
    id: String(e.id),
    title: e.name,
    type,
    description: e.description || "",
    venueId: vid,
    venueName,
    date,
    time,
    ticketPrice: 0,
    ticketTypes: [],
    image: img,
    attendees: 0,
    maxCapacity: 100,
    isFeatured: e.isActive && Math.abs(e.id) % 2 === 0,
  };
}

export function buildVenueNameLookup(venues: VenueDisplay[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const v of venues) m.set(v.id, v.name);
  return m;
}

/** Match mock owner ids like "u3" to numeric ownerId "3" from API. */
export function venueOwnedByUser(venue: VenueDisplay, userId: string | number | undefined): boolean {
  if (userId === undefined || userId === "") return false;
  const sid = String(userId);
  if (venue.ownerId === sid) return true;
  if (sid.startsWith("u")) return venue.ownerId === sid.slice(1);
  return venue.ownerId === sid;
}
