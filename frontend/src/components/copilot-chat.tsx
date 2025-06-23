"use client";

import * as React from "react";
import { MessageSquare, Send } from "lucide-react";
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

export function CopilotChat() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");

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
    if (!message.trim()) return;

    // TODO: Send message to backend
    console.log("Sending message:", message);
    setMessage("");
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
      {/* Half the height when mobile to account for keyboard placement, otherwise full (sm and larger) */}
      <SheetContent className="flex w-full flex-col h-[50vh] sm:h-auto sm:max-w-md">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>AI Copilot</SheetTitle>
          <SheetDescription>
            Ask me anything about AllMind or get help with your questions.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 py-4">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto rounded-md border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Chat messages will appear here...
            </p>
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={message}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
