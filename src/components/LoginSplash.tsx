// src/components/LoginSplash.tsx

import React, { useState, useEffect } from 'react';

const cutePhrases = [
  "ذوق جاي لعندك ركض...",
  "عم نجهّزلك أحلى طلبية...",
  "سوقك السوري بين يديك...",
];

interface LoginSplashProps {
  onComplete?: () => void;
  minDuration?: number;
}

export function LoginSplash({ 
  onComplete,
  minDuration = 2500,
}: LoginSplashProps) {
  const [textIndex, setTextIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  // تبديل العبارات كل 1.4 ثانية
  useEffect(() => {
    const timer = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % cutePhrases.length);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  // بعد minDuration → اخفِ اللودر ونفّذ onComplete
  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, minDuration);

    return () => clearTimeout(timeout);
  }, [minDuration, onComplete]);

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#091a18] text-white select-none"
    >
      <style>{`
        @keyframes cuteSprint {
          0% { transform: translateY(0px) rotate(-3.5deg) scale(1, 1); }
          100% { transform: translateY(-12px) rotate(3.5deg) scale(0.98, 1.03); }
        }
        @keyframes cuteLegL {
          0% { transform: rotate(-45deg); }
          100% { transform: rotate(45deg); }
        }
        @keyframes cuteLegR {
          0% { transform: rotate(45deg); }
          100% { transform: rotate(-45deg); }
        }
        @keyframes armFront {
          0% { transform: rotate(-35deg); }
          100% { transform: rotate(35deg); }
        }
        @keyframes armBack {
          0% { transform: rotate(35deg); }
          100% { transform: rotate(-35deg); }
        }
        @keyframes blinkEye {
          0%, 92%, 100% { transform: scaleY(1); }
          96% { transform: scaleY(0.1); }
        }
        @keyframes windFlow {
          0% { transform: translateX(0); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: translateX(-400px); opacity: 0; }
        }
        @keyframes sparkleTwinkle {
          0% { transform: scale(0.6); opacity: 0.3; }
          100% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ✨ شرارات لامعة في الخلفية */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[15%] right-[22%] w-1.5 h-1.5 rounded-full bg-[#ffbccc]"
          style={{ animation: 'sparkleTwinkle 1.5s infinite ease-in-out alternate' }}
        />
        <div 
          className="absolute top-[25%] left-[20%] w-2 h-2 rounded-full bg-[#4ade80]"
          style={{ animation: 'sparkleTwinkle 1.5s infinite ease-in-out alternate 0.4s' }}
        />
        <div 
          className="absolute bottom-[20%] right-[18%] w-1.5 h-1.5 rounded-full bg-[#ffbccc]"
          style={{ animation: 'sparkleTwinkle 1.5s infinite ease-in-out alternate 0.7s' }}
        />
      </div>

      {/* 💨 خطوط السرعة */}
      <div className="absolute w-72 h-44 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-6 right-0 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#ff7396] to-transparent rounded-full"
          style={{ animation: 'windFlow 0.55s linear infinite' }}
        />
        <div 
          className="absolute top-20 right-0 h-0.5 w-36 bg-gradient-to-r from-transparent via-[#4ade80] to-transparent rounded-full"
          style={{ animation: 'windFlow 0.55s linear infinite 0.2s' }}
        />
        <div 
          className="absolute bottom-8 right-0 h-0.5 w-20 bg-gradient-to-r from-transparent via-[#ff7396] to-transparent rounded-full"
          style={{ animation: 'windFlow 0.55s linear infinite 0.35s' }}
        />
      </div>

      {/* 🎭 شخصية الـ Z الكيوت */}
      <div 
        className="relative z-10"
        style={{ animation: 'cuteSprint 0.25s ease-in-out infinite alternate' }}
      >
        <svg width="150" height="185" viewBox="0 0 150 185" fill="none">
          {/* اليد الخلفية مع علبة الهدية الوردية */}
          <g style={{ 
            transformOrigin: '105px 85px', 
            animation: 'armBack 0.25s ease-in-out infinite alternate' 
          }}>
            <path d="M98 86 Q118 78 122 92" stroke="#0d5b51" strokeWidth="6" strokeLinecap="round" fill="none" />
            <rect x="114" y="86" width="16" height="16" rx="4" fill="#ff7396" stroke="#ffffff" strokeWidth="1.2" />
            <path d="M114 94 H130 M122 86 V102" stroke="#ffffff" strokeWidth="1.2" />
          </g>

          {/* الرجل اليسرى */}
          <g style={{ 
            transformOrigin: '52px 145px', 
            animation: 'cuteLegL 0.25s ease-in-out infinite alternate' 
          }}>
            <line x1="52" y1="145" x2="36" y2="170" stroke="#0d5b51" strokeWidth="7.5" strokeLinecap="round" />
            <ellipse cx="30" cy="172" rx="9.5" ry="6" fill="#ff7396" stroke="#ffffff" strokeWidth="1.2" />
          </g>

          {/* الرجل اليمنى */}
          <g style={{ 
            transformOrigin: '95px 145px', 
            animation: 'cuteLegR 0.25s ease-in-out infinite alternate' 
          }}>
            <line x1="95" y1="145" x2="112" y2="170" stroke="#0d5b51" strokeWidth="7.5" strokeLinecap="round" />
            <ellipse cx="118" cy="172" rx="9.5" ry="6" fill="#ff7396" stroke="#ffffff" strokeWidth="1.2" />
          </g>

          {/* يد حقيبة التسوق */}
          <path d="M57 32 C57 14, 93 14, 93 32" stroke="#0d5b51" strokeWidth="6.5" strokeLinecap="round" fill="none" />

          {/* مظلة الشعار */}
          <path d="M38 32 H52 V44 C52 49, 38 49, 38 44 Z" fill="#0d5b51" />
          <path d="M52 32 H67 V44 C67 49, 52 49, 52 44 Z" fill="#ff7396" />
          <path d="M67 32 H82 V44 C82 49, 67 49, 67 44 Z" fill="#ffbccc" />
          <path d="M82 32 H96 V44 C96 49, 82 49, 82 44 Z" fill="#0d5b51" />

          {/* جسم الـ Z */}
          <path 
            d="M 52 51 H 94 C 96 51, 98 52, 96 55 L 69 94 H 104 C 111 94, 116 99, 116 106 C 116 113, 111 118, 104 118 H 49 C 42 118, 38 114, 38 107 V 80 C 38 73, 42 69, 49 69 L 70 51 Z" 
            fill="#0d5b51" 
          />

          {/* عيون لطيفة وابتسامة */}
          <g style={{ 
            transformOrigin: 'center', 
            animation: 'blinkEye 3.2s infinite' 
          }}>
            {/* العين اليسرى */}
            <ellipse cx="68" cy="62" rx="4.5" ry="6" fill="#ffffff" />
            <circle cx="69" cy="62" r="3" fill="#081715" />
            <circle cx="67.5" cy="60" r="1.3" fill="#ffffff" />
            <circle cx="70" cy="63.5" r="0.7" fill="#ffffff" />

            {/* العين اليمنى */}
            <ellipse cx="85" cy="62" rx="4.5" ry="6" fill="#ffffff" />
            <circle cx="86" cy="62" r="3" fill="#081715" />
            <circle cx="84.5" cy="60" r="1.3" fill="#ffffff" />
            <circle cx="87" cy="63.5" r="0.7" fill="#ffffff" />

            {/* الخدود الوردية */}
            <ellipse cx="61" cy="67" rx="3.5" ry="2" fill="#ff7396" opacity="0.8" />
            <ellipse cx="91" cy="67" rx="3.5" ry="2" fill="#ff7396" opacity="0.8" />

            {/* الابتسامة */}
            <path d="M74 66 Q77 70 80 66" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>

          {/* اليد الأمامية مع القفاز */}
          <g style={{ 
            transformOrigin: '38px 90px', 
            animation: 'armFront 0.25s ease-in-out infinite alternate' 
          }}>
            <path d="M42 88 Q24 78 20 64" stroke="#0d5b51" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="19" cy="62" r="4.5" fill="#ffffff" />
          </g>

          {/* الباب الوردي والمقبض */}
          <path d="M45 118 V93 C45 87, 59 87, 59 93 V118 Z" fill="#ffbccc" />
          <circle cx="54.5" cy="106" r="1.8" fill="#ff7396" />
        </svg>
      </div>

      {/* خط الأرض السريع */}
      <div className="w-56 h-[2.5px] mt-2 bg-gradient-to-r from-transparent via-[#ff7396] to-transparent opacity-80" />

      {/* العبارة المتغيرة */}
      <p 
        className="mt-5 text-sm font-bold text-[#e2f7f4] tracking-wide"
        style={{ 
          animation: 'fadeInUp 0.5s ease-out',
          minHeight: '20px',
        }}
        key={textIndex}
      >
        {cutePhrases[textIndex]}
      </p>

      {/* 🌟 شعار zooq */}
      <p className="mt-3 text-[10px] tracking-[0.3em] lowercase text-white/40 font-medium">
        zooq marketplace
      </p>
    </div>
  );
}

export default LoginSplash;