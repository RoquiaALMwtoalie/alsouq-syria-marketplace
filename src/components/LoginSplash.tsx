// src/components/LoginSplash.tsx
import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, Truck, Heart, Handshake, Gift, Star, ShoppingBag, Store, Users, Award, TrendingUp, Crown, Zap, Rocket } from "lucide-react";
import { useApp } from "@/lib/i18n";

// ✅ العائلة الكرتونية المحسنة - بجسم كامل
const FamilyMembers = ({ isHappy, isReceiving, isWaving }: { isHappy: boolean; isReceiving: boolean; isWaving: boolean }) => {
  return (
    <div className="flex items-end gap-3">
      {/* الأب */}
      <div className="relative scale-90">
        <svg width="100" height="190" viewBox="0 0 100 190">
          <ellipse cx="50" cy="185" rx="35" ry="7" fill="black" opacity="0.12" />
          <rect x="28" y="85" width="44" height="55" rx="10" fill="#2E86C1" />
          <rect x="32" y="130" width="13" height="50" rx="5" fill="#1A5276" />
          <rect x="55" y="130" width="13" height="50" rx="5" fill="#1A5276" />
          <ellipse cx="38" cy="182" rx="12" ry="5" fill="#1A1A2E" />
          <ellipse cx="62" cy="182" rx="12" ry="5" fill="#1A1A2E" />
          <circle cx="50" cy="58" r="30" fill="#FDEBD0" />
          <path d="M22 48 C22 28 35 18 50 18 C65 18 78 28 78 48" fill="#2C3E50" />
          <circle cx="40" cy="54" r="6" fill="white" />
          <circle cx="60" cy="54" r="6" fill="white" />
          <circle cx="42" cy="52" r="3.5" fill="#2C3E50" />
          <circle cx="62" cy="52" r="3.5" fill="#2C3E50" />
          <circle cx="43" cy="51" r="1.5" fill="white" />
          <circle cx="63" cy="51" r="1.5" fill="white" />
          {isHappy ? (
            <path d="M40 68 Q50 80 60 68" stroke="#2C3E50" strokeWidth="2.5" fill="none" />
          ) : (
            <path d="M42 70 Q50 74 58 70" stroke="#2C3E50" strokeWidth="2" fill="none" />
          )}
          <circle cx="30" cy="62" r="7" fill="#FF6B81" opacity="0.25" />
          <circle cx="70" cy="62" r="7" fill="#FF6B81" opacity="0.25" />
          <circle cx="28" cy="115" r="7" fill="#FDEBD0" />
          <circle cx="72" cy="115" r="7" fill="#FDEBD0" />
        </svg>
      </div>

      {/* الأم */}
      <div className="relative scale-90">
        <svg width="100" height="190" viewBox="0 0 100 190">
          <ellipse cx="50" cy="185" rx="35" ry="7" fill="black" opacity="0.12" />
          <rect x="28" y="85" width="44" height="52" rx="10" fill="#E91E63" />
          <rect x="32" y="128" width="13" height="52" rx="5" fill="#880E4F" />
          <rect x="55" y="128" width="13" height="52" rx="5" fill="#880E4F" />
          <ellipse cx="38" cy="182" rx="12" ry="5" fill="#E91E63" />
          <ellipse cx="62" cy="182" rx="12" ry="5" fill="#E91E63" />
          <circle cx="50" cy="58" r="30" fill="#FDEBD0" />
          <path d="M20 48 C18 28 32 18 50 18 C68 18 82 28 80 48" fill="#4E342E" />
          <path d="M18 44 C12 65 20 80 32 85" stroke="#4E342E" strokeWidth="5" fill="none" />
          <path d="M82 44 C88 65 80 80 68 85" stroke="#4E342E" strokeWidth="5" fill="none" />
          <circle cx="40" cy="54" r="7" fill="white" />
          <circle cx="60" cy="54" r="7" fill="white" />
          <circle cx="42" cy="52" r="4" fill="#2C3E50" />
          <circle cx="62" cy="52" r="4" fill="#2C3E50" />
          <circle cx="43" cy="51" r="1.5" fill="white" />
          <circle cx="63" cy="51" r="1.5" fill="white" />
          {isHappy ? (
            <path d="M42 68 Q50 78 58 68" stroke="#E74C3C" strokeWidth="2.5" fill="none" />
          ) : (
            <path d="M44 70 Q50 73 56 70" stroke="#E74C3C" strokeWidth="2" fill="none" />
          )}
          <circle cx="32" cy="64" r="8" fill="#FF6B81" opacity="0.25" />
          <circle cx="68" cy="64" r="8" fill="#FF6B81" opacity="0.25" />
          <circle cx="28" cy="112" r="7" fill="#FDEBD0" />
          <circle cx="72" cy="112" r="7" fill="#FDEBD0" />
        </svg>
      </div>

      {/* الابن */}
      <div className="relative scale-[0.65] -mt-10">
        <svg width="90" height="180" viewBox="0 0 90 180">
          <ellipse cx="45" cy="178" rx="30" ry="6" fill="black" opacity="0.12" />
          <rect x="25" y="95" width="40" height="45" rx="8" fill="#2ECC71" />
          <rect x="28" y="132" width="11" height="42" rx="4" fill="#1A5276" />
          <rect x="51" y="132" width="11" height="42" rx="4" fill="#1A5276" />
          <ellipse cx="33" cy="175" rx="10" ry="4" fill="#1A1A2E" />
          <ellipse cx="57" cy="175" rx="10" ry="4" fill="#1A1A2E" />
          <circle cx="45" cy="62" r="27" fill="#FDEBD0" />
          <path d="M18 52 C18 36 30 28 45 28 C60 28 72 36 72 52" fill="#5D4037" />
          <circle cx="37" cy="58" r="5.5" fill="white" />
          <circle cx="53" cy="58" r="5.5" fill="white" />
          <circle cx="39" cy="56" r="3" fill="#2C3E50" />
          <circle cx="55" cy="56" r="3" fill="#2C3E50" />
          {isHappy && (
            <>
              <path d="M38 68 Q45 78 52 68" stroke="#E74C3C" strokeWidth="2" fill="none" />
              <rect x="40" y="68" width="10" height="4" rx="1.5" fill="white" />
            </>
          )}
          <circle cx="30" cy="64" r="6" fill="#FF6B81" opacity="0.25" />
          <circle cx="60" cy="64" r="6" fill="#FF6B81" opacity="0.25" />
          <circle cx="25" cy="118" r="6" fill="#FDEBD0" />
          <circle cx="65" cy="118" r="6" fill="#FDEBD0" />
          {isReceiving && (
            <g transform="translate(70, 112) rotate(-40)">
              <rect x="0" y="0" width="10" height="18" rx="5" fill="#FDEBD0" />
            </g>
          )}
        </svg>
      </div>

      {/* البنت */}
      <div className="relative scale-[0.65] -mt-14">
        <svg width="90" height="180" viewBox="0 0 90 180">
          <ellipse cx="45" cy="178" rx="30" ry="6" fill="black" opacity="0.12" />
          <rect x="25" y="95" width="40" height="45" rx="8" fill="#F1C40F" />
          <rect x="28" y="132" width="11" height="42" rx="4" fill="#E67E22" />
          <rect x="51" y="132" width="11" height="42" rx="4" fill="#E67E22" />
          <ellipse cx="33" cy="175" rx="10" ry="4" fill="#E91E63" />
          <ellipse cx="57" cy="175" rx="10" ry="4" fill="#E91E63" />
          <circle cx="45" cy="62" r="27" fill="#FDEBD0" />
          <path d="M18 52 C18 36 30 28 45 28 C60 28 72 36 72 52" fill="#4E342E" />
          <path d="M20 48 C14 65 20 78 30 82" stroke="#4E342E" strokeWidth="4" fill="none" />
          <path d="M70 48 C76 65 70 78 60 82" stroke="#4E342E" strokeWidth="4" fill="none" />
          <circle cx="30" cy="42" r="6" fill="#E91E63" />
          <circle cx="30" cy="42" r="3" fill="#FF6B81" />
          <circle cx="37" cy="58" r="6" fill="white" />
          <circle cx="53" cy="58" r="6" fill="white" />
          <circle cx="39" cy="56" r="3.5" fill="#2C3E50" />
          <circle cx="55" cy="56" r="3.5" fill="#2C3E50" />
          <circle cx="40" cy="55" r="1.5" fill="white" />
          <circle cx="56" cy="55" r="1.5" fill="white" />
          {isHappy && (
            <>
              <path d="M38 68 Q45 78 52 68" stroke="#E74C3C" strokeWidth="2" fill="none" />
              <rect x="40" y="68" width="10" height="4" rx="1.5" fill="white" />
            </>
          )}
          <circle cx="30" cy="64" r="7" fill="#FF6B81" opacity="0.25" />
          <circle cx="60" cy="64" r="7" fill="#FF6B81" opacity="0.25" />
          <circle cx="25" cy="118" r="6" fill="#FDEBD0" />
          <circle cx="65" cy="118" r="6" fill="#FDEBD0" />
          {isHappy && (
            <>
              <text x="72" y="90" fontSize="16">✨</text>
              <text x="10" y="90" fontSize="16">🌸</text>
            </>
          )}
        </svg>
      </div>
    </div>
  );
};

