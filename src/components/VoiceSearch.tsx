// src/components/VoiceSearch.tsx

import { useState, useEffect, useCallback, useRef } from "react";
import { Mic, MicOff, X, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VoiceSearchProps {
  onResult: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  lang?: string;
  className?: string;
  buttonSize?: "sm" | "md" | "lg";
  showStatus?: boolean;
  autoSearch?: boolean;
}

export function VoiceSearch({
  onResult,
  onListeningChange,
  lang = "ar-SA",
  className,
  buttonSize = "md",
  showStatus = true,
  autoSearch = true,
}: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt");
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ حجم الزر حسب المطلوب
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
  }, []);

  // ✅ ✅ ✅ طلب إذن الميكروفون
// src/components/VoiceSearch.tsx

// ✅ طلب إذن الميكروفون (مصحح)
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
    
    // ✅ ✅ ✅ مسح أي خطأ سابق أولاً
    setError(null);
    
    if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
      setPermissionStatus("denied");
      setError("الرجاء السماح باستخدام الميكروفون من إعدادات المتصفح");
      toast.error("❌ تم رفض الوصول إلى الميكروفون");
      
      // ✅ مسح الخطأ بعد 5 ثواني
      setTimeout(() => setError(null), 5000);
      
    } else if (error.name === "NotFoundError") {
      setError("لا يوجد ميكروفون متصل بالجهاز");
      toast.error("❌ لا يوجد ميكروفون متصل بالجهاز");
      
      // ✅ ✅ ✅ مسح الخطأ بعد 4 ثواني
      setTimeout(() => setError(null), 4000);
      
    } else {
      setError("حدث خطأ في الوصول إلى الميكروفون");
      toast.error("❌ حدث خطأ في الوصول إلى الميكروفون");
      
      // ✅ مسح الخطأ بعد 4 ثواني
      setTimeout(() => setError(null), 4000);
    }
    
    return false;
  }
}, []);

  // ✅ التحقق من حالة الإذن
  const checkPermission = useCallback(async () => {
    try {
      if ('permissions' in navigator) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        console.log("🎤 [Permission] Status:", result.state);
        setPermissionStatus(result.state);
        return result.state;
      }
      return 'prompt';
    } catch (error) {
      console.error("❌ [Permission] Cannot check status:", error);
      return 'prompt';
    }
  }, []);

  // ✅ إنشاء كائن التعرف الصوتي
  const createRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // ✅ التعامل مع النتائج
    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        setInterimTranscript("");
        setIsListening(false);
        setIsLoading(false);
        onResult(finalTranscript);
      }

      if (interimTranscript) {
        setInterimTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("❌ خطأ في التعرف الصوتي:", event.error);
      
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
      
      if (onListeningChange) {
        onListeningChange(false);
      }
    };

    recognition.onaudioend = () => {
      console.log("🎤 انتهى تسجيل الصوت");
    };

    recognition.onsoundstart = () => {
      console.log("🎤 بدء تسجيل الصوت");
    };

    return recognition;
  }, [lang, onResult, onListeningChange]);

  // ✅ ✅ ✅ بدء الاستماع (مع طلب الإذن)
  const startListening = useCallback(async () => {
    if (!isSupported) {
      toast.error("❌ المتصفح لا يدعم البحث الصوتي");
      return;
    }

    // ✅ ✅ ✅ طلب إذن الميكروفون أولاً
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

    // ✅ بعد الحصول على الإذن، نبدأ التعرف الصوتي
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
      setIsLoading(true);
      
      recognitionRef.current.start();
      setIsListening(true);
      
      if (onListeningChange) {
        onListeningChange(true);
      }

      // ✅ timeout تلقائي بعد 8 ثواني إذا لم يتحدث
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          recognitionRef.current?.stop();
          setIsListening(false);
          setIsLoading(false);
          toast.info("⏳ انتهى وقت الاستماع، حاول مرة أخرى");
        }
      }, 8000);

    } catch (error) {
      console.error("❌ فشل بدء التعرف الصوتي:", error);
      setIsListening(false);
      setIsLoading(false);
      toast.error("❌ فشل بدء التعرف الصوتي");
    }
  }, [isSupported, requestMicrophonePermission, createRecognition, onListeningChange, isListening]);

  // ✅ إيقاف الاستماع
  const stopListening = useCallback(() => {
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

  // ✅ تبديل حالة الاستماع
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // ✅ تنظيف عند إزالة المكون
  useEffect(() => {
    // ✅ التحقق من حالة الإذن عند التحميل
    checkPermission();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          console.error("❌ فشل تنظيف التعرف الصوتي:", error);
        }
      }
    };
  }, [checkPermission]);

  // ✅ إذا كان غير مدعوم
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
    <div className="relative inline-block">
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
        ) : (
          <Mic className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover:text-[#2a655f] transition-colors" />
        )}
      </Button>

      {/* ✅ حالة الاستماع المنبثقة */}
      {showStatus && (isListening || isLoading || interimTranscript || error) && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 min-w-[200px] max-w-[320px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-[#2a655f]/20 p-3 z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            {/* ✅ مؤشر النبض */}
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

            {/* ✅ النص المعروض */}
            <div className="flex-1 min-w-0">
              {isListening ? (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  🎤 {lang === "ar-SA" ? "استمع..." : "Listening..."}
                </p>
              ) : isLoading ? (
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {lang === "ar-SA" ? "⏳ جاري المعالجة..." : "⏳ Processing..."}
                </p>
              ) : null}
              
              {/* ✅ النص المتوسط */}
              {interimTranscript && (
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {interimTranscript}
                </p>
              )}
              
              {/* ✅ النص النهائي */}
              {transcript && !isListening && !isLoading && (
                <p className="text-xs font-medium text-[#2a655f] line-clamp-1 mt-0.5">
                  ✅ {transcript}
                </p>
              )}
            </div>

            {/* ✅ زر الإيقاف */}
            {isListening && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={stopListening}
              >
                <X className="h-3.5 w-3.5 text-red-500" />
              </Button>
            )}
          </div>

          {/* ✅ رسالة الخطأ مع زر إعادة المحاولة */}
          {error && (
            <div className="mt-1.5 pt-1.5 border-t border-red-100 dark:border-red-900/20">
              <p className="text-xs text-red-500">
                ⚠️ {error}
              </p>
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
                  {lang === "ar-SA" ? "إعادة المحاولة" : "Retry"}
                </Button>
              )}
            </div>
          )}

          {/* ✅ نصائح للمستخدم */}
          {isListening && (
            <p className="text-[10px] text-muted-foreground mt-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-700/50">
              {lang === "ar-SA" 
                ? "💡 تحدث بوضوح وتأكد من أن الميكروفون مفعل"
                : "💡 Speak clearly and make sure microphone is enabled"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default VoiceSearch;