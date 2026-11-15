import type { ISODate } from "./common";

// ----------------------------------------------------------- Notifications
export type NotificationType = "story" | "funding" | "money" | "moderation";

export interface SeenNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: ISODate;
  read: boolean;
  /** Where tapping the notification should take the user. */
  target?: { screen: "story" | "opportunity" | "creator" | "collection" | "moderation"; id?: string };
}

export interface NotificationsApi {
  list(): Promise<SeenNotification[]>;
  markRead(id: string): Promise<void>;
  markAllRead(): Promise<void>;
  unreadCount(): Promise<number>;
}
