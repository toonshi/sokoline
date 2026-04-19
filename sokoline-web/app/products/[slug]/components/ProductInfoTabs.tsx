"use client";

import React, { useState } from 'react';
import { Product } from "@/lib/types";

interface ProductInfoTabsProps {
  product: Product;
}

export default function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'returns', label: 'Returns' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      <div className="flex gap-6 border-b border-zinc-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id 
                ? "text-zinc-900" 
                : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sokoline-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'details' && (
          <div className="max-w-none">
            <p className="text-sm text-zinc-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
        
        {activeTab === 'shipping' && (
          <div className="text-sm text-zinc-600 leading-relaxed">
            {product.shipping_info || "Standard shipping applied by the student vendor. Contact the shop for more specific delivery timelines."}
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="text-sm text-zinc-600 leading-relaxed">
            {product.return_policy || "Returns are subject to the vendor's policy. Most student ventures offer exchanges within 7 days of purchase."}
          </div>
        )}
      </div>
    </div>
  );
}
