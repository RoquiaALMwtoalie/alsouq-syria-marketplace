// src/routes/reset-password.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowLeft, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: "إعادة تعيين كلمة المرور" }] }),
});

function ResetPasswordPage() {
  const app = useApp();
  const t = useT();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // ✅ تحويل الرقم إلى بريد وهمي
  function phoneToEmail(phone: string) {
    const digits = phone.replace(/[^0-9]/g, "");
    return `sy${digits}@souqi.local`;
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error(app.lang === "ar" ? "الرجاء إدخال رقم الهاتف" : "Please enter your phone number");
      return;
    }

    setLoading(true);
    try {
      const email = phoneToEmail(phone);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password/confirm",
      });
      
      if (error) throw error;
      
      setIsSuccess(true);
      toast.success(
        app.lang === "ar" 
          ? "✅ تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" 
          : "✅ Password reset link sent to your email"
      );
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* الشعار */}
        <div className="text-center text-white mb-6">
          <div className="inline-flex items-center gap-2">
            <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur grid place-items-center font-black text-xl">س</div>
            <div className="font-black text-2xl">{t("brand")}</div>
          </div>
          <div className="mt-2 text-sm text-white/80">{t("tagline")}</div>
        </div>

        {/* بطاقة إعادة تعيين كلمة المرور */}
        <div className="rounded-3xl border border-white/25 bg-white/15 backdrop-blur-2xl shadow-2xl p-6 md:p-8 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">
              {app.lang === "ar" ? "إعادة تعيين كلمة المرور" : "Reset Password"}
            </h2>
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <p className="text-white/75 text-sm mt-1">
            {app.lang === "ar" 
              ? "أدخل رقم هاتفك وسنرسل لك رابط إعادة التعيين" 
              : "Enter your phone number and we'll send you a reset link"}
          </p>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold">
                {app.lang === "ar" ? "تم الإرسال ✅" : "Sent ✅"}
              </h3>
              <p className="text-sm text-white/75 mt-2">
                {app.lang === "ar" 
                  ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني" 
                  : "Password reset link sent to your email"}
              </p>
              <Link
                to="/auth/$mode"
                params={{ mode: "login" }}
                className="mt-6 inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition"
              >
                <ArrowLeft className="h-4 w-4" />
                {app.lang === "ar" ? "العودة لتسجيل الدخول" : "Back to login"}
              </Link>
            </div>
          ) : (
            <form className="space-y-4 mt-4" onSubmit={handleResetPassword}>
              <div>
                <Label className="text-xs font-semibold text-white/90">
                  {app.lang === "ar" ? "رقم الهاتف *" : "Phone Number *"}
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-white/70 z-10" />
                  <Input
                    type="tel"
                    placeholder="+963 9xx xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="ps-9 h-11 bg-white/90 text-foreground border-0 placeholder:text-muted-foreground"
                    required
                  />
                </div>
                <p className="text-[10px] text-white/60 mt-1">
                  {app.lang === "ar" 
                    ? "سيتم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني المرتبط برقم الهاتف" 
                    : "A reset link will be sent to your email associated with this phone number"}
                </p>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-11 bg-accent text-accent-foreground hover:opacity-90 shadow-lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {app.lang === "ar" ? "جاري الإرسال..." : "Sending..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    {app.lang === "ar" ? "إرسال رابط إعادة التعيين" : "Send Reset Link"}
                  </span>
                )}
              </Button>

              <div className="text-center">
                <Link
                  to="/auth/$mode"
                  params={{ mode: "login" }}
                  className="text-sm text-white/70 hover:text-white transition underline-offset-2 hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {app.lang === "ar" ? "العودة لتسجيل الدخول" : "Back to login"}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}