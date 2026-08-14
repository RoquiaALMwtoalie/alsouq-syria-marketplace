// src/components/AIAssistant/AIAssistant.tsx
// 🤖 المساعد الذكي المتقدم - نسخة احترافية مع ميزات متطورة

import { useState, useRef, useEffect, useCallback } from "react";
import { 
  MessageCircle, X, Send, Loader2, Sparkles, 
  Bot, User, Minimize2, Maximize2, RefreshCw,
  Mic, MicOff, Volume2, VolumeX, History, Trash2,
  ChevronUp, ChevronDown, Search, Filter, Star, 
  ShoppingBag, Store, Tag, MapPin, Clock, Zap,
  Sparkle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";
import { toast } from "sonner";
import { MessageBubble } from "./MessageBubble";

// ============================================================
// 📊 الأنواع
// ============================================================

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  products?: any[];
  stores?: any[];
  categories?: any[];
  timestamp: Date;
  isTyping?: boolean;
}

interface AIAssistantProps {
  className?: string;
  position?: "bottom-left" | "bottom-right" | "bottom-center";
  showShortcut?: boolean;
}

// ============================================================
// 🎯 المكون الرئيسي
// ============================================================

export function AIAssistant({ 
  className, 
  position = "bottom-left",
  showShortcut = true 
}: AIAssistantProps) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  
  // ===== الحالات =====
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState<"all" | "products" | "stores" | "categories">("all");
  
  // ===== الـ refs =====
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // 🗣️ الصوت (Speech Recognition)
  // ============================================================
  
  useEffect(() => {
    // Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = app.lang === 'ar' ? 'ar-SA' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;
      
      recognition.onresult = (event: any) => {
        let transcript = '';
        let bestConfidence = 0;
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            const result = event.results[i][0];
            if (result.confidence > bestConfidence) {
              transcript = result.transcript;
              bestConfidence = result.confidence;
            }
          }
        }
        
        if (transcript) {
          setInput(transcript);
          setIsListening(false);
          // ✅ إرسال تلقائي بعد التعرف
          setTimeout(() => sendMessage(transcript), 300);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('❌ Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          toast.error(isArabic ? '❌ الرجاء السماح باستخدام الميكروفون' : '❌ Please allow microphone access');
        }
      };
      
      recognitionRef.current = recognition;
    }
  }, [app.lang, isArabic]);
  
  // 🎤 دالة بدء الاستماع
  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error(isArabic ? '❌ المتصفح لا يدعم التعرف الصوتي' : '❌ Browser does not support speech recognition');
      return;
    }
    
    try {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info(isArabic ? '🎤 استمع...' : '🎤 Listening...');
    } catch (error) {
      console.error('❌ Error starting speech recognition:', error);
    }
  }, [isArabic]);
  
  // 🗣️ دالة النطق (TTS)
  const speakText = useCallback((text: string) => {
    if (!isSoundEnabled || !synthRef.current) return;
    
    // إلغاء أي كلام سابق
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = app.lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // اختيار صوت مناسب
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith(app.lang === 'ar' ? 'ar' : 'en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    synthRef.current.speak(utterance);
  }, [app.lang, isSoundEnabled]);

  // ============================================================
  // 💬 اقتراحات الأسئلة الذكية
  // ============================================================
  
  const updateSuggestions = useCallback(() => {
    const suggestions = isArabic
      ? [
          "🔍 ابحث عن جوال سامسونج",
          "💰 عروض أقل من 500,000",
          "🏪 متاجر في دمشق",
          "📦 أحدث المنتجات",
          "⭐ المنتجات الأكثر تقييماً",
          "🔥 عروض حصرية",
          "🎁 هدايا للمناسبات",
          "👔 ملابس شتوية",
          "📱 اكسسوارات جوالات",
          "🏠 أثاث منزلي",
        ]
      : [
          "🔍 Search for Samsung phones",
          "💰 Offers under $500",
          "🏪 Stores in Damascus",
          "📦 Latest products",
          "⭐ Top rated products",
          "🔥 Exclusive offers",
          "🎁 Gifts for occasions",
          "👔 Winter clothes",
          "📱 Phone accessories",
          "🏠 Home furniture",
        ];
    
    setSuggestedQuestions(suggestions);
  }, [isArabic]);

  // ============================================================
  // 📝 رسالة الترحيب
  // ============================================================
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = isArabic
        ? "👋 أهلاً بك في السوق لعندك!\n\nأنا مساعدك الذكي، يمكنني مساعدتك في:\n• 🔍 البحث عن المنتجات\n• 🏪 اكتشاف المتاجر\n• 📂 استعراض التصنيفات\n• 💰 معرفة الأسعار والعروض\n\nاسألني أي شيء! 🚀"
        : "👋 Welcome to Souq Le3ndak!\n\nI'm your smart assistant, I can help you with:\n• 🔍 Search for products\n• 🏪 Discover stores\n• 📂 Browse categories\n• 💰 Check prices and offers\n\nAsk me anything! 🚀";
      
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: welcomeMessage,
          timestamp: new Date(),
        },
      ]);
      
      updateSuggestions();
    }
  }, [isOpen, isArabic, messages.length, updateSuggestions]);

  // ============================================================
  // 📜 جلب تاريخ المحادثة
  // ============================================================
  
  useEffect(() => {
    if (showHistory && app.user) {
      // يمكن جلب تاريخ المحادثة من قاعدة البيانات
      // يتم تنفيذها في ملف منفصل
    }
  }, [showHistory, app.user]);

  // ============================================================
  // 📜 تمرير للأسفل تلقائي
  // ============================================================
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ============================================================
  // ⌨️ اختصارات لوحة المفاتيح
  // ============================================================
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K أو Cmd+K لفتح/إغلاق
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      
      // Escape للإغلاق
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // ============================================================
  // 📤 إرسال الرسالة
  // ============================================================
  
  const sendMessage = useCallback(async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    // ✅ رسالة المستخدم
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      // ✅ إرسال إلى الخادم
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

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      // ✅ رسالة المساعد
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || (isArabic ? "عذراً، لم أستطع معالجة طلبك" : "Sorry, I couldn't process your request"),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      
      // 🗣️ نطق الرد
      speakText(assistantMessage.content);

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
  }, [input, isLoading, messages, app.user, app.lang, isArabic, speakText]);

  // ============================================================
  // 🗑️ إعادة تعيين المحادثة
  // ============================================================
  
  const resetChat = useCallback(() => {
    setMessages([]);
    setIsMinimized(false);
    toast.info(isArabic ? "🔄 تم إعادة تعيين المحادثة" : "🔄 Chat reset");
  }, [isArabic]);

  // ============================================================
  // 📊 عرض حالة الاتصال
  // ============================================================
  
  const getConnectionStatus = () => {
    if (isListening) return { label: isArabic ? '🎤 استماع...' : '🎤 Listening...', color: 'text-red-500' };
    if (isSpeaking) return { label: isArabic ? '🗣️ يتحدث...' : '🗣️ Speaking...', color: 'text-emerald-500' };
    if (isLoading) return { label: isArabic ? '⏳ جاري المعالجة...' : '⏳ Processing...', color: 'text-amber-500' };
    return { label: isArabic ? '🟢 جاهز' : '🟢 Ready', color: 'text-emerald-500' };
  };

  // ============================================================
  // 🖥️ واجهة المستخدم
  // ============================================================
  
  const status = getConnectionStatus();

  // ✅ الزر المغلق - تصميم أنيق واحترافي بحجم مناسب
  if (!isOpen) {
    return (
      <div className={cn(
        "fixed z-50",
        position === "bottom-left" && "bottom-6 left-6",
        position === "bottom-right" && "bottom-6 right-6",
        position === "bottom-center" && "bottom-6 left-1/2 -translate-x-1/2",
        className
      )}>
        {/* ✅ زر أنيق بحجم مناسب */}
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg hover:shadow-2xl shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50 transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
        >
          {/* ✅ أيقونة متحركة */}
          <div className="relative">
            <Bot className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse ring-2 ring-white/50" />
          </div>
          
          {/* ✅ النص */}
          <span className="text-sm font-bold tracking-wide">
            {isArabic ? "المساعد الذكي" : "AI Assistant"}
          </span>
          
          {/* ✅ اختصار لوحة المفاتيح */}
          {showShortcut && (
            <Badge className="bg-white/20 text-white border-0 text-[9px] px-1.5 py-0.5 font-mono">
              ⌘K
            </Badge>
          )}
          
          {/* ✅ تأثير التموج عند التمرير */}
          <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          
          {/* ✅ نقطة حية صغيرة */}
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400" />
        </button>
      </div>
    );
  }

  // ✅ النافذة المفتوحة
  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-50 bg-white dark:bg-slate-900 shadow-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 transition-all duration-300 flex flex-col",
        isFullscreen ? "inset-0 rounded-none" : cn(
          "bottom-6 max-w-[95vw] rounded-2xl",
          position === "bottom-left" && "left-6",
          position === "bottom-right" && "right-6",
          position === "bottom-center" && "left-1/2 -translate-x-1/2",
          isMinimized ? "h-16 w-72" : "h-[560px] w-[440px]"
        ),
        className
      )}
    >
      {/* ===== HEADER ===== */}
      <div className="flex items-center justify-between p-3 border-b border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10 rounded-t-2xl flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-md flex-shrink-0">
            <Bot className="h-4.5 w-4.5 text-white" />
            <span className={cn(
              "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900",
              status.color.replace('text-', 'bg-')
            )} />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {isArabic ? "🛍️ السوق لعندك" : "🛍️ Souq Le3ndak"}
              </span>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[8px] animate-pulse flex-shrink-0">
                <Sparkles className="h-2.5 w-2.5 inline mr-0.5" />
                AI
              </Badge>
            </div>
            <p className="text-[9px] text-muted-foreground truncate">
              {status.label}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* زر الصوت */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            title={isArabic ? "تشغيل/إيقاف الصوت" : "Toggle sound"}
          >
            {isSoundEnabled ? (
              <Volume2 className="h-3.5 w-3.5 text-slate-500" />
            ) : (
              <VolumeX className="h-3.5 w-3.5 text-slate-500" />
            )}
          </Button>
          
          {/* زر الميكروفون */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7 rounded-lg transition-all",
              isListening ? "bg-red-500/10 text-red-500" : "hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30"
            )}
            onClick={startListening}
            disabled={isListening}
            title={isArabic ? "إدخال صوتي" : "Voice input"}
          >
            {isListening ? (
              <MicOff className="h-3.5 w-3.5 animate-pulse" />
            ) : (
              <Mic className="h-3.5 w-3.5 text-slate-500" />
            )}
          </Button>
          
          {/* زر التصغير/التكبير */}
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
          
          {/* زر ملء الشاشة */}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all hidden sm:flex"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5 text-slate-500" />
            )}
          </Button>
          
          {/* زر الإغلاق */}
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
          {/* ===== المحتوى ===== */}
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
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-tl-none">
                  <span className="h-2 w-2 rounded-full bg-[#2a655f] animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-[#2a655f] animate-bounce delay-150" />
                  <span className="h-2 w-2 rounded-full bg-[#2a655f] animate-bounce delay-300" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* ===== الأسئلة المقترحة ===== */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
              {suggestedQuestions.slice(0, 6).map((q, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(q);
                    setTimeout(() => sendMessage(q), 100);
                  }}
                  className="text-[9px] px-2.5 py-1 rounded-full bg-[#2a655f]/10 hover:bg-[#2a655f]/20 dark:bg-[#2a655f]/20 dark:hover:bg-[#2a655f]/30 text-[#2a655f] dark:text-[#3a8a82] transition-all border border-[#2a655f]/20 hover:border-[#2a655f]/40 whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ===== شريط الإدخال ===== */}
          <div className="p-3 border-t border-[#2a655f]/20 dark:border-[#2a655f]/30 flex gap-2 flex-shrink-0 bg-white/50 dark:bg-slate-900/50 rounded-b-2xl">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={isListening 
                  ? (isArabic ? "🎤 استمع..." : "🎤 Listening...")
                  : (isArabic ? "اكتب سؤالك أو اضغط على الميكروفون..." : "Type your question or press the microphone...")
                }
                className="w-full h-10 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 text-sm bg-white/80 dark:bg-slate-800/80 transition-all pr-10"
                disabled={isLoading || isListening}
                dir={isArabic ? "rtl" : "ltr"}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  className="absolute inset-y-0 end-2 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim() || isListening}
              className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* ===== تذييل مع إحصائيات ===== */}
          <div className="px-3 py-1.5 border-t border-[#2a655f]/10 dark:border-[#2a655f]/20 flex items-center justify-between text-[9px] text-muted-foreground bg-slate-50/30 dark:bg-slate-950/20 rounded-b-2xl">
            <div className="flex items-center gap-3">
              <span>
                {isArabic ? `💬 ${messages.length} رسالة` : `💬 ${messages.length} messages`}
              </span>
              {app.user && (
                <span>
                  {isArabic ? '👤 مسجل' : '👤 Logged in'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 px-2 text-[9px] rounded hover:bg-[#2a655f]/10 text-muted-foreground"
                onClick={resetChat}
              >
                <RefreshCw className="h-2.5 w-2.5 mr-0.5" />
                {isArabic ? 'إعادة تعيين' : 'Reset'}
              </Button>
              {showShortcut && (
                <Badge className="bg-slate-100 dark:bg-slate-800 text-muted-foreground border-0 text-[8px] px-1 py-0">
                  ⌘K
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AIAssistant;