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
  useGovernorates,
  useAcceptDeliveryOrder,
  useRejectDeliveryOrder,
  useNearestDistributors,
  useUpdateDeliveryOrderStatus,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import {
  Truck, Package, Users, Clock, CheckCircle, XCircle,
  TrendingUp, DollarSign, MapPin, Phone, Mail,
  Calendar, ArrowRight, ChevronLeft, ChevronRight, Plus,
  Search, Filter, MoreVertical, Eye, Edit, Trash2,
  AlertCircle, RefreshCw, UserCheck, UserX,
  BarChart3, PieChart, Activity, Star,
  Settings, UserCircle, Building2, Save, X,
  LogOut, Bell, Languages, Shield, ShieldCheck, ShieldAlert,
  UserPlus, UserCog, UserMinus, MessageCircle, BellOff, Sparkles, Gift, Store, Globe, ShoppingBag,
  Megaphone, Rocket, Gem, Crown, Flame, Compass, Target, Zap, Award, BadgeCheck,
  KeyRound, Lock, Unlock, EyeOff, CheckSquare, MapPinHouse,
  LayoutDashboard, Users as UsersIcon, TrendingUp as TrendingUpIcon,
  Edit3, Map, Info, FileText, Check, Power, PowerOff,
  Download, FileSpreadsheet, Printer, FileDown, Table2, ClipboardCopy,
  Loader2
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
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
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
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";

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
  
  // ===== STATES =====
  const [addressMethod, setAddressMethod] = useState<"manual" | "map">("manual");
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [activeTab, setActiveTab] = useState<"orders" | "distributors" | "analytics" | "admins">("orders");
  const [filterType, setFilterType] = useState<"all" | "orders" | "distributors">("all");
  const [showCompanyDialog, setShowCompanyDialog] = useState(false);
  const [showDistributorDialog, setShowDistributorDialog] = useState(false);
  const [showAddDistributorDialog, setShowAddDistributorDialog] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showDistributorPassword, setShowDistributorPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // ✅ State لتعطيل الموزع
  const [showDeactivateDistributorDialog, setShowDeactivateDistributorDialog] = useState(false);
  const [deactivatingDistributor, setDeactivatingDistributor] = useState<any>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);

  // ✅ State لقبول ورفض الطلبات
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedDeliveryOrderId, setSelectedDeliveryOrderId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedDistributorId, setSelectedDistributorId] = useState<string>("");
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [distributorSearch, setDistributorSearch] = useState("");
  const [estimatedDeliveryHours, setEstimatedDeliveryHours] = useState<number>(2);
  const [estimatedPickupHours, setEstimatedPickupHours] = useState<number>(0.5);
  const hasRedirected = useRef(false);

  // ✅ State للـ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ✅ تعريف isArabic هنا
  const isArabic = app.lang === "ar";

  // ============================================================
  // ✅✅✅ جلب البيانات - الترتيب الصحيح ✅✅✅
  // ============================================================

  // 1️⃣ جلب الشركة أولاً (لأن الموزعين يعتمدون عليها)
  const { data: company, isLoading: companyLoading, refetch: refetchCompany } = useMyDeliveryCompany(app.user?.id);

  // 2️⃣ جلب الموزعين (يعتمد على company.id)
  const { 
    data: allDistributors = [], 
    isLoading: distributorsLoading,
    refetch: refetchDistributors 
  } = useDistributors({
    companyId: company?.id,
    isAvailable: true,
    active: true,
  });

  // 3️⃣ باقي البيانات (لا تعتمد على company)
  const { data: orders = [], isLoading: ordersLoading, refetch: refetchOrders } = useDeliveryOrders(app.user?.id);
  const { data: governorates = [] } = useGovernorates();
  const { data: allCompanies } = useDeliveryCompanies({ active: true });
  const { data: userRoles = [], refetch: refetchUserRoles } = useUserRoles(app.user?.id);
  const { data: conversations = [] } = useConversations();
  const { data: unreadCount = 0 } = useUnreadCount();
  
  // ✅✅✅ مهم: تعريف notifications و refetchNotifications قبل useEffect للإشعارات
  const { data: notifications = [], refetch: refetchNotifications } = useUserNotifications(app.user?.id, { limit: 50 });

  // ✅ Mutations
  const getOrCreateConversation = useGetOrCreateConversation();
  const updateCompanyMutation = useUpdateDeliveryCompany();
  const updateDistributorMutation = useUpdateDistributor();
  const markRead = useMarkNotificationReadV2();
  const markAllRead = useMarkAllNotificationsReadV2();

  // ✅ Mutations جديدة للقبول والرفض
  const acceptOrderMutation = useAcceptDeliveryOrder();
  const rejectOrderMutation = useRejectDeliveryOrder();

  const unreadNotificationsCount = notifications.filter((n: any) => !n.is_read).length;

  // ============================================================
  // ✅ Realtime للإشعارات - بعد تعريف refetchNotifications
  // ============================================================
  const notificationChannelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!app.user) {
      console.log('⏳ [Delivery] No user, skipping notification setup');
      return;
    }

    if (isSubscribedRef.current) {
      console.log('📡 [Delivery] Already subscribed to notifications');
      return;
    }

    console.log('📡 [Delivery] Setting up REAL-TIME notifications for user:', app.user.id);

    const channel = supabase
      .channel(`delivery-notifications-${app.user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${app.user.id}`,
        },
        (payload) => {
          const notification = payload.new as any;
          
          console.log('📬 [Delivery] 🔔 NEW NOTIFICATION RECEIVED:', notification);
          console.log('📬 [Delivery] Title:', notification.title_ar || notification.title_en);
          console.log('📬 [Delivery] Body:', notification.body_ar || notification.body_en);
          
          // ✅ 1️⃣ تحديث قائمة الإشعارات
          refetchNotifications();
          
          // ✅ 2️⃣ عرض Toast في منتصف الشاشة
          toast.success(
            isArabic 
              ? `🔔 ${notification.title_ar || 'إشعار جديد'}`
              : `🔔 ${notification.title_en || 'New notification'}`,
            {
              duration: 15000,
              position: 'top-center',
              icon: '🔔',
              description: isArabic 
                ? (notification.body_ar || '')
                : (notification.body_en || ''),
              action: {
                label: isArabic ? '📋 عرض' : '📋 View',
                onClick: () => {
                  if (notification.link_url) {
                    navigate({ to: notification.link_url });
                  }
                }
              }
            }
          );

          // ✅ 3️⃣ تشغيل الصوت
          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.7;
            audio.play().catch(() => console.log('🔇 Audio play failed'));
          } catch (e) {
            console.log('🔇 Audio error:', e);
          }

          // ✅ 4️⃣ إظهار إشعار المتصفح
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              const browserNotification = new Notification(
                isArabic ? notification.title_ar || 'إشعار جديد' : notification.title_en || 'New notification',
                {
                  body: isArabic ? notification.body_ar : notification.body_en,
                  icon: '/images/Logo.png',
                  vibrate: [200, 100, 200],
                }
              );
              
              browserNotification.onclick = () => {
                window.focus();
                if (notification.link_url) {
                  navigate({ to: notification.link_url });
                }
              };
              
              setTimeout(() => browserNotification.close(), 30000);
            } catch (e) {
              console.log('🔔 Browser notification error:', e);
            }
          }

          // ✅ 5️⃣ تحديث عدد الإشعارات غير المقروءة
          setUnreadNotificationsCount(prev => prev + 1);
        }
      )
     .subscribe((status) => {
  console.log(`📡 [Delivery] Realtime status: ${status}`);
  if (status === 'SUBSCRIBED') {
    isSubscribedRef.current = true;
    // ✅ تم إزالة toast.success
  }
  if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
    isSubscribedRef.current = false;
  }
});

    notificationChannelRef.current = channel;

    return () => {
      if (notificationChannelRef.current) {
        console.log('🧹 [Delivery] Cleaning up notifications channel');
        supabase.removeChannel(notificationChannelRef.current);
        notificationChannelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [app.user?.id, isArabic, navigate, refetchNotifications]);

  // ============================================================
  // ✅ دوال التصدير والطباعة
  // ============================================================

  // ✅ دالة تصدير إلى Excel (CSV)
  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error(isArabic ? "❌ لا توجد بيانات للتصدير" : "❌ No data to export");
      return;
    }

    try {
      const headers = Object.keys(data[0]).filter(key => 
        !['id', 'created_at', 'updated_at', 'deleted_at'].includes(key)
      );
      
      let csv = headers.join(',') + '\n';
      
      data.forEach((row: any) => {
        const values = headers.map(header => {
          let value = row[header] || '';
          if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
          }
          if (typeof value === 'string' && value.includes('\n')) {
            value = value.replace(/\n/g, ' ');
          }
          return value;
        });
        csv += values.join(',') + '\n';
      });

      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.success(
        isArabic 
          ? `✅ تم تصدير ${data.length} سجل بنجاح` 
          : `✅ Exported ${data.length} records successfully`
      );
    } catch (error) {
      console.error("❌ Export error:", error);
      toast.error(isArabic ? "❌ فشل التصدير" : "❌ Export failed");
    }
  };

  // ✅ دالة تصدير إلى Word (HTML)
  const exportToWord = (data: any[], title: string) => {
    if (!data || data.length === 0) {
      toast.error(isArabic ? "❌ لا توجد بيانات للتصدير" : "❌ No data to export");
      return;
    }

    try {
      let html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>100</w:Zoom>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; direction: ${isArabic ? 'rtl' : 'ltr'}; }
            h1 { color: #0d2e2a; border-bottom: 3px solid #2a655f; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #2a655f; color: white; padding: 12px 10px; text-align: ${isArabic ? 'right' : 'left'}; font-weight: bold; }
            td { padding: 10px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f5f5f5; }
            tr:hover { background-color: #e8f0f0; }
            .footer { margin-top: 30px; color: #666; font-size: 12px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px; }
            .badge { display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; }
            .badge-pending { background: #f59e0b; color: white; }
            .badge-assigned { background: #8b5cf6; color: white; }
            .badge-picked_up { background: #3b82f6; color: white; }
            .badge-in_transit { background: #f97316; color: white; }
            .badge-delivered { background: #22c55e; color: white; }
            .badge-cancelled { background: #ef4444; color: white; }
            .badge-failed { background: #ef4444; color: white; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p><strong>${isArabic ? 'تاريخ التصدير' : 'Export Date'}:</strong> ${new Date().toLocaleString(isArabic ? 'ar-SA' : 'en-US')}</p>
          <p><strong>${isArabic ? 'عدد السجلات' : 'Total Records'}:</strong> ${data.length}</p>
          <table>
            <thead>
              <tr>
      `;

      const headers = Object.keys(data[0]).filter(key => 
        !['id', 'created_at', 'updated_at', 'deleted_at'].includes(key)
      );
      
      headers.forEach(header => {
        const labelMap: Record<string, string> = {
          tracking_number: isArabic ? 'رقم التتبع' : 'Tracking Number',
          status: isArabic ? 'الحالة' : 'Status',
          delivery_fee: isArabic ? 'رسوم التوصيل' : 'Delivery Fee',
          delivery_address: isArabic ? 'عنوان التوصيل' : 'Delivery Address',
          created_at: isArabic ? 'تاريخ الإنشاء' : 'Created At',
          distributor_id: isArabic ? 'الموزع' : 'Distributor',
          delivery_company_id: isArabic ? 'شركة التوصيل' : 'Delivery Company',
          pickup_address: isArabic ? 'عنوان الاستلام' : 'Pickup Address',
          notes_ar: isArabic ? 'ملاحظات' : 'Notes',
          notes_en: 'Notes',
          order_id: isArabic ? 'رقم الطلب' : 'Order ID',
          buyer_name: isArabic ? 'اسم العميل' : 'Customer Name',
          buyer_phone: isArabic ? 'رقم العميل' : 'Customer Phone',
          total: isArabic ? 'المجموع' : 'Total',
          cod_amount: isArabic ? 'مبلغ الدفع' : 'COD Amount',
          delivered_at: isArabic ? 'تاريخ التوصيل' : 'Delivered At',
          picked_up_at: isArabic ? 'تاريخ الاستلام' : 'Picked Up At',
          cancelled_at: isArabic ? 'تاريخ الإلغاء' : 'Cancelled At',
        };
        const label = labelMap[header] || header;
        html += `<th>${label}</th>`;
      });
      
      html += `</tr></thead><tbody>`;

      data.forEach((row: any) => {
        html += `<tr>`;
        headers.forEach(header => {
          let value = row[header] || '-';
          
          if (header === 'status') {
            const statusLabels: Record<string, string> = {
              pending: isArabic ? 'قيد المراجعة' : 'Pending',
              assigned: isArabic ? 'تم التعيين' : 'Assigned',
              picked_up: isArabic ? 'تم الاستلام' : 'Picked up',
              in_transit: isArabic ? 'قيد التوصيل' : 'In Transit',
              delivered: isArabic ? 'تم التوصيل' : 'Delivered',
              cancelled: isArabic ? 'ملغي' : 'Cancelled',
              failed: isArabic ? 'فشل' : 'Failed',
            };
            const label = statusLabels[value] || value;
            const colorClass = `badge-${value}`;
            html += `<td><span class="badge ${colorClass}">${label}</span></td>`;
          } 
          else if (header === 'created_at' || header === 'updated_at' || header === 'delivered_at' || header === 'picked_up_at' || header === 'cancelled_at') {
            html += `<td>${value ? new Date(value).toLocaleString(isArabic ? 'ar-SA' : 'en-US') : '-'}</td>`;
          }
          else if (header === 'delivery_fee' || header === 'total' || header === 'cod_amount') {
            html += `<td>${Number(value).toLocaleString()} SYP</td>`;
          }
          else if (typeof value === 'string' && value.length > 50) {
            html += `<td>${value.substring(0, 50)}...</td>`;
          }
          else {
            html += `<td>${value}</td>`;
          }
        });
        html += `</tr>`;
      });

      html += `
            </tbody>
          </table>
          <div class="footer">
            ${isArabic ? 'تم التصدير من لوحة تحكم شركة التوصيل - السوق لعندك' : 'Exported from Delivery Company Dashboard - Souq Le3ndak'}
            <br>© ${new Date().getFullYear()} ${isArabic ? 'السوق لعندك. جميع الحقوق محفوظة' : 'Souq Le3ndak. All rights reserved.'}
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${title}_${new Date().toISOString().slice(0,10)}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.success(
        isArabic 
          ? `✅ تم تصدير ${data.length} سجل إلى Word بنجاح` 
          : `✅ Exported ${data.length} records to Word successfully`
      );
    } catch (error) {
      console.error("❌ Export to Word error:", error);
      toast.error(isArabic ? "❌ فشل التصدير إلى Word" : "❌ Export to Word failed");
    }
  };

  // ✅ دالة الطباعة
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    console.log("🔍 [useEffect] companyLoading:", companyLoading);
    console.log("🔍 [useEffect] company:", company);
    console.log("🔍 [useEffect] is_verified:", company?.is_verified);
    console.log("🔍 [useEffect] pathname:", window.location.pathname);
    console.log("🔍 [useEffect] hasRedirected:", hasRedirected.current);

    if (companyLoading) {
      console.log("⏳ [useEffect] Loading, waiting...");
      return;
    }

    if (window.location.pathname === "/delivery/complete") {
      console.log("📍 [useEffect] Already on complete page, resetting ref");
      hasRedirected.current = false;
      return;
    }

    if (hasRedirected.current) {
      console.log("🚫 [useEffect] Already redirected once, skipping");
      return;
    }

    if (!company) {
      console.log("ℹ️ [useEffect] No company yet, waiting...");
      return;
    }

    if (company.is_verified === true) {
      console.log("✅ [useEffect] Company is verified!");
      hasRedirected.current = false;
      return;
    }

    if (company && company.is_verified === false) {
      console.log("🚫 [useEffect] Company not verified, redirecting...");
      hasRedirected.current = true;
      navigate({ to: "/delivery/complete" });
      toast.info(
        isArabic 
          ? "📋 يرجى إكمال بيانات شركتك أولاً"
          : "📋 Please complete your company data first"
      );
    }
  }, [company, companyLoading, navigate, isArabic]);
  
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
          o.delivery_address?.toLowerCase().includes(q) ||
          o.id?.toLowerCase().includes(q);
      });
    }
    
    result = [...result].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    return result;
  }, [orders, statusFilter, searchQuery]);

  // ✅ حساب عدد الصفحات للـ Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // ✅ عند تغيير الفلتر أو البحث، نعيد الصفحة إلى 1
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  // ✅ الموزع الحالي
  const currentDistributor = useMemo(() => {
    if (!app.user?.id) return null;
    return allDistributors.find((d: any) => d.user_id === app.user.id);
  }, [allDistributors, app.user?.id]);

  // ✅ قبول الطلب مع وقت متوقع
  const handleAcceptDelivery = useCallback(async () => {
    if (!selectedDeliveryOrderId || !selectedOrderId || !selectedDistributorId) {
      toast.error(isArabic ? "❌ الرجاء اختيار موزع" : "❌ Please select a distributor");
      return;
    }

    if (!estimatedDeliveryHours || estimatedDeliveryHours <= 0) {
      toast.error(isArabic ? "❌ الرجاء إدخال وقت متوقع للوصول" : "❌ Please enter estimated delivery time");
      return;
    }

    setIsProcessing(true);
    try {
      const now = new Date();
      const estimatedDelivery = new Date(now.getTime() + estimatedDeliveryHours * 60 * 60 * 1000);
      const estimatedPickup = new Date(now.getTime() + (estimatedPickupHours || 0.5) * 60 * 60 * 1000);

      await acceptOrderMutation.mutateAsync({
        deliveryOrderId: selectedDeliveryOrderId,
        orderId: selectedOrderId,
        distributorId: selectedDistributorId,
        estimatedDeliveryAt: estimatedDelivery.toISOString(),
        estimatedPickupAt: estimatedPickup.toISOString(),
      });
      
      setAcceptDialogOpen(false);
      setSelectedDeliveryOrderId(null);
      setSelectedOrderId(null);
      setSelectedDistributorId("");
      setEstimatedDeliveryHours(2);
      setEstimatedPickupHours(0.5);
      refetchOrders();
    } catch (error) {
      console.error("❌ Error accepting delivery:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    selectedDeliveryOrderId, 
    selectedOrderId, 
    selectedDistributorId, 
    estimatedDeliveryHours,
    estimatedPickupHours,
    acceptOrderMutation, 
    refetchOrders, 
    isArabic
  ]);

  // ✅ رفض الطلب
  const handleRejectDelivery = useCallback(async () => {
    if (!selectedDeliveryOrderId || !selectedOrderId || !rejectReason.trim()) {
      toast.error(isArabic ? "❌ الرجاء إدخال سبب الرفض" : "❌ Please enter a rejection reason");
      return;
    }

    setIsProcessing(true);
    try {
      await rejectOrderMutation.mutateAsync({
        deliveryOrderId: selectedDeliveryOrderId,
        orderId: selectedOrderId,
        reason: rejectReason.trim(),
      });
      setRejectDialogOpen(false);
      setSelectedDeliveryOrderId(null);
      setSelectedOrderId(null);
      setRejectReason("");
      refetchOrders();
    } catch (error) {
      console.error("❌ Error rejecting delivery:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedDeliveryOrderId, selectedOrderId, rejectReason, rejectOrderMutation, refetchOrders, isArabic]);

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
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error(isArabic ? "❌ فشل تسجيل الخروج" : "❌ Logout failed");
      console.error(error);
    }
  }, [isArabic]);

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

    if (addressMethod === "map" && location) {
      patch.address_ar = location.address;
      patch.address_en = location.address;
      
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          lat: location.lat || 0,
          lng: location.lng || 0,
          address_text: location.address.trim(),
        })
        .eq("id", app.user?.id);
      
      if (updateProfileError) {
        console.error("❌ خطأ في تحديث إحداثيات البروفايل:", updateProfileError);
      }
    } else {
      patch.address_ar = formData.get("address_ar") as string;
      patch.address_en = formData.get("address_ar") as string;
    }

    if (logoUrl) {
      patch.logo_url = logoUrl;
    }

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
  }, [company, updateCompanyMutation, isArabic, refetchCompany, addressMethod, location, logoUrl, app.user?.id]);

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

      setShowAddDistributorDialog(false);
      await refetchDistributors();

    } catch (error: any) {
      console.error("❌ Error creating distributor:", error);
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
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
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", phone)
        .maybeSingle();

      if (profileCheckError) {
        console.error("Error checking profile:", profileCheckError);
        throw new Error("حدث خطأ في التحقق من الرقم");
      }

      if (existingProfile) {
        toast.error(
          isArabic 
            ? "❌ هذا الرقم مستخدم من قبل ولا يمكن إضافته كموزع"
            : "❌ This phone number is already in use and cannot be added as a distributor"
        );
        return;
      }

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

  // ✅ دالة تعطيل الموزع
  const handleDeactivateDistributor = async () => {
    if (!deactivatingDistributor) return;
    
    setIsDeactivating(true);
    
    try {
      const distributorId = deactivatingDistributor.id;
      const distributorName = deactivatingDistributor.full_name_ar || deactivatingDistributor.full_name_en || 'الموزع';
      
      const { data: pendingOrders, error: ordersError } = await supabase
        .from("delivery_orders")
        .select("id, status")
        .eq("distributor_id", distributorId)
        .in("status", ["pending", "assigned", "picked_up", "in_transit"]);
      
      if (ordersError) throw ordersError;
      
      if (pendingOrders && pendingOrders.length > 0) {
        toast.error(
          isArabic 
            ? `❌ لا يمكن تعطيل الموزع لديه ${pendingOrders.length} طلبات معلقة`
            : `❌ Cannot deactivate distributor with ${pendingOrders.length} pending orders`
        );
        setIsDeactivating(false);
        return;
      }
      
      const { error: updateError } = await supabase
        .from("distributors")
        .update({
          is_available: false,
          is_active: false,
          deactivated_at: new Date().toISOString(),
          deactivated_by: app.user?.id,
        })
        .eq("id", distributorId);
      
      if (updateError) throw updateError;
      
      toast.success(
        isArabic 
          ? `✅ تم تعطيل الموزع "${distributorName}" بنجاح`
          : `✅ Distributor "${distributorName}" deactivated successfully`
      );
      
      setShowDeactivateDistributorDialog(false);
      setDeactivatingDistributor(null);
      setIsDeactivating(false);
      
      await refetchDistributors();
      
    } catch (error: any) {
      console.error("❌ Error deactivating distributor:", error);
      toast.error(
        isArabic 
          ? `❌ فشل تعطيل الموزع: ${error.message || 'خطأ غير معروف'}`
          : `❌ Failed to deactivate distributor: ${error.message || 'Unknown error'}`
      );
      setIsDeactivating(false);
    }
  };

  // ✅ فتح ديالوج تعطيل الموزع
  const openDeactivateDistributorDialog = (distributor: any) => {
    setDeactivatingDistributor(distributor);
    setShowDeactivateDistributorDialog(true);
  };

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
    return allDistributors.filter(
      (d: any) => d.delivery_company_id === company?.id && d.user_id !== app.user?.id
    );
  }, [allDistributors, company, app.user]);

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

