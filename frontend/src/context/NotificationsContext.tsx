import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useVenues } from "@/hooks/useVenues";
import { reservationQueryKeys } from "@/hooks/useReservations";
import { authAppRole } from "@/lib/authUser";
import { signalRService, userRoomId, venueRoomId, type ChatHubMessage } from "@/lib/signalrService";
import { venueOwnedByUser } from "@/lib/venueEventMappers";
import { fetchNotifications, markNotificationRead } from "@/lib/api";
import type { NotificationItem } from "@/types/notification";

export interface RealtimeNotification {
  id: string;
  title?: string;
  message: string;
  fromUserId: string;
  createdAt: string;
  isRead: boolean;
}

interface NotificationsContextType {
  notifications: RealtimeNotification[];
  unreadCount: number;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationsProvider");
  return ctx;
}

function mapHubMessage(msg: ChatHubMessage): RealtimeNotification {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message: msg.message,
    fromUserId: msg.userId,
    createdAt: msg.sentAt,
    isRead: false,
  };
}

type ReservationStatusMessage = {
  kind: "reservation-status";
  reservationId: number;
  status: "accepted" | "declined";
  venueId: number;
};

function tryParseStatusMessage(raw: string): ReservationStatusMessage | null {
  try {
    const data = JSON.parse(raw) as Partial<ReservationStatusMessage>;
    if (data.kind !== "reservation-status") return null;
    if (typeof data.reservationId !== "number") return null;
    if (data.status !== "accepted" && data.status !== "declined") return null;
    if (typeof data.venueId !== "number") return null;
    return data as ReservationStatusMessage;
  } catch {
    return null;
  }
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const joinedRoomsRef = useRef<Set<string>>(new Set());

  const role = user ? authAppRole(user) : "customer";
  const shouldLoadOwnerVenues = isAuthenticated && role === "owner";
  const { data: venues = [] } = useVenues({}, shouldLoadOwnerVenues);
  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        return await fetchNotifications();
      } catch {
        // Notifications are non-blocking; keep UI usable.
        return [];
      }
    },
    enabled: isAuthenticated && !!user,
    retry: false,
  });
  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
  });

  const ownedVenueIds = useMemo(() => {
    if (!user || role !== "owner") return [];
    return venues
      .filter((v) => venueOwnedByUser(v, user.id))
      .map((v) => Number.parseInt(v.id, 10))
      .filter((id) => !Number.isNaN(id));
  }, [venues, role, user]);

  const notifications = useMemo<RealtimeNotification[]>(
    () =>
      (notificationsQuery.data ?? []).map((n: NotificationItem) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        fromUserId: "system",
        createdAt: n.createdAt,
        isRead: n.isRead,
      })),
    [notificationsQuery.data],
  );
  const unreadCount = useMemo(
    () => notifications.reduce((sum, n) => sum + (n.isRead ? 0 : 1), 0),
    [notifications],
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    let unsub = () => {};
    let cancelled = false;

    const start = async () => {
      try {
        await signalRService.connect();
        if (cancelled) return;
        unsub = signalRService.subscribe((msg) => {
          const statusMessage = tryParseStatusMessage(msg.message);
          if (statusMessage) {
            void queryClient.invalidateQueries({ queryKey: reservationQueryKeys.all });
            void queryClient.invalidateQueries({ queryKey: ["notifications"] });
            const text =
              statusMessage.status === "accepted"
                ? "Your reservation was accepted."
                : "Your reservation was declined.";
            toast.info(text);
            return;
          }
          void queryClient.invalidateQueries({ queryKey: ["notifications"] });
          const next = mapHubMessage(msg);
          toast.info(next.message);
        });
      } catch {
        // non-fatal for UI; app still works without realtime
      }
    };

    void start();

    return () => {
      cancelled = true;
      unsub();
    };
  }, [isAuthenticated, queryClient]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const room = userRoomId(user.id);
    if (joinedRoomsRef.current.has(room)) return;
    void signalRService
      .joinRoom(room)
      .then(() => joinedRoomsRef.current.add(room))
      .catch(() => {
        // ignore transient hub failures
      });
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!isAuthenticated || role !== "owner") return;

    const joinMissingRooms = async () => {
      for (const venueId of ownedVenueIds) {
        const roomId = venueRoomId(venueId);
        if (joinedRoomsRef.current.has(roomId)) continue;
        try {
          await signalRService.joinRoom(roomId);
          joinedRoomsRef.current.add(roomId);
        } catch {
          // ignore transient hub failures
        }
      }
    };

    void joinMissingRooms();
  }, [isAuthenticated, ownedVenueIds, role]);

  useEffect(() => {
    if (isAuthenticated) return;
    joinedRoomsRef.current.clear();
    void signalRService.disconnect();
  }, [isAuthenticated]);

  const markAllRead = useCallback(() => {
    const unread = notifications.filter((n) => !n.isRead);
    if (unread.length === 0) return;
    void Promise.allSettled(unread.map((n) => markReadMutation.mutateAsync(n.id))).then(() => {
      void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });
  }, [markReadMutation, notifications, queryClient]);

  const value = useMemo<NotificationsContextType>(
    () => ({
      notifications,
      unreadCount,
      markAllRead,
    }),
    [notifications, unreadCount, markAllRead],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
