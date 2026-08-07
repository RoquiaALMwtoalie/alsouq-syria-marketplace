// src/components/chat/VoiceCall.tsx

import { useState, useEffect, useRef } from "react";
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, X, User, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";

// ====== أيقونة متحركة ======
const AnimatedIcon = ({ 
  Icon, 
  className = "",
  color = "text-white",
  delay = 0,
  size = "h-6 w-6"
}: any) => {
  return (
    <div 
      className="relative inline-flex items-center justify-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-float-icon">
        <Icon className={cn(
          "transition-all duration-500",
          color,
          size,
          className
        )} />
      </div>
      <span className="absolute -inset-2 rounded-full border-2 border-white/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};

interface VoiceCallProps {
  roomName: string;
  displayName: string;
  onEnd: () => void;
}

export function VoiceCall({
  roomName,
  displayName,
  onEnd,
}: VoiceCallProps) {
  const app = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // ====== مؤقت المكالمة ======
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ====== تنسيق الوقت ======
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ====== Jitsi ======
  useEffect(() => {
    const loadJitsiScript = () => {
      if (scriptLoadedRef.current) return;
      
      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initJitsi();
      };
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    const initJitsi = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return;

      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: containerRef.current,
        userInfo: {
          displayName: displayName || (app.lang === "ar" ? "مستخدم" : "User"),
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: true,
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
          TOOLBAR_BUTTONS: ['microphone', 'hangup'],
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener('videoConferenceLeft', () => {
        onEnd();
      });

      (window as any).jitsiApi = api;
    };

    const timer = setTimeout(() => {
      loadJitsiScript();
    }, 100);

    return () => {
      clearTimeout(timer);
      if ((window as any).jitsiApi) {
        (window as any).jitsiApi.dispose();
        (window as any).jitsiApi = null;
      }
    };
  }, [roomName, displayName, app.lang, onEnd]);

  // ====== CSS Animations ======
  const styles = `
    @keyframes float-icon {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-6px) rotate(3deg); }
      75% { transform: translateY(4px) rotate(-2deg); }
    }
    .animate-float-icon {
      animation: float-icon 3s ease-in-out infinite;
    }
    @keyframes ripple {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    .animate-ripple {
      animation: ripple 2.5s ease-out infinite;
    }
    @keyframes pulse-ring {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.6; }
    }
    .animate-pulse-ring {
      animation: pulse-ring 2s ease-in-out infinite;
    }
  `;

  return (
    <div className="fixed inset-0 z-[100] bg-[#0d1f1d] dark:bg-[#0a1513] flex flex-col">
      <style>{styles}</style>

      {/* ====== خلفية زخرفية ====== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#2a655f]/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#3a8a82]/10 blur-3xl animate-float-delayed" />
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0 animate-pulse-slow" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #2a655f 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, #2a655f 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }} />
        </div>
      </div>

      {/* ====== الرأس ====== */}
      <div className="relative z-10 flex items-center justify-between p-4 border-b border-[#2a655f]/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#2a655f] flex items-center justify-center shadow-lg shadow-[#2a655f]/30">
            <AnimatedIcon Icon={User} className="h-5 w-5 text-white" color="text-white" delay={0} size="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">{displayName || (app.lang === "ar" ? "مستخدم" : "User")}</h2>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-[#8ab4ae]">
                {app.lang === "ar" ? "مكالمة صوتية" : "Voice call"} • {formatDuration(callDuration)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onEnd}
          className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ====== المنتصف - صورة المستخدم ====== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {/* ✅ حلقة تموج */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-[200px] w-[200px] rounded-full border-2 border-[#2a655f]/20 animate-pulse-ring" />
          <div className="absolute h-[240px] w-[240px] rounded-full border border-[#2a655f]/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
          <div className="absolute h-[280px] w-[280px] rounded-full border border-[#2a655f]/5 animate-pulse-ring" style={{ animationDelay: '2s' }} />
        </div>

        {/* ✅ صورة المستخدم */}
        <div className="h-40 w-40 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-[#2a655f]/30 border-4 border-[#2a655f]/30 relative">
          <span className="relative z-10">{displayName?.charAt(0).toUpperCase() || "?"}</span>
          {/* ✅ تأثير توهج */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 animate-pulse" />
        </div>

        {/* ✅ حالة المكالمة */}
        <div className="mt-6 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[#8ab4ae] text-sm font-medium">
            {isMuted 
              ? (app.lang === "ar" ? "🔇 مكتوم" : "🔇 Muted")
              : (app.lang === "ar" ? "🎤 متصل" : "🎤 Connected")}
          </span>
          <span className="text-[#2a655f]/30 mx-2">|</span>
          <span className="text-[#8ab4ae] text-sm">
            <Shield className="h-3 w-3 inline mr-1" />
            {app.lang === "ar" ? "مشفر" : "Encrypted"}
          </span>
        </div>
      </div>

      {/* ====== الأزرار ====== */}
      <div className="relative z-10 flex items-center justify-center gap-6 p-8 border-t border-[#2a655f]/20 bg-[#0d1f1d]/50 backdrop-blur-sm">
        {/* ✅ زر كتم الميكروفون */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2",
            isMuted 
              ? "bg-red-500/20 border-red-500/30 hover:bg-red-500/30" 
              : "bg-[#2a655f]/20 border-[#2a655f]/30 hover:bg-[#2a655f]/30"
          )}
        >
          {isMuted ? (
            <MicOff className="h-6 w-6 text-red-400" />
          ) : (
            <Mic className="h-6 w-6 text-[#8ab4ae]" />
          )}
          <span className="absolute -bottom-6 text-[10px] text-white/40">
            {app.lang === "ar" ? "كتم" : "Mute"}
          </span>
        </button>

        {/* ✅ زر مكبر الصوت */}
        <button
          onClick={() => setIsSpeaker(!isSpeaker)}
          className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2",
            isSpeaker 
              ? "bg-[#3a8a82]/30 border-[#3a8a82]/40 hover:bg-[#3a8a82]/40" 
              : "bg-[#2a655f]/20 border-[#2a655f]/30 hover:bg-[#2a655f]/30"
          )}
        >
          {isSpeaker ? (
            <Volume2 className="h-6 w-6 text-[#3a8a82]" />
          ) : (
            <VolumeX className="h-6 w-6 text-[#8ab4ae]" />
          )}
          <span className="absolute -bottom-6 text-[10px] text-white/40">
            {app.lang === "ar" ? "صوت" : "Speaker"}
          </span>
        </button>

        {/* ✅ زر إنهاء المكالمة */}
        <button
          onClick={onEnd}
          className="h-16 w-16 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/30 border-2 border-red-400/30 relative group"
        >
          <AnimatedIcon Icon={PhoneOff} className="h-8 w-8 text-white" color="text-white" delay={0} size="h-8 w-8" />
          <span className="absolute -bottom-6 text-[10px] text-white/40">
            {app.lang === "ar" ? "إنهاء" : "End"}
          </span>
          {/* ✅ تأثير تموج حول زر الإنهاء */}
          <span className="absolute -inset-2 rounded-2xl bg-red-500/20 blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* ✅ زر إضافي (تأثيرات) */}
        <button
          className="h-14 w-14 rounded-2xl bg-[#2a655f]/20 border-[#2a655f]/30 hover:bg-[#2a655f]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 border-2"
        >
          <AnimatedIcon Icon={Sparkles} className="h-6 w-6 text-[#8ab4ae]" color="text-[#8ab4ae]" delay={100} size="h-6 w-6" />
          <span className="absolute -bottom-6 text-[10px] text-white/40">
            {app.lang === "ar" ? "تأثيرات" : "Effects"}
          </span>
        </button>
      </div>

      {/* ====== شعار الأمان ====== */}
      <div className="relative z-10 text-center text-xs text-[#2a655f]/40 pb-4 flex items-center justify-center gap-2">
        <Shield className="h-3 w-3" />
        {app.lang === "ar" ? "🔒 مكالمة صوتية مشفرة بتقنية Jitsi" : "🔒 Encrypted voice call powered by Jitsi"}
      </div>

      {/* ====== حاوية Jitsi (مخفية) ====== */}
      <div ref={containerRef} className="hidden" />

      {/* ====== CSS إضافية ====== */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(3deg); }
          75% { transform: translateY(6px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 1s;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}