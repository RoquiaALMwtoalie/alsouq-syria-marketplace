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

// ============================================================
// 📦 جميع أنواع الخيارات المتاحة
// ============================================================
const OPTION_TYPES = [
  { id: 'colors', label: 'الألوان', icon: Palette, color: '#2a655f', emoji: '🎨', description: 'أضف ألوان المنتج مع صور' },
  { id: 'sizes', label: 'المقاسات', icon: Ruler, color: '#2a655f', emoji: '📏', description: 'أضف المقاسات المتوفرة' },
  { id: 'models', label: 'النماذج', icon: Box, color: '#2a655f', emoji: '📐', description: 'أضف النماذج المختلفة' },
  { id: 'materials', label: 'المواد', icon: Droplet, color: '#2a655f', emoji: '🧵', description: 'أضف أنواع المواد' },
  { id: 'fabric', label: 'نوع القماش', icon: Shirt, color: '#2a655f', emoji: '👕', description: 'أضف أنواع الأقمشة' },
  { id: 'style', label: 'النمط', icon: Sparkles, color: '#2a655f', emoji: '✨', description: 'أضف أنماط التصميم' },
  { id: 'season', label: 'الموسم', icon: Calendar, color: '#2a655f', emoji: '🌤️', description: 'أضف المواسم' },
  { id: 'gender', label: 'الجنس', icon: User, color: '#2a655f', emoji: '👫', description: 'أضف الفئات الجنسية' },
  { id: 'brand', label: 'الماركة', icon: Tag, color: '#2a655f', emoji: '🏷️', description: 'أضف الماركات' },
  { id: 'storage', label: 'سعة التخزين', icon: HardDrive, color: '#2a655f', emoji: '💾', description: 'أضف سعات التخزين' },
  { id: 'ram', label: 'الذاكرة (RAM)', icon: Cpu, color: '#2a655f', emoji: '🧠', description: 'أضف سعات الذاكرة' },
  { id: 'processor', label: 'المعالج', icon: Cpu, color: '#2a655f', emoji: '⚡', description: 'أضف أنواع المعالجات' },
  { id: 'battery', label: 'سعة البطارية', icon: Battery, color: '#2a655f', emoji: '🔋', description: 'أضف سعات البطارية' },
  { id: 'screen_size', label: 'حجم الشاشة', icon: Smartphone, color: '#2a655f', emoji: '📱', description: 'أضف أحجام الشاشات' },
  { id: 'camera', label: 'دقة الكاميرا', icon: Camera, color: '#2a655f', emoji: '📷', description: 'أضف دقات الكاميرا' },
  { id: 'connectivity', label: 'الاتصال', icon: Wifi, color: '#2a655f', emoji: '📶', description: 'أضف أنواع الاتصال' },
];

// ============================================================
// 📦 واجهات
// ============================================================
export interface Variation {
  id: string;
  combination: Record<string, string>;
  is_available: boolean;
  sku?: string;
  price?: number;
}

