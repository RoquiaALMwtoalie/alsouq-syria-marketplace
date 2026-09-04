// src/components/LoginSplash.tsx
// 🖼️ شاشة ترحيب - دوائر وردية فاخرة وجسيمات مضيئة تنطلق من اللوغو وتملأ الشاشة (ثانيتين)

import { useEffect, useState } from "react";
import { useApp } from "@/lib/i18n";
import { OptimizedImage } from "@/components/OptimizedImage";

const styles = `
/* ✅ حركة انطلاق الدوائر الوردية من اللوغو وحتى أطراف الشاشة */
@keyframes mega-bubble-1 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.9; }
  100% { transform: translate(-48vw, -38vh) scale(3.5); opacity: 0; }
}
@keyframes mega-bubble-2 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.85; }
  100% { transform: translate(52vw, -34vh) scale(4); opacity: 0; }
}
@keyframes mega-bubble-3 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.95; }
  100% { transform: translate(-42vw, 42vh) scale(3.8); opacity: 0; }
}
@keyframes mega-bubble-4 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.8; }
  100% { transform: translate(46vw, 45vh) scale(4.2); opacity: 0; }
}
@keyframes mega-bubble-5 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.9; }
  100% { transform: translate(-58vw, 5vh) scale(3.6); opacity: 0; }
}
@keyframes mega-bubble-6 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.85; }
  100% { transform: translate(60vw, -8vh) scale(4.5); opacity: 0; }
}
@keyframes mega-bubble-7 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.95; }
  100% { transform: translate(-15vw, -52vh) scale(3.9); opacity: 0; }
}
@keyframes mega-bubble-8 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.8; }
  100% { transform: translate(22vw, 54vh) scale(4.1); opacity: 0; }
}
@keyframes mega-bubble-9 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.9; }
  100% { transform: translate(-32vw, -48vh) scale(3.7); opacity: 0; }
}
@keyframes mega-bubble-10 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.85; }
  100% { transform: translate(38vw, -45vh) scale(4.3); opacity: 0; }
}
@keyframes mega-bubble-11 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.9; }
  100% { transform: translate(-52vw, 28vh) scale(3.8); opacity: 0; }
}
@keyframes mega-bubble-12 {
  0% { transform: translate(0, 0) scale(0.1); opacity: 0; }
  15% { opacity: 0.95; }
  100% { transform: translate(55vw, 32vh) scale(4.4); opacity: 0; }
}

/* ✅ ربط الكلاسات بالزمن والتوقيتات المتفاوتة لخلق عمق بصري */
.mb-1  { animation: mega-bubble-1 2.8s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; }
.mb-2  { animation: mega-bubble-2 3.1s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 0.2s; }
.mb-3  { animation: mega-bubble-3 2.9s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 0.4s; }
.mb-4  { animation: mega-bubble-4 3.3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 0.6s; }
.mb-5  { animation: mega-bubble-5 3.0s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 0.8s; }
.mb-6  { animation: mega-bubble-6 3.4s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 1.0s; }
.mb-7  { animation: mega-bubble-7 2.7s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 0.3s; }
.mb-8  { animation: mega-bubble-8 3.2s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 0.5s; }
.mb-9  { animation: mega-bubble-9 3.0s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 0.7s; }
.mb-10 { animation: mega-bubble-10 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 0.9s; }
.mb-11 { animation: mega-bubble-11 2.8s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 1.1s; }
.mb-12 { animation: mega-bubble-12 3.3s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; animation-delay: 1.3s; }

/* ✅ حلقات مدارية مضيئة تدور حول اللوغو */
@keyframes orbit-glow-1 {
  0% { transform: rotate(0deg) scale(0.95); opacity: 0.3; }
  50% { transform: rotate(180deg) scale(1.08); opacity: 0.8; }
  100% { transform: rotate(360deg) scale(0.95); opacity: 0.3; }
}
@keyframes orbit-glow-2 {
  0% { transform: rotate(360deg) scale(1); opacity: 0.2; }
  50% { transform: rotate(180deg) scale(1.12); opacity: 0.7; }
  100% { transform: rotate(0deg) scale(1); opacity: 0.2; }
}

.orbit-glow-1 { animation: orbit-glow-1 6s linear infinite; }
.orbit-glow-2 { animation: orbit-glow-2 8s linear infinite; }

/* ✅ دخول اللوغو بسلاسة سينمائية مع تأثير ظهور مرن */
@keyframes logo-cinematic-enter {
  0% { opacity: 0; transform: scale(0.7) translateY(20px); filter: blur(15px); }
  60% { opacity: 1; transform: scale(1.03) translateY(-5px); filter: blur(0px); }
  100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
}
.logo-cinematic-enter {
  animation: logo-cinematic-enter 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* ✅ نبض خلفي متوهج فائق الجمال للوغو */
@keyframes logo-pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.5; filter: brightness(1); }
  50% { transform: scale(1.2); opacity: 0.9; filter: brightness(1.3); }
}
.logo-pulse-glow {
  animation: logo-pulse-glow 3s ease-in-out infinite;
}

/* ✅ شرارات وحبيبات متطايرة للخلفية (إضافة جمالية فائقة) */
@keyframes float-particle {
  0% { transform: translateY(0px) translateX(0px) scale(0.8); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translateY(-100vh) translateX(20px) scale(1.2); opacity: 0; }
}
.particle {
  position: absolute;
  background: radial-gradient(circle, #f9a8d4 0%, transparent 70%);
  border-radius: 50%;
  animation: float-particle 6s ease-in-out infinite;
}

@keyframes shimmer-line {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
.shimmer-line {
  background-size: 200% auto;
  animation: shimmer-line 3s linear infinite;
}

/* ✅ نبض القلب الوردي */
@keyframes heart-beat {
  0%, 100% { transform: scale(1); }
  14% { transform: scale(1.3); }
  28% { transform: scale(1); }
  42% { transform: scale(1.2); }
  70% { transform: scale(1); }
}
.heart-beat {
  animation: heart-beat 1.5s ease-in-out infinite;
  display: inline-block;
}
`;

