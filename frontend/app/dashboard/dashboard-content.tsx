"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/auth/auth-context"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Label } from "../components/ui/label"
import { Users, Edit, Eye, PlusCircle, BarChart2, Clock, Calendar, Activity, Search } from "lucide-react"
import Link from "next/link"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"

// Mock data for recent activities
const recentActivities = [
  { id: 1, type: "join", user: "Alex Smith", room: "JavaScript Basics", time: "2 hours ago" },
  { id: 2, type: "create", user: "You", room: "React Fundamentals", time: "1 day ago" },
  { id: 3, type: "poll", user: "Maria Garcia", room: "UX Design Workshop", time: "2 days ago" },
  { id: 4, type: "present", user: "You", room: "Data Science Intro", time: "3 days ago" },
]

// Mock data for rooms
const mockRooms = [
  {
    roomName: "JavaScript Fundamentals",
    roomCode: "YCH1PU",
    content: [
      {
        id: "1",
        type: "poll",
        question: "What's your experience with JavaScript?",
        options: ["Beginner", "Intermediate", "Advanced"],
      },
      {
        id: "2",
        type: "mcq",
        question: "Which is not a JavaScript data type?",
        options: ["String", "Boolean", "Float", "Symbol"],
        correctOption: 2,
        timer: 30,
      },
    ],
    participants: 24,
    lastActive: "2 hours ago",
  },
  {
    roomName: "React Workshop",
    roomCode: "REACT42",
    content: [
      { id: "3", type: "poll", question: "Have you used React Hooks?", options: ["Yes", "No", "What are hooks?"] },
      {
        id: "4",
        type: "poll",
        question: "Preferred state management?",
        options: ["Redux", "Context API", "MobX", "Other"],
      },
      {
        id: "5",
        type: "mcq",
        question: "What does JSX stand for?",
        options: ["JavaScript XML", "JavaScript Extension", "JavaScript Syntax", "Java Syntax Extension"],
        correctOption: 0,
        timer: 45,
      },
    ],
    participants: 18,
    lastActive: "1 day ago",
  },
  {
    roomName: "UX Design Principles",
    roomCode: "UX5678",
    content: [
      {
        id: "6",
        type: "poll",
        question: "Which design tool do you use?",
        options: ["Figma", "Sketch", "Adobe XD", "Other"],
      },
      {
        id: "7",
        type: "mcq",
        question: "What does UI stand for?",
        options: ["User Interface", "User Interaction", "User Implementation", "User Integration"],
        correctOption: 0,
        timer: 20,
      },
    ],
    participants: 32,
    lastActive: "3 days ago",
  },
]

interface DashboardContentProps {
  initialAction?: string
}

