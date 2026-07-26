// src/components/dashboard/admin/AdminDashboard.tsx
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Store, ShieldCheck, Image as ImageIcon, Megaphone, Tags,
  Search, X, Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApp, useT } from "@/lib/i18n";
import {
  useAllListingsAdmin,
  useAdminAllStores,
  useAllSellerApplications,
} from "@/lib/queries";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ===== استيراد المكونات المقسمة =====
import { AdminOverview } from "./AdminOverview";
import { AdminListings } from "./AdminListings";
import { AdminStores } from "./AdminStores";
import { SellerApplicationsAdmin } from "./SellerApplicationsAdmin";
import { BannersAdminPage } from "./BannersAdminPage";
import { AnnouncementsAdmin } from "./AnnouncementsAdmin";
import { CategoriesAdmin } from "./CategoriesAdmin";
import { AdminNotifications } from "./AdminNotifications";

interface AdminDashboardProps {
  notificationButton: React.ReactNode;
}

export function AdminDashboard({ notificationButton }: AdminDashboardProps) {
  const app = useApp();
  const [tab, setTab] = useState<
    "overview" | "listings" | "stores" | "applications" | "banners" | "announcements" | "categories" | "notifications"
  >("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResultsPage, setShowSearchResultsPage] = useState(false);

  const isRTL = app.lang === 'ar';

  // ===== فلترة البيانات حسب البحث =====
  const getFilteredData = (data: any[], searchFields: string[], searchTerm: string) => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase().trim();
    return data.filter((item: any) => {
      return searchFields.some(field => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(q);
      });
    });
  };

  // ===== جلب البيانات =====
  const { data: allListings = [] } = useAllListingsAdmin();
  const { data: allStores = [] } = useAdminAllStores();
  const { data: allApplications = [] } = useAllSellerApplications();

  // ===== فلترة المنتجات =====
  const filteredListings = useMemo(() => {
    return getFilteredData(allListings, ['title_ar', 'title_en', 'description_ar', 'description_en', 'id'], searchQuery);
  }, [allListings, searchQuery]);

  // ===== فلترة المتاجر =====
  const filteredStores = useMemo(() => {
    return getFilteredData(allStores, ['store_name', 'store_description', 'full_name', 'email', 'phone'], searchQuery);
  }, [allStores, searchQuery]);

  // ===== فلترة طلبات البائعين =====
  const filteredApplications = useMemo(() => {
    return getFilteredData(allApplications, ['store_name', 'store_description', 'user_id', 'id', 'status'], searchQuery);
  }, [allApplications, searchQuery]);

  // ===== حساب عدد النتائج في كل قسم =====
  const searchResults = useMemo(() => {
    return {
      products: filteredListings.length,
      stores: filteredStores.length,
      applications: filteredApplications.length,
      total: filteredListings.length + filteredStores.length + filteredApplications.length
    };
  }, [filteredListings, filteredStores, filteredApplications]);

  // ===== تحديد التبويب الأنسب للبحث =====
  const getBestTab = () => {
    const results = [
      { tab: 'listings', count: filteredListings.length, label: app.lang === 'ar' ? 'المنتجات' : 'Products' },
      { tab: 'stores', count: filteredStores.length, label: app.lang === 'ar' ? 'المتاجر' : 'Stores' },
      { tab: 'applications', count: filteredApplications.length, label: app.lang === 'ar' ? 'طلبات البائعين' : 'Applications' },
    ];
    results.sort((a, b) => b.count - a.count);
    return results[0];
  };

  // ===== دالة البحث =====
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowSearchResultsPage(true);
      const bestTab = getBestTab();
      if (bestTab.count > 0) {
        setTab(bestTab.tab as any);
      }
    }
  };

  // ===== مسح البحث =====
  const clearSearch = () => {
    setSearchQuery('');
    setShowSearchResultsPage(false);
  };

  // ===== عرض نتائج البحث =====
  const showSearchResults = searchQuery.trim().length > 0 && showSearchResultsPage;

  // ===== قائمة التبويب =====
