import { useState, useEffect, useMemo } from "react";
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
  Monitor, type LucideIcon, AlertCircle, Edit2, Save
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
  { id: 'colors', label: 'الألوان', icon: Palette, color: 'blue', emoji: '🎨' },
  { id: 'sizes', label: 'المقاسات', icon: Ruler, color: 'emerald', emoji: '📏' },
  { id: 'models', label: 'النماذج', icon: Box, color: 'purple', emoji: '📐' },
  { id: 'materials', label: 'المواد', icon: Droplet, color: 'amber', emoji: '🧵' },
  { id: 'fabric', label: 'نوع القماش', icon: Shirt, color: 'pink', emoji: '👕' },
  { id: 'style', label: 'النمط', icon: Sparkles, color: 'pink', emoji: '✨' },
  { id: 'season', label: 'الموسم', icon: Calendar, color: 'orange', emoji: '🌤️' },
  { id: 'gender', label: 'الجنس', icon: User, color: 'purple', emoji: '👫' },
  { id: 'brand', label: 'الماركة', icon: Tag, color: 'indigo', emoji: '🏷️' },
  { id: 'storage', label: 'سعة التخزين', icon: HardDrive, color: 'blue', emoji: '💾' },
  { id: 'ram', label: 'الذاكرة (RAM)', icon: Cpu, color: 'purple', emoji: '🧠' },
  { id: 'processor', label: 'المعالج', icon: Cpu, color: 'cyan', emoji: '⚡' },
  { id: 'battery', label: 'سعة البطارية', icon: Battery, color: 'emerald', emoji: '🔋' },
  { id: 'screen_size', label: 'حجم الشاشة', icon: Smartphone, color: 'blue', emoji: '📱' },
  { id: 'camera', label: 'دقة الكاميرا', icon: Camera, color: 'purple', emoji: '📷' },
  { id: 'connectivity', label: 'الاتصال', icon: Wifi, color: 'cyan', emoji: '📶' },
  { id: 'bluetooth', label: 'البلوتوث', icon: Bluetooth, color: 'blue', emoji: '🔵' },
  { id: 'dimensions', label: 'الأبعاد', icon: RulerIcon, color: 'amber', emoji: '📐' },
  { id: 'weight_kg', label: 'الوزن (كغم)', icon: Scale, color: 'orange', emoji: '⚖️' },
  { id: 'material_type', label: 'نوع المادة', icon: Home, color: 'amber', emoji: '🏠' },
  { id: 'shoe_size', label: 'مقاس الحذاء', icon: Footprints, color: 'blue', emoji: '👟' },
  { id: 'shoe_type', label: 'نوع الحذاء', icon: Footprints, color: 'purple', emoji: '👞' },
  { id: 'watch_band', label: 'نوع السوار', icon: Watch, color: 'amber', emoji: '⌚' },
  { id: 'occasion', label: 'المناسبة', icon: Gift, color: 'red', emoji: '🎁' },
  { id: 'age_group', label: 'الفئة العمرية', icon: User, color: 'purple', emoji: '👶' },
];

// ============================================================
// 📦 واجهات
// ============================================================
export interface Variation {
  id: string;
  combination: Record<string, string>;
  is_available: boolean;
  sku?: string;
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

