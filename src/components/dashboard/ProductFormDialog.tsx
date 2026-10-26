// src/components/dashboard/ProductFormDialog.tsx

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
  X, Plus, Package, Gift, Sparkles, Truck, CreditCard, 
  Tag, MapPin, Image as ImageIcon, CheckCircle2,
  Layers, Palette, Search, ChevronDown,
  Save, AlertCircle, Info, Star, Shield, Clock, User,
  Camera, Trash2, Edit2, Heart, BookOpen, Cake,
  ChevronRight, ChevronLeft, Zap, Award, TrendingUp, ShieldCheck,
  ArrowRight, ArrowLeft, Coins, Folder, FolderTree, CornerDownRight,
  Loader2
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
import { useCategories, useGovernorates, useSellerListing, type ListingKind } from "@/lib/queries";
import { useCategoryOptions } from "@/lib/hooks/useCategoryOptions";
import { ImageInput } from "@/components/ImageInput";
import { ProductOptionsManager, type Variation, type ColorWithImage } from "./ProductOptionsManager";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: any;
  productType: "product" | "offer";
  onSave: (data: any) => void;
  isSaving: boolean;
  lang: string;
}

// ✅ قاموس الألوان الشامل
const DEFAULT_COLORS: Record<string, string> = {
  'أحمر': '#FF0000', 'احمر': '#FF0000',
  'قرمزي': '#DC143C', 'كرزي': '#DE3163',
  'مرجاني': '#FF7F50',
  'أزرق': '#0000FF', 'ازرق': '#0000FF',
  'كحلي': '#000080',
  'فيروزي': '#40E0D0', 'تركواز': '#40E0D0',
  'سماوي': '#00BFFF',
  'أخضر': '#00FF00', 'اخضر': '#00FF00',
  'زمردي': '#50C878',
  'نعناعي': '#98FF98',
  'زيتوني': '#808000',
  'أسود': '#000000', 'اسود': '#000000',
  'أبيض': '#FFFFFF', 'ابيض': '#FFFFFF',
  'عاجي': '#FFFFF0', 'لؤلؤي': '#F5F5F5',
  'بني': '#8B4513',
  'قهوي': '#6F4E37',
  'شوكولاتة': '#7B3F00',
  'بيج': '#F5F5DC',
  'كاكي': '#C3B091',
  'نحاسي': '#B87333',
  'ذهبي': '#FFD700',
  'فضي': '#C0C0C0',
  'برونزي': '#CD7F32',
  'أصفر': '#FFFF00', 'اصفر': '#FFFF00',
  'ليموني': '#FFF44F',
  'برتقالي': '#FF8C00',
  'خوخي': '#FFDAB9',
  'عنبري': '#FFBF00',
  'وردي': '#FF69B4',
  'زهر': '#FF69B4',
  'زهري': '#FFB6C1',
  'فوشي': '#FF00FF',
  'بنفسجي': '#8B008B',
  'أرجواني': '#800080',
  'موف': '#C8A2C8',
  'لافندر': '#E6E6FA',
  'رمادي': '#808080',
  'رمادي غامق': '#404040',
  'رمادي فاتح': '#D3D3D3',
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
  parent_category_id: "",
  governorate_id: "",
  cover_url: "",
  image_urls: [""],
};

const TAB_ORDER = ['basic', 'pricing', 'images', 'options'];

// ============================================================
// 🔑 [FIX] دالة fetch مع retry — لمعالجة Supabase replication lag
// ============================================================
async function fetchWithRetry<T>(
  fetcher: () => Promise<{ data: T | null; error: any }>,
  options: { 
    attempts?: number; 
    validate?: (data: T | null) => boolean;
    delayMs?: number;
  } = {}
): Promise<{ data: T | null; error: any }> {
  const attempts = options.attempts ?? 3;
  const baseDelay = options.delayMs ?? 300;
  const validate = options.validate ?? ((d) => d !== null);

  let lastResult: { data: T | null; error: any } = { data: null, error: null };

  for (let i = 0; i < attempts; i++) {
    try {
      const result = await fetcher();
      lastResult = result;

      if (!result.error && validate(result.data)) {
        return result;
      }

      if (!result.error && !validate(result.data) && i < attempts - 1) {
        console.log(`🔄 [fetchWithRetry] Attempt ${i + 1}/${attempts} returned empty — retrying in ${baseDelay * (i + 1)}ms`);
        await new Promise(r => setTimeout(r, baseDelay * (i + 1)));
        continue;
      }

      if (result.error) {
        return result;
      }
    } catch (e: any) {
      lastResult = { data: null, error: e };
      if (i < attempts - 1) {
        await new Promise(r => setTimeout(r, baseDelay * (i + 1)));
        continue;
      }
    }
  }

  return lastResult;
}

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
  
  // ============================================================
  // 🔑 [FIX-2026] جلب بيانات المنتج الكاملة من useSellerListing
  // (RPC مخصص للبائع — يقبل pending/published/rejected)
  // ============================================================
  const productIdForFetch = product?.id;
  const { data: freshProduct } = useSellerListing(productIdForFetch);
  
 // ✅ [FIX-RPC-CACHE-2026] product (من openEditDialog) محدّث من DB مباشرة
