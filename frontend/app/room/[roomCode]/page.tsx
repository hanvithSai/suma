"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Send } from "lucide-react"

// Sample data
const samplePoll = {
  question: "What's your favorite programming language?",
  options: ["JavaScript", "Python", "Java", "C++"],
}

const sampleMCQ = {
  question: "Which of the following is not a JavaScript framework?",
  options: ["React", "Vue", "Angular", "Django"],
  timer: 30,
}

const sampleChatMessages = [
  { user: "Alice", message: "Hello everyone!" },
  { user: "Bob", message: "Hi Alice, how are you?" },
  { user: "Charlie", message: "Hey folks, excited for the session!" },
]

export default function ParticipantView() {
  const params = useParams()
  const roomCode = params.roomCode as string
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null)
  const [selectedMCQOption, setSelectedMCQOption] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState(sampleChatMessages)
  const [mcqTimer, setMcqTimer] = useState(sampleMCQ.timer)

  useEffect(() => {
    const timer = setInterval(() => {
      setMcqTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([...chatMessages, { user: "You", message: chatMessage }])
      setChatMessage("")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Room: {roomCode}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Poll</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{samplePoll.question}</p>
              <RadioGroup value={selectedPollOption || ""} onValueChange={setSelectedPollOption}>
                {samplePoll.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`poll-option-${index}`} />
                    <Label htmlFor={`poll-option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <Button className="mt-4" disabled={!selectedPollOption}>
                Submit Vote
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multiple Choice Question</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{sampleMCQ.question}</p>
              <RadioGroup value={selectedMCQOption || ""} onValueChange={setSelectedMCQOption}>
                {sampleMCQ.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`mcq-option-${index}`} />
                    <Label htmlFor={`mcq-option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="mt-4 flex justify-between items-center">
                <Button disabled={!selectedMCQOption}>Submit Answer</Button>
                <span className="text-lg font-semibold">Time left: {mcqTimer}s</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col">
            <ScrollArea className="flex-grow mb-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold">{msg.user}: </span>
                  <span>{msg.message}</span>
                </div>
              ))}
            </ScrollArea>
            <Separator className="my-2" />
            <div className="flex items-center space-x-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