{/* ============================================================
    HEADER
    ============================================================ */}
<div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden shadow-xl border-b border-white/10 sticky top-0 z-50">
  
  <div className="absolute inset-0 opacity-10">
    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
  </div>

  <div className="relative mx-auto max-w-7xl px-4 py-3 md:py-4">
    <div className="flex items-center justify-between flex-wrap gap-2">
      
<div className="flex items-center gap-3 group flex-1 min-w-0">
  
  <div className="relative h-16 w-16 md:h-20 md:w-20 flex items-center justify-center group-hover:scale-110 transition-all duration-500 flex-shrink-0 animate-float-logo">
    <div className="absolute inset-0 rounded-full bg-[#2a655f]/30 blur-2xl group-hover:bg-[#d4af37]/20 transition-all duration-700 animate-pulse-slow" />
    <div className="absolute -inset-2 rounded-full border-2 border-[#d4af37]/20 animate-spin-slow" />
    <div className="absolute -inset-4 rounded-full border border-[#d4af37]/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '8s' }} />
    <img 
      src="/images/Logo.png" 
      alt="السوق لعندك"
      className="h-14 w-14 md:h-16 md:w-16 object-contain drop-shadow-2xl relative z-10 animate-pulse-glow"
      loading="eager"
    />
    <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#2a655f] animate-ping" />
    <div className="absolute -bottom-1 -left-1 h-2.5 w-2.5 rounded-full bg-[#d4af37] animate-ping" style={{ animationDelay: '0.5s' }} />
    <div className="absolute top-1/2 -right-3 h-2 w-2 rounded-full bg-[#3a8a82] animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 -left-3 h-2 w-2 rounded-full bg-[#f0d060] animate-pulse" style={{ animationDelay: '1.5s' }} />
    <div className="absolute -top-3 left-1/2 h-1.5 w-1.5 rounded-full bg-[#4a9f95] animate-bounce" />
    <div className="absolute -bottom-3 left-1/2 h-1.5 w-1.5 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0.7s' }} />
  </div>
  
  <div className="flex flex-col min-w-0">
    <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
      <span className="bg-gradient-to-r from-[#f5d742] via-[#f0e68c] to-[#f5d742] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,215,66,0.4)] whitespace-nowrap">
        {isArabic ? "السوق لعندك" : "Souq Le3ndak"}
      </span>
    </h1>
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] md:text-xs text-white/60 flex items-center gap-1">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        {isArabic ? "شركة توصيل • نشط" : "Delivery Company • Active"}
      </span>
      <span className="text-[8px] md:text-[10px] text-white/30">|</span>
      <span className="text-[8px] md:text-[10px] text-white/40 flex items-center gap-1">
        <Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3 animate-spin-slow text-yellow-400/60" />
        {isArabic ? "توصيل سريع" : "Fast Delivery"}
      </span>
    </div>
  </div>
