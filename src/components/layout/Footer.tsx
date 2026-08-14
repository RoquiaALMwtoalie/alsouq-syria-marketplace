// src/components/Footer.tsx

import { Link, useLocation } from "@tanstack/react-router";
import { 
  House, Twitter, Instagram, Facebook, Youtube, Globe, 
  MapPin, Phone, Mail, Clock, Sparkles, Zap, Rocket,
  Shield, Award, Heart, ShoppingBag, Store, Package,
  Truck, Headphones, MessageCircle, ThumbsUp, Star,
  ArrowUp, ArrowRight, CreditCard, Lock, Users, Briefcase,
  Compass, TrendingUp, Gift, Gem, Crown, Flame,
  Leaf, Sun, Moon, ChevronUp, ChevronDown, LayoutDashboard,
  Calendar, HelpCircle, FileText, 
  X, Send, CheckCircle,
  type LucideIcon
} from "lucide-react";
import { useApp, useT } from "@/lib/i18n";
import { useCategories } from "@/lib/queries";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ✅ أيقونة مع تموجات مستمرة
const FloatingIcon = ({ 
  Icon, 
  className = "",
  delay = 0,
  size = "h-4 w-4"
}: { 
  Icon: LucideIcon, 
  className?: string,
  delay?: number,
  size?: string
}) => {
  return (
    <div 
      className="relative inline-block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-float">
        <Icon className={cn(
          "transition-all duration-300",
          size,
          className
        )} />
      </div>
      <span className="absolute -inset-2 rounded-full border border-pink-400/20 animate-ripple" />
      <span className="absolute -inset-4 rounded-full border border-pink-400/10 animate-ripple delay-700" />
      <span className="absolute -inset-6 rounded-full border border-pink-400/5 animate-ripple delay-1500" />
    </div>
  );
};

