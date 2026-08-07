import { Megaphone, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { useAnnouncements } from "@/lib/queries";
import { useApp } from "@/lib/i18n";

export function AnnouncementBar() {
  const app = useApp();
  const { data: items = [] } = useAnnouncements();
  
  if (!items.length) return null;

  const track = [...items, ...items];
  const isRtl = app.lang === "ar";

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#173d38] via-[#2a655f] to-[#173d38] text-white shadow-xl border-b border-emerald-400/30">
      
      {/* خلفية ضوئية متحركة ونابضة */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent animate-pulse pointer-events-none" />
      
      {/* خط إشعاعي متحرك في الأعلى */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-300 to-transparent shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

      <style>{`
        @keyframes announcement-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .announcement-track {
          display: flex;
          width: max-content;
          animation: announcement-scroll 25s linear infinite;
          will-change: transform;
        }
        .announcement-track.paused {
          animation-play-state: paused !important;
        }

        {/* تصميم شريط التمرير السفلي للتحكم اليدوي */}
        .announcement-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .announcement-scrollbar::-webkit-scrollbar-track {
          background: rgba(42, 101, 95, 0.2);
          border-radius: 10px;
          margin: 0 16px;
        }
        .announcement-scrollbar::-webkit-scrollbar-thumb {
          background: #34d399;
          border-radius: 10px;
        }
        .announcement-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6ee7b7;
        }
      `}</style>

      {/* الحاوية الرئيسية مع عكس اتجاهها حسب اللغة لضمان مكان الشارة الصحيح */}
      <div 
        className={`mx-auto max-w-7xl flex ${isRtl ? 'flex-row' : 'flex-row-reverse'} items-center gap-3 px-3 sm:px-6 py-2 select-none`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        
        {/* شارة العنوان (تستقر في اليمين تماماً للعربية، وفي اليسار للإنجليزية) */}
        <div className="shrink-0 flex items-center gap-2 bg-black/30 px-3.5 py-1 rounded-full border border-emerald-400/40 shadow-inner z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <Megaphone className="h-3.5 w-3.5 text-emerald-300 animate-bounce" />
          <span className="text-xs font-black tracking-wider text-emerald-200">
            {isRtl ? "تحديثات السوق لعندك" : "Market Updates"}
          </span>
        </div>

        {/* منطقة السلايدر المتحرك مع إضافة شريط التمرير (Scrollbar) والتحكم اليدوي الكامل */}
        <div 
          className="relative flex-1 overflow-x-auto announcement-scrollbar pb-2 pt-0.5"
          dir="ltr"
          onMouseEnter={(e) => {
            const trackElem = e.currentTarget.querySelector(".announcement-track");
            if (trackElem) trackElem.classList.add("paused");
          }}
          onMouseLeave={(e) => {
            const trackElem = e.currentTarget.querySelector(".announcement-track");
            if (trackElem) trackElem.classList.remove("paused");
          }}
        >
          <div className="announcement-track gap-3 py-1">
            {track.map((a, i) => {
              const text = isRtl ? a.text_ar : (a.text_en || a.text_ar);
              
              return (
                <div 
                  key={`${a.id}-${i}`}
                  className="inline-flex items-center gap-2.5 px-3 py-1 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-emerald-500/20 hover:border-emerald-400 hover:scale-[1.02]"
                >
                  <Sparkles className="h-3 w-3 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                  <span className="text-xs sm:text-sm font-semibold text-white/95" dir={isRtl ? "rtl" : "ltr"}>{text}</span>
                  
                  {a.link_url && (
                    <a
                      href={a.link_url}
                      className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-400 text-[#0d2e2a] hover:bg-white hover:text-[#2a655f] transition-all duration-300 text-[11px] font-extrabold shadow-sm"
                    >
                      <span>{isRtl ? "تفاصيل" : "Explore"}</span>
                      {isRtl ? (
                        <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      )}
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}