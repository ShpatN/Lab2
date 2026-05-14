import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { getAccessToken } from "@/lib/authStorage";

export interface ChatHubMessage {
  userId: string;
  message: string;
  sentAt: string;
}

type MessageListener = (payload: ChatHubMessage) => void;

function resolveHubUrl(): string {
  const explicitBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
  const base = (explicitBase || "http://localhost:5051").replace(/\/$/, "");
  return `${base}/hubs/chat`;
}

class SignalRService {
  private connection: HubConnection | null = null;
  private listeners = new Set<MessageListener>();

  private getOrCreateConnection(): HubConnection {
    if (this.connection) return this.connection;

    const conn = new HubConnectionBuilder()
      .withUrl(resolveHubUrl(), {
        accessTokenFactory: () => getAccessToken() ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    conn.on("ReceiveMessage", (userId: string, message: string, sentAt: string | Date) => {
      const payload: ChatHubMessage = {
        userId,
        message,
        sentAt: typeof sentAt === "string" ? sentAt : sentAt.toISOString(),
      };
      this.listeners.forEach((listener) => listener(payload));
    });

    this.connection = conn;
    return conn;
  }

  async connect(): Promise<void> {
    const token = getAccessToken();
    if (!token) return;

    const conn = this.getOrCreateConnection();
    if (conn.state === HubConnectionState.Connected || conn.state === HubConnectionState.Connecting) {
      return;
    }
    await conn.start();
  }

  async disconnect(): Promise<void> {
    if (!this.connection) return;
    if (this.connection.state !== HubConnectionState.Disconnected) {
      await this.connection.stop();
    }
  }

  async joinRoom(roomId: string): Promise<void> {
    await this.connect();
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) return;
    await this.connection.invoke("JoinRoom", roomId);
  }

  async sendMessage(roomId: string, message: string): Promise<void> {
    await this.connect();
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) return;
    await this.connection.invoke("SendMessage", roomId, message);
  }

  subscribe(listener: MessageListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export function venueRoomId(venueId: number): string {
  return `venue-${venueId}`;
}

export function userRoomId(userId: number): string {
  return `user-${userId}`;
}

export const signalRService = new SignalRService();