export interface ColorWithImage {
  name: string;
  image: string;
  hex?: string;
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
}: ProductOptionsManagerProps) {
  const [newValue, setNewValue] = useState("");
  const [activeType, setActiveType] = useState<string>("colors");
  const [searchTerm, setSearchTerm] = useState("");
  const [localVariations, setLocalVariations] = useState<Variation[]>(variations);
  const [colorImages, setColorImages] = useState<Record<string, string>>(externalColorImages);
  const [tempColorImage, setTempColorImage] = useState("");
  const [editingVariation, setEditingVariation] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(true);
  
  // ✅ ✅ ✅ متغيرات التحكم الاحترافية
  const isGeneratingRef = useRef(false);
  const isDeletingRef = useRef(false);
  const lastManualActionRef = useRef<{ type: 'delete' | 'generate' | null; timestamp: number }>({
    type: null,
    timestamp: 0
  });
  const previousStateRef = useRef<string>('');
  const [deletedVariationsBackup, setDeletedVariationsBackup] = useState<Variation[]>([]);
  const [showRestoreButton, setShowRestoreButton] = useState(false);
  // ✅ ✅ ✅ أضف هذا المتغير الجديد لمنع التوليد عند التحميل الأولي
  const isInitialLoadRef = useRef(true);

  // ✅ مزامنة الـ variations مع الـ props - مع إعطائها الأولوية
  useEffect(() => {
    console.log("🔍 [ProductOptionsManager] Syncing variations from props:", variations.length);
    if (variations.length > 0) {
      setLocalVariations(variations);
      // ✅ منع التوليد التلقائي بعد تحميل التركيبات
      isInitialLoadRef.current = false;
    } else {
      setLocalVariations(variations);
    }
  }, [variations]);

  // ✅ مزامنة الصور الخارجية
  useEffect(() => {
    setColorImages(externalColorImages);
  }, [externalColorImages]);

  // ✅ إعلام المكون الأب بتغيير الألوان
  const notifyColorsChange = (colors: string[], images: Record<string, string>) => {
    if (onColorsWithImagesChange) {
      const colorData = colors.map(name => ({
        name,
        image: images[name] || '',
      }));
      onColorsWithImagesChange(colorData);
    }
  };

  // ✅ ✅ ✅ دالة تسجيل الإجراءات اليدوية
  const recordManualAction = useCallback((type: 'delete' | 'generate') => {
    lastManualActionRef.current = {
      type,
      timestamp: Date.now()
    };
  }, []);

  // ✅ ✅ ✅ دالة التحقق من الإجراء اليدوي
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

  // ✅ ✅ ✅ توليد التركيبات التلقائي - نسخة محسنة مع منع التحميل الأولي
// ✅ ✅ ✅ توليد التركيبات التلقائي - نسخة محسنة مع منع التحميل الأولي ومنع توليد التركيبات الحقيقية
useEffect(() => {
  // ✅ منع التوليد في حالات معينة
  if (isGeneratingRef.current) {
    return;
  }
  
  if (isDeletingRef.current) {
    return;
  }
  
  // ✅ ✅ ✅ منع التوليد عند التحميل الأولي
  if (isInitialLoadRef.current) {
    isInitialLoadRef.current = false;
    console.log('ℹ️ [ProductOptionsManager] Initial load - skipping auto-generation');
    return;
  }

  // ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅
  // 🔥🔥🔥 إذا كانت هناك تركيبات حقيقية من قاعدة البيانات (IDs لا تبدأ بـ var-)، لا تولد جديدة!
  // ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅
  if (localVariations.length > 0) {
    const hasRealIds = localVariations.some(v => v.id && !v.id.startsWith('var-'));
    if (hasRealIds) {
      console.log('ℹ️ [ProductOptionsManager] Skipping auto-generation - real variations exist from database');
      return;
    }
  }

  // ✅ التحقق من وجود خيارين على الأقل
  const activeTypes = Object.keys(value).filter(key => value[key] && value[key].length > 0);
  
  if (activeTypes.length < 2) {
    if (localVariations.length > 0) {
      isGeneratingRef.current = true;
      setLocalVariations([]);
      if (onVariationsChange) onVariationsChange([]);
      setTimeout(() => { isGeneratingRef.current = false; }, 0);
    }
    return;
  }

  // ✅ التحقق من أن الألوان لها صور
  if (value.colors) {
    const colorsWithoutImage = value.colors.filter(c => !colorImages[c]);
    if (colorsWithoutImage.length > 0) {
      if (localVariations.length > 0) {
        isGeneratingRef.current = true;
        setLocalVariations([]);
        if (onVariationsChange) onVariationsChange([]);
        setTimeout(() => { isGeneratingRef.current = false; }, 0);
      }
      return;
    }
  }

  // ✅ توليد التركيبات
  const generatedVariations = generateVariationsAuto(value, colorImages);
  
  if (generatedVariations.length > 0) {
    const variationsWithDefaults = generatedVariations.map(v => ({
      ...v,
      price: 0,
      stock_quantity: 0,
    }));
    
    // ✅ تحقق إذا كانت التركيبات مختلفة لتجنب التحديثات غير الضرورية
    const currentKeys = new Set(
      localVariations.map(v => JSON.stringify(v.combination))
    );
    const newKeys = new Set(
      variationsWithDefaults.map(v => JSON.stringify(v.combination))
    );
    
    const isDifferent = 
      localVariations.length !== variationsWithDefaults.length ||
      [...newKeys].some(key => !currentKeys.has(key));

    // ✅ التحقق من أن هذا ليس حذفاً يدوياً
    const currentStateStr = JSON.stringify(localVariations);
    const newStateStr = JSON.stringify(variationsWithDefaults);
    
    // ✅ إذا كانت الحالة الجديدة فارغة والحالية ليست فارغة - تحقق من الإجراء اليدوي
    if (newStateStr === '[]' && currentStateStr !== '[]') {
      // ✅ هذا حذف يدوي، لا تعيد التوليد
      console.log('ℹ️ [ProductOptionsManager] Skipping auto-generation - manual deletion detected');
      return;
    }
    
    if (isDifferent) {
      isGeneratingRef.current = true;
      setLocalVariations(variationsWithDefaults);
      if (onVariationsChange) {
        onVariationsChange(variationsWithDefaults);
      }
      setTimeout(() => { isGeneratingRef.current = false; }, 0);
    }
  } else {
    if (localVariations.length > 0) {
      isGeneratingRef.current = true;
      setLocalVariations([]);
      if (onVariationsChange) onVariationsChange([]);
      setTimeout(() => { isGeneratingRef.current = false; }, 0);
    }
  }
}, [value, colorImages, localVariations, onVariationsChange]);
  // ✅ ✅ ✅ دالة توليد التركيبات التلقائية
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

  // ✅ ✅ ✅ توليد التركيبات يدوياً (يستخدم للزر) - محسن
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

    // ✅ تسجيل الإجراء اليدوي
    recordManualAction('generate');

    const allVariations: Variation[] = [];
    
    const generateAllCombinations = (types: string[], index: number, current: Record<string, string>) => {
      if (index === types.length) {
        allVariations.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          combination: { ...current },
          is_available: true,
          price: 0,
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
        stock_quantity: 0,
      }));
      
      setLocalVariations(variationsWithDefaults);
      if (onVariationsChange) {
        onVariationsChange(variationsWithDefaults);
      }
      
      // ✅ إخفاء زر الاستعادة بعد التوليد اليدوي
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

  // ✅ ✅ ✅ حذف جميع التركيبات - محسن مع نسخ احتياطي
  const removeAllVariations = useCallback(() => {
    // ✅ حفظ نسخة احتياطية قبل الحذف
    if (localVariations.length > 0) {
      setDeletedVariationsBackup(localVariations);
      setShowRestoreButton(true);
    }
    
    // ✅ تسجيل الإجراء اليدوي
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
    
    // ✅ إلغاء قفل الحذف بعد فترة كافية
    setTimeout(() => {
      isDeletingRef.current = false;
      setTimeout(() => {
        if (lastManualActionRef.current.type === 'delete') {
          lastManualActionRef.current.type = null;
        }
      }, 1000);
    }, 600);
  }, [localVariations, lang, onVariationsChange, recordManualAction]);

  // ✅ ✅ ✅ استعادة التركيبات المحذوفة
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

  // ✅ إضافة خيار
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

  // ✅ حذف خيار
  const removeOption = (type: string, option: string) => {
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
    toast.info(lang === "ar" ? `🗑️ تم حذف "${option}"` : `🗑️ Deleted "${option}"`);
  };

  // ✅ حذف جميع الخيارات من نوع معين
  const removeAll = (type: string) => {
    onChange({
      ...value,
      [type]: [],
    });
    if (type === 'colors') {
      setColorImages({});
      notifyColorsChange([], {});
    }
    toast.info(lang === "ar" ? "🗑️ تم حذف الكل" : "🗑️ Deleted all");
  };

  // ✅ تبديل حالة التركيبة
  const toggleVariationAvailability = (variationId: string) => {
    const updated = localVariations.map(v => 
      v.id === variationId ? { ...v, is_available: !v.is_available } : v
    );
    setLocalVariations(updated);
    if (onVariationsChange) {
      onVariationsChange(updated);
    }
  };

  // ✅ حذف تركيبة
  const removeVariation = (variationId: string) => {
    const updated = localVariations.filter(v => v.id !== variationId);
    setLocalVariations(updated);
    if (onVariationsChange) {
      onVariationsChange(updated);
    }
    toast.success(lang === "ar" ? "✅ تم حذف التركيبة" : "✅ Variation deleted");
  };

  // ✅ حساب الإحصائيات
  const totalOptions = Object.values(value).reduce((acc, arr) => acc + arr.length, 0);
  const availableVariations = localVariations.filter(v => v.is_available).length;
  const unavailableVariations = localVariations.filter(v => !v.is_available).length;

  const colorList = (value.colors || []).map(name => ({
    name,
    image: colorImages[name] || '',
  }));

  // ✅ تحديد اللون النشط
  const getActiveColor = (color: string) => {
    return color === '#2a655f' ? 'border-[#2a655f] bg-[#2a655f]/10 shadow-[#2a655f]/20' : 'border-slate-200/50 hover:border-[#2a655f]/30';
  };

  const filteredTypes = OPTION_TYPES.filter(type => 
    type.label.includes(searchTerm) || 
    type.id.includes(searchTerm) ||
    type.emoji.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* ===== كارد المساعدة ===== */}
      {showHelp && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 p-5 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#2a655f]/5 blur-3xl" />
          <div className="flex items-start justify-between relative">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#2a655f]/10 animate-pulse">
                <HelpCircle className="h-5 w-5 text-[#2a655f]" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]">
                  {lang === "ar" ? "💡 كيف تعمل خيارات المنتج؟" : "💡 How do product options work?"}
                </p>
                <div className="text-xs text-muted-foreground space-y-1 mt-1">
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f]" />
                    {lang === "ar" 
                      ? "1️⃣ اختر نوع الخيار (ألوان، مقاسات، إلخ)" 
                      : "1️⃣ Select option type (Colors, Sizes, etc.)"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f]" />
                    {lang === "ar" 
                      ? "2️⃣ اكتب القيمة وارفع صورة (للألوان فقط)" 
                      : "2️⃣ Enter value and upload image (for colors only)"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f]" />
                    {lang === "ar" 
                      ? "3️⃣ اضغط 'إضافة' لإضافة الخيار" 
                      : "3️⃣ Click 'Add' to add the option"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f]" />
                    {lang === "ar" 
                      ? "4️⃣ بعد إضافة خيارين على الأقل، تتولد التركيبات تلقائياً" 
                      : "4️⃣ After adding at least 2 options, variations generate automatically"}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f]" />
                    {lang === "ar" 
                      ? "5️⃣ حدد السعر والمخزون لكل تركيبة" 
                      : "5️⃣ Set price and stock for each variation"}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 hover:rotate-90"
              onClick={() => setShowHelp(false)}
            >
              <X className="h-4 w-4 text-[#2a655f]" />
            </Button>
          </div>
        </div>
      )}

      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] flex items-center justify-center text-white shadow-lg shadow-[#2a655f]/20 animate-pulse">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
              {lang === "ar" ? "خيارات المنتج" : "Product Options"}
            </h4>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span>{lang === "ar" ? `${totalOptions} خيار` : `${totalOptions} options`}</span>
              {localVariations.length > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ✅ {availableVariations} / {localVariations.length} {lang === "ar" ? "تركيبة" : "variations"}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
        {!readOnly && localVariations.length > 0 && (
          <div className="flex items-center gap-2">
            {showRestoreButton && deletedVariationsBackup.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30 transition-all duration-300 hover:scale-105"
                onClick={restoreVariations}
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                {lang === "ar" ? "استعادة" : "Restore"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200/50 dark:border-red-800/30 transition-all duration-300 hover:scale-105"
              onClick={removeAllVariations}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {lang === "ar" ? "حذف الكل" : "Delete All"}
            </Button>
          </div>
        )}
      </div>

      {/* ===== Search ===== */}
      <div className="relative group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={lang === "ar" ? "🔍 ابحث عن خيار..." : "🔍 Search for an option..."}
          className="w-full h-10 px-4 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 text-sm hover:border-[#2a655f]/30"
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

      {/* ===== Types Grid ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-h-[300px] overflow-y-auto p-1">
        {filteredTypes.map((type) => {
          const count = value[type.id]?.length || 0;
          const Icon = type.icon;
          const isActive = activeType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => !readOnly && setActiveType(type.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all duration-300 group",
                isActive && !readOnly
                  ? "border-[#2a655f] bg-[#2a655f]/10 dark:bg-[#2a655f]/20 shadow-lg shadow-[#2a655f]/20 scale-105"
                  : "border-slate-200/50 dark:border-slate-800/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10",
                readOnly && "cursor-default opacity-75"
              )}
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-300">{type.emoji}</span>
              <span className="text-[11px] font-medium text-center leading-tight group-hover:text-[#2a655f] transition-colors">{type.label}</span>
              {count > 0 && (
                <Badge className="bg-[#2a655f] text-white border-0 text-[10px] px-1.5 py-0 animate-pulse">
                  {count}
                </Badge>
              )}
              {isActive && (
                <span className="h-1 w-4 rounded-full bg-[#2a655f] animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* ===== Active Option Type ===== */}
      {activeType && !readOnly && (
        <div className="rounded-2xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-4 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">
                {OPTION_TYPES.find(t => t.id === activeType)?.emoji}
              </span>
              <Label className="text-sm font-semibold text-[#2a655f] dark:text-[#3a8a82]">
                {OPTION_TYPES.find(t => t.id === activeType)?.label}
              </Label>
              <Badge variant="outline" className="text-[10px] border-[#2a655f]/30 text-[#2a655f]">
                {value[activeType]?.length || 0}
              </Badge>
              {activeType === 'colors' && (
                <Badge className="text-[10px] bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30 animate-pulse">
                  📸 صورة مطلوبة
                </Badge>
              )}
            </div>
            {value[activeType]?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 h-7 px-2 rounded-lg transition-all duration-300 hover:scale-105"
                onClick={() => removeAll(activeType)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                {lang === "ar" ? "حذف الكل" : "Delete all"}
              </Button>
            )}
          </div>

          {/* ===== Existing Options Display ===== */}
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

          {/* ===== Add New Option ===== */}
          <div className="flex flex-wrap gap-2">
            <div className="flex-1 min-w-[150px]">
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
                className="h-9 text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
              />
            </div>
            
            {activeType === 'colors' && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ImageInput
                    value={tempColorImage}
                    onChange={(url) => {
                      setTempColorImage(url);
                    }}
                    userId={userId}
                    folder="product-colors"
                    lang={lang}
                    label=""
                    previewClassName="h-9 w-12 rounded-lg object-cover border-2 border-[#2a655f]/20 hover:border-[#2a655f]/40 transition-all"
                    showLabel={false}
                  />
                  {!tempColorImage && (
                    <p className="absolute -bottom-5 left-0 text-[8px] text-red-500 whitespace-nowrap">
                      {lang === "ar" ? "صورة مطلوبة" : "Image required"}
                    </p>
                  )}
                </div>
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
              className="h-9 px-4 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-md shadow-[#2a655f]/20 hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
          </div>

          {/* ===== رسالة توجيهية ===== */}
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

      {/* ===== Variations Section ===== */}
      {!readOnly && (
        <div className="space-y-4">
          {/* ✅ مؤشر التوليد التلقائي */}
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

          {/* ✅ زر توليد يدوي (اختياري) */}
          {Object.keys(value).filter(key => value[key] && value[key].length > 0).length >= 2 && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={generateVariations}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] group"
              >
                <RefreshCw className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-700" />
                {lang === "ar" ? "🔄 توليد التركيبات يدوياً" : "🔄 Generate Variations Manually"}
              </Button>
            </div>
          )}

          {/* ===== رسالة توجيهية للتوليد ===== */}
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

          {localVariations.length > 0 && (
            <div className="rounded-2xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-4 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
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
                </div>
                <div className="flex items-center gap-2">
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

              {/* ===== ✅ عرض التركيبات مع السعر والمخزون ===== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {localVariations.map((variation) => {
  const isAvailable = variation.is_available;
  const comboKeys = Object.keys(variation.combination);
  
  // ✅ ✅ ✅ أضف هذا الـ log هنا
  console.log("🔍🔍🔍 [ProductOptionsManager] Rendering variation:", {
    id: variation.id,
    combination: variation.combination,
    price: variation.price,
    priceType: typeof variation.price,
    hasPrice: variation.price !== undefined && variation.price !== null,
    isZero: variation.price === 0,
    valueToShow: variation.price !== undefined && variation.price !== null ? variation.price : '',
  });
                  return (
                    <div
                      key={variation.id}
                      className={cn(
                        "flex flex-col p-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer group",
                        isAvailable 
                          ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500' 
                          : 'border-red-500/30 bg-red-50/30 dark:bg-red-950/10 opacity-60 hover:border-red-500'
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
                      
                    {/* ✅ حقل السعر لكل تركيبة */}
<div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
  <div className="flex-1 flex items-center gap-1">
    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
      {lang === "ar" ? "السعر:" : "Price:"}
      <span className="text-red-500">*</span>
    </span>
    <Input
      type="number"
      min="1"
      step="1"
      value={variation.price !== undefined && variation.price !== null ? variation.price : ''}
      onChange={(e) => {
        const val = e.target.value;
        const newPrice = val === '' ? 0 : Number(val);
        const updated = localVariations.map(v => 
          v.id === variation.id ? { ...v, price: newPrice } : v
        );
        setLocalVariations(updated);
        if (onVariationsChange) {
          onVariationsChange(updated);
        }
      }}
      onClick={(e) => e.stopPropagation()}
      className={cn(
        "h-6 text-xs rounded-lg border-2 w-20 px-1.5",
        !variation.price || variation.price <= 0
          ? "border-red-300 dark:border-red-800 focus:border-red-500"
          : "border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]"
      )}
      placeholder={lang === "ar" ? "مطلوب" : "Required"}
    />
  </div>
</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
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
              </div>
            </div>
          )}
        </div>
      )}

      {totalOptions > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-[#2a655f]/10 to-[#2a655f]/5 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-[#2a655f] dark:text-[#3a8a82]">
            <CheckCircle2 className="h-4 w-4 animate-pulse" />
            <span>
              {lang === "ar" ? "✅ تم إضافة " : "✅ Added "}
              {Object.entries(value)
                .filter(([_, values]) => values.length > 0)
                .map(([type, values]) => {
                  const typeInfo = OPTION_TYPES.find(t => t.id === type);
                  return `${values.length} ${typeInfo?.label || type}`;
                })
                .join(", ")}
            </span>
          </div>
          {localVariations.length > 0 && (
            <Badge className="bg-[#2a655f] text-white border-0">
              {localVariations.length} {lang === "ar" ? "تركيبة" : "variations"}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}