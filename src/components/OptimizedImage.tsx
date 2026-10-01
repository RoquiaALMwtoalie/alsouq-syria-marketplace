// src/components/OptimizedImage.tsx

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill';
  quality?: number;
  transparent?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  priority = false,
  objectFit = 'cover',
  quality = 85,
  transparent = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ تحويل الصورة إلى WebP
  const getOptimizedUrl = (url: string): string => {
    if (!url) return '';

    if (url.includes('supabase.co/storage')) {
      const baseUrl = url.split('?')[0];
      const params = new URLSearchParams();
      params.append('format', 'webp');
      params.append('quality', quality.toString());

      if (width && height) {
        params.append('width', width.toString());
        params.append('height', height.toString());
        params.append('fit', 'cover');
      }

      return `${baseUrl}?${params.toString()}`;
    }

    return url;
  };

  const optimizedSrc = getOptimizedUrl(src);

  // ✅ Lazy loading عبر IntersectionObserver على الـ ref (لا getElementById)
  useEffect(() => {
    if (priority) {
      setIsLoaded(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority]);

  const fallbackSrc = '/images/placeholder.webp';

  // ✅ إذا priority → حمّل مباشرة، وإلا انتظر observer
  const shouldLoad = priority || isLoaded;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        !transparent && 'bg-slate-100 dark:bg-slate-800',
        className
      )}
      // ✅ aspectRatio فقط إذا لم يُمرَّر className فيه h-*
      style={
        className.includes('h-') || className.includes('absolute')
          ? undefined
          : { aspectRatio: `${width}/${height}` }
      }
    >
      {!shouldLoad && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
      )}

      {shouldLoad && (
        <img
          src={error ? fallbackSrc : optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          className={cn(
            'w-full h-full transition-opacity duration-300',
            objectFit === 'cover' && 'object-cover',
            objectFit === 'contain' && 'object-contain',
            objectFit === 'fill' && 'object-fill',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          // ✅ لا نمرّر className هنا — لتجنّب التكرار
        />
      )}
    </div>
  );
}