// ✅ الموزع المحترف
const DeliveryPerson = ({ isHappy, isDelivering, hasPackage, isWaving }: { isHappy: boolean; isDelivering: boolean; hasPackage: boolean; isWaving: boolean }) => {
  return (
    <svg width="110" height="200" viewBox="0 0 110 200">
      <ellipse cx="55" cy="195" rx="40" ry="7" fill="black" opacity="0.12" />
      <rect x="32" y="90" width="46" height="55" rx="10" fill="#E67E22" />
      <rect x="36" y="135" width="14" height="55" rx="5" fill="#2C3E50" />
      <rect x="60" y="135" width="14" height="55" rx="5" fill="#2C3E50" />
      <ellipse cx="43" cy="192" rx="13" ry="5" fill="#1A1A2E" />
      <ellipse cx="67" cy="192" rx="13" ry="5" fill="#1A1A2E" />
      <rect x="32" y="90" width="46" height="55" rx="10" fill="#E67E22" />
      <rect x="35" y="105" width="40" height="12" rx="2" fill="#D35400" />
      <circle cx="55" cy="58" r="30" fill="#FDEBD0" />
      <path d="M22 44 C22 26 35 17 55 17 C75 17 88 26 88 44" fill="#E74C3C" />
      <rect x="28" y="44" width="54" height="5" rx="2.5" fill="#C0392B" />
      <text x="55" y="36" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">📦</text>
      <path d="M24 44 C24 32 36 25 55 25 C74 25 86 32 86 44" fill="#2C3E50" />
      <circle cx="43" cy="54" r="6.5" fill="white" />
      <circle cx="67" cy="54" r="6.5" fill="white" />
      <circle cx="45" cy="52" r="4" fill="#2C3E50" />
      <circle cx="69" cy="52" r="4" fill="#2C3E50" />
      <circle cx="46" cy="51" r="1.5" fill="white" />
      <circle cx="70" cy="51" r="1.5" fill="white" />
      <rect x="38" y="52" width="12" height="6" rx="2" fill="#2C3E50" opacity="0.7" />
      <rect x="60" y="52" width="12" height="6" rx="2" fill="#2C3E50" opacity="0.7" />
      <path d="M50 55 L60 55" stroke="#2C3E50" strokeWidth="2" />
      {isHappy ? (
        <path d="M44 68 Q55 82 66 68" stroke="#E74C3C" strokeWidth="2.5" fill="none" />
      ) : (
        <path d="M46 72 Q55 76 64 72" stroke="#E74C3C" strokeWidth="2" fill="none" />
      )}
      <circle cx="34" cy="64" r="7" fill="#FF6B81" opacity="0.2" />
      <circle cx="76" cy="64" r="7" fill="#FF6B81" opacity="0.2" />
      <circle cx="30" cy="118" r="8" fill="#FDEBD0" />
      <circle cx="80" cy="118" r="8" fill="#FDEBD0" />
      {hasPackage && (
        <g transform="translate(82, 105)">
          <rect x="0" y="0" width="24" height="24" rx="4" fill="#F39C12" stroke="#E67E22" strokeWidth="2" />
          <rect x="0" y="10" width="24" height="3" fill="#E67E22" />
          <rect x="10" y="0" width="3" height="24" fill="#E67E22" />
          <text x="12" y="16" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">📦</text>
        </g>
      )}
      {isWaving && (
        <g transform="translate(22, 105) rotate(-30)">
          <rect x="0" y="0" width="10" height="22" rx="5" fill="#FDEBD0" />
          <circle cx="5" cy="24" r="7" fill="#FDEBD0" />
        </g>
      )}
    </svg>
  );
};

