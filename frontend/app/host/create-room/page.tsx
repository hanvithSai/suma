import type { Metadata } from "next";
import CreateRoomForm from "@/app/host/components/CreateRoomForm";
import Header from "@/app/comp/Header";

export const metadata: Metadata = {
  title: "Create Room | SUMA",
  description: "Create an interactive room for your session",
};

export default function CreateRoomPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header showNavLinks={false} />
      <main className="container mx-auto px-4 py-8">
        <CreateRoomForm />
      </main>
    </div>
  );
}
