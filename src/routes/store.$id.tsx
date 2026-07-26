// src/routes/store.$id.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  Star, MessageCircle, Store as StoreIcon, Loader2, 
  Clock, Calendar, MapPin, Globe, Building2 // ✅ أيقونات جديدة
} from "lucide-react";
import { useApp, useT } from "@/lib/i18n";
import { useListings, useStoreProfile } from "@/lib/queries";
import { useGetOrCreateConversation } from "@/lib/hooks/useConversation";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/store/$id")({
  component: StorePage,
  head: () => ({ meta: [{ title: "Store — Souqi" }] }),
});

function StorePage() {
  const { id } = Route.useParams();
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [isOpeningConversation, setIsOpeningConversation] = useState(false);
  
  // ====== Hooks ======
  const { data: store, isLoading } = useStoreProfile(id) as { data: any; isLoading: boolean };
  const { data: listings = [] } = useListings({ ownerId: id, sort: "recent" });
  const getOrCreateConversation = useGetOrCreateConversation();

  // ====== معالجة فتح المحادثة ======
 // src/routes/store.$id.tsx

const handleMessage = async () => {
  if (!app.user) {
    navigate({ to: "/auth/$mode", params: { mode: "login" } });
    return;
  }

  if (app.user.id === id) {
    toast.error(app.lang === "ar" ? "لا يمكنك مراسلة نفسك" : "You can't message yourself");
    return;
  }

  if (store?.allows_messaging === false) {
    toast.error(app.lang === "ar" ? "هذا المتجر لا يسمح بالمراسلة" : "This store doesn't allow messaging");
    return;
  }

  setIsOpeningConversation(true);

  try {
    const conversation = await getOrCreateConversation.mutateAsync({
      userId: app.user.id,
      otherUserId: id,
    });

    // ✅ ✅ ✅ أرسل state مع الـ navigate ✅ ✅ ✅
    navigate({
      to: "/messages/$userId",
      params: { userId: id },
      search: { cid: conversation.id },
      state: { fromStore: true, storeId: id, storeName: store.store_name || store.full_name },
    });
  } catch (error) {
    console.error("❌ Error opening conversation:", error);
    toast.error(
      app.lang === "ar" 
        ? "فشل فتح المحادثة. حاول مرة أخرى" 
        : "Failed to open conversation. Please try again"
    );
  } finally {
    setIsOpeningConversation(false);
  }
};

  // ====== عرض التحميل ======
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p>{app.lang === "ar" ? "جاري تحميل المتجر..." : "Loading store..."}</p>
      </div>
    );
  }

  // ====== المتجر غير موجود ======
  if (!store) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <StoreIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <h2 className="text-2xl font-bold">
          {app.lang === "ar" ? "المتجر غير موجود" : "Store not found"}
        </h2>
        <p className="text-muted-foreground mt-2">
          {app.lang === "ar" 
            ? "قد يكون المتجر قد تم حذفه أو تعطيله" 
            : "The store may have been deleted or disabled"}
        </p>
        <Button 
          className="mt-4"
          onClick={() => navigate({ to: "/" })}
        >
          {app.lang === "ar" ? "العودة للرئيسية" : "Back to home"}
        </Button>
      </div>
    );
  }

  const name = store.store_name || store.full_name || (app.lang === "ar" ? "متجر" : "Store");
  
  // ✅ استخراج معلومات المتجر
  const storeType = store.store_type || "online";
  const storeAddress = store.store_address || "";
  const opensAt = store.store_opens_at || "";
  const closesAt = store.store_closes_at || "";
  const weeklyOffDays = store.weekly_off_days || [];

  return (
    <div>
      {/* ====== غلاف المتجر ====== */}
      <div className="relative h-48 md:h-72 bg-gradient-to-br from-primary to-primary-glow overflow-hidden">
        {store.store_cover_url && (
          <img 
            src={store.store_cover_url} 
            className="absolute inset-0 h-full w-full object-cover opacity-60" 
            alt={name}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* ====== معلومات المتجر ====== */}
      <div className="mx-auto max-w-7xl px-4 -mt-16 relative">
        <div className="rounded-2xl bg-card shadow-elegant p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* شعار المتجر */}
          <div className="h-24 w-24 rounded-2xl bg-muted overflow-hidden border-4 border-card shadow grid place-items-center text-primary font-black text-3xl">
            {store.store_logo_url || store.avatar_url ? (
              <img 
                src={store.store_logo_url || store.avatar_url} 
                className="h-full w-full object-cover" 
                alt={name}
              />
            ) : (
              name[0]?.toUpperCase() || "?"
            )}
          </div>

          {/* تفاصيل المتجر */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-black">{name}</h1>
              <StoreIcon className="h-5 w-5 text-primary" />
              <StoreStatusBadge store={store} lang={app.lang} />
            </div>
            
            {store.store_description && (
              <p className="text-muted-foreground mt-1 text-sm">{store.store_description}</p>
            )}
            
            {/* ====== ✅ معلومات المتجر التفصيلية ====== */}
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
              {/* ✅ التقييم */}
              <span className="flex items-center gap-1 text-accent">
                <Star className="h-4 w-4 fill-current" />
                {Number(store.rating || 0).toFixed(1)}
              </span>
              
              {/* ✅ عدد المنتجات */}
              <span>{listings.length} {t("products_tab")}</span>
              
              {/* ✅ نوع المتجر */}
              <span className="flex items-center gap-1 bg-primary/10 px-2.5 py-0.5 rounded-full text-primary text-xs font-medium">
                {storeType === "online" ? (
                  <>
                    <Globe className="h-3.5 w-3.5" />
                    {app.lang === "ar" ? "متجر إلكتروني" : "Online Store"}
                  </>
                ) : (
                  <>
                    <Building2 className="h-3.5 w-3.5" />
                    {app.lang === "ar" ? "متجر فعلي" : "Physical Store"}
                  </>
                )}
              </span>

              {/* ✅ العنوان (يظهر فقط للمتاجر الفعلية) */}
              {storeType === "physical" && storeAddress && (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {storeAddress}
                </span>
              )}
              
              {/* ✅ أوقات العمل (تظهر للجميع) */}
              {(opensAt || closesAt) && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {app.lang === "ar" ? "الدوام" : "Hours"}: 
                  {(opensAt || "--:--").slice(0,5)} — 
                  {(closesAt || "--:--").slice(0,5)}
                </span>
              )}
              
              {/* ✅ أيام العطل */}
              {weeklyOffDays.length > 0 && (
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {app.lang === "ar" ? "عطل:" : "Off:"} 
                  {weeklyOffDays.map((day: string) => {
                    const dayMap: Record<string, string> = {
                      Monday: app.lang === "ar" ? 'الإثنين' : 'Mon',
                      Tuesday: app.lang === "ar" ? 'الثلاثاء' : 'Tue',
                      Wednesday: app.lang === "ar" ? 'الأربعاء' : 'Wed',
                      Thursday: app.lang === "ar" ? 'الخميس' : 'Thu',
                      Friday: app.lang === "ar" ? 'الجمعة' : 'Fri',
                      Saturday: app.lang === "ar" ? 'السبت' : 'Sat',
                      Sunday: app.lang === "ar" ? 'الأحد' : 'Sun',
                    };
                    return dayMap[day] || day;
                  }).join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* ====== أزرار الإجراءات ====== */}
          <div className="flex gap-2">
            {store.allows_messaging !== false && app.user?.id !== id && (
              <Button
                onClick={handleMessage}
                disabled={isOpeningConversation}
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isOpeningConversation ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {app.lang === "ar" ? "جاري التحميل..." : "Loading..."}
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4" />
                    {app.lang === "ar" ? "مراسلة المتجر" : "Message Store"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ====== قائمة المنتجات ====== */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="text-xl md:text-2xl font-black mb-4">{t("products")}</h2>
        {listings.length === 0 ? (
          <div className="rounded-2xl bg-card p-12 text-center shadow-card text-muted-foreground">
            <StoreIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-lg font-medium">
              {app.lang === "ar" ? "لا توجد منتجات بعد" : "No products yet"}
            </p>
            <p className="text-sm mt-1">
              {app.lang === "ar" 
                ? "سيتم إضافة المنتجات قريباً" 
                : "Products will be added soon"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {listings.map((item) => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ====== دوال مساعدة ======

export function isStoreCurrentlyOpen(store: any): boolean {
  if (!store) return false;
  if (store.store_online === false) return false;
  
  const opens = (store.store_opens_at || "").slice(0, 5);
  const closes = (store.store_closes_at || "").slice(0, 5);
  
  if (!opens || !closes) return true;
  
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [oh, om] = opens.split(":").map(Number);
  const [ch, cm] = closes.split(":").map(Number);
  const o = oh * 60 + om;
  const c = ch * 60 + cm;
  
  return o <= c ? cur >= o && cur <= c : cur >= o || cur <= c;
}

function StoreStatusBadge({ store, lang }: { store: any; lang: "ar" | "en" }) {
  const open = isStoreCurrentlyOpen(store);
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
      open 
        ? "bg-secondary/15 text-secondary" 
        : "bg-muted text-muted-foreground"
    }`}>
      <span className={`h-2 w-2 rounded-full ${
        open 
          ? "bg-secondary animate-pulse" 
          : "bg-muted-foreground"
      }`} />
      {open 
        ? (lang === "ar" ? "مفتوح الآن" : "Open now") 
        : (lang === "ar" ? "مغلق" : "Closed")
      }
    </span>
  );
}