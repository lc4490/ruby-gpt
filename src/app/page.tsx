"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

function PinkBow({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <ellipse cx="11" cy="12" rx="10" ry="8" fill="#ff80ab" stroke="#e91e63" strokeWidth="1.5" />
      <ellipse cx="29" cy="12" rx="10" ry="8" fill="#ff80ab" stroke="#e91e63" strokeWidth="1.5" />
      <circle cx="20" cy="13" r="4" fill="#e91e63" />
      <path d="M16 17 L12 27 L18 21 Z" fill="#ff80ab" stroke="#e91e63" strokeWidth="1" />
      <path d="M24 17 L28 27 L22 21 Z" fill="#ff80ab" stroke="#e91e63" strokeWidth="1" />
    </svg>
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi there! I'm Ruby-GPT, your sparkly pink AI assistant! How can I help you today?",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [parentRole, setParentRole] = useState<"mother" | "father">("mother");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function send() {
    const text = input.trim();
    if (!text || isTyping) return;

    const userMessage: Message = { text, sender: "user" };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, parentRole }),
      });

      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();
      setMessages((prev) => [...prev, { text: data.text, sender: "bot" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Oops, something went wrong! Please try again.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <div className="w-full h-[100dvh] sm:w-[420px] sm:h-[680px] sm:max-h-[90vh] bg-pink-50 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden sm:border-2 sm:border-pink-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-pink-500 px-5 py-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center">
          <PinkBow className="w-8 h-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-white text-xl font-bold tracking-wide">Ruby-GPT</h1>
          <p className="text-pink-100 text-xs">Your sparkly AI assistant</p>
        </div>
        <select
          value={parentRole}
          onChange={(e) => setParentRole(e.target.value as "mother" | "father")}
          className="bg-pink-300/40 text-white text-xs rounded-full px-3 py-1.5 outline-none border border-pink-300/50 cursor-pointer"
        >
          <option value="mother" className="text-pink-900">媽媽</option>
          <option value="father" className="text-pink-900">爸爸</option>
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 messages-scroll">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed animate-fade-in ${
              msg.sender === "bot"
                ? "self-start bg-white text-pink-900 rounded-bl-sm border border-pink-200"
                : "self-end bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-br-sm"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div className="self-start bg-white border border-pink-200 px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex gap-1">
            <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce-dot" />
            <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce-dot [animation-delay:0.2s]" />
            <span className="w-2 h-2 bg-pink-300 rounded-full animate-bounce-dot [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3.5 bg-white border-t border-pink-200 flex gap-2.5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 border-2 border-pink-200 rounded-3xl text-sm bg-pink-50 text-pink-900 placeholder-pink-300 outline-none focus:border-pink-400 transition-colors"
        />
        <button
          onClick={send}
          disabled={isTyping}
          className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full flex items-center justify-center text-lg hover:scale-110 hover:shadow-lg hover:shadow-pink-300/40 transition-all cursor-pointer disabled:opacity-50 disabled:hover:scale-100"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
