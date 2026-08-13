// src/components/AIAssistant/AIAssistant.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  MessageCircle, X, Send, Loader2, Sparkles, 
  Bot, User, Minimize2, Maximize2, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";
import { toast } from "sonner";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: any[];
  timestamp: Date;
}

export function AIAssistant() {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ رسالة ترحيبية حسب اللغة
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: isArabic 
            ? "👋 أهلاً بك في السوق لعندك! أنا مساعدك الذكي. اسألني عن أي منتج، سعر، أو نصيحة شراء!"
            : "👋 Welcome to Souq Le3ndak! I'm your smart assistant. Ask me about any product, price, or buying advice!",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, isArabic, messages.length]);

  // ✅ تمرير للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ اختصار لوحة المفاتيح (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ✅ ✅ ✅ الدالة المعدلة - استخدام fetch بدلاً من supabase.functions.invoke
  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      console.log("📤 إرسال باستخدام fetch...");

      // ✅ استخدام fetch مباشرة بدلاً من supabase.functions.invoke
      const response = await fetch(
        "https://jjqgfjpxaxjpyohvcbfi.supabase.co/functions/v1/ai-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
            })),
            userId: app.user?.id || null,
            lang: app.lang || "ar",
          }),
        }
      );

      console.log("📥 status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("📥 data:", data);

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || (isArabic ? "عذراً، لم أستطع معالجة طلبك" : "Sorry, I couldn't process your request"),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error(isArabic ? "❌ فشل إرسال الرسالة" : "❌ Failed to send message");
      
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: isArabic 
            ? "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى."
            : "Sorry, an error occurred. Please try again.",
          timestamp: new Date(),
        },
      ]);

    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [input, isLoading, messages, app.user, app.lang, isArabic]);

  // ✅ إعادة تعيين
  const resetChat = useCallback(() => {
    setMessages([]);
    setIsMinimized(false);
    toast.info(isArabic ? "🔄 تم إعادة تعيين المحادثة" : "🔄 Chat reset");
  }, [isArabic]);

  // ✅ جمل مقترحة حسب اللغة
  const suggestedQuestions = isArabic 
    ? [
        "ما هي أفضل الجوالات بسعر أقل من 500,000؟",
        "عندي ميزانية 200,000، شو تنصحني؟",
        "أبحث عن هدية لمن تحب، اقترح شي",
        "ما هي العروض الحالية؟",
        "بدي أشتري جاكيت شتوي، شو تنصح؟",
      ]
    : [
        "What are the best phones under $500?",
        "I have a budget of $200, what do you recommend?",
        "I'm looking for a gift, suggest something",
        "What are the current offers?",
        "I want to buy a winter jacket, what do you recommend?",
      ];

  // ✅ حالة عدم الفتح
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 flex items-center gap-2.5 h-12 px-5 rounded-full shadow-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:shadow-[0_0_30px_rgba(42,101,95,0.5)] transition-all duration-300 hover:scale-105 active:scale-95 z-50 group border border-white/20"
      >
        <div className="relative">
          <MessageCircle className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse ring-2 ring-white/50" />
        </div>
        
        <span className="text-white text-sm font-bold tracking-wide">
          {isArabic ? "🛍️ مساعد الذكي" : "🛍️ AI Assistant"}
        </span>
        
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        
        <span className="sr-only">{isArabic ? "فتح المساعد" : "Open assistant"}</span>
      </Button>
    );
  }

  // ✅ النافذة المفتوحة
  return (
    <div
      className={cn(
        "fixed bottom-6 left-6 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 transition-all duration-300 flex flex-col",
        isMinimized ? "h-16 w-72" : "h-[520px] w-[420px] max-w-[95vw]"
      )}
    >
      <div className="flex items-center justify-between p-3 border-b border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-md">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-900 dark:text-white">
              {isArabic ? "🛍️ السوق لعندك" : "🛍️ Souq Le3ndak"}
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[8px] ml-1.5 animate-pulse">
              <Sparkles className="h-2.5 w-2.5 inline mr-0.5" />
              AI
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all"
            onClick={resetChat}
            title={isArabic ? "إعادة تعيين" : "Reset"}
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
            ) : (
              <Minimize2 className="h-3.5 w-3.5 text-slate-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-500 transition-all"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30 dark:bg-slate-950/20">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isUser={message.role === "user"}
                lang={app.lang}
              />
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
                <div className="h-8 w-8 rounded-full bg-[#2a655f]/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-[#2a655f]" />
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#2a655f] animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-[#2a655f] animate-bounce delay-150" />
                  <span className="h-2 w-2 rounded-full bg-[#2a655f] animate-bounce delay-300" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => sendMessage(), 100);
                  }}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-[#2a655f]/10 hover:bg-[#2a655f]/20 dark:bg-[#2a655f]/20 dark:hover:bg-[#2a655f]/30 text-[#2a655f] dark:text-[#3a8a82] transition-all border border-[#2a655f]/20 hover:border-[#2a655f]/40"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="p-3 border-t border-[#2a655f]/20 dark:border-[#2a655f]/30 flex gap-2 flex-shrink-0 bg-white/50 dark:bg-slate-900/50 rounded-b-2xl">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={isArabic ? "اكتب سؤالك..." : "Type your question..."}
              className="flex-1 h-10 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 text-sm bg-white/80 dark:bg-slate-800/80"
              disabled={isLoading}
              dir={isArabic ? "rtl" : "ltr"}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}