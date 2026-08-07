// src/components/distributor/DistributorAccountMenu.tsx

import { useState, useEffect } from "react";
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
  DollarSign,
  Star,
  Package,
  UserCog,
  Edit,
  Phone,
  Truck,
  MapPin,
  User
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageInput } from "@/components/ImageInput";

interface DistributorAccountMenuProps {
  userData: {
    id: string;
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    role?: string;
  };
  companyName?: string;
  isArabic: boolean;
  showEarnings?: boolean;
  earnings?: number;
  ordersCount?: number;
  rating?: number;
}

export function DistributorAccountMenu({ 
  userData, 
  companyName, 
  isArabic,
  showEarnings = false,
  earnings = 0,
  ordersCount = 0,
  rating = 0
}: DistributorAccountMenuProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ✅ State لتعديل الملف الشخصي
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // ✅ STATE محلي للمستخدم
  const [localUserData, setLocalUserData] = useState({
    id: userData.id,
    full_name: userData.full_name || "",
    phone: userData.phone || "",
    avatar_url: userData.avatar_url || null,
    role: userData.role || "distributor"
  });

  const [profileData, setProfileData] = useState({
    full_name_ar: userData.full_name || "",
    full_name_en: "",
    phone: userData.phone || "",
    address_ar: "",
    address_en: "",
    governorate_id: "",
  });
  const [governorates, setGovernorates] = useState<any[]>([]);

  // ✅ دالة جلب الرابط العام للصورة
  const getPublicAvatarUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    
    // ✅ استخراج اسم الملف من المسار
    const fileName = path.split('/').pop();
    if (!fileName) return null;
    
    // ✅ بناء الرابط الصحيح
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const publicUrl = `${baseUrl}/storage/v1/object/public/uploads/distributors/${fileName}`;
    
    console.log("📸 [getPublicAvatarUrl] path:", path);
    console.log("📸 [getPublicAvatarUrl] fileName:", fileName);
    console.log("📸 [getPublicAvatarUrl] publicUrl:", publicUrl);
    
    return publicUrl;
  };

  // ✅ جلب المحافظات
  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const { data, error } = await supabase
          .from("governorates")
          .select("id, name_ar, name_en")
          .order("name_ar");
        if (error) throw error;
        setGovernorates(data || []);
      } catch (error) {
        console.error("Error fetching governorates:", error);
      }
    };
    fetchGovernorates();
  }, []);

  // ✅ تغيير كلمة المرور
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(isArabic ? "✅ تم تسجيل الخروج بنجاح" : "✅ Logged out successfully");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تسجيل الخروج" : "❌ Logout failed");
      console.error(error);
    }
  };

  // ✅ جلب بيانات الموزع مع الرابط العام للصورة
  useEffect(() => {
    const fetchDistributorData = async () => {
      if (!userData.id) return;
      try {
        const { data, error } = await supabase
          .from("distributors")
          .select("full_name_ar, full_name_en, phone, address_ar, address_en, governorate_id, avatar_url")
          .eq("user_id", userData.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          console.log("📝 [DistributorAccountMenu] Fetched data:", data);
          
          // ✅ الحصول على الرابط العام للصورة
          const publicAvatarUrl = getPublicAvatarUrl(data.avatar_url);
          
          // ✅ تحديث الـ state المحلي مع الرابط العام
          setLocalUserData(prev => ({
            ...prev,
            full_name: data.full_name_ar || userData.full_name || "",
            phone: data.phone || userData.phone || "",
            avatar_url: publicAvatarUrl,
          }));

          setProfileData({
            full_name_ar: data.full_name_ar || userData.full_name || "",
            full_name_en: data.full_name_en || "",
            phone: data.phone || userData.phone || "",
            address_ar: data.address_ar || "",
            address_en: data.address_en || "",
            governorate_id: data.governorate_id || "",
          });
        }
      } catch (error) {
        console.error("Error fetching distributor data:", error);
      }
    };
    fetchDistributorData();
  }, [userData.id]);

  // ✅ تحديث الملف الشخصي (مع الصورة)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profileData.full_name_ar.trim()) {
      toast.error(isArabic ? "❌ الاسم مطلوب" : "❌ Name is required");
      return;
    }

    if (!profileData.phone.trim() || profileData.phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }

    setProfileLoading(true);
    try {
      // ✅ تحديث الموزع في جدول distributors
      const { error: distributorError } = await supabase
        .from("distributors")
        .update({
          full_name_ar: profileData.full_name_ar,
          full_name_en: profileData.full_name_en || null,
          phone: profileData.phone,
          address_ar: profileData.address_ar || null,
          address_en: profileData.address_en || null,
          governorate_id: profileData.governorate_id || null,
          avatar_url: localUserData.avatar_url, // حفظ الرابط في قاعدة البيانات
        })
        .eq("user_id", userData.id);

      if (distributorError) {
        console.error("❌ Distributor update error:", distributorError);
        throw distributorError;
      }

      // ✅ تحديث الـ profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.full_name_ar,
          phone: profileData.phone,
          avatar_url: localUserData.avatar_url,
        })
        .eq("id", userData.id);

      if (profileError) {
        console.error("❌ Profile update error:", profileError);
        throw profileError;
      }

      toast.success(
        isArabic 
          ? "✅ تم تحديث الملف الشخصي بنجاح" 
          : "✅ Profile updated successfully"
      );
      
      setShowProfileDialog(false);
      
    } catch (error: any) {
      console.error("❌ Error updating profile:", error);
      toast.error(
        isArabic 
          ? `❌ فشل تحديث الملف: ${error.message}` 
          : `❌ Failed to update profile: ${error.message}`
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ✅ دالة معالجة تغيير الصورة
  const handleImageChange = (value: string) => {
    console.log("📸 [handleImageChange] value received:", value);
    console.log("📸 [handleImageChange] value type:", typeof value);
    console.log("📸 [handleImageChange] value length:", value?.length);
    
    // ✅ إذا كان الرابط يحتوي على http، استخراج المسار فقط
    let storagePath = value;
    let publicUrl = value;
    
    if (value?.startsWith('http')) {
      // ✅ استخراج المسار من الرابط العام
      const match = value.match(/\/uploads\/(.+)$/);
      if (match) {
        // ✅ استخراج اسم الملف فقط
        const fileName = match[1].split('/').pop();
        storagePath = `distributors/${fileName}`;
        
        // ✅ بناء الرابط العام للعرض الفوري
        const baseUrl = import.meta.env.VITE_SUPABASE_URL;
        publicUrl = `${baseUrl}/storage/v1/object/public/uploads/distributors/${fileName}`;
        
        console.log("📸 [handleImageChange] storagePath:", storagePath);
        console.log("📸 [handleImageChange] publicUrl for display:", publicUrl);
      }
    }
    
    // ✅ تحديث الـ state بالرابط العام (للعرض الفوري)
    setLocalUserData(prev => ({
      ...prev,
      avatar_url: publicUrl
    }));
    
    // ✅ تحديث في قاعدة البيانات (بالمسار)
    const updateAvatarInDB = async () => {
      try {
        console.log("📸 [handleImageChange] updating DB with path:", storagePath);
        
        // تحديث في جدول distributors
        const { error: distError } = await supabase
          .from("distributors")
          .update({ avatar_url: storagePath })
          .eq("user_id", userData.id);
        
        if (distError) {
          console.error("❌ [handleImageChange] distributor error:", distError);
          throw distError;
        }
        
        // تحديث في جدول profiles
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ avatar_url: storagePath })
          .eq("id", userData.id);
        
        if (profileError) {
          console.error("❌ [handleImageChange] profile error:", profileError);
          throw profileError;
        }
        
        console.log("✅ [handleImageChange] avatar updated successfully!");
        toast.success(isArabic ? "✅ تم تحديث الصورة بنجاح" : "✅ Image updated successfully");
        
      } catch (error) {
        console.error("❌ [handleImageChange] error:", error);
        toast.error(isArabic ? "❌ فشل تحديث الصورة" : "❌ Failed to update image");
      }
    };
    
    updateAvatarInDB();
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
      toast.error(
        isArabic 
          ? `❌ فشل تغيير كلمة المرور: ${error.message}` 
          : `❌ Failed to change password: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* ===== DROPDOWN MENU ===== */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-300 group">
            <div className="relative">
              <Avatar className="h-10 w-10 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
                <AvatarImage src={localUserData.avatar_url || undefined} />
                <AvatarFallback className="bg-[#0d2e2a] text-white text-sm font-bold">
                  {getInitials(localUserData.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d2e2a]" />
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs font-medium text-white truncate max-w-[100px]">
                {localUserData.full_name || localUserData.phone || (isArabic ? "موزع" : "Distributor")}
              </p>
              {companyName && (
                <p className="text-[9px] text-white/60 truncate max-w-[100px]">
                  {companyName}
                </p>
              )}
              <p className="text-[9px] text-white/50 truncate max-w-[100px]">
                {isArabic ? "🚚 موزع" : "🚚 Distributor"}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 rounded-2xl p-1 border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] p-4 text-white border-b border-white/10">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 border-2 border-white/20 shadow-lg">
                <AvatarImage src={localUserData.avatar_url || undefined} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {getInitials(localUserData.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-base">
                  {localUserData.full_name || localUserData.phone || (isArabic ? "موزع" : "Distributor")}
                </p>
                {companyName && (
                  <p className="text-xs text-white/80 truncate">
                    🏢 {companyName}
                  </p>
                )}
                <p className="text-xs text-white/70 truncate" dir="ltr">
                  📱 {localUserData.phone || (isArabic ? "غير متاح" : "Not available")}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className="bg-blue-500/30 text-white border-0 text-[9px]">
                    <Truck className="h-2.5 w-2.5 inline mr-0.5" />
                    {isArabic ? "موزع" : "Distributor"}
                  </Badge>
                  {rating > 0 && (
                    <Badge className="bg-yellow-500/30 text-white border-0 text-[9px]">
                      <Star className="h-2.5 w-2.5 inline mr-0.5 fill-yellow-400" />
                      {rating.toFixed(1)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ الأرباح والطلبات والتقييم */}
          {showEarnings && (
            <div className="grid grid-cols-3 gap-1.5 p-3 border-b border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20">
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-[#0d2e2a]/5 transition">
                <DollarSign className="h-4 w-4 text-emerald-500 mx-auto mb-0.5" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {earnings.toLocaleString()}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  {isArabic ? "الأرباح" : "Earnings"}
                </p>
              </div>
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-[#0d2e2a]/5 transition">
                <Package className="h-4 w-4 text-blue-500 mx-auto mb-0.5" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {ordersCount}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  {isArabic ? "الطلبات" : "Orders"}
                </p>
              </div>
              <div className="text-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-[#0d2e2a]/5 transition">
                <Star className="h-4 w-4 text-yellow-500 mx-auto mb-0.5 fill-yellow-400" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {rating.toFixed(1)}
                </p>
                <p className="text-[9px] text-muted-foreground">
                  {isArabic ? "التقييم" : "Rating"}
                </p>
              </div>
            </div>
          )}

          {/* ✅ تعديل الملف الشخصي */}
          <DropdownMenuItem 
            onClick={() => {
              setShowProfileDialog(true);
              setIsOpen(false);
            }}
            className="rounded-xl cursor-pointer py-2.5 px-3 hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition">
                <UserCog className="h-4 w-4 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {isArabic ? "تعديل الملف الشخصي" : "Edit Profile"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isArabic ? "تحديث معلوماتك الشخصية" : "Update your personal information"}
                </p>
              </div>
              <Edit className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5" />

          {/* ✅ تغيير كلمة المرور */}
          <DropdownMenuItem 
            onClick={() => {
              setShowPasswordDialog(true);
              setIsOpen(false);
            }}
            className="rounded-xl cursor-pointer py-2.5 px-3 hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition">
                <KeyRound className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isArabic ? "تحديث كلمة مرور حسابك" : "Update your account password"}
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1.5" />

          {/* ✅ تسجيل الخروج */}
          <DropdownMenuItem 
            onClick={handleLogout}
            className="rounded-xl cursor-pointer py-2.5 px-3 hover:bg-red-50/50 dark:hover:bg-red-950/20 group"
          >
            <div className="flex items-center gap-3 w-full">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition">
                <LogOut className="h-4 w-4 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {isArabic ? "تسجيل الخروج" : "Logout"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isArabic ? "الخروج من حسابك" : "Sign out of your account"}
                </p>
              </div>
            </div>
          </DropdownMenuItem>

          {/* Footer */}
          <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-800/30 border-t border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-emerald-500" />
                {isArabic ? "حساب نشط" : "Active account"}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isArabic ? "متصل" : "Online"}
              </span>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ===== DIALOG: تعديل الملف الشخصي ===== */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] p-6 text-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <UserCog className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {isArabic ? "✏️ تعديل الملف الشخصي" : "✏️ Edit Profile"}
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-0.5">
                  {isArabic 
                    ? "تحديث معلوماتك الشخصية كموزع" 
                    : "Update your personal information as a distributor"}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
            {/* ✅ صورة الموزع */}
            <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <ImageInput
                value={localUserData.avatar_url || ""}
                onChange={handleImageChange}
                userId={userData.id}
                folder="distributors"
                lang={isArabic ? "ar" : "en"}
                label={isArabic ? "صورة الموزع" : "Distributor Photo"}
                previewClassName="h-24 w-24 rounded-full object-cover"
                hint={isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo"}
              />
              <p className="text-xs text-muted-foreground">
                {isArabic ? "📸 اضغط على الصورة لتغييرها" : "📸 Click on the image to change it"}
              </p>
            </div>

            {/* ✅ الاسم */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "الاسم (عربي)" : "Name (Arabic)"} *
                </Label>
                <Input
                  value={profileData.full_name_ar}
                  onChange={(e) => setProfileData({ ...profileData, full_name_ar: e.target.value })}
                  placeholder={isArabic ? "أحمد محمد" : "Ahmed Mohamad"}
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                </Label>
                <Input
                  value={profileData.full_name_en}
                  onChange={(e) => setProfileData({ ...profileData, full_name_en: e.target.value })}
                  placeholder="Ahmed Mohamad"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            {/* ✅ رقم الهاتف */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                {isArabic ? "رقم الهاتف" : "Phone Number"} *
              </Label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                type="tel"
                placeholder="09XXXXXXXX"
                required
                className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
              />
            </div>

            {/* ✅ العنوان */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "العنوان (عربي)" : "Address (Arabic)"}
                </Label>
                <Input
                  value={profileData.address_ar}
                  onChange={(e) => setProfileData({ ...profileData, address_ar: e.target.value })}
                  placeholder={isArabic ? "دمشق، سوريا" : "Damascus, Syria"}
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "العنوان (إنجليزي)" : "Address (English)"}
                </Label>
                <Input
                  value={profileData.address_en}
                  onChange={(e) => setProfileData({ ...profileData, address_en: e.target.value })}
                  placeholder="Damascus, Syria"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            {/* ✅ المحافظة */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                {isArabic ? "المحافظة" : "Governorate"}
              </Label>
              <Select
                value={profileData.governorate_id}
                onValueChange={(value) => setProfileData({ ...profileData, governorate_id: value })}
              >
                <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
                  <SelectValue placeholder={isArabic ? "اختر المحافظة" : "Select governorate"} />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((g: any) => (
                    <SelectItem key={g.id} value={g.id}>
                      {isArabic ? g.name_ar : g.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ✅ أزرار الإرسال */}
            <DialogFooter className="pt-4 border-t border-[#0d2e2a]/10 gap-2 sticky bottom-0 bg-white dark:bg-slate-900 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowProfileDialog(false)}
                className="flex-1 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10"
              >
                <X className="h-4 w-4 mr-1.5" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={profileLoading}
                className="flex-1 bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] text-white hover:from-[#2a655f] hover:to-[#0d2e2a] rounded-xl"
              >
                {profileLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Save className="h-4 w-4 mr-1.5" />
                )}
                {profileLoading 
                  ? (isArabic ? "جاري..." : "Saving...") 
                  : (isArabic ? "حفظ التغييرات" : "Save Changes")
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: تغيير كلمة المرور ===== */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0">
          <div className="bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <KeyRound className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {isArabic ? "🔑 تغيير كلمة المرور" : "🔑 Change Password"}
                </DialogTitle>
                <DialogDescription className="text-white/80 text-sm mt-0.5">
                  {isArabic 
                    ? "أدخل كلمة المرور الجديدة لتحديث حسابك" 
                    : "Enter your new password to update your account"}
                </DialogDescription>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                {isArabic ? "كلمة المرور الحالية" : "Current Password"} *
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder={isArabic ? "أدخل كلمة المرور الحالية" : "Enter current password"}
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
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
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-[#0d2e2a] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                {isArabic ? "تأكيد كلمة المرور" : "Confirm Password"} *
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isArabic ? "أعد إدخال كلمة المرور الجديدة" : "Re-enter new password"}
                required
                minLength={6}
                className={cn(
                  "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20",
                  confirmPassword && newPassword !== confirmPassword && "border-red-500 focus-visible:ring-red-500"
                )}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {isArabic ? "كلمة المرور غير متطابقة" : "Passwords do not match"}
                </p>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-[#0d2e2a]/10 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPasswordDialog(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10"
              >
                <X className="h-4 w-4 mr-1.5" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                disabled={loading || !oldPassword || !newPassword || newPassword !== confirmPassword}
                className="flex-1 bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] text-white hover:from-[#2a655f] hover:to-[#0d2e2a] rounded-xl"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Save className="h-4 w-4 mr-1.5" />
                )}
                {loading 
                  ? (isArabic ? "جاري..." : "Saving...") 
                  : (isArabic ? "حفظ التغييرات" : "Save Changes")
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}