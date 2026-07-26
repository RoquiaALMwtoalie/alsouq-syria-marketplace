// src/routes/auth.$mode.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, User as UserIcon, Phone, Sparkles, Eye, EyeOff, Headphones, X, Send, CheckCircle, Shield, HelpCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";

// ============================================================
// Export route
// ============================================================
export const Route = createFileRoute("/auth/$mode")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Souqi — Auth" }] }),
});

// ============================================================
// Helper functions
// ============================================================
function phoneToEmail(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  return `sy${digits}@souqi.local`;
}

// ✅ دالة التحقق من توفر رقم الهاتف
async function isPhoneAvailableForRegister(phone: string): Promise<{
  available: boolean;
  message?: string;
}> {
  if (!phone || phone.trim().length < 5) {
    return {
      available: false,
      message: "رقم الهاتف غير صحيح (يجب أن يكون 5 أرقام على الأقل)"
    };
  }

  // ✅ التحقق في جدول profiles
  const { data, error } = await supabase
    .from("profiles")
    .select("id, phone")
    .eq("phone", phone.trim())
    .maybeSingle();

  if (error) {
    console.error("Error checking phone:", error);
    return {
      available: false,
      message: "حدث خطأ في التحقق من الرقم"
    };
  }

  if (data) {
    return {
      available: false,
      message: "⚠️ هذا الرقم مستخدم من قبل حساب آخر"
    };
  }

  return { available: true };
}

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80",
  "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1600&q=80",
  "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=80",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80",
  "https://images.unsplash.com/photo-1482049016688-85d77216fe5c?w=1600&q=80",
];

function GlassField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-semibold text-white/90">{label}</Label>
      <div className="relative mt-1">
        <span className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-white/70 z-10">{icon}</span>
        <div className="[&_input]:ps-9 [&_input]:h-11 [&_input]:bg-white/90 [&_input]:text-foreground [&_input]:border-0 [&_input]:placeholder:text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AuthPage Component
