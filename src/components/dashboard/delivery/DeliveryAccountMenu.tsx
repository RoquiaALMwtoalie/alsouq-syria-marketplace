// src/components/dashboard/delivery/DeliveryAccountMenu.tsx

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  KeyRound,
  LogOut,
  Shield,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2,
  Bike,
  PackageCheck,
  Sparkles,
  Lock,
  UserCheck,
  Building2,
  Edit3,
  Phone,
  MapPin,
  Store,
  CheckCircle as CheckCircleIcon,
  Map,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";

export interface DeliveryAccountMenuProps {
  userData: {
    id: string;
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    role?: string;
  };
  companyName?: string;
  isArabic: boolean;
  companyId?: string;
  onCompanyUpdated?: () => void;
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

export function DeliveryAccountMenu({ 
  userData, 
  companyName, 
  isArabic,
  companyId,
  onCompanyUpdated 
}: DeliveryAccountMenuProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ✅ State لتعديل الشركة
  const [showEditCompanyDialog, setShowEditCompanyDialog] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);
  const [isPhoneChanged, setIsPhoneChanged] = useState(false);
  const [phoneCheckLoading, setPhoneCheckLoading] = useState(false);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);

  // ✅ State للخريطة
  const [addressMethod, setAddressMethod] = useState<"manual" | "map">("manual");
  const [location, setLocation] = useState<PickedLocation | null>(null);

  // تغيير كلمة المرور
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ✅ جلب بيانات الشركة عند فتح ديالوج التعديل
const fetchCompanyData = async () => {
  if (!companyId) return;
  
  try {
    const { data: companyData, error: companyError } = await supabase
      .from("delivery_companies")
      .select("*")
      .eq("id", companyId)
      .single();
    
    if (companyError) throw companyError;
    
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("address_text, lat, lng, governorate_id")
      .eq("id", userData.id)
      .single();
    
    if (profileError) {
      console.warn("⚠️ Could not fetch profile:", profileError);
    }
    
    const mergedData = {
      ...companyData,
      address_ar: profileData?.address_text || companyData?.address_ar || '',
      lat: profileData?.lat || 0,
      lng: profileData?.lng || 0,
      governorate_id: profileData?.governorate_id || companyData?.governorate_id || null,
    };
    
    console.log("📍 Merged data:", {
      address_ar: mergedData.address_ar,
      lat: mergedData.lat,
      lng: mergedData.lng,
    });
    
    setCompanyData(mergedData);
    setIsPhoneChanged(false);
    setPhoneAvailable(null);
    
    if (mergedData?.address_ar) {
      setLocation({
        address: mergedData.address_ar,
        lat: mergedData.lat || 0,
        lng: mergedData.lng || 0,
        label: mergedData.address_ar,
        details: mergedData.address_ar,
      });
      
      if (mergedData.lat && mergedData.lng) {
        setAddressMethod("map");
        console.log("📍 Using map method (has coordinates), address:", mergedData.address_ar);
      } else {
        setAddressMethod("manual");
        console.log("📍 Using manual method (no coordinates), address:", mergedData.address_ar);
      }
    } else {
      setAddressMethod("manual");
      setLocation(null);
      console.log("📍 No address found, using manual method");
    }
    
  } catch (error) {
    console.error("Error fetching company data:", error);
    toast.error(isArabic ? "❌ فشل جلب بيانات الشركة" : "❌ Failed to fetch company data");
  }
};

  // ✅ التحقق من توفر الرقم
  const checkPhoneAvailability = async (phone: string) => {
    if (!phone || phone.length < 9) {
      setPhoneAvailable(null);
      return;
    }

    setPhoneCheckLoading(true);
    try {
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id, phone")
        .eq("phone", phone)
        .maybeSingle();

      if (profileError) throw profileError;

      if (existingProfile) {
        const { data: companyCheck, error: companyError } = await supabase
          .from("delivery_companies")
          .select("created_by")
          .eq("id", companyId)
          .single();

        if (companyError) throw companyError;

        const isSameOwner = companyCheck?.created_by === existingProfile.id;
        
        if (!isSameOwner) {
          setPhoneAvailable(false);
          setPhoneCheckLoading(false);
          return;
        }
      }

      const { data: existingCompany, error: companyError2 } = await supabase
        .from("delivery_companies")
        .select("id")
        .eq("phone", phone)
        .neq("id", companyId)
        .maybeSingle();

      if (companyError2) throw companyError2;

      if (existingCompany) {
        setPhoneAvailable(false);
      } else {
        setPhoneAvailable(true);
      }

    } catch (error) {
      console.error("Error checking phone:", error);
      setPhoneAvailable(false);
    } finally {
      setPhoneCheckLoading(false);
    }
  };

  // ✅ دالة تحديث الشركة
