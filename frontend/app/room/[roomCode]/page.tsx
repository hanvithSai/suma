"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Separator } from "@/app/components/ui/separator"
import { Send } from "lucide-react"
import Header from "@/app/comp/Header"
import BarChart from "@/app/comp/BarChart"
import Leaderboard from "@/app/comp/Leaderboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

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

// Sample leaderboard data
const leaderboardEntries = [
  { id: 1, name: "Alice", avatar: "/placeholder.svg?height=32&width=32", score: 850, rank: 1 },
  { id: 2, name: "Bob", avatar: "/placeholder.svg?height=32&width=32", score: 720, rank: 2 },
  { id: 3, name: "Charlie", avatar: "/placeholder.svg?height=32&width=32", score: 695, rank: 3 },
  { id: 4, name: "David", avatar: "/placeholder.svg?height=32&width=32", score: 580, rank: 4 },
  { id: 5, name: "You", avatar: "/placeholder.svg?height=32&width=32", score: 450, rank: 5 },
]

// Sample poll results data
const pollResults = [
  { label: "JavaScript", value: 42, color: "bg-yellow-500" },
  { label: "Python", value: 28, color: "bg-blue-500" },
  { label: "Java", value: 15, color: "bg-red-500" },
  { label: "C++", value: 10, color: "bg-green-500" },
]

export default function ParticipantView() {
  const params = useParams()
  const roomCode = params.roomCode as string
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null)
  const [selectedMCQOption, setSelectedMCQOption] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState(sampleChatMessages)
  const [mcqTimer, setMcqTimer] = useState(sampleMCQ.timer)
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState("content")

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

  const handleSubmitPoll = () => {
    if (selectedPollOption) {
      setShowResults(true)
    }
  }

  return (
    <div className="min-h-screen">
      <Header showNavLinks={false} />

      <div className="responsive-container py-6">
        <h1 className="text-3xl font-bold text-center mb-6">Room: {roomCode}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Poll</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{samplePoll.question}</p>
                  {showResults ? (
                    <BarChart data={pollResults} showPercentages={true} animated={true} />
                  ) : (
                    <>
                      <RadioGroup value={selectedPollOption || ""} onValueChange={setSelectedPollOption}>
                        {samplePoll.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`poll-option-${index}`} />
                            <Label htmlFor={`poll-option-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button className="mt-4" disabled={!selectedPollOption} onClick={handleSubmitPoll}>
                        Submit Vote
                      </Button>
                    </>
                  )}
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
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard entries={leaderboardEntries} />
          </TabsContent>

          <TabsContent value="chat">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