// ✅ الموتور المحسن
const DeliveryBike = ({ isMoving, isParked, isLeaving }: { isMoving: boolean; isParked: boolean; isLeaving: boolean }) => {
  return (
    <div className="relative">
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-6 bg-black/30 rounded-full blur-xl" />
      <div className={`relative bg-gradient-to-r from-[#E67E22] to-[#F39C12] rounded-2xl p-5 border-4 border-[#D35400] shadow-2xl ${isMoving ? 'animate-bike-drive' : isParked ? 'animate-pulse' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-tr from-[#1b433e] to-[#2a655f] rounded-2xl p-4 shadow-xl border-2 border-emerald-400/50">
            <span className="text-6xl">🛵</span>
          </div>
          <div className="text-white">
            <div className="text-xs font-extrabold text-yellow-300 tracking-wider flex items-center gap-2">
              <Store className="h-4 w-4" />
              {isMoving ? "في الطريق 🚀" : isParked ? "وصلنا ✅" : "تم التوصيل 🎉"}
            </div>
            <div className="text-base font-black mt-0.5">
              {isMoving ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  السوق لعندك
                </span>
              ) : isParked ? (
                <span className="text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  وصلنا! 🎯
                </span>
              ) : (
                <span className="text-emerald-300 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  شكراً لكم! 🙏
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-6 flex gap-20">
          {[...Array(2)].map((_, i) => (
            <div key={i} className={`h-6 w-6 rounded-full bg-black/60 border-2 border-white/30 ${isMoving ? 'animate-spin-slow' : ''}`}>
              <div className={`absolute inset-1.5 rounded-full border-2 border-dashed border-white/20 ${isMoving ? 'animate-spin-slow' : ''}`} />
            </div>
          ))}
        </div>
        <div className="absolute -right-2 top-4 h-5 w-5 rounded-full bg-yellow-400 animate-pulse shadow-lg shadow-yellow-400/50" />
        <div className="absolute -left-2 bottom-4 h-4 w-4 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
        {isMoving && (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="absolute -right-8 top-1/2 -translate-y-1/2">
                <div className={`h-${3 + i * 2} w-${3 + i * 2} rounded-full bg-white/20 animate-puff`} 
                     style={{ animationDelay: `${i * 0.15}s`, opacity: 0.3 - i * 0.05 }} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

interface LoginSplashProps {
  onComplete: () => void;
}

export function LoginSplash({ onComplete }: LoginSplashProps) {
  const app = useApp();
  const [visible, setVisible] = useState(true);
  const [stage, setStage] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    // ✅ مشهد سينمائي سريع ومختصر
    const timers = [
      setTimeout(() => setStage(1), 100),    // الموتور يظهر
      setTimeout(() => setStage(2), 800),    // الموتور يقترب
      setTimeout(() => setStage(3), 1400),   // الموتور يصل
      setTimeout(() => setStage(4), 1800),   // الموزع ينزل
      setTimeout(() => setStage(5), 2200),   // الموزع يمشي
      setTimeout(() => setStage(6), 2800),   // يسلم الطرد 🤝
      setTimeout(() => setStage(7), 3400),   // العائلة تفرح
      setTimeout(() => setStage(8), 4000),   // يلوح وداعاً
      setTimeout(() => setStage(9), 4500),   // يرجع للموتور
      setTimeout(() => setStage(10), 5000),  // يركب ويمشي
      setTimeout(() => setShowContent(true), 5200), // الشعار يظهر
    ];

    const heartTimer = setTimeout(() => setShowHearts(true), 3400);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 6500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(heartTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  const isHappy = stage >= 7;
  const isReceiving = stage >= 6 && stage <= 8;
  const isWaving = stage >= 8 && stage <= 9;
  const isMoving = stage >= 1 && stage <= 3;
  const isParked = stage >= 3 && stage <= 9;
  const hasPackage = stage >= 4 && stage <= 6;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0a1f1c] via-[#1a4f4a] to-[#2a655f] overflow-hidden select-none flex items-center justify-center">
      
      {/* خلفية محسنة */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-emerald-400/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-300/10 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/8 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/20 animate-twinkle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 1.5 + 0.5}s`
          }} />
        ))}
      </div>

      {/* 🏠 منزل العائلة */}
      <div className={`absolute bottom-[18%] right-[12%] transition-all duration-700 z-15 ${stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="relative">
          <div className="w-56 h-64 bg-gradient-to-b from-[#F7DC6F] to-[#F39C12] rounded-2xl shadow-2xl border-4 border-[#E67E22]">
            <div className="absolute -top-12 left-[-8px] right-[-8px] h-20 bg-[#E74C3C] rounded-t-2xl border-b-4 border-[#C0392B]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#F39C12] rounded-full">
                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">🏠</span>
              </div>
            </div>
            <div className="absolute top-10 left-6 w-14 h-16 bg-[#85C1E9] rounded-lg border-4 border-[#2E86C1]">
              <div className="absolute inset-1.5 bg-white/15 rounded" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#2E86C1]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#2E86C1]" />
            </div>
            <div className="absolute top-10 right-6 w-14 h-16 bg-[#85C1E9] rounded-lg border-4 border-[#2E86C1]">
              <div className="absolute inset-1.5 bg-white/15 rounded" />
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#2E86C1]" />
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#2E86C1]" />
            </div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-22 bg-[#8D6E63] rounded-t-lg border-4 border-[#6D4C41]">
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#F1C40F]" />
              <div className="absolute inset-1.5 border-2 border-[#6D4C41] rounded-t" />
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-6 h-5 bg-[#6D4C41] rounded flex items-center justify-center">
                <span className="text-white font-bold text-[8px]">22</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🛵 الموتور */}
      <div className={`absolute bottom-[16%] transition-all duration-1000 z-30 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`} style={{
        left: stage <= 1 ? '-15%' : stage <= 3 ? '18%' : stage <= 9 ? '20%' : '110%',
        transition: 'all 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <DeliveryBike isMoving={isMoving} isParked={isParked} isLeaving={stage >= 10} />
      </div>

      {/* 👨‍🦱 الموزع */}
      <div className={`absolute bottom-[20%] transition-all duration-500 z-40 ${stage >= 4 ? 'opacity-100' : 'opacity-0 translate-y-8'}`} style={{
        left: stage === 4 ? '16%' : stage <= 5 ? '13%' : stage <= 8 ? '15%' : stage <= 9 ? '17%' : '21%',
        transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <DeliveryPerson isHappy={isHappy} isDelivering={stage >= 5 && stage <= 6} hasPackage={hasPackage} isWaving={isWaving} />
        {stage >= 6 && stage <= 8 && (
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl rounded-xl px-5 py-2.5 shadow-2xl border-2 border-[#E67E22]/40 animate-float-bubble min-w-[160px]">
            <p className="text-xs font-bold text-[#E67E22] flex items-center gap-2 whitespace-nowrap">
              <Handshake className="h-4 w-4" />
              {app.lang === "ar" ? "تفضل طلبك! ✅" : "Here you go! ✅"}
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white/95 rotate-45 border-r-2 border-b-2 border-[#E67E22]/30" />
          </div>
        )}
      </div>

      {/* 👨‍👩‍👧‍👦 العائلة */}
      <div className={`absolute bottom-[14%] transition-all duration-700 z-35 ${stage >= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}`} style={{ right: '10%', transition: 'all 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <FamilyMembers isHappy={isHappy} isReceiving={isReceiving} isWaving={isWaving} />
        {stage >= 7 && (
          <div className="absolute -top-36 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-2xl rounded-xl px-6 py-3 shadow-2xl border-2 border-pink-400/40 animate-float-bubble min-w-[200px]">
            <p className="text-sm font-bold text-pink-600 flex items-center gap-3 whitespace-nowrap">
              <span className="text-3xl">😊</span>
              {app.lang === "ar" ? "شكراً السوق لعندك! 🤝" : "Thank you! 🤝"}
              <span className="text-3xl">🎉</span>
            </p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white/95 rotate-45 border-r-2 border-b-2 border-pink-400/30" />
          </div>
        )}
        {showHearts && (
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 flex gap-4">
            <span className="text-5xl animate-fly-heart">❤️</span>
            <span className="text-4xl animate-fly-heart" style={{ animationDelay: '0.15s' }}>💕</span>
            <span className="text-4xl animate-fly-heart" style={{ animationDelay: '0.3s' }}>💖</span>
          </div>
        )}
        {isHappy && (
          <div className="absolute -top-20 right-4 flex gap-2">
            <span className="text-2xl animate-float-gentle">⭐</span>
            <span className="text-xl animate-float-gentle" style={{ animationDelay: '0.2s' }}>✨</span>
          </div>
        )}
      </div>

      {/* ✅ شعار السوق لعندك */}
      <div className={`absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-700 z-20 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="relative bg-black/40 backdrop-blur-2xl p-6 rounded-2xl border-2 border-yellow-400/25 shadow-2xl max-w-xs w-full mx-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-yellow-400/30 to-orange-500/20 backdrop-blur-lg border-2 border-yellow-400/30 flex items-center justify-center shadow-xl">
              <ShoppingBag className="h-8 w-8 text-yellow-300" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-1.5">
                <Crown className="h-4 w-4 text-yellow-400" />
                السوق لعندك
              </h1>
              <p className="text-[10px] text-yellow-300 font-bold tracking-widest">SOUQI L3NDAK</p>
            </div>
          </div>
          <p className="text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
            {app.lang === "ar" ? "أهلاً بك في السوق لعندك 🚀" : "Welcome to Souqi L3ndak 🚀"}
          </p>
          <div className="w-full mt-3">
            <div className="relative h-1.5 rounded-full bg-black/40 overflow-hidden border border-yellow-400/20">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 rounded-full animate-progress" />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ التذييل */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <p className="text-white/20 text-[8px] tracking-[0.3em] font-extrabold uppercase flex items-center justify-center gap-3">
          <span>{new Date().getFullYear()} ©</span>
          <Heart className="h-2.5 w-2.5 text-pink-400 animate-pulse" />
          <span>السوق لعندك</span>
          <ShoppingBag className="h-2.5 w-2.5 text-yellow-400 animate-pulse" />
        </p>
      </div>

    </div>
  );
}

