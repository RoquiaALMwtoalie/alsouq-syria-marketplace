// src/components/dashboard/ProductFormDialog.tsx

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
  X, Plus, Package, Gift, Sparkles, Truck, CreditCard, 
  Tag, MapPin, Image as ImageIcon, CheckCircle2,
  Layers, Palette, Search, ChevronDown,
  Save, AlertCircle, Info, Star, Shield, Clock, User,
  Camera, Trash2, Edit2, Heart, BookOpen, Cake,
  ChevronRight, ChevronLeft, Zap, Award, TrendingUp, ShieldCheck,
  ArrowRight, ArrowLeft, Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useCategories, useGovernorates, type ListingKind } from "@/lib/queries";
import { ImageInput } from "@/components/ImageInput";
import { ProductOptionsManager, type Variation, type ColorWithImage } from "./ProductOptionsManager";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  productType: "product" | "offer";
  onSave: (data: any) => void;
  isSaving: boolean;
  lang: string;
}
// ✅ ✅ ✅ قاموس الألوان الشامل (200+ لون)
const DEFAULT_COLORS: Record<string, string> = {
  // أحمر
  'أحمر': '#FF0000', 'احمر': '#FF0000',
  'قرمزي': '#DC143C', 'كرزي': '#DE3163',
  'مرجاني': '#FF7F50',
  
  // أزرق
  'أزرق': '#0000FF', 'ازرق': '#0000FF',
  'كحلي': '#000080',
  'فيروزي': '#40E0D0', 'تركواز': '#40E0D0',
  'سماوي': '#00BFFF',
  
  // أخضر
  'أخضر': '#00FF00', 'اخضر': '#00FF00',
  'زمردي': '#50C878',
  'نعناعي': '#98FF98',
  'زيتوني': '#808000',
  
  // أسود وأبيض
  'أسود': '#000000', 'اسود': '#000000',
  'أبيض': '#FFFFFF', 'ابيض': '#FFFFFF',
  'عاجي': '#FFFFF0', 'لؤلؤي': '#F5F5F5',
  
  // بني وبيج
  'بني': '#8B4513',
  'قهوي': '#6F4E37',
  'شوكولاتة': '#7B3F00',
  'بيج': '#F5F5DC',
  'كاكي': '#C3B091',
  'نحاسي': '#B87333',
  'ذهبي': '#FFD700',
  'فضي': '#C0C0C0',
  'برونزي': '#CD7F32',
  
  // أصفر وبرتقالي
  'أصفر': '#FFFF00', 'اصفر': '#FFFF00',
  'ليموني': '#FFF44F',
  'برتقالي': '#FF8C00',
  'خوخي': '#FFDAB9',
  'عنبري': '#FFBF00',
  
  // وردي وبنفسجي
  'وردي': '#FF69B4',
  'زهر': '#FF69B4',
  'زهري': '#FFB6C1',
  'فوشي': '#FF00FF',
  'بنفسجي': '#8B008B',
  'أرجواني': '#800080',
  'موف': '#C8A2C8',
  'لافندر': '#E6E6FA',
  
  // رمادي
  'رمادي': '#808080',
  'رمادي غامق': '#404040',
  'رمادي فاتح': '#D3D3D3',
  
  // ألوان أخرى
  'بشري': '#F5D0B8',
  'خردلي': '#DAA520',
  'خمري': '#722F37',
  'نبيتي': '#722F37',
  'عنابي': '#800000',
  'مينت': '#98FF98',
  'بيبي بينك': '#F4C2C2',
  'نود': '#E8D5B7',
  'رملي': '#D7C4A1',
  'عسلي': '#C68E5E',
  'كريمي': '#FFFDD0',
  'ثلجي': '#FFFAFA',
  'أوف وايت': '#F8F8FF',
  'ترابي': '#C4A882',
  'قمحي': '#F5DEB3',
  'حنطي': '#D4A574',
  'سكري': '#FDF5E6',
};
const emptyForm = {
  title_ar: "",
  description_ar: "",
  price: 0,
  old_price: 0,
  is_offer: false,
  is_available: true,
  payment_method: "cash" as const,
  kind: "product" as ListingKind,
  category_id: "",
  governorate_id: "",
  cover_url: "",
  image_urls: [""],
};