const handleUpdateCompany = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!companyData || !companyId) return;

  const form = e.currentTarget as HTMLFormElement;
  const formData = new FormData(form);
  
  const newPhone = formData.get("phone") as string;
  const newNameAr = formData.get("name_ar") as string;
  
  if (!newPhone || newPhone.length < 9) {
    toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
    return;
  }

  if (isPhoneChanged && newPhone !== companyData.phone) {
    if (phoneAvailable === false) {
      toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل" : "❌ This number is already in use");
      return;
    }
  }

  setEditLoading(true);

  try {
    const patch: any = {
      name_ar: newNameAr,
      name_en: formData.get("name_en") as string,
      phone: newPhone,
      description_ar: formData.get("description_ar") as string,
      description_en: formData.get("description_en") as string,
      base_price: parseFloat(formData.get("base_price") as string) || 0,
      price_per_km: parseFloat(formData.get("price_per_km") as string) || 0,
      free_delivery_threshold: parseFloat(formData.get("free_delivery_threshold") as string) || 0,
      min_delivery_fee: parseFloat(formData.get("min_delivery_fee") as string) || 0,
      max_delivery_fee: parseFloat(formData.get("max_delivery_fee") as string) || 999999,
      avg_delivery_time: parseInt(formData.get("avg_delivery_time") as string) || 60,
      has_tracking: formData.get("has_tracking") === "on",
      has_insurance: formData.get("has_insurance") === "on",
      has_cod: formData.get("has_cod") === "on",
      has_express: formData.get("has_express") === "on",
      is_active: formData.get("is_active") === "on",
    };

    let governorateId = "";

    if (addressMethod === "map" && location) {
      patch.address_ar = location.address;
      patch.address_en = location.address;
      
      const result = await extractGovernorateFromAddress(
        location.address,
        location.lat,
        location.lng
      );
      governorateId = result.governorate_id;
      
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          lat: location.lat || 0,
          lng: location.lng || 0,
          address_text: location.address.trim(),
          governorate_id: governorateId || null,
        })
        .eq("id", userData.id);
      
      if (updateProfileError) {
        console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
      }
    } else {
      const manualAddress = formData.get("address_ar") as string;
      patch.address_ar = manualAddress;
      patch.address_en = manualAddress;
      
      const result = await extractGovernorateFromAddress(manualAddress);
      governorateId = result.governorate_id;
      
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          address_text: manualAddress.trim(),
          governorate_id: governorateId || null,
        })
        .eq("id", userData.id);
      
      if (updateProfileError) {
        console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
      }
    }

    if (governorateId) {
      patch.governorate_id = governorateId;
    }

    const profileUpdate: any = {};

    if (newNameAr && newNameAr !== companyData.name_ar) {
      profileUpdate.full_name = newNameAr.trim();
    }

    if (isPhoneChanged && newPhone !== companyData.phone) {
      profileUpdate.phone = newPhone.trim();
    }

    if (Object.keys(profileUpdate).length > 0) {
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update(profileUpdate)
        .eq("id", userData.id);
      
      if (updateProfileError) {
        console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
      } else {
        console.log("✅ تم تحديث البروفايل:", profileUpdate);
      }
    }

    const { error: updateError } = await supabase
      .from("delivery_companies")
      .update(patch)
      .eq("id", companyId);

    if (updateError) throw updateError;

    toast.success(
      isArabic 
        ? `✅ تم تحديث معلومات الشركة "${patch.name_ar}" بنجاح`
        : `✅ Company "${patch.name_en}" updated successfully`
    );
    
    setShowEditCompanyDialog(false);
    setEditLoading(false);
    setIsPhoneChanged(false);
    setPhoneAvailable(null);
    
    if (onCompanyUpdated) onCompanyUpdated();
    
    setCompanyData({ ...companyData, ...patch });
    
  } catch (error: any) {
    console.error("Error updating company:", error);
    toast.error(
      isArabic 
        ? `❌ فشل تحديث الشركة: ${error.message || 'خطأ غير معروف'}`
        : `❌ Failed to update company: ${error.message || 'Unknown error'}`
    );
    setEditLoading(false);
  }
};

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(isArabic ? "✅ تم تسجيل الخروج بنجاح" : "✅ Logged out successfully");
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تسجيل الخروج" : "❌ Logout failed");
      console.error(error);
    }
  };

 const handleChangePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (newPassword.length < 6) {
    toast.error(isArabic ? "❌ كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" : "❌ New password must be at least 6 characters");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error(isArabic ? "❌ كلمة المرور غير متطابقة" : "❌ Passwords do not match");
    return;
  }

  setLoading(true);
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    toast.success(
      isArabic 
        ? "✅ تم تغيير كلمة المرور بنجاح" 
        : "✅ Password changed successfully"
    );
    
    setShowPasswordDialog(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
  } catch (error: any) {
    console.error("Error changing password:", error);
    
    const errorMessage = error.message || '';
    let translatedMessage = '';
    
    if (errorMessage.includes('New password should be different from the old password')) {
      translatedMessage = isArabic 
        ? "❌ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" 
        : "❌ New password should be different from the old password";
    } 
    else if (errorMessage.includes('Password should be at least 6 characters')) {
      translatedMessage = isArabic 
        ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" 
        : "❌ Password should be at least 6 characters";
    } 
    else if (errorMessage.includes('Invalid credentials') || errorMessage.includes('Invalid login credentials')) {
      translatedMessage = isArabic 
        ? "❌ كلمة المرور الحالية غير صحيحة" 
        : "❌ Current password is incorrect";
    } 
    else {
      translatedMessage = isArabic 
        ? `❌ فشل تغيير كلمة المرور` 
        : `❌ Failed to change password`;
    }
    
    toast.error(translatedMessage);
  } finally {
    setLoading(false);
  }
};

  const getInitials = (name?: string) => {
    if (!name) return "D";
    return name.charAt(0).toUpperCase();
  };

  const openEditCompanyDialog = async () => {
    await fetchCompanyData();
    setShowEditCompanyDialog(true);
    setIsOpen(false);
  };

  return (
    <>
      {/* ===== DROPDOWN MENU - PINK & GREEN THEME ===== */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-[#d81b60]/20 to-[#1b433e]/20 hover:from-[#d81b60]/30 hover:to-[#1b433e]/30 border border-[#f9a8d4]/30 backdrop-blur-md transition-all duration-300 group shadow-lg">
            
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1b433e] to-[#2a655f] text-white shadow-md overflow-hidden">
              <div className="animate-delivery-walk flex items-center justify-center">
                <Bike className="h-4 w-4 text-emerald-300" />
              </div>
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="relative">
              <Avatar className="h-8 w-8 border-2 border-[#f9a8d4]/50 group-hover:border-[#d81b60] transition-all duration-300 shadow-sm">
                <AvatarImage src={userData.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white text-xs font-black">
                  {getInitials(userData.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#d81b60]" />
            </div>

            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-white truncate max-w-[110px]">
                {userData.full_name || userData.phone || (isArabic ? "مسؤول التوصيل" : "Manager")}
              </p>
              {companyName && (
                <p className="text-[10px] text-emerald-200/80 truncate max-w-[110px] font-medium">
                  {companyName}
                </p>
              )}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 rounded-3xl p-1.5 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 shadow-2xl overflow-hidden">
          {/* Header - PINK & GREEN GRADIENT */}
          <div className="bg-gradient-to-r from-[#d81b60] via-[#f48fb1] to-[#1b433e] p-4 rounded-2xl text-white shadow-inner relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <Bike className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
                <AvatarImage src={userData.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white text-base font-black">
                  {getInitials(userData.full_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm text-white truncate">
                  {userData.full_name || userData.phone || (isArabic ? "مسؤول التوصيل" : "Manager")}
                </p>
                {companyName && (
                  <p className="text-xs text-emerald-100 truncate font-semibold mt-0.5">
                    🏢 {companyName}
                  </p>
                )}
                <p className="text-[11px] text-white/80 truncate mt-0.5" dir="ltr">
                  📱 {userData.phone || (isArabic ? "غير متاح" : "Not available")}
                </p>
              </div>

              <Badge className="bg-white/20 text-white border border-white/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 backdrop-blur-md">
                {isArabic ? "إدارة التوصيل" : "Delivery Admin"}
              </Badge>
            </div>
          </div>

          <div className="p-1.5 space-y-1 mt-1">
            {/* ✅ تعديل بيانات الشركة - PINK & GREEN */}
            <DropdownMenuItem 
              onClick={openEditCompanyDialog}
              className="rounded-2xl cursor-pointer py-3 px-3.5 hover:bg-[#fbcfe8]/30 dark:hover:bg-[#fbcfe8]/20 group transition-all"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-[#d81b60]/20 to-[#1b433e]/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Building2 className="h-4 w-4 text-[#d81b60]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#d81b60] transition-colors">
                    {isArabic ? "🏢 تعديل بيانات الشركة" : "🏢 Edit Company Info"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {isArabic ? "تحديث اسم الشركة، رقم الهاتف، والعنوان" : "Update company name, phone, and address"}
                  </p>
                </div>
                <Edit3 className="h-3.5 w-3.5 text-[#d81b60] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </DropdownMenuItem>

            {/* ✅ تغيير كلمة المرور - PINK & GREEN */}
            <DropdownMenuItem 
              onClick={() => {
                setShowPasswordDialog(true);
                setIsOpen(false);
              }}
              className="rounded-2xl cursor-pointer py-3 px-3.5 hover:bg-[#fbcfe8]/30 dark:hover:bg-[#fbcfe8]/20 group transition-all"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-[#d81b60]/20 to-[#1b433e]/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <KeyRound className="h-4 w-4 text-[#d81b60]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#d81b60] transition-colors">
                    {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {isArabic ? "تحديث وتأمين كلمة مرور حسابك" : "Update and secure your password"}
                  </p>
                </div>
                <Sparkles className="h-3.5 w-3.5 text-[#d81b60] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />

            {/* ✅ تسجيل الخروج */}
            <DropdownMenuItem 
              onClick={handleLogout}
              className="rounded-2xl cursor-pointer py-3 px-3.5 hover:bg-red-50 dark:hover:bg-red-950/30 group transition-all"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="h-9 w-9 rounded-xl bg-red-500/15 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform shadow-sm">
                  <LogOut className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    {isArabic ? "تسجيل الخروج" : "Logout"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {isArabic ? "الخروج الآمن من لوحة تحكم التوصيل" : "Sign out safely from delivery dashboard"}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          </div>

          {/* Footer - PINK & GREEN */}
          <div className="px-4 py-2.5 bg-gradient-to-r from-[#fbcfe8]/20 to-[#1b433e]/10 dark:from-[#fbcfe8]/10 dark:to-[#1b433e]/20 rounded-2xl mt-1 border border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5 text-[#d81b60] dark:text-[#f48fb1]">
                <Shield className="h-3.5 w-3.5" />
                {isArabic ? "نظام التوصيل الآمن" : "Secure System"}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isArabic ? "متصل الآن" : "Online"}
              </span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ===== DIALOG: تغيير كلمة المرور - PINK & GREEN THEME ===== */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md rounded-3xl overflow-hidden p-0 border-[#f9a8d4]/30 shadow-2xl">
          <div className="bg-gradient-to-r from-[#d81b60] via-[#f48fb1] to-[#1b433e] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
              <Lock className="w-40 h-40" />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/30">
                <KeyRound className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight">
                  {isArabic ? "🔑 تغيير كلمة المرور بأمان" : "🔑 Change Password Securely"}
                </DialogTitle>
                <DialogDescription className="text-white/85 text-xs mt-1 font-medium">
                  {isArabic 
                    ? "أدخل كلمة المرور الحالية والجديدة لتأمين حسابك في شركة التوصيل" 
                    : "Enter current and new password to secure your delivery account"}
                </DialogDescription>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="p-6 space-y-4 bg-white dark:bg-slate-900">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#d81b60] dark:text-[#f48fb1]">
                {isArabic ? "كلمة المرور الحالية" : "Current Password"} *
              </Label>
              <Input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder={isArabic ? "أدخل كلمة المرور الحالية" : "Enter current password"}
                required
                className="rounded-2xl h-11 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20 text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#d81b60] dark:text-[#f48fb1]">
                {isArabic ? "كلمة المرور الجديدة" : "New Password"} *
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={isArabic ? "أدخل كلمة المرور الجديدة" : "Enter new password"}
                  required
                  minLength={6}
                  className="rounded-2xl h-11 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20 pe-10 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3.5 text-muted-foreground hover:text-[#d81b60] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                {isArabic ? "يجب أن تكون 6 أحرف على الأقل" : "At least 6 characters"}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#d81b60] dark:text-[#f48fb1]">
                {isArabic ? "تأكيد كلمة المرور الجديدة" : "Confirm New Password"} *
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isArabic ? "أعد إدخال كلمة المرور الجديدة" : "Re-enter new password"}
                required
                minLength={6}
                className={cn(
                  "rounded-2xl h-11 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20 text-xs font-medium",
                  confirmPassword && newPassword !== confirmPassword && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] text-red-500 flex items-center gap-1 font-semibold">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {isArabic ? "كلمة المرور غير متطابقة" : "Passwords do not match"}
                </p>
              )}
            </div>

            <div className="p-3 bg-gradient-to-r from-[#fbcfe8]/30 to-[#1b433e]/20 dark:from-[#fbcfe8]/20 dark:to-[#1b433e]/20 rounded-2xl border border-[#f9a8d4]/30 flex items-start gap-2.5">
              <PackageCheck className="h-4 w-4 text-[#d81b60] dark:text-[#f48fb1] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#d81b60] dark:text-[#f48fb1] font-semibold leading-relaxed">
                {isArabic 
                  ? "سيتم تحديث كلمة المرور فورا وتأمين كافة عمليات التوصيل الخاصة بك." 
                  : "Password will be updated immediately to secure all your deliveries."}
              </p>
            </div>

            <DialogFooter className="pt-3 gap-2 flex-row-reverse sm:flex-row">
              <Button
                type="submit"
                disabled={loading || !oldPassword || !newPassword || newPassword !== confirmPassword}
                className="flex-1 bg-gradient-to-r from-[#d81b60] to-[#1b433e] hover:from-[#c2185b] hover:to-[#2a655f] text-white rounded-2xl h-11 text-xs font-bold shadow-lg shadow-[#d81b60]/25"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Save className="h-4 w-4 mr-1.5" />
                )}
                {loading 
                  ? (isArabic ? "جاري الحفظ..." : "Saving...") 
                  : (isArabic ? "حفظ التغييرات" : "Save Changes")
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 rounded-2xl h-11 text-xs font-bold border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 hover:bg-[#fbcfe8]/30 dark:hover:bg-[#fbcfe8]/20"
              >
                <X className="h-4 w-4 mr-1.5" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: تعديل الشركة - PINK & GREEN THEME ===== */}
      <Dialog open={showEditCompanyDialog} onOpenChange={setShowEditCompanyDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 border-[#f9a8d4]/30 shadow-2xl">
          {/* Header مع زر X - PINK & GREEN */}
          <div className="bg-gradient-to-r from-[#d81b60] via-[#f48fb1] to-[#1b433e] p-6 text-white relative overflow-hidden sticky top-0 z-10">
            
            <button
              type="button"
              onClick={() => {
                setShowEditCompanyDialog(false);
                setIsPhoneChanged(false);
                setPhoneAvailable(null);
              }}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-all duration-200 hover:rotate-90 hover:scale-110 z-20"
              aria-label="Close dialog"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
              <Building2 className="w-40 h-40" />
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner border border-white/30">
                <Building2 className="h-6 w-6 text-emerald-300" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight">
                  {isArabic ? "🏢 تعديل معلومات الشركة" : "🏢 Edit Company Info"}
                </DialogTitle>
                <DialogDescription className="text-white/85 text-xs mt-1 font-medium">
                  {isArabic 
                    ? "تحديث بيانات شركة التوصيل الخاصة بك" 
                    : "Update your delivery company information"}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Body */}
          {companyData && (
            <form onSubmit={handleUpdateCompany} className="p-6 bg-white dark:bg-slate-900">
              {/* ===== الاسم ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> 
                    {isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)"} *
                  </Label>
                  <Input 
                    name="name_ar" 
                    defaultValue={companyData?.name_ar || ''}
                    placeholder={isArabic ? "شركة التوصيل السريع" : "Fast Delivery Company"}
                    required
                    className="rounded-2xl h-11 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> 
                    {isArabic ? "اسم الشركة (إنجليزي)" : "Company Name (English)"} *
                  </Label>
                  <Input 
                    name="name_en" 
                    defaultValue={companyData?.name_en || ''}
                    placeholder={isArabic ? "Fast Delivery Company" : "Fast Delivery Company"}
                    required
                    className="rounded-2xl h-11 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                  />
                </div>
              </div>

              {/* ===== رقم الهاتف مع التحقق ===== */}
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> 
                    {isArabic ? "رقم الهاتف" : "Phone"} *
                  </Label>
                  <div className="relative">
                    <Input 
                      name="phone" 
                      type="tel"
                      defaultValue={companyData?.phone || ''}
                      onChange={(e) => {
                        const newPhone = e.target.value;
                        const oldPhone = companyData?.phone || "";
                        setIsPhoneChanged(newPhone !== oldPhone);
                        if (newPhone !== oldPhone && newPhone.length >= 9) {
                          checkPhoneAvailability(newPhone);
                        } else {
                          setPhoneAvailable(null);
                        }
                      }}
                      required
                      className={cn(
                        "rounded-2xl h-11 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20",
                        isPhoneChanged && phoneAvailable === false && "border-red-500 focus-visible:ring-red-500",
                        isPhoneChanged && phoneAvailable === true && "border-emerald-500 focus-visible:ring-emerald-500"
                      )}
                    />
                    {isPhoneChanged && phoneCheckLoading && (
                      <div className="absolute inset-y-0 end-3 flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin text-[#d81b60]" />
                      </div>
                    )}
                    {isPhoneChanged && !phoneCheckLoading && phoneAvailable === false && (
                      <div className="absolute inset-y-0 end-3 flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                    {isPhoneChanged && !phoneCheckLoading && phoneAvailable === true && (
                      <div className="absolute inset-y-0 end-3 flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-emerald-500" />
                      </div>
                    )}
                  </div>
                  {isPhoneChanged && phoneAvailable === false && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {isArabic ? "هذا الرقم مستخدم من قبل" : "This number is already in use"}
                    </p>
                  )}
                  {isPhoneChanged && phoneAvailable === true && (
                    <p className="text-xs text-emerald-500 flex items-center gap-1">
                      <CheckCircleIcon className="h-3 w-3" />
                      {isArabic ? "✓ الرقم متاح" : "✓ Number is available"}
                    </p>
                  )}
                </div>
              </div>

              {/* ===== اختيار طريقة إدخال العنوان ===== */}
              <div className="space-y-3 mt-4">
                <Label className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1]">
                  {isArabic ? "📍 طريقة إدخال العنوان" : "📍 Address Input Method"}
                </Label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddressMethod("manual")}
                    className={`
                      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 border-2
                      ${addressMethod === "manual" 
                        ? "bg-gradient-to-r from-[#fbcfe8]/30 to-[#1b433e]/20 border-[#d81b60] dark:bg-[#fbcfe8]/20" 
                        : "bg-slate-50 dark:bg-slate-800/50 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 hover:bg-[#fbcfe8]/20 dark:hover:bg-[#fbcfe8]/10"}
                    `}
                  >
                    <Edit3 className="h-4 w-4 text-[#d81b60]" />
                    <span className="text-sm font-medium text-[#d81b60] dark:text-white">
                      {isArabic ? "📝 كتابة يدوية" : "✏️ Manual"}
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAddressMethod("map")}
                    className={`
                      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 border-2
                      ${addressMethod === "map" 
                        ? "bg-gradient-to-r from-[#fbcfe8]/30 to-[#1b433e]/20 border-[#d81b60] dark:bg-[#fbcfe8]/20" 
                        : "bg-slate-50 dark:bg-slate-800/50 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 hover:bg-[#fbcfe8]/20 dark:hover:bg-[#fbcfe8]/10"}
                    `}
                  >
                    <Map className="h-4 w-4 text-[#d81b60]" />
                    <span className="text-sm font-medium text-[#d81b60] dark:text-white">
                      {isArabic ? "🗺️ اختيار من الخريطة" : "🗺️ Map"}
                    </span>
                  </button>
                </div>
              </div>

              {/* ===== حقل العنوان ===== */}
              {addressMethod === "manual" ? (
                <div className="grid grid-cols-1 gap-4 mt-4 animate-in fade-in-50 duration-300">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> 
                      {isArabic ? "العنوان" : "Address"} *
                    </Label>
                    <Input 
                      name="address_ar" 
                      defaultValue={companyData?.address_ar || ''}
                      placeholder={isArabic ? "مثال: شارع الأندلس، مبنى 5" : "Example: Al-Andalus Street, Building 5"}
                      required
                      className="rounded-2xl h-11 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 mt-4 animate-in fade-in-50 duration-300">
                  <Label className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] flex items-center gap-1">
                    <Map className="h-3.5 w-3.5" /> 
                    {isArabic ? "اختر موقعك على الخريطة" : "Select your location on the map"} *
                  </Label>
                  <div className="rounded-2xl bg-white dark:bg-slate-800/50 p-3 border-2 border-[#f9a8d4]/30 focus-within:border-[#d81b60] transition-all duration-300">
                    <AddressPicker 
                      value={location ?? undefined} 
                      onChange={setLocation} 
                      lang={isArabic ? "ar" : "en"} 
                    />
                  </div>
                  {location && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      ✅ {isArabic ? "تم اختيار الموقع" : "Location selected"}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    {isArabic 
                      ? "📍 سيتم استخدام العنوان المختار من الخريطة تلقائياً" 
                      : "📍 The selected address from the map will be used automatically"}
                  </p>
                </div>
              )}

              {/* ===== الوصف ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> 
                    {isArabic ? "الوصف (عربي)" : "Description (Arabic)"}
                  </Label>
                  <Textarea 
                    name="description_ar" 
                    defaultValue={companyData?.description_ar || ''}
                    placeholder={isArabic ? "وصف الشركة بالعربية" : "Company description in Arabic"}
                    rows={3}
                    className="rounded-2xl border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> 
                    {isArabic ? "الوصف (إنجليزي)" : "Description (English)"}
                  </Label>
                  <Textarea 
                    name="description_en" 
                    defaultValue={companyData?.description_en || ''}
                    placeholder={isArabic ? "وصف الشركة بالإنجليزية" : "Company description in English"}
                    rows={3}
                    className="rounded-2xl border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                  />
                </div>
              </div>

              {/* ===== التسعير ===== */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#d81b60] dark:text-[#f48fb1]">
                    {isArabic ? "السعر الأساسي" : "Base Price"} *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="base_price" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.base_price || 0}
                      required
                      className="rounded-2xl h-10 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 ps-10 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#d81b60] dark:text-[#f48fb1]">
                    {isArabic ? "سعر الكيلومتر" : "Price per KM"} *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="price_per_km" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.price_per_km || 0}
                      required
                      className="rounded-2xl h-10 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 ps-10 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#d81b60] dark:text-[#f48fb1]">
                    {isArabic ? "الحد الأدنى" : "Min Fee"} *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="min_delivery_fee" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.min_delivery_fee || 0}
                      required
                      className="rounded-2xl h-10 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 ps-10 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#d81b60] dark:text-[#f48fb1]">
                    {isArabic ? "الحد الأقصى" : "Max Fee"} *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="max_delivery_fee" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.max_delivery_fee || 999999}
                      required
                      className="rounded-2xl h-10 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 ps-10 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                    />
                  </div>
                </div>
              </div>

              {/* ===== قيمة التوصيل المجاني ووقت التوصيل ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#d81b60] dark:text-[#f48fb1]">
                    {isArabic ? "قيمة التوصيل المجاني" : "Free Delivery Threshold"}
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="free_delivery_threshold" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.free_delivery_threshold || 0}
                      className="rounded-2xl h-10 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 ps-10 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-[#d81b60] dark:text-[#f48fb1]">
                    {isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time"} *
                  </Label>
                  <Input 
                    name="avg_delivery_time" 
                    type="number"
                    defaultValue={companyData?.avg_delivery_time || 60}
                    required
                    className="rounded-2xl h-10 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                  />
                  <p className="text-[10px] text-muted-foreground">{isArabic ? "بالدقائق" : "In minutes"}</p>
                </div>
              </div>

              {/* ===== الخيارات (Checkboxes) ===== */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-[#fbcfe8]/20 to-[#1b433e]/10 dark:from-[#fbcfe8]/10 dark:to-[#1b433e]/20 rounded-xl mt-4">
                <label className="flex items-center gap-2 text-sm text-[#d81b60] dark:text-[#f48fb1] cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="has_tracking" 
                    defaultChecked={companyData?.has_tracking ?? true}
                    className="h-4 w-4 rounded border-[#f9a8d4]/30 text-[#d81b60] focus:ring-[#d81b60]/50"
                  />
                  {isArabic ? "تتبع" : "Tracking"}
                </label>
                <label className="flex items-center gap-2 text-sm text-[#d81b60] dark:text-[#f48fb1] cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="has_insurance" 
                    defaultChecked={companyData?.has_insurance ?? true}
                    className="h-4 w-4 rounded border-[#f9a8d4]/30 text-[#d81b60] focus:ring-[#d81b60]/50"
                  />
                  {isArabic ? "تأمين" : "Insurance"}
                </label>
                <label className="flex items-center gap-2 text-sm text-[#d81b60] dark:text-[#f48fb1] cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="has_cod" 
                    defaultChecked={companyData?.has_cod ?? true}
                    className="h-4 w-4 rounded border-[#f9a8d4]/30 text-[#d81b60] focus:ring-[#d81b60]/50"
                  />
                  {isArabic ? "دفع عند الاستلام" : "Cash on Delivery"}
                </label>
                <label className="flex items-center gap-2 text-sm text-[#d81b60] dark:text-[#f48fb1] cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="has_express" 
                    defaultChecked={companyData?.has_express ?? true}
                    className="h-4 w-4 rounded border-[#f9a8d4]/30 text-[#d81b60] focus:ring-[#d81b60]/50"
                  />
                  {isArabic ? "توصيل سريع" : "Express"}
                </label>
              </div>

              {/* ===== حالة النشاط ===== */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#fbcfe8]/20 to-[#1b433e]/10 dark:from-[#fbcfe8]/10 dark:to-[#1b433e]/20 rounded-xl mt-4">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  defaultChecked={companyData?.is_active !== false}
                  className="h-4 w-4 rounded border-[#f9a8d4]/30 text-[#d81b60] focus:ring-[#d81b60]/50"
                />
                <Label className="text-sm font-medium text-[#d81b60] dark:text-[#f48fb1] cursor-pointer">
                  {isArabic ? "🟢 الشركة نشطة" : "🟢 Company is active"}
                </Label>
              </div>

              {/* ===== أزرار ===== */}
              <DialogFooter className="pt-6 gap-2 border-t border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEditCompanyDialog(false);
                    setIsPhoneChanged(false);
                    setPhoneAvailable(null);
                  }}
                  className="rounded-2xl h-11 text-sm font-bold border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 hover:bg-[#fbcfe8]/30 dark:hover:bg-[#fbcfe8]/20"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  disabled={editLoading || (isPhoneChanged && phoneAvailable === false)}
                  className="flex-1 bg-gradient-to-r from-[#d81b60] to-[#1b433e] hover:from-[#c2185b] hover:to-[#2a655f] text-white rounded-2xl h-11 text-sm font-bold shadow-lg shadow-[#d81b60]/25"
                >
                  {editLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  ) : (
                    <Save className="h-4 w-4 mr-1.5" />
                  )}
                  {editLoading 
                    ? (isArabic ? "جاري الحفظ..." : "Saving...") 
                    : (isArabic ? "حفظ التغييرات" : "Save Changes")
                  }
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// ✅ التصدير الصحيح
export default DeliveryAccountMenu;

// 🚴‍♂️ إضافة حركة المشي والحمل الانسيابية لمندوب التوصيل في الهيدر
const deliveryStyleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (deliveryStyleTag) {
  deliveryStyleTag.innerHTML = `
    @keyframes deliveryWalk {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-2px) rotate(-3deg); }
    }
    .animate-delivery-walk {
      animation: deliveryWalk 2s ease-in-out infinite;
    }
  `;
  document.head.appendChild(deliveryStyleTag);
}