// ✅ شريط رموز متحركة (يستخدم فقط في الأعلى) - مع لون وردي
const FloatingIconsBar = () => {
  const icons = [
    { Icon: Star, delay: 0 },
    { Icon: Heart, delay: 100 },
    { Icon: Zap, delay: 200 },
    { Icon: Rocket, delay: 300 },
    { Icon: Gem, delay: 400 },
    { Icon: Crown, delay: 500 },
    { Icon: Flame, delay: 600 },
    { Icon: Sparkles, delay: 700 },
    { Icon: Shield, delay: 800 },
    { Icon: Award, delay: 900 },
    { Icon: Gift, delay: 1000 },
    { Icon: Compass, delay: 1100 },
  ];

  return (
    <div className="relative w-full overflow-hidden py-3 border-y border-pink-400/20 dark:border-pink-400/30">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-[#3a8a82]/5 to-pink-500/5" />
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
        {[...icons, ...icons].map((item, index) => (
          <div key={index} className="flex items-center gap-8">
            <FloatingIcon 
              Icon={item.Icon} 
              className="text-pink-400/60 dark:text-pink-400/60 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
              delay={item.delay + (index % icons.length) * 50}
              size="h-5 w-5"
            />
            {index < icons.length * 2 - 1 && (
              <span className="text-pink-400/20 dark:text-pink-400/20">✦</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export function Footer() {
  const location = useLocation();
  const t = useT();
  const app = useApp();
  const year = new Date().getFullYear();
  const { data: dbCategories = [] } = useCategories();

  // ✅ State لنافذة الدعم
  const [supportOpen, setSupportOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ إخفاء الفوتر في صفحات الشات
  const isChatPage = 
    location.pathname.startsWith('/messages_/') ||
    location.pathname.startsWith('/messages/') ||
    location.pathname.includes('/messages_') ||
    location.pathname.includes('/messages/$userId');
  
  if (isChatPage) return null;

  const platformLinks = [
    { label: app.lang === "ar" ? "لوحة التحكم" : "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: app.lang === "ar" ? "الرسائل" : "Messages", href: "/messages", icon: MessageCircle },
    { label: app.lang === "ar" ? "الطلبات" : "Orders", href: "/orders", icon: Package },
    { label: app.lang === "ar" ? "الحجوزات" : "Bookings", href: "/bookings", icon: Calendar },
    { label: app.lang === "ar" ? "التقارير" : "Reports", href: "/reports", icon: TrendingUp },
  ];

  const supportLinks = [
    { 
      label: app.lang === "ar" ? "الأسئلة الشائعة" : "FAQ", 
      href: "/faq",
      icon: HelpCircle 
    },
    { 
      label: app.lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy", 
      href: "/privacy", 
      icon: Shield 
    },
    { 
      label: app.lang === "ar" ? "الشروط والأحكام" : "Terms", 
      href: "/terms", 
      icon: FileText 
    },
  ];

  const socialLinks = [
    { icon: Twitter, label: "Twitter", color: "text-[#1a9cd8]", bg: "hover:bg-[#1a9cd8]/10", delay: 0 },
    { icon: Instagram, label: "Instagram", color: "text-pink-500", bg: "hover:bg-pink-500/10", delay: 100 },
    { icon: Facebook, label: "Facebook", color: "text-[#1877f2]", bg: "hover:bg-[#1877f2]/10", delay: 200 },
    { icon: Youtube, label: "YouTube", color: "text-red-500", bg: "hover:bg-red-500/10", delay: 300 },
    { icon: Globe, label: "Website", color: "text-pink-400", bg: "hover:bg-pink-500/10", delay: 400 },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ ✅ ✅ دالة إرسال رسالة الدعم
  const handleSubmitSupport = async () => {
    const phone = app.user?.phone || visitorPhone.trim();
    if (!phone) {
      toast.error(app.lang === "ar" ? "الرجاء إدخال رقم هاتفك للتواصل معك" : "Please enter your phone number");
      return;
    }
    
    if (!message.trim()) {
      toast.error(app.lang === "ar" ? "الرجاء كتابة رسالتك" : "Please write your message");
      return;
    }

    setIsLoading(true);
    try {
      const { data: adminData, error: adminError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1)
        .single();

      if (adminError || !adminData) {
        toast.error(app.lang === "ar" ? "حدث خطأ، يرجى المحاولة لاحقاً" : "Error, please try again later");
        return;
      }

      const adminId = adminData.user_id;
      const userId = app.user?.id || adminId;
      const userPhone = app.user?.phone || visitorPhone.trim();
      const isRegistered = !!app.user;

      const { data: newConversation, error: convError } = await supabase
        .from("conversations")
        .insert({
          participant1_id: userId,
          participant2_id: adminId,
          last_message: message.substring(0, 100),
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (convError) throw convError;
      const conversationId = newConversation.id;

      const { error: msgError } = await supabase
        .from("messages")
        .insert({
          sender_id: userId,
          receiver_id: adminId,
          conversation_id: conversationId,
          content: `📩 رسالة دعم\n📞 من: ${userPhone}\n${isRegistered ? '✅ مستخدم مسجل' : '❌ زائر (ليس لديه حساب)'}\nالموضوع: ${subject || "دعم"}\n\nالرسالة:\n${message}`,
          type: "text",
          created_at: new Date().toISOString(),
        });

      if (msgError) throw msgError;

      await supabase
        .from("notifications")
        .insert({
          user_id: adminId,
          type: "support",
          title_ar: "📩 رسالة دعم جديدة",
          body_ar: `📞 من: ${userPhone}\n${isRegistered ? '✅ مسجل' : '❌ زائر'}\nالموضوع: ${subject || "دعم"}`,
          reference_id: conversationId,
          link_url: `/messages/${conversationId}`,
          created_at: new Date().toISOString(),
        });

      setIsSuccess(true);
      setTimeout(() => {
        setSupportOpen(false);
        setIsSuccess(false);
        setMessage("");
        setSubject("");
        setVisitorPhone("");
      }, 2000);

      toast.success(
        app.lang === "ar" 
          ? "✅ تم إرسال رسالتك بنجاح! سنرد عليك خلال ثواني ⚡" 
          : "✅ Message sent successfully! We'll reply within seconds ⚡"
      );

    } catch (error) {
      console.error("Error sending support message:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ أثناء الإرسال" : "Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer 
      id="main-footer"
      className="relative mt-20 overflow-hidden text-white"
    >
      {/* ✅ خلفية الفوتر الأساسية بلون #2a655f */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundColor: '#2a655f',
          backgroundImage: 'none !important',
          background: '#2a655f !important'
        }}
      />
      
      {/* ✅ تأثيرات زجاجية وتموجات بصرية */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-pink-500/15 backdrop-blur-2xl" />
      
      {/* ✅ Border علوي ناعم ومضيء بلون وردي */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent shadow-[0_0_20px_rgba(244,114,182,0.8)]" />
      
      {/* ✅ دوائر وأشكال متحركة (أمواج بصرية) */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-pink-500/15 blur-3xl animate-float-wave" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-pink-400/15 blur-3xl animate-float-wave-delayed" />

      {/* ✅ شريط الأيقونات المتحركة في الأعلى */}
     

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        
        {/* ===== شريط الميزات السريعة المتحرك داخل الفوتر ===== */}
        <div className="mb-12 overflow-hidden py-3 rounded-2xl bg-black/25 border border-pink-400/30 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-10 animate-marquee whitespace-nowrap text-xs font-bold text-pink-300">
            <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-pink-400 animate-spin" /> {app.lang === "ar" ? "✨ توصيل سريع وآمن لكافة المحافظات" : "✨ Fast & Secure Delivery"}</span>
            <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-pink-400" /> {app.lang === "ar" ? "🛡️ ضمان استرجاع الأموال بنسبة 100%" : "🛡️ 100% Money Back Guarantee"}</span>
            <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-pink-400 animate-pulse" /> {app.lang === "ar" ? "💬 دعم فني متواصل على مدار الساعة" : "💬 24/7 Customer Support"}</span>
            <span className="flex items-center gap-2"><Award className="h-4 w-4 text-pink-400" /> {app.lang === "ar" ? "⭐ منتجات أصلية ومضمونة من السوق" : "⭐ Verified Original Products"}</span>
          </div>
        </div>

        {/* ===== القسم الرئيسي (الأعمدة الأربعة) ===== */}
        <div className="grid gap-10 md:grid-cols-12 mb-12">
          
          {/* العمود الأول: الهوية والنبذة */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3.5 group">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-white/15 border border-pink-400/40 flex items-center justify-center shadow-xl shadow-pink-500/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <House className="h-7 w-7 text-pink-300 animate-bounce-short" />
                </div>
                <span className="absolute -inset-1 rounded-2xl bg-pink-400/30 blur-lg animate-pulse" />
              </div>
              <div>
                <div className="font-black text-2xl tracking-tight text-white flex items-center gap-2">
                  {t("brand")}
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-pink-400 animate-ping" />
                </div>
                <div className="text-[11px] text-pink-300 tracking-widest uppercase font-bold mt-0.5 flex items-center gap-1.5">
                  <span className="h-0.5 w-4 bg-pink-400" />
                  {t("tagline")}
                  <span className="h-0.5 w-4 bg-pink-400" />
                </div>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-sm font-medium">
              {app.lang === "ar"
                ? "منصتك التجارية المتكاملة لتجربة تسوق سورية ذكية، سريعة، ومضمونة بمعايير عالمية."
                : "Your ultimate Syrian platform for a smart, fast, and secure shopping experience."}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[
                { icon: Shield, label: app.lang === "ar" ? "آمن 100%" : "100% Secure" },
                { icon: Award, label: app.lang === "ar" ? "موثوق" : "Trusted" },
                { icon: Rocket, label: app.lang === "ar" ? "دعم 24/7" : "24/7 Support" },
              ].map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <span 
                    key={i}
                    className="px-3 py-1 rounded-full border border-pink-400/30 bg-black/30 flex items-center gap-1.5 text-[11px] text-white font-medium hover:scale-105 hover:bg-pink-400/20 transition-all shadow-sm"
                  >
                    <span className="h-5 w-5 rounded-full bg-[#0d2e2a] border border-pink-400/60 flex items-center justify-center">
                      <Icon className="h-3 w-3 text-pink-400" />
                    </span>
                    {badge.label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* العمود الثاني: روابط المنصة */}
          <div className="md:col-span-2 md:col-start-6 space-y-3">
            <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
              <span className="h-1.5 w-4 rounded-full bg-pink-400 animate-pulse" />
              {app.lang === "ar" ? "المنصة والأقسام" : "Platform"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {platformLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <li key={i}>
                    <Link
                      to={link.href}
                      className="group flex items-center gap-2.5 text-white/80 hover:text-pink-300 transition-all font-medium"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-pink-400/60 group-hover:w-2.5 group-hover:bg-pink-400 transition-all" />
                      <span className="h-6 w-6 rounded-lg bg-[#0d2e2a] border border-pink-400/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="h-3.5 w-3.5 text-pink-300" />
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* العمود الثالث: الدعم والسياسات */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
              <span className="h-1.5 w-4 rounded-full bg-pink-400 animate-pulse" />
              {app.lang === "ar" ? "الدعم والسياسات" : "Support"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {supportLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <li key={i}>
                    <Link
                      to={link.href as any}
                      className="group flex items-center gap-2.5 text-white/80 hover:text-pink-300 transition-all font-medium"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-pink-400/60 group-hover:w-2.5 group-hover:bg-pink-400 transition-all" />
                      <span className="h-6 w-6 rounded-lg bg-[#0d2e2a] border border-pink-400/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Icon className="h-3.5 w-3.5 text-pink-300" />
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
              
              {/* ✅ ✅ ✅ زر المساعدة والدعم - يفتح نافذة الدعم المنبثقة */}
              <li>
                <button
                  onClick={() => setSupportOpen(true)}
                  className="group flex items-center gap-2.5 text-white/80 hover:text-pink-300 transition-all w-full text-start cursor-pointer font-medium"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400/60 group-hover:w-2.5 group-hover:bg-pink-400 transition-all" />
                  <span className="h-6 w-6 rounded-lg bg-[#0d2e2a] border border-pink-400/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Headphones className="h-3.5 w-3.5 text-pink-300" />
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    {app.lang === "ar" ? "المساعدة والدعم" : "Support & Help"}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* العمود الرابع: معلومات التواصل المباشر */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-pink-300 uppercase tracking-wider flex items-center gap-2">
              <span className="h-1.5 w-4 rounded-full bg-pink-400 animate-pulse" />
              {app.lang === "ar" ? "معلومات التواصل" : "Contact Us"}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2.5 text-white/90 group font-medium">
                <div className="h-7 w-7 rounded-lg bg-[#0d2e2a] border border-pink-400/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm">
                  <MapPin className="h-3.5 w-3.5 text-pink-300" />
                </div>
                <span>{app.lang === "ar" ? "دمشق، سوريا" : "Damascus, Syria"}</span>
              </li>
              <li className="flex items-center gap-2.5 text-white/90 group font-medium">
                <div className="h-7 w-7 rounded-lg bg-[#0d2e2a] border border-pink-400/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm">
                  <Phone className="h-3.5 w-3.5 text-pink-300" />
                </div>
                <a href="tel:+963110000000" dir="ltr" className="hover:underline text-pink-200">+963 11 000 0000</a>
              </li>
              <li className="flex items-center gap-2.5 text-white/90 group font-medium">
                <div className="h-7 w-7 rounded-lg bg-[#0d2e2a] border border-pink-400/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm">
                  <Mail className="h-3.5 w-3.5 text-pink-300" />
                </div>
                <a href="mailto:hello@alsouq.sy" className="hover:underline text-pink-200">hello@alsouq.sy</a>
              </li>
              <li className="flex items-center gap-2.5 text-white/90 group font-medium">
                <div className="h-7 w-7 rounded-lg bg-[#0d2e2a] border border-pink-400/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-sm">
                  <Clock className="h-3.5 w-3.5 text-pink-300" />
                </div>
                <span>{app.lang === "ar" ? "خدمة العملاء: 24/7" : "Support: 24/7"}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ===== القسم الأوسط: شبكة أزرار السوشيال ميديا ===== */}
        <div className="py-6 border-t border-b border-white/15 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-black/20 px-6 rounded-2xl backdrop-blur-sm shadow-inner">
          <div className="text-center md:text-start">
            <h5 className="font-bold text-white text-xs mb-0.5 flex items-center gap-2 justify-center md:justify-start">
              <span className="h-2 w-2 rounded-full bg-pink-400 animate-ping" />
              {app.lang === "ar" ? "ابق على تواصل معنا عبر منصاتنا" : "Connect with our social channels"}
            </h5>
            <p className="text-[11px] text-white/70">
              {app.lang === "ar" ? "تابعنا ليصلك كل جديد وعروض السوق الحصرية." : "Follow us for exclusive market offers."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social, i) => {
              const Icon = social.icon;
              return (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="group relative h-11 w-11 rounded-xl bg-[#0d2e2a] border border-pink-400/50 hover:bg-pink-400 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-lg"
                >
                  <Icon className="h-5 w-5 text-pink-300 group-hover:text-[#0d2e2a] group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
                  <span className="absolute -inset-1 rounded-xl bg-pink-400/30 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              );
            })}
          </div>
        </div>

        {/* ===== الفوتر السفلي (الحقوق وشارة الأمان المشفرة) ===== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/80">
          <div className="flex items-center gap-2 font-medium">
            <span className="text-pink-400 font-bold text-xs">© {year}</span>
            <span className="font-bold text-white">{t("brand")}</span>
            <span>• {app.lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d2e2a] border border-pink-400/50 shadow-inner backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-400" />
            </span>
            <span className="text-pink-300 font-bold text-[11px] tracking-wide">
              {app.lang === "ar" ? "نظام تجاري مشفر وآمن 100%" : "100% Secure Encrypted System"}
            </span>
          </div>
        </div>
      </div>

      {/* ===== 🗑️ تم حذف شريط الرموز المتحركة في الأسفل ===== */}

      {/* ===== زر العودة للأعلى ===== */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 group h-14 w-14 rounded-2xl bg-[#0d2e2a] text-pink-300 border-2 border-pink-400/60 shadow-2xl shadow-pink-500/40 hover:scale-110 hover:-translate-y-2 transition-all duration-500 flex items-center justify-center cursor-pointer font-extrabold"
        aria-label="Back to top"
      >
        <span className="absolute -inset-1 rounded-2xl bg-pink-400/40 blur-xl animate-pulse" />
        <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300" />
      </button>

      {/* ===== ✅ نافذة الدعم المنبثقة ===== */}
      {supportOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSupportOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-[#0d2e2a] rounded-3xl max-w-md w-full shadow-2xl border border-pink-400/30 animate-in zoom-in-95 duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] p-6 border-b border-pink-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-pink-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {app.lang === "ar" ? "الدعم والمساعدة" : "Support & Help"}
                      </h3>
                      <p className="text-pink-300/80 text-sm">
                        {app.lang === "ar" ? "نحن هنا لمساعدتك 💙" : "We're here to help 💙"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSupportOpen(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-pink-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      {app.lang === "ar" ? "تم الإرسال ✅" : "Sent ✅"}
                    </h4>
                    <p className="text-sm text-pink-300/80 mt-1">
                      {app.lang === "ar" 
                        ? "سنرد عليك خلال ثواني ⚡" 
                        : "We'll reply within seconds ⚡"}
                    </p>
                  </div>
                ) : (
                  <>
                    {app.user ? (
                      <div>
                        <Label className="text-sm font-semibold text-white/90">
                          {app.lang === "ar" ? "رقم هاتفك" : "Your Phone"}
                        </Label>
                        <Input
                          type="tel"
                          value={app.user?.phone || "غير متاح"}
                          disabled
                          className="mt-1.5 h-11 rounded-xl bg-white/10 border-pink-400/20 text-white cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label className="text-sm font-semibold text-white/90">
                          {app.lang === "ar" ? "رقم الهاتف *" : "Phone Number *"}
                        </Label>
                        <Input
                          type="tel"
                          value={visitorPhone}
                          onChange={(e) => setVisitorPhone(e.target.value)}
                          placeholder="+963 9xx xxx xxx"
                          className="mt-1.5 h-11 rounded-xl bg-white/5 border-pink-400/20 text-white placeholder:text-white/40 focus:border-pink-400/50 transition-all"
                          required
                        />
                        <p className="text-[10px] text-white/40 mt-1">
                          {app.lang === "ar" 
                            ? "سنستخدم رقمك للتواصل معك" 
                            : "We'll use your number to contact you"}
                        </p>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-semibold text-white/90">
                        {app.lang === "ar" ? "الموضوع" : "Subject"}
                      </Label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={app.lang === "ar" ? "مشكلة في إنشاء الحساب" : "Registration issue"}
                        className="mt-1.5 h-11 rounded-xl bg-white/5 border-pink-400/20 text-white placeholder:text-white/40 focus:border-pink-400/50 transition-all"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold text-white/90">
                        {app.lang === "ar" ? "الرسالة *" : "Message *"}
                      </Label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={app.lang === "ar" 
                          ? "اكتب رسالتك هنا..." 
                          : "Write your message here..."}
                        rows={4}
                        className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white/5 border border-pink-400/20 text-white placeholder:text-white/40 focus:border-pink-400/50 focus:bg-white/10 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitSupport}
                      disabled={isLoading || !message.trim() || (!app.user && !visitorPhone.trim())}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white font-semibold border border-pink-400/30 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/30 transition-all"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {app.lang === "ar" ? "جاري الإرسال..." : "Sending..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4 text-pink-300" />
                          {app.lang === "ar" ? "إرسال" : "Send"}
                        </span>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-pink-500/10 border border-pink-400/20">
                      <Shield className="h-4 w-4 text-pink-300 shrink-0" />
                      <p className="text-xs text-white/60">
                        {app.lang === "ar" 
                          ? "⚡ سيتم الرد عليك خلال ثواني عبر نظام المراسلة" 
                          : "⚡ We'll reply within seconds via messaging system"}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== ستايلات الحركة ===== */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes float-wave {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-16px) rotate(6deg) scale(1.05); }
        }
        .animate-float-wave {
          animation: float-wave 6s ease-in-out infinite;
        }
        .animate-float-wave-delayed {
          animation: float-wave 6s ease-in-out infinite 3s;
        }
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}