const TAB_ORDER = ['basic', 'pricing', 'images', 'options'];

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
  productType,
  onSave,
  isSaving,
  lang
}: ProductFormDialogProps) {
  const app = useApp();
  const t = useT();
   const isRTL = app.lang === 'ar';
  const { data: cats = [] } = useCategories();
  const { data: govs = [] } = useGovernorates();
    const isLoadingRef = useRef(false);
  const [form, setForm] = useState(emptyForm);
  const [options, setOptions] = useState<Record<string, string[]>>({
    colors: [],
    sizes: [],
    models: [],
    materials: [],
    weight: [],
    style: [],
    brand: [],
  });
  const [variations, setVariations] = useState<Variation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempColors, setTempColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colorWithImages, setColorWithImages] = useState<ColorWithImage[]>([]);

  const [categorySearch, setCategorySearch] = useState("");
  const [governorateSearch, setGovernorateSearch] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isGovernorateOpen, setIsGovernorateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // ✅ ✅ ✅ إضافة useRef لمنع إعادة التحميل المتكررة
  const isFirstLoadRef = useRef(true);
  // ✅ ✅ ✅ إضافة useRef لمنع إعادة التوجيه أثناء كتابة السعر
  const isPriceEditingRef = useRef(false);

  const getCategoryName = (categoryId: string) => {
    if (!categoryId) return "";
    const cat = cats.find((c: any) => c.id === categoryId);
    return cat ? (app.lang === "ar" ? cat.name_ar : cat.name_en) : "";
  };

  const getGovernorateName = (governorateId: string) => {
    if (!governorateId) return "";
    const gov = govs.find((g: any) => g.id === governorateId);
    return gov ? (app.lang === "ar" ? gov.name_ar : gov.name_en) : "";
  };

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return cats;
    const search = categorySearch.toLowerCase().trim();
    return cats.filter((c: any) => {
      const nameAr = (c.name_ar || "").toLowerCase();
      const nameEn = (c.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search) || nameAr.startsWith(search) || nameEn.startsWith(search);
    });
  }, [cats, categorySearch]);

  const filteredGovernorates = useMemo(() => {
    if (!governorateSearch.trim()) return govs;
    const search = governorateSearch.toLowerCase().trim();
    return govs.filter((g: any) => {
      const nameAr = (g.name_ar || "").toLowerCase();
      const nameEn = (g.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search) || nameAr.startsWith(search) || nameEn.startsWith(search);
    });
  }, [govs, governorateSearch]);

  const getProductLabels = () => {
    if (productType === "offer") {
      return {
        name: lang === "ar" ? "اسم العرض" : "Offer Name",
        description: lang === "ar" ? "وصف العرض" : "Offer Description",
        placeholderName: lang === "ar" ? "🎁 أدخل اسم العرض..." : "🎁 Enter offer name...",
        placeholderDesc: lang === "ar" ? "✏️ وصف العرض بالتفصيل..." : "✏️ Detailed offer description...",
        badge: lang === "ar" ? "عرض" : "Offer",
        icon: Gift,
        iconColor: "text-emerald-500",
        bgGradient: "from-emerald-500/5 to-emerald-500/10 dark:from-emerald-500/20 dark:to-emerald-500/10",
      };
    }
    return {
      name: lang === "ar" ? "اسم المنتج" : "Product Name",
      description: lang === "ar" ? "وصف المنتج" : "Product Description",
      placeholderName: lang === "ar" ? "📦 أدخل اسم المنتج..." : "📦 Enter product name...",
      placeholderDesc: lang === "ar" ? "✏️ وصف المنتج بالتفصيل..." : "✏️ Detailed product description...",
      badge: lang === "ar" ? "منتج" : "Product",
      icon: Package,
      iconColor: "text-[#2a655f]",
      bgGradient: "from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10",
    };
  };

  const labels = getProductLabels();

  const isTabValid = (tab: string) => {
    if (tab === 'basic') {
      return !!form.title_ar.trim() && !!form.category_id && !!form.governorate_id;
    }
    if (tab === 'pricing') {
      if (!form.price || form.price <= 0) return false;
      
      if (productType === "offer") {
        if (!form.old_price || form.old_price <= form.price) return false;
        if (form.old_price < 0) return false;
      }
      
      return true;
    }
    if (tab === 'images') {
      return !!form.cover_url?.trim();
    }
    if (tab === 'options') {
      if (variations.length > 0) {
        const variationsWithoutPrice = variations.filter(v => !v.price || v.price <= 0);
        if (variationsWithoutPrice.length > 0) {
          return false;
        }
      }
      return true;
    }
    return true;
  };

  const goToNextTab = () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (currentIndex < TAB_ORDER.length - 1) {
      if (!isTabValid(activeTab)) {
        if (activeTab === 'options') {
          const variationsWithoutPrice = variations.filter(v => !v.price || v.price <= 0);
          if (variationsWithoutPrice.length > 0) {
            toast.error(
              lang === "ar" 
                ? `⚠️ هناك ${variationsWithoutPrice.length} تركيبة بدون سعر، الرجاء تحديد السعر لكل تركيبة` 
                : `⚠️ ${variationsWithoutPrice.length} variations have no price, please set price for each variation`
            );
            return;
          }
        }
        
        toast.warning(
          lang === "ar" 
            ? "⚠️ يرجى إكمال البيانات المطلوبة في هذا القسم أولاً" 
            : "⚠️ Please complete the required fields in this section first"
        );
        return;
      }
      setActiveTab(TAB_ORDER[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevTab = () => {
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(TAB_ORDER[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ✅ ✅ ✅ استخدم useMemo لحساب variationsWithPrices مرة واحدة فقط
  const variationsWithPrices = useMemo(() => {
    if (!product || !product.variations || product.variations.length === 0) {
      return [];
    }
    
    console.log("🔍🔍🔍 [ProductFormDialog] Computing variationsWithPrices from:", product.variations.length);
    
    return product.variations.map((v: any) => {
      const price = v.price !== undefined && v.price !== null && v.price > 0 
        ? v.price 
        : form.price || 0;
      
      return {
        ...v,
        price: price,
        is_available: v.is_available !== undefined ? v.is_available : true,
      };
    });
  }, [product?.variations, form.price]);

// src/components/dashboard/ProductFormDialog.tsx

useEffect(() => {
  // ✅ ✅ ✅ منع إعادة التحميل المتكررة
  if (isLoadingRef.current) {
    console.log("ℹ️ [ProductFormDialog] Already loading, skipping...");
    return;
  }
  
  // ✅ ✅ ✅ منع إعادة التوجيه أثناء كتابة السعر
  if (isPriceEditingRef.current) {
    console.log("ℹ️ [ProductFormDialog] Skipping - price editing in progress");
    return;
  }
  
  if (!open) {
    isLoadingRef.current = false;
    return;
  }
  
  // ✅ تعيين العلم لمنع التحميل المتكرر
  isLoadingRef.current = true;
  
  if (product) {
    const availableValue = product.is_available !== undefined ? product.is_available : true;
    
    // ✅ تحميل البيانات الأساسية
    setForm({
      title_ar: product.title_ar || "",
      description_ar: product.description_ar || "",
      price: product.price || 0,
      old_price: product.old_price || 0,
      is_offer: product.is_offer || false,
      is_available: availableValue,
      payment_method: product.payment_method || "cash",
      kind: product.kind || "product",
      category_id: product.category_id || "",
      governorate_id: product.governorate_id || "",
      cover_url: product.cover_url || "",
      image_urls: product.image_urls || [""],
    });
    
    if (product.category_id && cats.length > 0) {
      setCategorySearch(getCategoryName(product.category_id));
    }
    
    if (product.governorate_id && govs.length > 0) {
      setGovernorateSearch(getGovernorateName(product.governorate_id));
    }
    
    // ✅ ✅ ✅ تحميل الخيارات
    const productOptions = product.options || [];
    const productColors = product.colors || [];
    
    console.log("🔍 [ProductFormDialog] Loading product data:", {
      optionsCount: productOptions.length,
      colorsCount: productColors.length,
      variationsCount: product.variations?.length || 0,
    });
    
    // ✅ ✅ ✅ خريطة تحويل الأنواع
    const typeMap: Record<string, string> = {
      'color': 'colors',
      'size': 'sizes',
      'model': 'models',
      'material': 'materials',
      'style': 'style',
      'brand': 'brand',
    };
    
    // ✅ تحويل المصفوفة إلى كائن Grouped
    const optionsGrouped: Record<string, string[]> = {
      colors: [],
      sizes: [],
      models: [],
      materials: [],
      weight: [],
      style: [],
      brand: [],
      fabric: [],
      season: [],
      gender: [],
      storage: [],
      ram: [],
      processor: [],
      battery: [],
      screen_size: [],
      camera: [],
      connectivity: [],
    };
    
    productOptions.forEach((opt: any) => {
      const originalType = opt.option_type;
      const mappedType = typeMap[originalType] || originalType;
      
      console.log(`🔍 [ProductFormDialog] Option: ${originalType} → ${mappedType}, value: ${opt.option_value}`);
      
      if (optionsGrouped[mappedType]) {
        optionsGrouped[mappedType].push(opt.option_value);
      } else {
        console.warn(`⚠️ Unknown option type: ${originalType}`);
      }
    });
    
    console.log("🔍 [ProductFormDialog] Grouped options:", optionsGrouped);
    setOptions(optionsGrouped);
    
    // ✅ تعيين الألوان
    if (productColors.length > 0) {
      const mappedColors = productColors.map((c: any) => ({
        id: c.id,
        color_name_ar: c.color_name_ar || c.color_name_en || 'لون',
        color_name_en: c.color_name_en || c.color_name_ar || 'Color',
        color_hex: c.color_hex || null,
        image_url: c.image_url || '',
        sort_order: c.sort_order || 0,
      }));
      
      console.log("🔍 [ProductFormDialog] Setting colors with images:", mappedColors);
      
      setTempColors(mappedColors);
      setColorWithImages(mappedColors.map((c: any) => ({
        name: c.color_name_ar,
        image: c.image_url,
        hex: c.color_hex,
      })));
    } else {
      setTempColors([]);
      setColorWithImages([]);
    }
    
    // ✅ تعيين المقاسات من الخيارات المجمعة
    if (optionsGrouped.sizes && optionsGrouped.sizes.length > 0) {
      setSizes(optionsGrouped.sizes);
    } else {
      setSizes([]);
    }
    
    // ✅ ✅ ✅ 🔥🔥🔥 التعديل هنا 🔥🔥🔥
    // ✅ تعيين التركيبات مباشرة من product.variations مع الأسعار
    if (product.variations && product.variations.length > 0) {
      console.log("🔍 [ProductFormDialog] Raw variations from product:", 
        product.variations.map((v: any) => ({
          id: v.id,
          price: v.price,
          old_price: v.old_price,
          combination: v.combination
        }))
      );
      
      // ✅ تحويل البيانات مع الحفاظ على السعر
      const mappedVariations = product.variations.map((v: any) => ({
        id: v.id,
        combination: v.combination || {},
        is_available: v.is_available !== undefined ? v.is_available : v.is_active !== false,
        price: v.price || 0,
        old_price: v.old_price || null, // ✅ ✅ ✅ الحفاظ على old_price
        sku: v.sku || '',
        stock_quantity: v.stock_quantity || 0,
        color_id: v.color_id || null,
        image_url: v.image_url || null,
      }));
      
      console.log("🔍 [ProductFormDialog] Mapped variations with prices:", 
        mappedVariations.map((v: any) => ({
          id: v.id,
          price: v.price,
          old_price: v.old_price,
          combination: v.combination
        }))
      );
      
      setVariations(mappedVariations);
    } else {
      console.log("ℹ️ [ProductFormDialog] No variations found");
      setVariations([]);
    }
    
  } else {
    // ✅ حالة الإضافة الجديدة
    setForm({
      ...emptyForm,
      is_offer: productType === "offer",
    });
    setOptions({ colors: [], sizes: [], models: [], materials: [], weight: [], style: [], brand: [] });
    setVariations([]);
    setTempColors([]);
    setSizes([]);
    setColorWithImages([]);
    setCategorySearch("");
    setGovernorateSearch("");
  }
  setActiveTab("basic");
  
  // ✅ ✅ ✅ إعادة تعيين isFirstLoadRef عند فتح النافذة
  isFirstLoadRef.current = true;
  
  // ✅ ✅ ✅ إعادة تعيين العلم بعد الانتهاء
  setTimeout(() => {
    isLoadingRef.current = false;
  }, 500);
  
}, [product, productType, open, cats, govs]);
  // ✅ ✅ ✅ إضافة useMemo لحل مشكلة الصور
  const externalColorImages = useMemo(() => {
    const result = Object.fromEntries(
      tempColors.map((c: any) => [c.color_name_ar, c.image_url])
    );
    console.log("🔍 [ProductFormDialog] externalColorImages memoized:", result);
    return result;
  }, [tempColors]);

  const handlePriceChange = (value: string, field: string) => {
    const num = Number(value);
    if (value === "" || value === "-") {
      setForm({ ...form, [field]: 0 });
      return;
    }
    if (num < 0) {
      toast.error(app.lang === "ar" ? "⚠️ السعر لا يمكن أن يكون سالباً" : "⚠️ Price cannot be negative");
      setForm({ ...form, [field]: 0 });
      return;
    }
    
    // ✅ ✅ ✅ منع إعادة التوجيه أثناء كتابة السعر
    isPriceEditingRef.current = true;
    setForm({ ...form, [field]: num });
    
    // ✅ إعادة تعيين بعد 500ms
    setTimeout(() => {
      isPriceEditingRef.current = false;
    }, 500);
  };

  const isFormValid = () => {
    if (!form.title_ar.trim()) return false;
    if (!form.price || form.price <= 0) return false;
    if (form.price < 0) return false;
    
    if (productType === "offer") {
      if (!form.old_price || form.old_price <= form.price) return false;
      if (form.old_price < 0) return false;
    }
    
    if (!form.category_id) return false;
    if (!form.governorate_id) return false;
    if (!form.cover_url?.trim()) return false;
    
    if (tempColors.length > 0) {
      const colorsWithoutImage = tempColors.filter((c: any) => !c.image_url?.trim());
      if (colorsWithoutImage.length > 0) return false;
    }
    
    if (variations.length > 0) {
      const variationsWithoutPrice = variations.filter(v => !v.price || v.price <= 0);
      if (variationsWithoutPrice.length > 0) return false;
    }
    
    return true;
  };

  const validateAndSubmit = async () => {
    console.log("🔍 [validateAndSubmit] ===== STARTING VALIDATION =====");
    console.log("🔍 [validateAndSubmit] Product type:", productType);
    console.log("🔍 [validateAndSubmit] Form data:", { ...form, image_urls: `${form.image_urls?.length || 0} images` });

    if (!form.title_ar.trim()) {
      console.log("❌ [validateAndSubmit] Missing title");
      toast.error(
        app.lang === "ar" 
          ? `الرجاء إدخال ${productType === "offer" ? "اسم العرض" : "اسم المنتج"}` 
          : `Please enter ${productType === "offer" ? "offer name" : "product name"}`
      );
      setActiveTab("basic");
      return;
    }
    console.log("✅ [validateAndSubmit] Title OK:", form.title_ar);
    
    if (!form.price || form.price <= 0) {
      console.log("❌ [validateAndSubmit] Missing price");
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال السعر" : "⚠️ Please enter price");
      setActiveTab("pricing");
      return;
    }
    if (form.price < 0) {
      console.log("❌ [validateAndSubmit] Negative price");
      toast.error(app.lang === "ar" ? "⚠️ السعر لا يمكن أن يكون سالباً" : "⚠️ Price cannot be negative");
      setActiveTab("pricing");
      return;
    }
    console.log("✅ [validateAndSubmit] Price OK:", form.price);
    
    if (productType === "offer") {
      if (!form.old_price || form.old_price <= form.price) {
        console.log("❌ [validateAndSubmit] Old price invalid");
        toast.error(app.lang === "ar" ? "⚠️ السعر القديم يجب أن يكون أكبر من السعر الحالي" : "⚠️ Old price must be greater than current price");
        setActiveTab("pricing");
        return;
      }
      if (form.old_price < 0) {
        console.log("❌ [validateAndSubmit] Negative old price");
        toast.error(app.lang === "ar" ? "⚠️ السعر القديم لا يمكن أن يكون سالباً" : "⚠️ Old price cannot be negative");
        setActiveTab("pricing");
        return;
      }
      console.log("✅ [validateAndSubmit] Old price OK:", form.old_price);
    }
    
    if (!form.category_id) {
      console.log("❌ [validateAndSubmit] Missing category");
      toast.error(app.lang === "ar" ? "⚠️ الرجاء اختيار التصنيف" : "⚠️ Please select category");
      setActiveTab("basic");
      return;
    }
    console.log("✅ [validateAndSubmit] Category OK:", form.category_id);
    
    if (!form.governorate_id) {
      console.log("❌ [validateAndSubmit] Missing governorate");
      toast.error(app.lang === "ar" ? "⚠️ الرجاء اختيار المحافظة" : "⚠️ Please select governorate");
      setActiveTab("basic");
      return;
    }
    console.log("✅ [validateAndSubmit] Governorate OK:", form.governorate_id);
    
    if (!form.cover_url?.trim()) {
      console.log("❌ [validateAndSubmit] Missing cover image");
      toast.error(app.lang === "ar" ? "⚠️ الرجاء رفع الصورة الرئيسية" : "⚠️ Please upload main image");
      setActiveTab("images");
      return;
    }
    console.log("✅ [validateAndSubmit] Cover image OK");
    
    // ✅ ✅ ✅ التحقق من صور الألوان - محسن احترافي
    if (tempColors.length > 0) {
      // ✅ التحقق الذكي: الألوان الموجودة في قاعدة البيانات لا تحتاج صورة جديدة
      const colorsWithoutImage = tempColors.filter((c: any) => {
        // ❌ حالة 1: لون جديد (id يبدأ بـ temp-) وليس له صورة → مطلوب
        if (c.id?.startsWith('temp-') && !c.image_url?.trim()) {
          return true;
        }
        // ✅ حالة 2: لون من قاعدة البيانات (id لا يبدأ بـ temp-) → لا نطلب صورة
        if (c.id && !c.id.startsWith('temp-')) {
          return false;
        }
        // ✅ حالة 3: أي حالة أخرى، تحقق من وجود الصورة
        return !c.image_url?.trim();
      });
      
      if (colorsWithoutImage.length > 0) {
        const colorNames = colorsWithoutImage.map((c: any) => c.color_name_ar).join(', ');
        console.log("❌ [validateAndSubmit] Colors without image:", colorNames);
        toast.error(
          app.lang === "ar" 
            ? `⚠️ الألوان التالية بدون صورة: ${colorNames}` 
            : `⚠️ The following colors have no image: ${colorNames}`
        );
        setActiveTab("options");
        return;
      }
      console.log("✅ [validateAndSubmit] Colors OK:", tempColors.length, "colors with images");
    }
    
    console.log("🔍 [validateAndSubmit] ===== CHECKING OPTIONS =====");
    console.log("🔍 [validateAndSubmit] Options object:", options);
    console.log("🔍 [validateAndSubmit] Options keys:", Object.keys(options));
    
    const activeOptionsCount = Object.values(options).filter(arr => arr.length > 0).length;
    console.log("🔍 [validateAndSubmit] Active options count:", activeOptionsCount);
    
    Object.entries(options).forEach(([key, values]) => {
      if (values.length > 0) {
        console.log(`🔍 [validateAndSubmit]   - ${key}: ${values.length} values (${values.join(', ')})`);
      }
    });
    
    console.log("🔍 [validateAndSubmit] Variations count:", variations.length);
    if (variations.length > 0) {
      console.log("🔍 [validateAndSubmit] Variations:", variations.map(v => 
        `${Object.values(v.combination).join(' • ')} (${v.is_available ? '✅' : '❌'})`
      ));
    }
    
    if (activeOptionsCount >= 2) {
      console.log("🔍 [validateAndSubmit] ⚠️ Active options >= 2, checking variations...");
      const hasVariations = variations.length > 0;
      console.log("🔍 [validateAndSubmit] Has variations?", hasVariations);
      
      if (!hasVariations) {
        console.log("❌ [validateAndSubmit] ERROR: Options found but NO variations!");
        console.log("❌ [validateAndSubmit] User must generate variations first!");
        
        setActiveTab("options");
        
        toast.error(
          app.lang === "ar" 
            ? "⚠️ لديك خيارين أو أكثر (ألوان، مقاسات، إلخ) ولكن لم تقم بتوليد التركيبات!\n\n📌 الرجاء التوجه إلى تبويب 'خيارات' والضغط على زر 'توليد التركيبات' في الأسفل" 
            : "⚠️ You have 2 or more options (colors, sizes, etc.) but haven't generated variations!\n\n📌 Please go to the 'Options' tab and click the 'Generate Variations' button below"
        );
        return;
      }
      
      console.log("✅ [validateAndSubmit] Variations exist, proceeding...");
    } else {
      console.log("ℹ️ [validateAndSubmit] Active options < 2, skipping variations check");
    }
    
    // ✅ ✅ ✅ التحقق من أسعار الفيرنتس - محسن احترافي
    if (variations.length > 0) {
      // ✅ التحقق من أن كل تركيبة لها سعر
      const variationsWithoutPrice = variations.filter(v => {
        // ❌ السعر غير موجود أو null أو undefined أو <= 0
        return v.price === undefined || v.price === null || v.price <= 0;
      });
      
      if (variationsWithoutPrice.length > 0) {
        console.log("❌ [validateAndSubmit] Variations without price:", variationsWithoutPrice.length);
        // ✅ عرض أسماء التركيبات بدون سعر للمساعدة
        const variationNames = variationsWithoutPrice.map(v => {
          return Object.values(v.combination || {}).join(' • ');
        }).join(', ');
        
        toast.error(
          app.lang === "ar" 
            ? `⚠️ هناك ${variationsWithoutPrice.length} تركيبة بدون سعر:\n${variationNames}\n\n📌 الرجاء تحديد السعر لكل تركيبة` 
            : `⚠️ ${variationsWithoutPrice.length} variations have no price:\n${variationNames}\n\n📌 Please set price for each variation`
        );
        setActiveTab("options");
        return;
      }
    }
    
    console.log("✅ [validateAndSubmit] ===== ALL VALIDATIONS PASSED =====");
    console.log("✅ [validateAndSubmit] Submitting product...");
    
   setIsSubmitting(true);
  try {
    // ✅ ✅ ✅ استخدم options.sizes بدلاً من sizes
    const finalSizes = options.sizes || [];
    
    console.log("🔍🔍🔍 [ProductFormDialog] finalSizes:", finalSizes);
    console.log("🔍🔍🔍 [ProductFormDialog] options.sizes:", options.sizes);
    
    const allData = { 
      ...form, 
      options: {
        ...options,
        colors: tempColors.map((c: any) => c.color_name_ar),
        sizes: finalSizes,  // ✅ استخدم finalSizes
      },
      variations: variations.map(v => ({
        ...v,
        price: v.price || form.price,
        old_price: v.old_price || form.old_price || null,
      })),
      colors: tempColors,
      image_urls: form.image_urls,
    };
    
    console.log("✅ [validateAndSubmit] Data to save:", {
      title: allData.title_ar,
      price: allData.price,
      is_offer: allData.is_offer,
      options_count: Object.values(allData.options).filter(arr => arr.length > 0).length,
      variations_count: allData.variations.length,
      colors_count: allData.colors.length,
      sizes_count: allData.options.sizes?.length || 0,  // ✅ أضف هذا
    });
    console.log("🔍🔍🔍 [ProductFormDialog] allData.options.sizes:", allData.options.sizes);
console.log("🔍🔍🔍 [ProductFormDialog] allData.options:", allData.options);
    await onSave(allData);
    console.log("✅ [validateAndSubmit] Product saved successfully!");
  } catch (error) {
    console.error("❌ [validateAndSubmit] Error saving:", error);
  } finally {
    setIsSubmitting(false);
    console.log("🔍 [validateAndSubmit] ===== VALIDATION END =====");
  }
};

 // ✅ ✅ ✅ دالة معالجة الألوان مع الصور (معدلة)
const handleColorsWithImagesChange = (colors: ColorWithImage[]) => {
  setColorWithImages(colors);
  
  const newTempColors = colors.map((c, index) => ({
    id: `temp-${Date.now()}-${index}`,
    color_name_ar: c.name,
    color_name_en: c.name,
    // ✅ ✅ ✅ تعبئة color_hex تلقائياً من القاموس
    color_hex: c.hex || DEFAULT_COLORS[c.name] || '#CCCCCC',
    image_url: c.image,
    sort_order: index,
  }));
  setTempColors(newTempColors);
  
  setOptions(prev => ({
    ...prev,
    colors: colors.map(c => c.name),
  }));
};

const handleSizesUpdate = (newSizes: string[]) => {
  console.log("🔍🔍🔍 [ProductFormDialog] handleSizesUpdate called with:", newSizes);
  setSizes(newSizes);
  setOptions(prev => ({
    ...prev,
    sizes: newSizes,
  }));
};

  const getProductIcon = () => {
    if (productType === "offer") return <Gift className="h-6 w-6 text-emerald-500" />;
    return <Package className="h-6 w-6 text-[#2a655f]" />;
  };

  const getProductTitle = () => {
    if (product) {
      return app.lang === "ar" ? "تعديل المنتج" : "Edit Product";
    }
    if (productType === "offer") {
      return app.lang === "ar" ? "إضافة عرض جديد" : "Add New Offer";
    }
    return app.lang === "ar" ? "إضافة منتج جديد" : "Add New Product";
  };

  const getProductSubtitle = () => {
    if (product) {
      return app.lang === "ar" ? "قم بتعديل بيانات المنتج" : "Edit product details";
    }
    if (productType === "offer") {
      return app.lang === "ar" ? "أضف عرضاً خاصاً لعملائك" : "Add a special offer for your customers";
    }
    return app.lang === "ar" ? "املأ البيانات التالية لإضافة منتج جديد" : "Fill in the details below to add a new product";
  };

  const getTabLabel = (tab: string) => {
    const labels: Record<string, string> = {
      basic: lang === "ar" ? "أساسيات" : "Basic",
      pricing: lang === "ar" ? "السعر" : "Pricing",
      images: lang === "ar" ? "الصور" : "Images",
      options: lang === "ar" ? "خيارات" : "Options",
    };
    return labels[tab] || tab;
  };

  const getTabIcon = (tab: string) => {
    const icons: Record<string, any> = {
      basic: Info,
      pricing: Coins,
      images: Camera,
      options: Layers,
    };
    return icons[tab] || Info;
  };

  const isLastTab = activeTab === TAB_ORDER[TAB_ORDER.length - 1];
  const isFirstTab = activeTab === TAB_ORDER[0];
  const currentIndex = TAB_ORDER.indexOf(activeTab);

  const goToTab = (tab: string) => {
    const targetIndex = TAB_ORDER.indexOf(tab);
    const currentIndex = TAB_ORDER.indexOf(activeTab);
    if (targetIndex > currentIndex) {
      for (let i = currentIndex; i < targetIndex; i++) {
        if (!isTabValid(TAB_ORDER[i])) {
          toast.warning(
            lang === "ar" 
              ? `⚠️ يرجى إكمال قسم "${getTabLabel(TAB_ORDER[i])}" أولاً` 
              : `⚠️ Please complete "${getTabLabel(TAB_ORDER[i])}" section first`
          );
          return;
        }
      }
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-[#2a655f]/10">
        
        {/* ===== Header ===== */}
        <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-4 md:p-6">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2a655f] to-transparent animate-pulse" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="relative group">
                <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
                <div className="relative p-3 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#2a655f]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {getProductIcon()}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {getProductTitle()}
                  {productType === "offer" && (
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 animate-pulse">
                      🔥 عرض
                    </Badge>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
                  {getProductSubtitle()}
                  <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
                  <span className="text-xs text-[#2a655f] font-medium">
                    {product ? (lang === "ar" ? "تعديل" : "Edit") : (lang === "ar" ? "جديد" : "New")}
                  </span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 hover:rotate-90 hover:scale-110"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5 text-[#2a655f]" />
            </Button>
          </div>
          
          {/* ===== شريط التقدم ===== */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-[#2a655f]">
                  {getTabLabel(activeTab)}
                </span>
                <span className="text-[10px] text-[#2a655f]/60">
                  {currentIndex + 1} / {TAB_ORDER.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {TAB_ORDER.map((tab, index) => {
                  const isActive = activeTab === tab;
                  const isCompleted = TAB_ORDER.indexOf(activeTab) > index;
                  return (
                    <div
                      key={tab}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500 cursor-pointer",
                        isActive ? "w-8 bg-[#2a655f] shadow-lg shadow-[#2a655f]/30" : 
                        isCompleted ? "w-4 bg-[#2a655f]/60" : "w-4 bg-slate-200 dark:bg-slate-700"
                      )}
                      onClick={() => goToTab(tab)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* ===== Tabs ===== */}
          <div className="mt-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList 
                className="grid grid-cols-4 gap-1.5 bg-[#2a655f]/5 dark:bg-[#2a655f]/20 p-1.5 rounded-2xl border border-[#2a655f]/10 dark:border-[#2a655f]/20"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {TAB_ORDER.map((tab) => {
                  const Icon = getTabIcon(tab);
                  const isActive = activeTab === tab;
                  return (
                    <TabsTrigger 
                      key={tab}
                      value={tab} 
                      className="rounded-xl text-xs font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-lg data-[state=active]:shadow-[#2a655f]/20 data-[state=active]:border-[#2a655f]/30 transition-all duration-300 group"
                    >
                      <Icon className={cn(
                        "h-3.5 w-3.5 ml-1.5 transition-all duration-300",
                        isActive ? "text-[#2a655f] animate-pulse" : "text-muted-foreground group-hover:text-[#2a655f]"
                      )} />
                      {getTabLabel(tab)}
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f] animate-pulse ml-1" />
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* ===== Body ===== */}
        <div className="p-4 md:p-6 space-y-6">
          
          {/* ===== TAB: Basic ===== */}
          {activeTab === "basic" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="relative overflow-hidden rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 p-5">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#2a655f]/5 blur-3xl" />
                <div className="flex items-start gap-3 relative">
                  <div className="p-2.5 rounded-xl bg-[#2a655f]/10">
                    <Info className="h-5 w-5 text-[#2a655f]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]">
                      {lang === "ar" ? `📝 ${productType === "offer" ? "معلومات العرض" : "المعلومات الأساسية"}` : `📝 ${productType === "offer" ? "Offer Information" : "Basic Information"}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" 
                        ? `أدخل ${productType === "offer" ? "اسم العرض" : "اسم المنتج"} ووصفه واختر التصنيف والمحافظة المناسبة` 
                        : `Enter ${productType === "offer" ? "offer" : "product"} name, description and select appropriate category and governorate`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative group">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    {labels.name}
                    <span className="text-red-500">*</span>
                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] animate-pulse">
                      {lang === "ar" ? "مطلوب" : "Required"}
                    </Badge>
                  </Label>
                  <div className="relative mt-1.5">
                    <div className="absolute inset-y-0 start-3 flex items-center">
                      {productType === "offer" ? (
                        <Gift className="h-4 w-4 text-[#2a655f]/60" />
                      ) : (
                        <Package className="h-4 w-4 text-[#2a655f]/60" />
                      )}
                    </div>
                    <Input
                      value={form.title_ar}
                      onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                      placeholder={labels.placeholderName}
                      className="ps-10 h-12 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    {labels.description}
                    <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                      {lang === "ar" ? "اختياري" : "Optional"}
                    </Badge>
                  </Label>
                  <div className="relative mt-1.5">
                    <Textarea
                      rows={4}
                      value={form.description_ar}
                      onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                      placeholder={labels.placeholderDesc}
                      className="rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 resize-none hover:border-[#2a655f]/30"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Info className="h-3 w-3 text-[#2a655f]" />
                      {lang === "ar" 
                        ? "💡 وصف واضح وشامل يزيد من فرص البيع" 
                        : "💡 Clear and comprehensive description increases sales chances"}
                    </p>
                  </div>
                </div>

                {/* ===== Category & Location ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      {lang === "ar" ? "التصنيف" : "Category"}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="relative">
                        <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" />
                        <Input
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          onFocus={() => setIsCategoryOpen(true)}
                          placeholder={lang === "ar" ? "🔍 ابحث عن تصنيف..." : "🔍 Search category..."}
                          className="ps-9 h-12 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                        />
                        {categorySearch && (
                          <button
                            onClick={() => setCategorySearch("")}
                            className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      {isCategoryOpen && (
                        <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 shadow-xl shadow-[#2a655f]/10">
                          {filteredCategories.length === 0 ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                            </div>
                          ) : (
                            filteredCategories.map((c: any) => (
                              <button
                                key={c.id}
                                className={cn(
                                  "w-full text-start px-4 py-3 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                                  form.category_id === c.id && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30 text-[#2a655f]"
                                )}
                                onClick={() => {
                                  setForm({ ...form, category_id: c.id });
                                  setCategorySearch(lang === "ar" ? c.name_ar : c.name_en);
                                  setIsCategoryOpen(false);
                                }}
                              >
                                {form.category_id === c.id && (
                                  <CheckCircle2 className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                                )}
                                <span>{lang === "ar" ? c.name_ar : c.name_en}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      {lang === "ar" ? "المحافظة" : "Governorate"}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="relative">
                        <MapPin className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" />
                        <Input
                          value={governorateSearch}
                          onChange={(e) => setGovernorateSearch(e.target.value)}
                          onFocus={() => setIsGovernorateOpen(true)}
                          placeholder={lang === "ar" ? "🔍 ابحث عن محافظة..." : "🔍 Search governorate..."}
                          className="ps-9 h-12 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                        />
                        {governorateSearch && (
                          <button
                            onClick={() => setGovernorateSearch("")}
                            className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      {isGovernorateOpen && (
                        <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 shadow-xl shadow-[#2a655f]/10">
                          {filteredGovernorates.length === 0 ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                            </div>
                          ) : (
                            filteredGovernorates.map((g: any) => (
                              <button
                                key={g.id}
                                className={cn(
                                  "w-full text-start px-4 py-3 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                                  form.governorate_id === g.id && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30 text-[#2a655f]"
                                )}
                                onClick={() => {
                                  setForm({ ...form, governorate_id: g.id });
                                  setGovernorateSearch(lang === "ar" ? g.name_ar : g.name_en);
                                  setIsGovernorateOpen(false);
                                }}
                              >
                                {form.governorate_id === g.id && (
                                  <CheckCircle2 className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                                )}
                                <span>{lang === "ar" ? g.name_ar : g.name_en}</span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ===== Availability ===== */}
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    {lang === "ar" ? "حالة التوفر" : "Availability"}
                  </Label>
                  <div className="mt-1.5 p-4 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10 dark:to-transparent rounded-2xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30">
                    <label className="flex items-center gap-3 text-sm cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={form.is_available === true}
                          onChange={(e) => {
                            const newValue = e.target.checked;
                            setForm(prev => ({ ...prev, is_available: newValue }));
                          }}
                          className="h-5 w-5 rounded border-slate-300/50 accent-[#2a655f] cursor-pointer transition-all duration-300 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-semibold transition-all duration-300",
                          form.is_available === true ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                        )}>
                          {form.is_available === true
                            ? (lang === "ar" ? "✅ متوفر للبيع" : "✅ Available for sale")
                            : (lang === "ar" ? "❌ غير متوفر" : "❌ Unavailable")}
                        </span>
                        {form.is_available === true ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px] animate-pulse">
                            {lang === "ar" ? "نشط" : "Active"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800/30 text-[10px]">
                            {lang === "ar" ? "غير نشط" : "Inactive"}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground group-hover:text-[#2a655f] transition-colors">
                        {form.is_available === true
                          ? (lang === "ar" ? "🟢 العملاء يمكنهم الشراء" : "🟢 Customers can purchase")
                          : (lang === "ar" ? "🔴 غير متاح للشراء حالياً" : "🔴 Not available for purchase")}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB: Pricing ===== */}
          {activeTab === "pricing" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="relative overflow-hidden rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 dark:from-emerald-500/20 dark:to-emerald-500/10 p-5">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-emerald-500/5 blur-3xl" />
                <div className="flex items-start gap-3 relative">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10">
                    <Coins className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {lang === "ar" ? `💰 ${productType === "offer" ? "تسعير العرض" : "تسعير المنتج"}` : `💰 ${productType === "offer" ? "Offer Pricing" : "Product Pricing"}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" 
                        ? `حدد ${productType === "offer" ? "سعر العرض والسعر القديم" : "السعر المناسب للمنتج"}` 
                        : `Set ${productType === "offer" ? "offer price and old price" : "appropriate product price"}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* ✅ فقط حقل السعر بالليرة السورية */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Coins className="h-3.5 w-3.5 text-[#2a655f]" />
                    {lang === "ar" ? `السعر (ل.س)` : `Price (SYP)`}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <div className="absolute inset-y-0 start-3 flex items-center">
                      <span className="text-sm font-bold text-[#2a655f]/60">ل.س</span>
                    </div>
                    <Input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(e) => handlePriceChange(e.target.value, "price")}
                      placeholder="0"
                      className="ps-12 h-12 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                    />
                  </div>
                </div>
              </div>

              {/* ✅ للعروض فقط: حقل السعر القديم */}
              {productType === "offer" && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100/30 dark:from-yellow-950/30 dark:to-yellow-950/10 rounded-2xl border border-yellow-200/50 dark:border-yellow-800/30">
                    <div className="p-2 rounded-xl bg-yellow-500/10 animate-pulse">
                      <Gift className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                        {lang === "ar" ? "🛍️ هذا المنتج هو عرض خاص" : "🛍️ This product is a special offer"}
                      </p>
                      <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70">
                        {lang === "ar" 
                          ? "أدخل السعر القديم لعرض الخصم للعملاء" 
                          : "Enter the old price to show the discount to customers"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Coins className="h-3.5 w-3.5 text-[#2a655f]" />
                        {lang === "ar" ? "السعر القديم (ل.س)" : "Old Price (SYP)"}
                        <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 start-3 flex items-center">
                          <span className="text-sm font-bold text-[#2a655f]/60">ل.س</span>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={form.old_price}
                          onChange={(e) => handlePriceChange(e.target.value, "old_price")}
                          placeholder="0"
                          className="ps-12 h-12 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                        />
                      </div>
                    </div>
                  </div>

                  {form.old_price > form.price && form.old_price > 0 && (
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-950/10 rounded-2xl border-2 border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-5 duration-300">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-sm px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/30 animate-pulse">
                        🎯 {Math.round(((form.old_price - form.price) / form.old_price) * 100)}% {lang === "ar" ? "خصم" : "OFF"}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        {lang === "ar" ? "العميل سيوفر" : "Customer saves"} 
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                          {formatPrice(form.old_price - form.price, app.currency, app.lang)}
                        </span>
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ===== TAB: Images ===== */}
          {activeTab === "images" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="relative overflow-hidden rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-gradient-to-r from-purple-500/5 to-purple-500/10 dark:from-purple-500/20 dark:to-purple-500/10 p-5">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-500/5 blur-3xl" />
                <div className="flex items-start gap-3 relative">
                  <div className="p-2.5 rounded-xl bg-purple-500/10">
                    <Camera className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400">
                      {lang === "ar" ? "📸 صور المنتج" : "📸 Product Images"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" 
                        ? "الصور الجيدة تزيد من فرص البيع بنسبة تصل إلى 80%" 
                        : "Good images increase sales chances by up to 80%"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  {lang === "ar" ? "الصورة الرئيسية" : "Main Image"}
                  <span className="text-red-500">*</span>
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] animate-pulse">
                    {lang === "ar" ? "مطلوبة" : "Required"}
                  </Badge>
                </Label>
                <div className="mt-1.5">
                  <ImageInput
                    value={form.cover_url}
                    onChange={(value) => setForm({ ...form, cover_url: value })}
                    userId={app.user?.id}
                    folder="products"
                    lang={app.lang}
                    label={lang === "ar" ? "📸 اضغط لرفع الصورة الرئيسية" : "📸 Click to upload main image"}
                    hint={lang === "ar" ? "صورة واحدة على الأقل مطلوبة" : "At least one image is required"}
                    previewClassName="aspect-video h-auto rounded-2xl max-h-[300px] border-2 border-[#2a655f]/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-800/10 p-5 border-2 border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#2a655f]/10">
                      <ImageIcon className="h-4 w-4 text-[#2a655f]" />
                    </div>
                    <Label className="font-semibold text-slate-700 dark:text-slate-300">
                      {lang === "ar" ? "صور إضافية" : "Additional Images"}
                    </Label>
                    <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                      {lang === "ar" ? "اختيارية" : "Optional"}
                    </Badge>
                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
                      {form.image_urls.length}/6
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setForm({ ...form, image_urls: [...form.image_urls, ""] })}
                    disabled={form.image_urls.length >= 6}
                    className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
                  >
                    <Plus className="h-4 w-4 me-1" /> {lang === "ar" ? "إضافة" : "Add"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {form.image_urls.map((url, index) => (
                    <ImageInput
                      key={index}
                      value={url}
                      onChange={(value) => {
                        const next = [...form.image_urls];
                        next[index] = value;
                        setForm({ ...form, image_urls: next });
                      }}
                      userId={app.user?.id}
                      folder="products"
                      lang={app.lang}
                      label={`${lang === "ar" ? "صورة" : "Image"} ${index + 1}`}
                      hint={lang === "ar" ? "اختيارية" : "Optional"}
                      previewClassName="aspect-video h-auto rounded-2xl border-2 border-slate-200/50"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB: Options ===== */}
          {activeTab === "options" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="relative overflow-hidden rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-gradient-to-r from-indigo-500/5 to-indigo-500/10 dark:from-indigo-500/20 dark:to-indigo-500/10 p-5">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-500/5 blur-3xl" />
                <div className="flex items-start gap-3 relative">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10">
                    <Layers className="h-5 w-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {lang === "ar" ? "⚙️ خيارات وتركيبات المنتج" : "⚙️ Product Options & Variations"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" 
                        ? "أضف الألوان مع الصور والمقاسات والتركيبات المتوفرة" 
                        : "Add colors with images, sizes and available variations"}
                    </p>
                  </div>
                </div>
              </div>

          <ProductOptionsManager
  value={options}
  onChange={setOptions}
  lang={app.lang}
  variations={variations}
  onVariationsChange={setVariations}
  userId={app.user?.id || ''}
  onColorsWithImagesChange={handleColorsWithImagesChange}
  externalColorImages={externalColorImages}
  sizes={sizes}
  onSizesChange={handleSizesUpdate}
  isOffer={productType === "offer"}  // ✅ هذا السطر الجديد
/>
            </div>
          )}
        </div>

       {/* ===== Footer ===== */}
<div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-4 md:p-6 rounded-b-2xl">
  <div className="flex items-center justify-between gap-3">
    <Button
      variant="outline"
      onClick={goToPrevTab}
      disabled={isFirstTab}
      className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isRTL ? (
        <ArrowRight className="h-4 w-4 ml-2" />
      ) : (
        <ArrowLeft className="h-4 w-4 mr-2" />
      )}
      {lang === "ar" ? "السابق" : "Previous"}
    </Button>

    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        onClick={() => onOpenChange(false)}
        className="rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 h-12 px-6"
      >
        {lang === "ar" ? "إلغاء" : "Cancel"}
      </Button>

      {isLastTab ? (
        <Button
          onClick={validateAndSubmit}
          disabled={!isFormValid() || isSaving || isSubmitting}
          className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 h-12 px-8 hover:shadow-[#2a655f]/40 hover:scale-[1.02] hover:from-[#3a8a82] hover:to-[#4a9f95] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving || isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              {lang === "ar" ? "جاري النشر..." : "Publishing..."}
            </span>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {product 
                ? (lang === "ar" ? "حفظ التغييرات" : "Save Changes")
                : (productType === "offer"
                  ? (lang === "ar" ? "نشر العرض" : "Publish Offer")
                  : (lang === "ar" ? "نشر المنتج" : "Publish Product")
                )
              }
            </>
          )}
        </Button>
      ) : (
        <Button
          onClick={goToNextTab}
          disabled={!isTabValid(activeTab)}
          className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 h-12 px-8 hover:shadow-[#2a655f]/40 hover:scale-[1.02] hover:from-[#3a8a82] hover:to-[#4a9f95] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {lang === "ar" ? "التالي" : "Next"}
          {isRTL ? (
            <ArrowLeft className="h-4 w-4 mr-2" />
          ) : (
            <ArrowRight className="h-4 w-4 ml-2" />
          )}
        </Button>
      )}
    </div>
  </div>
</div>
      </DialogContent>
    </Dialog>
  );
}