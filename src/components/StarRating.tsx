// src/components/StarRating.tsx

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false,
  size = "md"
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };
  
  const handleClick = (value: number) => {
    if (readonly || !onRatingChange) return;
    onRatingChange(value);
  };
  
  const handleMouseEnter = (value: number) => {
    if (readonly) return;
    setHoveredRating(value);
  };
  
  const handleMouseLeave = () => {
    if (readonly) return;
    setHoveredRating(0);
  };
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = (hoveredRating || rating) >= star;
        
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={cn(
              "transition-all duration-200",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                isFilled 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "text-slate-300 dark:text-slate-600",
                !readonly && "hover:text-yellow-400"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}