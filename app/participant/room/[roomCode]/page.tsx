"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import Header from "@/app/comp/Header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, MessageSquare, Clock, Users, ThumbsUp, AlertCircle } from "lucide-react"

// Mock data for the room
const mockRoom = {
  roomName: "JavaScript Fundamentals",
  hostName: "John Doe",
  participantCount: 24,
  activePoll: {
    question: "What's your experience with JavaScript?",
    options: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  activeMCQ: {
    question: "Which of the following is not a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Symbol"],
    timer: 30,
    correctOption: 2,
  },
  chatMessages: [
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
    {
      id: 5,
      user: "David",
      message: "Looking forward to learning JavaScript!",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ],
  participants: [
    { id: 1, name: "Alice", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 2, name: "Bob", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 3, name: "Charlie", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 4, name: "David", avatar: "/placeholder.svg?height=32&width=32" },
    { id: 5, name: "You", avatar: "/placeholder.svg?height=32&width=32", isYou: true },
  ],
}

export default function ParticipantView() {
  const params = useParams()
  const roomCode = params.roomCode as string
  const [selectedPollOption, setSelectedPollOption] = useState<string | null>(null)
  const [selectedMCQOption, setSelectedMCQOption] = useState<string | null>(null)
  const [pollSubmitted, setPollSubmitted] = useState(false)
  const [mcqSubmitted, setMcqSubmitted] = useState(false)
  const [showMcqAnswer, setShowMcqAnswer] = useState(false)
  const [timeLeft, setTimeLeft] = useState(mockRoom.activeMCQ.timer)
  const [chatMessage, setChatMessage] = useState("")
  const [chatMessages, setChatMessages] = useState(mockRoom.chatMessages)
  const [activeTab, setActiveTab] = useState("questions")

  useEffect(() => {
    if (timeLeft > 0 && !mcqSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !mcqSubmitted) {
      setMcqSubmitted(true)
      setTimeout(() => setShowMcqAnswer(true), 1000)
    }
  }, [timeLeft, mcqSubmitted])

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          user: "You",
          message: chatMessage,
          avatar: "/placeholder.svg?height=32&width=32",
        },
      ])
      setChatMessage("")
    }
  }

  const handleSubmitPoll = () => {
    if (selectedPollOption) {
      setPollSubmitted(true)
    }
  }

  const handleSubmitMCQ = () => {
    if (selectedMCQOption) {
      setMcqSubmitted(true)
      setTimeout(() => setShowMcqAnswer(true), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showNavLinks={false} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">{mockRoom.roomName}</h1>
              <Badge className="ml-3 bg-indigo-100 text-indigo-800">Room: {roomCode}</Badge>
            </div>
            <p className="text-gray-500 mt-1">Hosted by {mockRoom.hostName}</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <Users className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-gray-700">{mockRoom.participantCount} participants</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-indigo-100 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
                <CardTitle>Active Poll</CardTitle>
                <CardDescription>Share your opinion with the group</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{mockRoom.activePoll.question}</h3>

                  {pollSubmitted ? (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                        <div className="flex items-center">
                          <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
                          <p className="text-green-700 font-medium">Your response has been recorded!</p>
                        </div>
                      </div>

                      {mockRoom.activePoll.options.map((option, index) => {
                        // Generate random percentage for demo
                        const percentage = Math.floor(Math.random() * 100)
                        const isSelected = option === selectedPollOption

                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <span className={`font-medium ${isSelected ? "text-indigo-700" : "text-gray-700"}`}>
                                  {option} {isSelected && "(Your choice)"}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-500">{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className={`h-2.5 rounded-full ${isSelected ? "bg-indigo-600" : "bg-gray-400"}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <>
                      <RadioGroup
                        value={selectedPollOption || ""}
                        onValueChange={setSelectedPollOption}
                        className="space-y-3"
                      >
                        {mockRoom.activePoll.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <RadioGroupItem value={option} id={`poll-option-${index}`} />
                            <Label htmlFor={`poll-option-${index}`} className="flex-1 cursor-pointer font-medium">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button
                        className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                        disabled={!selectedPollOption}
                        onClick={handleSubmitPoll}
                      >
                        Submit Vote
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-100 shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Multiple Choice Question</CardTitle>
                    <CardDescription>Test your knowledge</CardDescription>
                  </div>
                  {!mcqSubmitted && (
                    <div className="flex items-center bg-indigo-100 px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4 text-indigo-700 mr-1" />
                      <span className="text-sm font-medium text-indigo-700">{timeLeft}s</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{mockRoom.activeMCQ.question}</h3>

                  {!mcqSubmitted && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Time remaining</span>
                        <span className="font-medium text-indigo-700">{timeLeft} seconds</span>
                      </div>
                      <Progress value={(timeLeft / mockRoom.activeMCQ.timer) * 100} className="h-2" />
                    </div>
                  )}

                  {showMcqAnswer ? (
                    <div className="space-y-3">
                      <div
                        className={`p-4 rounded-md ${
                          selectedMCQOption === mockRoom.activeMCQ.options[mockRoom.activeMCQ.correctOption]
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="flex items-start">
                          {selectedMCQOption === mockRoom.activeMCQ.options[mockRoom.activeMCQ.correctOption] ? (
                            <ThumbsUp className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                          )}
                          <div>
                            <p
                              className={`font-medium ${
                                selectedMCQOption === mockRoom.activeMCQ.options[mockRoom.activeMCQ.correctOption]
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              {selectedMCQOption === mockRoom.activeMCQ.options[mockRoom.activeMCQ.correctOption]
                                ? "Correct! Well done!"
                                : "Incorrect. Better luck next time!"}
                            </p>
                            <p className="text-gray-600 mt-1">
                              The correct answer is: {mockRoom.activeMCQ.options[mockRoom.activeMCQ.correctOption]}
                            </p>
                          </div>
                        </div>
                      </div>

                      {mockRoom.activeMCQ.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md flex justify-between items-center ${
                            index === mockRoom.activeMCQ.correctOption
                              ? "bg-green-50 border border-green-200"
                              : option === selectedMCQOption
                                ? "bg-red-50 border border-red-200"
                                : "bg-gray-50"
                          }`}
                        >
                          <span className="font-medium">{option}</span>
                          {index === mockRoom.activeMCQ.correctOption && (
                            <Badge className="bg-green-100 text-green-800">Correct</Badge>
                          )}
                          {option === selectedMCQOption && index !== mockRoom.activeMCQ.correctOption && (
                            <Badge className="bg-red-100 text-red-800">Your choice</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <RadioGroup
                        value={selectedMCQOption || ""}
                        onValueChange={setSelectedMCQOption}
                        className="space-y-3"
                        disabled={mcqSubmitted}
                      >
                        {mockRoom.activeMCQ.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <RadioGroupItem value={option} id={`mcq-option-${index}`} disabled={mcqSubmitted} />
                            <Label htmlFor={`mcq-option-${index}`} className="flex-1 cursor-pointer font-medium">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <Button
                        className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                        disabled={!selectedMCQOption || mcqSubmitted}
                        onClick={handleSubmitMCQ}
                      >
                        {mcqSubmitted ? "Submitted" : "Submit Answer"}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col border-2 border-indigo-100 shadow-md overflow-hidden">
              <Tabs defaultValue="chat" className="flex flex-col h-full">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 pb-3">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chat" className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger value="participants" className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Participants
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <TabsContent value="chat" className="flex-grow flex flex-col p-0 m-0">
                  <ScrollArea className="flex-grow px-4">
                    <div className="space-y-4 py-4">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex items-start space-x-3 ${msg.isHost ? "bg-indigo-50 p-3 rounded-lg" : ""}`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.avatar} alt={msg.user} />
                            <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className={`font-semibold ${msg.isHost ? "text-indigo-700" : "text-gray-900"}`}>
                                {msg.user === "You" ? "You" : msg.user}
                                {msg.isHost && (
                                  <Badge className="ml-2 bg-indigo-100 text-indigo-800 text-xs">Host</Badge>
                                )}
                              </span>
                            </div>
                            <p className="text-gray-700 mt-1">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Separator />
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <Input
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Ask a question or send a message..."
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="participants" className="flex-grow p-0 m-0">
                  <ScrollArea className="h-full">
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-700">Participants ({mockRoom.participants.length})</h3>
                      </div>
                      <div className="space-y-3">
                        {mockRoom.participants.map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-50"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={participant.avatar} alt={participant.name} />
                              <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center">
                                <span className="font-medium text-gray-900">
                                  {participant.isYou ? "You" : participant.name}
                                </span>
                                {participant.isYou && (
                                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs">You</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

