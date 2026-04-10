import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Zap } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass px-8 py-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-accent-primary" fill="currentColor" />
          <span className="font-display font-bold text-xl tracking-tighter">SUMA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-medium hover:text-accent-primary transition-colors">Features</a>
          <a href="#about" className="text-sm font-medium hover:text-accent-primary transition-colors">About</a>
          <a href="#action" className="text-sm font-medium hover:text-accent-primary transition-colors">Join Class</a>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a 
            href="#action" 
            className="hidden sm:inline-flex px-6 py-2 rounded-xl bg-accent-primary text-white text-sm font-semibold hover:brightness-110 transition-all"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
