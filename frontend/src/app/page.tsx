import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ChatHistory } from "@/components/chat-history";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ChatHistory />
      </main>
      <Footer />
    </div>
  );
}
