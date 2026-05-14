/** JSON shape from GET /api/venues (ASP.NET camelCase serialization). */
export interface VenueApi {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  category: string;
  ownerId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
  createdBy?: number | null;
  updatedBy?: number | null;
}

/** JSON shape from GET /api/events */
export interface EventApi {
  id: number;
  venueId: number;
  categoryId?: number | null;
  categoryName?: string | null;
  name: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
}

export interface VenueSearchParams {
  keyword?: string;
  category?: string;
  sortBy?: "name";
  sortDirection?: "asc" | "desc";
}

export interface EventSearchParams {
  keyword?: string;
  category?: string;
  sortBy?: "date";
  sortDirection?: "asc" | "desc";
  dateFrom?: string;
  dateTo?: string;
  timeFrom?: string;
}

/** UI shape consumed by venue cards and detail pages (previously mock `Venue`). */
export interface VenueDisplay {
  id: string;
  name: string;
  category: "Club" | "Bar" | "Lounge" | "Rooftop" | "Live Music";
  description: string;
  location: string;
  address: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  ownerId: string;
  openingHours: { day: string; hours: string }[];
  tables: { type: string; capacity: number; price: number; available: number }[];
  features: string[];
  isVerified: boolean;
}

/** UI shape consumed by event cards and detail pages (previously mock `Event`). */
export interface EventDisplay {
  id: string;
  title: string;
  type: "Techno" | "Live Music" | "DJ Set" | "Festival" | "Karaoke" | "Jazz Night" | "Themed Party";
  description: string;
  venueId: string;
  venueName: string;
  date: string;
  time: string;
  ticketPrice: number;
  ticketTypes: { name: string; price: number; available: number }[];
  image: string;
  attendees: number;
  maxCapacity: number;
  isFeatured: boolean;
}
