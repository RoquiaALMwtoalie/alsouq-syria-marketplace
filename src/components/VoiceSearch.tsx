// src/components/VoiceSearch.tsx
// 🎤 مكون البحث الصوتي - نسخة محسنة مع زر إغلاق Dropdown وتجاوب كامل وإيقاف تلقائي عند السكوت

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, X, Loader2, RefreshCw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { processVoiceSearch, getVoiceResponse } from "@/lib/voiceSearchEngine";

interface VoiceSearchProps {
  onResult: (text: string, entities?: any) => void;
  onSearchResponse?: (response: any) => void;
  onListeningChange?: (isListening: boolean) => void;
  lang?: string;
  className?: string;
  buttonSize?: "sm" | "md" | "lg";
  showStatus?: boolean;
  autoSearch?: boolean;
  enableTTS?: boolean;
}

export function VoiceSearch({
  onResult,
  onSearchResponse,
  onListeningChange,
  lang = "ar-SA",
  className,
  buttonSize = "md",
  showStatus = true,
  autoSearch = true,
  enableTTS = true,
}: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");
  const [searchResponse, setSearchResponse] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null); // مؤقت السكوت الاحترافي
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const isArabic = lang === 'ar-SA';

  // ✅ حجم الزر
  const sizeClasses = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-10 w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  };

  // ✅ التحقق من دعم المتصفح
  useEffect(() => {
    const isSpeechSupported = 
      'webkitSpeechRecognition' in window || 
      'SpeechRecognition' in window;
    
    setIsSupported(isSpeechSupported);
    
    if (!isSpeechSupported) {
      console.warn("⚠️ المتصفح لا يدعم البحث الصوتي");
    }
    
    // ✅ تهيئة Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // ============================================================
  // 🗣️ تحويل النص إلى كلام (TTS)
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
  // 🔍 معالجة النتيجة الصوتية
  // ============================================================
  
  const handleVoiceResult = useCallback(async (text: string) => {
    setIsLoading(true);
    
    try {
      const response = await processVoiceSearch(text, lang === 'ar-SA' ? 'ar' : 'en');
      console.log('🎯 [VoiceSearch] Response:', response);
      
      setSearchResponse(response);
      
      if (onSearchResponse) {
        onSearchResponse(response);
      }
      
      if (response.results.length > 0) {
        const firstResult = response.results[0];
        onResult(firstResult.title, response.entities);
        toast.success(`🔍 ${response.totalCount} نتيجة لـ "${text}"`, { duration: 3000 });
      } else if (response.suggestions && response.suggestions.length > 0) {
        toast.info(response.suggestions[0], { duration: 5000 });
        onResult(text, response.entities);
      } else {
        toast.warning(`😕 لم أجد نتائج لـ "${text}"`, { duration: 3000 });
        onResult(text, response.entities);
      }
      
      if (enableTTS && response.totalCount > 0) {
        const voiceText = getVoiceResponse(response, lang === 'ar-SA' ? 'ar' : 'en');
        speakText(voiceText);
      }
      
    } catch (error) {
      console.error('❌ [VoiceSearch] Error processing voice:', error);
      toast.error('❌ حدث خطأ في معالجة البحث الصوتي');
      onResult(text);
    } finally {
      setIsLoading(false);
    }
  }, [lang, onResult, onSearchResponse, enableTTS, speakText]);

  // ============================================================
  // 🎙️ إنشاء كائن التعرف الصوتي (مع ميزة إيقاف السكوت التلقائي الاحترافي)
  // ============================================================
  
  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true; // تفعيل الوضع المستمر لالتقاط الجمل بالكامل
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    const END_PHRASES = [
      'خلصت', 'انتهيت', 'هذا كل شيء', 'هذا كلو', 'خلص',
      'thank you', 'that is all', 'done', 'finished',
      'enough', 'that\'s it', 'ok'
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

    recognition.onresult = async (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";
      let bestConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;
        
        if (event.results[i].isFinal) {
          if (confidence > bestConfidence) {
            finalTranscript = transcript;
            bestConfidence = confidence;
          }
        } else {
          interimTranscript += transcript;
          
          if (checkForEndPhrase(transcript)) {
            console.log('🛑 [VoiceSearch] End phrase detected:', transcript);
            recognition.stop();
            return;
          }
        }
      }

      // ⏱️ إعادة ضبط مؤقت السكوت (Silence Detection) كلما تكلم المستخدم كلمة جديدة
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // إذا توقف المستخدم عن التحدث لمدة 1.5 ثانية (1500 ميلي ثانية)، يتم إيقاف التسجيل وبدء البحث تلقائياً كالنظم الاحترافية
      silenceTimerRef.current = setTimeout(() => {
        console.log('⏱️ [VoiceSearch] User stopped speaking (Silence detected). Stopping recognition...');
        try {
          recognition.stop();
        } catch (e) {
          console.error(e);
        }
      }, 1500);

      if (finalTranscript) {
        setTranscript(finalTranscript);
        setInterimTranscript("");
        setIsListening(false);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        await handleVoiceResult(finalTranscript);
      }

      if (interimTranscript) {
        setInterimTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("❌ خطأ في التعرف الصوتي:", event.error);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      
      if (event.error === "not-allowed") {
        setError("الرجاء السماح باستخدام الميكروفون");
        toast.error("❌ الرجاء السماح باستخدام الميكروفون من إعدادات المتصفح");
      } else if (event.error === "no-speech") {
        setError("لم يتم سماع أي كلام");
        toast.warning("🎤 لم يتم سماع أي كلام، حاول مرة أخرى");
      } else if (event.error === "audio-capture") {
        setError("تعذر الوصول إلى الميكروفون");
        toast.error("❌ تعذر الوصول إلى الميكروفون");
      } else {
        setError(`حدث خطأ: ${event.error}`);
        toast.error(`❌ حدث خطأ: ${event.error}`);
      }
      
      setIsListening(false);
      setIsLoading(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsLoading(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      
      if (onListeningChange) {
        onListeningChange(false);
      }
    };

    return recognition;
  }, [lang, handleVoiceResult, onListeningChange]);

  // ============================================================
  // ⏯️ التحكم في الاستماع
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

    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }

    if (!recognitionRef.current) {
      toast.error("❌ فشل إنشاء التعرف الصوتي");
      return;
    }

    try {
      setError(null);
      setTranscript("");
      setInterimTranscript("");
      setSearchResponse(null);
      setIsLoading(true);
      
      recognitionRef.current.start();
      setIsListening(true);
      
      if (onListeningChange) {
        onListeningChange(true);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // الحد الأقصى لجلسة الاستماع الطويلة (12 ثانية كحماية)
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          recognitionRef.current?.stop();
          setIsListening(false);
          setIsLoading(false);
          toast.info("⏳ انتهى وقت الاستماع، حاول مرة أخرى");
        }
      }, 12000);

    } catch (error) {
      console.error("❌ فشل بدء التعرف الصوتي:", error);
      setIsListening(false);
      setIsLoading(false);
      toast.error("❌ فشل بدء التعرف الصوتي");
    }
  }, [isSupported, requestMicrophonePermission, createRecognition, onListeningChange, isListening]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("❌ فشل إيقاف التعرف الصوتي:", error);
      }
    }
    
    setIsListening(false);
    setIsLoading(false);
    setInterimTranscript("");
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (onListeningChange) {
      onListeningChange(false);
    }
  }, [onListeningChange]);

  const closeDropdown = useCallback(() => {
    setSearchResponse(null);
    setTranscript("");
    setInterimTranscript("");
    setIsListening(false);
    setError(null);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
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

  return (
    <div className="relative inline-block w-full sm:w-auto">
      {/* ✅ زر الميكروفون الرئيسي */}
      <Button
        variant={isListening ? "default" : "outline"}
        size="icon"
        onClick={toggleListening}
        disabled={isLoading}
        className={cn(
          "relative transition-all duration-300 group",
          sizeClasses[buttonSize],
          isListening && "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 animate-pulse",
          isLoading && "opacity-70 cursor-wait",
          className
        )}
        title={isListening ? "إيقاف الاستماع" : "بدء البحث الصوتي"}
      >
        {isLoading ? (
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

      {/* ✅ لوحة منبثقة (Dropdown) متجاوبة بالكامل مع جميع الشاشات (موبايل، تابلت، سطح مكتب) */}
      {showStatus && (isListening || isLoading || interimTranscript || searchResponse || error) && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 top-full mt-2 w-[90vw] max-w-[340px] sm:w-[320px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#2a655f]/20 p-3 z-50 animate-in slide-in-from-top-2 duration-200">
          
          {/* رأس القائمة */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#2a655f]/10">
            <span className="text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]">
              {isArabic ? "🔍 نتائج البحث الصوتي" : "🔍 Voice Search Results"}
            </span>
            <button
              onClick={closeDropdown}
              className="p-1 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-200 text-slate-500 hover:text-red-500"
              aria-label="Close dropdown"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* حالة الاستماع والمعالجة */}
          <div className="flex items-center gap-3">
            {isListening && (
              <div className="flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse delay-150" />
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse delay-300" />
              </div>
            )}
            
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-[#2a655f]" />
            )}

            <div className="flex-1 min-w-0">
              {isListening ? (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  🎤 {isArabic ? "تفضل، استمع إليك..." : "Listening..."}
                </p>
              ) : isLoading ? (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isArabic ? "⏳ جاري المعالجة..." : "⏳ Processing..."}
                </p>
              ) : null}
              
              {interimTranscript && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 break-words">
                  {interimTranscript}
                </p>
              )}
              
              {transcript && !isListening && !isLoading && (
                <p className="text-xs font-medium text-[#2a655f] line-clamp-2 mt-0.5 break-words">
                  ✅ {transcript}
                </p>
              )}
              
              {searchResponse && searchResponse.totalCount > 0 && (
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  🔍 {searchResponse.totalCount} {isArabic ? 'نتيجة مطابقة' : 'results'}
                </p>
              )}
            </div>

            {isListening && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
                onClick={stopListening}
                title="إيقاف"
              >
                <X className="h-3.5 w-3.5 text-red-500" />
              </Button>
            )}
          </div>

          {/* عرض النتائج */}
          {searchResponse && searchResponse.results.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <p className="text-[10px] text-muted-foreground font-bold">
                {isArabic ? '📋 النتائج:' : '📋 Results:'}
              </p>
              {searchResponse.results.slice(0, 3).map((result: any, index: number) => (
                <div key={index} className="text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className="text-[10px] text-[#2a655f] shrink-0">•</span>
                    <span className="truncate">{result.title}</span>
                  </div>
                  {result.price && (
                    <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                      {result.price} SYP
                    </span>
                  )}
                </div>
              ))}
              {searchResponse.totalCount > 3 && (
                <p className="text-[10px] text-muted-foreground">
                  +{searchResponse.totalCount - 3} {isArabic ? 'أخرى' : 'more'}
                </p>
              )}
            </div>
          )}

          {/* اقتراحات */}
          {searchResponse?.suggestions && searchResponse.suggestions.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] text-amber-600 dark:text-amber-400 break-words">
                {searchResponse.suggestions[0]}
              </p>
            </div>
          )}

          {/* أخطاء */}
          {error && (
            <div className="mt-1.5 pt-1.5 border-t border-red-100 dark:border-red-900/20">
              <p className="text-xs text-red-500 break-words">⚠️ {error}</p>
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
                  className="mt-1.5 text-xs h-7 px-3 rounded-lg border-red-200/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {isArabic ? "إعادة المحاولة" : "Retry"}
                </Button>
              )}
            </div>
          )}

          {/* تلميحات */}
          {isListening && (
            <p className="text-[10px] text-muted-foreground mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-700/50">
              {isArabic 
                ? "💡 يتوقف التسجيل تلقائياً فور انتهائك من الكلام..." 
                : "💡 Recording stops automatically when you finish speaking..."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default VoiceSearch;