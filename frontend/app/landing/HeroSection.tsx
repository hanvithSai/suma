"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { isLoggedIn } from "@/app/utils/auth";
import { useRouter } from "next/navigation";
import { Users, PlusCircle } from "lucide-react";

export default function HeroSection() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setUserLoggedIn(isLoggedIn());
  }, []);

  const handleCreateRoom = () => {
    if (userLoggedIn) {
      router.push("/host/create-room");
    } else {
      router.push("/login?action=create");
    }
  };

  const handleJoinRoom = () => {
    if (userLoggedIn) {
      router.push("/dashboard?action=join");
    } else {
      router.push("/login?action=join");
    }
  };

  return (
    <div className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">
                  Enhance interactivity with
                </span>{" "}
                <span className="block text-indigo-600 xl:inline">SUMA</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Create engaging rooms, conduct polls, and ask multiple-choice
                questions in real-time. Perfect for hosts and participants
                alike.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button
                    onClick={handleCreateRoom}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create a Room
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button
                    variant="outline"
                    onClick={handleJoinRoom}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 md:py-4 md:text-lg md:px-10 transition-all duration-200"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    Join a Room
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="/placeholder.svg?height=600&width=800"
          alt="SUMA interactive session"
        />
      </div>
    </div>
  );
}
