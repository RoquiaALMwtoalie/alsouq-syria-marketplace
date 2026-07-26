// src/components/chat/VideoCall.tsx

import { useEffect, useRef } from "react";
import { PhoneOff } from "lucide-react";
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
    <div className="fixed inset-0 z-[100] bg-black">
      {/* زر إنهاء المكالمة */}
      <button
        onClick={onEnd}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-500/30"
      >
        <PhoneOff className="h-8 w-8 text-white" />
      </button>

      {/* حاوية Jitsi */}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}