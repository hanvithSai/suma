import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay = "0s" }) => {
  return (
    <div 
      className="glass p-8 rounded-3xl flex flex-col gap-4 group animate-slide-up"
      style={{ animationDelay: delay }}
    >
      <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-display mt-2">{title}</h3>
      <p className="text-text-secondary font-light leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
