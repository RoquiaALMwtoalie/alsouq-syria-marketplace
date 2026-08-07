// src/components/dashboard/admin/AdminDeliveryCompanies.tsx

import { useState, useEffect } from "react";
import { useApp, useT } from "@/lib/i18n";
import {
  useDeliveryCompanies,
  useDistributors,
  useDeliveryOrders,
  useUpdateDeliveryCompany,
  useCreateDeliveryCompany,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import {
  Truck,
  Users,
  Phone,
  Mail,
  Eye,
  MoreVertical,
  User as UserIcon,
  Search,
  X,
  Plus,
  UserPlus,
  Building2,
  Package,
  Clock,
  CheckCircle,
  DollarSign,
  UserCheck,
  Star,
  Edit,
  Filter,
  BarChart3,
  Activity,
  Sparkles,
  TrendingUp,
  Shield,
  Award,
  Zap,
  Rocket,
  Crown,
  Gem,
  ChevronRight,
  Save,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function AdminDeliveryCompanies() {
  const app = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: companies = [], isLoading, refetch } = useDeliveryCompanies({ active: undefined });
  const { data: distributors = [], isLoading: distributorsLoading } = useDistributors({});
  const { data: allOrders = [], isLoading: ordersLoading } = useDeliveryOrders(app.user?.id);
  const updateCompany = useUpdateDeliveryCompany();
  const createCompany = useCreateDeliveryCompany();
  
  // ✅ حالة الـ Dialogs
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [isCompanyDialogOpen, setIsCompanyDialogOpen] = useState(false);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showEditCompany, setShowEditCompany] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  
  // ✅ State لـ Dialog إضافة موزع
  const [showAddDistributorDialog, setShowAddDistributorDialog] = useState(false);
  const [isAddingDistributor, setIsAddingDistributor] = useState(false);
  
  // ✅ حالة التبويب داخل شركة
  const [companyTab, setCompanyTab] = useState<"orders" | "distributors" | "analytics">("orders");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [distributorFilter, setDistributorFilter] = useState<string>("all");

  const isArabic = app.lang === "ar";

  // ✅ فلترة الشركات حسب البحث
  const filteredCompanies = companies.filter((company: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameAr = company.name_ar?.toLowerCase() || "";
    const nameEn = company.name_en?.toLowerCase() || "";
    const phone = company.phone || "";
    return nameAr.includes(q) || nameEn.includes(q) || phone.includes(q);
  });

  // ✅ جلب طلبات شركة معينة
  const getCompanyOrders = (companyId: string) => {
    return allOrders.filter((o: any) => o.delivery_company_id === companyId);
  };

  // ✅ جلب موزعين شركة معينة
  const getCompanyDistributors = (companyId: string) => {
    return distributors.filter((d: any) => d.delivery_company_id === companyId);
  };

  // ✅ حساب إحصائيات الشركة
  const getCompanyStats = (companyId: string) => {
    const orders = getCompanyOrders(companyId);
    const dists = getCompanyDistributors(companyId);
    
    const total = orders.length;
    const pending = orders.filter((o: any) => o.status === "pending").length;
    const assigned = orders.filter((o: any) => o.status === "assigned").length;
    const inTransit = orders.filter((o: any) => o.status === "in_transit").length;
    const delivered = orders.filter((o: any) => o.status === "delivered").length;
    const cancelled = orders.filter((o: any) => o.status === "cancelled").length;
    
    const totalRevenue = orders
      .filter((o: any) => o.status === "delivered")
      .reduce((sum: number, o: any) => sum + Number(o.delivery_fee || 0), 0);
    
    const availableDistributors = dists.filter((d: any) => d.is_available).length;
    
    return {
      total,
      pending,
      assigned,
      inTransit,
      delivered,
      cancelled,
      totalRevenue,
      totalDistributors: dists.length,
      availableDistributors,
      completionRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
    };
  };

  // ============================================================
  // ✅✅✅ جلب أدمن الشركة من delivery_company_admins ✅✅✅
  // ============================================================
// src/components/dashboard/admin/AdminDeliveryCompanies.tsx

// ... باقي الكود كما هو ...

// ============================================================
// ✅✅✅ جلب أدمن الشركة من delivery_company_admins (بدون email) ✅✅✅
// ============================================================
const [companyAdmins, setCompanyAdmins] = useState<any[]>([]);

const fetchCompanyAdmins = async (companyId: string) => {
  try {
    // ✅ جلب الأدمن من delivery_company_admins (بدون email)
    const { data: admins, error } = await supabase
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
          -- ✅ تم إزالة email لأنه غير موجود في جدول profiles
        )
      `)
      .eq("company_id", companyId);
    
    if (error) throw error;
    
    if (admins) {
      const merged = admins.map((admin: any) => ({
        ...admin.profiles,
        admin_id: admin.id,
        admin_since: admin.created_at,
        role: 'delivery_company_admin'
      }));
      setCompanyAdmins(merged);
    } else {
      setCompanyAdmins([]);
    }
  } catch (error) {
    console.error("Error fetching company admins:", error);
    setCompanyAdmins([]);
  }
};


  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("role", ["admin", "super_admin", "delivery_company"]);

        if (roles && roles.length > 0) {
          const userIds = roles.map(r => r.user_id);
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, phone, avatar_url, company_id")
            .in("id", userIds);
          
          if (profiles) {
            const merged = profiles.map(p => ({
              ...p,
              role: roles.find(r => r.user_id === p.id)?.role || "admin"
            }));
            setAdminUsers(merged);
          }
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
  }, []);

  // ✅ دالة إضافة شركة جديدة (باستخدام Edge Function)
  const handleAddCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const name_ar = formData.get("name_ar") as string;
    const name_en = formData.get("name_en") as string;

    if (!phone || phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }

    if (!password || password.length < 6) {
      toast.error(isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
      return;
    }

    setIsCreatingCompany(true);

    try {
      // 🚀 إرسال الطلب للدالة في السيرفر (Edge Function)
      const response = await fetch("https://jjqgfjpxaxjpyohvcbfi.supabase.co/functions/v1/rapid-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password, name_ar, name_en })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to create company");
      }

      const companyData = data.company;

      toast.success(
        isArabic 
          ? `✅ تم إنشاء الحساب والشركة "${name_ar}" بنجاح\n📱 ${phone}\n🔑 ${password}`
          : `✅ Account & Company "${name_en}" created successfully\n📱 ${phone}\n🔑 ${password}`
      );
      
      setShowAddCompany(false);
      form.reset();
      await refetch();
      if (companyData?.id) {
        await fetchCompanyAdmins(companyData.id);
      }
      
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
      console.error("Error:", error);
    } finally {
      setIsCreatingCompany(false);
    }
  };

  // ✅ دالة إضافة أدمن للشركة - باستخدام Edge Function
  // ✅ دالة إضافة أدمن للشركة - مع Logs
const handleAddAdminToCompany = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);
  
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  console.log("🔍 [handleAddAdmin] Starting...");
  console.log("📱 [handleAddAdmin] Phone:", phone);
  console.log("🔑 [handleAddAdmin] Password length:", password?.length || 0);
  console.log("👤 [handleAddAdmin] Full Name:", fullName);
  console.log("🏢 [handleAddAdmin] Company ID:", selectedCompanyId);

  if (!phone || phone.length < 9) {
    toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
    console.log("❌ [handleAddAdmin] Invalid phone number");
    return;
  }

  if (!password || password.length < 6) {
    toast.error(isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
    console.log("❌ [handleAddAdmin] Invalid password");
    return;
  }

  setIsAddingAdmin(true);

  try {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-company-admin`;
    console.log("🌐 [handleAddAdmin] Calling Edge Function:", url);

    const body = JSON.stringify({
      phone: phone.trim(),
      password: password,
      full_name_ar: fullName || `أدمن ${phone}`,
      full_name_en: `Admin ${phone}`,
      company_id: selectedCompanyId,
      role: 'delivery_company',
    });
    console.log("📦 [handleAddAdmin] Request body:", body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: body,
    });

    console.log("📡 [handleAddAdmin] Response status:", response.status);

    const result = await response.json();
    console.log("📄 [handleAddAdmin] Response data:", result);

    if (!response.ok || result.error) {
      console.error("❌ [handleAddAdmin] Error from Edge Function:", result.error);
      throw new Error(result.error || 'Failed to add admin');
    }

    console.log("✅ [handleAddAdmin] Admin added successfully:", result);

    toast.success(
      isArabic 
        ? `✅ تم إضافة الأدمن بنجاح\n📱 الرقم: ${phone}\n🔑 كلمة المرور: ${password}`
        : `✅ Admin added successfully\n📱 Phone: ${phone}\n🔑 Password: ${password}`
    );
    
    setShowAddAdmin(false);
    setSelectedCompanyId(null);
    setIsAddingAdmin(false);
    
    // ✅ تحديث أدمن الشركة المحددة
    if (selectedCompanyId) {
      console.log("🔄 [handleAddAdmin] Refreshing company admins for:", selectedCompanyId);
      await fetchCompanyAdmins(selectedCompanyId);
    }
    
    refetch();
    
  } catch (error: any) {
    console.error("❌ [handleAddAdmin] Catch error:", error);
    toast.error(isArabic ? `❌ فشل إضافة الأدمن: ${error.message}` : `❌ Failed to add admin: ${error.message}`);
    setIsAddingAdmin(false);
  }
};
  // ✅ دالة إضافة موزع للشركة
  const handleAddDistributorToCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const full_name_ar = formData.get("full_name_ar") as string;
    const full_name_en = formData.get("full_name_en") as string;
    const address_ar = formData.get("address_ar") as string;
    const address_en = formData.get("address_en") as string;
    const governorate_id = formData.get("governorate_id") as string;

    if (!phone || phone.length < 9) {
      toast.error(isArabic ? "❌ رقم الهاتف غير صحيح" : "❌ Invalid phone number");
      return;
    }

    if (!password || password.length < 6) {
      toast.error(isArabic ? "❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "❌ Password must be at least 6 characters");
      return;
    }

    if (!full_name_ar || full_name_ar.length < 2) {
      toast.error(isArabic ? "❌ الاسم (عربي) مطلوب" : "❌ Name (Arabic) is required");
      return;
    }

    setIsAddingDistributor(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-distributor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            phone: phone.trim(),
            password: password,
            full_name_ar: full_name_ar || `موزع ${phone}`,
            full_name_en: full_name_en || `Distributor ${phone}`,
            address_ar: address_ar || null,
            address_en: address_en || null,
            governorate_id: governorate_id || null,
            company_id: selectedCompanyId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to add distributor');
      }

      toast.success(
        isArabic 
          ? `✅ تم إضافة الموزع بنجاح\n📱 الرقم: ${phone}\n🔑 كلمة المرور: ${password}`
          : `✅ Distributor added successfully\n📱 Phone: ${phone}\n🔑 Password: ${password}`
      );
      
      setShowAddDistributorDialog(false);
      setIsAddingDistributor(false);
      refetch();
      
    } catch (error: any) {
      console.error("Error adding distributor:", error);
      toast.error(isArabic ? `❌ فشل إضافة الموزع: ${error.message}` : `❌ Failed to add distributor: ${error.message}`);
      setIsAddingDistributor(false);
    }
  };

  // ✅ دالة تحديث الشركة
  const handleUpdateCompany = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const patch: any = {
      name_ar: formData.get("name_ar") as string,
      name_en: formData.get("name_en") as string,
      phone: formData.get("phone") as string,
      address_ar: formData.get("address_ar") as string,
      address_en: formData.get("address_en") as string,
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

    setIsEditingCompany(true);

    try {
      await updateCompany.mutateAsync({
        id: selectedCompany.id,
        patch
      });
      
      toast.success(isArabic ? "✅ تم تحديث معلومات الشركة بنجاح" : "✅ Company updated successfully");
      setShowEditCompany(false);
      setIsEditingCompany(false);
      refetch();
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تحديث الشركة" : "❌ Failed to update company");
      setIsEditingCompany(false);
    }
  };

  // ✅ تحديث حالة الشركة
  const handleToggleActive = async (company: any) => {
    try {
      await updateCompany.mutateAsync({
        id: company.id,
        patch: { is_active: !company.is_active },
      });
      toast.success(
        isArabic
          ? `✅ تم ${!company.is_active ? "تفعيل" : "تعطيل"} الشركة بنجاح`
          : `✅ Company ${!company.is_active ? "activated" : "deactivated"} successfully`
      );
      refetch();
    } catch (error) {
      toast.error(isArabic ? "❌ حدث خطأ" : "❌ Error occurred");
    }
  };

  // ✅ حساب متوسط التقييم
  const getAverageRating = (companyId: string) => {
    const orders = getCompanyOrders(companyId);
    const ratedOrders = orders.filter((o: any) => o.distributor_rating);
    if (ratedOrders.length === 0) return 0;
    const sum = ratedOrders.reduce((acc: number, o: any) => acc + Number(o.distributor_rating || 0), 0);
    return Math.round((sum / ratedOrders.length) * 10) / 10;
  };

  // ✅ عند فتح تفاصيل الشركة، جلب أدمنها
  useEffect(() => {
    if (selectedCompany && isCompanyDialogOpen) {
      fetchCompanyAdmins(selectedCompany.id);
    }
  }, [selectedCompany, isCompanyDialogOpen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#0d2e2a] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Truck className="h-6 w-6 text-[#0d2e2a] dark:text-[#4a9f95]" />
            {isArabic ? "شركات التوصيل" : "Delivery Companies"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isArabic
              ? `إدارة شركات التوصيل (${companies.length} شركة)`
              : `Manage delivery companies (${companies.length} companies)`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white text-sm px-4 py-1.5 shadow-lg shadow-[#0d2e2a]/20">
            {companies.length} {isArabic ? "شركة" : "companies"}
          </Badge>
          <Dialog open={showAddCompany} onOpenChange={setShowAddCompany}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#0d2e2a]/30">
                <Plus className="h-4 w-4 mr-1" />
                {isArabic ? "إضافة شركة" : "Add Company"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
                  <Building2 className="h-5 w-5 text-[#0d2e2a]" />
                  {isArabic ? "➕ إضافة شركة توصيل جديدة" : "➕ Add New Delivery Company"}
                </DialogTitle>
                <DialogDescription>
                  {isArabic
                    ? "سيتم إنشاء حساب مدير للشركة تلقائياً"
                    : "A manager account will be created automatically"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCompany}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)"}</Label>
                    <Input name="name_ar" placeholder="شركة التوصيل السريع" required className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "اسم الشركة (إنجليزي)" : "Company Name (English)"}</Label>
                    <Input name="name_en" placeholder="Fast Delivery Company" className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "رقم الهاتف (للمدير)" : "Phone Number (for Manager)"}</Label>
                    <Input name="phone" type="tel" placeholder="09XXXXXXXX" required className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? "سيتم استخدام هذا الرقم لتسجيل الدخول" : "This number will be used for login"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "كلمة المرور" : "Password"}</Label>
                    <Input name="password" type="password" placeholder="********" required minLength={6} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                    <p className="text-xs text-muted-foreground">
                      {isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setShowAddCompany(false)}>
                    <X className="h-4 w-4 mr-1" />
                    {isArabic ? "إلغاء" : "Cancel"}
                  </Button>
                  <Button type="submit" className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white" disabled={isCreatingCompany}>
                    {isCreatingCompany ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-1" />
                        {isArabic ? "إنشاء الشركة" : "Create Company"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={isArabic ? "بحث عن شركة..." : "Search company..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ===== COMPANIES GRID ===== */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-2xl border border-dashed border-[#0d2e2a]/30">
          <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Truck className="h-10 w-10 text-[#0d2e2a]/40" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            {isArabic ? "لا توجد شركات توصيل" : "No delivery companies"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? isArabic
                ? `لا توجد نتائج تطابق "${searchQuery}"`
                : `No results match "${searchQuery}"`
              : isArabic
              ? "قم بإضافة أول شركة توصيل"
              : "Add your first delivery company"}
          </p>
          {!searchQuery && (
            <Button
              className="mt-4 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300"
              onClick={() => setShowAddCompany(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isArabic ? "إضافة شركة" : "Add Company"}
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company: any) => {
            const stats = getCompanyStats(company.id);
            const rating = getAverageRating(company.id);
            
            // ✅ جلب المالك الأساسي
            const adminUser = adminUsers.find((u: any) => 
              u.id === company.created_by && 
              (u.role === 'delivery_company' || u.role === 'admin' || u.role === 'super_admin')
            );
            
            return (
              <Card
                key={company.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-2 hover:border-[#0d2e2a]/50 bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-sm relative overflow-hidden"
                onClick={() => {
                  setSelectedCompany(company);
                  setIsCompanyDialogOpen(true);
                }}
              >
                {/* ... باقي كود البطاقة كما هو ... */}
                
                {/* ✅ بوردر متحرك */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0d2e2a]/0 via-[#0d2e2a]/5 to-[#0d2e2a]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#0d2e2a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:animate-shimmer" />
                
                {/* ✅ شارة مميزة */}
                {company.is_featured && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <div className="relative">
                      <div className="h-12 w-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] rounded-bl-2xl shadow-lg shadow-[#0d2e2a]/30" />
                        <Star className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-white animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {company.logo_url ? (
                        <img
                          src={company.logo_url}
                          alt=""
                          className="h-12 w-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0d2e2a]/10 to-[#1a4f4a]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Truck className="h-6 w-6 text-[#0d2e2a] dark:text-[#4a9f95]" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base group-hover:text-[#0d2e2a] dark:group-hover:text-[#4a9f95] transition-colors duration-300">
                          {isArabic ? company.name_ar : company.name_en}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <Badge
                            className={
                              company.is_active
                                ? "bg-emerald-500/10 text-emerald-600 border-0 text-[10px] animate-pulse"
                                : "bg-red-500/10 text-red-500 border-0 text-[10px]"
                            }
                          >
                            {company.is_active
                              ? isArabic ? "✅ نشطة" : "✅ Active"
                              : isArabic ? "❌ غير نشطة" : "❌ Inactive"}
                          </Badge>
                          {rating > 0 && (
                            <Badge className="bg-yellow-500/10 text-yellow-600 border-0 text-[10px] flex items-center gap-0.5">
                              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                              {rating}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500 transition-all duration-300 group-hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompanyId(company.id);
                          setShowAddAdmin(true);
                        }}
                        title={isArabic ? "إضافة أدمن" : "Add Admin"}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Switch
                        checked={company.is_active}
                        onCheckedChange={(e) => {
                          e.stopPropagation();
                          handleToggleActive(company);
                        }}
                        className="data-[state=checked]:bg-emerald-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-center group-hover:bg-[#0d2e2a]/5 transition-colors duration-300">
                      <Package className="h-4 w-4 text-[#0d2e2a] mx-auto mb-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
                      <p className="text-[9px] text-muted-foreground">
                        {isArabic ? "الطلبات" : "Orders"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-center group-hover:bg-[#0d2e2a]/5 transition-colors duration-300">
                      <Users className="h-4 w-4 text-[#0d2e2a] mx-auto mb-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.totalDistributors}</p>
                      <p className="text-[9px] text-muted-foreground">
                        {isArabic ? "الموزعين" : "Distributors"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-center group-hover:bg-[#0d2e2a]/5 transition-colors duration-300">
                      <Clock className="h-4 w-4 text-yellow-500 mx-auto mb-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                      <p className="text-xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
                      <p className="text-[9px] text-muted-foreground">
                        {isArabic ? "معلقة" : "Pending"}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 text-center group-hover:bg-[#0d2e2a]/5 transition-colors duration-300">
                      <DollarSign className="h-4 w-4 text-emerald-500 mx-auto mb-0.5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {stats.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-[9px] text-muted-foreground">
                        {isArabic ? "الإيرادات" : "Revenue"}
                      </p>
                    </div>
                  </div>
                  
                  {adminUser && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground border-t border-slate-200/50 dark:border-slate-700/50 pt-2.5">
                      <div className="h-5 w-5 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                        <UserIcon className="h-2.5 w-2.5 text-[#0d2e2a]" />
                      </div>
                      <span>{isArabic ? "المدير:" : "Manager:"}</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-[#0d2e2a] transition-colors duration-300">
                        {adminUser.full_name || adminUser.phone}
                      </span>
                      <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border-0 text-[8px]">
                        {adminUser.role === 'delivery_company' 
                          ? (isArabic ? 'مدير' : 'Manager')
                          : adminUser.role === 'super_admin'
                          ? (isArabic ? 'سوبر أدمن' : 'Super Admin')
                          : (isArabic ? 'أدمن' : 'Admin')}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-1">
                      <div className="h-1.5 w-full max-w-[100px] rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden group-hover:bg-[#0d2e2a]/20 transition-colors duration-300">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] transition-all duration-1000"
                          style={{ width: `${stats.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                        {stats.completionRate}%
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-[#0d2e2a] dark:text-[#4a9f95] hover:bg-[#0d2e2a]/10 group/btn transition-all duration-300 hover:scale-105"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCompany(company);
                        setIsCompanyDialogOpen(true);
                      }}
                    >
                      {isArabic ? "عرض التفاصيل" : "View Details"}
                      <ChevronRight className="h-3 w-3 ml-1 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ===== DIALOG: إضافة أدمن للشركة ===== */}
      <Dialog open={showAddAdmin} onOpenChange={setShowAddAdmin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
              <UserPlus className="h-5 w-5 text-emerald-500" />
              {isArabic ? "➕ إضافة أدمن للشركة" : "➕ Add Admin to Company"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "سيتم إنشاء حساب جديد للأدمن برقم هاتف وكلمة مرور"
                : "A new admin account will be created with phone and password"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAdminToCompany}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الاسم الكامل (اختياري)" : "Full Name (Optional)"}</Label>
                <Input name="full_name" placeholder={isArabic ? "أدمن الشركة" : "Company Admin"} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
              </div>
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "رقم الهاتف" : "Phone Number"}</Label>
                <Input name="phone" type="tel" placeholder="09XXXXXXXX" required className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "سيتم استخدام هذا الرقم لتسجيل الدخول" : "This number will be used for login"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "كلمة المرور" : "Password"}</Label>
                <Input name="password" type="password" placeholder="********" required minLength={6} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddAdmin(false)}>
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a]" disabled={isAddingAdmin}>
                {isAddingAdmin ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    {isArabic ? "إضافة أدمن" : "Add Admin"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: إضافة موزع للشركة ===== */}
      <Dialog open={showAddDistributorDialog} onOpenChange={setShowAddDistributorDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
              <UserPlus className="h-5 w-5 text-emerald-500" />
              {isArabic ? "➕ إضافة موزع للشركة" : "➕ Add Distributor to Company"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "سيتم إنشاء حساب جديد للموزع برقم هاتف وكلمة مرور"
                : "A new distributor account will be created with phone and password"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDistributorToCompany}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">
                  {isArabic ? "الاسم (عربي)" : "Name (Arabic)"} *
                </Label>
                <Input 
                  name="full_name_ar" 
                  placeholder={isArabic ? "أحمد محمد" : "Ahmed"} 
                  required
                  className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">
                  {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                </Label>
                <Input 
                  name="full_name_en" 
                  placeholder="Ahmed Mohamad" 
                  className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">
                  {isArabic ? "رقم الهاتف" : "Phone Number"} *
                </Label>
                <Input 
                  name="phone" 
                  type="tel" 
                  placeholder="09XXXXXXXX" 
                  required 
                  className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "سيتم استخدام هذا الرقم لتسجيل الدخول" : "This number will be used for login"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">
                  {isArabic ? "كلمة المرور" : "Password"} *
                </Label>
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="********" 
                  required 
                  minLength={6} 
                  className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">
                  {isArabic ? "العنوان (عربي)" : "Address (Arabic)"}
                </Label>
                <Input 
                  name="address_ar" 
                  placeholder={isArabic ? "دمشق" : "Damascus"} 
                  className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">
                  {isArabic ? "العنوان (إنجليزي)" : "Address (English)"}
                </Label>
                <Input 
                  name="address_en" 
                  placeholder="Damascus" 
                  className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white">
                  {isArabic ? "المحافظة" : "Governorate"}
                </Label>
                <Input 
                  name="governorate_id" 
                  placeholder={isArabic ? "اختر المحافظة" : "Select governorate"} 
                  className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="text-xs text-muted-foreground bg-[#0d2e2a]/5 p-3 rounded-xl border border-[#0d2e2a]/20">
                {isArabic 
                  ? `🔗 سيتم ربط الموزع بشركة "${selectedCompany?.name_ar || ''}"`
                  : `🔗 Distributor will be linked to company "${selectedCompany?.name_en || ''}"`
                }
              </div>
            </div>
            <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
              <Button type="button" variant="outline" onClick={() => setShowAddDistributorDialog(false)}>
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a]"
                disabled={isAddingDistributor}
              >
                {isAddingDistributor ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-1.5" />
                    {isArabic ? "إضافة موزع" : "Add Distributor"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: تعديل الشركة ===== */}
      <Dialog open={showEditCompany} onOpenChange={setShowEditCompany}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
              <Building2 className="h-5 w-5 text-[#0d2e2a]" />
              {isArabic ? "✏️ تعديل معلومات الشركة" : "✏️ Edit Company Info"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? `تعديل معلومات شركة "${selectedCompany?.name_ar || selectedCompany?.name_en}"`
                : `Edit company "${selectedCompany?.name_en || selectedCompany?.name_ar}"`}
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <form onSubmit={handleUpdateCompany}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {/* ✅ الاسم */}
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الاسم (عربي)" : "Name (Arabic)"} *</Label>
                  <Input name="name_ar" defaultValue={selectedCompany.name_ar} required className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الاسم (إنجليزي)" : "Name (English)"} *</Label>
                  <Input name="name_en" defaultValue={selectedCompany.name_en} required className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>

                {/* ✅ التواصل */}
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الهاتف" : "Phone"}</Label>
                  <Input name="phone" defaultValue={selectedCompany.phone || ""} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
                  <Input name="email" type="email" defaultValue={selectedCompany.email || ""} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>

                {/* ✅ العناوين */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
                  <Input name="address_ar" defaultValue={selectedCompany.address_ar || ""} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "العنوان (إنجليزي)" : "Address (English)"}</Label>
                  <Input name="address_en" defaultValue={selectedCompany.address_en || ""} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>

                {/* ✅ الوصف */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الوصف (عربي)" : "Description (Arabic)"}</Label>
                  <Textarea name="description_ar" defaultValue={selectedCompany.description_ar || ""} rows={2} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الوصف (إنجليزي)" : "Description (English)"}</Label>
                  <Textarea name="description_en" defaultValue={selectedCompany.description_en || ""} rows={2} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>

                {/* ✅ التسعير */}
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "السعر الأساسي" : "Base Price"}</Label>
                  <Input name="base_price" type="number" step="0.01" defaultValue={selectedCompany.base_price || 0} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "السعر لكل كم" : "Price per KM"}</Label>
                  <Input name="price_per_km" type="number" step="0.01" defaultValue={selectedCompany.price_per_km || 0} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الحد الأدنى للتوصيل المجاني" : "Free Delivery Threshold"}</Label>
                  <Input name="free_delivery_threshold" type="number" step="0.01" defaultValue={selectedCompany.free_delivery_threshold || 0} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "متوسط وقت التوصيل (دقيقة)" : "Avg Delivery Time (min)"}</Label>
                  <Input name="avg_delivery_time" type="number" defaultValue={selectedCompany.avg_delivery_time || 60} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الحد الأدنى للتوصيل" : "Min Delivery Fee"}</Label>
                  <Input name="min_delivery_fee" type="number" step="0.01" defaultValue={selectedCompany.min_delivery_fee || 0} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#0d2e2a] dark:text-white">{isArabic ? "الحد الأقصى للتوصيل" : "Max Delivery Fee"}</Label>
                  <Input name="max_delivery_fee" type="number" step="0.01" defaultValue={selectedCompany.max_delivery_fee || 999999} className="focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20" />
                </div>

                {/* ✅ الخيارات */}
                <div className="space-y-2 md:col-span-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="has_tracking" id="has_tracking" defaultChecked={selectedCompany.has_tracking} className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]" />
                      <label htmlFor="has_tracking" className="text-sm text-[#0d2e2a] dark:text-white">{isArabic ? "تتبع" : "Tracking"}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="has_insurance" id="has_insurance" defaultChecked={selectedCompany.has_insurance} className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]" />
                      <label htmlFor="has_insurance" className="text-sm text-[#0d2e2a] dark:text-white">{isArabic ? "تأمين" : "Insurance"}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="has_cod" id="has_cod" defaultChecked={selectedCompany.has_cod} className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]" />
                      <label htmlFor="has_cod" className="text-sm text-[#0d2e2a] dark:text-white">{isArabic ? "الدفع عند الاستلام" : "Cash on Delivery"}</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="has_express" id="has_express" defaultChecked={selectedCompany.has_express} className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]" />
                      <label htmlFor="has_express" className="text-sm text-[#0d2e2a] dark:text-white">{isArabic ? "توصيل سريع" : "Express"}</label>
                    </div>
                  </div>
                </div>

                {/* ✅ حالة الشركة */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_active" id="is_active" defaultChecked={selectedCompany.is_active} className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]" />
                    <label htmlFor="is_active" className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                      {isArabic ? "✅ الشركة نشطة" : "✅ Company is active"}
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowEditCompany(false)}>
                  <X className="h-4 w-4 mr-1" />
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white" disabled={isEditingCompany}>
                  {isEditingCompany ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1.5" />
                      {isArabic ? "حفظ التغييرات" : "Save Changes"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== COMPANY DETAILS DIALOG ===== */}
      <Dialog open={isCompanyDialogOpen} onOpenChange={setIsCompanyDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedCompany.logo_url ? (
                    <img
                      src={selectedCompany.logo_url}
                      alt=""
                      className="h-10 w-10 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 p-1"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0d2e2a]/10 to-[#1a4f4a]/10 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-[#0d2e2a]" />
                    </div>
                  )}
                  <div>
                    <div className="text-lg font-bold text-[#0d2e2a] dark:text-white">
                      {isArabic ? selectedCompany.name_ar : selectedCompany.name_en}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span dir="ltr">{selectedCompany.phone}</span>
                      {selectedCompany.email && (
                        <>
                          <span className="text-muted-foreground/30">|</span>
                          <Mail className="h-3 w-3" />
                          <span>{selectedCompany.email}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ms-auto flex items-center gap-2">
                    <Badge
                      className={
                        selectedCompany.is_active
                          ? "bg-emerald-500/10 text-emerald-600 border-0"
                          : "bg-red-500/10 text-red-500 border-0"
                      }
                    >
                      {selectedCompany.is_active
                        ? isArabic ? "✅ نشطة" : "✅ Active"
                        : isArabic ? "❌ غير نشطة" : "❌ Inactive"}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 text-[#0d2e2a] transition-all duration-300 hover:scale-105"
                      onClick={() => {
                        setShowEditCompany(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      {isArabic ? "تعديل" : "Edit"}
                    </Button>
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* ===== STATS ===== */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { icon: Package, label: isArabic ? "الطلبات" : "Orders", value: getCompanyStats(selectedCompany.id).total, color: "blue" },
                  { icon: Clock, label: isArabic ? "معلقة" : "Pending", value: getCompanyStats(selectedCompany.id).pending, color: "yellow" },
                  { icon: Truck, label: isArabic ? "قيد التوصيل" : "In Transit", value: getCompanyStats(selectedCompany.id).inTransit, color: "orange" },
                  { icon: CheckCircle, label: isArabic ? "منجزة" : "Delivered", value: getCompanyStats(selectedCompany.id).delivered, color: "green" },
                  { icon: Users, label: isArabic ? "الموزعين" : "Distributors", value: getCompanyStats(selectedCompany.id).totalDistributors, color: "purple" },
                  { icon: DollarSign, label: isArabic ? "الإيرادات" : "Revenue", value: getCompanyStats(selectedCompany.id).totalRevenue.toLocaleString(), color: "emerald" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={cn(
                      "bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 text-center hover:scale-105 transition-all duration-300 hover:shadow-md",
                      stat.color === "blue" && "border-l-4 border-l-[#0d2e2a]",
                      stat.color === "yellow" && "border-l-4 border-l-yellow-500",
                      stat.color === "orange" && "border-l-4 border-l-orange-500",
                      stat.color === "green" && "border-l-4 border-l-green-500",
                      stat.color === "purple" && "border-l-4 border-l-purple-500",
                      stat.color === "emerald" && "border-l-4 border-l-emerald-500",
                    )}
                  >
                    <stat.icon className={cn(
                      "h-5 w-5 mx-auto mb-1 transition-all duration-300",
                      stat.color === "blue" && "text-[#0d2e2a]",
                      stat.color === "yellow" && "text-yellow-500",
                      stat.color === "orange" && "text-orange-500",
                      stat.color === "green" && "text-green-500",
                      stat.color === "purple" && "text-purple-500",
                      stat.color === "emerald" && "text-emerald-500",
                    )} />
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* ===== ✅✅✅ COMPANY ADMINS (من delivery_company_admins) ✅✅✅ ===== */}
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#0d2e2a] dark:text-[#4a9f95]" />
                    <h4 className="text-sm font-semibold text-[#0d2e2a] dark:text-white">
                      {isArabic ? "👑 أدمن الشركة" : "👑 Company Admins"}
                    </h4>
                    <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border-0 text-[10px]">
                      {companyAdmins.length} {isArabic ? "أدمن" : "Admins"}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3 text-xs border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 text-[#0d2e2a]"
                    onClick={() => {
                      setSelectedCompanyId(selectedCompany.id);
                      setShowAddAdmin(true);
                    }}
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    {isArabic ? "إضافة أدمن" : "Add Admin"}
                  </Button>
                </div>

                {companyAdmins.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {isArabic ? "لا يوجد أدمن لهذه الشركة" : "No admins for this company"}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {companyAdmins.map((admin: any) => {
                      const isOwner = admin.id === selectedCompany.created_by;
                      return (
                        <div
                          key={admin.id}
                          className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all"
                        >
                          <div className="h-8 w-8 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center overflow-hidden shrink-0">
                            {admin.avatar_url ? (
                              <img src={admin.avatar_url} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-[#0d2e2a]">
                                {admin.full_name?.charAt(0) || 'U'}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-slate-900 dark:text-white">
                              {admin.full_name || admin.phone}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground" dir="ltr">
                                {admin.phone}
                              </p>
                              {isOwner && (
                                <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border-0 text-[8px]">
                                  👑 {isArabic ? "مالك" : "Owner"}
                                </Badge>
                              )}
                              {admin.role === 'delivery_company_admin' && (
                                <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[8px]">
                                  {isArabic ? "مدير" : "Manager"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ===== TABS ===== */}
              <Tabs value={companyTab} onValueChange={(v) => setCompanyTab(v as any)} className="mt-4">
                <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800">
                  <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-[#0d2e2a] data-[state=active]:text-white">
                    <Package className="h-4 w-4" />
                    {isArabic ? "📦 الطلبات" : "📦 Orders"}
                  </TabsTrigger>
                  <TabsTrigger value="distributors" className="flex items-center gap-2 data-[state=active]:bg-[#0d2e2a] data-[state=active]:text-white">
                    <Users className="h-4 w-4" />
                    {isArabic ? "👤 الموزعين" : "👤 Distributors"}
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-[#0d2e2a] data-[state=active]:text-white">
                    <BarChart3 className="h-4 w-4" />
                    {isArabic ? "📊 التحليلات" : "📊 Analytics"}
                  </TabsTrigger>
                </TabsList>

                {/* باقي الـ Tabs كما هي */}
                {/* ... */}
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}