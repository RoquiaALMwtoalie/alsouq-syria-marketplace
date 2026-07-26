// src/components/search/SearchFilters.tsx
import { useState, useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { useGovernorates, useCategories } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SearchFilters as FiltersType } from "@/lib/hooks/useSearch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Tag,
  DollarSign,
  Star,
  X,
  RotateCcw,
} from "lucide-react";

interface SearchFiltersProps {
  filters: FiltersType;
  setFilter: (key: keyof FiltersType, value: any) => void;
  resetFilters: () => void;
  onClose?: () => void;
}

export function SearchFilters({
  filters,
  setFilter,
  resetFilters,
  onClose,
}: SearchFiltersProps) {
  const app = useApp();
  const { data: governorates = [] } = useGovernorates();
  const { data: categories = [] } = useCategories();
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice || 0,
    filters.maxPrice || 10000000,
  ]);

  // تحديث السعر عند تغيير الفلتر
  useEffect(() => {
    setPriceRange([
      filters.minPrice || 0,
      filters.maxPrice || 10000000,
    ]);
  }, [filters.minPrice, filters.maxPrice]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const applyPriceRange = () => {
    setFilter("minPrice", priceRange[0] > 0 ? priceRange[0] : undefined);
    setFilter("maxPrice", priceRange[1] < 10000000 ? priceRange[1] : undefined);
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof FiltersType] && key !== "sortBy"
  ).length;

  return (
    <div className="p-4 space-y-4">
      {/* ✅ Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {app.lang === "ar" ? "فلتر البحث" : "Search Filters"}
          </h3>
          {activeFiltersCount > 0 && (
            <Badge className="bg-blue-600 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {app.lang === "ar" ? "مسح" : "Reset"}
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <Accordion type="single" collapsible className="space-y-2" defaultValue="governorate">
        {/* ✅ فلتر المحافظة */}
        <AccordionItem value="governorate" className="border rounded-xl px-1">
          <AccordionTrigger className="hover:no-underline py-3 px-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-blue-600" />
              {app.lang === "ar" ? "المحافظة" : "Governorate"}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              <button
                onClick={() => setFilter("governorate", undefined)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted",
                  !filters.governorate && "bg-blue-500/10 text-blue-600 font-medium"
                )}
              >
                {app.lang === "ar" ? "كل المحافظات" : "All Governorates"}
              </button>
              {governorates.map((gov: any) => (
                <button
                  key={gov.id}
                  onClick={() => setFilter("governorate", gov.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted",
                    filters.governorate === gov.id && "bg-blue-500/10 text-blue-600 font-medium"
                  )}
                >
                  {app.lang === "ar" ? gov.name_ar : gov.name_en}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ✅ فلتر التصنيف */}
        <AccordionItem value="category" className="border rounded-xl px-1">
          <AccordionTrigger className="hover:no-underline py-3 px-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Tag className="h-4 w-4 text-emerald-600" />
              {app.lang === "ar" ? "التصنيف" : "Category"}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              <button
                onClick={() => setFilter("category", undefined)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted",
                  !filters.category && "bg-emerald-500/10 text-emerald-600 font-medium"
                )}
              >
                {app.lang === "ar" ? "كل التصنيفات" : "All Categories"}
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter("category", cat.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted",
                    filters.category === cat.id && "bg-emerald-500/10 text-emerald-600 font-medium"
                  )}
                >
                  {app.lang === "ar" ? cat.name_ar : cat.name_en}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ✅ فلتر السعر */}
        <AccordionItem value="price" className="border rounded-xl px-1">
          <AccordionTrigger className="hover:no-underline py-3 px-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <DollarSign className="h-4 w-4 text-purple-600" />
              {app.lang === "ar" ? "نطاق السعر" : "Price Range"}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-3">
              <Slider
                value={priceRange}
                min={0}
                max={10000000}
                step={100000}
                onValueChange={handlePriceChange}
                className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "من" : "From"}
                  </Label>
                  <Input
                    type="number"
                    value={priceRange[0] || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPriceRange([val, priceRange[1]]);
                    }}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "إلى" : "To"}
                  </Label>
                  <Input
                    type="number"
                    value={priceRange[1] || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPriceRange([priceRange[0], val]);
                    }}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <Button
                onClick={applyPriceRange}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                size="sm"
              >
                {app.lang === "ar" ? "تطبيق السعر" : "Apply Price"}
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ✅ فلتر التقييم */}
        <AccordionItem value="rating" className="border rounded-xl px-1">
          <AccordionTrigger className="hover:no-underline py-3 px-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Star className="h-4 w-4 text-yellow-500" />
              {app.lang === "ar" ? "التقييم" : "Rating"}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-1">
              {[4.5, 4, 3.5, 3].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilter("rating", filters.rating === rating ? undefined : rating)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted flex items-center gap-2",
                    filters.rating === rating && "bg-yellow-500/10 text-yellow-600 font-medium"
                  )}
                >
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(rating)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm">{rating}+</span>
                </button>
              ))}
              {filters.rating && (
                <button
                  onClick={() => setFilter("rating", undefined)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                >
                  {app.lang === "ar" ? "إزالة فلتر التقييم" : "Remove rating filter"}
                </button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* ✅ زر تطبيق الفلاتر (للجوال) */}
      {onClose && (
        <Button
          onClick={onClose}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
        >
          {app.lang === "ar" ? "تطبيق الفلاتر" : "Apply Filters"}
        </Button>
      )}
    </div>
  );
}

// ✅ دالة مساعدة لـ cn
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}