"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Users, ArrowRight, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/Breadcrumb"

interface DashboardContentProps {
  initialAction?: string
  username: string
}

export default function DashboardContent({ initialAction, username }: DashboardContentProps) {
  const [roomCode, setRoomCode] = useState("")
  const [activeTab, setActiveTab] = useState(initialAction === "join" ? "join" : "create")
  const [savedRooms, setSavedRooms] = useState([])
  const router = useRouter()

  useEffect(() => {
    const loadedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
    setSavedRooms(loadedRooms)
  }, [])

  useEffect(() => {
    if (initialAction === "join" || initialAction === "create") {
      setActiveTab(initialAction)
    }
  }, [initialAction])

  const handleJoinRoom = () => {
    // Comment out room login validation for now
    // console.log("Joining room:", roomCode)
    // TODO: Implement actual room validation logic here
    router.push(`/room/${roomCode}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }]} />
      <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Welcome, {username}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create a Room</TabsTrigger>
              <TabsTrigger value="join">Join a Room</TabsTrigger>
            </TabsList>
            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create a New Room</CardTitle>
                  <CardDescription>Set up a new interactive session for your participants.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/host/create-room">
                    <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Start Creating
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="join">
              <Card>
                <CardHeader>
                  <CardTitle>Join an Existing Room</CardTitle>
                  <CardDescription>Enter the room code to join an interactive session.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="room-code">Room Code</Label>
                    <Input
                      id="room-code"
                      placeholder="Enter the room code"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleJoinRoom}
                    disabled={!roomCode}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Join Room
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Saved Rooms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRooms.map((room) => (
              <Card
                key={room.roomCode}
                className="hover:shadow-lg transition-all duration-200 border-2 hover:border-indigo-500"
              >
                <CardHeader>
                  <CardTitle>{room.roomName}</CardTitle>
                  <CardDescription>Code: {room.roomCode}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                      Polls: {room.content.filter((item) => item.type === "poll").length}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                      MCQs: {room.content.filter((item) => item.type === "mcq").length}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <div className="flex justify-between w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/host/create-room?edit=${room.roomCode}`)}
                      className="flex-1 mr-2"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/host/create-room?preview=${room.roomCode}`)}
                      className="flex-1 ml-2"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                  <Button
                    variant="default"
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                    onClick={() => router.push(`/host/room/${room.roomCode}`)}
                  >
                    Present <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

