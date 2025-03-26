"use client"

import { useState } from "react"
import { Button } from "@/app/ui/button"
import { Input } from "@/app/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card"
import { ScrollArea } from "@/app/ui/scroll-area"
import { Separator } from "@/app/ui/separator"
import { Send } from "lucide-react"

// Sample data
const initialMessages = [
  { user: "Alice", message: "Hello everyone!" },
  { user: "Bob", message: "Hi Alice, how are you?" },
  { user: "Charlie", message: "Hey folks, excited for the session!" },
  { user: "Host", message: "Welcome everyone! We'll be starting in a few minutes.", isHost: true },
]

export default function QAChat() {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { user: "You", message: newMessage }])
      setNewMessage("")
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Live Chat & Q&A</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <ScrollArea className="flex-grow mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${msg.isHost ? "bg-indigo-50" : ""}`}>
              <span className={`font-semibold ${msg.isHost ? "text-indigo-600" : ""}`}>{msg.user}:</span>
              <span className="ml-1">{msg.message}</span>
            </div>
          ))}
        </ScrollArea>
        <Separator className="my-2" />
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question or send a message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

