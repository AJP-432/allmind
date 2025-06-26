"use client";

import { useChatHistory } from "@/hooks/use-chat-history";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

export function ChatHistory() {
  const { history, loading, error } = useChatHistory(10);

  const renderContent = () => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center">
            Loading chat history...
          </TableCell>
        </TableRow>
      );
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center text-destructive">
            Error loading chat history: {error.message}
          </TableCell>
        </TableRow>
      );
    }

    if (history.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="text-center">
            No chat history found.
          </TableCell>
        </TableRow>
      );
    }

    return history.map((msg) => (
      <TableRow key={msg.id}>
        <TableCell>
          <Badge variant={msg.type === "user" ? "default" : "secondary"}>
            {msg.type}
          </Badge>
        </TableCell>
        <TableCell className="max-w-md truncate">{msg.content}</TableCell>
        <TableCell className="text-right">
          {formatTimestamp(msg.timestamp)}
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <section id="history" className="w-full py-8">
      <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
        <div className="space-y-2 text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tighter md:text-3xl">
            Recent Chat History
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg">
            A live view of the 10 most recent messages.
          </p>
        </div>
        <div className="rounded-lg border font-mono">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>Content</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderContent()}</TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
