"use client";

import { useState } from "react";
import ThemeToggle from "./components/ThemeToggle";

export default function Home() {
  const [pin, setPin] = useState("");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 6) {
      console.log("Joining room:", pin);
    }
  };

  return (
    <main className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem 2rem' }}>
      <div style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 100 }}>
        <ThemeToggle />
      </div>
      
      {/* Background Decorative Elemets */}
      <div className="floating" style={{ position: 'fixed', top: '10%', left: '5%', width: '300px', height: '300px', background: 'var(--accent-glow)', filter: 'blur(100px)', borderRadius: '50%', zIndex: -1, opacity: 0.6 }}></div>
      <div className="floating" style={{ position: 'fixed', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(56, 189, 248, 0.1)', filter: 'blur(120px)', borderRadius: '50%', zIndex: -1, opacity: 0.5, animationDelay: '-3s' }}></div>

      {/* Hero Content */}
      <div style={{ textAlign: 'center', marginBottom: '5rem', position: 'relative' }}>
        <h1 className="neon-text" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', marginBottom: '1.5rem', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
          SUMA
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontWeight: 300, letterSpacing: '0.05em' }}>
          THE NEXT GENERATION OF LIVE ENGAGEMENT. <br />
          <span style={{ opacity: 0.8 }}>BRIDGING THE GAP BETWEEN STAGE AND AUDIENCE AT SCALE.</span>
        </p>
      </div>

      {/* Action Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', width: '100%', maxWidth: '1000px', position: 'relative' }}>
        
        {/* Participant Entrance */}
        <div className="glass" style={{ padding: '3rem', borderRadius: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Join Event</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 300 }}>Enter your unique 6-digit access code to join the live session.</p>
          </div>
          
          <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="------" 
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.toUpperCase())}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  border: '1px solid var(--glass-border)',
                  background: 'rgba(0,0,0,0.05)',
                  color: 'var(--text-primary)',
                  fontSize: '2rem',
                  textAlign: 'center',
                  letterSpacing: '0.75rem',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                className="pin-input"
              />
              <style jsx>{`
                .pin-input:focus {
                  border-color: var(--accent-primary);
                  box-shadow: var(--neon-glow);
                  background: rgba(255,255,255,0.02);
                }
              `}</style>
            </div>
            <button 
              className="btn btn-primary" 
              type="submit" 
              disabled={pin.length !== 6}
              style={{ width: '100%', fontSize: '1.1rem', padding: '1.25rem' }}
            >
              Enter Room
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </form>
        </div>

        {/* Host/Creator Entrance */}
        <div className="glass" style={{ padding: '3rem', borderRadius: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.75rem' }}>Host Session</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.7 }}>
              Ready to take command? Initialize a new session, broadcast slides, and capture real-time sentiment from 1-1,000,000+ users.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              {['Live Polls', 'Quizzes', 'Q&A', 'Analytics'].map(tag => (
                <span key={tag} style={{ fontSize: '0.7rem', padding: '0.25rem 0.75rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', borderRadius: '100px', fontWeight: 600, border: '1px solid rgba(99, 102, 241, 0.2)' }}>{tag}</span>
              ))}
            </div>
          </div>
          
          <button className="btn btn-secondary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>
            Create New Room
          </button>
        </div>

      </div>

      {/* Interactive Reactions Bar (Subtle Floating Animation) */}
      <div className="glass" style={{ position: 'fixed', bottom: '3rem', padding: '0.75rem 2rem', borderRadius: '100px', display: 'flex', gap: '2rem', opacity: 0.9 }}>
        {['👍', '🔥', '😮', '👏', '❤️'].map((emoji, i) => (
          <span 
            key={i} 
            className="floating" 
            style={{ 
              fontSize: '1.5rem', 
              cursor: 'pointer', 
              animationDelay: `${i * 0.5}s`,
              transition: 'transform 0.2s ease'
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </main>
  );
}
