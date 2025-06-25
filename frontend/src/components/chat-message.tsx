"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  timestamp: number;
  variant: "user" | "assistant";
  className?: string;
}

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ChatMessage({
  content,
  timestamp,
  variant,
  className,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        variant === "user" ? "items-end" : "items-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          variant === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-background text-foreground border shadow-sm"
        )}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">
          {content}
        </p>
      </div>
      <span className="text-xs text-muted-foreground font-mono">
        {formatTimestamp(timestamp)}
      </span>
    </div>
  );
}