// ✅ CSS للحركات
const splashStyleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (splashStyleTag) {
  splashStyleTag.innerHTML = `
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }

    @keyframes bike-drive {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-6px) rotate(-2deg); }
    }
    .animate-bike-drive {
      animation: bike-drive 0.5s ease-in-out infinite;
    }

    @keyframes progress-anim {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .animate-progress {
      animation: progress-anim 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes float-bubble {
      0%, 100% { transform: translate(-50%, 0px) scale(1); }
      50% { transform: translate(-50%, -6px) scale(1.04); }
    }
    .animate-float-bubble {
      animation: float-bubble 2s ease-in-out infinite;
    }

    @keyframes float-gentle {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    .animate-float-gentle {
      animation: float-gentle 2.5s ease-in-out infinite;
    }

    @keyframes fly-heart {
      0% { transform: scale(0) rotate(0deg) translateY(0px); opacity: 0; }
      30% { transform: scale(1.8) rotate(-20deg) translateY(-25px); opacity: 1; }
      60% { transform: scale(1.3) rotate(20deg) translateY(-50px); opacity: 1; }
      100% { transform: scale(1) rotate(0deg) translateY(-80px); opacity: 0; }
    }
    .animate-fly-heart {
      animation: fly-heart 3s ease-out forwards;
    }

    @keyframes puff {
      0% { transform: scale(0.5) translateY(0px); opacity: 0.8; }
      100% { transform: scale(3.5) translateY(-50px); opacity: 0; }
    }
    .animate-puff {
      animation: puff 1.2s ease-out infinite;
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.1; transform: scale(0.8); }
      50% { opacity: 0.8; transform: scale(1.3); }
    }
    .animate-twinkle {
      animation: twinkle 1.5s ease-in-out infinite;
    }
  `;
  document.head.appendChild(splashStyleTag);
}