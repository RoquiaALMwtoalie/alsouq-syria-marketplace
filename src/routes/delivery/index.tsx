// src/routes/delivery/index.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDeliveryCompanies } from "@/lib/queries";
import { Truck, MapPin, Star, Phone, Mail, Globe, Clock, Shield, BadgePercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/delivery/")({
  component: DeliveryCompaniesPage,
  head: () => ({
    meta: [
      { title: "شركات التوصيل - Souqi" },
      { name: "description", content: "جميع شركات التوصيل المتاحة في السوق اليك" },
    ],
  }),
});

function DeliveryCompaniesPage() {
  const app = useApp();
  const t = useT();
  const { data: companies = [], isLoading } = useDeliveryCompanies({ active: true });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="flex items-center gap-3 mb-4">
            <Link to="/" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
              ← {app.lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center">
              <Truck className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {app.lang === "ar" ? "🚚 شركات التوصيل" : "🚚 Delivery Companies"}
              </h1>
              <p className="text-white/80 text-sm mt-1">
                {app.lang === "ar" 
                  ? `اختر شركة التوصيل المناسبة لطلبك (${companies.length} شركة)` 
                  : `Choose the right delivery company for your order (${companies.length} companies)`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                <Skeleton className="h-20 w-20 rounded-xl mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto mt-3" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="text-center py-20">
            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Truck className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold">
              {app.lang === "ar" ? "لا توجد شركات توصيل" : "No delivery companies"}
            </h3>
            <p className="text-muted-foreground mt-2">
              {app.lang === "ar" ? "سيتم إضافة شركات التوصيل قريباً" : "Delivery companies will be added soon"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link
                key={company.id}
                to="/delivery/$slug"
                params={{ slug: company.slug }}
                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30"
              >
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-xl bg-[#2a655f]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt="" className="h-12 w-12 object-contain rounded-lg" />
                    ) : (
                      <Truck className="h-8 w-8 text-[#2a655f]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg line-clamp-1 group-hover:text-[#2a655f] transition-colors">
                      {app.lang === "ar" ? company.name_ar : company.name_en}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {Number(company.rating || 0).toFixed(1)}
                      <span className="text-muted-foreground/50">•</span>
                      <Clock className="h-3.5 w-3.5" />
                      {company.avg_delivery_time || 60} {app.lang === "ar" ? "دقيقة" : "min"}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {app.lang === "ar" ? company.description_ar : company.description_en}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-4">
                  {company.has_tracking && (
                    <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600">
                      <Shield className="h-3 w-3 mr-1" /> تتبع
                    </Badge>
                  )}
                  {company.has_express && (
                    <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-600">
                      ⚡ سريع
                    </Badge>
                  )}
                  {company.has_cod && (
                    <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600">
                      💵 دفع عند الاستلام
                    </Badge>
                  )}
                  {company.is_featured && (
                    <Badge className="bg-[#2a655f] text-white border-0 text-[10px]">
                      ⭐ مميز
                    </Badge>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
                  <span className="text-sm font-bold text-[#2a655f]">
                    {company.base_price} {app.currency}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {company.free_delivery_threshold > 0 && (
                      <>
                        {app.lang === "ar" ? "توصيل مجاني للطلبات فوق" : "Free delivery above"}{" "}
                        {company.free_delivery_threshold} {app.currency}
                      </>
                    )}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}