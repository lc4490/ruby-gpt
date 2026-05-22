"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const responses: Record<string, string[]> = {
  greeting: [
    "Hey there, lovely! What's on your mind?",
    "Hello! So happy to chat with you!",
    "Hi! Ruby-GPT at your service!",
  ],
  howAreYou: [
    "I'm doing great, thanks for asking! Feeling extra sparkly today!",
    "Wonderful! Every conversation makes my day brighter!",
    "I'm fabulous, as always! How about you?",
  ],
  name: [
    "I'm Ruby-GPT! Your pink-powered AI friend!",
    "The name's Ruby-GPT, nice to meet you!",
    "Ruby-GPT, that's me! The pinkest chatbot around!",
  ],
  help: [
    "I can chat about anything! Ask me questions, tell me a joke, or just say hi!",
    "I'm here to chat and keep you company! Try asking me something fun!",
    "I can answer questions, have a conversation, or just hang out. What would you like?",
  ],
  joke: [
    'Why did the AI go to art school? Because it wanted to learn about neural "strokes"!',
    "What's a computer's favorite snack? Microchips!",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "What did the Ruby gemstone say to the diamond? You're not so brilliant yourself!",
  ],
  thanks: [
    "You're welcome! That's what I'm here for!",
    "Anytime! You're so sweet!",
    "Aww, happy to help!",
  ],
  compliment: [
    "Oh stop it, you're making me blush even pinker!",
    "That's so kind of you! You're pretty amazing yourself!",
    "Aww, thank you! You just made my circuits warm and fuzzy!",
  ],
  bye: [
    "Bye bye! Come back and chat anytime!",
    "See you later! It was lovely chatting with you!",
    "Goodbye! Don't be a stranger!",
  ],
  fallback: [
    "Hmm, that's an interesting thought! Tell me more about it!",
    "Ooh, I love talking about that! What else would you like to know?",
    "Great question! I think that's really fascinating. What do you think?",
    "I'm still learning about that, but I'd love to explore the topic with you!",
    "That's a fun one! I could chat about this all day!",
    "Interesting! I have so many thoughts on this. What's your take?",
    "Oh, I like where this is going! Keep the conversation flowing!",
  ],
};

function classify(text: string): string {
  const t = text.toLowerCase().trim();
  if (/^(hi|hello|hey|howdy|hola|sup|yo)\b/.test(t)) return "greeting";
  if (/how are you|how('s| is) it going|what'?s up/.test(t)) return "howAreYou";
  if (/your name|who are you|what are you/.test(t)) return "name";
  if (/help|what can you do|what do you do/.test(t)) return "help";
  if (/joke|funny|laugh|humor/.test(t)) return "joke";
  if (/thank|thanks|thx/.test(t)) return "thanks";
  if (/cute|pretty|awesome|amazing|love you|beautiful|cool|great/.test(t))
    return "compliment";
  if (/bye|goodbye|see you|later|gtg/.test(t)) return "bye";
  return "fallback";
}

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function send() {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { text, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const category = classify(text);
      setMessages((prev) => [
        ...prev,
        { text: pick(responses[category]), sender: "bot" },
      ]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  }

  return (
    <div className="w-[420px] max-w-[95vw] h-[680px] max-h-[90vh] bg-pink-50 rounded-3xl shadow-2xl flex flex-col overflow-hidden border-2 border-pink-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-pink-500 px-5 py-4 flex items-center gap-3">
        <div className="relative w-12 h-12">
          <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-2xl">
            💎
          </div>
          <div className="absolute -top-2 -right-1">
            <PinkBow className="w-7 h-5" />
          </div>
        </div>
        <div>
          <h1 className="text-white text-xl font-bold tracking-wide">Ruby-GPT</h1>
          <p className="text-pink-100 text-xs">Your sparkly AI assistant</p>
        </div>
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
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 border-2 border-pink-200 rounded-3xl text-sm bg-pink-50 text-pink-900 placeholder-pink-300 outline-none focus:border-pink-400 transition-colors"
        />
        <button
          onClick={send}
          className="w-10 h-10 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full flex items-center justify-center text-lg hover:scale-110 hover:shadow-lg hover:shadow-pink-300/40 transition-all cursor-pointer"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
