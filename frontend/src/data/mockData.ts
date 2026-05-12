// ==================== USERS ====================
export interface User {
  id: string;
  name: string;
  email: string;
  role: "customer" | "owner" | "admin";
  avatar: string;
  phone?: string;
  joinedDate: string;
}

export const mockUsers: User[] = [
  { id: "u1", name: "Arben Krasniqi", email: "arben@email.com", role: "customer", avatar: "https://i.pravatar.cc/150?img=1", phone: "+383 44 123 456", joinedDate: "2024-11-15" },
  { id: "u2", name: "Liria Hoxha", email: "liria@email.com", role: "customer", avatar: "https://i.pravatar.cc/150?img=5", phone: "+383 44 789 012", joinedDate: "2024-12-01" },
  { id: "u3", name: "Besnik Gashi", email: "besnik@venue.com", role: "owner", avatar: "https://i.pravatar.cc/150?img=3", phone: "+383 49 111 222", joinedDate: "2024-06-10" },
  { id: "u4", name: "Drita Berisha", email: "drita@venue.com", role: "owner", avatar: "https://i.pravatar.cc/150?img=9", phone: "+383 49 333 444", joinedDate: "2024-08-20" },
  { id: "u5", name: "Admin", email: "admin@prishtinanights.com", role: "admin", avatar: "https://i.pravatar.cc/150?img=7", joinedDate: "2024-01-01" },
];

// ==================== TICKETS ====================
export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  eventName: string;
  venueName: string;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  date: string;
  status: "active" | "used" | "expired" | "refunded";
  purchasedAt: string;
}

export const mockTickets: Ticket[] = [
  { id: "t1", userId: "u1", eventId: "e1", eventName: "Neon Dreams — DJ Arton Live", venueName: "Club Prishtina", ticketType: "VIP", quantity: 2, totalPrice: 100, date: "2026-04-05", status: "active", purchasedAt: "2026-03-25" },
  { id: "t2", userId: "u1", eventId: "e4", eventName: "Techno Underground", venueName: "Zone Club", ticketType: "General", quantity: 1, totalPrice: 12, date: "2026-04-05", status: "active", purchasedAt: "2026-03-26" },
  { id: "t3", userId: "u2", eventId: "e2", eventName: "Jazz & Blues Night", venueName: "Dit' e Nat'", ticketType: "Front Row", quantity: 2, totalPrice: 40, date: "2026-04-04", status: "active", purchasedAt: "2026-03-24" },
  { id: "t4", userId: "u1", eventId: "e5", eventName: "Craft Beer & Chill", venueName: "Soma Book Station", ticketType: "Free Entry", quantity: 1, totalPrice: 0, date: "2026-03-20", status: "used", purchasedAt: "2026-03-18" },
];

// ==================== REVIEWS ====================
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  venueId: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockReviews: Review[] = [
  { id: "rv1", userId: "u1", userName: "Arben K.", userAvatar: "https://i.pravatar.cc/150?img=1", venueId: "v1", rating: 5, comment: "Incredible atmosphere! Best club in Prishtina.", date: "2026-03-20" },
  { id: "rv2", userId: "u2", userName: "Liria H.", userAvatar: "https://i.pravatar.cc/150?img=5", venueId: "v1", rating: 4, comment: "Great music but a bit crowded on Saturdays.", date: "2026-03-15" },
  { id: "rv3", userId: "u1", userName: "Arben K.", userAvatar: "https://i.pravatar.cc/150?img=1", venueId: "v3", rating: 5, comment: "The jazz nights here are something special.", date: "2026-03-10" },
  { id: "rv4", userId: "u2", userName: "Liria H.", userAvatar: "https://i.pravatar.cc/150?img=5", venueId: "v2", rating: 4, comment: "Beautiful views and great cocktails!", date: "2026-03-08" },
];

// ==================== PAYMENTS ====================
export interface Payment {
  id: string;
  userId: string;
  type: "ticket" | "reservation" | "subscription";
  description: string;
  amount: number;
  status: "completed" | "pending" | "refunded" | "failed";
  method: string;
  date: string;
}

export const mockPayments: Payment[] = [
  { id: "p1", userId: "u1", type: "ticket", description: "Neon Dreams — VIP x2", amount: 100, status: "completed", method: "Visa ****4242", date: "2026-03-25" },
  { id: "p2", userId: "u1", type: "reservation", description: "Sky Bar — Lounge Sofa", amount: 100, status: "pending", method: "Visa ****4242", date: "2026-03-26" },
  { id: "p3", userId: "u2", type: "ticket", description: "Jazz & Blues — Front Row x2", amount: 40, status: "completed", method: "Mastercard ****8888", date: "2026-03-24" },
  { id: "p4", userId: "u1", type: "ticket", description: "Techno Underground — General", amount: 12, status: "completed", method: "Visa ****4242", date: "2026-03-26" },
  { id: "p5", userId: "u2", type: "reservation", description: "Club Prishtina — Standard Table", amount: 50, status: "refunded", method: "Mastercard ****8888", date: "2026-03-18" },
];

// ==================== ADMIN LOGS ====================
export interface AdminLog {
  id: string;
  action: string;
  user: string;
  target: string;
  timestamp: string;
  type: "info" | "warning" | "error" | "success";
}

export const mockLogs: AdminLog[] = [
  { id: "l1", action: "User registered", user: "System", target: "Liria Hoxha", timestamp: "2026-03-28 14:23", type: "info" },
  { id: "l2", action: "Venue approved", user: "Admin", target: "Club Prishtina", timestamp: "2026-03-28 12:10", type: "success" },
  { id: "l3", action: "Event created", user: "Besnik Gashi", target: "Neon Dreams", timestamp: "2026-03-27 18:45", type: "info" },
  { id: "l4", action: "Payment failed", user: "System", target: "Order #4521", timestamp: "2026-03-27 15:30", type: "error" },
  { id: "l5", action: "Suspicious login attempt", user: "System", target: "unknown@email.com", timestamp: "2026-03-27 03:12", type: "warning" },
  { id: "l6", action: "Venue suspended", user: "Admin", target: "Zone Club", timestamp: "2026-03-26 11:00", type: "warning" },
  { id: "l7", action: "Refund processed", user: "System", target: "Reservation #r5", timestamp: "2026-03-26 09:15", type: "success" },
  { id: "l8", action: "User role updated", user: "Admin", target: "Besnik Gashi → Owner", timestamp: "2026-03-25 16:00", type: "info" },
];

// ==================== PROMOTIONS ====================
export interface Promotion {
  id: string;
  venueId: string;
  venueName: string;
  title: string;
  description: string;
  discount: string;
  validUntil: string;
  status: "active" | "expired" | "draft";
  usageCount: number;
}

export const mockPromotions: Promotion[] = [
  { id: "pr1", venueId: "v1", venueName: "Club Prishtina", title: "Early Bird Special", description: "Get 30% off on tickets purchased before midnight", discount: "30%", validUntil: "2026-04-10", status: "active", usageCount: 45 },
  { id: "pr2", venueId: "v2", venueName: "Sky Bar", title: "Happy Hour", description: "2-for-1 cocktails between 5-7 PM", discount: "50%", validUntil: "2026-04-30", status: "active", usageCount: 120 },
  { id: "pr3", venueId: "v1", venueName: "Club Prishtina", title: "VIP Package Deal", description: "Book VIP for 4+ people and get a free bottle", discount: "Free Bottle", validUntil: "2026-03-20", status: "expired", usageCount: 15 },
];
