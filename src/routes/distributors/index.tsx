// src/routes/distributors/index.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDistributors, useGovernorates } from "@/lib/queries";
import {
  Users, MapPin, Star, Phone, Mail, Clock, 
  CheckCircle, XCircle, Search, Filter,
  Truck, Package, Award, UserCheck, UserX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/distributors/")({
  component: DistributorsPage,
  head: () => ({
    meta: [
      { title: "الموزعين - Souqi" },
      { name: "description", content: "جميع الموزعين المتاحين للتوصيل في السوق اليك" },
    ],
  }),
});

function DistributorsPage() {
  const app = useApp();
  const t = useT();
  const [searchQuery, setSearchQuery] = useState("");
  const [governorateFilter, setGovernorateFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  const { data: distributors = [], isLoading: loadingDistributors } = useDistributors({
    isAvailable: true,
  });
  const { data: governorates = [] } = useGovernorates();

  // ✅ فلترة الموزعين
  const filteredDistributors = useMemo(() => {
    let result = distributors;

    // ✅ فلترة حسب المحافظة
    if (governorateFilter !== "all") {
      result = result.filter((d: any) => d.governorate_id === governorateFilter);
    }

    // ✅ فلترة حسب التوفر
    if (availabilityFilter !== "all") {
      result = result.filter((d: any) => 
        availabilityFilter === "available" ? d.is_available : !d.is_available
      );
    }

    // ✅ فلترة حسب البحث
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((d: any) => {
        const nameAr = d.full_name_ar?.toLowerCase() || "";
        const nameEn = d.full_name_en?.toLowerCase() || "";
        const phone = d.phone || "";
        return nameAr.includes(q) || nameEn.includes(q) || phone.includes(q);
      });
    }

    return result;
  }, [distributors, searchQuery, governorateFilter, availabilityFilter]);

  const isArabic = app.lang === "ar";

  // ✅ إحصائيات
  const stats = {
    total: distributors.length,
    available: distributors.filter((d: any) => d.is_available).length,
    unavailable: distributors.filter((d: any) => !d.is_available).length,
    avgRating: distributors.length > 0 
      ? (distributors.reduce((sum: number, d: any) => sum + Number(d.rating || 0), 0) / distributors.length) 
      : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
              ← {isArabic ? "الرئيسية" : "Home"}
            </Link>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center">
              <Users className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {isArabic ? "👤 الموزعين" : "👤 Distributors"}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {isArabic 
                  ? `جميع الموزعين المتاحين للتوصيل (${stats.total} موزع)` 
                  : `All available distributors (${stats.total} distributors)`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="mx-auto max-w-7xl px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard 
            icon={Users} 
            label={isArabic ? "إجمالي الموزعين" : "Total Distributors"} 
            value={stats.total} 
            color="blue" 
          />
          <StatCard 
            icon={UserCheck} 
            label={isArabic ? "متاح" : "Available"} 
            value={stats.available} 
            color="green" 
          />
          <StatCard 
            icon={UserX} 
            label={isArabic ? "غير متاح" : "Unavailable"} 
            value={stats.unavailable} 
            color="red" 
          />
          <StatCard 
            icon={Star} 
            label={isArabic ? "متوسط التقييم" : "Avg Rating"} 
            value={stats.avgRating.toFixed(1)} 
            color="yellow" 
          />
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isArabic ? "🔍 بحث عن موزع..." : "🔍 Search distributor..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-10 rounded-xl border-slate-200/50 dark:border-slate-800/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={governorateFilter}
              onChange={(e) => setGovernorateFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20"
            >
              <option value="all">{isArabic ? "جميع المحافظات" : "All Governorates"}</option>
              {governorates.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {isArabic ? g.name_ar : g.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20"
            >
              <option value="all">{isArabic ? "الكل" : "All"}</option>
              <option value="available">{isArabic ? "✅ متاح" : "✅ Available"}</option>
              <option value="unavailable">{isArabic ? "❌ غير متاح" : "❌ Unavailable"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== DISTRIBUTORS GRID ===== */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        {loadingDistributors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto mt-3" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>
            ))}
          </div>
        ) : filteredDistributors.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">
              {isArabic ? "لا يوجد موزعين" : "No distributors found"}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {isArabic 
                ? "لم نجد موزعين مطابقين لمعايير البحث" 
                : "No distributors matching your search criteria"}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
                onClick={() => setSearchQuery("")}
              >
                {isArabic ? "مسح البحث" : "Clear search"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistributors.map((distributor: any) => (
              <DistributorCard key={distributor.id} distributor={distributor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 📦 StatCard Component
// ============================================================
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", colors[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 DistributorCard Component
// ============================================================
function DistributorCard({ distributor }: { distributor: any }) {
  const app = useApp();
  const isArabic = app.lang === "ar";

  return (
    <Link
      to="/distributor/$id"
      params={{ id: distributor.id }}
      className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30"
    >
      <div className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          {distributor.avatar_url ? (
            <img 
              src={distributor.avatar_url} 
              alt="" 
              className="h-full w-full object-cover rounded-full" 
            />
          ) : (
            <Users className="h-8 w-8 text-[#2a655f]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-[#2a655f] transition-colors">
              {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
            </h3>
            {distributor.is_available ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[9px]">
                ● {isArabic ? "متاح" : "Available"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/10 text-red-500 border-0 text-[9px]">
                ● {isArabic ? "غير متاح" : "Unavailable"}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-1">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {Number(distributor.rating || 0).toFixed(1)}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              {distributor.completed_orders || 0} {isArabic ? "طلب" : "orders"}
            </span>
            {distributor.governorates && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {isArabic ? distributor.governorates.name_ar : distributor.governorates.name_en}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {distributor.phone}
            </span>
            {distributor.email && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {distributor.email}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {distributor.delivery_company_id && (
        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span>
              {isArabic ? "تابع لشركة:" : "Belongs to:"}
            </span>
            <span className="font-medium text-[#2a655f]">
              {distributor.delivery_company?.name_ar || distributor.delivery_company?.name_en || 
               (isArabic ? "شركة توصيل" : "Delivery Company")}
            </span>
          </div>
        </div>
      )}
    </Link>
  );
}