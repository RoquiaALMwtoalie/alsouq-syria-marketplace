// src/components/VoiceSearch.tsx
// 🎤 مكون البحث الصوتي - v2.1
// ✅ يمرر searchQuery النظيف للـ onResult مباشرة

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, X, Loader2, RefreshCw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { processVoiceSearch, getVoiceResponse } from "@/lib/voiceSearchEngine";

interface VoiceSearchProps {
  onResult: (searchQuery: string, entities?: any, parsed?: any) => void;
  onListeningChange?: (isListening: boolean) => void;
  lang?: string;
  className?: string;
  buttonSize?: "sm" | "md" | "lg";
  showStatus?: boolean;
  enableTTS?: boolean;
}

export function VoiceSearch({
  onResult,
  onListeningChange,
  lang = "ar-SA",
  className,
  buttonSize = "md",
  showStatus = true,
  enableTTS = true,
}: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const accumulatedTranscriptRef = useRef<string>("");
  const isArabic = lang === 'ar-SA';

  // ============================================================
  // ⏱️ إعدادات
  // ============================================================
  const SILENCE_TIMEOUT_MS = 1500;
  const MAX_LISTENING_MS = 15000;

  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-10 w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  };

  // ============================================================
  // 🧹 تنظيف النص من علامات الترقيم
  // ============================================================
  const cleanTranscript = useCallback((text: string): string => {
    if (!text) return "";
    return text
      .replace(/[.،,؛;؟?!:()"""''«»\-–—ـ…]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }, []);

  // ============================================================
  // ✅ دعم المتصفح
  // ============================================================
  useEffect(() => {
    const isSpeechSupported = 
      'webkitSpeechRecognition' in window || 
      'SpeechRecognition' in window;
    
    setIsSupported(isSpeechSupported);
    
    if (!isSpeechSupported) {
      console.warn("⚠️ المتصفح لا يدعم البحث الصوتي");
    }
    
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // ============================================================
  // 🗣️ TTS
  // ============================================================
  const speakText = useCallback((text: string) => {
    if (!enableTTS || !synthRef.current) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    const voices = synthRef.current.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }
    
    synthRef.current.speak(utterance);
  }, [lang, enableTTS]);

  // ============================================================
  // 🎤 طلب إذن الميكروفون
  // ============================================================
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🎤 [Permission] Requesting microphone permission...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      stream.getTracks().forEach(track => track.stop());
      
      console.log("✅ [Permission] Microphone permission granted");
      setPermissionStatus("granted");
      setError(null);
      return true;
      
    } catch (error: any) {
      console.error("❌ [Permission] Microphone permission error:", error);
      
      setError(null);
      
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setPermissionStatus("denied");
        setError("الرجاء السماح باستخدام الميكروفون من إعدادات المتصفح");
        toast.error("❌ تم رفض الوصول إلى الميكروفون");
        setTimeout(() => setError(null), 5000);
      } else if (error.name === "NotFoundError") {
        setError("لا يوجد ميكروفون متصل بالجهاز");
        toast.error("❌ لا يوجد ميكروفون متصل بالجهاز");
        setTimeout(() => setError(null), 4000);
      } else {
        setError("حدث خطأ في الوصول إلى الميكروفون");
        toast.error("❌ حدث خطأ في الوصول إلى الميكروفون");
        setTimeout(() => setError(null), 4000);
      }
      
      return false;
    }
  }, []);

  // ============================================================
  // 🔇 مسح مؤقت السكوت
  // ============================================================
  const clearSilenceTimeout = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  }, []);

  // ============================================================
  // 🔇 إعادة ضبط مؤقت السكوت
  // ============================================================
  const resetSilenceTimeout = useCallback((recognition: any) => {
    clearSilenceTimeout();
    
    silenceTimeoutRef.current = setTimeout(() => {
      console.log('🤫 [VoiceSearch] Silence detected - stopping recognition');
      
      const finalText = cleanTranscript(accumulatedTranscriptRef.current);
      
      if (finalText) {
        console.log('📝 [VoiceSearch] Final text from silence:', finalText);
      }
      
      try {
        recognition.stop();
      } catch (e) {
        console.warn('⚠️ Error stopping recognition:', e);
      }
    }, SILENCE_TIMEOUT_MS);
  }, [clearSilenceTimeout, SILENCE_TIMEOUT_MS, cleanTranscript]);

  // ============================================================
  // 🔍 معالجة النتيجة الصوتية → تمرير للـ onResult
  // ============================================================
  const handleVoiceResult = useCallback(async (text: string) => {
    const cleanedText = cleanTranscript(text);
    
    if (!cleanedText) {
      console.log('⏭️ [VoiceSearch] Empty text, skipping');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // ✅ معالجة الصوت
      const parsed = await processVoiceSearch(cleanedText, lang === 'ar-SA' ? 'ar' : 'en');
      
      console.log('🎯 [VoiceSearch] Parsed:', parsed);
      
      // ✅ استخدم searchQuery (نظيف) بدل expandedQuery
      const queryToSearch = parsed.searchQuery || parsed.cleanedText || parsed.expandedQuery;
      
      if (!queryToSearch) {
        toast.warning(`😕 لم أتمكن من معالجة "${cleanedText}"`);
        setIsLoading(false);
        return;
      }
      
      // ✅ تمرير النص النظيف للـ onResult
      onResult(queryToSearch, parsed.entities, parsed);
      
      // ✅ TTS
      if (enableTTS) {
        const voiceText = getVoiceResponse(parsed, lang === 'ar-SA' ? 'ar' : 'en');
        speakText(voiceText);
      }
      
      // ✅ تنظيف الحالة
      setTranscript("");
      setInterimTranscript("");
      
    } catch (error) {
      console.error('❌ [VoiceSearch] Error processing voice:', error);
      toast.error('❌ حدث خطأ في معالجة البحث الصوتي');
    } finally {
      setIsLoading(false);
    }
  }, [lang, onResult, enableTTS, speakText, cleanTranscript]);

  // ============================================================
  // 🎙️ إنشاء كائن التعرف الصوتي
  // ============================================================
  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // ✅ كلمات النهاية
    const END_PHRASES = [
      'خلصت', 'انتهيت', 'هذا كل شيء', 'هذا كلو', 'خلص',
      'thank you', 'that is all', 'done', 'finished',
      'enough', "that's it"
    ];

    const checkForEndPhrase = (text: string): boolean => {
      const lower = text.toLowerCase();
      for (const phrase of END_PHRASES) {
        if (lower.includes(phrase.toLowerCase())) {
          return true;
        }
      }
      return false;
    };

    recognition.onstart = () => {
      console.log('🎤 [VoiceSearch] Recognition started');
      accumulatedTranscriptRef.current = "";
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
          
          if (checkForEndPhrase(transcript)) {
            console.log('🛑 [VoiceSearch] End phrase detected:', transcript);
            clearSilenceTimeout();
            
            try {
              recognition.stop();
            } catch (e) {
              console.warn('⚠️ Error stopping:', e);
            }
            return;
          }
        }
      }

      // ✅ تراكم النص مع تنظيف
      if (finalTranscript) {
        const cleaned = cleanTranscript(finalTranscript);
        if (cleaned) {
          accumulatedTranscriptRef.current += cleaned + ' ';
        }
      }

      // ✅ تحديث العرض مع تنظيف
      setTranscript(cleanTranscript(accumulatedTranscriptRef.current));
      
      if (interimTranscript) {
        setInterimTranscript(cleanTranscript(interimTranscript));
      } else {
        setInterimTranscript("");
      }

      // ✅ إعادة ضبط مؤقت السكوت
      if (interimTranscript) {
        resetSilenceTimeout(recognition);
      } else if (finalTranscript && !interimTranscript) {
        resetSilenceTimeout(recognition);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("❌ خطأ في التعرف الصوتي:", event.error);
      
      clearSilenceTimeout();
      
      if (event.error === "not-allowed") {
        setError("الرجاء السماح باستخدام الميكروفون");
        toast.error("❌ الرجاء السماح باستخدام الميكروفون من إعدادات المتصفح");
      } else if (event.error === "no-speech") {
        setError("لم يتم سماع أي كلام");
        toast.warning("🎤 لم يتم سماع أي كلام، حاول مرة أخرى");
      } else if (event.error === "audio-capture") {
        setError("تعذر الوصول إلى الميكروفون");
        toast.error("❌ تعذر الوصول إلى الميكروفون");
      } else if (event.error === "aborted") {
        console.log('ℹ️ [VoiceSearch] Recognition aborted');
      } else {
        setError(`حدث خطأ: ${event.error}`);
        toast.error(`❌ حدث خطأ: ${event.error}`);
      }
      
      setIsListening(false);
      setIsLoading(false);
    };

    recognition.onend = async () => {
      console.log('🔚 [VoiceSearch] Recognition ended');
      
      clearSilenceTimeout();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      setIsListening(false);
      
      if (onListeningChange) {
        onListeningChange(false);
      }

      // ✅ إرسال النص النهائي
      const finalText = cleanTranscript(accumulatedTranscriptRef.current);
      
      if (finalText) {
        console.log('✅ [VoiceSearch] Processing final text:', finalText);
        accumulatedTranscriptRef.current = "";
        await handleVoiceResult(finalText);
      } else {
        setIsLoading(false);
      }
    };

    return recognition;
  }, [lang, handleVoiceResult, onListeningChange, resetSilenceTimeout, clearSilenceTimeout, cleanTranscript]);

  // ============================================================
  // ⏯️ بدء الاستماع
  // ============================================================
  const startListening = useCallback(async () => {
    if (!isSupported) {
      toast.error("❌ المتصفح لا يدعم البحث الصوتي");
      return;
    }

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      toast.error(
        "❌ الرجاء السماح باستخدام الميكروفون",
        {
          duration: 5000,
          action: {
            label: "🔄 إعادة المحاولة",
            onClick: () => startListening()
          }
        }
      );
      return;
    }

    // ✅ تنظيف أي recognition قديم
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    recognitionRef.current = createRecognition();

    if (!recognitionRef.current) {
      toast.error("❌ فشل إنشاء التعرف الصوتي");
      return;
    }

    try {
      setError(null);
      setTranscript("");
      setInterimTranscript("");
      setIsLoading(true);
      accumulatedTranscriptRef.current = "";
      
      recognitionRef.current.start();
      setIsListening(true);
      
      if (onListeningChange) {
        onListeningChange(true);
      }

      // ✅ حد أقصى عام
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          console.log('⏰ [VoiceSearch] Max listening time reached');
          try {
            recognitionRef.current.stop();
          } catch (e) {}
        }
      }, MAX_LISTENING_MS);

      // ✅ ابدأ مؤقت السكوت
      resetSilenceTimeout(recognitionRef.current);

    } catch (error) {
      console.error("❌ فشل بدء التعرف الصوتي:", error);
      setIsListening(false);
      setIsLoading(false);
      toast.error("❌ فشل بدء التعرف الصوتي");
    }
  }, [
    isSupported, 
    requestMicrophonePermission, 
    createRecognition, 
    onListeningChange,
    resetSilenceTimeout,
    MAX_LISTENING_MS
  ]);

  const stopListening = useCallback(() => {
    clearSilenceTimeout();
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("❌ فشل إيقاف التعرف الصوتي:", error);
      }
    }
    
    setIsListening(false);
    setInterimTranscript("");
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (onListeningChange) {
      onListeningChange(false);
    }
  }, [onListeningChange, clearSilenceTimeout]);

  const closeStatus = useCallback(() => {
    clearSilenceTimeout();
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    
    setTranscript("");
    setInterimTranscript("");
    setIsListening(false);
    setIsLoading(false);
    setError(null);
    accumulatedTranscriptRef.current = "";
  }, [clearSilenceTimeout]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // ✅ تنظيف عند إزالة المكون
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error("❌ فشل تنظيف التعرف الصوتي:", error);
        }
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // ============================================================
  // 📱 عرض المكون
  // ============================================================
  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(
          "opacity-50 cursor-not-allowed",
          sizeClasses[buttonSize],
          className
        )}
        title="المتصفح لا يدعم البحث الصوتي"
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  const isStatusOpen = showStatus && (isListening || isLoading || interimTranscript || transcript || error);

  return (
    <div className="relative inline-block">
      {/* ✅ زر الميكروفون الرئيسي */}
      <Button
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={toggleListening}
        disabled={isLoading && !isListening}
        className={cn(
          "relative transition-all duration-300 group",
          sizeClasses[buttonSize],
          isListening && "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 animate-pulse",
          isLoading && !isListening && "opacity-70 cursor-wait",
          className
        )}
        title={isListening ? "إيقاف الاستماع" : "بدء البحث الصوتي"}
      >
        {isLoading && !isListening ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isListening ? (
          <>
            <Mic className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-400 animate-ping" />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500" />
          </>
        ) : isSpeaking ? (
          <Volume2 className="h-4 w-4 text-[#2a655f] animate-pulse" />
        ) : (
          <Mic className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-[#2a655f] transition-colors" />
        )}
      </Button>

      {/* ✅ شاشة حالة صغيرة */}
      {isStatusOpen && (
        <>
          {/* Overlay للموبايل */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 sm:hidden"
            onClick={closeStatus}
          />

          <div
            className={cn(
              "bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#2a655f]/20 z-50 animate-in slide-in-from-top-2 duration-200",
              
              "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-[calc(100vw-2rem)] max-w-[400px]",
              "p-4",
              
              "sm:absolute sm:top-full sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-0",
              "sm:mt-2 sm:w-[340px] sm:max-w-[calc(100vw-2rem)]"
            )}
          >
            {/* ✅ رأس */}
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#2a655f]/10">
              <span className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-2">
                <Mic className="h-4 w-4" />
                {isArabic ? "البحث الصوتي" : "Voice Search"}
              </span>
              <button
                onClick={closeStatus}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 text-slate-500 hover:text-red-500"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ✅ حالة الاستماع */}
            <div className="flex items-center gap-3 min-h-[40px]">
              {isListening && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse delay-150" />
                  <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse delay-300" />
                </div>
              )}
              
              {isLoading && !isListening && (
                <Loader2 className="h-5 w-5 animate-spin text-[#2a655f] flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                {isListening ? (
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">
                    🎤 {isArabic ? "استمع..." : "Listening..."}
                  </p>
                ) : isLoading ? (
                  <p className="text-sm font-bold text-[#2a655f]">
                    {isArabic ? "⏳ جاري المعالجة..." : "⏳ Processing..."}
                  </p>
                ) : transcript ? (
                  <p className="text-sm font-bold text-[#2a655f] line-clamp-2">
                    ✅ {transcript}
                  </p>
                ) : null}
                
                {interimTranscript && isListening && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 italic">
                    "{interimTranscript}"
                  </p>
                )}
              </div>

              {isListening && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 flex-shrink-0"
                  onClick={stopListening}
                  title="إيقاف"
                >
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>

            {/* ✅ رسالة الخطأ */}
            {error && (
              <div className="mt-2 pt-2 border-t border-red-100 dark:border-red-900/20">
                <p className="text-xs text-red-500 font-medium">⚠️ {error}</p>
                {permissionStatus === "denied" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      setError(null);
                      const granted = await requestMicrophonePermission();
                      if (granted) {
                        startListening();
                      }
                    }}
                    className="mt-2 text-xs h-8 px-3 rounded-lg border-red-200/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 w-full"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {isArabic ? "إعادة المحاولة" : "Retry"}
                  </Button>
                )}
              </div>
            )}

            {/* ✅ نصائح */}
            {isListening && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {isArabic 
                    ? "💡 تحدث بوضوح. سأتوقف تلقائياً عند السكوت."
                    : "💡 Speak clearly. I'll stop automatically when you pause."}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">
                  {isArabic
                    ? "📝 مثال: 'بدي كنزة حمرا' أو 'جوال سامسونج تحت 1000'"
                    : "📝 Example: 'red jacket' or 'Samsung phone under 1000'"}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default VoiceSearch;