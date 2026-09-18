// src/components/VoiceSearch.tsx
// 🎤 مكون البحث الصوتي — النسخة الاحترافية العالمية
// 🏆 مستوحاة من: Google Assistant + Siri + Alexa
// ✅ متجاوب 100% — إغلاق ذكي تلقائي — تجربة مستخدم احترافية

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Mic,
  MicOff,
  X,
  Loader2,
  RefreshCw,
  Volume2,
  Search,
  Package,
  Store,
  FolderTree,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Popover from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { processVoiceSearch, getVoiceResponse } from "@/lib/voiceSearchEngine";

// ═══════════════════════════════════════════════════════════════
// 🎯 الثوابت الاحترافية (مستوحاة من Google/Siri/Alexa)
// ═══════════════════════════════════════════════════════════════

/** مدة الاستماع القصوى قبل الإيقاف التلقائي */
const MAX_LISTENING_DURATION_MS = 12000;

/** مدة الانتظار بعد آخر صوت قبل اعتباره "توقف" */
const SILENCE_TIMEOUT_MS = 2500;

/** مدة عرض النتائج قبل الإغلاق التلقائي */
const AUTO_CLOSE_AFTER_RESULTS_MS = 6000;

/** مدة عرض الخطأ قبل الإغلاق التلقائي */
const AUTO_CLOSE_AFTER_ERROR_MS = 5000;

/** مدة عرض الاقتراحات قبل الإغلاق التلقائي */
const AUTO_CLOSE_AFTER_SUGGESTIONS_MS = 7000;

/** مدة عرض حالة الانتظار (لا صوت) */
const NO_SPEECH_TIMEOUT_MS = 6000;

