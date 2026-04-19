"use client";

import React, { useState } from 'react';
import { Plus } from "lucide-react";

const faqData = [
  {
    question: "When will I receive my campus order?",
    answer: "Since all our vendors are students, deliveries usually happen between classes or in the evenings. You can coordinate a pickup point via the vendor's shop contact after checkout."
  },
  {
    question: "How do M-Pesa payments work?",
    answer: "We use the Daraja API. When you confirm your purchase, you will receive an STK push on your phone to complete the transaction securely."
  },
  {
    question: "Is this platform safe?",
    answer: "Yes. Every shop on Sokoline is campus-verified. We act as a trusted intermediary, holding payments until delivery is confirmed by both parties."
  }
];

const FAQItem = ({ faq }: { faq: { question: string; answer: string } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-200 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="text-sm font-semibold text-zinc-900 group-hover:text-sokoline-accent transition-colors">{faq.question}</span>
        <Plus className={`text-sokoline-accent transform transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} size={20} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-60 pb-5' : 'max-h-0'}`}>
        <p className="text-sm text-zinc-600 leading-relaxed max-w-xl">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 bg-white transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-3 leading-none">FAQs</h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            Quick answers about shopping and selling on the campus marketplace.
          </p>
        </div>
        
        <div className="md:col-span-2">
          {faqData.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
