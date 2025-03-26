"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Header from "@/app/comp/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/ui/card"
import { Button } from "@/app/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/ui/tabs"
import { ScrollArea } from "@/app/ui/scroll-area"
import { ChevronLeft, ChevronRight, BarChart2, MessageSquare } from "lucide-react"

export default function HostRoomView() {
  const params = useParams()
  const roomCode = params.roomCode as string
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [room, setRoom] = useState<any>(null)

  useEffect(() => {
    // Load room data from localStorage
    const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]")
    const currentRoom = savedRooms.find((r) => r.roomCode === roomCode)
    if (currentRoom) {
      setRoom(currentRoom)
    }
  }, [roomCode])

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header showNavLinks={false} />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading room...</h1>
        </div>
      </div>
    )
  }

  const currentItem = room.content[currentItemIndex]
  const totalItems = room.content.length

  const goToNextItem = () => {
    if (currentItemIndex < totalItems - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
    }
  }

  const goToPreviousItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header showNavLinks={false} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{room.roomName}</h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="font-medium">Room Code: </span>
            <span className="text-indigo-600 font-bold">{room.roomCode}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{currentItem.type === "poll" ? "Poll" : "Multiple Choice Question"}</CardTitle>
                  <div className="text-sm text-gray-500">
                    {currentItemIndex + 1} of {totalItems}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">{currentItem.question}</h2>
                  <div className="space-y-3">
                    {currentItem.options.map((option, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span>{option}</span>
                        {currentItem.type === "mcq" && index === currentItem.correctOption && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                            Correct
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={goToPreviousItem} disabled={currentItemIndex === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button onClick={goToNextItem} disabled={currentItemIndex === totalItems - 1}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Tabs defaultValue="results">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="results">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Results
                </TabsTrigger>
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
                    <div className="space-y-4">
                      {currentItem.options.map((option, index) => {
                        // Generate random percentage for demo
                        const percentage = Math.floor(Math.random() * 100)
                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{option}</span>
                              <span>{percentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-indigo-600 h-2.5 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="chat">
                <Card className="h-[500px] flex flex-col">
                  <CardHeader>
                    <CardTitle>Participant Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-hidden">
                    <ScrollArea className="h-full">
                      <div className="space-y-2">
                        <div className="p-2 rounded bg-gray-50">
                          <span className="font-semibold">Alice: </span>
                          <span>This is really interesting!</span>
                        </div>
                        <div className="p-2 rounded bg-gray-50">
                          <span className="font-semibold">Bob: </span>
                          <span>I have a question about the third option.</span>
                        </div>
                        <div className="p-2 rounded bg-gray-50">
                          <span className="font-semibold">Charlie: </span>
                          <span>Can you explain more about this topic?</span>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