export default function DashboardContent({ initialAction }: DashboardContentProps) {
  const { user } = useAuth()
  const [roomCode, setRoomCode] = useState("")
  const [activeTab, setActiveTab] = useState(initialAction === "join" ? "join" : "create")
  const [savedRooms, setSavedRooms] = useState(mockRooms)
  const [isJoining, setIsJoining] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // In a real app, we would load from localStorage or API
    // For now, we'll use our mock data
    setSavedRooms(mockRooms)
  }, [])

  useEffect(() => {
    if (initialAction === "join" || initialAction === "create") {
      setActiveTab(initialAction)
    }
  }, [initialAction])

  const handleJoinRoom = () => {
    setIsJoining(true)
    // Simulate API call delay
    setTimeout(() => {
      setIsJoining(false)
      router.push(`/participant/room/${roomCode}`)
    }, 500) // Reduced delay for better UX
  }

  // Calculate stats
  const totalPolls = savedRooms.reduce(
    (acc, room) => acc + room.content.filter((item) => item.type === "poll").length,
    0,
  )

  const totalMCQs = savedRooms.reduce((acc, room) => acc + room.content.filter((item) => item.type === "mcq").length, 0)

  const totalParticipants = savedRooms.reduce((acc, room) => acc + room.participants, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mt-2">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your interactive sessions and view analytics</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => router.push("/host/create-room")} className="gradient-bg">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Room
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Total Rooms</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{savedRooms.length}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <BarChart2 className="h-6 w-6" />
              </div>
            </div>
            <Progress value={75} className="h-1 mt-4" />
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Total Polls</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{totalPolls}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Activity className="h-6 w-6" />
              </div>
            </div>
            <Progress value={60} className="h-1 mt-4" />
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Total MCQs</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{totalMCQs}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <Progress value={45} className="h-1 mt-4" />
          </CardContent>
        </Card>

        <Card className="gradient-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Participants</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{totalParticipants}</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <Progress value={85} className="h-1 mt-4" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create" onClick={() => setActiveTab("create")}>
                Create a Room
              </TabsTrigger>
              <TabsTrigger value="join" onClick={() => setActiveTab("join")}>
                Join a Room
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Card className="gradient-border">
                <CardHeader className="bg-card/50 rounded-t-lg border-b border-border">
                  <CardTitle>Create a New Interactive Room</CardTitle>
                  <CardDescription>Set up a new session for your participants with polls and MCQs.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-lg gradient-border">
                      <Activity className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Create Engaging Polls</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Gather opinions and feedback from your audience in real-time.
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-6 bg-primary/5 rounded-lg gradient-border">
                      <Clock className="h-12 w-12 text-primary mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Timed MCQs</h3>
                      <p className="text-sm text-muted-foreground text-center">
                        Test knowledge with multiple-choice questions and timers.
                      </p>
                    </div>
                  </div>
                  <Link href="/host/create-room">
                    <Button className="w-full gradient-bg shadow-lg hover:shadow-xl">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Start Creating
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="join">
              <Card className="gradient-border">
                <CardHeader className="bg-card/50 rounded-t-lg border-b border-border">
                  <CardTitle>Join an Existing Room</CardTitle>
                  <CardDescription>Enter the room code to join an interactive session.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6 p-4 bg-primary/5 rounded-lg gradient-border">
                    <h3 className="text-sm font-medium text-primary mb-2">How to join a room</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-character room code provided by the host. Once you join, you'll be able to participate
                      in polls and answer questions.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="room-code" className="text-base">
                        Room Code
                      </Label>
                      <div className="relative">
                        <Input
                          id="room-code"
                          placeholder="Enter the 6-digit room code"
                          value={roomCode}
                          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                          className="pl-10 text-lg tracking-wider font-medium h-12"
                          maxLength={6}
                        />
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-card/50 p-4 rounded-b-lg border-t border-border">
                  <Button
                    onClick={handleJoinRoom}
                    disabled={!roomCode || roomCode.length < 4 || isJoining}
                    className="w-full gradient-bg h-12"
                  >
                    {isJoining ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Joining Room...
                      </>
                    ) : (
                      <>
                        <Users className="mr-2 h-5 w-5" />
                        Join Room
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Recent Activity */}
          <Card className="mt-6 gradient-border">
            <CardHeader className="border-b border-border">
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest interactions with your rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.type === "join"
                          ? "bg-green-500/10 text-green-500 border border-green-500/30"
                          : activity.type === "create"
                            ? "bg-primary/10 text-primary border border-primary/30"
                            : activity.type === "poll"
                              ? "bg-purple-500/10 text-purple-500 border border-purple-500/30"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                      }`}
                    >
                      {activity.type === "join" && <Users className="h-5 w-5" />}
                      {activity.type === "create" && <PlusCircle className="h-5 w-5" />}
                      {activity.type === "poll" && <Activity className="h-5 w-5" />}
                      {activity.type === "present" && <Eye className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">
                          {activity.user === "You" ? "You" : activity.user}
                          {activity.type === "join" && " joined "}
                          {activity.type === "create" && " created "}
                          {activity.type === "poll" && " responded to a poll in "}
                          {activity.type === "present" && " presented "}
                          <span className="text-primary">{activity.room}</span>
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {activity.time}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="gradient-border">
            <CardHeader className="bg-card/50 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle>Your Rooms</CardTitle>
                <Badge className="bg-primary/10 text-primary border border-primary/30">{savedRooms.length} Rooms</Badge>
              </div>
              <CardDescription>Manage your interactive sessions</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {savedRooms.map((room) => (
                  <Card
                    key={room.roomCode}
                    className="overflow-hidden hover:shadow-md transition-all duration-200 gradient-border hover:border-primary/30"
                  >
                    <CardHeader className="p-4 pb-2 border-b border-border">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{room.roomName}</CardTitle>
                        <Badge variant="outline" className="bg-secondary/50">
                          {room.roomCode}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex justify-between text-sm mb-3">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{room.participants} participants</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">{room.lastActive}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className="bg-primary/10 text-primary border border-primary/30">
                          Polls: {room.content.filter((item) => item.type === "poll").length}
                        </Badge>
                        <Badge className="bg-purple-500/10 text-purple-500 border border-purple-500/30">
                          MCQs: {room.content.filter((item) => item.type === "mcq").length}
                        </Badge>
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/host/create-room?edit=${room.roomCode}`)}
                          className="flex-1 text-xs"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/host/create-room?preview=${room.roomCode}`)}
                          className="flex-1 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Preview
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 gradient-bg text-xs"
                          onClick={() => router.push(`/host/room/${room.roomCode}`)}
                        >
                          Present
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-card/50 p-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full border-dashed border-2 hover:border-primary/30 hover:bg-primary/5"
                onClick={() => router.push("/host/create-room")}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Room
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

