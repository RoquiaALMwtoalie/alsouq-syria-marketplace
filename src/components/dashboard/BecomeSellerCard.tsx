// src/components/dashboard/BecomeSellerCard.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Store, Clock, Package, MapPin, Globe, Building, Clock as ClockIcon, 
  Calendar, Shield, TrendingUp, CheckCircle, 
  ArrowRight, Sparkles, Rocket, DollarSign, X, ArrowLeft,
  Phone, Image, Info, AlertCircle, Loader2, Star, Heart, Zap,
  Crown, Gem, Flame, Award, Target, Compass, Leaf, Sun, Moon,
  ChevronLeft, ChevronRight, Search,
  type LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { 
  useBecomeSeller, 
  useMySellerApplication, 
  useProfile, 
  useGovernorates, 
  useSendNotificationV2,
  useCanSubmitApplication,
  useLastRejectedApplication
} from "@/lib/queries";
import { ImageInput } from "@/components/ImageInput";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const WEEK_DAYS = [
  { value: 'Monday', label: 'الإثنين' },
  { value: 'Tuesday', label: 'الثلاثاء' },
  { value: 'Wednesday', label: 'الأربعاء' },
  { value: 'Thursday', label: 'الخميس' },
  { value: 'Friday', label: 'الجمعة' },
  { value: 'Saturday', label: 'السبت' },
  { value: 'Sunday', label: 'الأحد' },
];

// ✅ SLIDES خارج المكون - تحسين الأداء
const SLIDES = [
  {
    icon: "🏛️",
    title_ar: "السوق لعندك",
    title_en: "Souqi",
    subtitle_ar: "افتح متجرك الآن",
    subtitle_en: "Open Your Store Now",
    desc_ar: "3 خطوات بسيطة تفصلك عن أول بيعة — ابدأ رحلة النجاح اليوم",
    desc_en: "3 simple steps away from your first sale — start your journey today",
    gradient: "from-[#0d2e2a] to-[#1a4f4a]",
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/istockphoto-2105032127-612x612.jpg",
  },
  {
    icon: "🚀",
    title_ar: "السوق لعندك",
    title_en: "Souqi",
    subtitle_ar: "انطلق بسرعة",
    subtitle_en: "Launch Fast",
    desc_ar: "سجل بياناتك وأضف منتجاتك وابدأ البيع خلال دقائق",
    desc_en: "Register, add your products, and start selling in minutes",
    gradient: "from-[#1a4f4a] to-[#2a655f]",
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/42430876-ai-generated-8793863_1920.jpg",
  },
  {
    icon: "💎",
    title_ar: "السوق لعندك",
    title_en: "Souqi",
    subtitle_ar: "متجر احترافي",
    subtitle_en: "Professional Store",
    desc_ar: "متجرك يظهر بشكل احترافي مع صور جذابة وتجربة مستخدم فريدة",
    desc_en: "Your store looks professional with attractive images and unique UX",
    gradient: "from-[#2a655f] to-[#3a8a82]",
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/mohamed_hassan-systems-icons-3334262_1920.jpg",
  },
  {
    icon: "🛡️",
    title_ar: "السوق لعندك",
    title_en: "Souqi",
    subtitle_ar: "بيع بثقة وأمان",
    subtitle_en: "Sell With Confidence",
    desc_ar: "نظام حماية متكامل للبائع والمشتري مع دعم فني على مدار الساعة",
    desc_en: "Complete protection system for sellers and buyers with 24/7 support",
    gradient: "from-[#3a8a82] to-[#4a9f95]",
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/regencygirl123-present-8440034_1920.jpg",
  },
  {
    icon: "✨",
    title_ar: "السوق لعندك",
    title_en: "Souqi",
    subtitle_ar: "تجربة فريدة",
    subtitle_en: "Unique Experience",
    desc_ar: "واجهات مستخدم حديثة ومتجاوبة مع دعم كامل للغتين العربية والإنجليزية",
    desc_en: "Modern, responsive user interfaces with full Arabic and English language support",
    gradient: "from-[#0d2e2a] to-[#1a4f4a]",
    image: "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/gonghuimin468-happy-holidays-3040029_1920.jpg",
  },
];

