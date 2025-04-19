import Header from "@/app/comp/Header"
import Footer from "@/app/comp/Footer"
import HeroSection from "@/app/landing/HeroSection"
import FeaturesSection from "@/app/landing/FeaturesSection"
import HowItWorksSection from "@/app/landing/HowItWorksSection"
import { AuthProvider } from "@/app/auth/auth-context"

export default function LandingPage() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header showNavLinks={true} />
        <main className="flex-grow">
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

