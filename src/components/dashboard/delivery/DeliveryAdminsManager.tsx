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
  
  // ✅ Form states
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
      // ✅ جلب المالك أولاً
      const ownerId = await fetchCompanyOwner();
      setCompanyOwnerId(ownerId);
      
      // ✅ جلب من delivery_company_admins
      // ✅ استخدم فقط الحقول الموجودة في profiles
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
          role: 'delivery_company_admin',
          is_owner: record.profiles?.id === ownerId
        }));
        setAdmins(merged);
      } else {
        // ✅ إذا لم يوجد أدمن في الجدول، نضيف المالك تلقائياً
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

  // ✅ حذف مدير
  const handleRemoveAdmin = async (adminId: string, adminName: string, adminRecordId: string) => {
    if (!confirm(
      isArabic 
        ? `⚠️ هل أنت متأكد من حذف "${adminName}" من المدراء؟`
        : `⚠️ Are you sure you want to remove "${adminName}" from managers?`
    )) return;

    try {
      // ✅ حذف من delivery_company_admins
      const { error: adminError } = await supabase
        .from("delivery_company_admins")
        .delete()
        .eq("id", adminRecordId);

      if (adminError) throw adminError;

      toast.success(
        isArabic 
          ? `✅ تم حذف "${adminName}" من المدراء` 
          : `✅ Removed "${adminName}" from managers`
      );
      
      await fetchAdmins();
      
    } catch (error) {
      console.error("Error removing admin:", error);
      toast.error(isArabic ? "❌ فشل حذف المدير" : "❌ Failed to remove manager");
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
                  {!isOwner && admin.admin_id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl hover:bg-red-500/10 transition-all duration-300">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[160px]">
                        <DropdownMenuItem 
                          className="rounded-lg cursor-pointer gap-2 text-red-500 hover:bg-red-50/50"
                          onClick={() => handleRemoveAdmin(admin.id, admin.full_name || admin.phone, admin.admin_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {isArabic ? "حذف من المدراء" : "Remove from managers"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Dialog إضافة مدير ===== */}
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
    </div>
  );
}