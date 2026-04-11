"use client";

import { useState } from "react";
import { 
  ArrowRight, 
  Users, 
  Zap, 
  BarChart3, 
  ShieldCheck, 
  Share2, 
  Trophy 
} from "lucide-react";
import Navbar from "./components/Navbar";
import FeatureCard from "./components/FeatureCard";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const [pin, setPin] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) {
      window.location.href = `/room/${pin}`;
    }
  };

  const handleHostInit = () => {
    if (user) {
      router.push("/host/dashboard");
    } else {
      router.push("/login?next=/host/dashboard");
    }
  };

  return (
    <div className="relative min-h-screen Selection:bg-accent-primary/30">
      <Navbar />
      
      {/* Background Decorative Blobs */}
      <div
        className="fixed top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full -z-10 opacity-30 animate-pulse-glow"
        style={{ background: 'var(--accent-glow)', filter: 'blur(150px)' }}
      />
      <div
        className="fixed bottom-[-5%] left-[-5%] w-[500px] h-[500px] rounded-full -z-10 opacity-20 animate-pulse-glow"
        style={{ background: 'rgba(56, 189, 248, 0.2)', filter: 'blur(120px)', animationDelay: '-3s' }}
      />

      <main>
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 px-8 flex flex-col items-center justify-center min-h-[90vh]">
          <div className="absolute inset-0 -z-20 overflow-hidden">
             <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] absolute inset-0 opacity-[0.03] pointer-events-none">
                {Array.from({ length: 400 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-text-primary" />
                ))}
             </div>
          </div>

          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-semibold text-accent-primary mb-8 tracking-widest uppercase">
              <Zap className="w-3 h-3 fill-current" /> Scalable to 1,000,000+ Concurrent Users
            </span>
            
            <h1 className="font-display text-6xl md:text-8xl mb-8 leading-[1.1] tracking-tight">
              Bridge the Gap <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary animate-gradient-shift bg-[length:200%_auto]">
                Stage to Audience
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-text-secondary font-light max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide">
              The next generation of live engagement. Unified documentation, 
              real-time collaboration, and audience sentiment at scale.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a href="#action" className="btn btn-primary w-full sm:w-auto px-10 py-5 text-lg group">
                Enter a Room <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button 
                className="btn btn-secondary w-full sm:w-auto px-10 py-5 text-lg"
                onClick={handleHostInit}
              >
                Start as Host
              </button>
            </div>
          </div>
        </section>

        {/* ABOUT / STATS SECTION */}
        <section id="about" className="py-24 px-8 bg-black/[0.02] border-y border-glass-border">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-slide-up">
                <h2 className="text-4xl md:text-5xl font-display mb-8">Humanizing Digital Interaction at Scale.</h2>
                <p className="text-lg text-text-secondary font-light mb-8 leading-relaxed">
                  Traditional webinar tools break when thousands join. SUMA is built on a nervous system 
                  of managed WebSockets, ensuring every emoji burst, slide transition, and poll vote 
                  is broadcasted instantly without overloading the host.
                </p>
                <div className="grid grid-cols-2 gap-8 mt-12">
                  <div>
                    <div className="text-4xl font-display text-accent-primary mb-2">1M+</div>
                    <div className="text-sm text-text-secondary uppercase tracking-widest font-semibold font-body">Participants</div>
                  </div>
                  <div>
                    <div className="text-4xl font-display text-accent-secondary mb-2">&lt;100ms</div>
                    <div className="text-sm text-text-secondary uppercase tracking-widest font-semibold font-body">Latencies</div>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="aspect-video glass rounded-3xl overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/20 via-transparent to-accent-secondary/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 animate-pulse">
                      <Zap className="w-8 h-8 text-white" fill="white" />
                    </div>
                  </div>
                  {/* Decorative Elements inside the card */}
                  <div className="absolute bottom-8 left-8 flex gap-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="w-12 h-1.5 rounded-full bg-white/20" />
                    ))}
                  </div>
                </div>
                {/* Floating Stats Card */}
                <div className="absolute -bottom-8 -right-8 glass p-6 rounded-2xl hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">98% Engagement</div>
                      <div className="text-xs text-text-secondary">Average Session Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-32 px-8">
          <div className="max-w-7xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-display mb-6">Designed for Engagement</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-light">
              Every feature is obsessed with one goal: bridging the distance between the stage and the back of the room.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Share2}
              title="Zero-Switch Sharing"
              description="Participants screen follows the host natively. Support for PDF and slide transitions with global sync."
              delay="0.1s"
            />
            <FeatureCard 
              icon={Trophy}
              title="Gamified Quizzes"
              description="Live leaderboards with streak multipliers. Real-time visuals for bar charts and word clouds."
              delay="0.2s"
            />
            <FeatureCard 
              icon={Users}
              title="Massive Scaling"
              description="Optimized to handle up to 1 million users simultaneously using high-performance WebSocket channels."
              delay="0.3s"
            />
            <FeatureCard 
              icon={ShieldCheck}
              title="AI Moderation"
              description="Real-time sentiment analysis and toxicity detection ensures a safe community for all participants."
              delay="0.4s"
            />
            <FeatureCard 
              icon={Zap}
              title="Reaction Bursts"
              description="Thousands of floating emojis populating the screen at once without any UI performance lag."
              delay="0.5s"
            />
            <FeatureCard 
              icon={BarChart3}
              title="Mood Analytics"
              description="Aggregate audience sentiment visualization gives hosts instant feedback on the room's energy."
              delay="0.6s"
            />
          </div>
        </section>

        {/* ACTION / CTA SECTION */}
        <section id="action" className="py-32 px-8">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display mb-6">Join the Session</h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto font-light mb-12">
              Step into the future of live interaction. Enter your code or start hosting.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Join Form */}
            <div className="glass p-12 rounded-3xl flex flex-col gap-8">
              <div>
                <h3 className="text-3xl font-display mb-4">Participant</h3>
                <p className="text-text-secondary font-light">Enter your 6-digit PIN to enter the room.</p>
              </div>

              <form onSubmit={handleJoin} className="flex flex-col gap-6">
                <input 
                  type="text" 
                  placeholder="------" 
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.toUpperCase())}
                  className="pin-input w-full p-6 rounded-2xl border-2 text-4xl text-center tracking-[1rem] font-mono glass outline-none"
                  style={{ borderColor: 'var(--glass-border)' }}
                />
                <button 
                  className="btn btn-primary py-6 text-xl" 
                  disabled={pin.length !== 6}
                >
                  Join Room <ArrowRight className="ml-2 w-6 h-6" />
                </button>
              </form>
            </div>

            {/* Host CTA */}
            <div className="glass p-12 rounded-3xl flex flex-col justify-between items-start gap-8 bg-gradient-to-br from-accent-primary/20 to-transparent">
              <div className="space-y-6">
                <h3 className="text-3xl font-display">Are you the Host?</h3>
                <p className="text-lg text-text-secondary font-light leading-relaxed">
                  Initialize a new session, upload your PDF slides, and start capturing real-time intent.
                </p>
                <div className="flex gap-2 flex-wrap pt-4">
                  {['Admin Controls', 'Analytics', 'Moderation'].map(t => (
                    <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent-primary">{t}</span>
                  ))}
                </div>
              </div>

              <button 
                className="btn btn-secondary py-6 px-12 text-xl w-full"
                onClick={handleHostInit}
              >
                {user ? "Enter Host Dashboard" : "Initialize Host Mode"}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-8 border-t border-glass-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent-primary" fill="currentColor" />
            <span className="font-display font-bold text-xl tracking-tighter">SUMA</span>
          </div>
          <div className="text-text-secondary text-sm font-light">
            © 2026 SUMA. Bridging the gap between 1 and 1,000,000.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Privacy</a>
            <a href="#" className="text-text-secondary hover:text-accent-primary transition-colors">Terms</a>
            <a href="https://github.com/hanvithSai/suma" className="text-text-secondary hover:text-accent-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
