// src/components/LoginSplash.tsx
// 🖼️ شاشة ترحيب متجاوبة تماماً مع منع قص الصورة على الموبايل

import { useEffect, useState } from "react";
import { Heart, Shield, Award, Truck } from "lucide-react";
import { useApp } from "@/lib/i18n";

// ============================================================
// 🎨 الأنماط والحركات
// ============================================================

const styles = `
@keyframes float-logo {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-6px) scale(1.02); }
}
.animate-float-logo {
  animation: float-logo 3s ease-in-out infinite;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(42, 101, 95, 0.3); }
  50% { box-shadow: 0 0 40px rgba(42, 101, 95, 0.6); }
}
.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.2); }
  28% { transform: scale(1); }
  42% { transform: scale(1.1); }
  70% { transform: scale(1); }
}
.animate-heartbeat {
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes progress-bar {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}
.animate-progress-bar {
  animation: progress-bar 2.5s ease-in-out forwards;
}
`;

interface LoginSplashProps {
  onComplete: () => void;
}

export function LoginSplash({ onComplete }: LoginSplashProps) {
  const app = useApp();
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const isArabic = app.lang === "ar";

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none bg-black">
      <style>{styles}</style>
      
      {/* ✅ خلفية متجاوبة تمنع قص الصورة نهائياً على الموبايل */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        <img 
          src="/images/delivery-man.png" 
          alt="Delivery Background"
          className="h-full w-full object-contain md:object-cover opacity-85"
          loading="eager"
        />
        {/* طبقة تدرج لضمان وضوح النصوص فوق الصورة */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
      </div>

      {/* ✅ المحتوى فوق الخلفية مع دعم Scroll آمن للموبايلات الصغيرة */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full w-full px-4 py-5 md:p-8 overflow-y-auto">
        
        <div className="hidden sm:block" />

        {/* الحاوية الوسطى */}
        <div className={`text-center max-w-xl mx-auto my-auto w-full transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          
          {/* الشعار */}
          <div className="relative inline-block mb-2 sm:mb-4 animate-float-logo">
            <div className="absolute -inset-5 sm:-inset-8 rounded-full bg-[#2a655f]/30 blur-xl animate-pulse-glow" />
            
            <div className="relative w-20 h-20 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto">
              <img 
                src="/images/Logo.png" 
                alt="السوق لعندك"
                className="w-full h-full object-contain drop-shadow-2xl"
                loading="eager"
              />
              <div className="absolute -inset-2 rounded-full border-2 border-[#2a655f]/20 animate-pulse" />
            </div>
          </div>

          {/* اسم التطبيق */}
          <h1 className="text-xl sm:text-3xl font-black mb-1">
            <span className="text-[#d4af37] drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              {isArabic ? "السوق لعندك" : "Souqi Le3ndak"}
            </span>
          </h1>

          {/* الوصف */}
          <div className="space-y-1 px-2">
            <p className="text-xs sm:text-base font-bold text-[#4a9e96]/90 tracking-wide">
              {isArabic ? "🇸🇾 سوقك السوري بين يديك" : "🇸🇾 Your Syrian Market"}
            </p>
            
            <p className="text-[11px] sm:text-xs text-white/70 max-w-md mx-auto leading-relaxed line-clamp-2 sm:line-clamp-none">
              {isArabic 
                ? "اكتشف آلاف المنتجات من متاجر موثوقة في جميع المحافظات السورية. تسوق بسهولة وادفع بأمان."
                : "Discover thousands of products from trusted stores across all Syrian governorates."}
            </p>
          </div>

          {/* شارات الجودة */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {[
              { icon: Shield, label: isArabic ? "آمن 100%" : "100% Secure", color: "text-[#2a655f]" },
              { icon: Truck, label: isArabic ? "توصيل سريع" : "Fast Delivery", color: "text-orange-400" },
              { icon: Award, label: "⭐ 4.9/5", color: "text-yellow-400" },
              { icon: Heart, label: isArabic ? "10K+ عميل" : "10K+ Users", color: "text-pink-400" },
            ].map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 animate-fade-in-up text-[10px] sm:text-xs"
                  style={{ animationDelay: `${(index + 1) * 80}ms` }}
                >
                  <Icon className={`h-3 w-3 ${badge.color}`} />
                  <span className="font-bold text-white/90">{badge.label}</span>
                </div>
              );
            })}
          </div>

          {/* شريط التقدم */}
          <div className="mt-4 sm:mt-5 w-3/4 sm:max-w-xs mx-auto">
            <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#2a655f] via-[#4a9e96] to-[#6abcb4] animate-progress-bar"
                style={{ transformOrigin: 'left', transform: `scaleX(${progress / 100})` }}
              />
            </div>
            <p className="text-[10px] text-white/40 mt-1 font-mono">
              {isArabic ? `جاري التحميل ${progress}%` : `Loading ${progress}%`}
            </p>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="w-full text-center mt-2">
          <p className="text-[7px] sm:text-[9px] text-white/30 tracking-[0.15em] font-bold uppercase flex items-center justify-center gap-2">
            <span>© {new Date().getFullYear()}</span>
            <Heart className="h-2 w-2 text-[#2a655f]/70 animate-heartbeat" />
            <span>{isArabic ? "السوق لعندك" : "Souqi Le3ndak"}</span>
          </p>
        </div>

      </div>
    </div>
  );
}