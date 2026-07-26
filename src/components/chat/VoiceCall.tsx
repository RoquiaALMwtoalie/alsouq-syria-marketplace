// src/components/chat/VoiceCall.tsx

import { useEffect, useRef } from "react";
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";

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
          startWithVideoMuted: true, // فيديو مغلق للمكالمات الصوتية
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

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="text-white">
          <h2 className="text-xl font-bold">{displayName}</h2>
          <p className="text-sm text-slate-400">
            {app.lang === "ar" ? "مكالمة صوتية" : "Voice call"}
          </p>
        </div>
        <button
          onClick={onEnd}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
          {displayName.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 p-8">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center transition-all",
            isMuted ? "bg-red-500 hover:bg-red-600" : "bg-slate-700 hover:bg-slate-600"
          )}
        >
          {isMuted ? <MicOff className="h-6 w-6 text-white" /> : <Mic className="h-6 w-6 text-white" />}
        </button>

        <button
          onClick={() => setIsSpeaker(!isSpeaker)}
          className={cn(
            "h-14 w-14 rounded-full flex items-center justify-center transition-all",
            isSpeaker ? "bg-blue-500 hover:bg-blue-600" : "bg-slate-700 hover:bg-slate-600"
          )}
        >
          {isSpeaker ? <Volume2 className="h-6 w-6 text-white" /> : <VolumeX className="h-6 w-6 text-white" />}
        </button>

        <button
          onClick={onEnd}
          className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-500/30"
        >
          <PhoneOff className="h-8 w-8 text-white" />
        </button>
      </div>

      <div className="text-center text-xs text-slate-500 pb-8">
        {app.lang === "ar" ? "🔒 مكالمة صوتية مشفرة" : "🔒 Encrypted voice call"}
      </div>

      {/* حاوية Jitsi (مخفية) */}
      <div ref={containerRef} className="hidden" />
    </div>
  );
}