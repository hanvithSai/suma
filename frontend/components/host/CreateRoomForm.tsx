"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Breadcrumb } from "@/components/Breadcrumb"
import { FileQuestion, Timer, Layout, PlusCircle } from "lucide-react"
import PollCreator from "./PollCreator"
import MCQCreator from "./MCQCreator"
import PreviewAndArrange from "./PreviewAndArrange"

type ContentItem = {
  id: string
  type: "poll" | "mcq"
  question: string
  options: string[]
  correctOption?: number
  timer?: number
}

export default function CreateRoomForm() {
  const [roomName, setRoomName] = useState("")
  const [roomCode, setRoomCode] = useState("")
  const [content, setContent] = useState<ContentItem[]>([])
  const [activeSection, setActiveSection] = useState<"none" | "poll" | "mcq" | "preview">("none")
  const [standardTimer, setStandardTimer] = useState(30)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const loadRoom = useCallback((roomCode: string) => {
    const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
    const room = savedRooms.find((r) => r.roomCode === roomCode)
    if (room) {
      setRoomName(room.roomName)
      setRoomCode(room.roomCode)
      setContent(room.content)
      setStandardTimer(room.standardTimer || 30)
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    const editRoomCode = searchParams.get("edit")
    const previewRoomCode = searchParams.get("preview")

    if ((editRoomCode || previewRoomCode) && !isLoaded) {
      loadRoom(editRoomCode || previewRoomCode)
      setActiveSection(previewRoomCode ? "preview" : "none")
    }
  }, [searchParams, loadRoom, isLoaded])

  const handleCreateRoom = () => {
    const generatedRoomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(generatedRoomCode)
  }

  const handleAddContent = (newItem: ContentItem) => {
    setContent((prevContent) => [...prevContent, newItem])
  }

  const handleUpdateContent = (updatedContent: ContentItem[]) => {
    setContent(updatedContent)
  }

  const handleSaveRoom = () => {
    const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
    const roomIndex = savedRooms.findIndex((r) => r.roomCode === roomCode)
    const updatedRoom = { roomName, roomCode, content, standardTimer }

    if (roomIndex !== -1) {
      savedRooms[roomIndex] = updatedRoom
    } else {
      savedRooms.push(updatedRoom)
    }

    localStorage.setItem("savedRooms", JSON.stringify(savedRooms))
    router.push("/dashboard")
  }

  const handlePresentRoom = () => {
    router.push(`/host/room/${roomCode}`)
  }

  if (!roomCode) {
    return (
      <div className="max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Create Room", href: "/host/create-room" },
          ]}
        />
        <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-6">Create a New Room</h1>
        <Card>
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
            <CardDescription>Name your room to get started.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter a name for your room"
                className="text-lg"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateRoom}
              disabled={!roomName}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Room
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Create Room", href: "/host/create-room" },
        ]}
      />
      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{roomName}</h1>
            <p className="text-gray-500 mt-1">Room Code: {roomCode}</p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {content.filter((item) => item.type === "poll").length}
              </div>
              <div className="text-sm text-gray-600">Polls</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {content.filter((item) => item.type === "mcq").length}
              </div>
              <div className="text-sm text-gray-600">MCQs</div>
            </div>
          </div>
        </div>
      </div>

      {activeSection === "none" && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setActiveSection("poll")}
                variant="outline"
                className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-200"
              >
                <FileQuestion className="h-8 w-8" />
                <span className="text-lg">Create Poll</span>
              </Button>
              <Button
                onClick={() => setActiveSection("mcq")}
                variant="outline"
                className="h-32 flex flex-col items-center justify-center space-y-2 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white transition-all duration-200"
              >
                <Timer className="h-8 w-8" />
                <span className="text-lg">Create MCQ</span>
              </Button>
            </div>
            {content.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={() => setActiveSection("preview")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                >
                  <Layout className="mr-2 h-4 w-4" />
                  Preview & Arrange ({content.length} items)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeSection === "poll" && (
        <PollCreator
          onAddPoll={(poll) => {
            handleAddContent({ ...poll, type: "poll" })
            setActiveSection("none")
          }}
          onBack={() => setActiveSection("none")}
        />
      )}

      {activeSection === "mcq" && (
        <MCQCreator
          onAddMCQ={(mcq) => {
            handleAddContent({ ...mcq, type: "mcq" })
            setActiveSection("none")
          }}
          onBack={() => setActiveSection("none")}
          isFirstMCQ={content.filter((item) => item.type === "mcq").length === 0}
          standardTimer={standardTimer}
          onSetStandardTimer={setStandardTimer}
        />
      )}

      {activeSection === "preview" && (
        <PreviewAndArrange
          content={content}
          onUpdateContent={handleUpdateContent}
          onBack={() => setActiveSection("none")}
          onSave={handleSaveRoom}
          onPresent={handlePresentRoom}
        />
      )}
    </div>
  )
}

