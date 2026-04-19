"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageSquare, X, Send, Loader2, Sparkles, User, Bot, ShoppingBag, Minus } from "lucide-react";
import Link from "next/link";

export default function ChatSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, status } = useChat();
  
  const isLoading = status === 'streaming';

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage({
        role: "user",
        content: inputValue.trim()
      } as any);
      setInputValue("");
    }
  };

  return (
    <>
      {/* Floating Support Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-800 transition-all z-50"
      >
        <MessageSquare size={20} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-[360px] h-[520px] bg-white border border-zinc-200 rounded-xl shadow-2xl z-[100] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 bg-zinc-900 flex justify-between items-center text-white">
             <div className="flex items-center gap-2.5">
               <div className="h-7 w-7 rounded-md bg-white/10 flex items-center justify-center">
                 <Sparkles size={14} className="text-white" />
               </div>
               <div>
                 <h2 className="text-sm font-semibold tracking-tight">Sokoline Support</h2>
                 <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    <span className="text-[10px] font-medium text-zinc-400">AI Assistant Online</span>
                 </div>
               </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors">
               <X size={18} />
             </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-zinc-50/30">
             {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200">
                    <Bot size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900">How can we help today?</h3>
                  <p className="text-zinc-500 text-xs leading-normal">
                    Ask about orders, products, or payment status. Our AI is here to guide you.
                  </p>
               </div>
             )}
             
             {messages.map((m) => (
               <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-6 w-6 rounded flex items-center justify-center shrink-0 mt-1 ${
                    m.role === 'user' ? 'bg-zinc-200 text-zinc-600' : 'bg-zinc-900 text-white'
                  }`}>
                    {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`flex flex-col gap-1.5 max-w-[85%] ${m.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`px-4 py-2.5 rounded-lg text-xs leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-sokoline-accent text-white rounded-tr-none shadow-sm' 
                        : 'bg-white text-zinc-800 rounded-tl-none border border-zinc-200 shadow-sm'
                    }`}>
                      {(m as any).content}
                    </div>
                    
                    {/* Tool Results Rendering */}
                    {(m as any).toolInvocations?.map((toolInvocation: any) => {
                      const { toolName, toolCallId, state } = toolInvocation;
                      if (state === 'result' && toolName === 'searchProducts') {
                        return (
                          <div key={toolCallId} className="w-full space-y-2 mt-1">
                             <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-tight">Suggested products:</p>
                             <div className="space-y-1.5">
                               {toolInvocation.result.slice(0, 2).map((p: any) => (
                                 <Link 
                                   key={p.id} 
                                   href={`/products/${p.slug}`}
                                   className="flex items-center gap-2.5 p-2 bg-white border border-zinc-200 rounded-md hover:border-zinc-300 hover:shadow-sm transition-all group"
                                 >
                                   <div className="h-8 w-8 rounded bg-zinc-50 flex items-center justify-center text-zinc-300 border border-zinc-100 shrink-0">
                                     <ShoppingBag size={14} />
                                   </div>
                                   <span className="text-[11px] font-medium text-zinc-700 truncate group-hover:text-sokoline-accent">{p.name}</span>
                                 </Link>
                               ))}
                             </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex gap-3">
                  <div className="h-6 w-6 rounded bg-zinc-900 text-white flex items-center justify-center mt-1">
                    <Loader2 size={12} className="animate-spin" />
                  </div>
                  <div className="bg-white border border-zinc-200 rounded-lg rounded-tl-none px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <div className="h-1 w-1 bg-zinc-300 rounded-full animate-pulse"></div>
                      <div className="h-1 w-1 bg-zinc-300 rounded-full animate-pulse [animation-delay:200ms]"></div>
                      <div className="h-1 w-1 bg-zinc-300 rounded-full animate-pulse [animation-delay:400ms]"></div>
                    </div>
                  </div>
               </div>
             )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-zinc-200">
             <form onSubmit={handleSubmitForm} className="relative">
               <input 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="How can we help?"
                 className="w-full bg-zinc-100 border border-transparent rounded-md py-2.5 pl-4 pr-10 text-xs focus:bg-white focus:border-zinc-300 outline-none transition-all placeholder:text-zinc-500"
               />
               <button 
                 type="submit"
                 disabled={!inputValue.trim() || isLoading}
                 className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-zinc-400 hover:text-zinc-900 transition-colors disabled:opacity-30"
               >
                 <Send size={14} />
               </button>
             </form>
             <div className="mt-3 flex items-center justify-center gap-1.5 opacity-40">
                <div className="h-px flex-1 bg-zinc-300" />
                <span className="text-[9px] font-semibold text-zinc-600 uppercase tracking-tighter">AI Support Powered by Sokoline</span>
                <div className="h-px flex-1 bg-zinc-300" />
             </div>
          </div>
        </div>
      )}
    </>
  );
}
