"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface HistoryMessage {
  id: string;
  type: "user" | "copilot";
  content: string;
  timestamp: number;
}

export function useChatHistory(messageLimit: number = 10) {
  const [history, setHistory] = useState<HistoryMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      const messagesCollection = collection(db, "chat-messages-prod");
      const q = query(
        messagesCollection,
        orderBy("Timestamp", "desc"),
        limit(messageLimit)
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const messages = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: data.Type, // Keep as-is since backend sends "copilot"
              content: data.Content,
              timestamp: data.Timestamp,
            } as HistoryMessage;
          });
          setHistory(messages);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching chat history:", err);
          setError(err);
          setLoading(false);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (err) {
      console.error("Failed to initialize Firestore listener:", err);
      setError(err as Error);
      setLoading(false);
    }
  }, [messageLimit]);

  return { history, loading, error };
}
