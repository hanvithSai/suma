"use client"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/button"
import { Users, PlusCircle } from "lucide-react"

export default function HeroSection() {
  const router = useRouter()

  const handleCreateRoom = () => {
    router.push("/host/create-room")
  }

  const handleJoinRoom = () => {
    router.push("/dashboard?action=join")
  }

  return (
    <div className="relative overflow-hidden">
      <div className="responsive-container">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-background transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="mt-10 mx-auto px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-foreground sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Enhance interactivity with</span>{" "}
                <span className="block gradient-text xl:inline">SUMA</span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Create engaging rooms, conduct polls, and ask multiple-choice questions in real-time. Perfect for hosts
                and participants alike.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button
                    onClick={handleCreateRoom}
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white gradient-bg md:py-4 md:text-lg md:px-10 transition-all duration-200"
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create a Room
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button
                    variant="outline"
                    onClick={handleJoinRoom}
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md md:py-4 md:text-lg md:px-10 transition-all duration-200"
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
  )
}

