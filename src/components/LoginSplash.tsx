// src/components/LoginSplash.tsx
// 🖼️ شاشة ترحيب مع شعارك الخاص + ألوان السستم + احترافية

import { useEffect, useState } from "react";
import { Heart, Shield, Award, Truck, Sparkles } from "lucide-react";
import { useApp } from "@/lib/i18n";

// ============================================================
// 🎨 الأنماط والحركات
// ============================================================

const styles = `
@keyframes float-logo {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-10px) scale(1.02); }
}
.animate-float-logo {
  animation: float-logo 3s ease-in-out infinite;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 30px rgba(42, 101, 95, 0.3); }
  50% { box-shadow: 0 0 60px rgba(42, 101, 95, 0.6); }
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

@keyframes sparkle-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
  50% { transform: translateY(-15px) rotate(180deg); opacity: 1; }
}
.animate-sparkle-float {
  animation: sparkle-float 4s ease-in-out infinite;
}
`;

// ============================================================
// 🎯 المكون الرئيسي
// ============================================================

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
    // ✅ شريط التقدم (5 ثواني)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    // ✅ إظهار المحتوى بعد 0.5 ثانية
    const showTimer = setTimeout(() => {
      setShowContent(true);
    }, 400);

    // ✅ إخفاء الـ Splash بعد 5 ثواني
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
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none">
      
      {/* ✅ صورة الخلفية */}
      <div className="absolute inset-0">
        <img 
          src="/images/delivery-man.png" 
          alt="Delivery Background"
          className="h-full w-full object-cover"
          loading="eager"
        />
        
        {/* ✅ طبقة تدرج فوق الصورة عشان النص يبان */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* ✅ المحتوى فوق الخلفية */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4 md:px-8">
        
        {/* ✅ الشعار + النص */}
        <div className={`text-center max-w-2xl mx-auto transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* ✅ شعارك (Logo.png) */}
          <div className="relative inline-block mb-4 md:mb-6 animate-float-logo">
            
            {/* ✅ توهج حول الشعار بلون السستم */}
            <div className="absolute -inset-8 md:-inset-12 rounded-full bg-[#2a655f]/30 blur-2xl animate-pulse-glow" />
            
            {/* ✅ الشعار نفسه */}
            <div className="relative w-32 h-32 md:w-44 md:h-44 lg:w-52 lg:h-52">
              <img 
                src="/images/Logo.png" 
                alt="السوق لعندك"
                className="w-full h-full object-contain drop-shadow-2xl"
                loading="eager"
              />
              
              {/* ✅ تأثير لمعان حول الشعار بلون السستم */}
              <div className="absolute -inset-4 rounded-full border-2 border-[#2a655f]/20 animate-pulse" />
              <div className="absolute -inset-8 rounded-full border-2 border-[#3a8a82]/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* ✅ اسم التطبيق (تم تغيير اللون: صار أهدى وأحلى 👇) */}
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2">
            <span className="text-[#d4af37] drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              {isArabic ? "السوق لعندك" : "Souqi Le3ndak"}
            </span>
          </h1>

          {/* ✅ الوصف الذكي (لون النص صار أغمق قليلاً ليناسب ألوان السستم) */}
          <div className="space-y-2 md:space-y-3">
            <p className="text-sm md:text-lg lg:text-xl font-bold text-[#4a9e96]/90 tracking-wide">
              {isArabic ? "🇸🇾 سوقك السوري بين يديك" : "🇸🇾 Your Syrian Market"}
            </p>
            
            <p className="text-xs md:text-sm lg:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
              {isArabic 
                ? "اكتشف آلاف المنتجات من متاجر موثوقة في جميع المحافظات السورية. تسوق بسهولة، وادفع بأمان، واستلم طلبك أينما كنت."
                : "Discover thousands of products from trusted stores across all Syrian governorates. Shop easily, pay securely, and receive your order wherever you are."}
            </p>
          </div>

          {/* ✅ شارات الجودة */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-4 md:mt-6">
            {[
              { icon: Shield, label: isArabic ? "آمن 100%" : "100% Secure", color: "text-[#2a655f]" },
              { icon: Truck, label: isArabic ? "توصيل سريع" : "Fast Delivery", color: "text-orange-400" },
              { icon: Award, label: isArabic ? "⭐ 4.9/5" : "⭐ 4.9/5", color: "text-yellow-400" },
              { icon: Heart, label: isArabic ? "10K+ عميل" : "10K+ Customers", color: "text-pink-400" },
            ].map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 animate-fade-in-up"
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <Icon className={`h-3.5 w-3.5 ${badge.color}`} />
                  <span className="text-[10px] md:text-xs font-bold text-white/90">{badge.label}</span>
                </div>
              );
            })}
          </div>

          {/* ✅ شريط التقدم */}
          <div className="mt-6 md:mt-8 w-full max-w-xs mx-auto">
            <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#2a655f] via-[#4a9e96] to-[#6abcb4] animate-progress-bar"
                style={{ transformOrigin: 'left', transform: `scaleX(${progress / 100})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* ✅ نص التحميل */}
          <p className="text-[10px] md:text-xs text-white/30 mt-2 font-mono">
            {isArabic ? `جاري التحميل ${progress}%` : `Loading ${progress}%`}
          </p>
        </div>

        {/* ✅ حقوق النشر في الأسفل */}
        <div className="absolute bottom-3 md:bottom-4 left-0 right-0 text-center">
          <p className="text-[6px] md:text-[8px] text-white/20 tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-3">
            <span>© {new Date().getFullYear()}</span>
            <Heart className="h-2 w-2 text-[#2a655f]/50 animate-heartbeat" />
            <span>{isArabic ? "السوق لعندك" : "Souqi Le3ndak"}</span>
          </p>
        </div>
      </div>
    </div>
  );
}