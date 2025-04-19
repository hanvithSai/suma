"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/app/comp/Header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play, Pause, Users, MessageSquare } from "lucide-react"
import BarChart from "@/app/comp/BarChart"
import Leaderboard from "@/app/comp/Leaderboard"
import ChatBox from "@/app/comp/ChatBox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample leaderboard data
const leaderboardEntries = [
  { id: 1, name: "Alice", avatar: "/placeholder.svg?height=32&width=32", score: 850, rank: 1 },
  { id: 2, name: "Bob", avatar: "/placeholder.svg?height=32&width=32", score: 720, rank: 2 },
  { id: 3, name: "Charlie", avatar: "/placeholder.svg?height=32&width=32", score: 695, rank: 3 },
  { id: 4, name: "David", avatar: "/placeholder.svg?height=32&width=32", score: 580, rank: 4 },
  { id: 5, name: "Eva", avatar: "/placeholder.svg?height=32&width=32", score: 450, rank: 5 },
]

// Sample chat messages
const initialChatMessages = [
  { id: 1, user: "Alice", message: "Hello everyone!", avatar: "/placeholder.svg?height=32&width=32" },
  { id: 2, user: "Bob", message: "Hi Alice, how are you?", avatar: "/placeholder.svg?height=32&width=32" },
  {
    id: 3,
    user: "Charlie",
    message: "Hey folks, excited for the session!",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    user: "Host",
    message: "Welcome everyone! We'll be starting in a few minutes.",
    avatar: "/placeholder.svg?height=32&width=32",
    isHost: true,
  },
]

export default function HostRoomView() {
  const params = useParams()
  const roomCode = params.roomCode as string
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [room, setRoom] = useState<any>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState(initialChatMessages)
  const [nextMessageId, setNextMessageId] = useState(initialChatMessages.length + 1)
  const [activeTab, setActiveTab] = useState("results")

  // Sample room data
  const sampleRoom = {
    roomName: "JavaScript Fundamentals",
    roomCode: roomCode,
    content: [
      {
        id: "poll-1",
        type: "poll",
        question: "What's your experience with JavaScript?",
        options: ["Beginner", "Intermediate", "Advanced", "Expert"],
        results: [
          { label: "Beginner", value: 15, color: "bg-blue-500" },
          { label: "Intermediate", value: 25, color: "bg-green-500" },
          { label: "Advanced", value: 10, color: "bg-yellow-500" },
          { label: "Expert", value: 5, color: "bg-red-500" },
        ],
      },
      {
        id: "mcq-1",
        type: "mcq",
        question: "Which of the following is not a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Symbol"],
        correctOption: 2,
        timer: 30,
        results: [
          { label: "String", value: 5, color: "bg-blue-500" },
          { label: "Boolean", value: 8, color: "bg-green-500" },
          { label: "Float", value: 35, color: "bg-yellow-500" },
          { label: "Symbol", value: 7, color: "bg-red-500" },
        ],
      },
      {
        id: "poll-2",
        type: "poll",
        question: "Which JavaScript framework do you prefer?",
        options: ["React", "Vue", "Angular", "Svelte", "None/Other"],
        results: [
          { label: "React", value: 30, color: "bg-blue-500" },
          { label: "Vue", value: 15, color: "bg-green-500" },
          { label: "Angular", value: 12, color: "bg-yellow-500" },
          { label: "Svelte", value: 8, color: "bg-red-500" },
          { label: "None/Other", value: 5, color: "bg-purple-500" },
        ],
      },
    ],
    participants: 55,
  }

  useEffect(() => {
    // In a real app, we would load from localStorage or API
    setRoom(sampleRoom)
  }, [roomCode])

  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: nextMessageId,
      user: "Host",
      message: message,
      avatar: "/placeholder.svg?height=32&width=32",
      isHost: true,
    }
    setChatMessages([...chatMessages, newMessage])
    setNextMessageId(nextMessageId + 1)
  }

  const handleStartQuestion = () => {
    setIsRunning(true)
    setActiveQuestion(room.content[currentItemIndex])
  }

  const handleStopQuestion = () => {
    setIsRunning(false)
    setActiveQuestion(null)
  }

  const goToNextItem = () => {
    if (isRunning) {
      handleStopQuestion()
    }
    if (currentItemIndex < room.content.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
    }
  }

  const goToPreviousItem = () => {
    if (isRunning) {
      handleStopQuestion()
    }
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
    }
  }

  if (!room) {
    return (
      <div className="min-h-screen">
        <Header showNavLinks={false} />
        <div className="w-full px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading room...</h1>
        </div>
      </div>
    )
  }

  const currentItem = room.content[currentItemIndex]
  const totalItems = room.content.length

  return (
    <div className="min-h-screen">
      <Header showNavLinks={false} />
      <div className="responsive-container py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{room.roomName}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-muted-foreground">Room Code:</span>
              <span className="text-primary font-bold">{room.roomCode}</span>
              <Badge variant="outline" className="ml-2">
                <Users className="h-3.5 w-3.5 mr-1" />
                {room.participants} participants
              </Badge>
              {isRunning && <Badge className="bg-green-500/10 text-green-500 border border-green-500/30">Live</Badge>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={goToPreviousItem} disabled={currentItemIndex === 0 || isRunning}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            {isRunning ? (
              <Button variant="destructive" onClick={handleStopQuestion}>
                <Pause className="mr-1 h-4 w-4" />
                Stop Question
              </Button>
            ) : (
              <Button className="gradient-bg" onClick={handleStartQuestion}>
                <Play className="mr-1 h-4 w-4" />
                Start Question
              </Button>
            )}
            <Button
              variant="outline"
              onClick={goToNextItem}
              disabled={currentItemIndex === totalItems - 1 || isRunning}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div>
                  <CardTitle>{currentItem.type === "poll" ? "Poll" : "Multiple Choice Question"}</CardTitle>
                  <CardDescription>
                    Question {currentItemIndex + 1} of {totalItems}
                    {isRunning && <span className="ml-2 text-green-500 font-medium">• Live</span>}
                  </CardDescription>
                </div>
                {currentItem.type === "mcq" && (
                  <div className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary">
                    Timer: {currentItem.timer}s
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-4">{currentItem.question}</h2>
                  <div className="space-y-3">
                    {currentItem.options.map((option, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                        <span>{option}</span>
                        {currentItem.type === "mcq" && index === currentItem.correctOption && (
                          <Badge className="bg-green-500/20 text-green-500">Correct</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <BarChart data={currentItem.results} title="Live Results" showPercentages={true} animated={true} />
              </CardContent>
            </Card>

            <Leaderboard entries={leaderboardEntries} title="Top Participants" className="mt-4" />
          </div>

          <div className="lg:col-span-1">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarChart data={currentItem.results} showPercentages={true} animated={true} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat">
                <ChatBox messages={chatMessages} onSendMessage={handleSendMessage} title="Participant Chat" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

