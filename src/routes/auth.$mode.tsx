// src/routes/auth.$mode.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Lock, User as UserIcon, Phone, Sparkles, Eye, EyeOff, Headphones, 
  X, Send, CheckCircle, Shield, HelpCircle, Loader2, AlertCircle, 
  MapPin, Globe, Facebook, Twitter, Instagram, Youtube, Mail, Clock,
  House, Heart, Star, Zap, Rocket, Gem, Crown, Flame, Compass,
  Award, Gift, Calendar, LayoutDashboard, Package, MessageCircle,
  Store, ShoppingBag, Truck, Users, Briefcase, FileText, ArrowUp,
  UserPlus,
  type LucideIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";
import { useUserRoles } from "@/lib/queries";
import { getAuthRedirect } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

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

// ✅ دالة التحقق من صيغة الرقم السوري
function isValidSyrianPhoneFormat(phone: string): { valid: boolean; message?: string } {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  
  if (!/^[0-9+]+$/.test(cleanPhone)) {
    return {
      valid: false,
      message: "⚠️ الرقم يجب أن يحتوي على أرقام فقط"
    };
  }

  const digits = cleanPhone.replace(/[^0-9]/g, "");

  let isValid = false;
  let numberAfterPrefix = "";

  if (cleanPhone.startsWith('+963')) {
    if (digits.length === 13) {
      numberAfterPrefix = digits.slice(-9);
      isValid = numberAfterPrefix.startsWith('9');
    }
  } else if (cleanPhone.startsWith('00963')) {
    if (digits.length === 13) {
      numberAfterPrefix = digits.slice(-9);
      isValid = numberAfterPrefix.startsWith('9');
    }
  } else if (cleanPhone.startsWith('0')) {
    if (digits.length === 10) {
      numberAfterPrefix = digits.slice(1);
      isValid = numberAfterPrefix.startsWith('9');
    }
  } else if (digits.length === 9) {
    numberAfterPrefix = digits;
    isValid = numberAfterPrefix.startsWith('9');
  }

  if (!isValid) {
    return {
      valid: false,
      message: "⚠️ صيغة الرقم غير صحيحة. استخدم: +963xxxxxxxxx أو 0xxxxxxxxx (يبدأ بـ 9)"
    };
  }

  return { valid: true };
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

  const formatCheck = isValidSyrianPhoneFormat(phone);
  if (!formatCheck.valid) {
    return {
      available: false,
      message: formatCheck.message || "⚠️ صيغة الرقم غير صحيحة"
    };
  }

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

// ✅ دالة استخراج المحافظة من العنوان
async function extractGovernorateFromAddress(address: string, lat?: number, lng?: number): Promise<{ governorate_id: string; governorate_name: string }> {
  try {
    if (lat && lng) {
      const { data: governorates } = await supabase
        .from('governorates')
        .select('*');

      if (governorates) {
        for (const g of governorates) {
          if (g.center_lat && g.center_lng) {
            const distance = Math.sqrt(
              Math.pow(lat - g.center_lat, 2) + 
              Math.pow(lng - g.center_lng, 2)
            );
            if (distance < 0.5) {
              return {
                governorate_id: g.id,
                governorate_name: g.name_ar
              };
            }
          }
        }
      }
    }

    if (address) {
      const { data: governorates } = await supabase
        .from('governorates')
        .select('*');

      if (governorates) {
        for (const g of governorates) {
          if (address.includes(g.name_ar) || address.includes(g.name_en || '')) {
            return {
              governorate_id: g.id,
              governorate_name: g.name_ar
            };
          }
        }
      }
    }

    const { data: defaultGov } = await supabase
      .from('governorates')
      .select('id, name_ar')
      .eq('name_ar', 'دمشق')
      .single();

    if (defaultGov) {
      return {
        governorate_id: defaultGov.id,
        governorate_name: defaultGov.name_ar
      };
    }

    return { governorate_id: '', governorate_name: '' };
  } catch (error) {
    console.error('Error extracting governorate:', error);
    return { governorate_id: '', governorate_name: '' };
  }
}

// ✅ دالة حفظ العنوان مع المحافظة
async function saveAddressWithGovernorate(
  userId: string,
  location: PickedLocation
): Promise<{ success: boolean; error?: string }> {
  try {
    const { governorate_id, governorate_name } = await extractGovernorateFromAddress(
      location.address,
      location.lat,
      location.lng
    );

    console.log('📍 Extracted governorate:', governorate_name, 'ID:', governorate_id);

    const addressPayload = {
      user_id: userId,
      label: location.label || 'الرئيسي',
      address_text: location.address.trim(),
      details: location.details?.trim() || '',
      lat: location.lat || 0,
      lng: location.lng || 0,
      governorate_id: governorate_id || null,
      is_default: true,
    };

    const { data: existingAddress } = await supabase
      .from("user_addresses")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingAddress?.id) {
      const { error } = await supabase
        .from("user_addresses")
        .update(addressPayload)
        .eq("id", existingAddress.id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("user_addresses")
        .insert(addressPayload);

      if (error) throw error;
    }

    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        lat: location.lat || 0,
        lng: location.lng || 0,
        address_text: location.address.trim(),
        governorate_id: governorate_id || null,
      })
      .eq("id", userId);

    if (updateProfileError) {
      console.error("❌ Error updating profile:", updateProfileError);
      throw updateProfileError;
    }

    console.log('✅ Address saved with governorate:', governorate_name);
    return { success: true };

  } catch (error: any) {
    console.error('❌ Error saving address:', error);
    return { success: false, error: error.message };
  }
}