interface LoginSplashProps {
  onComplete: () => void;
}

export function LoginSplash({ onComplete }: LoginSplashProps) {
  const app = useApp();
  const [visible, setVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShowContent(true), 100);
    
    // ✅ ضبط الوقت لـ 2 ثانية (2000 مللي ثانية) قبل الاختفاء
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 2000); // ✅ 2 ثانية

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden select-none bg-[#061614] transition-opacity duration-700">
      <style>{styles}</style>

      {/* ============================================================
          🟢 الخلفية والوهج السينمائي الداكن العميق
      ============================================================ */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#040e0d] via-[#09221f] to-[#040e0d]" />

      {/* إضاءات محيطية متحركة وناعمة */}
      <div className="absolute left-1/2 top-1/2 h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1e4d47]/30 blur-[150px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f9a8d4]/15 blur-[120px]" />

      {/* ============================================================
          ✨ حبيبات ضوئية متطايرة في الخلفية لإعطاء عمق كونى
      ============================================================ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="particle w-2 h-2 left-[15%] top-[90%]" style={{ animationDelay: '0s', animationDuration: '5s' }} />
        <div className="particle w-3 h-3 left-[35%] top-[95%]" style={{ animationDelay: '1.5s', animationDuration: '7s' }} />
        <div className="particle w-1.5 h-1.5 left-[65%] top-[85%]" style={{ animationDelay: '0.8s', animationDuration: '6s' }} />
        <div className="particle w-2.5 h-2.5 left-[85%] top-[92%]" style={{ animationDelay: '2.2s', animationDuration: '5.5s' }} />
        <div className="particle w-2 h-2 left-[45%] top-[88%]" style={{ animationDelay: '3.1s', animationDuration: '6.5s' }} />
      </div>

      {/* ============================================================
          🫧 12 دائرة وردية عملاقة تنطلق من اللوغو وتصل لأطراف الشاشة
      ============================================================ */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-[#f9a8d4] to-[#ff1493] shadow-[0_0_50px_rgba(249,168,212,0.9)] mb-1" />
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff69b4] to-[#c2185b] shadow-[0_0_45px_rgba(255,105,180,0.9)] mb-2" />
        <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-[#ffb6c1] to-[#e91e63] shadow-[0_0_55px_rgba(255,182,193,0.9)] mb-3" />
        <div className="absolute w-11 h-11 rounded-full bg-gradient-to-tr from-[#f9a8d4] to-[#ad1457] shadow-[0_0_50px_rgba(249,168,212,0.8)] mb-4" />
        <div className="absolute w-13 h-13 rounded-full bg-gradient-to-tr from-[#ff80ab] to-[#d81b60] shadow-[0_0_60px_rgba(255,128,171,0.9)] mb-5" />
        <div className="absolute w-9 h-9 rounded-full bg-gradient-to-tr from-[#fbcfe8] to-[#c2185b] shadow-[0_0_45px_rgba(251,207,232,0.9)] mb-6" />
        <div className="absolute w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff4081] to-[#880e4f] shadow-[0_0_55px_rgba(255,64,129,0.9)] mb-7" />
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9a8d4] to-[#e91e63] shadow-[0_0_50px_rgba(249,168,212,0.9)] mb-8" />
        <div className="absolute w-15 h-15 rounded-full bg-gradient-to-tr from-[#ffb6c1] to-[#ad1457] shadow-[0_0_65px_rgba(255,182,193,0.8)] mb-9" />
        <div className="absolute w-11 h-11 rounded-full bg-gradient-to-tr from-[#ff80ab] to-[#c2185b] shadow-[0_0_50px_rgba(255,128,171,0.9)] mb-10" />
        <div className="absolute w-13 h-13 rounded-full bg-gradient-to-tr from-[#f9a8d4] to-[#880e4f] shadow-[0_0_55px_rgba(249,168,212,0.9)] mb-11" />
        <div className="absolute w-10 h-10 rounded-full bg-gradient-to-tr from-[#ff69b4] to-[#e91e63] shadow-[0_0_50px_rgba(255,105,180,0.9)] mb-12" />
      </div>

      {/* ============================================================
          💫 الحلقات المدارية الهالة الفاخرة حول اللوغو
      ============================================================ */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[52vh] h-[52vh] rounded-full border border-dashed border-[#f9a8d4]/30 orbit-glow-1 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[38vh] h-[38vh] rounded-full border border-[#ff1493]/25 orbit-glow-2 pointer-events-none shadow-[0_0_30px_rgba(255,20,147,0.1)]" />

      {/* ============================================================
          🏷️ اللوغو الأساسي في المنتصف مع التوهج النابض المتقدم
      ============================================================ */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 z-20 ${
          showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        <div className="relative flex items-center justify-center">
          {/* هالة خلفية دائرية متوهجة مضاعفة */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(249,168,212,0.35)_0%,rgba(216,27,96,0.15)_45%,transparent_75%)] blur-3xl logo-pulse-glow" />
          
          <OptimizedImage
            src="/images/Logo-transparent.png"
            alt="zooq"
            width={1600}
            height={1328}
            quality={95}
            priority={true}
            objectFit="contain"
            transparent={true}
            className="
              relative
              h-auto
              w-[55vh]
              max-w-[75vw]
              object-contain
              logo-cinematic-enter
              drop-shadow-[0_25px_60px_rgba(42,101,95,0.7)]
            "
          />
        </div>
      </div>

      {/* خطوط لامعة متحركة بالأعلى والأسفل لإعطاء طابع سينمائي راقي */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#f9a8d4]/60 to-transparent shimmer-line z-30 shadow-[0_0_15px_rgba(249,168,212,0.8)]" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#d81b60]/50 to-transparent shimmer-line z-30 shadow-[0_0_15px_rgba(216,27,96,0.8)]" style={{ animationDirection: 'reverse' }} />

    {/* ✅ نص سفلي احترافي مع عبارة "مع ذوق كلشي رح يكون على ذوقك" وإيموجي يغمز */}
<div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 text-center">
  <p className={`text-[#f9a8d4] text-sm md:text-base font-light tracking-[0.05em] transition-all duration-1000 ${
    showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
  }`}>
    {app.lang === 'ar' ? (
      <>
        مع ذوق كلشي رح يكون على ذوقك 
        <span className="ml-1.5 inline-block">😉</span>
      </>
    ) : (
      <>
        With Zooq, everything will be to your taste 
        <span className="ml-1.5 inline-block">😉</span>
      </>
    )}
  </p>
</div>
    </div>
  );
}