// ═══════════════════════════════════════════════════════════════

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
  // ═══════════════════════════════════════════════════════════════
  // 📊 States
  // ═══════════════════════════════════════════════════════════════
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied"
  >("prompt");
  const [searchResponse, setSearchResponse] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState(0);
  const [isAutoClosing, setIsAutoClosing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  // ═══════════════════════════════════════════════════════════════
  // 🔗 Refs
  // ═══════════════════════════════════════════════════════════════
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Timers
  const maxListeningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const noSpeechTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isArabic = lang === "ar-SA";
  const isRTL = isArabic;

  // ═══════════════════════════════════════════════════════════════
  // 🎨 أحجام الزر — متجاوبة
  // ═══════════════════════════════════════════════════════════════
  const sizeClasses = {
    sm: "h-8 w-8 min-[360px]:h-8 min-[360px]:w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-lg sm:rounded-xl",
    md: "h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-xl md:rounded-2xl",
    lg: "h-10 w-10 min-[360px]:h-11 min-[360px]:w-11 sm:h-12 sm:w-12 md:h-12 md:w-12 rounded-xl md:rounded-2xl",
  };

  // ═══════════════════════════════════════════════════════════════
  // 🧹 دوال التنظيف
  // ═══════════════════════════════════════════════════════════════
  const clearMaxListeningTimer = useCallback(() => {
    if (maxListeningTimerRef.current) {
      clearTimeout(maxListeningTimerRef.current);
      maxListeningTimerRef.current = null;
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    setIsAutoClosing(false);
    setAutoCloseCountdown(0);
  }, []);

  const clearNoSpeechTimer = useCallback(() => {
    if (noSpeechTimerRef.current) {
      clearTimeout(noSpeechTimerRef.current);
      noSpeechTimerRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearMaxListeningTimer();
    clearSilenceTimer();
    clearAutoCloseTimer();
    clearNoSpeechTimer();
  }, [
    clearMaxListeningTimer,
    clearSilenceTimer,
    clearAutoCloseTimer,
    clearNoSpeechTimer,
  ]);

  // ═══════════════════════════════════════════════════════════════
  // 🎤 مراقبة مستوى الصوت (Audio Level Monitor)
  // ═══════════════════════════════════════════════════════════════
  const startAudioMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average =
          dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        const normalized = Math.min(100, (average / 128) * 100);

        setAudioLevel(normalized);

        // ✅ إذا كان هناك صوت → إلغاء مؤقت الصمت
        if (normalized > 15) {
          clearSilenceTimer();
        } else if (isListening) {
          // ✅ جدولة إغلاق عند الصمت
          if (!silenceTimerRef.current) {
            silenceTimerRef.current = setTimeout(() => {
              console.log("🔇 [VoiceSearch] Silence detected — auto-stopping");
              if (recognitionRef.current && isListening) {
                try {
                  recognitionRef.current.stop();
                } catch (e) {
                  console.error("Error stopping on silence:", e);
                }
              }
            }, SILENCE_TIMEOUT_MS);
          }
        }

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn("⚠️ [VoiceSearch] Audio monitoring failed:", err);
    }
  }, [isListening, clearSilenceTimer]);

  const stopAudioMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setAudioLevel(0);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // ⏰ الإغلاق التلقائي الذكي (Smart Auto-Close)
  // ═══════════════════════════════════════════════════════════════
  const scheduleAutoClose = useCallback(
    (durationMs: number) => {
      // إلغاء أي إغلاق سابق
      clearAutoCloseTimer();

      setIsAutoClosing(true);
      setAutoCloseCountdown(Math.ceil(durationMs / 1000));

      // ✅ عداد تنازلي كل ثانية
      countdownIntervalRef.current = setInterval(() => {
        setAutoCloseCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // ✅ إغلاق نهائي
      autoCloseTimerRef.current = setTimeout(() => {
        console.log("⏰ [VoiceSearch] Auto-close triggered");
        closeDropdown();
      }, durationMs);
    },
    [clearAutoCloseTimer]
  );

  const cancelAutoClose = useCallback(() => {
    clearAutoCloseTimer();
  }, [clearAutoCloseTimer]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ التحقق من دعم المتصفح
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const isSpeechSupported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;

    setIsSupported(isSpeechSupported);

    if (!isSpeechSupported) {
      console.warn("⚠️ المتصفح لا يدعم البحث الصوتي");
    }

    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // 🗣️ تحويل النص إلى كلام (TTS)
  // ═══════════════════════════════════════════════════════════════
  const speakText = useCallback(
    (text: string) => {
      if (!enableTTS || !synthRef.current) return;

      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      const voices = synthRef.current.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith("ar"));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      synthRef.current.speak(utterance);
    },
    [lang, enableTTS]
  );

  // ═══════════════════════════════════════════════════════════════
  // 🎤 طلب إذن الميكروفون
  // ═══════════════════════════════════════════════════════════════
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🎤 [Permission] Requesting microphone permission...");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      stream.getTracks().forEach((track) => track.stop());

      console.log("✅ [Permission] Microphone permission granted");
      setPermissionStatus("granted");
      setError(null);
      return true;
    } catch (error: any) {
      console.error("❌ [Permission] Microphone permission error:", error);

      setError(null);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setPermissionStatus("denied");
        setError(
          isArabic
            ? "الرجاء السماح باستخدام الميكروفون من إعدادات المتصفح"
            : "Please allow microphone access from browser settings"
        );
        toast.error(
          isArabic
            ? "❌ تم رفض الوصول إلى الميكروفون"
            : "❌ Microphone access denied"
        );
        setTimeout(() => setError(null), 5000);
      } else if (error.name === "NotFoundError") {
        setError(
          isArabic
            ? "لا يوجد ميكروفون متصل بالجهاز"
            : "No microphone connected to the device"
        );
        toast.error(
          isArabic
            ? "❌ لا يوجد ميكروفون متصل بالجهاز"
            : "❌ No microphone connected"
        );
        setTimeout(() => setError(null), 4000);
      } else {
        setError(
          isArabic
            ? "حدث خطأ في الوصول إلى الميكروفون"
            : "Error accessing microphone"
        );
        toast.error(
          isArabic
            ? "❌ حدث خطأ في الوصول إلى الميكروفون"
            : "❌ Error accessing microphone"
        );
        setTimeout(() => setError(null), 4000);
      }

      return false;
    }
  }, [isArabic]);

  // ═══════════════════════════════════════════════════════════════
  // 🔍 معالجة النتيجة الصوتية
  // ═══════════════════════════════════════════════════════════════
  const handleVoiceResult = useCallback(
    async (text: string) => {
      setIsLoading(true);
      setDropdownOpen(true);

      // ✅ إلغاء أي إغلاق تلقائي أثناء المعالجة
      clearAutoCloseTimer();

      try {
        const response = await processVoiceSearch(
          text,
          lang === "ar-SA" ? "ar" : "en"
        );

        console.log("🎯 [VoiceSearch] Response:", response);

        setSearchResponse(response);

        if (onSearchResponse) {
          onSearchResponse(response);
        }

        // ✅ عرض النتائج
        if (response.results.length > 0) {
          const firstResult = response.results[0];
          onResult(firstResult.title, response.entities);

          toast.success(
            isArabic
              ? `🔍 ${response.totalCount} نتيجة لـ "${text}"`
              : `🔍 ${response.totalCount} results for "${text}"`,
            { duration: 3000 }
          );

          // ✅ جدولة إغلاق بعد عرض النتائج
          scheduleAutoClose(AUTO_CLOSE_AFTER_RESULTS_MS);
        } else if (response.suggestions && response.suggestions.length > 0) {
          toast.info(response.suggestions[0], { duration: 5000 });
          onResult(text, response.entities);

          scheduleAutoClose(AUTO_CLOSE_AFTER_SUGGESTIONS_MS);
        } else {
          toast.warning(
            isArabic
              ? `😕 لم أجد نتائج لـ "${text}"`
              : `😕 No results for "${text}"`,
            { duration: 3000 }
          );
          onResult(text, response.entities);

          scheduleAutoClose(AUTO_CLOSE_AFTER_RESULTS_MS);
        }

        // ✅ نطق النتيجة
        if (enableTTS && response.totalCount > 0) {
          const voiceText = getVoiceResponse(
            response,
            lang === "ar-SA" ? "ar" : "en"
          );
          speakText(voiceText);
        }
      } catch (error) {
        console.error("❌ [VoiceSearch] Error processing voice:", error);
        toast.error(
          isArabic
            ? "❌ حدث خطأ في معالجة البحث الصوتي"
            : "❌ Error processing voice search"
        );
        onResult(text);

        scheduleAutoClose(AUTO_CLOSE_AFTER_ERROR_MS);
      } finally {
        setIsLoading(false);
      }
    },
    [
      lang,
      onResult,
      onSearchResponse,
      enableTTS,
      speakText,
      isArabic,
      scheduleAutoClose,
      clearAutoCloseTimer,
    ]
  );

  // ═══════════════════════════════════════════════════════════════
  // 🎙️ إنشاء كائن التعرف الصوتي
  // ═══════════════════════════════════════════════════════════════
  const createRecognition = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = true; // ✅ مستمر (أفضل تجربة)
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;

    const END_PHRASES = [
      "خلصت",
      "انتهيت",
      "هذا كل شيء",
      "هذا كلو",
      "خلص",
      "thank you",
      "that is all",
      "done",
      "finished",
      "enough",
      "that's it",
      "ok",
      "okay",
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
      console.log("🎤 [VoiceSearch] Recognition started");
      setIsListening(true);
      setIsLoading(false);

      if (onListeningChange) {
        onListeningChange(true);
      }

      // ✅ مؤقت عدم وجود صوت (No Speech)
      clearNoSpeechTimer();
      noSpeechTimerRef.current = setTimeout(() => {
        if (!interimTranscript && !transcript) {
          console.log("⏰ [VoiceSearch] No speech detected — stopping");
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch (e) {
              console.error("Error stopping on no-speech:", e);
            }
          }
          setError(
            isArabic ? "لم يتم سماع أي كلام" : "No speech detected"
          );
          setTimeout(() => setError(null), 3000);
        }
      }, NO_SPEECH_TIMEOUT_MS);
    };

    recognition.onresult = async (event: any) => {
      let finalTranscript = "";
      let interimText = "";
      let bestConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        const confidence = event.results[i][0].confidence;

        if (event.results[i].isFinal) {
          if (confidence > bestConfidence) {
            finalTranscript = transcriptPiece;
            bestConfidence = confidence;
          }
        } else {
          interimText += transcriptPiece;

          if (checkForEndPhrase(transcriptPiece)) {
            console.log(
              "🛑 [VoiceSearch] End phrase detected:",
              transcriptPiece
            );
            recognition.stop();
            return;
          }
        }
      }

      if (finalTranscript) {
        // ✅ إلغاء جميع المؤقتات
        clearNoSpeechTimer();
        clearSilenceTimer();
        clearMaxListeningTimer();

        setTranscript(finalTranscript);
        setInterimTranscript("");
        setIsListening(false);

        await handleVoiceResult(finalTranscript);
      }

      if (interimText) {
        setInterimTranscript(interimText);
        // ✅ إلغاء مؤقت عدم الصوت عند وجود صوت
        clearNoSpeechTimer();
      }
    };

    recognition.onerror = (event: any) => {
      console.error("❌ خطأ في التعرف الصوتي:", event.error);

      // ✅ تجاهل الأخطاء البسيطة
      if (event.error === "aborted" || event.error === "no-speech") {
        setIsListening(false);
        setIsLoading(false);
        return;
      }

      if (event.error === "not-allowed") {
        setError(
          isArabic
            ? "الرجاء السماح باستخدام الميكروفون"
            : "Please allow microphone access"
        );
        toast.error(
          isArabic
            ? "❌ الرجاء السماح باستخدام الميكروفون من إعدادات المتصفح"
            : "❌ Please allow microphone from browser settings"
        );
      } else if (event.error === "audio-capture") {
        setError(
          isArabic
            ? "تعذر الوصول إلى الميكروفون"
            : "Cannot access microphone"
        );
        toast.error(
          isArabic
            ? "❌ تعذر الوصول إلى الميكروفون"
            : "❌ Cannot access microphone"
        );
      } else {
        setError(
          isArabic ? `حدث خطأ: ${event.error}` : `Error: ${event.error}`
        );
        toast.error(
          isArabic
            ? `❌ حدث خطأ: ${event.error}`
            : `❌ Error: ${event.error}`
        );
      }

      setIsListening(false);
      setIsLoading(false);

      // ✅ جدولة إغلاق بعد الخطأ
      scheduleAutoClose(AUTO_CLOSE_AFTER_ERROR_MS);
    };

    recognition.onend = () => {
      console.log("🎤 [VoiceSearch] Recognition ended");
      setIsListening(false);
      setIsLoading(false);

      if (onListeningChange) {
        onListeningChange(false);
      }

      // ✅ إلغاء المؤقتات
      clearMaxListeningTimer();
      clearSilenceTimer();
      clearNoSpeechTimer();

      // ═══════════════════════════════════════════════════════════
      // ✅✅✅ الإغلاق الذكي بناءً على الحالة
      // ═══════════════════════════════════════════════════════════
      if (searchResponse) {
        // ✅ إذا كانت هناك نتائج → إغلاق بعد مدة عرض النتائج
        scheduleAutoClose(AUTO_CLOSE_AFTER_RESULTS_MS);
      } else if (error) {
        // ✅ إذا كان هناك خطأ → إغلاق بعد مدة عرض الخطأ
        scheduleAutoClose(AUTO_CLOSE_AFTER_ERROR_MS);
      } else if (transcript || interimTranscript) {
        // ✅ إذا كان هناك نص لكن بدون نتائج
        scheduleAutoClose(AUTO_CLOSE_AFTER_RESULTS_MS);
      } else {
        // ✅ إذا لم يحدث أي شيء → إغلاق سريع
        scheduleAutoClose(1500);
      }
    };

    return recognition;
  }, [
    lang,
    handleVoiceResult,
    onListeningChange,
    isArabic,
    scheduleAutoClose,
    clearMaxListeningTimer,
    clearSilenceTimer,
    clearNoSpeechTimer,
    searchResponse,
    error,
    transcript,
    interimTranscript,
  ]);

  // ═══════════════════════════════════════════════════════════════
  // ⏯️ بدء الاستماع
  // ═══════════════════════════════════════════════════════════════
  const startListening = useCallback(async () => {
    if (!isSupported) {
      toast.error(
        isArabic
          ? "❌ المتصفح لا يدعم البحث الصوتي"
          : "❌ Browser doesn't support voice search"
      );
      return;
    }

    // ✅ إلغاء أي إغلاق مجدول
    clearAllTimers();

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      toast.error(
        isArabic
          ? "❌ الرجاء السماح باستخدام الميكروفون"
          : "❌ Please allow microphone access",
        {
          duration: 5000,
          action: {
            label: isArabic ? "🔄 إعادة المحاولة" : "🔄 Retry",
            onClick: () => startListening(),
          },
        }
      );
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }

    if (!recognitionRef.current) {
      toast.error(
        isArabic
          ? "❌ فشل إنشاء التعرف الصوتي"
          : "❌ Failed to create speech recognition"
      );
      return;
    }

    try {
      setError(null);
      setTranscript("");
      setInterimTranscript("");
      setSearchResponse(null);
      setIsLoading(true);
      setDropdownOpen(true);

      // ✅ بدء مراقبة الصوت
      startAudioMonitoring();

      // ✅ بدء التعرف
      recognitionRef.current.start();
      setIsListening(true);

      // ✅ مؤقت الحد الأقصى للاستماع
      maxListeningTimerRef.current = setTimeout(() => {
        if (isListening && recognitionRef.current) {
          console.log("⏰ [VoiceSearch] Max listening duration reached");
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.error("Error stopping on timeout:", e);
          }
          toast.info(
            isArabic
              ? "⏳ انتهى وقت الاستماع"
              : "⏳ Listening timed out"
          );
        }
      }, MAX_LISTENING_DURATION_MS);
    } catch (error) {
      console.error("❌ فشل بدء التعرف الصوتي:", error);
      setIsListening(false);
      setIsLoading(false);
      stopAudioMonitoring();
      toast.error(
        isArabic
          ? "❌ فشل بدء التعرف الصوتي"
          : "❌ Failed to start speech recognition"
      );
    }
  }, [
    isSupported,
    requestMicrophonePermission,
    createRecognition,
    isListening,
    isArabic,
    clearAllTimers,
    startAudioMonitoring,
    stopAudioMonitoring,
  ]);

  // ═══════════════════════════════════════════════════════════════
  // ⏹️ إيقاف الاستماع
  // ═══════════════════════════════════════════════════════════════
  const stopListening = useCallback(() => {
    clearAllTimers();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("❌ فشل إيقاف التعرف الصوتي:", error);
      }
    }

    stopAudioMonitoring();

    setIsListening(false);
    setIsLoading(false);
    setInterimTranscript("");

    if (onListeningChange) {
      onListeningChange(false);
    }
  }, [onListeningChange, clearAllTimers, stopAudioMonitoring]);

  // ═══════════════════════════════════════════════════════════════
  // ❌ إغلاق الـ Dropdown
  // ═══════════════════════════════════════════════════════════════
  const closeDropdown = useCallback(() => {
    clearAllTimers();
    stopAudioMonitoring();

    setDropdownOpen(false);
    setSearchResponse(null);
    setTranscript("");
    setInterimTranscript("");
    setIsListening(false);
    setError(null);
    setAutoCloseCountdown(0);
    setIsAutoClosing(false);
  }, [clearAllTimers, stopAudioMonitoring]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // ═══════════════════════════════════════════════════════════════
  // 🧹 تنظيف عند إزالة المكون
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    return () => {
      clearAllTimers();
      stopAudioMonitoring();

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
  }, [clearAllTimers, stopAudioMonitoring]);

  // ═══════════════════════════════════════════════════════════════
  // 📱 حالة عدم دعم المتصفح
  // ═══════════════════════════════════════════════════════════════
  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className={cn(
          "opacity-50 cursor-not-allowed shrink-0",
          sizeClasses[buttonSize],
          className
        )}
        title={
          isArabic
            ? "المتصفح لا يدعم البحث الصوتي"
            : "Browser doesn't support voice search"
        }
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ هل يجب عرض الـ Dropdown
  // ═══════════════════════════════════════════════════════════════
  const shouldShowDropdown =
    showStatus &&
    dropdownOpen &&
    (isListening ||
      isLoading ||
      interimTranscript ||
      searchResponse ||
      error ||
      transcript);

  // ═══════════════════════════════════════════════════════════════
  // 📱 عرض المكون
  // ═══════════════════════════════════════════════════════════════
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ✅ الأنيميشن — مضمّن داخل المكون نفسه                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* شريط تقدم الاستماع */
        @keyframes voice-progress {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        /* دخول ناعم */
        @keyframes voice-slide-in {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* نبض الميكروفون */
        @keyframes voice-mic-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }

        /* حلقة نبض */
        @keyframes voice-ring {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        /* شريط الإغلاق التلقائي */
        @keyframes voice-autoclose {
          from {
            transform: scaleX(1);
            transform-origin: left;
          }
          to {
            transform: scaleX(0);
            transform-origin: left;
          }
        }

        /* موجة الصوت */
        @keyframes voice-wave {
          0%, 100% {
            height: 4px;
          }
          50% {
            height: 16px;
          }
        }

        .voice-animate-in {
          animation: voice-slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .voice-progress-bar {
          animation: voice-progress 12s linear forwards;
          transform-origin: left;
        }

        .voice-autoclose-bar {
          animation: voice-autoclose var(--autoclose-duration, 6s) linear forwards;
          transform-origin: left;
        }

        .voice-mic-active {
          animation: voice-mic-pulse 1.5s ease-in-out infinite;
        }

        /* دعم RTL */
        [dir="rtl"] .voice-progress-bar,
        [dir="rtl"] .voice-autoclose-bar {
          transform-origin: right;
        }
      `}</style>

      <Popover.Root
        open={shouldShowDropdown}
        onOpenChange={(open) => {
          if (!open) closeDropdown();
        }}
      >
        <Popover.Trigger asChild>
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={toggleListening}
            disabled={isLoading && !isListening}
            className={cn(
              "relative transition-all duration-300 group shrink-0",
              sizeClasses[buttonSize],
              isListening &&
                "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 voice-mic-active",
              isLoading && !isListening && "opacity-70 cursor-wait",
              className
            )}
            title={
              isListening
                ? isArabic
                  ? "إيقاف الاستماع"
                  : "Stop listening"
                : isArabic
                ? "بدء البحث الصوتي"
                : "Start voice search"
            }
          >
            {isLoading && !isListening ? (
              <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
            ) : isListening ? (
              <>
                <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {/* ✅ حلقة نبض خارجية */}
                <span
                  className="absolute inset-0 rounded-full border-2 border-red-400/60 pointer-events-none"
                  style={{
                    animation: "voice-ring 1.5s ease-out infinite",
                  }}
                />
                {/* ✅ نقطة حمراء */}
                <span className="absolute -top-1 -end-1 h-2.5 w-2.5 rounded-full bg-red-400 animate-ping" />
                <span className="absolute -top-1 -end-1 h-2.5 w-2.5 rounded-full bg-red-500" />
              </>
            ) : isSpeaking ? (
              <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2a655f] animate-pulse" />
            ) : (
              <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 dark:text-slate-400 group-hover:text-[#2a655f] transition-colors" />
            )}
          </Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="center"
            sideOffset={8}
            collisionPadding={12}
            avoidCollisions={true}
            onOpenAutoFocus={(e) => e.preventDefault()}
            className={cn(
              "z-[9999] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl",
              "border border-[#2a655f]/20 dark:border-[#2a655f]/40",
              "p-3 sm:p-4",
              "voice-animate-in",
              "w-[calc(100vw-24px)] max-w-[380px]",
              "sm:w-auto sm:min-w-[280px] sm:max-w-[420px]",
              "max-h-[70vh] overflow-y-auto overflow-x-hidden",
              "pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            )}
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Popover.Arrow className="fill-white dark:fill-slate-900 stroke-[#2a655f]/20 dark:stroke-[#2a655f]/40" />

            {/* ═══════════════════════════════════════════════ */}
            {/* ✅ رأس الـ Dropdown                             */}
            {/* ═══════════════════════════════════════════════ */}
            <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-[#2a655f]/10 dark:border-[#2a655f]/20">
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className={cn(
                    "h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isListening
                      ? "bg-red-500/15"
                      : searchResponse
                      ? "bg-emerald-500/15"
                      : error
                      ? "bg-red-500/15"
                      : "bg-[#2a655f]/10"
                  )}
                >
                  {isListening ? (
                    <Mic className="h-3.5 w-3.5 text-red-500" />
                  ) : searchResponse ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : error ? (
                    <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                  ) : (
                    <Search className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#3a8a82]" />
                  )}
                </div>
                <span className="text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] truncate">
                  {isListening
                    ? isArabic
                      ? "جاري الاستماع"
                      : "Listening"
                    : searchResponse
                    ? isArabic
                      ? "نتائج البحث"
                      : "Search Results"
                    : error
                    ? isArabic
                      ? "خطأ"
                      : "Error"
                    : isArabic
                    ? "البحث الصوتي"
                    : "Voice Search"}
                </span>
                {searchResponse && searchResponse.totalCount > 0 && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] px-1.5 py-0 shrink-0 font-bold">
                    {searchResponse.totalCount}
                  </Badge>
                )}
              </div>
              <button
                onClick={closeDropdown}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 text-slate-500 hover:text-red-500 shrink-0"
                aria-label={isArabic ? "إغلاق" : "Close"}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* ✅ حالة الاستماع                                 */}
            {/* ═══════════════════════════════════════════════ */}
            {isListening && (
              <div className="space-y-3 py-1">
                {/* موجة صوتية متحركة */}
                <div className="flex items-center justify-center gap-1 h-8">
                  {[...Array(12)].map((_, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-red-500 to-[#2a655f]"
                      style={{
                        height: `${Math.max(
                          4,
                          (audioLevel / 100) * 24 * (0.4 + Math.random() * 0.6)
                        )}px`,
                        animation: `voice-wave 0.8s ease-in-out infinite`,
                        animationDelay: `${i * 60}ms`,
                        transition: "height 0.1s ease-out",
                      }}
                    />
                  ))}
                </div>

                {/* نص الاستماع */}
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    🎤 {isArabic ? "استمع..." : "Listening..."}
                  </p>
                  {interimTranscript ? (
                    <p className="text-xs text-[#2a655f] dark:text-[#3a8a82] font-medium line-clamp-2 break-words px-2">
                      "{interimTranscript}"
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">
                      {isArabic
                        ? "تحدث بوضوح..."
                        : "Speak clearly..."}
                    </p>
                  )}
                </div>

                {/* زر إيقاف */}
                <div className="flex justify-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={stopListening}
                    className="h-8 px-4 rounded-full border-red-200/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold"
                  >
                    <X className="h-3.5 w-3.5 me-1.5" />
                    {isArabic ? "إيقاف" : "Stop"}
                  </Button>
                </div>

                {/* شريط تقدم الاستماع */}
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="voice-progress-bar h-full bg-gradient-to-r from-red-500 via-[#2a655f] to-[#3a8a82] rounded-full"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* ✅ حالة المعالجة                                 */}
            {/* ═══════════════════════════════════════════════ */}
            {isLoading && !isListening && (
              <div className="flex flex-col items-center justify-center gap-3 py-6">
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2a655f]" />
                  <div className="absolute inset-0 rounded-full border-2 border-[#2a655f]/20 animate-ping" />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {isArabic ? "⏳ جاري البحث..." : "⏳ Searching..."}
                </p>
                {transcript && (
                  <p className="text-xs text-[#2a655f] dark:text-[#3a8a82] font-medium">
                    "{transcript}"
                  </p>
                )}
              </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* ✅ عرض النتائج                                   */}
            {/* ═══════════════════════════════════════════════ */}
            {searchResponse &&
              searchResponse.results.length > 0 &&
              !isListening &&
              !isLoading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-[#2a655f]" />
                      {isArabic ? "النتائج:" : "Results:"}
                    </p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {searchResponse.totalCount}{" "}
                      {isArabic ? "نتيجة" : "results"}
                    </span>
                  </div>

                  {/* شريط الإغلاق التلقائي */}
                  {isAutoClosing && (
                    <div className="flex items-center gap-2 py-1 px-2 bg-slate-50/80 dark:bg-slate-800/40 rounded-lg">
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        ⏱️ {isArabic ? "إغلاق خلال" : "Closing in"}{" "}
                        <span className="font-bold text-[#2a655f]">
                          {autoCloseCountdown}s
                        </span>
                      </span>
                      <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="voice-autoclose-bar h-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82] rounded-full"
                          style={
                            {
                              "--autoclose-duration": `${AUTO_CLOSE_AFTER_RESULTS_MS}ms`,
                            } as any
                          }
                        />
                      </div>
                      <button
                        onClick={cancelAutoClose}
                        className="text-[10px] text-[#2a655f] dark:text-[#3a8a82] font-bold hover:underline whitespace-nowrap"
                      >
                        {isArabic ? "إلغاء" : "Cancel"}
                      </button>
                    </div>
                  )}

                  {/* قائمة النتائج */}
                  <div className="space-y-1.5">
                    {searchResponse.results
                      .slice(0, 4)
                      .map((result: any, index: number) => (
                        <div
                          key={index}
                          className={cn(
                            "flex flex-col min-[400px]:flex-row min-[400px]:items-center",
                            "gap-1 min-[400px]:gap-2",
                            "p-2 rounded-xl bg-slate-50/50 dark:bg-slate-800/30",
                            "hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/15",
                            "transition-all cursor-pointer",
                            "border border-transparent hover:border-[#2a655f]/20",
                            "hover:translate-x-0.5 rtl:hover:-translate-x-0.5"
                          )}
                          onClick={() => {
                            onResult(result.title, result);
                            closeDropdown();
                          }}
                        >
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            <div className="h-7 w-7 rounded-lg bg-[#2a655f]/10 dark:bg-[#2a655f]/20 flex items-center justify-center shrink-0">
                              {result.type === "store" ? (
                                <Store className="h-3.5 w-3.5 text-[#2a655f]" />
                              ) : result.type === "category" ? (
                                <FolderTree className="h-3.5 w-3.5 text-[#2a655f]" />
                              ) : (
                                <Package className="h-3.5 w-3.5 text-[#2a655f]" />
                              )}
                            </div>
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                              {result.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 ps-9 min-[400px]:ps-0">
                            {result.price && (
                              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                {Number(result.price).toLocaleString()} SYP
                              </span>
                            )}
                            <Badge className="bg-[#2a655f]/10 text-[#2a655f] dark:text-[#3a8a82] border-0 text-[9px] px-1.5 py-0 font-bold">
                              {result.score}%
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>

                  {searchResponse.totalCount > 4 && (
                    <p className="text-[10px] text-muted-foreground text-center py-1">
                      +{searchResponse.totalCount - 4}{" "}
                      {isArabic ? "نتائج أخرى" : "more results"}
                    </p>
                  )}
                </div>
              )}

            {/* ═══════════════════════════════════════════════ */}
            {/* ✅ الاقتراحات                                    */}
            {/* ═══════════════════════════════════════════════ */}
            {searchResponse?.suggestions &&
              searchResponse.suggestions.length > 0 &&
              !isListening &&
              !isLoading && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-amber-600 dark:text-amber-400 flex items-start gap-1 break-words">
                    <TrendingUp className="h-3 w-3 shrink-0 mt-0.5" />
                    <span>{searchResponse.suggestions[0]}</span>
                  </p>
                </div>
              )}

            {/* ═══════════════════════════════════════════════ */}
            {/* ✅ رسالة الخطأ                                   */}
            {/* ═══════════════════════════════════════════════ */}
            {error && !isListening && !isLoading && (
              <div className="mt-2 pt-2 border-t border-red-100 dark:border-red-900/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-500 break-words flex-1">
                    {error}
                  </p>
                </div>
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
                    className="mt-2 text-xs h-7 px-3 rounded-lg border-red-200/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 w-full"
                  >
                    <RefreshCw className="h-3 w-3 me-1" />
                    {isArabic ? "إعادة المحاولة" : "Retry"}
                  </Button>
                )}
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
}

export default VoiceSearch;