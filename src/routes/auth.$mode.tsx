// src/routes/auth.$mode.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  Lock,
  User as UserIcon,
  Phone,
  Sparkles,
  Eye,
  EyeOff,
  Headphones,
  X,
  Send,
  CheckCircle,
  Shield,
  HelpCircle,
  Loader2,
  AlertCircle,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ShoppingBag,
  Truck,
  Compass,
  Gem,
  Crown,
  Rocket,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AddressPicker,
  type PickedLocation,
} from "@/components/AddressPicker";
import { useUserRoles } from "@/lib/queries";
import { getAuthRedirect } from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const ZOOQ_COLORS = {
  primary: "#2a655f",
  pink: "#f9a8d4",
  pinkLight: "#fbcfe8",
};

// ============================================================
// ✅ Export route
// ============================================================
export const Route = createFileRoute("/auth/$mode")({
  component: AuthPage,
  head: () => ({
    meta: [{ title: "zooq — ذوق" }],
  }),
});

// ============================================================
// Helper functions
// ============================================================
function phoneToEmail(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  return `sy${digits}@souqi.local`;
}

function isValidSyrianPhoneFormat(
  phone: string
): { valid: boolean; message?: string } {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

  if (!/^[0-9+]+$/.test(cleanPhone)) {
    return {
      valid: false,
      message: "⚠️ الرقم يجب أن يحتوي على أرقام فقط",
    };
  }

  const digits = cleanPhone.replace(/[^0-9]/g, "");

  let isValid = false;
  let numberAfterPrefix = "";

  if (cleanPhone.startsWith("+963")) {
    if (digits.length === 12) {
      numberAfterPrefix = digits.slice(-9);
      isValid = numberAfterPrefix.startsWith("9");
    }
  } else if (cleanPhone.startsWith("00963")) {
    if (digits.length === 14) {
      numberAfterPrefix = digits.slice(-9);
      isValid = numberAfterPrefix.startsWith("9");
    }
  } else if (cleanPhone.startsWith("0")) {
    if (digits.length === 10) {
      numberAfterPrefix = digits.slice(1);
      isValid = numberAfterPrefix.startsWith("9");
    }
  } else if (digits.length === 9) {
    numberAfterPrefix = digits;
    isValid = numberAfterPrefix.startsWith("9");
  }

  if (!isValid) {
    return {
      valid: false,
      message:
        "⚠️ صيغة الرقم غير صحيحة. استخدم: +963xxxxxxxxx أو 0xxxxxxxxx (يبدأ بـ 9)",
    };
  }

  return { valid: true };
}

async function isPhoneAvailableForRegister(
  phone: string
): Promise<{
  available: boolean;
  message?: string;
}> {
  if (!phone || phone.trim().length < 5) {
    return {
      available: false,
      message: "رقم الهاتف غير صحيح (يجب أن يكون 5 أرقام على الأقل)",
    };
  }

  const formatCheck = isValidSyrianPhoneFormat(phone);

  if (!formatCheck.valid) {
    return {
      available: false,
      message: formatCheck.message || "⚠️ صيغة الرقم غير صحيحة",
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
      message: "حدث خطأ في التحقق من الرقم",
    };
  }

  if (data) {
    return {
      available: false,
      message: "⚠️ هذا الرقم مستخدم من قبل حساب آخر",
    };
  }

  return {
    available: true,
  };
}

async function extractGovernorateFromAddress(
  address: string,
  lat?: number,
  lng?: number
): Promise<{
  governorate_id: string;
  governorate_name: string;
}> {
  try {
    if (lat && lng) {
      const { data: governorates } = await supabase
        .from("governorates")
        .select("*");

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
                governorate_name: g.name_ar,
              };
            }
          }
        }
      }
    }

    if (address) {
      const { data: governorates } = await supabase
        .from("governorates")
        .select("*");

      if (governorates) {
        for (const g of governorates) {
          if (
            address.includes(g.name_ar) ||
            address.includes(g.name_en || "")
          ) {
            return {
              governorate_id: g.id,
              governorate_name: g.name_ar,
            };
          }
        }
      }
    }

    const { data: defaultGov } = await supabase
      .from("governorates")
      .select("id, name_ar")
      .eq("name_ar", "دمشق")
      .single();

    if (defaultGov) {
      return {
        governorate_id: defaultGov.id,
        governorate_name: defaultGov.name_ar,
      };
    }

    return {
      governorate_id: "",
      governorate_name: "",
    };
  } catch (error) {
    console.error("Error extracting governorate:", error);

    return {
      governorate_id: "",
      governorate_name: "",
    };
  }
}

async function saveAddressWithGovernorate(
  userId: string,
  location: PickedLocation
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { governorate_id, governorate_name } =
      await extractGovernorateFromAddress(
        location.address,
        location.lat,
        location.lng
      );

    console.log(
      "📍 Extracted governorate:",
      governorate_name,
      "ID:",
      governorate_id
    );

    const addressPayload = {
      user_id: userId,
      label: location.label || "الرئيسي",
      address_text: location.address.trim(),
      details: location.details?.trim() || "",
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

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase
        .from("user_addresses")
        .insert(addressPayload);

      if (error) {
        throw error;
      }
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
      console.error(
        "❌ Error updating profile:",
        updateProfileError
      );

      throw updateProfileError;
    }

    console.log(
      "✅ Address saved with governorate:",
      governorate_name
    );

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("❌ Error saving address:", error);

    return {
      success: false,
      error: error.message,
    };
  }
}

// ============================================================
// 🎨 ZOOQ — Brand slider content
// ============================================================
const SLIDER_IMAGES: string[] = [];

const ZOOQ_SLIDES = [
  {
    arTitle: "كل ذوق… إله مكان.",
    arText:
      "اكتشف متاجر ومنتجات بتشبهك، وخلي اختيارك يحكي عنك.",
    enTitle: "Every taste has a place.",
    enText:
      "Discover stores and products that feel like you.",
    icon: Compass,
    accent: "pink",
  },
  {
    arTitle: "مو بس تسوّق…",
    arText:
      "اختار. اكتشف. واستمتع بتجربة معمولة على ذوقك.",
    enTitle: "More than shopping.",
    enText:
      "Discover. Choose. Enjoy a shopping experience made for you.",
    icon: Sparkles,
    accent: "olive",
  },
  {
    arTitle: "الاختيار إلو ذوق.",
    arText:
      "ومن هون… بيبدأ الاختيار الصح.",
    enTitle: "Choice has a taste.",
    enText:
      "And this is where the right choice begins.",
    icon: Gem,
    accent: "pink",
  },
  {
    arTitle: "اللي بتدور عليه… أقرب مما تتخيّل.",
    arText:
      "مكان واحد، آلاف الخيارات، وذوقك هو البداية.",
    enTitle: "What you want is closer than you think.",
    enText:
      "One place. Endless choices. Your taste leads the way.",
    icon: Rocket,
    accent: "olive",
  },
  {
    arTitle: "خلّي ذوقك يحكي.",
    arText:
      "تسوّق بطريقتك. اختار بطريقتك. وكن أنت.",
    enTitle: "Let your taste speak.",
    enText:
      "Shop your way. Choose your way. Be you.",
    icon: Crown,
    accent: "pink",
  },
];

// ============================================================
// GlassField
// ============================================================
function GlassField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <Label className="flex items-center gap-2 text-xs font-bold text-white/90">
        <span className="h-1 w-3 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.55)]" />
        {label}
      </Label>

      <div className="relative mt-1.5">
        <span className="absolute inset-y-0 start-3 z-10 my-auto h-4 w-4 text-[#f9a8d4]">
          {icon}
        </span>

        <div className="[&_input]:h-12 [&_input]:rounded-2xl [&_input]:border-0 [&_input]:bg-white/[.97] [&_input]:ps-9 [&_input]:text-slate-800 [&_input]:placeholder:text-slate-400 [&_input]:shadow-[0_4px_20px_rgba(0,0,0,.08)] [&_input]:focus:ring-2 [&_input]:focus:ring-[#f9a8d4]/50">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// AuthPage
