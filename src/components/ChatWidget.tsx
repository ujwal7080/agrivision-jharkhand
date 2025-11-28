"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSession } from "@/lib/auth-client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      const assistantId = (Date.now() + 1).toString();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          
          // Parse the AI SDK stream format
          const lines = chunk.split("\n");
          
          for (const line of lines) {
            if (!line.trim()) continue;
            
            try {
              // AI SDK format: each line is like "0:"text chunk"
              if (line.startsWith("0:")) {
                const jsonStr = line.slice(2);
                const parsed = JSON.parse(jsonStr);
                if (typeof parsed === "string") {
                  assistantMessage += parsed;
                }
              } else {
                // Plain text fallback
                assistantMessage += line;
              }
              
              // Update UI with accumulated message
              setMessages((prev) => {
                const filtered = prev.filter((m) => m.id !== assistantId);
                return [
                  ...filtered,
                  {
                    id: assistantId,
                    role: "assistant",
                    content: assistantMessage,
                  },
                ];
              });
            } catch (e) {
              // If parsing fails, treat as plain text
              assistantMessage += chunk;
              setMessages((prev) => {
                const filtered = prev.filter((m) => m.id !== assistantId);
                return [
                  ...filtered,
                  {
                    id: assistantId,
                    role: "assistant",
                    content: assistantMessage,
                  },
                ];
              });
            }
          }
        }
        
        // Ensure final message is added if not already
        if (assistantMessage.trim()) {
          setMessages((prev) => {
            const filtered = prev.filter((m) => m.id !== assistantId);
            return [
              ...filtered,
              {
                id: assistantId,
                role: "assistant",
                content: assistantMessage,
              },
            ];
          });
        }
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getWelcomeMessage = () => {
    switch (language) {
      case "hi":
        return "नमस्ते! मैं AgriVision AI सहायक हूं। मैं खेती, फसल, योजनाओं और बाजार के बारे में आपकी मदद कर सकता हूं। आप मुझसे कुछ भी पूछ सकते हैं!";
      case "np":
        return "नमस्ते! हमरे AgriVision AI सहायक हे। हम खेती, फसल, योजना अर बाजार के बारे में मदद कर सकत हन। हमसे कुछ भी पूछ सकत हो!";
      default:
        return "Hello! I'm the AgriVision AI assistant. I can help you with farming, crops, government schemes, and market information. Ask me anything!";
    }
  };

  const getPlaceholder = () => {
    switch (language) {
      case "hi":
        return "अपना सवाल लिखें...";
      case "np":
        return "अपन सवाल लिखो...";
      default:
        return "Type your question...";
    }
  };

  // Don't render if not logged in or still loading session
  if (isPending || !session?.user) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <MessageCircle className="w-8 h-8 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border-2 border-green-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg">AgriVision AI</h2>
                <p className="text-xs text-green-100">
                  {language === "hi"
                    ? "किसान सहायक"
                    : language === "np"
                    ? "किसान सहायक"
                    : "Farmer Assistant"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="icon"
              className="hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-green-50 to-emerald-50">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-200">
                <p className="text-sm text-gray-700">{getWelcomeMessage()}</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border-2 border-green-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border-2 border-green-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600" />
                    <span className="text-sm text-gray-600">
                      {language === "hi"
                        ? "टाइप कर रहा है..."
                        : language === "np"
                        ? "लिख रहल हे..."
                        : "Typing..."}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 p-3 rounded-lg text-sm">
                <p className="font-semibold">
                  {language === "hi"
                    ? "त्रुटि:"
                    : language === "np"
                    ? "गलती:"
                    : "Error:"}
                </p>
                <p className="text-xs mt-1">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="border-t-2 border-green-200 p-4 bg-white"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={getPlaceholder()}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border-2 border-green-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                maxLength={500}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 rounded-full w-12 h-12 p-0"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}