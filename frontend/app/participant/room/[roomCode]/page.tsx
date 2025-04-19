"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Header from "@/app/comp/Header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Label } from "@/app/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Progress } from "@/app/components/ui/progress"
import { Badge } from "@/app/components/ui/badge"
import { ThumbsUp, AlertCircle, ChevronRight, BarChart2, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import BarChart from "@/app/comp/BarChart"
import Leaderboard from "@/app/comp/Leaderboard"
import ChatBox from "@/app/comp/ChatBox"
import { Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

// Mock quiz content
const mockQuizContent = [
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
]

// Mock room data
const mockRoom = {
  roomName: "JavaScript Fundamentals",
  hostName: "John Doe",
  participantCount: 24,
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
  ],
}

// Sample leaderboard data
const leaderboardEntries = [
  { id: 1, name: "Alice", avatar: "/placeholder.svg?height=32&width=32", score: 850, rank: 1 },
  { id: 2, name: "Bob", avatar: "/placeholder.svg?height=32&width=32", score: 720, rank: 2 },
  { id: 3, name: "Charlie", avatar: "/placeholder.svg?height=32&width=32", score: 695, rank: 3 },
  { id: 4, name: "David", avatar: "/placeholder.svg?height=32&width=32", score: 580, rank: 4 },
  { id: 5, name: "You", avatar: "/placeholder.svg?height=32&width=32", score: 450, rank: 5 },
]

export default function ParticipantView() {
  const params = useParams()
  const router = useRouter()
  const roomCode = params.roomCode as string

  // State for quiz flow
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [chatMessages, setChatMessages] = useState(mockRoom.chatMessages)
  const [nextMessageId, setNextMessageId] = useState(mockRoom.chatMessages.length + 1)
  const [activeTab, setActiveTab] = useState("quiz")

  const currentItem = mockQuizContent[currentItemIndex]
  const isMCQ = currentItem?.type === "mcq"
  const isPoll = currentItem?.type === "poll"

  // Initialize timer when a new MCQ is shown
  useEffect(() => {
    if (isMCQ && !responses[currentItem.id]) {
      setTimeLeft(currentItem.timer)
      setShowAnswer(false)

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            if (!responses[currentItem.id]) {
              handleSubmit(null)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentItemIndex, isMCQ, responses])

  // Handle submission of answers
  const handleSubmit = (selectedOption: string | null) => {
    if (!currentItem) return

    // Record response
    setResponses((prev) => ({
      ...prev,
      [currentItem.id]: {
        selectedOption,
        isCorrect: isMCQ ? selectedOption === currentItem.options[currentItem.correctOption] : null,
        timestamp: new Date().toISOString(),
      },
    }))

    // For MCQs, show the answer
    if (isMCQ) {
      setShowAnswer(true)
      // Wait 3 seconds before moving to next question
      setTimeout(() => {
        goToNext()
      }, 3000)
    } else {
      // For polls, move to next question immediately
      goToNext()
    }
  }

  // Go to next question
  const goToNext = () => {
    if (currentItemIndex < mockQuizContent.length - 1) {
      setCurrentItemIndex((prev) => prev + 1)
    } else {
      setQuizComplete(true)
    }
  }

  // Handle chat message sending
  const handleSendMessage = (message: string) => {
    const newMessage = {
      id: nextMessageId,
      user: "You",
      message: message,
      avatar: "/placeholder.svg?height=32&width=32",
    }
    setChatMessages([...chatMessages, newMessage])
    setNextMessageId(nextMessageId + 1)
  }

  // Calculate progress percentage
  const progressPercentage = ((currentItemIndex + (responses[currentItem?.id] ? 1 : 0)) / mockQuizContent.length) * 100

  return (
    <div className="min-h-screen">
      <Header showNavLinks={false} />

      {/* Room Info Bar */}
      <div className="sticky top-16 z-10 bg-card border-b border-border">
        <div className="w-full px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-foreground mr-2">{mockRoom.roomName}</h1>
              <Badge className="bg-primary/10 text-primary border border-primary/30">Room: {roomCode}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline">
                <Users className="h-3.5 w-3.5 mr-1" />
                {mockRoom.participantCount} participants
              </Badge>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-1.5" />
          </div>
        </div>
      </div>

      <div className="w-full px-4 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="quiz">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {quizComplete ? (
                  <QuizComplete responses={responses} />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentItem?.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {isMCQ && (
                        <MCQQuestion
                          question={currentItem}
                          timeLeft={timeLeft}
                          showAnswer={showAnswer}
                          response={responses[currentItem.id]}
                          onSubmit={handleSubmit}
                        />
                      )}

                      {isPoll && (
                        <PollQuestion
                          question={currentItem}
                          response={responses[currentItem.id]}
                          onSubmit={handleSubmit}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              <div className="lg:col-span-1">
                {responses[currentItem?.id] && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BarChart data={currentItem.results} showPercentages={true} animated={true} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard entries={leaderboardEntries} title="Leaderboard" />
          </TabsContent>

          <TabsContent value="chat">
            <ChatBox messages={chatMessages} onSendMessage={handleSendMessage} title="Live Chat" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// MCQ Question Component
function MCQQuestion({
  question,
  timeLeft,
  showAnswer,
  response,
  onSubmit,
}: {
  question: any
  timeLeft: number
  showAnswer: boolean
  response: any
  onSubmit: (option: string | null) => void
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Reset selection when question changes
  useEffect(() => {
    setSelectedOption(null)
  }, [question.id])

  const handleSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption)
    }
  }

  return (
    <Card className="gradient-border">
      <CardHeader className="bg-card/50 pb-3 border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Multiple Choice Question</CardTitle>
            <CardDescription>Select the correct answer</CardDescription>
          </div>
          {!response && (
            <div className="flex items-center bg-primary/10 px-3 py-1 rounded-full border border-primary/30">
              <Clock className="h-4 w-4 text-primary mr-1" />
              <span className="text-sm font-medium text-primary">{timeLeft}s</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">{question.question}</h3>

          {!response && !showAnswer && (
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Time remaining</span>
                <span className="font-medium text-primary">{timeLeft} seconds</span>
              </div>
              <Progress value={(timeLeft / question.timer) * 100} className="h-2" />
            </div>
          )}

          {showAnswer || response ? (
            <div className="space-y-3">
              <div
                className={`p-4 rounded-md gradient-border ${
                  response?.isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start">
                  {response?.isCorrect ? (
                    <ThumbsUp className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${response?.isCorrect ? "text-green-500" : "text-red-500"}`}>
                      {response?.isCorrect ? "Correct! Well done!" : "Incorrect. Better luck next time!"}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      The correct answer is: {question.options[question.correctOption]}
                    </p>
                  </div>
                </div>
              </div>

              {question.options.map((option: string, index: number) => (
                <div
                  key={index}
                  className={`p-3 rounded-md flex justify-between items-center ${
                    index === question.correctOption
                      ? "bg-green-500/10 border border-green-500/30"
                      : option === response?.selectedOption && index !== question.correctOption
                        ? "bg-red-500/10 border border-red-500/30"
                        : "bg-secondary"
                  }`}
                >
                  <span className="font-medium">{option}</span>
                  {index === question.correctOption && (
                    <Badge className="bg-green-500/20 text-green-500 border border-green-500/30">Correct</Badge>
                  )}
                  {option === response?.selectedOption && index !== question.correctOption && (
                    <Badge className="bg-red-500/20 text-red-500 border border-red-500/30">Your choice</Badge>
                  )}
                </div>
              ))}

              <div className="text-center text-muted-foreground mt-4 animate-pulse">Moving to next question...</div>
            </div>
          ) : (
            <>
              <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-3">
                {question.options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-secondary p-3 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    <RadioGroupItem value={option} id={`mcq-option-${index}`} />
                    <Label htmlFor={`mcq-option-${index}`} className="flex-1 cursor-pointer font-medium">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Button className="mt-6 gradient-bg w-full" disabled={!selectedOption} onClick={handleSubmit}>
                Submit Answer
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Poll Question Component
function PollQuestion({
  question,
  response,
  onSubmit,
}: {
  question: any
  response: any
  onSubmit: (option: string | null) => void
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // Reset selection when question changes
  useEffect(() => {
    setSelectedOption(null)
  }, [question.id])

  const handleSubmit = () => {
    if (selectedOption) {
      onSubmit(selectedOption)
    }
  }

  return (
    <Card className="gradient-border">
      <CardHeader className="bg-card/50 pb-3 border-b border-border">
        <CardTitle>Poll Question</CardTitle>
        <CardDescription>Share your opinion with the group</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-foreground mb-4">{question.question}</h3>

          {response ? (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 mb-4">
                <div className="flex items-center">
                  <ThumbsUp className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-green-500 font-medium">Your response has been recorded!</p>
                </div>
              </div>

              <BarChart data={question.results} showPercentages={true} animated={true} />

              <div className="text-center text-muted-foreground mt-4 animate-pulse">Moving to next question...</div>
            </div>
          ) : (
            <>
              <RadioGroup value={selectedOption || ""} onValueChange={setSelectedOption} className="space-y-3">
                {question.options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-secondary p-3 rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    <RadioGroupItem value={option} id={`poll-option-${index}`} />
                    <Label htmlFor={`poll-option-${index}`} className="flex-1 cursor-pointer font-medium">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <Button className="mt-6 gradient-bg w-full" disabled={!selectedOption} onClick={handleSubmit}>
                Submit Vote
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Quiz Complete Component
function QuizComplete({ responses }: { responses: Record<string, any> }) {
  const router = useRouter()

  // Calculate stats
  const totalQuestions = mockQuizContent.length
  const answeredQuestions = Object.keys(responses).length
  const mcqQuestions = mockQuizContent.filter((q) => q.type === "mcq")
  const correctAnswers = mcqQuestions.filter((q) => responses[q.id]?.isCorrect).length
  const accuracy = mcqQuestions.length > 0 ? (correctAnswers / mcqQuestions.length) * 100 : 0

  return (
    <Card className="gradient-border">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-6 border-b border-border">
        <div className="text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full gradient-bg text-white mb-4">
            <BarChart2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <CardDescription className="text-base">
            Thank you for participating in this interactive session
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/5 rounded-lg p-4 text-center gradient-border">
            <div className="text-3xl font-bold text-primary">
              {answeredQuestions}/{totalQuestions}
            </div>
            <div className="text-sm text-muted-foreground">Questions Answered</div>
          </div>

          <div className="bg-green-500/5 rounded-lg p-4 text-center border border-green-500/20">
            <div className="text-3xl font-bold text-green-500">
              {correctAnswers}/{mcqQuestions.length}
            </div>
            <div className="text-sm text-muted-foreground">Correct Answers</div>
          </div>

          <div className="bg-purple-500/5 rounded-lg p-4 text-center border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-500">{Math.round(accuracy)}%</div>
            <div className="text-sm text-muted-foreground">Accuracy</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Your Responses</h3>

          {mockQuizContent.map((item, index) => {
            const response = responses[item.id]

            return (
              <div key={item.id} className="border border-border rounded-lg p-4 bg-card/50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <Badge className="mr-2 bg-secondary text-foreground">{item.type.toUpperCase()}</Badge>
                      <span className="font-medium text-foreground">Question {index + 1}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{item.question}</p>
                  </div>

                  {item.type === "mcq" && (
                    <Badge
                      className={
                        response?.isCorrect
                          ? "bg-green-500/10 text-green-500 border border-green-500/30"
                          : "bg-red-500/10 text-red-500 border border-red-500/30"
                      }
                    >
                      {response?.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  )}
                </div>

                {response && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <div className="flex items-center">
                      <span className="text-sm text-muted-foreground mr-2">Your answer:</span>
                      <span className="font-medium text-foreground">{response.selectedOption || "No answer"}</span>
                    </div>

                    {item.type === "mcq" && !response.isCorrect && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        Correct answer: {item.options[item.correctOption]}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>

      <CardFooter className="bg-card/50 p-6 flex justify-center border-t border-border">
        <Button onClick={() => router.push("/dashboard")} className="gradient-bg">
          <ChevronRight className="h-4 w-4 mr-2" />
          Return to Dashboard
        </Button>
      </CardFooter>
    </Card>
  )
}