// ============================================================
function AuthPage() {
  const { mode } = Route.useParams();
  const app = useApp();
  const t = useT();
  const nav = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [location, setLocation] =
    useState<PickedLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [phoneError, setPhoneError] =
    useState<string | null>(null);
  const [phoneAvailable, setPhoneAvailable] =
    useState<boolean | null>(null);

  const [detectedGovernorate, setDetectedGovernorate] =
    useState<string>("");
  const [isExtractingGovernorate, setIsExtractingGovernorate] =
    useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % 5);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

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
        const result =
          await isPhoneAvailableForRegister(cleanPhone);

        setPhoneAvailable(result.available);

        setPhoneError(
          result.available
            ? null
            : result.message || null
        );
      } catch (error) {
        console.error("Error checking phone:", error);

        setPhoneError(
          "حدث خطأ في التحقق من الرقم"
        );

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
        setDetectedGovernorate("");
        return;
      }

      setIsExtractingGovernorate(true);

      try {
        const result =
          await extractGovernorateFromAddress(
            location.address,
            location.lat,
            location.lng
          );

        setDetectedGovernorate(
          result.governorate_name
        );
      } catch (error) {
        console.error(
          "Error extracting governorate:",
          error
        );
      } finally {
        setIsExtractingGovernorate(false);
      }
    };

    extractGovernorate();
  }, [location]);

  function handleForgotPasswordClick() {
    nav({
      to: "/reset-password",
    });
  }

  function getLoginErrorMessage(error: any): string {
    const message = error?.message || String(error);
    const lang = app.lang === "ar" ? "ar" : "en";

    const errorMessages: Record<
      string,
      { ar: string; en: string }
    > = {
      "Invalid login credentials": {
        ar: "❌ رقم الهاتف أو كلمة المرور غير صحيحة",
        en: "❌ Invalid phone number or password",
      },
      "Email not confirmed": {
        ar: "⚠️ البريد الإلكتروني غير مؤكد. يرجى التحقق من بريدك الإلكتروني",
        en: "⚠️ Email not confirmed. Please check your email",
      },
      "User not found": {
        ar: "❌ لا يوجد حساب بهذا الرقم",
        en: "❌ No account found with this number",
      },
      "Invalid password": {
        ar: "❌ كلمة المرور غير صحيحة",
        en: "❌ Invalid password",
      },
      "Too many requests": {
        ar: "⚠️ عدد كبير من المحاولات. يرجى المحاولة لاحقاً",
        en: "⚠️ Too many attempts. Please try again later",
      },
    };

    for (const [key, value] of Object.entries(
      errorMessages
    )) {
      if (
        message
          .toLowerCase()
          .includes(key.toLowerCase())
      ) {
        return value[lang];
      }
    }

    if (
      message.includes("phone") ||
      message.includes("رقم")
    ) {
      return lang === "ar"
        ? "❌ رقم الهاتف غير صحيح"
        : "❌ Invalid phone number";
    }

    if (
      message.includes("password") ||
      message.includes("كلمة المرور")
    ) {
      return lang === "ar"
        ? "❌ كلمة المرور غير صحيحة"
        : "❌ Invalid password";
    }

    return lang === "ar"
      ? `❌ حدث خطأ: ${message}`
      : `❌ Error: ${message}`;
  }

  function getRegisterErrorMessage(error: any): string {
    const message = error?.message || String(error);
    const lang = app.lang === "ar" ? "ar" : "en";

    const errorMessages: Record<
      string,
      { ar: string; en: string }
    > = {
      "User already registered": {
        ar: "⚠️ هذا الرقم مسجل مسبقاً. يرجى تسجيل الدخول",
        en: "⚠️ This number is already registered. Please login",
      },
      "Password should be at least 6 characters": {
        ar: "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل",
        en: "❌ Password must be at least 6 characters",
      },
      "Email already in use": {
        ar: "⚠️ هذا الرقم مستخدم من قبل حساب آخر",
        en: "⚠️ This number is already in use",
      },
      "Network error": {
        ar: "⚠️ خطأ في الشبكة. يرجى التحقق من الاتصال بالإنترنت",
        en: "⚠️ Network error. Please check your internet connection",
      },
    };

    for (const [key, value] of Object.entries(
      errorMessages
    )) {
      if (
        message
          .toLowerCase()
          .includes(key.toLowerCase())
      ) {
        return value[lang];
      }
    }

    if (
      message.includes("phone") ||
      message.includes("رقم")
    ) {
      return lang === "ar"
        ? "❌ رقم الهاتف غير صحيح"
        : "❌ Invalid phone number";
    }

    if (
      message.includes("password") ||
      message.includes("كلمة المرور")
    ) {
      return lang === "ar"
        ? "❌ كلمة المرور غير صحيحة"
        : "❌ Invalid password";
    }

    return lang === "ar"
      ? `❌ حدث خطأ: ${message}`
      : `❌ Error: ${message}`;
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!phone.trim() || !password.trim()) {
        toast.error(
          app.lang === "ar"
            ? "❌ رقم الهاتف وكلمة المرور مطلوبة"
            : "❌ Phone and password are required"
        );

        setLoading(false);
        return;
      }

      const formatCheck =
        isValidSyrianPhoneFormat(phone);

      if (!formatCheck.valid) {
        toast.error(
          app.lang === "ar"
            ? "❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx"
            : "❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx"
        );

        setLoading(false);
        return;
      }

      const digits = phone.replace(
        /[^0-9]/g,
        ""
      );

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
        console.log(
          "🔍 Trying email format:",
          email
        );

        const res =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (!res.error) {
          signInData = res.data;

          console.log(
            "✅ Successfully signed in with:",
            email
          );

          break;
        } else {
          signInError = res.error;
        }
      }

      if (!signInData && signInError) {
        const errorMessage =
          getLoginErrorMessage(signInError);

        toast.error(errorMessage);

        setLoading(false);
        return;
      }

      const redirect =
        await getAuthRedirect(
          signInData.user
        );

      toast.success(
        app.lang === "ar"
          ? "✨ أهلاً بعودتك إلى ذوق"
          : "✨ Welcome back to Zooq"
      );

      nav({
        to: redirect.url,
        state: {
          showLoginSplash: true,
        },
      });
    } catch (err: any) {
      console.error(
        "❌ Login error:",
        err
      );

      const errorMessage =
        getLoginErrorMessage(err);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(
    e: FormEvent
  ) {
    e.preventDefault();
    setLoading(true);

    try {
      if (!phone.trim()) {
        toast.error(
          app.lang === "ar"
            ? "❌ رقم الهاتف مطلوب"
            : "❌ Phone is required"
        );

        setLoading(false);
        return;
      }

      const formatCheck =
        isValidSyrianPhoneFormat(phone);

      if (!formatCheck.valid) {
        toast.error(
          app.lang === "ar"
            ? "❌ صيغة الرقم غير صحيحة. استخدم +963xxxxxxxxx أو 0xxxxxxxxx"
            : "❌ Invalid phone format. Use +963xxxxxxxxx or 0xxxxxxxxx"
        );

        setLoading(false);
        return;
      }

      if (phoneError) {
        toast.error(phoneError);
        setLoading(false);
        return;
      }

      if (phoneAvailable === false) {
        toast.error(
          app.lang === "ar"
            ? "⚠️ هذا الرقم مستخدم من قبل"
            : "⚠️ This phone is already in use"
        );

        setLoading(false);
        return;
      }

      if (!fullName.trim()) {
        toast.error(
          app.lang === "ar"
            ? "❌ الاسم الكامل مطلوب"
            : "❌ Full name is required"
        );

        setLoading(false);
        return;
      }

      if (!password.trim()) {
        toast.error(
          app.lang === "ar"
            ? "❌ كلمة المرور مطلوبة"
            : "❌ Password is required"
        );

        setLoading(false);
        return;
      }

      if (password.length < 6) {
        toast.error(
          app.lang === "ar"
            ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل"
            : "❌ Password must be at least 6 characters"
        );

        setLoading(false);
        return;
      }

      if (!location) {
        toast.error(
          app.lang === "ar"
            ? "❌ الرجاء اختيار الموقع على الخريطة"
            : "❌ Please select a location on the map"
        );

        setLoading(false);
        return;
      }

      if (
        !location.address ||
        location.address.trim() === ""
      ) {
        toast.error(
          app.lang === "ar"
            ? "❌ الرجاء اختيار عنوان صحيح من الخريطة"
            : "❌ Please select a valid address from the map"
        );

        setLoading(false);
        return;
      }

      const addressDetails =
        location.details?.trim() || "";

      if (!addressDetails) {
        toast.error(
          app.lang === "ar"
            ? "❌ الرجاء إدخال وصف تفصيلي للعنوان"
            : "❌ Please enter a detailed description for the address"
        );

        setLoading(false);
        return;
      }

      const { data, error } =
        await supabase.auth.signUp({
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
        const errorMessage =
          getRegisterErrorMessage(error);

        toast.error(errorMessage);

        setLoading(false);
        return;
      }

      const signInResult =
        await supabase.auth.signInWithPassword({
          email: phoneToEmail(phone),
          password,
        });

      if (signInResult.error) {
        const errorMessage =
          getLoginErrorMessage(
            signInResult.error
          );

        toast.error(errorMessage);

        setLoading(false);
        return;
      }

      const uid =
        signInResult.data.user?.id ??
        data?.user?.id;

      if (!uid) {
        toast.error(
          app.lang === "ar"
            ? "❌ فشل تسجيل الدخول بعد التسجيل"
            : "❌ Failed to sign in after registration"
        );

        setLoading(false);
        return;
      }

      const profileData = {
        id: uid,
        full_name: fullName.trim(),
        phone: phone.trim(),
      };

      const { error: profileError } =
        await supabase
          .from("profiles")
          .upsert(profileData, {
            onConflict: "id",
          });

      if (profileError) {
        console.error(
          "Profile error:",
          profileError
        );

        toast.error(
          app.lang === "ar"
            ? "⚠️ حدث خطأ في حفظ الملف الشخصي"
            : "⚠️ Error saving profile"
        );

        setLoading(false);
        return;
      }

      const saveResult =
        await saveAddressWithGovernorate(
          uid,
          location
        );

      if (!saveResult.success) {
        console.warn(
          "⚠️ Address saved but governorate extraction failed:",
          saveResult.error
        );
      }

      if (detectedGovernorate) {
        toast.success(
          app.lang === "ar"
            ? `✨ تم تحديد المحافظة: ${detectedGovernorate}`
            : `✨ Governorate detected: ${detectedGovernorate}`
        );
      }

      toast.success(
        app.lang === "ar"
          ? "🎉 أهلاً فيك بعالم ذوق!"
          : "🎉 Welcome to the world of Zooq!"
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const redirect =
          await getAuthRedirect(user);

        setTimeout(() => {
          window.location.replace(
            redirect.url
          );
        }, 500);
      } else {
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (err: any) {
      console.error(
        "Registration error:",
        err
      );

      const errorMessage =
        getRegisterErrorMessage(err);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(
    e: FormEvent
  ) {
    e.preventDefault();

    if (isLogin) {
      await handleLogin(e);
    } else {
      await handleRegister(e);
    }
  }

  const {
    data: userRoles = [],
  } = useUserRoles(app.user?.id);

  const isDeliveryCompany =
    userRoles.includes(
      "delivery_company"
    );

  const isDistributor =
    userRoles.includes(
      "distributor"
    );

  const isAdmin =
    userRoles.includes("admin");

  const isSeller =
    userRoles.includes("seller");

  const year = new Date().getFullYear();

  const CurrentSlideIcon =
    ZOOQ_SLIDES[slide]?.icon ??
    Sparkles;

  const currentSlide =
    ZOOQ_SLIDES[slide];

  return (
    <div
      dir={
        app.lang === "ar"
          ? "rtl"
          : "ltr"
      }
      className="relative min-h-[calc(100vh-140px)] overflow-hidden bg-[#071f1c] text-white selection:bg-[#f9a8d4]/30"
    >
      {/* ======================================================
          PREMIUM BACKGROUND
      ====================================================== */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(249,168,212,.18),transparent_30%),radial-gradient(circle_at_90%_20%,rgba(42,101,95,.32),transparent_35%),radial-gradient(circle_at_55%_90%,rgba(251,207,232,.08),transparent_35%)]" />

        <div className="absolute inset-0 bg-gradient-to-br from-[#071f1c] via-[#0d2e2a] to-[#071f1c]" />

        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(249,168,212,.06)_35%,transparent_55%,rgba(42,101,95,.08)_80%,transparent_100%)] opacity-40" />
      </div>

      {/* ======================================================
          PREMIUM ANIMATIONS
      ====================================================== */}
      <style>{`
        @keyframes zooq-float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-9px) rotate(.5deg);
          }
        }

        @keyframes zooq-pulse {
          0%, 100% {
            opacity: .35;
            transform: scale(1);
          }

          50% {
            opacity: .9;
            transform: scale(1.08);
          }
        }

        @keyframes zooq-shine {
          0% {
            transform: translateX(-140%) skewX(-18deg);
          }

          100% {
            transform: translateX(280%) skewX(-18deg);
          }
        }

        @keyframes zooq-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes zooq-glow {
          0%, 100% {
            box-shadow:
              0 0 0 rgba(249,168,212,0);
          }

          50% {
            box-shadow:
              0 0 45px rgba(249,168,212,.12);
          }
        }

        /* ====================================================
           ✨ PREMIUM LOGO MOTION
           ==================================================== */

        @keyframes zooq-logo-float {
          0%, 100% {
            transform:
              translate3d(0, 0, 0)
              rotate(0deg)
              scale(1);
          }

          25% {
            transform:
              translate3d(0, -5px, 0)
              rotate(-1deg)
              scale(1.015);
          }

          50% {
            transform:
              translate3d(0, -10px, 0)
              rotate(0deg)
              scale(1.035);
          }

          75% {
            transform:
              translate3d(0, -5px, 0)
              rotate(1deg)
              scale(1.015);
          }
        }

        @keyframes zooq-logo-glow {
          0%, 100% {
            opacity: .35;
            transform: scale(.92);
          }

          50% {
            opacity: .8;
            transform: scale(1.08);
          }
        }

        @keyframes zooq-logo-ring {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes zooq-logo-shine {
          0% {
            opacity: 0;
            transform:
              translateX(-150%)
              rotate(20deg);
          }

          20% {
            opacity: .45;
          }

          45% {
            opacity: 0;
            transform:
              translateX(150%)
              rotate(20deg);
          }

          100% {
            opacity: 0;
            transform:
              translateX(150%)
              rotate(20deg);
          }
        }

        .zooq-logo-motion {
          animation:
            zooq-logo-float
            5.5s
            ease-in-out
            infinite;
          transform-origin: center;
          will-change: transform;
        }

        .zooq-logo-halo {
          animation:
            zooq-logo-glow
            4.5s
            ease-in-out
            infinite;
          will-change: transform, opacity;
        }

        .zooq-logo-ring {
          animation:
            zooq-logo-ring
            18s
            linear
            infinite;
          transform-origin: center;
          will-change: transform;
        }

        .zooq-logo-shine {
          animation:
            zooq-logo-shine
            5s
            ease-in-out
            infinite;
          pointer-events: none;
        }

        .zooq-logo-image {
          image-rendering: auto;
          backface-visibility: hidden;
          transform: translateZ(0);
          transition:
            transform .7s cubic-bezier(.2,.8,.2,1),
            filter .7s ease;
        }

        .zooq-logo-container:hover .zooq-logo-image {
          transform:
            scale(1.09)
            rotate(-1deg)
            translateY(-3px);
          filter:
            drop-shadow(0 28px 48px rgba(0,0,0,.62))
            drop-shadow(0 0 28px rgba(249,168,212,.18));
        }

        .zooq-logo-container:hover .zooq-logo-ring {
          animation-duration: 7s;
          opacity: .95;
        }

        .zooq-logo-container:hover .zooq-logo-halo {
          opacity: .95;
        }

        @media (prefers-reduced-motion: reduce) {
          .zooq-logo-motion,
          .zooq-logo-halo,
          .zooq-logo-ring,
          .zooq-logo-shine {
            animation: none !important;
          }

          .zooq-logo-image {
            transition: none !important;
          }
        }

        .zooq-glass {
          background:
            linear-gradient(
              145deg,
              rgba(9,35,32,.97),
              rgba(20,68,63,.91)
            );

          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);

          border: 1px solid rgba(255,255,255,.09);

          box-shadow:
            0 35px 100px rgba(0,0,0,.52),
            inset 0 1px 0 rgba(255,255,255,.055);
        }

        .zooq-glass-soft {
          background: rgba(255,255,255,.045);

          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          border: 1px solid rgba(255,255,255,.09);
        }

        .zooq-input:focus-within {
          box-shadow:
            0 0 0 3px rgba(249,168,212,.13),
            0 15px 40px rgba(249,168,212,.08);
        }

        .zooq-submit {
          background:
            linear-gradient(
              135deg,
              #ffffff 0%,
              #fbcfe8 28%,
              #f9a8d4 70%,
              #2a655f 135%
            );

          color: #082520;

          box-shadow:
            0 16px 38px rgba(249,168,212,.26),
            inset 0 1px 0 rgba(255,255,255,.7);

          transition:
            transform .3s ease,
            box-shadow .3s ease,
            filter .3s ease;
        }

        .zooq-submit:hover:not(:disabled) {
          transform: translateY(-3px);

          box-shadow:
            0 22px 50px rgba(249,168,212,.38),
            0 0 25px rgba(42,101,95,.16);

          filter: brightness(1.035);
        }

        .zooq-submit:active:not(:disabled) {
          transform: translateY(-1px) scale(.99);
        }

        .zooq-submit:disabled {
          opacity: .58;
          cursor: not-allowed;
        }

        .zooq-logo-float {
          animation:
            zooq-float
            5s
            ease-in-out
            infinite;
        }

        .zooq-link {
          transition:
            color .2s ease,
            opacity .2s ease,
            transform .2s ease;
        }

        .zooq-link:hover {
          color: #f9a8d4;
        }

        .zooq-social {
          transition: all .25s ease;
        }

        .zooq-social:hover {
          transform: translateY(-4px);
          color: #f9a8d4;
          border-color: rgba(249,168,212,.38);
          background: rgba(42,101,95,.18);
          box-shadow:
            0 8px 25px rgba(249,168,212,.08);
        }

        .zooq-brand-title {
          text-shadow:
            0 15px 45px rgba(0,0,0,.35);
        }

        .zooq-tagline {
          text-shadow:
            0 5px 25px rgba(0,0,0,.25);
        }

        .zooq-zooq-text {
          font-size: 2.2rem;
          letter-spacing: .16em;
          font-weight: 950;
        }

        .zooq-slide-content {
          animation:
            zooq-enter
            .7s
            ease
            both;
        }

        .zooq-glow-card {
          animation:
            zooq-glow
            4s
            ease-in-out
            infinite;
        }

        .zooq-o-pink {
          color: #f9a8d4;

          text-shadow:
            0 0 30px rgba(249,168,212,.38);
        }

        .zooq-o-olive {
          color: #2a655f;

          text-shadow:
            0 0 24px rgba(42,101,95,.32);
        }

        .zooq-pink-light {
          color: #fbcfe8;
        }

        .zooq-logo-frame {
          box-shadow:
            0 35px 80px rgba(0,0,0,.55),
            inset 0 1px 0 rgba(255,255,255,.08),
            inset 0 0 35px rgba(255,255,255,.018);
        }

        .zooq-logo-brand {
          text-shadow:
            0 12px 35px rgba(0,0,0,.45);
        }

        .zooq-logo-word {
          letter-spacing: .12em;
          font-weight: 950;
          line-height: 1;
        }

        .zooq-slide-title-accent {
          position: relative;
          display: inline-block;
        }

        .zooq-slide-title-accent::after {
          content: "";
          position: absolute;
          left: 4%;
          right: 4%;
          bottom: -7px;
          height: 3px;
          border-radius: 999px;
          background:
            linear-gradient(
              90deg,
              transparent,
              #2a655f 25%,
              #f9a8d4 50%,
              #2a655f 75%,
              transparent
            );
          opacity: .72;
          filter: blur(.2px);
        }

        .zooq-slide-accent-line {
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(42,101,95,.95),
              rgba(249,168,212,.85),
              transparent
            );
        }

        @media (min-width: 640px) {
          .zooq-zooq-text {
            font-size: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .zooq-zooq-text {
            font-size: 3.8rem;
          }
        }
      `}</style>

      {/* ======================================================
          DECORATIVE LIGHTS
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -start-32 -top-32 h-96 w-96 rounded-full bg-[#f9a8d4]/10 blur-3xl" />

        <div className="absolute -bottom-40 -end-20 h-[30rem] w-[30rem] rounded-full bg-[#2a655f]/25 blur-3xl" />

        <div className="absolute start-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fbcfe8]/5 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-140px)] w-full max-w-7xl items-center px-4 py-7 sm:px-6 lg:px-8">
        <div className="grid w-full items-stretch gap-5 lg:grid-cols-[1.08fr_.92fr]">

          {/* ====================================================
              BRAND / SLIDER
          ==================================================== */}
          <section className="relative hidden min-h-[670px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#092622]/85 shadow-[0_35px_100px_rgba(0,0,0,.45)] lg:block">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(249,168,212,.10),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(42,101,95,.24),transparent_42%)]" />

            <div className="absolute inset-0 bg-gradient-to-b from-[#071f1c]/55 via-transparent to-[#071f1c]/95" />

            <div className="absolute inset-0 bg-gradient-to-r from-[#071f1c]/55 via-transparent to-[#fbcfe8]/[.035]" />

            <div className="relative z-10 flex h-full min-h-[670px] flex-col justify-between p-7 xl:p-9">

           {/* TOP BRAND BAR */}
<div className="flex items-center justify-between">

  <div className="zooq-glass-soft inline-flex items-center gap-3 rounded-full px-5 py-3 border border-[#f9a8d4]/30 bg-gradient-to-r from-[#f9a8d4]/10 via-[#f9a8d4]/5 to-[#2a655f]/10 backdrop-blur-md hover:from-[#f9a8d4]/20 hover:via-[#f9a8d4]/10 hover:to-[#2a655f]/20 transition-all duration-500 group cursor-pointer shadow-lg shadow-[#f9a8d4]/20 hover:shadow-[#f9a8d4]/40">

    {/* ✅ نقطة متحركة - أكبر وأوضح */}
    <span className="relative flex h-3.5 w-3.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f9a8d4] opacity-75" />
      <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-[#f9a8d4] opacity-50" style={{ animationDelay: '0.5s' }} />
      <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#f9a8d4] shadow-[0_0_24px_rgba(249,168,212,1)] animate-pulse" />
    </span>

    {/* ✅ النص - مع تدرج لوني زهري + زيتي وحركة */}
    <span className="text-xs md:text-sm font-black tracking-[.15em] bg-gradient-to-r from-[#f9a8d4] via-[#fbcfe8] to-[#2a655f] bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer-gold_3s_linear_infinite] group-hover:scale-105 transition-transform duration-300">
      {app.lang === "ar"
        ? "✨ كلشي ع ذوقك"
        : "✨ Exactly your taste"}
    </span>

    {/* ✅ زخرفة وردية متحركة */}
    <span className="text-[#f9a8d4] text-sm animate-bounce opacity-70 group-hover:opacity-100 transition-opacity duration-300">
      ✦
    </span>
  </div>

  {/* ✅ عداد الصفحات - مع لمسة وردية */}
  <div className="rounded-full border border-[#f9a8d4]/40 bg-gradient-to-r from-[#f9a8d4]/20 to-[#2a655f]/20 px-4 py-2.5 text-[11px] font-black tracking-[.12em] text-white/80 shadow-lg shadow-[#f9a8d4]/10 backdrop-blur-sm">
    <span className="text-[#f9a8d4]">✦</span>
    {String(slide + 1).padStart(2, "0")}
    <span className="text-white/40"> / 05</span>
  </div>

</div>

{/* ✅ إضافة الـ Keyframes للحركة */}  
<style>{`
  @keyframes shimmer-gold {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`}</style>
              {/* MAIN BRAND */}
              <div
                className="zooq-slide-content flex flex-col items-center text-center"
                key={slide}
              >

                {/* ==================================================
                    BRAND NAME + CLEAR ANIMATED LOGO
                ================================================== */}
                <div className="relative inline-flex flex-col items-center">

                  <div className="absolute -inset-16 rounded-full bg-[#f9a8d4]/[.035] blur-3xl" />

                  <div className="relative flex items-center justify-center gap-5 sm:gap-6">

                    {/* ARABIC BRAND */}
                    <div className="relative">

                      <h1
                        className="zooq-brand-title relative text-[4.5rem] font-black leading-none tracking-[-.085em] text-white sm:text-[5.5rem] xl:text-[6.2rem]"
                        dir="rtl"
                      >
                        <span className="bg-gradient-to-r from-white via-white to-[#f9a8d4] bg-clip-text text-transparent">
                          ذوق
                        </span>
                      </h1>

                    </div>

                    {/* ==================================================
                        ✨ CLEAR ANIMATED REAL LOGO
                    ================================================== */}
                    <div className="zooq-logo-container relative flex h-36 w-36 shrink-0 items-center justify-center sm:h-40 sm:w-40 xl:h-44 xl:w-44">

                      {/* Pink breathing halo */}
                      <div className="zooq-logo-halo absolute -inset-10 rounded-full bg-[#f9a8d4]/12 blur-3xl" />

                      {/* Olive breathing halo */}
                      <div className="absolute -inset-7 rounded-full bg-[#2a655f]/14 blur-2xl" />

                      {/* Elegant rotating ring */}
                      <div className="zooq-logo-ring absolute inset-1 rounded-full border border-[#f9a8d4]/10 border-t-[#2a655f]/55 border-r-[#f9a8d4]/35" />

                      <div className="zooq-logo-ring absolute inset-4 rounded-full border border-transparent border-b-[#2a655f]/25 border-l-[#f9a8d4]/20 opacity-70" />

                      {/* Actual transparent logo */}
                      <div className="zooq-logo-motion relative z-10 flex h-full w-full items-center justify-center">

                        <img
                          src="/images/Logo.png"
                          alt="ذوق | zooq"
                          draggable={false}
                          className="zooq-logo-image h-full w-full object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,.68)]"
                        />

                      </div>

                      {/* Soft shine */}
                      <div className="zooq-logo-shine absolute left-1/2 top-1/2 z-20 h-[130%] w-5 -translate-y-1/2 rounded-full bg-gradient-to-b from-transparent via-white/20 to-transparent blur-md" />

                    </div>

                  </div>

                  {/* ENGLISH BRAND */}
                  <div className="mt-3 flex items-center justify-center gap-4">

                    <span className="h-px w-12 bg-gradient-to-r from-transparent via-[#2a655f]/70 to-[#f9a8d4]/70 sm:w-16" />

                    <div className="zooq-zooq-text">

                      <span className="zooq-o-olive">
                        z
                      </span>

                      <span className="zooq-o-pink">
                        o
                      </span>

                      <span className="zooq-o-olive">
                        o
                      </span>

                      <span className="zooq-o-olive">
                        q
                      </span>

                    </div>

                    <span className="h-px w-12 bg-gradient-to-l from-transparent via-[#2a655f]/70 to-[#f9a8d4]/70 sm:w-16" />

                  </div>

                  {/* BRAND DESCRIPTION */}
                  <div className="mt-3">

                    <div className="inline-flex items-center gap-2 rounded-full border border-[#f9a8d4]/15 bg-gradient-to-r from-[#2a655f]/10 via-[#f9a8d4]/[.045] to-[#fbcfe8]/[.05] px-4 py-2">

                      <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f] shadow-[0_0_12px_rgba(42,101,95,.8)]" />

                      <span className="text-[10px] font-black tracking-[.1em] text-white/65">
                        {app.lang === "ar"
                          ? "تسوّق بطريقة مختلفة"
                          : "A DIFFERENT WAY TO SHOP"}
                      </span>

                      <span className="h-1.5 w-1.5 rounded-full bg-[#f9a8d4] shadow-[0_0_12px_rgba(249,168,212,.8)]" />

                    </div>

                  </div>

                </div>

                {/* DYNAMIC MESSAGE */}
                <div className="mt-7 max-w-xl px-4">

                  <div className="mb-4 flex items-center justify-center gap-2">

                    <span className="h-px w-9 bg-gradient-to-r from-transparent to-[#2a655f]" />

                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#f9a8d4]/20 bg-gradient-to-br from-[#2a655f]/20 to-[#f9a8d4]/10">

                      <CurrentSlideIcon className="h-4.5 w-4.5 text-[#f9a8d4]" />

                    </div>

                    <span className="h-px w-9 bg-gradient-to-l from-transparent to-[#2a655f]" />

                  </div>

                  <h2 className="zooq-tagline text-2xl font-black leading-tight text-white sm:text-3xl xl:text-[2.15rem]">

                    {app.lang === "ar" ? (
                      <>
                        {slide === 1 ? (
                          <>
                            مو بس{" "}
                            <span className="zooq-slide-title-accent text-[#f9a8d4]">
                              تسوّق…
                            </span>
                          </>
                        ) : slide === 0 ? (
                          <>
                            كل{" "}
                            <span className="text-[#fbcfe8]">
                              ذوق
                            </span>
                            … إله مكان.
                          </>
                        ) : slide === 2 ? (
                          <>
                            الاختيار إلو{" "}
                            <span className="text-[#f9a8d4]">
                              ذوق.
                            </span>
                          </>
                        ) : slide === 3 ? (
                          <>
                            اللي بتدور عليه…{" "}
                            <span className="text-[#fbcfe8]">
                              أقرب
                            </span>{" "}
                            مما تتخيّل.
                          </>
                        ) : (
                          <>
                            خلّي{" "}
                            <span className="text-[#f9a8d4]">
                              ذوقك
                            </span>{" "}
                            يحكي.
                          </>
                        )}
                      </>
                    ) : (
                      currentSlide.enTitle
                    )}

                  </h2>

                  <div className="mx-auto mt-3 flex max-w-md items-start gap-2 text-start">

                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2a655f] shadow-[0_0_10px_rgba(42,101,95,.7)]" />

                    <p className="text-sm font-medium leading-7 text-white/55 sm:text-base">
                      {app.lang === "ar"
                        ? currentSlide.arText
                        : currentSlide.enText}
                    </p>

                  </div>

                  <div className="mx-auto mt-4 h-px w-24 zooq-slide-accent-line opacity-50" />

                </div>

                {/* ==================================================
                    SECONDARY PREMIUM BRAND PANEL
                    REAL LOGO + NAME
                ================================================== */}
                <div className="zooq-logo-float relative mt-8 flex items-center justify-center">

                  <div className="absolute h-72 w-72 rounded-full bg-[#f9a8d4]/[.07] blur-[70px]" />

                  <div className="absolute h-56 w-56 rounded-full bg-[#2a655f]/20 blur-[55px]" />

                  <div className="zooq-logo-frame zooq-logo-container group relative flex min-h-64 min-w-[22rem] items-center justify-center overflow-hidden rounded-[2.5rem] border border-white/[.10] bg-white/[.025] px-8 py-7 backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:scale-[1.025] hover:border-[#f9a8d4]/25 hover:shadow-[0_40px_100px_rgba(0,0,0,.62)] sm:min-w-[25rem]">

                    <div className="pointer-events-none absolute inset-2 rounded-[2rem] border border-white/[.055]" />

                    <div className="pointer-events-none absolute -right-3 -top-3 h-20 w-20 rounded-full bg-[#f9a8d4]/10 blur-2xl" />

                    <div className="pointer-events-none absolute -bottom-3 -left-3 h-20 w-20 rounded-full bg-[#2a655f]/25 blur-2xl" />

                    <div className="relative z-10 flex items-center justify-center gap-6">

                      {/* ==================================================
                          REAL LOGO — LARGER + ANIMATED
                      ================================================== */}
                      <div className="relative flex h-40 w-40 shrink-0 items-center justify-center sm:h-44 sm:w-44">

                        <div className="zooq-logo-halo absolute -inset-8 rounded-full bg-[#fbcfe8]/[.07] blur-3xl" />

                        <div className="zooq-logo-ring absolute inset-2 rounded-full border border-[#f9a8d4]/10 border-t-[#2a655f]/50 border-b-[#f9a8d4]/30" />

                        <div className="zooq-logo-motion relative z-10 h-full w-full">

                          <img
                            src="/images/Logo.png"
                            alt="ذوق | zooq"
                            draggable={false}
                            className="zooq-logo-image h-full w-full object-contain drop-shadow-[0_24px_42px_rgba(0,0,0,.7)]"
                          />

                        </div>

                        <div className="zooq-logo-shine absolute left-1/2 top-1/2 z-20 h-[120%] w-4 -translate-y-1/2 rounded-full bg-white/10 blur-md" />

                      </div>

                      {/* DIVIDER */}
                      <div className="h-28 w-px bg-gradient-to-b from-transparent via-[#2a655f]/40 via-[#f9a8d4]/30 to-transparent" />

                      {/* STORE NAME */}
                      <div className="flex min-w-0 flex-col items-start justify-center text-start">

                        <div
                          dir="rtl"
                          className="zooq-logo-brand bg-gradient-to-r from-white via-white to-[#f9a8d4] bg-clip-text text-[3.8rem] font-black leading-none tracking-[-.08em] text-transparent sm:text-[4.5rem]"
                        >
                          ذوق
                        </div>

                        <div className="mt-2 flex items-center gap-1">

                          <span className="zooq-logo-word text-2xl sm:text-3xl">

                            <span className="text-[#2a655f]">
                              z
                            </span>

                            <span className="zooq-o-pink">
                              o
                            </span>

                            <span className="text-[#2a655f]">
                              o
                            </span>

                            <span className="text-[#2a655f]">
                              q
                            </span>

                          </span>

                        </div>

                        <div className="mt-3 flex items-center gap-2">

                          <span className="h-1 w-5 rounded-full bg-[#2a655f] shadow-[0_0_10px_rgba(42,101,95,.6)]" />

                          <span className="whitespace-nowrap text-[9px] font-black tracking-[.12em] text-white/45">
                            {app.lang === "ar"
                              ? "تسوّق بطريقة مختلفة"
                              : "A DIFFERENT WAY TO SHOP"}
                          </span>

                          <span className="h-1 w-2 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.6)]" />

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* BOTTOM FEATURES */}
              <div>

                <div className="mb-5 flex items-center justify-center gap-2">

                  {[0, 1, 2, 3, 4].map(
                    (i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setSlide(i)
                        }
                        aria-label={`slide ${
                          i + 1
                        }`}
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-500",
                          slide === i
                            ? "w-12 bg-gradient-to-r from-[#2a655f] via-[#f9a8d4] to-[#fbcfe8] shadow-[0_0_20px_rgba(249,168,212,.7)]"
                            : "w-2 bg-white/20 hover:bg-[#2a655f]/70"
                        )}
                      />
                    )
                  )}

                </div>

                <div className="grid grid-cols-3 gap-2.5">

                  {[
                    {
                      icon: ShoppingBag,
                      ar: "خيارات بلا حدود",
                      en: "Endless choices",
                    },
                    {
                      icon: Shield,
                      ar: "تسوّق بثقة",
                      en: "Shop with confidence",
                    },
                    {
                      icon: Truck,
                      ar: "والباقي علينا",
                      en: "We've got delivery",
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.en}
                        className="zooq-glow-card rounded-2xl border border-white/[.07] bg-black/15 px-2 py-3.5 text-center backdrop-blur-md"
                      >
                        <Icon
                          className={cn(
                            "mx-auto mb-2 h-4 w-4",
                            index === 1
                              ? "text-[#2a655f]"
                              : "text-[#f9a8d4]"
                          )}
                        />

                        <span className="text-[9px] font-bold text-white/50">
                          {app.lang === "ar"
                            ? item.ar
                            : item.en}
                        </span>
                      </div>
                    );
                  })}

                </div>

              </div>

            </div>
          </section>

          {/* ====================================================
              MOBILE BRAND
          ==================================================== */}
          <section className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#092622]/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,.45)] lg:hidden">

            <div className="absolute -end-10 -top-20 h-56 w-56 rounded-full bg-[#f9a8d4]/10 blur-3xl" />

            <div className="absolute -bottom-20 -start-10 h-48 w-48 rounded-full bg-[#2a655f]/20 blur-3xl" />

            <div className="relative flex flex-col items-center text-center">

              <div className="zooq-glass-soft mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5">

                <span className="h-2 w-2 rounded-full bg-[#f9a8d4] shadow-[0_0_12px_rgba(249,168,212,.8)]" />

                <span className="text-[9px] font-black tracking-[.2em] text-white/60">
                  {app.lang === "ar"
                    ? "تسوّق بطريقة مختلفة"
                    : "zooq"}
                </span>

              </div>

              {/* MOBILE BRAND + LOGO */}
              <div className="relative flex items-center justify-center gap-4">

                <div className="relative inline-block">

                  <h1
                    className="zooq-brand-title relative text-[4rem] font-black leading-none tracking-[-.08em]"
                    dir="rtl"
                  >
                    <span className="bg-gradient-to-r from-white to-[#f9a8d4] bg-clip-text text-transparent">
                      ذوق
                    </span>
                  </h1>

                </div>

                {/* MOBILE ANIMATED LOGO */}
                <div className="zooq-logo-container relative flex h-28 w-28 shrink-0 items-center justify-center">

                  <div className="zooq-logo-halo absolute -inset-7 rounded-full bg-[#f9a8d4]/10 blur-3xl" />

                  <div className="absolute -inset-4 rounded-full bg-[#2a655f]/10 blur-2xl" />

                  <div className="zooq-logo-ring absolute inset-1 rounded-full border border-[#f9a8d4]/10 border-t-[#2a655f]/50 border-b-[#f9a8d4]/25" />

                  <div className="zooq-logo-motion relative z-10 h-full w-full">

                    <img
                      src="/images/Logo.png"
                      alt="ذوق | zooq"
                      draggable={false}
                      className="zooq-logo-image h-full w-full object-contain drop-shadow-[0_20px_32px_rgba(0,0,0,.7)]"
                    />

                  </div>

                </div>

              </div>

              <div className="mt-2 flex items-center justify-center gap-3">

                <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#2a655f]" />

                <span className="text-2xl font-black tracking-[.16em]">

                  <span className="text-[#2a655f]">
                    z
                  </span>

                  <span className="text-[#f9a8d4]">
                    o
                  </span>

                  <span className="text-[#2a655f]">
                    o
                  </span>

                  <span className="text-[#2a655f]">
                    q
                  </span>

                </span>

                <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#f9a8d4]" />

              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#f9a8d4]/15 bg-gradient-to-r from-[#2a655f]/10 to-[#f9a8d4]/[.045] px-3 py-1.5">

                <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f]" />

                <span className="text-[9px] font-black tracking-[.08em] text-white/60">
                  {app.lang === "ar"
                    ? "تسوّق بطريقة مختلفة"
                    : "A DIFFERENT WAY TO SHOP"}
                </span>

                <span className="h-1.5 w-1.5 rounded-full bg-[#f9a8d4]" />

              </div>

              <h2 className="mt-5 text-xl font-black leading-tight text-white">

                {app.lang === "ar" ? (
                  <>
                    {slide === 1 ? (
                      <>
                        مو بس{" "}
                        <span className="text-[#f9a8d4]">
                          تسوّق…
                        </span>
                      </>
                    ) : slide === 0 ? (
                      <>
                        كل{" "}
                        <span className="text-[#fbcfe8]">
                          ذوق
                        </span>
                        … إله مكان.
                      </>
                    ) : slide === 2 ? (
                      <>
                        الاختيار إلو{" "}
                        <span className="text-[#f9a8d4]">
                          ذوق.
                        </span>
                      </>
                    ) : slide === 3 ? (
                      <>
                        اللي بتدور عليه…{" "}
                        <span className="text-[#fbcfe8]">
                          أقرب
                        </span>
                      </>
                    ) : (
                      <>
                        خلّي{" "}
                        <span className="text-[#f9a8d4]">
                          ذوقك
                        </span>{" "}
                        يحكي.
                      </>
                    )}
                  </>
                ) : (
                  currentSlide.enTitle
                )}

              </h2>

              <div className="mt-2 flex max-w-xs items-start gap-2 text-start">

                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2a655f]" />

                <p className="text-xs font-medium leading-6 text-white/55">
                  {app.lang === "ar"
                    ? currentSlide.arText
                    : currentSlide.enText}
                </p>

              </div>

              {/* MOBILE PREMIUM LOGO PANEL */}
              <div className="zooq-logo-float relative mt-7 flex w-full items-center justify-center">

                <div className="absolute -inset-10 rounded-full bg-[#f9a8d4]/10 blur-3xl" />

                <div className="absolute -inset-4 rounded-full bg-[#2a655f]/15 blur-2xl" />

                <div className="zooq-logo-container group relative flex min-h-48 w-full max-w-[22rem] items-center justify-center overflow-hidden rounded-[2rem] border border-white/[.10] bg-white/[.025] px-4 py-5 shadow-[0_30px_65px_rgba(0,0,0,.55)] backdrop-blur-xl">

                  <div className="pointer-events-none absolute inset-2 rounded-[1.6rem] border border-white/[.055]" />

                  <div className="pointer-events-none absolute -right-2 -top-2 h-14 w-14 rounded-full bg-[#f9a8d4]/10 blur-xl" />

                  <div className="pointer-events-none absolute -bottom-2 -left-2 h-14 w-14 rounded-full bg-[#2a655f]/25 blur-xl" />

                  <div className="relative z-10 flex items-center justify-center gap-4">

                    {/* MOBILE REAL LOGO */}
                    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">

                      <div className="zooq-logo-halo absolute -inset-6 rounded-full bg-[#fbcfe8]/[.06] blur-2xl" />

                      <div className="zooq-logo-ring absolute inset-1 rounded-full border border-[#f9a8d4]/10 border-t-[#2a655f]/50" />

                      <div className="zooq-logo-motion relative z-10 h-full w-full">

                        <img
                          src="/images/Logo.png"
                          alt="ذوق | zooq"
                          draggable={false}
                          className="zooq-logo-image h-full w-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,.65)]"
                        />

                      </div>

                    </div>

                    <div className="h-20 w-px bg-gradient-to-b from-transparent via-[#2a655f]/35 via-[#f9a8d4]/25 to-transparent" />

                    <div className="flex flex-col items-start text-start">

                      <div
                        dir="rtl"
                        className="bg-gradient-to-r from-white to-[#f9a8d4] bg-clip-text text-[3.2rem] font-black leading-none tracking-[-.08em] text-transparent"
                      >
                        ذوق
                      </div>

                      <div className="mt-2 text-xl font-black tracking-[.16em]">

                        <span className="text-[#2a655f]">
                          z
                        </span>

                        <span className="text-[#f9a8d4]">
                          o
                        </span>

                        <span className="text-[#2a655f]">
                          o
                        </span>

                        <span className="text-[#2a655f]">
                          q
                        </span>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              <div className="mt-5 flex gap-1.5">

                {[0, 1, 2, 3, 4].map(
                  (i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setSlide(i)
                      }
                      aria-label={`slide ${
                        i + 1
                      }`}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        slide === i
                          ? "w-8 bg-gradient-to-r from-[#2a655f] via-[#f9a8d4] to-[#fbcfe8]"
                          : "w-1.5 bg-white/20"
                      )}
                    />
                  )
                )}

              </div>

            </div>
          </section>

          {/* ====================================================
              AUTH CARD
          ==================================================== */}
          <section className="zooq-glass relative overflow-hidden rounded-[2rem] p-5 sm:p-7 xl:p-8">

            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#f9a8d4] to-[#2a655f] opacity-90" />

            <div className="absolute -end-20 -top-24 h-60 w-60 rounded-full bg-[#f9a8d4]/7 blur-3xl" />

            <div className="absolute -bottom-24 -start-20 h-60 w-60 rounded-full bg-[#2a655f]/20 blur-3xl" />

            {/* HEADER */}
            <div className="relative mb-7">

              <div className="mb-5 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-[#f9a8d4]/20 bg-gradient-to-br from-[#2a655f]/20 to-[#f9a8d4]/[.07]">

                    <div className="absolute inset-0 rounded-2xl bg-[#f9a8d4]/5 blur-md" />

                    <Sparkles className="relative h-5 w-5 text-[#f9a8d4]" />

                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span
                        className="bg-gradient-to-r from-white to-[#f9a8d4] bg-clip-text text-2xl font-black tracking-tight text-transparent"
                        dir="rtl"
                      >
                        ذوق
                      </span>

                      <span className="h-5 w-px bg-white/15" />

                      <span className="text-sm font-black tracking-[.16em]">

                        <span className="text-[#2a655f]">
                          z
                        </span>

                        <span className="text-[#f9a8d4]">
                          o
                        </span>

                        <span className="text-[#2a655f]">
                          o
                        </span>

                        <span className="text-[#2a655f]">
                          q
                        </span>

                      </span>

                    </div>

                    <p className="mt-0.5 text-[9px] font-bold tracking-[.08em] text-white/30">
                      {app.lang === "ar"
                        ? "تسوّق بطريقة مختلفة"
                        : "A DIFFERENT WAY TO SHOP"}
                    </p>

                  </div>

                </div>

              </div>

              <h2 className="text-3xl font-black tracking-tight text-white">

                {isLogin
                  ? app.lang === "ar"
                    ? "رجعت لمكانك. 👋"
                    : "Welcome back. 👋"
                  : app.lang === "ar"
                    ? "جاهز تكتشف ذوقك؟"
                    : "Ready to discover your taste?"}

              </h2>

              <p className="mt-2 max-w-sm text-xs font-medium leading-6 text-white/45">

                {isLogin
                  ? app.lang === "ar"
                    ? "سجّل دخولك… وخلي رحلتك مع ذوق تكمل من محل ما وقفت."
                    : "Sign in and continue your Zooq journey right where you left off."
                  : app.lang === "ar"
                    ? "حساب واحد بيفتحلك عالم من الخيارات. والبداية من هون."
                    : "One account opens the door to a world of choices."}

              </p>

            </div>

            <form
              className="relative space-y-4"
              onSubmit={handleSubmit}
              autoComplete="off"
            >

              {/* FULL NAME */}
              {isRegister && (
                <GlassField
                  label={t("full_name") + " *"}
                  icon={
                    <UserIcon className="h-4 w-4 text-[#f9a8d4]" />
                  }
                >
                  <Input
                    value={fullName}
                    onChange={(e) =>
                      setFullName(
                        e.target.value
                      )
                    }
                    required
                    autoComplete="off"
                    className="input-glow rounded-2xl border-0 transition-all duration-300"
                    placeholder={
                      app.lang === "ar"
                        ? "الاسم اللي بتحب نناديك فيه"
                        : "The name you'd like us to call you"
                    }
                  />
                </GlassField>
              )}

              {/* PHONE */}
              <GlassField
                label={t("phone") + " *"}
                icon={
                  <Phone className="h-4 w-4 text-[#f9a8d4]" />
                }
              >
                <div className="zooq-input relative rounded-2xl">

                  <Input
                    type="tel"
                    placeholder="+963 9xx xxx xxx"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    required
                    autoComplete="off"
                    className={`input-glow rounded-2xl border-0 pe-10 transition-all duration-300 ${
                      phoneError &&
                      isRegister
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    } ${
                      phoneAvailable ===
                        true &&
                      isRegister &&
                      phone.trim()
                        .length >= 5
                        ? "border-[#f9a8d4]"
                        : ""
                    }`}
                  />

                  {isRegister &&
                    phone.trim()
                      .length >= 5 && (
                      <div className="absolute inset-y-0 end-3 flex items-center">

                        {isCheckingPhone ? (
                          <Loader2 className="h-4 w-4 animate-spin text-[#f9a8d4]" />
                        ) : phoneAvailable ===
                          true ? (
                          <CheckCircle className="h-4 w-4 text-[#2a655f]" />
                        ) : phoneAvailable ===
                          false ? (
                          <X className="h-4 w-4 text-red-400" />
                        ) : null}

                      </div>
                    )}

                </div>
              </GlassField>

              {/* PHONE ERROR */}
              {isRegister &&
                phone.trim()
                  .length >= 5 &&
                phoneError && (
                  <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5">

                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />

                    <p className="text-xs font-semibold text-red-200">
                      {phoneError}
                    </p>

                  </div>
                )}

              {/* PASSWORD */}
              <GlassField
                label={t("password") + " *"}
                icon={
                  <Lock className="h-4 w-4 text-[#f9a8d4]" />
                }
              >
                <div className="zooq-input relative rounded-2xl">

                  <Input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    required
                    minLength={6}
                    autoComplete="off"
                    className="input-glow rounded-2xl border-0 pe-10 transition-all duration-300"
                    placeholder={
                      app.lang === "ar"
                        ? "كلمة المرور — 6 أحرف على الأقل"
                        : "Password — 6+ characters"
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute inset-y-0 end-3 my-auto text-[#f9a8d4]/70 transition hover:text-[#f9a8d4]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>
              </GlassField>

              {/* ADDRESS */}
              {isRegister && (
                <div className="space-y-2">

                  <Label className="flex items-center gap-2 text-xs font-bold text-white/85">

                    <span className="h-1 w-3 rounded-full bg-[#f9a8d4] shadow-[0_0_10px_rgba(249,168,212,.55)]" />

                    {app.lang === "ar"
                      ? "وين بدنا نوصل طلباتك؟ *"
                      : "Where should we deliver? *"}

                  </Label>

                  <div className="rounded-2xl border border-white/10 bg-white/[.96] p-3 text-slate-800 transition-all duration-300 focus-within:border-[#f9a8d4]/60 focus-within:shadow-[0_0_0_3px_rgba(249,168,212,.08)]">

                    <AddressPicker
                      value={
                        location ??
                        undefined
                      }
                      onChange={
                        setLocation
                      }
                      lang={app.lang}
                    />

                  </div>

                  {location &&
                    detectedGovernorate && (
                      <div className="flex items-center gap-2 rounded-xl border border-[#f9a8d4]/20 bg-gradient-to-r from-[#2a655f]/10 to-[#f9a8d4]/[.07] p-2.5">

                        {isExtractingGovernorate ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#f9a8d4]" />
                        ) : (
                          <MapPin className="h-3.5 w-3.5 text-[#2a655f]" />
                        )}

                        <span className="text-[11px] font-medium text-[#fbcfe8]">

                          {isExtractingGovernorate
                            ? app.lang ===
                              "ar"
                              ? "عم نحدد منطقتك..."
                              : "Detecting your area..."
                            : detectedGovernorate
                              ? app.lang ===
                                "ar"
                                ? `المحافظة: ${detectedGovernorate}`
                                : `Governorate: ${detectedGovernorate}`
                              : app.lang ===
                                "ar"
                                ? "⚠️ لم يتم التحديد"
                                : "⚠️ Not detected"}

                        </span>

                      </div>
                    )}

                </div>
              )}

              {/* SUBMIT */}
              <Button
                type="submit"
                size="lg"
                className="zooq-submit group relative mt-2 h-13 w-full overflow-hidden rounded-2xl border-0 text-base font-black"
                disabled={
                  loading ||
                  (isRegister &&
                    (phoneAvailable ===
                      false ||
                      phoneError !==
                        null))
                }
              >

                <span className="zooq-shine pointer-events-none absolute inset-y-0 -start-1/2 w-1/2 skew-x-[-18deg] bg-white/20 animate-[zooq-shine_2.8s_ease-in-out_infinite]" />

                {loading ? (
                  <span className="relative z-10 flex items-center justify-center gap-2">

                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent" />

                    {app.lang === "ar"
                      ? "لحظة… عم نجهز كل شي"
                      : "Just a moment..."}

                  </span>
                ) : (
                  <span className="relative z-10 flex items-center justify-center gap-2">

                    {isLogin ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}

                    {isLogin
                      ? app.lang === "ar"
                        ? "دخول إلى ذوق"
                        : "Enter Zooq"
                      : app.lang === "ar"
                        ? "ابدأ رحلتك مع ذوق"
                        : "Start your Zooq journey"}

                  </span>
                )}

              </Button>

              {/* LINKS */}
              <div className="space-y-3 pt-2 text-center text-sm text-white/65">

                {isLogin ? (
                  <>
                    <div>

                      {app.lang === "ar"
                        ? "لسا ما صار عندك حساب؟"
                        : "Don't have an account?"}{" "}

                      <Link
                        to="/auth/$mode"
                        params={{
                          mode: "register",
                        }}
                        className="zooq-link font-black text-[#f9a8d4]"
                      >
                        {app.lang === "ar"
                          ? "خلينا نبدأ"
                          : "Let's start"}
                      </Link>

                    </div>

                    <button
                      type="button"
                      onClick={
                        handleForgotPasswordClick
                      }
                      className="zooq-link mx-auto flex items-center justify-center gap-1.5 text-xs text-white/40"
                    >

                      <HelpCircle className="h-3.5 w-3.5 text-[#f9a8d4]" />

                      {app.lang === "ar"
                        ? "نسيت كلمة المرور؟"
                        : "Forgot your password?"}

                    </button>

                    {app.user && (
                      <div className="mt-3 space-y-1.5 border-t border-white/8 pt-3">

                        {isDeliveryCompany && (
                          <Link
                            to="/delivery/dashboard"
                            className="zooq-link block text-xs text-[#f9a8d4]"
                          >
                            🚚{" "}
                            {app.lang === "ar"
                              ? "لوحة التوصيل"
                              : "Delivery Dashboard"}
                          </Link>
                        )}

                        {isDistributor && (
                          <Link
                            to="/distributor/dashboard"
                            className="zooq-link block text-xs text-[#2a655f]"
                          >
                            📦{" "}
                            {app.lang === "ar"
                              ? "لوحة الموزع"
                              : "Distributor Dashboard"}
                          </Link>
                        )}

                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="zooq-link block text-xs text-red-300"
                          >
                            ⚡{" "}
                            {app.lang === "ar"
                              ? "لوحة الأدمن"
                              : "Admin Panel"}
                          </Link>
                        )}

                        {isSeller && (
                          <Link
                            to="/dashboard"
                            className="zooq-link block text-xs text-amber-300"
                          >
                            🏪{" "}
                            {app.lang === "ar"
                              ? "لوحة البائع"
                              : "Seller Dashboard"}
                          </Link>
                        )}

                      </div>
                    )}

                  </>
                ) : (
                  <>
                    <div>

                      {app.lang === "ar"
                        ? "عندك حساب معنا؟"
                        : "Already part of Zooq?"}{" "}

                      <Link
                        to="/auth/$mode"
                        params={{
                          mode: "login",
                        }}
                        className="zooq-link font-black text-[#f9a8d4]"
                      >
                        {app.lang === "ar"
                          ? "فوت لعندنا"
                          : "Sign in"}
                      </Link>

                    </div>

                    <div className="relative pt-4">

                      <div className="absolute inset-x-0 top-0 flex items-center gap-3">

                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#2a655f]/20" />

                        <span className="text-[9px] font-black tracking-[.25em] text-white/25">
                          {app.lang === "ar"
                            ? "أو"
                            : "OR"}
                        </span>

                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#f9a8d4]/20" />

                      </div>

                      <Link
                        to="/"
                        className="block w-full"
                      >
                        <Button
                          variant="outline"
                          className="mt-2 h-11 w-full rounded-2xl border-white/10 bg-white/[.035] text-sm font-bold text-white hover:border-[#f9a8d4]/35 hover:bg-[#2a655f]/10 hover:text-white"
                        >
                          {app.lang === "ar"
                            ? "خليني اكتشف أول 👀"
                            : "Let me explore first 👀"}
                        </Button>
                      </Link>

                      <p className="mt-2 text-[10px] text-white/30">

                        {app.lang === "ar"
                          ? "تصفح، اكتشف، وخلي التسجيل لوقت ما تكون جاهز."
                          : "Explore first. Sign up when you're ready."}

                      </p>

                    </div>
                  </>
                )}

              </div>

            </form>

            {/* BRAND FOOTER */}
            <div className="relative mt-7 flex flex-col items-center justify-center gap-2 border-t border-white/7 pt-5 text-center">

              <div className="flex items-center gap-2">

                <span className="h-1 w-1 rounded-full bg-[#2a655f] shadow-[0_0_8px_rgba(42,101,95,.8)]" />

                <span className="text-[9px] font-black tracking-[.28em] text-white/25">
                  zooq
                </span>

                <span className="h-1 w-1 rounded-full bg-[#f9a8d4] shadow-[0_0_8px_rgba(249,168,212,.8)]" />

              </div>

              <p className="text-[10px] font-semibold text-white/30">
                {app.lang === "ar"
                  ? "تسوّق بطريقة مختلفة."
                  : "A different way to shop."}
              </p>

            </div>

          </section>

        </div>
      </div>

      {/* ======================================================
          FOOTER
      ====================================================== */}
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-4xl border-t border-white/7 pt-5">

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

            <a
              href="tel:+963110000000"
              dir="ltr"
              className="zooq-link flex items-center gap-2 text-xs font-mono text-white/35"
            >

              <Phone className="h-3.5 w-3.5 text-[#f9a8d4]" />

              +963 11 000 0000

            </a>

            <div className="flex items-center gap-1.5">

              {[
                {
                  icon: Twitter,
                  label: "Twitter",
                },
                {
                  icon: Instagram,
                  label: "Instagram",
                },
                {
                  icon: Facebook,
                  label: "Facebook",
                },
                {
                  icon: Youtube,
                  label: "YouTube",
                },
                {
                  icon: Globe,
                  label: "Website",
                },
              ].map((social) => {
                const Icon =
                  social.icon;

                return (
                  <a
                    key={
                      social.label
                    }
                    href="#"
                    aria-label={
                      social.label
                    }
                    className="zooq-social flex h-8 w-8 items-center justify-center rounded-xl border border-white/7 bg-white/[.025] text-white/30"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                );
              })}

            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px]">

              <Link
                to="/privacy"
                className="zooq-link text-white/32"
              >
                {app.lang === "ar"
                  ? "الخصوصية"
                  : "Privacy"}
              </Link>

              <span className="text-white/15">
                •
              </span>

              <Link
                to="/terms"
                className="zooq-link text-white/32"
              >
                {app.lang === "ar"
                  ? "الشروط"
                  : "Terms"}
              </Link>

              <span className="text-white/15">
                •
              </span>

              <span className="text-white/25">
                © {year} ذوق
              </span>

            </div>

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

  const [isOpen, setIsOpen] =
    useState(false);
  const [message, setMessage] =
    useState("");
  const [subject, setSubject] =
    useState("");
  const [visitorPhone, setVisitorPhone] =
    useState("");
  const [isLoading, setIsLoading] =
    useState(false);
  const [isSuccess, setIsSuccess] =
    useState(false);
  const [isHovered, setIsHovered] =
    useState(false);

  const handleOpenSupport = () => {
    setIsOpen(true);
  };

  const handleSubmitSupport =
    async () => {
      const phone =
        app.user?.phone ||
        visitorPhone.trim();

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
        const {
          data: adminData,
          error: adminError,
        } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin")
          .limit(1)
          .single();

        if (
          adminError ||
          !adminData
        ) {
          toast.error(
            app.lang === "ar"
              ? "حدث خطأ، يرجى المحاولة لاحقاً"
              : "Error, please try again later"
          );

          return;
        }

        const adminId =
          adminData.user_id;

        const userId =
          app.user?.id ||
          adminId;

        const userPhone =
          app.user?.phone ||
          visitorPhone.trim();

        const isRegistered =
          !!app.user;

        const {
          data: newConversation,
          error: convError,
        } = await supabase
          .from("conversations")
          .insert({
            participant1_id:
              userId,
            participant2_id:
              adminId,
            last_message:
              message.substring(
                0,
                100
              ),
            last_message_at:
              new Date().toISOString(),
          })
          .select()
          .single();

        if (convError) {
          throw convError;
        }

        const conversationId =
          newConversation.id;

        const {
          error: msgError,
        } = await supabase
          .from("messages")
          .insert({
            sender_id: userId,
            receiver_id: adminId,
            conversation_id:
              conversationId,
            content: `📩 رسالة دعم\n📞 من: ${userPhone}\n${
              isRegistered
                ? "✅ مستخدم مسجل"
                : "❌ زائر (ليس لديه حساب)"
            }\nالموضوع: ${
              subject || "دعم"
            }\n\nالرسالة:\n${message}`,
            type: "text",
            created_at:
              new Date().toISOString(),
          });

        if (msgError) {
          throw msgError;
        }

        await supabase
          .from("notifications")
          .insert({
            user_id: adminId,
            type: "support",
            title_ar:
              "📩 رسالة دعم جديدة",
            body_ar: `📞 من: ${userPhone}\n${
              isRegistered
                ? "✅ مسجل"
                : "❌ زائر"
            }\nالموضوع: ${
              subject || "دعم"
            }`,
            reference_id:
              conversationId,
            link_url: `/messages/${conversationId}`,
            created_at:
              new Date().toISOString(),
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
            ? "✅ وصلت رسالتك! نحنا معك."
            : "✅ Your message is on its way!"
        );
      } catch (error) {
        console.error(
          "Error sending support message:",
          error
        );

        toast.error(
          app.lang === "ar"
            ? "حدث خطأ أثناء الإرسال"
            : "Error sending message"
        );
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <>
      {/* SUPPORT BUTTON */}
      <div className="fixed bottom-6 start-6 z-50">

        <button
          onClick={
            handleOpenSupport
          }
          onMouseEnter={() =>
            setIsHovered(true)
          }
          onMouseLeave={() =>
            setIsHovered(false)
          }
          className="group relative flex items-center gap-3 rounded-2xl border border-[#f9a8d4]/30 bg-gradient-to-r from-[#071f1c] via-[#123d38] to-[#2a655f] px-4 py-2.5 text-white shadow-lg shadow-[#f9a8d4]/15 transition-all duration-300 hover:-translate-y-1 hover:border-[#f9a8d4]/45 hover:shadow-xl hover:shadow-[#f9a8d4]/25"
        >

          <div className="relative">

            <Headphones className="h-5 w-5 text-[#f9a8d4]" />

            {!isHovered && (
              <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-[#fbcfe8] shadow-[0_0_8px_rgba(249,168,212,.8)]" />
            )}

          </div>

          <span className="hidden text-sm font-bold sm:inline">
            {app.lang === "ar"
              ? "نحنا هون"
              : "We're here"}
          </span>

        </button>

      </div>

      {/* SUPPORT MODAL */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] animate-in fade-in bg-black/65 backdrop-blur-md duration-200"
            onClick={() =>
              setIsOpen(false)
            }
          />

          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">

            <div className="w-full max-w-md animate-in overflow-hidden rounded-[2rem] border border-[#f9a8d4]/25 bg-[#071f1c] shadow-[0_35px_100px_rgba(0,0,0,.58)] zoom-in-95 duration-300">

              <div className="border-b border-[#f9a8d4]/15 bg-gradient-to-r from-[#071f1c] via-[#123d38] to-[#2a655f] p-6">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#f9a8d4]/30 bg-gradient-to-br from-[#2a655f]/30 to-[#f9a8d4]/15">

                      <Headphones className="h-6 w-6 text-[#f9a8d4]" />

                    </div>

                    <div>

                      <h3 className="text-lg font-black text-white">
                        {app.lang === "ar"
                          ? "خلينا نساعدك"
                          : "Let's help you"}
                      </h3>

                      <p className="mt-0.5 text-sm text-[#fbcfe8]/80">
                        {app.lang === "ar"
                          ? "رسالتك بتوصلنا مباشرة 💗"
                          : "Your message reaches us directly 💗"}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setIsOpen(false)
                    }
                    className="text-white/50 transition-colors hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>

                </div>

              </div>

              <div className="space-y-4 p-6">

                {isSuccess ? (
                  <div className="py-8 text-center">

                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#f9a8d4]/30 bg-[#f9a8d4]/15">

                      <CheckCircle className="h-8 w-8 text-[#f9a8d4]" />

                    </div>

                    <h4 className="text-lg font-black text-white">
                      {app.lang === "ar"
                        ? "وصلت! 💗"
                        : "Got it! 💗"}
                    </h4>

                    <p className="mt-1 text-sm text-[#fbcfe8]/80">
                      {app.lang === "ar"
                        ? "نحنا معك، وراح نرد عليك بأسرع وقت."
                        : "We're on it and will get back to you soon."}
                    </p>

                  </div>
                ) : (
                  <>
                    {app.user ? (
                      <div>

                        <Label className="text-sm font-semibold text-white/90">
                          {app.lang === "ar"
                            ? "رقم هاتفك"
                            : "Your Phone"}
                        </Label>

                        <Input
                          type="tel"
                          value={
                            app.user?.phone ||
                            "غير متاح"
                          }
                          disabled
                          className="mt-1.5 h-11 cursor-not-allowed rounded-xl border-[#f9a8d4]/20 bg-white/10 text-white"
                        />

                      </div>
                    ) : (
                      <div>

                        <Label className="text-sm font-semibold text-white/90">
                          {app.lang === "ar"
                            ? "رقم الهاتف *"
                            : "Phone Number *"}
                        </Label>

                        <Input
                          type="tel"
                          value={
                            visitorPhone
                          }
                          onChange={(
                            e
                          ) =>
                            setVisitorPhone(
                              e.target.value
                            )
                          }
                          placeholder="+963 9xx xxx xxx"
                          className="mt-1.5 h-11 rounded-xl border-[#f9a8d4]/20 bg-white/5 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50"
                          required
                        />

                        <p className="mt-1 text-[10px] text-white/40">
                          {app.lang === "ar"
                            ? "بس مشان نقدر نرجعلك"
                            : "So we can get back to you"}
                        </p>

                      </div>
                    )}

                    <div>

                      <Label className="text-sm font-semibold text-white/90">
                        {app.lang === "ar"
                          ? "شو الموضوع؟"
                          : "What's on your mind?"}
                      </Label>

                      <Input
                        value={
                          subject
                        }
                        onChange={(
                          e
                        ) =>
                          setSubject(
                            e.target.value
                          )
                        }
                        placeholder={
                          app.lang === "ar"
                            ? "مثلاً: مشكلة بالحساب..."
                            : "e.g. Account issue..."
                        }
                        className="mt-1.5 h-11 rounded-xl border-[#f9a8d4]/20 bg-white/5 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50"
                      />

                    </div>

                    <div>

                      <Label className="text-sm font-semibold text-white/90">
                        {app.lang === "ar"
                          ? "احكيلنا شو صار *"
                          : "Tell us what happened *"}
                      </Label>

                      <textarea
                        value={
                          message
                        }
                        onChange={(
                          e
                        ) =>
                          setMessage(
                            e.target.value
                          )
                        }
                        placeholder={
                          app.lang === "ar"
                            ? "اكتب رسالتك هون… نحنا سامعينك."
                            : "Write your message here..."
                        }
                        rows={4}
                        className="mt-1.5 w-full resize-none rounded-xl border border-[#f9a8d4]/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 transition-all focus:border-[#f9a8d4]/50 focus:bg-white/10 focus:outline-none"
                      />

                    </div>

                    <Button
                      onClick={
                        handleSubmitSupport
                      }
                      disabled={
                        isLoading ||
                        !message.trim() ||
                        (!app.user &&
                          !visitorPhone.trim())
                      }
                      className="h-12 w-full rounded-xl border border-[#f9a8d4]/30 bg-gradient-to-r from-[#071f1c] via-[#174944] to-[#2a655f] font-black text-white shadow-lg shadow-[#f9a8d4]/15 transition-all hover:-translate-y-0.5 hover:border-[#f9a8d4]/45 hover:shadow-[#f9a8d4]/25"
                    >

                      {isLoading ? (
                        <span className="flex items-center gap-2">

                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                          {app.lang === "ar"
                            ? "عم نوصلها..."
                            : "Sending..."}

                        </span>
                      ) : (
                        <span className="flex items-center gap-2">

                          <Send className="h-4 w-4 text-[#f9a8d4]" />

                          {app.lang === "ar"
                            ? "إرسال الرسالة"
                            : "Send message"}

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
    </>
  );
}