import type { Metadata } from "next"
import CreateRoomForm from "@/components/host/CreateRoomForm"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "Create Room | SUMA",
  description: "Create an interactive room for your session",
}

export default function CreateRoomPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header showNavLinks={false} />
      <main className="container mx-auto px-4 py-8">
        <CreateRoomForm />
      </main>
    </div>
  )
}