// freshProduct (من RPC) قد يحمل plan cache قديم → نعطي الأولوية لـ product
const effectiveProduct = product || freshProduct;
  
  const isLoadingRef = useRef(false);
  const [form, setForm] = useState(emptyForm);
  const [options, setOptions] = useState<Record<string, string[]>>({});
  const [variations, setVariations] = useState<Variation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempColors, setTempColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [colorWithImages, setColorWithImages] = useState<ColorWithImage[]>([]);

  // ✅ State للتصنيف الرئيسي والفرعي
  const [parentCategoryId, setParentCategoryId] = useState<string>("");
  const [subCategoryId, setSubCategoryId] = useState<string>("");
  const [parentCategorySearch, setParentCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [isParentCategoryOpen, setIsParentCategoryOpen] = useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
  
  const [governorateSearch, setGovernorateSearch] = useState("");
  const [isGovernorateOpen, setIsGovernorateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // ✅ إعادة التاب إلى "أساسيات" عند الفتح
  useEffect(() => {
    if (open) {
      setActiveTab("basic");
    }
  }, [open]);

  // ============================================================
  // 🔑 [FIX-2026] تثبيت productId و isEditing — لا يتغيران أثناء الحفظ
  // ============================================================
  const isEditingRef = useRef<boolean>(!!product);
  const stableProductIdRef = useRef<string | undefined>(product?.id);

  useEffect(() => {
    if (!open) return;
    
    isEditingRef.current = !!product;
    stableProductIdRef.current = product?.id;
    
    console.log('🔑 [FIX-2026] Stable refs updated:', {
      isEditing: isEditingRef.current,
      productId: stableProductIdRef.current,
    });
  }, [open, product?.id]);

  // ============================================================
  // 🔑 [FIX-RACE-2026-SWITCH] تصفير الحالة فوراً عند تبديل المنتج
  // ============================================================
  // المشكلة: عند فتح منتج جديد، state (options/variations) لا يزال يحمل
  // بيانات المنتج السابق حتى تصل بيانات DB. في هذه الأثناء، Auto-Generate
  // في ProductOptionsManager قد يعمل على options قديمة + variations جديدة
  // → NOT FOUND → يمسح التركيبة الأصلية → يولّد "تركيبة جديدة".
  //
  // الحل: عند تغيّر effectiveProduct.id، صفّر options و variations فوراً
  // حتى تصبح hasOptionsReady = false في ProductOptionsManager، فيتوقف
  // Auto-Generate عن العمل حتى تصل البيانات الحقيقية للمنتج الجديد.
  // ============================================================
  const lastFormProductIdRef = useRef<string | undefined>(undefined);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (!open) return;
    
    const currentProductId = effectiveProduct?.id;
    
    // في أول mount: لا تصفّر (لا يوجد منتج سابق)
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      lastFormProductIdRef.current = currentProductId;
      return;
    }
    
    // إذا تغيّر المنتج (من A إلى B، أو من منتج إلى null)
    if (lastFormProductIdRef.current !== currentProductId) {
      console.log('🔄 [FIX-RACE-2026-SWITCH] Product switched → resetting state:', {
        from: lastFormProductIdRef.current,
        to: currentProductId,
      });
      lastFormProductIdRef.current = currentProductId;
      
      // صفّر كل ما يتعلق بالخيارات والتركيبات
      setOptions({});
      setVariations([]);
      setTempColors([]);
      setSizes([]);
      setColorWithImages([]);
      
      // اسمح لـ useEffect الرئيسي بإعادة الجلب للمنتج الجديد
      lastLoadedProductIdRef.current = null;
      isLoadingRef.current = false;
      wasSavedRef.current = false;
    }
  }, [open, effectiveProduct?.id]);

  const isPriceEditingRef = useRef(false);

  // 🔑 [FIX-PERF-2026] debounce ref
  const priceUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingPriceRef = useRef<number>(0);

  // ✅ تتبع التركيبات التي عدّلها المستخدم يدوياً
  const manuallyEditedIdsRef = useRef<Set<string>>(new Set());

  // ✅ لتتبع آخر منتج تم تحميله
  const lastLoadedProductIdRef = useRef<string | null>(null);

  // ✅ لمعرفة إن كان المنتج قد حُفظ للتو
  const wasSavedRef = useRef(false);

  // ✅ حماية onVariationsChange من مسح التركيبات أثناء/بعد الحفظ
  const isSavingRef = useRef(false);
  const saveCompletedAtRef = useRef<number>(0);

  // ============================================================
  // ✅ جلب خيارات التصنيف الرئيسي
  // ============================================================
  const { 
    data: categoryOptions = [], 
    isLoading: isLoadingCategoryOptions 
  } = useCategoryOptions(parentCategoryId || null);

  const availableOptions = useMemo(() => {
    return categoryOptions.map((opt) => ({
      key: opt.option_key,
      name_ar: opt.option_name_ar,
      name_en: opt.option_name_en,
      type: opt.option_type,
      required: opt.is_required,
      sort_order: opt.sort_order,
    }));
  }, [categoryOptions]);

  // ============================================================
  // ✅ التصنيفات
  // ============================================================
  const mainCategories = useMemo(() => {
    return cats.filter((c: any) => !c.parent_id && c.active !== false);
  }, [cats]);

  const subCategories = useMemo(() => {
    if (!parentCategoryId) return [];
    return cats.filter((c: any) => c.parent_id === parentCategoryId && c.active !== false);
  }, [cats, parentCategoryId]);

  const hasSubCategories = subCategories.length > 0;

  const filteredMainCategories = useMemo(() => {
    if (!parentCategorySearch.trim()) return mainCategories;
    const search = parentCategorySearch.toLowerCase().trim();
    return mainCategories.filter((c: any) => {
      const nameAr = (c.name_ar || "").toLowerCase();
      const nameEn = (c.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search);
    });
  }, [mainCategories, parentCategorySearch]);

  const filteredSubCategories = useMemo(() => {
    if (!subCategorySearch.trim()) return subCategories;
    const search = subCategorySearch.toLowerCase().trim();
    return subCategories.filter((c: any) => {
      const nameAr = (c.name_ar || "").toLowerCase();
      const nameEn = (c.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search);
    });
  }, [subCategories, subCategorySearch]);

  const getCategoryName = useCallback((categoryId: string) => {
    if (!categoryId) return "";
    const cat = cats.find((c: any) => c.id === categoryId);
    return cat ? (app.lang === "ar" ? cat.name_ar : cat.name_en) : "";
  }, [cats, app.lang]);

  const getGovernorateName = (governorateId: string) => {
    if (!governorateId) return "";
    const gov = govs.find((g: any) => g.id === governorateId);
    return gov ? (app.lang === "ar" ? gov.name_ar : gov.name_en) : "";
  };

  const filteredGovernorates = useMemo(() => {
    if (!governorateSearch.trim()) return govs;
    const search = governorateSearch.toLowerCase().trim();
    return govs.filter((g: any) => {
      const nameAr = (g.name_ar || "").toLowerCase();
      const nameEn = (g.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search);
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
        iconColor: "text-[#1a4f4a]",
        bgGradient: "from-[#1a4f4a]/5 to-[#1a4f4a]/10 dark:from-[#1a4f4a]/20 dark:to-[#1a4f4a]/10",
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
      return !!form.title_ar.trim() && !!parentCategoryId && !!form.governorate_id;
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
        if (variationsWithoutPrice.length > 0) return false;
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

  const variationsWithPrices = useMemo(() => {
    if (!product || !product.variations || product.variations.length === 0) {
      return [];
    }
    return product.variations.map((v: any) => {
      const price = v.price !== undefined && v.price !== null && v.price > 0 ? v.price : form.price || 0;
      return {
        ...v,
        price: price,
        is_available: v.is_available !== undefined ? v.is_available : true,
      };
    });
  }, [product?.variations, form.price]);

  // ============================================================
  // 🔑 [FIX] useEffect تحميل البيانات — مع retry + isEditing مثبّت
  // ============================================================
  useEffect(() => {
    (async () => {
      if (isLoadingRef.current) return;
      if (isPriceEditingRef.current) return;
      
      if (!open) {
        isLoadingRef.current = false;
        isPriceEditingRef.current = false;
        lastLoadedProductIdRef.current = null;
        wasSavedRef.current = false;
        return;
      }
      
      if (effectiveProduct?.id && lastLoadedProductIdRef.current === effectiveProduct.id && !wasSavedRef.current) {
        return;
      }
      
      if (wasSavedRef.current) {
        console.log('🛡️ [ZOOQ][Form] Skipping reload after save — using current state');
        return;
      }
      
      isLoadingRef.current = true;
      lastLoadedProductIdRef.current = effectiveProduct?.id || null;
      
      if (effectiveProduct) {
        const availableValue = effectiveProduct.is_available !== undefined ? effectiveProduct.is_available : true;
        
        setForm({
          title_ar: effectiveProduct.title_ar || "",
          description_ar: effectiveProduct.description_ar || "",
          price: effectiveProduct.price || 0,
          old_price: effectiveProduct.old_price || 0,
          is_offer: effectiveProduct.is_offer || false,
          is_available: availableValue,
          payment_method: effectiveProduct.payment_method || "cash",
          kind: effectiveProduct.kind || "product",
          category_id: effectiveProduct.category_id || "",
          parent_category_id: effectiveProduct.parent_category_id || "",
          governorate_id: effectiveProduct.governorate_id || "",
          cover_url: effectiveProduct.cover_url || "",
          image_urls: effectiveProduct.image_urls || [""],
        });
        
        // 🔑 [FIX-PERF-2026] امسح فقط عند تحميل منتج مختلف
        if (lastLoadedProductIdRef.current !== effectiveProduct.id) {
          manuallyEditedIdsRef.current.clear();
        }
        
        // ✅ تحميل التصنيف الرئيسي والفرعي
        if (cats.length > 0) {
          if (effectiveProduct.parent_category_id) {
            setParentCategoryId(effectiveProduct.parent_category_id);
            setParentCategorySearch(getCategoryName(effectiveProduct.parent_category_id));
            
            if (effectiveProduct.category_id && effectiveProduct.category_id !== effectiveProduct.parent_category_id) {
              setSubCategoryId(effectiveProduct.category_id);
              setSubCategorySearch(getCategoryName(effectiveProduct.category_id));
            } else {
              setSubCategoryId("");
              setSubCategorySearch("");
            }
          } else if (effectiveProduct.category_id) {
            const cat = cats.find((c: any) => c.id === effectiveProduct.category_id);
            if (cat) {
              if (cat.parent_id) {
                setParentCategoryId(cat.parent_id);
                setParentCategorySearch(getCategoryName(cat.parent_id));
                setSubCategoryId(effectiveProduct.category_id);
                setSubCategorySearch(getCategoryName(effectiveProduct.category_id));
              } else {
                setParentCategoryId(effectiveProduct.category_id);
                setParentCategorySearch(getCategoryName(effectiveProduct.category_id));
                setSubCategoryId("");
                setSubCategorySearch("");
              }
            }
          }
        }
        
        if (effectiveProduct.governorate_id && govs.length > 0) {
          setGovernorateSearch(getGovernorateName(effectiveProduct.governorate_id));
        }
        
        const productMetadata = effectiveProduct.metadata || {};
        const productOptions = productMetadata.options || effectiveProduct.options || [];
        
        // ============================================================
        // 🔍 [DEBUG-COLORS-1] اطبع مصدر الألوان
        // ============================================================
        console.log('🔍 [DEBUG-COLORS-1] Source check:', {
          'product.colors (prop)': product?.colors,
          'effectiveProduct.colors': effectiveProduct.colors,
          'productMetadata.colors': productMetadata.colors,
          'product.id': effectiveProduct.id,
          'is using freshProduct': !!freshProduct,
        });
        
        // ============================================================
        // 🔑 [FIX-RACE-2026] جلب variations و options معاً (Promise.all)
        // السبب: جلبهم بالتتابع يُحدث race condition — variations تصل
        // أولاً بينما options لسّا، فيعمل Auto-Generate على options فارغة
        // ويمسح التركيبة الأصلية ثم يولّدها من جديد (رسالة "تركيبة جديدة").
        // ============================================================
        console.log(`🟦 [ZOOQ][Form] Fetching variations + options from DB (parallel, with retry)...`);

        const [varsResult, optsResult] = await Promise.all([
          fetchWithRetry(
            () => supabase
              .from("product_variations")
              .select("*")
              .eq("listing_id", effectiveProduct.id)
              .order("created_at", { ascending: true }),
            {
              attempts: 3,
              delayMs: 300,
              validate: (data) => {
                if (!Array.isArray(data)) return false;
                const expectedCount = effectiveProduct.variations?.length || 0;
                if (expectedCount > 0 && data.length === 0) return false;
                return true;
              }
            }
          ),
          fetchWithRetry(
            () => supabase
              .from("product_options")
              .select("option_type, option_value, sort_order")
              .eq("listing_id", effectiveProduct.id)
              .order("sort_order", { ascending: true }),
            {
              attempts: 3,
              delayMs: 300,
              validate: (data) => {
                if (!Array.isArray(data)) return false;
                const expectedCount = effectiveProduct.variations?.length || 0;
                if (expectedCount > 0 && data.length === 0) return false;
                return true;
              }
            }
          ),
        ]);

        let productVariations: any[] = [];
        if (varsResult.error) {
          console.error(`🟦 [ZOOQ][Form] Failed to fetch variations after retries:`, varsResult.error);
          productVariations = productMetadata.variations || effectiveProduct.variations || [];
        } else {
          productVariations = varsResult.data || [];
          console.log(`🟦 [ZOOQ][Form] Fetched ${productVariations.length} variations from DB (after retry)`);
          console.log(`🟢 [DEBUG-1] Prices from DB at load:`, productVariations.map((v: any) => v.price));
        }

        let optionsFromDB: any[] = [];
        if (optsResult.error) {
          console.error(`🟦 [ZOOQ][Form] Failed to fetch options after retries:`, optsResult.error);
          optionsFromDB = productOptions;
        } else {
          optionsFromDB = optsResult.data || [];
          console.log(`🟦 [ZOOQ][Form] Fetched ${optionsFromDB.length} options from DB (after retry)`);
        }
        
        // ============================================================
        // 🔑 [FIX-2026-COLORS] جلب product_colors من DB مباشرة
        // (مصدر الصور الحقيقي — لأن useSellerListing قد لا يُرجعها)
        // ============================================================
        console.log(`🟦 [ZOOQ][Form] Fetching colors from DB (with retry)...`);
        let colorsFromDB: any[] = [];
        const colorsResult = await fetchWithRetry(
          () => supabase
            .from("product_colors")
            .select("*")
            .eq("listing_id", effectiveProduct.id)
            .order("sort_order", { ascending: true }),
          {
            attempts: 3,
            delayMs: 300,
            validate: (data) => {
              if (!Array.isArray(data)) return false;
              return true;
            }
          }
        );

        if (colorsResult.error) {
          console.error(`🟦 [ZOOQ][Form] Failed to fetch colors after retries:`, colorsResult.error);
          colorsFromDB = [];
        } else {
          colorsFromDB = colorsResult.data || [];
          console.log(`🟦 [ZOOQ][Form] Fetched ${colorsFromDB.length} colors from DB (after retry)`);
        }
        
        const typeMap: Record<string, string> = {
          'color': 'colors',
          'size': 'sizes',
          'model': 'models',
          'material': 'materials',
          'style': 'style',
          'brand': 'brand',
        };
        
        const optionsGrouped: Record<string, string[]> = {};
        
        optionsFromDB.forEach((opt: any) => {
          const originalType = opt.option_type || opt.key;
          const mappedType = typeMap[originalType] || originalType;
          if (mappedType) {
            if (!optionsGrouped[mappedType]) optionsGrouped[mappedType] = [];
            optionsGrouped[mappedType].push(opt.option_value || opt.value);
          }
        });
        
        if (Object.keys(optionsGrouped).length === 0 && productVariations && productVariations.length > 0) {
          console.log(`🔧 [ZOOQ][Form] product_options empty — recovering from variations`);
          const recovered: Record<string, string[]> = {};
          productVariations.forEach((v: any) => {
            Object.entries(v.combination || {}).forEach(([key, value]) => {
              if (value && String(value).trim()) {
                if (!recovered[key]) recovered[key] = [];
                const sv = String(value).trim();
                if (!recovered[key].includes(sv)) recovered[key].push(sv);
              }
            });
          });
          console.log(`🔧 [ZOOQ][Form] Recovered options from variations:`, recovered);
          setOptions(recovered);
        } else {
          console.log(`🟦 [ZOOQ][Form] Grouped options:`, optionsGrouped);
          setOptions(optionsGrouped);
        }
        
        // ============================================================
        // 🔍 [DEBUG-COLORS-2] اطبع قبل تعيين tempColors
        // ============================================================
        console.log('🔍 [DEBUG-COLORS-2] Before setting tempColors:', {
          colorsFromDBLength: colorsFromDB.length,
          colorsFromDBData: colorsFromDB,
          'optionsGrouped.colors': optionsGrouped.colors,
        });
        
        // 🔑 [FIX-2026-COLORS] استخدم colorsFromDB (من DB مباشرة)
        if (colorsFromDB.length > 0) {
          const mappedColors = colorsFromDB.map((c: any) => ({
            id: c.id,
            color_name_ar: c.color_name_ar || c.color_name_en || 'لون',
            color_name_en: c.color_name_en || c.color_name_ar || 'Color',
            color_hex: c.color_hex || null,
            image_url: c.image_url || '',
            sort_order: c.sort_order || 0,
          }));
          setTempColors(mappedColors);
          setColorWithImages(mappedColors.map((c: any) => ({
            name: c.color_name_ar,
            image: c.image_url,
            hex: c.color_hex,
          })));
          console.log('✅ [DEBUG-COLORS-2] tempColors set with', mappedColors.length, 'colors from DB');
        } else if (optionsGrouped.colors && optionsGrouped.colors.length > 0) {
          // 🔑 Fallback: أسماء الألوان فقط (بدون صور)
          const fallbackColors = optionsGrouped.colors.map((name: string, index: number) => ({
            id: `fallback-${index}`,
            color_name_ar: name,
            color_name_en: name,
            color_hex: DEFAULT_COLORS[name] || null,
            image_url: '',
            sort_order: index,
          }));
          setTempColors(fallbackColors);
          setColorWithImages(fallbackColors.map((c: any) => ({
            name: c.color_name_ar,
            image: '',
            hex: c.color_hex,
          })));
          console.log('⚠️ [DEBUG-COLORS-2] tempColors set with', fallbackColors.length, 'colors (FALLBACK — no images)');
        } else {
          setTempColors([]);
          setColorWithImages([]);
          console.log('⚠️ [DEBUG-COLORS-2] tempColors EMPTY — no colors anywhere');
        }
        
        if (optionsGrouped.sizes && optionsGrouped.sizes.length > 0) {
          setSizes(optionsGrouped.sizes);
        } else {
          setSizes([]);
        }
        
        if (productVariations && productVariations.length > 0) {
          const mappedVariations = productVariations.map((v: any) => ({
            id: v.id,
            combination: v.combination || {},
            is_available: v.is_available !== undefined ? v.is_available : v.is_active !== false,
            price: v.price || 0,
            old_price: v.old_price || null,
            sku: v.sku || '',
            stock_quantity: v.stock_quantity || 0,
            color_id: v.color_id || null,
            image_url: v.image_url || null,
          }));
          console.log(`🟦 [ZOOQ][Form] Setting ${mappedVariations.length} variations into state`);
          setVariations(mappedVariations);
        } else {
          console.log(`🟦 [ZOOQ][Form] No variations found (DB empty for this listing)`);
          setVariations([]);
        }
        
      } else {
        setForm({
          ...emptyForm,
          is_offer: productType === "offer",
        });
        setOptions({});
        setVariations([]);
        setTempColors([]);
        setSizes([]);
        setColorWithImages([]);
        setParentCategoryId("");
        setSubCategoryId("");
        setParentCategorySearch("");
        setSubCategorySearch("");
        setGovernorateSearch("");
        manuallyEditedIdsRef.current.clear();
      }
      
      setTimeout(() => {
        isLoadingRef.current = false;
      }, 500);
    })();
  }, [effectiveProduct, product, productType, open, cats, govs, getCategoryName, freshProduct]);

  // 🔑 [FIX-PERF-2026] تنظيف timeout عند unmount
  useEffect(() => {
    return () => {
      if (priceUpdateTimeoutRef.current) {
        clearTimeout(priceUpdateTimeoutRef.current);
      }
    };
  }, []);

  // ============================================================
  // 🔍 [DEBUG-COLORS-3] externalColorImages — اطبع كل تغيير
  // ============================================================
  const externalColorImages = useMemo(() => {
    const result = Object.fromEntries(
      tempColors.map((c: any) => [c.color_name_ar, c.image_url])
    );
    console.log('🔍 [DEBUG-COLORS-3] externalColorImages computed:', {
      tempColorsCount: tempColors.length,
      tempColorsData: tempColors,
      resultCount: Object.keys(result).length,
      resultData: result,
    });
    return result;
  }, [tempColors]);

  // 🔑 [FIX-PERF-2026] handlePriceChange مع debounce
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
    
    isPriceEditingRef.current = true;
    setForm({ ...form, [field]: num });
    
    // 🔑 [FIX-PERF-2026] debounce: حدّث variations بعد 300ms من توقف الكتابة
    if (field === 'price' && num > 0 && variations.length > 0) {
      pendingPriceRef.current = num;
      
      if (priceUpdateTimeoutRef.current) {
        clearTimeout(priceUpdateTimeoutRef.current);
      }
      
      priceUpdateTimeoutRef.current = setTimeout(() => {
        const priceToApply = pendingPriceRef.current;
        if (priceToApply > 0) {
          const updated = variations.map(v => {
            if (manuallyEditedIdsRef.current.has(v.id)) return v;
            return { ...v, price: priceToApply };
          });
          const changed = updated.some((v, i) => v.price !== variations[i]?.price);
          if (changed) {
            console.log('🟦 [PERF-2026] Debounced variations update:', priceToApply);
            setVariations(updated);
          }
        }
      }, 300);
    }
    
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
    
    if (!parentCategoryId) return false;
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
    if (!form.title_ar.trim()) {
      toast.error(
        app.lang === "ar" 
          ? `الرجاء إدخال ${productType === "offer" ? "اسم العرض" : "اسم المنتج"}` 
          : `Please enter ${productType === "offer" ? "offer name" : "product name"}`
      );
      setActiveTab("basic");
      return;
    }
    
    if (!form.price || form.price <= 0) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال السعر" : "⚠️ Please enter price");
      setActiveTab("pricing");
      return;
    }
    if (form.price < 0) {
      toast.error(app.lang === "ar" ? "⚠️ السعر لا يمكن أن يكون سالباً" : "⚠️ Price cannot be negative");
      setActiveTab("pricing");
      return;
    }
    
    if (productType === "offer") {
      if (!form.old_price || form.old_price <= form.price) {
        toast.error(app.lang === "ar" ? "⚠️ السعر القديم يجب أن يكون أكبر من السعر الحالي" : "⚠️ Old price must be greater than current price");
        setActiveTab("pricing");
        return;
      }
      if (form.old_price < 0) {
        toast.error(app.lang === "ar" ? "⚠️ السعر القديم لا يمكن أن يكون سالباً" : "⚠️ Old price cannot be negative");
        setActiveTab("pricing");
        return;
      }
    }
    
    if (!parentCategoryId) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء اختيار التصنيف الرئيسي" : "⚠️ Please select main category");
      setActiveTab("basic");
      return;
    }
    
    if (!form.governorate_id) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء اختيار المحافظة" : "⚠️ Please select governorate");
      setActiveTab("basic");
      return;
    }
    
    if (!form.cover_url?.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء رفع الصورة الرئيسية" : "⚠️ Please upload main image");
      setActiveTab("images");
      return;
    }
    
    if (tempColors.length > 0) {
      const colorsWithoutImage = tempColors.filter((c: any) => {
        if (c.id?.startsWith('temp-') && !c.image_url?.trim()) return true;
        if (c.id && !c.id.startsWith('temp-')) return false;
        return !c.image_url?.trim();
      });
      
      if (colorsWithoutImage.length > 0) {
        const colorNames = colorsWithoutImage.map((c: any) => c.color_name_ar).join(', ');
        toast.error(
          app.lang === "ar" 
            ? `⚠️ الألوان التالية بدون صورة: ${colorNames}` 
            : `⚠️ The following colors have no image: ${colorNames}`
        );
        setActiveTab("options");
        return;
      }
    }
    
    const activeOptionsCount = Object.values(options).filter(arr => arr.length > 0).length;
    
    if (activeOptionsCount >= 2) {
      if (variations.length === 0) {
        setActiveTab("options");
        toast.error(
          app.lang === "ar" 
            ? "⚠️ لديك خيارين أو أكثر ولكن لم تقم بتوليد التركيبات!" 
            : "⚠️ You have 2 or more options but haven't generated variations!"
        );
        return;
      }
    }
    
    if (variations.length > 0) {
      const variationsWithoutPrice = variations.filter(v => {
        return v.price === undefined || v.price === null || v.price <= 0;
      });
      
      if (variationsWithoutPrice.length > 0) {
        const variationNames = variationsWithoutPrice.map(v => {
          return Object.values(v.combination || {}).join(' • ');
        }).join(', ');
        toast.error(
          app.lang === "ar" 
            ? `⚠️ هناك ${variationsWithoutPrice.length} تركيبة بدون سعر:\n${variationNames}` 
            : `⚠️ ${variationsWithoutPrice.length} variations have no price:\n${variationNames}`
        );
        setActiveTab("options");
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      const finalSizes = options.sizes || [];
      const finalCategoryId = subCategoryId || parentCategoryId;
      
      console.log('🟢 [DEBUG-STATE] Variations from state before save:', {
        count: variations.length,
        prices: variations.map((v: any) => v.price),
        ids: variations.map((v: any) => v.id),
      });
      
      // 🔑 [FIX-PERF-2026] استخدم السعر الفعلي من state مباشرة
      const baseVariations = variations.map((v: any) => ({
        id: v.id,
        combination: v.combination || {},
        is_available: v.is_available !== false,
        stock_quantity: v.stock_quantity || 0,
        color_id: v.color_id || null,
        image_url: v.image_url || null,
        sku: v.sku || '',
        price: (v.price !== undefined && v.price !== null && v.price > 0) 
          ? v.price 
          : form.price,
        old_price: (v.old_price !== undefined && v.old_price !== null && v.old_price > 0) 
          ? v.old_price 
          : (form.old_price || null),
      }));
      
      const activeOptionsCountForSave = Object.values(options).filter(
        (arr: any) => arr && arr.length > 0
      ).length;
      const allowVariationsClear = activeOptionsCountForSave === 0;
      
      const allData = { 
        ...form, 
        parent_category_id: parentCategoryId,
        category_id: finalCategoryId,
        options: {
          ...options,
          colors: tempColors.map((c: any) => c.color_name_ar),
          sizes: finalSizes,
        },
        variations: baseVariations,
        colors: tempColors,
        image_urls: form.image_urls,
        allowVariationsClear,
      };
      
      console.log('🟢 [DEBUG-2] Prices to save:', {
        form_price: form.price,
        variations_prices: allData.variations.map((v: any) => v.price),
        manually_edited_ids: Array.from(manuallyEditedIdsRef.current),
        source: 'state',
        colorsCount: allData.colors.length,
      });
      
      console.log('🟢 [ZOOQ][Form] allowVariationsClear:', allowVariationsClear);
      
      wasSavedRef.current = true;
      isSavingRef.current = true;
      await onSave(allData);
      saveCompletedAtRef.current = Date.now();
      
    } catch (error) {
      console.error("❌ Error saving:", error);
    } finally {
      isSavingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleColorsWithImagesChange = (colors: ColorWithImage[]) => {
    console.log('🔍 [DEBUG-COLORS-4] handleColorsWithImagesChange received:', colors);
    setColorWithImages(colors);
    
    const newTempColors = colors.map((c, index) => ({
      id: `temp-${Date.now()}-${index}`,
      color_name_ar: c.name,
      color_name_en: c.name,
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
    setSizes(newSizes);
    setOptions(prev => ({
      ...prev,
      sizes: newSizes,
    }));
  };

  const handleParentCategorySelect = (cat: any) => {
    setParentCategoryId(cat.id);
    setParentCategorySearch(lang === "ar" ? cat.name_ar : cat.name_en);
    setIsParentCategoryOpen(false);
    setSubCategoryId("");
    setSubCategorySearch("");
    setOptions({});
    setTempColors([]);
    setSizes([]);
    setColorWithImages([]);
    setVariations([]);
    manuallyEditedIdsRef.current.clear();
    setForm(prev => ({ 
      ...prev, 
      parent_category_id: cat.id,
      category_id: cat.id,
    }));
  };

  const handleSubCategorySelect = (cat: any) => {
    setSubCategoryId(cat.id);
    setSubCategorySearch(lang === "ar" ? cat.name_ar : cat.name_en);
    setIsSubCategoryOpen(false);
    setForm(prev => ({ 
      ...prev, 
      category_id: cat.id,
    }));
  };

  const clearParentCategory = () => {
    setParentCategoryId("");
    setParentCategorySearch("");
    setSubCategoryId("");
    setSubCategorySearch("");
    setOptions({});
    setTempColors([]);
    setSizes([]);
    setColorWithImages([]);
    setVariations([]);
    manuallyEditedIdsRef.current.clear();
    setForm(prev => ({ 
      ...prev, 
      parent_category_id: "",
      category_id: "",
    }));
  };

  const clearSubCategory = () => {
    setSubCategoryId("");
    setSubCategorySearch("");
    setForm(prev => ({ 
      ...prev, 
      category_id: parentCategoryId,
    }));
  };

  const getProductIcon = () => {
    if (productType === "offer") return <Gift className="h-5 w-5 text-[#1a4f4a]" />;
    return <Package className="h-5 w-5 text-[#2a655f]" />;
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
  };  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[94vw] max-h-[94vh] overflow-y-auto rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-[#2a655f]/20">
        
        {/* ===== Header ===== */}
        <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 p-4 md:p-5">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#2a655f] to-transparent animate-pulse" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="relative group">
                <div className="absolute inset-0 rounded-xl bg-[#2a655f]/20 blur-lg group-hover:blur-xl transition-all duration-500" />
                <div className="relative p-2 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25 group-hover:shadow-[#2a655f]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {getProductIcon()}
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {getProductTitle()}
                  {productType === "offer" && (
                    <Badge className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white border-0 animate-pulse text-[10px]">
                      🔥 عرض
                    </Badge>
                  )}
                </h2>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3 w-3 text-[#2a655f] animate-pulse" />
                  {getProductSubtitle()}
                  <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
                  <span className="text-[10px] text-[#2a655f] font-medium">
                    {product ? (lang === "ar" ? "تعديل" : "Edit") : (lang === "ar" ? "جديد" : "New")}
                  </span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 hover:rotate-90 hover:scale-110"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 text-[#2a655f]" />
            </Button>
          </div>
          
          {/* شريط التقدم */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="font-medium text-[#2a655f]">
                  {getTabLabel(activeTab)}
                </span>
                <span className="text-[9px] text-[#2a655f]/60">
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
                        "h-1 rounded-full transition-all duration-500 cursor-pointer",
                        isActive ? "w-6 bg-[#2a655f] shadow-md shadow-[#2a655f]/30" : 
                        isCompleted ? "w-3 bg-[#2a655f]/60" : "w-3 bg-slate-200 dark:bg-slate-700"
                      )}
                      onClick={() => goToTab(tab)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList 
                className="grid grid-cols-4 gap-1.5 bg-[#e8f0ee]/50 dark:bg-[#2a655f]/20 p-1.5 rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 w-full h-auto"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {TAB_ORDER.map((tab) => {
                  const Icon = getTabIcon(tab);
                  const isActive = activeTab === tab;
                  return (
                    <TabsTrigger 
                      key={tab}
                      value={tab} 
                      className="w-full rounded-lg text-xs font-medium py-2 px-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md data-[state=active]:shadow-[#2a655f]/20 data-[state=active]:border-2 data-[state=active]:border-[#2a655f]/40 transition-all duration-300 group flex flex-row items-center justify-center gap-1.5"
                    >
                      <Icon className={cn(
                        "h-3.5 w-3.5 transition-all duration-300 flex-shrink-0",
                        isActive ? "text-[#2a655f] animate-pulse" : "text-muted-foreground group-hover:text-[#2a655f]"
                      )} />
                      <span className="font-medium">{getTabLabel(tab)}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* ===== Body ===== */}
        <div className="p-4 md:p-5 space-y-4">
          
          {/* ===== TAB: Basic ===== */}
          {activeTab === "basic" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="relative overflow-hidden rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 p-3">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#2a655f]/5 blur-3xl" />
                <div className="flex items-start gap-2 relative">
                  <div className="p-2 rounded-lg bg-[#2a655f]/10">
                    <Info className="h-4 w-4 text-[#2a655f]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]">
                      {lang === "ar" ? `📝 ${productType === "offer" ? "معلومات العرض" : "المعلومات الأساسية"}` : `📝 ${productType === "offer" ? "Offer Information" : "Basic Information"}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {lang === "ar" 
                        ? `أدخل ${productType === "offer" ? "اسم العرض" : "اسم المنتج"} ووصفه واختر التصنيف والمحافظة المناسبة` 
                        : `Enter ${productType === "offer" ? "offer" : "product"} name, description and select appropriate category and governorate`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative group">
                  <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    {labels.name}
                    <span className="text-red-500">*</span>
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
                      className="ps-10 h-11 text-base sm:text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
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
                      rows={3}
                      value={form.description_ar}
                      onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                      placeholder={labels.placeholderDesc}
                      className="text-base sm:text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 resize-none hover:border-[#2a655f]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span>📁</span>
                      {lang === "ar" ? "التصنيف الرئيسي" : "Main Category"}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="relative">
                        <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" />
                        <Input
                          value={parentCategorySearch}
                          onChange={(e) => setParentCategorySearch(e.target.value)}
                          onFocus={() => setIsParentCategoryOpen(true)}
                          placeholder={lang === "ar" ? "🔍 ابحث..." : "🔍 Search..."}
                          className="ps-10 h-11 text-base sm:text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                        />
                        {parentCategorySearch && (
                          <button
                            onClick={clearParentCategory}
                            className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                      {isParentCategoryOpen && (
                        <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-lg shadow-[#2a655f]/20">
                          {filteredMainCategories.length === 0 ? (
                            <div className="p-3 text-sm text-muted-foreground text-center">
                              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                            </div>
                          ) : (
                            filteredMainCategories.map((c: any) => {
                              const childCount = cats.filter((cat: any) => cat.parent_id === c.id && cat.active !== false).length;
                              return (
                                <button
                                  key={c.id}
                                  className={cn(
                                    "w-full text-start px-3 py-2.5 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-2 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                                    parentCategoryId === c.id && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30 text-[#2a655f]"
                                  )}
                                  onClick={() => handleParentCategorySelect(c)}
                                >
                                  {parentCategoryId === c.id && (
                                    <CheckCircle2 className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                                  )}
                                  <span className="flex-1">{lang === "ar" ? c.name_ar : c.name_en}</span>
                                  {childCount > 0 && (
                                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px]">
                                      {childCount} {lang === "ar" ? "فرعي" : "sub"}
                                    </Badge>
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span>📂</span>
                      {lang === "ar" ? "التصنيف الفرعي" : "Subcategory"}
                      <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400">
                        {lang === "ar" ? "اختياري" : "Optional"}
                      </Badge>
                    </Label>
                    
                    {!parentCategoryId ? (
                      <div className="mt-1.5 flex items-center gap-2 h-11 px-3 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                        <Info className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          {lang === "ar" ? "اختر الرئيسي أولاً" : "Select main first"}
                        </span>
                      </div>
                    ) : !hasSubCategories ? (
                      <div className="mt-1.5 flex items-center gap-2 h-11 px-3 rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                          {lang === "ar" 
                            ? "✅ سيتم استخدام الرئيسي" 
                            : "✅ Main will be used"}
                        </span>
                      </div>
                    ) : (
                      <div className="relative mt-1.5">
                        <div className="relative">
                          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" />
                          <Input
                            value={subCategorySearch}
                            onChange={(e) => setSubCategorySearch(e.target.value)}
                            onFocus={() => setIsSubCategoryOpen(true)}
                            placeholder={lang === "ar" ? "🔍 ابحث عن الفرعي..." : "🔍 Search sub..."}
                            className="ps-10 h-11 text-base sm:text-sm rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/50"
                          />
                          {subCategorySearch && (
                            <button
                              onClick={clearSubCategory}
                              className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        {isSubCategoryOpen && (
                          <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-lg shadow-[#2a655f]/20">
                            {filteredSubCategories.length === 0 ? (
                              <div className="p-3 text-sm text-muted-foreground text-center">
                                {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                              </div>
                            ) : (
                              filteredSubCategories.map((c: any) => (
                                <button
                                  key={c.id}
                                  className={cn(
                                    "w-full text-start px-3 py-2.5 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-2 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                                    subCategoryId === c.id && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30 text-[#2a655f]"
                                  )}
                                  onClick={() => handleSubCategorySelect(c)}
                                >
                                  {subCategoryId === c.id && (
                                    <CheckCircle2 className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                                  )}
                                  <span>{lang === "ar" ? c.name_ar : c.name_en}</span>
                                </button>
                              ))
                            )}
                          </div>
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
                        className="ps-10 h-11 text-base sm:text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
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
                      <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-lg shadow-[#2a655f]/20">
                        {filteredGovernorates.length === 0 ? (
                          <div className="p-3 text-sm text-muted-foreground text-center">
                            {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                          </div>
                        ) : (
                          filteredGovernorates.map((g: any) => (
                            <button
                              key={g.id}
                              className={cn(
                                "w-full text-start px-3 py-2.5 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-2 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
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

                <div>
                  <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    {lang === "ar" ? "حالة التوفر" : "Availability"}
                  </Label>
                  <div className="mt-1.5 p-3 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10 dark:to-transparent rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40">
                    <label className="flex items-center gap-3 text-sm cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.is_available === true}
                        onChange={(e) => {
                          const newValue = e.target.checked;
                          setForm(prev => ({ ...prev, is_available: newValue }));
                        }}
                        className="h-5 w-5 rounded border-slate-300/50 accent-[#2a655f] cursor-pointer transition-all duration-300 group-hover:scale-110"
                      />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn(
                          "font-semibold transition-all duration-300 text-sm",
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
                        <span className="text-xs text-muted-foreground group-hover:text-[#2a655f] transition-colors">
                          {form.is_available === true
                            ? (lang === "ar" ? "🟢 يمكن الشراء" : "🟢 Can purchase")
                            : (lang === "ar" ? "🔴 غير متاح" : "🔴 Not available")}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB: Pricing ===== */}
          {activeTab === "pricing" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="relative overflow-hidden rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 p-3">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-[#2a655f]/5 blur-3xl" />
                <div className="flex items-start gap-2 relative">
                  <div className="p-2 rounded-lg bg-[#2a655f]/10">
                    <Coins className="h-4 w-4 text-[#2a655f]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]">
                      {lang === "ar" ? `💰 ${productType === "offer" ? "تسعير العرض" : "تسعير المنتج"}` : `💰 ${productType === "offer" ? "Offer Pricing" : "Product Pricing"}`}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {lang === "ar" 
                        ? `حدد ${productType === "offer" ? "سعر العرض والسعر القديم" : "السعر المناسب للمنتج"}` 
                        : `Set ${productType === "offer" ? "offer price and old price" : "appropriate product price"}`}
                    </p>
                  </div>
                </div>
              </div>

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
                      value={form.price === 0 ? "" : form.price}
                      onChange={(e) => handlePriceChange(e.target.value, "price")}
                      onFocus={(e) => e.target.select()}
                      placeholder="0"
                      className="ps-12 h-11 text-base sm:text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                    />
                  </div>
                </div>
              </div>

              {productType === "offer" && (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/30 dark:to-[#3a8a82]/10 rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40">
                    <div className="p-2 rounded-lg bg-[#2a655f]/10 animate-pulse">
                      <Gift className="h-4 w-4 text-[#2a655f]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]">
                        {lang === "ar" ? "🛍️ هذا المنتج هو عرض خاص" : "🛍️ This product is a special offer"}
                      </p>
                      <p className="text-xs text-[#2a655f]/70 dark:text-[#3a8a82]/70">
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
                          value={form.old_price === 0 ? "" : form.old_price}
                          onChange={(e) => handlePriceChange(e.target.value, "old_price")}
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                          className="ps-12 h-11 text-base sm:text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                        />
                      </div>
                    </div>
                  </div>

                  {form.old_price > form.price && form.old_price > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-950/10 rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-5 duration-300">
                      <Badge className="bg-gradient-to-r from-[#1a4f4a] to-[#2a655f] text-white border-0 text-sm px-3 py-1.5 rounded-lg shadow-md shadow-[#2a655f]/30 animate-pulse">
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
              <div className="relative overflow-hidden rounded-xl border-2 border-purple-500/30 dark:border-purple-500/40 bg-gradient-to-r from-purple-500/5 to-purple-500/10 dark:from-purple-500/20 dark:to-purple-500/10 p-3">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500/5 blur-3xl" />
                <div className="flex items-start gap-2 relative">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Camera className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                      {lang === "ar" ? "📸 صور المنتج" : "📸 Product Images"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
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
                    previewClassName="aspect-video h-auto rounded-lg max-h-[240px] border-2 border-[#2a655f]/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-lg bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-800/10 p-4 border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-[#2a655f]/10">
                      <ImageIcon className="h-4 w-4 text-[#2a655f]" />
                    </div>
                    <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {lang === "ar" ? "صور إضافية" : "Additional Images"}
                    </Label>
                    <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                      {form.image_urls.length}/6
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setForm({ ...form, image_urls: [...form.image_urls, ""] })}
                    disabled={form.image_urls.length >= 6}
                    className="rounded-lg border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105 h-8 px-3 text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 me-1" /> {lang === "ar" ? "إضافة" : "Add"}
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                      previewClassName="aspect-video h-auto rounded-lg border-2 border-slate-200/50"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB: Options ===== */}
          {activeTab === "options" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="relative overflow-hidden rounded-xl border-2 border-indigo-500/30 dark:border-indigo-500/40 bg-gradient-to-r from-indigo-500/5 to-indigo-500/10 dark:from-indigo-500/20 dark:to-indigo-500/10 p-3">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-3xl" />
                <div className="flex items-start gap-2 relative">
                  <div className="p-2 rounded-lg bg-indigo-500/10">
                    <Layers className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {lang === "ar" ? "⚙️ خيارات وتركيبات المنتج" : "⚙️ Product Options & Variations"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {lang === "ar" 
                        ? "أضف الألوان مع الصور والمقاسات والتركيبات المتوفرة" 
                        : "Add colors with images, sizes and available variations"}
                    </p>
                  </div>
                </div>
              </div>

              {!parentCategoryId ? (
                <div className="p-6 text-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2">
                    <Folder className="h-6 w-6 text-[#2a655f]/50" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {lang === "ar" ? "الرجاء اختيار التصنيف الرئيسي أولاً" : "Please select a main category first"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === "ar" 
                      ? "الخيارات المتاحة تختلف حسب التصنيف المختار" 
                      : "Available options differ based on the selected category"}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("basic")}
                    className="mt-3 rounded-lg border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 text-xs h-9"
                  >
                    {lang === "ar" ? "الذهاب للأساسيات" : "Go to Basic"}
                  </Button>
                </div>
              ) : isLoadingCategoryOptions ? (
                <div className="p-6 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#2a655f]" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {lang === "ar" ? "جاري تحميل الخيارات..." : "Loading options..."}
                  </p>
                </div>
              ) : availableOptions.length === 0 ? (
                <div className="p-6 text-center rounded-xl border-2 border-dashed border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20">
                  <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                    <AlertCircle className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {lang === "ar" ? "لا توجد خيارات لهذا التصنيف" : "No options for this category"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {lang === "ar" 
                      ? "يمكنك المتابعة بدون خيارات" 
                      : "You can continue without options"}
                  </p>
                </div>
              ) : (
                <>
                  <ProductOptionsManager
                    value={options}
                    onChange={setOptions}
                    lang={app.lang}
                    variations={variations}
                    onVariationsChange={(newVars) => {
                      const timeSinceSave = Date.now() - saveCompletedAtRef.current;
                      const justSaved = saveCompletedAtRef.current > 0 && timeSinceSave < 3000;

                      if ((isSavingRef.current || justSaved) && newVars.length === 0) {
                        console.log('🛡️ [ZOOQ][Form] Blocked clearing variations during/after save', {
                          isSaving: isSavingRef.current,
                          timeSinceSave,
                        });
                        return;
                      }
                      setVariations(newVars);
                    }}
                    userId={app.user?.id || ''}
                    onColorsWithImagesChange={handleColorsWithImagesChange}
                    externalColorImages={externalColorImages}
                    sizes={sizes}
                    onSizesChange={handleSizesUpdate}
                    isOffer={productType === "offer"}
                    availableOptions={availableOptions}
                    basePrice={form.price}
                    baseOldPrice={form.old_price}
                    isEditing={isEditingRef.current}
                    productId={stableProductIdRef.current}
                    onVariationManualEdit={(id) => {
                      manuallyEditedIdsRef.current.add(id);
                    }}
                  />
                </>
              )}
            </div>
          )}
        </div>

        {/* ===== Footer ===== */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 p-4 md:p-5 rounded-b-2xl">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={goToPrevTab}
              disabled={isFirstTab}
              className="rounded-lg border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 h-10 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRTL ? (
                <ArrowRight className="h-4 w-4 ml-1.5" />
              ) : (
                <ArrowLeft className="h-4 w-4 mr-1.5" />
              )}
              {lang === "ar" ? "السابق" : "Previous"}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 h-10 px-4 text-sm"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>

              {isLastTab ? (
                <Button
                  onClick={validateAndSubmit}
                  disabled={!isFormValid() || isSaving || isSubmitting}
                  className="rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25 transition-all duration-300 h-10 px-5 hover:shadow-[#2a655f]/40 hover:scale-[1.02] hover:from-[#1a4f4a] hover:to-[#2a655f] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSaving || isSubmitting ? (
                    <span className="flex items-center gap-1.5">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      {lang === "ar" ? "جاري النشر..." : "Publishing..."}
                    </span>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1.5" />
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
                  className="rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25 transition-all duration-300 h-10 px-5 hover:shadow-[#2a655f]/40 hover:scale-[1.02] hover:from-[#1a4f4a] hover:to-[#2a655f] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {lang === "ar" ? "التالي" : "Next"}
                  {isRTL ? (
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                  ) : (
                    <ArrowRight className="h-4 w-4 ml-1.5" />
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