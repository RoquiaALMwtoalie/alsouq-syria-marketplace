// src/components/chat/VideoCall.tsx

import { useEffect, useRef } from "react";
import { PhoneOff, Video, Users, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { useApp } from "@/lib/i18n";

interface VideoCallProps {
  roomName: string;
  displayName: string;
  onEnd: () => void;
}

export function VideoCall({
  roomName,
  displayName,
  onEnd,
}: VideoCallProps) {
  const app = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // تحميل Jitsi script
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
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener('videoConferenceLeft', () => {
        onEnd();
      });

      // تخزين الـ API للإغلاق لاحقاً
      (window as any).jitsiApi = api;
    };

    // انتظر حتى يتم تحميل الـ DOM
    const timer = setTimeout(() => {
      loadJitsiScript();
    }, 100);

    return () => {
      clearTimeout(timer);
      // إغلاق المكالمة عند الخروج
      if ((window as any).jitsiApi) {
        (window as any).jitsiApi.dispose();
        (window as any).jitsiApi = null;
      }
    };
  }, [roomName, displayName, app.lang, onEnd]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0d1f1d] dark:bg-[#0a1513]">
      
      {/* ✅ شريط علوي للمعلومات */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#2a655f] flex items-center justify-center">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">
                {app.lang === "ar" ? "مكالمة فيديو" : "Video Call"}
              </h3>
              <p className="text-white/60 text-xs">
                {displayName || (app.lang === "ar" ? "مستخدم" : "User")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/70 text-xs">
              {app.lang === "ar" ? "متصل" : "Connected"}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ زر إنهاء المكالمة */}
      <button
        onClick={onEnd}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-500/30 border-2 border-white/20"
      >
        <PhoneOff className="h-8 w-8 text-white" />
        <span className="absolute -bottom-6 text-white/60 text-[10px] font-medium whitespace-nowrap">
          {app.lang === "ar" ? "إنهاء" : "End"}
        </span>
      </button>

      {/* ✅ زر التحكم في الصوت */}
      <button
        className="absolute bottom-8 left-1/2 -translate-x-[calc(50%+80px)] z-20 h-12 w-12 rounded-full bg-[#2a655f]/80 hover:bg-[#2a655f] flex items-center justify-center transition-all hover:scale-110 border border-white/20 backdrop-blur-sm"
      >
        <Mic className="h-5 w-5 text-white" />
      </button>

      {/* ✅ زر التحكم في الكاميرا */}
      <button
        className="absolute bottom-8 left-1/2 translate-x-[calc(50%+80px)] z-20 h-12 w-12 rounded-full bg-[#2a655f]/80 hover:bg-[#2a655f] flex items-center justify-center transition-all hover:scale-110 border border-white/20 backdrop-blur-sm"
      >
        <Camera className="h-5 w-5 text-white" />
      </button>

      {/* ✅ حاوية Jitsi */}
      <div ref={containerRef} className="w-full h-full" />

      {/* ✅ CSS Animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}