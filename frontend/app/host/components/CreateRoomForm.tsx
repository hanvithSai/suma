"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/app/components/ui/card";
import { Breadcrumb } from "@/app/comp/Breadcrumb";
import {
  FileQuestion,
  Timer,
  Layout,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import PollCreator from "./PollCreator";
import MCQCreator from "./MCQCreator";
import PreviewAndArrange from "./PreviewAndArrange";
import { Skeleton } from "@/app/components/ui/skeleton";

type ContentItem = {
  id: string;
  type: "poll" | "mcq";
  question: string;
  options: string[];
  correctOption?: number;
  timer?: number;
};

export default function CreateRoomForm() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [content, setContent] = useState<ContentItem[]>([]);
  const [activeSection, setActiveSection] = useState<
    "none" | "poll" | "mcq" | "preview"
  >("none");
  const [standardTimer, setStandardTimer] = useState(30);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const loadRoom = useCallback(
    (roomCode: string) => {
      try {
        const savedRooms = JSON.parse(
          localStorage.getItem("savedRooms") || "[]"
        );
        const room = savedRooms.find((r) => r.roomCode === roomCode);
        if (room) {
          setRoomName(room.roomName);
          setRoomCode(room.roomCode);
          setContent(room.content);
          setStandardTimer(room.standardTimer || 30);
          setError(null);
        } else {
          setError("Room not found");
          router.push("/host/create-room");
        }
      } catch (err) {
        setError("Failed to load room");
        router.push("/host/create-room");
      }
      setIsLoaded(true);
    },
    [router]
  );

  useEffect(() => {
    const editRoomCode = searchParams.get("edit");
    const previewRoomCode = searchParams.get("preview");

    if ((editRoomCode || previewRoomCode) && !isLoaded) {
      loadRoom(editRoomCode || previewRoomCode!);
      setActiveSection(previewRoomCode ? "preview" : "none");
    } else {
      setIsLoaded(true);
    }
  }, [searchParams, loadRoom, isLoaded]);

  const generateUniqueRoomCode = () => {
    const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]");
    let generatedCode;
    do {
      generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (savedRooms.some((room) => room.roomCode === generatedCode));
    return generatedCode;
  };

  const handleCreateRoom = () => {
    const trimmedName = roomName.trim();
    if (!trimmedName) {
      setError("Room name cannot be empty");
      return;
    }
    setRoomName(trimmedName);
    setError(null);
    setRoomCode(generateUniqueRoomCode());
  };

  const handleAddContent = (newItem: ContentItem) => {
    setContent((prevContent) => [...prevContent, newItem]);
  };

  const handleUpdateContent = (updatedContent: ContentItem[]) => {
    setContent(updatedContent);
  };

  const handleSaveRoom = () => {
    const savedRooms = JSON.parse(localStorage.getItem("savedRooms") || "[]");
    const roomIndex = savedRooms.findIndex((r) => r.roomCode === roomCode);
    const updatedRoom = { roomName, roomCode, content, standardTimer };

    if (roomIndex !== -1) {
      savedRooms[roomIndex] = updatedRoom;
    } else {
      savedRooms.push(updatedRoom);
    }

    localStorage.setItem("savedRooms", JSON.stringify(savedRooms));
    router.push("/dashboard");
  };

  const handlePresentRoom = () => {
    router.push(`/host/room/${roomCode}`);
  };

  useEffect(() => {
    return () => {
      // Clean up any unsaved changes when component unmounts
      setContent([]);
      setActiveSection("none");
      setError(null);
    };
  }, []);

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Create Room", href: "/host/create-room" },
          ]}
        />
        <div className="space-y-4 mt-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
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
        <h1 className="text-3xl font-bold text-white mt-4 mb-6">
          Create a New Room
        </h1>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">Room Details</CardTitle>
            <CardDescription className="text-gray-400">
              Name your room to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="room-name" className="text-gray-200">
                Room Name
              </Label>
              <Input
                id="room-name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter a name for your room"
                className="text-lg bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateRoom}
              disabled={!roomName}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white transition-all duration-200"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Room
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Create Room", href: "/host/create-room" },
        ]}
      />
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="mt-4 mb-6">
        <div className="flex items-center justify-between bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800">
          <div>
            <h1 className="text-3xl font-bold text-white">{roomName}</h1>
            <p className="text-gray-400 mt-1">Room Code: {roomCode}</p>
          </div>
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400">
                {content.filter((item) => item.type === "poll").length}
              </div>
              <div className="text-sm text-gray-400">Polls</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-400">
                {content.filter((item) => item.type === "mcq").length}
              </div>
              <div className="text-sm text-gray-400">MCQs</div>
            </div>
          </div>
        </div>
      </div>

      {activeSection === "none" && (
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="text-white">Add Content</CardTitle>
            <CardDescription className="text-gray-400">
              Choose the type of content to add to your room.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Button
                onClick={() => setActiveSection("poll")}
                variant="outline"
                className="h-32 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 hover:text-white border-gray-700 bg-gray-800 text-gray-300 transition-all duration-200"
              >
                <FileQuestion className="h-8 w-8" />
                <span className="text-lg">Create Poll</span>
              </Button>
            </div>
            <div>
              <Button
                onClick={() => setActiveSection("mcq")}
                variant="outline"
                className="h-32 w-full flex flex-col items-center justify-center space-y-2 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-700 hover:text-white border-gray-700 bg-gray-800 text-gray-300 transition-all duration-200"
              >
                <Timer className="h-8 w-8" />
                <span className="text-lg">Create MCQ</span>
              </Button>
            </div>
            {content.length > 0 && (
              <div className="mt-4 flex justify-center md:col-span-2">
                <Button
                  onClick={() => setActiveSection("preview")}
                  className="bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white transition-all duration-200"
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
            handleAddContent({ ...poll, type: "poll" });
            setActiveSection("none");
          }}
          onBack={() => setActiveSection("none")}
        />
      )}

      {activeSection === "mcq" && (
        <MCQCreator
          onAddMCQ={(mcq) => {
            handleAddContent({ ...mcq, type: "mcq" });
            setActiveSection("none");
          }}
          onBack={() => setActiveSection("none")}
          isFirstMCQ={
            content.filter((item) => item.type === "mcq").length === 0
          }
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
  );
}
