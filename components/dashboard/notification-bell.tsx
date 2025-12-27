"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  getNotifications,
  markNotificationsAsRead,
} from "@/app/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Notification = {
  id: number;
  title: string;
  description: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: Date;
};

function NotificationItem({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  return (
    <Link
      href={notification.link || "#"}
      className={cn(
        "block p-3 hover:bg-muted/50 transition-colors",
        notification.isRead ? "bg-background" : "bg-blue-50/50" // Distinct background for unread
      )}
      onClick={onClose} // Close dropdown on click
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-1.5 h-2 w-2 rounded-full flex-shrink-0",
            notification.isRead ? "bg-muted-foreground" : "bg-primary" // Dot color
          )}
        />
        <div className="flex-1 space-y-1">
          <p className={cn("font-medium", !notification.isRead && "text-primary-foreground")}>
            {notification.title}
          </p>
          <p className={cn("text-sm text-muted-foreground", !notification.isRead && "font-semibold")}>
            {notification.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    const { allNotifications, unreadCount } = await getNotifications();
    setNotifications(allNotifications);
    setUnreadCount(unreadCount);
  };

  useEffect(() => {
    fetchNotifications(); // Initial fetch
    const interval = setInterval(fetchNotifications, 60 * 1000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (open && unreadCount > 0) {
      await markNotificationsAsRead();
      fetchNotifications(); // Refetch to update the UI
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-3 font-medium border-b">Notifications</div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-center text-muted-foreground">
              No new notifications
            </p>
          ) : (
            notifications.map((n) => (
              <NotificationItem key={n.id} notification={n} onClose={() => setIsOpen(false)} /> // Pass onClose
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
