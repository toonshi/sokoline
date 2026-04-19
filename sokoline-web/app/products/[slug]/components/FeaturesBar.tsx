import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

interface FeaturesBarProps {
  className?: string;
  hasFreeShipping?: boolean;
  hasFreeReturns?: boolean;
  hasSafetyCertification?: boolean;
}

const FeaturesBar = ({
  className = "grid-cols-1",
  hasFreeShipping = false,
  hasFreeReturns = false
}: FeaturesBarProps) => {
  const features = [
    { 
      title: "Secure checkout", 
      desc: "Encrypted M-Pesa",
      icon: Lock 
    },
    { 
      title: "Fast Delivery", 
      desc: hasFreeShipping ? "Free" : "Campus pickup",
      icon: Truck 
    },
    { 
      title: "Return Policy", 
      desc: hasFreeReturns ? "2-day returns" : "Final sale",
      icon: RotateCcw 
    },
    { 
      title: "Verified", 
      desc: "Student venture",
      icon: ShieldCheck 
    }
  ];

  return (
    <div className={`grid gap-4 ${className}`}>
      {features.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white border border-gray-200 text-teal-500 shadow-sm">
            <item.icon size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {item.title}
            </p>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturesBar;
