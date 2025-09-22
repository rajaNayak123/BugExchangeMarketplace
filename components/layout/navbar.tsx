"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  User,
  LogOut,
  Plus,
  Search,
  Bell,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NotificationsPanel } from "../features/notifications-panel";
import { MessagingPanel } from "../features/messaging-panel";
import { ThemeToggle } from "../theme/theme-toggle";
import { ThemeSelector } from "../theme/theme-selector";
import { ClientThemeWrapper } from "../theme/client-theme-wrapper";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [initialConversationId, setInitialConversationId] = useState<
    string | undefined
  >();

  const handleLogout = async () => {
    try {
      // First, sign out without redirect
      await signOut({ redirect: false });

      // Then manually redirect to home page
      router.push("/");

      // Force a page refresh to clear any cached state
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: redirect anyway
      router.push("/");
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    }
  };

  const handleOpenMessaging = (conversationId?: string) => {
    setInitialConversationId(conversationId);
    setShowMessaging(true);
  };
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (session) {
      fetchUnreadNotifications();
    }
  }, [session]);

  const fetchUnreadNotifications = async () => {
    try {
      const response = await fetch(
        "/api/notifications?unreadOnly=true&limit=1"
      );
      if (response.ok) {
        const data = await response.json();
        setUnreadNotifications(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
    }
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Bug className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold">Bug Exchange</span>
        </Link>

        <div className="flex items-center space-x-6">
          {/* Primary Navigation - Always visible */}
          <Button variant="ghost" asChild>
            <Link href="/bugs">
              <Search className="w-4 h-4 mr-2" />
              Browse Bugs
            </Link>
          </Button>

          {session ? (
            <>
              {/* User Actions - Only when logged in */}
              <Button asChild>
                <Link href="/bugs/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Bug
                </Link>
              </Button>

              {/* Communication Icons - Grouped together */}
              <div className="flex items-center space-x-1 border-l border-gray-200 pl-4">
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(true)}
                  className="relative hover:bg-gray-100 rounded-md p-2"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                    >
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </Badge>
                  )}
                </Button>

                {/* Messaging */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMessaging(true)}
                  className="hover:bg-gray-100 rounded-md p-2"
                  title="Messages"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>

              {/* Theme Controls - Grouped together */}
              <ClientThemeWrapper>
                <div className="flex items-center space-x-1 border-l border-gray-200 pl-4">
                  <ThemeToggle />
                  <ThemeSelector />
                </div>
              </ClientThemeWrapper>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:bg-gray-100"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-72 bg-white border border-gray-200 shadow-lg rounded-lg"
                  align="end"
                  forceMount
                >
                  <div className="flex items-center justify-start gap-4 p-5 bg-gray-50">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {session.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-2 leading-none">
                      <p className="font-semibold text-gray-800 text-base">
                        {session.user?.name}
                      </p>
                      <p className="w-[280px] truncate text-sm text-gray-500">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="hover:bg-gray-100">
                    <Link
                      href="/profile"
                      className="flex items-center px-5 py-4"
                    >
                      <User className="w-5 h-5 mr-4 text-gray-600" />
                      <span className="text-base">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-100">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-5 py-4"
                    >
                      <Bug className="w-5 h-5 mr-4 text-gray-600" />
                      <span className="text-base">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 px-5 py-4"
                    onSelect={(event) => {
                      event.preventDefault();
                      handleLogout();
                    }}
                  >
                    <LogOut className="w-5 h-5 mr-4 text-gray-600" />
                    <span className="text-base">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Theme Controls - Available to all users */}
              <ClientThemeWrapper>
                <div className="flex items-center space-x-1 border-l border-gray-200 pl-4">
                  <ThemeToggle />
                  <ThemeSelector />
                </div>
              </ClientThemeWrapper>

              {/* Authentication Buttons */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onOpenMessaging={handleOpenMessaging}
      />

      {/* Messaging Panel */}
      <MessagingPanel
        isOpen={showMessaging}
        onClose={() => {
          setShowMessaging(false);
          setInitialConversationId(undefined);
        }}
        initialConversationId={initialConversationId}
      />
    </nav>
  );
}