// ✅ أيقونة متحركة مع تموجات
const AnimatedIcon = ({ 
  Icon, 
  className = "",
  color = "text-[#2a655f]",
  delay = 0,
  size = "h-5 w-5"
}: { 
  Icon: LucideIcon, 
  className?: string,
  color?: string,
  delay?: number,
  size?: string
}) => {
  return (
    <div 
      className="relative inline-flex items-center justify-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-float-icon group-hover:animate-pulse-slow">
        <Icon className={cn(
          "transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
          color,
          size,
          className
        )} />
      </div>
      <span className="absolute -inset-2 rounded-full border-2 border-[#2a655f]/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute -inset-4 rounded-full border-2 border-[#3a8a82]/10 animate-ripple delay-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <span className="absolute -inset-6 rounded-full border-2 border-[#4a9f95]/5 animate-ripple delay-1500 opacity-0 group-hover:opacity-100 transition-opacity duration-900" />
    </div>
  );
};

// ✅ ✅ ✅ سلايدر متحرك احترافي مع صور واضحة (متل الأدمن) ✅ ✅ ✅
const HeroSlider = React.memo(({ app }: { app: any }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const isRTL = app.lang === 'ar';
  const current = SLIDES[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] shadow-2xl shadow-[#0d2e2a]/30 border border-emerald-500/20 group min-h-[280px]">
      
      {/* ✅ ✅ ✅ صورة الخلفية (تظهر كاملة مع خلفية) */}
      <div className="absolute inset-0 overflow-hidden bg-[#0d2e2a]">
        <img 
          src={current.image} 
          alt={current.title_ar}
          className="w-full h-full object-contain object-center transition-transform duration-1000 group-hover:scale-105"
        />
      </div>
      
      {/* ✅ تراكب شفاف عشان النصوص تبقى مقروءة */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e2a]/70 to-[#1a4f4a]/50 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d2e2a]/60 to-transparent" />

      {/* ✅ خلفية متحركة */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] bg-repeat" />
      </div>

      {/* ✅ زوايا زخرفية */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse delay-1000" />

      {/* ✅ المحتوى */}
      <div className="relative px-6 py-8 md:px-10 md:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-10 z-10">
        
        {/* ✅ الأيقونة الكبيرة */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="h-20 w-20 md:h-28 md:w-28 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-5xl md:text-7xl shadow-2xl shadow-emerald-500/20 animate-float group-hover:scale-110 transition-transform duration-500">
              {current.icon}
            </div>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/30 to-emerald-500/0 blur-xl animate-pulse" />
          </div>
        </div>

        {/* ✅ النصوص */}
        <div className="flex-1 text-center md:text-right">
          <h1 className={`text-2xl md:text-4xl font-extrabold text-white mb-1 tracking-tight drop-shadow-lg ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.title_ar : current.title_en}
          </h1>
          <h2 className={`text-lg md:text-2xl font-bold text-emerald-300/90 mb-2 tracking-tight drop-shadow-md ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.subtitle_ar : current.subtitle_en}
          </h2>
          <p className={`text-sm md:text-base text-white/90 max-w-2xl leading-relaxed drop-shadow-md ${isRTL ? 'font-arabic' : ''}`}>
            {isRTL ? current.desc_ar : current.desc_en}
          </p>
          
          {/* ✅ شارات إضافية */}
          <div className="flex flex-wrap items-center gap-2 mt-3 justify-center md:justify-start">
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs">
              ✨ {isRTL ? "منصة متكاملة" : "Integrated Platform"}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/20 text-emerald-300 text-xs">
              🚀 {isRTL ? "تحديثات لحظية" : "Real-time Updates"}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-xs">
              🔒 {isRTL ? "آمن ومحمي" : "Secure & Protected"}
            </span>
          </div>
          
          {/* ✅ نقاط التقدم */}
          <div className="flex items-center gap-2 mt-4 justify-center md:justify-start">
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  currentSlide === index
                    ? "w-10 bg-emerald-400 shadow-lg shadow-emerald-500/50"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
            <span className="text-[10px] text-white/40 ml-2 font-mono">
              {currentSlide + 1}/{SLIDES.length}
            </span>
          </div>
        </div>

        {/* ✅ أزرار التحكم */}
        <div className="flex-shrink-0 flex flex-row md:flex-col gap-2">
          <Button
            onClick={prevSlide}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
          >
            {isRTL ? (
              <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            ) : (
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            )}
          </Button>
          <Button
            onClick={nextSlide}
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110"
          >
            {isRTL ? (
              <ChevronLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" />
            ) : (
              <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
            )}
          </Button>
        </div>
      </div>

      {/* ✅ شريط سفلي متحرك */}
      <div className="relative h-0.5 w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-shimmer" />
    </div>
  );
});

export function BecomeSellerCard() {
  const app = useApp();
  const t = useT();
  const queryClient = useQueryClient();
  const become = useBecomeSeller();
  const sendNotification = useSendNotificationV2();
  const { data: application, isLoading: appLoading } = useMySellerApplication(app.user?.id);
  const { data: profile } = useProfile(app.user?.id);
  const { data: governorates = [] } = useGovernorates();
  
  const { data: canSubmitData, isLoading: checkingLoading } = useCanSubmitApplication(app.user?.id);
  const { data: lastRejected, isLoading: rejectedLoading } = useLastRejectedApplication(app.user?.id);
  
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [storeLogo, setStoreLogo] = useState("");
  const [storeCover, setStoreCover] = useState("");
  const [allowsMessaging, setAllowsMessaging] = useState(true);
  const [storeType, setStoreType] = useState<'online' | 'physical'>('online');
  const [governorateId, setGovernorateId] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [weeklyOffDays, setWeeklyOffDays] = useState<string[]>([]);
  
  const [prefilled, setPrefilled] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [rejectedReason, setRejectedReason] = useState<string | null>(null);

  const isRTL = app.lang === "ar";

  // ✅ useMemo لقائمة المحافظات - تحسين الأداء
  const governorateOptions = useMemo(() => 
    governorates.map((gov: any) => ({
      id: gov.id,
      name: isRTL ? gov.name_ar : gov.name_en,
    })),
    [governorates, isRTL]
  );

  useEffect(() => {
    if (lastRejected) {
      setIsRejected(true);
      setRejectedReason(lastRejected.admin_note || 'تم رفض الطلب من قبل الإدارة');
      
      setStoreName(lastRejected.store_name || "");
      setStoreDesc(lastRejected.store_description || "");
      setStorePhone(lastRejected.store_phone || "");
      setStoreLogo(lastRejected.store_logo_url || "");
      setStoreCover(lastRejected.store_cover_url || "");
      setStoreType(lastRejected.store_type || 'online');
      setGovernorateId(lastRejected.governorate_id || "");
      setAddress(lastRejected.address || "");
      setOpeningTime(lastRejected.opening_time || "09:00");
      setClosingTime(lastRejected.closing_time || "22:00");
      setWeeklyOffDays(lastRejected.weekly_off_days || []);
    }
  }, [lastRejected]);

  useEffect(() => {
    if (prefilled || !profile || isRejected) return;
    const p = profile as any;
    if (p.avatar_url && !storeLogo) setStoreLogo(p.avatar_url);
    setPrefilled(true);
  }, [profile, prefilled, storeLogo, isRejected]);

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return storeName.trim().length >= 2;
      case 2:
        return storeLogo.trim().length > 0 && storeCover.trim().length > 0;
      case 3:
        return storePhone.trim().length > 0 && 
               governorateId.length > 0 && 
               (storeType === 'online' || address.trim().length > 0);
      default:
        return true;
    }
  };

  const goToNextStep = () => {
    if (isStepValid(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const notifyAdminForStore = async (storeName: string, userId: string) => {
    try {
      const { data: adminRole, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();

      if (roleError || !adminRole) {
        console.log("ℹ️ No admin found to notify");
        return;
      }

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, store_name")
        .eq("id", userId)
        .maybeSingle();

      const userName = userProfile?.store_name || userProfile?.full_name || userId;

      await sendNotification.mutateAsync({
        userId: adminRole.user_id,
        type: "store_application",
        titleAr: `🏪 طلب فتح متجر جديد`,
        bodyAr: `قام ${userName} بتقديم طلب فتح متجر "${storeName}"، بحاجة للمراجعة`,
        linkUrl: `/admin/applications`,
        metadata: {
          store_name: storeName,
          user_id: userId,
          action: "open_store",
        },
        actions: [
          { label_ar: 'مراجعة الطلب', url: `/admin/applications` },
        ]
      });

      console.log(`✅ Admin notified about store application: ${storeName} from ${userName}`);
    } catch (error) {
      console.error("❌ Error notifying admin about store:", error);
    }
  };

  // ✅ useCallback - تحسين الأداء
  const handleBecome = useCallback(async () => {
    if (!app.user) return;
    
    if (isSubmitting) {
      toast.warning(app.lang === "ar" ? "⏳ جاري الإرسال، انتظر..." : "⏳ Submitting, please wait...");
      return;
    }

    if (!canSubmitData?.canSubmit) {
      toast.error(canSubmitData?.reason || app.lang === "ar" ? "لا يمكنك التقديم" : "Cannot submit");
      return;
    }
    
    if (!storeName.trim() || storeName.trim().length < 2) {
      toast.error(app.lang === "ar" ? "اسم المتجر مطلوب (أكثر من حرفين)" : "Store name required (at least 2 characters)");
      setCurrentStep(1);
      return;
    }
    
    if (!storeLogo.trim()) {
      toast.error(app.lang === "ar" ? "شعار المتجر (Logo) مطلوب" : "Store logo is required");
      setCurrentStep(2);
      return;
    }
    if (!storeCover.trim()) {
      toast.error(app.lang === "ar" ? "صورة غلاف المتجر (Cover) مطلوبة" : "Store cover image is required");
      setCurrentStep(2);
      return;
    }
    
    if (!storePhone.trim()) {
      toast.error(app.lang === "ar" ? "رقم هاتف المتجر مطلوب" : "Store phone number is required");
      setCurrentStep(3);
      return;
    }
    if (!governorateId) {
      toast.error(app.lang === "ar" ? "الرجاء اختيار المحافظة" : "Please select governorate");
      setCurrentStep(3);
      return;
    }
    if (storeType === 'physical' && !address.trim()) {
      toast.error(app.lang === "ar" ? "العنوان مطلوب للمتاجر الحقيقية" : "Address required for physical stores");
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      await become.mutateAsync({
        userId: app.user.id,
        store_name: storeName.trim(),
        store_description: storeDesc,
        store_phone: storePhone.trim(),
        store_logo_url: storeLogo.trim(),
        store_cover_url: storeCover.trim(),
        allows_messaging: allowsMessaging,
        store_type: storeType,
        governorate_id: governorateId,
        address: storeType === 'physical' ? address.trim() : null,
        opening_time: openingTime,
        closing_time: closingTime,
        weekly_off_days: weeklyOffDays,
        application_type: 'store', 
      });
      
      await notifyAdminForStore(storeName.trim(), app.user.id);

      toast.success(
        app.lang === "ar" 
          ? "✅ تم إرسال طلبك بنجاح! سيتم مراجعته في أقرب وقت" 
          : "✅ Your application was sent successfully! It will be reviewed as soon as possible"
      );
      
      // ✅ ✅ ✅ تحديث الكاش بدلاً من إعادة تحميل الصفحة
      queryClient.invalidateQueries({ queryKey: ["seller_application", app.user.id] });
      queryClient.invalidateQueries({ queryKey: ["can_submit_application", app.user.id] });
      queryClient.invalidateQueries({ queryKey: ["profile", app.user.id] });
      
    } catch (e: any) {
      console.error("❌ Error submitting application:", e);
      const errorMessage = e.message || String(e);
      
      if (errorMessage.includes("لا يمكنك تقديم أكثر من طلب واحد")) {
        toast.error(app.lang === "ar" ? "⛔ لديك طلب سابق بالفعل" : "⛔ You already have an existing application");
      } else if (errorMessage.includes("لديك متجر مفعل")) {
        toast.error(app.lang === "ar" ? "✅ لديك متجر مفعل بالفعل" : "✅ You already have an active store");
      } else {
        toast.error(app.lang === "ar" ? `❌ فشل الإرسال: ${errorMessage}` : `❌ Submission failed: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [app.user, isSubmitting, canSubmitData, storeName, storeLogo, storeCover, storePhone, governorateId, storeType, address, storeDesc, allowsMessaging, openingTime, closingTime, weeklyOffDays, become, queryClient, app.lang]);

  // ====== ⏳ حالة التحميل ======
  if (appLoading || checkingLoading || rejectedLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#2a655f]" />
        <p className="text-muted-foreground">
          {app.lang === "ar" ? "جاري التحقق..." : "Checking..."}
        </p>
      </div>
    );
  }

  // ====== 📋 حالة: لديه طلب pending ======
  if (canSubmitData?.existingApplication?.status === 'pending') {
    const appData = canSubmitData.existingApplication;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl px-4 py-16 text-center"
      >
        <div className="rounded-3xl bg-gradient-to-br from-[#0d2e2a]/10 to-[#1a4f4a]/10 dark:from-[#0d2e2a]/30 dark:to-[#1a4f4a]/30 border-2 border-[#2a655f]/30 shadow-2xl p-8 md:p-12">
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] grid place-items-center mb-6 shadow-xl shadow-[#2a655f]/30"
          >
            <Clock className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
            {app.lang === "ar" ? "⏳ طلبك قيد المراجعة" : "⏳ Your application is pending"}
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            {app.lang === "ar"
              ? `طلبك للمتجر "${appData.store_name}" قيد المراجعة من قبل الأدمن`
              : `Your application for "${appData.store_name}" is being reviewed`}
          </p>
          
          {/* ✅ ✅ ✅ النص المعدل ✅ ✅ ✅ */}
          <div className="mb-6 p-4 rounded-xl bg-[#2a655f]/10 dark:bg-[#2a655f]/20 border border-[#2a655f]/30">
            <p className="text-[#2a655f] dark:text-[#3a8a82] font-medium flex items-center justify-center gap-2">
              <Clock className="h-5 w-5" />
              {app.lang === "ar"
                ? "⏳ سيتم مراجعة طلبك في أقرب وقت"
                : "⏳ Your application will be reviewed as soon as possible"}
            </p>
          </div>
          
          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white border-0 py-2 px-6 text-sm shadow-lg shadow-[#2a655f]/30">
            <Clock className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "⏳ بانتظار موافقة الأدمن" : "⏳ Awaiting admin approval"}
          </Badge>
        </div>
      </motion.div>
    );
  }

  // ====== 📋 حالة: لديه طلب approved ======
  if (canSubmitData?.existingApplication?.status === 'approved') {
    const appData = canSubmitData.existingApplication;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl px-4 py-16 text-center"
      >
        <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-2 border-emerald-200/50 dark:border-emerald-800/50 shadow-2xl p-8 md:p-12">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 grid place-items-center mb-6 shadow-xl shadow-emerald-500/30">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            {app.lang === "ar" ? "✅ تمت الموافقة على متجرك" : "✅ Your store is approved"}
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            {app.lang === "ar"
              ? `تمت الموافقة على متجر "${appData.store_name}" 🎉`
              : `Your store "${appData.store_name}" has been approved 🎉`}
          </p>
          <Button
            onClick={() => window.location.href = '/dashboard'}
            className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30"
          >
            {app.lang === "ar" ? "🚀 اذهب إلى متجرك" : "🚀 Go to your store"}
          </Button>
        </div>
      </motion.div>
    );
  }

  const rejected = application?.status === "rejected";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      
      {/* ✅ ✅ ✅ Hero Slider - احترافي مع صور واضحة (متل الأدمن) ✅ ✅ ✅ */}
      <HeroSlider app={app} />

      {/* Progress Steps - بألوان السستم */}
      <div className="mb-8 mt-6">
        <div className="flex items-center justify-between gap-2">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex items-center gap-2">
              <button
                onClick={() => setCurrentStep(step)}
                className={`
                  flex items-center justify-center h-10 w-10 rounded-full text-sm font-bold transition-all duration-300 shrink-0
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white shadow-lg shadow-[#0d2e2a]/30' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                  ${currentStep > step ? 'scale-95' : ''}
                `}
              >
                {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
              </button>
              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] transition-all duration-500"
                  style={{ width: currentStep > step ? '100%' : currentStep === step ? '50%' : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span className={currentStep >= 1 ? 'text-[#2a655f] font-medium' : ''}>
            {app.lang === "ar" ? "المتجر" : "Store"}
          </span>
          <span className={currentStep >= 2 ? 'text-[#2a655f] font-medium' : ''}>
            {app.lang === "ar" ? "الصور" : "Images"}
          </span>
          <span className={currentStep >= 3 ? 'text-[#2a655f] font-medium' : ''}>
            {app.lang === "ar" ? "التفاصيل" : "Details"}
          </span>
        </div>
      </div>

      {/* ✅ عرض سبب الرفض */}
      {rejected && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 rounded-2xl border-2 border-amber-500/30 bg-amber-500/10 p-5 text-sm backdrop-blur"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <div className="font-bold text-amber-600 dark:text-amber-400 mb-1">
                {app.lang === "ar" ? "📋 سبب رفض طلبك السابق" : "📋 Reason for rejection"}
              </div>
              <div className="text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                {application?.admin_note || (app.lang === "ar" ? "لم يتم تحديد سبب" : "No reason specified")}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {app.lang === "ar" 
                  ? `⏳ تم الرفض في: ${new Date(application?.updated_at).toLocaleDateString('ar-SA')}`
                  : `⏳ Rejected on: ${new Date(application?.updated_at).toLocaleDateString()}`}
              </div>
              <div className="text-sm text-amber-600 dark:text-amber-400 mt-2 font-medium">
                {app.lang === "ar" 
                  ? "💡 يمكنك تعديل بياناتك وإعادة التقديم"
                  : "💡 You can update your details and re-apply"}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Form - بألوان السستم */}
      <div className="rounded-3xl bg-card border border-[#2a655f]/20 shadow-2xl shadow-[#2a655f]/10 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#2a655f]/20">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] grid place-items-center text-white font-black text-sm shadow-lg shadow-[#0d2e2a]/30">
            {rejected ? '♻️' : currentStep}
          </div>
          <div>
            <div className="font-black text-lg text-slate-800 dark:text-white">
              {app.lang === "ar" 
                ? rejected ? "إعادة تقديم الطلب" : currentStep === 1 ? "معلومات متجرك" : currentStep === 2 ? "صور متجرك" : "تفاصيل إضافية"
                : rejected ? "Re-apply" : currentStep === 1 ? "Store details" : currentStep === 2 ? "Store images" : "Additional details"
              }
            </div>
            <div className="text-xs text-muted-foreground">
              {app.lang === "ar" 
                ? rejected ? "عدل بياناتك وأرسل طلباً جديداً" : currentStep === 1 ? "أختر اسماً مميزاً لمتجرك" : currentStep === 2 ? "أضف صوراً جذابة" : "أكمل معلومات متجرك"
                : rejected ? "Update your details and submit a new application" : currentStep === 1 ? "Choose a unique name for your store" : currentStep === 2 ? "Add attractive images" : "Complete your store details"
              }
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Store Info */}
          {currentStep === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <span className="text-red-500">*</span> {app.lang === "ar" ? "اسم المتجر" : "Store name"}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({storeName.length}/50)
                  </span>
                </Label>
                <div className="relative mt-1.5">
                  <AnimatedIcon Icon={Store} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f]" color="text-[#2a655f]" size="h-4 w-4" delay={0} />
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value.slice(0, 50))}
                    placeholder={app.lang === "ar" ? "مثلاً: متجر الأناقة" : "e.g. Elegance Store"}
                    className="pl-10 h-12 rounded-xl border-[#2a655f]/30 bg-[#2a655f]/5 text-base focus:ring-2 focus:ring-[#2a655f]/30 transition-all"
                  />
                </div>
                {storeName.length > 0 && storeName.length < 2 && (
                  <p className="text-xs text-amber-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {app.lang === "ar" ? "⚠️ الاسم قصير جداً (يلزم حرفين على الأقل)" : "⚠️ Name is too short (at least 2 characters)"}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {app.lang === "ar" 
                    ? "💡 يمكنك استخدام أي اسم، غير مقيد (قابل للتكرار)"
                    : "💡 You can use any name, not unique (can be repeated)"}
                </p>
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {app.lang === "ar" ? "وصف المتجر" : "Store description"}
                </Label>
                <div className="relative mt-1.5">
                  <AnimatedIcon Icon={Info} className="absolute left-3 top-3 h-4 w-4 text-[#2a655f]" color="text-[#2a655f]" size="h-4 w-4" delay={100} />
                  <Textarea
                    rows={3}
                    value={storeDesc}
                    onChange={(e) => setStoreDesc(e.target.value)}
                    placeholder={app.lang === "ar" ? "وصف قصير يعرّف زبائنك بمتجرك" : "A short line to introduce your store"}
                    className="pl-10 rounded-xl border-[#2a655f]/30 bg-[#2a655f]/5 focus:ring-2 focus:ring-[#2a655f]/30 transition-all resize-none"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {app.lang === "ar" ? "اختياري — يمكنك إضافته لاحقاً" : "Optional — you can add it later"}
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 2: Images */}
          {currentStep === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="rounded-2xl border-2 border-[#2a655f]/30 bg-[#2a655f]/5 p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-[#2a655f]/10 flex items-center justify-center shrink-0 animate-pulse">
                    <Sparkles className="h-5 w-5 text-[#2a655f]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2a655f]">
                      {app.lang === "ar" ? "💡 نصيحة احترافية" : "💡 Pro tip"}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {app.lang === "ar"
                        ? "الصور الاحترافية تزيد ثقة الزبائن ومبيعاتك بنسبة تصل إلى 80%"
                        : "Professional images increase customer trust and sales by up to 80%"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-4 w-4 text-[#2a655f]" />
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {app.lang === "ar" ? "شعار المتجر (Logo)" : "Store logo"}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                    </div>
                    <ImageInput
                      value={storeLogo}
                      onChange={setStoreLogo}
                      userId={app.user?.id}
                      folder="store-logo"
                      lang={app.lang}
                      required
                      hint={app.lang === "ar" ? "مربعة، خلفية واضحة، دقة عالية (500×500 فأعلى)" : "Square, clear background, 500×500 or higher"}
                      previewClassName="h-28 w-28 rounded-2xl border-2 border-[#2a655f]/30"
                    />
                    {!storeLogo && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {app.lang === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <Image className="h-4 w-4 text-[#2a655f]" />
                      <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {app.lang === "ar" ? "صورة الغلاف (Cover)" : "Cover image"}
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                    </div>
                    <ImageInput
                      value={storeCover}
                      onChange={setStoreCover}
                      userId={app.user?.id}
                      folder="store-cover"
                      lang={app.lang}
                      required
                      hint={app.lang === "ar" ? "أفقية، 1600×600 أو أعلى، تعبّر عن نشاطك" : "Landscape, 1600×600 or higher, represents your business"}
                      previewClassName="h-32 rounded-2xl border-2 border-[#2a655f]/30"
                    />
                    {!storeCover && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {app.lang === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Additional Details */}
          {currentStep === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div className="relative">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <Phone className="h-4 w-4 text-[#2a655f]" />
                  {app.lang === "ar" ? "رقم هاتف المتجر" : "Store phone"}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <AnimatedIcon Icon={Phone} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f]" color="text-[#2a655f]" size="h-4 w-4" delay={200} />
                  <Input
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    placeholder="+963 9xx xxx xxx"
                    dir="ltr"
                    className="pl-10 h-12 rounded-xl border-[#2a655f]/30 bg-[#2a655f]/5 focus:ring-2 focus:ring-[#2a655f]/30 transition-all"
                  />
                </div>
                {!storePhone && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {app.lang === "ar" ? "هذا الحقل مطلوب" : "This field is required"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {app.lang === "ar" ? "نوع المتجر" : "Store Type"}
                </Label>
                <RadioGroup
                  value={storeType}
                  onValueChange={(value: 'online' | 'physical') => setStoreType(value)}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className={`
                    relative rounded-xl border-2 p-4 cursor-pointer transition-all
                    ${storeType === 'online' 
                      ? 'border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20' 
                      : 'border-border hover:border-[#2a655f]/50'
                    }
                  `}>
                    <RadioGroupItem value="online" id="online" className="sr-only" />
                    <Label htmlFor="online" className="flex flex-col items-center gap-2 cursor-pointer">
                      <AnimatedIcon Icon={Globe} className="h-6 w-6 text-[#2a655f]" color="text-[#2a655f]" size="h-6 w-6" delay={300} />
                      <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                        {app.lang === "ar" ? "اونلاين" : "Online"}
                      </span>
                      <span className="text-xs text-muted-foreground text-center">
                        {app.lang === "ar" ? "بيع منتجاتك عبر الإنترنت" : "Sell your products online"}
                      </span>
                    </Label>
                  </div>
                  <div className={`
                    relative rounded-xl border-2 p-4 cursor-pointer transition-all
                    ${storeType === 'physical' 
                      ? 'border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20' 
                      : 'border-border hover:border-[#2a655f]/50'
                    }
                  `}>
                    <RadioGroupItem value="physical" id="physical" className="sr-only" />
                    <Label htmlFor="physical" className="flex flex-col items-center gap-2 cursor-pointer">
                      <AnimatedIcon Icon={Building} className="h-6 w-6 text-[#2a655f]" color="text-[#2a655f]" size="h-6 w-6" delay={400} />
                      <span className="font-medium text-sm text-slate-700 dark:text-slate-200">
                        {app.lang === "ar" ? "متجر حقيقي" : "Physical Store"}
                      </span>
                      <span className="text-xs text-muted-foreground text-center">
                        {app.lang === "ar" ? "بيع منتجاتك من موقعك" : "Sell from your location"}
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* ✅ ✅ ✅ المحافظة مع Search ✅ ✅ ✅ */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <MapPin className="inline h-4 w-4 text-[#2a655f]" />
                  {app.lang === "ar" ? "المحافظة" : "Governorate"}
                  <span className="text-red-500">*</span>
                </Label>
                
                <Select value={governorateId} onValueChange={setGovernorateId}>
                  <SelectTrigger className="h-12 rounded-xl border-[#2a655f]/30 bg-[#2a655f]/5 focus:ring-2 focus:ring-[#2a655f]/30 transition-all">
                    <SelectValue placeholder={app.lang === "ar" ? "🔍 ابحث عن المحافظة..." : "🔍 Search governorate..."} />
                  </SelectTrigger>
                  <SelectContent className="max-h-72 overflow-y-auto">
                    {/* ✅ حقل البحث داخل القائمة */}
                    <div className="sticky top-0 z-10 bg-white dark:bg-slate-950 p-2 border-b border-[#2a655f]/20">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f]/60" />
                        <Input
                          placeholder={app.lang === "ar" ? "🔍 ابحث..." : "🔍 Search..."}
                          className="pl-9 h-9 rounded-lg border-[#2a655f]/20 focus:ring-2 focus:ring-[#2a655f]/30 text-sm"
                          onChange={(e) => {
                            const searchTerm = e.target.value.toLowerCase();
                            const items = document.querySelectorAll('.governorate-item');
                            items.forEach((item) => {
                              const text = item.textContent?.toLowerCase() || '';
                              (item as HTMLElement).style.display = text.includes(searchTerm) ? 'flex' : 'none';
                            });
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* ✅ قائمة المحافظات - استخدام useMemo */}
                    {governorateOptions.map((gov: any) => (
                      <SelectItem 
                        key={gov.id} 
                        value={gov.id}
                        className="governorate-item cursor-pointer hover:bg-[#2a655f]/10 data-[state=checked]:bg-[#2a655f]/20 data-[state=checked]:text-[#2a655f] data-[state=checked]:font-semibold rounded-lg transition-all duration-200"
                      >
                        <span className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-[#2a655f]/60" />
                          {gov.name}
                        </span>
                      </SelectItem>
                    ))}
                    
                    {/* ✅ إذا كانت القائمة فارغة */}
                    {governorates.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        {app.lang === "ar" ? "لا توجد محافظات" : "No governorates found"}
                      </div>
                    )}
                  </SelectContent>
                </Select>
                
                {!governorateId && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {app.lang === "ar" ? "الرجاء اختيار المحافظة" : "Please select a governorate"}
                  </p>
                )}
              </div>

              {storeType === 'physical' && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <MapPin className="inline h-4 w-4 text-[#2a655f]" />
                    {app.lang === "ar" ? "العنوان التفصيلي" : "Detailed Address"}
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative mt-1.5">
                    <AnimatedIcon Icon={MapPin} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f]" color="text-[#2a655f]" size="h-4 w-4" delay={500} />
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={app.lang === "ar" ? "مثال: شارع الثورة، بناء رقم 10" : "e.g. Al-Thawra St., Building 10"}
                      className="pl-10 h-12 rounded-xl border-[#2a655f]/30 bg-[#2a655f]/5 focus:ring-2 focus:ring-[#2a655f]/30 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <ClockIcon className="inline h-4 w-4 text-[#2a655f]" />
                    {app.lang === "ar" ? "وقت الفتح" : "Opening Time"}
                  </Label>
                  <Input
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                    className="h-12 rounded-xl border-[#2a655f]/30 bg-[#2a655f]/5 focus:ring-2 focus:ring-[#2a655f]/30 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                    <ClockIcon className="inline h-4 w-4 text-[#2a655f]" />
                    {app.lang === "ar" ? "وقت الإغلاق" : "Closing Time"}
                  </Label>
                  <Input
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                    className="h-12 rounded-xl border-[#2a655f]/30 bg-[#2a655f]/5 focus:ring-2 focus:ring-[#2a655f]/30 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <Calendar className="inline h-4 w-4 text-[#2a655f]" />
                  {app.lang === "ar" ? "أيام العطل الأسبوعية" : "Weekly Off Days"}
                </Label>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl border-2 border-[#2a655f]/30 bg-[#2a655f]/5">
                  {WEEK_DAYS.map((day) => (
                    <label key={day.value} className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg hover:bg-[#2a655f]/10 transition-all">
                      <input
                        type="checkbox"
                        checked={weeklyOffDays.includes(day.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWeeklyOffDays([...weeklyOffDays, day.value]);
                          } else {
                            setWeeklyOffDays(weeklyOffDays.filter(d => d !== day.value));
                          }
                        }}
                        className="h-4 w-4 accent-[#2a655f] rounded"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-200">{day.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {app.lang === "ar" ? "اختر الأيام التي يكون فيها المتجر مغلقاً" : "Select days when the store is closed"}
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[#2a655f]/30 bg-[#2a655f]/5 p-4 space-y-3">
                <div className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                  {app.lang === "ar" ? "خيارات التواصل" : "Contact options"}
                </div>
                <label className="flex items-start gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#2a655f]/10 transition-all">
                  <input
                    type="checkbox"
                    checked={allowsMessaging}
                    onChange={(e) => setAllowsMessaging(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#2a655f] rounded"
                  />
                  <div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {app.lang === "ar" ? "السماح بالمراسلة" : "Allow messaging"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "يقدر الزبون يراسلك داخل السستم" : "Customers can message you inside the app"}
                    </div>
                  </div>
                </label>
                {/* ✅ تم حذف خيار "السماح بالحجز" نهائياً */}
              </div>
            </motion.div>
          )}

          {/* ✅ Navigation Buttons - مع اتجاه الأسهم حسب اللغة */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#2a655f]/20">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={goToPreviousStep}
                className="h-12 px-6 rounded-xl border-[#2a655f]/30 hover:bg-[#2a655f]/10 transition-all"
              >
                {isRTL ? (
                  <ArrowRight className="h-4 w-4 ml-2" />
                ) : (
                  <ArrowLeft className="h-4 w-4 mr-2" />
                )}
                {app.lang === "ar" ? "السابق" : "Previous"}
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button
                onClick={goToNextStep}
                disabled={!isStepValid(currentStep)}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white font-bold shadow-lg shadow-[#0d2e2a]/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {app.lang === "ar" ? "التالي" : "Next"}
                {isRTL ? (
                  <ArrowLeft className="h-4 w-4 mr-2" />
                ) : (
                  <ArrowRight className="h-4 w-4 ml-2" />
                )}
              </Button>
            ) : (
              <Button
                onClick={handleBecome}
                disabled={become.isPending || isSubmitting || !isStepValid(3)}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white font-bold shadow-lg shadow-[#2a655f]/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {become.isPending || isSubmitting ? (
                  <span className="flex items-center gap-2 relative z-10">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {app.lang === "ar" ? "جاري الإرسال..." : "Submitting..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 relative z-10">
                    <Store className="h-4 w-4" />
                    {app.lang === "ar" ? "🚀 أرسل طلب فتح المتجر" : "🚀 Submit store application"}
                  </span>
                )}
              </Button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 pt-4">
            {[1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setCurrentStep(step)}
                className={`
                  h-2 rounded-full transition-all duration-300
                  ${currentStep === step ? 'w-8 bg-[#2a655f]' : 'w-2 bg-muted hover:bg-muted/80'}
                  ${currentStep > step ? 'bg-[#3a8a82]' : ''}
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ✅ CSS Animations */}
      <style>{`
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(3deg); }
          75% { transform: translateY(4px) rotate(-2deg); }
        }
        .animate-float-icon {
          animation: float-icon 3s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 3s ease-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}