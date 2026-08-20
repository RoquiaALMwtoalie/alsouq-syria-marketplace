// src/components/dashboard/ProductSlider.tsx

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Circle } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductSliderProps {
  products: any[];
  itemsPerView?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
  onView?: (product: any) => void;
  onConvertToOffer?: (product: any) => void;
  onRepublish?: (product: any) => void;
  onAddBogoOffer?: (product: any) => void;
  onRemoveBogoOffer?: (offerId: string) => void;
  onEditPromoOffer?: (offer: any) => void;
  onViewPromoOffer?: (offer: any) => void;
  lang: string;
  currency: string;
  formatPrice: (price: number, currency: string, lang: string) => string;
  viewMode?: 'grid' | 'list';
}

export const ProductSlider = React.memo(function ProductSlider({
  products,
  itemsPerView = 4,
  autoPlay = true,
  autoPlayInterval = 4000,
  onEdit,
  onDelete,
  onView,
  onConvertToOffer,
  onRepublish,
  onAddBogoOffer,
  onRemoveBogoOffer,
  onEditPromoOffer,
  onViewPromoOffer,
  lang,
  currency,
  formatPrice,
  viewMode = 'grid'
}: ProductSliderProps) {
  
  // ===== State =====
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  
  // ===== حسابات =====
  const totalSlides = Math.ceil(products.length / itemsPerView);
  const isLastSlide = currentIndex === totalSlides - 1;
  const isFirstSlide = currentIndex === 0;

  // ===== دوال التنقل =====
  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalSlides - 1)));
  }, [totalSlides]);

  const nextSlide = useCallback(() => {
    if (isLastSlide) {
      goToSlide(0);
    } else {
      goToSlide(currentIndex + 1);
    }
  }, [currentIndex, isLastSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    if (isFirstSlide) {
      goToSlide(totalSlides - 1);
    } else {
      goToSlide(currentIndex - 1);
    }
  }, [currentIndex, isFirstSlide, goToSlide, totalSlides]);

  // ===== Auto-Play =====
  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    if (isAutoPlay && totalSlides > 1 && !isHovering) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlay, totalSlides, nextSlide, autoPlayInterval, isHovering]);

  // ===== Drag/Swipe =====
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = startX - e.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovering(false);
  };

  // ===== لوحة التحكم =====
  const renderControls = () => {
    if (totalSlides <= 1) return null;

    return (
      <>
        {/* السهم الأيسر */}
        <button
          onClick={prevSlide}
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 z-20",
            "h-12 w-12 rounded-full",
            "bg-white/90 dark:bg-slate-900/90",
            "border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30",
            "shadow-xl shadow-black/5",
            "flex items-center justify-center",
            "transition-all duration-300",
            "hover:bg-white dark:hover:bg-slate-900",
            "hover:border-[#2a655f]/50",
            "hover:scale-110 hover:shadow-2xl",
            "group",
            "backdrop-blur-sm"
          )}
          aria-label={lang === 'ar' ? 'السابق' : 'Previous'}
        >
          <ChevronLeft className={cn(
            "h-6 w-6 text-[#2a655f]",
            "transition-transform duration-300",
            "group-hover:-translate-x-0.5"
          )} />
        </button>

        {/* السهم الأيمن */}
        <button
          onClick={nextSlide}
          className={cn(
            "absolute right-4 top-1/2 -translate-y-1/2 z-20",
            "h-12 w-12 rounded-full",
            "bg-white/90 dark:bg-slate-900/90",
            "border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30",
            "shadow-xl shadow-black/5",
            "flex items-center justify-center",
            "transition-all duration-300",
            "hover:bg-white dark:hover:bg-slate-900",
            "hover:border-[#2a655f]/50",
            "hover:scale-110 hover:shadow-2xl",
            "group",
            "backdrop-blur-sm"
          )}
          aria-label={lang === 'ar' ? 'التالي' : 'Next'}
        >
          <ChevronRight className={cn(
            "h-6 w-6 text-[#2a655f]",
            "transition-transform duration-300",
            "group-hover:translate-x-0.5"
          )} />
        </button>

        {/* زر التشغيل/الإيقاف */}
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className={cn(
            "absolute bottom-16 right-4 z-20",
            "h-10 w-10 rounded-full",
            "bg-[#2a655f]/90 hover:bg-[#2a655f]",
            "text-white",
            "shadow-lg shadow-[#2a655f]/30",
            "flex items-center justify-center",
            "transition-all duration-300",
            "hover:scale-110 hover:shadow-2xl",
            "backdrop-blur-sm"
          )}
          aria-label={isAutoPlay ? 'إيقاف التشغيل التلقائي' : 'تشغيل تلقائي'}
        >
          {isAutoPlay ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4 ml-0.5" />
          )}
        </button>
      </>
    );
  };

  // ===== نقاط التنقل =====
  const renderDots = () => {
    if (totalSlides <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        {Array.from({ length: totalSlides }).map((_, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "rounded-full transition-all duration-500",
                "hover:scale-110",
                isActive
                  ? "w-10 h-2.5 bg-[#2a655f] shadow-md shadow-[#2a655f]/30"
                  : "w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-[#2a655f]/50"
              )}
              aria-label={`الانتقال إلى الشريحة ${index + 1}`}
            />
          );
        })}
        
        <span className="text-xs text-muted-foreground ml-2 font-medium">
          {currentIndex + 1} / {totalSlides}
        </span>
      </div>
    );
  };

  // ===== عرض فارغ =====
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {lang === 'ar' ? 'لا توجد منتجات' : 'No products'}
        </p>
      </div>
    );
  }

  // ===== عرض المنتجات =====
  const currentProducts = products.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  return (
    <div 
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      ref={sliderRef}
    >
      {/* ===== حاوية السلايدر ===== */}
      <div
        className="flex gap-4 transition-transform duration-700 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex-shrink-0 transition-opacity duration-500"
            style={{ 
              width: `${100 / itemsPerView}%`,
              opacity: Math.floor(index / itemsPerView) === currentIndex ? 1 : 0.4,
              pointerEvents: Math.floor(index / itemsPerView) === currentIndex ? 'auto' : 'none'
            }}
          >
            <div className="p-1 animate-fade-in-up" style={{ animationDelay: `${(index % itemsPerView) * 0.1}s` }}>
              <ProductCard
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
                onConvertToOffer={onConvertToOffer}
                onRepublish={onRepublish}
                onAddBogoOffer={onAddBogoOffer}
                onRemoveBogoOffer={onRemoveBogoOffer}
                onEditPromoOffer={onEditPromoOffer}
                onViewPromoOffer={onViewPromoOffer}
                lang={lang}
                currency={currency}
                formatPrice={formatPrice}
                viewMode={viewMode}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== أسهم التحكم ===== */}
      {renderControls()}

      {/* ===== نقاط التنقل ===== */}
      {renderDots()}

      {/* ===== مؤشر التقدم ===== */}
      {totalSlides > 1 && isAutoPlay && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2a655f]/10 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82] rounded-full transition-all duration-1000 ease-linear"
            style={{ 
              width: `${((currentIndex + 1) / totalSlides) * 100}%`,
              transition: 'width 1s ease-linear'
            }}
          />
        </div>
      )}
    </div>
  );
});