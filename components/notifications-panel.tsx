"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/lib/use-socket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  MessageCircle,
  AtSign,
  Bug,
  FileText,
  X,
  Check,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: string;
  type:
    | "COMMENT"
    | "MENTION"
    | "BUG_STATUS_CHANGE"
    | "SUBMISSION_STATUS_CHANGE"
    | "NEW_MESSAGE"
    | "BUG_ASSIGNED";
  title: string;
  message: string;
  data?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMessaging?: (conversationId?: string) => void;
}

export function NotificationsPanel({
  isOpen,
  onClose,
  onOpenMessaging,
}: NotificationsPanelProps) {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // WebSocket for real-time notifications
  const { connected } = useSocket({
    onNotification: (data) => {
      // Add new notification to the top
      setNotifications((prev) => [data, ...prev]);
      // Update unread count
      if (data.userId === session?.user?.id) {
        // You can add a toast notification here
        console.log("New notification received:", data);
      }
    },
  });

  useEffect(() => {
    if (isOpen && session) {
      fetchNotifications();
    }
  }, [isOpen, session]);

  const fetchNotifications = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/notifications?page=${pageNum}&limit=20`
      );
      if (response.ok) {
        const data = await response.json();
        if (pageNum === 1) {
          setNotifications(data.notifications);
        } else {
          setNotifications((prev) => [...prev, ...data.notifications]);
        }
        setHasMore(data.pagination.page < data.pagination.pages);
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notificationId, read: true }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((notif) => markAsRead(notif.id))
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
        toast.success("Notification deleted");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark notification as read first
    await markAsRead(notification.id);

    // Handle different notification types
    if (notification.type === "NEW_MESSAGE" && notification.data) {
      try {
        // Parse the data to extract conversation ID
        const notificationData = JSON.parse(notification.data);
        if (notificationData.conversationId && onOpenMessaging) {
          // Close notifications panel and open messaging with specific conversation
          onClose();
          onOpenMessaging(notificationData.conversationId);
          return;
        }
      } catch (error) {
        console.error("Error parsing notification data:", error);
      }
    }

    // For other notification types, just mark as read
    // You can add more specific handling here for other types
    if (notification.type === "BUG_STATUS_CHANGE" && notification.data) {
      try {
        const notificationData = JSON.parse(notification.data);
        if (notificationData.bugId) {
          // Could navigate to bug details page
          console.log("Navigate to bug:", notificationData.bugId);
        }
      } catch (error) {
        console.error("Error parsing bug notification data:", error);
      }
    }
  };

  const clearAllNotifications = async () => {
    try {
      const response = await fetch("/api/notifications", {
        method: "DELETE",
      });

      if (response.ok) {
        setNotifications([]);
        toast.success("All notifications cleared");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
      toast.error("Failed to clear notifications");
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "COMMENT":
        return <MessageCircle className="h-4 w-4" />;
      case "MENTION":
        return <AtSign className="h-4 w-4" />;
      case "BUG_STATUS_CHANGE":
        return <Bug className="h-4 w-4" />;
      case "SUBMISSION_STATUS_CHANGE":
        return <FileText className="h-4 w-4" />;
      case "NEW_MESSAGE":
        return <MessageCircle className="h-4 w-4" />;
      case "BUG_ASSIGNED":
        return <Bug className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "MENTION":
        return "text-blue-600 bg-blue-50";
      case "BUG_STATUS_CHANGE":
        return "text-green-600 bg-green-50";
      case "SUBMISSION_STATUS_CHANGE":
        return "text-purple-600 bg-purple-50";
      case "NEW_MESSAGE":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <CardHeader className="pb-3 bg-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-2 bg-red-500 hover:bg-red-600"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-200 rounded-md p-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {notifications.length > 0 && (
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-800 rounded-md"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
                className="bg-white hover:bg-gray-50 border-gray-300 text-gray-700 hover:text-gray-800 rounded-md"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0 max-h-96 overflow-y-auto">
          {loading && page === 1 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-3"></div>
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium text-gray-600">No notifications yet</p>
              <p className="text-sm text-gray-500">
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                    notification.read
                      ? "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      : "bg-white border-blue-200"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p
                            className={`text-sm font-medium ${
                              notification.read
                                ? "text-gray-700"
                                : "text-gray-900"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-6 w-6 p-0 hover:bg-blue-100 rounded-md"
                            >
                              <Check className="h-3 w-3 text-blue-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-6 w-6 p-0 hover:bg-red-100 rounded-md"
                          >
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.length > 0 && hasMore && (
            <div className="text-center pt-4">
              <Button
                onClick={() => fetchNotifications(page + 1)}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
              >
                {loading ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