const SLIDER_IMAGES = [
  "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/istockphoto-2105032127-612x612.jpg",
  "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/42430876-ai-generated-8793863_1920.jpg",
  "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/mohamed_hassan-systems-icons-3334262_1920.jpg",
  "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/regencygirl123-present-8440034_1920.jpg",
  "https://jjqgfjpxaxjpyohvcbfi.supabase.co/storage/v1/object/public/uploads/banners/gonghuimin468-happy-holidays-3040029_1920.jpg",
];

// ✅ أيقونة متحركة للشعار
const AnimatedLogoIcon = ({ Icon, className = "", delay = 0 }: { Icon: LucideIcon, className?: string, delay?: number }) => {
  return (
    <div className="relative inline-flex" style={{ animationDelay: `${delay}ms` }}>
      <div className="animate-float-logo">
        <Icon className={cn("transition-all duration-500", className)} />
      </div>
      <span className="absolute -inset-2 rounded-full border-2 border-emerald-400/30 animate-ripple-logo opacity-0" />
      <span className="absolute -inset-4 rounded-full border-2 border-emerald-400/15 animate-ripple-logo delay-700 opacity-0" />
    </div>
  );
};

// ✅ أيقونة متحركة للفلدات
const FloatingFieldIcon = ({ Icon, className = "", delay = 0 }: { Icon: LucideIcon, className?: string, delay?: number }) => {
  return (
    <div className="relative inline-flex" style={{ animationDelay: `${delay}ms` }}>
      <div className="animate-float-field">
        <Icon className={cn("transition-all duration-300", className)} />
      </div>
    </div>
  );
};

