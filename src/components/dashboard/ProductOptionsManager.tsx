// src/components/dashboard/ProductOptionsManager.tsx

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
  Plus, X, Layers, Palette, Ruler, Box, Droplet, 
  Weight, Sparkles, Tag, RefreshCw, Trash2,
  CheckCircle2, Shirt, Smartphone, Home, Watch, 
  Gift, Footprints, BookOpen, Dumbbell, Gamepad2,
  Coffee, Utensils, Wrench, BadgePercent, Ticket,
  Star, Clock, Shield, Award, Zap, Heart,
  Globe, MapPin, Calendar, User, Hash, 
  Ruler as RulerIcon, Scale, Battery, Camera,
  HardDrive, Cpu, Wifi, Bluetooth,
  Monitor, type LucideIcon, AlertCircle, Edit2, Save,
  Info, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ImageInput } from "@/components/ImageInput";
import { useApp } from "@/lib/i18n";

// ============================================================
// 📦 واجهات
// ============================================================
export interface Variation {
  id: string;
  combination: Record<string, string>;
  is_available: boolean;
  sku?: string;
  price?: number;
  old_price?: number;
  is_new?: boolean;
  stock_quantity?: number;
}

export interface ColorWithImage {
  name: string;
  image: string;
  hex?: string;
}

// ✅ ✅ ✅ واجهة الخيارات المتاحة من الـ DB
export interface AvailableOption {
  key: string;
  name_ar: string;
  name_en: string;
  type: "text" | "select" | "color" | "number";
  required: boolean;
  sort_order: number;
}

interface ProductOptionsManagerProps {
  value: Record<string, string[]>;
  onChange: (value: Record<string, string[]>) => void;
  lang: string;
  readOnly?: boolean;
  variations?: Variation[];
  onVariationsChange?: (variations: Variation[]) => void;
  userId?: string;
  onColorsWithImagesChange?: (colors: ColorWithImage[]) => void;
  externalColorImages?: Record<string, string>;
  sizes?: string[];
  onSizesChange?: (sizes: string[]) => void;
  isOffer?: boolean;
  // ✅ ✅ ✅ الخيارات المتاحة من التصنيف
  availableOptions?: AvailableOption[];
}