// ============================================================
function AuthPage() {
  const { mode } = Route.useParams();
  const app = useApp();
  const t = useT();
  const nav = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  
  // ✅ State للتحقق من الرقم
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDER_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        window.location.href = "/";
      }
    };
    checkSession();
  }, []);

  const isLogin = mode === "login";
  const isRegister = mode === "register";

  // ✅ التحقق من رقم الهاتف عند التغيير (فقط في حالة التسجيل)
  useEffect(() => {
    if (!isRegister) return;
    
    const checkPhone = async () => {
      const cleanPhone = phone.trim();
      if (cleanPhone.length < 5) {
        setPhoneError(null);
        setPhoneAvailable(null);
        return;
      }

      setIsCheckingPhone(true);
      try {
        const result = await isPhoneAvailableForRegister(cleanPhone);
        setPhoneAvailable(result.available);
        setPhoneError(result.available ? null : result.message || null);
      } catch (error) {
        console.error("Error checking phone:", error);
        setPhoneError("حدث خطأ في التحقق من الرقم");
        setPhoneAvailable(false);
      } finally {
        setIsCheckingPhone(false);
      }
    };

    const timer = setTimeout(checkPhone, 500);
    return () => clearTimeout(timer);
  }, [phone, isRegister]);

  function handleForgotPasswordClick() {
    nav({ to: "/reset-password" });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (!phone.trim()) {
        toast.error(app.lang === "ar" ? "رقم الهاتف مطلوب" : "Phone is required");
        return;
      }
      if (!password.trim()) {
        toast.error(app.lang === "ar" ? "كلمة المرور مطلوبة" : "Password is required");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: phoneToEmail(phone),
        password: password,
      });
      if (error) throw error;

      toast.success(app.lang === "ar" ? "✅ تم تسجيل الدخول" : "✅ Signed in");
      window.location.href = "/";
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ التحقق من الحقول
      if (!phone.trim()) {
        toast.error(app.lang === "ar" ? "رقم الهاتف مطلوب" : "Phone is required");
        return;
      }
      
      // ✅ التحقق من الرقم قبل التسجيل
      if (phoneError) {
        toast.error(phoneError);
        return;
      }
      
      if (phoneAvailable === false) {
        toast.error(app.lang === "ar" ? "هذا الرقم مستخدم من قبل" : "This phone is already in use");
        return;
      }

      if (!fullName.trim()) {
        toast.error(app.lang === "ar" ? "الاسم الكامل مطلوب" : "Full name is required");
        return;
      }
      if (!password.trim()) {
        toast.error(app.lang === "ar" ? "كلمة المرور مطلوبة" : "Password is required");
        return;
      }
      if (password.length < 6) {
        toast.error(app.lang === "ar" ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
        return;
      }
      
      // ✅ التحقق من العنوان
      if (!location) {
        toast.error(app.lang === "ar" ? "الرجاء اختيار الموقع على الخريطة" : "Please select a location on the map");
        return;
      }
      
      if (!location.address || location.address.trim() === '') {
        toast.error(app.lang === "ar" ? "الرجاء اختيار عنوان صحيح من الخريطة" : "Please select a valid address from the map");
        return;
      }

      const addressDetails = location.details?.trim() || "";
      if (!addressDetails) {
        toast.error(app.lang === "ar" ? "الرجاء إدخال وصف تفصيلي للعنوان" : "Please enter a detailed description for the address");
        return;
      }

      const addressLabel = location.label?.trim() || (app.lang === "ar" ? "الرئيسي" : "Main");

      // ✅ 1. إنشاء الحساب في Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: phoneToEmail(phone),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
          },
        },
      });
      if (error) throw error;

      // ✅ 2. تسجيل الدخول تلقائياً
      const signInResult = await supabase.auth.signInWithPassword({
        email: phoneToEmail(phone),
        password,
      });
      if (signInResult.error) throw signInResult.error;

      const uid = signInResult.data.user?.id ?? data?.user?.id;
      if (!uid) throw new Error(app.lang === "ar" ? "فشل تسجيل الدخول بعد التسجيل" : "Failed to sign in after registration");

      // ✅ 3. حفظ البروفايل
      const profileData = {
        id: uid,
        full_name: fullName.trim(),
        phone: phone.trim(),
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });
      
      if (profileError) {
        console.error("خطأ في حفظ البروفايل:", profileError);
        throw profileError;
      }

      // ✅ 4. حفظ العنوان
      const addressPayload = {
        user_id: uid,
        label: addressLabel,
        address_text: location.address.trim(),
        details: addressDetails,
        lat: location.lat || 0,
        lng: location.lng || 0,
        is_default: true,
      };

      const { data: existingAddress } = await supabase
        .from("user_addresses")
        .select("id")
        .eq("user_id", uid)
        .maybeSingle();

      if (existingAddress?.id) {
        const { error } = await supabase
          .from("user_addresses")
          .update(addressPayload)
          .eq("id", existingAddress.id);
        if (error) console.error("خطأ في تحديث العنوان:", error);
      } else {
        const { error } = await supabase
          .from("user_addresses")
          .insert(addressPayload);
        if (error) console.error("خطأ في حفظ العنوان:", error);
      }

      toast.success(app.lang === "ar" ? "✅ تم إنشاء الحساب بنجاح" : "✅ Account created successfully");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      
      // ✅ رسائل خطأ مفهومة
      if (msg.includes("phone") || msg.includes("رقم")) {
        toast.error(app.lang === "ar" ? "⚠️ رقم الهاتف مستخدم من قبل" : "⚠️ Phone number already in use");
      } else {
        toast.error(msg);
      }
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLogin) {
      await handleLogin(e);
    } else {
      await handleRegister(e);
    }
  }

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {SLIDER_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: slide === i ? 1 : 0 }}
          >
            <img src={src} alt="" className="h-full w-full object-cover scale-110 animate-[kenburns_20s_ease-in-out_infinite]" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-black/70 backdrop-blur-[2px]" />
      </div>

      <style>{`
        @keyframes kenburns { 0%,100% { transform: scale(1.05); } 50% { transform: scale(1.15); } }
      `}</style>

      <div className="min-h-[calc(100vh-140px)] grid place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="text-center text-white mb-6">
            <div className="inline-flex items-center gap-2">
              <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur grid place-items-center font-black text-xl">س</div>
              <div className="font-black text-2xl">{t("brand")}</div>
            </div>
            <div className="mt-2 text-sm text-white/80">{t("tagline")}</div>
          </div>

          <div className="rounded-3xl border border-white/25 bg-white/15 backdrop-blur-2xl shadow-2xl p-6 md:p-8 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </h2>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <p className="text-white/75 text-sm mt-1">
              {isLogin ? "أهلاً بعودتك 👋" : "خطوة واحدة تفصلك عن عالم التسوق 🛍️"}
            </p>

            <form className="space-y-3 mt-4" onSubmit={handleSubmit}>
              {isRegister && (
                <GlassField label={t("full_name") + " *"} icon={<UserIcon className="h-4 w-4" />}>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </GlassField>
              )}

              {/* ✅ حقل رقم الهاتف مع التحقق والرسالة الواضحة */}
              <GlassField label={t("phone") + " *"} icon={<Phone className="h-4 w-4" />}>
                <div className="relative">
                  <Input 
                    type="tel" 
                    placeholder="+963 9xx xxx xxx" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    className={`
                      ${phoneError && isRegister ? 'border-red-500 focus-visible:ring-red-500 focus-visible:ring-2' : ''}
                      ${phoneAvailable === true && isRegister && phone.trim().length >= 5 ? 'border-green-500' : ''}
                    `}
                  />
                  {/* ✅ مؤشر التحقق من الرقم */}
                  {isRegister && phone.trim().length >= 5 && (
                    <div className="absolute inset-y-0 end-3 flex items-center">
                      {isCheckingPhone ? (
                        <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                      ) : phoneAvailable === true ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : phoneAvailable === false ? (
                        <X className="h-4 w-4 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </div>
              </GlassField>

              {/* ✅ رسالة "الرقم مكرر" - تظهر بشكل واضح وجميل */}
              {isRegister && phone.trim().length >= 5 && (
                <>
                  {phoneError && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/25 border-2 border-red-500/40 shadow-lg shadow-red-500/10 animate-in slide-in-from-top-2 duration-300">
                      <div className="h-8 w-8 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="h-4 w-4 text-red-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-red-200">
                          {app.lang === "ar" ? "⚠️ رقم الهاتف مستخدم" : "⚠️ Phone number already in use"}
                        </p>
                        <p className="text-xs text-red-300/80">
                          {app.lang === "ar" 
                            ? "هذا الرقم مسجل بحساب آخر، يرجى استخدام رقم آخر" 
                            : "This number is registered to another account, please use a different number"}
                        </p>
                      </div>
                    </div>
                  )}
                  {phoneAvailable === true && !phoneError && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/20 border-2 border-green-500/30 shadow-lg shadow-green-500/10 animate-in slide-in-from-top-2 duration-300">
                      <div className="h-8 w-8 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-4 w-4 text-green-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-green-200">
                          {app.lang === "ar" ? "✅ رقم الهاتف متاح" : "✅ Phone number is available"}
                        </p>
                        <p className="text-xs text-green-300/80">
                          {app.lang === "ar" 
                            ? "يمكنك استخدام هذا الرقم لإنشاء حسابك" 
                            : "You can use this number to create your account"}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}

              <GlassField label={t("password") + " *"} icon={<Lock className="h-4 w-4" />}>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6}
                    className="pe-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 my-auto end-3 text-muted-foreground hover:text-foreground transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </GlassField>

              {isRegister && (
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-white/90">
                    {app.lang === "ar" ? "العنوان *" : "Address *"}
                  </Label>
                  <div className="rounded-xl bg-white/90 text-foreground p-3">
                    <AddressPicker 
                      value={location ?? undefined} 
                      onChange={setLocation} 
                      lang={app.lang} 
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-11 bg-accent text-accent-foreground hover:opacity-90 shadow-lg" 
                disabled={loading || (isRegister && (phoneAvailable === false || phoneError !== null))}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {app.lang === "ar" ? "جاري..." : "Loading..."}
                  </span>
                ) : (
                  isLogin ? t("login") : t("register")
                )}
              </Button>

              <div className="text-sm text-center text-white/85 pt-1 space-y-2">
                {isLogin ? (
                  <>
                    <div>
                      {(app.lang === "ar" ? "ليس لديك حساب؟" : "No account?")}{" "}
                      <Link to="/auth/$mode" params={{ mode: "register" }} className="text-accent font-semibold hover:underline">
                        {t("register")}
                      </Link>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        className="text-sm text-white/70 hover:text-white transition underline-offset-2 hover:underline flex items-center justify-center gap-1 mx-auto"
                      >
                        <HelpCircle className="h-3.5 w-3.5" />
                        {app.lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    {(app.lang === "ar" ? "لديك حساب؟" : "Have an account?")}{" "}
                    <Link to="/auth/$mode" params={{ mode: "login" }} className="text-accent font-semibold hover:underline">
                      {t("login")}
                    </Link>
                  </div>
                )}
              </div>
            </form>

            <div className="mt-5 pt-4 border-t border-white/20 text-center">
              <Link to="/" className="text-sm text-white/80 hover:text-white underline">
                {t("continue_as_guest")}
              </Link>
            </div>
          </div>

          <div className="mt-4 flex justify-center gap-2">
            {SLIDER_IMAGES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} aria-label={`slide ${i}`}
                className={`h-1.5 rounded-full transition-all ${slide === i ? "w-8 bg-white" : "w-2 bg-white/50"}`} />
            ))}
          </div>
        </div>
      </div>

      <SupportButton />
    </div>
  );
}