function GlassField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs font-semibold text-white/90 flex items-center gap-2">
        <span className="h-1 w-3 rounded-full bg-emerald-400/60" />
        {label}
      </Label>
      <div className="relative mt-1.5">
        <span className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-emerald-300/70 z-10">
          {icon}
        </span>
        <div className="[&_input]:ps-9 [&_input]:h-11 [&_input]:bg-white/95 [&_input]:text-slate-800 [&_input]:border-0 [&_input]:placeholder:text-slate-400 [&_input]:focus:ring-2 [&_input]:focus:ring-emerald-500/50 [&_input]:shadow-inner [&_input]:rounded-xl">
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
  
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);

  const [detectedGovernorate, setDetectedGovernorate] = useState<string>('');
  const [isExtractingGovernorate, setIsExtractingGovernorate] = useState(false);

  // ✅ إيقاف حركة الفورم - إزالة animate-float-slow
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

  useEffect(() => {
    const extractGovernorate = async () => {
      if (!location) {
        setDetectedGovernorate('');
        return;
      }

      setIsExtractingGovernorate(true);
      try {
        const result = await extractGovernorateFromAddress(
          location.address,
          location.lat,
          location.lng
        );
        setDetectedGovernorate(result.governorate_name);
      } catch (error) {
        console.error('Error extracting governorate:', error);
      } finally {
        setIsExtractingGovernorate(false);
      }
    };

    extractGovernorate();
  }, [location]);

  function handleForgotPasswordClick() {
    nav({ to: "/reset-password" });
  }

  // ✅ دالة معالجة أخطاء تسجيل الدخول مع ترجمة صحيحة
  function getLoginErrorMessage(error: any): string {
    const message = error?.message || String(error);
    const lang = app.lang === "ar" ? "ar" : "en";
    
    // رسائل الخطأ الشائعة مع الترجمة
    const errorMessages: Record<string, { ar: string; en: string }> = {
      "Invalid login credentials": {
        ar: "❌ رقم الهاتف أو كلمة المرور غير صحيحة",
        en: "❌ Invalid phone number or password"
      },
      "Email not confirmed": {
        ar: "⚠️ البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني",
        en: "⚠️ Email not confirmed. Please check your email"
      },
      "User not found": {
        ar: "❌ لا يوجد حساب بهذا الرقم",
        en: "❌ No account found with this number"
      },
      "Invalid password": {
        ar: "❌ كلمة المرور غير صحيحة",
        en: "❌ Invalid password"
      },
      "Too many requests": {
        ar: "⚠️ عدد كبير من المحاولات. يرجى المحاولة لاحقاً",
        en: "⚠️ Too many attempts. Please try again later"
      }
    };

    // البحث عن رسالة مطابقة
    for (const [key, value] of Object.entries(errorMessages)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value[lang];
      }
    }

    // رسالة افتراضية حسب اللغة
    if (message.includes("phone") || message.includes("رقم")) {
      return lang === "ar" ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number";
    }

    if (message.includes("password") || message.includes("كلمة المرور")) {
      return lang === "ar" ? "❌ كلمة المرور غير صحيحة" : "❌ Invalid password";
    }

    // رسالة عامة
    return lang === "ar" 
      ? `❌ حدث خطأ: ${message}` 
      : `❌ Error: ${message}`;
  }

  // ✅ دالة معالجة أخطاء التسجيل مع ترجمة صحيحة
  function getRegisterErrorMessage(error: any): string {
    const message = error?.message || String(error);
    const lang = app.lang === "ar" ? "ar" : "en";
    
    const errorMessages: Record<string, { ar: string; en: string }> = {
      "User already registered": {
        ar: "⚠️ هذا الرقم مسجل مسبقاً. يرجى تسجيل الدخول",
        en: "⚠️ This number is already registered. Please login"
      },
      "Password should be at least 6 characters": {
        ar: "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        en: "❌ Password must be at least 6 characters"
      },
      "Email already in use": {
        ar: "⚠️ هذا الرقم مستخدم من قبل حساب آخر",
        en: "⚠️ This number is already in use"
      },
      "Network error": {
        ar: "⚠️ خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت",
        en: "⚠️ Network error. Please check your internet connection"
      }
    };

    for (const [key, value] of Object.entries(errorMessages)) {
      if (message.toLowerCase().includes(key.toLowerCase())) {
        return value[lang];
      }
    }

    if (message.includes("phone") || message.includes("رقم")) {
      return lang === "ar" ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number";
    }

    if (message.includes("password") || message.includes("كلمة المرور")) {
      return lang === "ar" ? "❌ كلمة المرور غير صحيحة" : "❌ Invalid password";
    }

    return lang === "ar" 
      ? `❌ حدث خطأ: ${message}` 
      : `❌ Error: ${message}`;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!phone.trim() || !password.trim()) {
        toast.error(app.lang === "ar" ? "❌ رقم الهاتف وكلمة المرور مطلوبة" : "❌ Phone and password are required");
        setLoading(false);
        return;
      }

      // ✅ التحقق من صيغة الرقم قبل تسجيل الدخول
      const formatCheck = isValidSyrianPhoneFormat(phone);
      if (!formatCheck.valid) {
        toast.error(app.lang === "ar" ? "❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx" : "❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx");
        setLoading(false);
        return;
      }

      const digits = phone.replace(/[^0-9]/g, "");
      
      const possibleEmails = [
        `sy${digits}@souqi.local`,
        `${digits}@delivery.com`,
        `${digits}@distributor.sy`,
        `${digits}@company-admin.com`,
        `${digits}@company.com`,
      ];

      let signInData = null;
      let signInError = null;

      for (const email of possibleEmails) {
        console.log("🔍 Trying email format:", email);
        const res = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (!res.error) {
          signInData = res.data;
          console.log("✅ Successfully signed in with:", email);
          break;
        } else {
          signInError = res.error;
        }
      }

      if (!signInData && signInError) {
        // ✅ عرض رسالة خطأ مترجمة
        const errorMessage = getLoginErrorMessage(signInError);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const redirect = await getAuthRedirect(signInData.user);

      toast.success(app.lang === "ar" ? "✅ تم تسجيل الدخول بنجاح" : "✅ Signed in successfully");

      nav({
        to: redirect.url,
        state: { showLoginSplash: true }
      });

    } catch (err: any) {
      console.error("❌ Login error:", err);
      const errorMessage = getLoginErrorMessage(err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ التحقق من رقم الهاتف
      if (!phone.trim()) {
        toast.error(app.lang === "ar" ? "❌ رقم الهاتف مطلوب" : "❌ Phone is required");
        setLoading(false);
        return;
      }
      
      // ✅ التحقق من صيغة الرقم
      const formatCheck = isValidSyrianPhoneFormat(phone);
      if (!formatCheck.valid) {
        toast.error(app.lang === "ar" ? "❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx" : "❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx");
        setLoading(false);
        return;
      }
      
      if (phoneError) {
        toast.error(phoneError);
        setLoading(false);
        return;
      }
      
      if (phoneAvailable === false) {
        toast.error(app.lang === "ar" ? "⚠️ هذا الرقم مستخدم من قبل" : "⚠️ This phone is already in use");
        setLoading(false);
        return;
      }

      // ✅ التحقق من الاسم الكامل
      if (!fullName.trim()) {
        toast.error(app.lang === "ar" ? "❌ الاسم الكامل مطلوب" : "❌ Full name is required");
        setLoading(false);
        return;
      }

      // ✅ التحقق من كلمة المرور
      if (!password.trim()) {
        toast.error(app.lang === "ar" ? "❌ كلمة المرور مطلوبة" : "❌ Password is required");
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error(app.lang === "ar" ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      
      // ✅ التحقق من الموقع
      if (!location) {
        toast.error(app.lang === "ar" ? "❌ الرجاء اختيار الموقع على الخريطة" : "❌ Please select a location on the map");
        setLoading(false);
        return;
      }
      
      if (!location.address || location.address.trim() === '') {
        toast.error(app.lang === "ar" ? "❌ الرجاء اختيار عنوان صحيح من الخريطة" : "❌ Please select a valid address from the map");
        setLoading(false);
        return;
      }

      const addressDetails = location.details?.trim() || "";
      if (!addressDetails) {
        toast.error(app.lang === "ar" ? "❌ الرجاء إدخال وصف تفصيلي للعنوان" : "❌ Please enter a detailed description for the address");
        setLoading(false);
        return;
      }

      const addressLabel = location.label?.trim() || (app.lang === "ar" ? "الرئيسي" : "Main");

      // ✅ محاولة التسجيل
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

      if (error) {
        // ✅ عرض رسالة خطأ مترجمة
        const errorMessage = getRegisterErrorMessage(error);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      // ✅ تسجيل الدخول تلقائياً بعد التسجيل
      const signInResult = await supabase.auth.signInWithPassword({
        email: phoneToEmail(phone),
        password,
      });

      if (signInResult.error) {
        const errorMessage = getLoginErrorMessage(signInResult.error);
        toast.error(errorMessage);
        setLoading(false);
        return;
      }

      const uid = signInResult.data.user?.id ?? data?.user?.id;
      if (!uid) {
        toast.error(app.lang === "ar" ? "❌ فشل تسجيل الدخول بعد التسجيل" : "❌ Failed to sign in after registration");
        setLoading(false);
        return;
      }

      // ✅ حفظ بيانات الملف الشخصي
      const profileData = {
        id: uid,
        full_name: fullName.trim(),
        phone: phone.trim(),
      };

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(profileData, { onConflict: "id" });
      
      if (profileError) {
        console.error("Profile error:", profileError);
        toast.error(app.lang === "ar" ? "⚠️ حدث خطأ في حفظ الملف الشخصي" : "⚠️ Error saving profile");
        setLoading(false);
        return;
      }

      // ✅ حفظ العنوان
      const saveResult = await saveAddressWithGovernorate(uid, location);

      if (!saveResult.success) {
        console.warn('⚠️ Address saved but governorate extraction failed:', saveResult.error);
      }

      if (detectedGovernorate) {
        toast.success(
          app.lang === "ar" 
            ? `✅ تم تحديد المحافظة: ${detectedGovernorate}` 
            : `✅ Governorate detected: ${detectedGovernorate}`
        );
      }

      toast.success(app.lang === "ar" ? "✅ تم إنشاء الحساب بنجاح" : "✅ Account created successfully");

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const redirect = await getAuthRedirect(user);
        setTimeout(() => {
          window.location.replace(redirect.url);
        }, 500);
      } else {
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
      
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = getRegisterErrorMessage(err);
      toast.error(errorMessage);
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

  const { data: userRoles = [] } = useUserRoles(app.user?.id);
  const isDeliveryCompany = userRoles.includes('delivery_company');
  const isDistributor = userRoles.includes('distributor');
  const isAdmin = userRoles.includes('admin');
  const isSeller = userRoles.includes('seller');

  const year = new Date().getFullYear();

  // ============================================================
  // ✅ UI المحسن مع تصميم احترافي
  // ============================================================
  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden">
      
      {/* ===== خلفية الصور ===== */}
      <div className="absolute inset-0 -z-10">
        {SLIDER_IMAGES.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: slide === i ? 1 : 0 }}
          >
            <img 
              src={src} 
              alt="" 
              className="h-full w-full object-cover object-center scale-110 animate-[kenburns_20s_ease-in-out_infinite]"
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable="false"
            />
          </div>
        ))}
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2e2a]/90 via-[#1a4f4a]/80 to-black/80 backdrop-blur-[3px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <style>{`
        @keyframes kenburns { 
          0%, 100% { transform: scale(1.08); } 
          50% { transform: scale(1.18); } 
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes float-logo {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(3deg); }
          75% { transform: translateY(6px) rotate(-2deg); }
        }
        .animate-float-logo {
          animation: float-logo 3s ease-in-out infinite;
        }
        @keyframes float-field {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .animate-float-field {
          animation: float-field 2.5s ease-in-out infinite;
        }
        @keyframes ripple-logo {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .animate-ripple-logo {
          animation: ripple-logo 3s ease-out infinite;
        }
        .glass-card {
          background: rgba(13, 46, 42, 0.75);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(16, 185, 129, 0.25);
          box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.6);
        }
        .glass-card:hover {
          background: rgba(13, 46, 42, 0.85);
          border-color: rgba(16, 185, 129, 0.4);
          box-shadow: 0 30px 80px -12px rgba(16, 185, 129, 0.2);
        }
        .input-glow:focus {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25), 0 0 30px rgba(16, 185, 129, 0.1);
        }
        .auth-shimmer {
          background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%);
          background-size: 200% 100%;
          animation: shimmer 4s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .slide-indicator {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide-indicator.active {
          background: #10b981;
          width: 2rem;
          box-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
        }
        .btn-submit {
          background: linear-gradient(135deg, #0d2e2a, #1a4f4a);
          border: 1px solid rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
        }
        .btn-submit:hover {
          background: linear-gradient(135deg, #1a4f4a, #0d2e2a);
          border-color: rgba(16, 185, 129, 0.6);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.2);
          transform: scale(1.02);
        }
        .btn-submit:active {
          transform: scale(0.98);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
        .footer-link {
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.3s ease;
        }
        .footer-link:hover {
          color: #10b981;
          transform: translateX(2px);
        }
        .footer-icon {
          transition: all 0.3s ease;
        }
        .footer-icon:hover {
          transform: scale(1.1) translateY(-2px);
          color: #10b981;
        }
      `}</style>

      <div className="min-h-[calc(100vh-140px)] grid place-items-center px-4 py-10">
        {/* ✅ ✅ ✅ إزالة animate-float-slow من هنا لإيقاف حركة الفورم ✅ ✅ ✅ */}
        <div className="w-full max-w-md">
          
          {/* ===== الشعار ===== */}
          <div className="text-center text-white mb-6">
            <div className="inline-flex items-center gap-3">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] border-2 border-emerald-400/40 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                  <AnimatedLogoIcon Icon={House} className="h-7 w-7 text-emerald-300" delay={0} />
                </div>
                <span className="absolute -inset-1 rounded-2xl bg-emerald-400/30 blur-lg animate-pulse" />
              </div>
              <div>
                <div className="font-black text-2xl tracking-tight text-white flex items-center gap-2">
                  {t("brand")}
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-[11px] text-emerald-300 tracking-widest uppercase font-bold mt-0.5 flex items-center gap-1.5 justify-center">
                  <span className="h-0.5 w-4 bg-emerald-400" />
                  {t("tagline")}
                  <span className="h-0.5 w-4 bg-emerald-400" />
                </div>
              </div>
            </div>
          </div>

          {/* ===== البطاقة ===== */}
          <div className="rounded-3xl glass-card shadow-2xl p-6 md:p-8 text-white relative overflow-hidden auth-shimmer">
            
            {/* شريط علوي متدرج */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-400" />
            
            {/* الرأس */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-white">
                {isLogin ? "تسجيل الدخول" : "إنشاء حساب جديد"}
              </h2>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 backdrop-blur border border-emerald-400/30 grid place-items-center animate-pulse">
                <Sparkles className="h-5 w-5 text-emerald-300" />
              </div>
            </div>
            <p className="text-emerald-300/80 text-sm mt-1">
              {isLogin ? "أهلاً بعودتك 👋" : "خطوة واحدة تفصلك عن عالم التسوق 🛍️"}
            </p>

            {/* ===== النموذج ===== */}
            <form className="space-y-3.5 mt-5" onSubmit={handleSubmit} autoComplete="off">
              
              {/* ✅ الاسم الكامل (للتسجيل فقط) */}
              {isRegister && (
                <GlassField label={t("full_name") + " *"} icon={<FloatingFieldIcon Icon={UserIcon} className="h-4 w-4 text-emerald-300" delay={0} />}>
                  <Input 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                    autoComplete="off"
                    className="input-glow transition-all duration-300 rounded-xl" 
                    placeholder={app.lang === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                  />
                </GlassField>
              )}

              {/* ✅ رقم الهاتف */}
              <GlassField label={t("phone") + " *"} icon={<FloatingFieldIcon Icon={Phone} className="h-4 w-4 text-emerald-300" delay={100} />}>
                <div className="relative">
                  <Input 
                    type="tel" 
                    placeholder="+963 9xx xxx xxx" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    required 
                    autoComplete="off"
                    className={`
                      input-glow transition-all duration-300 rounded-xl
                      ${phoneError && isRegister ? 'border-red-500 focus-visible:ring-red-500 focus-visible:ring-2' : ''}
                      ${phoneAvailable === true && isRegister && phone.trim().length >= 5 ? 'border-emerald-400' : ''}
                    `}
                  />
                  {isRegister && phone.trim().length >= 5 && (
                    <div className="absolute inset-y-0 end-3 flex items-center">
                      {isCheckingPhone ? (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                      ) : phoneAvailable === true ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      ) : phoneAvailable === false ? (
                        <X className="h-4 w-4 text-red-400" />
                      ) : null}
                    </div>
                  )}
                </div>
              </GlassField>

              {/* ✅ حالة رقم الهاتف - رسائل تحذيرية فقط */}
              {isRegister && phone.trim().length >= 5 && phoneError && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/25 border-2 border-red-500/40 shadow-lg shadow-red-500/10 animate-in slide-in-from-top-2 duration-300">
                  <div className="h-8 w-8 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-red-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-200">
                      {phoneError.includes("صيغة") || phoneError.includes("يبدأ") 
                        ? "⚠️ صيغة الرقم غير صحيحة" 
                        : phoneError.includes("مستخدم")
                        ? "⚠️ رقم الهاتف مستخدم"
                        : "⚠️ خطأ في الرقم"}
                    </p>
                    <p className="text-xs text-red-300/80">
                      {phoneError}
                    </p>
                  </div>
                </div>
              )}

              {/* ✅ كلمة المرور */}
              <GlassField label={t("password") + " *"} icon={<FloatingFieldIcon Icon={Lock} className="h-4 w-4 text-emerald-300" delay={200} />}>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6}
                    autoComplete="off"
                    className="pe-10 input-glow transition-all duration-300 rounded-xl"
                    placeholder={app.lang === "ar" ? "كلمة مرور قوية (6 أحرف على الأقل)" : "Strong password (6+ characters)"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 my-auto end-3 text-emerald-400/70 hover:text-emerald-300 transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </GlassField>

              {/* ✅ العنوان (للتسجيل فقط) */}
              {isRegister && (
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-white/90 flex items-center gap-2">
                    <span className="h-1 w-3 rounded-full bg-emerald-400/60" />
                    {app.lang === "ar" ? "📍 العنوان *" : "📍 Address *"}
                  </Label>
                  <div className="rounded-xl bg-white/95 text-slate-800 p-3 border-2 border-emerald-400/30 focus-within:border-emerald-400/60 transition-all duration-300 shadow-inner">
                    <AddressPicker 
                      value={location ?? undefined} 
                      onChange={setLocation} 
                      lang={app.lang} 
                    />
                  </div>
                  
                  {/* عرض المحافظة المكتشفة */}
                  {location && (
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                      {isExtractingGovernorate ? (
                        <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                      ) : (
                        <MapPin className="h-4 w-4 text-emerald-300" />
                      )}
                      <span className="text-sm text-emerald-200 font-medium">
                        {isExtractingGovernorate 
                          ? (app.lang === "ar" ? "جاري تحديد المحافظة..." : "Detecting governorate...")
                          : detectedGovernorate 
                            ? (app.lang === "ar" ? `🏛️ المحافظة: ${detectedGovernorate}` : `🏛️ Governorate: ${detectedGovernorate}`)
                            : (app.lang === "ar" ? "⚠️ لم يتم تحديد المحافظة" : "⚠️ Governorate not detected")
                        }
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ زر الإرسال */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 btn-submit text-white font-bold text-base rounded-xl shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300 relative overflow-hidden group"
                disabled={loading || (isRegister && (phoneAvailable === false || phoneError !== null))}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {loading ? (
                  <span className="flex items-center gap-2 relative z-10">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {app.lang === "ar" ? "جاري..." : "Loading..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 relative z-10">
                    {isLogin ? (
                      <>
                        <Lock className="h-4 w-4" />
                        {t("login")}
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        {t("register")}
                      </>
                    )}
                  </span>
                )}
              </Button>

              {/* ✅ الروابط الإضافية */}
              <div className="text-sm text-center text-white/85 pt-1 space-y-2">
                {isLogin ? (
                  <>
                    <div>
                      {(app.lang === "ar" ? "ليس لديك حساب؟" : "No account?")}{" "}
                      <Link to="/auth/$mode" params={{ mode: "register" }} className="text-emerald-300 font-semibold hover:text-emerald-200 transition hover:underline">
                        {t("register")}
                      </Link>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        className="text-sm text-white/60 hover:text-white transition underline-offset-2 hover:underline flex items-center justify-center gap-1 mx-auto"
                      >
                        <HelpCircle className="h-3.5 w-3.5 text-emerald-300" />
                        {app.lang === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                      </button>
                    </div>
                    
                    {app.user && (
                      <div className="pt-2 border-t border-white/10 mt-2 space-y-1">
                        {isDeliveryCompany && (
                          <Link 
                            to="/delivery/dashboard" 
                            className="block text-sm text-emerald-300 hover:text-emerald-200 transition font-medium"
                          >
                            🚚 {app.lang === "ar" ? "لوحة شركة التوصيل" : "Delivery Company Dashboard"}
                          </Link>
                        )}
                        {isDistributor && (
                          <Link 
                            to="/distributor/dashboard" 
                            className="block text-sm text-blue-300 hover:text-blue-200 transition font-medium"
                          >
                            📦 {app.lang === "ar" ? "لوحة الموزع" : "Distributor Dashboard"}
                          </Link>
                        )}
                        {isAdmin && (
                          <Link 
                            to="/admin" 
                            className="block text-sm text-red-300 hover:text-red-200 transition font-medium"
                          >
                            ⚡ {app.lang === "ar" ? "لوحة الأدمن" : "Admin Panel"}
                          </Link>
                        )}
                        {isSeller && (
                          <Link 
                            to="/dashboard" 
                            className="block text-sm text-amber-300 hover:text-amber-200 transition font-medium"
                          >
                            🏪 {app.lang === "ar" ? "لوحة البائع" : "Seller Dashboard"}
                          </Link>
                        )}
                      </div>
                    )}
                  </>
               ) : (
                  <>
                    <div>
                      {(app.lang === "ar" ? "لديك حساب؟" : "Have an account?")}{" "}
                      <Link to="/auth/$mode" params={{ mode: "login" }} className="text-emerald-300 font-semibold hover:text-emerald-200 transition hover:underline">
                        {t("login")}
                      </Link>
                    </div>
                    
                    {/* ✅ زر التصفح كزائر */}
                    <div className="relative pt-2">
                      <div className="relative">
                        <div className="absolute -top-2 left-0 right-0 flex items-center gap-2">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
                          <span className="text-[9px] text-emerald-400/40 font-bold tracking-widest whitespace-nowrap">
                            {app.lang === "ar" ? "أو" : "OR"}
                          </span>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
                        </div>
                        
                        <Link
                          to="/"
                          className="group relative block w-full mt-3"
                        >
                          <Button
                            variant="outline"
                            className="w-full h-11 rounded-xl border-2 border-emerald-400/40 hover:border-emerald-400/70 bg-emerald-500/10 hover:bg-emerald-500/20 text-white font-bold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 relative overflow-hidden shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            
                            <span className="relative flex items-center justify-center gap-2.5">
                              <span className="flex items-center gap-1">
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse delay-200" />
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse delay-400" />
                              </span>
                              
                              <span className="text-emerald-200 font-extrabold tracking-wide">
                                {app.lang === "ar" ? "👀 تصفح كزائر" : "👀 Browse as Guest"}
                              </span>
                              
                              <span className="inline-block animate-pulse text-emerald-300">
                                →
                              </span>
                            </span>
                          </Button>
                        </Link>
                        
                        <p className="text-[10px] text-emerald-300/60 mt-1.5 flex items-center justify-center gap-1">
                          <Shield className="h-3 w-3 text-emerald-400/40" />
                          {app.lang === "ar" 
                            ? "✨ تصفح المتجر واكتشف المنتجات بدون تسجيل" 
                            : "✨ Browse the store and discover products without signing up"}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* ============================================================ */}
          {/* ✅ الفوتر الداخلي */}
          {/* ============================================================ */}
          <div className="mt-6 pt-4 border-t border-white/10">
            
            {/* رقم الهاتف */}
            <div className="text-center mb-3">
              <a 
                href="tel:+963110000000" 
                dir="ltr"
                className="text-sm text-white/70 hover:text-emerald-300 transition font-mono flex items-center justify-center gap-2 group"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400/60 group-hover:text-emerald-300 transition" />
                <span className="group-hover:tracking-wider transition-all">+963 11 000 0000</span>
              </a>
            </div>

            {/* مواقع التواصل الاجتماعي */}
            <div className="flex items-center justify-center gap-2 mb-3">
              {[
                { icon: Twitter, label: "Twitter", color: "hover:text-[#1a9cd8]" },
                { icon: Instagram, label: "Instagram", color: "hover:text-pink-500" },
                { icon: Facebook, label: "Facebook", color: "hover:text-[#1877f2]" },
                { icon: Youtube, label: "YouTube", color: "hover:text-red-500" },
                { icon: Globe, label: "Website", color: "hover:text-emerald-300" },
              ].map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href="#"
                    aria-label={social.label}
                    className={cn(
                      "h-9 w-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center",
                      "text-white/60 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1",
                      "hover:bg-white/10 hover:border-emerald-400/30",
                      social.color
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {/* روابط السياسات */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <Link to="/privacy" className="text-white/50 hover:text-emerald-300 transition footer-link">
                {app.lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/terms" className="text-white/50 hover:text-emerald-300 transition footer-link">
                {app.lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/faq" className="text-white/50 hover:text-emerald-300 transition footer-link">
                {app.lang === "ar" ? "الأسئلة الشائعة" : "FAQ"}
              </Link>
              <span className="text-white/20">•</span>
              <span className="text-white/30 text-[10px]">
                © {year} {t("brand")}
              </span>
            </div>

            {/* شارة الأمان */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-emerald-300 font-medium text-[10px]">
                  {app.lang === "ar" ? "نظام آمن ومشفر" : "Secure & Encrypted"}
                </span>
              </div>
            </div>
          </div>

          {/* نقاط التنقل في السلايدر */}
          <div className="mt-4 flex justify-center gap-2">
            {SLIDER_IMAGES.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setSlide(i)} 
                aria-label={`slide ${i}`}
                className={`slide-indicator h-1.5 rounded-full transition-all duration-300 ${
                  slide === i 
                    ? "w-8 bg-emerald-400 shadow-lg shadow-emerald-500/50" 
                    : "w-2 bg-white/30 hover:bg-white/60"
                }`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* زر الدعم */}
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
            bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] 
            hover:from-[#1a4f4a] hover:to-[#0d2e2a] 
            text-white border border-emerald-400/30
            shadow-lg shadow-emerald-500/20 
            hover:shadow-xl hover:shadow-emerald-500/30 
            transition-all duration-300 
            ${isHovered ? 'scale-105 -translate-y-1' : ''}
          `}
        >
          <div className="relative">
            <Headphones className="h-5 w-5 text-emerald-300" />
            {!isHovered && (
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </div>
          <span className="font-medium text-sm hidden sm:inline">
            {app.lang === "ar" ? "الدعم والمساعدة" : "Support & Help"}
          </span>
          {isHovered && (
            <span className="absolute -top-10 -right-2 bg-[#0d2e2a] text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap animate-in fade-in zoom-in-95 border border-emerald-400/30">
              {app.lang === "ar" ? "نسعد بمساعدتك 🤝" : "We're here to help 🤝"}
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <div className="bg-[#0d2e2a] rounded-3xl max-w-md w-full shadow-2xl border border-emerald-400/30 animate-in zoom-in-95 duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] p-6 border-b border-emerald-400/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-emerald-300" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">
                        {app.lang === "ar" ? "الدعم والمساعدة" : "Support & Help"}
                      </h3>
                      <p className="text-emerald-300/80 text-sm">
                        {app.lang === "ar" ? "نحن هنا لمساعدتك 💙" : "We're here to help 💙"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {isSuccess ? (
                  <div className="text-center py-8">
                    <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      {app.lang === "ar" ? "تم الإرسال ✅" : "Sent ✅"}
                    </h4>
                    <p className="text-sm text-emerald-300/80 mt-1">
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
                          className="mt-1.5 h-11 rounded-xl bg-white/10 border-emerald-400/20 text-white cursor-not-allowed"
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
                          className="mt-1.5 h-11 rounded-xl bg-white/5 border-emerald-400/20 text-white placeholder:text-white/40 focus:border-emerald-400/50 transition-all"
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
                        className="mt-1.5 h-11 rounded-xl bg-white/5 border-emerald-400/20 text-white placeholder:text-white/40 focus:border-emerald-400/50 transition-all"
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
                        className="mt-1.5 w-full px-4 py-3 rounded-xl bg-white/5 border border-emerald-400/20 text-white placeholder:text-white/40 focus:border-emerald-400/50 focus:bg-white/10 focus:outline-none transition-all resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmitSupport}
                      disabled={isLoading || !message.trim() || (!app.user && !visitorPhone.trim())}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white font-semibold border border-emerald-400/30 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {app.lang === "ar" ? "جاري الإرسال..." : "Sending..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4 text-emerald-300" />
                          {app.lang === "ar" ? "إرسال" : "Send"}
                        </span>
                      )}
                    </Button>

                    <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
                      <Shield className="h-4 w-4 text-emerald-300 shrink-0" />
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
    </>
  );
}