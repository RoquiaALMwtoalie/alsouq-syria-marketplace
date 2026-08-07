// src/routes/delivery/$slug.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useDeliveryCompany, useDistributors } from "@/lib/queries";
import {
  Truck, MapPin, Star, Phone, Mail, Globe, Clock, Shield, 
  BadgePercent, CheckCircle, XCircle, Users, Package, 
  ArrowRight, Calendar, Award, Building2, CreditCard,
  ChevronLeft, ChevronRight, Navigation, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export const Route = createFileRoute("/delivery/$slug")({
  component: DeliveryCompanyPage,
  head: ({ params }) => ({
    meta: [
      { title: `شركة توصيل - Souqi` },
      { name: "description", content: "تفاصيل شركة التوصيل وخدماتها" },
    ],
  }),
});

function DeliveryCompanyPage() {
  const { slug } = Route.useParams();
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"info" | "distributors" | "pricing">("info");

  const { data: company, isLoading: loadingCompany } = useDeliveryCompany(slug);
  const { data: distributors = [], isLoading: loadingDistributors } = useDistributors({
    companyId: company?.id,
    isAvailable: true,
  });

  if (loadingCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-64 w-full mt-4 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold">
            {app.lang === "ar" ? "لم نجد الشركة" : "Company not found"}
          </h2>
          <Button onClick={() => navigate({ to: "/delivery" })} className="mt-4">
            {app.lang === "ar" ? "← العودة للشركات" : "← Back to companies"}
          </Button>
        </div>
      </div>
    );
  }

  const isArabic = app.lang === "ar";
  const name = isArabic ? company.name_ar : company.name_en;
  const description = isArabic ? company.description_ar : company.description_en;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 md:py-12">
          <Link 
            to="/delivery" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-4 group"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
            {app.lang === "ar" ? "جميع شركات التوصيل" : "All delivery companies"}
          </Link>
          
          <div className="flex items-center gap-6 flex-wrap">
            <div className="h-24 w-24 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={name} className="h-16 w-16 object-contain rounded-xl" />
              ) : (
                <Truck className="h-12 w-12 text-white" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
                {company.is_featured && (
                  <Badge className="bg-yellow-500 text-white border-0">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {app.lang === "ar" ? "مميزة" : "Featured"}
                  </Badge>
                )}
                {company.is_active && (
                  <Badge className="bg-emerald-500 text-white border-0">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {app.lang === "ar" ? "نشطة" : "Active"}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-2 text-white/80 text-sm flex-wrap">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {Number(company.rating || 0).toFixed(1)}
                  <span className="text-white/60">({company.reviews_count || 0})</span>
                </span>
                <span className="hidden sm:inline text-white/30">|</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {company.avg_delivery_time || 60} {app.lang === "ar" ? "دقيقة" : "min"}
                </span>
                <span className="hidden sm:inline text-white/30">|</span>
                <span className="flex items-center gap-1">
                  <Truck className="h-4 w-4" />
                  {distributors.length} {app.lang === "ar" ? "موزع" : "distributors"}
                </span>
              </div>
            </div>
            
            <Button 
              className="bg-white text-[#2a655f] hover:bg-white/90 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              onClick={() => navigate({ to: "/tracking" })}
            >
              <Navigation className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "تتبع شحنة" : "Track shipment"}
            </Button>
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center gap-2 border-b">
          {[
            { id: "info", label: isArabic ? "📋 معلومات" : "📋 Info" },
            { id: "distributors", label: isArabic ? "👤 الموزعين" : "👤 Distributors" },
            { id: "pricing", label: isArabic ? "💰 الأسعار" : "💰 Pricing" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "border-[#2a655f] text-[#2a655f]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== TAB: INFO ===== */}
        {activeTab === "info" && (
          <div className="py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                <h3 className="text-lg font-bold mb-3">
                  {app.lang === "ar" ? "عن الشركة" : "About"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {description || (app.lang === "ar" ? "لا يوجد وصف" : "No description")}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                <h3 className="text-lg font-bold mb-4">
                  {app.lang === "ar" ? "📍 معلومات الاتصال" : "📍 Contact Info"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {company.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-9 w-9 rounded-lg bg-[#2a655f]/10 flex items-center justify-center">
                        <Phone className="h-4 w-4 text-[#2a655f]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {app.lang === "ar" ? "الهاتف" : "Phone"}
                        </p>
                        <p className="font-medium" dir="ltr">{company.phone}</p>
                      </div>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-9 w-9 rounded-lg bg-[#2a655f]/10 flex items-center justify-center">
                        <Mail className="h-4 w-4 text-[#2a655f]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {app.lang === "ar" ? "البريد" : "Email"}
                        </p>
                        <p className="font-medium">{company.email}</p>
                      </div>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="h-9 w-9 rounded-lg bg-[#2a655f]/10 flex items-center justify-center">
                        <Globe className="h-4 w-4 text-[#2a655f]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {app.lang === "ar" ? "الموقع" : "Website"}
                        </p>
                        <a href={company.website} target="_blank" rel="noopener" className="font-medium text-[#2a655f] hover:underline">
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                  {company.address_ar && (
                    <div className="flex items-center gap-3 text-sm col-span-full">
                      <div className="h-9 w-9 rounded-lg bg-[#2a655f]/10 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-[#2a655f]" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {app.lang === "ar" ? "العنوان" : "Address"}
                        </p>
                        <p className="font-medium">
                          {isArabic ? company.address_ar : company.address_en}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#2a655f]" />
                  {app.lang === "ar" ? "الخدمات المقدمة" : "Services"}
                </h3>
                <div className="space-y-3">
                  {[
                    { label: isArabic ? "تتبع الشحنات" : "Shipment tracking", value: company.has_tracking },
                    { label: isArabic ? "تأمين على الشحنات" : "Insurance", value: company.has_insurance },
                    { label: isArabic ? "الدفع عند الاستلام" : "Cash on delivery", value: company.has_cod },
                    { label: isArabic ? "توصيل سريع" : "Express delivery", value: company.has_express },
                  ].map((service) => (
                    <div key={service.label} className="flex items-center justify-between">
                      <span className="text-sm">{service.label}</span>
                      {service.value ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#2a655f]" />
                  {app.lang === "ar" ? "الموزعون" : "Distributors"}
                </h3>
                <p className="text-3xl font-bold text-[#2a655f]">{distributors.length}</p>
                <p className="text-xs text-muted-foreground">
                  {app.lang === "ar" ? "موزع متاح" : "available distributors"}
                </p>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
                  onClick={() => setActiveTab("distributors")}
                >
                  {app.lang === "ar" ? "عرض الموزعين" : "View distributors"}
                  <ArrowRight className="h-4 w-4 ml-1 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: DISTRIBUTORS ===== */}
        {activeTab === "distributors" && (
          <div className="py-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">
                {app.lang === "ar" ? "👤 موزعينا" : "👤 Our Distributors"}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({distributors.length})
                </span>
              </h3>
            </div>

            {loadingDistributors ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
            ) : distributors.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {app.lang === "ar" ? "لا يوجد موزعين حالياً" : "No distributors available"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {distributors.map((dist: any) => (
                  <div key={dist.id} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border hover:shadow-md transition-all hover:border-[#2a655f]/30">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center">
                        {dist.avatar_url ? (
                          <img src={dist.avatar_url} alt="" className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <Users className="h-6 w-6 text-[#2a655f]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold line-clamp-1">
                          {isArabic ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {Number(dist.rating || 0).toFixed(1)}
                          </span>
                          <span className="text-muted-foreground/50">•</span>
                          <span>{dist.completed_orders || 0} {app.lang === "ar" ? "طلب" : "orders"}</span>
                          {dist.is_available && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[9px]">
                              ● {app.lang === "ar" ? "متاح" : "Available"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB: PRICING ===== */}
        {activeTab === "pricing" && (
          <div className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border text-center">
                <div className="h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6 text-[#2a655f]" />
                </div>
                <h4 className="text-sm text-muted-foreground">
                  {app.lang === "ar" ? "السعر الأساسي" : "Base Price"}
                </h4>
                <p className="text-3xl font-bold text-[#2a655f] mt-1">
                  {company.base_price} {app.currency}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border text-center">
                <div className="h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-3">
                  <Navigation className="h-6 w-6 text-[#2a655f]" />
                </div>
                <h4 className="text-sm text-muted-foreground">
                  {app.lang === "ar" ? "سعر الكيلومتر" : "Price per KM"}
                </h4>
                <p className="text-3xl font-bold text-[#2a655f] mt-1">
                  {company.price_per_km} {app.currency}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border text-center">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                  <Award className="h-6 w-6 text-emerald-500" />
                </div>
                <h4 className="text-sm text-muted-foreground">
                  {app.lang === "ar" ? "توصيل مجاني فوق" : "Free delivery above"}
                </h4>
                <p className="text-3xl font-bold text-emerald-500 mt-1">
                  {company.free_delivery_threshold} {app.currency}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
              <h4 className="font-bold mb-4">
                {app.lang === "ar" ? "ملاحظات الأسعار" : "Pricing Notes"}
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {app.lang === "ar" 
                    ? `الحد الأدنى للتوصيل: ${company.min_delivery_fee} ${app.currency}` 
                    : `Minimum delivery fee: ${company.min_delivery_fee} ${app.currency}`}
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  {app.lang === "ar" 
                    ? `الحد الأقصى للتوصيل: ${company.max_delivery_fee} ${app.currency}` 
                    : `Maximum delivery fee: ${company.max_delivery_fee} ${app.currency}`}
                </li>
                {company.coverage_areas && company.coverage_areas.length > 0 && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#2a655f]" />
                    {app.lang === "ar" 
                      ? `يغطي: ${company.coverage_areas.join('، ')}` 
                      : `Covers: ${company.coverage_areas.join(', ')}`}
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}