// ============================================================
// SupportButton Component
// ============================================================
function SupportButton() {
  const app = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenSupport = () => {
    setIsOpen(true);
  };

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
      <div className="fixed bottom-6 start-6 z-50">
        <button
          onClick={handleOpenSupport}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            group relative flex items-center gap-3 px-5 py-3 rounded-2xl 
            bg-gradient-to-r from-blue-600 to-indigo-600 
            hover:from-blue-700 hover:to-indigo-700 
            text-white shadow-lg shadow-blue-500/30 
            hover:shadow-xl hover:shadow-blue-500/40 
            transition-all duration-300 
            ${isHovered ? 'scale-105 -translate-y-1' : ''}
          `}
        >
          <div className="relative">
            <Headphones className="h-5 w-5" />
            {!isHovered && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          <span className="font-medium text-sm hidden sm:inline">
            {app.lang === "ar" ? "الدعم والمساعدة" : "Support & Help"}
          </span>
          {isHovered && (
            <span className="absolute -top-10 -right-2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap animate-in fade-in zoom-in-95">
              {app.lang === "ar" ? "نسعد بمساعدتك 🤝" : "We're here to help 🤝"}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-blue-200/30 dark:border-blue-800/30 animate-in zoom-in-95 duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
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
                          className="mt-1.5 h-11 rounded-xl border-blue-200/30 bg-muted/50 cursor-not-allowed"
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
                          className="mt-1.5 h-11 rounded-xl border-blue-200/30 focus:border-blue-400/60 transition-all"
                          required
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {app.lang === "ar" 
                            ? "سنستخدم رقمك للتواصل معك" 
                            : "We'll use your number to contact you"}
                        </p>
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
                        className="mt-1.5 h-11 rounded-xl border-blue-200/30 focus:border-blue-400/60 transition-all"
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
                        className="mt-1.5 w-full px-4 py-3 rounded-xl border border-blue-200/30 dark:border-blue-800/30 bg-muted/50 focus:border-blue-400/60 focus:bg-card focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitSupport}
                      disabled={isLoading || !message.trim() || (!app.user && !visitorPhone.trim())}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
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

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/30">
                      <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
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