  // ✅ مزامنة الـ variations مع الـ props
  useEffect(() => {
    setLocalVariations(variations);
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

  // ✅ توليد التركيبات
 // ✅ توليد التركيبات من جميع الخيارات (وليس نوعين فقط)
const generateVariations = () => {
  const activeTypes: Record<string, string[]> = {};
  Object.keys(value).forEach(key => {
    if (value[key] && value[key].length > 0) {
      activeTypes[key] = value[key];
    }
  });
  
  const typeKeys = Object.keys(activeTypes);
  
  if (typeKeys.length < 2) {
    toast.error(lang === "ar" 
      ? "يجب اختيار نوعين من الخيارات على الأقل (مثل: ألوان + مقاسات)" 
      : "Select at least two option types (e.g., Colors + Sizes)"
    );
    return;
  }

  // ✅ التحقق من أن كل لون له صورة
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

  // ✅ توليد التركيبات من جميع الأنواع (Cartesian Product)
  const generateAllCombinations = (types: string[], index: number, current: Record<string, string>) => {
    if (index === types.length) {
      // ✅ التحقق من عدم وجود تكرار
      const exists = localVariations.some(v => {
        return Object.keys(current).every(key => v.combination[key] === current[key]);
      });
      
      if (!exists) {
        allVariations.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          combination: { ...current },
          is_available: true,
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
  };

  const allVariations: Variation[] = [];
  generateAllCombinations(typeKeys, 0, {});

  if (allVariations.length > 0) {
    const updatedVariations = [...localVariations, ...allVariations];
    setLocalVariations(updatedVariations);
    if (onVariationsChange) {
      onVariationsChange(updatedVariations);
    }
    
    toast.success(
      lang === "ar" 
        ? `✅ تم إضافة ${allVariations.length} تركيبة جديدة (من ${typeKeys.length} أنواع)` 
        : `✅ Added ${allVariations.length} new variations (from ${typeKeys.length} types)`
    );
  } else {
    toast.info(lang === "ar" ? "💡 جميع التركيبات موجودة بالفعل" : "💡 All variations already exist");
  }
};

  // ✅ إضافة خيار
  const addOption = (type: string, imageUrl?: string) => {
    const val = newValue.trim();
    if (!val) {
      toast.error(lang === "ar" ? "الرجاء إدخال قيمة" : "Please enter a value");
      return false;
    }
    if (value[type]?.includes(val)) {
      toast.error(lang === "ar" ? "هذه القيمة موجودة بالفعل" : "This value already exists");
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

  // ✅ حذف جميع التركيبات
  const removeAllVariations = () => {
    setLocalVariations([]);
    if (onVariationsChange) {
      onVariationsChange([]);
    }
    toast.success(lang === "ar" ? "✅ تم حذف جميع التركيبات" : "✅ All variations deleted");
  };

  const getColorClass = (color: string) => {
    const map: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/40',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/40',
      amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/40',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800/40',
      pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-800/40',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800/40',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/40',
      cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-cyan-800/40',
      gold: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/40',
    };
    return map[color] || map.blue;
  };

  const filteredTypes = OPTION_TYPES.filter(type => 
    type.label.includes(searchTerm) || 
    type.id.includes(searchTerm) ||
    type.emoji.includes(searchTerm)
  );

  const totalOptions = Object.values(value).reduce((acc, arr) => acc + arr.length, 0);
  const availableVariations = localVariations.filter(v => v.is_available).length;
  const unavailableVariations = localVariations.filter(v => !v.is_available).length;

  const colorList = (value.colors || []).map(name => ({
    name,
    image: colorImages[name] || '',
  }));

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-lg font-semibold">
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
          <Button
            variant="outline"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={removeAllVariations}
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            {lang === "ar" ? "حذف الكل" : "Delete All"}
          </Button>
        )}
      </div>

      {/* ===== Search ===== */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={lang === "ar" ? "🔍 ابحث عن خيار..." : "🔍 Search for an option..."}
          className="w-full h-10 px-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground"
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
                "flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all duration-300",
                isActive && !readOnly
                  ? `border-${type.color}-500 bg-${type.color}-50/50 dark:bg-${type.color}-950/20 shadow-md shadow-${type.color}-500/10 scale-105`
                  : "border-slate-200/50 dark:border-slate-800/50 hover:border-blue-300/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
                readOnly && "cursor-default opacity-75"
              )}
            >
              <span className="text-lg">{type.emoji}</span>
              <span className="text-[11px] font-medium text-center leading-tight">{type.label}</span>
              {count > 0 && (
                <Badge className={`text-[10px] px-1.5 py-0 bg-${type.color}-500 text-white border-0`}>
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* ===== Active Option Type ===== */}
      {activeType && !readOnly && (
        <div className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-4 bg-slate-50/30 dark:bg-slate-800/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-lg">
                {OPTION_TYPES.find(t => t.id === activeType)?.emoji}
              </span>
              <Label className="text-sm font-medium">
                {OPTION_TYPES.find(t => t.id === activeType)?.label}
              </Label>
              <Badge variant="outline" className="text-[10px]">
                {value[activeType]?.length || 0}
              </Badge>
              {activeType === 'colors' && (
                <Badge className="text-[10px] bg-red-100 text-red-700 border-red-200">
                  📸 صورة مطلوبة
                </Badge>
              )}
            </div>
            {value[activeType]?.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2 rounded-lg"
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
                <div key={name} className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/50 group">
                  {image ? (
                    <img src={image} alt={name} className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded bg-red-200 flex items-center justify-center text-[8px] text-red-600">⚠️</div>
                  )}
                  <span className="text-xs font-medium">{name}</span>
                  <button
                    onClick={() => removeOption(activeType, name)}
                    className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
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
                <Badge key={val} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-sm group">
                  {val}
                  <button
                    onClick={() => removeOption(activeType, val)}
                    className="ml-2 text-muted-foreground hover:text-red-500 transition-colors"
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
                className="h-9 text-sm rounded-lg flex-1"
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
                    previewClassName="h-9 w-12 rounded-lg object-cover"
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
              className="h-9 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
          </div>
        </div>
      )}

      {/* ===== Variations Section ===== */}
      {!readOnly && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={generateVariations}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {lang === "ar" ? "🔄 توليد التركيبات" : "🔄 Generate Variations"}
            </Button>
          </div>

          {localVariations.length > 0 && (
            <div className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 p-4 bg-slate-50/30 dark:bg-slate-800/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 h-7 px-2 rounded-lg"
                  onClick={removeAllVariations}
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  {lang === "ar" ? "حذف الكل" : "Delete All"}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {localVariations.map((variation) => {
                  const isAvailable = variation.is_available;
                  const comboStr = Object.values(variation.combination).join(' • ');
                  const comboKeys = Object.keys(variation.combination);
                  
                  return (
                    <div
                      key={variation.id}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer group",
                        isAvailable 
                          ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500' 
                          : 'border-red-500/30 bg-red-50/30 dark:bg-red-950/10 opacity-60 hover:border-red-500'
                      )}
                      onClick={() => toggleVariationAvailability(variation.id)}
                    >
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
                          className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
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
        <div className="rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <CheckCircle2 className="h-4 w-4" />
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
        </div>
      )}
    </div>
  );
}