export function ProductOptionsManager({ 
  value, 
  onChange, 
  lang,
  readOnly = false,
  variations = [],
  onVariationsChange,
  userId = '',
  onColorsWithImagesChange,
  externalColorImages = {},
  sizes = [],
  onSizesChange,
  isOffer = false,
  availableOptions = [],
}: ProductOptionsManagerProps) {
  const app = useApp();
  
  // ✅ ✅ ✅ قاموس شامل لكل الخيارات الممكنة (للأيقونات والألوان)
  const ALL_OPTION_TYPES: Record<string, { icon: any; emoji: string; color: string; description_ar: string; description_en: string }> = {
    colors: { icon: Palette, emoji: '🎨', color: '#2a655f', description_ar: 'أضف ألوان المنتج مع صور', description_en: 'Add product colors with images' },
    sizes: { icon: Ruler, emoji: '📏', color: '#2a655f', description_ar: 'أضف المقاسات المتوفرة', description_en: 'Add available sizes' },
    size: { icon: Ruler, emoji: '📏', color: '#2a655f', description_ar: 'أضف الحجم', description_en: 'Add size' },
    models: { icon: Box, emoji: '📐', color: '#2a655f', description_ar: 'أضف النماذج المختلفة', description_en: 'Add different models' },
    materials: { icon: Droplet, emoji: '🧵', color: '#2a655f', description_ar: 'أضف أنواع المواد', description_en: 'Add material types' },
    fabric: { icon: Shirt, emoji: '👕', color: '#2a655f', description_ar: 'أضف أنواع الأقمشة', description_en: 'Add fabric types' },
    style: { icon: Sparkles, emoji: '✨', color: '#2a655f', description_ar: 'أضف أنماط التصميم', description_en: 'Add design styles' },
    season: { icon: Calendar, emoji: '🌤️', color: '#2a655f', description_ar: 'أضف المواسم', description_en: 'Add seasons' },
    gender: { icon: User, emoji: '👫', color: '#2a655f', description_ar: 'أضف الفئات الجنسية', description_en: 'Add gender categories' },
    brand: { icon: Tag, emoji: '🏷️', color: '#2a655f', description_ar: 'أضف الماركات', description_en: 'Add brands' },
    storage: { icon: HardDrive, emoji: '💾', color: '#2a655f', description_ar: 'أضف سعات التخزين', description_en: 'Add storage capacities' },
    ram: { icon: Cpu, emoji: '🧠', color: '#2a655f', description_ar: 'أضف سعات الذاكرة', description_en: 'Add RAM capacities' },
    processor: { icon: Cpu, emoji: '⚡', color: '#2a655f', description_ar: 'أضف أنواع المعالجات', description_en: 'Add processor types' },
    battery: { icon: Battery, emoji: '🔋', color: '#2a655f', description_ar: 'أضف سعات البطارية', description_en: 'Add battery capacities' },
    screen_size: { icon: Smartphone, emoji: '📱', color: '#2a655f', description_ar: 'أضف أحجام الشاشات', description_en: 'Add screen sizes' },
    camera: { icon: Camera, emoji: '📷', color: '#2a655f', description_ar: 'أضف دقات الكاميرا', description_en: 'Add camera resolutions' },
    connectivity: { icon: Wifi, emoji: '📶', color: '#2a655f', description_ar: 'أضف أنواع الاتصال', description_en: 'Add connectivity types' },
    dimensions: { icon: Ruler, emoji: '📐', color: '#2a655f', description_ar: 'أضف الأبعاد', description_en: 'Add dimensions' },
    weight: { icon: Weight, emoji: '⚖️', color: '#2a655f', description_ar: 'أضف الأوزان', description_en: 'Add weights' },
    volume: { icon: Droplet, emoji: '🧴', color: '#2a655f', description_ar: 'أضف الأحجام', description_en: 'Add volumes' },
    concentration: { icon: Droplet, emoji: '💧', color: '#2a655f', description_ar: 'أضف التركيزات', description_en: 'Add concentrations' },
    notes: { icon: Star, emoji: '🌸', color: '#2a655f', description_ar: 'أضف المكونات العطرية', description_en: 'Add fragrance notes' },
    language: { icon: Globe, emoji: '🌐', color: '#2a655f', description_ar: 'أضف اللغات', description_en: 'Add languages' },
    pages: { icon: BookOpen, emoji: '📖', color: '#2a655f', description_ar: 'أضف عدد الصفحات', description_en: 'Add page count' },
    author: { icon: User, emoji: '✍️', color: '#2a655f', description_ar: 'أضف المؤلفين', description_en: 'Add authors' },
    publisher: { icon: Home, emoji: '🏢', color: '#2a655f', description_ar: 'أضف الناشرين', description_en: 'Add publishers' },
    age_group: { icon: User, emoji: '👶', color: '#2a655f', description_ar: 'أضف الفئات العمرية', description_en: 'Add age groups' },
    platform: { icon: Gamepad2, emoji: '🎮', color: '#2a655f', description_ar: 'أضف المنصات', description_en: 'Add platforms' },
    pet_type: { icon: Heart, emoji: '🐾', color: '#2a655f', description_ar: 'أضف أنواع الحيوانات', description_en: 'Add pet types' },
    occasion: { icon: Gift, emoji: '🎉', color: '#2a655f', description_ar: 'أضف المناسبات', description_en: 'Add occasions' },
    expiry: { icon: Clock, emoji: '📅', color: '#2a655f', description_ar: 'أضف تاريخ الانتهاء', description_en: 'Add expiry date' },
    discount_type: { icon: BadgePercent, emoji: '🏷️', color: '#2a655f', description_ar: 'أضف نوع الخصم', description_en: 'Add discount type' },
    discount_value: { icon: BadgePercent, emoji: '💰', color: '#2a655f', description_ar: 'أضف قيمة الخصم', description_en: 'Add discount value' },
    shades: { icon: Palette, emoji: '🎨', color: '#2a655f', description_ar: 'أضف الدرجات', description_en: 'Add shades' },
    skin_type: { icon: User, emoji: '💆', color: '#2a655f', description_ar: 'أضف أنواع البشرة', description_en: 'Add skin types' },
  };

  // ✅ ✅ ✅ بناء OPTION_TYPES من availableOptions فقط
  const OPTION_TYPES = useMemo(() => {
    if (!availableOptions || availableOptions.length === 0) {
      return [];
    }
    
    const isArabic = app.lang === 'ar';
    
    return availableOptions
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((opt) => {
        const meta = ALL_OPTION_TYPES[opt.key] || {
          icon: Tag,
          emoji: '📦',
          color: '#2a655f',
          description_ar: 'خيار مخصص',
          description_en: 'Custom option',
        };
        
        return {
          id: opt.key,
          label: isArabic ? opt.name_ar : opt.name_en,
          icon: meta.icon,
          color: meta.color,
          emoji: meta.emoji,
          description: isArabic ? meta.description_ar : meta.description_en,
          type: opt.type,
          required: opt.required,
        };
      });
  }, [availableOptions, app.lang]);

  // ✅ ✅ ✅ إضافة الألوان تلقائياً إذا كان في availableOptions
  const hasColorsOption = useMemo(() => {
    return availableOptions.some(opt => opt.key === 'colors' || opt.key === 'shades');
  }, [availableOptions]);

  const [newValue, setNewValue] = useState("");
  const [activeType, setActiveType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [localVariations, setLocalVariations] = useState<Variation[]>(variations);
  const [colorImages, setColorImages] = useState<Record<string, string>>(externalColorImages);
  const [tempColorImage, setTempColorImage] = useState("");
  const [editingVariation, setEditingVariation] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  
  const isGeneratingRef = useRef(false);
  const isDeletingRef = useRef(false);
  const lastManualActionRef = useRef<{ type: 'delete' | 'generate' | null; timestamp: number }>({
    type: null,
    timestamp: 0
  });
  const previousStateRef = useRef<string>('');
  const [deletedVariationsBackup, setDeletedVariationsBackup] = useState<Variation[]>([]);
  const [showRestoreButton, setShowRestoreButton] = useState(false);
  const isInitialLoadRef = useRef(true);

  // ✅ ✅ ✅ تعيين activeType تلقائياً لأول خيار متاح
  useEffect(() => {
    if (OPTION_TYPES.length > 0 && !activeType) {
      setActiveType(OPTION_TYPES[0].id);
    }
  }, [OPTION_TYPES, activeType]);

  const getActiveOptionsCount = (options: Record<string, string[]>): number => {
    return Object.values(options).filter(arr => arr && arr.length > 0).length;
  };

  useEffect(() => {
    console.log("🔍 [ProductOptionsManager] Syncing variations from props:", variations.length);
    if (variations.length > 0) {
      setLocalVariations(variations);
      isInitialLoadRef.current = false;
    } else {
      setLocalVariations(variations);
    }
  }, [variations]);

  useEffect(() => {
    setColorImages(externalColorImages);
  }, [externalColorImages]);

  const notifyColorsChange = (colors: string[], images: Record<string, string>) => {
    if (onColorsWithImagesChange) {
      const colorData = colors.map(name => ({
        name,
        image: images[name] || '',
      }));
      onColorsWithImagesChange(colorData);
    }
  };

  const recordManualAction = useCallback((type: 'delete' | 'generate') => {
    lastManualActionRef.current = {
      type,
      timestamp: Date.now()
    };
  }, []);

  const isManualAction = useCallback((currentState: Variation[]): boolean => {
    const now = Date.now();
    const timeSinceLastAction = now - lastManualActionRef.current.timestamp;
    
    if (lastManualActionRef.current.type && timeSinceLastAction < 500) {
      return true;
    }
    
    if (currentState.length === 0 && lastManualActionRef.current.type === 'delete') {
      return true;
    }
    
    return false;
  }, []);

  useEffect(() => {
    if (isGeneratingRef.current) {
      console.log('⏳ [Auto-Generate] Generation in progress, skipping...');
      return;
    }
    
    if (isDeletingRef.current) {
      console.log('⏳ [Auto-Generate] Deletion in progress, skipping...');
      return;
    }
    
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      console.log('ℹ️ [Auto-Generate] Initial load - skipping auto-generation');
      return;
    }

    const activeTypes = Object.keys(value).filter(key => value[key] && value[key].length > 0);
    const activeOptionsCount = activeTypes.length;
    
    console.log(`📊 [Auto-Generate] Active options: ${activeOptionsCount}`, activeTypes);

    if (activeOptionsCount >= 2) {
      console.log('🔄 [Auto-Generate] 2+ options active, allowing regeneration...');
    } else {
      if (localVariations.length > 0) {
        console.log('🗑️ [Auto-Generate] Less than 2 options, clearing variations');
        isGeneratingRef.current = true;
        setLocalVariations([]);
        if (onVariationsChange) onVariationsChange([]);
        setTimeout(() => { isGeneratingRef.current = false; }, 100);
      }
      return;
    }

    if (value.colors && value.colors.length > 0) {
      const colorsWithoutImage = value.colors.filter(c => !colorImages[c]);
      if (colorsWithoutImage.length > 0) {
        console.log(`⚠️ [Auto-Generate] ${colorsWithoutImage.length} colors without image, clearing variations`);
        if (localVariations.length > 0) {
          isGeneratingRef.current = true;
          setLocalVariations([]);
          if (onVariationsChange) onVariationsChange([]);
          setTimeout(() => { isGeneratingRef.current = false; }, 100);
        }
        return;
      }
    }

    const generatedVariations = generateVariationsAuto(value, colorImages);
    
    if (generatedVariations.length === 0) {
      if (localVariations.length > 0) {
        console.log('🗑️ [Auto-Generate] No variations generated, clearing');
        isGeneratingRef.current = true;
        setLocalVariations([]);
        if (onVariationsChange) onVariationsChange([]);
        setTimeout(() => { isGeneratingRef.current = false; }, 100);
      }
      return;
    }

    const variationsWithDefaults = generatedVariations.map(v => {
      const existingVariation = localVariations.find(existing => {
        const existingKeys = Object.keys(existing.combination);
        const newKeys = Object.keys(v.combination);
        
        if (existingKeys.length !== newKeys.length) return false;
        
        return existingKeys.every(key => 
          existing.combination[key] === v.combination[key]
        );
      });
      
      const isNew = !existingVariation;
      
      return {
        ...v,
        price: existingVariation?.price ?? 0,
        old_price: existingVariation?.old_price ?? 0,
        stock_quantity: existingVariation?.stock_quantity ?? 0,
        is_available: existingVariation?.is_available ?? true,
        is_new: isNew,
      };
    });

    const currentKeys = new Set(
      localVariations.map(v => JSON.stringify(v.combination))
    );
    const newKeys = new Set(
      variationsWithDefaults.map(v => JSON.stringify(v.combination))
    );
    
    const isDifferent = 
      localVariations.length !== variationsWithDefaults.length ||
      [...newKeys].some(key => !currentKeys.has(key));

    if (!isDifferent) {
      console.log('ℹ️ [Auto-Generate] Variations unchanged, skipping');
      return;
    }

    const hasNewVariations = variationsWithDefaults.some(v => v.is_new);
    if (hasNewVariations) {
      const newVariationsCount = variationsWithDefaults.filter(v => v.is_new).length;
      toast.info(
        lang === "ar" 
          ? `📝 تم توليد ${newVariationsCount} تركيبة جديدة، الرجاء إدخال الأسعار لكل تركيبة (مظللة بالأصفر)`
          : `📝 ${newVariationsCount} new variations generated, please enter prices for each (highlighted in yellow)`,
        { duration: 5000 }
      );
    }

    console.log(`🔄 [Auto-Generate] Regenerating ${variationsWithDefaults.length} variations (was ${localVariations.length})`);
    console.log('📊 [Auto-Generate] Active options:', activeTypes);
    console.log('📊 [Auto-Generate] New variations:', variationsWithDefaults.filter(v => v.is_new).length);
    
    isGeneratingRef.current = true;
    setLocalVariations(variationsWithDefaults);
    if (onVariationsChange) {
      onVariationsChange(variationsWithDefaults);
    }
    
    setTimeout(() => { 
      isGeneratingRef.current = false;
      console.log('✅ [Auto-Generate] Generation completed');
    }, 100);
    
  }, [value, colorImages, localVariations, onVariationsChange]);

  const generateVariationsAuto = (
    currentValue: Record<string, string[]>, 
    currentColorImages: Record<string, string>
  ): Variation[] => {
    const activeTypes: Record<string, string[]> = {};
    Object.keys(currentValue).forEach(key => {
      if (currentValue[key] && currentValue[key].length > 0) {
        activeTypes[key] = currentValue[key];
      }
    });
    
    const typeKeys = Object.keys(activeTypes);
    if (typeKeys.length < 2) return [];

    if (activeTypes.colors) {
      const colorsWithoutImage = activeTypes.colors.filter(c => !currentColorImages[c]);
      if (colorsWithoutImage.length > 0) return [];
    }

    const allVariations: Variation[] = [];

    const generateAllCombinations = (types: string[], index: number, current: Record<string, string>) => {
      if (index === types.length) {
        const exists = allVariations.some(v => {
          return Object.keys(current).every(key => v.combination[key] === current[key]);
        });
        
        if (!exists) {
          allVariations.push({
            id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            combination: { ...current },
            is_available: true,
            price: 0,
            old_price: 0,
            stock_quantity: 0,
          });
        }
        return;
      }

      const type = types[index];
      const values = activeTypes[type];
      
      values.forEach(val => {
        current[type] = val;
        generateAllCombinations(types, index + 1, current);
      });
      
      delete current[type];
    };

    generateAllCombinations(typeKeys, 0, {});
    return allVariations;
  };

  const generateVariations = useCallback(() => {
    const activeTypes: Record<string, string[]> = {};
    Object.keys(value).forEach(key => {
      if (value[key] && value[key].length > 0) {
        activeTypes[key] = value[key];
      }
    });
    
    const typeKeys = Object.keys(activeTypes);
    
    if (typeKeys.length < 2) {
      toast.error(lang === "ar" 
        ? "⚠️ يجب اختيار نوعين من الخيارات على الأقل (مثل: ألوان + مقاسات)" 
        : "⚠️ Select at least two option types (e.g., Colors + Sizes)"
      );
      return;
    }

    if (activeTypes.colors) {
      const colorsWithoutImage = activeTypes.colors.filter(c => !colorImages[c]);
      if (colorsWithoutImage.length > 0) {
        toast.error(
          lang === "ar" 
            ? `⚠️ الألوان التالية بدون صورة: ${colorsWithoutImage.join(', ')}` 
            : `⚠️ The following colors have no image: ${colorsWithoutImage.join(', ')}`
        );
        return;
      }
    }

    recordManualAction('generate');

    const allVariations: Variation[] = [];
    
    const generateAllCombinations = (types: string[], index: number, current: Record<string, string>) => {
      if (index === types.length) {
        allVariations.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          combination: { ...current },
          is_available: true,
          price: 0,
          old_price: 0,
          stock_quantity: 0,
        });
        return;
      }

      const type = types[index];
      const values = activeTypes[type];
      
      values.forEach(val => {
        current[type] = val;
        generateAllCombinations(types, index + 1, current);
      });
      
      delete current[type];
    };

    generateAllCombinations(typeKeys, 0, {});

    if (allVariations.length > 0) {
      const variationsWithDefaults = allVariations.map(v => ({
        ...v,
        price: 0,
        old_price: 0,
        stock_quantity: 0,
        is_new: true,
      }));
      
      setLocalVariations(variationsWithDefaults);
      if (onVariationsChange) {
        onVariationsChange(variationsWithDefaults);
      }
      
      setShowRestoreButton(false);
      setDeletedVariationsBackup([]);
      
      toast.success(
        lang === "ar" 
          ? `✅ تم توليد ${allVariations.length} تركيبة جديدة (من ${typeKeys.length} أنواع)` 
          : `✅ Generated ${allVariations.length} new variations (from ${typeKeys.length} types)`
      );
    } else {
      toast.info(lang === "ar" ? "💡 لا توجد تركيبات جديدة" : "💡 No new variations");
    }
  }, [value, colorImages, lang, onVariationsChange, recordManualAction]);

  const removeAllVariations = useCallback(() => {
    if (localVariations.length > 0) {
      setDeletedVariationsBackup(localVariations);
      setShowRestoreButton(true);
    }
    
    recordManualAction('delete');
    isDeletingRef.current = true;
    
    setLocalVariations([]);
    if (onVariationsChange) {
      onVariationsChange([]);
    }
    
    previousStateRef.current = JSON.stringify([]);
    
    toast.success(
      lang === "ar" 
        ? "✅ تم حذف جميع التركيبات (يمكنك استعادتها)" 
        : "✅ All variations deleted (you can restore them)"
    );
    
    setTimeout(() => {
      isDeletingRef.current = false;
      setTimeout(() => {
        if (lastManualActionRef.current.type === 'delete') {
          lastManualActionRef.current.type = null;
        }
      }, 1000);
    }, 600);
  }, [localVariations, lang, onVariationsChange, recordManualAction]);

  const restoreVariations = useCallback(() => {
    if (deletedVariationsBackup.length === 0) {
      toast.info(lang === "ar" ? "💡 لا توجد تركيبات لاستعادتها" : "💡 No variations to restore");
      return;
    }
    
    setLocalVariations(deletedVariationsBackup);
    if (onVariationsChange) {
      onVariationsChange(deletedVariationsBackup);
    }
    
    setShowRestoreButton(false);
    setDeletedVariationsBackup([]);
    
    toast.success(
      lang === "ar" 
        ? `✅ تم استعادة ${deletedVariationsBackup.length} تركيبة` 
        : `✅ Restored ${deletedVariationsBackup.length} variations`
    );
  }, [deletedVariationsBackup, lang, onVariationsChange]);

  const addOption = (type: string, imageUrl?: string) => {
    const val = newValue.trim();
    if (!val) {
      toast.error(lang === "ar" ? "⚠️ الرجاء إدخال قيمة" : "⚠️ Please enter a value");
      return false;
    }
    if (value[type]?.includes(val)) {
      toast.error(lang === "ar" ? "⚠️ هذه القيمة موجودة بالفعل" : "⚠️ This value already exists");
      return false;
    }
    
    if (type === 'colors') {
      if (!imageUrl || !imageUrl.trim()) {
        toast.error(lang === "ar" ? "⚠️ الرجاء رفع صورة للون" : "⚠️ Please upload an image for the color");
        return false;
      }
      
      const newColorImages = { ...colorImages, [val]: imageUrl };
      setColorImages(newColorImages);
      
      const newColors = [...(value.colors || []), val];
      if (onColorsWithImagesChange) {
        const colorData = newColors.map(name => ({
          name,
          image: newColorImages[name] || '',
        }));
        onColorsWithImagesChange(colorData);
      }
    }
    
    const newValueArray = [...(value[type] || []), val];
    onChange({
      ...value,
      [type]: newValueArray,
    });
    
    setNewValue("");
    setTempColorImage("");
    toast.success(lang === "ar" ? `✅ تم إضافة "${val}"` : `✅ Added "${val}"`);
    return true;
  };

  const removeOption = (type: string, option: string) => {
    console.log(`🗑️ [removeOption] Removing "${option}" from "${type}"`);
    
    const newValues = value[type]?.filter((v: string) => v !== option) || [];
    onChange({
      ...value,
      [type]: newValues,
    });
    
    if (type === 'colors') {
      const newImages = { ...colorImages };
      delete newImages[option];
      setColorImages(newImages);
      notifyColorsChange(newValues, newImages);
    }
    
    isDeletingRef.current = false;
    
    toast.info(lang === "ar" ? `🗑️ تم حذف "${option}"` : `🗑️ Deleted "${option}"`);
  };

  const removeAll = (type: string) => {
    console.log(`🗑️ [removeAll] Removing all from "${type}"`);
    
    onChange({
      ...value,
      [type]: [],
    });
    
    if (type === 'colors') {
      setColorImages({});
      notifyColorsChange([], {});
    }
    
    isDeletingRef.current = false;
    
    toast.info(lang === "ar" ? "🗑️ تم حذف الكل" : "🗑️ Deleted all");
  };

  const toggleVariationAvailability = (variationId: string) => {
    const updated = localVariations.map(v => 
      v.id === variationId ? { ...v, is_available: !v.is_available } : v
    );
    setLocalVariations(updated);
    if (onVariationsChange) {
      onVariationsChange(updated);
    }
  };

  const removeVariation = (variationId: string) => {
    const updated = localVariations.filter(v => v.id !== variationId);
    setLocalVariations(updated);
    if (onVariationsChange) {
      onVariationsChange(updated);
    }
    toast.success(lang === "ar" ? "✅ تم حذف التركيبة" : "✅ Variation deleted");
  };

  const totalOptions = Object.values(value).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  const availableVariations = localVariations.filter(v => v.is_available).length;
  const unavailableVariations = localVariations.filter(v => !v.is_available).length;
  const newVariationsCount = localVariations.filter(v => v.is_new).length;

  const colorList = (value.colors || []).map(name => ({
    name,
    image: colorImages[name] || '',
  }));

  const filteredTypes = OPTION_TYPES.filter(type => 
    type.label.includes(searchTerm) || 
    type.id.includes(searchTerm) ||
    type.emoji.includes(searchTerm)
  );

  // ✅ ✅ ✅ إذا ما في خيارات متاحة
  if (OPTION_TYPES.length === 0) {
    return (
      <div className="p-6 text-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2">
          <Layers className="h-6 w-6 text-[#2a655f]/50" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {lang === "ar" ? "لا توجد خيارات متاحة لهذا التصنيف" : "No options available for this category"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {lang === "ar" 
            ? "اختر تصنيفاً رئيسياً من قسم الأساسيات لعرض الخيارات المتاحة" 
            : "Select a main category from Basic section to show available options"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] flex items-center justify-center text-white shadow-md shadow-[#2a655f]/20 shrink-0">
            <Layers className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {lang === "ar" ? "خيارات المنتج" : "Product Options"}
            </h4>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
              <span>{lang === "ar" ? `${totalOptions} خيار` : `${totalOptions} options`}</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="text-[#2a655f] dark:text-[#3a8a82] font-medium">
                {lang === "ar" ? `${OPTION_TYPES.length} نوع متاح` : `${OPTION_TYPES.length} types available`}
              </span>
              {localVariations.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ✅ {availableVariations} / {localVariations.length} {lang === "ar" ? "تركيبة" : "variations"}
                  </span>
                </>
              )}
              {newVariationsCount > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <Badge className="bg-yellow-500 text-white border-0 text-[10px] animate-pulse">
                    🆕 {newVariationsCount} {lang === "ar" ? "جديد" : "new"}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
          {!readOnly && localVariations.length > 0 && (
            <>
              {showRestoreButton && deletedVariationsBackup.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30 transition-all duration-300 hover:scale-105 h-8 px-3 text-xs"
                  onClick={restoreVariations}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" />
                  {lang === "ar" ? "استعادة" : "Restore"}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200/50 dark:border-red-800/30 transition-all duration-300 hover:scale-105 h-8 px-3 text-xs"
                onClick={removeAllVariations}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                {lang === "ar" ? "حذف الكل" : "Delete All"}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ===== Search ===== */}
      <div className="relative group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={lang === "ar" ? "🔍 ابحث عن خيار..." : "🔍 Search for an option..."}
          className="w-full h-10 sm:h-11 px-4 rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 text-xs sm:text-sm hover:border-[#2a655f]/30"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-[#2a655f] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ===== Types Tabs ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
        {filteredTypes.map((type) => {
          const count = value[type.id]?.length || 0;
          const Icon = type.icon;
          const isActive = activeType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => !readOnly && setActiveType(type.id)}
              className={cn(
                "relative flex flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-2 sm:py-2.5 rounded-lg border-2 transition-all duration-300 group min-w-0",
                isActive && !readOnly
                  ? "border-[#2a655f] bg-[#2a655f]/10 dark:bg-[#2a655f]/20 shadow-md shadow-[#2a655f]/20"
                  : "border-slate-200/50 dark:border-slate-800/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10",
                readOnly && "cursor-default opacity-75"
              )}
            >
              {type.required && (
                <span className="absolute -top-1 -end-1 text-red-500 text-[10px] font-bold bg-white dark:bg-slate-900 rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm z-10">*</span>
              )}
              <span className="text-sm sm:text-base group-hover:scale-110 transition-transform duration-300 flex-shrink-0">{type.emoji}</span>
              <span className="text-[11px] sm:text-xs font-medium group-hover:text-[#2a655f] transition-colors truncate">{type.label}</span>
              {count > 0 && (
                <Badge className="bg-[#2a655f] text-white border-0 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-3.5 sm:h-4 min-w-3.5 sm:min-w-4 flex items-center justify-center shrink-0">
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* ===== Active Type Panel ===== */}
      {activeType && !readOnly && (
        <div className="rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-3 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-base">
                {OPTION_TYPES.find(t => t.id === activeType)?.emoji}
              </span>
              <Label className="text-sm font-semibold text-[#2a655f] dark:text-[#3a8a82]">
                {OPTION_TYPES.find(t => t.id === activeType)?.label}
              </Label>
              <Badge variant="outline" className="text-[10px] border-[#2a655f]/30 text-[#2a655f]">
                {value[activeType]?.length || 0}
              </Badge>
              {OPTION_TYPES.find(t => t.id === activeType)?.required && (
                <Badge className="text-[10px] bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30 animate-pulse">
                  ⚠️ {lang === "ar" ? "مطلوب" : "Required"}
                </Badge>
              )}
              {activeType === 'colors' && (
                <Badge className="text-[10px] bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30 animate-pulse">
                  📸 {lang === "ar" ? "صورة مطلوبة" : "Image required"}
                </Badge>
              )}
            </div>
            {value[activeType]?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 h-7 px-2 rounded-lg transition-all duration-300 hover:scale-105 self-start sm:self-auto"
                onClick={() => removeAll(activeType)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {lang === "ar" ? "حذف الكل" : "Delete all"}
              </Button>
            )}
          </div>

          {/* عرض الألوان المضافة */}
          {activeType === 'colors' && colorList.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {colorList.map(({ name, image }) => (
                <div key={name} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/50 group hover:border-[#2a655f]/30 transition-all duration-300">
                  {image ? (
                    <img src={image} alt={name} className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded bg-red-200 flex items-center justify-center text-[8px] text-red-600">⚠️</div>
                  )}
                  <span className="text-xs font-medium">{name}</span>
                  <button
                    onClick={() => removeOption(activeType, name)}
                    className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* عرض القيم المضافة لباقي الأنواع */}
          {activeType !== 'colors' && value[activeType]?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {value[activeType].map((val: string) => (
                <Badge key={val} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-sm group hover:border-[#2a655f]/30 transition-all duration-300">
                  {val}
                  <button
                    onClick={() => removeOption(activeType, val)}
                    className="ml-2 text-muted-foreground hover:text-red-500 transition-colors hover:scale-110"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* حقل الإضافة */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 min-w-0">
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (activeType === 'colors') {
                      if (!tempColorImage || !tempColorImage.trim()) {
                        toast.error(lang === "ar" ? "⚠️ الرجاء رفع صورة للون" : "⚠️ Please upload color image");
                        return;
                      }
                      const success = addOption(activeType, tempColorImage);
                      if (success) setTempColorImage("");
                    } else {
                      addOption(activeType);
                    }
                  }
                }}
                placeholder={
                  lang === "ar" 
                    ? `أضف ${OPTION_TYPES.find(t => t.id === activeType)?.label || ''}...` 
                    : `Add ${OPTION_TYPES.find(t => t.id === activeType)?.id || ''}...`
                }
                className="h-10 sm:h-11 text-xs sm:text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
              />
            </div>
            
            <div className="flex items-center gap-2 shrink-0">
              {activeType === 'colors' && (
                <div className="relative shrink-0">
                  <ImageInput
                    value={tempColorImage}
                    onChange={(url) => {
                      setTempColorImage(url);
                    }}
                    userId={userId}
                    folder="product-colors"
                    lang={lang}
                    label=""
                    previewClassName="h-10 sm:h-11 w-12 sm:w-14 rounded-lg object-cover border-2 border-[#2a655f]/20 hover:border-[#2a655f]/40 transition-all"
                    showLabel={false}
                  />
                  {!tempColorImage && (
                    <p className="absolute -bottom-5 left-0 text-[10px] text-red-500 whitespace-nowrap">
                      {lang === "ar" ? "صورة مطلوبة" : "Image required"}
                    </p>
                  )}
                </div>
              )}
              
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (activeType === 'colors') {
                    if (!tempColorImage || !tempColorImage.trim()) {
                      toast.error(lang === "ar" ? "⚠️ الرجاء رفع صورة للون" : "⚠️ Please upload color image");
                      return;
                    }
                    const success = addOption(activeType, tempColorImage);
                    if (success) setTempColorImage("");
                  } else {
                    addOption(activeType);
                  }
                }}
                className="h-10 sm:h-11 px-4 sm:px-5 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-md shadow-[#2a655f]/20 hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 text-xs sm:text-sm shrink-0"
              >
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 me-1 sm:me-1.5" />
                {lang === "ar" ? "إضافة" : "Add"}
              </Button>
            </div>
          </div>

          {value[activeType]?.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1 animate-pulse">
              <Info className="h-3 w-3 text-[#2a655f]" />
              {lang === "ar" 
                ? `💡 اكتب قيمة ثم اضغط "إضافة" لإضافة ${OPTION_TYPES.find(t => t.id === activeType)?.label}` 
                : `💡 Enter a value then click "Add" to add ${OPTION_TYPES.find(t => t.id === activeType)?.id}`}
            </p>
          )}
        </div>
      )}

      {!readOnly && (
        <div className="space-y-3">
          {/* تنبيه التوليد التلقائي */}
          {Object.keys(value).filter(key => value[key] && value[key].length > 0).length >= 2 && (
            <div className="rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
              <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                {lang === "ar" 
                  ? `✅ يتم توليد التركيبات تلقائياً عند إضافة أو حذف الخيارات` 
                  : `✅ Variations are generated automatically when adding or removing options`}
              </p>
            </div>
          )}

          {/* زر التوليد اليدوي */}
          {Object.keys(value).filter(key => value[key] && value[key].length > 0).length >= 2 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={generateVariations}
                className="flex-1 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-md shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] group h-11 text-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-700" />
                {lang === "ar" ? "🔄 توليد التركيبات يدوياً" : "🔄 Generate Variations Manually"}
              </Button>
            </div>
          )}

          {/* تنبيه الحاجة لخيارين */}
          {Object.keys(value).filter(key => value[key] && value[key].length > 0).length < 2 && (
            <div className="rounded-xl border-2 border-yellow-200/50 dark:border-yellow-800/30 bg-yellow-50/50 dark:bg-yellow-950/20 p-3 animate-pulse">
              <p className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {lang === "ar" 
                  ? "💡 أضف خيارين على الأقل (مثل: ألوان + مقاسات) لتوليد التركيبات تلقائياً" 
                  : "💡 Add at least 2 options (e.g., Colors + Sizes) to generate variations automatically"}
              </p>
            </div>
          )}

          {/* قسم التركيبات */}
          {localVariations.length > 0 && (
            <div className="rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-3 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#2a655f] dark:text-[#3a8a82]">
                    {lang === "ar" ? "📊 التركيبات" : "📊 Variations"}
                  </span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30">
                    ✅ {availableVariations} {lang === "ar" ? "متوفرة" : "available"}
                  </Badge>
                  {unavailableVariations > 0 && (
                    <Badge variant="outline" className="text-[10px] bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30">
                      ❌ {unavailableVariations} {lang === "ar" ? "غير متوفرة" : "unavailable"}
                    </Badge>
                  )}
                  {newVariationsCount > 0 && (
                    <Badge className="bg-yellow-500 text-white border-0 text-[10px] animate-pulse">
                      🆕 {newVariationsCount} {lang === "ar" ? "جديد" : "new"}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {showRestoreButton && deletedVariationsBackup.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 h-7 px-2 rounded-lg transition-all duration-300 hover:scale-105"
                      onClick={restoreVariations}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      {lang === "ar" ? "استعادة" : "Restore"}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 h-7 px-2 rounded-lg transition-all duration-300 hover:scale-105"
                    onClick={removeAllVariations}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    {lang === "ar" ? "حذف الكل" : "Delete All"}
                  </Button>
                </div>
              </div>

              {/* قائمة التركيبات - مقيّدة الارتفاع */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 max-h-[300px] sm:max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a655f]/30 scrollbar-track-transparent pe-1">
                {localVariations.map((variation) => {
                  const isAvailable = variation.is_available;
                  const comboKeys = Object.keys(variation.combination);
                  const isNew = variation.is_new;
                  
                  return (
                    <div
                      key={variation.id}
                      className={cn(
                        "flex flex-col p-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer group",
                        isAvailable 
                          ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500' 
                          : 'border-red-500/30 bg-red-50/30 dark:bg-red-950/10 opacity-60 hover:border-red-500',
                        isNew && "border-yellow-400/70 bg-yellow-50/50 dark:bg-yellow-950/20 animate-pulse"
                      )}
                      onClick={() => toggleVariationAvailability(variation.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          {isAvailable ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-red-500 shrink-0" />
                          )}
                          <div className="flex flex-wrap items-center gap-1">
                            {comboKeys.map((key, idx) => (
                              <span key={key} className="text-xs">
                                {idx > 0 && <span className="text-muted-foreground/50 mx-0.5">•</span>}
                                <span className="font-medium">{variation.combination[key]}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isNew && (
                            <Badge className="mr-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0 animate-pulse">
                              {lang === "ar" ? "جديد" : "NEW"}
                            </Badge>
                          )}
                          <span className={`text-[10px] font-medium mr-1 ${isAvailable ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isAvailable ? '✅' : '❌'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeVariation(variation.id);
                            }}
                            className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 hover:scale-110"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                        
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="flex-1 flex items-center gap-1 min-w-0">
                            <span className="text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                              {isOffer 
                                ? (lang === "ar" ? "💰 جديد:" : "💰 New:")
                                : (lang === "ar" ? "💰 السعر:" : "💰 Price:")
                              }
                              <span className="text-red-500">*</span>
                            </span>
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              value={variation.price !== undefined && variation.price !== null && variation.price > 0 ? variation.price : ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const newPrice = val === '' ? 0 : Number(val);
                                const updated = localVariations.map(v => 
                                  v.id === variation.id ? { ...v, price: newPrice, is_new: false } : v
                                );
                                setLocalVariations(updated);
                                if (onVariationsChange) {
                                  onVariationsChange(updated);
                                }
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                              className={cn(
                                "h-7 sm:h-8 text-[11px] sm:text-xs rounded-lg border-2 w-full min-w-[60px] px-1.5 transition-all duration-300",
                                (!variation.price || variation.price <= 0) && isNew
                                  ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                                  : (!variation.price || variation.price <= 0)
                                  ? "border-red-300 dark:border-red-800 focus:border-red-500"
                                  : "border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]"
                              )}
                              placeholder={lang === "ar" ? "مطلوب" : "Required"}
                            />
                          </div>
                          
                          {variation.price && variation.price > 0 ? (
                            <span className="text-[9px] sm:text-[10px] font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0">
                              {variation.price} ل.س
                            </span>
                          ) : (
                            <span className="text-[9px] sm:text-[10px] font-medium text-red-500 animate-pulse whitespace-nowrap shrink-0">
                              {lang === "ar" ? "⛔ مطلوب" : "⛔ Required"}
                            </span>
                          )}
                        </div>

                        {isOffer && (
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="flex-1 flex items-center gap-1 min-w-0">
                              <span className="text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap line-through shrink-0">
                                {lang === "ar" ? "📌 قديم:" : "📌 Old:"}
                              </span>
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                value={variation.old_price !== undefined && variation.old_price !== null && variation.old_price > 0 ? variation.old_price : ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const oldPrice = val === '' ? 0 : Number(val);
                                  const updated = localVariations.map(v => 
                                    v.id === variation.id ? { ...v, old_price: oldPrice } : v
                                  );
                                  setLocalVariations(updated);
                                  if (onVariationsChange) {
                                    onVariationsChange(updated);
                                  }
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                                className="h-7 sm:h-8 text-[11px] sm:text-xs rounded-lg border-2 w-full min-w-[60px] px-1.5 transition-all duration-300 border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]"
                                placeholder={lang === "ar" ? "اختياري" : "Optional"}
                              />
                            </div>
                            
                            {variation.old_price && variation.old_price > 0 ? (
                              <span className="text-[9px] sm:text-[10px] font-medium text-red-400 line-through whitespace-nowrap shrink-0">
                                {variation.old_price} ل.س
                              </span>
                            ) : (
                              <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground/50 whitespace-nowrap shrink-0">
                                {lang === "ar" ? "—" : "—"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {lang === "ar" ? "متوفر" : "Available"}
                </span>
                <span className="flex items-center gap-1">
                  <X className="h-3 w-3 text-red-500" />
                  {lang === "ar" ? "غير متوفر" : "Not available"}
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-xs">💡</span>
                  {lang === "ar" ? "اضغط لتغيير الحالة" : "Click to toggle"}
                </span>
                {newVariationsCount > 0 && (
                  <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                    <span className="text-xs">🆕</span>
                    {lang === "ar" ? "أصفر = جديد" : "Yellow = new"}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== Footer Summary ===== */}
      {totalOptions > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-[#2a655f]/10 to-[#2a655f]/5 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#2a655f] dark:text-[#3a8a82] min-w-0 flex-1">
            <CheckCircle2 className="h-4 w-4 animate-pulse shrink-0" />
            <span className="truncate">
              {lang === "ar" ? "✅ تم إضافة " : "✅ Added "}
              {Object.entries(value)
                .filter(([_, values]) => values && values.length > 0)
                .map(([type, values]) => {
                  const typeInfo = OPTION_TYPES.find(t => t.id === type);
                  return `${values.length} ${typeInfo?.label || type}`;
                })
                .join(", ")}
            </span>
          </div>
          {localVariations.length > 0 && (
            <Badge className="bg-[#2a655f] text-white border-0 self-start sm:self-auto shrink-0">
              {localVariations.length} {lang === "ar" ? "تركيبة" : "variations"}
              {newVariationsCount > 0 && (
                <span className="ml-1 text-yellow-300">
                  🆕{newVariationsCount}
                </span>
              )}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}