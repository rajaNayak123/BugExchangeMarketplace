"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";

interface UseSocketOptions {
  onNotification?: (data: any) => void;
  onMessage?: (data: any) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const { data: session } = useSession();

  // Completely disable Socket.IO to prevent any connection attempts
  const connect = useCallback(() => {
    console.log("Socket functionality disabled");
  }, []);

  const disconnect = useCallback(() => {
    console.log("Socket functionality disabled");
  }, []);

  const emit = useCallback((event: string, data: any) => {
    console.log(`Socket functionality disabled: ${event}`, data);
  }, []);

  return {
    socket: null,
    connected: false,
    emit,
    connect,
    disconnect,
  };
}
