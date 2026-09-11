// src/components/dashboard/admin/CategoriesAdmin.tsx

import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ImageInput } from "@/components/ImageInput";
import { useApp, useT } from "@/lib/i18n";
import { useCategories, useSaveCategory, useDeleteCategory } from "@/lib/queries";
import { toast } from "sonner";
import {
  Plus, Pencil, Trash2, Search, RefreshCw,
  Layers, Sparkles, AlertTriangle, X, XCircle,
  CheckCircle2, FolderOpen, Tag, Hash, Globe,
  ChevronDown, ChevronRight, Check, Star, StarOff, GripVertical,
  Zap, Shield, Eye, EyeOff, Link2, Megaphone,
  Flame, Crown, Gem, Rocket, Award, Target, Loader2,
  Folder, FolderTree, CornerDownRight, Info, Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ============================================================
// 📦 قائمة الأيقونات الكاملة
// ============================================================
const CATEGORY_ICONS = [
  { value: 'smartphone', label: '📱', name: 'Smartphone', category: 'electronics' },
  { value: 'laptop', label: '💻', name: 'Laptop', category: 'electronics' },
  { value: 'tablet', label: '📟', name: 'Tablet', category: 'electronics' },
  { value: 'watch', label: '⌚', name: 'Smart Watch', category: 'electronics' },
  { value: 'headphones', label: '🎧', name: 'Headphones', category: 'electronics' },
  { value: 'camera', label: '📷', name: 'Camera', category: 'electronics' },
  { value: 'tv', label: '📺', name: 'TV', category: 'electronics' },
  { value: 'speaker', label: '🔊', name: 'Speaker', category: 'electronics' },
  { value: 'gamepad', label: '🎮', name: 'Game Console', category: 'electronics' },
  { value: 'drone', label: '🛸', name: 'Drone', category: 'electronics' },
  { value: 'shirt', label: '👕', name: 'Shirt', category: 'fashion' },
  { value: 'dress', label: '👗', name: 'Dress', category: 'fashion' },
  { value: 'jeans', label: '👖', name: 'Jeans', category: 'fashion' },
  { value: 'shoes', label: '👟', name: 'Sneakers', category: 'fashion' },
  { value: 'boots', label: '🥾', name: 'Boots', category: 'fashion' },
  { value: 'hat', label: '🧢', name: 'Hat', category: 'fashion' },
  { value: 'glasses', label: '👓', name: 'Glasses', category: 'fashion' },
  { value: 'bag', label: '👜', name: 'Bag', category: 'fashion' },
  { value: 'jewelry', label: '💎', name: 'Jewelry', category: 'fashion' },
  { value: 'perfume', label: '🧴', name: 'Perfume', category: 'fashion' },
  { value: 'home', label: '🏠', name: 'Home', category: 'home' },
  { value: 'furniture', label: '🛋️', name: 'Furniture', category: 'home' },
  { value: 'bed', label: '🛏️', name: 'Bed', category: 'home' },
  { value: 'kitchen', label: '🍳', name: 'Kitchen', category: 'home' },
  { value: 'fridge', label: '🧊', name: 'Fridge', category: 'home' },
  { value: 'lamp', label: '💡', name: 'Lamp', category: 'home' },
  { value: 'tools', label: '🔧', name: 'Tools', category: 'home' },
  { value: 'book', label: '📚', name: 'Book', category: 'books' },
  { value: 'notebook', label: '📓', name: 'Notebook', category: 'books' },
  { value: 'pen', label: '🖊️', name: 'Pen', category: 'books' },
  { value: 'art', label: '🎨', name: 'Art', category: 'books' },
  { value: 'toys', label: '🧸', name: 'Toys', category: 'toys' },
  { value: 'puzzle', label: '🧩', name: 'Puzzle', category: 'toys' },
  { value: 'dumbbell', label: '🏋️', name: 'Dumbbell', category: 'sports' },
  { value: 'coffee', label: '☕', name: 'Coffee', category: 'food' },
  { value: 'cake', label: '🎂', name: 'Cake', category: 'food' },
  { value: 'health', label: '🏥', name: 'Health', category: 'health' },
  { value: 'medicine', label: '💊', name: 'Medicine', category: 'health' },
  { value: 'soap', label: '🧼', name: 'Soap', category: 'health' },
  { value: 'car', label: '🚗', name: 'Car', category: 'vehicles' },
  { value: 'truck', label: '🚚', name: 'Truck', category: 'vehicles' },
  { value: 'motorcycle', label: '🏍️', name: 'Motorcycle', category: 'vehicles' },
  { value: 'office', label: '🏢', name: 'Office', category: 'services' },
  { value: 'shop', label: '🏪', name: 'Shop', category: 'services' },
  { value: 'restaurant', label: '🍽️', name: 'Restaurant', category: 'services' },
  { value: 'nature', label: '🌿', name: 'Nature', category: 'nature' },
  { value: 'flower', label: '🌸', name: 'Flower', category: 'nature' },
  { value: 'tree', label: '🌳', name: 'Tree', category: 'nature' },
  { value: 'pets', label: '🐾', name: 'Pets', category: 'nature' },
  { value: 'money', label: '💰', name: 'Money', category: 'business' },
  { value: 'gift', label: '🎁', name: 'Gift', category: 'business' },
  { value: 'discount', label: '🏷️', name: 'Discount', category: 'business' },
  { value: 'globe', label: '🌍', name: 'Globe', category: 'general' },
  { value: 'location', label: '📍', name: 'Location', category: 'general' },
  { value: 'calendar', label: '📅', name: 'Calendar', category: 'general' },
  { value: 'bell', label: '🔔', name: 'Bell', category: 'general' },
  { value: 'email', label: '📧', name: 'Email', category: 'general' },
  { value: 'phone', label: '📞', name: 'Phone', category: 'general' },
  { value: 'chat', label: '💬', name: 'Chat', category: 'general' },
  { value: 'user', label: '👤', name: 'User', category: 'general' },
  { value: 'settings', label: '⚙️', name: 'Settings', category: 'general' },
  { value: 'heart', label: '❤️', name: 'Heart', category: 'general' },
  { value: 'fire', label: '🔥', name: 'Fire', category: 'general' },
  { value: 'sparkle', label: '✨', name: 'Sparkle', category: 'general' },
  { value: 'rocket', label: '🚀', name: 'Rocket', category: 'general' },
  { value: 'package', label: '📦', name: 'Package', category: 'general' },
  { value: 'delivery', label: '🚚', name: 'Delivery', category: 'general' },
  { value: 'shield', label: '🛡️', name: 'Shield', category: 'general' },
  { value: 'award', label: '🏆', name: 'Award', category: 'general' },
];

const getIconEmoji = (value: string) => {
  const found = CATEGORY_ICONS.find(icon => icon.value === value);
  return found?.label || '📦';
};

const getIconName = (value: string) => {
  const found = CATEGORY_ICONS.find(icon => icon.value === value);
  return found?.name || 'Package';
};

// ============================================================
// ✅ Stat Card
// ============================================================
const StatCard = ({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: number;
  icon: any;
  gradient: string;
}) => (
  <div className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-400/80 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" />
    </div>
    <div className="flex items-center justify-between relative">
      <div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">{value}</p>
      </div>
      <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
        <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
      </div>
    </div>
    <div className="mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 animate-shimmer`}
        style={{ width: `${Math.min(100, (value / 1) * 100)}%` }}
      />
    </div>
  </div>
);

// ============================================================
// 🎯 Icon Dropdown
// ============================================================
function IconDropdown({ value, onChange, lang, searchTerm, onSearchChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) return CATEGORY_ICONS;
    const query = searchTerm.toLowerCase().trim();
    return CATEGORY_ICONS.filter(icon =>
      icon.name.toLowerCase().includes(query) ||
      icon.value.toLowerCase().includes(query) ||
      icon.label.includes(query)
    );
  }, [searchTerm]);

  const groupedIcons = useMemo(() => {
    const groups: Record<string, typeof CATEGORY_ICONS> = {};
    filteredIcons.forEach(icon => {
      if (!groups[icon.category]) groups[icon.category] = [];
      groups[icon.category].push(icon);
    });
    return groups;
  }, [filteredIcons]);

  const categoryNames: Record<string, { ar: string, en: string, emoji: string }> = {
    electronics: { ar: 'إلكترونيات', en: 'Electronics', emoji: '📱' },
    fashion: { ar: 'أزياء', en: 'Fashion', emoji: '👕' },
    home: { ar: 'منزل', en: 'Home', emoji: '🏠' },
    books: { ar: 'كتب', en: 'Books', emoji: '📚' },
    toys: { ar: 'ألعاب', en: 'Toys', emoji: '🎮' },
    food: { ar: 'طعام', en: 'Food', emoji: '🍕' },
    health: { ar: 'صحة', en: 'Health', emoji: '🏥' },
    vehicles: { ar: 'سيارات', en: 'Vehicles', emoji: '🚗' },
    services: { ar: 'خدمات', en: 'Services', emoji: '🏢' },
    sports: { ar: 'رياضة', en: 'Sports', emoji: '🏋️' },
    nature: { ar: 'طبيعة', en: 'Nature', emoji: '🌿' },
    business: { ar: 'تجارة', en: 'Business', emoji: '💰' },
    general: { ar: 'عام', en: 'General', emoji: '🌐' },
  };

  const selectedIcon = CATEGORY_ICONS.find(icon => icon.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-11 px-4 rounded-xl border transition-all duration-200 flex items-center gap-3",
          isOpen
            ? 'border-gray-400 ring-2 ring-gray-300/30 bg-white dark:bg-slate-800'
            : 'border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-slate-900/50 hover:border-gray-400'
        )}
      >
        {selectedIcon ? (
          <>
            <span className="text-2xl leading-none">{selectedIcon.label}</span>
            <span className="flex-1 text-start text-sm font-medium text-slate-700 dark:text-slate-300">
              {selectedIcon.name}
            </span>
          </>
        ) : (
          <span className="flex-1 text-start text-sm text-slate-400">
            {lang === "ar" ? "اختر أيقونة..." : "Select icon..."}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 rounded-xl border border-gray-300 dark:border-gray-600 shadow-2xl overflow-hidden z-50">
          <div className="sticky top-0 bg-white dark:bg-slate-800 p-3 border-b border-gray-300 dark:border-gray-600">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن أيقونة..." : "Search icons..."}
                className="pl-9 h-9 rounded-lg border border-gray-300 dark:border-gray-600 bg-slate-50/50 dark:bg-slate-900/50 text-sm"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[320px] overflow-y-auto p-2 space-y-1.5">
            {Object.entries(groupedIcons).length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-sm">{lang === "ar" ? "لا نتائج" : "No results"}</p>
              </div>
            ) : (
              Object.entries(groupedIcons).map(([category, icons]) => {
                const catInfo = categoryNames[category] || categoryNames.general;
                return (
                  <div key={category}>
                    <div className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{catInfo.emoji}</span>
                      <span>{lang === "ar" ? catInfo.ar : catInfo.en}</span>
                      <span className="text-[10px] text-slate-300">({icons.length})</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                      {icons.map((icon) => {
                        const isSelected = value === icon.value;
                        return (
                          <button
                            key={icon.value}
                            onClick={() => {
                              onChange(icon.value);
                              setIsOpen(false);
                            }}
                            className={cn(
                              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                              isSelected
                                ? 'bg-gray-200/50 dark:bg-gray-700/50 text-slate-800 ring-1 ring-gray-400'
                                : 'hover:bg-gray-100/70 dark:hover:bg-gray-700/50 text-slate-700'
                            )}
                          >
                            <span className="text-xl leading-none">{icon.label}</span>
                            <span className="flex-1 text-start truncate">{icon.name}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// 🏠 المكون الرئيسي
// ============================================================
export function CategoriesAdmin() {
  const app = useApp();
  const isRTL = app.lang === 'ar';
  const { data: categories = [], isLoading, refetch } = useCategories();
  const save = useSaveCategory();
  const del = useDeleteCategory();
  
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [iconSearchTerm, setIconSearchTerm] = useState("");
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  // ✅ التصنيفات الرئيسية
  const mainCategories = useMemo(() => {
    return categories.filter((c: any) => !c.parent_id);
  }, [categories]);

  // ✅ خريطة الأبناء
  const childrenMap = useMemo(() => {
    const map: Record<string, any[]> = {};
    categories.forEach((c: any) => {
      if (c.parent_id) {
        if (!map[c.parent_id]) map[c.parent_id] = [];
        map[c.parent_id].push(c);
      }
    });
    return map;
  }, [categories]);

  // ✅ القائمة المسطحة
  const displayedCategories = useMemo(() => {
    const result: any[] = [];
    
    const sortedMain = [...mainCategories].sort((a: any, b: any) => 
      (a.sort_order || 0) - (b.sort_order || 0)
    );
    
    sortedMain.forEach((parent: any) => {
      const children = childrenMap[parent.id] || [];
      result.push({ 
        ...parent, 
        _isChild: false, 
        _parentName: null,
        _childrenCount: children.length,
        _isExpanded: expandedParents.has(parent.id),
      });
      
      if (expandedParents.has(parent.id)) {
        const sortedChildren = [...children].sort((a: any, b: any) =>
          (a.sort_order || 0) - (b.sort_order || 0)
        );
        
        sortedChildren.forEach((child: any) => {
          result.push({ 
            ...child, 
            _isChild: true, 
            _parentName: isRTL ? parent.name_ar : parent.name_en,
            _childrenCount: 0,
            _isExpanded: false,
          });
        });
      }
    });
    
    return result;
  }, [mainCategories, childrenMap, expandedParents, isRTL]);

  // ✅ فلترة
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return displayedCategories;
    
    const q = searchQuery.toLowerCase().trim();
    return displayedCategories.filter((c: any) =>
      c.name_ar?.toLowerCase().includes(q) ||
      c.name_en?.toLowerCase().includes(q) ||
      c.slug?.toLowerCase().includes(q)
    );
  }, [displayedCategories, searchQuery]);

  // ✅ إحصائيات
  const stats = {
    total: categories.length,
    main: mainCategories.length,
    sub: categories.filter((c: any) => c.parent_id).length,
    active: categories.filter((c: any) => c.active !== false).length,
    hidden: categories.filter((c: any) => c.active === false).length,
    featured: categories.filter((c: any) => c.is_featured === true).length,
  };

  // ✅ تبديل التوسيع
  function toggleExpand(parentId: string) {
    setExpandedParents(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
  }

  // ============================================================
  // ✅ دوال فتح النوافذ
  // ============================================================

  // ✅ تصنيف رئيسي جديد (من الـ Header) — parent_id مُقفل على null
  function openNewMain() {
    setEditing({
      slug: "",
      name_ar: "",
      name_en: "",
      icon: "",
      sort_order: mainCategories.length + 1,
      active: true,
      image_url: "",
      is_featured: false,
      featured_sort: 0,
      parent_id: null,
      _lockParent: true,
      _mode: "add-main",
    });
    setIconSearchTerm("");
  }

  // ✅ تصنيف فرعي جديد (من الـ Header) — الأب قابل للاختيار
  function openNewSubFromHeader() {
    if (mainCategories.length === 0) {
      toast.error(isRTL ? "⚠️ أضف تصنيفاً رئيسياً أولاً" : "⚠️ Add a main category first");
      return;
    }
    
    setEditing({
      slug: "",
      name_ar: "",
      name_en: "",
      icon: "",
      sort_order: 1,
      active: true,
      image_url: "",
      is_featured: false,
      featured_sort: 0,
      parent_id: null,
      _lockParent: false,
      _mode: "add-sub-from-header",
    });
    setIconSearchTerm("");
  }

  // ✅ إضافة فرعي من زر الجدول — الأب مُقفل تلقائياً
  function openNewSubFromRow(parentCategory: any) {
    const siblings = childrenMap[parentCategory.id] || [];
    
    setEditing({
      slug: "",
      name_ar: "",
      name_en: "",
      icon: "",
      sort_order: siblings.length + 1,
      active: true,
      image_url: "",
      is_featured: false,
      featured_sort: 0,
      parent_id: parentCategory.id,
      _lockParent: true,
      _mode: "add-sub-from-row",
    });
    setIconSearchTerm("");
    setExpandedParents(prev => new Set(prev).add(parentCategory.id));
  }

  // ============================================================
  // ✅ دوال مساعدة
  // ============================================================

  // ✅ تفعيل/إلغاء المميز
  async function handleToggleFeatured(category: any) {
    try {
      const newValue = !category.is_featured;
      let newSort = 0;
      if (newValue) {
        const featuredCount = categories.filter((c: any) => c.is_featured).length;
        newSort = featuredCount + 1;
      }
      
      const { error } = await supabase
        .from('categories')
        .update({ 
          is_featured: newValue,
          featured_sort: newSort
        })
        .eq('id', category.id);
      
      if (error) throw error;
      
      refetch();
      toast.success(
        newValue 
          ? (isRTL ? "✅ تم التفعيل" : "✅ Activated") 
          : (isRTL ? "✅ تم الإلغاء" : "✅ Deactivated")
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error(isRTL ? "❌ فشل التحديث" : "❌ Failed");
    }
  }

  // ✅ حفظ التصنيف
  async function handleSave() {
    if (!editing?.slug || !editing?.name_ar || !editing?.name_en) {
      toast.error(isRTL ? "الحقول الأساسية مطلوبة" : "Required fields missing");
      return;
    }

    // ✅ تحقق خاص للتصنيف الفرعي من Header
    if (editing._mode === "add-sub-from-header" && !editing.parent_id) {
      toast.error(isRTL ? "⚠️ اختر التصنيف الأب" : "⚠️ Select parent category");
      return;
    }

    // ✅ منع التصنيف أن يكون أباً لنفسه
    if (editing.parent_id && editing.parent_id === editing.id) {
      toast.error(isRTL ? "❌ لا يمكن أن يكون التصنيف أباً لنفسه" : "❌ Cannot be its own parent");
      return;
    }

    // ✅ ✅ ✅ حذف الحقول المساعدة قبل الحفظ
    const { _lockParent, _mode, _isChild, _parentName, _childrenCount, _isExpanded, ...cleanData } = editing;

    const dataToSave = {
      ...cleanData,
      level: cleanData.parent_id ? 1 : 0,
    };

    try {
      await save.mutateAsync(dataToSave);
      toast.success(
        cleanData.parent_id
          ? (isRTL ? "✅ تم حفظ التصنيف الفرعي" : "✅ Subcategory saved")
          : (isRTL ? "✅ تم حفظ التصنيف الرئيسي" : "✅ Main category saved")
      );
      
      if (cleanData.parent_id) {
        setExpandedParents(prev => new Set(prev).add(cleanData.parent_id));
      }
      
      setEditing(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  // ✅ فتح نافذة الحذف
  function openDeleteDialog(category: any) {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  }

  // ✅ تنفيذ الحذف
  async function handleDelete() {
    if (!categoryToDelete) return;
    try {
      await del.mutateAsync(categoryToDelete.id);
      toast.success(isRTL ? "✅ تم الحذف" : "✅ Deleted");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  // ✅ حالة التحميل
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
        <p className="text-sm text-slate-500 animate-pulse">
          {isRTL ? "⏳ جاري التحميل..." : "⏳ Loading..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* ============================================================ */}
      {/* HEADER */}
      {/* ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent">
              {isRTL ? "التصنيفات" : "Categories"}
            </span>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
              {isRTL ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
              <Folder className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-[#2a655f] font-medium">{stats.main}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "رئيسي" : "main"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#d81b60]/10 border border-[#d81b60]/20">
              <FolderTree className="h-3.5 w-3.5 text-[#d81b60]" />
              <span className="text-[#d81b60] font-medium">{stats.sub}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "فرعي" : "sub"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/50">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.featured}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "مميز" : "featured"}</span>
            </span>
          </p>
        </div>

        {/* ✅ زرّان منفصلان */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={openNewMain}
            className="rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0"
          >
            <Folder className="h-4 w-4 mr-1.5 group-hover:rotate-6 transition-transform duration-300" />
            {isRTL ? "تصنيف رئيسي" : "Main Category"}
          </Button>

          <Button
            onClick={openNewSubFromHeader}
            className="rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0"
          >
            <FolderTree className="h-4 w-4 mr-1.5 group-hover:rotate-6 transition-transform duration-300" />
            {isRTL ? "تصنيف فرعي" : "Subcategory"}
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* STATS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard 
          label={isRTL ? 'الإجمالي' : 'Total'} 
          value={stats.total} 
          icon={FolderOpen}
          gradient="from-[#2a655f] to-[#1a4f4a]"
        />
        <StatCard 
          label={isRTL ? 'رئيسي' : 'Main'} 
          value={stats.main} 
          icon={Folder}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard 
          label={isRTL ? 'فرعي' : 'Sub'} 
          value={stats.sub} 
          icon={FolderTree}
          gradient="from-[#d81b60] to-[#f9a8d4]"
        />
        <StatCard 
          label={isRTL ? 'مميز' : 'Featured'} 
          value={stats.featured} 
          icon={Star}
          gradient="from-yellow-500 to-amber-500"
        />
      </div>

      {/* ============================================================ */}
      {/* SEARCH */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#2a655f] transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "🔍 بحث عن تصنيف..." : "🔍 Search categories..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e293b] focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/60`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-slate-400 hover:text-[#2a655f] transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSearchQuery("")}
          className="h-10 rounded-xl border border-gray-300 dark:border-gray-600 text-slate-600 hover:bg-gray-100/70 transition-all duration-300"
        >
          <X className="h-4 w-4 mr-1.5" />
          {isRTL ? "مسح" : "Clear"}
        </Button>
      </div>

      {/* ============================================================ */}
      {/* TABLE */}
      {/* ============================================================ */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[300px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <FolderTree className="h-3.5 w-3.5" />
                    {isRTL ? "التصنيف" : "Category"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Hash className="h-3.5 w-3.5" />
                    Slug
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Layers className="h-3.5 w-3.5" />
                    {isRTL ? "المستوى" : "Level"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[80px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <GripVertical className="h-3.5 w-3.5" />
                    {isRTL ? "الترتيب" : "Order"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    {isRTL ? "الحالة" : "Status"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Star className="h-3.5 w-3.5" />
                    {isRTL ? "مميز" : "Featured"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[220px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 animate-pulse" />
                    {isRTL ? "إجراءات" : "Actions"}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow">
                        <FolderOpen className="h-8 w-8 text-[#2a655f]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {isRTL ? "لا توجد تصنيفات" : "No categories"}
                      </p>
                      <Button
                        onClick={openNewMain}
                        className="mt-2 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg transition-all duration-300 hover:scale-105 border-0"
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        {isRTL ? "إضافة تصنيف" : "Add Category"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((c: any) => {
                  const isFeatured = c.is_featured === true;
                  const isChild = c._isChild === true;
                  const hasChildren = c._childrenCount > 0;
                  const isExpanded = c._isExpanded;
                  
                  return (
                    <TableRow 
                      key={c.id} 
                      className={cn(
                        "border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60",
                        isFeatured && !isChild && "bg-yellow-50/30 dark:bg-yellow-950/10",
                        isChild && "bg-[#f9a8d4]/5 dark:bg-[#d81b60]/5"
                      )}
                    >
                      {/* ✅ عمود التصنيف */}
                      <TableCell className="border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        <div className={cn("flex items-center gap-2", isChild && "ps-6")}>
                          
                          {/* ✅ زر توسيع */}
                          {!isChild && hasChildren ? (
                            <button
                              onClick={() => toggleExpand(c.id)}
                              className={cn(
                                "h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0",
                                isExpanded
                                  ? "bg-[#2a655f]/15 text-[#2a655f] rotate-90"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-[#2a655f]/10 hover:text-[#2a655f]"
                              )}
                              title={isRTL ? (isExpanded ? "طي" : "عرض") : (isExpanded ? "Collapse" : "Expand")}
                            >
                              <ChevronRight className="h-4 w-4 transition-transform duration-300" />
                            </button>
                          ) : !isChild && !hasChildren ? (
                            <div className="h-7 w-7 flex-shrink-0" />
                          ) : null}
                          
                          {/* ✅ سهم للفرع */}
                          {isChild && (
                            <CornerDownRight className="h-4 w-4 text-[#d81b60] flex-shrink-0 -ms-2" />
                          )}
                          
                          {/* ✅ صورة التصنيف */}
                          {c.image_url ? (
                            <img
                              src={c.image_url}
                              className={cn(
                                "rounded-xl object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#2a655f]/60 group-hover:scale-105 transition-all duration-300 shadow-md flex-shrink-0",
                                isChild ? "h-10 w-10" : "h-14 w-14"
                              )}
                              alt=""
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className={cn(
                              "rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-all duration-300 border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#2a655f]/60",
                              isChild ? "h-10 w-10" : "h-14 w-14"
                            )}>
                              <span className={isChild ? "text-xl" : "text-3xl"}>
                                {getIconEmoji(c.icon)}
                              </span>
                            </div>
                          )}
                          
                          {/* ✅ الاسم والمعلومات */}
                          <div className="min-w-0 flex-1">
                            <div className={cn(
                              "font-semibold flex items-center gap-2 group-hover:text-[#2a655f] transition-colors duration-300",
                              isChild ? "text-sm text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                            )}>
                              <span className="truncate">{c.name_ar}</span>
                              {isFeatured && (
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500 flex-shrink-0" />
                              )}
                              {!isChild && hasChildren && (
                                <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px] flex-shrink-0">
                                  {c._childrenCount} {isRTL ? "فرعي" : "sub"}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.name_en}</div>
                            
                            {isChild && c._parentName && (
                              <div className="text-[10px] text-[#d81b60] flex items-center gap-1 mt-0.5">
                                <Folder className="h-2.5 w-2.5" />
                                {isRTL ? "تابع لـ:" : "Under:"} <span className="font-medium">{c._parentName}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* Slug */}
                      <TableCell dir="ltr" className="text-sm text-slate-500 text-center font-mono border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 text-[10px]">
                          {c.slug}
                        </Badge>
                      </TableCell>
                      
                      {/* المستوى */}
                      <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        {isChild ? (
                          <Badge className="bg-[#d81b60]/10 text-[#d81b60] dark:bg-[#d81b60]/20 dark:text-[#f48fb1] border-2 border-[#d81b60]/20">
                            <FolderTree className="h-3 w-3 mr-1" />
                            {isRTL ? "فرعي" : "Sub"}
                          </Badge>
                        ) : (
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] dark:bg-[#2a655f]/20 dark:text-[#3a8a82] border-2 border-[#2a655f]/20">
                            <Folder className="h-3 w-3 mr-1" />
                            {isRTL ? "رئيسي" : "Main"}
                          </Badge>
                        )}
                      </TableCell>
                      
                      {/* الترتيب */}
                      <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600">
                          #{c.sort_order}
                        </Badge>
                      </TableCell>
                      
                      {/* الحالة */}
                      <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        {c.active !== false ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {isRTL ? "نشط" : "Active"}
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-2 border-red-500/20">
                            <EyeOff className="h-3 w-3 mr-1" />
                            {isRTL ? "مخفي" : "Hidden"}
                          </Badge>
                        )}
                      </TableCell>
                      
                      {/* المميز */}
                      <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                        <Button
                          size="sm"
                          variant="outline"
                          className={cn(
                            "rounded-xl h-9 w-9 p-0 transition-all duration-300 hover:scale-110 border",
                            isFeatured
                              ? 'border-amber-400/60 bg-amber-50 dark:bg-amber-950/20 text-amber-600'
                              : 'border-gray-300 dark:border-gray-600 text-gray-400 hover:text-amber-500 hover:border-amber-400/40'
                          )}
                          onClick={() => handleToggleFeatured(c)}
                        >
                          <Star className={cn("h-4 w-4", isFeatured && "fill-yellow-400")} />
                        </Button>
                      </TableCell>
                      
                      {/* الإجراءات */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                          
                          {/* ✅ زر إضافة فرعي (للرئيسي فقط) */}
                          {!isChild && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-xl h-8 px-2.5 border-[#2a655f]/40 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f] transition-all duration-300 group/sub"
                              onClick={() => openNewSubFromRow(c)}
                              title={isRTL ? "إضافة تصنيف فرعي" : "Add subcategory"}
                            >
                              <Plus className="h-3.5 w-3.5 mr-1 group-hover/sub:rotate-90 transition-transform duration-300" />
                              <span className="text-[10px] font-medium">
                                {isRTL ? "إضافة فرعي" : "Add Sub"}
                              </span>
                            </Button>
                          )}
                          
                          {/* ✅ زر تعديل */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-[#2a655f]/10 hover:border-[#2a655f] hover:text-[#2a655f] transition-all duration-300"
                            onClick={() => {
                              setEditing({
                                ...c,
                                _lockParent: !isChild,
                                _mode: isChild ? "edit-sub" : "edit-main",
                              });
                              setIconSearchTerm("");
                            }}
                            title={isRTL ? "تعديل" : "Edit"}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>

                          {/* ✅ زر حذف */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl h-8 w-8 p-0 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-rose-500/10 hover:border-rose-400 hover:text-rose-600 transition-all duration-300"
                            onClick={() => openDeleteDialog(c)}
                            title={isRTL ? "حذف" : "Delete"}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10">
          <span className="flex items-center gap-2">
            <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600">
              {isRTL
                ? `عرض ${filteredCategories.length} من ${categories.length}`
                : `Showing ${filteredCategories.length} of ${categories.length}`}
            </Badge>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20">
              <Folder className="h-3 w-3 mr-1" />
              {stats.main} {isRTL ? "رئيسي" : "main"}
            </Badge>
            <Badge className="bg-[#d81b60]/10 text-[#d81b60] border-2 border-[#d81b60]/20">
              <FolderTree className="h-3 w-3 mr-1" />
              {stats.sub} {isRTL ? "فرعي" : "sub"}
            </Badge>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DIALOG: إنشاء/تعديل */}
      {/* ============================================================ */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-700/50 z-20 transition-all duration-300 border border-gray-300 dark:border-gray-600"
            onClick={() => setEditing(null)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </Button>

          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className={cn(
                  "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg border-2 border-pink-400/40",
                  editing?.parent_id 
                    ? "bg-gradient-to-br from-[#d81b60] to-[#f48fb1] shadow-[#d81b60]/20"
                    : "bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] shadow-[#2a655f]/20"
                )}>
                  {editing?.id ? (
                    <Pencil className="h-6 w-6 text-white" />
                  ) : editing?.parent_id ? (
                    <FolderTree className="h-6 w-6 text-white" />
                  ) : (
                    <Folder className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {editing?.id
                      ? isRTL ? "تعديل التصنيف" : "Edit Category"
                      : editing?.parent_id
                        ? isRTL ? "تصنيف فرعي جديد" : "New Subcategory"
                        : isRTL ? "تصنيف رئيسي جديد" : "New Main Category"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {editing?.id
                      ? isRTL ? "قم بتعديل بيانات التصنيف" : "Edit category details"
                      : editing?.parent_id
                        ? isRTL ? "أضف تصنيفاً فرعياً" : "Add a subcategory"
                        : isRTL ? "أضف تصنيفاً رئيسياً" : "Add a main category"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {editing && (
              <div className="grid gap-4 py-4">
                
                {/* ✅ ✅ ✅ قسم التصنيف الأب */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                    <Folder className="h-4 w-4" />
                    {isRTL ? "التصنيف الأب" : "Parent Category"}
                    <Badge variant="outline" className={cn(
                      "text-[10px] border-slate-200 dark:bg-slate-800 dark:text-slate-400",
                      editing._lockParent 
                        ? "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/30"
                        : "bg-slate-100 text-slate-600"
                    )}>
                      {editing._lockParent 
                        ? (isRTL ? "🔒 مُقفل" : "🔒 Locked")
                        : (isRTL ? "قابل للتعديل" : "Editable")
                      }
                    </Badge>
                  </Label>
                  
                  {/* ✅ إذا كان مُقفلاً → Info فقط */}
                  {editing._lockParent ? (
                    <div className="flex items-center gap-3 h-11 px-4 rounded-xl border-2 border-[#2a655f]/40 bg-[#2a655f]/5 dark:bg-[#2a655f]/10">
                      {editing.parent_id ? (
                        <>
                          <FolderTree className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                          <span className="text-sm font-medium text-[#2a655f] truncate">
                            {mainCategories.find((m: any) => m.id === editing.parent_id)?.name_ar || ""}
                          </span>
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] ml-auto">
                            🔒 {isRTL ? "مُقفل" : "Locked"}
                          </Badge>
                        </>
                      ) : (
                        <>
                          <Folder className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                          <span className="text-sm font-medium text-[#2a655f]">
                            {isRTL ? "🚫 بدون (تصنيف رئيسي)" : "🚫 None (Main)"}
                          </span>
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] ml-auto">
                            🔒 {isRTL ? "مُقفل" : "Locked"}
                          </Badge>
                        </>
                      )}
                    </div>
                  ) : (
                    /* ✅ الحالة العادية: dropdown مفتوح */
                    <Select 
                      value={editing.parent_id || "__none__"} 
                      onValueChange={(value) => {
                        setEditing({ 
                          ...editing, 
                          parent_id: value === "__none__" ? null : value 
                        });
                      }}
                    >
                      <SelectTrigger className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300">
                        <div className="flex items-center gap-2">
                          {editing.parent_id ? (
                            <FolderTree className="h-4 w-4 text-[#d81b60]" />
                          ) : (
                            <Folder className="h-4 w-4 text-[#2a655f]" />
                          )}
                          <SelectValue placeholder={isRTL ? "اختر..." : "Select..."} />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border border-gray-300 dark:border-gray-600 max-h-[300px]">
                        <SelectItem value="__none__" className="hover:bg-[#2a655f]/10 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Folder className="h-4 w-4 text-[#2a655f]" />
                            <span className="font-medium">
                              {isRTL ? "🚫 بدون (تصنيف رئيسي)" : "🚫 None (Main)"}
                            </span>
                          </div>
                        </SelectItem>
                        
                        {mainCategories
                          .filter((m: any) => m.id !== editing.id)
                          .map((main: any) => (
                            <SelectItem 
                              key={main.id} 
                              value={main.id}
                              className="hover:bg-[#d81b60]/10 cursor-pointer"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-base">{getIconEmoji(main.icon)}</span>
                                <span>{main.name_ar}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {/* ✅ Info تحت الحقل */}
                  <div className={cn(
                    "flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-300",
                    editing.parent_id
                      ? "bg-[#d81b60]/5 border-[#d81b60]/30"
                      : "bg-[#2a655f]/5 border-[#2a655f]/30"
                  )}>
                    <Info className={cn(
                      "h-4 w-4 flex-shrink-0",
                      editing.parent_id ? "text-[#d81b60]" : "text-[#2a655f]"
                    )} />
                    <span className={cn(
                      "text-xs font-medium",
                      editing.parent_id ? "text-[#d81b60]" : "text-[#2a655f]"
                    )}>
                      {editing._mode === "add-sub-from-row" && (isRTL ? "📌 إضافة فرعي تحت التصنيف المُحدَّد" : "📌 Add sub under selected parent")}
                      {editing._mode === "add-sub-from-header" && !editing.parent_id && (isRTL ? "⚠️ اختر التصنيف الأب للتصنيف الفرعي" : "⚠️ Select parent for the subcategory")}
                      {editing._mode === "add-sub-from-header" && editing.parent_id && (isRTL ? "📂 سيتم إنشاء تصنيف فرعي" : "📂 Will create a subcategory")}
                      {editing._mode === "add-main" && (isRTL ? "📁 سيتم إنشاء تصنيف رئيسي" : "📁 Will create a main category")}
                      {editing._mode === "edit-main" && (isRTL ? "📁 تعديل تصنيف رئيسي" : "📁 Edit main category")}
                      {editing._mode === "edit-sub" && (isRTL ? "📂 تعديل تصنيف فرعي" : "📂 Edit subcategory")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <span>📝</span>
                      {isRTL ? "الاسم بالعربية *" : "Arabic Name *"}
                    </Label>
                    <Input
                      value={editing.name_ar}
                      onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })}
                      placeholder={isRTL ? "مثلاً: أزياء" : "e.g. Fashion"}
                      className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <span>🌐</span>
                      {isRTL ? "الاسم بالإنكليزية *" : "English Name *"}
                    </Label>
                    <Input
                      value={editing.name_en}
                      onChange={(e) => setEditing({ ...editing, name_en: e.target.value })}
                      dir="ltr"
                      placeholder="e.g. Fashion"
                      className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                    <Hash className="h-4 w-4" />
                    Slug <span className="text-[#d81b60]">*</span>
                  </Label>
                  <Input
                    value={editing.slug}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                      })
                    }
                    dir="ltr"
                    placeholder="fashion"
                    className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {isRTL ? "الأيقونة" : "Icon"}
                    </Label>
                    <IconDropdown
                      value={editing.icon || ""}
                      onChange={(value: string) => setEditing({ ...editing, icon: value })}
                      lang={app.lang}
                      searchTerm={iconSearchTerm}
                      onSearchChange={setIconSearchTerm}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <GripVertical className="h-4 w-4" />
                      {isRTL ? "الترتيب" : "Sort Order"}
                    </Label>
                    <Input
                      type="number"
                      value={editing.sort_order ?? 0}
                      onChange={(e) =>
                        setEditing({ ...editing, sort_order: Number(e.target.value) })
                      }
                      className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    {isRTL ? "صورة التصنيف" : "Category Image"}
                  </Label>
                  <ImageInput
                    folder="uploads/categories"
                    value={editing.image_url || ""}
                    onChange={(value) => setEditing({ ...editing, image_url: value })}
                    userId={app.user?.id}
                    lang={app.lang}
                    label={isRTL ? "ارفع صورة" : "Upload image"}
                    hint={isRTL ? "صورة احترافية 1200×800" : "Professional image 1200×800"}
                    previewClassName="aspect-video h-auto rounded-xl border border-gray-300 dark:border-gray-600"
                  />
                </div>

                {/* ✅ تحكم المميز - فقط للرئيسي */}
                {!editing.parent_id && (
                  <>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                      <label className="flex items-center gap-3 text-sm font-medium text-[#2a655f] dark:text-slate-300 cursor-pointer p-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:border-[#2a655f]/60 transition-all duration-300">
                        <input
                          type="checkbox"
                          checked={editing.is_featured ?? false}
                          onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 accent-yellow-500"
                        />
                        <span className="flex items-center gap-2">
                          <Star className={cn("h-4 w-4", editing.is_featured ? 'text-yellow-500 fill-yellow-400' : 'text-slate-400')} />
                          {isRTL ? "تصنيف مميز (يظهر في الرئيسية)" : "Featured Category (Homepage)"}
                        </span>
                      </label>
                      
                      {editing.is_featured && (
                        <div className="mt-3 p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border-2 border-yellow-200/50 dark:border-yellow-800/30">
                          <Label className="text-sm font-medium flex items-center gap-2 text-[#2a655f]">
                            <GripVertical className="h-4 w-4" />
                            {isRTL ? "ترتيب المميز" : "Featured Order"}
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={editing.featured_sort ?? 0}
                            onChange={(e) => setEditing({ ...editing, featured_sort: Number(e.target.value) })}
                            className="mt-1.5 rounded-xl border-yellow-200/50 bg-white/50 dark:border-yellow-800/30 dark:bg-slate-900/50"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                <label className="flex items-center gap-3 text-sm font-medium text-[#2a655f] dark:text-slate-300 cursor-pointer p-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:border-[#2a655f]/60 transition-all duration-300">
                  <input
                    type="checkbox"
                    checked={editing.active ?? true}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 accent-[#2a655f]"
                  />
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[#2a655f]" />
                    {isRTL ? "مفعّل ويظهر للجميع" : "Active & visible"}
                  </span>
                </label>
              </div>
            )}

            <DialogFooter className="gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
              <Button
                variant="outline"
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100/70 text-slate-600 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1" />
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={save.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0"
              >
                {save.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRTL ? "جاري الحفظ..." : "Saving..."}
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    {isRTL ? "حفظ" : "Save"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================ */}
      {/* DIALOG: تأكيد الحذف */}
      {/* ============================================================ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-100/70 z-20 border border-gray-300 dark:border-gray-600"
            onClick={() => setDeleteDialogOpen(false)}
          >
            <X className="h-4 w-4 text-slate-400" />
          </Button>

          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {isRTL ? "حذف التصنيف" : "Delete Category"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isRTL ? "لا يمكن التراجع عن هذا الإجراء" : "This action cannot be undone"}
                </DialogDescription>
              </div>
            </div>

            <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border-2 border-rose-200/50 dark:border-rose-800/30 mb-4">
              <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                {isRTL
                  ? `هل أنت متأكد من حذف "${categoryToDelete?.name_ar}"؟`
                  : `Delete "${categoryToDelete?.name_en}"?`}
              </p>
            </div>

            {categoryToDelete && childrenMap[categoryToDelete.id]?.length > 0 && (
              <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-amber-200/50 dark:border-amber-800/30 mb-4">
                <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>
                    {isRTL 
                      ? `⚠️ لهذا التصنيف ${childrenMap[categoryToDelete.id].length} تصنيف فرعي`
                      : `⚠️ This has ${childrenMap[categoryToDelete.id].length} subcategories`}
                  </span>
                </p>
              </div>
            )}

            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100/70 text-slate-600 transition-all duration-300"
              >
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 border-0"
              >
                {del.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRTL ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    {isRTL ? "تأكيد الحذف" : "Confirm Delete"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default CategoriesAdmin;