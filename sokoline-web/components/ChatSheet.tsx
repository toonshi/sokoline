"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { MessageCircle, X, Send, Loader2, Sparkles, User, Bot, ShoppingBag } from "lucide-react";
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
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 h-16 w-16 bg-sokoline-accent text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 group"
      >
        <MessageCircle size={28} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sokoline-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-sokoline-accent border-2 border-white"></span>
        </span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-full max-w-md bg-background border-l border-border shadow-2xl z-[100] flex flex-col animate-in slide-in-from-right duration-500">
          {/* Header */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-sokoline-accent/5">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-2xl bg-sokoline-accent flex items-center justify-center text-white">
                 <Sparkles size={20} />
               </div>
               <div>
                 <h2 className="text-lg font-black uppercase tracking-tight">Sokoline AI</h2>
                 <p className="text-[10px] font-bold text-sokoline-accent uppercase tracking-widest">Active Assistant</p>
               </div>
             </div>
             <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
               <X size={20} />
             </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-muted flex items-center justify-center text-zinc-400">
                    <Bot size={32} />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">How can I help?</h3>
                  <p className="text-muted-foreground text-sm font-medium max-w-[240px]">
                    Ask me about products, shops, or how to checkout with M-Pesa.
                  </p>
               </div>
             )}
             
             {messages.map((m) => (
               <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                    m.role === 'user' ? 'bg-zinc-100 text-zinc-500' : 'bg-sokoline-accent/10 text-sokoline-accent'
                  }`}>
                    {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`flex flex-col gap-2 max-w-[80%] ${m.role === 'user' ? 'items-end' : ''}`}>
                    <div className={`p-4 rounded-[24px] text-sm font-medium leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-foreground text-background rounded-tr-none' 
                        : 'bg-muted/50 text-foreground rounded-tl-none border border-border'
                    }`}>
                      {(m as any).content}
                    </div>
                    
                    {/* Tool Results Rendering */}
                    {(m as any).toolInvocations?.map((toolInvocation: any) => {
                      const { toolName, toolCallId, state } = toolInvocation;
                      if (state === 'result') {
                        if (toolName === 'searchProducts') {
                          return (
                            <div key={toolCallId} className="space-y-2 mt-2">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Found these products:</p>
                               <div className="flex gap-2 overflow-x-auto pb-2">
                                 {toolInvocation.result.slice(0, 3).map((p: any) => (
                                   <Link 
                                     key={p.id} 
                                     href={`/products/${p.slug}`}
                                     className="flex items-center gap-2 p-2 bg-background border border-border rounded-xl shrink-0 hover:border-sokoline-accent transition-all"
                                   >
                                     <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-zinc-400">
                                       <ShoppingBag size={14} />
                                     </div>
                                     <span className="text-xs font-bold truncate max-w-[100px]">{p.name}</span>
                                   </Link>
                                 ))}
                               </div>
                            </div>
                          );
                        }
                      }
                      return null;
                    })}
                  </div>
               </div>
             ))}
             {isLoading && (
               <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-xl bg-sokoline-accent/10 text-sokoline-accent flex items-center justify-center">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                  <div className="bg-muted/50 border border-border rounded-[24px] rounded-tl-none p-4 w-12 flex justify-center">
                    <div className="flex gap-1">
                      <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-1.5 w-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
               </div>
             )}
          </div>

          {/* Footer Input */}
          <div className="p-6 border-t border-border bg-muted/20">
             <form onSubmit={handleSubmitForm} className="relative">
               <input 
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 placeholder="Type your question..."
                 className="w-full bg-background border border-border rounded-[24px] py-4 pl-6 pr-14 font-medium outline-none focus:ring-2 focus:ring-sokoline-accent shadow-sm transition-all"
               />
               <button 
                 type="submit"
                 disabled={!inputValue.trim() || isLoading}
                 className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-sokoline-accent text-white rounded-full flex items-center justify-center hover:bg-sokoline-accent-hover transition-all disabled:opacity-50"
               >
                 <Send size={18} />
               </button>
             </form>
             <p className="mt-4 text-[9px] text-zinc-400 uppercase tracking-widest text-center font-bold">
               Powered by Sokoline AI • Campus Support
             </p>
          </div>
        </div>
      )}
    </>
  );
}
