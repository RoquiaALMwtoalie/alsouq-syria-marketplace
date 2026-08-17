// src/components/dashboard/delivery/DeliveryAdminsManager.tsx

import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  UserMinus,
  Crown,
  Phone,
  Clock,
  X,
  Lock,
  Unlock,
  EyeOff,
  Eye,
  Loader2,
  MoreHorizontal,
  Users,
  Trash2,
  AlertTriangle,
  UserX,
  AlertCircle,
  Edit3,
  Save,
  CheckCircle as CheckCircleIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// ✅ ✅ ✅ أضف استيراد Tooltip
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DeliveryAdminsManagerProps {
  companyId: string;
  companyName?: string;
  isArabic: boolean;
  onAdminAdded?: () => void;
}

export function DeliveryAdminsManager({ companyId, companyName, isArabic, onAdminAdded }: DeliveryAdminsManagerProps) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [companyOwnerId, setCompanyOwnerId] = useState<string | null>(null);
  
  // ✅ State لديالوج تأكيد الحذف
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ State لتعديل المدير
  const [showEditAdminDialog, setShowEditAdminDialog] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any>(null);
  const [editPhone, setEditPhone] = useState("");
  const [editFullName, setEditFullName] = useState("");
  const [isPhoneChanged, setIsPhoneChanged] = useState(false);
  const [phoneCheckLoading, setPhoneCheckLoading] = useState(false);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // ✅ Form states للإضافة
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // ✅ جلب المالك أولاً
  const fetchCompanyOwner = useCallback(async () => {
    if (!companyId) return null;
    
    try {
      const { data, error } = await supabase
        .from("delivery_companies")
        .select("created_by")
        .eq("id", companyId)
        .single();
      
      if (error) throw error;
      return data?.created_by;
    } catch (error) {
      console.error("Error fetching company owner:", error);
      return null;
    }
  }, [companyId]);

  // ============================================================
  // ✅✅✅ جلب الأدمن من delivery_company_admins ✅✅✅
  // ============================================================
  const fetchAdmins = useCallback(async () => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const ownerId = await fetchCompanyOwner();
      setCompanyOwnerId(ownerId);
      
      const { data: adminRecords, error: adminError } = await supabase
        .from("delivery_company_admins")
        .select(`
          id,
          company_id,
          user_id,
          created_at,
          profiles:user_id (
            id,
            full_name,
            phone,
            avatar_url
          )
        `)
        .eq("company_id", companyId);
      
      if (adminError) throw adminError;
      
      if (adminRecords && adminRecords.length > 0) {
        const merged = adminRecords.map((record: any) => ({
          ...record.profiles,
          admin_id: record.id,
          admin_since: record.created_at,
          role: 'delivery_company',
          is_owner: record.profiles?.id === ownerId
        }));
        setAdmins(merged);
      } else {
        if (ownerId) {
          const { data: ownerProfile, error: ownerError } = await supabase
            .from("profiles")
            .select("id, full_name, phone, avatar_url")
            .eq("id", ownerId)
            .single();
          
          if (!ownerError && ownerProfile) {
            const { error: insertError } = await supabase
              .from("delivery_company_admins")
              .insert({
                company_id: companyId,
                user_id: ownerId,
              })
              .select()
              .single();
            
            if (insertError) {
              console.warn("⚠️ Could not auto-add owner as admin:", insertError);
            } else {
              await fetchAdmins();
              return;
            }
          }
        }
        setAdmins([]);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      toast.error(isArabic ? "❌ فشل جلب المدراء" : "❌ Failed to fetch managers");
    } finally {
      setLoading(false);
    }
  }, [companyId, isArabic, fetchCompanyOwner]);

  // ✅ التحقق من توفر الرقم (للتعديل)
  const checkPhoneAvailability = async (phone: string, excludeUserId?: string) => {
    if (!phone || phone.length < 9) {
      setPhoneAvailable(null);
      return;
    }

    setPhoneCheckLoading(true);
    try {
      const query = supabase
        .from("profiles")
        .select("id, phone")
        .eq("phone", phone);
      
      if (excludeUserId) {
        query.neq("id", excludeUserId);
      }
      
      const { data: existingProfile, error: profileError } = await query.maybeSingle();

      if (profileError) throw profileError;

      if (existingProfile) {
        setPhoneAvailable(false);
        setPhoneCheckLoading(false);
        return;
      }

      setPhoneAvailable(true);

    } catch (error) {
      console.error("Error checking phone:", error);
      setPhoneAvailable(false);
    } finally {
      setPhoneCheckLoading(false);
    }
  };

  // ✅ إضافة مدير جديد
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }

    if (!password || password.length < 6) {
      toast.error(isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-company-admin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            phone: phone.trim(),
            password: password,
            full_name_ar: fullName || `مدير ${phone}`,
            full_name_en: `Manager ${phone}`,
            company_id: companyId,
            role: 'delivery_company',
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to add manager');
      }

      toast.success(
        isArabic 
          ? `✅ تم إضافة المدير بنجاح\n📱 ${phone}\n🔑 ${password}`
          : `✅ Manager added successfully\n📱 ${phone}\n🔑 ${password}`
      );
      
      setShowAddDialog(false);
      setPhone("");
      setPassword("");
      setFullName("");
      setIsAdding(false);
      
      await fetchAdmins();
      if (onAdminAdded) onAdminAdded();
      
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast.error(
        isArabic 
          ? `❌ فشل إضافة المدير: ${error.message || 'خطأ غير معروف'}`
          : `❌ Failed to add manager: ${error.message || 'Unknown error'}`
      );
      setIsAdding(false);
    }
  };

  // ✅ ✅ ✅ فتح ديالوج تعديل المدير
  const openEditAdminDialog = (admin: any) => {
    setEditingAdmin(admin);
    setEditPhone(admin.phone || "");
    setEditFullName(admin.full_name || "");
    setIsPhoneChanged(false);
    setPhoneAvailable(null);
    setShowEditAdminDialog(true);
  };

  // ✅ ✅ ✅ تحديث معلومات المدير (الاسم ورقم الهاتف)
  const handleUpdateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingAdmin) return;
    
    if (!editPhone || editPhone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }

    if (!editFullName || editFullName.length < 2) {
      toast.error(isArabic ? "❌ الاسم مطلوب" : "❌ Name is required");
      return;
    }

    // ✅ إذا لم يتغير شيء، أغلق الديالوج
    if (editPhone === editingAdmin.phone && editFullName === editingAdmin.full_name) {
      setShowEditAdminDialog(false);
      setEditingAdmin(null);
      setEditPhone("");
      setEditFullName("");
      setIsPhoneChanged(false);
      setPhoneAvailable(null);
      return;
    }

    // ✅ إذا تم تغيير الرقم ولم يتم التحقق منه
    if (isPhoneChanged && phoneAvailable === false) {
      toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل" : "❌ This number is already in use");
      return;
    }

    setIsEditing(true);

    try {
      const userId = editingAdmin.id;

      // ✅ 1️⃣ تحديث الاسم ورقم الهاتف في profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: editFullName.trim(),
          phone: editPhone.trim(),
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      // ✅ 2️⃣ تحديث رقم الهاتف في auth.users (اختياري - يحتاج Service Role Key)
      if (isPhoneChanged) {
        try {
          const { error: authError } = await supabase.auth.admin.updateUserById(
            userId,
            { phone: editPhone.trim() }
          );
          if (authError) {
            console.warn("⚠️ Could not update auth user phone:", authError);
          }
        } catch (authError) {
          console.warn("⚠️ Auth update skipped:", authError);
        }
      }

      toast.success(
        isArabic 
          ? `✅ تم تحديث معلومات المدير بنجاح`
          : `✅ Admin information updated successfully`
      );
      
      setShowEditAdminDialog(false);
      setEditingAdmin(null);
      setEditPhone("");
      setEditFullName("");
      setIsPhoneChanged(false);
      setPhoneAvailable(null);
      setIsEditing(false);
      
      await fetchAdmins();
      
    } catch (error: any) {
      console.error("Error updating admin:", error);
      toast.error(
        isArabic 
          ? `❌ فشل تحديث المعلومات: ${error.message || 'خطأ غير معروف'}`
          : `❌ Failed to update information: ${error.message || 'Unknown error'}`
      );
      setIsEditing(false);
    }
  };

  // ✅ فتح ديالوج تأكيد الحذف
  const openDeleteDialog = (admin: any) => {
    setDeletingAdmin(admin);
    setShowDeleteDialog(true);
  };

  // ✅ حذف مدير
  const handleConfirmDelete = async () => {
    if (!deletingAdmin) return;
    
    setIsDeleting(true);
    
    try {
      const { error: adminError } = await supabase
        .from("delivery_company_admins")
        .delete()
        .eq("id", deletingAdmin.admin_id);

      if (adminError) throw adminError;

      toast.success(
        isArabic 
          ? `✅ تم حذف "${deletingAdmin.full_name || deletingAdmin.phone}" من المدراء` 
          : `✅ Removed "${deletingAdmin.full_name || deletingAdmin.phone}" from managers`
      );
      
      setShowDeleteDialog(false);
      setDeletingAdmin(null);
      setIsDeleting(false);
      
      await fetchAdmins();
      
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error(isArabic ? "❌ فشل حذف المدير" : "❌ Failed to remove manager");
      setIsDeleting(false);
    }
  };

  // ✅ التحميل الأولي
  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  // ============================================================
  // التصميم
  // ============================================================
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#0d2e2a]" />
            {isArabic ? "👑 مدراء الشركة" : "👑 Company Managers"}
            <span className="text-sm font-normal text-muted-foreground">
              ({admins.length})
            </span>
          </h3>
          {companyName && (
            <p className="text-sm text-muted-foreground">
              {isArabic ? `إدارة مدراء شركة "${companyName}"` : `Manage managers of "${companyName}"`}
            </p>
          )}
        </div>
        <Button 
          className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300 hover:scale-105"
          onClick={() => setShowAddDialog(true)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          {isArabic ? "إضافة مدير" : "Add Manager"}
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border border-dashed border-[#0d2e2a]/30">
          <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-[#0d2e2a]/40" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {isArabic ? "لا يوجد مدراء" : "No managers"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {isArabic ? "قم بإضافة مدراء لشركة التوصيل" : "Add managers to your delivery company"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {admins.map((admin: any) => {
            const isOwner = admin.id === companyOwnerId;
            return (
              <div
                key={admin.id}
                className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-[#0d2e2a]/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center shrink-0">
                    {admin.avatar_url ? (
                      <img src={admin.avatar_url} alt="" className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <span className="text-2xl font-bold text-[#0d2e2a]">
                        {admin.full_name?.charAt(0) || 'M'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {admin.full_name || admin.phone}
                      </p>
                      {isOwner && (
                        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[9px]">
                          <Crown className="h-2.5 w-2.5 inline mr-0.5" />
                          {isArabic ? "المالك" : "Owner"}
                        </Badge>
                      )}
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px]">
                        <ShieldCheck className="h-2.5 w-2.5 inline mr-0.5" />
                        {isArabic ? "مدير" : "Manager"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-1">
                      <span className="flex items-center gap-1" dir="ltr">
                        <Phone className="h-3 w-3" />
                        {admin.phone}
                      </span>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {admin.admin_since ? new Date(admin.admin_since).toLocaleDateString(isArabic ? "ar-SA" : "en-US") : new Date(admin.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
                      </span>
                    </div>
                  </div>
                {/* ✅ ✅ ✅ أزرار الإجراءات (تعديل + حذف) */}
{!isOwner && admin.admin_id && (
  <TooltipProvider>
    <div className="flex items-center gap-1.5 shrink-0">
      {/* ✅ زر تعديل */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/10 hover:from-emerald-500/30 hover:to-emerald-600/25 border border-emerald-500/20 hover:border-emerald-500/40 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-emerald-500/25 group"
            onClick={() => openEditAdminDialog(admin)}
          >
            <Edit3 className="h-4 w-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30 text-xs font-medium">
          {isArabic ? "تعديل المدير" : "Edit Manager"}
        </TooltipContent>
      </Tooltip>

      {/* ✅ زر حذف */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-500/15 to-rose-600/10 hover:from-red-500/30 hover:to-rose-600/25 border border-red-500/20 hover:border-red-500/40 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 group"
            onClick={() => openDeleteDialog(admin)}
          >
            <Trash2 className="h-4 w-4 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30 text-xs font-medium">
          {isArabic ? "حذف المدير" : "Delete Manager"}
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== DIALOG: إضافة مدير ===== */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-[#0d2e2a]" />
              {isArabic ? "➕ إضافة مدير شركة" : "➕ Add Company Manager"}
            </DialogTitle>
            <DialogDescription>
              {isArabic 
                ? "سيتم إنشاء حساب جديد لمدير الشركة برقم هاتف وكلمة مرور" 
                : "A new company manager account will be created with phone and password"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "الاسم الكامل (اختياري)" : "Full Name (Optional)"}
                </Label>
                <Input 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isArabic ? "مدير الشركة" : "Company Manager"}
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "رقم الهاتف" : "Phone Number"} *
                </Label>
                <Input 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel" 
                  placeholder="09XXXXXXXX"
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "سيتم استخدام هذا الرقم لتسجيل الدخول" : "This number will be used for login"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "كلمة المرور" : "Password"} *
                </Label>
                <div className="relative">
                  <Input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"} 
                    placeholder="********"
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
              <div className="text-xs text-muted-foreground bg-[#0d2e2a]/5 p-3 rounded-xl border border-[#0d2e2a]/20">
                {isArabic 
                  ? `🔗 سيتم ربط المدير بشركة "${companyName || ''}"`
                  : `🔗 Manager will be linked to company "${companyName || ''}"`
                }
              </div>
            </div>
            
            <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
              <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300"
                disabled={isAdding}
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-1.5" />
                )}
                {isArabic ? "إضافة مدير" : "Add Manager"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== ✅✅✅ DIALOG: تعديل المدير ✅✅✅ ===== */}
      <Dialog open={showEditAdminDialog} onOpenChange={setShowEditAdminDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
              <Edit3 className="h-6 w-6 text-[#0d2e2a]" />
              {isArabic ? "✏️ تعديل معلومات المدير" : "✏️ Edit Manager Info"}
            </DialogTitle>
            <DialogDescription>
              {isArabic 
                ? "تحديث اسم ورقم هاتف المدير" 
                : "Update manager name and phone number"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAdmin} className="space-y-4">
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "الاسم الكامل" : "Full Name"} *
                </Label>
                <Input 
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  placeholder={isArabic ? "اسم المدير" : "Manager name"}
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                  {isArabic ? "رقم الهاتف" : "Phone Number"} *
                </Label>
                <div className="relative">
                  <Input 
                    value={editPhone}
                    onChange={(e) => {
                      const newPhone = e.target.value;
                      setEditPhone(newPhone);
                      const oldPhone = editingAdmin?.phone || "";
                      setIsPhoneChanged(newPhone !== oldPhone);
                      if (newPhone !== oldPhone && newPhone.length >= 9) {
                        checkPhoneAvailability(newPhone, editingAdmin?.id);
                      } else {
                        setPhoneAvailable(null);
                      }
                    }}
                    type="tel" 
                    placeholder="09XXXXXXXX"
                    required
                    className={cn(
                      "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20",
                      isPhoneChanged && phoneAvailable === false && "border-red-500 focus-visible:ring-red-500",
                      isPhoneChanged && phoneAvailable === true && "border-emerald-500 focus-visible:ring-emerald-500"
                    )}
                  />
                  {isPhoneChanged && phoneCheckLoading && (
                    <div className="absolute inset-y-0 end-3 flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin text-[#0d2e2a]" />
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
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "سيتم تحديث رقم الهاتف في حساب المدير" : "Phone number will be updated in manager's account"}
                </p>
              </div>
            </div>
            
            <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
              <Button type="button" variant="outline" onClick={() => {
                setShowEditAdminDialog(false);
                setEditingAdmin(null);
                setEditPhone("");
                setEditFullName("");
                setIsPhoneChanged(false);
                setPhoneAvailable(null);
              }}>
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300"
                disabled={isEditing || (isPhoneChanged && phoneAvailable === false)}
              >
                {isEditing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Save className="h-4 w-4 mr-1.5" />
                )}
                {isEditing 
                  ? (isArabic ? "جاري الحفظ..." : "Saving...") 
                  : (isArabic ? "حفظ التغييرات" : "Save Changes")
                }
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: تأكيد الحذف ===== */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rounded-2xl border-0 p-0 overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                  <AlertTriangle className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-2xl bg-red-400/30 blur-lg animate-pulse" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {isArabic ? "⚠️ تأكيد الحذف" : "⚠️ Confirm Deletion"}
                </DialogTitle>
                <p className="text-white/80 text-sm mt-0.5">
                  {isArabic 
                    ? "هذا الإجراء لا يمكن التراجع عنه" 
                    : "This action cannot be undone"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border-2 border-red-200/50 dark:border-red-800/30">
              <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <UserX className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="font-semibold text-red-700 dark:text-red-300">
                  {isArabic ? "هل أنت متأكد؟" : "Are you sure?"}
                </p>
                <p className="text-sm text-red-600/80 dark:text-red-400/70">
                  {isArabic
                    ? `سيتم حذف "${deletingAdmin?.full_name || deletingAdmin?.phone || ''}" من مدراء الشركة`
                    : `"${deletingAdmin?.full_name || deletingAdmin?.phone || ''}" will be removed from company managers`}
                </p>
              </div>
            </div>

            {deletingAdmin && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                  {isArabic ? "📋 معلومات المدير" : "📋 Manager Information"}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{isArabic ? "الاسم" : "Name"}</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {deletingAdmin.full_name || deletingAdmin.phone || '-'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{isArabic ? "رقم الهاتف" : "Phone"}</span>
                    <span className="font-medium text-slate-900 dark:text-white" dir="ltr">
                      {deletingAdmin.phone || '-'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
              <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {isArabic
                  ? "سيتم إلغاء صلاحيات المدير فقط، ولن يتم حذف حسابه بالكامل"
                  : "Only manager permissions will be revoked, the account will not be deleted"}
              </p>
            </div>
          </div>

          <DialogFooter className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingAdmin(null);
              }}
              className="flex-1 rounded-xl"
              disabled={isDeleting}
            >
              <X className="h-4 w-4 mr-1.5" />
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isArabic ? "جاري الحذف..." : "Deleting..."}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}