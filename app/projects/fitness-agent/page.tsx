"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { Send, ArrowLeft, Activity, Flame, Timer } from 'lucide-react';

export default function FitnessAgentPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '你好！我是 Iron Press 教练。今天状态如何？我们要练哪里？' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // 模拟 AI 回复 (之后我们会替换成真的 API)
    setTimeout(() => {
      const aiMsg = { role: 'assistant', content: '收到。根据你的输入，建议今天进行高强度间歇训练。' };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white font-sans selection:bg-green-500 selection:text-black">
      <Script src="https://cdn.tailwindcss.com" />
      
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-neutral-900/50 backdrop-blur-md sticky top-0 z-20">
        <Link href="/" className="p-2 -ml-2 text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex flex-col items-center">
          <span className="text-sm font-bold tracking-wide">IRON PRESS</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-green-500 font-mono uppercase">Online</span>
          </div>
        </div>
        <div className="w-8"></div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-neutral-800 text-neutral-200 border border-white/5 rounded-tl-none'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
            <div className="flex justify-start">
                <div className="bg-neutral-800 border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-neutral-950 border-t border-white/10">
        <div className="relative flex items-center gap-2 max-w-screen-xl mx-auto">
            <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask about workout..."
                className="w-full bg-neutral-900 text-white placeholder-neutral-500 border border-neutral-800 rounded-full py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
            />
            <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-2 p-2 bg-green-600 text-white rounded-full hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 transition-all"
            >
                <Send size={18} />
            </button>
        </div>
      </footer>
    </div>
  );
}
