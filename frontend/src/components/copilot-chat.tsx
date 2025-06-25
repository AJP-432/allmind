"use client";

import * as React from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/components/chat-message";
import { useWebSocketChat } from "@/hooks/use-websocket-chat";

export function CopilotChat() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Use the custom WebSocket hook
  const {
    messages,
    connectionState,
    isLoading,
    connect,
    disconnect,
    sendMessage,
    canSendMessage,
  } = useWebSocketChat();

  const connectionStatus = React.useMemo(() => {
    switch (connectionState) {
      case "connected":
        return { text: "Connected", color: "text-green-500" };
      case "connecting":
        return { text: "Connecting...", color: "text-yellow-500" };
      case "error":
        return { text: "Connection failed", color: "text-red-500" };
      default:
        return { text: "Disconnected", color: "text-gray-500" };
    }
  }, [connectionState]);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Connect when chat opens, disconnect when it closes
  React.useEffect(() => {
    if (open) {
      connect();
    } else {
      disconnect();
    }
  }, [open, connect, disconnect]);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+K to toggle
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      // Escape to close
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !canSendMessage) return;

    const success = sendMessage(message);
    if (success) {
      setMessage("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">AI Copilot</span>
          <span className="sm:hidden">AI</span>
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 lg:flex">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </Button>
      </SheetTrigger>

      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>AI Copilot</SheetTitle>
          <SheetDescription>
            Ask me anything about AllMind or get help with your questions.
          </SheetDescription>
          <div className={cn("text-xs", connectionStatus.color)}>
            Status: {connectionStatus.text}
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 py-4 min-h-0">
          {/* Chat Messages Area */}
          <ScrollArea className="flex-1 rounded-md border bg-muted/50 h-9/12">
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Start a conversation with the AI copilot...
                </p>
              ) : (
                <>
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={`${msg.timestamp}-${index}`}
                      content={msg.content}
                      timestamp={msg.timestamp}
                      variant={msg.type}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      AI is thinking...
                    </div>
                  )}
                </>
              )}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 flex-shrink-0">
            <Input
              value={message}
              onChange={handleInputChange}
              placeholder={
                connectionState === "connected"
                  ? "Type your message..."
                  : "Connecting..."
              }
              className="flex-1"
              disabled={!canSendMessage}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || !canSendMessage}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
