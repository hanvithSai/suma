"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { ScrollArea } from "../components/ui/scroll-area"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"

interface ChatMessage {
  id: number
  user: string
  message: string
  avatar?: string
  isHost?: boolean
}

interface ChatBoxProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  className?: string
  title?: string
}

export default function ChatBox({ messages, onSendMessage, className = "", title = "Live Chat" }: ChatBoxProps) {
  const [message, setMessage] = useState("")

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <Card className={`h-[400px] flex flex-col ${className}`}>
      <CardHeader className="px-4 py-3 border-b border-border">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-grow flex flex-col">
        <ScrollArea className="flex-grow p-4">
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-2 ${msg.isHost ? "bg-primary/5 p-2 rounded-lg" : ""}`}
              >
                {msg.avatar && (
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarImage src={msg.avatar} alt={msg.user} />
                    <AvatarFallback className="text-xs">{msg.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-1">
                    <span className={`font-semibold text-sm ${msg.isHost ? "text-primary" : "text-foreground"}`}>
                      {msg.user === "You" ? "You" : msg.user}
                    </span>
                    {msg.isHost && <Badge className="text-xs bg-primary/10 text-primary">Host</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground break-words">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-2 border-t border-border flex items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button size="sm" onClick={handleSendMessage} className="gradient-bg">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