const nav = [
  { id: "overview" as const, label: app.lang === 'ar' ? "نظرة عامة" : "Overview", icon: LayoutDashboard },
  { id: "listings" as const, label: app.lang === 'ar' ? "المنتجات" : "Products", icon: Package },
  { id: "stores" as const, label: app.lang === 'ar' ? "المتاجر" : "Stores", icon: Store },
  { id: "applications" as const, label: app.lang === 'ar' ? "طلبات البائعين" : "Seller applications", icon: ShieldCheck },
  { id: "banners" as const, label: app.lang === 'ar' ? "البنرات" : "Banners", icon: ImageIcon },
  { id: "announcements" as const, label: app.lang === 'ar' ? "شريط الإعلانات" : "Announcements", icon: Megaphone },
  { id: "categories" as const, label: app.lang === 'ar' ? "التصنيفات" : "Categories", icon: Tags },
  { id: "notifications" as const, label: app.lang === 'ar' ? "الإشعارات" : "Notifications", icon: Bell },
];
  return (
    <div className={`min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] ${isRTL ? 'font-arabic' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ===== TOP HEADER ===== */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg">
                {app.lang === 'ar' ? "لوحة الأدمن" : "Admin Panel"}
              </span>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="relative hidden md:block">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`} />
              <Input 
                placeholder={app.lang === 'ar' ? "بحث في لوحة التحكم..." : "Search dashboard..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} w-64 h-9 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-sm focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all`}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {notificationButton}
            <Avatar className="h-8 w-8 ring-2 ring-slate-200 dark:ring-slate-700">
              <AvatarFallback className="bg-[#2563eb] text-white text-xs">
                {app.user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* ===== المحتوى ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6 relative z-0">
        
        {/* ===== PAGE HEADER ===== */}
        <div className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {showSearchResults ? (
                <span className="flex items-center gap-3">
                  <span>{app.lang === 'ar' ? 'نتائج البحث' : 'Search Results'}</span>
                  <Badge className="bg-[#2563eb] text-white text-sm px-3 py-1">
                    {searchResults.total} {app.lang === 'ar' ? 'نتيجة' : 'results'}
                  </Badge>
                </span>
              ) : (
                nav.find(n => n.id === tab)?.label || (app.lang === 'ar' ? "نظرة عامة" : "Overview")
              )}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
              {showSearchResults ? (
                <span>
                  {app.lang === 'ar' ? `نتائج البحث عن "${searchQuery}"` : `Results for "${searchQuery}"`}
                </span>
              ) : (
                <span>{app.lang === 'ar' ? "مرحباً بعودتك" : "Welcome back"}, {app.user?.name || "Admin"}</span>
              )}
            </p>
          </div>
        </div>

        {/* ===== عرض نتائج البحث ===== */}
        {showSearchResults && (
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'listings', label: app.lang === 'ar' ? 'المنتجات' : 'Products', count: searchResults.products, icon: Package, color: 'text-[#db2777]', bg: 'bg-[#db2777]/10' },
                { key: 'stores', label: app.lang === 'ar' ? 'المتاجر' : 'Stores', count: searchResults.stores, icon: Store, color: 'text-[#059669]', bg: 'bg-[#059669]/10' },
                { key: 'applications', label: app.lang === 'ar' ? 'طلبات البائعين' : 'Applications', count: searchResults.applications, icon: ShieldCheck, color: 'text-[#7c3aed]', bg: 'bg-[#7c3aed]/10' },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setTab(item.key as any);
                    setShowSearchResultsPage(false);
                  }}
                  className={`bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4 text-center hover:shadow-md transition-all hover:scale-[1.02] group ${
                    tab === item.key ? 'ring-2 ring-[#2563eb] border-[#2563eb]' : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className={`h-10 w-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.label}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.count}</p>
                    </div>
                  </div>
                  {item.count > 0 && (
                    <div className="mt-1 text-xs text-[#2563eb] font-medium">
                      {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {searchResults.products > 0 && (
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#db2777]" />
                      {app.lang === 'ar' ? 'المنتجات' : 'Products'}
                      <Badge variant="secondary" className="text-xs">{filteredListings.length}</Badge>
                    </h4>
                    <Button variant="ghost" size="sm" className="text-xs text-[#2563eb]" onClick={() => { setTab('listings'); setShowSearchResultsPage(false); }}>
                      {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                    </Button>
                  </div>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                    {filteredListings.slice(0, 5).map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg">
                        <span className="text-sm font-medium truncate">{p.title_ar || p.title_en || p.id}</span>
                        <span className="text-xs text-slate-500">{p.price} {p.currency}</span>
                      </div>
                    ))}
                    {filteredListings.length > 5 && (
                      <div className="text-xs text-slate-400 text-center pt-1">
                        {app.lang === 'ar' ? `+${filteredListings.length - 5} منتجات أخرى` : `+${filteredListings.length - 5} more products`}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {searchResults.stores > 0 && (
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Store className="h-4 w-4 text-[#059669]" />
                      {app.lang === 'ar' ? 'المتاجر' : 'Stores'}
                      <Badge variant="secondary" className="text-xs">{filteredStores.length}</Badge>
                    </h4>
                    <Button variant="ghost" size="sm" className="text-xs text-[#2563eb]" onClick={() => { setTab('stores'); setShowSearchResultsPage(false); }}>
                      {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                    </Button>
                  </div>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                    {filteredStores.slice(0, 5).map((s: any) => (
                      <div key={s.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg">
                        <span className="text-sm font-medium truncate">{s.store_name || s.full_name || s.id}</span>
                        <span className="text-xs text-slate-500">{s.phone || s.email}</span>
                      </div>
                    ))}
                    {filteredStores.length > 5 && (
                      <div className="text-xs text-slate-400 text-center pt-1">
                        {app.lang === 'ar' ? `+${filteredStores.length - 5} متاجر أخرى` : `+${filteredStores.length - 5} more stores`}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {searchResults.applications > 0 && (
                <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#7c3aed]" />
                      {app.lang === 'ar' ? 'طلبات البائعين' : 'Applications'}
                      <Badge variant="secondary" className="text-xs">{filteredApplications.length}</Badge>
                    </h4>
                    <Button variant="ghost" size="sm" className="text-xs text-[#2563eb]" onClick={() => { setTab('applications'); setShowSearchResultsPage(false); }}>
                      {app.lang === 'ar' ? 'عرض الكل' : 'View all'} →
                    </Button>
                  </div>
                  <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                    {filteredApplications.slice(0, 5).map((a: any) => (
                      <div key={a.id} className="flex items-center justify-between py-1.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg">
                        <span className="text-sm font-medium truncate">{a.store_name || a.id}</span>
                        <span className="text-xs text-slate-500">{a.status || 'pending'}</span>
                      </div>
                    ))}
                    {filteredApplications.length > 5 && (
                      <div className="text-xs text-slate-400 text-center pt-1">
                        {app.lang === 'ar' ? `+${filteredApplications.length - 5} طلبات أخرى` : `+${filteredApplications.length - 5} more applications`}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {searchResults.total === 0 && (
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-12 text-center">
                <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {app.lang === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {app.lang === 'ar' 
                    ? `لم نعثر على أي نتائج تطابق "${searchQuery}"` 
                    : `No results match "${searchQuery}"`}
                </p>
                <Button variant="outline" className="mt-4" onClick={clearSearch}>
                  {app.lang === 'ar' ? 'مسح البحث' : 'Clear search'}
                </Button>
              </div>
            )}
          </div>
        )}
{/* ===== TABS NAVIGATION - نسخة متجاوبة ===== */}
{!showSearchResults && (
  <div className="mb-6">
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      {/* ✅ Desktop: عرض أفقي */}
      <div className="hidden md:flex items-center p-1.5 gap-2 overflow-x-auto">
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className={`
              flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap flex-1 text-center justify-center
              ${tab === n.id 
                ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/25 scale-[1.02]' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
              }
            `}
          >
            <n.icon className={`h-4 w-4 transition-all duration-300 ${tab === n.id ? 'scale-110' : ''}`} />
            <span>{n.label}</span>
            {tab === n.id && (
              <span className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse ml-1" />
            )}
          </button>
        ))}
      </div>

      {/* ✅ Mobile: شبكة 2x4 مع أيقونات فقط */}
      <div className="md:hidden p-3">
        <div className="grid grid-cols-4 gap-1.5">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`
                flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium transition-all duration-300
                ${tab === n.id 
                  ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/25' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <n.icon className={`h-5 w-5 transition-all duration-300 ${tab === n.id ? 'scale-110' : ''}`} />
              <span className="text-[8px] leading-tight text-center max-w-full break-words">
  {n.label}
</span>
              {tab === n.id && (
                <span className="h-1 w-4 rounded-full bg-white/60 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

        {/* ===== المحتوى ===== */}
        <div className="relative z-0">
          {tab === "overview" && <AdminOverview onGoto={setTab} searchQuery={showSearchResults ? searchQuery : ""} />}
          {tab === "listings" && <AdminListings />}
          {tab === "stores" && <AdminStores />}
          {tab === "applications" && <SellerApplicationsAdmin />}
          {tab === "banners" && <BannersAdminPage />}
          {tab === "announcements" && <AnnouncementsAdmin />}
          {tab === "categories" && <CategoriesAdmin />}
          {tab === "notifications" && <AdminNotifications />}
        </div>

      </div>
    </div>
  );
}