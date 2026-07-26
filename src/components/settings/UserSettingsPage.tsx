// src/components/settings/UserSettingsPage.tsx

import { useState, useEffect } from "react";
import { ImageInput } from "@/components/ImageInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp, useT } from "@/lib/i18n";
import { useUpdateProfile } from "@/lib/queries";
import { useProfileWithUpdate } from "@/lib/hooks/useProfileWithUpdate";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  User, Phone, MapPin, Mail, Lock, Save, X, Camera,
  Shield, CheckCircle2, AlertCircle, Settings as SettingsIcon,
  Globe, Moon, Sun, Bell, BellOff, Volume2, VolumeX,
  Plus, Trash2, Edit, Home, Building, MapPinned, Check,
  Loader2, Star, StarOff, Eye, EyeOff
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// ============================================================
// 📦 أنواع البيانات
// ============================================================
interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  address_text: string;
  details: string;
  lat: number | null;
  lng: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// ✅ دالة التحقق من توفر رقم الهاتف
// ============================================================
async function isPhoneAvailable(phone: string, userId: string): Promise<{
  available: boolean;
  message?: string;
}> {
  if (!phone || phone.trim().length < 5) {
    return {
      available: false,
      message: "رقم الهاتف غير صحيح (يجب أن يكون 5 أرقام على الأقل)"
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, phone")
    .eq("phone", phone.trim())
    .neq("id", userId)
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

// ============================================================
// 🏠 مكون إدارة العناوين
// ============================================================
function AddressManager({ userId, lang }: { userId: string; lang: string }) {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  
  const [newAddress, setNewAddress] = useState<Partial<UserAddress>>({
    label: "",
    address_text: "",
    details: "",
    lat: null,
    lng: null,
    is_default: false,
  });
  
  const [selectedLocation, setSelectedLocation] = useState<PickedLocation | null>(null);

  // ===== تحميل العناوين =====
  useEffect(() => {
    if (userId) {
      loadAddresses();
    }
  }, [userId]);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Error loading addresses:", error);
      toast.error(lang === "ar" ? "خطأ في تحميل العناوين" : "Error loading addresses");
    } finally {
      setIsLoading(false);
    }
  };

  // ===== إضافة عنوان جديد =====
  const handleAddAddress = async () => {
    if (!selectedLocation) {
      toast.error(lang === "ar" ? "الرجاء اختيار الموقع على الخريطة" : "Please select a location on the map");
      return;
    }

    const fullLabel = newAddress.label?.trim() || "";
    if (!fullLabel) {
      toast.error(lang === "ar" ? "الرجاء إدخال تسمية للعنوان" : "Please enter a label for the address");
      return;
    }

    const detailsText = newAddress.details?.trim() || "";
    if (!detailsText) {
      toast.error(lang === "ar" ? "الرجاء إدخال وصف تفصيلي للعنوان" : "Please enter a detailed description for the address");
      return;
    }

    try {
      const addressData = {
        user_id: userId,
        label: fullLabel,
        address_text: selectedLocation.address,
        details: detailsText,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        is_default: addresses.length === 0 || newAddress.is_default,
      };

      const { data, error } = await supabase
        .from("user_addresses")
        .insert(addressData)
        .select()
        .single();

      if (error) throw error;

      if (addressData.is_default) {
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", userId)
          .neq("id", data.id);
      }

      toast.success(lang === "ar" ? "✅ تم إضافة العنوان" : "✅ Address added");
      setNewAddress({ label: "", address_text: "", details: "", lat: null, lng: null, is_default: false });
      setSelectedLocation(null);
      setIsAdding(false);
      loadAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(lang === "ar" ? "خطأ في إضافة العنوان" : "Error adding address");
    }
  };

  // ===== تعديل عنوان =====
  const handleUpdateAddress = async () => {
    if (!editingAddress) return;
    if (!selectedLocation) {
      toast.error(lang === "ar" ? "الرجاء اختيار الموقع على الخريطة" : "Please select a location on the map");
      return;
    }

    const fullLabel = editingAddress.label?.trim() || "";
    if (!fullLabel) {
      toast.error(lang === "ar" ? "الرجاء إدخال تسمية للعنوان" : "Please enter a label for the address");
      return;
    }

    const detailsText = selectedLocation.details?.trim() || editingAddress.details?.trim() || "";
    if (!detailsText) {
      toast.error(lang === "ar" ? "الرجاء إدخال وصف تفصيلي للعنوان" : "Please enter a detailed description for the address");
      return;
    }

    try {
      const addressData = {
        label: fullLabel,
        address_text: selectedLocation.address,
        details: detailsText,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        is_default: editingAddress.is_default,
      };

      const { error } = await supabase
        .from("user_addresses")
        .update(addressData)
        .eq("id", editingAddress.id);

      if (error) throw error;

      if (addressData.is_default) {
        await supabase
          .from("user_addresses")
          .update({ is_default: false })
          .eq("user_id", userId)
          .neq("id", editingAddress.id);
      }

      toast.success(lang === "ar" ? "✅ تم تحديث العنوان" : "✅ Address updated");
      setEditingAddress(null);
      setSelectedLocation(null);
      loadAddresses();
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(lang === "ar" ? "خطأ في تحديث العنوان" : "Error updating address");
    }
  };

  // ===== حذف عنوان =====
  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from("user_addresses")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success(lang === "ar" ? "✅ تم حذف العنوان" : "✅ Address deleted");
      loadAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(lang === "ar" ? "خطأ في حذف العنوان" : "Error deleting address");
    }
  };

  // ===== تعيين عنوان كافتراضي =====
  const handleSetDefault = async (id: string) => {
    try {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", userId);

      const { error } = await supabase
        .from("user_addresses")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;

      toast.success(lang === "ar" ? "✅ تم تعيين العنوان كافتراضي" : "✅ Address set as default");
      loadAddresses();
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error(lang === "ar" ? "خطأ في تعيين العنوان الافتراضي" : "Error setting default address");
    }
  };

  // ===== فتح نافذة التعديل =====
  const openEditDialog = (address: UserAddress) => {
    setEditingAddress(address);
    setSelectedLocation({
      address: address.address_text,
      details: address.details || "",
      lat: address.lat || 0,
      lng: address.lng || 0,
      label: address.label,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* قائمة العناوين */}
      {addresses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>{lang === "ar" ? "لا توجد عناوين مسجلة" : "No addresses saved"}</p>
          <p className="text-sm">
            {lang === "ar" ? "أضف عنوانك الأول" : "Add your first address"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                addr.is_default
                  ? "border-blue-400 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-700"
                  : "border-slate-200/50 dark:border-slate-800/50 hover:border-blue-300/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white">
                        {lang === "ar" ? "افتراضي" : "Default"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{addr.address_text}</p>
                  {addr.details && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5">{addr.details}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!addr.is_default && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleSetDefault(addr.id)}
                    >
                      <Star className="h-4 w-4 text-muted-foreground hover:text-blue-600" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => openEditDialog(addr)}
                  >
                    <Edit className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {lang === "ar" ? "حذف العنوان" : "Delete Address"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {lang === "ar"
                            ? "هل أنت متأكد من حذف هذا العنوان؟ هذا الإجراء لا يمكن التراجع عنه."
                            : "Are you sure you want to delete this address? This action cannot be undone."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>
                          {lang === "ar" ? "إلغاء" : "Cancel"}
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {lang === "ar" ? "حذف" : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* زر إضافة عنوان جديد */}
      <Button
        variant="outline"
        className="w-full rounded-xl border-dashed border-2 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all h-12"
        onClick={() => {
          setIsAdding(true);
          setNewAddress({ 
            label: "", 
            address_text: "", 
            details: "", 
            lat: null, 
            lng: null, 
            is_default: false 
          });
          setSelectedLocation(null);
        }}
      >
        <Plus className="h-4 w-4 mr-2" />
        {lang === "ar" ? "إضافة عنوان جديد" : "Add New Address"}
      </Button>

      {/* ===== نافذة إضافة عنوان ===== */}
      <Dialog open={isAdding} onOpenChange={(open) => {
        setIsAdding(open);
        if (!open) {
          setNewAddress({ 
            label: "", 
            address_text: "", 
            details: "", 
            lat: null, 
            lng: null, 
            is_default: false 
          });
          setSelectedLocation(null);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {lang === "ar" ? "إضافة عنوان جديد" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {lang === "ar"
                ? "اختر موقعك على الخريطة وأدخل تفاصيل العنوان"
                : "Pick your location on the map and enter address details"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm font-medium">
                {lang === "ar" ? "تسمية العنوان *" : "Address Label *"}
              </Label>
              <Input
                value={newAddress.label || ""}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, label: e.target.value })
                }
                placeholder={lang === "ar" ? "مثال: المنزل، العمل" : "e.g. Home, Work"}
                className="mt-1.5 rounded-xl"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                {lang === "ar" ? "اختر الموقع على الخريطة *" : "Pick Location on Map *"}
              </Label>
              <div className="mt-1.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                <AddressPicker
                  value={selectedLocation}
                  onChange={setSelectedLocation}
                  lang={lang}
                  showLabel={false}
                  showDetails={false}
                />
              </div>
            </div>

            <div className="mt-2">
              <Label className="text-sm font-medium">
                {lang === "ar" ? "الوصف التفصيلي *" : "Detailed Description *"}
              </Label>
              <textarea
                value={newAddress.details || ""}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, details: e.target.value })
                }
                placeholder={
                  lang === "ar" 
                    ? "وصف تفصيلي للعنوان (شارع، بناء، طابق، علامة مميزة...)" 
                    : "Detailed address description (street, building, floor, landmark...)"
                }
                rows={4}
                required
                className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-blue-400/60 focus:bg-card focus:outline-none transition-all resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                {lang === "ar"
                  ? "📍 كلما كان الوصف أدق، وصل الطلب أسرع وأسهل. اذكر أقرب علامة مميزة."
                  : "📍 The more precise your description, the faster and easier delivery gets. Mention the nearest landmark."}
              </p>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 mt-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.is_default}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, is_default: e.target.checked })
                }
                className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isDefault" className="text-sm font-medium cursor-pointer">
                {lang === "ar" ? "تعيين كعنوان افتراضي" : "Set as default address"}
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleAddAddress}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== نافذة تعديل عنوان ===== */}
      <Dialog open={!!editingAddress} onOpenChange={(open) => !open && setEditingAddress(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {lang === "ar" ? "تعديل العنوان" : "Edit Address"}
            </DialogTitle>
            <DialogDescription>
              {lang === "ar"
                ? "قم بتحديث موقعك وتفاصيل العنوان"
                : "Update your location and address details"}
            </DialogDescription>
          </DialogHeader>

          {editingAddress && (
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "تسمية العنوان *" : "Address Label *"}
                </Label>
                <Input
                  value={editingAddress.label || ""}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, label: e.target.value })
                  }
                  placeholder={lang === "ar" ? "مثال: المنزل، العمل" : "e.g. Home, Work"}
                  className="mt-1.5 rounded-xl"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "اختر الموقع على الخريطة *" : "Pick Location on Map *"}
                </Label>
                <div className="mt-1.5 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <AddressPicker
                    value={selectedLocation}
                    onChange={setSelectedLocation}
                    lang={lang}
                    showLabel={false}
                    showDetails={false}
                  />
                </div>
              </div>

              <div className="mt-2">
                <Label className="text-sm font-medium">
                  {lang === "ar" ? "الوصف التفصيلي *" : "Detailed Description *"}
                </Label>
                <textarea
                  value={editingAddress.details || ""}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, details: e.target.value })
                  }
                  placeholder={
                    lang === "ar" 
                      ? "وصف تفصيلي للعنوان (شارع، بناء، طابق، علامة مميزة...)" 
                      : "Detailed address description (street, building, floor, landmark...)"
                  }
                  rows={4}
                  required
                  className="mt-1.5 w-full px-4 py-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 focus:border-blue-400/60 focus:bg-card focus:outline-none transition-all resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {lang === "ar"
                    ? "📍 كلما كان الوصف أدق، وصل الطلب أسرع وأسهل. اذكر أقرب علامة مميزة."
                    : "📍 The more precise your description, the faster and easier delivery gets. Mention the nearest landmark."}
                </p>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 mt-2">
                <input
                  type="checkbox"
                  id="editIsDefault"
                  checked={editingAddress.is_default}
                  onChange={(e) =>
                    setEditingAddress({ ...editingAddress, is_default: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="editIsDefault" className="text-sm font-medium cursor-pointer">
                  {lang === "ar" ? "تعيين كعنوان افتراضي" : "Set as default address"}
                </Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAddress(null)}>
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleUpdateAddress}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 🧑 مكون الملف الشخصي - مع التحقق من الرقم
// ============================================================
function ProfileTab({ profile, refetch }: { profile: any; refetch: () => void }) {
  const app = useApp();
  const t = useT();
  const updateProfile = useUpdateProfile();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  // ===== التحقق من الرقم عند التغيير =====
  const handlePhoneChange = async (value: string) => {
    setPhone(value);
    setPhoneError(null);
    
    if (value.trim().length >= 5 && app.user) {
      const result = await isPhoneAvailable(value.trim(), app.user.id);
      if (!result.available) {
        setPhoneError(result.message || null);
      }
    }
  };

  async function saveProfile() {
    if (!app.user) return;
    
    // ✅ التحقق من رقم الهاتف
    if (phone && phone.trim().length >= 5) {
      const phoneCheck = await isPhoneAvailable(phone.trim(), app.user.id);
      if (!phoneCheck.available) {
        toast.error(phoneCheck.message);
        return;
      }
    }
    
    setIsSaving(true);
    try {
      await updateProfile.mutateAsync({
        id: app.user.id,
        patch: {
          full_name: fullName || null,
          phone: phone || null,
          avatar_url: avatarUrl || null,
        },
      });

      // ✅ تحديث app.user فوراً
      if (app.user) {
        app.updateUser({
          name: fullName,
          phone: phone,
          avatar_url: avatarUrl,
        });
      }

      toast.success(app.lang === "ar" ? "✅ تم حفظ الملف الشخصي" : "✅ Profile saved");
      await refetch();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          {app.lang === "ar" ? "معلومات الملف الشخصي" : "Profile Information"}
        </CardTitle>
        <CardDescription>
          {app.lang === "ar"
            ? "تحديث معلوماتك الشخصية الأساسية"
            : "Update your basic personal information"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ✅ الصورة الشخصية - مع رفع مباشر */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Camera className="h-4 w-4 text-blue-600" />
            {app.lang === "ar" ? "الصورة الشخصية" : "Profile Picture"}
            <span className="text-xs text-muted-foreground font-normal">
              ({app.lang === "ar" ? "اختياري" : "Optional"})
            </span>
          </Label>
          
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={fullName} />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl">
                  {fullName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              )}
            </Avatar>
            
            <div className="flex-1">
              <ImageInput
                value={avatarUrl}
                onChange={setAvatarUrl}
                userId={app.user?.id}
                folder="avatars"
                lang={app.lang}
                label={app.lang === "ar" ? "📸 اضغط لرفع الصورة الشخصية" : "📸 Click to upload profile picture"}
                hint={app.lang === "ar" ? "صورة مربعة، يفضل 400×400 بكسل" : "Square image, preferably 400×400 pixels"}
                previewClassName="h-20 w-20 rounded-2xl object-cover"
                required={false}
              />
            </div>
          </div>
        </div>

        {/* الاسم */}
        <div>
          <Label className="text-sm font-medium">
            {app.lang === "ar" ? "الاسم الكامل" : "Full Name"}
          </Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={app.lang === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
            className="mt-1.5 rounded-xl"
          />
        </div>

        {/* رقم الهاتف - مع التحقق */}
        <div>
          <Label className="text-sm font-medium flex items-center gap-1">
            <Phone className="h-4 w-4" />
            {app.lang === "ar" ? "رقم الهاتف" : "Phone Number"}
            <span className="text-xs text-muted-foreground font-normal">
              ({app.lang === "ar" ? "فريد" : "Unique"})
            </span>
          </Label>
          <Input
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder={app.lang === "ar" ? "أدخل رقم هاتفك" : "Enter your phone number"}
            className={`mt-1.5 rounded-xl ${phoneError ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            dir="ltr"
          />
          {phoneError && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {phoneError}
            </p>
          )}
          {phone && phone.trim().length >= 5 && !phoneError && (
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {app.lang === "ar" ? "✅ رقم الهاتف متاح" : "✅ Phone number is available"}
            </p>
          )}
        </div>

        <Button
          onClick={saveProfile}
          disabled={isSaving || !!phoneError}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {app.lang === "ar" ? "جاري الحفظ..." : "Saving..."}
            </span>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "حفظ التغييرات" : "Save Changes"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================
// 🔒 تبويب الأمان - مع تغيير كلمة المرور بشكل احترافي
// ============================================================
function SecurityTab() {
  const app = useApp();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // ===== التحقق من صحة كلمة المرور =====
  const validatePassword = () => {
    // ✅ التحقق من أن كلمة المرور الجديدة مختلفة عن الحالية
    if (currentPassword && newPassword === currentPassword) {
      setPasswordError(app.lang === "ar" 
        ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" 
        : "⚠️ New password must be different from the old one"
      );
      return false;
    }
    
    if (newPassword.length < 8) {
      setPasswordError(app.lang === "ar" 
        ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" 
        : "Password must be at least 8 characters"
      );
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError(app.lang === "ar" 
        ? "كلمة المرور غير متطابقة" 
        : "Passwords do not match"
      );
      return false;
    }
    
    setPasswordError(null);
    return true;
  };

  // ===== تغيير كلمة المرور =====
  const handleChangePassword = async () => {
    // ✅ تحقق من أن كلمة المرور الجديدة مختلفة عن القديمة
    if (currentPassword === newPassword) {
      toast.error(app.lang === "ar" 
        ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" 
        : "⚠️ New password must be different from the old one"
      );
      return;
    }
    
    if (!validatePassword()) return;
    
    // ✅ التحقق من وجود البريد الإلكتروني
    if (!app.user?.email) {
      toast.error(app.lang === "ar" 
        ? "❌ لا يوجد بريد إلكتروني مرتبط بالحساب" 
        : "❌ No email associated with account"
      );
      return;
    }

    setIsLoading(true);
    try {
      // ✅ أولاً: التحقق من كلمة المرور الحالية
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: app.user.email,
        password: currentPassword,
      });

      if (signInError) {
        toast.error(app.lang === "ar" 
          ? "❌ كلمة المرور الحالية غير صحيحة" 
          : "❌ Current password is incorrect"
        );
        setIsLoading(false);
        return;
      }

      // ✅ ثانياً: تغيير كلمة المرور
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        // ✅ معالجة أخطاء محددة من Supabase
        if (error.message?.includes("same as the old password") || 
            error.message?.includes("should be different from the old password")) {
          toast.error(app.lang === "ar" 
            ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" 
            : "⚠️ New password must be different from the old one"
          );
        } else {
          toast.error(error.message || app.lang === "ar" 
            ? "❌ فشل تغيير كلمة المرور" 
            : "❌ Failed to change password"
          );
        }
        setIsLoading(false);
        return;
      }
      
      toast.success(app.lang === "ar" 
        ? "✅ تم تغيير كلمة المرور بنجاح" 
        : "✅ Password changed successfully"
      );
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError(null);
      
    } catch (error: any) {
      console.error("Error changing password:", error);
      
      // ✅ معالجة الأخطاء بشكل أفضل
      if (error.message?.includes("same as the old password") || 
          error.message?.includes("should be different from the old password")) {
        toast.error(app.lang === "ar" 
          ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" 
          : "⚠️ New password must be different from the old one"
        );
      } else {
        toast.error(error.message || app.lang === "ar" 
          ? "❌ فشل تغيير كلمة المرور" 
          : "❌ Failed to change password"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" />
          {app.lang === "ar" ? "الأمان وكلمة المرور" : "Security & Password"}
        </CardTitle>
        <CardDescription>
          {app.lang === "ar"
            ? "تغيير كلمة المرور وإدارة أمان الحساب"
            : "Change password and manage account security"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* تغيير كلمة المرور - تصميم احترافي */}
        <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30">
          <p className="font-medium text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Lock className="h-4 w-4 text-blue-600" />
            {app.lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}
          </p>

          <div className="space-y-3">
            {/* كلمة المرور الحالية */}
            <div>
              <Label className="text-sm font-medium">
                {app.lang === "ar" ? "كلمة المرور الحالية *" : "Current Password *"}
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder={app.lang === "ar" 
                    ? "أدخل كلمة المرور الحالية" 
                    : "Enter current password"
                  }
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* كلمة المرور الجديدة */}
            <div>
              <Label className="text-sm font-medium">
                {app.lang === "ar" ? "كلمة المرور الجديدة *" : "New Password *"}
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError(null);
                  }}
                  placeholder={app.lang === "ar" 
                    ? "أدخل كلمة المرور الجديدة (8 أحرف على الأقل)" 
                    : "Enter new password (at least 8 characters)"
                  }
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <Label className="text-sm font-medium">
                {app.lang === "ar" ? "تأكيد كلمة المرور *" : "Confirm Password *"}
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPasswordError(null);
                  }}
                  placeholder={app.lang === "ar" 
                    ? "أعد إدخال كلمة المرور الجديدة" 
                    : "Re-enter new password"
                  }
                  className="h-11 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* رسالة الخطأ */}
            {passwordError && (
              <div className="flex items-center gap-2 p-3 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
              </div>
            )}

            {/* ✅ تحذير إضافي: كلمة المرور الجديدة نفس القديمة */}
            {currentPassword && newPassword && currentPassword === newPassword && (
              <div className="flex items-center gap-2 p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {app.lang === "ar" 
                    ? "⚠️ كلمة المرور الجديدة يجب أن تكون مختلفة عن القديمة" 
                    : "⚠️ New password must be different from the old one"}
                </p>
              </div>
            )}

            {/* مؤشر قوة كلمة المرور */}
            {newPassword.length > 0 && !passwordError && currentPassword !== newPassword && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        newPassword.length < 8 ? 'w-1/3 bg-red-500' :
                        newPassword.length < 10 ? 'w-2/3 bg-yellow-500' :
                        'w-full bg-green-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {newPassword.length < 8 ? (app.lang === "ar" ? "ضعيفة" : "Weak") :
                     newPassword.length < 10 ? (app.lang === "ar" ? "متوسطة" : "Medium") :
                     (app.lang === "ar" ? "قوية" : "Strong")}
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleChangePassword}
              disabled={isLoading || !currentPassword || !newPassword || !confirmPassword || currentPassword === newPassword}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {app.lang === "ar" ? "جاري التغيير..." : "Changing..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {app.lang === "ar" ? "تغيير كلمة المرور" : "Change Password"}
                </span>
              )}
            </Button>

            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Shield className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
              {app.lang === "ar" 
                ? "💡 استخدم كلمة مرور قوية تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز"
                : "💡 Use a strong password with uppercase, lowercase, numbers, and symbols"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// ⚙️ تبويب التفضيلات
// ============================================================
function PreferencesTab() {
  const app = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-purple-600" />
          {app.lang === "ar" ? "التفضيلات والإعدادات" : "Preferences & Settings"}
        </CardTitle>
        <CardDescription>
          {app.lang === "ar"
            ? "تخصيص تجربتك في التطبيق"
            : "Customize your app experience"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* الوضع الليلي */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
          <div className="flex items-center gap-3">
            {app.theme === "dark" ? (
              <Moon className="h-5 w-5 text-indigo-600" />
            ) : (
              <Sun className="h-5 w-5 text-amber-600" />
            )}
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {app.lang === "ar" ? "الوضع الليلي" : "Dark Mode"}
              </p>
              <p className="text-xs text-muted-foreground">
                {app.lang === "ar"
                  ? "تغيير مظهر التطبيق"
                  : "Change app appearance"}
              </p>
            </div>
          </div>
          <Switch
            checked={app.theme === "dark"}
            onCheckedChange={app.toggleTheme}
          />
        </div>

        {/* الإشعارات */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
          <div className="flex items-center gap-3">
            {notificationsEnabled ? (
              <Bell className="h-5 w-5 text-blue-600" />
            ) : (
              <BellOff className="h-5 w-5 text-slate-400" />
            )}
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {app.lang === "ar" ? "الإشعارات" : "Notifications"}
              </p>
              <p className="text-xs text-muted-foreground">
                {app.lang === "ar"
                  ? "تفعيل أو تعطيل الإشعارات"
                  : "Enable or disable notifications"}
              </p>
            </div>
          </div>
          <Switch
            checked={notificationsEnabled}
            onCheckedChange={setNotificationsEnabled}
          />
        </div>

        {/* الصوت */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
          <div className="flex items-center gap-3">
            {soundEnabled ? (
              <Volume2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <VolumeX className="h-5 w-5 text-slate-400" />
            )}
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {app.lang === "ar" ? "صوت الإشعارات" : "Notification Sound"}
              </p>
              <p className="text-xs text-muted-foreground">
                {app.lang === "ar"
                  ? "تفعيل أو تعطيل صوت الإشعارات"
                  : "Enable or disable notification sound"}
              </p>
            </div>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={setSoundEnabled}
          />
        </div>

        {/* اللغة */}
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-purple-600" />
            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {app.lang === "ar" ? "اللغة" : "Language"}
              </p>
              <p className="text-xs text-muted-foreground">
                {app.lang === "ar" ? "العربية" : "English"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => app.setLang(app.lang === "ar" ? "en" : "ar")}
            className="rounded-xl"
          >
            <Globe className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "English" : "العربية"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// 🏠 الصفحة الرئيسية للإعدادات
// ============================================================
export function UserSettingsPage() {
  const app = useApp();
  const { profile, refetch } = useProfileWithUpdate();

  if (!app.user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-8">
          <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {app.lang === "ar" ? "يرجى تسجيل الدخول" : "Please Login"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {app.lang === "ar" 
              ? "يجب تسجيل الدخول للوصول إلى إعدادات الملف الشخصي" 
              : "You must be logged in to access profile settings"}
          </p>
          <Button 
            onClick={() => window.location.href = "/auth/login"} 
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25"
          >
            {app.lang === "ar" ? "تسجيل الدخول" : "Login"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {app.lang === "ar" ? "الإعدادات الشخصية" : "Personal Settings"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {app.lang === "ar"
              ? "إدارة ملفك الشخصي وعناوينك وإعدادات الحساب"
              : "Manage your profile, addresses, and account settings"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-lg rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
            <User className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "الملف" : "Profile"}
          </TabsTrigger>
          <TabsTrigger value="addresses" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
            <MapPin className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "العناوين" : "Addresses"}
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
            <Shield className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "الأمان" : "Security"}
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900">
            <Globe className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "التفضيلات" : "Preferences"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab profile={profile} refetch={refetch} />
        </TabsContent>

        <TabsContent value="addresses">
          <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinned className="h-5 w-5 text-emerald-600" />
                {app.lang === "ar" ? "عناويني" : "My Addresses"}
              </CardTitle>
              <CardDescription>
                {app.lang === "ar"
                  ? "إدارة عناوينك (يمكنك إضافة عدة عناوين وتحديد الافتراضي)"
                  : "Manage your addresses (you can add multiple addresses and set a default)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AddressManager userId={app.user.id} lang={app.lang} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="preferences">
          <PreferencesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}