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
  UserCheck
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

  // تغيير كلمة المرور
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
    if (!name) return "D";
    return name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* ===== DROPDOWN MENU ===== */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all duration-300 group shadow-lg">
            
            {/* 🚴‍♂️ أيقونة مندوب التوصيل المتحركة وهي تحمل طرد بحركة انسيابية تامة */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1b433e] to-[#2a655f] text-white shadow-md overflow-hidden">
              <div className="animate-delivery-walk flex items-center justify-center">
                <Bike className="h-4 w-4 text-emerald-300" />
              </div>
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="relative">
              <Avatar className="h-8 w-8 border-2 border-emerald-400/50 group-hover:border-emerald-400 transition-all duration-300 shadow-sm">
                <AvatarImage src={userData.avatar_url || undefined} />
                <AvatarFallback className="bg-[#1b433e] text-white text-xs font-black">
                  {getInitials(userData.full_name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#1b433e]" />
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

        <DropdownMenuContent align="end" className="w-80 rounded-3xl p-1.5 border-[#2a655f]/30 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1b433e] via-[#2a655f] to-[#3a8a82] p-4 rounded-2xl text-white shadow-inner relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <Bike className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <Avatar className="h-12 w-12 border-2 border-white/30 shadow-lg">
                <AvatarImage src={userData.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-[#1b433e] to-[#2a655f] text-white text-base font-black">
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

          {/* Body */}
          <div className="p-1.5 space-y-1 mt-1">
            <DropdownMenuItem 
              onClick={() => {
                setShowPasswordDialog(true);
                setIsOpen(false);
              }}
              className="rounded-2xl cursor-pointer py-3 px-3.5 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 group transition-all"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="h-9 w-9 rounded-xl bg-[#2a655f]/15 flex items-center justify-center text-[#2a655f] dark:text-emerald-400 group-hover:scale-110 transition-transform shadow-sm">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">
                    {isArabic ? "تغيير كلمة المرور" : "Change Password"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {isArabic ? "تحديث وتأمين كلمة مرور حسابك" : "Update and secure your password"}
                  </p>
                </div>
                <Sparkles className="h-3.5 w-3.5 text-[#2a655f] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />

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

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mt-1 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5 text-[#2a655f] dark:text-emerald-400">
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

      {/* ===== DIALOG: تغيير كلمة المرور ===== */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="max-w-md rounded-3xl overflow-hidden p-0 border-[#2a655f]/30 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1b433e] via-[#2a655f] to-[#3a8a82] p-6 text-white relative overflow-hidden">
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

          {/* Body */}
          <form onSubmit={handleChangePassword} className="p-6 space-y-4 bg-white dark:bg-slate-900">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {isArabic ? "كلمة المرور الحالية" : "Current Password"} *
              </Label>
              <div className="relative">
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder={isArabic ? "أدخل كلمة المرور الحالية" : "Enter current password"}
                  required
                  className="rounded-2xl h-11 border-slate-200 dark:border-slate-800 focus:border-[#2a655f] focus:ring-[#2a655f]/20 text-xs font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
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
                  className="rounded-2xl h-11 border-slate-200 dark:border-slate-800 focus:border-[#2a655f] focus:ring-[#2a655f]/20 pe-10 text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3.5 text-muted-foreground hover:text-[#2a655f] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                {isArabic ? "يجب أن تكون 6 أحرف على الأقل" : "At least 6 characters"}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-200">
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
                  "rounded-2xl h-11 border-slate-200 dark:border-slate-800 focus:border-[#2a655f] focus:ring-[#2a655f]/20 text-xs font-medium",
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

            {/* تحذير توعوي */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/30 flex items-start gap-2.5">
              <PackageCheck className="h-4 w-4 text-[#2a655f] dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold leading-relaxed">
                {isArabic 
                  ? "سيتم تحديث كلمة المرور فورا وتأمين كافة عمليات التوصيل الخاصة بك." 
                  : "Password will be updated immediately to secure all your deliveries."}
              </p>
            </div>

            {/* Footer */}
            <DialogFooter className="pt-3 gap-2 flex-row-reverse sm:flex-row">
              <Button
                type="submit"
                disabled={loading || !oldPassword || !newPassword || newPassword !== confirmPassword}
                className="flex-1 bg-gradient-to-r from-[#1b433e] to-[#2a655f] hover:from-[#2a655f] hover:to-[#1b433e] text-white rounded-2xl h-11 text-xs font-bold shadow-lg shadow-[#2a655f]/25"
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
                className="flex-1 rounded-2xl h-11 text-xs font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4 mr-1.5" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

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