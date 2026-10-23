// src/components/PullToRefresh.tsx

import React, { useState, useRef, useCallback, ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
  lang?: "ar" | "en";
  threshold?: number;
  className?: string;
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  lang = "ar",
  threshold = 80,
  className,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // ✅ فقط إذا كان المستخدم في أعلى الصفحة
    if (window.scrollY > 0) return;
    setStartY(e.touches[0].clientY);
    setIsPulling(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isRefreshing) return;
    if (window.scrollY > 0) {
      setIsPulling(false);
      setPullDistance(0);
      return;
    }

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0) {
      // ✅ مقاومة السحب (كلما سحبت أكثر، صعُب السحب)
      const resistance = Math.min(distance * 0.5, threshold * 1.5);
      setPullDistance(resistance);
    }
  }, [isPulling, isRefreshing, startY, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setIsPulling(false);
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn("relative", className)}
    >
      {/* ✅ مؤشر السحب */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden pointer-events-none z-50 transition-all duration-200"
        style={{ height: `${pullDistance}px` }}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-1 rounded-full",
            isRefreshing && "animate-pulse"
          )}
          style={{
            opacity: progress,
            transform: `scale(${Math.max(0.5, progress)})`,
          }}
        >
          <div
            className={cn(
              "h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center border-2 border-[#2a655f]/30",
              isRefreshing && "border-[#2a655f]"
            )}
          >
            <RefreshCw
              className={cn(
                "h-5 w-5 text-[#2a655f] transition-transform duration-300",
                isRefreshing ? "animate-spin" : ""
              )}
              style={{
                transform: !isRefreshing ? `rotate(${progress * 360}deg)` : undefined,
              }}
            />
          </div>
          <span className="text-[10px] font-medium text-[#2a655f] dark:text-[#3a8a82] whitespace-nowrap">
            {isRefreshing
              ? (lang === "ar" ? "جاري التحديث..." : "Refreshing...")
              : progress >= 1
                ? (lang === "ar" ? "أفلت للتحديث" : "Release to refresh")
                : (lang === "ar" ? "اسحب للتحديث" : "Pull to refresh")}
          </span>
        </div>
      </div>

      {/* ✅ المحتوى */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPulling ? "none" : "transform 0.3s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}