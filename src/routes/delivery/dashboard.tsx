// src/routes/delivery/dashboard.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import {
  useDeliveryOrders,
  useDistributors,
  useDeliveryCompanies,
  useMyDeliveryCompany,
  useUpdateDeliveryCompany,
  useUpdateDistributor,
  useUserRoles,
  useGovernorates
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import {
  Truck, Package, Users, Clock, CheckCircle, XCircle,
  TrendingUp, DollarSign, MapPin, Phone, Mail,
  Calendar, ArrowRight, ChevronLeft, Plus,
  Search, Filter, MoreVertical, Eye, Edit, Trash2,
  AlertCircle, RefreshCw, UserCheck, UserX,
  BarChart3, PieChart, Activity, Star,
  Settings, UserCircle, Building2, Save, X,
  LogOut, Bell, Languages, Shield, ShieldCheck, ShieldAlert,
  UserPlus, UserCog, UserMinus, MessageCircle, BellOff, Sparkles, Gift, Store, Globe, ShoppingBag,
  Megaphone, Rocket, Gem, Crown, Flame, Compass, Target, Zap, Award, BadgeCheck,
  KeyRound, Lock, Unlock, EyeOff, CheckSquare, MapPinHouse,
  LayoutDashboard, Users as UsersIcon, TrendingUp as TrendingUpIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog as NotificationDialog,
  DialogContent as NotificationDialogContent,
  DialogHeader as NotificationDialogHeader,
  DialogTitle as NotificationDialogTitle,
  DialogTrigger as NotificationDialogTrigger,
} from "@/components/ui/dialog";
import {
  useUserNotifications,
  useMarkNotificationReadV2,
  useMarkAllNotificationsReadV2
} from "@/lib/queries";
import { NOTIFICATION_CONFIG, NOTIFICATION_TYPES, NotificationType } from "@/types/notificationTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useConversations,
  useDeleteConversation,
  useUnreadCount,
  useGetOrCreateConversation,
} from "@/lib/hooks/useConversation";
import { DeliveryAdminsManager } from "@/components/dashboard/delivery/DeliveryAdminsManager";
import { DeliveryAccountMenu } from "@/components/dashboard/delivery/DeliveryAccountMenu";
import { ImageInput } from "@/components/ImageInput";

const ICON_MAP: Record<string, any> = {
  'clock': Clock,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'store': Store,
  'package': Package,
  'sparkles': Sparkles,
  'megaphone': Megaphone,
  'gift': Gift,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'globe': Globe,
  'settings': Settings,
  'shopping-bag': ShoppingBag,
  'shield': Shield,
  'bell': Bell,
  'rocket': Rocket,
  'gem': Gem,
  'crown': Crown,
  'flame': Flame,
  'compass': Compass,
  'target': Target,
  'zap': Zap,
  'award': Award,
  'badge-check': BadgeCheck,
};

const getNotificationConfig = (type: string) => {
  return NOTIFICATION_CONFIG[type as NotificationType] || NOTIFICATION_CONFIG[NOTIFICATION_TYPES.SYSTEM];
};

export const Route = createFileRoute("/delivery/dashboard")({
  component: DeliveryDashboardPage,
  head: () => ({
    meta: [
      { title: "لوحة تحكم شركة التوصيل - Souqi" },
      { name: "description", content: "إدارة طلبات التوصيل والموزعين" },
    ],
  }),
});

function DeliveryDashboardPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"orders" | "distributors" | "analytics" | "admins">("orders");
  const [filterType, setFilterType] = useState<"all" | "orders" | "distributors">("all");
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [showDistributorDialog, setShowDistributorDialog] = useState(false);
  const [showAddDistributorDialog, setShowAddDistributorDialog] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showDistributorPassword, setShowDistributorPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [existingUserData, setExistingUserData] = useState<any>(null);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  // ✅ جلب البيانات
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useDeliveryOrders(app.user?.id);
  const { data: distributors = [], isLoading: distributorsLoading, refetch: refetchDistributors } = useDistributors({});
  const { data: company, refetch: refetchCompany } = useMyDeliveryCompany(app.user?.id);
  const { data: governorates = [] } = useGovernorates();
  const { data: allCompanies } = useDeliveryCompanies({ active: true });
  const { data: userRoles = [], refetch: refetchUserRoles } = useUserRoles(app.user?.id);
  const { data: conversations = [] } = useConversations();
  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: notifications = [], refetch: refetchNotifications } = useUserNotifications(app.user?.id, { limit: 50 });

  // ✅ Mutations
  const getOrCreateConversation = useGetOrCreateConversation();
  const updateCompanyMutation = useUpdateDeliveryCompany();
  const updateDistributorMutation = useUpdateDistributor();
  const markRead = useMarkNotificationReadV2();
  const markAllRead = useMarkAllNotificationsReadV2();

  const unreadNotificationsCount = notifications.filter((n: any) => !n.is_read).length;
  const isArabic = app.lang === "ar";

  // ✅ ✅ ✅ المشكلة الأولى: تأكد من أن isDeliveryCompany صحيح ✅ ✅ ✅
