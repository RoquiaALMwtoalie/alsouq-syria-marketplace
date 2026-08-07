// src/components/SupportButton.tsx

import { useState } from "react";
import { Headphones, X, Send, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function SupportButton() {
  const app = useApp();
  const t = useT();
  
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ الاستماع لحدث فتح الدعم من الفوتر
  useState(() => {
    const handler = () => setIsOpen(true);
    document.addEventListener('openSupportChat', handler);
    return () => document.removeEventListener('openSupportChat', handler);
  }, []);

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
          recipient_id: adminId,
          type: "support",
          title_ar: "📩 رسالة دعم جديدة",
          body_ar: `📞 من: ${userPhone}\n${isRegistered ? '✅ مسجل' : '❌ زائر'}\nالموضوع: ${subject || "دعم"}`,
          reference_id: conversationId,
          link_url: `/messages/${conversationId}`,
          created_at: new Date().toISOString(),
        });

      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
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
    <>
      {/* ✅ زر الدعم العائم */}
      <div className="fixed bottom-6 start-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-xl hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
        >
          <div className="relative">
            <Headphones className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <span className="font-medium text-sm hidden sm:inline">
            {app.lang === "ar" ? "الدعم والمساعدة" : "Support & Help"}
          </span>
        </button>
      </div>

      {/* ✅ نافذة الدعم المنبثقة */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 animate-in zoom-in-95 duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {app.lang === "ar" ? "الدعم والمساعدة" : "Support & Help"}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {app.lang === "ar" ? "نحن هنا لمساعدتك 💙" : "We're here to help 💙"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                      {app.lang === "ar" ? "تم الإرسال ✅" : "Sent ✅"}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {app.lang === "ar" 
                        ? "سنرد عليك خلال ثواني ⚡" 
                        : "We'll reply within seconds ⚡"}
                    </p>
                  </div>
                ) : (
                  <>
                    {app.user ? (
                      <div>
                        <Label className="text-sm font-semibold">
                          {app.lang === "ar" ? "رقم هاتفك" : "Your Phone"}
                        </Label>
                        <Input
                          type="tel"
                          value={app.user?.phone || "غير متاح"}
                          disabled
                          className="mt-1.5 h-11 rounded-xl border-[#2a655f]/20 bg-muted/50 cursor-not-allowed"
                        />
                      </div>
                    ) : (
                      <div>
                        <Label className="text-sm font-semibold">
                          {app.lang === "ar" ? "رقم الهاتف *" : "Phone Number *"}
                        </Label>
                        <Input
                          type="tel"
                          value={visitorPhone}
                          onChange={(e) => setVisitorPhone(e.target.value)}
                          placeholder="+963 9xx xxx xxx"
                          className="mt-1.5 h-11 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f]/50 transition-all"
                          required
                        />
                      </div>
                    )}

                    <div>
                      <Label className="text-sm font-semibold">
                        {app.lang === "ar" ? "الموضوع" : "Subject"}
                      </Label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={app.lang === "ar" ? "مشكلة في إنشاء الحساب" : "Registration issue"}
                        className="mt-1.5 h-11 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f]/50 transition-all"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-semibold">
                        {app.lang === "ar" ? "الرسالة *" : "Message *"}
                      </Label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={app.lang === "ar" 
                          ? "اكتب رسالتك هنا..." 
                          : "Write your message here..."}
                        rows={4}
                        className="mt-1.5 w-full px-4 py-3 rounded-xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-muted/50 focus:border-[#2a655f]/50 focus:bg-card focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitSupport}
                      disabled={isLoading || !message.trim() || (!app.user && !visitorPhone.trim())}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white font-semibold shadow-lg shadow-[#2a655f]/25 hover:shadow-xl transition-all"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {app.lang === "ar" ? "جاري الإرسال..." : "Sending..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          {app.lang === "ar" ? "إرسال" : "Send"}
                        </span>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[#2a655f]/10 dark:bg-[#2a655f]/20 border border-[#2a655f]/20 dark:border-[#2a655f]/30">
                      <Shield className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] shrink-0" />
                      <p className="text-xs text-muted-foreground">
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
    </>
  );
}