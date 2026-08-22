// src/components/OptimizedImage.tsx

import { useState, useEffect } from 'react';
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
}

export function OptimizedImage({ 
  src, 
  alt, 
  width = 400, 
  height = 400,
  className = '',
  priority = false,
  objectFit = 'cover',
  quality = 85
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // ✅ تحويل الصورة إلى WebP
  const getOptimizedUrl = (url: string): string => {
    if (!url) return '';
    
    // ✅ إذا كانت الصورة من Supabase
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

  // ✅ Lazy Loading مع Intersection Observer
  useEffect(() => {
    if (priority) {
      setIsLoaded(true);
      return;
    }

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

    const img = document.getElementById(`img-${src.substring(0, 20)}`);
    if (img) observer.observe(img);

    return () => observer.disconnect();
  }, [src, priority]);

  const fallbackSrc = '/images/placeholder.webp';

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-slate-100 dark:bg-slate-800',
        className
      )}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {!isLoaded && !priority && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
      )}
      
      <img
        id={`img-${src.substring(0, 20)}`}
        src={error ? fallbackSrc : optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'w-full h-full transition-all duration-500',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
          className
        )}
      />
    </div>
  );
}