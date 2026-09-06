// src/components/Footer.tsx

import { Link, useLocation } from "@tanstack/react-router";
import {
  Shield, Headphones, MessageCircle, ArrowUp,
  X, Send, CheckCircle, HelpCircle, FileText, LayoutDashboard, Package
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Footer() {
  const location = useLocation();
  const app = useApp();
  const year = new Date().getFullYear();

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // ✅ دالة إرسال رسالة الدعم
  const handleSubmitSupport = async () => {
    const phone = app.user?.phone || visitorPhone.trim();

    if (!phone) {
      toast.error(
        app.lang === "ar"
          ? "الرجاء إدخال رقم هاتفك للتواصل معك"
          : "Please enter your phone number"
      );
      return;
    }

    if (!message.trim()) {
      toast.error(
        app.lang === "ar"
          ? "الرجاء كتابة رسالتك"
          : "Please write your message"
      );
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
        toast.error(
          app.lang === "ar"
            ? "حدث خطأ، يرجى المحاولة لاحقاً"
            : "Error, please try again later"
        );
        return;
      }

      const adminId = adminData.user_id;
      const userId = app.user?.id || adminId;
      const userPhone = app.user?.phone || visitorPhone.trim();
      const isRegistered = !!app.user;

      const {
        data: newConversation,
        error: convError
      } = await supabase
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
      toast.error(
        app.lang === "ar"
          ? "حدث خطأ أثناء الإرسال"
          : "Error sending message"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ تعريف الروابط مع أيقونات
  const footerLinks = [
    { 
      to: "/faq", 
      labelAr: "الأسئلة الشائعة", 
      labelEn: "FAQ",
      icon: HelpCircle
    },
    { 
      to: "/privacy", 
      labelAr: "الخصوصية", 
      labelEn: "Privacy",
      icon: Shield
    },
    { 
      to: "/terms", 
      labelAr: "الشروط", 
      labelEn: "Terms",
      icon: FileText
    },
  ];

  return (
    <footer
      id="main-footer"
      className="relative mt-16 overflow-hidden text-white border-t border-pink-400/20"
      style={{ backgroundColor: '#2a655f' }}
    >
      {/* تأثير زجاجي خفيف */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-md pointer-events-none" />

      {/* توهج خفيف في الخلفية */}
      <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-pink-400/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-pink-400/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-5">
        
        {/* صف الروابط - تصميم أنيق مع أيقونات */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          {footerLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-pink-400/50 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              >
                <Icon className="h-3.5 w-3.5 text-pink-300 group-hover:text-pink-200 transition-colors" />
                <span className="text-[10px] font-medium text-white/80 group-hover:text-white transition-colors">
                  {app.lang === "ar" ? link.labelAr : link.labelEn}
                </span>
              </Link>
            );
          })}
          
          {/* زر الدعم */}
          <button
            onClick={() => setSupportOpen(true)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/20 border border-pink-400/30 hover:bg-pink-500/30 hover:border-pink-400/60 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <Headphones className="h-3.5 w-3.5 text-pink-300 group-hover:text-pink-200 transition-colors" />
            <span className="text-[10px] font-medium text-pink-200 group-hover:text-white transition-colors">
              {app.lang === "ar" ? "الدعم والمساعدة" : "Support"}
            </span>
          </button>
        </div>

        {/* الفاصل */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="h-px flex-1 max-w-20 bg-gradient-to-r from-transparent to-pink-400/20" />
          <span className="text-[8px] text-pink-400/50 font-bold tracking-[0.2em] uppercase">
            zooq
          </span>
          <div className="h-px flex-1 max-w-20 bg-gradient-to-l from-transparent to-pink-400/20" />
        </div>

        {/* الحقوق وحالة النظام */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] text-white/60">
          <span>© {year} zooq</span>
          <span className="text-pink-400/40">•</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300/80">
              {app.lang === "ar" ? "آمن 100%" : "100% Secure"}
            </span>
          </span>
        </div>

      </div>

      {/* زر صغير للعودة للأعلى */}
      <button
        onClick={scrollToTop}
        className="
          fixed bottom-5 right-5 z-50
          h-9 w-9
          rounded-full
          bg-[#0d2e2a]
          text-pink-300
          border border-pink-400/40
          shadow-lg shadow-pink-400/10
          hover:scale-110
          hover:border-pink-400/70
          hover:shadow-pink-400/30
          transition-all duration-300
          flex items-center justify-center
          cursor-pointer
          group
        "
        aria-label="Back to top"
      >
        <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
      </button>

      {/* ===== نافذة الدعم المنبثقة ===== */}
      {supportOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setSupportOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-[#0d2e2a] rounded-3xl max-w-md w-full shadow-2xl border border-pink-400/30 animate-in zoom-in-95 duration-300 overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] p-4 border-b border-pink-400/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center">
                    <Headphones className="h-4 w-4 text-pink-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      {app.lang === "ar" ? "الدعم والمساعدة" : "Support & Help"}
                    </h3>
                    <p className="text-pink-300/80 text-[10px]">
                      {app.lang === "ar" ? "نحن هنا لمساعدتك 💙" : "We're here to help 💙"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSupportOpen(false)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3 text-start">
                {isSuccess ? (
                  <div className="text-center py-4">
                    <div className="h-12 w-12 rounded-full bg-pink-500/20 border border-pink-400/30 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-6 w-6 text-pink-400" />
                    </div>
                    <h4 className="text-sm font-bold text-white">
                      {app.lang === "ar" ? "تم الإرسال ✅" : "Sent ✅"}
                    </h4>
                    <p className="text-[10px] text-pink-300/80 mt-1">
                      {app.lang === "ar" ? "سنرد عليك خلال ثواني ⚡" : "We'll reply within seconds ⚡"}
                    </p>
                  </div>
                ) : (
                  <>
                    {app.user ? (
                      <div>
                        <Label className="text-[10px] font-semibold text-white/90">
                          {app.lang === "ar" ? "رقم هاتفك" : "Your Phone"}
                        </Label>
                        <Input
                          type="tel"
                          value={app.user?.phone || "غير متاح"}
                          disabled
                          className="mt-1 h-9 rounded-xl bg-white/10 border-pink-400/20 text-white text-[10px] cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label className="text-[10px] font-semibold text-white/90">
                          {app.lang === "ar" ? "رقم الهاتف *" : "Phone Number *"}
                        </Label>
                        <Input
                          type="tel"
                          value={visitorPhone}
                          onChange={(e) => setVisitorPhone(e.target.value)}
                          placeholder="+963 9xx xxx xxx"
                          className="mt-1 h-9 rounded-xl bg-white/5 border-pink-400/20 text-white text-[10px] placeholder:text-white/40 focus:border-pink-400/50"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <Label className="text-[10px] font-semibold text-white/90">
                        {app.lang === "ar" ? "الموضوع" : "Subject"}
                      </Label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={app.lang === "ar" ? "استفسار عام..." : "General inquiry..."}
                        className="mt-1 h-9 rounded-xl bg-white/5 border-pink-400/20 text-white text-[10px] placeholder:text-white/40 focus:border-pink-400/50"
                      />
                    </div>

                    <div>
                      <Label className="text-[10px] font-semibold text-white/90">
                        {app.lang === "ar" ? "الرسالة *" : "Message *"}
                      </Label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={app.lang === "ar" ? "اكتب رسالتك هنا..." : "Write your message here..."}
                        rows={3}
                        className="mt-1 w-full px-3 py-2 rounded-xl bg-white/5 border border-pink-400/20 text-white text-[10px] placeholder:text-white/40 focus:border-pink-400/50 focus:outline-none resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitSupport}
                      disabled={isLoading || !message.trim() || (!app.user && !visitorPhone.trim())}
                      className="w-full h-9 rounded-xl bg-gradient-to-r from-pink-500/20 to-pink-600/20 hover:from-pink-500/30 hover:to-pink-600/30 text-white text-[10px] font-semibold border border-pink-400/30 shadow-md cursor-pointer transition-all duration-300"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {app.lang === "ar" ? "جاري الإرسال..." : "Sending..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-3 w-3 text-pink-300" />
                          {app.lang === "ar" ? "إرسال الرسالة" : "Send Message"}
                        </span>
                      )}
                    </Button>
                  </>
                )}
              </div>

            </div>
          </div>
        </>
      )}
    </footer>
  );
}