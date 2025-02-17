import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChatBox() {
  const [messages, setMessages] = useState<string[]>([])
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, newMessage])
      setNewMessage("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat Box</CardTitle>
        <CardDescription>Communicate with participants in real-time.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto border rounded p-2 mb-4">
          {messages.map((message, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold">Host:</span> {message}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  )
}

