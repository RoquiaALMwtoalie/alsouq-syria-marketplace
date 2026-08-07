// src/components/dashboard/delivery/DeliveryAccountMenu.tsx

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  KeyRound,
  LogOut,
  Shield,
  UserCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  X,
  Loader2
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

interface DeliveryAccountMenuProps {
  userData: {
    id: string;
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    role?: string;
  };
  companyName?: string;
  isArabic: boolean;
}

export function DeliveryAccountMenu({ userData, companyName, isArabic }: DeliveryAccountMenuProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
              <Avatar className="h-8 w-8 border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
                <AvatarImage src={userData.avatar_url || undefined} />
                <AvatarFallback className="bg-[#0d2e2a] text-white text-sm font-bold">
                  {getInitials(userData.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0d2e2a]" />
            </div>
            <div className="hidden md:block text-right">
              <p className="text-xs font-medium text-white truncate max-w-[100px]">
                {userData.full_name || userData.phone || (isArabic ? "مستخدم" : "User")}
              </p>
              {companyName && (
                <p className="text-[9px] text-white/60 truncate max-w-[100px]">
                  {companyName}
                </p>
              )}
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72 rounded-2xl p-1 border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0d2e2a]/10 to-[#2a655f]/10 dark:from-[#0d2e2a]/30 dark:to-[#2a655f]/30 p-4 border-b border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-white/20 shadow-lg">
                <AvatarImage src={userData.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#0d2e2a] to-[#2a655f] text-white text-lg font-bold">
                  {getInitials(userData.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {userData.full_name || userData.phone || (isArabic ? "مستخدم" : "User")}
                </p>
                {companyName && (
                  <p className="text-xs text-muted-foreground truncate">
                    🏢 {companyName}
                  </p>
                )}
                <p className="text-xs text-muted-foreground truncate" dir="ltr">
                  📱 {userData.phone || (isArabic ? "غير متاح" : "Not available")}
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10 shrink-0">
                {isArabic ? "مدير شركة" : "Company Manager"}
              </Badge>
            </div>
          </div>

          {/* Body - ❌ تم إزالة "الحساب الشخصي" */}
          <div className="p-1.5 space-y-0.5">
            {/* ✅ فقط تغيير كلمة المرور و تسجيل الخروج */}
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
                    {isArabic ? "الخروج من حساب شركة التوصيل" : "Sign out of delivery company account"}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
          </div>

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

      {/* ===== DIALOG: تغيير كلمة المرور ===== */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0">
          {/* Header */}
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

          {/* Body */}
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

            {/* تحذير */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                {isArabic 
                  ? "سيتم تحديث كلمة المرور لحساب شركة التوصيل الخاص بك" 
                  : "Your delivery company account password will be updated"}
              </p>
            </div>

            {/* Footer */}
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