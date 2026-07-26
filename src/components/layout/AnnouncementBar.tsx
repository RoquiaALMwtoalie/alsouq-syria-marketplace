import { Megaphone } from "lucide-react";
import { useAnnouncements } from "@/lib/queries";
import { useApp } from "@/lib/i18n";

export function AnnouncementBar() {
  const app = useApp();
  const { data: items = [] } = useAnnouncements();
  if (!items.length) return null;
  // Duplicate content for a seamless marquee loop
  const track = [...items, ...items];
  return (
    <div className="w-full bg-gradient-to-r from-primary via-primary/90 to-primary-glow text-primary-foreground text-xs sm:text-sm overflow-hidden">
      <div className="mx-auto max-w-7xl flex items-center gap-3 px-3 sm:px-4 py-1.5">
        <div className="shrink-0 flex items-center gap-1.5 font-bold opacity-90">
          <Megaphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{app.lang === "ar" ? "إعلانات" : "Announcements"}</span>
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex gap-8 whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
            {track.map((a, i) => {
              const text = app.lang === "ar" ? a.text_ar : (a.text_en || a.text_ar);
              const inner = <span className="inline-flex items-center gap-2">• <span>{text}</span></span>;
              return a.link_url ? (
                <a key={`${a.id}-${i}`} href={a.link_url} className="hover:underline">{inner}</a>
              ) : (
                <span key={`${a.id}-${i}`}>{inner}</span>
              );
            })}
          </div>
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } [dir="rtl"] .animate-\\[marquee_35s_linear_infinite\\] { animation-direction: reverse; }`}</style>
    </div>
  );
}
