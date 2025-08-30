"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

interface UseSocketOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onNotification?: (data: any) => void;
  onMessage?: (data: any) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const connect = useCallback(() => {
    if (!session?.user?.id || socketRef.current?.connected) return;

    // Initialize socket connection
    socketRef.current = io({
      path: "/api/socket",
      addTrailingSlash: false,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Socket connected");
      optionsRef.current.onConnect?.();

      // Join user's room for notifications
      socket.emit("join-user", session.user.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      optionsRef.current.onDisconnect?.();
    });

    socket.on("notification", (data) => {
      console.log("Received notification:", data);
      optionsRef.current.onNotification?.(data);
    });

    socket.on("message", (data) => {
      console.log("Received message:", data);
      optionsRef.current.onMessage?.(data);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
  }, [session?.user?.id]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const emit = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Connect when session is available
  useEffect(() => {
    if (session?.user?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [session?.user?.id, connect, disconnect]);

  return {
    socket: socketRef.current,
    connected: socketRef.current?.connected || false,
    emit,
    connect,
    disconnect,
  };
}
