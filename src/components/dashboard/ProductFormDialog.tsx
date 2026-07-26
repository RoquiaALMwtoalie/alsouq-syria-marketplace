import { useState, useEffect, useMemo } from "react";
import { 
  X, Plus, Package, Gift, Sparkles, Truck, CreditCard, 
  DollarSign, Tag, MapPin, Image as ImageIcon, CheckCircle2,
  Layers, Palette, Search, ChevronDown,
  Save, AlertCircle, Info, Star, Shield, Clock, User,
  Camera, Trash2, Edit2, Heart, BookOpen, Cake
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

const emptyForm = {
  title_ar: "",
  description_ar: "",
  price: 0,
  price_usd: 0,
  old_price: 0,
  old_price_usd: 0,
  is_offer: false,
  is_available: true,
  delivery_method: "pickup" as const,
  payment_method: "cash" as const,
  delivery_note: "",
  kind: "product" as ListingKind,
  category_id: "",
  governorate_id: "",
  cover_url: "",
  image_urls: [""],
};

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
  const { data: cats = [] } = useCategories();
  const { data: govs = [] } = useGovernorates();
  
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

  // ✅ State للبحث في التصنيفات والمحافظات
  const [categorySearch, setCategorySearch] = useState("");
  const [governorateSearch, setGovernorateSearch] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isGovernorateOpen, setIsGovernorateOpen] = useState(false);
  
  // ✅ Tabs للتنقل بين الأقسام
  const [activeTab, setActiveTab] = useState("basic");

  // ✅ دوال مساعدة لاستخراج أسماء التصنيف والمحافظة
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

  // ✅ فلتر التصنيفات الذكي
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return cats;
    const search = categorySearch.toLowerCase().trim();
    return cats.filter((c: any) => {
      const nameAr = (c.name_ar || "").toLowerCase();
      const nameEn = (c.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search) || nameAr.startsWith(search) || nameEn.startsWith(search);
    });
  }, [cats, categorySearch]);

  // ✅ فلتر المحافظات الذكي
  const filteredGovernorates = useMemo(() => {
    if (!governorateSearch.trim()) return govs;
    const search = governorateSearch.toLowerCase().trim();
    return govs.filter((g: any) => {
      const nameAr = (g.name_ar || "").toLowerCase();
      const nameEn = (g.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search) || nameAr.startsWith(search) || nameEn.startsWith(search);
    });
  }, [govs, governorateSearch]);

  // ✅ تحميل بيانات المنتج عند التعديل - مع إزالة cats و govs من dependencies
  useEffect(() => {
    if (!open) return;
    
    if (product) {
      console.log("📦 Product loaded:", product);
      console.log("📦 is_available from DB:", product.is_available);
      
      const availableValue = product.is_available !== undefined ? product.is_available : true;
      console.log("📦 Setting is_available to:", availableValue);
      
      setForm({
        title_ar: product.title_ar || "",
        description_ar: product.description_ar || "",
        price: product.price || 0,
        price_usd: product.price_usd || 0,
        old_price: product.old_price || 0,
        old_price_usd: product.old_price_usd || 0,
        is_offer: product.is_offer || false,
        is_available: availableValue,
        delivery_method: product.delivery_method || "pickup",
        payment_method: product.payment_method || "cash",
        delivery_note: product.delivery_note || "",
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
      
      const metaOptions = product.metadata?.options || {};
      const defaultOptions = {
        colors: [],
        sizes: [],
        models: [],
        materials: [],
        weight: [],
        style: [],
        brand: [],
      };
      const mergedOptions = { ...defaultOptions, ...metaOptions };
      setOptions(mergedOptions);
      
      if (metaOptions.sizes && metaOptions.sizes.length > 0) {
        setSizes(metaOptions.sizes);
      } else {
        setSizes([]);
      }
      
      if (product.metadata?.variations && product.metadata.variations.length > 0) {
        setVariations(product.metadata.variations);
      } else {
        setVariations([]);
      }
      
      if (product.colors && product.colors.length > 0) {
        setTempColors(product.colors);
        setColorWithImages(product.colors.map((c: any) => ({
          name: c.color_name_ar,
          image: c.image_url,
          hex: c.color_hex,
        })));
      } else if (metaOptions.colors && metaOptions.colors.length > 0) {
        const fallbackColors = metaOptions.colors.map((colorName: string, index: number) => ({
          id: `fallback-${Date.now()}-${index}`,
          color_name_ar: colorName,
          image_url: '',
          sort_order: index,
        }));
        setTempColors(fallbackColors);
      } else {
        setTempColors([]);
        setColorWithImages([]);
      }
      
    } else {
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
  }, [product, productType, open]); // ✅ إزالة cats و govs من هنا

  // ✅ منع السعر السالب
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
    setForm({ ...form, [field]: num });
  };

  // ✅ دالة التحقق من صحة النموذج
  const isFormValid = () => {
    if (!form.title_ar.trim()) return false;
    if (!form.price || form.price <= 0) return false;
    if (form.price < 0) return false;
    if (form.is_offer && (!form.old_price || form.old_price <= form.price)) return false;
    if (form.is_offer && form.old_price < 0) return false;
    if (!form.category_id) return false;
    if (!form.governorate_id) return false;
    if (!form.cover_url?.trim()) return false;
    
    if (tempColors.length > 0) {
      const colorsWithoutImage = tempColors.filter((c: any) => !c.image_url?.trim());
      if (colorsWithoutImage.length > 0) return false;
    }
    
    return true;
  };

  // ✅ دالة التحقق مع toast
  const validateAndSubmit = async () => {
    if (!form.title_ar.trim()) {
      toast.error(app.lang === "ar" ? "الرجاء إدخال اسم المنتج" : "Please enter product name");
      return;
    }
    
    if (!form.price || form.price <= 0) {
      toast.error(app.lang === "ar" ? "الرجاء إدخال السعر" : "Please enter price");
      return;
    }
    if (form.price < 0) {
      toast.error(app.lang === "ar" ? "السعر لا يمكن أن يكون سالباً" : "Price cannot be negative");
      return;
    }
    
    if (form.is_offer && (!form.old_price || form.old_price <= form.price)) {
      toast.error(app.lang === "ar" ? "السعر القديم يجب أن يكون أكبر من السعر الحالي" : "Old price must be greater than current price");
      return;
    }
    if (form.is_offer && form.old_price < 0) {
      toast.error(app.lang === "ar" ? "السعر القديم لا يمكن أن يكون سالباً" : "Old price cannot be negative");
      return;
    }
    
    if (!form.category_id) {
      toast.error(app.lang === "ar" ? "الرجاء اختيار التصنيف" : "Please select category");
      return;
    }
    
    if (!form.governorate_id) {
      toast.error(app.lang === "ar" ? "الرجاء اختيار المحافظة" : "Please select governorate");
      return;
    }
    
    if (!form.cover_url?.trim()) {
      toast.error(app.lang === "ar" ? "الرجاء رفع الصورة الرئيسية" : "Please upload main image");
      return;
    }
    
    if (tempColors.length > 0) {
      const colorsWithoutImage = tempColors.filter((c: any) => !c.image_url?.trim());
      if (colorsWithoutImage.length > 0) {
        const colorNames = colorsWithoutImage.map((c: any) => c.color_name_ar).join(', ');
        toast.error(
          app.lang === "ar" 
            ? `⚠️ الألوان التالية بدون صورة: ${colorNames}` 
            : `⚠️ The following colors have no image: ${colorNames}`
        );
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      const allData = { 
        ...form, 
        options: {
          ...options,
          colors: tempColors.map((c: any) => c.color_name_ar),
          sizes: sizes,
        },
        variations,
        colors: tempColors,
      };
      await onSave(allData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ تحديث الألوان
  const handleColorsWithImagesChange = (colors: ColorWithImage[]) => {
    setColorWithImages(colors);
    
    const newTempColors = colors.map((c, index) => ({
      id: `temp-${Date.now()}-${index}`,
      color_name_ar: c.name,
      color_name_en: c.name,
      color_hex: c.hex || null,
      image_url: c.image,
      sort_order: index,
    }));
    setTempColors(newTempColors);
    
    setOptions(prev => ({
      ...prev,
      colors: colors.map(c => c.name),
    }));
  };

  // ✅ تحديث المقاسات
  const handleSizesUpdate = (newSizes: string[]) => {
    setSizes(newSizes);
    setOptions(prev => ({
      ...prev,
      sizes: newSizes,
    }));
  };

  // ✅ أيقونة حسب النوع
  const getProductIcon = () => {
    if (productType === "offer") return <Gift className="h-6 w-6 text-emerald-500" />;
    return <Package className="h-6 w-6 text-indigo-600" />;
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* ✅ تعديل DialogContent: overflow-hidden → overflow-y-auto */}
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto rounded-2xl border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-0">
        
        {/* ===== Header ثابت ===== */}
        <div className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800/50 p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10">
                {getProductIcon()}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  {getProductTitle()}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {getProductSubtitle()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* ===== Tabs ===== */}
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
  {/* ✅ الترتيب الجديد: الأساسيات آخر شيء (على اليمين) */}
  <TabsTrigger value="delivery" className="rounded-lg text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
    <Truck className="h-3.5 w-3.5 ml-1.5" />
    {lang === "ar" ? "توصيل" : "Delivery"}
  </TabsTrigger>
  <TabsTrigger value="options" className="rounded-lg text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
    <Layers className="h-3.5 w-3.5 ml-1.5" />
    {lang === "ar" ? "خيارات" : "Options"}
  </TabsTrigger>
  <TabsTrigger value="images" className="rounded-lg text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
    <Camera className="h-3.5 w-3.5 ml-1.5" />
    {lang === "ar" ? "الصور" : "Images"}
  </TabsTrigger>
  <TabsTrigger value="pricing" className="rounded-lg text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
    <DollarSign className="h-3.5 w-3.5 ml-1.5" />
    {lang === "ar" ? "السعر" : "Pricing"}
  </TabsTrigger>
  <TabsTrigger value="basic" className="rounded-lg text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-sm">
    <Info className="h-3.5 w-3.5 ml-1.5" />
    {lang === "ar" ? "أساسيات" : "Basic"}
  </TabsTrigger>
</TabsList>
            </Tabs>
          </div>
        </div>

        {/* ===== Body ===== */}
        {/* ✅ إزالة max-h الزائد */}
        <div className="p-4 md:p-6 space-y-6">
          
          {/* ===== TAB: Basic ===== */}
          {activeTab === "basic" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {lang === "ar" ? "المعلومات الأساسية للمنتج" : "Basic Product Information"}
                    </p>
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                      {lang === "ar" 
                        ? "أدخل اسم المنتج ووصفه واختر التصنيف المناسب" 
                        : "Enter product name, description and select the appropriate category"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    {lang === "ar" ? "اسم المنتج" : "Product Name"}
                    <span className="text-red-500">*</span>
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                      {lang === "ar" ? "مطلوب" : "Required"}
                    </Badge>
                  </Label>
                  <Input
                    value={form.title_ar}
                    onChange={(e) => setForm({ ...form, title_ar: e.target.value })}
                    placeholder={lang === "ar" ? "أدخل اسم المنتج..." : "Enter product name..."}
                    className="mt-1.5 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    {lang === "ar" ? "وصف المنتج" : "Description"}
                    <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                      {lang === "ar" ? "اختياري" : "Optional"}
                    </Badge>
                  </Label>
                  <Textarea
                    rows={4}
                    value={form.description_ar}
                    onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                    placeholder={lang === "ar" ? "وصف المنتج بالتفصيل..." : "Detailed product description..."}
                    className="mt-1.5 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    {lang === "ar" 
                      ? "يُفضل أن يكون الوصف واضحاً وشاملاً لجذب العملاء" 
                      : "Make the description clear and comprehensive to attract customers"}
                  </p>
                </div>

                {/* ===== Category & Location ===== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      {lang === "ar" ? "التصنيف" : "Category"}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="relative">
                        <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
                        <Input
                          value={categorySearch}
                          onChange={(e) => setCategorySearch(e.target.value)}
                          onFocus={() => setIsCategoryOpen(true)}
                          placeholder={lang === "ar" ? "🔍 ابحث عن تصنيف..." : "🔍 Search category..."}
                          className="ps-9 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {categorySearch && (
                          <button
                            onClick={() => setCategorySearch("")}
                            className="absolute inset-y-0 end-3 flex items-center"
                          >
                            <X className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                          </button>
                        )}
                      </div>
                      {isCategoryOpen && (
                        <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-lg shadow-black/5">
                          {filteredCategories.length === 0 ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                            </div>
                          ) : (
                            filteredCategories.map((c: any) => (
                              <button
                                key={c.id}
                                className={cn(
                                  "w-full text-start px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2",
                                  form.category_id === c.id && "bg-blue-50 dark:bg-blue-950/30 text-blue-600"
                                )}
                                onClick={() => {
                                  setForm({ ...form, category_id: c.id });
                                  setCategorySearch(lang === "ar" ? c.name_ar : c.name_en);
                                  setIsCategoryOpen(false);
                                }}
                              >
                                {form.category_id === c.id && (
                                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
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
                    <Label className="text-sm font-medium flex items-center gap-2">
                      {lang === "ar" ? "المحافظة" : "Governorate"}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative mt-1.5">
                      <div className="relative">
                        <MapPin className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
                        <Input
                          value={governorateSearch}
                          onChange={(e) => setGovernorateSearch(e.target.value)}
                          onFocus={() => setIsGovernorateOpen(true)}
                          placeholder={lang === "ar" ? "🔍 ابحث عن محافظة..." : "🔍 Search governorate..."}
                          className="ps-9 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                        {governorateSearch && (
                          <button
                            onClick={() => setGovernorateSearch("")}
                            className="absolute inset-y-0 end-3 flex items-center"
                          >
                            <X className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
                          </button>
                        )}
                      </div>
                      {isGovernorateOpen && (
                        <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-lg shadow-black/5">
                          {filteredGovernorates.length === 0 ? (
                            <div className="p-4 text-sm text-muted-foreground text-center">
                              {lang === "ar" ? "لا توجد نتائج" : "No results found"}
                            </div>
                          ) : (
                            filteredGovernorates.map((g: any) => (
                              <button
                                key={g.id}
                                className={cn(
                                  "w-full text-start px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2",
                                  form.governorate_id === g.id && "bg-blue-50 dark:bg-blue-950/30 text-blue-600"
                                )}
                                onClick={() => {
                                  setForm({ ...form, governorate_id: g.id });
                                  setGovernorateSearch(lang === "ar" ? g.name_ar : g.name_en);
                                  setIsGovernorateOpen(false);
                                }}
                              >
                                {form.governorate_id === g.id && (
                                  <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
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

                {/* ===== Availability - محسّن مع دعم is_available ===== */}
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    {lang === "ar" ? "حالة التوفر" : "Availability"}
                  </Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1.5 p-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <label className="flex items-center gap-3 text-sm cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={form.is_available === true}
                          onChange={(e) => {
                            const newValue = e.target.checked;
                            console.log("🔄 Toggling is_available from:", form.is_available, "to:", newValue);
                            setForm(prev => ({ ...prev, is_available: newValue }));
                          }}
                          className="h-5 w-5 rounded border-slate-300/50 accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "font-medium transition-colors",
                          form.is_available === true ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                        )}>
                          {form.is_available === true
                            ? (lang === "ar" ? "✅ متوفر للبيع" : "✅ Available for sale")
                            : (lang === "ar" ? "❌ غير متوفر" : "❌ Unavailable")}
                        </span>
                        {form.is_available === true ? (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30 text-[10px]">
                            {lang === "ar" ? "نشط" : "Active"}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-500 border-red-200 dark:border-red-800/30 text-[10px]">
                            {lang === "ar" ? "غير نشط" : "Inactive"}
                          </Badge>
                        )}
                      </div>
                    </label>
                    <p className="text-xs text-muted-foreground">
                      {form.is_available === true
                        ? (lang === "ar" ? "🟢 العملاء يمكنهم شراء هذا المنتج" : "🟢 Customers can purchase this product")
                        : (lang === "ar" ? "🔴 هذا المنتج غير متاح للشراء حالياً" : "🔴 This product is currently not available for purchase")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* ===== TAB: Pricing ===== */}
{activeTab === "pricing" && (
  <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
    <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <DollarSign className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {lang === "ar" ? "تسعير المنتج" : "Product Pricing"}
          </p>
          {/* ✅ تم إزالة الجملة الثانية */}
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5" />
          {lang === "ar" ? "السعر (ل.س)" : "Price (SYP)"}
          <span className="text-red-500">*</span>
        </Label>
        <Input
          type="number"
          min="0"
          value={form.price}
          onChange={(e) => handlePriceChange(e.target.value, "price")}
          placeholder="0"
          className="mt-1.5 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
      <div>
        <Label className="text-sm font-medium flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5" />
          {lang === "ar" ? "السعر ($)" : "Price (USD)"}
          <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
            {lang === "ar" ? "اختياري" : "Optional"}
          </Badge>
        </Label>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={form.price_usd}
          onChange={(e) => handlePriceChange(e.target.value, "price_usd")}
          placeholder="0.00"
          className="mt-1.5 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
    </div>

    {productType === "offer" && (
      <>
        <div className="flex items-center gap-3 p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30">
          <Gift className="h-5 w-5 text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              {lang === "ar" ? "🛍️ هذا المنتج هو عرض خاص" : "🛍️ This product is a special offer"}
            </p>
            <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70">
              {lang === "ar" 
                ? "أدخل السعر القديم لعرض الخصم للعملاء" 
                : "Enter the old price to show the discount to customers"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-3.5 w-3.5" />
              {lang === "ar" ? "السعر القديم (ل.س)" : "Old Price (SYP)"}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min="0"
              value={form.old_price}
              onChange={(e) => handlePriceChange(e.target.value, "old_price")}
              placeholder="0"
              className="mt-1.5 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div>
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-3.5 w-3.5" />
              {lang === "ar" ? "السعر القديم ($)" : "Old Price (USD)"}
              <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                {lang === "ar" ? "اختياري" : "Optional"}
              </Badge>
            </Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.old_price_usd}
              onChange={(e) => handlePriceChange(e.target.value, "old_price_usd")}
              placeholder="0.00"
              className="mt-1.5 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* عرض نسبة الخصم */}
        {form.old_price > form.price && form.old_price > 0 && (
          <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 text-sm px-4 py-1.5">
              🎯 {Math.round(((form.old_price - form.price) / form.old_price) * 100)}% {lang === "ar" ? "خصم" : "Discount"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {lang === "ar" ? "العميل سيوفر" : "Customer saves"} 
              <span className="font-bold text-emerald-600 mx-1">
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
              <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Camera className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      {lang === "ar" ? "صور المنتج" : "Product Images"}
                    </p>
                    <p className="text-xs text-purple-600/70 dark:text-purple-400/70">
                      {lang === "ar" 
                        ? "الصور الجيدة تزيد من فرص البيع بنسبة تصل إلى 80%" 
                        : "Good images increase sales chances by up to 80%"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  {lang === "ar" ? "الصورة الرئيسية" : "Main Image"}
                  <span className="text-red-500">*</span>
                  <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
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
                    previewClassName="aspect-video h-auto rounded-xl max-h-[300px]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 p-4 border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <Label className="font-semibold">
                      {lang === "ar" ? "صور إضافية" : "Additional Images"}
                    </Label>
                    <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                      {lang === "ar" ? "اختيارية" : "Optional"}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
                      {form.image_urls.length}/6
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setForm({ ...form, image_urls: [...form.image_urls, ""] })}
                    disabled={form.image_urls.length >= 6}
                    className="rounded-xl border-slate-200/50 hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-all"
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
                      previewClassName="aspect-video h-auto rounded-xl"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB: Options ===== */}
          {activeTab === "options" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Layers className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                      {lang === "ar" ? "خيارات وتركيبات المنتج" : "Product Options & Variations"}
                    </p>
                    <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">
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
                externalColorImages={Object.fromEntries(
                  tempColors.map((c: any) => [c.color_name_ar, c.image_url])
                )}
                sizes={sizes}
                onSizesChange={handleSizesUpdate}
              />
            </div>
          )}

          {/* ===== TAB: Delivery ===== */}
          {activeTab === "delivery" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <div className="bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                      {lang === "ar" ? "طرق التوصيل والدفع" : "Delivery & Payment Methods"}
                    </p>
                    <p className="text-xs text-orange-600/70 dark:text-orange-400/70">
                      {lang === "ar" 
                        ? "حدد طرق التوصيل والدفع المتوفرة للمنتج" 
                        : "Specify available delivery and payment methods"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5" />
                    {lang === "ar" ? "طريقة التوصيل" : "Delivery Method"}
                  </Label>
                  <Select
                    value={form.delivery_method}
                    onValueChange={(v: any) => setForm({ ...form, delivery_method: v })}
                  >
                    <SelectTrigger className="mt-1.5 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">🏪 {lang === "ar" ? "استلام من المتجر" : "Store pickup"}</SelectItem>
                      <SelectItem value="local_delivery">🚚 {lang === "ar" ? "توصيل داخل المدينة" : "Local delivery"}</SelectItem>
                      <SelectItem value="nationwide">📦 {lang === "ar" ? "شحن لكل المحافظات" : "Nationwide shipping"}</SelectItem>
                      <SelectItem value="none">❌ {lang === "ar" ? "بدون توصيل" : "No delivery"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5" />
                    {lang === "ar" ? "طريقة الدفع" : "Payment Method"}
                  </Label>
                  <Select
                    value={form.payment_method}
                    onValueChange={(v: any) => setForm({ ...form, payment_method: v })}
                  >
                    <SelectTrigger className="mt-1.5 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">💰 {lang === "ar" ? "نقداً عند الاستلام" : "Cash on delivery"}</SelectItem>
                      <SelectItem value="transfer">🏦 {lang === "ar" ? "تحويل بنكي" : "Bank transfer"}</SelectItem>
                      <SelectItem value="online">💳 {lang === "ar" ? "دفع إلكتروني" : "Online payment"}</SelectItem>
                      <SelectItem value="all">🌐 {lang === "ar" ? "كل الطرق" : "All methods"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-3.5 w-3.5" />
                  {lang === "ar" ? "ملاحظة التوصيل" : "Delivery Note"}
                  <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                    {lang === "ar" ? "اختياري" : "Optional"}
                  </Badge>
                </Label>
                <Input
                  value={form.delivery_note}
                  onChange={(e) => setForm({ ...form, delivery_note: e.target.value })}
                  placeholder={lang === "ar" ? "ملاحظات إضافية للتوصيل..." : "Additional delivery notes..."}
                  className="mt-1.5 h-11 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* ===== Footer ثابت ===== */}
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 p-4 md:p-6 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              {!isFormValid() && (
                <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  <span>{lang === "ar" ? "بعض الحقول المطلوبة غير مكتملة" : "Some required fields are incomplete"}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 sm:flex-none rounded-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 h-11 px-6"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={validateAndSubmit}
                disabled={!isFormValid() || isSaving || isSubmitting}
                className={cn(
                  "flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/25 transition-all h-11 px-8",
                  !isFormValid() && "opacity-50 cursor-not-allowed",
                  !isFormValid() ? "" : "hover:shadow-indigo-600/40 hover:scale-[1.02]"
                )}
              >
                {isSaving || isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {lang === "ar" ? "جاري الحفظ..." : "Saving..."}
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 me-2" />
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}