import { r as reactExports, j as jsxRuntimeExports, R as React__default } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, a as useT, V as useNotifications, W as useMarkNotificationRead, X as useMarkAllNotificationsRead, b as Button, Y as BecomeSellerCard, Z as getPushSubscriptionStatus, D as Dialog, _ as DialogTrigger, g as DialogContent, l as DialogTitle, $ as DropdownMenu, a0 as DropdownMenuTrigger, a1 as DropdownMenuContent, a2 as DropdownMenuItem, a3 as requestPushPermission, a4 as subscribeToPush, K as useProfile, H as useStoreOrders, x as useMyListings, J as useSellerCustomers, e as useCategories, P as Avatar, Q as AvatarImage, U as AvatarFallback, c as cn, B as Badge, I as Input, k as formatPrice, a5 as isPushSupported, a6 as getNotificationPermission, f as useGovernorates, y as useSellerOffers, z as useCreateListing, A as useUpdateListing, C as useDeleteListing, E as useSendNotificationV2, F as useAddToCart, G as useDeleteProductOffer, S as Select, r as SelectTrigger, s as SelectValue, t as SelectContent, v as SelectItem, O as OptimizedImage, L as Label, q as DialogHeader, M as useUpdateStorePreferences, j as Textarea, d as ImageInput, R as RadioGroup, N as RadioGroupItem, m as DialogDescription, w as DialogFooter, T as Tabs, h as TabsList, i as TabsTrigger, n as useCreateProductOffer, o as useUpdateProductOffer, p as useListings } from "./router-BU7AgYzK.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as pkg__default } from "../_libs/file-saver.mjs";
import { u as useQueryClient, b as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as utils, w as writeSync } from "../_libs/xlsx.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BsaVHwzL.mjs";
import { S as Switch } from "./switch-CsdoyQ0i.mjs";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle, d as CardDescription } from "./card-C7XU6h8z.mjs";
import { A as AdminDashboard } from "./AdminDashboard-8PcC18DF.mjs";
import { a6 as BellRing, ai as Bell, cc as CheckCheck, aj as BellOff, b as Clock, u as Check, E as EllipsisVertical, v as Trash2, n as LayoutDashboard, P as Package, a8 as ShoppingCart, t as Users, a9 as Settings, q as Search, X, a as ChevronLeft, bM as ArrowUpRight, C as ChevronRight, ah as UserPlus, r as Phone, as as Mail, a0 as MapPin, a1 as Shield, G as Gift, N as CircleX, a4 as CircleCheck, ak as TrendingUp, Z as Zap, aq as Award, bZ as ChartColumn, d as TriangleAlert, R as RefreshCw, i as ShoppingBag, j as Percent, g as Sparkles, f as Plus, bV as FileSpreadsheet, an as FileText, s as Funnel, bR as Tags, L as Layers, c6 as Folder, c8 as CornerDownRight, J as FolderTree, h as Star, W as Eye, bc as Pen, cd as ChevronsLeft, ce as ChevronsRight, _ as CircleAlert, m as Truck, cf as Wallet, O as Calendar, V as ChevronUp, y as ChevronDown, c4 as Hash, U as User, c as Store, o as MessageCircle, l as Crown, cg as SlidersVertical, k as ShieldCheck, ch as Power, ci as PowerOff, aa as Globe, c1 as MessageSquare, bf as BookOpen, bK as Image, bL as Building, $ as Info, cj as Coins, bF as Camera, p as LoaderCircle, a2 as ArrowRight, A as ArrowLeft, bX as Save, bU as DollarSign, T as Tag, ba as Palette, au as BadgePercent, H as Heart, bC as Gamepad2, w as House, ck as Droplet, cl as Weight, b8 as Ruler, bz as Wifi, bJ as Smartphone, by as Battery, bx as Cpu, cm as HardDrive, bw as Shirt, cn as Box } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, f as ComposedChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, d as Legend, A as Area, e as Bar, g as RadarChart, h as PolarGrid, i as PolarAngleAxis, j as PolarRadiusAxis, k as Radar, P as PieChart, b as Pie, c as Cell, B as BarChart } from "../_libs/recharts.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/react-intersection-observer.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-switch.mjs";
import "../_libs/radix-ui__react-scroll-area.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "./popover-CtuXcnOY.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/react-day-picker.mjs";
import "../_libs/date-fns__tz.mjs";
import "../_libs/date-fns.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function useCategoryOptions(parentCategoryId) {
  return useQuery({
    queryKey: ["category-options", parentCategoryId],
    enabled: !!parentCategoryId,
    staleTime: 1e3 * 60 * 10,
    // 10 دقائق cache
    queryFn: async () => {
      if (!parentCategoryId) return [];
      const { data, error } = await supabase.from("category_options").select("*").eq("category_id", parentCategoryId).order("sort_order", { ascending: true });
      if (error) {
        console.error("❌ Error fetching category options:", error);
        throw error;
      }
      return data || [];
    }
  });
}
function ProductOptionsManager({
  value,
  onChange,
  lang,
  readOnly = false,
  variations = [],
  onVariationsChange,
  userId = "",
  onColorsWithImagesChange,
  externalColorImages = {},
  sizes = [],
  onSizesChange,
  isOffer = false,
  availableOptions = []
}) {
  const app = useApp();
  const ALL_OPTION_TYPES = {
    colors: { icon: Palette, emoji: "🎨", color: "#2a655f", description_ar: "أضف ألوان المنتج مع صور", description_en: "Add product colors with images" },
    sizes: { icon: Ruler, emoji: "📏", color: "#2a655f", description_ar: "أضف المقاسات المتوفرة", description_en: "Add available sizes" },
    size: { icon: Ruler, emoji: "📏", color: "#2a655f", description_ar: "أضف الحجم", description_en: "Add size" },
    models: { icon: Box, emoji: "📐", color: "#2a655f", description_ar: "أضف النماذج المختلفة", description_en: "Add different models" },
    materials: { icon: Droplet, emoji: "🧵", color: "#2a655f", description_ar: "أضف أنواع المواد", description_en: "Add material types" },
    fabric: { icon: Shirt, emoji: "👕", color: "#2a655f", description_ar: "أضف أنواع الأقمشة", description_en: "Add fabric types" },
    style: { icon: Sparkles, emoji: "✨", color: "#2a655f", description_ar: "أضف أنماط التصميم", description_en: "Add design styles" },
    season: { icon: Calendar, emoji: "🌤️", color: "#2a655f", description_ar: "أضف المواسم", description_en: "Add seasons" },
    gender: { icon: User, emoji: "👫", color: "#2a655f", description_ar: "أضف الفئات الجنسية", description_en: "Add gender categories" },
    brand: { icon: Tag, emoji: "🏷️", color: "#2a655f", description_ar: "أضف الماركات", description_en: "Add brands" },
    storage: { icon: HardDrive, emoji: "💾", color: "#2a655f", description_ar: "أضف سعات التخزين", description_en: "Add storage capacities" },
    ram: { icon: Cpu, emoji: "🧠", color: "#2a655f", description_ar: "أضف سعات الذاكرة", description_en: "Add RAM capacities" },
    processor: { icon: Cpu, emoji: "⚡", color: "#2a655f", description_ar: "أضف أنواع المعالجات", description_en: "Add processor types" },
    battery: { icon: Battery, emoji: "🔋", color: "#2a655f", description_ar: "أضف سعات البطارية", description_en: "Add battery capacities" },
    screen_size: { icon: Smartphone, emoji: "📱", color: "#2a655f", description_ar: "أضف أحجام الشاشات", description_en: "Add screen sizes" },
    camera: { icon: Camera, emoji: "📷", color: "#2a655f", description_ar: "أضف دقات الكاميرا", description_en: "Add camera resolutions" },
    connectivity: { icon: Wifi, emoji: "📶", color: "#2a655f", description_ar: "أضف أنواع الاتصال", description_en: "Add connectivity types" },
    dimensions: { icon: Ruler, emoji: "📐", color: "#2a655f", description_ar: "أضف الأبعاد", description_en: "Add dimensions" },
    weight: { icon: Weight, emoji: "⚖️", color: "#2a655f", description_ar: "أضف الأوزان", description_en: "Add weights" },
    volume: { icon: Droplet, emoji: "🧴", color: "#2a655f", description_ar: "أضف الأحجام", description_en: "Add volumes" },
    concentration: { icon: Droplet, emoji: "💧", color: "#2a655f", description_ar: "أضف التركيزات", description_en: "Add concentrations" },
    notes: { icon: Star, emoji: "🌸", color: "#2a655f", description_ar: "أضف المكونات العطرية", description_en: "Add fragrance notes" },
    language: { icon: Globe, emoji: "🌐", color: "#2a655f", description_ar: "أضف اللغات", description_en: "Add languages" },
    pages: { icon: BookOpen, emoji: "📖", color: "#2a655f", description_ar: "أضف عدد الصفحات", description_en: "Add page count" },
    author: { icon: User, emoji: "✍️", color: "#2a655f", description_ar: "أضف المؤلفين", description_en: "Add authors" },
    publisher: { icon: House, emoji: "🏢", color: "#2a655f", description_ar: "أضف الناشرين", description_en: "Add publishers" },
    age_group: { icon: User, emoji: "👶", color: "#2a655f", description_ar: "أضف الفئات العمرية", description_en: "Add age groups" },
    platform: { icon: Gamepad2, emoji: "🎮", color: "#2a655f", description_ar: "أضف المنصات", description_en: "Add platforms" },
    pet_type: { icon: Heart, emoji: "🐾", color: "#2a655f", description_ar: "أضف أنواع الحيوانات", description_en: "Add pet types" },
    occasion: { icon: Gift, emoji: "🎉", color: "#2a655f", description_ar: "أضف المناسبات", description_en: "Add occasions" },
    expiry: { icon: Clock, emoji: "📅", color: "#2a655f", description_ar: "أضف تاريخ الانتهاء", description_en: "Add expiry date" },
    discount_type: { icon: BadgePercent, emoji: "🏷️", color: "#2a655f", description_ar: "أضف نوع الخصم", description_en: "Add discount type" },
    discount_value: { icon: BadgePercent, emoji: "💰", color: "#2a655f", description_ar: "أضف قيمة الخصم", description_en: "Add discount value" },
    shades: { icon: Palette, emoji: "🎨", color: "#2a655f", description_ar: "أضف الدرجات", description_en: "Add shades" },
    skin_type: { icon: User, emoji: "💆", color: "#2a655f", description_ar: "أضف أنواع البشرة", description_en: "Add skin types" }
  };
  const OPTION_TYPES = reactExports.useMemo(() => {
    if (!availableOptions || availableOptions.length === 0) {
      return [];
    }
    const isArabic = app.lang === "ar";
    return availableOptions.sort((a, b) => a.sort_order - b.sort_order).map((opt) => {
      const meta = ALL_OPTION_TYPES[opt.key] || {
        icon: Tag,
        emoji: "📦",
        color: "#2a655f",
        description_ar: "خيار مخصص",
        description_en: "Custom option"
      };
      return {
        id: opt.key,
        label: isArabic ? opt.name_ar : opt.name_en,
        icon: meta.icon,
        color: meta.color,
        emoji: meta.emoji,
        description: isArabic ? meta.description_ar : meta.description_en,
        type: opt.type,
        required: opt.required
      };
    });
  }, [availableOptions, app.lang]);
  reactExports.useMemo(() => {
    return availableOptions.some((opt) => opt.key === "colors" || opt.key === "shades");
  }, [availableOptions]);
  const [newValue, setNewValue] = reactExports.useState("");
  const [activeType, setActiveType] = reactExports.useState("");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [localVariations, setLocalVariations] = reactExports.useState(variations);
  const [colorImages, setColorImages] = reactExports.useState(externalColorImages);
  const [tempColorImage, setTempColorImage] = reactExports.useState("");
  const [editingVariation, setEditingVariation] = reactExports.useState(null);
  const [showHelp, setShowHelp] = reactExports.useState(true);
  const isGeneratingRef = reactExports.useRef(false);
  const isDeletingRef = reactExports.useRef(false);
  const lastManualActionRef = reactExports.useRef({
    type: null,
    timestamp: 0
  });
  const previousStateRef = reactExports.useRef("");
  const [deletedVariationsBackup, setDeletedVariationsBackup] = reactExports.useState([]);
  const [showRestoreButton, setShowRestoreButton] = reactExports.useState(false);
  const isInitialLoadRef = reactExports.useRef(true);
  reactExports.useEffect(() => {
    if (OPTION_TYPES.length > 0 && !activeType) {
      setActiveType(OPTION_TYPES[0].id);
    }
  }, [OPTION_TYPES, activeType]);
  reactExports.useEffect(() => {
    console.log("🔍 [ProductOptionsManager] Syncing variations from props:", variations.length);
    if (variations.length > 0) {
      setLocalVariations(variations);
      isInitialLoadRef.current = false;
    } else {
      setLocalVariations(variations);
    }
  }, [variations]);
  reactExports.useEffect(() => {
    setColorImages(externalColorImages);
  }, [externalColorImages]);
  const notifyColorsChange = (colors, images) => {
    if (onColorsWithImagesChange) {
      const colorData = colors.map((name) => ({
        name,
        image: images[name] || ""
      }));
      onColorsWithImagesChange(colorData);
    }
  };
  const recordManualAction = reactExports.useCallback((type) => {
    lastManualActionRef.current = {
      type,
      timestamp: Date.now()
    };
  }, []);
  reactExports.useCallback((currentState) => {
    const now = Date.now();
    const timeSinceLastAction = now - lastManualActionRef.current.timestamp;
    if (lastManualActionRef.current.type && timeSinceLastAction < 500) {
      return true;
    }
    if (currentState.length === 0 && lastManualActionRef.current.type === "delete") {
      return true;
    }
    return false;
  }, []);
  reactExports.useEffect(() => {
    if (isGeneratingRef.current) {
      console.log("⏳ [Auto-Generate] Generation in progress, skipping...");
      return;
    }
    if (isDeletingRef.current) {
      console.log("⏳ [Auto-Generate] Deletion in progress, skipping...");
      return;
    }
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      console.log("ℹ️ [Auto-Generate] Initial load - skipping auto-generation");
      return;
    }
    const activeTypes = Object.keys(value).filter((key) => value[key] && value[key].length > 0);
    const activeOptionsCount = activeTypes.length;
    console.log(`📊 [Auto-Generate] Active options: ${activeOptionsCount}`, activeTypes);
    if (activeOptionsCount >= 2) {
      console.log("🔄 [Auto-Generate] 2+ options active, allowing regeneration...");
    } else {
      if (localVariations.length > 0) {
        console.log("🗑️ [Auto-Generate] Less than 2 options, clearing variations");
        isGeneratingRef.current = true;
        setLocalVariations([]);
        if (onVariationsChange) onVariationsChange([]);
        setTimeout(() => {
          isGeneratingRef.current = false;
        }, 100);
      }
      return;
    }
    if (value.colors && value.colors.length > 0) {
      const colorsWithoutImage = value.colors.filter((c) => !colorImages[c]);
      if (colorsWithoutImage.length > 0) {
        console.log(`⚠️ [Auto-Generate] ${colorsWithoutImage.length} colors without image, clearing variations`);
        if (localVariations.length > 0) {
          isGeneratingRef.current = true;
          setLocalVariations([]);
          if (onVariationsChange) onVariationsChange([]);
          setTimeout(() => {
            isGeneratingRef.current = false;
          }, 100);
        }
        return;
      }
    }
    const generatedVariations = generateVariationsAuto(value, colorImages);
    if (generatedVariations.length === 0) {
      if (localVariations.length > 0) {
        console.log("🗑️ [Auto-Generate] No variations generated, clearing");
        isGeneratingRef.current = true;
        setLocalVariations([]);
        if (onVariationsChange) onVariationsChange([]);
        setTimeout(() => {
          isGeneratingRef.current = false;
        }, 100);
      }
      return;
    }
    const variationsWithDefaults = generatedVariations.map((v) => {
      const existingVariation = localVariations.find((existing) => {
        const existingKeys = Object.keys(existing.combination);
        const newKeys2 = Object.keys(v.combination);
        if (existingKeys.length !== newKeys2.length) return false;
        return existingKeys.every(
          (key) => existing.combination[key] === v.combination[key]
        );
      });
      const isNew = !existingVariation;
      return {
        ...v,
        price: existingVariation?.price ?? 0,
        old_price: existingVariation?.old_price ?? 0,
        stock_quantity: existingVariation?.stock_quantity ?? 0,
        is_available: existingVariation?.is_available ?? true,
        is_new: isNew
      };
    });
    const currentKeys = new Set(
      localVariations.map((v) => JSON.stringify(v.combination))
    );
    const newKeys = new Set(
      variationsWithDefaults.map((v) => JSON.stringify(v.combination))
    );
    const isDifferent = localVariations.length !== variationsWithDefaults.length || [...newKeys].some((key) => !currentKeys.has(key));
    if (!isDifferent) {
      console.log("ℹ️ [Auto-Generate] Variations unchanged, skipping");
      return;
    }
    const hasNewVariations = variationsWithDefaults.some((v) => v.is_new);
    if (hasNewVariations) {
      const newVariationsCount2 = variationsWithDefaults.filter((v) => v.is_new).length;
      toast.info(
        lang === "ar" ? `📝 تم توليد ${newVariationsCount2} تركيبة جديدة، الرجاء إدخال الأسعار لكل تركيبة (مظللة بالأصفر)` : `📝 ${newVariationsCount2} new variations generated, please enter prices for each (highlighted in yellow)`,
        { duration: 5e3 }
      );
    }
    console.log(`🔄 [Auto-Generate] Regenerating ${variationsWithDefaults.length} variations (was ${localVariations.length})`);
    console.log("📊 [Auto-Generate] Active options:", activeTypes);
    console.log("📊 [Auto-Generate] New variations:", variationsWithDefaults.filter((v) => v.is_new).length);
    isGeneratingRef.current = true;
    setLocalVariations(variationsWithDefaults);
    if (onVariationsChange) {
      onVariationsChange(variationsWithDefaults);
    }
    setTimeout(() => {
      isGeneratingRef.current = false;
      console.log("✅ [Auto-Generate] Generation completed");
    }, 100);
  }, [value, colorImages, localVariations, onVariationsChange]);
  const generateVariationsAuto = (currentValue, currentColorImages) => {
    const activeTypes = {};
    Object.keys(currentValue).forEach((key) => {
      if (currentValue[key] && currentValue[key].length > 0) {
        activeTypes[key] = currentValue[key];
      }
    });
    const typeKeys = Object.keys(activeTypes);
    if (typeKeys.length < 2) return [];
    if (activeTypes.colors) {
      const colorsWithoutImage = activeTypes.colors.filter((c) => !currentColorImages[c]);
      if (colorsWithoutImage.length > 0) return [];
    }
    const allVariations = [];
    const generateAllCombinations = (types, index, current) => {
      if (index === types.length) {
        const exists = allVariations.some((v) => {
          return Object.keys(current).every((key) => v.combination[key] === current[key]);
        });
        if (!exists) {
          allVariations.push({
            id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            combination: { ...current },
            is_available: true,
            price: 0,
            old_price: 0,
            stock_quantity: 0
          });
        }
        return;
      }
      const type = types[index];
      const values = activeTypes[type];
      values.forEach((val) => {
        current[type] = val;
        generateAllCombinations(types, index + 1, current);
      });
      delete current[type];
    };
    generateAllCombinations(typeKeys, 0, {});
    return allVariations;
  };
  const generateVariations = reactExports.useCallback(() => {
    const activeTypes = {};
    Object.keys(value).forEach((key) => {
      if (value[key] && value[key].length > 0) {
        activeTypes[key] = value[key];
      }
    });
    const typeKeys = Object.keys(activeTypes);
    if (typeKeys.length < 2) {
      toast.error(
        lang === "ar" ? "⚠️ يجب اختيار نوعين من الخيارات على الأقل (مثل: ألوان + مقاسات)" : "⚠️ Select at least two option types (e.g., Colors + Sizes)"
      );
      return;
    }
    if (activeTypes.colors) {
      const colorsWithoutImage = activeTypes.colors.filter((c) => !colorImages[c]);
      if (colorsWithoutImage.length > 0) {
        toast.error(
          lang === "ar" ? `⚠️ الألوان التالية بدون صورة: ${colorsWithoutImage.join(", ")}` : `⚠️ The following colors have no image: ${colorsWithoutImage.join(", ")}`
        );
        return;
      }
    }
    recordManualAction("generate");
    const allVariations = [];
    const generateAllCombinations = (types, index, current) => {
      if (index === types.length) {
        allVariations.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          combination: { ...current },
          is_available: true,
          price: 0,
          old_price: 0,
          stock_quantity: 0
        });
        return;
      }
      const type = types[index];
      const values = activeTypes[type];
      values.forEach((val) => {
        current[type] = val;
        generateAllCombinations(types, index + 1, current);
      });
      delete current[type];
    };
    generateAllCombinations(typeKeys, 0, {});
    if (allVariations.length > 0) {
      const variationsWithDefaults = allVariations.map((v) => ({
        ...v,
        price: 0,
        old_price: 0,
        stock_quantity: 0,
        is_new: true
      }));
      setLocalVariations(variationsWithDefaults);
      if (onVariationsChange) {
        onVariationsChange(variationsWithDefaults);
      }
      setShowRestoreButton(false);
      setDeletedVariationsBackup([]);
      toast.success(
        lang === "ar" ? `✅ تم توليد ${allVariations.length} تركيبة جديدة (من ${typeKeys.length} أنواع)` : `✅ Generated ${allVariations.length} new variations (from ${typeKeys.length} types)`
      );
    } else {
      toast.info(lang === "ar" ? "💡 لا توجد تركيبات جديدة" : "💡 No new variations");
    }
  }, [value, colorImages, lang, onVariationsChange, recordManualAction]);
  const removeAllVariations = reactExports.useCallback(() => {
    if (localVariations.length > 0) {
      setDeletedVariationsBackup(localVariations);
      setShowRestoreButton(true);
    }
    recordManualAction("delete");
    isDeletingRef.current = true;
    setLocalVariations([]);
    if (onVariationsChange) {
      onVariationsChange([]);
    }
    previousStateRef.current = JSON.stringify([]);
    toast.success(
      lang === "ar" ? "✅ تم حذف جميع التركيبات (يمكنك استعادتها)" : "✅ All variations deleted (you can restore them)"
    );
    setTimeout(() => {
      isDeletingRef.current = false;
      setTimeout(() => {
        if (lastManualActionRef.current.type === "delete") {
          lastManualActionRef.current.type = null;
        }
      }, 1e3);
    }, 600);
  }, [localVariations, lang, onVariationsChange, recordManualAction]);
  const restoreVariations = reactExports.useCallback(() => {
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
      lang === "ar" ? `✅ تم استعادة ${deletedVariationsBackup.length} تركيبة` : `✅ Restored ${deletedVariationsBackup.length} variations`
    );
  }, [deletedVariationsBackup, lang, onVariationsChange]);
  const addOption = (type, imageUrl) => {
    const val = newValue.trim();
    if (!val) {
      toast.error(lang === "ar" ? "⚠️ الرجاء إدخال قيمة" : "⚠️ Please enter a value");
      return false;
    }
    if (value[type]?.includes(val)) {
      toast.error(lang === "ar" ? "⚠️ هذه القيمة موجودة بالفعل" : "⚠️ This value already exists");
      return false;
    }
    if (type === "colors") {
      if (!imageUrl || !imageUrl.trim()) {
        toast.error(lang === "ar" ? "⚠️ الرجاء رفع صورة للون" : "⚠️ Please upload an image for the color");
        return false;
      }
      const newColorImages = { ...colorImages, [val]: imageUrl };
      setColorImages(newColorImages);
      const newColors = [...value.colors || [], val];
      if (onColorsWithImagesChange) {
        const colorData = newColors.map((name) => ({
          name,
          image: newColorImages[name] || ""
        }));
        onColorsWithImagesChange(colorData);
      }
    }
    const newValueArray = [...value[type] || [], val];
    onChange({
      ...value,
      [type]: newValueArray
    });
    setNewValue("");
    setTempColorImage("");
    toast.success(lang === "ar" ? `✅ تم إضافة "${val}"` : `✅ Added "${val}"`);
    return true;
  };
  const removeOption = (type, option) => {
    console.log(`🗑️ [removeOption] Removing "${option}" from "${type}"`);
    const newValues = value[type]?.filter((v) => v !== option) || [];
    onChange({
      ...value,
      [type]: newValues
    });
    if (type === "colors") {
      const newImages = { ...colorImages };
      delete newImages[option];
      setColorImages(newImages);
      notifyColorsChange(newValues, newImages);
    }
    isDeletingRef.current = false;
    toast.info(lang === "ar" ? `🗑️ تم حذف "${option}"` : `🗑️ Deleted "${option}"`);
  };
  const removeAll = (type) => {
    console.log(`🗑️ [removeAll] Removing all from "${type}"`);
    onChange({
      ...value,
      [type]: []
    });
    if (type === "colors") {
      setColorImages({});
      notifyColorsChange([], {});
    }
    isDeletingRef.current = false;
    toast.info(lang === "ar" ? "🗑️ تم حذف الكل" : "🗑️ Deleted all");
  };
  const toggleVariationAvailability = (variationId) => {
    const updated = localVariations.map(
      (v) => v.id === variationId ? { ...v, is_available: !v.is_available } : v
    );
    setLocalVariations(updated);
    if (onVariationsChange) {
      onVariationsChange(updated);
    }
  };
  const removeVariation = (variationId) => {
    const updated = localVariations.filter((v) => v.id !== variationId);
    setLocalVariations(updated);
    if (onVariationsChange) {
      onVariationsChange(updated);
    }
    toast.success(lang === "ar" ? "✅ تم حذف التركيبة" : "✅ Variation deleted");
  };
  const totalOptions = Object.values(value).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  const availableVariations = localVariations.filter((v) => v.is_available).length;
  const unavailableVariations = localVariations.filter((v) => !v.is_available).length;
  const newVariationsCount = localVariations.filter((v) => v.is_new).length;
  const colorList = (value.colors || []).map((name) => ({
    name,
    image: colorImages[name] || ""
  }));
  const filteredTypes = OPTION_TYPES.filter(
    (type) => type.label.includes(searchTerm) || type.id.includes(searchTerm) || type.emoji.includes(searchTerm)
  );
  if (OPTION_TYPES.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-6 w-6 text-[#2a655f]/50" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-700 dark:text-slate-300", children: lang === "ar" ? "لا توجد خيارات متاحة لهذا التصنيف" : "No options available for this category" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: lang === "ar" ? "اختر تصنيفاً رئيسياً من قسم الأساسيات لعرض الخيارات المتاحة" : "Select a main category from Basic section to show available options" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] flex items-center justify-center text-white shadow-md shadow-[#2a655f]/20 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-slate-900 dark:text-white truncate", children: lang === "ar" ? "خيارات المنتج" : "Product Options" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground flex items-center gap-1.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang === "ar" ? `${totalOptions} خيار` : `${totalOptions} options` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] dark:text-[#3a8a82] font-medium", children: lang === "ar" ? `${OPTION_TYPES.length} نوع متاح` : `${OPTION_TYPES.length} types available` }),
            localVariations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-muted-foreground/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 dark:text-emerald-400", children: [
                "✅ ",
                availableVariations,
                " / ",
                localVariations.length,
                " ",
                lang === "ar" ? "تركيبة" : "variations"
              ] })
            ] }),
            newVariationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-muted-foreground/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500 text-white border-0 text-[10px] animate-pulse", children: [
                "🆕 ",
                newVariationsCount,
                " ",
                lang === "ar" ? "جديد" : "new"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 shrink-0 self-start sm:self-auto", children: !readOnly && localVariations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        showRestoreButton && deletedVariationsBackup.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30 transition-all duration-300 hover:scale-105 h-8 px-3 text-xs",
            onClick: restoreVariations,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 mr-1" }),
              lang === "ar" ? "استعادة" : "Restore"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200/50 dark:border-red-800/30 transition-all duration-300 hover:scale-105 h-8 px-3 text-xs",
            onClick: removeAllVariations,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1" }),
              lang === "ar" ? "حذف الكل" : "Delete All"
            ]
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          placeholder: lang === "ar" ? "🔍 ابحث عن خيار..." : "🔍 Search for an option...",
          className: "w-full h-10 sm:h-11 px-4 rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 text-xs sm:text-sm hover:border-[#2a655f]/30"
        }
      ),
      searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setSearchTerm(""),
          className: "absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-[#2a655f] transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2", children: filteredTypes.map((type) => {
      const count = value[type.id]?.length || 0;
      type.icon;
      const isActive = activeType === type.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => !readOnly && setActiveType(type.id),
          className: cn(
            "relative flex flex-row items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-2 sm:py-2.5 rounded-lg border-2 transition-all duration-300 group min-w-0",
            isActive && !readOnly ? "border-[#2a655f] bg-[#2a655f]/10 dark:bg-[#2a655f]/20 shadow-md shadow-[#2a655f]/20" : "border-slate-200/50 dark:border-slate-800/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10",
            readOnly && "cursor-default opacity-75"
          ),
          children: [
            type.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -end-1 text-red-500 text-[10px] font-bold bg-white dark:bg-slate-900 rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-sm z-10", children: "*" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm sm:text-base group-hover:scale-110 transition-transform duration-300 flex-shrink-0", children: type.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] sm:text-xs font-medium group-hover:text-[#2a655f] transition-colors truncate", children: type.label }),
            count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f] text-white border-0 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-3.5 sm:h-4 min-w-3.5 sm:min-w-4 flex items-center justify-center shrink-0", children: count })
          ]
        },
        type.id
      );
    }) }),
    activeType && !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-3 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base", children: OPTION_TYPES.find((t) => t.id === activeType)?.emoji }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-[#2a655f] dark:text-[#3a8a82]", children: OPTION_TYPES.find((t) => t.id === activeType)?.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-[#2a655f]/30 text-[#2a655f]", children: value[activeType]?.length || 0 }),
          OPTION_TYPES.find((t) => t.id === activeType)?.required && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[10px] bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30 animate-pulse", children: [
            "⚠️ ",
            lang === "ar" ? "مطلوب" : "Required"
          ] }),
          activeType === "colors" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[10px] bg-red-100 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/30 animate-pulse", children: [
            "📸 ",
            lang === "ar" ? "صورة مطلوبة" : "Image required"
          ] })
        ] }),
        value[activeType]?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "text-xs text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 h-7 px-2 rounded-lg transition-all duration-300 hover:scale-105 self-start sm:self-auto",
            onClick: () => removeAll(activeType),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 mr-1" }),
              lang === "ar" ? "حذف الكل" : "Delete all"
            ]
          }
        )
      ] }),
      activeType === "colors" && colorList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: colorList.map(({ name, image }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200/50 group hover:border-[#2a655f]/30 transition-all duration-300", children: [
        image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: image, alt: name, className: "w-6 h-6 rounded object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded bg-red-200 flex items-center justify-center text-[8px] text-red-600", children: "⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => removeOption(activeType, name),
            className: "text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 hover:scale-110",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
          }
        )
      ] }, name)) }),
      activeType !== "colors" && value[activeType]?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: value[activeType].map((val) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 text-sm group hover:border-[#2a655f]/30 transition-all duration-300", children: [
        val,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => removeOption(activeType, val),
            className: "ml-2 text-muted-foreground hover:text-red-500 transition-colors hover:scale-110",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
          }
        )
      ] }, val)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: newValue,
            onChange: (e) => setNewValue(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                if (activeType === "colors") {
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
            },
            placeholder: lang === "ar" ? `أضف ${OPTION_TYPES.find((t) => t.id === activeType)?.label || ""}...` : `Add ${OPTION_TYPES.find((t) => t.id === activeType)?.id || ""}...`,
            className: "h-10 sm:h-11 text-xs sm:text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          activeType === "colors" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ImageInput,
              {
                value: tempColorImage,
                onChange: (url) => {
                  setTempColorImage(url);
                },
                userId,
                folder: "product-colors",
                lang,
                label: "",
                previewClassName: "h-10 sm:h-11 w-12 sm:w-14 rounded-lg object-cover border-2 border-[#2a655f]/20 hover:border-[#2a655f]/40 transition-all",
                showLabel: false
              }
            ),
            !tempColorImage && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "absolute -bottom-5 left-0 text-[10px] text-red-500 whitespace-nowrap", children: lang === "ar" ? "صورة مطلوبة" : "Image required" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              onClick: () => {
                if (activeType === "colors") {
                  if (!tempColorImage || !tempColorImage.trim()) {
                    toast.error(lang === "ar" ? "⚠️ الرجاء رفع صورة للون" : "⚠️ Please upload color image");
                    return;
                  }
                  const success = addOption(activeType, tempColorImage);
                  if (success) setTempColorImage("");
                } else {
                  addOption(activeType);
                }
              },
              className: "h-10 sm:h-11 px-4 sm:px-5 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-md shadow-[#2a655f]/20 hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 text-xs sm:text-sm shrink-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 me-1 sm:me-1.5" }),
                lang === "ar" ? "إضافة" : "Add"
              ]
            }
          )
        ] })
      ] }),
      value[activeType]?.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 flex items-center gap-1 animate-pulse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3 text-[#2a655f]" }),
        lang === "ar" ? `💡 اكتب قيمة ثم اضغط "إضافة" لإضافة ${OPTION_TYPES.find((t) => t.id === activeType)?.label}` : `💡 Enter a value then click "Add" to add ${OPTION_TYPES.find((t) => t.id === activeType)?.id}`
      ] })
    ] }),
    !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      Object.keys(value).filter((key) => value[key] && value[key].length > 0).length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-emerald-500 animate-pulse" }),
        lang === "ar" ? `✅ يتم توليد التركيبات تلقائياً عند إضافة أو حذف الخيارات` : `✅ Variations are generated automatically when adding or removing options`
      ] }) }),
      Object.keys(value).filter((key) => value[key] && value[key].length > 0).length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: generateVariations,
          className: "flex-1 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-md shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] group h-11 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-700" }),
            lang === "ar" ? "🔄 توليد التركيبات يدوياً" : "🔄 Generate Variations Manually"
          ]
        }
      ) }),
      Object.keys(value).filter((key) => value[key] && value[key].length > 0).length < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border-2 border-yellow-200/50 dark:border-yellow-800/30 bg-yellow-50/50 dark:bg-yellow-950/20 p-3 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        lang === "ar" ? "💡 أضف خيارين على الأقل (مثل: ألوان + مقاسات) لتوليد التركيبات تلقائياً" : "💡 Add at least 2 options (e.g., Colors + Sizes) to generate variations automatically"
      ] }) }),
      localVariations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-3 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-[#2a655f] dark:text-[#3a8a82]", children: lang === "ar" ? "📊 التركيبات" : "📊 Variations" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30", children: [
              "✅ ",
              availableVariations,
              " ",
              lang === "ar" ? "متوفرة" : "available"
            ] }),
            unavailableVariations > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800/30", children: [
              "❌ ",
              unavailableVariations,
              " ",
              lang === "ar" ? "غير متوفرة" : "unavailable"
            ] }),
            newVariationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500 text-white border-0 text-[10px] animate-pulse", children: [
              "🆕 ",
              newVariationsCount,
              " ",
              lang === "ar" ? "جديد" : "new"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 self-start sm:self-auto", children: [
            showRestoreButton && deletedVariationsBackup.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-xs text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 h-7 px-2 rounded-lg transition-all duration-300 hover:scale-105",
                onClick: restoreVariations,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3 mr-1" }),
                  lang === "ar" ? "استعادة" : "Restore"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-xs text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/20 h-7 px-2 rounded-lg transition-all duration-300 hover:scale-105",
                onClick: removeAllVariations,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3 mr-1" }),
                  lang === "ar" ? "حذف الكل" : "Delete All"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 max-h-[300px] sm:max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2a655f]/30 scrollbar-track-transparent pe-1", children: localVariations.map((variation) => {
          const isAvailable = variation.is_available;
          const comboKeys = Object.keys(variation.combination);
          const isNew = variation.is_new;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex flex-col p-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer group",
                isAvailable ? "border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-500" : "border-red-500/30 bg-red-50/30 dark:bg-red-950/10 opacity-60 hover:border-red-500",
                isNew && "border-yellow-400/70 bg-yellow-50/50 dark:bg-yellow-950/20 animate-pulse"
              ),
              onClick: () => toggleVariationAvailability(variation.id),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                    isAvailable ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-red-500 shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1", children: comboKeys.map((key, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
                      idx > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 mx-0.5", children: "•" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: variation.combination[key] })
                    ] }, key)) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
                    isNew && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "mr-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0 animate-pulse", children: lang === "ar" ? "جديد" : "NEW" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-medium mr-1 ${isAvailable ? "text-emerald-600" : "text-red-500"}`, children: isAvailable ? "✅" : "❌" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.stopPropagation();
                          removeVariation(variation.id);
                        },
                        className: "text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 hover:scale-110",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5 mt-1.5 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap shrink-0", children: [
                        isOffer ? lang === "ar" ? "💰 جديد:" : "💰 New:" : lang === "ar" ? "💰 السعر:" : "💰 Price:",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          min: "1",
                          step: "1",
                          value: variation.price !== void 0 && variation.price !== null && variation.price > 0 ? variation.price : "",
                          onChange: (e) => {
                            const val = e.target.value;
                            const newPrice = val === "" ? 0 : Number(val);
                            const updated = localVariations.map(
                              (v) => v.id === variation.id ? { ...v, price: newPrice, is_new: false } : v
                            );
                            setLocalVariations(updated);
                            if (onVariationsChange) {
                              onVariationsChange(updated);
                            }
                          },
                          onMouseDown: (e) => e.stopPropagation(),
                          onKeyDown: (e) => e.stopPropagation(),
                          onClick: (e) => e.stopPropagation(),
                          className: cn(
                            "h-7 sm:h-8 text-[11px] sm:text-xs rounded-lg border-2 w-full min-w-[60px] px-1.5 transition-all duration-300",
                            (!variation.price || variation.price <= 0) && isNew ? "border-red-500 dark:border-red-500 bg-red-50/50 dark:bg-red-950/20 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" : !variation.price || variation.price <= 0 ? "border-red-300 dark:border-red-800 focus:border-red-500" : "border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]"
                          ),
                          placeholder: lang === "ar" ? "مطلوب" : "Required"
                        }
                      )
                    ] }),
                    variation.price && variation.price > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] sm:text-[10px] font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap shrink-0", children: [
                      variation.price,
                      " ل.س"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] sm:text-[10px] font-medium text-red-500 animate-pulse whitespace-nowrap shrink-0", children: lang === "ar" ? "⛔ مطلوب" : "⛔ Required" })
                  ] }),
                  isOffer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] sm:text-[10px] text-muted-foreground whitespace-nowrap line-through shrink-0", children: lang === "ar" ? "📌 قديم:" : "📌 Old:" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          min: "0",
                          step: "1",
                          value: variation.old_price !== void 0 && variation.old_price !== null && variation.old_price > 0 ? variation.old_price : "",
                          onChange: (e) => {
                            const val = e.target.value;
                            const oldPrice = val === "" ? 0 : Number(val);
                            const updated = localVariations.map(
                              (v) => v.id === variation.id ? { ...v, old_price: oldPrice } : v
                            );
                            setLocalVariations(updated);
                            if (onVariationsChange) {
                              onVariationsChange(updated);
                            }
                          },
                          onMouseDown: (e) => e.stopPropagation(),
                          onKeyDown: (e) => e.stopPropagation(),
                          onClick: (e) => e.stopPropagation(),
                          className: "h-7 sm:h-8 text-[11px] sm:text-xs rounded-lg border-2 w-full min-w-[60px] px-1.5 transition-all duration-300 border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]",
                          placeholder: lang === "ar" ? "اختياري" : "Optional"
                        }
                      )
                    ] }),
                    variation.old_price && variation.old_price > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] sm:text-[10px] font-medium text-red-400 line-through whitespace-nowrap shrink-0", children: [
                      variation.old_price,
                      " ل.س"
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] sm:text-[10px] font-medium text-muted-foreground/50 whitespace-nowrap shrink-0", children: lang === "ar" ? "—" : "—" })
                  ] })
                ] })
              ]
            },
            variation.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-emerald-500" }),
            lang === "ar" ? "متوفر" : "Available"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 text-red-500" }),
            lang === "ar" ? "غير متوفر" : "Not available"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "💡" }),
            lang === "ar" ? "اضغط لتغيير الحالة" : "Click to toggle"
          ] }),
          newVariationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-yellow-600 dark:text-yellow-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "🆕" }),
            lang === "ar" ? "أصفر = جديد" : "Yellow = new"
          ] })
        ] })
      ] })
    ] }),
    totalOptions > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-gradient-to-r from-[#2a655f]/10 to-[#2a655f]/5 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-2.5 sm:p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs sm:text-sm text-[#2a655f] dark:text-[#3a8a82] min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 animate-pulse shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate", children: [
          lang === "ar" ? "✅ تم إضافة " : "✅ Added ",
          Object.entries(value).filter(([_, values]) => values && values.length > 0).map(([type, values]) => {
            const typeInfo = OPTION_TYPES.find((t) => t.id === type);
            return `${values.length} ${typeInfo?.label || type}`;
          }).join(", ")
        ] })
      ] }),
      localVariations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f] text-white border-0 self-start sm:self-auto shrink-0", children: [
        localVariations.length,
        " ",
        lang === "ar" ? "تركيبة" : "variations",
        newVariationsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-yellow-300", children: [
          "🆕",
          newVariationsCount
        ] })
      ] })
    ] })
  ] });
}
const DEFAULT_COLORS = {
  "أحمر": "#FF0000",
  "احمر": "#FF0000",
  "قرمزي": "#DC143C",
  "كرزي": "#DE3163",
  "مرجاني": "#FF7F50",
  "أزرق": "#0000FF",
  "ازرق": "#0000FF",
  "كحلي": "#000080",
  "فيروزي": "#40E0D0",
  "تركواز": "#40E0D0",
  "سماوي": "#00BFFF",
  "أخضر": "#00FF00",
  "اخضر": "#00FF00",
  "زمردي": "#50C878",
  "نعناعي": "#98FF98",
  "زيتوني": "#808000",
  "أسود": "#000000",
  "اسود": "#000000",
  "أبيض": "#FFFFFF",
  "ابيض": "#FFFFFF",
  "عاجي": "#FFFFF0",
  "لؤلؤي": "#F5F5F5",
  "بني": "#8B4513",
  "قهوي": "#6F4E37",
  "شوكولاتة": "#7B3F00",
  "بيج": "#F5F5DC",
  "كاكي": "#C3B091",
  "نحاسي": "#B87333",
  "ذهبي": "#FFD700",
  "فضي": "#C0C0C0",
  "برونزي": "#CD7F32",
  "أصفر": "#FFFF00",
  "اصفر": "#FFFF00",
  "ليموني": "#FFF44F",
  "برتقالي": "#FF8C00",
  "خوخي": "#FFDAB9",
  "عنبري": "#FFBF00",
  "وردي": "#FF69B4",
  "زهر": "#FF69B4",
  "زهري": "#FFB6C1",
  "فوشي": "#FF00FF",
  "بنفسجي": "#8B008B",
  "أرجواني": "#800080",
  "موف": "#C8A2C8",
  "لافندر": "#E6E6FA",
  "رمادي": "#808080",
  "رمادي غامق": "#404040",
  "رمادي فاتح": "#D3D3D3",
  "بشري": "#F5D0B8",
  "خردلي": "#DAA520",
  "خمري": "#722F37",
  "نبيتي": "#722F37",
  "عنابي": "#800000",
  "مينت": "#98FF98",
  "بيبي بينك": "#F4C2C2",
  "نود": "#E8D5B7",
  "رملي": "#D7C4A1",
  "عسلي": "#C68E5E",
  "كريمي": "#FFFDD0",
  "ثلجي": "#FFFAFA",
  "أوف وايت": "#F8F8FF",
  "ترابي": "#C4A882",
  "قمحي": "#F5DEB3",
  "حنطي": "#D4A574",
  "سكري": "#FDF5E6"
};
const emptyForm = {
  title_ar: "",
  description_ar: "",
  price: 0,
  old_price: 0,
  is_offer: false,
  is_available: true,
  payment_method: "cash",
  kind: "product",
  category_id: "",
  parent_category_id: "",
  governorate_id: "",
  cover_url: "",
  image_urls: [""]
};
const TAB_ORDER = ["basic", "pricing", "images", "options"];
function ProductFormDialog({
  open,
  onOpenChange,
  product,
  productType,
  onSave,
  isSaving,
  lang
}) {
  const app = useApp();
  useT();
  const isRTL = app.lang === "ar";
  const { data: cats = [] } = useCategories();
  const { data: govs = [] } = useGovernorates();
  const isLoadingRef = reactExports.useRef(false);
  const [form, setForm] = reactExports.useState(emptyForm);
  const [options, setOptions] = reactExports.useState({});
  const [variations, setVariations] = reactExports.useState([]);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [tempColors, setTempColors] = reactExports.useState([]);
  const [sizes, setSizes] = reactExports.useState([]);
  const [colorWithImages, setColorWithImages] = reactExports.useState([]);
  const [parentCategoryId, setParentCategoryId] = reactExports.useState("");
  const [subCategoryId, setSubCategoryId] = reactExports.useState("");
  const [parentCategorySearch, setParentCategorySearch] = reactExports.useState("");
  const [subCategorySearch, setSubCategorySearch] = reactExports.useState("");
  const [isParentCategoryOpen, setIsParentCategoryOpen] = reactExports.useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = reactExports.useState(false);
  const [governorateSearch, setGovernorateSearch] = reactExports.useState("");
  const [isGovernorateOpen, setIsGovernorateOpen] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("basic");
  const isFirstLoadRef = reactExports.useRef(true);
  const isPriceEditingRef = reactExports.useRef(false);
  const {
    data: categoryOptions = [],
    isLoading: isLoadingCategoryOptions
  } = useCategoryOptions(parentCategoryId || null);
  const availableOptions = reactExports.useMemo(() => {
    return categoryOptions.map((opt) => ({
      key: opt.option_key,
      name_ar: opt.option_name_ar,
      name_en: opt.option_name_en,
      type: opt.option_type,
      required: opt.is_required,
      sort_order: opt.sort_order
    }));
  }, [categoryOptions]);
  const mainCategories = reactExports.useMemo(() => {
    return cats.filter(
      (c) => !c.parent_id && c.active !== false
    );
  }, [cats]);
  const subCategories = reactExports.useMemo(() => {
    if (!parentCategoryId) return [];
    return cats.filter(
      (c) => c.parent_id === parentCategoryId && c.active !== false
    );
  }, [cats, parentCategoryId]);
  const hasSubCategories = subCategories.length > 0;
  const filteredMainCategories = reactExports.useMemo(() => {
    if (!parentCategorySearch.trim()) return mainCategories;
    const search = parentCategorySearch.toLowerCase().trim();
    return mainCategories.filter((c) => {
      const nameAr = (c.name_ar || "").toLowerCase();
      const nameEn = (c.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search);
    });
  }, [mainCategories, parentCategorySearch]);
  const filteredSubCategories = reactExports.useMemo(() => {
    if (!subCategorySearch.trim()) return subCategories;
    const search = subCategorySearch.toLowerCase().trim();
    return subCategories.filter((c) => {
      const nameAr = (c.name_ar || "").toLowerCase();
      const nameEn = (c.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search);
    });
  }, [subCategories, subCategorySearch]);
  const getCategoryName = reactExports.useCallback((categoryId) => {
    if (!categoryId) return "";
    const cat = cats.find((c) => c.id === categoryId);
    return cat ? app.lang === "ar" ? cat.name_ar : cat.name_en : "";
  }, [cats, app.lang]);
  const getGovernorateName = (governorateId) => {
    if (!governorateId) return "";
    const gov = govs.find((g) => g.id === governorateId);
    return gov ? app.lang === "ar" ? gov.name_ar : gov.name_en : "";
  };
  const filteredGovernorates = reactExports.useMemo(() => {
    if (!governorateSearch.trim()) return govs;
    const search = governorateSearch.toLowerCase().trim();
    return govs.filter((g) => {
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
        bgGradient: "from-[#1a4f4a]/5 to-[#1a4f4a]/10 dark:from-[#1a4f4a]/20 dark:to-[#1a4f4a]/10"
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
      bgGradient: "from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10"
    };
  };
  const labels = getProductLabels();
  const isTabValid = (tab) => {
    if (tab === "basic") {
      return !!form.title_ar.trim() && !!parentCategoryId && !!form.governorate_id;
    }
    if (tab === "pricing") {
      if (!form.price || form.price <= 0) return false;
      if (productType === "offer") {
        if (!form.old_price || form.old_price <= form.price) return false;
        if (form.old_price < 0) return false;
      }
      return true;
    }
    if (tab === "images") {
      return !!form.cover_url?.trim();
    }
    if (tab === "options") {
      if (variations.length > 0) {
        const variationsWithoutPrice = variations.filter((v) => !v.price || v.price <= 0);
        if (variationsWithoutPrice.length > 0) {
          return false;
        }
      }
      return true;
    }
    return true;
  };
  const goToNextTab = () => {
    const currentIndex2 = TAB_ORDER.indexOf(activeTab);
    if (currentIndex2 < TAB_ORDER.length - 1) {
      if (!isTabValid(activeTab)) {
        if (activeTab === "options") {
          const variationsWithoutPrice = variations.filter((v) => !v.price || v.price <= 0);
          if (variationsWithoutPrice.length > 0) {
            toast.error(
              lang === "ar" ? `⚠️ هناك ${variationsWithoutPrice.length} تركيبة بدون سعر، الرجاء تحديد السعر لكل تركيبة` : `⚠️ ${variationsWithoutPrice.length} variations have no price, please set price for each variation`
            );
            return;
          }
        }
        toast.warning(
          lang === "ar" ? "⚠️ يرجى إكمال البيانات المطلوبة في هذا القسم أولاً" : "⚠️ Please complete the required fields in this section first"
        );
        return;
      }
      setActiveTab(TAB_ORDER[currentIndex2 + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goToPrevTab = () => {
    const currentIndex2 = TAB_ORDER.indexOf(activeTab);
    if (currentIndex2 > 0) {
      setActiveTab(TAB_ORDER[currentIndex2 - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  reactExports.useMemo(() => {
    if (!product || !product.variations || product.variations.length === 0) {
      return [];
    }
    return product.variations.map((v) => {
      const price = v.price !== void 0 && v.price !== null && v.price > 0 ? v.price : form.price || 0;
      return {
        ...v,
        price,
        is_available: v.is_available !== void 0 ? v.is_available : true
      };
    });
  }, [product?.variations, form.price]);
  reactExports.useEffect(() => {
    if (isLoadingRef.current) {
      return;
    }
    if (isPriceEditingRef.current) {
      return;
    }
    if (!open) {
      isLoadingRef.current = false;
      return;
    }
    isLoadingRef.current = true;
    if (product) {
      const availableValue = product.is_available !== void 0 ? product.is_available : true;
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
        parent_category_id: product.parent_category_id || "",
        governorate_id: product.governorate_id || "",
        cover_url: product.cover_url || "",
        image_urls: product.image_urls || [""]
      });
      if (cats.length > 0) {
        if (product.parent_category_id) {
          setParentCategoryId(product.parent_category_id);
          setParentCategorySearch(getCategoryName(product.parent_category_id));
          if (product.category_id && product.category_id !== product.parent_category_id) {
            setSubCategoryId(product.category_id);
            setSubCategorySearch(getCategoryName(product.category_id));
          } else {
            setSubCategoryId("");
            setSubCategorySearch("");
          }
        } else if (product.category_id) {
          const cat = cats.find((c) => c.id === product.category_id);
          if (cat) {
            if (cat.parent_id) {
              setParentCategoryId(cat.parent_id);
              setParentCategorySearch(getCategoryName(cat.parent_id));
              setSubCategoryId(product.category_id);
              setSubCategorySearch(getCategoryName(product.category_id));
            } else {
              setParentCategoryId(product.category_id);
              setParentCategorySearch(getCategoryName(product.category_id));
              setSubCategoryId("");
              setSubCategorySearch("");
            }
          }
        }
      }
      if (product.governorate_id && govs.length > 0) {
        setGovernorateSearch(getGovernorateName(product.governorate_id));
      }
      const productMetadata = product.metadata || {};
      const productOptions = productMetadata.options || product.options || [];
      const productColors = productMetadata.colors || product.colors || [];
      const typeMap = {
        "color": "colors",
        "size": "sizes",
        "model": "models",
        "material": "materials",
        "style": "style",
        "brand": "brand"
      };
      const optionsGrouped = {};
      productOptions.forEach((opt) => {
        const originalType = opt.option_type || opt.key;
        const mappedType = typeMap[originalType] || originalType;
        if (mappedType) {
          if (!optionsGrouped[mappedType]) optionsGrouped[mappedType] = [];
          optionsGrouped[mappedType].push(opt.option_value || opt.value);
        }
      });
      setOptions(optionsGrouped);
      if (productColors.length > 0) {
        const mappedColors = productColors.map((c) => ({
          id: c.id,
          color_name_ar: c.color_name_ar || c.color_name_en || "لون",
          color_name_en: c.color_name_en || c.color_name_ar || "Color",
          color_hex: c.color_hex || null,
          image_url: c.image_url || "",
          sort_order: c.sort_order || 0
        }));
        setTempColors(mappedColors);
        setColorWithImages(mappedColors.map((c) => ({
          name: c.color_name_ar,
          image: c.image_url,
          hex: c.color_hex
        })));
      } else {
        setTempColors([]);
        setColorWithImages([]);
      }
      if (optionsGrouped.sizes && optionsGrouped.sizes.length > 0) {
        setSizes(optionsGrouped.sizes);
      } else {
        setSizes([]);
      }
      const productVariations = productMetadata.variations || product.variations || [];
      if (productVariations && productVariations.length > 0) {
        const mappedVariations = productVariations.map((v) => ({
          id: v.id,
          combination: v.combination || {},
          is_available: v.is_available !== void 0 ? v.is_available : v.is_active !== false,
          price: v.price || 0,
          old_price: v.old_price || null,
          sku: v.sku || "",
          stock_quantity: v.stock_quantity || 0,
          color_id: v.color_id || null,
          image_url: v.image_url || null
        }));
        setVariations(mappedVariations);
      } else {
        setVariations([]);
      }
    } else {
      setForm({
        ...emptyForm,
        is_offer: productType === "offer"
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
    }
    setActiveTab("basic");
    isFirstLoadRef.current = true;
    setTimeout(() => {
      isLoadingRef.current = false;
    }, 500);
  }, [product, productType, open, cats, govs, getCategoryName]);
  const externalColorImages = reactExports.useMemo(() => {
    return Object.fromEntries(
      tempColors.map((c) => [c.color_name_ar, c.image_url])
    );
  }, [tempColors]);
  const handlePriceChange = (value, field) => {
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
      const colorsWithoutImage = tempColors.filter((c) => !c.image_url?.trim());
      if (colorsWithoutImage.length > 0) return false;
    }
    if (variations.length > 0) {
      const variationsWithoutPrice = variations.filter((v) => !v.price || v.price <= 0);
      if (variationsWithoutPrice.length > 0) return false;
    }
    return true;
  };
  const validateAndSubmit = async () => {
    if (!form.title_ar.trim()) {
      toast.error(
        app.lang === "ar" ? `الرجاء إدخال ${productType === "offer" ? "اسم العرض" : "اسم المنتج"}` : `Please enter ${productType === "offer" ? "offer name" : "product name"}`
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
      const colorsWithoutImage = tempColors.filter((c) => {
        if (c.id?.startsWith("temp-") && !c.image_url?.trim()) {
          return true;
        }
        if (c.id && !c.id.startsWith("temp-")) {
          return false;
        }
        return !c.image_url?.trim();
      });
      if (colorsWithoutImage.length > 0) {
        const colorNames = colorsWithoutImage.map((c) => c.color_name_ar).join(", ");
        toast.error(
          app.lang === "ar" ? `⚠️ الألوان التالية بدون صورة: ${colorNames}` : `⚠️ The following colors have no image: ${colorNames}`
        );
        setActiveTab("options");
        return;
      }
    }
    const activeOptionsCount = Object.values(options).filter((arr) => arr.length > 0).length;
    if (activeOptionsCount >= 2) {
      if (variations.length === 0) {
        setActiveTab("options");
        toast.error(
          app.lang === "ar" ? "⚠️ لديك خيارين أو أكثر ولكن لم تقم بتوليد التركيبات!" : "⚠️ You have 2 or more options but haven't generated variations!"
        );
        return;
      }
    }
    if (variations.length > 0) {
      const variationsWithoutPrice = variations.filter((v) => {
        return v.price === void 0 || v.price === null || v.price <= 0;
      });
      if (variationsWithoutPrice.length > 0) {
        const variationNames = variationsWithoutPrice.map((v) => {
          return Object.values(v.combination || {}).join(" • ");
        }).join(", ");
        toast.error(
          app.lang === "ar" ? `⚠️ هناك ${variationsWithoutPrice.length} تركيبة بدون سعر:
${variationNames}` : `⚠️ ${variationsWithoutPrice.length} variations have no price:
${variationNames}`
        );
        setActiveTab("options");
        return;
      }
    }
    setIsSubmitting(true);
    try {
      const finalSizes = options.sizes || [];
      const finalCategoryId = subCategoryId || parentCategoryId;
      const allData = {
        ...form,
        // ✅ التصنيفات
        parent_category_id: parentCategoryId,
        category_id: finalCategoryId,
        // ✅ الخيارات
        options: {
          ...options,
          colors: tempColors.map((c) => c.color_name_ar),
          sizes: finalSizes
        },
        variations: variations.map((v) => ({
          ...v,
          price: v.price || form.price,
          old_price: v.old_price || form.old_price || null
        })),
        colors: tempColors,
        image_urls: form.image_urls
      };
      await onSave(allData);
    } catch (error) {
      console.error("❌ Error saving:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleColorsWithImagesChange = (colors) => {
    setColorWithImages(colors);
    const newTempColors = colors.map((c, index) => ({
      id: `temp-${Date.now()}-${index}`,
      color_name_ar: c.name,
      color_name_en: c.name,
      color_hex: c.hex || DEFAULT_COLORS[c.name] || "#CCCCCC",
      image_url: c.image,
      sort_order: index
    }));
    setTempColors(newTempColors);
    setOptions((prev) => ({
      ...prev,
      colors: colors.map((c) => c.name)
    }));
  };
  const handleSizesUpdate = (newSizes) => {
    setSizes(newSizes);
    setOptions((prev) => ({
      ...prev,
      sizes: newSizes
    }));
  };
  const handleParentCategorySelect = (cat) => {
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
    setForm((prev) => ({
      ...prev,
      parent_category_id: cat.id,
      category_id: cat.id
      // مؤقتاً الرئيسي
    }));
  };
  const handleSubCategorySelect = (cat) => {
    setSubCategoryId(cat.id);
    setSubCategorySearch(lang === "ar" ? cat.name_ar : cat.name_en);
    setIsSubCategoryOpen(false);
    setForm((prev) => ({
      ...prev,
      category_id: cat.id
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
    setForm((prev) => ({
      ...prev,
      parent_category_id: "",
      category_id: ""
    }));
  };
  const clearSubCategory = () => {
    setSubCategoryId("");
    setSubCategorySearch("");
    setForm((prev) => ({
      ...prev,
      category_id: parentCategoryId
    }));
  };
  const getProductIcon = () => {
    if (productType === "offer") return /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-[#1a4f4a]" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5 text-[#2a655f]" });
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
  const getTabLabel = (tab) => {
    const labels2 = {
      basic: lang === "ar" ? "أساسيات" : "Basic",
      pricing: lang === "ar" ? "السعر" : "Pricing",
      images: lang === "ar" ? "الصور" : "Images",
      options: lang === "ar" ? "خيارات" : "Options"
    };
    return labels2[tab] || tab;
  };
  const getTabIcon = (tab) => {
    const icons = {
      basic: Info,
      pricing: Coins,
      images: Camera,
      options: Layers
    };
    return icons[tab] || Info;
  };
  const isLastTab = activeTab === TAB_ORDER[TAB_ORDER.length - 1];
  const isFirstTab = activeTab === TAB_ORDER[0];
  const currentIndex = TAB_ORDER.indexOf(activeTab);
  const goToTab = (tab) => {
    const targetIndex = TAB_ORDER.indexOf(tab);
    const currentIndex2 = TAB_ORDER.indexOf(activeTab);
    if (targetIndex > currentIndex2) {
      for (let i = currentIndex2; i < targetIndex; i++) {
        if (!isTabValid(TAB_ORDER[i])) {
          toast.warning(
            lang === "ar" ? `⚠️ يرجى إكمال قسم "${getTabLabel(TAB_ORDER[i])}" أولاً` : `⚠️ Please complete "${getTabLabel(TAB_ORDER[i])}" section first`
          );
          return;
        }
      }
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-5xl w-[94vw] max-h-[94vh] overflow-y-auto rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-[#2a655f]/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-50 bg-white dark:bg-slate-900 border-b-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 p-4 md:p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#2a655f] to-transparent animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-xl bg-[#2a655f]/20 blur-lg group-hover:blur-xl transition-all duration-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative p-2 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25 group-hover:shadow-[#2a655f]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", children: getProductIcon() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2", children: [
              getProductTitle(),
              productType === "offer" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white border-0 animate-pulse text-[10px]", children: "🔥 عرض" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-[#2a655f] animate-pulse" }),
              getProductSubtitle(),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#2a655f] font-medium", children: product ? lang === "ar" ? "تعديل" : "Edit" : lang === "ar" ? "جديد" : "New" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 rounded-full hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 hover:rotate-90 hover:scale-110",
            onClick: () => onOpenChange(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-[#2a655f]" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#2a655f]", children: getTabLabel(activeTab) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-[#2a655f]/60", children: [
            currentIndex + 1,
            " / ",
            TAB_ORDER.length
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: TAB_ORDER.map((tab, index) => {
          const isActive = activeTab === tab;
          const isCompleted = TAB_ORDER.indexOf(activeTab) > index;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "h-1 rounded-full transition-all duration-500 cursor-pointer",
                isActive ? "w-6 bg-[#2a655f] shadow-md shadow-[#2a655f]/30" : isCompleted ? "w-3 bg-[#2a655f]/60" : "w-3 bg-slate-200 dark:bg-slate-700"
              ),
              onClick: () => goToTab(tab)
            },
            tab
          );
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsList,
        {
          className: "grid grid-cols-4 gap-1.5 bg-[#e8f0ee]/50 dark:bg-[#2a655f]/20 p-1.5 rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 w-full h-auto",
          dir: lang === "ar" ? "rtl" : "ltr",
          children: TAB_ORDER.map((tab) => {
            const Icon = getTabIcon(tab);
            const isActive = activeTab === tab;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: tab,
                className: "w-full rounded-lg text-xs font-medium py-2 px-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-md data-[state=active]:shadow-[#2a655f]/20 data-[state=active]:border-2 data-[state=active]:border-[#2a655f]/40 transition-all duration-300 group flex flex-row items-center justify-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn(
                    "h-3.5 w-3.5 transition-all duration-300 flex-shrink-0",
                    isActive ? "text-[#2a655f] animate-pulse" : "text-muted-foreground group-hover:text-[#2a655f]"
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: getTabLabel(tab) })
                ]
              },
              tab
            );
          })
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 md:p-5 space-y-4", children: [
      activeTab === "basic" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-24 h-24 rounded-full bg-[#2a655f]/5 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-[#2a655f]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-[#2a655f]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]", children: lang === "ar" ? `📝 ${productType === "offer" ? "معلومات العرض" : "المعلومات الأساسية"}` : `📝 ${productType === "offer" ? "Offer Information" : "Basic Information"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: lang === "ar" ? `أدخل ${productType === "offer" ? "اسم العرض" : "اسم المنتج"} ووصفه واختر التصنيف والمحافظة المناسبة` : `Enter ${productType === "offer" ? "offer" : "product"} name, description and select appropriate category and governorate` })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
              labels.name,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 start-3 flex items-center", children: productType === "offer" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 text-[#2a655f]/60" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-[#2a655f]/60" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.title_ar,
                  onChange: (e) => setForm({ ...form, title_ar: e.target.value }),
                  placeholder: labels.placeholderName,
                  className: "ps-10 h-11 text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
              labels.description,
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] bg-slate-100 text-slate-600 border-slate-200", children: lang === "ar" ? "اختياري" : "Optional" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 3,
                value: form.description_ar,
                onChange: (e) => setForm({ ...form, description_ar: e.target.value }),
                placeholder: labels.placeholderDesc,
                className: "text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 resize-none hover:border-[#2a655f]/30"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📁" }),
                lang === "ar" ? "التصنيف الرئيسي" : "Main Category",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: parentCategorySearch,
                      onChange: (e) => setParentCategorySearch(e.target.value),
                      onFocus: () => setIsParentCategoryOpen(true),
                      placeholder: lang === "ar" ? "🔍 ابحث..." : "🔍 Search...",
                      className: "ps-10 h-11 text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                    }
                  ),
                  parentCategorySearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: clearParentCategory,
                      className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                isParentCategoryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-lg shadow-[#2a655f]/20", children: filteredMainCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-sm text-muted-foreground text-center", children: lang === "ar" ? "لا توجد نتائج" : "No results found" }) : filteredMainCategories.map((c) => {
                  const childCount = cats.filter((cat) => cat.parent_id === c.id && cat.active !== false).length;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: cn(
                        "w-full text-start px-3 py-2.5 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-2 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                        parentCategoryId === c.id && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30 text-[#2a655f]"
                      ),
                      onClick: () => handleParentCategorySelect(c),
                      children: [
                        parentCategoryId === c.id && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: lang === "ar" ? c.name_ar : c.name_en }),
                        childCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px]", children: [
                          childCount,
                          " ",
                          lang === "ar" ? "فرعي" : "sub"
                        ] })
                      ]
                    },
                    c.id
                  );
                }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📂" }),
                lang === "ar" ? "التصنيف الفرعي" : "Subcategory",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400", children: lang === "ar" ? "اختياري" : "Optional" })
              ] }),
              !parentCategoryId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-2 h-11 px-3 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-slate-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-500", children: lang === "ar" ? "اختر الرئيسي أولاً" : "Select main first" })
              ] }) : !hasSubCategories ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-2 h-11 px-3 rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-emerald-600 dark:text-emerald-400 font-medium", children: lang === "ar" ? "✅ سيتم استخدام الرئيسي" : "✅ Main will be used" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      value: subCategorySearch,
                      onChange: (e) => setSubCategorySearch(e.target.value),
                      onFocus: () => setIsSubCategoryOpen(true),
                      placeholder: lang === "ar" ? "🔍 ابحث عن الفرعي..." : "🔍 Search sub...",
                      className: "ps-10 h-11 text-sm rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/50"
                    }
                  ),
                  subCategorySearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: clearSubCategory,
                      className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                    }
                  )
                ] }),
                isSubCategoryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-lg shadow-[#2a655f]/20", children: filteredSubCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-sm text-muted-foreground text-center", children: lang === "ar" ? "لا توجد نتائج" : "No results found" }) : filteredSubCategories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: cn(
                      "w-full text-start px-3 py-2.5 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-2 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                      subCategoryId === c.id && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30 text-[#2a655f]"
                    ),
                    onClick: () => handleSubCategorySelect(c),
                    children: [
                      subCategoryId === c.id && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang === "ar" ? c.name_ar : c.name_en })
                    ]
                  },
                  c.id
                )) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
              lang === "ar" ? "المحافظة" : "Governorate",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: governorateSearch,
                    onChange: (e) => setGovernorateSearch(e.target.value),
                    onFocus: () => setIsGovernorateOpen(true),
                    placeholder: lang === "ar" ? "🔍 ابحث عن محافظة..." : "🔍 Search governorate...",
                    className: "ps-10 h-11 text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                  }
                ),
                governorateSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setGovernorateSearch(""),
                    className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                  }
                )
              ] }),
              isGovernorateOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-lg shadow-[#2a655f]/20", children: filteredGovernorates.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-sm text-muted-foreground text-center", children: lang === "ar" ? "لا توجد نتائج" : "No results found" }) : filteredGovernorates.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: cn(
                    "w-full text-start px-3 py-2.5 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-2 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                    form.governorate_id === g.id && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30 text-[#2a655f]"
                  ),
                  onClick: () => {
                    setForm({ ...form, governorate_id: g.id });
                    setGovernorateSearch(lang === "ar" ? g.name_ar : g.name_en);
                    setIsGovernorateOpen(false);
                  },
                  children: [
                    form.governorate_id === g.id && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lang === "ar" ? g.name_ar : g.name_en })
                  ]
                },
                g.id
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: lang === "ar" ? "حالة التوفر" : "Availability" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 p-3 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10 dark:to-transparent rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-3 text-sm cursor-pointer group", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: form.is_available === true,
                  onChange: (e) => {
                    const newValue = e.target.checked;
                    setForm((prev) => ({ ...prev, is_available: newValue }));
                  },
                  className: "h-5 w-5 rounded border-slate-300/50 accent-[#2a655f] cursor-pointer transition-all duration-300 group-hover:scale-110"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                  "font-semibold transition-all duration-300 text-sm",
                  form.is_available === true ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                ), children: form.is_available === true ? lang === "ar" ? "✅ متوفر للبيع" : "✅ Available for sale" : lang === "ar" ? "❌ غير متوفر" : "❌ Unavailable" }),
                form.is_available === true ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px] animate-pulse", children: lang === "ar" ? "نشط" : "Active" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-red-500 border-red-200 dark:border-red-800/30 text-[10px]", children: lang === "ar" ? "غير نشط" : "Inactive" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground group-hover:text-[#2a655f] transition-colors", children: form.is_available === true ? lang === "ar" ? "🟢 يمكن الشراء" : "🟢 Can purchase" : lang === "ar" ? "🔴 غير متاح" : "🔴 Not available" })
              ] })
            ] }) })
          ] })
        ] })
      ] }),
      activeTab === "pricing" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-24 h-24 rounded-full bg-[#2a655f]/5 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-[#2a655f]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-4 w-4 text-[#2a655f]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]", children: lang === "ar" ? `💰 ${productType === "offer" ? "تسعير العرض" : "تسعير المنتج"}` : `💰 ${productType === "offer" ? "Offer Pricing" : "Product Pricing"}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: lang === "ar" ? `حدد ${productType === "offer" ? "سعر العرض والسعر القديم" : "السعر المناسب للمنتج"}` : `Set ${productType === "offer" ? "offer price and old price" : "appropriate product price"}` })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            lang === "ar" ? `السعر (ل.س)` : `Price (SYP)`,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 start-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-[#2a655f]/60", children: "ل.س" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "0",
                value: form.price,
                onChange: (e) => handlePriceChange(e.target.value, "price"),
                placeholder: "0",
                className: "ps-12 h-11 text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
              }
            )
          ] })
        ] }) }),
        productType === "offer" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/30 dark:to-[#3a8a82]/10 rounded-lg border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-[#2a655f]/10 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 text-[#2a655f]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]", children: lang === "ar" ? "🛍️ هذا المنتج هو عرض خاص" : "🛍️ This product is a special offer" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-[#2a655f]/70 dark:text-[#3a8a82]/70", children: lang === "ar" ? "أدخل السعر القديم لعرض الخصم للعملاء" : "Enter the old price to show the discount to customers" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
              lang === "ar" ? "السعر القديم (ل.س)" : "Old Price (SYP)",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 start-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-[#2a655f]/60", children: "ل.س" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  value: form.old_price,
                  onChange: (e) => handlePriceChange(e.target.value, "old_price"),
                  placeholder: "0",
                  className: "ps-12 h-11 text-sm rounded-lg border-2 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/30"
                }
              )
            ] })
          ] }) }),
          form.old_price > form.price && form.old_price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-100/30 dark:from-emerald-950/30 dark:to-emerald-950/10 rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-5 duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#1a4f4a] to-[#2a655f] text-white border-0 text-sm px-3 py-1.5 rounded-lg shadow-md shadow-[#2a655f]/30 animate-pulse", children: [
              "🎯 ",
              Math.round((form.old_price - form.price) / form.old_price * 100),
              "% ",
              lang === "ar" ? "خصم" : "OFF"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [
              lang === "ar" ? "العميل سيوفر" : "Customer saves",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-600 dark:text-emerald-400 text-base", children: formatPrice(form.old_price - form.price, app.currency, app.lang) })
            ] })
          ] })
        ] })
      ] }),
      activeTab === "images" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border-2 border-purple-500/30 dark:border-purple-500/40 bg-gradient-to-r from-purple-500/5 to-purple-500/10 dark:from-purple-500/20 dark:to-purple-500/10 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-24 h-24 rounded-full bg-purple-500/5 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-purple-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-4 w-4 text-purple-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-purple-600 dark:text-purple-400", children: lang === "ar" ? "📸 صور المنتج" : "📸 Product Images" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: lang === "ar" ? "الصور الجيدة تزيد من فرص البيع بنسبة تصل إلى 80%" : "Good images increase sales chances by up to 80%" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
            lang === "ar" ? "الصورة الرئيسية" : "Main Image",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            ImageInput,
            {
              value: form.cover_url,
              onChange: (value) => setForm({ ...form, cover_url: value }),
              userId: app.user?.id,
              folder: "products",
              lang: app.lang,
              label: lang === "ar" ? "📸 اضغط لرفع الصورة الرئيسية" : "📸 Click to upload main image",
              hint: lang === "ar" ? "صورة واحدة على الأقل مطلوبة" : "At least one image is required",
              previewClassName: "aspect-video h-auto rounded-lg max-h-[240px] border-2 border-[#2a655f]/30",
              required: true
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 rounded-lg bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/30 dark:to-slate-800/10 p-4 border-2 border-[#2a655f]/30 dark:border-[#2a655f]/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded bg-[#2a655f]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 text-[#2a655f]" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-slate-700 dark:text-slate-300", children: lang === "ar" ? "صور إضافية" : "Additional Images" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[10px] bg-slate-100 text-slate-600 border-slate-200", children: [
                form.image_urls.length,
                "/6"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                onClick: () => setForm({ ...form, image_urls: [...form.image_urls, ""] }),
                disabled: form.image_urls.length >= 6,
                className: "rounded-lg border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105 h-8 px-3 text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 me-1" }),
                  " ",
                  lang === "ar" ? "إضافة" : "Add"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3", children: form.image_urls.map((url, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            ImageInput,
            {
              value: url,
              onChange: (value) => {
                const next = [...form.image_urls];
                next[index] = value;
                setForm({ ...form, image_urls: next });
              },
              userId: app.user?.id,
              folder: "products",
              lang: app.lang,
              label: `${lang === "ar" ? "صورة" : "Image"} ${index + 1}`,
              hint: lang === "ar" ? "اختيارية" : "Optional",
              previewClassName: "aspect-video h-auto rounded-lg border-2 border-slate-200/50"
            },
            index
          )) })
        ] })
      ] }),
      activeTab === "options" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-in fade-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border-2 border-indigo-500/30 dark:border-indigo-500/40 bg-gradient-to-r from-indigo-500/5 to-indigo-500/10 dark:from-indigo-500/20 dark:to-indigo-500/10 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 w-24 h-24 rounded-full bg-indigo-500/5 blur-3xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-indigo-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-indigo-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-indigo-600 dark:text-indigo-400", children: lang === "ar" ? "⚙️ خيارات وتركيبات المنتج" : "⚙️ Product Options & Variations" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: lang === "ar" ? "أضف الألوان مع الصور والمقاسات والتركيبات المتوفرة" : "Add colors with images, sizes and available variations" })
            ] })
          ] })
        ] }),
        !parentCategoryId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-6 w-6 text-[#2a655f]/50" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-slate-700 dark:text-slate-300", children: lang === "ar" ? "الرجاء اختيار التصنيف الرئيسي أولاً" : "Please select a main category first" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: lang === "ar" ? "الخيارات المتاحة تختلف حسب التصنيف المختار" : "Available options differ based on the selected category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setActiveTab("basic"),
              className: "mt-3 rounded-lg border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 text-xs h-9",
              children: lang === "ar" ? "الذهاب للأساسيات" : "Go to Basic"
            }
          )
        ] }) : isLoadingCategoryOptions ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto text-[#2a655f]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: lang === "ar" ? "جاري تحميل الخيارات..." : "Loading options..." })
        ] }) : availableOptions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 text-center rounded-xl border-2 border-dashed border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-6 w-6 text-amber-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-amber-700 dark:text-amber-400", children: lang === "ar" ? "لا توجد خيارات لهذا التصنيف" : "No options for this category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: lang === "ar" ? "يمكنك المتابعة بدون خيارات" : "You can continue without options" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProductOptionsManager,
          {
            value: options,
            onChange: setOptions,
            lang: app.lang,
            variations,
            onVariationsChange: setVariations,
            userId: app.user?.id || "",
            onColorsWithImagesChange: handleColorsWithImagesChange,
            externalColorImages,
            sizes,
            onSizesChange: handleSizesUpdate,
            isOffer: productType === "offer",
            availableOptions
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky bottom-0 bg-white dark:bg-slate-900 border-t-2 border-[#2a655f]/30 dark:border-[#2a655f]/40 p-4 md:p-5 rounded-b-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: goToPrevTab,
          disabled: isFirstTab,
          className: "rounded-lg border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 h-10 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed",
          children: [
            isRTL ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1.5" }),
            lang === "ar" ? "السابق" : "Previous"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            onClick: () => onOpenChange(false),
            className: "rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 h-10 px-4 text-sm",
            children: lang === "ar" ? "إلغاء" : "Cancel"
          }
        ),
        isLastTab ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: validateAndSubmit,
            disabled: !isFormValid() || isSaving || isSubmitting,
            className: "rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25 transition-all duration-300 h-10 px-5 hover:shadow-[#2a655f]/40 hover:scale-[1.02] hover:from-[#1a4f4a] hover:to-[#2a655f] disabled:opacity-50 disabled:cursor-not-allowed text-sm",
            children: isSaving || isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
              lang === "ar" ? "جاري النشر..." : "Publishing..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-4 w-4 mr-1.5" }),
              product ? lang === "ar" ? "حفظ التغييرات" : "Save Changes" : productType === "offer" ? lang === "ar" ? "نشر العرض" : "Publish Offer" : lang === "ar" ? "نشر المنتج" : "Publish Product"
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: goToNextTab,
            disabled: !isTabValid(activeTab),
            className: "rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25 transition-all duration-300 h-10 px-5 hover:shadow-[#2a655f]/40 hover:scale-[1.02] hover:from-[#1a4f4a] hover:to-[#2a655f] disabled:opacity-50 disabled:cursor-not-allowed text-sm",
            children: [
              lang === "ar" ? "التالي" : "Next",
              isRTL ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1.5" })
            ]
          }
        )
      ] })
    ] }) })
  ] }) });
}
const SINGULAR_MAP = {
  // خيارات المنتج الأساسية
  "colors": "color",
  "sizes": "size",
  "models": "model",
  "materials": "material",
  "fabrics": "fabric",
  "styles": "style",
  "seasons": "season",
  "genders": "gender",
  "brands": "brand",
  // خيارات الأجهزة والإلكترونيات
  "storages": "storage",
  "rams": "ram",
  "ram": "ram",
  "processors": "processor",
  "batteries": "battery",
  "cameras": "camera",
  "connectivities": "connectivity",
  "bluetooths": "bluetooth",
  "dimensions": "dimension",
  "weights": "weight",
  "weight_kg": "weight",
  "weight": "weight",
  "screen_sizes": "screen_size",
  "screen_size": "screen_size",
  // خيارات الملابس والأحذية
  "shoes": "shoe",
  "watches": "watch",
  "occasions": "occasion",
  "accessories": "accessory",
  "shoe_sizes": "shoe_size",
  "shoe_types": "shoe_type",
  "watch_bands": "watch_band",
  // خيارات عامة
  "types": "type",
  "categories": "category",
  "groups": "group",
  "levels": "level",
  "grades": "grade",
  "classes": "class",
  "ranks": "rank",
  "statuses": "status",
  // خيارات المكان والزمان
  "locations": "location",
  "regions": "region",
  "cities": "city",
  "countries": "country",
  "months": "month",
  "years": "year",
  "days": "day",
  "times": "time",
  // خيارات الألوان والمواد
  "shades": "shade",
  "tones": "tone",
  "textures": "texture",
  "patterns": "pattern",
  "prints": "print",
  "finishes": "finish",
  // خيارات القياسات
  "lengths": "length",
  "widths": "width",
  "heights": "height",
  "depths": "depth",
  "volumes": "volume",
  // خيارات المنتجات الرقمية
  "formats": "format",
  "resolutions": "resolution",
  "qualities": "quality",
  "speeds": "speed",
  "powers": "power",
  // خيارات المنتجات الغذائية
  "flavors": "flavor",
  "tastes": "taste",
  "ingredients": "ingredient",
  "nutritions": "nutrition",
  // خيارات المنتجات الطبية
  "doses": "dose",
  "strengths": "strength",
  // خيارات إضافية
  "age_groups": "age_group",
  "material_types": "material_type",
  "occasions": "occasion"
};
const ALLOWED_OPTION_TYPES = [
  // أساسيات
  "color",
  "size",
  "model",
  "material",
  "fabric",
  "style",
  "season",
  "gender",
  "brand",
  // إلكترونيات
  "storage",
  "ram",
  "processor",
  "battery",
  "screen_size",
  "camera",
  "connectivity",
  "bluetooth",
  "dimension",
  // أوزان
  "weight_kg",
  "weight",
  // ملابس وأحذية
  "material_type",
  "shoe_size",
  "shoe_type",
  "watch_band",
  // مناسبات
  "occasion",
  "age_group",
  // عامة
  "type",
  "category",
  "group",
  "level",
  "grade",
  "class",
  "rank",
  "status",
  // مكان وزمان
  "location",
  "region",
  "city",
  "country",
  "month",
  "year",
  "day",
  "time",
  // ألوان ومواد
  "shade",
  "tone",
  "texture",
  "pattern",
  "print",
  "finish",
  // قياسات
  "length",
  "width",
  "height",
  "depth",
  "volume",
  // رقمية
  "format",
  "resolution",
  "quality",
  "speed",
  "power",
  // غذائية
  "flavor",
  "taste",
  "ingredient",
  "nutrition",
  // طبية
  "dose",
  "strength"
];
function toSingular(word) {
  if (SINGULAR_MAP[word]) {
    return SINGULAR_MAP[word];
  }
  if (word.endsWith("ies") && word.length > 3) {
    return word.slice(0, -3) + "y";
  }
  if (word.endsWith("ves") && word.length > 3) {
    return word.slice(0, -3) + "f";
  }
  if (word.endsWith("s") && !word.endsWith("ss") && !word.endsWith("us") && !word.endsWith("is") && word.length > 1) {
    return word.slice(0, -1);
  }
  return word;
}
class ProductService {
  /**
   * ✅ حفظ الخيارات مع التحويل التلقائي
   */
  static async saveOptions(listingId, options) {
    console.log("🔍🔍🔍 [ProductService] ===== SAVE OPTIONS START =====");
    console.log("🔍🔍🔍 [ProductService] options received:", JSON.stringify(options, null, 2));
    console.log("🔍🔍🔍 [ProductService] options keys:", Object.keys(options));
    console.log("🔍🔍🔍 [ProductService] options.sizes:", options.sizes);
    console.log("🔍🔍🔍 [ProductService] options.colors:", options.colors);
    console.log("🔍🔍🔍 [ProductService] options.models:", options.models);
    const entries = [];
    const warnings = [];
    const skipped = [];
    Object.entries(options).forEach(([key, values]) => {
      console.log(`🔍 [ProductService] Processing key: "${key}", values:`, values);
      let type = toSingular(key);
      console.log(`🔍 [ProductService] toSingular("${key}") → "${type}"`);
      if (!ALLOWED_OPTION_TYPES.includes(type)) {
        if (key.endsWith("s") && key.length > 1) {
          const attempt = key.slice(0, -1);
          console.log(`🔍 [ProductService] Attempt 2: "${key}" → "${attempt}"`);
          if (ALLOWED_OPTION_TYPES.includes(attempt)) {
            type = attempt;
            console.log(`✅ [ProductService] Type "${type}" is allowed (attempt 2)`);
          } else {
            console.warn(`⚠️ [ProductService] Type "${type}" NOT allowed!`);
            skipped.push(`"${key}" → "${type}" (غير مسموح)`);
            return;
          }
        } else {
          console.warn(`⚠️ [ProductService] Type "${type}" NOT allowed!`);
          skipped.push(`"${key}" → "${type}" (غير مسموح)`);
          return;
        }
      } else {
        console.log(`✅ [ProductService] Type "${type}" is allowed`);
      }
      values.forEach((value, index) => {
        if (value && value.trim()) {
          console.log(`✅ [ProductService] Adding: ${type} → ${value}`);
          entries.push({
            listing_id: listingId,
            option_type: type,
            option_value: value.trim(),
            sort_order: index
          });
        }
      });
    });
    console.log("🔍🔍🔍 [ProductService] Final entries:", entries);
    console.log("🔍🔍🔍 [ProductService] Entries count:", entries.length);
    if (entries.length > 0 || skipped.length > 0) {
      console.log("📊 Product Options Report:", {
        inserted: entries.length,
        skipped: skipped.length,
        warnings: warnings.length > 0 ? warnings : "✅ كل شيء ممتاز"
      });
    }
    if (entries.length > 0) {
      console.log(`✅ [ProductService] Inserting ${entries.length} options into database...`);
      const { error } = await supabase.from("product_options").insert(entries);
      if (error) {
        console.error("❌ Error saving product options:", error);
        throw new Error(`فشل حفظ الخيارات: ${error.message}`);
      }
      console.log(`✅ [ProductService] Successfully inserted ${entries.length} options`);
    } else {
      console.log("⚠️ [ProductService] No options to insert!");
    }
    console.log("🔍🔍🔍 [ProductService] ===== SAVE OPTIONS END =====");
    return { inserted: entries.length, skipped: skipped.length };
  }
  /**
   * ✅ حفظ الألوان
   */
  static async saveColors(listingId, colors) {
    if (!colors || colors.length === 0) return { inserted: 0, errors: [] };
    const entries = [];
    const errors = [];
    colors.forEach((color, index) => {
      const name = color.color_name_ar || color.color_name || color.name;
      const image = color.image_url || color.image || "";
      if (!name || !name.trim()) {
        errors.push(`⚠️ لون بدون اسم في الفهرس ${index}`);
        return;
      }
      if (!image || !image.trim()) {
        errors.push(`⚠️ لون "${name}" بدون صورة`);
        return;
      }
      entries.push({
        listing_id: listingId,
        color_name_ar: name.trim(),
        color_name_en: color.color_name_en || null,
        color_hex: color.color_hex || null,
        image_url: image.trim(),
        sort_order: color.sort_order ?? index
      });
    });
    if (entries.length > 0) {
      const { error } = await supabase.from("product_colors").insert(entries);
      if (error) {
        console.error("❌ Error saving product colors:", error);
        throw new Error(`فشل حفظ الألوان: ${error.message}`);
      }
    }
    return { inserted: entries.length, errors };
  }
  /**
   * ✅ حفظ التركيبات مع ربط الألوان وإجبار السعر
   */
  // src/lib/services/ProductService.ts
  /**
   * ✅ حفظ التركيبات مع ربط الألوان وإجبار السعر
   * 🔥 محسّن: يحذف القديم أولاً ثم يحفظ الجديد
   */
  // src/lib/services/ProductService.ts
  static async saveVariations(listingId, variations) {
    console.log("🔍 [ProductService] ===== SAVE VARIATIONS START =====");
    console.log("🔍 [ProductService] Variations to save:", variations.length);
    if (!variations || variations.length === 0) {
      console.log("ℹ️ [ProductService] No variations to save, deleting all");
      const { error } = await supabase.from("product_variations").delete().eq("listing_id", listingId);
      if (error) {
        console.error("❌ Error deleting variations:", error);
      } else {
        console.log("✅ [ProductService] All variations deleted");
      }
      return { inserted: 0 };
    }
    const { data: extraOptions, error: optionsError } = await supabase.from("product_options").select("option_type, option_value").eq("listing_id", listingId);
    if (optionsError) {
      console.error("❌ Error fetching extra options:", optionsError);
    }
    const extraOptionsMap = {};
    (extraOptions || []).forEach((opt) => {
      const type = opt.option_type;
      if (type !== "color" && type !== "size" && type !== "colors") {
        extraOptionsMap[type] = opt.option_value;
      }
    });
    console.log("🔍 [ProductService] Extra options to add:", extraOptionsMap);
    const { data: colors, error: colorsError } = await supabase.from("product_colors").select("id, color_name_ar").eq("listing_id", listingId);
    if (colorsError) {
      console.error("❌ Error fetching colors:", colorsError);
    }
    const colorMap = /* @__PURE__ */ new Map();
    (colors || []).forEach((c) => {
      colorMap.set(c.color_name_ar, c.id);
    });
    const entries = [];
    variations.forEach((v, index) => {
      if (!v.combination || Object.keys(v.combination).length === 0) {
        return;
      }
      const combinedCombination = { ...v.combination };
      Object.keys(extraOptionsMap).forEach((key) => {
        if (!combinedCombination[key]) {
          combinedCombination[key] = extraOptionsMap[key];
        }
      });
      console.log(`🔍 [ProductService] Variation ${index} combination:`, combinedCombination);
      const priceToSave = v.price !== void 0 && v.price !== null && v.price > 0 ? v.price : 0;
      let colorId = null;
      if (v.combination.colors || v.combination.color) {
        const colorName = v.combination.colors || v.combination.color;
        colorId = colorMap.get(colorName) || null;
      }
      if (v.color_id) {
        colorId = v.color_id;
      }
      const sku = v.sku || `VAR-${listingId.substring(0, 8)}-${Date.now()}-${index}`;
      entries.push({
        listing_id: listingId,
        combination: combinedCombination,
        is_active: v.is_available !== false,
        sku,
        price: priceToSave,
        old_price: v.old_price || null,
        // ✅ ✅ ✅ هذا السطر الجديد
        color_id: colorId,
        stock_quantity: v.stock_quantity || 0
      });
    });
    console.log("🔍 [ProductService] Entries to insert:", entries.length);
    console.log("🔍 [ProductService] First entry combination:", entries[0]?.combination);
    if (entries.length > 0) {
      console.log("🗑️ [ProductService] Deleting old variations...");
      const { error: deleteError } = await supabase.from("product_variations").delete().eq("listing_id", listingId);
      if (deleteError) {
        console.error("❌ Error deleting old variations:", deleteError);
      } else {
        console.log("✅ [ProductService] Old variations deleted");
      }
      console.log(`💾 [ProductService] Inserting ${entries.length} new variations...`);
      const { error, data } = await supabase.from("product_variations").insert(entries).select();
      if (error) {
        console.error("❌ Error saving product variations:", error);
        throw new Error(`فشل حفظ التركيبات: ${error.message}`);
      }
      console.log(`✅ [ProductService] Saved ${entries.length} variations with prices`);
      console.log("✅ [ProductService] Saved data:", data);
    } else {
      console.log("🗑️ [ProductService] No variations to save, deleting all");
      const { error } = await supabase.from("product_variations").delete().eq("listing_id", listingId);
      if (error) {
        console.error("❌ Error deleting variations:", error);
      } else {
        console.log("✅ [ProductService] All variations deleted");
      }
    }
    console.log("🔍 [ProductService] ===== SAVE VARIATIONS END =====");
    return { inserted: entries.length };
  }
  /**
   * ✅ حذف جميع بيانات المنتج
   */
  static async deleteProductData(listingId) {
    const tables = ["product_options", "product_colors", "product_variations"];
    const errors = [];
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().eq("listing_id", listingId);
      if (error) {
        errors.push(`❌ فشل حذف من ${table}: ${error.message}`);
      }
    }
    const { error: imagesError } = await supabase.from("listing_images").delete().eq("listing_id", listingId);
    if (imagesError) {
      errors.push(`❌ فشل حذف الصور: ${imagesError.message}`);
    }
    return errors;
  }
  /**
   * ✅ حفظ كل بيانات المنتج دفعة واحدة (بدون تكرار)
   */
  static async saveAllProductData(listingId, data) {
    const results = {
      options: { inserted: 0, skipped: 0 },
      colors: { inserted: 0, errors: [] },
      variations: { inserted: 0 },
      images: { inserted: 0 }
      // ✅ جديد
    };
    if (data.options) {
      results.options = await ProductService.saveOptions(listingId, data.options);
    }
    if (data.colors) {
      results.colors = await ProductService.saveColors(listingId, data.colors);
    }
    if (data.variations) {
      results.variations = await ProductService.saveVariations(listingId, data.variations);
    }
    if (data.image_urls && data.image_urls.length > 0) {
      const validImageUrls = data.image_urls.filter((url) => url && url.trim() !== "").map((url, index) => ({
        listing_id: listingId,
        url: url.trim(),
        sort_order: index
      }));
      console.log("📸 [ProductService] Saving images:", validImageUrls);
      console.log("📸 [ProductService] Number of images:", validImageUrls.length);
      if (validImageUrls.length > 0) {
        const { error } = await supabase.from("listing_images").insert(validImageUrls);
        if (error) {
          console.error("❌ [ProductService] Error saving images:", error);
          throw new Error(`فشل حفظ الصور: ${error.message}`);
        }
        results.images.inserted = validImageUrls.length;
        console.log("✅ [ProductService] Images saved successfully!");
      }
    } else {
      console.log("ℹ️ [ProductService] No images to save");
    }
    console.log("✅ Product data saved successfully");
    console.log(`📊 Results: ${results.options.inserted} options, ${results.colors.inserted} colors, ${results.variations.inserted} variations, ${results.images.inserted} images`);
    return results;
  }
  /**
   * ✅ ✅ ✅ دالة جديدة: تحديث metadata فقط للبيانات الإضافية (مشاهدات، SEO، إلخ)
   * هذه الدالة لا تُستخدم للفيرنتات، فقط للبيانات الإضافية
   */
  static async updateMetadata(listingId, metadata) {
    const { error } = await supabase.from("listings").update({ metadata }).eq("id", listingId);
    if (error) {
      console.error("❌ Error updating metadata:", error);
      throw new Error(`فشل تحديث metadata: ${error.message}`);
    }
    return true;
  }
}
async function getUserDisplayName(userId) {
  try {
    const { data: userProfile, error } = await supabase.from("profiles").select("full_name, store_name").eq("id", userId).maybeSingle();
    if (error) {
      console.error("❌ Error fetching user profile:", error);
      return userId;
    }
    if (userProfile?.store_name && userProfile.store_name.trim() !== "") {
      return userProfile.store_name.trim();
    }
    if (userProfile?.full_name && userProfile.full_name.trim() !== "") {
      return userProfile.full_name.trim();
    }
    return userId;
  } catch (error) {
    console.error("❌ Error in getUserDisplayName:", error);
    return userId;
  }
}
const ConvertToOfferDialog = ({
  open,
  onOpenChange,
  product,
  onConfirm,
  isConverting,
  lang,
  currency,
  formatPrice: formatPrice2
}) => {
  const [newPrice, setNewPrice] = reactExports.useState(0);
  const [error, setError] = reactExports.useState("");
  const [variationPrices, setVariationPrices] = reactExports.useState({});
  const [variationOldPrices, setVariationOldPrices] = reactExports.useState({});
  const [bulkDiscountPercent, setBulkDiscountPercent] = reactExports.useState(0);
  const [expandedVariations, setExpandedVariations] = reactExports.useState(true);
  const hasVariations = product?.variations && product.variations.length > 0;
  reactExports.useEffect(() => {
    if (product && open) {
      const originalPrice2 = Number(product.price);
      const suggestedPrice = Math.round(originalPrice2 * 0.8);
      setNewPrice(suggestedPrice);
      setError("");
      if (hasVariations) {
        const prices = {};
        const oldPrices = {};
        product.variations.forEach((v) => {
          const currentPrice = v.price || originalPrice2 || 0;
          const suggestedVarPrice = Math.round(currentPrice * 0.8);
          prices[v.id] = suggestedVarPrice;
          oldPrices[v.id] = currentPrice;
        });
        setVariationPrices(prices);
        setVariationOldPrices(oldPrices);
        setBulkDiscountPercent(20);
        setExpandedVariations(true);
      }
    }
  }, [product, open, hasVariations]);
  if (!product) return null;
  const originalPrice = Number(product.price);
  const discountPercent = originalPrice > 0 && newPrice > 0 && newPrice < originalPrice ? Math.round((originalPrice - newPrice) / originalPrice * 100) : 0;
  const isValid = newPrice > 0 && newPrice < originalPrice;
  const areVariationsValid = () => {
    if (!hasVariations) return true;
    for (const v of product.variations) {
      const newPriceVar = variationPrices[v.id];
      const oldPriceVar = variationOldPrices[v.id];
      if (!newPriceVar || newPriceVar <= 0) return false;
      if (!oldPriceVar || oldPriceVar <= 0) return false;
      if (newPriceVar >= oldPriceVar) return false;
    }
    return true;
  };
  const isFormValid = hasVariations ? areVariationsValid() : isValid;
  const applyBulkDiscount = (percent) => {
    if (!hasVariations || !product.variations) return;
    const newPrices = {};
    product.variations.forEach((v) => {
      const currentPrice = v.price || originalPrice || 0;
      const discountedPrice = Math.round(currentPrice * (1 - percent / 100));
      newPrices[v.id] = discountedPrice;
    });
    setVariationPrices(newPrices);
    setBulkDiscountPercent(percent);
  };
  const handleApplyBulkDiscount = () => {
    if (bulkDiscountPercent > 0 && bulkDiscountPercent <= 100) {
      applyBulkDiscount(bulkDiscountPercent);
    }
  };
  const handleConfirm = () => {
    if (!isFormValid) {
      setError(
        lang === "ar" ? "⚠️ الرجاء التأكد من أن السعر الجديد أقل من السعر القديم" : "⚠️ Please ensure new price is less than old price"
      );
      return;
    }
    onOpenChange(false);
    if (hasVariations) {
      onConfirm(product.id, 0, variationPrices, variationOldPrices);
    } else {
      onConfirm(product.id, newPrice);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "w-[95vw] max-w-2xl rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 shadow-2xl shadow-[#2a655f]/10 p-0 overflow-hidden max-h-[95vh] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5 pb-3 border-b border-[#2a655f]/10 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-11 w-11 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-bold text-[#2a655f]", children: lang === "ar" ? "🎁 تحويل إلى عرض تخفيض" : "🎁 Convert to Discount Offer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs text-muted-foreground", children: lang === "ar" ? `تحويل "${product.title_ar}" إلى عرض خاص` : `Convert "${product.title_en || product.title_ar}" to a special offer` })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl bg-[#2a655f]/5 dark:bg-[#2a655f]/10 border border-[#2a655f]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: product.cover_url || "/placeholder.png",
            alt: product.title_ar,
            className: "w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-slate-800 dark:text-slate-200 truncate", children: product.title_ar }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: lang === "ar" ? "السعر الحالي:" : "Current:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-[#2a655f]", children: formatPrice2(originalPrice, currency, lang) }),
            hasVariations && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-[9px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3 w-3 inline mr-1" }),
              product.variations.length,
              " ",
              lang === "ar" ? "خيار" : "options"
            ] })
          ] })
        ] })
      ] }) }),
      hasVariations && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[#2a655f]" }),
            lang === "ar" ? "أسعار الخيارات" : "Option Prices",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 text-xs", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: lang === "ar" ? "خصم الكل:" : "Bulk:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  max: "100",
                  value: bulkDiscountPercent,
                  onChange: (e) => {
                    const val = Number(e.target.value);
                    if (val >= 0 && val <= 100) {
                      setBulkDiscountPercent(val);
                    }
                  },
                  className: "h-7 w-14 text-xs rounded-lg border-slate-200/50 dark:border-slate-800/50"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "%" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "h-7 px-2 text-[10px] text-[#2a655f] hover:bg-[#2a655f]/10",
                  onClick: handleApplyBulkDiscount,
                  children: lang === "ar" ? "تطبيق" : "Apply"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-60 overflow-y-auto pr-1", children: product.variations.map((variation) => {
          const combo = variation.combination || {};
          const comboText = Object.entries(combo).map(([key, value]) => `${key}: ${value}`).join(" • ");
          const currentPrice = variationPrices[variation.id] ?? variation.price ?? originalPrice ?? 0;
          const currentOldPrice = variationOldPrices[variation.id] ?? variation.price ?? originalPrice ?? 0;
          const varDiscount = currentOldPrice > currentPrice && currentOldPrice > 0 ? Math.round((currentOldPrice - currentPrice) / currentOldPrice * 100) : 0;
          const isVarValid = currentPrice > 0 && currentOldPrice > 0 && currentPrice < currentOldPrice;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-slate-200/50", children: comboText || variation.id.slice(0, 6) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  lang === "ar" ? "السعر الحالي:" : "Current:",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#2a655f] mx-1", children: formatPrice2(variation.price || originalPrice || 0, currency, lang) })
                ] })
              ] }),
              varDiscount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[9px]", children: [
                "🎯 ",
                varDiscount,
                "% ",
                lang === "ar" ? "خصم" : "OFF"
              ] }),
              !isVarValid && currentPrice > 0 && currentOldPrice > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 text-[9px]", children: [
                "⚠️ ",
                lang === "ar" ? "غير صحيح" : "Invalid"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: lang === "ar" ? "السعر الجديد" : "New Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: "0",
                    value: currentPrice,
                    onChange: (e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) {
                        setVariationPrices({
                          ...variationPrices,
                          [variation.id]: val
                        });
                      }
                    },
                    className: cn(
                      "h-8 text-xs rounded-lg border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50",
                      currentPrice >= currentOldPrice && currentPrice > 0 && "border-red-300 dark:border-red-700"
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: lang === "ar" ? "السعر القديم" : "Old Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: "0",
                    value: currentOldPrice,
                    onChange: (e) => {
                      const val = Number(e.target.value);
                      if (val >= 0) {
                        setVariationOldPrices({
                          ...variationOldPrices,
                          [variation.id]: val
                        });
                      }
                    },
                    className: "h-8 text-xs rounded-lg border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50"
                  }
                )
              ] })
            ] }),
            currentOldPrice > currentPrice && currentOldPrice > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1", children: [
              "💰 ",
              lang === "ar" ? "وفر" : "Save",
              " ",
              formatPrice2(currentOldPrice - currentPrice, currency, lang)
            ] }) }),
            currentPrice >= currentOldPrice && currentPrice > 0 && currentOldPrice > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-2 text-[10px] text-red-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
              lang === "ar" ? "السعر الجديد يجب أن يكون أقل" : "New price must be lower"
            ] })
          ] }, variation.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-amber-600 dark:text-amber-400", children: lang === "ar" ? "⚠️ كل خيار له سعر مستقل. حدد السعر الجديد والقديم لكل خيار" : "⚠️ Each option has its own price. Set new and old price for each option" })
        ] })
      ] }),
      !hasVariations && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-[#2a655f]" }),
          lang === "ar" ? "السعر الجديد بعد الخصم" : "New Price After Discount",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 text-xs", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-[#2a655f]/60", children: "ل.س" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              value: newPrice || "",
              onChange: (e) => {
                const val = Number(e.target.value);
                setNewPrice(val);
                setError("");
                if (val <= 0) {
                  setError(lang === "ar" ? "السعر يجب أن يكون أكبر من 0" : "Price must be greater than 0");
                } else if (val >= originalPrice) {
                  setError(lang === "ar" ? "السعر الجديد يجب أن يكون أقل من السعر الأصلي" : "New price must be less than original price");
                }
              },
              className: "ps-12 h-11 text-base rounded-xl border-[#2a655f]/20 dark:border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 bg-white dark:bg-slate-900",
              placeholder: lang === "ar" ? "أدخل السعر الجديد..." : "Enter new price...",
              min: 0,
              max: originalPrice - 1
            }
          ),
          newPrice > 0 && newPrice < originalPrice && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-emerald-500" }) }),
          newPrice >= originalPrice && newPrice > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-5 w-5 text-red-500" }) })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-red-500 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5" }),
          error
        ] }),
        isValid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2.5 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-4 w-4 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-600 dark:text-slate-400", children: lang === "ar" ? "الخصم:" : "Discount:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-xs font-bold px-2.5 py-0.5", children: [
              discountPercent,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82] transition-all duration-500",
              style: { width: `${Math.min(discountPercent, 100)}%` }
            }
          ) })
        ] })
      ] }),
      isFormValid && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-xl bg-[#2a655f]/5 dark:bg-[#2a655f]/10 border-2 border-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.cover_url || "/placeholder.png",
              alt: product.title_ar,
              className: "w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
            }
          ),
          hasVariations ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg", children: [
            product.variations.length,
            " 🎨"
          ] }) : discountPercent > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse", children: [
            "-",
            discountPercent,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-sm text-slate-800 dark:text-slate-200 truncate", children: product.title_ar }),
          hasVariations ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-[9px]", children: lang === "ar" ? "عرض مع خيارات" : "Offer with options" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: lang === "ar" ? `تحديث أسعار ${product.variations.length} خيار` : `Updating ${product.variations.length} options` })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl font-bold text-red-600 dark:text-red-400", children: formatPrice2(newPrice || 0, currency, lang) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground line-through", children: formatPrice2(originalPrice, currency, lang) })
          ] })
        ] })
      ] }) }),
      (isValid || hasVariations && isFormValid) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-blue-700 dark:text-blue-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: lang === "ar" ? "💡 نصيحة:" : "💡 Tip:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600/70 dark:text-blue-400/70", children: hasVariations ? lang === "ar" ? ` العرض مع خيارات متعددة يزيد من فرص البيع` : ` Offer with multiple options increases sales chances` : lang === "ar" ? ` الخصم ${discountPercent}% سيجذب المزيد من العملاء` : ` ${discountPercent}% discount will attract more customers` })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 pt-3 border-t border-[#2a655f]/10 flex-shrink-0 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: () => onOpenChange(false),
          className: "flex-1 rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 h-10 text-sm transition-all duration-300",
          disabled: isConverting,
          children: lang === "ar" ? "إلغاء" : "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleConfirm,
          disabled: !isFormValid || isConverting,
          className: "flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 hover:scale-[1.02] h-10 text-sm transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed",
          children: isConverting ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
            lang === "ar" ? "جاري التحويل..." : "Converting..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-3.5 w-3.5 mr-1.5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" }),
            hasVariations ? lang === "ar" ? "تحويل الكل" : "Convert All" : lang === "ar" ? "تحويل إلى عرض" : "Convert to Offer"
          ] })
        }
      )
    ] })
  ] }) });
};
function AddBogoOfferDialogComponent({
  open,
  onOpenChange,
  product: initialProduct,
  existingOffer,
  onSuccess
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const createOffer = useCreateProductOffer();
  const updateOffer = useUpdateProductOffer();
  const { data: categories = [] } = useCategories();
  const ownerId = app.user?.id;
  const { data: listingsData, isLoading: listingsLoading } = useListings({
    limit: 1e3,
    ...ownerId && { ownerId }
  });
  const listings = (listingsData?.data || []).filter((l) => !l.is_offer);
  const [offerType, setOfferType] = reactExports.useState("bogo");
  const [selectedParentCategoryId, setSelectedParentCategoryId] = reactExports.useState("");
  const [selectedSubCategoryId, setSelectedSubCategoryId] = reactExports.useState("");
  const [parentCategorySearch, setParentCategorySearch] = reactExports.useState("");
  const [subCategorySearch, setSubCategorySearch] = reactExports.useState("");
  const [isParentCategoryOpen, setIsParentCategoryOpen] = reactExports.useState(false);
  const [isSubCategoryOpen, setIsSubCategoryOpen] = reactExports.useState(false);
  const parentCategoryInputRef = reactExports.useRef(null);
  const parentCategoryDropdownRef = reactExports.useRef(null);
  const subCategoryInputRef = reactExports.useRef(null);
  const subCategoryDropdownRef = reactExports.useRef(null);
  const [requirements, setRequirements] = reactExports.useState([
    { listing_id: "", variations: { mode: "all", ids: [] }, quantity: 1, variationQuantities: {} }
  ]);
  const [result, setResult] = reactExports.useState({
    listing_id: "",
    variations: { mode: "all", ids: [] },
    quantity: 1,
    variationQuantities: {}
  });
  const [expiresAt, setExpiresAt] = reactExports.useState("");
  const [isPermanent, setIsPermanent] = reactExports.useState(true);
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [selectedVariationPrice, setSelectedVariationPrice] = reactExports.useState(null);
  const isUpdatingFromExisting = reactExports.useRef(false);
  const mainCategories = reactExports.useMemo(() => {
    return categories.filter(
      (c) => !c.parent_id && c.active !== false
    );
  }, [categories]);
  const subCategories = reactExports.useMemo(() => {
    if (!selectedParentCategoryId) return [];
    return categories.filter(
      (c) => c.parent_id === selectedParentCategoryId && c.active !== false
    );
  }, [categories, selectedParentCategoryId]);
  const hasSubCategories = subCategories.length > 0;
  const filteredMainCategories = reactExports.useMemo(() => {
    if (!parentCategorySearch.trim()) return mainCategories;
    const search = parentCategorySearch.toLowerCase().trim();
    return mainCategories.filter((cat) => {
      const nameAr = (cat.name_ar || "").toLowerCase();
      const nameEn = (cat.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search);
    });
  }, [mainCategories, parentCategorySearch]);
  const filteredSubCategories = reactExports.useMemo(() => {
    if (!subCategorySearch.trim()) return subCategories;
    const search = subCategorySearch.toLowerCase().trim();
    return subCategories.filter((cat) => {
      const nameAr = (cat.name_ar || "").toLowerCase();
      const nameEn = (cat.name_en || "").toLowerCase();
      return nameAr.includes(search) || nameEn.includes(search);
    });
  }, [subCategories, subCategorySearch]);
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (parentCategoryDropdownRef.current && !parentCategoryDropdownRef.current.contains(event.target) && parentCategoryInputRef.current && !parentCategoryInputRef.current.contains(event.target)) {
        setIsParentCategoryOpen(false);
      }
      if (subCategoryDropdownRef.current && !subCategoryDropdownRef.current.contains(event.target) && subCategoryInputRef.current && !subCategoryInputRef.current.contains(event.target)) {
        setIsSubCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getProductVariationsOrColors = (listingId) => {
    const product = listings.find((l) => l.id === listingId);
    if (!product) return [];
    const variations = product.variations || [];
    const colors = product.colors || product.product_colors || [];
    const colorVariations = colors.map((color) => ({
      id: color.id,
      combination: {
        colors: color.color_name_ar || color.color_name_en || "لون",
        ...color.color_hex && { hex: color.color_hex }
      },
      price: product.price || 0,
      old_price: product.old_price || null,
      image_url: color.image_url || null,
      is_active: true,
      stock_quantity: 0,
      _type: "color"
    }));
    return [...variations, ...colorVariations];
  };
  const hasVariationsOrColors = (listingId) => {
    const product = listings.find((l) => l.id === listingId);
    if (!product) return false;
    const hasVariations = product.variations && product.variations.length > 0;
    const hasColors = product.colors && product.colors.length > 0;
    const hasProductColors = product.product_colors && product.product_colors.length > 0;
    return hasVariations || hasColors || hasProductColors;
  };
  const getProductPrice = (listingId) => {
    const product = listings.find((l) => l.id === listingId);
    return product?.price || 0;
  };
  const getCategoryName = reactExports.useCallback((categoryId) => {
    if (!categoryId) return "";
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? isArabic ? cat.name_ar : cat.name_en : "";
  }, [categories, isArabic]);
  const handleParentCategorySelect = (cat) => {
    setSelectedParentCategoryId(cat.id);
    setParentCategorySearch(isArabic ? cat.name_ar : cat.name_en);
    setIsParentCategoryOpen(false);
    setSelectedSubCategoryId("");
    setSubCategorySearch("");
  };
  const handleSubCategorySelect = (cat) => {
    setSelectedSubCategoryId(cat.id);
    setSubCategorySearch(isArabic ? cat.name_ar : cat.name_en);
    setIsSubCategoryOpen(false);
  };
  const clearParentCategory = () => {
    setSelectedParentCategoryId("");
    setParentCategorySearch("");
    setSelectedSubCategoryId("");
    setSubCategorySearch("");
  };
  const clearSubCategory = () => {
    setSelectedSubCategoryId("");
    setSubCategorySearch("");
  };
  const generateProfessionalDisplayText = () => {
    const mainProduct = listings.find((l) => l.id === requirements[0]?.listing_id);
    const productName = isArabic ? mainProduct?.title_ar || "المنتج" : mainProduct?.title_en || mainProduct?.title_ar || "Product";
    const buyQty = requirements.reduce((sum, r) => sum + r.quantity, 0);
    const getQty = result.quantity;
    const giftProduct = listings.find((l) => l.id === result.listing_id);
    const giftName = isArabic ? giftProduct?.title_ar || "منتج آخر" : giftProduct?.title_en || giftProduct?.title_ar || "another product";
    if (offerType === "bogo") {
      if (mainProduct && productName !== (isArabic ? "المنتج" : "Product")) {
        return isArabic ? `🛒 عرض مزدوج: اشتري ${buyQty} من "${productName}" واحصل على ${getQty} مجاناً ✨` : `🛒 Double Deal: Buy ${buyQty} "${productName}" & Get ${getQty} Free ✨`;
      }
      return isArabic ? `🎁 عرض مميز: اشتري ${buyQty} واحصل على ${getQty} مجاناً` : `🎁 Special Offer: Buy ${buyQty} Get ${getQty} Free`;
    }
    if (offerType === "cross_sell") {
      if (mainProduct && giftProduct) {
        return isArabic ? `🛍️ صفقة رائعة: ${productName} + ${giftName} مجاناً 🎉` : `🛍️ Great Deal: ${productName} + ${giftName} Free 🎉`;
      }
      return isArabic ? `💎 عرض حصري: منتج + آخر مجاناً` : `💎 Exclusive: Buy One Get One Free`;
    }
    if (offerType === "bundle") {
      const productNames = requirements.map((r) => {
        const p = listings.find((l) => l.id === r.listing_id);
        return isArabic ? p?.title_ar || "منتج" : p?.title_en || p?.title_ar || "Product";
      }).slice(0, 2).join(isArabic ? " + " : " + ");
      const extraCount = requirements.length - 2;
      let bundleText = productNames;
      if (extraCount > 0) {
        bundleText += isArabic ? ` + ${extraCount} منتجات` : ` + ${extraCount} products`;
      }
      return isArabic ? `📦 باقة ${bundleText} + ${getQty} مجاناً 🎁` : `📦 Bundle ${bundleText} + ${getQty} Free 🎁`;
    }
    return isArabic ? `🏷️ عرض خاص: ${buyQty} + ${getQty} مجاناً` : `🏷️ Special Offer: ${buyQty} + ${getQty} Free`;
  };
  const getPreviewText = () => {
    return generateProfessionalDisplayText();
  };
  const addRequirement = () => {
    setRequirements([...requirements, { listing_id: "", variations: { mode: "all", ids: [] }, quantity: 1, variationQuantities: {} }]);
  };
  const removeRequirement = (index) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    }
  };
  const updateRequirement = (index, field, value) => {
    const newReqs = [...requirements];
    newReqs[index] = { ...newReqs[index], [field]: value };
    {
      newReqs[index].variations = { mode: "all", ids: [] };
      newReqs[index].variationQuantities = {};
    }
    setRequirements(newReqs);
  };
  const autoDistributeQuantities = reactExports.useCallback((variationIds, totalQty) => {
    if (!variationIds || variationIds.length === 0) return {};
    const perVariation = Math.floor(totalQty / variationIds.length);
    const remainder = totalQty % variationIds.length;
    const quantities = {};
    variationIds.forEach((id, index) => {
      quantities[id] = perVariation + (index < remainder ? 1 : 0);
    });
    return quantities;
  }, []);
  const toggleVariation = (target, reqIndex, variationId) => {
    if (target === "requirements" && reqIndex !== null) {
      const newReqs = [...requirements];
      const current = newReqs[reqIndex].variations.ids;
      newReqs[reqIndex].variations.ids = current.includes(variationId) ? current.filter((id) => id !== variationId) : [...current, variationId];
      if (newReqs[reqIndex].variations.ids.length === 0) {
        newReqs[reqIndex].variationQuantities = {};
      } else {
        const totalQty = newReqs[reqIndex].quantity || 1;
        const ids = newReqs[reqIndex].variations.ids;
        newReqs[reqIndex].variationQuantities = autoDistributeQuantities(ids, totalQty);
      }
      setRequirements(newReqs);
    } else if (target === "result") {
      const current = result.variations.ids;
      const newIds = current.includes(variationId) ? current.filter((id) => id !== variationId) : [...current, variationId];
      let newVariationQuantities = { ...result.variationQuantities || {} };
      if (newIds.length === 0) {
        newVariationQuantities = {};
      } else {
        const totalQty = result.quantity || 1;
        newVariationQuantities = autoDistributeQuantities(newIds, totalQty);
      }
      setResult({
        ...result,
        variations: { ...result.variations, ids: newIds },
        variationQuantities: newVariationQuantities
      });
    }
  };
  const setVariationMode = (target, reqIndex, mode) => {
    if (target === "requirements" && reqIndex !== null) {
      const newReqs = [...requirements];
      newReqs[reqIndex].variations = { mode, ids: [] };
      newReqs[reqIndex].variationQuantities = {};
      setRequirements(newReqs);
      if (mode === "all") {
        setSelectedVariationPrice(null);
      }
    } else if (target === "result") {
      setResult({ ...result, variations: { mode, ids: [] }, variationQuantities: {} });
    }
  };
  const handleRequirementVariationQuantityChange = reactExports.useCallback((reqIndex, variationId, delta) => {
    setRequirements((prev) => {
      const newReqs = [...prev];
      const req = newReqs[reqIndex];
      const currentQuantities = req.variationQuantities || {};
      const currentQty = currentQuantities[variationId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const totalQty = req.quantity || 1;
      const currentTotal = Object.values(currentQuantities).reduce((sum, qty) => sum + qty, 0);
      if (delta > 0 && currentTotal >= totalQty) {
        toast.warning(isArabic ? "⚠️ تم الوصول للحد الأقصى للكمية" : "⚠️ Maximum quantity reached");
        return prev;
      }
      const newQuantities = { ...currentQuantities };
      if (newQty === 0) {
        delete newQuantities[variationId];
      } else {
        newQuantities[variationId] = newQty;
      }
      newReqs[reqIndex] = { ...req, variationQuantities: newQuantities };
      return newReqs;
    });
  }, [isArabic]);
  const handleGiftVariationQuantityChange = reactExports.useCallback((variationId, delta) => {
    setResult((prev) => {
      const currentQuantities = prev.variationQuantities || {};
      const currentQty = currentQuantities[variationId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      const totalQty = prev.quantity || 1;
      const currentTotal = Object.values(currentQuantities).reduce((sum, qty) => sum + qty, 0);
      if (delta > 0 && currentTotal >= totalQty) {
        toast.warning(isArabic ? "⚠️ تم الوصول للحد الأقصى للكمية" : "⚠️ Maximum quantity reached");
        return prev;
      }
      const newQuantities = { ...currentQuantities };
      if (newQty === 0) {
        delete newQuantities[variationId];
      } else {
        newQuantities[variationId] = newQty;
      }
      return { ...prev, variationQuantities: newQuantities };
    });
  }, [isArabic]);
  const distributeRemainingRequirementQuantity = reactExports.useCallback((reqIndex, variations) => {
    setRequirements((prev) => {
      const newReqs = [...prev];
      const req = newReqs[reqIndex];
      const totalQty = req.quantity || 1;
      const currentQuantities = req.variationQuantities || {};
      const currentTotal = Object.values(currentQuantities).reduce((sum, qty) => sum + qty, 0);
      const remaining = totalQty - currentTotal;
      if (remaining <= 0) {
        toast.info(isArabic ? "✅ الكمية مكتملة" : "✅ Quantity is complete");
        return prev;
      }
      const availableVariations = variations.filter(
        (v) => !currentQuantities[v.id] || currentQuantities[v.id] > 0
      );
      if (availableVariations.length === 0) return prev;
      const perVariation = Math.floor(remaining / availableVariations.length);
      const remainder = remaining % availableVariations.length;
      const newQuantities = { ...currentQuantities };
      availableVariations.forEach((v, index) => {
        newQuantities[v.id] = (newQuantities[v.id] || 0) + perVariation + (index < remainder ? 1 : 0);
      });
      toast.success(
        isArabic ? `✅ تم توزيع ${remaining} المتبقية على ${availableVariations.length} تشكيلات` : `✅ Distributed ${remaining} remaining to ${availableVariations.length} variations`
      );
      newReqs[reqIndex] = { ...req, variationQuantities: newQuantities };
      return newReqs;
    });
  }, [isArabic]);
  const distributeRemainingGiftQuantity = reactExports.useCallback((variations) => {
    setResult((prev) => {
      const totalQty = prev.quantity || 1;
      const currentQuantities = prev.variationQuantities || {};
      const currentTotal = Object.values(currentQuantities).reduce((sum, qty) => sum + qty, 0);
      const remaining = totalQty - currentTotal;
      if (remaining <= 0) {
        toast.info(isArabic ? "✅ الكمية مكتملة" : "✅ Quantity is complete");
        return prev;
      }
      const availableVariations = variations.filter(
        (v) => !currentQuantities[v.id] || currentQuantities[v.id] > 0
      );
      if (availableVariations.length === 0) return prev;
      const perVariation = Math.floor(remaining / availableVariations.length);
      const remainder = remaining % availableVariations.length;
      const newQuantities = { ...currentQuantities };
      availableVariations.forEach((v, index) => {
        newQuantities[v.id] = (newQuantities[v.id] || 0) + perVariation + (index < remainder ? 1 : 0);
      });
      toast.success(
        isArabic ? `✅ تم توزيع ${remaining} المتبقية على ${availableVariations.length} تشكيلات` : `✅ Distributed ${remaining} remaining to ${availableVariations.length} variations`
      );
      return { ...prev, variationQuantities: newQuantities };
    });
  }, [isArabic]);
  const handleSubmit = async () => {
    if (requirements.some((r) => !r.listing_id)) {
      setError(isArabic ? "❌ الرجاء اختيار جميع المنتجات المطلوبة" : "❌ Please select all required products");
      return;
    }
    if (!result.listing_id) {
      setError(isArabic ? "❌ الرجاء اختيار منتج الهدية" : "❌ Please select the gift product");
      return;
    }
    if (!selectedParentCategoryId) {
      setError(isArabic ? "❌ الرجاء اختيار التصنيف الرئيسي" : "❌ Please select a main category");
      return;
    }
    const giftHasVariationsOrColors = hasVariationsOrColors(result.listing_id);
    if (giftHasVariationsOrColors && result.variations.mode === "all") {
      setError(
        isArabic ? "❌ منتج الهدية يحتوي على تشكيلات أو ألوان، الرجاء اختيار تشكيل محدد للهدية" : "❌ Gift product has variations or colors, please select a specific variation for the gift"
      );
      return;
    }
    if (giftHasVariationsOrColors && result.variations.mode === "selected" && result.variations.ids.length === 0) {
      setError(
        isArabic ? "❌ الرجاء اختيار تشكيل واحد على الأقل للهدية" : "❌ Please select at least one variation for the gift"
      );
      return;
    }
    for (let i = 0; i < requirements.length; i++) {
      const req = requirements[i];
      const hasVariationsOrColors2 = getProductVariationsOrColors(req.listing_id).length > 0;
      if (hasVariationsOrColors2 && req.variations.mode === "selected" && req.variations.ids.length > 0) {
        const totalQty = req.quantity || 1;
        const variationQuantities2 = req.variationQuantities || {};
        const distributedTotal = Object.values(variationQuantities2).reduce((sum, qty) => sum + qty, 0);
        if (distributedTotal !== totalQty) {
          const newQuantities = autoDistributeQuantities(req.variations.ids, totalQty);
          const newReqs = [...requirements];
          newReqs[i] = { ...req, variationQuantities: newQuantities };
          setRequirements(newReqs);
          const finalDistributedTotal2 = Object.values(newQuantities).reduce((sum, qty) => sum + qty, 0);
          if (finalDistributedTotal2 !== totalQty) {
            setError(
              isArabic ? `❌ مجموع الكميات الموزعة في الشرط ${i + 1} (${finalDistributedTotal2}) لا يساوي الكمية الإجمالية (${totalQty})` : `❌ Total distributed quantity in requirement ${i + 1} (${finalDistributedTotal2}) doesn't match total (${totalQty})`
            );
            return;
          }
        }
        const finalDistributedTotal = Object.values(req.variationQuantities || {}).reduce((sum, qty) => sum + qty, 0);
        if (finalDistributedTotal !== totalQty) {
          setError(
            isArabic ? `❌ مجموع الكميات الموزعة في الشرط ${i + 1} (${finalDistributedTotal}) لا يساوي الكمية الإجمالية (${totalQty})` : `❌ Total distributed quantity in requirement ${i + 1} (${finalDistributedTotal}) doesn't match total (${totalQty})`
          );
          return;
        }
        const hasZeroQuantity = req.variations.ids.some((id) => (req.variationQuantities?.[id] || 0) === 0);
        if (hasZeroQuantity) {
          setError(
            isArabic ? `❌ جميع التشكيلات المختارة في الشرط ${i + 1} يجب أن يكون لها كمية أكبر من 0` : `❌ All selected variations in requirement ${i + 1} must have quantity greater than 0`
          );
          return;
        }
      }
    }
    let variationQuantities = { ...result.variationQuantities || {} };
    if (giftHasVariationsOrColors && result.variations.mode === "selected" && result.variations.ids.length > 0) {
      const totalQty = result.quantity || 1;
      const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
      if (distributedTotal !== totalQty) {
        variationQuantities = autoDistributeQuantities(result.variations.ids, totalQty);
      }
      const finalDistributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
      if (finalDistributedTotal !== totalQty) {
        setError(
          isArabic ? `❌ مجموع الكميات الموزعة (${finalDistributedTotal}) لا يساوي الكمية الإجمالية للهدية (${totalQty})` : `❌ Total distributed quantity (${finalDistributedTotal}) doesn't match gift total (${totalQty})`
        );
        return;
      }
      const hasZeroQuantity = result.variations.ids.some((id) => (variationQuantities[id] || 0) === 0);
      if (hasZeroQuantity) {
        setError(
          isArabic ? "❌ جميع التشكيلات المختارة يجب أن يكون لها كمية أكبر من 0" : "❌ All selected variations must have quantity greater than 0"
        );
        return;
      }
    }
    if (offerType === "bundle" && requirements.length < 2) {
      setError(isArabic ? "❌ الباقة تحتاج إلى منتجين على الأقل" : "❌ Bundle needs at least 2 products");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const finalCategoryId = selectedSubCategoryId || selectedParentCategoryId;
      const data = {
        listing_id: requirements[0].listing_id,
        store_id: app.user?.id,
        offer_type: offerType,
        buy_quantity: requirements.reduce((sum, r) => sum + r.quantity, 0),
        get_quantity: result.quantity,
        free_listing_id: offerType === "bogo" ? null : result.listing_id,
        variation_ids: requirements[0].variations.mode === "selected" ? requirements[0].variations.ids : null,
        required_product_ids: requirements.map((r) => r.listing_id),
        required_variations: requirements.map((r) => ({
          product_id: r.listing_id,
          variation_ids: r.variations.mode === "selected" ? r.variations.ids : [],
          quantity: r.quantity,
          variation_quantities: r.variationQuantities || {}
        })),
        result_variation_ids: result.variations.mode === "selected" ? result.variations.ids : null,
        starts_at: (/* @__PURE__ */ new Date()).toISOString(),
        expires_at: isPermanent ? null : expiresAt || null,
        is_active: true,
        display_text_ar: getPreviewText(),
        display_text_en: getPreviewText(),
        category_id: finalCategoryId,
        parent_category_id: selectedParentCategoryId,
        metadata: {
          variation_quantities: variationQuantities,
          requirement_variation_quantities: requirements.map((r) => ({
            product_id: r.listing_id,
            quantities: r.variationQuantities || {}
          }))
        }
      };
      if (existingOffer) {
        await updateOffer.mutateAsync({ id: existingOffer.id, ...data });
      } else {
        await createOffer.mutateAsync(data);
      }
      toast.success(isArabic ? "✅ تم إضافة العرض الترويجي بنجاح" : "✅ Promo offer added successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error2) {
      console.error("Error saving offer:", error2);
      setError(error2?.message || (isArabic ? "❌ فشل حفظ العرض" : "❌ Failed to save offer"));
    } finally {
      setIsSubmitting(false);
    }
  };
  reactExports.useEffect(() => {
    if (!open) {
      return;
    }
    if (existingOffer) {
      if (isUpdatingFromExisting.current) {
        return;
      }
      isUpdatingFromExisting.current = true;
      setOfferType(existingOffer.offer_type || "bogo");
      if (categories.length > 0) {
        if (existingOffer.parent_category_id) {
          setSelectedParentCategoryId(existingOffer.parent_category_id);
          setParentCategorySearch(getCategoryName(existingOffer.parent_category_id));
          if (existingOffer.category_id && existingOffer.category_id !== existingOffer.parent_category_id) {
            setSelectedSubCategoryId(existingOffer.category_id);
            setSubCategorySearch(getCategoryName(existingOffer.category_id));
          } else {
            setSelectedSubCategoryId("");
            setSubCategorySearch("");
          }
        } else if (existingOffer.category_id) {
          const cat = categories.find((c) => c.id === existingOffer.category_id);
          if (cat) {
            if (cat.parent_id) {
              setSelectedParentCategoryId(cat.parent_id);
              setParentCategorySearch(getCategoryName(cat.parent_id));
              setSelectedSubCategoryId(existingOffer.category_id);
              setSubCategorySearch(getCategoryName(existingOffer.category_id));
            } else {
              setSelectedParentCategoryId(existingOffer.category_id);
              setParentCategorySearch(getCategoryName(existingOffer.category_id));
              setSelectedSubCategoryId("");
              setSubCategorySearch("");
            }
          }
        }
      }
      if (existingOffer.required_product_ids && existingOffer.required_product_ids.length > 0) {
        const requirementsData = existingOffer.required_product_ids.map((productId, index) => {
          let variations = { mode: "all", ids: [] };
          let quantity = 1;
          let variationQuantities = {};
          if (existingOffer.required_variations && existingOffer.required_variations[index]) {
            const reqVar = existingOffer.required_variations[index];
            if (reqVar.variation_ids && reqVar.variation_ids.length > 0) {
              variations = { mode: "selected", ids: reqVar.variation_ids };
            }
            quantity = reqVar.quantity || 1;
            if (reqVar.variation_quantities) {
              variationQuantities = reqVar.variation_quantities;
            } else if (reqVar.variation_ids && reqVar.variation_ids.length > 0) {
              variationQuantities = autoDistributeQuantities(reqVar.variation_ids, quantity);
            }
          }
          return {
            listing_id: productId,
            variations,
            quantity,
            variationQuantities
          };
        });
        setRequirements(requirementsData);
      }
      const isBogo = existingOffer.offer_type === "bogo";
      const giftListingId = isBogo ? existingOffer.listing_id : existingOffer.free_listing_id;
      if (giftListingId) {
        let variations = { mode: "all", ids: [] };
        let variationQuantities = {};
        if (existingOffer.result_variation_ids && existingOffer.result_variation_ids.length > 0) {
          variations = { mode: "selected", ids: existingOffer.result_variation_ids };
          if (existingOffer.metadata?.variation_quantities) {
            variationQuantities = existingOffer.metadata.variation_quantities;
          } else {
            const totalQty = existingOffer.get_quantity || 1;
            const ids = existingOffer.result_variation_ids;
            variationQuantities = autoDistributeQuantities(ids, totalQty);
          }
        } else {
          const giftHasVarsOrColors = hasVariationsOrColors(giftListingId);
          if (giftHasVarsOrColors) {
            variations = { mode: "selected", ids: [] };
          }
        }
        setResult({
          listing_id: giftListingId,
          variations,
          quantity: existingOffer.get_quantity || 1,
          variationQuantities
        });
      } else {
        const fallbackListingId = existingOffer.listing_id;
        if (fallbackListingId) {
          setResult({
            listing_id: fallbackListingId,
            variations: { mode: "all", ids: [] },
            quantity: existingOffer.get_quantity || 1,
            variationQuantities: {}
          });
        }
      }
      if (existingOffer.expires_at) {
        setIsPermanent(false);
        const date = new Date(existingOffer.expires_at);
        const formattedDate = date.toISOString().slice(0, 16);
        setExpiresAt(formattedDate);
      } else {
        setIsPermanent(true);
        setExpiresAt("");
      }
      isUpdatingFromExisting.current = false;
      return;
    }
    setOfferType("bogo");
    setSelectedParentCategoryId("");
    setSelectedSubCategoryId("");
    setParentCategorySearch("");
    setSubCategorySearch("");
    setRequirements([{
      listing_id: initialProduct?.id || "",
      variations: { mode: "all", ids: [] },
      quantity: 1,
      variationQuantities: {}
    }]);
    setResult({
      listing_id: initialProduct?.id && offerType === "bogo" ? initialProduct.id : "",
      variations: { mode: "all", ids: [] },
      quantity: 1,
      variationQuantities: {}
    });
    setExpiresAt("");
    setIsPermanent(true);
    setError(null);
    setSelectedVariationPrice(null);
  }, [open, existingOffer, initialProduct, categories, isArabic, autoDistributeQuantities, getCategoryName]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40 shadow-2xl shadow-[#2a655f]/20 bg-white dark:bg-slate-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-xl text-[#2a655f]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5" }) }),
      existingOffer ? isArabic ? "✏️ تعديل عرض ترويجي" : "✏️ Edit Promo Offer" : isArabic ? "🎁 إضافة عرض ترويجي" : "🎁 Add Promo Offer"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📁" }),
            isArabic ? "التصنيف الرئيسي" : "Main Category",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: parentCategoryDropdownRef, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ref: parentCategoryInputRef,
                  value: parentCategorySearch,
                  onChange: (e) => {
                    setParentCategorySearch(e.target.value);
                    setIsParentCategoryOpen(true);
                  },
                  onFocus: () => setIsParentCategoryOpen(true),
                  placeholder: isArabic ? "🔍 ابحث عن التصنيف الرئيسي..." : "🔍 Search main category...",
                  className: "ps-9 h-11 rounded-xl border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 bg-white dark:bg-slate-900"
                }
              ),
              parentCategorySearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: clearParentCategory,
                  className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            isParentCategoryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-xl shadow-[#2a655f]/20", children: filteredMainCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground text-center", children: isArabic ? "❌ لا توجد تصنيفات" : "❌ No categories" }) : filteredMainCategories.map((cat) => {
              const childCount = categories.filter((c) => c.parent_id === cat.id && c.active !== false).length;
              const isSelected = selectedParentCategoryId === cat.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: cn(
                    "w-full text-start px-4 py-3 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                    isSelected && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30"
                  ),
                  onClick: () => handleParentCategorySelect(cat),
                  children: [
                    isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: isArabic ? cat.name_ar : cat.name_en }),
                    childCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px]", children: [
                      childCount,
                      " ",
                      isArabic ? "فرعي" : "sub"
                    ] })
                  ]
                },
                cat.id
              );
            }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "📂" }),
            isArabic ? "التصنيف الفرعي" : "Subcategory",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400", children: isArabic ? "اختياري" : "Optional" })
          ] }),
          !selectedParentCategoryId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 h-11 px-4 rounded-xl border-3 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-slate-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-500", children: isArabic ? "اختر الرئيسي أولاً" : "Select main first" })
          ] }) : !hasSubCategories ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 h-11 px-4 rounded-xl border-3 border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-emerald-600 dark:text-emerald-400 font-medium", children: isArabic ? "✅ سيُستخدم الرئيسي" : "✅ Main will be used" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: subCategoryDropdownRef, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ref: subCategoryInputRef,
                  value: subCategorySearch,
                  onChange: (e) => {
                    setSubCategorySearch(e.target.value);
                    setIsSubCategoryOpen(true);
                  },
                  onFocus: () => setIsSubCategoryOpen(true),
                  placeholder: isArabic ? "🔍 ابحث عن التصنيف الفرعي..." : "🔍 Search subcategory...",
                  className: "ps-9 h-11 rounded-xl border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 bg-white dark:bg-slate-900"
                }
              ),
              subCategorySearch && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: clearSubCategory,
                  className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            isSubCategoryOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-xl shadow-[#2a655f]/20", children: filteredSubCategories.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-sm text-muted-foreground text-center", children: isArabic ? "❌ لا توجد نتائج" : "❌ No results" }) : filteredSubCategories.map((cat) => {
              const isSelected = selectedSubCategoryId === cat.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: cn(
                    "w-full text-start px-4 py-3 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                    isSelected && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30"
                  ),
                  onClick: () => handleSubCategorySelect(cat),
                  children: [
                    isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? cat.name_ar : cat.name_en })
                  ]
                },
                cat.id
              );
            }) })
          ] })
        ] })
      ] }),
      selectedParentCategoryId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2.5 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/5 rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-4 w-4 text-[#2a655f]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-600 dark:text-slate-400", children: isArabic ? "التصنيف:" : "Category:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]", children: [
          "📁 ",
          getCategoryName(selectedParentCategoryId)
        ] }),
        selectedSubCategoryId && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CornerDownRight, { className: "h-3 w-3 text-[#2a655f]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]", children: [
            "📂 ",
            getCategoryName(selectedSubCategoryId)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold text-slate-700 dark:text-slate-300", children: isArabic ? "📌 نوع العرض" : "📌 Offer Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setOfferType("bogo"),
              className: cn(
                "p-3 rounded-xl border-3 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                offerType === "bogo" ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f] shadow-sm shadow-[#2a655f]/10" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-[#2a655f]/5"
              ),
              children: [
                "🎁 ",
                isArabic ? "نفس المنتج" : "Same Product"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setOfferType("cross_sell"),
              className: cn(
                "p-3 rounded-xl border-3 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                offerType === "cross_sell" ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f] shadow-sm shadow-[#2a655f]/10" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-[#2a655f]/5"
              ),
              children: [
                "🔄 ",
                isArabic ? "منتج مختلف" : "Different Product"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setOfferType("bundle"),
              className: cn(
                "p-3 rounded-xl border-3 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                offerType === "bundle" ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f] shadow-sm shadow-[#2a655f]/10" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-[#2a655f]/5"
              ),
              children: [
                "📦 ",
                isArabic ? "باقة منتجات" : "Bundle"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2", children: [
            "🛍️ ",
            isArabic ? "الشروط (المنتجات المطلوبة)" : "Requirements (Required Products)",
            offerType === "bundle" && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]", children: isArabic ? "باقة" : "Bundle" })
          ] }),
          offerType === "bundle" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-2 text-[10px] border-3 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10",
              onClick: addRequirement,
              type: "button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3 mr-1" }),
                isArabic ? "إضافة منتج" : "Add Product"
              ]
            }
          )
        ] }),
        requirements.map((req, index) => {
          const variations = getProductVariationsOrColors(req.listing_id);
          const totalQty = req.quantity || 1;
          const variationQuantities = req.variationQuantities || {};
          const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
          const remaining = totalQty - distributedTotal;
          const hasSelectedVariations = req.variations.mode === "selected" && req.variations.ids.length > 0;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-white dark:bg-slate-900 rounded-xl border-3 border-slate-200/50 dark:border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                  isArabic ? "المنتج" : "Product",
                  index === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500 ml-1", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    value: req.listing_id,
                    onValueChange: (v) => updateRequirement(index, "listing_id", v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1 rounded-xl border-3 border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر المنتج" : "Select product" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "rounded-xl max-h-40", children: listings.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: l.id, children: [
                        l.title_ar,
                        " - ",
                        formatPrice(Number(l.price), app.currency, app.lang)
                      ] }, l.id)) })
                    ]
                  }
                )
              ] }),
              variations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                  "🎨 ",
                  isArabic ? "التشكيلات والألوان" : "Variations & Colors"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setVariationMode("requirements", index, "all"),
                      className: cn(
                        "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300",
                        req.variations.mode === "all" ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
                      ),
                      children: [
                        "✅ ",
                        isArabic ? "كل الخيارات" : "All"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setVariationMode("requirements", index, "selected"),
                      className: cn(
                        "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300",
                        req.variations.mode === "selected" ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
                      ),
                      children: [
                        "🎯 ",
                        isArabic ? "خيارات محددة" : "Specific"
                      ]
                    }
                  )
                ] }),
                req.variations.mode === "selected" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-1.5", children: variations.map((v) => {
                  const combo = v.combination || {};
                  const comboText = Object.entries(combo).map(([key, value]) => `${key}: ${value}`).join(" ");
                  const isSelected = req.variations.ids.includes(v.id);
                  const price = v.price || v.old_price || getProductPrice(req.listing_id);
                  const currentQty = variationQuantities[v.id] || 0;
                  const isColor = v._type === "color";
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => toggleVariation("requirements", index, v.id),
                      className: cn(
                        "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300 flex items-center gap-1",
                        isSelected ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-slate-100/50"
                      ),
                      children: [
                        isColor && v.combination?.hex && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "w-3 h-3 rounded-full border border-slate-200 flex-shrink-0",
                            style: { backgroundColor: v.combination.hex }
                          }
                        ),
                        comboText || v.id.slice(0, 6),
                        price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-emerald-500 ml-1", children: formatPrice(Number(price), app.currency, app.lang) }),
                        isSelected && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] text-emerald-600 ml-1", children: [
                          "(×",
                          currentQty,
                          ")"
                        ] })
                      ]
                    },
                    v.id
                  );
                }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                  "📦 ",
                  isArabic ? "الكمية المطلوبة" : "Required Quantity"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 w-7 rounded-full hover:bg-[#2a655f]/10 border-3 border-[#2a655f]/30",
                      onClick: () => {
                        const newReqs = [...requirements];
                        const newQty = Math.max(1, req.quantity - 1);
                        newReqs[index].quantity = newQty;
                        if (req.variations.mode === "selected" && req.variations.ids.length > 0) {
                          newReqs[index].variationQuantities = autoDistributeQuantities(req.variations.ids, newQty);
                        }
                        setRequirements(newReqs);
                      },
                      type: "button",
                      children: "-"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center font-bold text-[#2a655f]", children: req.quantity }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-7 w-7 rounded-full hover:bg-[#2a655f]/10 border-3 border-[#2a655f]/30",
                      onClick: () => {
                        const newReqs = [...requirements];
                        const newQty = req.quantity + 1;
                        newReqs[index].quantity = newQty;
                        if (req.variations.mode === "selected" && req.variations.ids.length > 0) {
                          newReqs[index].variationQuantities = autoDistributeQuantities(req.variations.ids, newQty);
                        }
                        setRequirements(newReqs);
                      },
                      type: "button",
                      children: "+"
                    }
                  )
                ] })
              ] }),
              hasSelectedVariations && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2", children: [
                    "📊 ",
                    isArabic ? "توزيع الكميات" : "Distribution",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn(
                      "border-0 text-[9px]",
                      distributedTotal === totalQty ? "bg-emerald-500/20 text-emerald-600" : "bg-amber-500/20 text-amber-600"
                    ), children: [
                      distributedTotal,
                      "/",
                      totalQty
                    ] })
                  ] }),
                  remaining > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => distributeRemainingRequirementQuantity(
                        index,
                        variations.filter((v) => req.variations.ids.includes(v.id))
                      ),
                      className: "text-[10px] text-[#2a655f] hover:underline transition-colors flex items-center gap-1 px-2 py-1 border-3 border-[#2a655f]/30 rounded-lg hover:bg-[#2a655f]/5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
                        isArabic ? `وزع ${remaining}` : `Distribute ${remaining}`
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: req.variations.ids.map((id) => {
                  const variation = variations.find((v) => v.id === id);
                  if (!variation) return null;
                  const combo = variation.combination || {};
                  const comboText = Object.entries(combo).map(([key, value]) => `${key}: ${value}`).join(" • ");
                  const currentQty = variationQuantities[id] || 0;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 border-3 rounded-xl border-[#2a655f]/30 bg-white/50 dark:bg-slate-800/50", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-slate-700 dark:text-slate-300", children: comboText }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleRequirementVariationQuantityChange(index, id, -1),
                          className: cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border-3",
                            currentQty > 0 ? "bg-slate-200 hover:bg-slate-300 border-slate-300" : "bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200"
                          ),
                          disabled: currentQty === 0,
                          children: "-"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center font-bold text-[#2a655f] text-sm", children: currentQty }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => handleRequirementVariationQuantityChange(index, id, 1),
                          className: cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border-3",
                            distributedTotal < totalQty ? "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white border-[#2a655f]" : "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300"
                          ),
                          disabled: distributedTotal >= totalQty,
                          children: "+"
                        }
                      )
                    ] })
                  ] }, id);
                }) })
              ] })
            ] }),
            offerType === "bundle" && requirements.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-8 w-8 p-0 rounded-xl text-red-500 hover:bg-red-50/50",
                onClick: () => removeRequirement(index),
                type: "button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) }, index);
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border-3 border-emerald-200/50 dark:border-emerald-800/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2", children: [
          "🎁 ",
          isArabic ? "النتيجة (الهدية)" : "Result (Gift)",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: isArabic ? "المنتج" : "Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: result.listing_id,
              onValueChange: (v) => {
                const hasGiftVarsOrColors = hasVariationsOrColors(v);
                setResult({
                  ...result,
                  listing_id: v,
                  variations: hasGiftVarsOrColors ? { mode: "selected", ids: [] } : { mode: "all", ids: [] },
                  variationQuantities: {}
                });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1 rounded-xl border-3 border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: isArabic ? "اختر منتج الهدية" : "Select gift product" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "rounded-xl max-h-40", children: listings.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  SelectItem,
                  {
                    value: l.id,
                    disabled: offerType === "bogo" && l.id !== requirements[0]?.listing_id,
                    children: [
                      l.title_ar,
                      " - ",
                      formatPrice(Number(l.price), app.currency, app.lang)
                    ]
                  },
                  l.id
                )) })
              ]
            }
          )
        ] }),
        result.listing_id && (() => {
          const resultVariations = getProductVariationsOrColors(result.listing_id);
          const giftHasVarsOrColors = resultVariations.length > 0;
          const totalQty = result.quantity || 1;
          const variationQuantities = result.variationQuantities || {};
          const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
          const remaining = totalQty - distributedTotal;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            giftHasVarsOrColors && /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1", children: [
                "🎨 ",
                isArabic ? "خيارات الهدية (إجباري)" : "Gift Options (Required)",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setVariationMode("result", null, "selected"),
                  className: cn(
                    "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300",
                    result.variations.mode === "selected" ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
                  ),
                  children: [
                    "🎯 ",
                    isArabic ? "خيار محدد" : "Specific Option"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-1.5", children: resultVariations.map((v) => {
                const combo = v.combination || {};
                const comboText = Object.entries(combo).map(([key, value]) => `${key}: ${value}`).join(" ");
                const isSelected = result.variations.ids.includes(v.id);
                const currentQty = variationQuantities[v.id] || 0;
                const isColor = v._type === "color";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleVariation("result", null, v.id),
                    className: cn(
                      "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300 flex items-center gap-1",
                      isSelected ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
                    ),
                    children: [
                      isColor && v.combination?.hex && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "w-3 h-3 rounded-full border border-slate-200 flex-shrink-0",
                          style: { backgroundColor: v.combination.hex }
                        }
                      ),
                      comboText || v.id.slice(0, 6),
                      isSelected && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[8px] text-emerald-600 ml-1", children: [
                        "(×",
                        currentQty,
                        ")"
                      ] })
                    ]
                  },
                  v.id
                );
              }) })
            ] }) }),
            !giftHasVarsOrColors && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-1", children: [
              "✅ ",
              isArabic ? "هذا المنتج لا يحتوي على خيارات" : "No options"
            ] }),
            giftHasVarsOrColors && result.variations.mode === "selected" && result.variations.ids.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#2a655f]/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium flex items-center gap-2", children: [
                  "📊 ",
                  isArabic ? "توزيع الكميات" : "Distribution",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn(
                    "border-0 text-[9px]",
                    distributedTotal === totalQty ? "bg-emerald-500/20 text-emerald-600" : "bg-amber-500/20 text-amber-600"
                  ), children: [
                    distributedTotal,
                    "/",
                    totalQty
                  ] })
                ] }),
                remaining > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => distributeRemainingGiftQuantity(
                      resultVariations.filter((v) => result.variations.ids.includes(v.id))
                    ),
                    className: "text-[10px] text-[#2a655f] hover:underline flex items-center gap-1 px-2 py-1 border-3 border-[#2a655f]/30 rounded-lg hover:bg-[#2a655f]/5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3" }),
                      isArabic ? `وزع ${remaining}` : `Distribute ${remaining}`
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: result.variations.ids.map((id) => {
                const variation = resultVariations.find((v) => v.id === id);
                if (!variation) return null;
                const combo = variation.combination || {};
                const comboText = Object.entries(combo).map(([key, value]) => `${key}: ${value}`).join(" • ");
                const currentQty = variationQuantities[id] || 0;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 p-2 border-3 rounded-xl border-[#2a655f]/30 bg-white/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: comboText }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleGiftVariationQuantityChange(id, -1),
                        className: "h-6 w-6 rounded-full bg-slate-200 hover:bg-slate-300 text-xs font-bold border-3 border-slate-300",
                        disabled: currentQty === 0,
                        children: "-"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center font-bold text-[#2a655f] text-sm", children: currentQty }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleGiftVariationQuantityChange(id, 1),
                        className: cn(
                          "h-6 w-6 rounded-full text-xs font-bold border-3",
                          distributedTotal < totalQty ? "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white border-[#2a655f]" : "bg-slate-200 text-slate-400 border-slate-300"
                        ),
                        disabled: distributedTotal >= totalQty,
                        children: "+"
                      }
                    )
                  ] })
                ] }, id);
              }) })
            ] })
          ] });
        })(),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
            "📦 ",
            isArabic ? "الكمية الإجمالية للهدية" : "Total Gift Quantity"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "h-7 w-7 rounded-full hover:bg-[#2a655f]/10 border-3 border-[#2a655f]/30",
                onClick: () => {
                  const newQty = Math.max(1, result.quantity - 1);
                  let newVariationQuantities = { ...result.variationQuantities || {} };
                  if (result.variations.mode === "selected" && result.variations.ids.length > 0) {
                    newVariationQuantities = autoDistributeQuantities(result.variations.ids, newQty);
                  }
                  setResult({ ...result, quantity: newQty, variationQuantities: newVariationQuantities });
                },
                type: "button",
                children: "-"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 text-center font-bold text-[#2a655f]", children: result.quantity }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "h-7 w-7 rounded-full hover:bg-[#2a655f]/10 border-3 border-[#2a655f]/30",
                onClick: () => {
                  const newQty = result.quantity + 1;
                  let newVariationQuantities = { ...result.variationQuantities || {} };
                  if (result.variations.mode === "selected" && result.variations.ids.length > 0) {
                    newVariationQuantities = autoDistributeQuantities(result.variations.ids, newQty);
                  }
                  setResult({ ...result, quantity: newQty, variationQuantities: newVariationQuantities });
                },
                type: "button",
                children: "+"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#2a655f]/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-semibold text-slate-700 dark:text-slate-300", children: [
          "⏰ ",
          isArabic ? "المدة" : "Duration"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setIsPermanent(true);
                setError(null);
                setExpiresAt("");
              },
              className: cn(
                "px-4 py-2 rounded-xl border-3 text-sm font-medium transition-all duration-300 flex-1",
                isPermanent ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
              ),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 inline mr-1.5" }),
                isArabic ? "🔓 دائم" : "🔓 Permanent"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                setIsPermanent(false);
                setError(null);
              },
              className: cn(
                "px-4 py-2 rounded-xl border-3 text-sm font-medium transition-all duration-300 flex-1",
                !isPermanent ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]" : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
              ),
              disabled: isSubmitting,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 inline mr-1.5" }),
                isArabic ? "📅 محددة" : "📅 Limited"
              ]
            }
          )
        ] }),
        !isPermanent && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "datetime-local",
            value: expiresAt,
            onChange: (e) => {
              setExpiresAt(e.target.value);
              setError(null);
            },
            className: "mt-1 rounded-xl border-3 border-[#2a655f]/30 focus:border-[#2a655f]",
            disabled: isSubmitting,
            min: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16)
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border-3 border-red-200 flex items-start gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: error })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10 rounded-xl border-3 border-[#2a655f]/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] text-center", children: [
          "🎯 ",
          getPreviewText()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-[#2a655f]/70 text-center mt-1 space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: isArabic ? `💰 عند شراء ${requirements.reduce((sum, r) => sum + r.quantity, 0)}، تحصل على ${result.quantity} مجاناً` : `💰 Buy ${requirements.reduce((sum, r) => sum + r.quantity, 0)}, get ${result.quantity} free` }),
          selectedParentCategoryId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
            "📁 ",
            isArabic ? "الرئيسي" : "Main",
            ": ",
            getCategoryName(selectedParentCategoryId),
            selectedSubCategoryId && ` → 📂 ${getCategoryName(selectedSubCategoryId)}`
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2 border-t-3 border-[#2a655f]/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => onOpenChange(false),
          className: "rounded-xl border-3 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10",
          disabled: isSubmitting,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
            isArabic ? "إلغاء" : "Cancel"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 border-3 border-[#2a655f]/30",
          onClick: handleSubmit,
          disabled: isSubmitting,
          children: isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
            isArabic ? "جاري الحفظ..." : "Saving..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4 mr-2" }),
            existingOffer ? isArabic ? "حفظ التغييرات" : "Save Changes" : isArabic ? "إضافة العرض" : "Add Offer"
          ] })
        }
      )
    ] })
  ] }) });
}
const AddBogoOfferDialog = React__default.memo(AddBogoOfferDialogComponent);
function PromoOfferDetailDialog({
  open,
  onOpenChange,
  offer,
  product,
  lang,
  currency,
  formatPrice: formatPrice2,
  onEdit,
  onDelete
}) {
  if (!offer) return null;
  const isArabic = lang === "ar";
  const getOfferTypeLabel = (type) => {
    const types = {
      bogo: {
        label: isArabic ? "نفس المنتج" : "Same Product",
        icon: Gift,
        color: "text-purple-600",
        bg: "bg-purple-100 dark:bg-purple-900/30"
      },
      cross_sell: {
        label: isArabic ? "منتج مختلف" : "Different Product",
        icon: Tag,
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/30"
      },
      bundle: {
        label: isArabic ? "باقة منتجات" : "Bundle",
        icon: Package,
        color: "text-orange-600",
        bg: "bg-orange-100 dark:bg-orange-900/30"
      }
    };
    return types[type] || types.bogo;
  };
  const getStatusInfo = () => {
    const isActive = offer.is_active;
    const isExpired = offer.expires_at && new Date(offer.expires_at) < /* @__PURE__ */ new Date();
    const isFuture = offer.starts_at && new Date(offer.starts_at) > /* @__PURE__ */ new Date();
    if (!isActive) {
      return {
        label: isArabic ? "غير نشط" : "Inactive",
        color: "bg-gray-500 text-white",
        icon: CircleAlert
      };
    }
    if (isExpired) {
      return {
        label: isArabic ? "منتهي" : "Expired",
        color: "bg-red-500 text-white",
        icon: CircleAlert
      };
    }
    if (isFuture) {
      return {
        label: isArabic ? "قادم" : "Upcoming",
        color: "bg-blue-500 text-white",
        icon: Clock
      };
    }
    return {
      label: isArabic ? "نشط" : "Active",
      color: "bg-emerald-500 text-white",
      icon: CircleCheck
    };
  };
  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const typeInfo = getOfferTypeLabel(offer.offer_type);
  const TypeIcon = typeInfo.icon;
  const getProductName = (productId) => {
    if (product?.id === productId) {
      return product?.title_ar || (isArabic ? "منتج" : "Product");
    }
    if (offer.products && Array.isArray(offer.products)) {
      const found = offer.products.find((p) => p.id === productId);
      if (found) return found.title_ar || (isArabic ? "منتج" : "Product");
    }
    if (offer._products && Array.isArray(offer._products)) {
      const found = offer._products.find((p) => p.id === productId);
      if (found) return found.title_ar || (isArabic ? "منتج" : "Product");
    }
    if (offer.bundle_products && Array.isArray(offer.bundle_products)) {
      const found = offer.bundle_products.find((p) => p.id === productId);
      if (found) return found.title_ar || (isArabic ? "منتج" : "Product");
    }
    if (offer.free_product?.id === productId) {
      return offer.free_product.title_ar || (isArabic ? "منتج" : "Product");
    }
    return isArabic ? `منتج ${productId.slice(0, 8)}` : `Product ${productId.slice(0, 8)}`;
  };
  const getProductPrice = (productId) => {
    if (product?.id === productId) return product?.price || 0;
    if (offer._products && Array.isArray(offer._products)) {
      const found = offer._products.find((p) => p.id === productId);
      if (found) return found.price || 0;
    }
    if (offer.free_product?.id === productId) return offer.free_product.price || 0;
    return 0;
  };
  const getProductVariations = (productId) => {
    if (product?.id === productId && product?.variations) return product.variations;
    if (offer._products && Array.isArray(offer._products)) {
      const found = offer._products.find((p) => p.id === productId);
      if (found && found.variations) return found.variations;
    }
    if (offer.free_product?.id === productId && offer.free_product?.variations) {
      return offer.free_product.variations;
    }
    return [];
  };
  const renderVariationDetails = (variationIds, productId) => {
    if (!variationIds || variationIds.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-500/60 mt-1", children: [
        "✅ ",
        isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"
      ] });
    }
    const variations = getProductVariations(productId);
    if (!variations || variations.length === 0) {
      return null;
    }
    const filteredVariations = variations.filter((v) => variationIds.includes(v.id));
    if (filteredVariations.length === 0) return null;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-1.5", children: filteredVariations.map((v) => {
      const combo = v.combination || {};
      const comboText = Object.entries(combo).map(([key, value]) => `${key}: ${value}`).join(" • ");
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[9px] border-purple-200/50 dark:border-purple-800/30 text-purple-600 dark:text-purple-300", children: [
        comboText || v.id.slice(0, 6),
        v.price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[8px] text-emerald-500", children: formatPrice2(Number(v.price), currency, lang) })
      ] }, v.id);
    }) });
  };
  const getCategoryName = () => {
    if (offer.category_id && offer.category) {
      return isArabic ? offer.category.name_ar : offer.category.name_en;
    }
    return isArabic ? "غير محدد" : "Not specified";
  };
  const formatDate = (date) => {
    if (!date) return isArabic ? "غير محدد" : "Not set";
    return new Date(date).toLocaleDateString(
      isArabic ? "ar-SA" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };
  const getDisplayText = () => {
    return offer.display_text_ar || offer.display_text_en || "";
  };
  const getGiftName = () => {
    if (offer.offer_type === "bogo") {
      return product?.title_ar || (isArabic ? "نفس المنتج" : "Same product");
    }
    if (offer.free_product?.title_ar) return offer.free_product.title_ar;
    if (offer.free_listing?.title_ar) return offer.free_listing.title_ar;
    return offer.free_listing_id || (isArabic ? "منتج مجاني" : "Free product");
  };
  const getGiftPrice = () => {
    if (offer.free_product?.price) return offer.free_product.price;
    if (offer.free_listing?.price) return offer.free_listing.price;
    return 0;
  };
  const getGiftVariationIds = () => offer.result_variation_ids || [];
  const getBaseVariationIds = () => offer.variation_ids || [];
  const getBaseProductName = () => {
    return product?.title_ar || offer.listing_id || (isArabic ? "منتج" : "Product");
  };
  const getBaseProductPrice = () => product?.price || 0;
  const getBundleProducts = () => {
    const bundleProducts2 = [];
    if (offer.required_product_ids && offer.required_product_ids.length > 0) {
      offer.required_product_ids.forEach((id, index) => {
        let productData = {
          id,
          title_ar: getProductName(id),
          price: getProductPrice(id),
          variations: getProductVariations(id),
          quantity: 1,
          variation_ids: []
        };
        if (offer.required_variations && offer.required_variations[index]) {
          const reqVar = offer.required_variations[index];
          productData.quantity = reqVar.quantity || 1;
          productData.variation_ids = reqVar.variation_ids || [];
        }
        bundleProducts2.push(productData);
      });
    }
    return bundleProducts2;
  };
  const bundleProducts = getBundleProducts();
  const baseVariationIds = getBaseVariationIds();
  const giftVariationIds = getGiftVariationIds();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl rounded-2xl p-0 overflow-hidden border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl shadow-[#2a655f]/10 bg-white dark:bg-slate-900 max-h-[90vh] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative p-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-7 w-7 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3", children: [
              isArabic ? "تفاصيل العرض الترويجي" : "Promo Offer Details",
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn(
                "border-0 shadow-lg rounded-full px-3 py-1 flex items-center gap-1.5 text-xs",
                statusInfo.color
              ), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3 w-3" }),
                statusInfo.label
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TypeIcon, { className: "h-4 w-4" }),
              typeInfo.label,
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] dark:text-[#3a8a82] font-medium", children: getBaseProductName() }),
              offer.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px]", children: [
                "⭐ ",
                isArabic ? "مميز" : "Featured"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:rotate-90 flex-shrink-0",
            onClick: () => onOpenChange(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-5", children: [
      getDisplayText() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border border-purple-200/50 dark:border-purple-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-base font-semibold text-purple-700 dark:text-purple-300", children: [
        "🎯 ",
        getDisplayText()
      ] }) }),
      offer.category_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
          isArabic ? "التصنيف" : "Category"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-sm px-3 py-1 rounded-lg", children: getCategoryName() }),
          offer.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px]", children: [
            "⭐ ",
            isArabic ? "مميز" : "Featured"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
          isArabic ? "المنتج الأساسي" : "Base Product"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-slate-900 dark:text-white", children: getBaseProductName() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] border-slate-200/50", children: baseVariationIds.length > 0 ? `${baseVariationIds.length} ${isArabic ? "فيرنتات محددة" : "specific variations"}` : isArabic ? "كل الفيرنتات" : "All variations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-[#2a655f]", children: formatPrice2(Number(getBaseProductPrice()), currency, lang) })
        ] }),
        baseVariationIds.length > 0 && product?.variations && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mb-1", children: isArabic ? "الفيرنتات المحددة:" : "Specific variations:" }),
          renderVariationDetails(baseVariationIds, offer.listing_id)
        ] }),
        baseVariationIds.length === 0 && product?.variations && product.variations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-500/60 mt-1", children: [
          "✅ ",
          isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
          isArabic ? "الكمية المطلوبة للشراء" : "Required Purchase Quantity"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-[#2a655f] dark:text-[#3a8a82] mt-1", children: offer.buy_quantity || 1 })
      ] }),
      offer.offer_type === "bundle" && bundleProducts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
          isArabic ? "المنتجات المطلوبة (باقة)" : "Required Products (Bundle)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 mt-1.5", children: bundleProducts.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-slate-900 dark:text-white", children: [
                index + 1,
                ". ",
                item.title_ar
              ] }),
              item.price > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground mr-2", children: [
                "(",
                formatPrice2(Number(item.price), currency, lang),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]", children: isArabic ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}` })
          ] }),
          item.variation_ids.length > 0 && item.variations && item.variations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mb-1", children: isArabic ? "الفيرنتات المحددة:" : "Specific variations:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: item.variation_ids.map((vid) => {
              const variation = item.variations.find((v) => v.id === vid);
              if (!variation) return null;
              const combo = variation.combination || {};
              const comboText = Object.entries(combo).map(([key, value]) => `${key}: ${value}`).join(" • ");
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[9px] border-purple-200/50 dark:border-purple-800/30 text-purple-600 dark:text-purple-300", children: [
                comboText || vid.slice(0, 6),
                variation.price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[8px] text-emerald-500", children: formatPrice2(Number(variation.price), currency, lang) })
              ] }, vid);
            }) })
          ] }),
          item.variation_ids.length === 0 && item.variations && item.variations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-500/60 mt-1", children: [
            "✅ ",
            isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"
          ] }),
          (!item.variations || item.variations.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: isArabic ? "لا يوجد فيرنتات" : "No variations" })
        ] }, item.id || index)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-3.5 w-3.5 text-emerald-500" }),
          isArabic ? "الهدية" : "Gift"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-emerald-700 dark:text-emerald-300", children: getGiftName() }),
          giftVariationIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px]", children: [
            giftVariationIds.length,
            " ",
            isArabic ? "فيرنتات محددة" : "specific variations"
          ] }),
          giftVariationIds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px]", children: isArabic ? "كل الفيرنتات" : "All variations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-emerald-600 dark:text-emerald-400", children: [
            "×",
            offer.get_quantity || 1
          ] }),
          getGiftPrice() > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground line-through", children: formatPrice2(Number(getGiftPrice()), currency, lang) })
        ] }),
        giftVariationIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mb-1", children: isArabic ? "فيرنتات الهدية المحددة:" : "Specific gift variations:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: giftVariationIds.map((vid) => {
            const giftProduct = offer.free_product || offer.free_listing;
            const variation = giftProduct?.variations?.find((v) => v.id === vid);
            if (!variation) return null;
            const combo = variation.combination || {};
            const comboText = Object.entries(combo).map(([key, value]) => `${key}: ${value}`).join(" • ");
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-[9px] border-emerald-200/50 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-300", children: [
              comboText || vid.slice(0, 6),
              variation.price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[8px] text-emerald-500", children: formatPrice2(Number(variation.price), currency, lang) })
            ] }, vid);
          }) })
        ] }),
        giftVariationIds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-emerald-500/60 mt-1", children: [
          "✅ ",
          isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            isArabic ? "تاريخ البدء" : "Start Date"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mt-1 text-slate-900 dark:text-white", children: formatDate(offer.starts_at) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            isArabic ? "تاريخ الانتهاء" : "End Date"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mt-1 text-slate-900 dark:text-white", children: offer.expires_at ? formatDate(offer.expires_at) : isArabic ? "🔓 دائم" : "🔓 Permanent" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "نوع العرض" : "Offer Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] mt-0.5", children: offer.offer_type === "bogo" ? isArabic ? "نفس المنتج" : "BOGO" : offer.offer_type === "cross_sell" ? isArabic ? "منتج مختلف" : "Cross-sell" : isArabic ? "باقة" : "Bundle" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "الكمية المشتراة" : "Buy Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] mt-0.5", children: offer.buy_quantity || 1 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: isArabic ? "الكمية المجانية" : "Free Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5", children: offer.get_quantity || 1 })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "p-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex-shrink-0 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => onOpenChange(false),
          className: "rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-2" }),
            isArabic ? "إغلاق" : "Close"
          ]
        }
      ),
      onEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => {
            onOpenChange(false);
            onEdit();
          },
          className: "rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50/50 hover:border-blue-500/50 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4 mr-2" }),
            isArabic ? "تعديل" : "Edit"
          ]
        }
      ),
      onDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          onClick: () => {
            onOpenChange(false);
            onDelete();
          },
          className: "rounded-xl border-red-200/50 text-red-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
            isArabic ? "حذف" : "Delete"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300 hover:scale-[1.02]",
          onClick: () => onOpenChange(false),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 mr-2" }),
            isArabic ? "تم" : "Done"
          ]
        }
      )
    ] })
  ] }) });
}
const { saveAs: saveAs$3 } = pkg__default;
const ProductsPage = React__default.memo(function ProductsPage2() {
  const app = useApp();
  useT();
  const queryClient = useQueryClient();
  const { data: cats = [] } = useCategories();
  const { data: govs = [] } = useGovernorates();
  reactExports.useEffect(() => {
    const currentScroll = window.scrollY;
    let isBlocking = true;
    let timeoutId = null;
    const preventScroll = () => {
      if (isBlocking) window.scrollTo({ top: currentScroll, behavior: "instant" });
    };
    window.addEventListener("scroll", preventScroll, { passive: true });
    window.addEventListener("wheel", preventScroll, { passive: true });
    window.addEventListener("touchmove", preventScroll, { passive: true });
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    });
    timeoutId = setTimeout(() => {
      isBlocking = false;
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    }, 300);
    return () => {
      isBlocking = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);
  const {
    data: myListings = [],
    isLoading,
    isFetching,
    isError,
    refetch: refetchMyListings
  } = useMyListings(app.user?.id);
  const { data: sellerOffers = [], refetch: refetchSellerOffers } = useSellerOffers(app.user?.id);
  const create = useCreateListing();
  const update = useUpdateListing();
  const del = useDeleteListing();
  useSendNotificationV2();
  const addToCart = useAddToCart();
  const isOpeningDialog = reactExports.useRef(false);
  const isOpeningDetail = reactExports.useRef(false);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterType, setFilterType] = reactExports.useState("all");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [itemsPerPage, setItemsPerPage] = reactExports.useState(10);
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [detailCurrentImage, setDetailCurrentImage] = reactExports.useState("");
  const [detailSelectedColor, setDetailSelectedColor] = reactExports.useState(null);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [dialogProduct, setDialogProduct] = reactExports.useState(null);
  const [dialogType, setDialogType] = reactExports.useState("product");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = reactExports.useState(false);
  const [selectedProduct, setSelectedProduct] = reactExports.useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [productToDelete, setProductToDelete] = reactExports.useState(null);
  const [currentImageIndex, setCurrentImageIndex] = reactExports.useState(0);
  const [isZoomed, setIsZoomed] = reactExports.useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = reactExports.useState(false);
  const [productToConvert, setProductToConvert] = reactExports.useState(null);
  const [isConverting, setIsConverting] = reactExports.useState(false);
  const [selectedVariation, setSelectedVariation] = reactExports.useState(null);
  const [offerDialogOpen, setOfferDialogOpen] = reactExports.useState(false);
  const [selectedOfferProduct, setSelectedOfferProduct] = reactExports.useState(null);
  const [editingOffer, setEditingOffer] = reactExports.useState(null);
  const deletePromoOffer = useDeleteProductOffer();
  const [promoDetailDialogOpen, setPromoDetailDialogOpen] = reactExports.useState(false);
  const [selectedPromoOffer, setSelectedPromoOffer] = reactExports.useState(null);
  const [selectedPromoProduct, setSelectedPromoProduct] = reactExports.useState(null);
  const [confirmDeleteOfferOpen, setConfirmDeleteOfferOpen] = reactExports.useState(false);
  const [offerToDelete, setOfferToDelete] = reactExports.useState(null);
  const getFullCategoryPath = reactExports.useCallback((parentCategoryId, categoryId) => {
    const parent = parentCategoryId ? cats.find((c) => c.id === parentCategoryId) : null;
    const child = categoryId ? cats.find((c) => c.id === categoryId) : null;
    return {
      parent: parent ? app.lang === "ar" ? parent.name_ar : parent.name_en : "",
      child: child && child.id !== parentCategoryId ? app.lang === "ar" ? child.name_ar : child.name_en : ""
    };
  }, [cats, app.lang]);
  reactExports.useCallback((id) => {
    const c = cats.find((cat) => cat.id === id);
    return c ? app.lang === "ar" ? c.name_ar : c.name_en : "";
  }, [cats, app.lang]);
  reactExports.useCallback((id) => {
    const g = govs.find((gov) => gov.id === id);
    return g ? app.lang === "ar" ? g.name_ar : g.name_en : "";
  }, [govs, app.lang]);
  const productsWithPromo = reactExports.useMemo(() => {
    const products = [];
    myListings.forEach((product) => {
      products.push({
        ...product,
        is_promo_offer: false,
        product_type: product.is_offer ? "discount" : "regular"
      });
    });
    sellerOffers.forEach((offer) => {
      const listing = myListings.find((l) => l.id === offer.listing_id);
      if (listing) {
        products.push({
          id: `promo-${offer.id}`,
          title_ar: offer.display_text_ar || `🎁 ${listing.title_ar}`,
          title_en: offer.display_text_en || `🎁 ${listing.title_en || listing.title_ar}`,
          price: listing.price || 0,
          cover_url: listing.cover_url || "",
          status: offer.is_active ? "published" : "archived",
          is_available: offer.is_active,
          is_offer: false,
          is_promo_offer: true,
          product_type: "promo",
          promo_offer: offer,
          created_at: offer.created_at,
          category_id: offer.category_id || listing.category_id,
          parent_category_id: offer.parent_category_id || listing.parent_category_id,
          colors: listing.colors || [],
          variations: listing.variations || [],
          avg_rating: listing.rating || 0,
          reviews_count: 0,
          buy_quantity: offer.buy_quantity,
          get_quantity: offer.get_quantity,
          offer_type: offer.offer_type,
          free_listing: myListings.find((l) => l.id === offer.free_listing_id) || null,
          original_listing: listing
        });
      }
    });
    return products;
  }, [myListings, sellerOffers]);
  const filteredProducts = reactExports.useMemo(() => {
    let result = productsWithPromo;
    if (filterStatus !== "all") {
      result = result.filter((p) => p.status === filterStatus);
    }
    if (filterType === "product") {
      result = result.filter((p) => p.product_type === "regular");
    } else if (filterType === "offer") {
      result = result.filter((p) => p.product_type === "discount");
    } else if (filterType === "promo") {
      result = result.filter((p) => p.product_type === "promo");
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const title = (p.title_ar || "").toLowerCase();
        return title.includes(q);
      });
    }
    return result;
  }, [productsWithPromo, searchQuery, filterStatus, filterType]);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = reactExports.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);
  reactExports.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterType, itemsPerPage]);
  const goToPage = reactExports.useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [totalPages]);
  const nextPage = reactExports.useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);
  const prevPage = reactExports.useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);
  const stats = reactExports.useMemo(() => {
    const promoCount = productsWithPromo.filter((p) => p.has_promo).length;
    return {
      total: productsWithPromo.length,
      pending: productsWithPromo.filter((p) => p.status === "pending").length,
      published: productsWithPromo.filter((p) => p.status === "published").length,
      archived: productsWithPromo.filter((p) => p.status === "archived").length,
      offers: productsWithPromo.filter((p) => p.is_offer === true).length,
      products: productsWithPromo.filter((p) => p.is_offer !== true && !p.has_promo).length,
      promo: promoCount,
      totalOffers: sellerOffers.length
    };
  }, [productsWithPromo, sellerOffers]);
  const exportToExcel = reactExports.useCallback(() => {
    const exportData = filteredProducts.map((p) => {
      const fullCat = getFullCategoryPath(p.parent_category_id, p.category_id);
      const catStr = fullCat.parent && fullCat.child ? `${fullCat.parent} > ${fullCat.child}` : fullCat.parent || fullCat.child || "";
      return {
        "اسم المنتج": p.title_ar || "—",
        "السعر": formatPrice(Number(p.price), app.currency, app.lang),
        "الحالة": p.status === "pending" ? "قيد المراجعة" : p.status === "published" ? "منشور" : "مؤرشف",
        "النوع": p.is_promo_offer ? "عرض ترويجي" : p.is_offer ? "عرض تخفيض" : "منتج",
        "التصنيف": catStr,
        "تاريخ الإضافة": new Date(p.created_at).toLocaleDateString(app.lang === "ar" ? "ar-SA" : "en-US")
      };
    });
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "المنتجات");
    ws["!cols"] = [{ wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 30 }, { wch: 20 }];
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs$3(blob, `المنتجات_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  }, [filteredProducts, app.currency, app.lang, getFullCategoryPath]);
  const exportToWord = reactExports.useCallback(() => {
    let html = `
      <html dir="rtl"><head><meta charset="UTF-8">
      <style>body{font-family:Arial;padding:20px}th{background:#2a655f;color:#fff;padding:12px}td{padding:10px;border:1px solid #e2e8f0}
      </style></head><body>
      <h1>📊 تقرير المنتجات</h1>
      <table><thead><tr><th>#</th><th>اسم المنتج</th><th>السعر</th><th>الحالة</th><th>النوع</th><th>التصنيف</th></tr></thead><tbody>
    `;
    filteredProducts.forEach((p, i) => {
      const type = p.is_promo_offer ? "عرض ترويجي" : p.is_offer ? "عرض تخفيض" : "منتج";
      const fullCat = getFullCategoryPath(p.parent_category_id, p.category_id);
      const catStr = fullCat.parent && fullCat.child ? `${fullCat.parent} > ${fullCat.child}` : fullCat.parent || fullCat.child || "";
      html += `<tr><td>${i + 1}</td><td>${p.title_ar || "—"}</td>
        <td>${formatPrice(Number(p.price), app.currency, app.lang)}</td>
        <td>${p.status === "pending" ? "قيد المراجعة" : p.status === "published" ? "منشور" : "مؤرشف"}</td>
        <td>${type}</td>
        <td>${catStr}</td></tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    saveAs$3(blob, `المنتجات_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  }, [filteredProducts, app.currency, app.lang, getFullCategoryPath]);
  const notifyAdmin = reactExports.useCallback(async (productTitle, actionType, userId, listingId) => {
    try {
      const { data: adminRole, error: roleError } = await supabase.from("user_roles").select("user_id").eq("role", "admin").limit(1).maybeSingle();
      if (roleError || !adminRole) return;
      const { data: userProfile } = await supabase.from("profiles").select("full_name, store_name").eq("id", userId).maybeSingle();
      const userName = userProfile?.full_name || userProfile?.store_name || userId || "مستخدم";
      let tabTarget = "";
      if (actionType === "إضافة" || actionType === "تعديل" || actionType === "إعادة نشر") {
        tabTarget = "listings";
      }
      await supabase.from("notifications").insert({
        user_id: adminRole.user_id,
        type: "product_pending",
        title_ar: `📦 طلب ${actionType} منتج`,
        body_ar: `قام ${userName} بـ ${actionType} المنتج "${productTitle}"، بحاجة للمراجعة`,
        link_url: `/admin?tab=${tabTarget}`,
        metadata: { product_id: listingId, action: actionType, user_name: userName },
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        is_read: false
      });
    } catch (error) {
      console.error("❌ Error notifying admin:", error);
    }
  }, []);
  const handleSaveProduct = reactExports.useCallback(async (data) => {
    setDialogOpen(false);
    const isEditing = !!dialogProduct;
    toast.success(
      isEditing ? app.lang === "ar" ? "✅ تم تعديل المنتج بنجاح" : "✅ Product updated successfully" : data.is_offer ? app.lang === "ar" ? "✅ تم إرسال العرض للمراجعة" : "✅ Offer sent for review" : app.lang === "ar" ? "✅ تم إرسال المنتج للمراجعة" : "✅ Product sent for review"
    );
    setTimeout(() => setDialogProduct(null), 100);
    try {
      setIsSaving(true);
      const price = Number(data.price);
      const oldPrice = Number(data.old_price) || 0;
      const discount = data.is_offer && oldPrice > price ? Math.round((oldPrice - price) / oldPrice * 100) : null;
      let listingId;
      const productTitle = data.title_ar;
      const currentDialogProduct = dialogProduct;
      if (isEditing && currentDialogProduct) {
        await update.mutateAsync({
          id: currentDialogProduct.id,
          patch: {
            title_ar: data.title_ar,
            description_ar: data.description_ar || null,
            price,
            old_price: oldPrice || null,
            discount_percent: discount,
            is_offer: data.is_offer,
            is_available: data.is_available,
            delivery_method: data.delivery_method,
            payment_method: data.payment_method,
            delivery_note: data.delivery_note || null,
            kind: data.kind || "product",
            category_id: data.category_id,
            parent_category_id: data.parent_category_id,
            governorate_id: data.governorate_id,
            cover_url: data.cover_url,
            updated_at: (/* @__PURE__ */ new Date()).toISOString()
          }
        });
        listingId = currentDialogProduct.id;
        await ProductService.deleteProductData(listingId);
      } else {
        const result = await create.mutateAsync({
          owner_id: app.user.id,
          title_ar: data.title_ar,
          description_ar: data.description_ar || null,
          price,
          old_price: oldPrice || null,
          discount_percent: discount,
          is_offer: data.is_offer,
          is_available: data.is_available,
          delivery_method: data.delivery_method,
          payment_method: data.payment_method,
          delivery_note: data.delivery_note || null,
          kind: data.kind || "product",
          category_id: data.category_id,
          parent_category_id: data.parent_category_id,
          governorate_id: data.governorate_id,
          cover_url: data.cover_url,
          image_urls: [data.cover_url, ...data.image_urls || []].filter(Boolean),
          status: "pending"
        });
        listingId = result.id;
      }
      await ProductService.saveAllProductData(listingId, {
        options: data.options || {},
        colors: data.colors || [],
        variations: data.variations || [],
        image_urls: data.image_urls || []
      });
      const actionType = isEditing ? "تعديل" : "إضافة";
      notifyAdmin(productTitle, actionType, app.user.id, listingId).catch(console.error);
      queryClient.invalidateQueries({ queryKey: ["listings", "my", app.user?.id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      await refetchMyListings();
      if (!isEditing) {
        getUserDisplayName(app.user.id).then(async (userName) => {
          const { data: existingApp } = await supabase.from("seller_applications").select("id, status").eq("user_id", app.user.id).eq("status", "pending").limit(1).maybeSingle();
          if (!existingApp) {
            await supabase.from("seller_applications").insert({
              user_id: app.user.id,
              store_name: userName,
              store_description: `طلب إضافة منتج: ${productTitle}`,
              application_type: "product",
              status: "pending"
            });
          }
        }).catch(console.error);
      }
    } catch (e) {
      console.error("❌ Error in handleSaveProduct:", e);
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  }, [dialogProduct, update, create, app.user, notifyAdmin, refetchMyListings, app.lang, queryClient]);
  const handleDeleteProduct = reactExports.useCallback(async () => {
    if (!productToDelete) return;
    try {
      await del.mutateAsync(productToDelete.id);
      toast.success(app.lang === "ar" ? "تم حذف المنتج بنجاح" : "Product deleted");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      await refetchMyListings();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }, [productToDelete, del, refetchMyListings, app.lang]);
  const handleConvertToOffer = reactExports.useCallback(async (productId, newPrice, variationPrices, variationOldPrices) => {
    try {
      setIsConverting(true);
      const product = myListings.find((p) => p.id === productId);
      if (!product) {
        toast.error(app.lang === "ar" ? "المنتج غير موجود" : "Product not found");
        return;
      }
      const originalPrice = Number(product.price);
      const hasVar = variationPrices && Object.keys(variationPrices).length > 0;
      let actualNewPrice = newPrice;
      let actualOldPrice = originalPrice;
      if (hasVar) {
        const prices = Object.values(variationPrices);
        const oldPrices = Object.values(variationOldPrices || {});
        actualNewPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : newPrice;
        actualOldPrice = oldPrices.length > 0 ? Math.round(oldPrices.reduce((a, b) => a + b, 0) / oldPrices.length) : originalPrice;
      }
      const discountPercent = actualOldPrice > 0 ? Math.round((actualOldPrice - actualNewPrice) / actualOldPrice * 100) : 0;
      console.log("🔵 [handleConvertToOffer] Final:", {
        actualNewPrice,
        actualOldPrice,
        discountPercent,
        hasVar
      });
      await update.mutateAsync({
        id: productId,
        patch: {
          is_offer: true,
          old_price: actualOldPrice,
          price: actualNewPrice,
          discount_percent: discountPercent,
          status: "published",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
      if (product.variations && product.variations.length > 0) {
        const updatedVariations = product.variations.map((v) => ({
          ...v,
          price: variationPrices?.[v.id] || v.price,
          old_price: variationOldPrices?.[v.id] || v.price
        }));
        await ProductService.saveVariations(productId, updatedVariations);
      }
      toast.success(
        app.lang === "ar" ? `🎉 تم تحويل "${product.title_ar}" إلى عرض تخفيض بخصم ${discountPercent}%` : `🎉 Converted "${product.title_ar}" to discount offer with ${discountPercent}% off`
      );
      setConvertDialogOpen(false);
      setProductToConvert(null);
      await refetchMyListings();
      await notifyAdmin(product.title_ar, "تحويل إلى عرض", app.user.id, productId);
    } catch (error) {
      console.error("❌ Error converting to offer:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ أثناء تحويل المنتج" : "❌ Error converting product");
    } finally {
      setIsConverting(false);
    }
  }, [myListings, update, refetchMyListings, notifyAdmin, app.user, app.lang]);
  reactExports.useCallback(async (product) => {
    try {
      setIsSaving(true);
      await update.mutateAsync({
        id: product.id,
        patch: {
          status: "pending",
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }
      });
      toast.success(app.lang === "ar" ? "📤 تم إرسال طلب إعادة النشر للمراجعة" : "📤 Republish request sent for review");
      await notifyAdmin(product.title_ar, "إعادة نشر", app.user.id, product.id);
      queryClient.invalidateQueries({ queryKey: ["listings", "my", app.user?.id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", product.id] });
      await refetchMyListings();
    } catch (error) {
      console.error("❌ Error republishing product:", error);
      toast.error(app.lang === "ar" ? "❌ فشل إرسال طلب إعادة النشر" : "❌ Failed to send republish request");
    } finally {
      setIsSaving(false);
    }
  }, [update, app.user, app.lang, notifyAdmin, refetchMyListings, queryClient]);
  const openConvertDialog = reactExports.useCallback((product) => {
    setProductToConvert(product);
    setConvertDialogOpen(true);
  }, []);
  const handleAddPromoOffer = reactExports.useCallback((product) => {
    setSelectedOfferProduct(product);
    setEditingOffer(null);
    setOfferDialogOpen(true);
  }, []);
  const handleEditPromoOffer = reactExports.useCallback((offer) => {
    setSelectedOfferProduct(null);
    setEditingOffer(offer);
    setOfferDialogOpen(true);
  }, []);
  const handleRemovePromoOffer = reactExports.useCallback((offerId) => {
    setOfferToDelete(offerId);
    setConfirmDeleteOfferOpen(true);
  }, []);
  const handleConfirmDeleteOffer = reactExports.useCallback(async () => {
    if (!offerToDelete) return;
    try {
      await deletePromoOffer.mutateAsync(offerToDelete);
      await refetchMyListings();
      await refetchSellerOffers();
      toast.success(app.lang === "ar" ? "✅ تم إزالة العرض الترويجي بنجاح" : "✅ Promo offer removed successfully");
      setConfirmDeleteOfferOpen(false);
      setOfferToDelete(null);
    } catch (error) {
      console.error("❌ Error:", error);
      let errorMessage = "❌ فشل إزالة العرض الترويجي";
      if (error?.message) errorMessage = error.message;
      toast.error(errorMessage);
    }
  }, [offerToDelete, deletePromoOffer, refetchMyListings, refetchSellerOffers, app.lang]);
  const handleViewPromoOffer = reactExports.useCallback((offer) => {
    const product = myListings.find((p) => p.id === offer.listing_id);
    setSelectedPromoProduct(product || null);
    let bundleProducts = [];
    let allProducts = [];
    if (offer.offer_type === "bundle" && offer.required_product_ids) {
      bundleProducts = offer.required_product_ids.map((id) => {
        const found = myListings.find((p) => p.id === id);
        if (found) {
          const reqVar = offer.required_variations?.find((rv) => rv.product_id === id);
          return {
            ...found,
            required_variations: reqVar?.variation_ids || [],
            required_quantity: reqVar?.quantity || 1
          };
        } else {
          return {
            id,
            title_ar: `منتج ${id.slice(0, 8)}`,
            title_en: `Product ${id.slice(0, 8)}`,
            price: 0,
            variations: [],
            required_variations: [],
            required_quantity: 1
          };
        }
      }).filter(Boolean);
      allProducts = bundleProducts;
    }
    let freeProduct = null;
    if (offer.free_listing_id) {
      freeProduct = myListings.find((p) => p.id === offer.free_listing_id);
      if (freeProduct) {
        freeProduct = {
          ...freeProduct,
          selected_variations: offer.result_variation_ids || []
        };
        allProducts.push(freeProduct);
      } else {
        freeProduct = {
          id: offer.free_listing_id,
          title_ar: `منتج ${offer.free_listing_id.slice(0, 8)}`,
          title_en: `Product ${offer.free_listing_id.slice(0, 8)}`,
          price: 0,
          variations: [],
          selected_variations: offer.result_variation_ids || []
        };
        allProducts.push(freeProduct);
      }
    }
    const enrichedOffer = {
      ...offer,
      bundle_products: bundleProducts,
      _products: allProducts,
      free_product: freeProduct,
      product_details: product
    };
    setSelectedPromoOffer(enrichedOffer);
    setPromoDetailDialogOpen(true);
  }, [myListings]);
  const openAddDialog = reactExports.useCallback((type) => {
    setDialogType(type);
    setDialogProduct(null);
    setDialogOpen(true);
  }, []);
  const openEditDialog = reactExports.useCallback((product) => {
    if (isOpeningDialog.current) return;
    isOpeningDialog.current = true;
    if (product.is_promo_offer && product.promo_offer) {
      handleEditPromoOffer(product.promo_offer);
      setTimeout(() => {
        isOpeningDialog.current = false;
      }, 500);
      return;
    }
    setDialogProduct(product);
    setDialogType(product.is_offer ? "offer" : "product");
    setDialogOpen(true);
    setTimeout(() => {
      isOpeningDialog.current = false;
    }, 500);
  }, [handleEditPromoOffer]);
  const openProductDetail = reactExports.useCallback((product) => {
    if (isOpeningDetail.current) return;
    isOpeningDetail.current = true;
    if (product.is_promo_offer && product.promo_offer) {
      handleViewPromoOffer(product.promo_offer);
      setTimeout(() => {
        isOpeningDetail.current = false;
      }, 500);
      return;
    }
    setSelectedVariation(null);
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsZoomed(false);
    setDetailCurrentImage(product?.cover_url || "");
    setDetailSelectedColor(null);
    setDetailDialogOpen(true);
    setTimeout(() => {
      isOpeningDetail.current = false;
    }, 500);
  }, [handleViewPromoOffer]);
  reactExports.useCallback((color) => {
    setDetailSelectedColor(color);
    setDetailCurrentImage(color?.image_url || selectedProduct?.cover_url || "");
    setSelectedVariation(null);
  }, [selectedProduct]);
  reactExports.useCallback(async () => {
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }
    if (!selectedProduct) return;
    const hasVariations = selectedProduct.variations && selectedProduct.variations.length > 0;
    if (hasVariations && !selectedVariation) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء اختيار التركيبة أولاً" : "⚠️ Please select a variation first");
      return;
    }
    try {
      await addToCart.mutateAsync({
        userId: app.user.id,
        listingId: selectedProduct.id,
        quantity: 1,
        selectedColor: selectedVariation?.combination?.colors || void 0,
        selectedSize: selectedVariation?.combination?.sizes || void 0,
        selectedVariationId: selectedVariation?.id || void 0,
        variationPrice: selectedVariation?.price || selectedProduct.price,
        variationCombination: selectedVariation?.combination || void 0
      });
      toast.success(app.lang === "ar" ? "✅ تم إضافة المنتج للسلة 🛒" : "✅ Product added to cart 🛒");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ في الإضافة" : "❌ Error adding to cart");
    }
  }, [app.user, selectedProduct, selectedVariation, addToCart, app.lang]);
  const memoizedAddBogoOfferDialog = reactExports.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx(
    AddBogoOfferDialog,
    {
      open: offerDialogOpen,
      onOpenChange: setOfferDialogOpen,
      product: selectedOfferProduct,
      existingOffer: editingOffer,
      onSuccess: () => {
        refetchMyListings();
        refetchSellerOffers();
        toast.success(app.lang === "ar" ? "✅ تم إضافة العرض الترويجي بنجاح" : "✅ Promo offer added successfully");
      }
    },
    "add-bogo-offer-dialog"
  ), [offerDialogOpen, selectedOfferProduct, editingOffer, refetchMyListings, refetchSellerOffers, app.lang]);
  const memoizedPromoOfferDetailDialog = reactExports.useMemo(() => /* @__PURE__ */ jsxRuntimeExports.jsx(
    PromoOfferDetailDialog,
    {
      open: promoDetailDialogOpen,
      onOpenChange: setPromoDetailDialogOpen,
      offer: selectedPromoOffer,
      product: selectedPromoProduct,
      lang: app.lang,
      currency: app.currency,
      formatPrice,
      onEdit: () => {
        if (selectedPromoOffer) {
          handleEditPromoOffer(selectedPromoOffer);
        }
      },
      onDelete: () => {
        if (selectedPromoOffer) {
          handleRemovePromoOffer(selectedPromoOffer.id);
        }
      }
    },
    "promo-offer-detail-dialog"
  ), [promoDetailDialogOpen, selectedPromoOffer, selectedPromoProduct, app.lang, app.currency, formatPrice, handleEditPromoOffer, handleRemovePromoOffer]);
  if (isLoading || isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 text-[#2a655f] animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse", children: app.lang === "ar" ? "⏳ جاري تحميل منتجاتك..." : "⏳ Loading your products..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" }) })
    ] });
  }
  if (isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border-2 border-red-200/50 dark:border-red-800/30 p-20 text-center bg-red-50/50 dark:bg-red-950/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-20 w-20 text-red-500/60 mx-auto animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-red-600 dark:text-red-400 mt-4", children: app.lang === "ar" ? "❌ حدث خطأ في تحميل المنتجات" : "❌ Error loading products" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "mt-6 rounded-xl border-2 border-red-300/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 hover:scale-105",
          onClick: () => refetchMyListings(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
            app.lang === "ar" ? "🔄 إعادة المحاولة" : "🔄 Retry"
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 sm:h-5 sm:w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: app.lang === "ar" ? "منتجاتي" : "My Products" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 shrink-0", children: stats.total })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium text-[10px] sm:text-xs", children: stats.products }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-muted-foreground", children: app.lang === "ar" ? "منتج" : "products" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium text-[10px] sm:text-xs", children: stats.offers }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-muted-foreground", children: app.lang === "ar" ? "تخفيض" : "discounts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#f9a8d4]/10 border border-[#f9a8d4]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#d81b60]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#d81b60] font-medium text-[10px] sm:text-xs", children: stats.promo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-muted-foreground", children: app.lang === "ar" ? "ترويجي" : "promo" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-yellow-600 dark:text-yellow-400 font-medium text-[10px] sm:text-xs", children: stats.pending }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-muted-foreground", children: app.lang === "ar" ? "قيد المراجعة" : "pending" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:scale-105 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            onClick: () => openAddDialog("product"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              app.lang === "ar" ? "أضف منتج" : "Add Product"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 hover:scale-105 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            onClick: () => openAddDialog("offer"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              app.lang === "ar" ? "عرض تخفيض" : "Discount"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "rounded-xl bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/25 hover:scale-105 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            onClick: () => {
              setSelectedOfferProduct(null);
              setEditingOffer(null);
              setOfferDialogOpen(true);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              app.lang === "ar" ? "عرض ترويجي" : "Promo"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: exportToExcel,
            disabled: filteredProducts.length === 0,
            className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              " Excel"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: exportToWord,
            disabled: filteredProducts.length === 0,
            className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              " Word"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3", children: [
      { key: "total", label: app.lang === "ar" ? "الإجمالي" : "Total", value: stats.total, icon: Package, gradient: "from-[#2a655f] to-[#f9a8d4]" },
      { key: "products", label: app.lang === "ar" ? "منتجات" : "Products", value: stats.products, icon: ShoppingBag, gradient: "from-[#3a8a82] to-[#f9a8d4]" },
      { key: "offers", label: app.lang === "ar" ? "تخفيضات" : "Discounts", value: stats.offers, icon: Percent, gradient: "from-[#1a4f4a] to-[#f9a8d4]" },
      { key: "promo", label: app.lang === "ar" ? "ترويجية" : "Promo", value: stats.promo, icon: Sparkles, gradient: "from-[#d81b60] to-[#f9a8d4]" },
      { key: "pending", label: app.lang === "ar" ? "قيد المراجعة" : "Pending", value: stats.pending, icon: Clock, gradient: "from-amber-500 to-orange-500" },
      { key: "published", label: app.lang === "ar" ? "منشورة" : "Published", value: stats.published, icon: CircleCheck, gradient: "from-emerald-500 to-teal-500" }
    ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-2.5 sm:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate", children: stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1 group-hover:text-[#2a655f] transition-colors", children: stat.value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "h-3.5 w-3.5 sm:h-5 sm:w-5 text-[#2a655f]" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0 h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn("h-full rounded-full bg-gradient-to-r", stat.gradient, "transition-all duration-1000 animate-shimmer"),
              style: { width: `${Math.min(100, stat.value / (stats.total || 1) * 100)}%` }
            }
          ) })
        ]
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-focus-within:text-[#2a655f] transition-colors pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            },
            placeholder: app.lang === "ar" ? "🔍 ابحث في منتجاتك..." : "🔍 Search your products...",
            className: "ps-9 pe-9 h-10 sm:h-11 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all text-sm"
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors",
            "aria-label": app.lang === "ar" ? "مسح البحث" : "Clear search",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterStatus, onValueChange: (v) => {
          setFilterStatus(v);
          setCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/50 transition-all text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5 text-slate-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: app.lang === "ar" ? "الحالة" : "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", children: [
              "📋 ",
              app.lang === "ar" ? "الكل" : "All"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "pending", children: [
              "⏳ ",
              app.lang === "ar" ? "قيد المراجعة" : "Pending"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "published", children: [
              "✅ ",
              app.lang === "ar" ? "منشور" : "Published"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "archived", children: [
              "📁 ",
              app.lang === "ar" ? "مؤرشف" : "Archived"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterType, onValueChange: (v) => {
          setFilterType(v);
          setCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/50 transition-all text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tags, { className: "h-3.5 w-3.5 text-slate-400 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: app.lang === "ar" ? "النوع" : "Type" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", children: [
              "🎯 ",
              app.lang === "ar" ? "الكل" : "All"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "product", children: [
              "📦 ",
              app.lang === "ar" ? "منتج" : "Product"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "offer", children: [
              "🏷️ ",
              app.lang === "ar" ? "عرض تخفيض" : "Discount"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "promo", children: [
              "✨ ",
              app.lang === "ar" ? "عرض ترويجي" : "Promo"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 md:col-span-3 flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700 h-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: cn(
                "h-9 flex-1 rounded-lg text-[11px] sm:text-xs transition-all",
                viewMode === "grid" ? "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-sm" : "text-slate-500 hover:text-[#2a655f] hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              ),
              onClick: () => setViewMode("grid"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 mr-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline", children: app.lang === "ar" ? "شبكة" : "Grid" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: cn(
                "h-9 flex-1 rounded-lg text-[11px] sm:text-xs transition-all",
                viewMode === "list" ? "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-sm" : "text-slate-500 hover:text-[#2a655f] hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
              ),
              onClick: () => setViewMode("list"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 mr-1 rotate-90" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden xs:inline", children: app.lang === "ar" ? "قائمة" : "List" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              setSearchQuery("");
              setFilterStatus("all");
              setFilterType("all");
              setCurrentPage(1);
            },
            className: "w-full h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-950/20 transition-all text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5" }),
              app.lang === "ar" ? "مسح الفلاتر" : "Clear Filters"
            ]
          }
        ) })
      ] }),
      (searchQuery || filterStatus !== "all" || filterType !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] sm:text-xs text-slate-500 dark:text-slate-400", children: app.lang === "ar" ? `📊 ${filteredProducts.length} نتيجة من أصل ${productsWithPromo.length}` : `📊 ${filteredProducts.length} of ${productsWithPromo.length} results` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setSearchQuery("");
              setFilterStatus("all");
              setFilterType("all");
              setCurrentPage(1);
            },
            className: "text-[11px] sm:text-xs text-[#2a655f] hover:text-[#d81b60] font-medium transition-colors",
            children: app.lang === "ar" ? "إعادة تعيين" : "Reset"
          }
        )
      ] })
    ] }),
    myListings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-10 sm:p-20 text-center bg-gradient-to-b from-[#2a655f]/5 to-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-10 w-10 sm:h-12 sm:w-12 text-[#2a655f]/60" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl sm:text-2xl font-bold mt-4 sm:mt-6 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent", children: app.lang === "ar" ? "🚀 لا توجد منتجات بعد" : "🚀 No products yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto", children: app.lang === "ar" ? "ابدأ رحلتك التجارية الآن وأضف منتجك الأول" : "Start your business journey now and add your first product" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-3 mt-4 sm:mt-6 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg hover:scale-105 transition-all",
          onClick: () => openAddDialog("product"),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 me-2" }),
            app.lang === "ar" ? "أضف منتج جديد" : "Add New Product"
          ]
        }
      ) })
    ] }) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-10 sm:p-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/40 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg sm:text-xl font-semibold text-muted-foreground mt-4", children: app.lang === "ar" ? "🔍 لا توجد نتائج مطابقة" : "🔍 No matching results" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "mt-4 rounded-xl",
          onClick: () => {
            setSearchQuery("");
            setFilterStatus("all");
            setFilterType("all");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-2" }),
            app.lang === "ar" ? "مسح الفلاتر" : "Clear filters"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
        "space-y-3",
        viewMode === "grid" && "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 space-y-0"
      ), children: paginatedProducts.map((product) => {
        product.parent_category_id && product.parent_category_id !== product.category_id;
        const parentCat = product.parent_category_id ? cats.find((c) => c.id === product.parent_category_id) : null;
        const childCat = product.category_id && product.category_id !== product.parent_category_id ? cats.find((c) => c.id === product.category_id) : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "group bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 hover:shadow-lg transition-all duration-300 overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row gap-3 p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative w-full md:w-32 h-48 md:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer",
                  onClick: () => openProductDetail(product),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      OptimizedImage,
                      {
                        src: product.cover_url || "/placeholder.png",
                        alt: product.title_ar,
                        width: 200,
                        height: 200,
                        quality: 85,
                        objectFit: "cover",
                        className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-2 left-2 flex flex-col gap-1", children: [
                      product.is_promo_offer && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-0 text-[9px] px-2 py-0.5 animate-pulse", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 mr-1" }),
                        app.lang === "ar" ? "ترويجي" : "Promo"
                      ] }),
                      product.is_offer && !product.is_promo_offer && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500 text-white border-0 text-[9px] px-2 py-0.5", children: [
                        "🔥 -",
                        product.discount_percent || 0,
                        "%"
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      className: "font-bold text-sm text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-[#2a655f] transition-colors mb-1",
                      onClick: () => openProductDetail(product),
                      children: product.title_ar
                    }
                  ),
                  (parentCat || childCat) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mb-1 flex-wrap", children: [
                    parentCat && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 bg-[#2a655f]/10 text-[#2a655f] px-2 py-0.5 rounded-full font-medium", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-2.5 w-2.5" }),
                      app.lang === "ar" ? parentCat.name_ar : parentCat.name_en
                    ] }),
                    childCat && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CornerDownRight, { className: "h-2.5 w-2.5 text-[#d81b60]/60" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 bg-[#d81b60]/10 text-[#d81b60] px-2 py-0.5 rounded-full font-medium", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-2.5 w-2.5" }),
                        app.lang === "ar" ? childCat.name_ar : childCat.name_en
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn(
                      "text-[9px] border-0 px-2 py-0.5",
                      product.status === "published" && "bg-emerald-500/10 text-emerald-600",
                      product.status === "pending" && "bg-amber-500/10 text-amber-600",
                      product.status === "archived" && "bg-slate-500/10 text-slate-600"
                    ), children: [
                      product.status === "published" && "✅ " + (app.lang === "ar" ? "منشور" : "Published"),
                      product.status === "pending" && "⏳ " + (app.lang === "ar" ? "قيد المراجعة" : "Pending"),
                      product.status === "archived" && "📁 " + (app.lang === "ar" ? "مؤرشف" : "Archived")
                    ] }),
                    product.avg_rating > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-amber-400 text-amber-400" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-600 dark:text-slate-400", children: Number(product.avg_rating).toFixed(1) })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    product.is_offer && product.old_price && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-400 line-through", children: formatPrice(Number(product.old_price), app.currency, app.lang) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-bold text-[#2a655f]", children: formatPrice(Number(product.price), app.currency, app.lang) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10 hover:border-[#2a655f] hover:text-[#2a655f] transition-all",
                        onClick: () => openProductDetail(product),
                        title: app.lang === "ar" ? "عرض" : "View",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10 hover:border-[#2a655f] hover:text-[#2a655f] transition-all",
                        onClick: () => openEditDialog(product),
                        title: app.lang === "ar" ? "تعديل" : "Edit",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    !product.is_offer && !product.is_promo_offer && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-600 transition-all",
                        onClick: () => openConvertDialog(product),
                        title: app.lang === "ar" ? "تحويل لتخفيض" : "Convert to Discount",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Percent, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    !product.is_promo_offer && !product.has_promo && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#d81b60]/10 hover:border-[#d81b60] hover:text-[#d81b60] transition-all",
                        onClick: () => handleAddPromoOffer(product),
                        title: app.lang === "ar" ? "إضافة عرض ترويجي" : "Add Promo",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        className: "h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all",
                        onClick: () => {
                          if (product.is_promo_offer && product.promo_offer) {
                            console.log("🔴 [Inline Delete Button] Detected promo offer:", product.promo_offer);
                            console.log("🔴 [Inline Delete Button] promo_offer.id:", product.promo_offer.id);
                            handleRemovePromoOffer(product.promo_offer.id);
                          } else {
                            console.log("🔴 [Inline Delete Button] Regular product/discount:", product);
                            setProductToDelete(product);
                            setDeleteDialogOpen(true);
                          }
                        },
                        title: product.is_promo_offer ? app.lang === "ar" ? "حذف العرض الترويجي" : "Delete Promo Offer" : app.lang === "ar" ? "حذف" : "Delete",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] })
                ] })
              ] })
            ] })
          },
          product.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 mt-4 sm:mt-5 border-t border-slate-200 dark:border-slate-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs sm:text-sm text-muted-foreground", children: app.lang === "ar" ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "border-slate-200 text-slate-600 text-[10px]", children: [
            filteredProducts.length,
            " ",
            app.lang === "ar" ? "منتج" : "products"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] sm:text-xs text-muted-foreground", children: app.lang === "ar" ? "عرض:" : "Show:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: String(itemsPerPage),
                onValueChange: (v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[60px] sm:w-[70px] h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-xs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "10" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-lg", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "6", children: "6" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", children: "10" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", children: "20" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "30", children: "30" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", children: "50" })
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(1),
              disabled: currentPage === 1,
              className: "h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsLeft, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2a655f]" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: prevPage,
              disabled: currentPage === 1,
              className: "h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2a655f]" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) pageNum = i + 1;
            else if (currentPage <= 3) pageNum = i + 1;
            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
            else pageNum = currentPage - 2 + i;
            if (i === 0 && pageNum > 1 && currentPage > 3) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1 text-muted-foreground text-xs", children: "…" }, "dots-start");
            }
            if (i === 4 && pageNum < totalPages && currentPage < totalPages - 2) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1 text-muted-foreground text-xs", children: "…" }, "dots-end");
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: pageNum === currentPage ? "default" : "ghost",
                size: "sm",
                onClick: () => goToPage(pageNum),
                className: cn(
                  "h-8 min-w-[30px] sm:h-9 sm:min-w-[36px] px-1.5 sm:px-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all",
                  pageNum === currentPage ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-md" : "hover:bg-[#2a655f]/10 hover:text-[#2a655f]"
                ),
                children: pageNum
              },
              pageNum
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: nextPage,
              disabled: currentPage === totalPages,
              className: "h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2a655f]" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(totalPages),
              disabled: currentPage === totalPages,
              className: "h-8 w-8 sm:h-9 sm:w-9 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsRight, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2a655f]" })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: detailDialogOpen, onOpenChange: setDetailDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30 transition-all",
          onClick: () => {
            setDetailDialogOpen(false);
            setSelectedProduct(null);
            setIsZoomed(false);
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      ),
      selectedProduct && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col lg:flex-row h-[95vh]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:w-1/2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex flex-col h-full relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-4 relative overflow-hidden", children: (() => {
          const allImages = [];
          if (selectedProduct.cover_url) allImages.push(selectedProduct.cover_url);
          if (selectedProduct.listing_images) {
            selectedProduct.listing_images.forEach((img) => {
              if (img.url && !allImages.includes(img.url)) allImages.push(img.url);
            });
          }
          if (selectedProduct.image_urls) {
            selectedProduct.image_urls.forEach((url) => {
              if (url && url.trim() && !allImages.includes(url)) allImages.push(url);
            });
          }
          const images = allImages.length > 0 ? allImages : [selectedProduct.cover_url || "/placeholder.png"];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: detailCurrentImage || selectedProduct?.cover_url || "/placeholder.png",
                alt: selectedProduct?.title_ar,
                className: cn(
                  "max-h-full max-w-full object-contain rounded-xl transition-all duration-500 cursor-pointer",
                  isZoomed && "scale-150 cursor-zoom-out"
                ),
                onClick: () => setIsZoomed(!isZoomed)
              }
            ),
            images.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : images.length - 1);
                  },
                  className: "absolute start-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => prev < images.length - 1 ? prev + 1 : 0);
                  },
                  className: "absolute end-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-5 w-5" })
                }
              )
            ] })
          ] });
        })() }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:w-1/2 p-6 md:p-8 overflow-y-auto bg-white dark:bg-slate-900 h-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900 dark:text-white", children: selectedProduct.title_ar }),
          (() => {
            const parentCat = selectedProduct.parent_category_id ? cats.find((c) => c.id === selectedProduct.parent_category_id) : null;
            const childCat = selectedProduct.category_id && selectedProduct.category_id !== selectedProduct.parent_category_id ? cats.find((c) => c.id === selectedProduct.category_id) : null;
            if (!parentCat && !childCat) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 flex-wrap", children: [
              parentCat && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-[#2a655f]/10 text-[#2a655f] px-3 py-1 rounded-full text-xs font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { className: "h-3 w-3" }),
                app.lang === "ar" ? parentCat.name_ar : parentCat.name_en
              ] }),
              childCat && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CornerDownRight, { className: "h-3 w-3 text-[#d81b60]" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 bg-[#d81b60]/10 text-[#d81b60] px-3 py-1 rounded-full text-xs font-medium", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-3 w-3" }),
                  app.lang === "ar" ? childCat.name_ar : childCat.name_en
                ] })
              ] })
            ] });
          })(),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-4 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 rounded-2xl border border-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold text-[#2a655f]", children: formatPrice(Number(selectedProduct.price), app.currency, app.lang) }) }),
            selectedProduct.old_price && selectedProduct.old_price > selectedProduct.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-red-500 line-through", children: formatPrice(Number(selectedProduct.old_price), app.currency, app.lang) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#d81b60]/20 text-[#d81b60] border-0 text-xs", children: [
                Math.round((selectedProduct.old_price - selectedProduct.price) / selectedProduct.old_price * 100),
                "% ",
                app.lang === "ar" ? "خصم" : "OFF"
              ] })
            ] })
          ] }) }),
          selectedProduct.description_ar && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600 dark:text-slate-300 leading-relaxed", children: selectedProduct.description_ar }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "flex-1 rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 h-12",
                onClick: () => {
                  setDetailDialogOpen(false);
                  openEditDialog(selectedProduct);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4 mr-2" }),
                  app.lang === "ar" ? "تعديل" : "Edit"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "flex-1 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 h-12",
                onClick: () => {
                  setDetailDialogOpen(false);
                  setProductToDelete(selectedProduct);
                  setDeleteDialogOpen(true);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 mr-2" }),
                  app.lang === "ar" ? "حذف" : "Delete"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-6 w-6 text-red-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: app.lang === "ar" ? "حذف المنتج" : "Delete Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "لا يمكن التراجع" : "Cannot be undone" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-700 dark:text-red-300", children: app.lang === "ar" ? `هل أنت متأكد من حذف "${productToDelete?.title_ar}"؟` : `Delete "${productToDelete?.title_ar}"?` }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => setDeleteDialogOpen(false),
            className: "flex-1 rounded-xl",
            children: app.lang === "ar" ? "إلغاء" : "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleDeleteProduct,
            disabled: del.isPending,
            className: "flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white",
            children: del.isPending ? "..." : app.lang === "ar" ? "تأكيد" : "Confirm"
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: confirmDeleteOfferOpen, onOpenChange: setConfirmDeleteOfferOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-6 w-6 text-red-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold", children: app.lang === "ar" ? "حذف العرض الترويجي" : "Delete Promo Offer" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-700 dark:text-red-300", children: app.lang === "ar" ? "هل أنت متأكد من حذف هذا العرض؟" : "Are you sure?" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            onClick: () => {
              setConfirmDeleteOfferOpen(false);
              setOfferToDelete(null);
            },
            className: "flex-1 rounded-xl",
            children: app.lang === "ar" ? "إلغاء" : "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: handleConfirmDeleteOffer,
            disabled: deletePromoOffer.isPending,
            className: "flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white",
            children: deletePromoOffer.isPending ? "..." : app.lang === "ar" ? "تأكيد" : "Confirm"
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProductFormDialog,
      {
        open: dialogOpen,
        onOpenChange: setDialogOpen,
        product: dialogProduct,
        productType: dialogType,
        onSave: handleSaveProduct,
        isSaving,
        lang: app.lang
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConvertToOfferDialog,
      {
        open: convertDialogOpen,
        onOpenChange: setConvertDialogOpen,
        product: productToConvert,
        onConfirm: handleConvertToOffer,
        isConverting,
        lang: app.lang,
        currency: app.currency,
        formatPrice
      }
    ),
    memoizedAddBogoOfferDialog,
    memoizedPromoOfferDetailDialog,
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide {
          animation: slide 1.5s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      ` })
  ] });
});
const { saveAs: saveAs$2 } = pkg__default;
const generateTrackingNumber = () => {
  const prefix = "SQT";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};
function getPromoOfferData(item) {
  if (item.metadata?.promo_offer_data) {
    return item.metadata.promo_offer_data;
  }
  if (item.variation_snapshot?.offer_data) {
    return item.variation_snapshot.offer_data;
  }
  if (item.offer_data) {
    return item.offer_data;
  }
  return null;
}
function isPromoOffer(item) {
  if (item.is_promo_offer === true) return true;
  if (item.offer_id !== null && item.offer_id !== void 0) return true;
  if (item.variation_snapshot?.is_promo_offer === true) return true;
  if (item.metadata?.promo_offer_data) return true;
  if (item.offer_data) return true;
  if (!!getPromoOfferData(item)) return true;
  return false;
}
function getOrderStatus(status) {
  const map = {
    pending: {
      label: "⏳ قيد المراجعة",
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50/80 dark:bg-amber-950/30",
      border: "border-amber-200/60 dark:border-amber-800/40",
      icon: Clock,
      description: "في انتظار موافقتك"
    },
    accepted: {
      label: "✅ تم القبول",
      color: "text-[#2a655f] dark:text-[#3a8a82]",
      bg: "bg-[#2a655f]/5 dark:bg-[#2a655f]/20",
      border: "border-[#2a655f]/20 dark:border-[#2a655f]/30",
      icon: CircleCheck,
      description: "تم قبول الطلب"
    },
    processing: {
      label: "🔄 قيد المعالجة",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50/80 dark:bg-blue-950/30",
      border: "border-blue-200/60 dark:border-blue-800/40",
      icon: RefreshCw,
      description: "جاري تجهيز الطلب"
    },
    shipped: {
      label: "🚚 تم الشحن",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50/80 dark:bg-indigo-950/30",
      border: "border-indigo-200/60 dark:border-indigo-800/40",
      icon: Truck,
      description: "تم شحن الطلب"
    },
    assigned: {
      label: "📋 تم التعيين",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50/80 dark:bg-purple-950/30",
      border: "border-purple-200/60 dark:border-purple-800/40",
      icon: User,
      description: "تم تعيين موزع"
    },
    delivered: {
      label: "📦 تم التوصيل",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      border: "border-emerald-200/60 dark:border-emerald-800/40",
      icon: CircleCheck,
      description: "تم توصيل الطلب"
    },
    completed: {
      label: "✅ مكتمل",
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      border: "border-emerald-200/60 dark:border-emerald-800/40",
      icon: CircleCheck,
      description: "تم إكمال الطلب"
    },
    rejected: {
      label: "❌ مرفوض",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-50/80 dark:bg-red-950/30",
      border: "border-red-200/60 dark:border-red-800/40",
      icon: CircleX,
      description: "تم رفض الطلب"
    },
    cancelled: {
      label: "🚫 ملغي",
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50/80 dark:bg-rose-950/30",
      border: "border-rose-200/60 dark:border-rose-800/40",
      icon: CircleX,
      description: "تم إلغاء الطلب"
    }
  };
  return map[status] || map.pending;
}
const OrdersPage = React__default.memo(function OrdersPage2() {
  const app = useApp();
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [filterStatus, setFilterStatus] = reactExports.useState("all");
  const [filterDateRange, setFilterDateRange] = reactExports.useState("all");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [showDatePicker, setShowDatePicker] = reactExports.useState(false);
  const [tempDateFrom, setTempDateFrom] = reactExports.useState("");
  const [tempDateTo, setTempDateTo] = reactExports.useState("");
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [itemsPerPage, setItemsPerPage] = reactExports.useState(10);
  const [selectedOrder, setSelectedOrder] = reactExports.useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = reactExports.useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = reactExports.useState(false);
  const [rejectOrderId, setRejectOrderId] = reactExports.useState(null);
  const [rejectReason, setRejectReason] = reactExports.useState("");
  const [isRejecting, setIsRejecting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const currentScroll = window.scrollY;
    let isBlocking = true;
    let timeoutId = null;
    const preventScroll = () => {
      if (isBlocking) {
        window.scrollTo({ top: currentScroll, behavior: "instant" });
      }
    };
    window.addEventListener("scroll", preventScroll, { passive: true });
    window.addEventListener("wheel", preventScroll, { passive: true });
    window.addEventListener("touchmove", preventScroll, { passive: true });
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    });
    timeoutId = setTimeout(() => {
      isBlocking = false;
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    }, 300);
    return () => {
      isBlocking = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);
  const {
    data: allOrders = [],
    isLoading,
    isError,
    refetch: refetchOrders,
    isFetching
  } = useStoreOrders(app.user?.id);
  const storeOrders = reactExports.useMemo(() => {
    return allOrders.filter((order) => order.seller_id === app.user?.id);
  }, [allOrders, app.user?.id]);
  const filteredOrders = reactExports.useMemo(() => {
    let result = storeOrders;
    if (filterStatus !== "all") {
      result = result.filter((order) => order.status === filterStatus);
    }
    if (filterDateRange !== "all") {
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      result = result.filter((order) => {
        const orderDate = new Date(order.created_at);
        switch (filterDateRange) {
          case "today":
            return orderDate >= today;
          case "week": {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return orderDate >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return orderDate >= monthAgo;
          }
          case "custom": {
            if (dateFrom) {
              const from = new Date(dateFrom);
              from.setHours(0, 0, 0, 0);
              if (orderDate < from) return false;
            }
            if (dateTo) {
              const to = new Date(dateTo);
              to.setHours(23, 59, 59, 999);
              if (orderDate > to) return false;
            }
            return true;
          }
          default:
            return true;
        }
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.replace(/^#/, "");
      result = result.filter((order) => {
        const orderId = order.id?.toLowerCase() || "";
        const orderIdShort = orderId.slice(0, 8);
        const orderIdWithHash = `#${orderIdShort}`;
        const customerName = order.buyer_name?.toLowerCase() || "";
        const customerPhone = order.buyer_phone?.toLowerCase() || "";
        const notes = order.notes?.toLowerCase() || "";
        const createdAt = new Date(order.created_at);
        const dateStr = createdAt.toLocaleDateString(app.lang === "ar" ? "ar-SA" : "en-US");
        const timeStr = createdAt.toLocaleTimeString(app.lang === "ar" ? "ar-SA" : "en-US", {
          hour: "2-digit",
          minute: "2-digit"
        });
        const dateFormats = [
          dateStr.toLowerCase(),
          timeStr.toLowerCase(),
          `${dateStr} ${timeStr}`.toLowerCase(),
          createdAt.toISOString().slice(0, 10),
          createdAt.toISOString().slice(0, 16),
          createdAt.toLocaleDateString("en-US"),
          createdAt.toLocaleDateString("ar-SA"),
          createdAt.toLocaleDateString("ar-SA", { month: "long" }),
          createdAt.toLocaleDateString("ar-SA", { day: "numeric", month: "long" }),
          String(createdAt.getFullYear()),
          String(createdAt.getDate()).padStart(2, "0"),
          String(createdAt.getMonth() + 1).padStart(2, "0")
        ];
        const searchFields = [
          orderId,
          orderIdShort,
          orderIdWithHash,
          `#${orderIdShort}`,
          customerName,
          customerPhone,
          notes,
          ...dateFormats
        ];
        return searchFields.some(
          (field) => String(field).toLowerCase().includes(cleanQ) || String(field).toLowerCase().includes(q)
        );
      });
    }
    const statusOrder = {
      pending: 0,
      accepted: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      completed: 5,
      rejected: 6,
      cancelled: 7
    };
    return result.sort((a, b) => {
      const statusDiff = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [storeOrders, searchQuery, filterStatus, filterDateRange, dateFrom, dateTo, app.lang]);
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedOrders = reactExports.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, itemsPerPage]);
  const stats = reactExports.useMemo(() => ({
    total: storeOrders.length,
    pending: storeOrders.filter((o) => o.status === "pending").length,
    accepted: storeOrders.filter((o) => o.status === "accepted").length,
    rejected: storeOrders.filter((o) => o.status === "rejected").length,
    processing: storeOrders.filter((o) => o.status === "processing").length,
    shipped: storeOrders.filter((o) => o.status === "shipped").length,
    delivered: storeOrders.filter((o) => o.status === "delivered").length,
    cancelled: storeOrders.filter((o) => o.status === "cancelled").length
  }), [storeOrders]);
  const totalRevenue = reactExports.useMemo(() => {
    return storeOrders.filter((o) => o.status === "delivered" || o.status === "completed").reduce((sum, order) => sum + (Number(order.total_with_delivery) || Number(order.total) || 0), 0);
  }, [storeOrders]);
  const getStatusLabel = (status) => {
    const labels = {
      pending: app.lang === "ar" ? "قيد المراجعة" : "Pending",
      accepted: app.lang === "ar" ? "مقبول" : "Accepted",
      rejected: app.lang === "ar" ? "مرفوض" : "Rejected",
      processing: app.lang === "ar" ? "قيد المعالجة" : "Processing",
      shipped: app.lang === "ar" ? "تم الشحن" : "Shipped",
      delivered: app.lang === "ar" ? "تم التوصيل" : "Delivered",
      cancelled: app.lang === "ar" ? "ملغي" : "Cancelled",
      completed: app.lang === "ar" ? "مكتمل" : "Completed"
    };
    return labels[status] || status;
  };
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
      accepted: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      rejected: "bg-red-500/10 text-red-600 border-red-500/20",
      processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
      delivered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
      completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    };
    return colors[status] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };
  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      accepted: CircleCheck,
      rejected: CircleX,
      processing: RefreshCw,
      shipped: Truck,
      delivered: CircleCheck,
      cancelled: CircleX,
      completed: CircleCheck
    };
    return icons[status] || Clock;
  };
  const handleAcceptOrder = reactExports.useCallback(async (orderId) => {
    try {
      console.log("🚀 Starting order acceptance for:", orderId);
      const { data: order, error: orderError } = await supabase.from("orders").select(`
          id,
          seller_id,
          buyer_id,
          delivery_address,
          delivery_lat,
          delivery_lng,
          total,
          delivery_fee, 
          buyer_name,
          buyer_phone,
          notes
        `).eq("id", orderId).single();
      if (orderError) {
        console.error("❌ Order fetch error:", orderError);
        toast.error(app.lang === "ar" ? "❌ لم نتمكن من جلب الطلب" : "❌ Could not fetch order");
        return;
      }
      if (!order) {
        toast.error(app.lang === "ar" ? "❌ الطلب غير موجود" : "❌ Order not found");
        return;
      }
      console.log("📦 Order data:", order);
      const { data: storeData, error: storeError } = await supabase.from("profiles").select(`
          id,
          store_name,
          delivery_company_id,
          store_address,
          lat,
          lng
        `).eq("id", order.seller_id).single();
      if (storeError) {
        console.error("❌ Store fetch error:", storeError);
        toast.error(app.lang === "ar" ? "❌ لم نتمكن من جلب بيانات المتجر" : "❌ Could not fetch store data");
        return;
      }
      console.log("🏪 Store data:", storeData);
      let deliveryCompanyId = storeData?.delivery_company_id;
      console.log(`🏢 Delivery company from store: ${deliveryCompanyId}`);
      if (!deliveryCompanyId) {
        console.warn(`⚠️ Store ${storeData.id} (${storeData.store_name}) has no delivery company`);
        const { data: fallbackCompany } = await supabase.from("delivery_companies").select("id, name_ar").eq("is_active", true).limit(1).maybeSingle();
        if (fallbackCompany) {
          deliveryCompanyId = fallbackCompany.id;
          console.log(`🔄 Using fallback company: ${fallbackCompany.name_ar} (${fallbackCompany.id})`);
        }
      }
      if (!deliveryCompanyId) {
        toast.error(app.lang === "ar" ? "❌ لا توجد شركة توصيل متاحة" : "❌ No delivery company available");
        return;
      }
      console.log(`✅ Final delivery company: ${deliveryCompanyId}`);
      const trackingNumber = generateTrackingNumber();
      console.log(`🔢 Generated tracking number: ${trackingNumber}`);
      const { error: updateError } = await supabase.from("orders").update({
        status: "accepted",
        accepted_at: (/* @__PURE__ */ new Date()).toISOString(),
        delivery_company_id: deliveryCompanyId,
        tracking_number: trackingNumber
      }).eq("id", orderId);
      if (updateError) {
        console.error("❌ Update error:", updateError);
        throw updateError;
      }
      console.log("✅ Order updated successfully");
      const { data: existingDelivery, error: checkError } = await supabase.from("delivery_orders").select("id").eq("order_id", orderId).maybeSingle();
      if (checkError) {
        console.error("❌ Check delivery order error:", checkError);
      }
      if (!existingDelivery) {
        const { error: deliveryError } = await supabase.from("delivery_orders").insert({
          order_id: orderId,
          delivery_company_id: deliveryCompanyId,
          pickup_address: storeData?.store_address || "عنوان المتجر",
          pickup_latitude: storeData?.lat || 0,
          pickup_longitude: storeData?.lng || 0,
          delivery_address: order.delivery_address || "عنوان التوصيل",
          delivery_latitude: order.delivery_lat || 0,
          delivery_longitude: order.delivery_lng || 0,
          status: "pending",
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          estimated_pickup_at: new Date(Date.now() + 36e5).toISOString(),
          estimated_delivery_at: new Date(Date.now() + 72e5).toISOString(),
          delivery_fee: order.delivery_fee || 0,
          tracking_number: trackingNumber
        });
        if (deliveryError) {
          console.error("❌ Delivery order creation error:", deliveryError);
          toast.warning(app.lang === "ar" ? "⚠️ تم قبول الطلب لكن حدث خطأ في إنشاء طلب التوصيل (تحقق من الصلاحيات)" : "⚠️ Order accepted but delivery order creation failed (check permissions)");
        } else {
          console.log("✅ Delivery order created successfully");
        }
      } else {
        console.log("ℹ️ Delivery order already exists, skipping creation");
      }
      if (order.buyer_id) {
        const storeName = storeData?.store_name || "المتجر";
        const { error: buyerNotifyError } = await supabase.from("notifications").insert({
          user_id: order.buyer_id,
          type: "order_accepted",
          title_ar: `✅ تم قبول طلبك من "${storeName}"`,
          body_ar: `تم قبول طلبك بقيمة ${order.total?.toLocaleString() || 0} SYP وسيتم توصيله قريباً (رقم التتبع: ${trackingNumber})`,
          title_en: `✅ Your order from "${storeName}" was accepted`,
          body_en: `Your order for ${order.total?.toLocaleString() || 0} SYP was accepted and will be delivered soon (Tracking: ${trackingNumber})`,
          link_url: `/orders`,
          metadata: {
            order_id: orderId,
            store_name: storeName,
            total: order.total || 0,
            tracking_number: trackingNumber
          },
          created_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        if (buyerNotifyError) {
          console.error("❌ Buyer notification error:", buyerNotifyError);
        } else {
          console.log("✅ Buyer notification sent");
        }
      }
      if (deliveryCompanyId) {
        console.log(`🔍 Fetching admins for company: ${deliveryCompanyId}`);
        const { data: companyAdmins, error: adminsError } = await supabase.from("delivery_company_admins").select("user_id").eq("company_id", deliveryCompanyId);
        console.log(`📊 Found ${companyAdmins?.length || 0} admins`);
        console.log("👤 Admin IDs:", companyAdmins?.map((a) => a.user_id));
        if (!adminsError && companyAdmins && companyAdmins.length > 0) {
          const adminIds = companyAdmins.map((a) => a.user_id);
          console.log(`📨 Sending notifications to ${adminIds.length} admins`);
          const { error: notifyError } = await supabase.from("notifications").insert(
            adminIds.map((userId) => ({
              user_id: userId,
              type: "new_delivery_order",
              title_ar: `🚚 طلب توصيل جديد #${trackingNumber}`,
              body_ar: `تم قبول طلب توصيل جديد من المتجر (${storeData?.store_name || "المتجر"})`,
              title_en: `🚚 New delivery order #${trackingNumber}`,
              body_en: `New delivery order accepted from store (${storeData?.store_name || "Store"})`,
              link_url: `/delivery/dashboard`,
              metadata: {
                order_id: orderId,
                store_name: storeData?.store_name,
                delivery_company_id: deliveryCompanyId,
                tracking_number: trackingNumber
              }
            }))
          );
          if (!notifyError) {
            console.log(`✅ Notifications sent to ${adminIds.length} admins`);
            toast.success(
              app.lang === "ar" ? `✅ تم إرسال إشعار لـ ${adminIds.length} من أدمن شركة التوصيل` : `✅ Notified ${adminIds.length} delivery company admins`
            );
          } else {
            console.error("❌ Notification error:", notifyError);
          }
        } else {
          console.warn(`⚠️ No admins found for company ${deliveryCompanyId}`);
        }
      }
      toast.success(app.lang === "ar" ? `✅ تم قبول الطلب (رقم التتبع: ${trackingNumber})` : `✅ Order accepted (Tracking: ${trackingNumber})`);
      refetchOrders();
      setDetailDialogOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("❌ Error accepting order:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ في قبول الطلب" : "❌ Error accepting order");
    }
  }, [app.lang, refetchOrders]);
  const handleRejectOrder = reactExports.useCallback(async (orderId, reason) => {
    if (!reason.trim()) {
      toast.error(app.lang === "ar" ? "❌ الرجاء إدخال سبب الرفض" : "❌ Please enter a rejection reason");
      return;
    }
    setIsRejecting(true);
    try {
      const { data: order, error: orderError } = await supabase.from("orders").select(`
          id,
          buyer_id,
          promo_code_id,
          order_items (
            listings (
              title_ar,
              title_en,
              profiles:owner_id (
                store_name,
                full_name
              )
            )
          ),
          listings:listing_id (
            title_ar,
            title_en,
            profiles:owner_id (
              store_name,
              full_name
            )
          )
        `).eq("id", orderId).single();
      if (orderError) throw orderError;
      const { error: updateError } = await supabase.from("orders").update({
        status: "rejected",
        rejected_at: (/* @__PURE__ */ new Date()).toISOString(),
        rejected_by: app.user?.id,
        rejection_reason: reason.trim()
      }).eq("id", orderId);
      if (updateError) throw updateError;
      if (order.promo_code_id) {
        console.log(`🔄 [Reject Order] Decreasing used_count for promo code: ${order.promo_code_id}`);
        const { data: promoCode, error: fetchError } = await supabase.from("promo_codes").select("used_count").eq("id", order.promo_code_id).single();
        if (!fetchError && promoCode) {
          const newCount = Math.max(0, (promoCode.used_count || 0) - 1);
          const { error: updateCountError } = await supabase.from("promo_codes").update({ used_count: newCount }).eq("id", order.promo_code_id);
          if (updateCountError) {
            console.error("❌ Error decreasing used_count:", updateCountError);
          } else {
            console.log(`✅ Promo code used_count decreased to ${newCount}`);
          }
        }
        const { error: deleteUsageError } = await supabase.from("promo_code_usage").delete().eq("order_id", orderId);
        if (deleteUsageError) {
          console.error("❌ Error deleting promo usage record:", deleteUsageError);
        } else {
          console.log(`✅ Promo usage record deleted for order ${orderId}`);
        }
      }
      let storeName = "";
      if (order.order_items && order.order_items.length > 0) {
        const firstItem = order.order_items[0];
        const listing = firstItem?.listings;
        if (listing?.profiles) {
          storeName = app.lang === "ar" ? listing.profiles.store_name || listing.profiles.full_name || "المتجر" : listing.profiles.store_name || listing.profiles.full_name || "Store";
        }
      } else if (order.listings?.profiles) {
        storeName = app.lang === "ar" ? order.listings.profiles.store_name || order.listings.profiles.full_name || "المتجر" : order.listings.profiles.store_name || order.listings.profiles.full_name || "Store";
      }
      if (!storeName) {
        storeName = app.lang === "ar" ? "المتجر" : "Store";
      }
      const itemsCount = order.order_items?.length || 1;
      if (order.buyer_id) {
        await supabase.from("notifications").insert({
          user_id: order.buyer_id,
          type: "order_rejected",
          title_ar: "❌ تم رفض طلبك",
          body_ar: `تم رفض طلبك من متجر "${storeName}" (${itemsCount} منتج${itemsCount > 1 ? "ات" : ""}). السبب: ${reason.trim()}`,
          title_en: "❌ Your order was rejected",
          body_en: `Your order from "${storeName}" (${itemsCount} item${itemsCount > 1 ? "s" : ""}) was rejected. Reason: ${reason.trim()}`,
          link_url: `/orders`,
          metadata: {
            rejection_reason: reason.trim(),
            order_id: orderId,
            store_name: storeName
          }
        });
      }
      toast.success(app.lang === "ar" ? "✅ تم رفض الطلب مع إرسال السبب" : "✅ Order rejected with reason");
      refetchOrders();
      setRejectDialogOpen(false);
      setRejectOrderId(null);
      setRejectReason("");
    } catch (error) {
      console.error("❌ Error rejecting order:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ في رفض الطلب" : "❌ Error rejecting order");
    } finally {
      setIsRejecting(false);
    }
  }, [app.lang, app.user?.id, refetchOrders]);
  const exportToExcel = reactExports.useCallback(() => {
    const exportData = filteredOrders.map((order) => ({
      "رقم الطلب": String(order.id).slice(0, 8),
      "العميل": order.buyer_name || (app.lang === "ar" ? "عميل" : "Customer"),
      "رقم العميل": order.buyer_phone || "—",
      "الحالة": getStatusLabel(order.status),
      "التاريخ": new Date(order.created_at).toLocaleDateString(app.lang === "ar" ? "ar-SA" : "en-US"),
      "الوقت": new Date(order.created_at).toLocaleTimeString(app.lang === "ar" ? "ar-SA" : "en-US"),
      "المجموع الفرعي": formatPrice(Number(order.total) || 0, app.currency, app.lang),
      "التوصيل": order.delivery_fee ? formatPrice(Number(order.delivery_fee), app.currency, app.lang) : "0",
      "الخصم": order.promo_discount ? formatPrice(Number(order.promo_discount), app.currency, app.lang) : "0",
      "الإجمالي الكامل": formatPrice(Number(order.total_with_delivery) || Number(order.total) || 0, app.currency, app.lang)
    }));
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "الطلبات");
    ws["!cols"] = [{ wch: 15 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 15 }, { wch: 18 }];
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs$2(blob, `طلبات_المتجر_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير الطلبات إلى Excel" : "✅ Orders exported to Excel");
  }, [filteredOrders, app.lang, app.currency]);
  const exportToWord = reactExports.useCallback(() => {
    let html = `
      <html dir="rtl"><head><meta charset="UTF-8">
      <style>body{font-family:Arial;padding:20px}
      h1{color:#2a655f;text-align:center;border-bottom:2px solid #2a655f;padding-bottom:10px}
      th{background:#2a655f;color:#fff;padding:12px}
      td{padding:10px;border:1px solid #e2e8f0}
      tr:nth-child(even){background:#f8fafc}
      .stats{display:flex;gap:20px;margin:20px 0;flex-wrap:wrap}
      .stat{background:#f1f5f9;padding:15px;border-radius:10px;flex:1;min-width:120px;text-align:center}
      .stat .value{font-size:24px;font-weight:bold;color:#2a655f}
      .stat .label{font-size:12px;color:#64748b}
      </style></head><body>
      <h1>📊 تقرير طلبات المتجر</h1>
      <div class="stats">
        <div class="stat"><div class="value">${stats.total}</div><div class="label">إجمالي الطلبات</div></div>
        <div class="stat"><div class="value">${stats.pending}</div><div class="label">قيد المراجعة</div></div>
        <div class="stat"><div class="value">${stats.delivered}</div><div class="label">تم التوصيل</div></div>
        <div class="stat"><div class="value">${formatPrice(totalRevenue, app.currency, app.lang)}</div><div class="label">إجمالي الإيرادات</div></div>
      </div>
      <table><thead><tr>
        <th>#</th><th>رقم الطلب</th><th>العميل</th><th>رقم العميل</th><th>الحالة</th><th>التاريخ</th><th>الوقت</th><th>المجموع الفرعي</th><th>التوصيل</th><th>الخصم</th><th>الإجمالي الكامل</th>
      </tr></thead><tbody>
    `;
    filteredOrders.slice(0, 100).forEach((order, i) => {
      const totalWithDelivery = order.total_with_delivery || Number(order.total || 0) + Number(order.delivery_fee || 0) - Number(order.promo_discount || 0);
      html += `<tr>
        <td>${i + 1}</td>
        <td>${String(order.id).slice(0, 8)}</td>
        <td>${order.buyer_name || (app.lang === "ar" ? "عميل" : "Customer")}</td>
        <td>${order.buyer_phone || "—"}</td>
        <td>${getStatusLabel(order.status)}</td>
        <td>${new Date(order.created_at).toLocaleDateString("ar-SA")}</td>
        <td>${new Date(order.created_at).toLocaleTimeString("ar-SA")}</td>
        <td>${formatPrice(Number(order.total) || 0, app.currency, app.lang)}</td>
        <td>${order.delivery_fee ? formatPrice(Number(order.delivery_fee), app.currency, app.lang) : "0"}</td>
        <td>${order.promo_discount ? formatPrice(Number(order.promo_discount), app.currency, app.lang) : "0"}</td>
        <td>${formatPrice(totalWithDelivery, app.currency, app.lang)}</td>
      </tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: "application/msword;charset=utf-8" });
    saveAs$2(blob, `طلبات_المتجر_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير الطلبات إلى Word" : "✅ Orders exported to Word");
  }, [filteredOrders, stats, totalRevenue, app.lang, app.currency]);
  if (isLoading || isFetching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-8 w-8 text-[#2a655f] animate-pulse" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse", children: app.lang === "ar" ? "⏳ جاري تحميل طلباتك..." : "⏳ Loading your orders..." })
    ] });
  }
  if (isError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border-2 border-red-200/50 dark:border-red-800/30 p-20 text-center bg-red-50/50 dark:bg-red-950/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-20 w-20 text-red-500/60 mx-auto animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-semibold text-red-600 dark:text-red-400 mt-4", children: app.lang === "ar" ? "❌ حدث خطأ في تحميل الطلبات" : "❌ Error loading orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "mt-6 rounded-xl border-red-300/50 text-red-600 hover:bg-red-50",
          onClick: () => refetchOrders(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2" }),
            app.lang === "ar" ? "🔄 إعادة المحاولة" : "🔄 Retry"
          ]
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-4 w-4 sm:h-5 sm:w-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: app.lang === "ar" ? "طلباتي" : "My Orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 shrink-0", children: stats.total })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-3 flex-wrap mt-1.5 text-xs sm:text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-yellow-50 border border-yellow-200/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-yellow-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] sm:text-xs", children: [
              stats.pending,
              " ",
              app.lang === "ar" ? "قيد المراجعة" : "pending"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 border border-emerald-200/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Truck, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] sm:text-xs", children: [
              stats.delivered,
              " ",
              app.lang === "ar" ? "تم التوصيل" : "delivered"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-purple-50 border border-purple-200/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs", children: formatPrice(totalRevenue, app.currency, app.lang) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: exportToExcel,
            disabled: filteredOrders.length === 0,
            className: "rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              " Excel"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: exportToWord,
            disabled: filteredOrders.length === 0,
            className: "rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              " Word"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3", children: [
      { key: "total", label: app.lang === "ar" ? "الإجمالي" : "Total", value: stats.total, icon: ShoppingBag, gradient: "from-[#2a655f] to-[#1a4f4a]" },
      { key: "pending", label: app.lang === "ar" ? "قيد المراجعة" : "Pending", value: stats.pending, icon: Clock, gradient: "from-amber-500 to-orange-500" },
      { key: "accepted", label: app.lang === "ar" ? "مقبول" : "Accepted", value: stats.accepted, icon: CircleCheck, gradient: "from-emerald-500 to-teal-500" },
      { key: "rejected", label: app.lang === "ar" ? "مرفوض" : "Rejected", value: stats.rejected, icon: CircleX, gradient: "from-red-500 to-rose-500" },
      { key: "processing", label: app.lang === "ar" ? "قيد المعالجة" : "Processing", value: stats.processing, icon: RefreshCw, gradient: "from-blue-500 to-indigo-500" },
      { key: "shipped", label: app.lang === "ar" ? "تم الشحن" : "Shipped", value: stats.shipped, icon: Truck, gradient: "from-indigo-500 to-purple-500" },
      { key: "delivered", label: app.lang === "ar" ? "تم التوصيل" : "Delivered", value: stats.delivered, icon: CircleCheck, gradient: "from-teal-500 to-emerald-500" },
      { key: "cancelled", label: app.lang === "ar" ? "ملغي" : "Cancelled", value: stats.cancelled, icon: CircleX, gradient: "from-rose-500 to-pink-500" }
    ].map((stat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-2.5 sm:p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-slate-100/50 dark:bg-slate-700/20 blur-3xl animate-pulse" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate", children: stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: stat.value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-5 w-5 sm:h-6 sm:w-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`,
              style: { width: `${Math.min(100, stat.value / (stats.total || 1) * 100)}%` }
            }
          ) })
        ]
      },
      stat.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            },
            placeholder: app.lang === "ar" ? "🔍 ابحث برقم الطلب #، اسم العميل، التاريخ..." : "🔍 Search by Order #, Customer, Date...",
            className: "ps-9 pe-9 h-10 sm:h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 text-sm"
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setSearchQuery("");
              setCurrentPage(1);
            },
            className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors",
            "aria-label": app.lang === "ar" ? "مسح البحث" : "Clear search",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterStatus, onValueChange: (v) => {
          setFilterStatus(v);
          setCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-[#2a655f]/20 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5 text-slate-500 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: app.lang === "ar" ? "الحالة" : "Status" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: app.lang === "ar" ? "الكل" : "All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "pending", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "⏳ ",
              app.lang === "ar" ? "قيد المراجعة" : "Pending"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "accepted", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "✅ ",
              app.lang === "ar" ? "مقبول" : "Accepted"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "rejected", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "❌ ",
              app.lang === "ar" ? "مرفوض" : "Rejected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "processing", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "🔄 ",
              app.lang === "ar" ? "قيد المعالجة" : "Processing"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "shipped", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "🚚 ",
              app.lang === "ar" ? "تم الشحن" : "Shipped"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "delivered", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "✅ ",
              app.lang === "ar" ? "تم التوصيل" : "Delivered"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "cancelled", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "❌ ",
              app.lang === "ar" ? "ملغي" : "Cancelled"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterDateRange, onValueChange: (v) => {
          setFilterDateRange(v);
          setCurrentPage(1);
          if (v !== "custom") {
            setDateFrom("");
            setDateTo("");
            setTempDateFrom("");
            setTempDateTo("");
          }
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-[#2a655f]/20 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-slate-500 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: app.lang === "ar" ? "الفترة" : "Period" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "all", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "📅 ",
              app.lang === "ar" ? "الكل" : "All"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "today", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "📅 ",
              app.lang === "ar" ? "اليوم" : "Today"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "week", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "📅 ",
              app.lang === "ar" ? "آخر 7 أيام" : "Last 7 days"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "month", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "📅 ",
              app.lang === "ar" ? "آخر شهر" : "Last month"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "custom", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
              "📅 ",
              app.lang === "ar" ? "مخصص" : "Custom"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: String(itemsPerPage), onValueChange: (v) => {
          setItemsPerPage(Number(v));
          setCurrentPage(1);
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-[#2a655f]/20 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3.5 w-3.5 text-slate-500 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "10" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-slate-200 dark:border-slate-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "5", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "50" })
          ] })
        ] }) }),
        filterDateRange === "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 md:col-span-2 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setShowDatePicker(!showDatePicker),
              className: "w-full h-10 px-2 sm:px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300 flex items-center justify-center gap-1.5 text-xs sm:text-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3.5 w-3.5 text-[#2a655f] shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate", children: dateFrom || dateTo ? app.lang === "ar" ? "تعديل" : "Edit" : app.lang === "ar" ? "اختر" : "Select" }),
                showDatePicker ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" })
              ]
            }
          ),
          showDatePicker && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999999] bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl p-4 sm:p-5 w-[95vw] max-w-[420px] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-[#2a655f] dark:text-white flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4 text-[#2a655f]" }),
                app.lang === "ar" ? "اختر الفترة الزمنية" : "Select Time Period"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] animate-pulse", children: app.lang === "ar" ? "التاريخ والوقت" : "Date & Time" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "📅" }),
                app.lang === "ar" ? "من" : "From",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "(اختر التاريخ والوقت)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "datetime-local",
                  value: tempDateFrom,
                  onChange: (e) => setTempDateFrom(e.target.value),
                  className: "h-10 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 bg-white dark:bg-slate-800 text-sm transition-all duration-300 cursor-pointer"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]", children: "📅" }),
                app.lang === "ar" ? "إلى" : "To",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "(اختر التاريخ والوقت)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "datetime-local",
                  value: tempDateTo,
                  onChange: (e) => setTempDateTo(e.target.value),
                  className: "h-10 w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 bg-white dark:bg-slate-800 text-sm transition-all duration-300 cursor-pointer"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1 w-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3 w-3 text-[#2a655f]" }),
                app.lang === "ar" ? "اختيارات سريعة:" : "Quick picks:"
              ] }),
              [
                { label: app.lang === "ar" ? "اليوم" : "Today", value: "today" },
                { label: app.lang === "ar" ? "أمس" : "Yesterday", value: "yesterday" },
                { label: app.lang === "ar" ? "آخر 7 أيام" : "Last 7 days", value: "week" },
                { label: app.lang === "ar" ? "آخر 30 يوم" : "Last 30 days", value: "month" }
              ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    let from = /* @__PURE__ */ new Date();
                    let to = /* @__PURE__ */ new Date();
                    switch (item.value) {
                      case "today":
                        from.setHours(0, 0, 0, 0);
                        to.setHours(23, 59, 59, 999);
                        break;
                      case "yesterday":
                        from.setDate(from.getDate() - 1);
                        from.setHours(0, 0, 0, 0);
                        to.setDate(to.getDate() - 1);
                        to.setHours(23, 59, 59, 999);
                        break;
                      case "week":
                        from.setDate(from.getDate() - 7);
                        from.setHours(0, 0, 0, 0);
                        to.setHours(23, 59, 59, 999);
                        break;
                      case "month":
                        from.setMonth(from.getMonth() - 1);
                        from.setHours(0, 0, 0, 0);
                        to.setHours(23, 59, 59, 999);
                        break;
                    }
                    const fromStr = from.toISOString().slice(0, 16);
                    const toStr = to.toISOString().slice(0, 16);
                    setTempDateFrom(fromStr);
                    setTempDateTo(toStr);
                  },
                  className: "h-7 px-2.5 sm:px-3 rounded-lg text-[10px] border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-200",
                  children: item.label
                },
                item.value
              ))
            ] }),
            (tempDateFrom || tempDateTo) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border-2 border-slate-200 dark:border-slate-700 animate-in fade-in duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f] shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[#2a655f] dark:text-[#3a8a82] truncate", children: tempDateFrom && tempDateTo ? `${new Date(tempDateFrom).toLocaleString(app.lang === "ar" ? "ar-SA" : "en-US")} → ${new Date(tempDateTo).toLocaleString(app.lang === "ar" ? "ar-SA" : "en-US")}` : tempDateFrom ? `${app.lang === "ar" ? "من" : "From"} ${new Date(tempDateFrom).toLocaleString(app.lang === "ar" ? "ar-SA" : "en-US")}` : `${app.lang === "ar" ? "إلى" : "To"} ${new Date(tempDateTo).toLocaleString(app.lang === "ar" ? "ar-SA" : "en-US")}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => {
                    setTempDateFrom("");
                    setTempDateTo("");
                    setShowDatePicker(false);
                  },
                  className: "h-8 px-3 rounded-xl text-xs text-slate-500 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-300",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5 mr-1" }),
                    app.lang === "ar" ? "إلغاء" : "Cancel"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => {
                      setTempDateFrom("");
                      setTempDateTo("");
                      setDateFrom("");
                      setDateTo("");
                      setShowDatePicker(false);
                      setCurrentPage(1);
                    },
                    className: "h-8 px-3 rounded-xl text-xs border-2 border-red-200/50 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-300",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5 mr-1" }),
                      app.lang === "ar" ? "مسح" : "Clear"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: () => {
                      if (tempDateFrom) setDateFrom(tempDateFrom);
                      if (tempDateTo) setDateTo(tempDateTo);
                      setShowDatePicker(false);
                      setCurrentPage(1);
                    },
                    className: "h-8 px-4 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 border-2 border-[#2a655f]/30",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1" }),
                      app.lang === "ar" ? "تطبيق" : "Apply"
                    ]
                  }
                )
              ] })
            ] })
          ] }) }),
          (dateFrom || dateTo) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 mt-2 flex items-center gap-2 px-3 py-1.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border-2 border-slate-200 dark:border-slate-700 animate-in fade-in duration-300 whitespace-nowrap z-50 max-w-[280px] overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f] shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82] truncate", children: dateFrom && dateTo ? `${new Date(dateFrom).toLocaleString(app.lang === "ar" ? "ar-SA" : "en-US")} → ${new Date(dateTo).toLocaleString(app.lang === "ar" ? "ar-SA" : "en-US")}` : dateFrom ? `${app.lang === "ar" ? "من" : "From"} ${new Date(dateFrom).toLocaleString(app.lang === "ar" ? "ar-SA" : "en-US")}` : `${app.lang === "ar" ? "إلى" : "To"} ${new Date(dateTo).toLocaleString(app.lang === "ar" ? "ar-SA" : "en-US")}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setDateFrom("");
                  setDateTo("");
                  setTempDateFrom("");
                  setTempDateTo("");
                  setCurrentPage(1);
                },
                className: "ml-1 text-[#2a655f]/60 hover:text-red-500 transition-colors shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
          "col-span-1",
          filterDateRange === "custom" ? "md:col-span-2" : "md:col-span-4"
        ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              setSearchQuery("");
              setFilterStatus("all");
              setFilterDateRange("all");
              setDateFrom("");
              setDateTo("");
              setTempDateFrom("");
              setTempDateTo("");
              setItemsPerPage(10);
              setCurrentPage(1);
            },
            className: "w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 group text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
              app.lang === "ar" ? "مسح الكل" : "Clear All"
            ]
          }
        ) })
      ] }),
      (searchQuery || filterStatus !== "all" || filterDateRange !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] sm:text-xs text-slate-500 dark:text-slate-400", children: app.lang === "ar" ? `📊 ${filteredOrders.length} نتيجة من أصل ${storeOrders.length}` : `📊 ${filteredOrders.length} of ${storeOrders.length} results` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setSearchQuery("");
              setFilterStatus("all");
              setFilterDateRange("all");
              setDateFrom("");
              setDateTo("");
              setCurrentPage(1);
            },
            className: "text-[11px] sm:text-xs text-[#2a655f] hover:text-[#d81b60] font-medium transition-colors",
            children: app.lang === "ar" ? "إعادة تعيين" : "Reset"
          }
        )
      ] })
    ] }),
    storeOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border-3 border-dashed border-slate-200 dark:border-slate-700 p-10 sm:p-20 text-center bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-800/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-10 w-10 sm:h-12 sm:w-12 text-[#2a655f]/60" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl sm:text-2xl font-bold mt-4 sm:mt-6 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent", children: app.lang === "ar" ? "📦 لا توجد طلبات بعد" : "📦 No orders yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto", children: app.lang === "ar" ? "عندما يقوم العملاء بشراء منتجاتك، ستظهر طلباتهم هنا" : "When customers purchase your products, their orders will appear here" })
    ] }) : filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border-3 border-dashed border-slate-200 dark:border-slate-700 p-10 sm:p-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground/40 mx-auto" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg sm:text-xl font-semibold text-muted-foreground mt-4", children: app.lang === "ar" ? "🔍 لا توجد نتائج مطابقة" : "🔍 No matching results" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          className: "mt-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
          onClick: () => {
            setSearchQuery("");
            setFilterStatus("all");
            setFilterDateRange("all");
            setDateFrom("");
            setDateTo("");
            setCurrentPage(1);
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-2" }),
            app.lang === "ar" ? "مسح الفلاتر" : "Clear filters"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-bold text-[#2a655f] dark:text-slate-300 text-xs uppercase tracking-wider border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "رقم الطلب" : "Order #"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-bold text-[#2a655f] dark:text-slate-300 text-xs uppercase tracking-wider border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "العميل" : "Customer"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-bold text-[#2a655f] dark:text-slate-300 text-xs uppercase tracking-wider border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "رقم العميل" : "Phone"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-bold text-[#2a655f] dark:text-slate-300 text-xs uppercase tracking-wider border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "الوقت" : "Time"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-bold text-[#2a655f] dark:text-slate-300 text-xs uppercase tracking-wider border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "الحالة" : "Status"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-center font-bold text-[#2a655f] dark:text-slate-300 text-xs uppercase tracking-wider", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" }),
            app.lang === "ar" ? "الإجراءات" : "Actions"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y-2 divide-slate-200/60 dark:divide-slate-700/60", children: paginatedOrders.map((order) => {
          const StatusIcon = getStatusIcon(order.status);
          const statusColor = getStatusColor(order.status);
          const isPending = order.status === "pending";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "group hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 cursor-pointer border-b-2 border-slate-200/60 dark:border-slate-700/60",
              onClick: () => {
                setSelectedOrder(order);
                setDetailDialogOpen(true);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-sm text-[#2a655f] dark:text-slate-300 group-hover:text-[#2a655f] transition-colors", children: [
                  "#",
                  String(order.id).slice(0, 8)
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-400 transition-colors" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-800 dark:text-slate-200 group-hover:text-[#2a655f] transition-colors", children: order.buyer_name || (app.lang === "ar" ? "عميل" : "Customer") })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: order.buyer_phone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-400 transition-colors" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-slate-600 dark:text-slate-300 group-hover:text-[#2a655f] transition-colors", children: order.buyer_phone })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "—" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-[#2a655f] transition-colors", children: new Date(order.created_at).toLocaleDateString(
                    app.lang === "ar" ? "ar-SA" : "en-US",
                    { day: "numeric", month: "short" }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                    new Date(order.created_at).toLocaleTimeString(
                      app.lang === "ar" ? "ar-SA" : "en-US",
                      { hour: "2-digit", minute: "2-digit" }
                    )
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `${statusColor} border-2 border-slate-200 dark:border-slate-700 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit mx-auto hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3 w-3" }),
                  getStatusLabel(order.status)
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelectedOrder(order);
                        setDetailDialogOpen(true);
                      },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-4 w-4 text-slate-500 dark:text-slate-400" })
                    }
                  ),
                  isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        className: "h-8 px-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/30",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleAcceptOrder(order.id);
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1" }),
                          app.lang === "ar" ? "قبول" : "Accept"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        className: "h-8 px-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-red-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/30",
                        onClick: (e) => {
                          e.stopPropagation();
                          setRejectOrderId(order.id);
                          setRejectReason("");
                          setRejectDialogOpen(true);
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5 mr-1" }),
                          app.lang === "ar" ? "رفض" : "Reject"
                        ]
                      }
                    )
                  ] }),
                  !isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: `${statusColor} border-2 border-slate-200 dark:border-slate-700 text-[9px] px-2 py-0.5 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors`, children: [
                    order.status === "accepted" && "✅ " + (app.lang === "ar" ? "مقبول" : "Accepted"),
                    order.status === "rejected" && "❌ " + (app.lang === "ar" ? "مرفوض" : "Rejected"),
                    order.status === "processing" && "🔄 " + (app.lang === "ar" ? "قيد المعالجة" : "Processing"),
                    order.status === "shipped" && "🚚 " + (app.lang === "ar" ? "تم الشحن" : "Shipped"),
                    order.status === "delivered" && "✅ " + (app.lang === "ar" ? "تم التوصيل" : "Delivered"),
                    order.status === "cancelled" && "❌ " + (app.lang === "ar" ? "ملغي" : "Cancelled")
                  ] })
                ] }) })
              ]
            },
            order.id
          );
        }) })
      ] }) }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4 pt-4 border-t-2 border-slate-200 dark:border-slate-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 flex items-center gap-2 justify-center sm:justify-start w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
          app.lang === "ar" ? `صفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "|" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            totalItems,
            " ",
            app.lang === "ar" ? "طلب" : "orders"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCurrentPage(1),
              disabled: currentPage === 1,
              className: "h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "«" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCurrentPage(currentPage - 1),
              disabled: currentPage === 1,
              className: "h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2", children: Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: pageNum === currentPage ? "default" : "ghost",
                size: "sm",
                onClick: () => setCurrentPage(pageNum),
                className: cn(
                  "h-8 w-8 p-0 rounded-lg sm:rounded-xl text-xs font-medium transition-all duration-300",
                  pageNum === currentPage ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 border-0 scale-105" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200"
                ),
                children: pageNum
              },
              pageNum
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCurrentPage(currentPage + 1),
              disabled: currentPage === totalPages,
              className: "h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setCurrentPage(totalPages),
              disabled: currentPage === totalPages,
              className: "h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-40",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "»" })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: detailDialogOpen, onOpenChange: setDetailDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30 transition-all duration-300 hover:scale-110 hover:rotate-90",
          onClick: () => setDetailDialogOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      ),
      selectedOrder && (() => {
        let storeName = "";
        let storeLogo = null;
        let storePhone = null;
        if (selectedOrder.order_items && selectedOrder.order_items.length > 0) {
          const firstItem = selectedOrder.order_items[0];
          const listing = firstItem?.listings;
          if (listing?.profile) {
            storeName = listing.profile.store_name || listing.profile.full_name || (app.lang === "ar" ? "متجر" : "Store");
            storeLogo = listing.profile.store_logo_url || null;
            storePhone = listing.profile.store_phone || null;
          }
        }
        if (!storeName && selectedOrder.listings?.profile) {
          storeName = selectedOrder.listings.profile.store_name || selectedOrder.listings.profile.full_name || (app.lang === "ar" ? "متجر" : "Store");
          storeLogo = selectedOrder.listings.profile.store_logo_url || null;
          storePhone = selectedOrder.listings.profile.store_phone || null;
        }
        if (!storeName) {
          storeName = app.lang === "ar" ? "متجر" : "Store";
        }
        const totalItems2 = selectedOrder.order_items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || selectedOrder.quantity || 1;
        const totalPrice = selectedOrder.order_items?.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0) || Number(selectedOrder.total) || 0;
        const deliveryFee = Number(selectedOrder.delivery_fee) || 0;
        const promoDiscount = Number(selectedOrder.promo_discount) || 0;
        const totalWithDelivery = Number(selectedOrder.total_with_delivery) || totalPrice + deliveryFee - promoDiscount;
        const status = getOrderStatus(selectedOrder.status);
        const StatusIcon = status.icon;
        const isActive = selectedOrder.status === "pending" || selectedOrder.status === "accepted" || selectedOrder.status === "shipped" || selectedOrder.status === "assigned";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white shadow-lg shadow-[#0d2e2a]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "h-5 w-5" }) }),
                app.lang === "ar" ? "تفاصيل الطلب" : "Order Details"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#2a655f]" }),
                "#",
                String(selectedOrder.id).slice(0, 12)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: cn(
              "border-2 border-slate-200 dark:border-slate-700 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors",
              status.bg,
              status.border,
              status.color,
              isActive && "animate-pulse"
            ), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3.5 w-3.5" }),
              status.label
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
            "p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 mb-4",
            status.bg,
            status.border
          ), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: cn("h-5 w-5", status.color) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm", children: status.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: status.description })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              storeLogo ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: storeLogo,
                  alt: storeName,
                  className: "h-12 w-12 rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white font-bold text-lg", children: storeName.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3 text-[#2a655f]" }),
                  app.lang === "ar" ? "المتجر" : "Store"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-700 dark:text-slate-300", children: storeName }),
                storePhone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                  storePhone
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-[#2a655f]" }),
                app.lang === "ar" ? "العميل" : "Customer"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-slate-700 dark:text-slate-300", children: selectedOrder.buyer_name || (app.lang === "ar" ? "عميل" : "Customer") }),
              selectedOrder.buyer_phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3" }),
                selectedOrder.buyer_phone
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
              app.lang === "ar" ? "المنتجات" : "Products",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]", children: selectedOrder.order_items?.length || 1 })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mt-2", children: selectedOrder.order_items && selectedOrder.order_items.length > 0 ? selectedOrder.order_items.map((item, index) => {
              const listing = item.listings || item;
              const isPromo = isPromoOffer(item);
              const offerData = getPromoOfferData(item);
              const requiredVariations = offerData?.required_products?.variations || {};
              const giftVariations = offerData?.free_product?.variations || {};
              const hasRequired = Object.keys(requiredVariations).length > 0;
              const hasGift = Object.keys(giftVariations).length > 0;
              const getVariationImage = (item2) => {
                if (item2.metadata?.variation_image) return item2.metadata.variation_image;
                if (item2.metadata?.product_cover) return item2.metadata.product_cover;
                if (item2.selected_options?.variation_image) return item2.selected_options.variation_image;
                if (item2.variation_snapshot?.image_url) return item2.variation_snapshot.image_url;
                if (item2.selected_options?.selected_variation_id) {
                  const variations = listing?.variations || [];
                  const variation = variations.find((v) => v.id === item2.selected_options.selected_variation_id);
                  if (variation?.image_url) return variation.image_url;
                  if (variation?.color_id) {
                    const colors = listing?.colors || [];
                    const color = colors.find((c) => c.id === variation.color_id);
                    if (color?.image_url) return color.image_url;
                  }
                }
                if (item2.selected_variation_id) {
                  const variations = listing?.variations || [];
                  const variation = variations.find((v) => v.id === item2.selected_variation_id);
                  if (variation?.image_url) return variation.image_url;
                  if (variation?.color_id) {
                    const colors = listing?.colors || [];
                    const color = colors.find((c) => c.id === variation.color_id);
                    if (color?.image_url) return color.image_url;
                  }
                  if (variation?.combination) {
                    const colorKeys = ["colors", "color", "اللون", "لون", "colour"];
                    let colorValue = null;
                    for (const key of colorKeys) {
                      if (variation.combination[key]) {
                        colorValue = variation.combination[key];
                        break;
                      }
                    }
                    if (colorValue) {
                      const colors = listing?.colors || [];
                      const color = colors.find(
                        (c) => c.color_name_ar === colorValue || c.color_name_en === colorValue
                      );
                      if (color?.image_url) return color.image_url;
                    }
                  }
                }
                if (item2.variation_combination?.colors) {
                  const colorName = item2.variation_combination.colors;
                  const colors = listing?.colors || [];
                  const color = colors.find(
                    (c) => c.color_name_ar === colorName || c.color_name_en === colorName
                  );
                  if (color?.image_url) return color.image_url;
                }
                return listing?.cover_url || null;
              };
              const imageUrl = getVariationImage(item);
              const getVariationCombination = (item2) => {
                if (item2.variation_snapshot?.combination) return item2.variation_snapshot.combination;
                if (item2.metadata?.variation_combination) return item2.metadata.variation_combination;
                if (item2.variation_combination) return item2.variation_combination;
                if (item2.selected_options?.variation_combination) return item2.selected_options.variation_combination;
                return null;
              };
              const variationCombination = getVariationCombination(item);
              const hasVariation = !!(variationCombination && Object.keys(variationCombination).length > 0);
              const getVariationDisplay = (combination) => {
                if (!combination) return null;
                const parts = [];
                const order = ["colors", "sizes", "size", "color", "اللون", "المقاس", "colour"];
                for (const key of order) {
                  if (combination[key]) parts.push(combination[key]);
                }
                for (const [key, value] of Object.entries(combination)) {
                  if (!order.includes(key) && value) parts.push(String(value));
                }
                return parts.length > 0 ? parts.join(" • ") : null;
              };
              const variationDisplay = getVariationDisplay(variationCombination);
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "p-3 rounded-xl border-2 transition-all duration-300",
                    isPromo ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-300/50 dark:border-purple-700/50 hover:border-purple-400/70" : "bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600"
                  ),
                  children: isPromo ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-3 py-1 rounded-full text-xs font-bold", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-3.5 w-3.5 inline mr-1.5" }),
                        app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-purple-300 text-purple-600 text-[10px]", children: offerData?.offer_type === "bogo" ? "🎁 نفس المنتج" : offerData?.offer_type === "cross_sell" ? "🔄 منتج مختلف" : "📦 باقة" })
                    ] }),
                    offerData?.display_text_ar && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: app.lang === "ar" ? offerData.display_text_ar : offerData.display_text_en }),
                    hasRequired && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-slate-500 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-4 bg-purple-500 rounded-full" }),
                        "🛒 ",
                        app.lang === "ar" ? "المنتجات المطلوبة" : "Required Products",
                        " (",
                        Object.keys(requiredVariations).length,
                        ")"
                      ] }),
                      Object.entries(requiredVariations).map(([id, data]) => {
                        const comboText = Object.values(data.combination || {}).join(" • ");
                        const variationImage = data.image_url || offerData?.required_products?.main_product?.cover_url || null;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 bg-white/70 rounded-xl border border-purple-100/50", children: [
                          variationImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: variationImage,
                              alt: comboText,
                              className: "w-10 h-10 rounded-lg object-cover border border-purple-100",
                              onError: (e) => {
                                e.target.src = "/placeholder.png";
                              }
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-5 w-5" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 truncate", children: comboText || "فيرنت" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                              app.lang === "ar" ? "الكمية" : "Qty",
                              ": ",
                              data.quantity
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-purple-600 whitespace-nowrap", children: [
                            (data.price * data.quantity).toLocaleString(),
                            " SYP"
                          ] })
                        ] }, id);
                      })
                    ] }),
                    hasGift && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-emerald-500 flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-4 bg-emerald-500 rounded-full" }),
                        "🎁 ",
                        app.lang === "ar" ? "الهدية" : "Gift",
                        " (",
                        Object.keys(giftVariations).length,
                        ")"
                      ] }),
                      Object.entries(giftVariations).map(([id, data]) => {
                        const comboText = Object.values(data.combination || {}).join(" • ");
                        const giftImage = data.image_url || offerData?.free_product?.cover_url || null;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-2 bg-emerald-50/70 rounded-xl border border-emerald-100/50", children: [
                          giftImage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "img",
                            {
                              src: giftImage,
                              alt: comboText,
                              className: "w-10 h-10 rounded-lg object-cover border border-emerald-100",
                              onError: (e) => {
                                e.target.src = "/placeholder.png";
                              }
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-5 w-5" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-700 truncate", children: comboText || "فيرنت" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                              app.lang === "ar" ? "الكمية" : "Qty",
                              ": ",
                              data.quantity
                            ] })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-600 border-0 text-xs font-bold px-3 py-1 rounded-full", children: [
                            "🎁 ",
                            app.lang === "ar" ? "مجاناً" : "Free"
                          ] })
                        ] }, id);
                      })
                    ] })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-200/50 dark:border-slate-700/50", children: imageUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: imageUrl,
                        alt: "",
                        className: "h-full w-full object-cover"
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-slate-400" }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-slate-800 dark:text-white", children: app.lang === "ar" ? listing?.title_ar || "منتج" : listing?.title_en || listing?.title_ar || "Product" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground flex-wrap mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-slate-600 dark:text-slate-400", children: app.lang === "ar" ? "الكمية:" : "Qty:" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800 dark:text-white", children: item.quantity || 1 })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-600 dark:text-emerald-400", children: app.lang === "ar" ? "السعر:" : "Price:" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-emerald-700 dark:text-emerald-300", children: formatPrice(
                            item.total || Number(item.price) * (item.quantity || 1) || 0,
                            app.currency,
                            app.lang
                          ) })
                        ] }),
                        hasVariation && variationDisplay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 px-2 py-0.5 rounded-full border border-[#2a655f]/10 dark:border-[#2a655f]/20", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-3 w-3 text-[#2a655f] dark:text-[#3a8a82]" }),
                            variationDisplay,
                            imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "img",
                              {
                                src: imageUrl,
                                alt: "",
                                className: "h-4 w-4 rounded-md object-cover border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0 ml-0.5"
                              }
                            )
                          ] })
                        ] }),
                        item.metadata?.variation_combination && Object.keys(item.metadata.variation_combination).length > 0 && !variationDisplay && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] text-muted-foreground/70 flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "h-2.5 w-2.5" }),
                            Object.values(item.metadata.variation_combination).join(" • ")
                          ] })
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/listing/$id", params: { id: item.listing_id || item.id }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 text-slate-500 dark:text-slate-400" }) }) })
                  ] })
                },
                item.id || index
              );
            }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border-2 border-slate-200/50 dark:border-slate-700/50", children: selectedOrder.listings?.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: selectedOrder.listings.cover_url,
                  alt: "",
                  className: "h-full w-full object-cover"
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-6 w-6 text-slate-400" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-slate-800 dark:text-white", children: app.lang === "ar" ? selectedOrder.listings?.title_ar || "منتج" : selectedOrder.listings?.title_en || selectedOrder.listings?.title_ar || "Product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: app.lang === "ar" ? "الكمية:" : "Qty:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-slate-800 dark:text-white", children: selectedOrder.quantity || 1 })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30", children: "•" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 bg-[#2a655f]/10 dark:bg-[#2a655f]/20 px-2 py-0.5 rounded-full", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-[#2a655f] dark:text-[#3a8a82]", children: app.lang === "ar" ? "الإجمالي:" : "Total:" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#2a655f] dark:text-[#3a8a82]", children: formatPrice(Number(selectedOrder.total) || 0, app.currency, app.lang) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/listing/$id", params: { id: selectedOrder.listing_id }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-8 w-8 p-0 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-3.5 w-3.5 text-slate-500 dark:text-slate-400" }) }) })
            ] }) }) })
          ] }),
          selectedOrder.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border-2 border-yellow-200/50 dark:border-yellow-800/30 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
              app.lang === "ar" ? "ملاحظات العميل" : "Customer Notes"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-1", children: selectedOrder.notes })
          ] }),
          selectedOrder.status === "rejected" && selectedOrder.rejection_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border-2 border-red-200/50 dark:border-red-800/30 mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3.5 w-3.5" }),
              app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-700 dark:text-slate-300 mt-1", children: selectedOrder.rejection_reason })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: app.lang === "ar" ? "المجموع الفرعي" : "Subtotal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-bold text-[#0d2e2a] dark:text-[#3a8a82]", children: formatPrice(totalPrice, app.currency, app.lang) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "سعر التوصيل" : "Delivery Fee" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                "text-sm font-medium",
                deliveryFee === 0 ? "text-emerald-500 font-bold" : "text-[#0d2e2a] dark:text-[#3a8a82]"
              ), children: deliveryFee === 0 ? app.lang === "ar" ? "🆓 مجاني" : "🆓 Free" : formatPrice(deliveryFee, app.currency, app.lang) })
            ] }),
            promoDiscount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-emerald-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: app.lang === "ar" ? "💚 الخصم" : "💚 Discount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold", children: [
                "-",
                formatPrice(promoDiscount, app.currency, app.lang)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-2 pt-2 border-t-2 border-slate-200/50 dark:border-slate-700/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-[#0d2e2a] dark:text-white", children: app.lang === "ar" ? "الإجمالي الكامل" : "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-[#0d2e2a] dark:text-[#3a8a82]", children: formatPrice(totalWithDelivery, app.currency, app.lang) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                totalItems2,
                " ",
                app.lang === "ar" ? "منتج" : "items"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: new Date(selectedOrder.created_at).toLocaleString(
                app.lang === "ar" ? "ar-SA" : "en-US",
                { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-4 border-t-2 border-slate-200/50 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setDetailDialogOpen(false),
                className: "rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300",
                children: app.lang === "ar" ? "إغلاق" : "Close"
              }
            ),
            selectedOrder.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/30",
                  onClick: () => {
                    setDetailDialogOpen(false);
                    handleAcceptOrder(selectedOrder.id);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-1.5" }),
                    app.lang === "ar" ? "قبول الطلب" : "Accept Order"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:scale-105 border-2 border-white/30",
                  onClick: () => {
                    setDetailDialogOpen(false);
                    setRejectOrderId(selectedOrder.id);
                    setRejectReason("");
                    setRejectDialogOpen(true);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-1.5" }),
                    app.lang === "ar" ? "رفض الطلب" : "Reject Order"
                  ]
                }
              )
            ] })
          ] })
        ] });
      })()
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: rejectDialogOpen, onOpenChange: setRejectDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-3 text-xl font-bold text-red-600 dark:text-red-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-red-100 dark:bg-red-900/30 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-6 w-6 text-red-600 dark:text-red-400" }) }),
        app.lang === "ar" ? "رفض الطلب" : "Reject Order"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: app.lang === "ar" ? "سيتم إرسال سبب الرفض إلى العميل ليتمكن من فهم سبب الرفض" : "The rejection reason will be sent to the customer so they can understand why" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-1.5", children: [
            app.lang === "ar" ? "سبب الرفض" : "Rejection Reason",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: rejectReason,
              onChange: (e) => setRejectReason(e.target.value),
              placeholder: app.lang === "ar" ? "اكتب سبب رفض الطلب..." : "Write the reason for rejecting the order...",
              className: "w-full min-h-[100px] p-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 resize-none",
              dir: app.lang === "ar" ? "rtl" : "ltr"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 text-right", children: [
            rejectReason.length,
            "/500"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [
          app.lang === "ar" ? "المنتج غير متوفر" : "Product unavailable",
          app.lang === "ar" ? "سعر غير صحيح" : "Incorrect price",
          app.lang === "ar" ? "عنوان غير صحيح" : "Invalid address",
          app.lang === "ar" ? "مشكلة في الدفع" : "Payment issue",
          app.lang === "ar" ? "سبب آخر" : "Other reason"
        ].map((reason, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setRejectReason(reason),
            className: "px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200",
            children: reason
          },
          idx
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => {
                setRejectDialogOpen(false);
                setRejectOrderId(null);
                setRejectReason("");
              },
              className: "flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800",
              children: app.lang === "ar" ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "destructive",
              onClick: () => {
                if (rejectOrderId) {
                  handleRejectOrder(rejectOrderId, rejectReason);
                }
              },
              disabled: !rejectReason.trim() || isRejecting,
              className: "flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 border-2 border-white/30",
              children: isRejecting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-2 animate-spin" }),
                app.lang === "ar" ? "جاري الرفض..." : "Rejecting..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4 mr-2" }),
                app.lang === "ar" ? "تأكيد الرفض" : "Confirm Reject"
              ] })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
});
const { saveAs: saveAs$1 } = pkg__default;
function CustomersPage() {
  const app = useApp();
  useT();
  const { data: rows = [], isLoading, refetch } = useSellerCustomers(app.user?.id);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [sortBy, setSortBy] = reactExports.useState("orders");
  const [sortOrder, setSortOrder] = reactExports.useState("desc");
  const [page, setPage] = reactExports.useState(1);
  const [limit, setLimit] = reactExports.useState(10);
  reactExports.useEffect(() => {
    const currentScroll = window.scrollY;
    let isBlocking = true;
    let timeoutId = null;
    const preventScroll = () => {
      if (isBlocking) {
        window.scrollTo({ top: currentScroll, behavior: "instant" });
      }
    };
    window.addEventListener("scroll", preventScroll, { passive: true });
    window.addEventListener("wheel", preventScroll, { passive: true });
    window.addEventListener("touchmove", preventScroll, { passive: true });
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    });
    timeoutId = setTimeout(() => {
      isBlocking = false;
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    }, 300);
    return () => {
      isBlocking = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);
  const filteredCustomers = reactExports.useMemo(() => {
    let result = rows;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c) => {
        const name = (c.full_name || "").toLowerCase();
        const phone = (c.phone || "").toLowerCase();
        return name.includes(q) || phone.includes(q);
      });
    }
    result = [...result].sort((a, b) => {
      let aVal = a[sortBy] || 0;
      let bVal = b[sortBy] || 0;
      if (sortBy === "name") {
        aVal = (a.full_name || "").toLowerCase();
        bVal = (b.full_name || "").toLowerCase();
      }
      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return result;
  }, [rows, searchQuery, sortBy, sortOrder]);
  const totalPages = Math.ceil(filteredCustomers.length / limit);
  const paginatedCustomers = reactExports.useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredCustomers.slice(start, end);
  }, [filteredCustomers, page, limit]);
  const stats = {
    total: rows.length,
    totalOrders: rows.reduce((sum, c) => sum + (c.orders || 0), 0),
    totalSpend: rows.reduce((sum, c) => sum + (c.spend || 0), 0),
    avgOrders: rows.length > 0 ? Math.round(rows.reduce((sum, c) => sum + (c.orders || 0), 0) / rows.length * 10) / 10 : 0,
    topCustomer: rows.length > 0 ? rows.reduce((a, b) => (a.spend || 0) > (b.spend || 0) ? a : b) : null
  };
  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const exportToExcel = () => {
    const exportData = filteredCustomers.map((c) => ({
      "الاسم": c.full_name || "—",
      "رقم الهاتف": c.phone || "—",
      "عدد الطلبات": c.orders || 0,
      "إجمالي الإنفاق": formatPrice(c.spend || 0, app.currency, app.lang),
      "آخر طلب": c.last_order ? new Date(c.last_order).toLocaleDateString(app.lang === "ar" ? "ar-SA" : "en-US") : "—"
    }));
    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "العملاء");
    ws["!cols"] = [
      { wch: 25 },
      // الاسم
      { wch: 18 },
      // رقم الهاتف
      { wch: 15 },
      // عدد الطلبات
      { wch: 20 },
      // إجمالي الإنفاق
      { wch: 20 }
      // آخر طلب
    ];
    const wbout = writeSync(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs$1(blob, `العملاء_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };
  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; padding: 20px; }
          h1 { color: #2a655f; text-align: center; border-bottom: 2px solid #f9a8d4; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background: #2a655f; color: white; padding: 12px; text-align: right; }
          td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
          tr:nth-child(even) { background: #f8fafc; }
          .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
          .badge { display: inline-block; padding: 2px 10px; border-radius: 20px; font-size: 12px; }
          .badge-gold { background: #fef3c7; color: #92400e; }
          .badge-silver { background: #f1f5f9; color: #475569; }
          .badge-bronze { background: #fef3c7; color: #92400e; }
        </style>
      </head>
      <body>
        <h1>📊 تقرير العملاء</h1>
        <p style="text-align: center; color: #64748b;">
          تاريخ التقرير: ${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA")}
        </p>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>الاسم</th>
              <th>رقم الهاتف</th>
              <th>عدد الطلبات</th>
              <th>إجمالي الإنفاق</th>
            </tr>
          </thead>
          <tbody>
    `;
    filteredCustomers.forEach((c, index) => {
      const badge = index === 0 ? '<span class="badge badge-gold">🥇</span>' : index === 1 ? '<span class="badge badge-silver">🥈</span>' : index === 2 ? '<span class="badge badge-bronze">🥉</span>' : "";
      htmlContent += `
        <tr>
          <td>${index + 1} ${badge}</td>
          <td>${c.full_name || "—"}</td>
          <td>${c.phone || "—"}</td>
          <td>${c.orders || 0}</td>
          <td>${formatPrice(c.spend || 0, app.currency, app.lang)}</td>
        </tr>
      `;
    });
    htmlContent += `
          </tbody>
        </table>
        <div class="footer">
          إجمالي العملاء: ${filteredCustomers.length} | تم التصدير من لوحة البائع
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: "application/msword;charset=utf-8" });
    saveAs$1(blob, `العملاء_${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA").replace(/\//g, "-")}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-[#2a655f] animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse", children: app.lang === "ar" ? "⏳ جاري تحميل العملاء..." : "⏳ Loading customers..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 sm:space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#f9a8d4]/5 blur-2xl animate-pulse", style: { animationDelay: "1s" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 sm:gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#f9a8d4]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-bounce" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: app.lang === "ar" ? "العملاء" : "Customers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 animate-pulse shrink-0", children: stats.total })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs sm:text-sm text-muted-foreground mt-1 flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#2a655f] animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium text-[10px] sm:text-xs", children: stats.totalOrders }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-muted-foreground", children: app.lang === "ar" ? "طلب" : "orders" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium text-[10px] sm:text-xs", children: formatPrice(stats.totalSpend, app.currency, app.lang) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-muted-foreground", children: app.lang === "ar" ? "إنفاق" : "spend" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: exportToExcel,
            disabled: filteredCustomers.length === 0,
            className: "rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileSpreadsheet, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              "Excel"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: exportToWord,
            disabled: filteredCustomers.length === 0,
            className: "rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-8 sm:h-9 px-2.5 sm:px-3 text-[11px] sm:text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" }),
              "Word"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4", children: [
      { key: "total", label: app.lang === "ar" ? "إجمالي العملاء" : "Total Customers", value: stats.total, icon: Users, gradient: "from-[#2a655f] to-[#1a4f4a]" },
      { key: "orders", label: app.lang === "ar" ? "إجمالي الطلبات" : "Total Orders", value: stats.totalOrders, icon: ShoppingCart, gradient: "from-[#1a4f4a] to-[#3a8a82]" },
      { key: "spend", label: app.lang === "ar" ? "إجمالي الإنفاق" : "Total Spend", value: formatPrice(stats.totalSpend, app.currency, app.lang), icon: Wallet, gradient: "from-emerald-500 to-teal-500" },
      { key: "avg", label: app.lang === "ar" ? "متوسط الطلبات" : "Avg Orders", value: stats.avgOrders, icon: Award, gradient: "from-[#3a8a82] to-[#4a9f95]" }
    ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-2.5 sm:p-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-slate-100/50 dark:bg-slate-700/20 blur-3xl animate-pulse" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider truncate", children: stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: stat.value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-white dark:bg-[#1e293b] border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-5 w-5 sm:h-6 sm:w-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" }) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`,
              style: { width: `100%` }
            }
          ) })
        ]
      },
      i
    )) }),
    stats.topCustomer && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-r from-[#2a655f]/10 via-[#2a655f]/5 to-[#f9a8d4]/10 dark:from-[#2a655f]/20 dark:via-[#2a655f]/10 dark:to-[#f9a8d4]/20 rounded-2xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 sm:gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 group-hover:scale-110 transition-transform duration-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-6 w-6 sm:h-7 sm:w-7 text-white animate-bounce" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-[#f9a8d4] flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-[#2a655f] animate-pulse border-2 border-white", children: "🏆" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] sm:text-xs text-[#2a655f] dark:text-[#f9a8d4] font-medium flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 animate-pulse text-[#f9a8d4]" }),
          app.lang === "ar" ? "أفضل عميل" : "Best Customer"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-[#2a655f] transition-colors truncate", children: stats.topCustomer.full_name || (app.lang === "ar" ? "عميل" : "Customer") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 sm:gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3 w-3 text-emerald-500" }),
            formatPrice(stats.topCustomer.spend || 0, app.currency, app.lang)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-px h-3 bg-slate-300 dark:bg-slate-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3 w-3 text-[#2a655f]" }),
            stats.topCustomer.orders || 0,
            " ",
            app.lang === "ar" ? "طلب" : "orders"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white border-2 border-white/30 shadow-lg shadow-[#2a655f]/30 animate-pulse text-[10px] sm:text-xs", children: "⭐ VIP" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-3 sm:p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300 pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: searchQuery,
            onChange: (e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            },
            placeholder: app.lang === "ar" ? "🔍 بحث عن عميل..." : "🔍 Search customers...",
            className: "ps-9 pe-9 h-10 sm:h-11 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 text-sm"
          }
        ),
        searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setSearchQuery("");
              setPage(1);
            },
            className: "absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors",
            "aria-label": app.lang === "ar" ? "مسح البحث" : "Clear search",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: sortBy,
            onValueChange: (value) => {
              setSortBy(value);
              setPage(1);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-[#2a655f]/20 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3.5 w-3.5 text-slate-500 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: app.lang === "ar" ? "ترتيب حسب" : "Sort by" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-slate-200 dark:border-slate-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "orders", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  "📦 ",
                  app.lang === "ar" ? "عدد الطلبات" : "Orders"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "spend", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  "💰 ",
                  app.lang === "ar" ? "الإنفاق" : "Spend"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "name", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  "👤 ",
                  app.lang === "ar" ? "الاسم" : "Name"
                ] })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: sortOrder,
            onValueChange: (value) => {
              setSortOrder(value);
              setPage(1);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-[#2a655f]/20 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: app.lang === "ar" ? "ترتيب" : "Order" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-slate-200 dark:border-slate-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "desc", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  "⬇️ ",
                  app.lang === "ar" ? "تنازلي" : "Descending"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: "asc", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: [
                  "⬆️ ",
                  app.lang === "ar" ? "تصاعدي" : "Ascending"
                ] })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: String(limit),
            onValueChange: (value) => {
              setLimit(Number(value));
              setPage(1);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-[#2a655f]/20 text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs text-slate-400 shrink-0", children: app.lang === "ar" ? "عدد" : "Show" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "10" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "rounded-xl border-2 border-slate-200 dark:border-slate-700", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "6", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "6" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "20", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "20" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "50", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "100", className: "hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: "100" })
              ] })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-1 md:col-span-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              setSearchQuery("");
              setSortBy("orders");
              setSortOrder("desc");
              setPage(1);
            },
            className: "w-full h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 group text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" }),
              app.lang === "ar" ? "مسح الكل" : "Clear all"
            ]
          }
        ) })
      ] }),
      (searchQuery || sortBy !== "orders" || sortOrder !== "desc") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] sm:text-xs text-slate-500 dark:text-slate-400", children: app.lang === "ar" ? `📊 ${filteredCustomers.length} نتيجة من أصل ${rows.length}` : `📊 ${filteredCustomers.length} of ${rows.length} results` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setSearchQuery("");
              setSortBy("orders");
              setSortOrder("desc");
              setPage(1);
            },
            className: "text-[11px] sm:text-xs text-[#2a655f] hover:text-[#d81b60] font-medium transition-colors",
            children: app.lang === "ar" ? "إعادة تعيين" : "Reset"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[180px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "الاسم" : "Name"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[140px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "رقم الهاتف" : "Phone"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "الطلبات" : "Orders"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[140px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "الإنفاق" : "Spend"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "آخر طلب" : "Last Order"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[60px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" }),
            app.lang === "ar" ? "الترتيب" : "Rank"
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: paginatedCustomers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "text-center py-12 text-slate-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-8 w-8 text-[#2a655f]/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-slate-900 dark:text-white", children: app.lang === "ar" ? "لا يوجد عملاء" : "No customers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: app.lang === "ar" ? "سيظهر العملاء هنا عند إجراء أول طلب" : "Customers will appear here after their first order" })
        ] }) }) }) : paginatedCustomers.map((c, index) => {
          const rank = (page - 1) * limit + index + 1;
          const rankColor = rank === 1 ? "text-[#2a655f]" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-[#f9a8d4]" : "text-slate-400";
          const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
          const rankBg = rank === 1 ? "bg-[#2a655f]/10" : rank === 2 ? "bg-slate-300/10" : rank === 3 ? "bg-[#f9a8d4]/20" : "bg-slate-100/30";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TableRow,
            {
              className: "border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-semibold text-slate-900 dark:text-white text-right border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "group-hover:text-[#2a655f] transition-colors", children: c.full_name || (app.lang === "ar" ? "عميل" : "Customer") }),
                  rank <= 3 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg animate-bounce", children: rankEmoji })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-slate-600 dark:text-slate-300 text-center font-mono border-r-2 border-slate-200/60 dark:border-slate-700/60", dir: "ltr", children: c.phone || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-slate-900 dark:text-white text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", children: c.orders || 0 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold text-[#2a655f] dark:text-slate-300 text-center group-hover:scale-110 transition-transform duration-300 border-r-2 border-slate-200/60 dark:border-slate-700/60", children: formatPrice(c.spend || 0, app.currency, app.lang) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-slate-500 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60", children: c.last_order ? new Date(c.last_order).toLocaleDateString(
                  app.lang === "ar" ? "ar-SA" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" }
                ) : "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center justify-center h-8 w-8 rounded-full ${rankBg} ${rankColor} font-bold text-sm transition-all duration-300 group-hover:scale-110`, children: rankEmoji }) })
              ]
            },
            c.id
          );
        }) })
      ] }) }),
      totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-slate-500 dark:text-slate-400 text-center sm:text-start w-full sm:w-auto", children: filteredCustomers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: app.lang === "ar" ? "لا يوجد عملاء" : "No customers" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 justify-center sm:justify-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" }),
          app.lang === "ar" ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredCustomers.length)} من ${filteredCustomers.length} عميل` : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredCustomers.length)} of ${filteredCustomers.length} customers`
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center w-full sm:w-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "«" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page - 1),
              disabled: page === 1,
              className: "h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 sm:gap-1", children: [
            Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: page === pageNum ? "default" : "outline",
                  size: "sm",
                  onClick: () => goToPage(pageNum),
                  className: `h-8 min-w-[30px] sm:min-w-[32px] p-0 rounded-lg sm:rounded-xl text-xs font-medium transition-all duration-300 ${page === pageNum ? "bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 border-0 scale-105" : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200"}`,
                  children: pageNum
                },
                pageNum
              );
            }),
            totalPages > 5 && page < totalPages - 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 text-sm px-1", children: "..." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => goToPage(totalPages),
                  className: "h-8 min-w-[30px] sm:min-w-[32px] p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-all duration-300",
                  children: totalPages
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(page + 1),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => goToPage(totalPages),
              disabled: page === totalPages,
              className: "h-8 w-8 p-0 rounded-lg sm:rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300 disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: "»" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: app.lang === "ar" ? `عرض ${paginatedCustomers.length} من ${filteredCustomers.length}` : `Showing ${paginatedCustomers.length} of ${filteredCustomers.length}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-[#d81b60]", children: app.lang === "ar" ? `إجمالي ${rows.length}` : `Total ${rows.length}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            sortBy === "orders" ? app.lang === "ar" ? "📦 الطلبات" : "📦 Orders" : sortBy === "spend" ? app.lang === "ar" ? "💰 الإنفاق" : "💰 Spend" : app.lang === "ar" ? "👤 الاسم" : "👤 Name",
            sortOrder === "desc" ? " ↓" : " ↑"
          ] }),
          searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1 text-[#d81b60]" }),
            searchQuery
          ] })
        ] })
      ] })
    ] })
  ] });
}
const style$1 = document.createElement("style");
style$1.textContent = `
  @keyframes slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-slide {
    animation: slide 1.5s ease-in-out infinite;
  }
`;
document.head.appendChild(style$1);
function NotificationSettings() {
  const app = useApp();
  const { data: profile, isLoading: profileLoading } = useProfile(app.user?.id);
  const update = useUpdateStorePreferences();
  const [notificationsEnabled, setNotificationsEnabled] = reactExports.useState(true);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [permission, setPermission] = reactExports.useState("default");
  reactExports.useEffect(() => {
    if (profile) {
      setNotificationsEnabled(profile.notifications_enabled !== false);
    }
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, [profile]);
  const handleToggleNotifications = async (enabled) => {
    if (!app.user) return;
    if (enabled && permission === "default") {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "denied") {
        toast.error(app.lang === "ar" ? "❌ تم رفض الإشعارات في المتصفح" : "❌ Notifications denied in browser");
        return;
      }
    }
    if (enabled && permission === "denied") {
      toast.error(
        app.lang === "ar" ? "❌ الإشعارات محظورة في المتصفح. يرجى تفعيلها من إعدادات المتصفح." : "❌ Notifications blocked in browser. Please enable from browser settings."
      );
      return;
    }
    setIsLoading(true);
    try {
      await update.mutateAsync({
        userId: app.user.id,
        notifications_enabled: enabled
      });
      setNotificationsEnabled(enabled);
      toast.success(
        enabled ? app.lang === "ar" ? "🔔 تم تفعيل الإشعارات" : "🔔 Notifications enabled" : app.lang === "ar" ? "🔕 تم إيقاف الإشعارات" : "🔕 Notifications disabled"
      );
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "Error");
    } finally {
      setIsLoading(false);
    }
  };
  const getStatusIcon = () => {
    if (permission === "denied") return /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-5 w-5 text-red-500" });
    if (notificationsEnabled && permission === "granted") return /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "h-5 w-5 text-emerald-500" });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-muted-foreground" });
  };
  const getStatusText = () => {
    if (permission === "denied") {
      return app.lang === "ar" ? "محظورة في المتصفح" : "Blocked in browser";
    }
    if (notificationsEnabled && permission === "granted") {
      return app.lang === "ar" ? "مفعلة" : "Enabled";
    }
    return app.lang === "ar" ? "غير مفعلة" : "Disabled";
  };
  const getStatusColor = () => {
    if (permission === "denied") return "text-red-500";
    if (notificationsEnabled && permission === "granted") return "text-emerald-500";
    return "text-muted-foreground";
  };
  if (profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-blue-600" }) }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
        getStatusIcon(),
        app.lang === "ar" ? "إعدادات الإشعارات" : "Notification Settings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: app.lang === "ar" ? "تحكم في إشعارات التطبيق وتنبيهاتك" : "Control your app notifications and alerts" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 rounded-xl bg-muted/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-base font-medium", children: app.lang === "ar" ? "الإشعارات" : "Notifications" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "استلم إشعارات عن الطلبات والرسائل والعروض" : "Receive notifications about orders, messages and offers" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-medium ${getStatusColor()}`, children: getStatusText() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: notificationsEnabled && permission !== "denied",
              onCheckedChange: handleToggleNotifications,
              disabled: isLoading || permission === "denied",
              className: permission === "denied" ? "opacity-50 cursor-not-allowed" : ""
            }
          )
        ] })
      ] }),
      permission === "denied" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600 dark:text-red-400", children: app.lang === "ar" ? "⚠️ الإشعارات محظورة في المتصفح. يرجى تفعيلها من إعدادات المتصفح." : "⚠️ Notifications are blocked in your browser. Please enable them from browser settings." }) }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-blue-600" }) })
    ] })
  ] });
}
const WEEK_DAYS = [
  { value: "Monday", label: "الإثنين" },
  { value: "Tuesday", label: "الثلاثاء" },
  { value: "Wednesday", label: "الأربعاء" },
  { value: "Thursday", label: "الخميس" },
  { value: "Friday", label: "الجمعة" },
  { value: "Saturday", label: "السبت" },
  { value: "Sunday", label: "الأحد" }
];
function SettingsPage() {
  const app = useApp();
  useT();
  const { data: profile, refetch } = useProfile(app.user?.id);
  const { data: governorates = [] } = useGovernorates();
  const update = useUpdateStorePreferences();
  const [storeName, setStoreName] = reactExports.useState("");
  const [storePhone, setStorePhone] = reactExports.useState("");
  const [storeDesc, setStoreDesc] = reactExports.useState("");
  const [storeLogo, setStoreLogo] = reactExports.useState("");
  const [storeCover, setStoreCover] = reactExports.useState("");
  const [online, setOnline] = reactExports.useState(true);
  const [opensAt, setOpensAt] = reactExports.useState("");
  const [closesAt, setClosesAt] = reactExports.useState("");
  const [allowsMessaging, setAllowsMessaging] = reactExports.useState(true);
  const [allowsBookings, setAllowsBookings] = reactExports.useState(false);
  const [storeType, setStoreType] = reactExports.useState("online");
  const [governorateId, setGovernorateId] = reactExports.useState("");
  const [storeAddress, setStoreAddress] = reactExports.useState("");
  const [weeklyOffDays, setWeeklyOffDays] = reactExports.useState([]);
  const [storeActive, setStoreActive] = reactExports.useState(true);
  const [storeInactiveReason, setStoreInactiveReason] = reactExports.useState("");
  const [showInactiveReason, setShowInactiveReason] = reactExports.useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = reactExports.useState(false);
  const [showActivateDialog, setShowActivateDialog] = reactExports.useState(false);
  const [tempInactiveReason, setTempInactiveReason] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [seeded, setSeeded] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const currentScroll = window.scrollY;
    let isBlocking = true;
    let timeoutId = null;
    const preventScroll = () => {
      if (isBlocking) {
        window.scrollTo({ top: currentScroll, behavior: "instant" });
      }
    };
    window.addEventListener("scroll", preventScroll, { passive: true });
    window.addEventListener("wheel", preventScroll, { passive: true });
    window.addEventListener("touchmove", preventScroll, { passive: true });
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    });
    timeoutId = setTimeout(() => {
      isBlocking = false;
      window.scrollTo({ top: currentScroll, behavior: "instant" });
    }, 300);
    return () => {
      isBlocking = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("scroll", preventScroll);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);
  reactExports.useEffect(() => {
    if (profile) {
      setStoreName(profile.store_name || "");
      setStorePhone(profile.store_phone || profile.phone || "");
      setStoreDesc(profile.store_description || "");
      setStoreLogo(profile.store_logo_url || "");
      setStoreCover(profile.store_cover_url || "");
      setOnline(profile.store_online !== false);
      setStoreActive(profile.store_active !== false);
      setStoreInactiveReason(profile.store_inactive_reason || "");
      setShowInactiveReason(profile.store_active === false && profile.store_inactive_reason);
      setOpensAt(profile.store_opens_at ? profile.store_opens_at.slice(0, 5) : "");
      setClosesAt(profile.store_closes_at ? profile.store_closes_at.slice(0, 5) : "");
      setAllowsMessaging(profile.allows_messaging !== false);
      setAllowsBookings(profile.allows_bookings === true);
      setStoreType(profile.store_type || "online");
      setGovernorateId(profile.governorate_id || "");
      setStoreAddress(profile.store_address || "");
      setWeeklyOffDays(profile.weekly_off_days || []);
      setSeeded(true);
    }
  }, [profile]);
  async function saveStoreInfo() {
    if (!app.user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from("profiles").update({
        store_name: storeName || null,
        store_phone: storePhone || null,
        store_description: storeDesc || null,
        store_logo_url: storeLogo || null,
        store_cover_url: storeCover || null,
        store_type: storeType,
        governorate_id: governorateId || null,
        store_address: storeType === "physical" ? storeAddress || null : null,
        weekly_off_days: weeklyOffDays.length > 0 ? weeklyOffDays : null
      }).eq("id", app.user.id);
      if (error) throw error;
      toast.success(app.lang === "ar" ? "✅ تم حفظ معلومات المتجر" : "✅ Store info saved");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }
  async function savePrefs() {
    if (!app.user) return;
    setIsLoading(true);
    try {
      const updateData = {
        store_online: online,
        store_active: storeActive,
        store_opens_at: opensAt || null,
        store_closes_at: closesAt || null,
        allows_messaging: allowsMessaging,
        allows_bookings: allowsBookings,
        store_type: storeType,
        governorate_id: governorateId || null,
        store_address: storeType === "physical" ? storeAddress || null : null,
        weekly_off_days: weeklyOffDays
      };
      if (!storeActive && storeInactiveReason) {
        updateData.store_inactive_reason = storeInactiveReason;
      } else if (storeActive) {
        updateData.store_inactive_reason = null;
      }
      await update.mutateAsync({
        userId: app.user.id,
        ...updateData
      });
      toast.success(app.lang === "ar" ? "✅ تم تحديث إعدادات المتجر" : "✅ Store settings updated");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }
  const handleDeactivateStore = async () => {
    if (!app.user) return;
    if (!tempInactiveReason.trim()) {
      toast.error(app.lang === "ar" ? "الرجاء كتابة سبب إيقاف المتجر" : "Please provide a reason for deactivating");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.from("profiles").update({
        store_active: false,
        store_online: false,
        store_inactive_reason: tempInactiveReason.trim()
      }).eq("id", app.user.id);
      if (error) throw error;
      setStoreActive(false);
      setOnline(false);
      setStoreInactiveReason(tempInactiveReason.trim());
      setShowInactiveReason(true);
      toast.success(app.lang === "ar" ? "✅ تم إيقاف المتجر بنجاح" : "✅ Store deactivated successfully");
      setShowDeactivateDialog(false);
      setTempInactiveReason("");
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };
  const handleActivateStore = async () => {
    if (!app.user) return;
    setIsLoading(true);
    try {
      const { error } = await supabase.from("profiles").update({
        store_active: true,
        store_online: true,
        store_inactive_reason: null
      }).eq("id", app.user.id);
      if (error) throw error;
      setStoreActive(true);
      setOnline(true);
      setStoreInactiveReason("");
      setShowInactiveReason(false);
      toast.success(app.lang === "ar" ? "✅ تم تفعيل المتجر بنجاح" : "✅ Store activated successfully");
      setShowActivateDialog(false);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  };
  if (!seeded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-32 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-8 w-8 text-[#2a655f] animate-pulse" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse", children: app.lang === "ar" ? "⏳ جاري تحميل الإعدادات..." : "⏳ Loading settings..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" }) })
    ] });
  }
  const stats = {
    sections: 4,
    active: storeActive ? app.lang === "ar" ? "نشط" : "Active" : app.lang === "ar" ? "غير نشط" : "Inactive",
    type: storeType === "online" ? app.lang === "ar" ? "اونلاين" : "Online" : app.lang === "ar" ? "متجر حقيقي" : "Physical",
    governorate: governorates.find((g) => g.id === governorateId)?.name_ar || "—",
    storeName: storeName || (app.lang === "ar" ? "متجر جديد" : "New Store")
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#f9a8d4]/5 blur-2xl animate-pulse", style: { animationDelay: "1s" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#f9a8d4]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-5 w-5 group-hover:animate-spin-slow" }) })
        ] }),
        app.lang === "ar" ? "إعدادات المتجر" : "Store Settings",
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, { className: "h-3 w-3 mr-1" }),
          app.lang === "ar" ? "تحكم كامل" : "Full Control"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f] font-medium", children: stats.storeName })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600 dark:text-emerald-400 font-medium", children: app.lang === "ar" ? "محمي" : "Secure" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1 h-1 rounded-full bg-[#2a655f]/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors",
          storeActive ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30" : "bg-red-50 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/30 hover:bg-red-100/50 dark:hover:bg-red-950/30"
        ), children: [
          storeActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3.5 w-3.5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-3.5 w-3.5 text-red-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
            "font-medium",
            storeActive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
          ), children: storeActive ? app.lang === "ar" ? "نشط" : "Active" : app.lang === "ar" ? "غير نشط" : "Inactive" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: [
      { key: "sections", label: app.lang === "ar" ? "الأقسام" : "Sections", value: stats.sections, icon: Layers, color: "text-[#2a655f]", gradient: "from-[#2a655f] to-[#f9a8d4]" },
      { key: "status", label: app.lang === "ar" ? "الحالة" : "Status", value: stats.active, icon: Power, color: storeActive ? "text-emerald-500" : "text-red-500", gradient: storeActive ? "from-emerald-500 to-teal-500" : "from-red-500 to-rose-500" },
      { key: "type", label: app.lang === "ar" ? "النوع" : "Type", value: stats.type, icon: Globe, color: "text-[#3a8a82]", gradient: "from-[#3a8a82] to-[#f9a8d4]" },
      { key: "governorate", label: app.lang === "ar" ? "المحافظة" : "Governorate", value: stats.governorate, icon: MapPin, color: "text-[#d81b60]", gradient: "from-[#d81b60] to-[#f9a8d4]" }
    ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider", children: stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#2a655f] transition-colors", children: stat.value })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: cn("h-5 w-5", stat.color) }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0 h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn("h-full rounded-full bg-gradient-to-r", stat.gradient, "transition-all duration-1000 animate-shimmer"),
              style: { width: `100%` }
            }
          ) })
        ]
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-pink-400/30 to-[#2a655f]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
        "relative bg-white dark:bg-[#1e293b] rounded-2xl border-2 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden",
        storeActive && online ? "border-emerald-400/50 dark:border-emerald-400/30" : "border-red-400/50 dark:border-red-400/30"
      ), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
          "absolute top-0 left-0 w-full h-0.5",
          storeActive && online ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-red-400 to-rose-400"
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
              "h-20 w-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg group-hover:scale-110",
              storeActive && online ? "bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30 animate-pulse" : "bg-gradient-to-br from-red-500 to-rose-500 shadow-red-500/30"
            ), children: storeActive && online ? /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-10 w-10 text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-10 w-10 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: cn(
                "text-2xl font-bold",
                storeActive && online ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              ), children: storeActive && online ? "🟢 المتجر نشط" : "🔴 المتجر غير نشط" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: storeActive && online ? app.lang === "ar" ? "متجرك ظاهر للزبائن وجاهز لاستقبال الطلبات" : "Your store is visible to customers and ready for orders" : app.lang === "ar" ? "متجرك غير ظاهر للزبائن حالياً" : "Your store is currently hidden from customers" }),
              !storeActive && storeInactiveReason && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border-2 border-amber-300/50 dark:border-amber-800/30 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-400 flex items-start gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 flex-shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: app.lang === "ar" ? "السبب:" : "Reason:" }),
                  " ",
                  storeInactiveReason
                ] })
              ] }) })
            ] })
          ] }),
          storeActive && online ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setShowDeactivateDialog(true),
              className: "h-16 px-8 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold text-lg shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group border-2 border-red-400/50 hover:border-red-300/70",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-6 w-6 mr-3 group-hover:animate-pulse" }),
                app.lang === "ar" ? "إيقاف المتجر" : "Deactivate Store"
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setShowActivateDialog(true),
              className: "h-16 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group border-2 border-emerald-400/50 hover:border-emerald-300/70",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-6 w-6 mr-3 group-hover:animate-pulse" }),
                app.lang === "ar" ? "تفعيل المتجر" : "Activate Store"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-pink-400/30 to-[#2a655f]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 p-6 shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-md shadow-[#2a655f]/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-white animate-pulse" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: app.lang === "ar" ? "إعدادات المتجر الدقيقة" : "Detailed Store Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-[10px] animate-pulse", children: app.lang === "ar" ? "متقدم" : "Advanced" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-[#2a655f]" }),
              app.lang === "ar" ? "وقت الفتح" : "Opens at"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: opensAt,
                onChange: (e) => setOpensAt(e.target.value),
                className: "mt-1.5 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#f9a8d4]/50"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-[#2a655f]" }),
              app.lang === "ar" ? "وقت الإغلاق" : "Closes at"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "time",
                value: closesAt,
                onChange: (e) => setClosesAt(e.target.value),
                className: "mt-1.5 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#f9a8d4]/50"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-2 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 text-[#2a655f]" }),
          app.lang === "ar" ? "خارج هذه الأوقات يظهر المتجر كمغلق تلقائياً" : "Outside these hours your store shows as closed automatically"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm font-medium cursor-pointer p-3 rounded-xl border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-all duration-300 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: allowsMessaging,
                onChange: (e) => setAllowsMessaging(e.target.checked),
                className: "h-4 w-4 rounded border-[#2a655f]/30 accent-[#2a655f]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" }),
            app.lang === "ar" ? "السماح للزبائن بمراسلتي" : "Allow customers to message me"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm font-medium cursor-pointer p-3 rounded-xl border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-all duration-300 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: allowsBookings,
                onChange: (e) => setAllowsBookings(e.target.checked),
                className: "h-4 w-4 rounded border-[#2a655f]/30 accent-[#2a655f]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" }),
            app.lang === "ar" ? "السماح بالحجوزات" : "Accept bookings"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: savePrefs,
            disabled: isLoading,
            className: "mt-5 w-full rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50 transition-all duration-300 hover:scale-[1.02] group border-2 border-[#2a655f]/30 hover:border-[#f9a8d4]/50",
            children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
              app.lang === "ar" ? "جاري الحفظ..." : "Saving..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2 group-hover:scale-110 transition-transform" }),
              app.lang === "ar" ? "حفظ الإعدادات" : "Save Settings"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-pink-400/30 to-[#2a655f]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 p-6 shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-md shadow-[#2a655f]/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-5 w-5 text-white animate-bounce" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: app.lang === "ar" ? "معلومات المتجر" : "Store Information" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-[10px]", children: app.lang === "ar" ? "رئيسي" : "Primary" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f]" }),
              app.lang === "ar" ? "اسم المتجر" : "Store Name"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: storeName,
                onChange: (e) => setStoreName(e.target.value),
                placeholder: app.lang === "ar" ? "أدخل اسم متجرك" : "Enter store name",
                className: "mt-1.5 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#f9a8d4]/50"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4 text-[#2a655f]" }),
              app.lang === "ar" ? "رقم الهاتف" : "Phone Number"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: storePhone,
                onChange: (e) => setStorePhone(e.target.value),
                placeholder: app.lang === "ar" ? "أدخل رقم هاتف المتجر" : "Enter store phone number",
                className: "mt-1.5 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#f9a8d4]/50",
                dir: "ltr"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-[#2a655f]" }),
              app.lang === "ar" ? "وصف المتجر" : "Store Description"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 3,
                value: storeDesc,
                onChange: (e) => setStoreDesc(e.target.value),
                placeholder: app.lang === "ar" ? "وصف قصير لمتجرك" : "A short description of your store",
                className: "mt-1.5 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#f9a8d4]/50 resize-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-pink-400/20 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 text-[#2a655f]" }),
                app.lang === "ar" ? "شعار المتجر" : "Store Logo"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ImageInput,
                {
                  value: storeLogo,
                  onChange: setStoreLogo,
                  userId: app.user?.id,
                  folder: "store-logo",
                  lang: app.lang,
                  label: app.lang === "ar" ? "ارفع شعار المتجر" : "Upload store logo",
                  hint: app.lang === "ar" ? "مربعة، 500×500 فأعلى" : "Square, 500×500 or higher",
                  previewClassName: "h-24 w-24 rounded-2xl border-2 border-pink-400/30 hover:border-[#f9a8d4]/60 transition-all duration-300"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-4 w-4 text-[#2a655f]" }),
                app.lang === "ar" ? "صورة الغلاف" : "Store Cover"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ImageInput,
                {
                  value: storeCover,
                  onChange: setStoreCover,
                  userId: app.user?.id,
                  folder: "store-cover",
                  lang: app.lang,
                  label: app.lang === "ar" ? "ارفع صورة الغلاف" : "Upload cover image",
                  hint: app.lang === "ar" ? "أفقية، 1600×600 فأعلى" : "Landscape, 1600×600 or higher",
                  previewClassName: "h-32 rounded-2xl border-2 border-pink-400/30 hover:border-[#f9a8d4]/60 transition-all duration-300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t-2 border-pink-400/20 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-sm mb-3 flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-lg bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-white animate-pulse" }) }),
              app.lang === "ar" ? "موقع المتجر" : "Store Location"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: app.lang === "ar" ? "نوع المتجر" : "Store Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                RadioGroup,
                {
                  value: storeType,
                  onValueChange: (value) => setStoreType(value),
                  className: "flex gap-4 mt-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 rtl:space-x-reverse", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "online", id: "settings-store-online", className: "border-[#2a655f]/40 text-[#2a655f]" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "settings-store-online", className: "cursor-pointer text-sm hover:text-[#2a655f] transition-colors", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "inline h-4 w-4 mr-1 text-[#2a655f]" }),
                        app.lang === "ar" ? "اونلاين" : "Online"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2 rtl:space-x-reverse", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "physical", id: "settings-store-physical", className: "border-[#2a655f]/40 text-[#2a655f]" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "settings-store-physical", className: "cursor-pointer text-sm hover:text-[#2a655f] transition-colors", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Building, { className: "inline h-4 w-4 mr-1 text-[#2a655f]" }),
                        app.lang === "ar" ? "متجر حقيقي" : "Physical Store"
                      ] })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "inline h-4 w-4 mr-1 text-[#2a655f]" }),
                app.lang === "ar" ? "المحافظة" : "Governorate"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: governorateId, onValueChange: setGovernorateId, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#f9a8d4]/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: app.lang === "ar" ? "اختر المحافظة" : "Select governorate" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "rounded-xl border-3 border-[#f9a8d4]/30", children: governorates.map((gov) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: gov.id, className: "hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors", children: app.lang === "ar" ? gov.name_ar : gov.name_en }, gov.id)) })
              ] })
            ] }),
            storeType === "physical" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: app.lang === "ar" ? "العنوان التفصيلي" : "Detailed Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: storeAddress,
                  onChange: (e) => setStoreAddress(e.target.value),
                  placeholder: app.lang === "ar" ? "مثال: شارع الثورة، بناء رقم 10" : "e.g. Al-Thawra St., Building 10",
                  className: "mt-1.5 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#f9a8d4]/50"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium text-slate-700 dark:text-slate-300", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "inline h-4 w-4 mr-1 text-[#2a655f]" }),
                app.lang === "ar" ? "أيام العطل الأسبوعية" : "Weekly Off Days"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 p-3 mt-1.5 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b]", children: WEEK_DAYS.map((day) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-gray-50/80 dark:hover:bg-gray-700/20 transition-all duration-300 group", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: weeklyOffDays.includes(day.value),
                    onChange: (e) => {
                      if (e.target.checked) {
                        setWeeklyOffDays([...weeklyOffDays, day.value]);
                      } else {
                        setWeeklyOffDays(weeklyOffDays.filter((d) => d !== day.value));
                      }
                    },
                    className: "h-4 w-4 accent-[#2a655f] rounded border-[#2a655f]/30"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm group-hover:text-[#2a655f] transition-colors", children: day.label })
              ] }, day.value)) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1 flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3 text-[#2a655f]" }),
                app.lang === "ar" ? "اختر الأيام التي يكون فيها المتجر مغلقاً" : "Select days when the store is closed"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: saveStoreInfo,
              disabled: isLoading,
              className: "mt-4 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50 transition-all duration-300 hover:scale-[1.02] group w-full border-2 border-[#2a655f]/30 hover:border-[#f9a8d4]/50",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
                app.lang === "ar" ? "جاري الحفظ..." : "Saving..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 mr-2 group-hover:scale-110 transition-transform" }),
                app.lang === "ar" ? "حفظ معلومات المتجر" : "Save Store Info"
              ] })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-0.5 bg-gradient-to-r from-pink-400/30 to-[#2a655f]/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 p-6 shadow-lg hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2.5 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-md shadow-[#2a655f]/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-white animate-bounce" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-slate-900 dark:text-white", children: app.lang === "ar" ? "إعدادات الإشعارات" : "Notification Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-[10px] animate-pulse", children: app.lang === "ar" ? "مهم" : "Important" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSettings, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDeactivateDialog, onOpenChange: setShowDeactivateDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md border-3 border-red-400/50 dark:border-red-400/30 shadow-[0_0_40px_rgba(239,68,68,0.25)] dark:shadow-[0_0_40px_rgba(239,68,68,0.15)] p-0 overflow-hidden bg-white dark:bg-[#1e293b]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 hover:rotate-90 border-2 border-slate-200 dark:border-slate-700",
          onClick: () => {
            setShowDeactivateDialog(false);
            setTempInactiveReason("");
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-red-500" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center animate-pulse border-3 border-red-300/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-6 w-6 text-red-600 dark:text-red-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-red-600 dark:text-red-400", children: app.lang === "ar" ? "⚠️ إيقاف المتجر" : "⚠️ Deactivate Store" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: app.lang === "ar" ? "سيتم إخفاء متجرك عن الزبائن ولن يتمكنوا من رؤيته" : "Your store will be hidden from customers and they won't be able to see it" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 border-2 border-red-300/50 dark:border-red-800/30", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-red-700 dark:text-red-300 font-medium flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5" }),
              app.lang === "ar" ? "📌 سيتم إخفاء جميع منتجاتك ومتجرك عن الزبائن" : "📌 All your products and store will be hidden from customers"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-red-600/70 dark:text-red-400/70 mt-1", children: app.lang === "ar" ? "يمكنك تفعيل المتجر مرة أخرى في أي وقت" : "You can reactivate your store at any time" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500" }),
              app.lang === "ar" ? "سبب إيقاف المتجر" : "Reason for deactivating",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: tempInactiveReason,
                onChange: (e) => setTempInactiveReason(e.target.value),
                placeholder: app.lang === "ar" ? "مثال: إجازة سنوية, صيانة, تغيير الموقع..." : "e.g. Annual leave, maintenance, relocating...",
                className: "mt-2 rounded-xl resize-none h-24 border-3 border-red-300/50 dark:border-red-800/30 focus:ring-red-500/30 focus:border-red-500",
                rows: 3
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: app.lang === "ar" ? "سيظهر هذا السبب للزبائن عند زيارة متجرك" : "This reason will be shown to customers when they visit your store" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => {
                setShowDeactivateDialog(false);
                setTempInactiveReason("");
              },
              className: "flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300 text-slate-600 dark:text-slate-300",
              children: app.lang === "ar" ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleDeactivateStore,
              disabled: isLoading || !tempInactiveReason.trim(),
              className: "flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all duration-300 hover:scale-[1.02] border-2 border-red-400/50 hover:border-red-300/70",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
                app.lang === "ar" ? "جاري الإيقاف..." : "Deactivating..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PowerOff, { className: "h-4 w-4 mr-2" }),
                app.lang === "ar" ? "تأكيد الإيقاف" : "Confirm Deactivate"
              ] })
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showActivateDialog, onOpenChange: setShowActivateDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md border-3 border-emerald-400/50 dark:border-emerald-400/30 shadow-[0_0_40px_rgba(16,185,129,0.25)] dark:shadow-[0_0_40px_rgba(16,185,129,0.15)] p-0 overflow-hidden bg-white dark:bg-[#1e293b]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 hover:rotate-90 border-2 border-slate-200 dark:border-slate-700",
          onClick: () => setShowActivateDialog(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-emerald-600" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center animate-bounce border-3 border-emerald-300/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-6 w-6 text-emerald-600 dark:text-emerald-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-emerald-600 dark:text-emerald-400", children: app.lang === "ar" ? "✅ تفعيل المتجر" : "✅ Activate Store" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: app.lang === "ar" ? "سيتم إظهار متجرك للزبائن وسيتمكنون من رؤيته" : "Your store will be visible to customers and they can see it" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-4 border-2 border-emerald-300/50 dark:border-emerald-800/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 animate-pulse" }),
          app.lang === "ar" ? "✅ سيظهر متجرك ومنتجاتك للزبائن مرة أخرى" : "✅ Your store and products will be visible to customers again"
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setShowActivateDialog(false),
              className: "flex-1 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300 text-slate-600 dark:text-slate-300",
              children: app.lang === "ar" ? "إلغاء" : "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleActivateStore,
              disabled: isLoading,
              className: "flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-[1.02] border-2 border-emerald-400/50 hover:border-emerald-300/70",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" }),
                app.lang === "ar" ? "جاري التفعيل..." : "Activating..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4 mr-2" }),
                app.lang === "ar" ? "تأكيد التفعيل" : "Confirm Activate"
              ] })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const style = document.createElement("style");
style.textContent = `
  @keyframes slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-slide {
    animation: slide 1.5s ease-in-out infinite;
  }
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;
document.head.appendChild(style);
const { saveAs } = pkg__default;
const PREMIUM_COLORS = [
  "#2a655f",
  "#3a8a82",
  "#1a4f4a",
  "#f9a8d4",
  "#fbcfe8",
  "#f48fb1",
  "#d81b60",
  "#c2185b",
  "#2a655f",
  "#f9a8d4"
];
const RADAR_COLORS = {
  grid: "#e2e8f0"
};
function SellerDashboard({}) {
  const app = useApp();
  useT();
  useNavigate();
  const [tab, setTab] = reactExports.useState("overview");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [showSearchResultsPage, setShowSearchResultsPage] = reactExports.useState(false);
  const [currentTime, setCurrentTime] = reactExports.useState(/* @__PURE__ */ new Date());
  const { data: profile } = useProfile(app.user?.id);
  const [currentSlide, setCurrentSlide] = reactExports.useState(0);
  const [isAutoPlay, setIsAutoPlay] = reactExports.useState(true);
  const totalSlides = 5;
  reactExports.useEffect(() => {
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }, [tab]);
  reactExports.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(timer);
  }, []);
  const handleTabChange = reactExports.useCallback((newTab) => {
    setTab(newTab);
    const url = new URL(window.location.href);
    if (newTab === "overview") {
      url.searchParams.delete("tab");
    } else {
      url.searchParams.set("tab", newTab);
    }
    window.history.pushState({}, "", url.toString());
  }, []);
  const scrollPositionRef = reactExports.useRef({
    overview: 0,
    products: 0,
    orders: 0,
    customers: 0,
    stats: 0,
    settings: 0
  });
  const handleTabChangeWithScroll = reactExports.useCallback((newTab) => {
    const currentScroll = window.scrollY;
    scrollPositionRef.current[tab] = currentScroll;
    handleTabChange(newTab);
    requestAnimationFrame(() => {
      const savedPosition = scrollPositionRef.current[newTab] || 0;
      window.scrollTo({ top: savedPosition, behavior: "instant" });
    });
  }, [tab, handleTabChange]);
  reactExports.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabFromUrl = params.get("tab");
    if (tabFromUrl) {
      const validTabs = ["overview", "products", "orders", "customers", "stats", "settings"];
      if (validTabs.includes(tabFromUrl)) {
        setTab(tabFromUrl);
      }
    }
  }, []);
  reactExports.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tabFromUrl = params.get("tab");
      if (tabFromUrl) {
        const validTabs = ["overview", "products", "orders", "customers", "stats", "settings"];
        if (validTabs.includes(tabFromUrl)) {
          setTab(tabFromUrl);
        }
      } else {
        setTab("overview");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  reactExports.useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5e3);
    return () => clearInterval(interval);
  }, [isAutoPlay, totalSlides]);
  const goToSlide = reactExports.useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 8e3);
  }, []);
  const nextSlide = reactExports.useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);
  const prevSlide = reactExports.useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);
  const isStoreActive = profile?.store_active !== false;
  const isStoreOnline = profile?.store_online !== false;
  const storeName = profile?.store_name || (app.lang === "ar" ? "متجرك" : "Your Store");
  const storeLogo = profile?.store_logo_url || "";
  profile?.store_cover_url || "";
  profile?.store_phone || profile?.phone || "";
  profile?.store_address || "";
  profile?.governorate?.name_ar || profile?.governorate?.name_en || "";
  profile?.store_opens_at ? profile.store_opens_at.slice(0, 5) : "";
  profile?.store_closes_at ? profile.store_closes_at.slice(0, 5) : "";
  const isStoreOpen = (store) => {
    if (!store || store.store_online === false) return false;
    if (!store.store_opens_at || !store.store_closes_at) return true;
    try {
      const opens = store.store_opens_at.slice(0, 5);
      const closes = store.store_closes_at.slice(0, 5);
      if (!opens || !closes || opens.length < 5 || closes.length < 5) return true;
      const now = /* @__PURE__ */ new Date();
      const cur = now.getHours() * 60 + now.getMinutes();
      const [oh, om] = opens.split(":").map(Number);
      const [ch, cm] = closes.split(":").map(Number);
      if (isNaN(oh) || isNaN(om) || isNaN(ch) || isNaN(cm)) return true;
      const o = oh * 60 + om;
      const c = ch * 60 + cm;
      if (o <= c) {
        return cur >= o && cur <= c;
      } else {
        return cur >= o || cur <= c;
      }
    } catch (error) {
      console.error("❌ [Store] Error checking store status:", error);
      return true;
    }
  };
  const currentlyOpen = isStoreOpen(profile);
  const storeStatus = isStoreActive && isStoreOnline;
  const { data: sellerOrders = [] } = useStoreOrders(app.user?.id);
  const { data: sellerListings = [] } = useMyListings(app.user?.id);
  const { data: sellerCustomers = [] } = useSellerCustomers(app.user?.id);
  const { data: cats = [] } = useCategories();
  const customerOrderCounts = reactExports.useMemo(() => {
    const counts = {};
    sellerOrders.forEach((order) => {
      const customerId = order.buyer_id || order.customer_id || order.user_id;
      if (customerId) {
        counts[customerId] = (counts[customerId] || 0) + 1;
      }
    });
    return counts;
  }, [sellerOrders]);
  const customersWithOrders = reactExports.useMemo(() => {
    return sellerCustomers.map((customer) => {
      const customerId = customer.id || customer.user_id;
      const orderCount = customerOrderCounts[customerId] || 0;
      const displayName = customer.full_name || customer.name || customer.user?.full_name || customer.user?.name || customer.email?.split("@")[0] || (app.lang === "ar" ? "عميل" : "Customer");
      const phone = customer.phone || customer.user?.phone || customer.user?.phone_number || "";
      const avatar = customer.avatar_url || customer.user?.avatar_url || customer.user?.avatar || "";
      return {
        ...customer,
        display_name: displayName,
        phone_number: phone,
        avatar_url: avatar,
        total_orders: orderCount
      };
    });
  }, [sellerCustomers, customerOrderCounts, app.lang]);
  const getFilteredData = (data, searchFields, searchTerm) => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase().trim();
    return data.filter((item) => {
      return searchFields.some((field) => {
        const value = item[field];
        if (value === null || value === void 0) return false;
        return String(value).toLowerCase().includes(q);
      });
    });
  };
  const filteredListings = reactExports.useMemo(() => {
    return getFilteredData(sellerListings, ["title_ar", "title_en", "description_ar", "description_en"], searchQuery);
  }, [sellerListings, searchQuery]);
  const filteredOrders = reactExports.useMemo(() => {
    return getFilteredData(sellerOrders, ["id", "product_name", "customer_name", "status", "total"], searchQuery);
  }, [sellerOrders, searchQuery]);
  const filteredCustomers = reactExports.useMemo(() => {
    return getFilteredData(customersWithOrders, ["display_name", "email", "phone_number", "city", "address"], searchQuery);
  }, [customersWithOrders, searchQuery]);
  const filteredReviews = reactExports.useMemo(() => {
    const reviews = sellerOrders.filter((o) => o.rating && o.rating > 0);
    return getFilteredData(reviews, ["id", "product_name", "customer_name", "rating", "comment"], searchQuery);
  }, [sellerOrders, searchQuery]);
  const searchResults = reactExports.useMemo(() => {
    return {
      products: filteredListings.length,
      orders: filteredOrders.length,
      customers: filteredCustomers.length,
      reviews: filteredReviews.length,
      total: filteredListings.length + filteredOrders.length + filteredCustomers.length + filteredReviews.length
    };
  }, [filteredListings, filteredOrders, filteredCustomers, filteredReviews]);
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setShowSearchResultsPage(true);
      const bestTab = getBestTab();
      if (bestTab.count > 0) {
        handleTabChangeWithScroll(bestTab.tab);
      }
    }
  };
  const getBestTab = () => {
    const results = [
      { tab: "products", count: filteredListings.length, label: app.lang === "ar" ? "المنتجات" : "Products" },
      { tab: "orders", count: filteredOrders.length, label: app.lang === "ar" ? "الطلبات" : "Orders" },
      { tab: "customers", count: filteredCustomers.length, label: app.lang === "ar" ? "العملاء" : "Customers" },
      { tab: "reviews", count: filteredReviews.length, label: app.lang === "ar" ? "التقييمات" : "Reviews" }
    ];
    results.sort((a, b) => b.count - a.count);
    return results[0];
  };
  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResultsPage(false);
  };
  const showSearchResults = searchQuery.trim().length > 0 && showSearchResultsPage;
  const totalRevenue = sellerOrders.reduce((sum, row) => sum + (Number(row.total) || 0), 0);
  const totalOrders = sellerOrders.length;
  const totalCustomers = customersWithOrders.length;
  const totalProducts = sellerListings.length;
  const completedOrders = sellerOrders.filter((o) => o.status === "completed" || o.status === "delivered").length;
  const pendingOrders = sellerOrders.filter((o) => o.status === "pending").length;
  sellerOrders.filter((o) => o.status === "cancelled").length;
  sellerOrders.filter((o) => o.status === "accepted").length;
  sellerOrders.filter((o) => o.status === "rejected").length;
  sellerOrders.filter((o) => o.status === "processing").length;
  const completionRate = totalOrders > 0 ? Math.round(completedOrders / totalOrders * 100) : 0;
  const recentOrders = reactExports.useMemo(
    () => sellerOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5),
    [sellerOrders]
  );
  const topProducts = reactExports.useMemo(() => {
    const productMap = {};
    sellerListings.forEach((listing) => {
      productMap[listing.id] = listing;
    });
    const revenueMap = {};
    sellerOrders.forEach((order) => {
      const productId = order.product_id || order.listing_id;
      if (!productId) return;
      const product = productMap[productId];
      if (!product) return;
      const productName = product.title_ar || `منتج ${String(productId).slice(-6)}`;
      if (!revenueMap[productId]) {
        revenueMap[productId] = {
          id: productId,
          name: productName,
          quantity: 0,
          revenue: 0
        };
      }
      revenueMap[productId].quantity += Number(order.quantity) || 1;
      revenueMap[productId].revenue += Number(order.total) || 0;
    });
    return Object.values(revenueMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [sellerOrders, sellerListings]);
  const monthlyData = reactExports.useMemo(() => {
    const months = {};
    const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    sellerOrders.forEach((o) => {
      const date = new Date(o.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!months[key]) {
        months[key] = {
          name: app.lang === "ar" ? arabicMonths[date.getMonth()] : date.toLocaleString("default", { month: "short" }),
          revenue: 0,
          orders: 0
        };
      }
      months[key].revenue += Number(o.total) || 0;
      months[key].orders += 1;
    });
    return Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([k, v]) => ({ ...v, revenue: Math.round(v.revenue) }));
  }, [sellerOrders, app.lang]);
  const categoryData = reactExports.useMemo(() => {
    const map = {};
    sellerOrders.forEach((o) => {
      const cat = o.product_category || (app.lang === "ar" ? "أخرى" : "Other");
      map[cat] = (map[cat] || 0) + (Number(o.total) || 0);
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [sellerOrders, app.lang]);
  const customerData = reactExports.useMemo(() => {
    const map = {};
    customersWithOrders.forEach((c) => {
      const city = c.city || c.address || (app.lang === "ar" ? "غير محدد" : "Unknown");
      map[city] = (map[city] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [customersWithOrders, app.lang]);
  reactExports.useMemo(() => {
    const ratings = [5, 4, 3, 2, 1];
    return ratings.map((r) => {
      const count = sellerOrders.filter((o) => Math.floor(Number(o.rating) || 0) === r).length;
      return { name: `${r}⭐`, value: count };
    });
  }, [sellerOrders]);
  const performanceData = reactExports.useMemo(() => [
    { subject: app.lang === "ar" ? "المبيعات" : "Sales", value: totalOrders > 0 ? Math.min(Math.round(totalRevenue / 1e3 * 10), 100) : 0 },
    { subject: app.lang === "ar" ? "العملاء" : "Customers", value: totalCustomers > 0 ? Math.min(Math.round(totalCustomers * 2), 100) : 0 },
    { subject: app.lang === "ar" ? "الجودة" : "Quality", value: completionRate },
    { subject: app.lang === "ar" ? "السرعة" : "Speed", value: pendingOrders > 0 ? Math.min(Math.round(completedOrders / totalOrders * 100), 100) : 0 },
    { subject: app.lang === "ar" ? "التقييم" : "Rating", value: sellerOrders.filter((o) => o.rating > 0).length > 0 ? Math.min(Math.round(sellerOrders.reduce((sum, o) => sum + Number(o.rating || 0), 0) / sellerOrders.filter((o) => o.rating > 0).length * 20), 100) : 0 }
  ], [totalRevenue, totalOrders, totalCustomers, completionRate, pendingOrders, completedOrders, sellerOrders]);
  const SystemSlider = ({ isRTL: isRTL2 }) => {
    const slides = [
      {
        id: 1,
        icon: "🏛️",
        title_ar: "ذوق | Zooq",
        title_en: "Zooq",
        subtitle_ar: "نظام إدارة السوق الذكي",
        subtitle_en: "Smart Marketplace Management System",
        desc_ar: "منصة سوق متكاملة تربط البائعين والمشترين في بيئة آمنة وسهلة الاستخدام",
        desc_en: "An integrated marketplace platform connecting buyers and sellers in a secure, user-friendly environment"
      },
      {
        id: 2,
        icon: "🛡️",
        title_ar: "ذوق | Zooq",
        title_en: "Zooq",
        subtitle_ar: "أمان وحماية متكاملة",
        subtitle_en: "Complete Security & Protection",
        desc_ar: "نظام حماية المشتري والبائع مع توثيق الهوية ومراقبة الطلبات لحماية جميع الأطراف",
        desc_en: "Buyer and seller protection system with identity verification and order monitoring"
      },
      {
        id: 3,
        icon: "📊",
        title_ar: "ذوق | Zooq",
        title_en: "Zooq",
        subtitle_ar: "تحليلات وتقارير فورية",
        subtitle_en: "Real-time Analytics & Reports",
        desc_ar: "لوحة تحكم متقدمة تعرض مؤشرات الأداء والإحصائيات لحظياً لاتخاذ قرارات ذكية",
        desc_en: "Advanced dashboard displaying real-time KPIs and statistics for smart decision making"
      },
      {
        id: 4,
        icon: "🚀",
        title_ar: "ذوق | Zooq",
        title_en: "Zooq",
        subtitle_ar: "توصيل ذكي ومتكامل",
        subtitle_en: "Smart Integrated Delivery",
        desc_ar: "نظام توصيل متطور يدعم شركات متعددة وتتبع الطلبات في الوقت الفعلي",
        desc_en: "Advanced delivery system supporting multiple companies and real-time order tracking"
      },
      {
        id: 5,
        icon: "💎",
        title_ar: "ذوق | Zooq",
        title_en: "Zooq",
        subtitle_ar: "تجربة مستخدم فريدة",
        subtitle_en: "Unique User Experience",
        desc_ar: "واجهات مستخدم حديثة ومتجاوبة مع دعم كامل للغتين العربية والإنجليزية",
        desc_en: "Modern, responsive user interfaces with full Arabic and English language support"
      }
    ];
    const current = slides[currentSlide];
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] shadow-xl shadow-[#2a655f]/20 border-2 border-[#2a655f]/30 group min-h-[100px] sm:min-h-[100px] md:min-h-[105px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 h-32 w-32 rounded-full bg-[#2a655f]/20 blur-2xl animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-20 -left-20 h-32 w-32 rounded-full bg-[#2a655f]/20 blur-2xl animate-pulse delay-1000" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-3.5 flex items-center gap-2.5 sm:gap-3 md:gap-3.5 z-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-xl bg-white/30 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-lg shadow-[#2a655f]/20 animate-float group-hover:scale-110 transition-transform duration-500", children: current.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2a655f]/30 to-[#3a8a82]/30 blur-lg animate-pulse" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center sm:text-right w-full min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: `text-sm sm:text-sm md:text-lg font-bold text-white mb-0.5 tracking-tight ${isRTL2 ? "font-arabic" : ""}`, children: isRTL2 ? current.title_ar : current.title_en }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: `text-xs sm:text-xs md:text-base font-bold text-[#e8f0ee] mb-0.5 tracking-tight ${isRTL2 ? "font-arabic" : ""}`, children: isRTL2 ? current.subtitle_ar : current.subtitle_en }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-[10px] sm:text-[11px] md:text-xs text-[#e8f0ee]/80 max-w-2xl leading-relaxed hidden sm:block ${isRTL2 ? "font-arabic" : ""}`, children: isRTL2 ? current.desc_ar : current.desc_en })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex flex-row sm:flex-col gap-1.5 sm:gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: prevSlide,
              className: "h-7 w-7 sm:h-7 sm:w-7 md:h-6 md:w-6 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#2a655f] border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 flex items-center justify-center",
              "aria-label": "Previous",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-3.5 md:w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: nextSlide,
              className: "h-7 w-7 sm:h-7 sm:w-7 md:h-6 md:w-6 rounded-full bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#2a655f] border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-110 flex items-center justify-center",
              "aria-label": "Next",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 md:h-3.5 md:w-3.5" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10", children: [
        Array.from({ length: totalSlides }).map((_, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => goToSlide(index),
            "aria-label": `Slide ${index + 1}`,
            className: cn(
              "h-1 rounded-full transition-all duration-500",
              currentSlide === index ? "w-4 bg-white shadow-lg shadow-white/30" : "w-1 bg-white/40 hover:bg-white/60"
            )
          },
          index
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[7px] text-white/60 ml-1 font-mono font-bold", children: [
          currentSlide + 1,
          "/",
          totalSlides
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-0.5 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" })
    ] });
  };
  const nav = [
    { id: "overview", label: app.lang === "ar" ? "نظرة عامة" : "Overview", icon: LayoutDashboard, desc: app.lang === "ar" ? "لوحة التحكم الرئيسية" : "Main Dashboard" },
    { id: "products", label: app.lang === "ar" ? "المنتجات" : "Products", icon: Package, desc: app.lang === "ar" ? "إدارة المنتجات" : "Manage Products" },
    { id: "orders", label: app.lang === "ar" ? "الطلبات" : "Orders", icon: ShoppingCart, desc: app.lang === "ar" ? "متابعة الطلبات" : "Track Orders" },
    { id: "customers", label: app.lang === "ar" ? "العملاء" : "Customers", icon: Users, desc: app.lang === "ar" ? "قاعدة العملاء" : "Customer Base" },
    { id: "settings", label: app.lang === "ar" ? "الإعدادات" : "Settings", icon: Settings, desc: app.lang === "ar" ? "تخصيص المتجر" : "Store Settings" }
  ];
  const statusLabels = {
    completed: app.lang === "ar" ? "مكتمل" : "Completed",
    pending: app.lang === "ar" ? "قيد المعالجة" : "Pending",
    cancelled: app.lang === "ar" ? "ملغي" : "Cancelled",
    accepted: app.lang === "ar" ? "مقبول" : "Accepted",
    rejected: app.lang === "ar" ? "مرفوض" : "Rejected",
    processing: app.lang === "ar" ? "قيد التجهيز" : "Processing"
  };
  const statusBadge = {
    completed: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-[#2a655f]" }),
    pending: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-[#f9a8d4]" }),
    cancelled: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 text-[#d81b60]" }),
    accepted: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 text-[#3a8a82]" }),
    rejected: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3 text-[#c2185b]" }),
    processing: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-[#fbcfe8]" })
  };
  const isRTL = app.lang === "ar";
  const formattedTime = currentTime.toLocaleTimeString(app.lang === "ar" ? "ar-SA" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const LiveIndicator = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2.5 w-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2a655f] opacity-75" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2a655f] shadow-[0_0_12px_rgba(42,101,95,0.8)]" })
  ] });
  const ChartsSection = ({
    showSales = true,
    showCategory = true,
    showOrders = false,
    showCustomers = false,
    showReviews = false
  }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6", children: [
    showSales && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#2a655f]/15 to-[#3a8a82]/15 rounded-full blur-3xl animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#3a8a82]/15 to-[#2a655f]/15 rounded-full blur-3xl animate-pulse delay-1000" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 border-2 border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800 dark:text-white", children: app.lang === "ar" ? "📈 تحليل المبيعات المتقدم" : "📈 Advanced Sales Analytics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: app.lang === "ar" ? "الإيرادات والطلبات مع مؤشرات النمو الشهرية" : "Revenue & orders with monthly growth indicators" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-[#2a655f] to-[#3a8a82] rounded-full shadow-lg animate-pulse border-2 border-white/30", children: "↑ +12.5%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 text-xs font-bold text-[#2a655f] bg-[#2a655f]/10 rounded-full border-2 border-[#2a655f]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 inline mr-1" }),
            app.lang === "ar" ? "نشط" : "Active"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[240px] relative", children: monthlyData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ComposedChart, { data: monthlyData, margin: { top: 10, right: 10, left: -10, bottom: 0 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("defs", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "revenueGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#2a655f", stopOpacity: 0.3 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#3a8a82", stopOpacity: 0.15 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#f9a8d4", stopOpacity: 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("filter", { id: "glow", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("feGaussianBlur", { stdDeviation: "3", result: "coloredBlur" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("feMerge", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "coloredBlur" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("feMergeNode", { in: "SourceGraphic" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "5 5", stroke: "#e2e8f0", opacity: 0.2, vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", tick: { fontSize: 11, fill: "#94a3b8", fontWeight: 600 }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { yAxisId: "left", tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { yAxisId: "right", orientation: isRTL ? "left" : "right", tick: { fontSize: 11, fill: "#94a3b8" }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            contentStyle: {
              borderRadius: "16px",
              border: "2px solid #2a655f",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(12px)",
              padding: "12px 16px"
            },
            formatter: (v) => typeof v === "number" ? v.toLocaleString() : v
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Legend,
          {
            wrapperStyle: { fontSize: "11px", paddingTop: "8px" },
            iconType: "circle",
            iconSize: 8
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Area,
          {
            yAxisId: "left",
            type: "monotone",
            dataKey: "revenue",
            stroke: "#2a655f",
            strokeWidth: 3,
            fill: "url(#revenueGrad)",
            dot: { fill: "#3a8a82", r: 5, stroke: "#fff", strokeWidth: 2 },
            activeDot: { r: 8, fill: "#3a8a82", stroke: "#fff", strokeWidth: 2 },
            animationDuration: 2e3,
            animationEasing: "ease-in-out",
            filter: "url(#glow)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Bar,
          {
            yAxisId: "right",
            dataKey: "orders",
            fill: "#f9a8d4",
            radius: [6, 6, 0, 0],
            barSize: 28,
            animationDuration: 2e3,
            animationEasing: "ease-in-out"
          }
        )
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-3 animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-8 h-8 text-gray-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: app.lang === "ar" ? "📭 لا توجد بيانات مبيعات" : "📭 No sales data" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3 mt-4 pt-4 border-t-2 border-[#2a655f]/20", children: [
        { label: app.lang === "ar" ? "🏆 أعلى إيراد" : "🏆 Peak Revenue", value: monthlyData.length > 0 ? formatPrice(Math.max(...monthlyData.map((d) => d.revenue)), app.currency, app.lang) : formatPrice(0, app.currency, app.lang), color: "text-[#2a655f]" },
        { label: app.lang === "ar" ? "📊 متوسط الطلبات" : "📊 Avg Orders", value: monthlyData.length > 0 ? Math.round(monthlyData.reduce((sum, d) => sum + d.orders, 0) / monthlyData.length) : 0, color: "text-[#3a8a82]" },
        { label: app.lang === "ar" ? "📈 معدل النمو" : "📈 Growth Rate", value: `+${monthlyData.length > 1 ? Math.round((monthlyData[monthlyData.length - 1].revenue - monthlyData[0].revenue) / (monthlyData[0].revenue || 1) * 100) : 0}%`, color: "text-[#1a4f4a]" }
      ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center p-2 rounded-xl bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 border border-[#2a655f]/20 hover:scale-105 transition-transform duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-gray-400 uppercase tracking-wider", children: item.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-bold ${item.color}`, children: item.value })
      ] }, i)) })
    ] }),
    showSales && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 rounded-full blur-3xl animate-pulse delay-700" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 border-2 border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800 dark:text-white", children: app.lang === "ar" ? "⭐ مؤشرات الأداء" : "⭐ Performance Score" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: app.lang === "ar" ? "تقييم شامل لأداء متجرك في 5 مجالات" : "Comprehensive store rating across 5 areas" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-20 h-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-20 h-20 transform -rotate-90", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "40", cy: "40", r: "34", stroke: "#e2e8f0", strokeWidth: "7", fill: "none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "circle",
              {
                cx: "40",
                cy: "40",
                r: "34",
                stroke: "url(#performanceGrad)",
                strokeWidth: "7",
                fill: "none",
                strokeDasharray: `${completionRate / 100 * 213.6} 213.6`,
                strokeLinecap: "round",
                className: "transition-all duration-1000"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "performanceGrad", x1: "0", y1: "0", x2: "1", y2: "1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#2a655f" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#3a8a82" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#f9a8d4" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800 dark:text-white", children: [
            completionRate,
            "%"
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] w-full", children: performanceData.some((d) => d.value > 0) ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(RadarChart, { data: performanceData, outerRadius: 70, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PolarGrid, { stroke: RADAR_COLORS.grid, strokeDasharray: "3 3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PolarAngleAxis,
          {
            dataKey: "subject",
            tick: { fill: "#475569", fontSize: 10, fontWeight: 600 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PolarRadiusAxis,
          {
            angle: 30,
            domain: [0, 100],
            tick: { fill: "#94a3b8", fontSize: 8 },
            axisLine: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Radar,
          {
            name: app.lang === "ar" ? "الأداء" : "Performance",
            dataKey: "value",
            stroke: "#2a655f",
            fill: "rgba(42,101,95,0.2)",
            fillOpacity: 0.6,
            strokeWidth: 2,
            animationDuration: 2e3,
            animationEasing: "ease-in-out"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            contentStyle: {
              borderRadius: "12px",
              border: "2px solid #2a655f",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.98)",
              padding: "8px 12px"
            },
            formatter: (v) => `${v}%`
          }
        )
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: app.lang === "ar" ? "📭 لا توجد بيانات أداء" : "📭 No performance data" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 mt-2 relative", children: [
        { label: app.lang === "ar" ? "💰 المبيعات" : "💰 Sales", value: `${performanceData[0]?.value || 0}%`, color: "#2a655f" },
        { label: app.lang === "ar" ? "🏅 الجودة" : "🏅 Quality", value: `${performanceData[2]?.value || 0}%`, color: "#3a8a82" },
        { label: app.lang === "ar" ? "⭐ التقييم" : "⭐ Rating", value: `${performanceData[4]?.value || 0}%`, color: "#f9a8d4" },
        { label: app.lang === "ar" ? "⚡ السرعة" : "⚡ Speed", value: `${performanceData[3]?.value || 0}%`, color: "#1a4f4a" }
      ].map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center hover:scale-105 transition-transform duration-300 border-2 border-[#2a655f]/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full", style: { backgroundColor: item.color } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-500 dark:text-gray-400", children: item.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-gray-800 dark:text-white", children: item.value })
      ] }, i)) })
    ] }),
    showCategory && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 rounded-full blur-3xl animate-pulse delay-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-4 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 border-2 border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { className: "w-5 h-5 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800 dark:text-white", children: app.lang === "ar" ? "📊 توزيع الفئات" : "📊 Category Distribution" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: app.lang === "ar" ? "توزيع الإيرادات حسب فئات المنتجات" : "Revenue distribution by product categories" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[220px] relative", children: categoryData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: categoryData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: `pieColor_${i}`, x1: "0", y1: "0", x2: "1", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: PREMIUM_COLORS[i % PREMIUM_COLORS.length], stopOpacity: 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: PREMIUM_COLORS[(i + 3) % PREMIUM_COLORS.length], stopOpacity: 0.7 })
        ] }, i)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pie,
          {
            data: categoryData,
            cx: "50%",
            cy: "45%",
            innerRadius: 35,
            outerRadius: 75,
            paddingAngle: 3,
            dataKey: "value",
            animationDuration: 2e3,
            animationEasing: "ease-in-out",
            children: categoryData.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              Cell,
              {
                fill: `url(#pieColor_${i})`,
                stroke: "#2a655f",
                strokeWidth: 2.5,
                className: "hover:opacity-80 transition-opacity duration-300 cursor-pointer hover:scale-105"
              },
              i
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            formatter: (v) => formatPrice(v, app.currency, app.lang),
            contentStyle: {
              borderRadius: "12px",
              border: "2px solid #2a655f",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.98)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Legend,
          {
            wrapperStyle: { fontSize: "10px", paddingTop: "4px" },
            iconType: "circle",
            iconSize: 8
          }
        )
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-3 animate-spin-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PieChart, { className: "w-8 h-8 text-gray-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: app.lang === "ar" ? "📭 لا توجد بيانات" : "📭 No data" })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2 mt-3 pt-3 border-t-2 border-[#2a655f]/20", children: categoryData.slice(0, 5).map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 dark:bg-gray-800/50 border-2 border-[#2a655f]/20 hover:scale-105 transition-transform duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "w-3 h-3 rounded-full shadow-md",
            style: { backgroundColor: PREMIUM_COLORS[i % PREMIUM_COLORS.length] }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-gray-600 dark:text-gray-300 truncate max-w-[60px] font-medium", children: item.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-[#2a655f] dark:text-white", children: formatPrice(item.value, app.currency, app.lang) })
      ] }, i)) })
    ] }),
    showOrders && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 rounded-full blur-3xl animate-pulse delay-1000" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 border-2 border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800 dark:text-white", children: app.lang === "ar" ? "📈 اتجاه الطلبات الشهرية" : "📈 Monthly Order Trends" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: app.lang === "ar" ? "عدد الطلبات خلال الأشهر الماضية" : "Order count over past months" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 text-xs font-bold text-[#2a655f] bg-[#2a655f]/10 rounded-full border-2 border-[#2a655f]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3 inline mr-1" }),
            "+",
            monthlyData.length > 1 ? Math.round(((monthlyData[monthlyData.length - 1]?.orders || 0) - (monthlyData[0]?.orders || 0)) / (monthlyData[0]?.orders || 1) * 100) : 0,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 text-xs font-bold text-white bg-gradient-to-r from-[#2a655f] to-[#3a8a82] rounded-full shadow-lg border-2 border-white/30", children: [
            totalOrders,
            " ",
            app.lang === "ar" ? "طلب" : "orders"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] relative", children: monthlyData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: monthlyData, margin: { top: 5, right: 5, left: -10, bottom: 5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "ordersBarGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#2a655f", stopOpacity: 0.9 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#3a8a82", stopOpacity: 0.7 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#f9a8d4", stopOpacity: 0.4 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "5 5", stroke: "#e2e8f0", opacity: 0.2, vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", tick: { fontSize: 10, fill: "#94a3b8", fontWeight: 600 }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { tick: { fontSize: 10, fill: "#94a3b8" }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            contentStyle: {
              borderRadius: "12px",
              border: "2px solid #2a655f",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.98)"
            },
            formatter: (v) => `${v} ${app.lang === "ar" ? "طلب" : "orders"}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Bar,
          {
            dataKey: "orders",
            fill: "url(#ordersBarGrad)",
            radius: [6, 6, 0, 0],
            barSize: 32,
            animationDuration: 2e3,
            animationEasing: "ease-in-out"
          }
        )
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-3 animate-spin-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-8 h-8 text-gray-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: app.lang === "ar" ? "📭 لا توجد بيانات" : "📭 No data" })
      ] }) }) })
    ] }),
    showCustomers && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 rounded-full blur-3xl animate-pulse delay-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 border-2 border-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-bold text-gray-800 dark:text-white", children: app.lang === "ar" ? "👥 توزيع العملاء حسب المدينة" : "👥 Customer Distribution by City" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: app.lang === "ar" ? "توزيع العملاء حسب المدينة" : "Customer distribution by city" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-3 py-1 text-xs font-bold text-[#2a655f] bg-[#2a655f]/10 rounded-full border-2 border-[#2a655f]/20", children: [
          totalCustomers,
          " ",
          app.lang === "ar" ? "عميل" : "customers"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] relative", children: customerData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: customerData, layout: "vertical", margin: { top: 5, right: 5, left: 0, bottom: 5 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "customerBarGrad", x1: "0", y1: "0", x2: "1", y2: "0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "#2a655f", stopOpacity: 0.9 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "50%", stopColor: "#3a8a82", stopOpacity: 0.7 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "#f9a8d4", stopOpacity: 0.5 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "5 5", stroke: "#e2e8f0", opacity: 0.2, horizontal: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { type: "number", tick: { fontSize: 10, fill: "#94a3b8" }, axisLine: false, tickLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            dataKey: "name",
            type: "category",
            tick: { fontSize: 10, fill: "#94a3b8", fontWeight: 600 },
            axisLine: false,
            tickLine: false,
            width: 60
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            contentStyle: {
              borderRadius: "12px",
              border: "2px solid #2a655f",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.98)"
            },
            formatter: (v) => `${v} ${app.lang === "ar" ? "عميل" : "customers"}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Bar,
          {
            dataKey: "value",
            fill: "url(#customerBarGrad)",
            radius: [0, 6, 6, 0],
            barSize: 18,
            animationDuration: 2e3,
            animationEasing: "ease-in-out"
          }
        )
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-3 animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8 text-gray-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-500", children: app.lang === "ar" ? "📭 لا توجد بيانات" : "📭 No data" })
      ] }) }) })
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `min-h-screen bg-gradient-to-br from-white via-[#2a655f]/5 to-[#3a8a82]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#2a655f]/5 ${isRTL ? "font-arabic" : ""}`, dir: isRTL ? "rtl" : "ltr", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 shadow-lg shadow-[#2a655f]/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-[#3a8a82] animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex items-center gap-2 sm:gap-4 min-w-0 ${isRTL ? "flex-row-reverse" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 group min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8 sm:h-10 sm:w-10 rounded-xl ring-2 ring-[#2a655f]/40 shadow-lg shadow-[#2a655f]/20 group-hover:shadow-xl group-hover:scale-105 transition-all duration-500", children: storeLogo ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: storeLogo, alt: storeName, className: "object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-sm font-bold", children: storeName.charAt(0).toUpperCase() || "S" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
              "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 animate-pulse",
              storeStatus && currentlyOpen ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" : storeStatus ? "bg-amber-500" : "bg-red-500"
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#2a655f] dark:text-[#3a8a82] text-sm sm:text-lg group-hover:text-[#3a8a82] transition-colors truncate", children: app.lang === "ar" ? `لوحة متجر ${storeName}` : `${storeName} Dashboard` }),
              storeStatus ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: cn(
                "text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 border-0 animate-pulse shrink-0",
                currentlyOpen ? "bg-[#2a655f]/20 text-[#2a655f] dark:text-[#2a655f]" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
              ), children: currentlyOpen ? app.lang === "ar" ? "🟢 مفتوح" : "🟢 Open" : app.lang === "ar" ? "🟡 مغلق" : "🟡 Closed" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-[7px] sm:text-[8px] px-1 sm:px-1.5 py-0.5 bg-red-500/20 text-red-600 dark:text-red-400 border-0 shrink-0", children: [
                "🔴 ",
                app.lang === "ar" ? "غير نشط" : "Inactive"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] sm:text-[10px] text-[#2a655f] dark:text-[#3a8a82] -mt-0.5 font-semibold truncate", children: app.lang === "ar" ? "إدارة كاملة لمتجرك" : "Full Store Management" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 sm:gap-3 shrink-0 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 border-2 border-[#2a655f]/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-slate-600 dark:text-slate-300", children: formattedTime }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LiveIndicator, {})
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative hidden md:block group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: `absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f] transition-colors duration-300 group-focus-within:text-[#2a655f]` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: app.lang === "ar" ? "بحث في لوحة التحكم..." : "Search dashboard...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                onKeyDown: handleSearch,
                className: `${isRTL ? "pr-9 pl-3" : "pl-9 pr-3"} w-64 h-9 rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 bg-slate-50 dark:bg-slate-800/50 text-sm focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 focus:bg-white dark:focus:bg-slate-800/50 transition-all duration-300 group-focus-within:shadow-lg group-focus-within:shadow-[#2a655f]/20`
              }
            ),
            searchQuery && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: clearSearch,
                className: `absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-[#2a655f] hover:text-[#3a8a82] transition-colors duration-200`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group flex items-center gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex flex-col items-end text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-tight", children: app.user?.name || (app.lang === "ar" ? "بائع" : "Seller") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] sm:text-[9px] text-[#2a655f] dark:text-[#3a8a82] font-semibold", children: app.lang === "ar" ? "صاحب المتجر" : "Store Owner" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9 sm:h-10 sm:w-10 ring-2 ring-[#2a655f]/40 group-hover:ring-[#2a655f]/60 transition-all duration-300 group-hover:scale-105 cursor-pointer shrink-0", children: app.user?.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: app.user.avatar_url, alt: app.user.name || "Seller", className: "object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs sm:text-sm font-bold", children: app.user?.name?.charAt(0)?.toUpperCase() || "S" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[#2a655f] border-2 border-white dark:border-slate-900 animate-pulse shadow-[0_0_12px_rgba(42,101,95,0.8)]" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6 relative z-0", children: [
      !showSearchResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 sm:mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SystemSlider, { isRTL }) }),
      showSearchResults && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mb-4 sm:mb-6 animate-in slide-in-from-top-5 duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3", children: [
          { key: "products", label: app.lang === "ar" ? "المنتجات" : "Products", count: searchResults.products, icon: Package },
          { key: "orders", label: app.lang === "ar" ? "الطلبات" : "Orders", count: searchResults.orders, icon: ShoppingCart },
          { key: "customers", label: app.lang === "ar" ? "العملاء" : "Customers", count: searchResults.customers, icon: Users }
        ].map((item) => {
          const isActive = tab === item.key;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              tabIndex: -1,
              onMouseDown: (e) => e.preventDefault(),
              onClick: () => {
                handleTabChangeWithScroll(item.key);
                setShowSearchResultsPage(false);
              },
              className: `bg-white dark:bg-[#1e293b] rounded-xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-2.5 sm:p-3 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.03] group ${isActive ? "ring-2 ring-[#2a655f] border-[#2a655f] shadow-lg shadow-[#2a655f]/20" : ""}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-[#2a655f]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-[#2a655f]/20 shrink-0`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: `h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#2a655f]` }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 truncate", children: item.label }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg font-bold text-[#2a655f] dark:text-[#3a8a82]", children: item.count })
                  ] })
                ] }),
                item.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[9px] sm:text-[10px] text-[#2a655f] font-medium hover:underline transition-all", children: [
                  app.lang === "ar" ? "عرض الكل" : "View all",
                  " →"
                ] })
              ]
            },
            item.key
          );
        }) }),
        searchResults.total === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 p-8 sm:p-12 text-center shadow-lg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4 animate-pulse", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 sm:h-10 sm:w-10 text-[#2a655f]" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base sm:text-lg font-semibold text-slate-900 dark:text-white", children: app.lang === "ar" ? "لا توجد نتائج" : "No results found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1", children: app.lang === "ar" ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "mt-4 rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10",
              onClick: clearSearch,
              children: app.lang === "ar" ? "مسح البحث" : "Clear search"
            }
          )
        ] })
      ] }),
      !showSearchResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 sm:mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 dark:border-[#2a655f]/30 shadow-xl shadow-[#2a655f]/10 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#2a655f] to-[#3a8a82] animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:flex items-center p-1.5 gap-1.5 overflow-x-auto", children: nav.map((n) => {
          const isActive = tab === n.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              tabIndex: -1,
              onMouseDown: (e) => e.preventDefault(),
              onClick: (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleTabChangeWithScroll(n.id);
              },
              className: `
                        relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-500 whitespace-nowrap flex-1 text-center justify-center group
                        ${isActive ? "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-xl shadow-[#2a655f]/40 scale-[1.03] border-2 border-[#2a655f]/50" : "text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 hover:text-[#2a655f] dark:hover:text-[#2a655f]"}
                      `,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative transition-all duration-500 ${isActive ? "scale-110 animate-pulse" : "group-hover:scale-110 group-hover:rotate-6"}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    n.icon,
                    {
                      className: `h-5 w-5 ${isActive ? "text-white" : "text-[#2a655f] group-hover:text-[#2a655f]"}`
                    }
                  ),
                  isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white/60 animate-ping" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${isActive ? "text-white" : "group-hover:text-[#2a655f]"}`, children: n.label }),
                isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse ml-1" })
              ]
            },
            n.id
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden p-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory",
              style: {
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch"
              },
              children: nav.map((n) => {
                const isActive = tab === n.id;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    tabIndex: -1,
                    onMouseDown: (e) => e.preventDefault(),
                    onClick: (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTabChangeWithScroll(n.id);
                    },
                    className: `
                          relative flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl 
                          text-[10px] font-bold transition-all duration-300 shrink-0 min-w-[85px] snap-start
                          ${isActive ? "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/40 border-2 border-[#2a655f]/50 scale-[1.02]" : "text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20"}
                        `,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(n.icon, { className: `h-4.5 w-4.5 ${isActive ? "text-white" : "text-[#2a655f]"}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-tight text-center whitespace-nowrap", children: n.label }),
                      isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 h-1 w-6 rounded-full bg-white/70 animate-pulse" })
                    ]
                  },
                  n.id
                );
              })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] text-[#2a655f]/60 font-semibold", children: app.lang === "ar" ? "اسحب للمزيد" : "Swipe for more" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3 w-3 text-[#2a655f]/60 animate-pulse" })
          ] })
        ] })
      ] }) }),
      !showSearchResults && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-6", children: [
            {
              label: app.lang === "ar" ? "📦 إجمالي الطلبات" : "📦 Total Orders",
              value: totalOrders,
              icon: ShoppingCart,
              change: "+8.2%",
              color: "text-[#2a655f]",
              border: "border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500",
              gradient: "from-[#2a655f] to-[#f9a8d4]"
            },
            {
              label: app.lang === "ar" ? "👥 العملاء" : "👥 Customers",
              value: totalCustomers,
              icon: Users,
              change: "+5.3%",
              color: "text-[#3a8a82]",
              border: "border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500",
              gradient: "from-[#3a8a82] to-[#f9a8d4]"
            },
            {
              label: app.lang === "ar" ? "📦 المنتجات" : "📦 Products",
              value: totalProducts,
              icon: Package,
              change: "+2.1%",
              color: "text-[#1a4f4a]",
              border: "border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500",
              gradient: "from-[#1a4f4a] to-[#f9a8d4]"
            }
          ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `group bg-white dark:bg-[#1e293b] rounded-xl border-2 ${stat.border} shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-500 hover:-translate-y-1 overflow-hidden relative`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col p-2 sm:p-3 md:p-4 ${isRTL ? "text-right" : ""} relative`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-7 w-7 sm:h-9 sm:w-9 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0 mb-1.5 sm:mb-2 ${isRTL ? "self-end" : "self-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: `h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${stat.color}` }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base sm:text-lg md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors leading-none", children: stat.value }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] sm:text-[10px] md:text-xs font-medium text-slate-600 dark:text-slate-400 mt-1 uppercase tracking-wider truncate leading-tight", children: stat.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-0.5 mt-1 ${isRTL ? "flex-row-reverse" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-2.5 w-2.5 md:h-3 md:w-3 text-[#2a655f] animate-bounce-slow shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[8px] sm:text-[10px] md:text-xs font-medium text-[#2a655f] truncate", children: stat.change })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0 h-1 w-full bg-slate-100 dark:bg-slate-700 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`,
                    style: { width: `${Math.min(Math.abs(parseFloat(stat.change) || 0) * 4, 100)}%` }
                  }
                ) })
              ]
            },
            i
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-pink-400/20 dark:border-pink-400/20 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: isRTL ? "text-right" : "", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-[#2a655f] animate-pulse" }),
                    app.lang === "ar" ? "📦 أفضل المنتجات" : "📦 Top Products"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-slate-500 dark:text-slate-400", children: app.lang === "ar" ? "الأكثر مبيعاً حسب الإيرادات" : "Best selling by revenue" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "text-xs text-[#2a655f] hover:text-[#3a8a82] hover:bg-[#2a655f]/10 transition-all",
                    onClick: () => handleTabChangeWithScroll("products"),
                    children: [
                      app.lang === "ar" ? "عرض الكل" : "View all",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: `h-3 w-3 ${isRTL ? "rotate-180" : ""}` })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-pink-400/10 dark:divide-pink-400/10 max-h-[300px] overflow-y-auto", children: topProducts.map((product, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-4 sm:px-5 py-3 hover:bg-pink-500/5 dark:hover:bg-pink-500/10 transition-colors ${isRTL ? "text-right" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `h-8 w-8 rounded-lg bg-gradient-to-br ${["from-[#2a655f] to-[#3a8a82]", "from-[#3a8a82] to-[#1a4f4a]", "from-[#1a4f4a] to-[#3a8a82]", "from-[#3a8a82] to-[#f9a8d4]", "from-[#2a655f] to-[#f9a8d4]"][idx]} flex items-center justify-center text-white font-bold text-xs group-hover:scale-110 transition-transform duration-300 border-2 border-pink-400/30`, children: [
                    "#",
                    idx + 1
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]", children: product.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: [
                      product.quantity || 0,
                      " ",
                      app.lang === "ar" ? "وحدة" : "units"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#2a655f]", children: formatPrice(product.revenue || 0, app.currency, app.lang) })
              ] }) }, idx)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-pink-400/20 dark:border-pink-400/20 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: isRTL ? "text-right" : "", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4 text-[#2a655f] animate-bounce-slow" }),
                    app.lang === "ar" ? "📋 آخر الطلبات" : "📋 Recent Orders"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] sm:text-xs text-slate-500 dark:text-slate-400", children: app.lang === "ar" ? "آخر 5 طلبات" : "Last 5 orders" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "text-xs text-[#2a655f] hover:text-[#3a8a82] hover:bg-[#2a655f]/10 transition-all",
                    onClick: () => handleTabChangeWithScroll("orders"),
                    children: [
                      app.lang === "ar" ? "عرض الكل" : "View all",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: `h-3 w-3 ${isRTL ? "rotate-180" : ""}` })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-pink-400/10 dark:divide-pink-400/10 max-h-[300px] overflow-y-auto", children: recentOrders.map((order, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-4 sm:px-5 py-3 hover:bg-pink-500/5 dark:hover:bg-pink-500/10 transition-colors ${isRTL ? "text-right" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 group", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-[#2a655f] dark:text-white bg-[#2a655f]/10 dark:bg-[#2a655f]/20 px-2 py-1 rounded-lg border border-pink-400/20 dark:border-pink-400/20", children: [
                      "#",
                      String(order.id).slice(0, 8)
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => {
                          navigator.clipboard.writeText(order.id);
                          toast.success(app.lang === "ar" ? "✅ تم نسخ رقم الطلب" : "✅ Order ID copied");
                        },
                        className: "text-[10px] text-muted-foreground hover:text-[#2a655f] transition-colors opacity-0 group-hover:opacity-100",
                        children: "📋 نسخ"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-900 dark:text-white truncate max-w-[120px]", children: order.product_name || (app.lang === "ar" ? "طلب" : "Order") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: new Date(order.created_at).toLocaleDateString(
                      app.lang === "ar" ? "ar-SA" : "en-US",
                      { month: "short", day: "numeric" }
                    ) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: isRTL ? "text-left" : "text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#2a655f]", children: formatPrice(order.total, app.currency, app.lang) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""} justify-end`, children: [
                    statusBadge[order.status],
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-500 capitalize", children: statusLabels[order.status] || (app.lang === "ar" ? "قيد المعالجة" : "Pending") })
                  ] })
                ] })
              ] }) }, idx)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 p-4 sm:p-5 shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-20 -top-20 h-64 w-64 rounded-full bg-pink-500/5 blur-3xl animate-pulse" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""} relative`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: isRTL ? "text-right" : "", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 text-[#2a655f]" }),
                      app.lang === "ar" ? "👥 العملاء" : "👥 Customers"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors", children: totalCustomers })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[#2a655f]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border-2 border-pink-400/20 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 sm:h-6 sm:w-6 text-[#2a655f]" }) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 hover:-translate-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 py-3 border-b-2 border-pink-400/20 dark:border-pink-400/20 flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: isRTL ? "text-right" : "", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3 w-3 text-[#2a655f]" }),
                    app.lang === "ar" ? "👤 أحدث العملاء" : "👤 Recent Customers"
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      className: "text-[10px] text-[#2a655f] hover:text-[#3a8a82] hover:bg-[#2a655f]/10 transition-all",
                      onClick: () => handleTabChangeWithScroll("customers"),
                      children: [
                        app.lang === "ar" ? "عرض الكل" : "View all",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: `h-3 w-3 ${isRTL ? "rotate-180" : ""}` })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-pink-400/10 dark:divide-pink-400/10 max-h-[260px] overflow-y-auto", children: [
                  customersWithOrders.slice(0, 5).map((customer, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `px-4 py-3 hover:bg-pink-500/5 dark:hover:bg-pink-500/10 transition-colors ${isRTL ? "text-right" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9 sm:h-10 sm:w-10 rounded-xl ring-2 ring-pink-400/20 group-hover:ring-pink-400/50 transition-all duration-300 shrink-0", children: customer.avatar_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: customer.avatar_url, alt: customer.display_name, className: "object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-sm font-bold", children: customer.display_name?.charAt(0).toUpperCase() || "ع" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-900 dark:text-white truncate", children: customer.display_name }),
                        customer.is_online && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-[#2a655f] animate-pulse shadow-[0_0_8px_rgba(42,101,95,0.8)]" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 flex-wrap", children: [
                        customer.phone_number && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 text-[#2a655f]" }),
                          customer.phone_number
                        ] }),
                        customer.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3 text-[#2a655f]" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[80px]", children: customer.email })
                        ] }),
                        customer.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 text-[#2a655f]" }),
                          customer.city
                        ] })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-[#2a655f]", children: customer.total_orders || 0 }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[8px] text-slate-400 uppercase tracking-wider", children: app.lang === "ar" ? "طلبات" : "orders" })
                    ] })
                  ] }) }, idx)),
                  customersWithOrders.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-6 text-center", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-6 w-6 text-[#2a655f]" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400", children: app.lang === "ar" ? "لا يوجد عملاء حتى الآن" : "No customers yet" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChartsSection, { showSales: true, showCategory: true, showCustomers: true })
        ] }),
        tab === "products" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductsPage, {}) }),
        tab === "orders" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(OrdersPage, {}) }),
        tab === "customers" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CustomersPage, {}) }),
        tab === "settings" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {}) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        /* ✅ إخفاء scrollbar للتابات على الموبايل */
        .md\\:hidden .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      ` })
  ] });
}
function Dashboard() {
  const app = useApp();
  useT();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = reactExports.useState(false);
  const {
    data: notifications = [],
    refetch: refetchNotifications
  } = useNotifications(app.user?.id);
  useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const [showNotificationPopup, setShowNotificationPopup] = reactExports.useState(false);
  const [isSubscribed, setIsSubscribed] = reactExports.useState(false);
  const [permission, setPermission] = reactExports.useState("default");
  const [popupShown, setPopupShown] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const checkStatus = async () => {
      if (!app.user) return;
      const supported = isPushSupported();
      if (!supported) return;
      const perm = getNotificationPermission();
      setPermission(perm);
      const subscribed = await getPushSubscriptionStatus();
      setIsSubscribed(subscribed);
      if (subscribed) {
        setPopupShown(true);
        return;
      }
      if (perm === "denied") {
        setPopupShown(true);
        return;
      }
      if (!popupShown) {
        setTimeout(() => {
          setShowNotificationPopup(true);
        }, 3e3);
      }
    };
    checkStatus();
  }, [app.user, popupShown]);
  const enableNotifications = async () => {
    if (!app.user) return;
    try {
      const granted = await requestPushPermission();
      if (!granted) {
        setPermission("denied");
        toast.info(app.lang === "ar" ? "الرجاء السماح بالإشعارات من إعدادات المتصفح 🔔" : "Please allow notifications from browser settings 🔔");
        return;
      }
      const success = await subscribeToPush(app.user.id);
      if (success) {
        setIsSubscribed(true);
        setPermission("granted");
        setShowNotificationPopup(false);
        toast.success(app.lang === "ar" ? "🔔 تم تفعيل الإشعارات بنجاح" : "🔔 Notifications enabled successfully");
      } else {
        toast.error(app.lang === "ar" ? "حدث خطأ أثناء تفعيل الإشعارات" : "Error enabling notifications");
      }
    } catch (error) {
      console.error("❌ Error enabling notifications:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ ما" : "Something went wrong");
    }
  };
  reactExports.useEffect(() => {
    if (!app.authLoading && !app.user) {
      navigate({
        to: "/auth/$mode",
        params: {
          mode: "login"
        }
      });
    }
  }, [app.authLoading, app.user, navigate]);
  if (app.authLoading || !app.user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground", children: "جار التحميل..." });
  }
  const isAdmin = app.roles?.includes("admin") ?? false;
  const isSeller = app.roles?.includes("seller") ?? false;
  async function handleNotificationClick(notification) {
    if (!notification.is_read) {
      try {
        const {
          error
        } = await supabase.from("notifications").update({
          is_read: true
        }).eq("id", notification.id).eq("user_id", app.user.id);
        if (error) throw error;
        await refetchNotifications();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    if (notification.link_url) {
      window.location.href = notification.link_url;
      setNotificationsOpen(false);
    }
  }
  async function handleMarkAsRead(notificationId, e) {
    e.stopPropagation();
    try {
      const {
        error
      } = await supabase.from("notifications").update({
        is_read: true
      }).eq("id", notificationId).eq("user_id", app.user.id);
      if (error) throw error;
      await refetchNotifications();
      toast.success(app.lang === "ar" ? "تم تحديد الإشعار كمقروء" : "Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }
  async function handleMarkAllAsRead() {
    try {
      const {
        error
      } = await supabase.from("notifications").update({
        is_read: true
      }).eq("user_id", app.user.id).eq("is_read", false);
      if (error) throw error;
      await refetchNotifications();
      toast.success(app.lang === "ar" ? "تم تحديد الكل كمقروء" : "All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }
  function getNotificationIcon(type) {
    switch (type) {
      case "order":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "h-4 w-4" });
      case "booking":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" });
      case "admin":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" });
      case "favorite_offer":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Gift, { className: "h-4 w-4" });
      case "system":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" });
    }
  }
  function getStatusColor(type) {
    switch (type) {
      case "order":
        return "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800";
      case "booking":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800";
      case "admin":
        return "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800";
      case "favorite_offer":
        return "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-800";
    }
  }
  function formatTime(date) {
    const now = /* @__PURE__ */ new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    const diffHours = Math.floor(diffMs / 36e5);
    const diffDays = Math.floor(diffMs / 864e5);
    if (app.lang === "ar") {
      if (diffMins < 1) return "الآن";
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays < 7) return `منذ ${diffDays} يوم`;
      return then.toLocaleDateString("ar-SA", {
        day: "numeric",
        month: "short"
      });
    } else {
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return then.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short"
      });
    }
  }
  const NotificationButton = () => /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: notificationsOpen, onOpenChange: setNotificationsOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "relative h-10 w-10 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-300" }),
      unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30 animate-pulse border-2 border-white dark:border-slate-900", children: unreadCount > 9 ? "9+" : unreadCount })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90 backdrop-blur-xl border-b border-blue-200/30 dark:border-blue-800/30 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-5 w-5 text-white" }) }),
            unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900", children: unreadCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-lg font-bold text-slate-900 dark:text-white", children: app.lang === "ar" ? "الإشعارات" : "Notifications" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400", children: unreadCount > 0 ? app.lang === "ar" ? `${unreadCount} إشعار غير مقروء` : `${unreadCount} unread` : app.lang === "ar" ? "كل الإشعارات مقروءة" : "All caught up" })
          ] })
        ] }),
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "text-xs gap-1.5 rounded-xl hover:bg-blue-100/50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all", onClick: handleMarkAllAsRead, disabled: markAllRead.isPending, children: [
          markAllRead.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3.5 w-3.5" }),
          app.lang === "ar" ? "تحديد الكل كمقروء" : "Mark all read"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] overflow-y-auto p-2 space-y-1.5", children: notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-8 w-8 text-slate-300 dark:text-slate-600" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-600 dark:text-slate-300", children: app.lang === "ar" ? "لا توجد إشعارات" : "No notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 dark:text-slate-500 mt-1", children: app.lang === "ar" ? "ستظهر الإشعارات هنا عند استلامها" : "Notifications will appear here" })
      ] }) : notifications.map((notification) => {
        const isUnread = !notification.is_read;
        const statusColor = getStatusColor(notification.type);
        const icon = getNotificationIcon(notification.type);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `group relative rounded-xl transition-all duration-300 ${isUnread ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/40 dark:border-blue-800/40 hover:shadow-md" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 cursor-pointer", onClick: () => handleNotificationClick(notification), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: notification.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: notification.image_url, alt: "", className: "h-11 w-11 rounded-xl object-cover border-2 border-slate-200/50 dark:border-slate-700/50", onError: (e) => {
              e.target.style.display = "none";
            } }),
            isUnread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-11 w-11 rounded-xl flex items-center justify-center ${statusColor} border`, children: icon }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm ${isUnread ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`, children: notification.title_ar || notification.title_en || "إشعار" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-xs mt-0.5 line-clamp-2 ${isUnread ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-500"}`, children: notification.body_ar || notification.body_en || notification.message }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                  formatTime(notification.created_at)
                ] }),
                notification.type && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] px-1.5 py-0.5 rounded-full ${statusColor} border`, children: notification.type })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 flex items-center gap-1", children: [
              isUnread && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/30 text-blue-500 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100", onClick: (e) => handleMarkAsRead(notification.id, e), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-3.5 w-3.5 text-slate-400" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "rounded-xl p-1 min-w-[160px]", children: [
                  isUnread && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "rounded-lg text-sm cursor-pointer gap-2", onClick: (e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification.id, e);
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
                    app.lang === "ar" ? "تحديد كمقروء" : "Mark as read"
                  ] }),
                  notification.link_url && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "rounded-lg text-sm cursor-pointer gap-2", onClick: () => {
                    window.location.href = notification.link_url;
                    setNotificationsOpen(false);
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4" }),
                    app.lang === "ar" ? "عرض التفاصيل" : "View details"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "rounded-lg text-sm cursor-pointer gap-2 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/30", onClick: async (e) => {
                    e.stopPropagation();
                    try {
                      await supabase.from("notifications").delete().eq("id", notification.id);
                      await refetchNotifications();
                      toast.success(app.lang === "ar" ? "تم حذف الإشعار" : "Notification deleted");
                    } catch (error) {
                      console.error("Error deleting notification:", error);
                      toast.error(app.lang === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting notification");
                    }
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                    app.lang === "ar" ? "حذف" : "Delete"
                  ] })
                ] })
              ] })
            ] })
          ] }) })
        ] }) }, notification.id);
      }) }),
      notifications.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 p-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400 dark:text-slate-500", children: [
          notifications.length,
          " ",
          app.lang === "ar" ? "إشعار" : "notifications",
          unreadCount > 0 && ` · ${unreadCount} ${app.lang === "ar" ? "غير مقروء" : "unread"}`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800", onClick: () => setNotificationsOpen(false), children: app.lang === "ar" ? "إغلاق" : "Close" })
      ] })
    ] })
  ] });
  if (isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AdminDashboard, { notificationButton: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationButton, {}) }),
      permission === "denied" && !isSubscribed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: enableNotifications, className: "gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-105 px-6 py-3 h-auto text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "h-4 w-4" }),
        app.lang === "ar" ? "🔔 تفعيل الإشعارات" : "🔔 Enable Notifications"
      ] }) })
    ] });
  }
  if (!isSeller) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BecomeSellerCard, {});
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SellerDashboard, { notificationButton: /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationButton, {}) }),
    permission === "denied" && !isSubscribed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: enableNotifications, className: "gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-105 px-6 py-3 h-auto text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BellRing, { className: "h-4 w-4" }),
      app.lang === "ar" ? "🔔 تفعيل الإشعارات" : "🔔 Enable Notifications"
    ] }) })
  ] });
}
export {
  Dashboard as component
};
