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
  Layers, Sparkles, AlertTriangle, X, 
  CheckCircle2, FolderOpen, Tag, Hash, Globe,
  ChevronDown, Check, Star, StarOff, GripVertical
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// ============================================================
// 📦 قائمة الأيقونات الكاملة للتصنيفات (مثل نون وأمازون)
// ============================================================
const CATEGORY_ICONS = [
  // 📱 إلكترونيات وتقنية
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
  { value: 'printer', label: '🖨️', name: 'Printer', category: 'electronics' },
  { value: 'router', label: '📶', name: 'Router', category: 'electronics' },
  { value: 'battery', label: '🔋', name: 'Battery', category: 'electronics' },
  { value: 'chip', label: '💠', name: 'Chip', category: 'electronics' },
  
  // 👕 أزياء وموضة
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
  { value: 'makeup', label: '💄', name: 'Makeup', category: 'fashion' },
  { value: 'scarf', label: '🧣', name: 'Scarf', category: 'fashion' },
  { value: 'belt', label: '🔗', name: 'Belt', category: 'fashion' },
  { value: 'socks', label: '🧦', name: 'Socks', category: 'fashion' },
  { value: 'tie', label: '👔', name: 'Tie', category: 'fashion' },
  
  // 🏠 منزل ومطبخ
  { value: 'home', label: '🏠', name: 'Home', category: 'home' },
  { value: 'furniture', label: '🛋️', name: 'Furniture', category: 'home' },
  { value: 'bed', label: '🛏️', name: 'Bed', category: 'home' },
  { value: 'kitchen', label: '🍳', name: 'Kitchen', category: 'home' },
  { value: 'fridge', label: '🧊', name: 'Fridge', category: 'home' },
  { value: 'washing', label: '🧺', name: 'Washing Machine', category: 'home' },
  { value: 'ac', label: '❄️', name: 'Air Conditioner', category: 'home' },
  { value: 'heater', label: '🔥', name: 'Heater', category: 'home' },
  { value: 'lamp', label: '💡', name: 'Lamp', category: 'home' },
  { value: 'tools', label: '🔧', name: 'Tools', category: 'home' },
  { value: 'vacuum', label: '🧹', name: 'Vacuum', category: 'home' },
  { value: 'iron', label: '🧺', name: 'Iron', category: 'home' },
  { value: 'fan', label: '🌀', name: 'Fan', category: 'home' },
  { value: 'mirror', label: '🪞', name: 'Mirror', category: 'home' },
  { value: 'clock', label: '🕐', name: 'Clock', category: 'home' },
  
  // 📚 كتب وقرطاسية
  { value: 'book', label: '📚', name: 'Book', category: 'books' },
  { value: 'magazine', label: '📰', name: 'Magazine', category: 'books' },
  { value: 'notebook', label: '📓', name: 'Notebook', category: 'books' },
  { value: 'pen', label: '🖊️', name: 'Pen', category: 'books' },
  { value: 'pencil', label: '✏️', name: 'Pencil', category: 'books' },
  { value: 'art', label: '🎨', name: 'Art', category: 'books' },
  { value: 'music', label: '🎵', name: 'Music', category: 'books' },
  { value: 'paper', label: '📄', name: 'Paper', category: 'books' },
  { value: 'ruler', label: '📏', name: 'Ruler', category: 'books' },
  
  // 🎮 ألعاب وترفيه
  { value: 'toys', label: '🧸', name: 'Toys', category: 'toys' },
  { value: 'puzzle', label: '🧩', name: 'Puzzle', category: 'toys' },
  { value: 'ball', label: '⚽', name: 'Ball', category: 'sports' },
  { value: 'bike', label: '🚲', name: 'Bike', category: 'sports' },
  { value: 'swim', label: '🏊', name: 'Swimming', category: 'sports' },
  { value: 'skateboard', label: '🛹', name: 'Skateboard', category: 'sports' },
  { value: 'dumbbell', label: '🏋️', name: 'Dumbbell', category: 'sports' },
  
  // 🍕 طعام ومشروبات
  { value: 'food', label: '🍕', name: 'Food', category: 'food' },
  { value: 'pizza', label: '🍕', name: 'Pizza', category: 'food' },
  { value: 'burger', label: '🍔', name: 'Burger', category: 'food' },
  { value: 'coffee', label: '☕', name: 'Coffee', category: 'food' },
  { value: 'tea', label: '🍵', name: 'Tea', category: 'food' },
  { value: 'juice', label: '🧃', name: 'Juice', category: 'food' },
  { value: 'cake', label: '🎂', name: 'Cake', category: 'food' },
  { value: 'icecream', label: '🍦', name: 'Ice Cream', category: 'food' },
  { value: 'pasta', label: '🍝', name: 'Pasta', category: 'food' },
  { value: 'sushi', label: '🍣', name: 'Sushi', category: 'food' },
  
  // 🏥 صحة وجمال
  { value: 'health', label: '🏥', name: 'Health', category: 'health' },
  { value: 'medicine', label: '💊', name: 'Medicine', category: 'health' },
  { value: 'stethoscope', label: '🩺', name: 'Stethoscope', category: 'health' },
  { value: 'spa', label: '🧖', name: 'Spa', category: 'health' },
  { value: 'toothbrush', label: '🪥', name: 'Toothbrush', category: 'health' },
  { value: 'soap', label: '🧼', name: 'Soap', category: 'health' },
  
  // 🚗 سيارات ومواصلات
  { value: 'car', label: '🚗', name: 'Car', category: 'vehicles' },
  { value: 'truck', label: '🚚', name: 'Truck', category: 'vehicles' },
  { value: 'motorcycle', label: '🏍️', name: 'Motorcycle', category: 'vehicles' },
  { value: 'plane', label: '✈️', name: 'Plane', category: 'vehicles' },
  { value: 'ship', label: '🚢', name: 'Ship', category: 'vehicles' },
  { value: 'train', label: '🚆', name: 'Train', category: 'vehicles' },
  
  // 🏢 خدمات وأعمال
  { value: 'office', label: '🏢', name: 'Office', category: 'services' },
  { value: 'bank', label: '🏦', name: 'Bank', category: 'services' },
  { value: 'shop', label: '🏪', name: 'Shop', category: 'services' },
  { value: 'restaurant', label: '🍽️', name: 'Restaurant', category: 'services' },
  { value: 'hotel', label: '🏨', name: 'Hotel', category: 'services' },
  { value: 'school', label: '🏫', name: 'School', category: 'services' },
  { value: 'mosque', label: '🕌', name: 'Mosque', category: 'services' },
  { value: 'church', label: '⛪', name: 'Church', category: 'services' },
  
  // 🎯 رياضة ولياقة
  { value: 'sports', label: '🏋️', name: 'Sports', category: 'sports' },
  { value: 'yoga', label: '🧘', name: 'Yoga', category: 'sports' },
  { value: 'running', label: '🏃', name: 'Running', category: 'sports' },
  { value: 'basketball', label: '🏀', name: 'Basketball', category: 'sports' },
  { value: 'football', label: '⚽', name: 'Football', category: 'sports' },
  { value: 'tennis', label: '🎾', name: 'Tennis', category: 'sports' },
  { value: 'golf', label: '⛳', name: 'Golf', category: 'sports' },
  
  // 🌿 طبيعة وحيوانات
  { value: 'nature', label: '🌿', name: 'Nature', category: 'nature' },
  { value: 'flower', label: '🌸', name: 'Flower', category: 'nature' },
  { value: 'tree', label: '🌳', name: 'Tree', category: 'nature' },
  { value: 'mountain', label: '🏔️', name: 'Mountain', category: 'nature' },
  { value: 'beach', label: '🏖️', name: 'Beach', category: 'nature' },
  { value: 'sun', label: '☀️', name: 'Sun', category: 'nature' },
  { value: 'moon', label: '🌙', name: 'Moon', category: 'nature' },
  { value: 'star', label: '⭐', name: 'Star', category: 'nature' },
  { value: 'animal', label: '🐾', name: 'Animal', category: 'nature' },
  { value: 'cat', label: '🐱', name: 'Cat', category: 'nature' },
  { value: 'dog', label: '🐶', name: 'Dog', category: 'nature' },
  { value: 'bird', label: '🐦', name: 'Bird', category: 'nature' },
  
  // 💰 اقتصاد وتجارة
  { value: 'money', label: '💰', name: 'Money', category: 'business' },
  { value: 'credit', label: '💳', name: 'Credit Card', category: 'business' },
  { value: 'gift', label: '🎁', name: 'Gift', category: 'business' },
  { value: 'discount', label: '🏷️', name: 'Discount', category: 'business' },
  { value: 'barcode', label: '📱', name: 'Barcode', category: 'business' },
  
  // 🌐 عام
  { value: 'globe', label: '🌍', name: 'Globe', category: 'general' },
  { value: 'location', label: '📍', name: 'Location', category: 'general' },
  { value: 'calendar', label: '📅', name: 'Calendar', category: 'general' },
  { value: 'bell', label: '🔔', name: 'Bell', category: 'general' },
  { value: 'email', label: '📧', name: 'Email', category: 'general' },
  { value: 'phone', label: '📞', name: 'Phone', category: 'general' },
  { value: 'chat', label: '💬', name: 'Chat', category: 'general' },
  { value: 'user', label: '👤', name: 'User', category: 'general' },
  { value: 'group', label: '👥', name: 'Group', category: 'general' },
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

// ✅ دالة للحصول على الـ Emoji من الـ value
const getIconEmoji = (value: string) => {
  const found = CATEGORY_ICONS.find(icon => icon.value === value);
  return found?.label || '📦';
};

// ✅ دالة للحصول على اسم الأيقونة
const getIconName = (value: string) => {
  const found = CATEGORY_ICONS.find(icon => icon.value === value);
  return found?.name || 'Package';
};

// ✅ دالة للحصول على تصنيف الأيقونة
const getIconCategory = (value: string) => {
  const found = CATEGORY_ICONS.find(icon => icon.value === value);
  return found?.category || 'general';
};

// ============================================================
// 🎯 مكون Dropdown الأيقونات الاحترافي
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
      if (!groups[icon.category]) {
        groups[icon.category] = [];
      }
      groups[icon.category].push(icon);
    });
    return groups;
  }, [filteredIcons]);

  const categoryNames: Record<string, { ar: string, en: string, emoji: string }> = {
    electronics: { ar: 'إلكترونيات', en: 'Electronics', emoji: '📱' },
    fashion: { ar: 'أزياء وموضة', en: 'Fashion', emoji: '👕' },
    home: { ar: 'منزل ومطبخ', en: 'Home', emoji: '🏠' },
    books: { ar: 'كتب وقرطاسية', en: 'Books', emoji: '📚' },
    toys: { ar: 'ألعاب وترفيه', en: 'Toys', emoji: '🎮' },
    food: { ar: 'طعام ومشروبات', en: 'Food', emoji: '🍕' },
    health: { ar: 'صحة وجمال', en: 'Health', emoji: '🏥' },
    vehicles: { ar: 'سيارات ومواصلات', en: 'Vehicles', emoji: '🚗' },
    services: { ar: 'خدمات وأعمال', en: 'Services', emoji: '🏢' },
    sports: { ar: 'رياضة ولياقة', en: 'Sports', emoji: '🏋️' },
    nature: { ar: 'طبيعة وحيوانات', en: 'Nature', emoji: '🌿' },
    business: { ar: 'اقتصاد وتجارة', en: 'Business', emoji: '💰' },
    general: { ar: 'عام', en: 'General', emoji: '🌐' },
  };

  const selectedIcon = CATEGORY_ICONS.find(icon => icon.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full h-11 px-4 rounded-xl border transition-all duration-200 flex items-center gap-3
          ${isOpen 
            ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-800' 
            : 'border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 hover:border-blue-400/50'
          }
        `}
      >
        {selectedIcon ? (
          <>
            <span className="text-2xl leading-none">{selectedIcon.label}</span>
            <span className="flex-1 text-start text-sm font-medium text-slate-700 dark:text-slate-300">
              {selectedIcon.name}
            </span>
            <span className="text-xs text-slate-400 font-mono">{selectedIcon.value}</span>
          </>
        ) : (
          <span className="flex-1 text-start text-sm text-slate-400">
            {lang === "ar" ? "اختر أيقونة..." : "Select icon..."}
          </span>
        )}
        <ChevronDown className={`
          h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0
          ${isOpen ? 'rotate-180' : ''}
        `} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          <div className="sticky top-0 bg-white dark:bg-slate-800 p-3 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={lang === "ar" ? "ابحث عن أيقونة..." : "Search icons..."}
                className="pl-9 h-9 rounded-lg border-slate-200/50 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 text-sm"
                autoFocus
              />
            </div>
            {searchTerm && (
              <div className="mt-1.5 text-xs text-slate-400">
                {lang === "ar" ? `تم العثور على ${filteredIcons.length} أيقونة` : `${filteredIcons.length} icons found`}
              </div>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto p-2 space-y-1.5">
            {Object.entries(groupedIcons).length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-sm">{lang === "ar" ? "لم نجد أيقونة تطابق بحثك" : "No icons match your search"}</p>
                <button
                  onClick={() => onSearchChange('')}
                  className="text-xs text-blue-500 hover:underline mt-1"
                >
                  {lang === "ar" ? "مسح البحث" : "Clear search"}
                </button>
              </div>
            ) : (
              Object.entries(groupedIcons).map(([category, icons]) => {
                const catInfo = categoryNames[category] || categoryNames.general;
                return (
                  <div key={category}>
                    <div className="px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{catInfo.emoji}</span>
                      <span>{lang === "ar" ? catInfo.ar : catInfo.en}</span>
                      <span className="text-[10px] text-slate-300 dark:text-slate-600">({icons.length})</span>
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
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-150
                              ${isSelected 
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-1 ring-blue-400/50' 
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                              }
                            `}
                          >
                            <span className="text-xl leading-none">{icon.label}</span>
                            <span className="flex-1 text-start truncate">{icon.name}</span>
                            {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />}
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
  const { data: categories = [], isLoading, refetch } = useCategories();
  const save = useSaveCategory();
  const del = useDeleteCategory();
  const [editing, setEditing] = useState<any | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [iconSearchTerm, setIconSearchTerm] = useState("");

  function openNew() {
    setEditing({
      slug: "",
      name_ar: "",
      name_en: "",
      icon: "",
      sort_order: categories.length,
      active: true,
      image_url: "",
      is_featured: false,
      featured_sort: 0,
    });
    setIconSearchTerm("");
  }

  // ✅ دالة لتفعيل/إلغاء التصنيف المميز
  async function handleToggleFeatured(category: any) {
    try {
      const newValue = !category.is_featured;
      
      // حساب الترتيب الجديد
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
          ? (app.lang === "ar" ? "✅ تم تفعيل التصنيف المميز" : "✅ Featured activated") 
          : (app.lang === "ar" ? "✅ تم إلغاء التصنيف المميز" : "✅ Featured deactivated")
      );
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error(app.lang === "ar" ? "❌ فشل التحديث" : "❌ Failed to update");
    }
  }

  // ✅ دالة لتحديث ترتيب التصنيفات المميزة
  async function handleUpdateFeaturedSort(categoryId: string, newSort: number) {
    if (newSort < 1) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({ featured_sort: newSort })
        .eq('id', categoryId);
      
      if (error) throw error;
      
      refetch();
      toast.success(app.lang === "ar" ? "✅ تم تحديث الترتيب" : "✅ Order updated");
    } catch (error) {
      console.error('Error updating featured sort:', error);
      toast.error(app.lang === "ar" ? "❌ فشل تحديث الترتيب" : "❌ Failed to update order");
    }
  }

  async function handleSave() {
    if (!editing?.slug || !editing?.name_ar || !editing?.name_en) {
      toast.error(app.lang === "ar" ? "الحقول الأساسية مطلوبة" : "Required fields missing");
      return;
    }
    try {
      await save.mutateAsync(editing);
      toast.success(app.lang === "ar" ? "✅ تم الحفظ بنجاح" : "✅ Saved successfully");
      setEditing(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  function openDeleteDialog(category: any) {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  }

  async function handleDelete() {
    if (!categoryToDelete) return;
    try {
      await del.mutateAsync(categoryToDelete.id);
      toast.success(app.lang === "ar" ? "✅ تم الحذف بنجاح" : "✅ Deleted successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  // ✅ فلترة التصنيفات
  const filteredCategories = categories.filter((c: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name_ar.toLowerCase().includes(q) ||
      c.name_en.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q)
    );
  });

  // ✅ إحصائيات
  const stats = {
    total: categories.length,
    active: categories.filter((c: any) => c.active !== false).length,
    hidden: categories.filter((c: any) => c.active === false).length,
    featured: categories.filter((c: any) => c.is_featured === true).length,
  };

  return (
    <div className="space-y-5">
      {/* ✅ Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="h-6 w-6 text-blue-600" />
            {app.lang === "ar" ? "إدارة التصنيفات" : "Categories"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {app.lang === "ar"
              ? `إدارة جميع تصنيفات السوق (${filteredCategories.length} من ${categories.length})`
              : `Manage all marketplace categories (${filteredCategories.length} of ${categories.length})`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-slate-200 dark:border-slate-700"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
          <Button
            onClick={openNew}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl transition rounded-xl"
          >
            <Plus className="h-4 w-4" />
            {app.lang === "ar" ? "تصنيف جديد" : "New Category"}
          </Button>
        </div>
      </div>

      {/* ✅ Stats Cards - إضافة بطاقة المميزة */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { 
            key: "total", 
            label: app.lang === "ar" ? "إجمالي التصنيفات" : "Total Categories", 
            value: stats.total,
            icon: FolderOpen,
            color: "text-blue-600",
            bg: "bg-blue-500/10"
          },
          { 
            key: "active", 
            label: app.lang === "ar" ? "نشطة" : "Active", 
            value: stats.active,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-500/10"
          },
          { 
            key: "hidden", 
            label: app.lang === "ar" ? "مخفية" : "Hidden", 
            value: stats.hidden,
            icon: X,
            color: "text-rose-600",
            bg: "bg-rose-500/10"
          },
          { 
            key: "featured", 
            label: app.lang === "ar" ? "مميزة" : "Featured", 
            value: stats.featured,
            icon: Star,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
          },
        ].map((stat) => (
          <div
            key={stat.key}
            className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={app.lang === "ar" ? "بحث عن تصنيف..." : "Search categories..."}
            className="ps-9 h-10 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        {searchQuery && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="h-10 rounded-xl border-slate-200 dark:border-slate-700"
          >
            <X className="h-4 w-4 mr-1.5" />
            {app.lang === "ar" ? "مسح البحث" : "Clear"}
          </Button>
        )}
      </div>

      {/* ✅ Table */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-slate-50/50 dark:bg-slate-800/30">
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-right min-w-[200px]">
                  {app.lang === "ar" ? "التصنيف" : "Category"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[120px]">
                  Slug
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[80px]">
                  {app.lang === "ar" ? "أيقونة" : "Icon"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[80px]">
                  {app.lang === "ar" ? "الترتيب" : "Order"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[100px]">
                  {app.lang === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[130px]">
                  {app.lang === "ar" ? "مميز" : "Featured"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400 text-center min-w-[150px]">
                  {app.lang === "ar" ? "إجراء" : "Action"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                      {app.lang === "ar" ? "جار التحميل..." : "Loading..."}
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && filteredCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                    <div className="flex flex-col items-center gap-2">
                      <FolderOpen className="h-12 w-12 text-slate-300" />
                      <p className="font-medium">{app.lang === "ar" ? "لا توجد تصنيفات" : "No categories"}</p>
                      <p className="text-sm">{app.lang === "ar" ? "أضف تصنيفاً جديداً لبدء التنظيم" : "Add a new category to start organizing"}</p>
                      <Button
                        onClick={openNew}
                        className="mt-2 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl"
                      >
                        <Plus className="h-4 w-4" />
                        {app.lang === "ar" ? "إضافة تصنيف" : "Add Category"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {filteredCategories.map((c: any) => {
                const isFeatured = c.is_featured === true;
                const featuredSort = c.featured_sort || 0;
                
                return (
                  <TableRow 
                    key={c.id} 
                    className={cn(
                      "border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition",
                      isFeatured && "bg-yellow-50/30 dark:bg-yellow-950/10"
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {c.image_url ? (
                          <img
                            src={c.image_url}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                            alt=""
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">{getIconEmoji(c.icon)}</span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {c.icon && <span className="text-xl">{getIconEmoji(c.icon)}</span>}
                            {c.name_ar}
                            {isFeatured && (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{c.name_en}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell dir="ltr" className="text-sm text-slate-500 text-center font-mono">
                      {c.slug}
                    </TableCell>
                    <TableCell className="text-center">
                      {c.icon ? (
                        <span className="text-2xl" title={`${getIconName(c.icon)} (${c.icon})`}>
                          {getIconEmoji(c.icon)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-900 dark:text-white text-center font-bold">
                      {c.sort_order}
                    </TableCell>
                    <TableCell className="text-center">
                      {c.active !== false ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          {app.lang === "ar" ? "نشط" : "Active"}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-slate-500">
                          <X className="h-3 w-3 mr-1" />
                          {app.lang === "ar" ? "مخفي" : "Hidden"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={cn(
                            "rounded-xl h-8 w-8 p-0 transition-all",
                            isFeatured 
                              ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50/50' 
                              : 'text-slate-300 hover:text-slate-500 hover:bg-slate-50/50'
                          )}
                          onClick={() => handleToggleFeatured(c)}
                          title={app.lang === "ar" ? (isFeatured ? "إلغاء المميز" : "تفعيل المميز") : (isFeatured ? "Remove featured" : "Add featured")}
                        >
                          {isFeatured ? (
                            <Star className="h-5 w-5 fill-yellow-400" />
                          ) : (
                            <Star className="h-5 w-5" />
                          )}
                        </Button>
                        
                        {isFeatured && (
                          <div className="flex items-center gap-0.5 ml-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-xl h-6 w-6 p-0 text-slate-400 hover:text-slate-600 text-xs"
                              onClick={() => handleUpdateFeaturedSort(c.id, featuredSort - 1)}
                              disabled={featuredSort <= 1}
                              title={app.lang === "ar" ? "رفع" : "Up"}
                            >
                              ↑
                            </Button>
                            <span className="text-xs font-mono text-slate-400 min-w-[16px] text-center">
                              {featuredSort}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-xl h-6 w-6 p-0 text-slate-400 hover:text-slate-600 text-xs"
                              onClick={() => handleUpdateFeaturedSort(c.id, featuredSort + 1)}
                              title={app.lang === "ar" ? "خفض" : "Down"}
                            >
                              ↓
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl h-8 px-2 text-blue-500 hover:text-blue-600 hover:bg-blue-50/50"
                          onClick={() => {
                            setEditing({ ...c });
                            setIconSearchTerm("");
                          }}
                          title={app.lang === "ar" ? "تعديل" : "Edit"}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-xl h-8 px-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50/50"
                          onClick={() => openDeleteDialog(c)}
                          title={app.lang === "ar" ? "حذف" : "Delete"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Footer */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            {app.lang === "ar"
              ? `عرض ${filteredCategories.length} من ${categories.length} تصنيف`
              : `Showing ${filteredCategories.length} of ${categories.length} categories`}
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
              <Layers className="h-3 w-3 mr-1" />
              {filteredCategories.length}
            </Badge>
            {searchQuery && (
              <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/30">
                🔍 {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Dialog للإضافة / التعديل */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-20"
            onClick={() => setEditing(null)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 p-6 rounded-t-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {editing?.id
                  ? app.lang === "ar"
                    ? "تعديل التصنيف"
                    : "Edit Category"
                  : app.lang === "ar"
                  ? "تصنيف جديد"
                  : "New Category"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {editing?.id
                  ? app.lang === "ar"
                    ? "قم بتعديل بيانات التصنيف"
                    : "Edit category details"
                  : app.lang === "ar"
                  ? "أضف تصنيفاً جديداً للقسم"
                  : "Add a new category"}
              </p>
            </DialogHeader>
          </div>

          {editing && (
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    {app.lang === "ar" ? "الاسم بالعربية" : "Arabic Name"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={editing.name_ar}
                    onChange={(e) => setEditing({ ...editing, name_ar: e.target.value })}
                    placeholder={app.lang === "ar" ? "مثلاً: أزياء" : "e.g. Fashion"}
                    className="mt-1.5 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    {app.lang === "ar" ? "الاسم بالإنكليزية" : "English Name"} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={editing.name_en}
                    onChange={(e) => setEditing({ ...editing, name_en: e.target.value })}
                    dir="ltr"
                    placeholder="e.g. Fashion"
                    className="mt-1.5 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">
                  Slug <span className="text-red-500">*</span>
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
                  className="mt-1.5 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {app.lang === "ar" ? "يستخدم في الرابط، أحرف صغيرة وشرطات فقط" : "Used in URL, lowercase letters and hyphens only"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    {app.lang === "ar" ? "الأيقونة" : "Icon"} 
                    <span className="text-xs text-slate-400 block font-normal">
                      {app.lang === "ar" ? "اختر أيقونة من القائمة المنسدلة" : "Select an icon from the dropdown"}
                    </span>
                  </Label>
                  <div className="mt-1.5">
                    <IconDropdown
                      value={editing.icon || ""}
                      onChange={(value: string) => setEditing({ ...editing, icon: value })}
                      lang={app.lang}
                      searchTerm={iconSearchTerm}
                      onSearchChange={setIconSearchTerm}
                    />
                    
                    {editing.icon && (
                      <div className="mt-2 flex items-center gap-3 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
                        <span className="text-3xl">{getIconEmoji(editing.icon)}</span>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {app.lang === "ar" ? "الأيقونة المختارة" : "Selected Icon"}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {getIconName(editing.icon)} 
                            <span className="text-slate-300 dark:text-slate-600 mx-1">·</span>
                            <span className="font-mono text-[10px]">{editing.icon}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    <Hash className="h-4 w-4 inline mr-1" />
                    {app.lang === "ar" ? "الترتيب" : "Sort Order"}
                  </Label>
                  <Input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, sort_order: Number(e.target.value) })
                    }
                    className="mt-1.5 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <ImageInput
                  folder="categories"
                  value={editing.image_url || ""}
                  onChange={(value) => setEditing({ ...editing, image_url: value })}
                  label={app.lang === "ar" ? "صورة التصنيف" : "Category Image"}
                  hint={app.lang === "ar" ? "ارفع صورة احترافية — الأبعاد المفضلة 1200×800" : "Upload a professional image — 1200×800 preferred"}
                  previewClassName="aspect-video h-auto rounded-xl"
                />
              </div>

              {/* ✅ تحكم التصنيف المميز */}
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <label className="flex items-center gap-3 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer p-3 rounded-xl border-2 border-slate-200/50 hover:border-yellow-500/30 transition-all">
                  <input
                    type="checkbox"
                    checked={editing.is_featured ?? false}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 accent-yellow-500"
                  />
                  <span className="flex items-center gap-2">
                    <Star className={`h-4 w-4 ${editing.is_featured ? 'text-yellow-500 fill-yellow-400' : 'text-slate-400'}`} />
                    {app.lang === "ar" ? "تصنيف مميز (يظهر في الصفحة الرئيسية)" : "Featured Category (appears on homepage)"}
                  </span>
                </label>
                
                {editing.is_featured && (
                  <div className="mt-3 p-3 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-slate-400" />
                      {app.lang === "ar" ? "ترتيب المميز" : "Featured Order"}
                      <span className="text-xs text-slate-400 font-normal">
                        ({app.lang === "ar" ? "الأقل أولاً" : "Lower is first"})
                      </span>
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      value={editing.featured_sort ?? 0}
                      onChange={(e) => setEditing({ ...editing, featured_sort: Number(e.target.value) })}
                      className="mt-1.5 rounded-xl border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {app.lang === "ar" ? "الرقم الأقل يظهر أولاً في قائمة التصنيفات المميزة" : "Lower numbers appear first in featured list"}
                    </p>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer p-3 rounded-xl border-2 border-slate-200/50 hover:border-blue-500/30 transition-all">
                <input
                  type="checkbox"
                  checked={editing.active ?? true}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                />
                <span className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-slate-400" />
                  {app.lang === "ar" ? "مفعّل ويظهر للجميع" : "Active & visible to everyone"}
                </span>
              </label>
            </div>
          )}

          <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 p-6 rounded-b-2xl">
            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={save.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all"
              >
                {save.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {app.lang === "ar" ? "جاري الحفظ..." : "Saving..."}
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 me-2" />
                    {app.lang === "ar" ? "حفظ" : "Save"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ Dialog للحذف */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-20"
            onClick={() => setDeleteDialogOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-red-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {app.lang === "ar" ? "حذف التصنيف" : "Delete Category"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {app.lang === "ar" ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                </DialogDescription>
              </div>
            </div>

            <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border border-rose-200/50 dark:border-rose-800/30 mb-4">
              <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                {app.lang === "ar"
                  ? `هل أنت متأكد من حذف التصنيف "${categoryToDelete?.name_ar}"؟`
                  : `Are you sure you want to delete "${categoryToDelete?.name_en}"?`}
              </p>
              {categoryToDelete && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-rose-200/50 dark:border-rose-800/30">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Tag className="h-4 w-4 text-slate-400" />
                    <span className="font-mono text-xs">{categoryToDelete.slug}</span>
                  </div>
                  {categoryToDelete.icon && (
                    <span className="text-2xl">{getIconEmoji(categoryToDelete.icon)}</span>
                  )}
                </div>
              )}
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-200/50 dark:border-amber-800/30">
              <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {app.lang === "ar"
                  ? "تحذير: حذف هذا التصنيف سيؤثر على المنتجات المرتبطة به"
                  : "Warning: Deleting this category will affect associated products"}
              </p>
            </div>

            <DialogFooter className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 transition-all"
              >
                {del.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {app.lang === "ar" ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 me-2" />
                    {app.lang === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}