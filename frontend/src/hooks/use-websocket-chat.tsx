"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Message interface matching the backend
export interface Message {
  type: "user" | "assistant";
  content: string;
  timestamp: number;
}

// WebSocket connection states
export type ConnectionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface UseWebSocketChatOptions {
  url?: string;
  autoConnect?: boolean;
}

export function useWebSocketChat(options: UseWebSocketChatOptions = {}) {
  const { autoConnect = false } = options;

  const url = options.url || process.env.NEXT_PUBLIC_WS_URL;
  if (!url) {
    throw new Error(
      "WebSocket URL is required. Please set NEXT_PUBLIC_WS_URL in your environment variables."
    );
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [isLoading, setIsLoading] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionState("connecting");
    const ws = new WebSocket(url);

    ws.onopen = () => setConnectionState("connected");

    ws.onclose = () => setConnectionState("disconnected");

    ws.onerror = () => setConnectionState("error");

    ws.onmessage = (event) => {
      try {
        const receivedMessage: Message = JSON.parse(event.data);

        // When we get a response from the assistant, we're no longer loading.
        if (receivedMessage.type === "assistant") {
          setIsLoading(false);
        }

        // Add the message from the server to our chat history.
        setMessages((prev) => [...prev, receivedMessage]);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    wsRef.current = ws;
  }, [url]);

  const disconnect = useCallback(() => {
    wsRef.current?.close(1000, "Client disconnecting");
    wsRef.current = null;
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || wsRef.current?.readyState !== WebSocket.OPEN) {
      return false;
    }

    const userMessage: Message = {
      type: "user",
      content: content.trim(),
      timestamp: Date.now(),
    };

    // Optimistically add the user's message to the UI for a responsive feel,
    // as the backend will not echo this message back
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Send to WebSocket server
    wsRef.current.send(JSON.stringify(userMessage));
    return true;
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }
    return () => disconnect();
  }, [autoConnect, connect, disconnect]);

  return {
    messages,
    connectionState,
    isLoading,
    connect,
    disconnect,
    sendMessage,
    clearMessages,
    canSendMessage: connectionState === "connected" && !isLoading,
  };
}