</div>

{/* ✅ ✅ ✅ الجزء المُصحح: أزرار الإشعارات والرسائل واللغة */}
<div className="flex items-center gap-1 flex-wrap flex-shrink-0">
  
  {/* ✅ زر الإشعارات - Dialog خارج الـ Tooltip */}
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        size="sm"
        variant="ghost"
        className="h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative"
        onClick={() => setNotificationsOpen(true)}
      >
        <Bell className="h-4 w-4 md:h-5 md:w-5" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse border-2 border-[#1a4f4a]">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
      <p>{isArabic ? "الإشعارات" : "Notifications"}</p>
    </TooltipContent>
  </Tooltip>

  {/* ✅ زر الرسائل */}
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        size="sm"
        variant="ghost"
        className="h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative"
        onClick={handleMessages}
      >
        <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
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

  {/* ✅ زر اللغة */}
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        size="sm"
        variant="ghost"
        className="h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
        onClick={toggleLanguage}
      >
        <Languages className="h-4 w-4 md:h-5 md:w-5" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
      <p>{isArabic ? "تبديل اللغة" : "Switch Language"}</p>
    </TooltipContent>
  </Tooltip>

  <div className="w-px h-6 bg-white/10 mx-0.5" />

  {/* ✅ DeliveryAccountMenu */}
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
    companyId={company?.id}
    onCompanyUpdated={refetchCompany}
  />

  <div className="w-px h-6 bg-white/10 mx-0.5" />

  {/* ✅ زر حساب الموزع */}
  {currentDistributor && (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
          onClick={() => setShowDistributorDialog(true)}
        >
          <UserCircle className="h-4 w-4 md:h-5 md:w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
        <p>{isArabic ? "حساب الموزع" : "Distributor Account"}</p>
      </TooltipContent>
    </Tooltip>
  )}
</div>

    </div>
  </div>
</div>

{/* ✅✅✅ DIALOG: الإشعارات (خارج الـ Tooltip) */}
<Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
  <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 shadow-2xl">
    <DialogHeader>
      <div className="flex items-center justify-between">
        <DialogTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
          <Bell className="h-5 w-5 text-[#2a655f]" />
          {isArabic ? "الإشعارات" : "Notifications"}
          {unreadNotificationsCount > 0 && (
            <Badge className="bg-red-500 text-white border-0 text-[10px]">
              {unreadNotificationsCount}
            </Badge>
          )}
        </DialogTitle>
        {unreadNotificationsCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            className="text-xs text-[#2a655f] hover:bg-[#2a655f]/10 rounded-xl"
          >
            {isArabic ? "تحديد الكل كمقروء" : "Mark all as read"}
          </Button>
        )}
      </div>
    </DialogHeader>
    
    <div className="max-h-[60vh] overflow-y-auto space-y-2">
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BellOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground/30" />
          <p>{isArabic ? "لا توجد إشعارات" : "No notifications"}</p>
        </div>
      ) : (
        notifications.map((notification: any) => {
          const config = getNotificationConfig(notification.type);
          const Icon = config?.icon ? ICON_MAP[config.icon] || Bell : Bell;
          const isRead = notification.is_read;
          
          return (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={cn(
                "p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md",
                isRead 
                  ? "bg-white dark:bg-slate-900 border-slate-200/50 dark:border-slate-700/50" 
                  : "bg-[#2a655f]/5 border-[#2a655f]/30 hover:bg-[#2a655f]/10"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  isRead ? "bg-slate-100 dark:bg-slate-800" : "bg-[#2a655f]/20"
                )}>
                  <Icon className="h-4 w-4 text-[#2a655f]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-semibold",
                    isRead ? "text-slate-700 dark:text-slate-300" : "text-[#0d2e2a] dark:text-white"
                  )}>
                    {isArabic ? notification.title_ar : notification.title_en || notification.title_ar}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {isArabic ? notification.body_ar : notification.body_en || notification.body_ar}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {formatTime(notification.created_at)}
                  </p>
                </div>
                {!isRead && (
                  <div className="h-2 w-2 rounded-full bg-[#2a655f] animate-pulse flex-shrink-0 mt-1" />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
    
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={() => setNotificationsOpen(false)} 
        className="rounded-xl border-[#2a655f]/20 text-[#2a655f] hover:bg-[#2a655f]/10"
      >
        {isArabic ? "إغلاق" : "Close"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* ✅✅✅ DIALOG: حساب الموزع (خارج الـ Tooltip) */}
<Dialog open={showDistributorDialog} onOpenChange={setShowDistributorDialog}>
  <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 shadow-2xl">
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-[#0d2e2a] dark:text-white">
        <UserCircle className="h-5 w-5 text-[#2a655f]" />
        {isArabic ? "حساب الموزع" : "Distributor Account"}
      </DialogTitle>
      <DialogDescription>
        {isArabic ? "معلومات حساب الموزع الحالي" : "Current distributor account information"}
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4 py-4">
      {currentDistributor && (
        <>
          <div className="flex items-center gap-4 p-3 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
            <div className="h-12 w-12 rounded-full bg-[#2a655f]/10 flex items-center justify-center overflow-hidden">
              {currentDistributor.avatar_url ? (
                <img 
                  src={currentDistributor.avatar_url} 
                  alt={currentDistributor.full_name_ar}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-[#2a655f]" />
              )}
            </div>
            <div>
              <p className="font-bold text-[#0d2e2a] dark:text-white">
                {currentDistributor.full_name_ar || currentDistributor.full_name_en}
              </p>
              <p className="text-xs text-muted-foreground" dir="ltr">
                {currentDistributor.phone}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-muted-foreground">{isArabic ? "الحالة" : "Status"}</p>
              <p className="font-semibold text-[#0d2e2a] dark:text-white">
                {currentDistributor.is_available 
                  ? (isArabic ? "🟢 متاح" : "🟢 Available") 
                  : (isArabic ? "🔴 غير متاح" : "🔴 Unavailable")}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <p className="text-xs text-muted-foreground">{isArabic ? "التقييم" : "Rating"}</p>
              <p className="font-semibold text-[#0d2e2a] dark:text-white flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                {currentDistributor.rating || 0}
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl col-span-2">
              <p className="text-xs text-muted-foreground">{isArabic ? "العنوان" : "Address"}</p>
              <p className="font-semibold text-[#0d2e2a] dark:text-white text-sm">
                {currentDistributor.address_ar || currentDistributor.address_en || (isArabic ? "غير محدد" : "Not specified")}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
    
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={() => setShowDistributorDialog(false)} 
        className="rounded-xl border-[#2a655f]/20 text-[#2a655f] hover:bg-[#2a655f]/10"
      >
        {isArabic ? "إغلاق" : "Close"}
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

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
                className={`flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#0d2e2a] text-[#0d2e2a] dark:text-[#4a9f95]"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-[#0d2e2a]/30"
                }`}
              >
                <tab.icon className="h-4 w-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ===== ORDERS TAB ===== */}
          {activeTab === "orders" && (
            <div className="animate-in slide-in-from-top-5 duration-300">
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
                    <option value="picked_up">{isArabic ? "تم الاستلام" : "Picked up"}</option>
                    <option value="in_transit">{isArabic ? "قيد التوصيل" : "In transit"}</option>
                    <option value="delivered">{isArabic ? "تم التوصيل" : "Delivered"}</option>
                    <option value="cancelled">{isArabic ? "ملغي" : "Cancelled"}</option>
                    <option value="failed">{isArabic ? "فشل" : "Failed"}</option>
                  </select>
                </div>

                {/* ✅ أزرار التصدير والطباعة للطلبات */}
                <div className="flex items-center gap-2 ml-auto">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportToCSV(filteredOrders, 'الطلبات')}
                        className="h-9 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-xs mr-1">{isArabic ? "إكسل" : "Excel"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isArabic ? "تصدير إلى Excel" : "Export to Excel"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportToWord(filteredOrders, 'تقرير الطلبات')}
                        className="h-9 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                      >
                        <FileText className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-xs mr-1">{isArabic ? "Word" : "Word"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isArabic ? "تصدير إلى Word" : "Export to Word"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="h-9 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                      >
                        <Printer className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-xs mr-1">{isArabic ? "طباعة" : "Print"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isArabic ? "طباعة التقرير" : "Print Report"}</TooltipContent>
                  </Tooltip>
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
                <>
                  <div className="space-y-3">
                    {paginatedOrders.map((order: any) => (
                      <OrderCard 
                        key={order.id} 
                        order={order} 
                        isArabic={isArabic}
                        onAccept={() => {
                          console.log("📦 Order data:", order);
                          console.log("🆔 order.id:", order.id);
                          console.log("🆔 order.order_id:", order.order_id);
                          console.log("🔍 order_id exists?", !!order.order_id);
                          setSelectedDeliveryOrderId(order.id);
                          setSelectedOrderId(order.order_id);
                          setSelectedDistributorId("");
                          setDistributorSearch("");
                          setAcceptDialogOpen(true);
                        }}
                        onReject={() => {
                          setSelectedDeliveryOrderId(order.id);
                          setSelectedOrderId(order.order_id);
                          setRejectReason("");
                          setRejectDialogOpen(true);
                        }}
                      />
                    ))}
                  </div>

                  {filteredOrders.length > 0 && totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <p className="text-sm text-muted-foreground">
                        {isArabic 
                          ? `عرض ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} من ${filteredOrders.length} طلب`
                          : `Showing ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, filteredOrders.length)} of ${filteredOrders.length} orders`}
                      </p>
                      <div className="flex flex-wrap items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="rounded-xl h-9 w-9 p-0"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                          let pageNum;
                          if (totalPages <= 7) {
                            pageNum = i + 1;
                          } else if (currentPage <= 4) {
                            pageNum = i + 1;
                            if (i === 6) pageNum = totalPages;
                          } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 6 + i;
                          } else {
                            pageNum = currentPage - 3 + i;
                          }
                          
                          if (i === 0 && pageNum > 1) {
                            return (
                              <Button
                                key="first"
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(1)}
                                className="rounded-xl h-9 min-w-[36px] px-2 text-xs"
                              >
                                1
                              </Button>
                            );
                          }
                          
                          if (i === 0 && pageNum > 2) {
                            return (
                              <span key="dots1" className="px-1 text-muted-foreground">…</span>
                            );
                          }
                          
                          if (i === 6 && pageNum < totalPages - 1) {
                            return (
                              <span key="dots2" className="px-1 text-muted-foreground">…</span>
                            );
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={cn(
                                "rounded-xl h-9 min-w-[36px] px-2 text-xs",
                                currentPage === pageNum && "bg-[#0d2e2a] text-white hover:bg-[#1a4f4a]"
                              )}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="rounded-xl h-9 w-9 p-0"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                   <div className="flex items-center gap-2">
  <select
    value={itemsPerPage}
    onChange={(e) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    }}
    className="h-9 px-2 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#0d2e2a]/20"
  >
    <option value="5">5</option>
    <option value="10">10</option>  
    <option value="25">25</option>
    <option value="50">50</option>
  </select>
  <span className="text-xs text-muted-foreground">
    {isArabic ? "لكل صفحة" : "per page"}
  </span>
</div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ===== DISTRIBUTORS TAB ===== */}
          {activeTab === "distributors" && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#0d2e2a]" />
                    {isArabic ? "الموزعين" : "Distributors"}
                    <span className="text-sm font-normal text-muted-foreground">
                      ({allDistributors.length})
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? "إدارة الموزعين وحالتهم" : "Manage distributors and their status"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {/* ✅ أزرار التصدير والطباعة للموزعين */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportToCSV(allDistributors, 'الموزعين')}
                        className="h-9 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-xs mr-1">{isArabic ? "إكسل" : "Excel"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isArabic ? "تصدير الموزعين إلى Excel" : "Export distributors to Excel"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportToWord(allDistributors, 'تقرير الموزعين')}
                        className="h-9 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                      >
                        <FileText className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-xs mr-1">{isArabic ? "Word" : "Word"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isArabic ? "تصدير الموزعين إلى Word" : "Export distributors to Word"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="h-9 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                      >
                        <Printer className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-xs mr-1">{isArabic ? "طباعة" : "Print"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isArabic ? "طباعة تقرير الموزعين" : "Print distributors report"}</TooltipContent>
                  </Tooltip>

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
                              : `🔗 Distributor will be linked to company "${company.name_en}"`}
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
              ) : allDistributors.length === 0 ? (
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
                  {allDistributors.map((dist: any) => (
                    <DistributorCard 
                      key={dist.id} 
                      distributor={dist} 
                      isArabic={isArabic}
                      onDeactivate={openDeactivateDistributorDialog}
                    />
                  ))}
                </div>
              )}
            </div>     
          )}        

          {/* ===== ANALYTICS TAB ===== */}
          {activeTab === "analytics" && (
            <div className="animate-in slide-in-from-top-5 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#0d2e2a]" />
                    {isArabic ? "📊 التحليلات" : "📊 Analytics"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? "إحصائيات وتقارير الأداء" : "Statistics and performance reports"}
                  </p>
                </div>
                
                {/* ✅ أزرار التصدير والطباعة للتحليلات */}
                <div className="flex items-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const analyticsData = [
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'إجمالي الطلبات' : 'Total Orders',
                              [isArabic ? 'القيمة' : 'Value']: stats.total 
                            },
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'قيد المراجعة' : 'Pending',
                              [isArabic ? 'القيمة' : 'Value']: stats.pending 
                            },
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'تم التعيين' : 'Assigned',
                              [isArabic ? 'القيمة' : 'Value']: stats.assigned 
                            },
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'قيد التوصيل' : 'In Transit',
                              [isArabic ? 'القيمة' : 'Value']: stats.inTransit 
                            },
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'تم التوصيل' : 'Delivered',
                              [isArabic ? 'القيمة' : 'Value']: stats.delivered 
                            },
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'ملغي' : 'Cancelled',
                              [isArabic ? 'القيمة' : 'Value']: stats.cancelled 
                            },
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'الإيرادات' : 'Revenue',
                              [isArabic ? 'القيمة' : 'Value']: stats.totalRevenue 
                            },
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'نسبة الإنجاز' : 'Completion Rate',
                              [isArabic ? 'القيمة' : 'Value']: `${stats.completionRate}%` 
                            },
                            { 
                              [isArabic ? 'المؤشر' : 'Metric']: isArabic ? 'متوسط وقت التوصيل' : 'Avg Delivery Time',
                              [isArabic ? 'القيمة' : 'Value']: `${stats.avgDeliveryTime} ${isArabic ? 'دقيقة' : 'min'}` 
                            },
                          ];
                          exportToCSV(analyticsData, 'التقارير_التحليلية');
                        }}
                        className="h-9 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-xs mr-1">{isArabic ? "إكسل" : "Excel"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isArabic ? "تصدير التحليلات إلى Excel" : "Export analytics to Excel"}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        className="h-9 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                      >
                        <Printer className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
                        <span className="hidden sm:inline text-xs mr-1">{isArabic ? "طباعة" : "Print"}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{isArabic ? "طباعة التحليلات" : "Print analytics"}</TooltipContent>
                  </Tooltip>
                </div>
              </div>

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

          {/* ===== ADMINS TAB ===== */}
          {activeTab === "admins" && company && (
            <div className="animate-in slide-in-from-top-5 duration-300">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#0d2e2a]" />
                    {isArabic ? "👑 المدراء" : "👑 Managers"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isArabic ? "إدارة مدراء شركة التوصيل" : "Manage delivery company managers"}
                  </p>
                </div>
              </div>
              <DeliveryAdminsManager
                companyId={company.id}
                companyName={company.name_ar}
                isArabic={isArabic}
              />
            </div>
          )}
        </div>

        {/* ===== ACCEPT DELIVERY DIALOG ===== */}
        <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
          <DialogContent className="max-w-lg rounded-2xl border-emerald-200/50 dark:border-emerald-800/30 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-emerald-500/10 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {isArabic ? "🚚 قبول طلب التوصيل" : "🚚 Accept Delivery Order"}
                  </DialogTitle>
                  <p className="text-white/80 text-sm mt-0.5">
                    {isArabic
                      ? "اختر موزعاً من شركتك وحدد وقت التوصيل"
                      : "Select a distributor from your company and set delivery time"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 flex-1 overflow-y-auto">
              {distributorsLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {isArabic ? "جاري تحميل الموزعين..." : "Loading distributors..."}
                  </p>
                </div>
              ) : !allDistributors || allDistributors.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {isArabic ? "❌ لا يوجد موزعين في شركتك" : "❌ No distributors in your company"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isArabic
                      ? "قم بإضافة موزعين للشركة من تبويب الموزعين"
                      : "Add distributors to your company from the Distributors tab"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative mb-4">
                    <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={isArabic ? "🔍 ابحث باسم أو رقم الموزع..." : "🔍 Search by name or phone..."}
                      value={distributorSearch}
                      onChange={(e) => setDistributorSearch(e.target.value)}
                      className="ps-9 h-10 rounded-xl border-slate-200/50 dark:border-slate-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                    />
                    {distributorSearch && (
                      <button
                        onClick={() => setDistributorSearch("")}
                        className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">
                    {isArabic
                      ? `🟢 ${allDistributors.length} موزع في شركتك`
                      : `🟢 ${allDistributors.length} distributors in your company`}
                  </p>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {allDistributors
                      .filter((dist: any) => {
                        const search = distributorSearch.toLowerCase().trim();
                        if (!search) return true;
                        const nameAr = dist.full_name_ar?.toLowerCase() || "";
                        const nameEn = dist.full_name_en?.toLowerCase() || "";
                        const phone = dist.phone?.toLowerCase() || "";
                        return nameAr.includes(search) || nameEn.includes(search) || phone.includes(search);
                      })
                      .map((dist: any) => (
                        <div
                          key={dist.id}
                          onClick={() => setSelectedDistributorId(dist.id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-md",
                            selectedDistributorId === dist.id
                              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/20"
                              : "border-slate-200/50 dark:border-slate-700/50 hover:border-emerald-300/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/10"
                          )}
                        >
                          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-emerald-200 dark:border-emerald-800/50">
                            {dist.avatar_url ? (
                              <img 
                                src={dist.avatar_url} 
                                alt={dist.full_name_ar || dist.full_name_en || "موزع"}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                                {dist.full_name_ar?.charAt(0) || dist.full_name_en?.charAt(0) || "M"}
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {isArabic ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar}
                              </p>
                              {dist.is_available ? (
                                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[9px]">
                                  ● {isArabic ? "متاح" : "Available"}
                                </Badge>
                              ) : (
                                <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[9px]">
                                  ● {isArabic ? "غير متاح" : "Unavailable"}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {dist.phone || (isArabic ? "غير متوفر" : "Not available")}
                              </span>
                              <span className="text-muted-foreground/30">|</span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {Number(dist.rating || 0).toFixed(1)}
                              </span>
                              <span className="text-muted-foreground/30">|</span>
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {dist.completed_orders || 0} {isArabic ? "طلب" : "orders"}
                              </span>
                            </div>
                          </div>

                          <div className={cn(
                            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                            selectedDistributorId === dist.id
                              ? "border-emerald-500 bg-emerald-500"
                              : "border-slate-300 dark:border-slate-600"
                          )}>
                            {selectedDistributorId === dist.id && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {allDistributors.filter((dist: any) => {
                    const search = distributorSearch.toLowerCase().trim();
                    if (!search) return true;
                    const nameAr = dist.full_name_ar?.toLowerCase() || "";
                    const nameEn = dist.full_name_en?.toLowerCase() || "";
                    const phone = dist.phone?.toLowerCase() || "";
                    return nameAr.includes(search) || nameEn.includes(search) || phone.includes(search);
                  }).length === 0 && distributorSearch && (
                    <div className="text-center py-4">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {isArabic 
                          ? `❌ لا توجد نتائج لـ "${distributorSearch}"`
                          : `❌ No results for "${distributorSearch}"`}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mb-3">
                      <Clock className="h-3.5 w-3.5 text-[#0d2e2a]" />
                      {isArabic ? "⏰ الوقت المتوقع للوصول" : "⏰ Estimated Delivery Time"}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">
                          {isArabic ? "عدد الساعات حتى الوصول" : "Hours until delivery"}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            min={0.5}
                            step={0.5}
                            value={estimatedDeliveryHours}
                            onChange={(e) => setEstimatedDeliveryHours(parseFloat(e.target.value) || 0)}
                            className="h-9 rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 w-full"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {isArabic ? "ساعة" : "hrs"}
                          </span>
                        </div>
                        {estimatedDeliveryHours > 0 && (
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">
                            🕐 {new Date(Date.now() + estimatedDeliveryHours * 60 * 60 * 1000).toLocaleTimeString(
                              isArabic ? 'ar-SA' : 'en-US',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-300">
                          {isArabic ? "وقت الاستلام المتوقع" : "Estimated pickup time"}
                        </Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            min={0.25}
                            step={0.25}
                            value={estimatedPickupHours}
                            onChange={(e) => setEstimatedPickupHours(parseFloat(e.target.value) || 0)}
                            className="h-9 rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 w-full"
                          />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {isArabic ? "ساعة" : "hrs"}
                          </span>
                        </div>
                        {estimatedPickupHours > 0 && (
                          <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">
                            🕐 {new Date(Date.now() + estimatedPickupHours * 60 * 60 * 1000).toLocaleTimeString(
                              isArabic ? 'ar-SA' : 'en-US',
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAcceptDialogOpen(false);
                    setSelectedDeliveryOrderId(null);
                    setSelectedOrderId(null);
                    setSelectedDistributorId("");
                    setDistributorSearch("");
                  }}
                  className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  onClick={handleAcceptDelivery}
                  disabled={!selectedDistributorId || isProcessing}
                  className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {isArabic ? "جاري..." : "Processing..."}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isArabic ? "تأكيد القبول" : "Confirm Accept"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* ===== REJECT DELIVERY DIALOG ===== */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent className="max-w-md rounded-2xl border-red-200/50 dark:border-red-800/30 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-red-500/10 overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-rose-600 p-5 text-white">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {isArabic ? "❌ رفض طلب التوصيل" : "❌ Reject Delivery Order"}
                  </DialogTitle>
                  <p className="text-white/80 text-sm mt-0.5">
                    {isArabic
                      ? "أدخل سبب الرفض لإرساله للعميل والبائع"
                      : "Enter the rejection reason to send to customer and seller"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                <p className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {isArabic
                      ? "سيتم إرسال سبب الرفض إلى البائع والعميل"
                      : "The rejection reason will be sent to the seller and customer"}
                  </span>
                </p>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-1.5">
                  {isArabic ? "سبب الرفض" : "Rejection Reason"}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={isArabic
                    ? "اكتب سبب رفض الطلب (مثال: لا يوجد موزع متاح، المنطقة غير مغطاة، ...)"
                    : "Write the reason for rejecting the order (e.g., no distributor available, area not covered, ...)"
                  }
                  className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 transition-all duration-200 resize-none"
                  dir={isArabic ? "rtl" : "ltr"}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {rejectReason.length}/500
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  isArabic ? "لا يوجد موزع متاح" : "No distributor available",
                  isArabic ? "المنطقة غير مغطاة" : "Area not covered",
                  isArabic ? "الطلب خارج أوقات العمل" : "Order outside working hours",
                  isArabic ? "مشكلة في العنوان" : "Address issue",
                  isArabic ? "العميل غير متاح" : "Customer unavailable",
                  isArabic ? "سبب آخر" : "Other reason",
                ].map((reason, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRejectReason(reason)}
                    className="px-3 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectDialogOpen(false);
                  setSelectedDeliveryOrderId(null);
                  setSelectedOrderId(null);
                  setRejectReason("");
                }}
                className="flex-1 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4 mr-1.5" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectDelivery}
                disabled={!rejectReason.trim() || isProcessing}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    {isArabic ? "جاري الرفض..." : "Rejecting..."}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    {isArabic ? "تأكيد الرفض" : "Confirm Reject"}
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ===== ديالوج تعطيل الموزع ===== */}
        <Dialog open={showDeactivateDistributorDialog} onOpenChange={setShowDeactivateDistributorDialog}>
          <DialogContent className="max-w-md rounded-2xl border-0 p-0 overflow-hidden shadow-2xl bg-white dark:bg-slate-900">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                    <PowerOff className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -inset-1 rounded-2xl bg-amber-400/30 blur-lg animate-pulse" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {isArabic ? "⚠️ تعطيل الموزع" : "⚠️ Deactivate Distributor"}
                  </DialogTitle>
                  <p className="text-white/80 text-sm mt-0.5">
                    {isArabic 
                      ? "لن يتمكن الموزع من استلام طلبات جديدة" 
                      : "Distributor will not be able to receive new orders"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30">
                <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-300">
                    {isArabic ? "هل أنت متأكد؟" : "Are you sure?"}
                  </p>
                  <p className="text-sm text-amber-600/80 dark:text-amber-400/70">
                    {isArabic
                      ? `سيتم تعطيل "${deactivatingDistributor?.full_name_ar || deactivatingDistributor?.full_name_en || ''}" ولن يتمكن من استلام طلبات جديدة`
                      : `"${deactivatingDistributor?.full_name_en || deactivatingDistributor?.full_name_ar || ''}" will be deactivated and won't receive new orders`}
                  </p>
                </div>
              </div>

              {deactivatingDistributor && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{isArabic ? "الاسم" : "Name"}</span>
                      <span className="font-medium">
                        {deactivatingDistributor.full_name_ar || deactivatingDistributor.full_name_en || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">{isArabic ? "رقم الهاتف" : "Phone"}</span>
                      <span className="font-medium" dir="ltr">{deactivatingDistributor.phone || '-'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800/30">
                <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  {isArabic
                    ? "💡 يمكنك تفعيل الموزع مرة أخرى في أي وقت"
                    : "💡 You can reactivate the distributor at any time"}
                </p>
              </div>
            </div>

            <DialogFooter className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeactivateDistributorDialog(false);
                  setDeactivatingDistributor(null);
                }}
                className="flex-1 rounded-xl"
                disabled={isDeactivating}
              >
                <X className="h-4 w-4 mr-1.5" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeactivateDistributor}
                disabled={isDeactivating}
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg shadow-amber-600/30 transition-all duration-300"
              >
                {isDeactivating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isArabic ? "جاري التعطيل..." : "Deactivating..."}
                  </>
                ) : (
                  <>
                    <PowerOff className="h-4 w-4 mr-2" />
                    {isArabic ? "تأكيد التعطيل" : "Confirm Deactivate"}
                  </>
                )}
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
            @keyframes float-logo {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-6px) rotate(-2deg); }
  75% { transform: translateY(4px) rotate(2deg); }
}
.animate-float-logo {
  animation: float-logo 4s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { filter: drop-shadow(0 0 15px rgba(212,175,55,0.3)); }
  50% { filter: drop-shadow(0 0 30px rgba(212,175,55,0.6)); }
}
.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(0.95); }
  50% { opacity: 0.6; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulse-slow 3s ease-in-out infinite;
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
// 📦 OrderCard (معدل مع وقت الوصول)
// ============================================================
function OrderCard({ 
  order, 
  isArabic,
  onAccept,
  onReject
}: { 
  order: any; 
  isArabic: boolean;
  onAccept: () => void;
  onReject: () => void;
}) {
  const app = useApp();
  const navigate = useNavigate()
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ✅ جلب تفاصيل الطلب من جدول orders
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order.order_id) return;
      
      setLoadingDetails(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("total, delivery_fee, promo_discount, total_with_delivery")
          .eq("id", order.order_id)
          .single();
        
        if (error) throw error;
        setOrderDetails(data);
      } catch (error) {
        console.error("❌ Error fetching order details:", error);
      } finally {
        setLoadingDetails(false);
      }
    };
    
    fetchOrderDetails();
  }, [order.order_id]);

  // ✅ ✅ ✅ دالة تنسيق الوقت
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ✅ ✅ ✅ دالة تنسيق التاريخ
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

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

  const isPending = order.status === "pending";

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
              
              {/* ✅ ✅ ✅ عرض وقت وصول الطلب لشركة التوصيل */}
              <span className="flex items-center gap-1 text-[#2a655f] dark:text-[#4a9f95]">
                <Clock className="h-3 w-3" />
                {formatTime(order.created_at)}
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1 text-muted-foreground/80">
                <Calendar className="h-3 w-3" />
                {formatDate(order.created_at)}
              </span>
              
              {/* ✅ عرض المجموع الفرعي + التوصيل + الإجمالي */}
              {loadingDetails ? (
                <span className="flex items-center gap-1 text-[#2a655f]">
                  <Loader2 className="h-3 w-3 animate-spin" />
                </span>
              ) : orderDetails ? (
                <>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="font-medium text-[#2a655f] dark:text-[#4a9f95]">
                    {isArabic ? "المجموع" : "Total"}: {orderDetails.total} {app.currency}
                  </span>
                  {orderDetails.delivery_fee > 0 && (
                    <>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">
                        🚚 {orderDetails.delivery_fee} {app.currency}
                      </span>
                    </>
                  )}
                  {orderDetails.promo_discount > 0 && (
                    <>
                      <span className="text-muted-foreground/30">|</span>
                      <span className="font-medium text-emerald-500">
                        💚 -{orderDetails.promo_discount} {app.currency}
                      </span>
                    </>
                  )}
                  <span className="text-muted-foreground/30">|</span>
                  <span className="font-bold text-[#0d2e2a] dark:text-[#3a8a82]">
                    {isArabic ? "الإجمالي" : "Total With Delivery"}: {orderDetails.total_with_delivery || (orderDetails.total + orderDetails.delivery_fee - orderDetails.promo_discount)} {app.currency}
                  </span>
                </>
              ) : (
                <span className="font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                  {order.delivery_fee} {app.currency}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {isPending && (
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                className="h-7 px-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold shadow-md shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept();
                }}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {isArabic ? "قبول" : "Accept"}
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                className="h-7 px-2.5 rounded-lg text-[10px] font-bold shadow-md shadow-red-500/30 transition-all duration-300 hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject();
                }}
              >
                <XCircle className="h-3 w-3 mr-1" />
                {isArabic ? "رفض" : "Reject"}
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-xl hover:bg-[#0d2e2a]/10 transition-all duration-300 group-hover:scale-110"
            onClick={() => navigate({ to: `/delivery/orders/${order.id}` })}
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          {/* ✅ ✅ ✅ تم إزالة DropdownMenu (زر النقاط الثلاث) */}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 DistributorCard
// ============================================================
function DistributorCard({ 
  distributor, 
  isArabic,
  onDeactivate
}: { 
  distributor: any; 
  isArabic: boolean;
  onDeactivate: (distributor: any) => void;
}) {
  const isActive = distributor.is_active !== false;
  
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
            {isActive ? (
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[9px] animate-pulse">
                ● {isArabic ? "نشط" : "Active"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[9px]">
                ● {isArabic ? "معطل" : "Deactivated"}
              </Badge>
            )}
            {distributor.is_available ? (
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[9px]">
                {isArabic ? "متاح" : "Available"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[9px]">
                {isArabic ? "غير متاح" : "Unavailable"}
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
            {!isActive && distributor.deactivated_at && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <span className="text-[9px] text-muted-foreground">
                  {isArabic ? `تم التعطيل: ${new Date(distributor.deactivated_at).toLocaleDateString()}` : `Deactivated: ${new Date(distributor.deactivated_at).toLocaleDateString()}`}
                </span>
              </>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl hover:bg-red-500/10 transition-all duration-300 group-hover:scale-110">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[180px]">
            {isActive ? (
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer gap-2 text-amber-600 hover:bg-amber-50/50"
                onClick={() => onDeactivate(distributor)}
              >
                <PowerOff className="h-4 w-4" />
                {isArabic ? "تعطيل الموزع" : "Deactivate Distributor"}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="rounded-lg cursor-pointer gap-2 text-emerald-600 hover:bg-emerald-50/50"
                onClick={() => {
                  toast.info(
                    isArabic 
                      ? "ℹ️ يمكنك إعادة تفعيل الموزع من صفحة إدارة الموزعين"
                      : "ℹ️ You can reactivate the distributor from the Distributors management page"
                  );
                }}
              >
                <Power className="h-4 w-4" />
                {isArabic ? "تفعيل الموزع" : "Activate Distributor"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ✅ دالة formatTime (للاستخدام العام)
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