// ✅ تأكد من استخدام useMemo بشكل صحيح
const isDeliveryCompany = useMemo(() => {
  if (!Array.isArray(userRoles)) return false;
  return userRoles.includes('delivery_company') || userRoles.includes('delivery_company_admin');
}, [userRoles]);

  console.log("🔍 [DELIVERY DASHBOARD] isDeliveryCompany:", isDeliveryCompany);
  console.log("🔍 [DELIVERY DASHBOARD] userRoles:", userRoles);
  console.log("🔍 [DELIVERY DASHBOARD] company:", company);

  // ✅ إحصائيات الطلبات
  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o: any) => o.status === "pending").length;
    const assigned = orders.filter((o: any) => o.status === "assigned").length;
    const inTransit = orders.filter((o: any) => o.status === "in_transit").length;
    const delivered = orders.filter((o: any) => o.status === "delivered").length;
    const cancelled = orders.filter((o: any) => o.status === "cancelled").length;

    const totalRevenue = orders
      .filter((o: any) => o.status === "delivered")
      .reduce((sum: number, o: any) => sum + Number(o.delivery_fee || 0), 0);

    const avgDeliveryTime = orders
      .filter((o: any) => o.delivered_at && o.created_at)
      .reduce((sum: number, o: any) => {
        const diff = new Date(o.delivered_at).getTime() - new Date(o.created_at).getTime();
        return sum + (diff / (1000 * 60));
      }, 0) / (orders.filter((o: any) => o.delivered_at && o.created_at).length || 1);

    return {
      total,
      pending,
      assigned,
      inTransit,
      delivered,
      cancelled,
      totalRevenue,
      avgDeliveryTime: Math.round(avgDeliveryTime) || 0,
      completionRate: total > 0 ? Math.round((delivered / total) * 100) : 0,
    };
  }, [orders]);

  // ✅ فلترة الطلبات
  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") {
      result = result.filter((o: any) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((o: any) => {
        return o.tracking_number?.toLowerCase().includes(q) ||
          o.delivery_name?.toLowerCase().includes(q) ||
          o.pickup_name?.toLowerCase().includes(q) ||
          o.delivery_address?.toLowerCase().includes(q);
      });
    }
    return result;
  }, [orders, statusFilter, searchQuery]);

  // ✅ الموزع الحالي
  const currentDistributor = useMemo(() => {
    if (!app.user?.id) return null;
    return distributors.find((d: any) => d.user_id === app.user.id);
  }, [distributors, app.user?.id]);

  // ✅ دوال الإشعارات
  const handleNotificationClick = useCallback(async (notification: any) => {
    if (!notification.is_read) {
      try {
        await markRead.mutateAsync({
          notificationId: notification.id,
          userId: app.user!.id
        });
        await refetchNotifications();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }
    if (notification.link_url) {
      window.location.href = notification.link_url;
      setNotificationsOpen(false);
    }
  }, [markRead, app.user, refetchNotifications]);

  const handleMarkAsRead = useCallback(async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markRead.mutateAsync({
        notificationId: notificationId,
        userId: app.user!.id
      });
      await refetchNotifications();
      toast.success(isArabic ? "تم تحديد الإشعار كمقروء" : "Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(isArabic ? "حدث خطأ" : "An error occurred");
    }
  }, [markRead, app.user, isArabic, refetchNotifications]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllRead.mutateAsync({
        userId: app.user!.id
      });
      await refetchNotifications();
      toast.success(isArabic ? "تم تحديد الكل كمقروء" : "All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error(isArabic ? "حدث خطأ" : "An error occurred");
    }
  }, [markAllRead, app.user, isArabic, refetchNotifications]);

  // ✅ دوال التنقل
  const handleLogout = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(isArabic ? "✅ تم تسجيل الخروج بنجاح" : "✅ Logged out successfully");
      navigate({ to: "/" });
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تسجيل الخروج" : "❌ Logout failed");
      console.error(error);
    }
  }, [navigate, isArabic]);

  const handleMessages = useCallback(() => {
    navigate({ to: "/delivery/messages" });
  }, [navigate]);

  const toggleLanguage = useCallback(() => {
    const newLang = isArabic ? "en" : "ar";
    app.setLang(newLang);
    toast.success(isArabic ? "✅ تم التبديل إلى الإنجليزية" : "✅ Switched to Arabic");
  }, [app, isArabic]);

  const handleNotifications = useCallback(() => {
    setNotificationsOpen(true);
  }, []);

  // ✅ فتح المحادثة
  const openConversation = useCallback(async (otherUserId: string) => {
    if (!app.user) return;
    if (otherUserId === app.user.id) {
      toast.info(isArabic ? "💬 لا يمكنك مراسلة نفسك" : "💬 You can't message yourself");
      return;
    }
    setIsCreating(true);
    try {
      const conversation = await getOrCreateConversation.mutateAsync({
        userId: app.user.id,
        otherUserId,
      });
      navigate({
        to: "/delivery/conversation/$userId",
        params: { userId: otherUserId },
        search: { cid: conversation.id },
      });
    } catch (error) {
      console.error("❌ Error opening conversation:", error);
      toast.error(isArabic ? "فشل فتح المحادثة" : "Failed to open conversation");
    } finally {
      setIsCreating(false);
    }
  }, [app.user, getOrCreateConversation, navigate, isArabic]);

  // ✅ تحديث الشركة
  const handleUpdateCompany = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
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

    try {
      await updateCompanyMutation.mutateAsync({
        id: company.id,
        patch
      });
      toast.success(isArabic ? "✅ تم تحديث معلومات الشركة" : "✅ Company updated successfully");
      setShowCompanyDialog(false);
      await refetchCompany();
    } catch (error) {
      toast.error(isArabic ? "❌ فشل التحديث" : "❌ Update failed");
      console.error(error);
    }
  }, [company, updateCompanyMutation, isArabic, refetchCompany]);

  // ✅ تحديث الموزع
  const handleUpdateDistributor = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const patch: any = {
      full_name_ar: formData.get("full_name_ar") as string,
      full_name_en: formData.get("full_name_en") as string,
      phone: formData.get("phone") as string,
      address_ar: formData.get("address_ar") as string,
      address_en: formData.get("address_en") as string,
      is_available: formData.get("is_available") === "on",
    };

    try {
      await updateDistributorMutation.mutateAsync({
        id: currentDistributor.id,
        patch
      });
      toast.success(isArabic ? "✅ تم تحديث معلومات الموزع" : "✅ Distributor updated successfully");
      setShowDistributorDialog(false);
      await refetchDistributors();
    } catch (error) {
      toast.error(isArabic ? "❌ فشل التحديث" : "❌ Update failed");
      console.error(error);
    }
  }, [currentDistributor, updateDistributorMutation, isArabic, refetchDistributors]);

  // ✅ دالة إنشاء موزع جديد
  const createNewDistributor = async (data: any) => {
    const { full_name_ar, full_name_en, phone, password, address_ar, address_en, governorate_id, is_available, distributor_type, avatar_url } = data;

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
            phone,
            password,
            full_name_ar,
            full_name_en,
            address_ar,
            address_en,
            governorate_id,
            company_id: company?.id || null,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to create distributor');
      }

      toast.success(
        isArabic
          ? `✅ تم إضافة الموزع بنجاح!\n📱 الرقم: ${phone}\n🔑 كلمة المرور: ${password}\n👤 الاسم: ${full_name_ar || full_name_en}`
          : `✅ Distributor added successfully!\n📱 Phone: ${phone}\n🔑 Password: ${password}\n👤 Name: ${full_name_en || full_name_ar}`
      );

      setShowConvertDialog(false);
      setExistingUserData(null);
      setPendingFormData(null);
      setShowAddDistributorDialog(false);
      await refetchDistributors();

    } catch (error: any) {
      console.error("❌ Error creating distributor:", error);
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    }
  };

  // ✅ دالة تحويل المستخدم إلى موزع
  const convertUserToDistributor = async () => {
    if (!existingUserData || !pendingFormData) return;

    const userId = existingUserData.id;
    const { full_name_ar, full_name_en, phone, address_ar, address_en, governorate_id, is_available, distributor_type, avatar_url } = pendingFormData;

    try {
      // تحديث الاسم
      if (full_name_ar && full_name_ar !== existingUserData.full_name) {
        await supabase
          .from("profiles")
          .update({ full_name: full_name_ar })
          .eq("id", userId);
      }

      // إضافة دور الموزع
      await supabase.from("user_roles").insert({
        user_id: userId,
        role: "distributor"
      });

      // إضافة الموزع - باستخدام RPC
      const { data: distributorId, error: distributorError } = await supabase.rpc('add_distributor', {
        p_user_id: userId,
        p_full_name_ar: full_name_ar || existingUserData.full_name || `موزع ${phone}`,
        p_full_name_en: full_name_en || `Distributor ${phone}`,
        p_phone: phone,
        p_email: `${phone}@distributor.sy`,
        p_address_ar: address_ar || null,
        p_address_en: address_en || null,
        p_governorate_id: governorate_id || null,
        p_is_available: is_available,
        p_distributor_type: distributor_type || 'freelance',
        p_avatar_url: avatar_url || existingUserData.avatar_url || null,
        p_delivery_company_id: company?.id || null,
      });

      if (distributorError) {
        console.error("❌ RPC error:", distributorError);
        throw distributorError;
      }

      toast.success(
        isArabic
          ? `✅ تم تحويل "${existingUserData.full_name}" إلى موزع بنجاح!`
          : `✅ Successfully converted "${existingUserData.full_name}" to distributor!`
      );

      setShowConvertDialog(false);
      setExistingUserData(null);
      setPendingFormData(null);
      await refetchDistributors();
      await refetchUserRoles();

    } catch (error) {
      console.error("Error converting user:", error);
      toast.error(isArabic ? "❌ فشل تحويل المستخدم" : "❌ Failed to convert user");
    }
  };

  // ✅ إضافة موزع
  const handleAddDistributor = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const full_name_ar = formData.get("full_name_ar") as string;
    const full_name_en = formData.get("full_name_en") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const address_ar = formData.get("address_ar") as string;
    const address_en = formData.get("address_en") as string;
    const governorate_id = formData.get("governorate_id") as string;
    const is_available = formData.get("is_available") === "available";
    const distributor_type = formData.get("distributor_type") as string || "freelance";

    if (!full_name_ar.trim()) {
      toast.error(isArabic ? "الاسم (عربي) مطلوب" : "Name (Arabic) is required");
      return;
    }

    if (!phone.trim() || phone.length < 9) {
      toast.error(isArabic ? "رقم هاتف صحيح مطلوب" : "Valid phone number is required");
      return;
    }

    try {
      // التحقق من وجود المستخدم
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, full_name, phone, avatar_url")
        .eq("phone", phone)
        .maybeSingle();

      if (existingProfile) {
        // التحقق إذا كان بالفعل موزع
        const { data: existingDistributor } = await supabase
          .from("distributors")
          .select("id")
          .eq("user_id", existingProfile.id)
          .maybeSingle();

        if (existingDistributor) {
          toast.error(
            isArabic
              ? `❌ المستخدم "${existingProfile.full_name}" بالفعل موزع`
              : `❌ User "${existingProfile.full_name}" is already a distributor`
          );
          return;
        }

        // فتح Dialog
        setExistingUserData(existingProfile);
        setPendingFormData({
          full_name_ar,
          full_name_en,
          phone,
          password,
          address_ar,
          address_en,
          governorate_id,
          is_available,
          distributor_type,
          avatar_url: avatarUrl
        });
        setShowConvertDialog(true);
        return;
      }

      // المستخدم غير موجود، ننشئ حساب جديد
      if (!password || password.length < 6) {
        toast.error(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
        return;
      }

      await createNewDistributor({
        full_name_ar,
        full_name_en,
        phone,
        password,
        address_ar,
        address_en,
        governorate_id,
        is_available,
        distributor_type,
        avatar_url: avatarUrl,
      });

    } catch (error: any) {
      console.error("Error adding distributor:", error);
      toast.error(isArabic ? "❌ حدث خطأ: " + (error.message || "") : "❌ Error: " + (error.message || ""));
    }
  }, [company, isArabic, avatarUrl, createNewDistributor]);

  // ✅ جلب أدمن النظام
  const [systemAdmin, setSystemAdmin] = useState<any>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    const fetchSystemAdmin = async () => {
      setLoadingAdmin(true);
      try {
        const { data: adminRoles } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin")
          .limit(1);

        if (!adminRoles || adminRoles.length === 0) {
          setLoadingAdmin(false);
          return;
        }

        const { data: adminProfile } = await supabase
          .from("profiles")
          .select("id, full_name, phone, avatar_url")
          .eq("id", adminRoles[0].user_id)
          .maybeSingle();

        setSystemAdmin(adminProfile);
      } catch (error) {
        console.error("Error fetching system admin:", error);
      } finally {
        setLoadingAdmin(false);
      }
    };
    fetchSystemAdmin();
  }, []);

  // ✅ بدء محادثة مع أدمن النظام
  const startAdminChat = useCallback(async () => {
    if (!systemAdmin) {
      toast.error(isArabic ? "❌ لا يوجد أدمن للنظام" : "❌ No system admin found");
      return;
    }
    if (systemAdmin.id === app.user?.id) {
      toast.info(isArabic ? "💬 أنت الأدمن، لا يمكنك مراسلة نفسك" : "💬 You are the admin, you can't message yourself");
      return;
    }
    await openConversation(systemAdmin.id);
  }, [systemAdmin, app.user, openConversation, isArabic]);

  // ✅ الشركات التابعة
  const companyDistributors = useMemo(() => {
    return distributors.filter(
      (d: any) => d.delivery_company_id === company?.id && d.user_id !== app.user?.id
    );
  }, [distributors, company, app.user]);

  // ✅ عرض التحميل
  if (app.authLoading || ordersLoading || distributorsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0d2e2a]/20 border-t-[#0d2e2a]" />
      </div>
    );
  }

  if (!app.user) return null;

  // ============================================================
  // التصميم
  // ============================================================
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#0d2e2a]/10">

        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-[#0d2e2a]/80 via-[#1a4f4a]/80 to-[#2a655f]/80 backdrop-blur-md text-white overflow-hidden shadow-lg shadow-[#0d2e2a]/10 border-b border-white/10">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-8">
            <div className="absolute top-1/2 -translate-y-1/2 animate-drive-across">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10 shadow-lg">
                <Truck className="h-12 w-12 text-white animate-bounce-truck" />
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-white/30 animate-spin-slow" style={{ animationDuration: '1s' }} />
                  <div className="h-2 w-2 rounded-full bg-white/30 animate-spin-slow" style={{ animationDuration: '1s', animationDelay: '0.3s' }} />
                  <div className="h-2 w-2 rounded-full bg-white/30 animate-spin-slow" style={{ animationDuration: '1s', animationDelay: '0.6s' }} />
                  <div className="h-2 w-2 rounded-full bg-white/30 animate-spin-slow" style={{ animationDuration: '1s', animationDelay: '0.9s' }} />
                </div>
                <span className="text-xs font-bold text-white/40 tracking-widest">● ● ●</span>
                <div className="flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-white/15 animate-pulse" />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/15 animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <div className="h-1.5 w-1.5 rounded-full bg-white/15 animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-4 md:py-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#0d2e2a] via-[#1a4f4a] to-[#2a655f] flex items-center justify-center shadow-xl shadow-[#0d2e2a]/30 group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 animate-shimmer" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#0d2e2a]/0 via-white/10 to-[#0d2e2a]/0 rounded-2xl animate-pulse" />
                  <Truck className="h-5.5 w-5.5 text-white drop-shadow-lg animate-float-truck relative z-10" />
                  <div className="absolute -bottom-0.5 left-1.5 flex gap-1.5 z-10">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-spin-slow" style={{ animationDuration: '1.5s' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-spin-slow" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />
                  </div>
                  <div className="absolute -bottom-0.5 right-1.5 flex gap-1.5 z-10">
                    <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-spin-slow" style={{ animationDuration: '1.5s', animationDelay: '1s' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-spin-slow" style={{ animationDuration: '1.5s', animationDelay: '1.5s' }} />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text">
                    {company?.name_ar || company?.name_en || (isArabic ? "شركة التوصيل" : "Delivery Company")}
                  </h1>
                  <p className="text-[10px] text-white/70 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 animate-spin-slow text-yellow-300" />
                    <span className="flex items-center gap-1">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      {isArabic ? "نشط • جاهز للاستلام" : "Active • Ready to receive"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {/* ✅ NOTIFICATIONS - مشكلة رقم 1: استخدم Dialog العادي مع Badge أحمر */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      {/* ✅ استخدم Dialog العادي بدلاً من NotificationDialog */}
                      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative"
                          >
                            <Bell className="h-4 w-4" />
                            {unreadNotificationsCount > 0 && (
                              <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse border-2 border-[#1a4f4a]">
                                {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                              </span>
                            )}
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900">
                          {/* محتوى الإشعارات مثل الموجود */}
                          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#0d2e2a]/10 to-[#0d2e2a]/5 dark:from-[#0d2e2a]/30 dark:to-[#0d2e2a]/20 backdrop-blur-xl border-b border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="h-10 w-10 rounded-xl bg-[#0d2e2a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/25">
                                    <Bell className="h-5 w-5 text-white" />
                                  </div>
                                  {unreadNotificationsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                                      {unreadNotificationsCount}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                    {isArabic ? "الإشعارات" : "Notifications"}
                                  </DialogTitle>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {unreadNotificationsCount > 0
                                      ? isArabic
                                        ? `${unreadNotificationsCount} إشعار غير مقروء`
                                        : `${unreadNotificationsCount} unread`
                                      : isArabic
                                        ? "كل الإشعارات مقروءة"
                                        : "All caught up"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {unreadNotificationsCount > 0 && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs gap-1.5 rounded-xl hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 text-[#0d2e2a] dark:text-[#3a8a82] hover:text-[#0d2e2a]/80 dark:hover:text-[#3a8a82]/80 transition-all"
                                    onClick={handleMarkAllAsRead}
                                    disabled={markAllRead.isPending}
                                  >
                                    {markAllRead.isPending ? (
                                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent" />
                                    ) : (
                                      <CheckSquare className="h-3.5 w-3.5" />
                                    )}
                                    {isArabic ? "تحديد الكل كمقروء" : "Mark all read"}
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-all"
                                  onClick={() => setNotificationsOpen(false)}
                                >
                                  <X className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1.5">
                            {notifications.length === 0 ? (
                              <div className="py-16 text-center">
                                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                  <BellOff className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                                </div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                  {isArabic ? "لا توجد إشعارات" : "No notifications"}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                  {isArabic
                                    ? "ستظهر الإشعارات هنا عند استلامها"
                                    : "Notifications will appear here"}
                                </p>
                              </div>
                            ) : (
                              notifications.map((notification: any) => {
                                const isUnread = !notification.is_read;
                                const config = getNotificationConfig(notification.type);
                                const Icon = ICON_MAP[config.icon] || Bell;

                                return (
                                  <div
                                    key={notification.id}
                                    className={`group relative rounded-xl transition-all duration-300 ${isUnread
                                        ? "bg-gradient-to-r from-[#0d2e2a]/10 to-[#0d2e2a]/5 dark:from-[#0d2e2a]/30 dark:to-[#0d2e2a]/20 border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 hover:shadow-md"
                                        : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                                      }`}
                                  >
                                    <div
                                      className="flex items-start gap-3 p-3 cursor-pointer"
                                      onClick={() => handleNotificationClick(notification)}
                                    >
                                      <div className="flex-shrink-0">
                                        {notification.image_url ? (
                                          <div className="relative">
                                            <img
                                              src={notification.image_url}
                                              alt=""
                                              className="h-11 w-11 rounded-xl object-cover border-2 border-slate-200/50 dark:border-slate-700/50"
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                              }}
                                            />
                                            {isUnread && (
                                              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#0d2e2a] ring-2 ring-white dark:ring-slate-900" />
                                            )}
                                          </div>
                                        ) : (
                                          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${config.color} border`}>
                                            <Icon className="h-5 w-5" />
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${isUnread ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                                              {notification.title_ar || notification.title_en || "إشعار"}
                                            </p>
                                            <p className={`text-xs mt-0.5 line-clamp-2 ${isUnread ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-500"}`}>
                                              {notification.body_ar || notification.body_en || notification.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5">
                                              <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(notification.created_at)}
                                              </span>
                                              {notification.type && (
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${config.color} border`}>
                                                  {isArabic ? config.ar : config.en}
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <div className="flex-shrink-0 flex items-center gap-1">
                                            {isUnread && (
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 rounded-lg hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 text-[#0d2e2a] hover:text-[#0d2e2a]/80 transition-all opacity-0 group-hover:opacity-100"
                                                onClick={(e) => handleMarkAsRead(notification.id, e)}
                                              >
                                                <CheckCircle className="h-3.5 w-3.5" />
                                              </Button>
                                            )}
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                  <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[160px]">
                                                {isUnread && (
                                                  <DropdownMenuItem
                                                    className="rounded-lg text-sm cursor-pointer gap-2"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleMarkAsRead(notification.id, e);
                                                    }}
                                                  >
                                                    <CheckCircle className="h-4 w-4" />
                                                    {isArabic ? "تحديد كمقروء" : "Mark as read"}
                                                  </DropdownMenuItem>
                                                )}
                                                {notification.link_url && (
                                                  <DropdownMenuItem
                                                    className="rounded-lg text-sm cursor-pointer gap-2"
                                                    onClick={() => {
                                                      navigate({ to: notification.link_url as any });
                                                      setNotificationsOpen(false);
                                                    }}
                                                  >
                                                    <Bell className="h-4 w-4" />
                                                    {isArabic ? "عرض التفاصيل" : "View details"}
                                                  </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem
                                                  className="rounded-lg text-sm cursor-pointer gap-2 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/30"
                                                  onClick={async (e) => {
                                                    e.stopPropagation();
                                                    try {
                                                      await supabase
                                                        .from('notifications')
                                                        .delete()
                                                        .eq('id', notification.id);
                                                      await refetchNotifications();
                                                      toast.success(isArabic ? "تم حذف الإشعار" : "Notification deleted");
                                                    } catch (error) {
                                                      console.error('Error deleting notification:', error);
                                                      toast.error(isArabic ? "حدث خطأ أثناء الحذف" : "Error deleting notification");
                                                    }
                                                  }}
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                  {isArabic ? "حذف" : "Delete"}
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {notifications.length > 0 && (
                            <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 p-3 flex items-center justify-between">
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {notifications.length} {isArabic ? "إشعار" : "notifications"}
                                {unreadNotificationsCount > 0 && ` · ${unreadNotificationsCount} ${isArabic ? "غير مقروء" : "unread"}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                                onClick={() => setNotificationsOpen(false)}
                              >
                                {isArabic ? "إغلاق" : "Close"}
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                    <p>{isArabic ? "الإشعارات" : "Notifications"}</p>
                  </TooltipContent>
                </Tooltip>

                {/* ✅ MESSAGES - مع العدد الأحمر */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative"
                      onClick={handleMessages}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse border-2 border-[#1a4f4a]">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                    <p>{isArabic ? "الرسائل" : "Messages"}</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                      onClick={toggleLanguage}
                    >
                      <Languages className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                    <p>{isArabic ? "تبديل اللغة" : "Switch Language"}</p>
                  </TooltipContent>
                </Tooltip>

                <div className="w-px h-6 bg-white/10 mx-0.5" />

                <DeliveryAccountMenu
                  userData={{
                    id: app.user?.id || '',
                    full_name: company?.name_ar || app.user?.name || (isArabic ? 'مدير شركة' : 'Company Manager'),
                    phone: company?.phone || app.user?.phone || '',
                    avatar_url: company?.logo_url || '',
                    role: 'delivery_company'
                  }}
                  companyName={company?.name_ar}
                  isArabic={isArabic}
                />

                <div className="w-px h-6 bg-white/10 mx-0.5" />

                {currentDistributor && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog open={showDistributorDialog} onOpenChange={setShowDistributorDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
                          >
                            <UserCircle className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto">
                          {/* محتوى تعديل الموزع */}
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                              <UserCircle className="h-6 w-6 text-[#0d2e2a]" />
                              {isArabic ? "تعديل معلومات الموزع" : "Edit Distributor Info"}
                            </DialogTitle>
                            <DialogDescription>
                              {isArabic ? "تحديث بياناتك الشخصية كموزع" : "Update your personal information as a distributor"}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleUpdateDistributor} className="space-y-4">
                            {/* ... النموذج كما هو ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "الاسم (عربي)" : "Name (Arabic)"} *
                                </Label>
                                <Input
                                  name="full_name_ar"
                                  defaultValue={currentDistributor.full_name_ar || ''}
                                  placeholder={isArabic ? "الاسم بالعربية" : "Name in Arabic"}
                                  required
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "الاسم (إنجليزي)" : "Name (English)"}
                                </Label>
                                <Input
                                  name="full_name_en"
                                  defaultValue={currentDistributor.full_name_en || ''}
                                  placeholder={isArabic ? "الاسم بالإنجليزية" : "Name in English"}
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                {isArabic ? "رقم الهاتف" : "Phone Number"} *
                              </Label>
                              <Input
                                name="phone"
                                defaultValue={currentDistributor.phone || ''}
                                type="tel"
                                placeholder="09XXXXXXXX"
                                required
                                className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "العنوان (عربي)" : "Address (Arabic)"}
                                </Label>
                                <Input
                                  name="address_ar"
                                  defaultValue={currentDistributor.address_ar || ''}
                                  placeholder={isArabic ? "العنوان بالعربية" : "Address in Arabic"}
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "العنوان (إنجليزي)" : "Address (English)"}
                                </Label>
                                <Input
                                  name="address_en"
                                  defaultValue={currentDistributor.address_en || ''}
                                  placeholder={isArabic ? "العنوان بالإنجليزية" : "Address in English"}
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
                              <input
                                type="checkbox"
                                name="is_available"
                                defaultChecked={currentDistributor.is_available}
                                className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                              />
                              <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white cursor-pointer">
                                {isArabic ? "🟢 متاح للعمل" : "🟢 Available for work"}
                              </Label>
                            </div>

                            <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
                              <Button type="button" variant="outline" onClick={() => setShowDistributorDialog(false)}>
                                <X className="h-4 w-4 mr-1" />
                                {isArabic ? "إلغاء" : "Cancel"}
                              </Button>
                              <Button
                                type="submit"
                                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                {isArabic ? "حفظ التغييرات" : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                      <p>{isArabic ? "حسابي" : "My Account"}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* ✅ ✅ ✅ زر تعديل الشركة - المشكلة رقم 2: تحقق من الشرط */}
                {company && isDeliveryCompany && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative"
                          >
                            <Building2 className="h-4 w-4" />
                            {/* ✅ إضافة مؤشر صغير للدلالة على وجود زر */}
                            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#1a4f4a] animate-pulse" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                              <Building2 className="h-6 w-6 text-[#0d2e2a]" />
                              {isArabic ? "تعديل معلومات الشركة" : "Edit Company Info"}
                            </DialogTitle>
                            <DialogDescription>
                              {isArabic ? "تحديث بيانات شركة التوصيل" : "Update delivery company information"}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleUpdateCompany} className="space-y-4">
                            {/* ... النموذج كامل كما هو ... */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)"} *
                                </Label>
                                <Input
                                  name="name_ar"
                                  defaultValue={company.name_ar || ''}
                                  placeholder={isArabic ? "اسم الشركة بالعربية" : "Company name in Arabic"}
                                  required
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "اسم الشركة (إنجليزي)" : "Company Name (English)"} *
                                </Label>
                                <Input
                                  name="name_en"
                                  defaultValue={company.name_en || ''}
                                  placeholder={isArabic ? "اسم الشركة بالإنجليزية" : "Company name in English"}
                                  required
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "رقم الهاتف" : "Phone Number"}
                                </Label>
                                <Input
                                  name="phone"
                                  defaultValue={company.phone || ''}
                                  type="tel"
                                  placeholder="09XXXXXXXX"
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "العنوان (عربي)" : "Address (Arabic)"}
                                </Label>
                                <Input
                                  name="address_ar"
                                  defaultValue={company.address_ar || ''}
                                  placeholder={isArabic ? "العنوان بالعربية" : "Address in Arabic"}
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "العنوان (إنجليزي)" : "Address (English)"}
                                </Label>
                                <Input
                                  name="address_en"
                                  defaultValue={company.address_en || ''}
                                  placeholder={isArabic ? "العنوان بالإنجليزية" : "Address in English"}
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "الوصف (عربي)" : "Description (Arabic)"}
                                </Label>
                                <Textarea
                                  name="description_ar"
                                  defaultValue={company.description_ar || ''}
                                  placeholder={isArabic ? "وصف الشركة بالعربية" : "Company description in Arabic"}
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 min-h-[80px]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "الوصف (إنجليزي)" : "Description (English)"}
                                </Label>
                                <Textarea
                                  name="description_en"
                                  defaultValue={company.description_en || ''}
                                  placeholder={isArabic ? "وصف الشركة بالإنجليزية" : "Company description in English"}
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 min-h-[80px]"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="flex items-center gap-2 p-3 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
                                <input
                                  type="checkbox"
                                  name="has_tracking"
                                  defaultChecked={company.has_tracking}
                                  className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                                <Label className="text-xs font-medium cursor-pointer">
                                  {isArabic ? "تتبع" : "Tracking"}
                                </Label>
                              </div>
                              <div className="flex items-center gap-2 p-3 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
                                <input
                                  type="checkbox"
                                  name="has_insurance"
                                  defaultChecked={company.has_insurance}
                                  className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                                <Label className="text-xs font-medium cursor-pointer">
                                  {isArabic ? "تأمين" : "Insurance"}
                                </Label>
                              </div>
                              <div className="flex items-center gap-2 p-3 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
                                <input
                                  type="checkbox"
                                  name="has_cod"
                                  defaultChecked={company.has_cod}
                                  className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                                <Label className="text-xs font-medium cursor-pointer">
                                  {isArabic ? "دفع عند الاستلام" : "Cash on Delivery"}
                                </Label>
                              </div>
                              <div className="flex items-center gap-2 p-3 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
                                <input
                                  type="checkbox"
                                  name="has_express"
                                  defaultChecked={company.has_express}
                                  className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                                />
                                <Label className="text-xs font-medium cursor-pointer">
                                  {isArabic ? "توصيل سريع" : "Express"}
                                </Label>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "السعر الأساسي" : "Base Price"}
                                </Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">
                                    {app.currency}
                                  </span>
                                  <Input
                                    name="base_price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={company.base_price || 0}
                                    placeholder={isArabic ? "سعر ثابت يضاف لكل طلب" : "Fixed price added to every order"}
                                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 text-sm h-9 ps-7"
                                  />
                                </div>
                                <p className="text-[9px] text-muted-foreground">
                                  {isArabic ? "يضاف لكل طلب بغض النظر عن المسافة" : "Added to every order regardless of distance"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "سعر الكيلومتر" : "Price per KM"}
                                </Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">
                                    {app.currency}
                                  </span>
                                  <Input
                                    name="price_per_km"
                                    type="number"
                                    step="0.01"
                                    defaultValue={company.price_per_km || 0}
                                    placeholder={isArabic ? "سعر كل كيلومتر إضافي" : "Price per additional kilometer"}
                                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 text-sm h-9 ps-7"
                                  />
                                </div>
                                <p className="text-[9px] text-muted-foreground">
                                  {isArabic ? "يضرب بالمسافة بين المتجر والعميل" : "Multiplied by distance between store and customer"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "الحد الأدنى" : "Min Fee"}
                                </Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">
                                    {app.currency}
                                  </span>
                                  <Input
                                    name="min_delivery_fee"
                                    type="number"
                                    step="0.01"
                                    defaultValue={company.min_delivery_fee || 0}
                                    placeholder={isArabic ? "أقل سعر للتوصيل" : "Minimum delivery price"}
                                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 text-sm h-9 ps-7"
                                  />
                                </div>
                                <p className="text-[9px] text-muted-foreground">
                                  {isArabic ? "السعر لا يقل عن هذا الرقم" : "Price will not go below this amount"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "الحد الأقصى" : "Max Fee"}
                                </Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">
                                    {app.currency}
                                  </span>
                                  <Input
                                    name="max_delivery_fee"
                                    type="number"
                                    step="0.01"
                                    defaultValue={company.max_delivery_fee || 999999}
                                    placeholder={isArabic ? "أعلى سعر للتوصيل" : "Maximum delivery price"}
                                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 text-sm h-9 ps-7"
                                  />
                                </div>
                                <p className="text-[9px] text-muted-foreground">
                                  {isArabic ? "السعر لا يزيد عن هذا الرقم" : "Price will not exceed this amount"}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "قيمة التوصيل المجاني" : "Free Delivery Threshold"}
                                </Label>
                                <div className="relative">
                                  <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">
                                    {app.currency}
                                  </span>
                                  <Input
                                    name="free_delivery_threshold"
                                    type="number"
                                    step="0.01"
                                    defaultValue={company.free_delivery_threshold || 0}
                                    placeholder={isArabic ? "الطلب يصبح مجاني عند هذا المبلغ" : "Order becomes free at this amount"}
                                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 text-sm h-9 ps-7"
                                  />
                                </div>
                                <p className="text-[9px] text-muted-foreground">
                                  {isArabic ? "إذا تجاوز الطلب هذا المبلغ يصبح التوصيل مجاني" : "If order exceeds this amount, delivery is free"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-[#0d2e2a] dark:text-white">
                                  {isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time"}
                                </Label>
                                <Input
                                  name="avg_delivery_time"
                                  type="number"
                                  defaultValue={company.avg_delivery_time || 60}
                                  placeholder={isArabic ? "بالدقائق" : "In minutes"}
                                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 text-sm h-9"
                                />
                                <p className="text-[9px] text-muted-foreground">
                                  {isArabic ? "متوسط وقت التوصيل بالدقائق" : "Average delivery time in minutes"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
                              <input
                                type="checkbox"
                                name="is_active"
                                defaultChecked={company.is_active}
                                className="h-4 w-4 rounded border-[#0d2e2a]/30 text-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                              />
                              <Label className="text-sm font-medium text-[#0d2e2a] dark:text-white cursor-pointer">
                                {isArabic ? "🟢 الشركة نشطة" : "🟢 Company is active"}
                              </Label>
                            </div>

                            <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
                              <Button type="button" variant="outline" onClick={() => setShowCompanyDialog(false)}>
                                <X className="h-4 w-4 mr-1" />
                                {isArabic ? "إلغاء" : "Cancel"}
                              </Button>
                              <Button
                                type="submit"
                                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300"
                              >
                                <Save className="h-4 w-4 mr-1" />
                                {isArabic ? "حفظ التغييرات" : "Save Changes"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                      <p>{isArabic ? "تعديل الشركة" : "Edit Company"}</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <div className="w-px h-6 bg-white/10 mx-0.5" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      className="h-9 px-4 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#2a655f] text-white transition-all duration-300 hover:scale-105 font-medium text-xs shadow-lg shadow-[#2a655f]/30"
                      onClick={() => navigate({ to: "/delivery/orders/new" })}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      {isArabic ? "طلب جديد" : "New Order"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                    <p>{isArabic ? "إنشاء طلب توصيل جديد" : "Create New Delivery Order"}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            <ModernStatCard
              icon={Package}
              label={isArabic ? "الطلبات" : "Orders"}
              value={stats.total}
              gradient="from-[#0d2e2a] to-[#1a4f4a]"
              isArabic={isArabic}
            />
            <ModernStatCard
              icon={Clock}
              label={isArabic ? "قيد المراجعة" : "Pending"}
              value={stats.pending}
              gradient="from-amber-600 to-orange-500"
              isArabic={isArabic}
            />
            <ModernStatCard
              icon={UserCheck}
              label={isArabic ? "تم التعيين" : "Assigned"}
              value={stats.assigned}
              gradient="from-purple-600 to-violet-500"
              isArabic={isArabic}
            />
            <ModernStatCard
              icon={Truck}
              label={isArabic ? "قيد التوصيل" : "In Transit"}
              value={stats.inTransit}
              gradient="from-blue-600 to-cyan-500"
              isArabic={isArabic}
            />
            <ModernStatCard
              icon={CheckCircle}
              label={isArabic ? "تم التوصيل" : "Delivered"}
              value={stats.delivered}
              gradient="from-emerald-600 to-teal-500"
              isArabic={isArabic}
            />
            <ModernStatCard
              icon={DollarSign}
              label={isArabic ? "الإيرادات" : "Revenue"}
              value={stats.totalRevenue.toLocaleString()}
              gradient="from-rose-600 to-pink-500"
              isArabic={isArabic}
            />
            <ModernStatCard
              icon={TrendingUp}
              label={isArabic ? "نسبة الإنجاز" : "Completion"}
              value={`${stats.completionRate}%`}
              gradient="from-indigo-600 to-blue-500"
              isArabic={isArabic}
            />
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center gap-2 border-b border-[#0d2e2a]/10 mb-6 overflow-x-auto">
            {[
              { id: "orders", label: isArabic ? "📦 الطلبات" : "📦 Orders", icon: Package },
              { id: "distributors", label: isArabic ? "👤 الموزعين" : "👤 Distributors", icon: Users },
              { id: "analytics", label: isArabic ? "📊 التحليلات" : "📊 Analytics", icon: BarChart3 },
              { id: "admins", label: isArabic ? "👑 المدراء" : "👑 Managers", icon: Shield },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                    ? "border-[#0d2e2a] text-[#0d2e2a] dark:text-[#4a9f95]"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-[#0d2e2a]/30"
                  }`}
              >
                <tab.icon className="h-4 w-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="animate-in slide-in-from-top-5 duration-300">
              {/* ... محتوى الطلبات كما هو ... */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative flex-1 min-w-[200px] max-w-sm group">
                  <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#0d2e2a] transition-colors duration-300" />
                  <Input
                    placeholder={isArabic ? "🔍 بحث عن طلب..." : "🔍 Search orders..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-9 h-10 rounded-xl border-slate-200/50 dark:border-slate-800/50 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 transition-all duration-300"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300"
                  >
                    <option value="all">{isArabic ? "جميع الحالات" : "All status"}</option>
                    <option value="pending">{isArabic ? "قيد المراجعة" : "Pending"}</option>
                    <option value="assigned">{isArabic ? "تم التعيين" : "Assigned"}</option>
                    <option value="in_transit">{isArabic ? "قيد التوصيل" : "In transit"}</option>
                    <option value="delivered">{isArabic ? "تم التوصيل" : "Delivered"}</option>
                    <option value="cancelled">{isArabic ? "ملغي" : "Cancelled"}</option>
                  </select>
                </div>
              </div>

              {ordersLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 rounded-2xl" />
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border border-dashed border-[#0d2e2a]/30">
                  <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                    <Package className="h-10 w-10 text-[#0d2e2a]/40" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {isArabic ? "لا توجد طلبات" : "No orders"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {isArabic ? "لم يتم استلام أي طلبات توصيل بعد" : "No delivery orders received yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order: any) => (
                    <OrderCard key={order.id} order={order} isArabic={isArabic} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* DISTRIBUTORS TAB */}
          {activeTab === "distributors" && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#0d2e2a]" />
                    {isArabic ? "الموزعين" : "Distributors"}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({distributors.length})
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? "إدارة الموزعين وحالتهم" : "Manage distributors and their status"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={showAddDistributorDialog} onOpenChange={setShowAddDistributorDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300 hover:scale-105">
                        <UserPlus className="h-4 w-4 mr-1" />
                        {isArabic ? "إضافة موزع" : "Add Distributor"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                          <UserPlus className="h-6 w-6 text-[#0d2e2a]" />
                          {isArabic ? "➕ إضافة موزع جديد" : "➕ Add New Distributor"}
                        </DialogTitle>
                        <DialogDescription>
                          {isArabic
                            ? "سيتم إنشاء حساب للموزع مع رقم هاتف وكلمة مرور"
                            : "A new distributor account will be created with phone and password"}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddDistributor} className="space-y-4 py-4">
                        <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                          <ImageInput
                            value={avatarUrl || ""}
                            onChange={(value) => setAvatarUrl(value)}
                            userId={app.user?.id}
                            folder="distributors"
                            lang={app.lang}
                            label={isArabic ? "صورة الموزع" : "Distributor Photo"}
                            previewClassName="h-24 w-24 rounded-full object-cover"
                            hint={isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo"}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label>{isArabic ? "الاسم (عربي) *" : "Name (Arabic) *"}</Label>
                            <Input
                              name="full_name_ar"
                              placeholder={isArabic ? "أحمد محمد" : "Ahmed"}
                              dir="rtl"
                              required
                              className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>{isArabic ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
                            <Input
                              name="full_name_en"
                              placeholder="Ahmed Mohamad"
                              className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label>{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
                          <Input
                            name="phone"
                            placeholder="0962XXXXXX"
                            dir="ltr"
                            required
                            className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            {isArabic ? "سيستخدم هذا الرقم لتسجيل الدخول" : "This number will be used for login"}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <Label>{isArabic ? "كلمة المرور *" : "Password *"}</Label>
                          <div className="relative">
                            <Input
                              name="password"
                              type={showDistributorPassword ? "text" : "password"}
                              placeholder="********"
                              required
                              minLength={6}
                              className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 pe-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowDistributorPassword(!showDistributorPassword)}
                              className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showDistributorPassword ? <EyeOff className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <Label>{isArabic ? "المحافظة" : "Governorate"}</Label>
                          <Select
                            onValueChange={(value) => {
                              const form = document.querySelector('form');
                              if (form) {
                                const existingInput = form.querySelector('input[name="governorate_id"]');
                                if (existingInput) existingInput.remove();
                                const input = document.createElement('input');
                                input.type = 'hidden';
                                input.name = 'governorate_id';
                                input.value = value;
                                form.appendChild(input);
                              }
                            }}
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

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label>{isArabic ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
                            <Input
                              name="address_ar"
                              placeholder={isArabic ? "دمشق" : "Damascus"}
                              dir="rtl"
                              className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label>{isArabic ? "العنوان (إنجليزي)" : "Address (English)"}</Label>
                            <Input
                              name="address_en"
                              placeholder="Damascus"
                              className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label>{isArabic ? "نوع الموزع" : "Distributor Type"}</Label>
                            <Select
                              defaultValue="freelance"
                              onValueChange={(value) => {
                                const form = document.querySelector('form');
                                if (form) {
                                  const existingInput = form.querySelector('input[name="distributor_type"]');
                                  if (existingInput) existingInput.remove();
                                  const input = document.createElement('input');
                                  input.type = 'hidden';
                                  input.name = 'distributor_type';
                                  input.value = value;
                                  form.appendChild(input);
                                }
                              }}
                            >
                              <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="freelance">{isArabic ? "🆓 مستقل" : "🆓 Freelance"}</SelectItem>
                                <SelectItem value="company_employee">{isArabic ? "🏢 موظف شركة" : "🏢 Company Employee"}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label>{isArabic ? "متاح للعمل" : "Available"}</Label>
                            <Select
                              defaultValue="available"
                              onValueChange={(value) => {
                                const form = document.querySelector('form');
                                if (form) {
                                  const existingInput = form.querySelector('input[name="is_available"]');
                                  if (existingInput) existingInput.remove();
                                  const input = document.createElement('input');
                                  input.type = 'hidden';
                                  input.name = 'is_available';
                                  input.value = value;
                                  form.appendChild(input);
                                }
                              }}
                            >
                              <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="available">✅ {isArabic ? "متاح" : "Available"}</SelectItem>
                                <SelectItem value="unavailable">❌ {isArabic ? "غير متاح" : "Unavailable"}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {company && (
                          <div className="text-xs text-muted-foreground bg-[#0d2e2a]/10 p-3 rounded-xl border border-[#0d2e2a]/20">
                            {isArabic
                              ? `🔗 سيتم ربط الموزع بشركة "${company.name_ar}"`
                              : `🔗 Distributor will be linked to company "${company.name_en}"`
                            }
                          </div>
                        )}

                        <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
                          <Button type="button" variant="outline" onClick={() => setShowAddDistributorDialog(false)}>
                            <X className="h-4 w-4 mr-1" />
                            {isArabic ? "إلغاء" : "Cancel"}
                          </Button>
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300"
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            {isArabic ? "إضافة الموزع" : "Add Distributor"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Link to="/delivery/distributors" className="inline-block">
                    <Button variant="outline" className="border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300">
                      <Users className="h-4 w-4 mr-1" />
                      {isArabic ? "إدارة الموزعين" : "Manage Distributors"}
                    </Button>
                  </Link>
                </div>
              </div>

              {distributorsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-40 rounded-2xl" />
                  ))}
                </div>
              ) : distributors.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border border-dashed border-[#0d2e2a]/30">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-xl font-semibold">
                    {isArabic ? "لا يوجد موزعين" : "No distributors"}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {isArabic ? "قم بإضافة موزعين لشركتك" : "Add distributors to your company"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {distributors.map((dist: any) => (
                    <DistributorCard key={dist.id} distributor={dist} isArabic={isArabic} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === "analytics" && (
            <div className="animate-in slide-in-from-top-5 duration-300">
              {/* ... محتوى التحليلات كما هو ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-[#0d2e2a]/20 hover:border-[#0d2e2a]/40 transition-all duration-300 shadow-xl shadow-[#0d2e2a]/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                      {isArabic ? "📈 الإيرادات" : "📈 Revenue"}
                    </CardTitle>
                    <CardDescription>
                      {isArabic ? "إجمالي إيرادات التوصيل" : "Total delivery revenue"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-emerald-500 animate-in slide-in-from-left-5 duration-500">
                      {stats.totalRevenue.toLocaleString()} {app.currency}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {isArabic ? `من ${stats.delivered} طلب تم توصيله` : `from ${stats.delivered} delivered orders`}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#0d2e2a]/20 hover:border-[#0d2e2a]/40 transition-all duration-300 shadow-xl shadow-[#0d2e2a]/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
                      <BarChart3 className="h-5 w-5 text-[#0d2e2a]" />
                      {isArabic ? "📊 توزيع الطلبات" : "📊 Orders Distribution"}
                    </CardTitle>
                    <CardDescription>
                      {isArabic ? "حالة الطلبات الحالية" : "Current order status"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { label: isArabic ? "قيد المراجعة" : "Pending", value: stats.pending, color: "bg-yellow-500" },
                        { label: isArabic ? "تم التعيين" : "Assigned", value: stats.assigned, color: "bg-purple-500" },
                        { label: isArabic ? "قيد التوصيل" : "In Transit", value: stats.inTransit, color: "bg-orange-500" },
                        { label: isArabic ? "تم التوصيل" : "Delivered", value: stats.delivered, color: "bg-green-500" },
                        { label: isArabic ? "ملغي" : "Cancelled", value: stats.cancelled, color: "bg-red-500" },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-2">
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={cn("h-full rounded-full", item.color)}
                              style={{
                                width: stats.total > 0 ? `${(item.value / stats.total) * 100}%` : '0%'
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[80px]">{item.label}</span>
                          <span className="text-sm text-muted-foreground min-w-[40px] text-end">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2 border-2 border-[#0d2e2a]/20 hover:border-[#0d2e2a]/40 transition-all duration-300 shadow-xl shadow-[#0d2e2a]/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
                      <Activity className="h-5 w-5 text-[#0d2e2a]" />
                      {isArabic ? "⚡ مقاييس الأداء" : "⚡ Performance Metrics"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-all group hover:scale-105">
                        <Activity className="h-6 w-6 text-[#0d2e2a] mx-auto mb-2 group-hover:rotate-12 transition-transform" />
                        <p className="text-2xl font-bold">{stats.completionRate}%</p>
                        <p className="text-xs text-muted-foreground">{isArabic ? "نسبة الإنجاز" : "Completion Rate"}</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-all group hover:scale-105">
                        <Clock className="h-6 w-6 text-[#0d2e2a] mx-auto mb-2 group-hover:rotate-12 transition-transform" />
                        <p className="text-2xl font-bold">{stats.avgDeliveryTime} {isArabic ? "د" : "min"}</p>
                        <p className="text-xs text-muted-foreground">{isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time"}</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-all group hover:scale-105">
                        <Package className="h-6 w-6 text-[#0d2e2a] mx-auto mb-2 group-hover:rotate-12 transition-transform" />
                        <p className="text-2xl font-bold">{stats.delivered}</p>
                        <p className="text-xs text-muted-foreground">{isArabic ? "تم التوصيل" : "Delivered"}</p>
                      </div>
                      <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:shadow-md transition-all group hover:scale-105">
                        <DollarSign className="h-6 w-6 text-[#0d2e2a] mx-auto mb-2 group-hover:rotate-12 transition-transform" />
                        <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{isArabic ? "إجمالي الإيرادات" : "Total Revenue"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* ADMINS TAB */}
          {activeTab === "admins" && company && (
            <div className="animate-in slide-in-from-top-5 duration-300">
              <DeliveryAdminsManager
                companyId={company.id}
                companyName={company.name_ar}
                isArabic={isArabic}
              />
            </div>
          )}
        </div>

        {/* ===== Dialog تحويل المستخدم إلى موزع ===== */}
        <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
          <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0">
            <div className="bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <UserPlus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {isArabic ? "🔄 تحويل المستخدم إلى موزع" : "🔄 Convert User to Distributor"}
                  </DialogTitle>
                  <p className="text-white/80 text-sm mt-0.5">
                    {isArabic
                      ? "هذا الرقم مرتبط بحساب موجود"
                      : "This number is linked to an existing account"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/10">
                <div className="h-14 w-14 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center overflow-hidden">
                  {existingUserData?.avatar_url ? (
                    <img src={existingUserData.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[#0d2e2a]">
                      {existingUserData?.full_name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#0d2e2a] dark:text-white">
                    {existingUserData?.full_name || (isArabic ? "مستخدم" : "User")}
                  </p>
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    📱 {existingUserData?.phone}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? "🆔 مستخدم مسجل في النظام" : "🆔 Registered user"}
                  </p>
                </div>
                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                  {isArabic ? "عميل" : "Customer"}
                </Badge>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {isArabic ? "⚠️ تحويل الدور" : "⚠️ Role Change"}
                  </p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                    {isArabic
                      ? `سيتم إضافة صلاحية "موزع" للمستخدم "${existingUserData?.full_name}"`
                      : `The "distributor" role will be added to "${existingUserData?.full_name}"`}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/10">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {isArabic ? "📋 بيانات الموزع الجديدة" : "📋 New Distributor Data"}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isArabic ? "الاسم" : "Name"}</span>
                    <span className="font-medium">{pendingFormData?.full_name_ar || pendingFormData?.full_name_en || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{isArabic ? "الهاتف" : "Phone"}</span>
                    <span className="font-medium" dir="ltr">{pendingFormData?.phone}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {isArabic
                  ? "📌 سيتم إضافة الموزع إلى شركتك الحالية"
                  : "📌 The distributor will be added to your current company"}
              </p>
            </div>

            <DialogFooter className="p-4 border-t border-[#0d2e2a]/10 bg-slate-50/50 dark:bg-slate-900/50 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConvertDialog(false);
                  setExistingUserData(null);
                  setPendingFormData(null);
                  toast.info(
                    isArabic
                      ? "📱 يمكنك استخدام رقم آخر لإضافة موزع جديد"
                      : "📱 You can use another number to add a new distributor"
                  );
                }}
                className="flex-1"
              >
                <X className="h-4 w-4 mr-1.5" />
                {isArabic ? "استخدام رقم آخر" : "Use Another Number"}
              </Button>
              <Button
                onClick={convertUserToDistributor}
                className="flex-1 bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] text-white hover:from-[#2a655f] hover:to-[#0d2e2a]"
              >
                <UserPlus className="h-4 w-4 mr-1.5" />
                {isArabic ? "تحويل إلى موزع" : "Convert to Distributor"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 4s linear infinite;
          }
          
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-2deg); }
            75% { transform: translateY(-4px) rotate(2deg); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          
          @keyframes drive-across {
            0% { transform: translateX(-20%); }
            100% { transform: translateX(120%); }
          }
          .animate-drive-across {
            animation: drive-across 14s linear infinite;
          }
          
          @keyframes bounce-truck {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-4px) rotate(-1deg); }
            75% { transform: translateY(-4px) rotate(1deg); }
          }
          .animate-bounce-truck {
            animation: bounce-truck 2.5s ease-in-out infinite;
          }
          
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }
          
          @keyframes float-truck {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-3px) rotate(-2deg); }
            75% { transform: translateY(-3px) rotate(2deg); }
          }
          .animate-float-truck {
            animation: float-truck 3s ease-in-out infinite;
          }
          
          @keyframes slide-in-from-top-5 {
            0% { transform: translateY(-5px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          .animate-in.slide-in-from-top-5 {
            animation: slide-in-from-top-5 0.3s ease-out;
          }
          
          @keyframes slide-in-from-left-5 {
            0% { transform: translateX(-5px); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-in.slide-in-from-left-5 {
            animation: slide-in-from-left-5 0.5s ease-out;
          }

          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(13, 46, 42, 0.1); }
            50% { box-shadow: 0 0 40px rgba(13, 46, 42, 0.2); }
          }
          .animate-pulse-glow {
            animation: pulse-glow 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </TooltipProvider>
  );
}

// ============================================================
// 📦 ModernStatCard
// ============================================================
function ModernStatCard({
  icon: Icon,
  label,
  value,
  gradient,
  isArabic
}: {
  icon: any;
  label: string;
  value: string | number;
  gradient: string;
  isArabic: boolean;
}) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl p-4 shadow-md transition-all duration-500 hover:shadow-xl hover:scale-[1.03]",
      "bg-gradient-to-br",
      gradient
    )}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full blur-2xl" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-white/80">{label}</p>
          <p className="text-2xl font-bold mt-1 text-white group-hover:scale-105 transition-transform duration-300">
            {value}
          </p>
        </div>
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300",
          "bg-white/20 backdrop-blur group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-lg"
        )}>
          <Icon className={cn("h-5 w-5 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6")} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 OrderCard
// ============================================================
function OrderCard({ order, isArabic }: { order: any; isArabic: boolean }) {
  const app = useApp();

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    assigned: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    picked_up: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    in_transit: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    failed: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const statusLabels: Record<string, string> = {
    pending: isArabic ? "قيد المراجعة" : "Pending",
    assigned: isArabic ? "تم التعيين" : "Assigned",
    picked_up: isArabic ? "تم الاستلام" : "Picked up",
    in_transit: isArabic ? "قيد التوصيل" : "In Transit",
    delivered: isArabic ? "تم التوصيل" : "Delivered",
    cancelled: isArabic ? "ملغي" : "Cancelled",
    failed: isArabic ? "فشل" : "Failed",
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-[#0d2e2a]/30 transition-all duration-300 hover:scale-[1.01] group">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-[#0d2e2a]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Package className="h-5 w-5 text-[#0d2e2a] dark:text-[#4a9f95]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-slate-900 dark:text-white">
                #{order.tracking_number || order.id.substring(0, 8)}
              </p>
              <Badge className={cn("border", statusColors[order.status] || "bg-slate-500/10 text-slate-500")}>
                {statusLabels[order.status] || order.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {order.delivery_address?.substring(0, 30) || (isArabic ? "عنوان غير محدد" : "No address")}
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(order.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                {order.delivery_fee} {app.currency}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-xl hover:bg-[#0d2e2a]/10 transition-all duration-300 group-hover:scale-110"
            onClick={() => window.location.href = `/delivery/orders/${order.id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl hover:bg-[#0d2e2a]/10 transition-all duration-300">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[160px]">
              <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 hover:bg-[#0d2e2a]/10">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {isArabic ? "تحديث الحالة" : "Update Status"}
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 hover:bg-[#0d2e2a]/10">
                <UserCheck className="h-4 w-4 text-blue-500" />
                {isArabic ? "تعيين موزع" : "Assign Distributor"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 text-red-500 hover:bg-red-50/50">
                <Trash2 className="h-4 w-4" />
                {isArabic ? "حذف" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 DistributorCard
// ============================================================
function DistributorCard({ distributor, isArabic }: { distributor: any; isArabic: boolean }) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-[#0d2e2a]/30 transition-all duration-300 hover:scale-[1.02] group">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300">
          {distributor.avatar_url ? (
            <img src={distributor.avatar_url} alt="" className="h-full w-full object-cover rounded-full" />
          ) : (
            <Users className="h-6 w-6 text-[#0d2e2a]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#0d2e2a] transition-colors duration-300 line-clamp-1">
              {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
            </p>
            {distributor.is_available ? (
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[9px] animate-pulse">
                ● {isArabic ? "متاح" : "Available"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[9px]">
                ● {isArabic ? "غير متاح" : "Unavailable"}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-1">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {Number(distributor.rating || 0).toFixed(1)}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {distributor.completed_orders || 0} {isArabic ? "طلب" : "orders"}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {distributor.phone}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl hover:bg-[#0d2e2a]/10 transition-all duration-300 group-hover:scale-110">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ✅ دالة formatTime المفقودة
function formatTime(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  const isArabic = document.documentElement.dir === 'rtl';

  if (isArabic) {
    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return then.toLocaleDateString("ar-SA", { day: "numeric", month: "short" });
  } else {
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  }
}