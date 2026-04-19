import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

interface FeaturesBarProps {
  className?: string;
  hasFreeShipping?: boolean;
  hasFreeReturns?: boolean;
  hasSafetyCertification?: boolean;
}

const FeaturesBar = ({
  className = "grid-cols-2",
  hasFreeShipping = false,
  hasFreeReturns = false,
  hasSafetyCertification = false
}: FeaturesBarProps) => {
  const features = [
    { title: "Secure Payments", enabled: true, icon: Lock },
    { title: "Free Shipping", enabled: hasFreeShipping, icon: Truck },
    { title: "Free Returns", enabled: hasFreeReturns, icon: RotateCcw },
    { title: "Safety Certified", enabled: hasSafetyCertification, icon: ShieldCheck }
  ].filter((feature) => feature.enabled);

  return (
    <div className={`grid gap-y-3 gap-x-4 ${className}`}>
      {features.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-sokoline-accent">
            <item.icon size={14} strokeWidth={2.25} />
          </div>
          <span className="text-xs font-medium text-zinc-700 whitespace-nowrap">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeaturesBar;
