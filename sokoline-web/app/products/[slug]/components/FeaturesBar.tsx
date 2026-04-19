import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock, Clock } from "lucide-react";

interface FeaturesBarProps {
  className?: string;
  hasFreeShipping?: boolean;
  hasFreeReturns?: boolean;
  hasSafetyCertification?: boolean;
}

const FeaturesBar = ({
  className = "grid-cols-1",
  hasFreeShipping = false,
  hasFreeReturns = false,
  hasSafetyCertification = false
}: FeaturesBarProps) => {
  const features = [
    { 
      title: "Secure checkout", 
      desc: "Encrypted M-Pesa transactions",
      enabled: true, 
      icon: Lock 
    },
    { 
      title: "Fast Delivery", 
      desc: hasFreeShipping ? "Free campus-wide delivery" : "Pick up at designated points",
      enabled: true, 
      icon: Truck 
    },
    { 
      title: "Return Policy", 
      desc: hasFreeReturns ? "Free 2-day returns" : "Final sale unless defective",
      enabled: true, 
      icon: RotateCcw 
    },
    { 
      title: "Verified Student Venture", 
      desc: "Trusted campus entrepreneur",
      enabled: true, 
      icon: ShieldCheck 
    }
  ];

  return (
    <div className={`grid gap-5 ${className}`}>
      {features.map((item, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-600 shadow-sm">
            <item.icon size={16} strokeWidth={2} />
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-900 leading-none">
              {item.title}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-tight">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturesBar;
