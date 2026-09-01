// src/routes/distributor/dashboard.tsx
import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  Truck, Package, MapPin, Phone, Mail, Clock, 
  CheckCircle, XCircle, Navigation, User, 
  Calendar, ArrowRight, ChevronLeft, Search,
  Filter, MoreVertical, Eye, AlertCircle,
  RefreshCw, UserCheck, UserX, Star, Award,
  TrendingUp, DollarSign, BarChart3, Activity, Wallet,
  ClipboardCheck, ClipboardX, ClipboardList,
  LogOut, Settings, Shield, Zap, Sparkles,
  Crown, Gem, Rocket, Target, Compass,
  ChevronRight, Clipboard, Bell, Languages,
  MessageCircle, Store, Building2, Users,
  Coffee, Sun, Moon, Cloud, Heart, 
  Flame, Gift, ShoppingBag, CreditCard,
  Smartphone, Watch, Headphones, Camera,
  Gamepad2, BookOpen, Music, Film,
  Home, Briefcase, GraduationCap, Plane,
  Car, Bike, Bus, Train, Ship,
  Anchor, Compass as CompassIcon, 
  Globe, Map, Pin, Flag, Truck as TruckIcon,
  X, Maximize2, FileText, Loader2, ArrowLeft,
  Download, FileSpreadsheet, Printer, FileDown, Table2, ClipboardCopy,
  Megaphone,
  BadgeCheck,
  BellOff,
  Layers,
  Percent,
  Banknote   
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { DistributorAccountMenu } from "@/components/distributor/DistributorAccountMenu";
import { DistributorNotifications } from "@/components/distributor/DistributorNotifications";
import { OrderTrackingMap } from "@/components/distributor/OrderTrackingMap";
import { useUnreadCount } from "@/lib/hooks/useConversation";
import {
  useUserNotifications,
  useMarkNotificationReadV2,
  useMarkAllNotificationsReadV2,
  useDeliveryOrderDetails,
} from "@/lib/queries";
import { NOTIFICATION_CONFIG, NOTIFICATION_TYPES, NotificationType } from "@/types/notificationTypes";
import { formatPrice } from "@/lib/i18n";

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

export const Route = createFileRoute("/distributor/dashboard")({
  component: DistributorDashboardPage,
  head: () => ({
    meta: [
      { title: "لوحة تحكم الموزع - السوق لعندك" },
      { name: "description", content: "إدارة طلبات التوصيل الخاصة بك" },
    ],
  }),
});

function DistributorDashboardPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [showMapOrderId, setShowMapOrderId] = useState<string | null>(null);
  const [statusNotes, setStatusNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<any>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit, setHistoryLimit] = useState(10);
  const [historyFilter, setHistoryFilter] = useState<string>("all");
  const [historySearch, setHistorySearch] = useState("");

  const [activePage, setActivePage] = useState(1);
  const [activeLimit, setActiveLimit] = useState(5);

  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [distributors, setDistributors] = useState<any[]>([]);

  // ✅ State لصورة الموزع
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const isArabic = app.lang === "ar";

  const { data: notifications = [], refetch: refetchNotifications } = useUserNotifications(app.user?.id, { limit: 50 });

  const markRead = useMarkNotificationReadV2();
  const markAllRead = useMarkAllNotificationsReadV2();

  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  useEffect(() => {
    const count = notifications.filter((n: any) => !n.is_read).length;
    setUnreadNotificationsCount(count);
  }, [notifications]);

  const notificationChannelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  useEffect(() => {
    if (!app.user) {
      console.log('⏳ [Distributor] No user, skipping notification setup');
      return;
    }

    if (isSubscribedRef.current) {
      console.log('📡 [Distributor] Already subscribed to notifications');
      return;
    }

    console.log('📡 [Distributor] Setting up REAL-TIME notifications for user:', app.user.id);

    const channel = supabase
      .channel(`distributor-notifications-${app.user.id}`)
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
          
          console.log('📬 [Distributor] 🔔 NEW NOTIFICATION RECEIVED:', notification);
          console.log('📬 [Distributor] Title:', notification.title_ar || notification.title_en);
          console.log('📬 [Distributor] Body:', notification.body_ar || notification.body_en);
          
          refetchNotifications();
          
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

          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.7;
            audio.play().catch(() => console.log('🔇 Audio play failed'));
          } catch (e) {
            console.log('🔇 Audio error:', e);
          }

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

          setUnreadNotificationsCount(prev => prev + 1);
        }
      )
      .subscribe((status) => {
        console.log(`📡 [Distributor] Realtime status: ${status}`);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          isSubscribedRef.current = false;
        }
      });

    notificationChannelRef.current = channel;

    return () => {
      if (notificationChannelRef.current) {
        console.log('🧹 [Distributor] Cleaning up notifications channel');
        supabase.removeChannel(notificationChannelRef.current);
        notificationChannelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [app.user?.id, isArabic, navigate, refetchNotifications]);

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
              assigned: isArabic ? 'تم التعيين' : 'Assigned',
              picked_up: isArabic ? 'تم الاستلام' : 'Picked up',
              in_transit: isArabic ? 'قيد التوصيل' : 'In Transit',
              delivered: isArabic ? 'تم التوصيل' : 'Delivered',
              cancelled: isArabic ? 'ملغي' : 'Cancelled',
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
            ${isArabic ? 'تم التصدير من لوحة تحكم الموزع - السوق لعندك' : 'Exported from Distributor Dashboard - Souq Le3ndak'}
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

  const handlePrint = () => {
    window.print();
  };

  // ✅ دالة جلب الموزعين مُحسّنة
  const fetchDistributors = useCallback(async () => {
    if (!app.user?.id) return;
    const { data, error } = await supabase
      .from("distributors")
      .select("*")
      .eq("user_id", app.user.id);
    if (!error) setDistributors(data || []);
  }, [app.user?.id]);

  // ✅ جلب الموزعين عند التحميل
  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  // ✅ ✅ ✅ استعلام جلب الطلبات مع order_items والفيرنتات
  useEffect(() => {
    const fetchOrders = async () => {
      if (!app.user?.id) return;
      setOrdersLoading(true);
      try {
        const { data: distributor, error: distError } = await supabase
          .from("distributors")
          .select("id")
          .eq("user_id", app.user.id)
          .maybeSingle();
        if (distError || !distributor) {
          setOrdersLoading(false);
          return;
        }
        const { data: orders, error: ordersError } = await supabase
          .from("delivery_orders")
          .select(`
            *,
            orders:order_id (
              *,
              order_items (
                *,
                listings:listing_id (
                  *,
                  profile:profiles!owner_id (*),
                  colors:product_colors (*),
                  variations:product_variations (*),
                  listing_images (*)
                )
              ),
              listings:listing_id (
                *,
                profile:profiles!owner_id (*)
              )
            )
          `)
          .eq("distributor_id", distributor.id)
          .order("created_at", { ascending: false });
        if (ordersError) {
          setAllOrders([]);
        } else {
          setAllOrders(orders || []);
        }
      } catch (error) {
        setAllOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [app.user?.id]);

  const refetchOrders = useCallback(async () => {
    if (!app.user?.id) return;
    try {
      const { data: distributor } = await supabase
        .from("distributors")
        .select("id")
        .eq("user_id", app.user.id)
        .maybeSingle();
      if (distributor) {
        const { data: orders } = await supabase
          .from("delivery_orders")
          .select(`
            *,
            orders:order_id (
              *,
              order_items (
                *,
                listings:listing_id (
                  *,
                  profile:profiles!owner_id (*),
                  colors:product_colors (*),
                  variations:product_variations (*),
                  listing_images (*)
                )
              ),
              listings:listing_id (
                *,
                profile:profiles!owner_id (*)
              )
            )
          `)
          .eq("distributor_id", distributor.id)
          .order("created_at", { ascending: false });
        setAllOrders(orders || []);
      }
    } catch (error) {
      console.error("Refetch error:", error);
    }
  }, [app.user?.id]);

  const refetchDistributors = useCallback(async () => {
    if (!app.user?.id) return;
    const { data, error } = await supabase
      .from("distributors")
      .select("*")
      .eq("user_id", app.user.id);
    if (!error) {
      setDistributors(data || []);
    }
  }, [app.user?.id]);

  const { data: unreadCount = 0 } = useUnreadCount();

  const currentDistributor = useMemo(() => {
    return distributors.find((d: any) => d.user_id === app.user?.id);
  }, [distributors, app.user]);

  useEffect(() => {
    if (currentDistributor && !currentDistributor.avatar_url) {
      const timer = setTimeout(() => {
        setShowAvatarDialog(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentDistributor]);

  const handleUploadAvatar = async () => {
    if (!avatarFile || !currentDistributor) {
      toast.error(isArabic ? "الرجاء اختيار صورة أولاً" : "Please select an image first");
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `distributors/${currentDistributor.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, avatarFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error("❌ [Upload] Upload error:", uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      const { error: updateError } = await supabase
        .from('distributors')
        .update({ avatar_url: avatarUrl })
        .eq('id', currentDistributor.id);

      if (updateError) {
        console.error("❌ [Upload] Update distributor error:", updateError);
        throw updateError;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', app.user?.id);

      if (profileError) {
        console.warn("⚠️ [Upload] Could not update profile avatar:", profileError);
      }

      // ✅ ✅ ✅ تحديث فوري للـ state
      setDistributors(prev => 
        prev.map(d => 
          d.id === currentDistributor.id 
            ? { ...d, avatar_url: avatarUrl }
            : d
        )
      );

      // ✅ ✅ ✅ تحديث الـ user object في الـ app
      if (app.user) {
        app.user.avatar_url = avatarUrl;
      }

      setShowAvatarDialog(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setIsUploadingAvatar(false);

      // ✅ إعادة جلب البيانات للتأكد
      await refetchDistributors();

      toast.success(
        isArabic 
          ? "✅ تم رفع الصورة بنجاح! ✅"
          : "✅ Avatar uploaded successfully! ✅"
      );

    } catch (error: any) {
      console.error("❌ [Upload] Error uploading avatar:", error);
      
      let errorMessage = error.message;
      if (error.message?.includes('permission')) {
        errorMessage = isArabic 
          ? "ليس لديك صلاحية لرفع الصورة. يرجى التواصل مع المدير."
          : "You don't have permission to upload. Please contact admin.";
      } else if (error.message?.includes('duplicate')) {
        errorMessage = isArabic 
          ? "هذه الصورة موجودة بالفعل. جارٍ استبدالها..."
          : "This image already exists. Replacing...";
      }
      
      toast.error(
        isArabic 
          ? `❌ فشل رفع الصورة: ${errorMessage}`
          : `❌ Upload failed: ${errorMessage}`
      );
      setIsUploadingAvatar(false);
    }
  };

  const [companyAdmin, setCompanyAdmin] = useState<any>(null);

  useEffect(() => {
    const fetchCompanyAdmin = async () => {
      if (!currentDistributor?.delivery_company_id) {
        setCompanyAdmin(null);
        return;
      }

      try {
        const companyId = currentDistributor.delivery_company_id;

        const { data: companyAdmins, error: adminsError } = await supabase
          .from("delivery_company_admins")
          .select(`
            user_id,
            company_id,
            created_at,
            profiles:user_id (
              id,
              full_name,
              phone,
              avatar_url
            )
          `)
          .eq("company_id", companyId)
          .limit(1);

        if (adminsError) {
          console.error("❌ خطأ في جلب أدمن الشركة:", adminsError);
          throw adminsError;
        }

        if (companyAdmins && companyAdmins.length > 0) {
          const admin = companyAdmins[0];
          setCompanyAdmin({
            id: admin.profiles?.id || admin.user_id,
            full_name: admin.profiles?.full_name || "غير معروف",
            phone: admin.profiles?.phone || "",
            avatar_url: admin.profiles?.avatar_url || "",
          });
        } else {
          setCompanyAdmin(null);
        }
      } catch (error) {
        console.error("❌ خطأ في جلب أدمن الشركة:", error);
        setCompanyAdmin(null);
      }
    };

    fetchCompanyAdmin();
  }, [currentDistributor?.delivery_company_id]);

  const orders = useMemo(() => {
    if (!currentDistributor?.id) return [];
    return allOrders.filter((order: any) => order.distributor_id === currentDistributor.id);
  }, [allOrders, currentDistributor]);

  const stats = useMemo(() => {
    const total = orders.length;
    const pending = orders.filter((o: any) => o.status === "pending").length;
    const assigned = orders.filter((o: any) => o.status === "assigned").length;
    const inTransit = orders.filter((o: any) => o.status === "in_transit").length;
    const delivered = orders.filter((o: any) => o.status === "delivered").length;
    const cancelled = orders.filter((o: any) => o.status === "cancelled").length;
    const avgDeliveryTime = orders
      .filter((o: any) => o.delivered_at && o.created_at)
      .reduce((sum: number, o: any) => {
        const diff = new Date(o.delivered_at).getTime() - new Date(o.created_at).getTime();
        return sum + (diff / (1000 * 60));
      }, 0) / (orders.filter((o: any) => o.delivered_at && o.created_at).length || 1);
    const completionRate = total > 0 ? Math.round((delivered / total) * 100) : 0;
    return {
      total, pending, assigned, inTransit, delivered, cancelled,
      avgDeliveryTime: Math.round(avgDeliveryTime),
      completionRate, activeOrders: pending + assigned + inTransit,
    };
  }, [orders]);

  const activeOrders = useMemo(() => {
    return orders.filter((o: any) => 
      o.status === "pending" || o.status === "assigned" || o.status === "in_transit" || o.status === "picked_up"
    );
  }, [orders]);

  const historyOrders = useMemo(() => {
    let result = orders.filter((o: any) => 
      o.status === "delivered" || o.status === "cancelled"
    );
    
    if (historyFilter !== "all") {
      result = result.filter((o: any) => o.status === historyFilter);
    }
    
    if (historySearch.trim()) {
      const q = historySearch.toLowerCase().trim();
      const cleanedQ = q.replace(/^#/, '');
      
      result = result.filter((o: any) => {
        const tracking = (o.tracking_number || '').toLowerCase();
        const id = (o.id || '').toLowerCase();
        const deliveryName = (o.delivery_name || '').toLowerCase();
        const pickupName = (o.pickup_name || '').toLowerCase();
        const deliveryAddress = (o.delivery_address || '').toLowerCase();
        const buyerName = (o.orders?.buyer_name || '').toLowerCase();
        const buyerPhone = (o.orders?.buyer_phone || '').toLowerCase();
        const notes = (o.orders?.notes || '').toLowerCase();
        
        return tracking.includes(cleanedQ) ||
               tracking.includes(q) ||
               id.includes(cleanedQ) ||
               id.includes(q) ||
               deliveryName.includes(q) ||
               pickupName.includes(q) ||
               deliveryAddress.includes(q) ||
               buyerName.includes(q) ||
               buyerPhone.includes(q) ||
               notes.includes(q);
      });
    }
    
    return result;
  }, [orders, historyFilter, historySearch]);

  const totalHistoryPages = Math.ceil(historyOrders.length / historyLimit);
  const paginatedHistoryOrders = useMemo(() => {
    const start = (historyPage - 1) * historyLimit;
    return historyOrders.slice(start, start + historyLimit);
  }, [historyOrders, historyPage, historyLimit]);

  const filteredOrders = useMemo(() => {
    let result = activeOrders;
    if (statusFilter !== "all") {
      result = result.filter((o: any) => o.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const cleanedQ = q.replace(/^#/, '');
      
      result = result.filter((o: any) => {
        const tracking = (o.tracking_number || '').toLowerCase();
        const id = (o.id || '').toLowerCase();
        const deliveryName = (o.delivery_name || '').toLowerCase();
        const pickupName = (o.pickup_name || '').toLowerCase();
        const deliveryAddress = (o.delivery_address || '').toLowerCase();
        const buyerName = (o.orders?.buyer_name || '').toLowerCase();
        const buyerPhone = (o.orders?.buyer_phone || '').toLowerCase();
        const notes = (o.orders?.notes || '').toLowerCase();
        
        return tracking.includes(cleanedQ) ||
               tracking.includes(q) ||
               id.includes(cleanedQ) ||
               id.includes(q) ||
               deliveryName.includes(q) ||
               pickupName.includes(q) ||
               deliveryAddress.includes(q) ||
               buyerName.includes(q) ||
               buyerPhone.includes(q) ||
               notes.includes(q);
      });
    }
    return result;
  }, [activeOrders, statusFilter, searchQuery]);

  const totalActivePages = Math.ceil(filteredOrders.length / activeLimit);
  const paginatedActiveOrders = useMemo(() => {
    const start = (activePage - 1) * activeLimit;
    return filteredOrders.slice(start, start + activeLimit);
  }, [filteredOrders, activePage, activeLimit]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success(isArabic ? "تم تسجيل الخروج بنجاح" : "Logged out successfully");
      window.location.href = "/auth/login";
    } catch (error) {
      toast.error(isArabic ? "فشل تسجيل الخروج" : "Logout failed");
      console.error(error);
    }
  };

  const getAvailableStatuses = (currentStatus: string) => {
    const statusFlow: Record<string, string[]> = {
      pending: ['assigned'],
      assigned: ['picked_up'],
      picked_up: ['in_transit', 'delivered'],
      in_transit: ['delivered'],
    };
    return statusFlow[currentStatus] || [];
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (!currentDistributor?.id) {
      toast.error(isArabic ? "لا يوجد موزع" : "No distributor found");
      return;
    }

    setIsUpdating(true);
    try {
      const { data: deliveryOrder, error: orderError } = await supabase
        .from("delivery_orders")
        .select(`
          *,
          orders:order_id (
            *,
            order_items (
              *,
              listings:listing_id (
                *,
                profile:profiles!owner_id (*)
              )
            ),
            listings:listing_id (
              *,
              profile:profiles!owner_id (*)
            )
          )
        `)
        .eq("id", orderId)
        .single();
      if (orderError) throw orderError;
      const mainOrder = deliveryOrder?.orders;
      const updateData: any = { status: newStatus, notes_ar: statusNotes || null, notes_en: statusNotes || null };
      if (newStatus === 'picked_up') updateData.picked_up_at = new Date().toISOString();
      else if (newStatus === 'delivered') updateData.delivered_at = new Date().toISOString();
      else if (newStatus === 'cancelled') updateData.cancelled_at = new Date().toISOString();
      
      const { error: updateDeliveryError } = await supabase
        .from("delivery_orders")
        .update(updateData)
        .eq("id", orderId);
      if (updateDeliveryError) throw updateDeliveryError;

      if (mainOrder) {
        let orderStatus = 'pending';
        if (newStatus === 'delivered') orderStatus = 'delivered';
        else if (newStatus === 'cancelled') orderStatus = 'cancelled';
        else if (newStatus === 'assigned') orderStatus = 'assigned';
        else if (newStatus === 'picked_up' || newStatus === 'in_transit') orderStatus = 'shipped';
        const deliveryStatus = newStatus === 'delivered' ? 'delivered' : newStatus;
        const { error: updateOrderError } = await supabase
          .from("orders")
          .update({
            status: orderStatus,
            delivery_status: deliveryStatus,
            delivered_at: newStatus === 'delivered' ? new Date().toISOString() : null,
          })
          .eq("id", mainOrder.id);
        if (updateOrderError) throw updateOrderError;
      }

      const statusLabels: Record<string, string> = {
        picked_up: isArabic ? "تم استلام الطلب" : "Order picked up",
        in_transit: isArabic ? "الطلب في الطريق" : "Order in transit",
        delivered: isArabic ? "تم توصيل الطلب" : "Order delivered",
        cancelled: isArabic ? "تم إلغاء الطلب" : "Order cancelled",
        assigned: isArabic ? "تم تعيين موزع" : "Order assigned",
      };
      const statusEmojis: Record<string, string> = {
        picked_up: "📦", in_transit: "🚚", delivered: "✅", cancelled: "❌", assigned: "📌",
      };

      if (mainOrder?.buyer_id) {
        await supabase.from("notifications").insert({
          user_id: mainOrder.buyer_id,
          type: "delivery_status_update",
          title_ar: `${statusEmojis[newStatus] || '📬'} ${statusLabels[newStatus] || newStatus}`,
          body_ar: `طلبك "${mainOrder.order_items?.[0]?.listings?.title_ar || mainOrder.listings?.title_ar || 'طلب رقم ' + mainOrder.id.substring(0,8)}" - ${statusLabels[newStatus] || newStatus}${statusNotes ? `\n📝 ملاحظات: ${statusNotes}` : ''}`,
          title_en: `${statusEmojis[newStatus] || '📬'} ${statusLabels[newStatus] || newStatus}`,
          body_en: `Your order "${mainOrder.order_items?.[0]?.listings?.title_en || mainOrder.listings?.title_en || 'Order ' + mainOrder.id.substring(0,8)}" - ${statusLabels[newStatus] || newStatus}${statusNotes ? `\n📝 Notes: ${statusNotes}` : ''}`,
          link_url: `/orders`,
          metadata: {
            order_id: mainOrder.id,
            delivery_order_id: orderId,
            status: newStatus,
            notes: statusNotes,
            distributor_id: currentDistributor?.id,
            distributor_name: currentDistributor?.full_name_ar,
          }
        });
      }

      if (mainOrder?.seller_id) {
        await supabase.from("notifications").insert({
          user_id: mainOrder.seller_id,
          type: "delivery_status_update",
          title_ar: `${statusEmojis[newStatus] || '📬'} ${statusLabels[newStatus] || newStatus}`,
          body_ar: `طلب "${mainOrder.order_items?.[0]?.listings?.title_ar || mainOrder.listings?.title_ar}" - ${statusLabels[newStatus] || newStatus} بواسطة ${currentDistributor?.full_name_ar || 'الموزع'}${statusNotes ? `\n📝 ملاحظات: ${statusNotes}` : ''}`,
          title_en: `${statusEmojis[newStatus] || '📬'} ${statusLabels[newStatus] || newStatus}`,
          body_en: `Order "${mainOrder.order_items?.[0]?.listings?.title_en || mainOrder.listings?.title_en}" - ${statusLabels[newStatus] || newStatus} by ${currentDistributor?.full_name_en || 'distributor'}${statusNotes ? `\n📝 Notes: ${statusNotes}` : ''}`,
          link_url: `/dashboard`,
          metadata: {
            order_id: mainOrder.id,
            delivery_order_id: orderId,
            status: newStatus,
            notes: statusNotes,
            distributor_id: currentDistributor?.id,
            distributor_name: currentDistributor?.full_name_ar,
          }
        });
      }

      if (deliveryOrder?.delivery_company_id) {
        const { data: companyAdmins } = await supabase
          .from("delivery_company_admins")
          .select("user_id")
          .eq("company_id", deliveryOrder.delivery_company_id);
        if (companyAdmins && companyAdmins.length > 0) {
          const adminIds = companyAdmins.map((a: any) => a.user_id);
          await supabase.from("notifications").insert(
            adminIds.map((userId: string) => ({
              user_id: userId,
              type: "delivery_status_update",
              title_ar: `${statusEmojis[newStatus] || '📬'} ${statusLabels[newStatus] || newStatus}`,
              body_ar: `طلب #${deliveryOrder.tracking_number || orderId.substring(0,8)} - ${statusLabels[newStatus] || newStatus}${statusNotes ? `\n📝 ملاحظات: ${statusNotes}` : ''}`,
              title_en: `${statusEmojis[newStatus] || '📬'} ${statusLabels[newStatus] || newStatus}`,
              body_en: `Order #${deliveryOrder.tracking_number || orderId.substring(0,8)} - ${statusLabels[newStatus] || newStatus}${statusNotes ? `\n📝 Notes: ${statusNotes}` : ''}`,
              link_url: `/delivery/dashboard`,
              metadata: {
                order_id: mainOrder?.id,
                delivery_order_id: orderId,
                status: newStatus,
                notes: statusNotes,
                distributor_id: currentDistributor?.id,
                distributor_name: currentDistributor?.full_name_ar,
              }
            }))
          );
        }
      }

      toast.success(
        isArabic 
          ? `تم تحديث حالة الطلب إلى ${getStatusLabel(newStatus)}` 
          : `Order status updated to ${getStatusLabel(newStatus)}`
      );
      await refetchOrders();
      await refetchDistributors();
      setIsStatusDialogOpen(false);
      setStatusNotes("");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        isArabic ? "حدث خطأ في تحديث الحالة" : "Error updating status"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      assigned: isArabic ? "تم التعيين" : "Assigned",
      picked_up: isArabic ? "تم الاستلام" : "Picked up",
      in_transit: isArabic ? "قيد التوصيل" : "In Transit",
      delivered: isArabic ? "تم التوصيل" : "Delivered",
      cancelled: isArabic ? "ملغي" : "Cancelled",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
      assigned: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
      picked_up: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
      in_transit: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
      delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[status] || "bg-slate-500/10 text-slate-500";
  };

  const getProductImage = (item: any) => {
    const listing = item.listings || item;
    
    if (item.metadata?.variation_image) {
      return item.metadata.variation_image;
    }
    if (item.metadata?.product_cover) {
      return item.metadata.product_cover;
    }
    if (item.selected_options?.variation_image) {
      return item.selected_options.variation_image;
    }
    if (item.variation_snapshot?.image_url) {
      return item.variation_snapshot.image_url;
    }
    if (item.selected_options?.selected_variation_id) {
      const variations = listing?.variations || [];
      const variation = variations.find((v: any) => v.id === item.selected_options.selected_variation_id);
      if (variation?.image_url) return variation.image_url;
      if (variation?.color_id) {
        const colors = listing?.colors || [];
        const color = colors.find((c: any) => c.id === variation.color_id);
        if (color?.image_url) return color.image_url;
      }
    }
    if (item.selected_variation_id) {
      const variations = listing?.variations || [];
      const variation = variations.find((v: any) => v.id === item.selected_variation_id);
      if (variation?.image_url) return variation.image_url;
      if (variation?.color_id) {
        const colors = listing?.colors || [];
        const color = colors.find((c: any) => c.id === variation.color_id);
        if (color?.image_url) return color.image_url;
      }
      if (variation?.combination) {
        const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
        let colorValue = null;
        for (const key of colorKeys) {
          if (variation.combination[key]) {
            colorValue = variation.combination[key];
            break;
          }
        }
        if (colorValue) {
          const colors = listing?.colors || [];
          const color = colors.find((c: any) => 
            c.color_name_ar === colorValue || c.color_name_en === colorValue
          );
          if (color?.image_url) return color.image_url;
        }
      }
    }
    if (item.variation_combination?.colors) {
      const colorName = item.variation_combination.colors;
      const colors = listing?.colors || [];
      const color = colors.find((c: any) => 
        c.color_name_ar === colorName || c.color_name_en === colorName
      );
      if (color?.image_url) return color.image_url;
    }
    return listing?.cover_url || null;
  };

  const getVariationCombination = (item: any) => {
    if (item.variation_snapshot?.combination) {
      return item.variation_snapshot.combination;
    }
    if (item.metadata?.variation_combination) {
      return item.metadata.variation_combination;
    }
    if (item.variation_combination) {
      return item.variation_combination;
    }
    if (item.selected_options?.variation_combination) {
      return item.selected_options.variation_combination;
    }
    return null;
  };

  const getVariationDisplay = (combination: any) => {
    if (!combination) return null;
    const parts: string[] = [];
    const order = ['colors', 'sizes', 'size', 'color', 'اللون', 'المقاس', 'colour'];
    for (const key of order) {
      if (combination[key]) parts.push(combination[key]);
    }
    for (const [key, value] of Object.entries(combination)) {
      if (!order.includes(key) && value) parts.push(String(value));
    }
    return parts.length > 0 ? parts.join(' • ') : null;
  };

  const { 
    data: orderDetails, 
    isLoading: loadingDetails 
  } = useDeliveryOrderDetails(selectedOrderForDetails?.id);

  const orderItems = orderDetails?.order_items || [];
  const orderData = orderDetails?.order || selectedOrderForDetails?.orders || null;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#0d2e2a]/5 via-white to-[#2a655f]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#0d2e2a]/10">
        
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-[#0d2e2a]/90 via-[#1a4f4a]/85 to-[#2a655f]/80 backdrop-blur-md text-white overflow-hidden shadow-2xl shadow-[#0d2e2a]/20 border-b border-white/10 sticky top-0 z-50">
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
                      {isArabic ? "موزع • متاح" : "Distributor • Available"}
                    </span>
                    <span className="text-[8px] md:text-[10px] text-white/30">|</span>
                    <span className="text-[8px] md:text-[10px] text-white/40 flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5 md:h-3 md:w-3 animate-spin-slow text-yellow-400/60" />
                      {isArabic ? "توصيل سريع" : "Fast Delivery"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-wrap flex-shrink-0">
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

                <Link to="/distributor/messages" className="h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse border-2 border-[#1a4f4a]">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Link>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-9 w-9 md:h-10 md:w-10 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300" onClick={() => {
                      const newLang = isArabic ? "en" : "ar";
                      app.setLang(newLang);
                      toast.success(isArabic ? "تم التبديل إلى الإنجليزية" : "Switched to Arabic");
                    }}>
                      <Languages className="h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                    <p>{isArabic ? "تبديل اللغة" : "Switch Language"}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="w-px h-6 bg-white/10 mx-0.5" />
                <DistributorAccountMenu 
                  userData={{
                    id: app.user?.id || '',
                    full_name: currentDistributor?.full_name_ar || app.user?.name || (isArabic ? 'موزع' : 'Distributor'),
                    phone: currentDistributor?.phone || app.user?.phone || '',
                    avatar_url: currentDistributor?.avatar_url || app.user?.avatar_url || '',
                    role: 'distributor'
                  }}
                  companyName={currentDistributor?.delivery_companies?.name_ar}
                  isArabic={isArabic}
                  showEarnings={false}
                  earnings={0}
                  ordersCount={stats.delivered}
                  rating={currentDistributor?.rating || 0}
                />
              </div>
            </div>
          </div>
        </div>

        {/* DIALOG: الإشعارات */}
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

        {/* STATS CARDS */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <StatCard icon={ClipboardList} label={isArabic ? "الطلبات" : "Orders"} value={stats.total} color="teal" />
            <StatCard icon={Clock} label={isArabic ? "نشطة" : "Active"} value={stats.activeOrders} color="teal" />
            <StatCard icon={CheckCircle} label={isArabic ? "تم التوصيل" : "Delivered"} value={stats.delivered} color="emerald" />
            <StatCard icon={Award} label={isArabic ? "متوسط الوقت" : "Avg Time"} value={`${stats.avgDeliveryTime} ${isArabic ? "د" : "min"}`} color="teal" />
          </div>
        </div>

        {/* ORDERS TAB */}
        <div className="mx-auto max-w-7xl px-4 pb-6">
          <div className="flex items-center justify-between gap-2 border-b border-[#2a655f]/20 mb-6 flex-wrap">
            <button className="flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 border-[#2a655f] text-[#2a655f] dark:text-[#4a9f95] hover:scale-105">
              <Package className="h-4 w-4 animate-bounce-slow text-[#2a655f]" />
              {isArabic ? "الطلبات النشطة" : "Active Orders"}
              {stats.activeOrders > 0 && (
                <Badge className="bg-[#2a655f] text-white border-0 text-[10px] px-1.5 py-0.5 animate-pulse">
                  {stats.activeOrders}
                </Badge>
              )}
            </button>

            <div className="flex items-center gap-2 pb-2">
              <select
                value={activeLimit}
                onChange={(e) => { setActiveLimit(Number(e.target.value)); setActivePage(1); }}
                className="h-9 px-3 rounded-xl border border-[#2a655f]/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/30 transition-all duration-300"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(filteredOrders, 'الطلبات_النشطة')}
                    className="h-9 rounded-xl border-[#2a655f]/20 hover:bg-[#2a655f]/10 transition-all duration-300 group"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
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
                    onClick={() => exportToWord(filteredOrders, 'تقرير_الطلبات_النشطة')}
                    className="h-9 rounded-xl border-[#2a655f]/20 hover:bg-[#2a655f]/10 transition-all duration-300 group"
                  >
                    <FileText className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
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
                    className="h-9 rounded-xl border-[#2a655f]/20 hover:bg-[#2a655f]/10 transition-all duration-300 group"
                  >
                    <Printer className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline text-xs mr-1">{isArabic ? "طباعة" : "Print"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isArabic ? "طباعة التقرير" : "Print Report"}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="animate-in slide-in-from-top-5 duration-300">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[200px] max-w-sm group">
                <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#2a655f] transition-all duration-300 group-focus-within:scale-110" />
                <Input
                  placeholder={isArabic ? "🔍 بحث عن طلب (رقم، اسم، هاتف، عنوان)..." : "🔍 Search orders (ID, name, phone, address)..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ps-9 h-10 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#2a655f] animate-pulse" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-[#2a655f]/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 hover:border-[#2a655f]/40"
                >
                  <option value="all">{isArabic ? "جميع الحالات" : "All status"}</option>
                  <option value="pending">{isArabic ? "قيد المراجعة" : "Pending"}</option>
                  <option value="assigned">{isArabic ? "تم التعيين" : "Assigned"}</option>
                  <option value="picked_up">{isArabic ? "تم الاستلام" : "Picked up"}</option>
                  <option value="in_transit">{isArabic ? "قيد التوصيل" : "In transit"}</option>
                  <option value="delivered">{isArabic ? "تم التوصيل" : "Delivered"}</option>
                </select>
              </div>
            </div>

            {ordersLoading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (<Skeleton key={i} className="h-24 rounded-2xl animate-pulse" />))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#2a655f]/30 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-[1.01]">
                <div className="h-20 w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                  <Package className="h-10 w-10 text-[#2a655f]/40" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {isArabic ? "لا توجد طلبات نشطة" : "No active orders"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {isArabic ? "جميع الطلبات مكتملة أو ملغية" : "All orders are completed or cancelled"}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {paginatedActiveOrders.map((order: any) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      onStatusUpdate={() => {
                        if (!order?.id) {
                          toast.error(isArabic ? "خطأ في الطلب" : "Order error");
                          return;
                        }
                        setSelectedOrder(order);
                        setStatusNotes("");
                        setIsStatusDialogOpen(true);
                      }}
                      onToggleMap={() => {
                        setShowMapOrderId(showMapOrderId === order.id ? null : order.id);
                      }}
                      showMap={showMapOrderId === order.id}
                      distributorLocation={currentDistributor?.latitude && currentDistributor?.longitude ? {
                        lat: currentDistributor.latitude,
                        lng: currentDistributor.longitude
                      } : undefined}
                      onShowDetails={(order) => {
                        console.log("📦 [DEBUG] Order clicked:", order);
                        setSelectedOrderForDetails(order);
                        setShowOrderDetails(true);
                      }}
                      getAvailableStatuses={getAvailableStatuses}
                    />
                  ))}
                </div>

                {totalActivePages > 1 && (
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#2a655f]/20 flex-wrap gap-3">
                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
                      {isArabic ? `صفحة ${activePage} من ${totalActivePages}` : `Page ${activePage} of ${totalActivePages}`}
                      <span className="text-muted-foreground/50">|</span>
                      <span className="text-muted-foreground">
                        {filteredOrders.length} {isArabic ? "طلب" : "orders"}
                      </span>
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActivePage(1)} 
                        disabled={activePage === 1} 
                        className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#2a655f]/10 disabled:opacity-50 transition-all duration-300"
                      >
                        <span className="text-xs font-bold text-[#2a655f]">«</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActivePage(activePage - 1)} 
                        disabled={activePage === 1} 
                        className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#2a655f]/10 disabled:opacity-50 transition-all duration-300"
                      >
                        <ChevronLeft className="h-4 w-4 text-[#2a655f]" />
                      </Button>
                      
                      {Array.from({ length: Math.min(5, totalActivePages) }, (_, i) => {
                        let p;
                        if (totalActivePages <= 5) {
                          p = i + 1;
                        } else if (activePage <= 3) {
                          p = i + 1;
                        } else if (activePage >= totalActivePages - 2) {
                          p = totalActivePages - 4 + i;
                        } else {
                          p = activePage - 2 + i;
                        }
                        return (
                          <Button 
                            key={p} 
                            variant={p === activePage ? "default" : "ghost"} 
                            size="sm" 
                            onClick={() => setActivePage(p)} 
                            className={cn(
                              "h-8 w-8 p-0 rounded-xl text-xs font-medium transition-all duration-300",
                              p === activePage 
                                ? "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/30" 
                                : "hover:bg-[#2a655f]/10 hover:text-[#2a655f]"
                            )}
                          >
                            {p}
                          </Button>
                        );
                      })}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActivePage(activePage + 1)} 
                        disabled={activePage === totalActivePages} 
                        className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#2a655f]/10 disabled:opacity-50 transition-all duration-300"
                      >
                        <ChevronRight className="h-4 w-4 text-[#2a655f]" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setActivePage(totalActivePages)} 
                        disabled={activePage === totalActivePages} 
                        className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#2a655f]/10 disabled:opacity-50 transition-all duration-300"
                      >
                        <span className="text-xs font-bold text-[#2a655f]">»</span>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* HISTORY */}
        <div className="mx-auto max-w-7xl px-4 pb-12">
          <div className="flex items-center justify-between gap-2 border-b border-[#2a655f]/20 mb-6 flex-wrap">
            <button className="flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 border-[#2a655f] text-[#2a655f] dark:text-[#4a9f95] hover:scale-105">
              <Clock className="h-4 w-4 animate-spin-slow text-[#2a655f]" />
              {isArabic ? "تاريخ الطلبات" : "Order History"}
              <Badge className="bg-[#2a655f]/20 text-[#2a655f] border-0 text-[10px]">
                {historyOrders.length}
              </Badge>
            </button>

            <div className="flex items-center gap-2 pb-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(historyOrders, 'تاريخ_الطلبات')}
                    className="h-9 rounded-xl border-[#2a655f]/20 hover:bg-[#2a655f]/10 transition-all duration-300 group"
                  >
                    <FileSpreadsheet className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
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
                    onClick={() => exportToWord(historyOrders, 'تقرير_تاريخ_الطلبات')}
                    className="h-9 rounded-xl border-[#2a655f]/20 hover:bg-[#2a655f]/10 transition-all duration-300 group"
                  >
                    <FileText className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
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
                    className="h-9 rounded-xl border-[#2a655f]/20 hover:bg-[#2a655f]/10 transition-all duration-300 group"
                  >
                    <Printer className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
                    <span className="hidden sm:inline text-xs mr-1">{isArabic ? "طباعة" : "Print"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isArabic ? "طباعة التقرير" : "Print Report"}</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px] max-w-sm group">
              <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#2a655f] transition-all duration-300 group-focus-within:scale-110" />
              <Input
                placeholder={isArabic ? "🔍 بحث في التاريخ (رقم، اسم، هاتف، عنوان)..." : "🔍 Search history (ID, name, phone, address)..."}
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="ps-9 h-10 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 transition-all duration-300"
              />
            </div>
            <select
              value={historyFilter}
              onChange={(e) => { setHistoryFilter(e.target.value); setHistoryPage(1); }}
              className="h-10 px-3 rounded-xl border border-[#2a655f]/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
            >
              <option value="all">{isArabic ? "جميع الحالات" : "All status"}</option>
              <option value="delivered">{isArabic ? "تم التوصيل" : "Delivered"}</option>
              <option value="cancelled">{isArabic ? "ملغي" : "Cancelled"}</option>
            </select>
            <select
              value={historyLimit}
              onChange={(e) => { setHistoryLimit(Number(e.target.value)); setHistoryPage(1); }}
              className="h-10 px-3 rounded-xl border border-[#2a655f]/20 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

          {ordersLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (<Skeleton key={i} className="h-20 rounded-2xl animate-pulse" />))}
            </div>
          ) : historyOrders.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#2a655f]/30">
              <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#2a655f]/40" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isArabic ? "لا توجد طلبات في السجل" : "No orders in history"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? "ستظهر الطلبات المكتملة والملغية هنا" : "Completed and cancelled orders will appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {paginatedHistoryOrders.map((order: any) => (
                <HistoryOrderCard 
                  key={order.id} 
                  order={order} 
                  isArabic={isArabic}
                  app={app}
                  getStatusLabel={getStatusLabel}
                  getStatusColor={getStatusColor}
                  onViewDetails={(order) => {
                    setSelectedOrderForDetails(order);
                    setShowOrderDetails(true);
                  }}
                />
              ))}
              
              {totalHistoryPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-[#2a655f]/20 flex-wrap gap-3">
                  <span className="text-xs text-muted-foreground">
                    {isArabic ? `صفحة ${historyPage} من ${totalHistoryPages}` : `Page ${historyPage} of ${totalHistoryPages}`}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" onClick={() => setHistoryPage(1)} disabled={historyPage === 1} className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#2a655f]/10 disabled:opacity-50 transition-all duration-300">
                      <span className="text-xs font-bold text-[#2a655f]">«</span>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setHistoryPage(historyPage - 1)} disabled={historyPage === 1} className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#2a655f]/10 disabled:opacity-50 transition-all duration-300">
                      <ChevronLeft className="h-4 w-4 text-[#2a655f]" />
                    </Button>
                    {Array.from({ length: Math.min(5, totalHistoryPages) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <Button key={p} variant={p === historyPage ? "default" : "ghost"} size="sm" onClick={() => setHistoryPage(p)} className={cn("h-8 w-8 p-0 rounded-xl text-xs font-medium transition-all duration-300", p === historyPage ? "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/30" : "hover:bg-[#2a655f]/10 hover:text-[#2a655f]")}>
                          {p}
                        </Button>
                      );
                    })}
                    <Button variant="outline" size="sm" onClick={() => setHistoryPage(historyPage + 1)} disabled={historyPage === totalHistoryPages} className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#2a655f]/10 disabled:opacity-50 transition-all duration-300">
                      <ChevronRight className="h-4 w-4 text-[#2a655f]" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setHistoryPage(totalHistoryPages)} disabled={historyPage === totalHistoryPages} className="h-8 w-8 p-0 rounded-xl border-[#2a655f]/30 hover:border-[#2a655f]/50 hover:bg-[#2a655f]/10 disabled:opacity-50 transition-all duration-300">
                      <span className="text-xs font-bold text-[#2a655f]">»</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* STATUS UPDATE DIALOG */}
        {isStatusDialogOpen && selectedOrder && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl border-4 border-[#2a655f] max-h-[90vh] overflow-y-auto">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin-slow text-[#2a655f]" />
                  {isArabic ? "تحديث حالة الطلب" : "Update Order Status"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? `اختر الحالة الجديدة للطلب #${selectedOrder?.tracking_number || selectedOrder?.id?.substring(0, 8)}` : `Select new status for order #${selectedOrder?.tracking_number || selectedOrder?.id?.substring(0, 8)}`}
                </p>
              </div>
              <div className="mt-4">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isArabic ? "ملاحظات (اختياري)" : "Notes (Optional)"}
                </Label>
                <Textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder={isArabic ? "أضف ملاحظات عن حالة الطلب..." : "Add notes about the order status..."}
                  className="mt-1 min-h-[60px] resize-none border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
                  dir={isArabic ? "rtl" : "ltr"}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                {getAvailableStatuses(selectedOrder.status).map((status: string) => {
                  const statusConfig: Record<string, { icon: any, label: string, color: string }> = {
                    assigned: { icon: User, label: isArabic ? "تم التعيين" : "Assigned", color: "border-[#2a655f]" },
                    picked_up: { icon: Package, label: isArabic ? "تم الاستلام" : "Picked up", color: "border-[#2a655f]" },
                    in_transit: { icon: Truck, label: isArabic ? "قيد التوصيل" : "In Transit", color: "border-[#2a655f]" },
                    delivered: { icon: CheckCircle, label: isArabic ? "تم التوصيل" : "Delivered", color: "border-emerald-500" },
                  };
                  const config = statusConfig[status];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <Button 
                      key={status}
                      variant="outline" 
                      className={cn(
                        "h-16 flex flex-col gap-1 transition-all duration-300 hover:scale-105 hover:bg-[#2a655f]/10",
                        config.color,
                        "border-[#2a655f]/30"
                      )}
                      onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? <RefreshCw className="h-5 w-5 animate-spin text-[#2a655f]" /> : <Icon className="h-5 w-5 text-[#2a655f]" />}
                      <span className="text-xs">{config.label}</span>
                    </Button>
                  );
                })}
              </div>
              
              <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
                <p className="text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>
                    {isArabic ? "لا يمكنك الرجوع إلى حالة سابقة. سيتم إرسال إشعارات للمشتري والبائع وشركة التوصيل" : "You cannot go back to a previous status. Notifications will be sent to buyer, seller and delivery company"}
                  </span>
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={() => setIsStatusDialogOpen(false)} className="text-muted-foreground hover:text-foreground">
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ✅✅✅ ORDER DETAILS DIALOG - المُصحح */}
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto border-[#2a655f]/20 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-3">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                {isArabic ? "تفاصيل الطلب" : "Order Details"}
              </DialogTitle>
              <DialogDescription>
                {isArabic ? `الطلب #${selectedOrderForDetails?.tracking_number || selectedOrderForDetails?.id?.substring(0, 8)}` : `Order #${selectedOrderForDetails?.tracking_number || selectedOrderForDetails?.id?.substring(0, 8)}`}
              </DialogDescription>
            </DialogHeader>
            
            {loadingDetails ? (
              <div className="py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#2a655f]" />
                <p className="text-sm text-muted-foreground mt-2">{isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..."}</p>
              </div>
            ) : selectedOrderForDetails ? (
              <div className="space-y-4">
                {/* معلومات الطلب الأساسية - مع formatPrice */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
                  <div>
                    <p className="text-xs text-muted-foreground">{isArabic ? "رقم الطلب" : "Order ID"}</p>
                    <p className="font-semibold text-sm">{selectedOrderForDetails.id.substring(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{isArabic ? "الحالة" : "Status"}</p>
                    <Badge className={cn("border-0", getStatusColor(selectedOrderForDetails.status))}>
                      {getStatusLabel(selectedOrderForDetails.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{isArabic ? "رسوم التوصيل" : "Delivery Fee"}</p>
                    <p className="font-semibold text-sm text-[#2a655f]">
                      {formatPrice(Number(selectedOrderForDetails.delivery_fee || 0), app.currency, app.lang)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{isArabic ? "تاريخ الطلب" : "Date"}</p>
                    <p className="font-semibold text-sm">{new Date(selectedOrderForDetails.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">{isArabic ? "المجموع الكلي" : "Total Amount"}</p>
                    <p className="text-lg font-bold text-[#2a655f]">
                      {formatPrice(
                        Number(orderData?.total_with_delivery || selectedOrderForDetails.cod_amount || orderData?.total || 0),
                        app.currency,
                        app.lang
                      )}
                    </p>
                  </div>
                </div>
                
                {/* عنوان التوصيل */}
                <div className="p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#2a655f]" />
                    {isArabic ? "عنوان التوصيل" : "Delivery Address"}
                  </p>
                  <p className="font-medium text-sm mt-1">
                    {orderData?.delivery_address || selectedOrderForDetails.pickup_address || (isArabic ? "غير محدد" : "Not specified")}
                  </p>
                </div>
                
                {/* معلومات العميل */}
                <div className="p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-[#2a655f]" />
                    {isArabic ? "معلومات العميل" : "Customer Info"}
                  </p>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm font-medium">
                      {orderData?.buyer_name || (isArabic ? "غير معروف" : "Unknown")}
                    </p>
                    {orderData?.buyer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-[#2a655f]" />
                        <span className="text-sm font-mono" dir="ltr">{orderData.buyer_phone}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 px-2 rounded-lg bg-[#2a655f]/10 hover:bg-[#2a655f]/20 text-[#2a655f] transition-all duration-300" 
                          onClick={() => window.location.href = `tel:${orderData.buyer_phone}`}
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span className="text-xs mr-1">{isArabic ? "اتصل" : "Call"}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* المنتجات */}
                <div className="border-t border-[#2a655f]/20 pt-4">
                  <h4 className="font-bold text-sm flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-[#2a655f]" />
                    {isArabic ? "المنتجات" : "Products"}
                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
                      {orderItems.length}
                    </Badge>
                  </h4>
                  
                  {orderItems.length > 0 ? (
                    <div className="space-y-3">
                      {orderItems.map((item: any, index: number) => {
                        const listing = item.listings || item;
                        const imageUrl = getProductImage(item);
                        
                        const itemPrice = Number(item.price) || 0;
                        const itemQuantity = item.quantity || 1;
                        const totalPrice = itemPrice * itemQuantity;
                        
                        const variationCombination = getVariationCombination(item);
                        const hasVariation = !!(variationCombination && Object.keys(variationCombination).length > 0);
                        const variationDisplay = getVariationDisplay(variationCombination);
                        
                        return (
                          <div 
                            key={item.id || index} 
                            className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 transition-all duration-300"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                                {imageUrl ? (
                                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                                    <Package className="h-6 w-6 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-slate-800 dark:text-white">
                                  {isArabic 
                                    ? listing?.title_ar || 'منتج'
                                    : listing?.title_en || listing?.title_ar || 'Product'}
                                </p>
                                
                                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mt-0.5">
                                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                                    <span className="font-medium text-slate-600 dark:text-slate-400">{isArabic ? "الكمية:" : "Qty:"}</span>
                                    <span className="font-bold text-slate-800 dark:text-white">{itemQuantity}</span>
                                  </span>
                                  <span className="text-muted-foreground/30">•</span>
                                  <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{isArabic ? "سعر الوحدة:" : "Unit:"}</span>
                                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                                      {formatPrice(itemPrice, app.currency, app.lang)}
                                    </span>
                                  </span>
                                  {itemQuantity > 1 && (
                                    <>
                                      <span className="text-muted-foreground/30">|</span>
                                      <span className="flex items-center gap-1 bg-[#2a655f]/10 dark:bg-[#2a655f]/20 px-2 py-0.5 rounded-full border border-[#2a655f]/20 dark:border-[#2a655f]/30">
                                        <span className="font-medium text-[#2a655f] dark:text-[#3a8a82]">{isArabic ? "الإجمالي:" : "Total:"}</span>
                                        <span className="font-bold text-[#2a655f] dark:text-[#3a8a82]">
                                          {formatPrice(totalPrice, app.currency, app.lang)}
                                        </span>
                                      </span>
                                    </>
                                  )}
                                  {hasVariation && variationDisplay && (
                                    <>
                                      <span className="text-muted-foreground/30">•</span>
                                      <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 px-2 py-0.5 rounded-full border border-[#2a655f]/10 dark:border-[#2a655f]/20">
                                        <Layers className="h-3 w-3 text-[#2a655f] dark:text-[#3a8a82]" />
                                        {variationDisplay}
                                        {imageUrl && (
                                          <img 
                                            src={imageUrl} 
                                            alt="" 
                                            className="h-4 w-4 rounded-md object-cover border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0 ml-0.5"
                                          />
                                        )}
                                      </span>
                                    </>
                                  )}
                                  {item.metadata?.variation_combination && Object.keys(item.metadata.variation_combination).length > 0 && !variationDisplay && (
                                    <>
                                      <span className="text-muted-foreground/30">•</span>
                                      <span className="text-[9px] text-muted-foreground/70 flex items-center gap-1">
                                        <Layers className="h-2.5 w-2.5" />
                                        {Object.values(item.metadata.variation_combination).join(' • ')}
                                      </span>
                                    </>
                                  )}
                                  {item.selected_options?.selected_color && (
                                    <>
                                      <span className="text-muted-foreground/30">•</span>
                                      <span className="text-[9px] text-muted-foreground/70 flex items-center gap-1 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 px-2 py-0.5 rounded-full">
                                        <span className="font-medium text-[#2a655f]">🎨</span>
                                        {item.selected_options.selected_color}
                                        {item.selected_options.selected_size && ` (${item.selected_options.selected_size})`}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    (() => {
                      const oldOrder = orderData?.order || orderData?.orders || null;
                      const oldListing = oldOrder?.listings || orderData?.listings || null;
                      
                      if (oldListing) {
                        const oldQuantity = oldOrder?.quantity || 1;
                        const oldTotal = oldOrder?.total || 0;
                        
                        const oldImageUrl = oldOrder?.metadata?.variation_image || 
                                           oldOrder?.metadata?.product_cover ||
                                           oldListing?.cover_url || null;
                        
                        const oldVariationCombination = oldOrder?.metadata?.variation_combination ||
                                                       oldOrder?.variation_combination ||
                                                       null;
                        
                        const oldHasVariation = !!(oldVariationCombination && Object.keys(oldVariationCombination).length > 0);
                        const oldVariationDisplay = getVariationDisplay(oldVariationCombination);
                        
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 transition-all duration-300">
                              <div className="h-14 w-14 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                                {oldImageUrl ? (
                                  <img src={oldImageUrl} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                                    <Package className="h-6 w-6 text-slate-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-slate-800 dark:text-white">
                                  {isArabic ? oldListing?.title_ar || 'منتج' : oldListing?.title_en || oldListing?.title_ar || 'Product'}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                  <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                                    <span className="font-medium">{isArabic ? "الكمية:" : "Qty:"}</span>
                                    <span className="font-bold text-slate-800 dark:text-white">{oldQuantity}</span>
                                  </span>
                                  <span className="text-muted-foreground/30">•</span>
                                  <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/30">
                                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{isArabic ? "الإجمالي:" : "Total:"}</span>
                                    <span className="font-bold text-emerald-700 dark:text-emerald-300">
                                      {formatPrice(oldTotal, app.currency, app.lang)}
                                    </span>
                                  </span>
                                  {oldHasVariation && oldVariationDisplay && (
                                    <>
                                      <span className="text-muted-foreground/30">•</span>
                                      <span className="text-[10px] text-muted-foreground/80 flex items-center gap-1 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 px-2 py-0.5 rounded-full border border-[#2a655f]/10 dark:border-[#2a655f]/20">
                                        <Layers className="h-3 w-3 text-[#2a655f] dark:text-[#3a8a82]" />
                                        {oldVariationDisplay}
                                        {oldImageUrl && (
                                          <img src={oldImageUrl} alt="" className="h-4 w-4 rounded-md object-cover border border-slate-200/50 dark:border-slate-700/50 flex-shrink-0 ml-0.5" />
                                        )}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-center py-8 text-muted-foreground">
                            <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">{isArabic ? "لا توجد منتجات في هذا الطلب" : "No products in this order"}</p>
                          </div>
                        );
                      }
                    })()
                  )}
                </div>
                
                {/* ملاحظات الطلب */}
                {orderData?.notes && (
                  <div className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30">
                    <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                      <MessageCircle className="h-3.5 w-3.5" />
                      {isArabic ? "ملاحظات العميل" : "Customer Notes"}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{orderData.notes}</p>
                  </div>
                )}
                
                {/* سبب الرفض */}
                {selectedOrderForDetails.status === "rejected" && selectedOrderForDetails.rejection_reason && (
                  <div className="p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30">
                    <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                      <XCircle className="h-3.5 w-3.5" />
                      {isArabic ? "سبب الرفض" : "Rejection Reason"}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{selectedOrderForDetails.rejection_reason}</p>
                  </div>
                )}
                
                {/* ✅✅✅ إجمالي الطلب مع الخصم - مع formatPrice */}
                {(() => {
                  const subtotal = orderData?.total || orderData?.totals?.subtotal || 0;
                  const deliveryFee = orderData?.delivery_fee || orderData?.totals?.delivery_fee || 0;
                  const promoDiscount = orderData?.promo_discount || orderData?.totals?.promo_discount || 0;
                  const totalWithDelivery = orderData?.total_with_delivery || orderData?.totals?.total_with_delivery || (subtotal + deliveryFee - promoDiscount);
                  const currency = orderData?.currency || orderData?.totals?.currency || app.currency || 'SYP';
                  const totalItems = orderItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 1;
                  
                  const hasDiscount = promoDiscount > 0;
                  const isFreeDelivery = deliveryFee === 0;
                  
                  return (
                    <div className="p-4 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/20 dark:border-[#2a655f]/30">
                      {/* المجموع الفرعي */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">
                          {isArabic ? "المجموع الفرعي" : "Subtotal"}
                        </span>
                        <span className="text-lg font-bold text-[#0d2e2a] dark:text-[#3a8a82]">
                          {formatPrice(subtotal, currency, app.lang)}
                        </span>
                      </div>
                      
                      {/* سعر التوصيل */}
                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#2a655f]/10">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          {isFreeDelivery ? (
                            <>
                              <Gift className="h-4 w-4 text-emerald-500" />
                              <span className="font-medium text-emerald-600">{isArabic ? "التوصيل" : "Delivery"}</span>
                            </>
                          ) : (
                            isArabic ? "سعر التوصيل" : "Delivery Fee"
                          )}
                          {isFreeDelivery && (
                            <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[9px] animate-pulse">
                              🎁 {isArabic ? "مجاني" : "Free"}
                            </Badge>
                          )}
                        </span>
                        <span className={cn(
                          "text-sm font-medium",
                          isFreeDelivery 
                            ? "text-emerald-500 font-bold" 
                            : "text-[#0d2e2a] dark:text-[#3a8a82]"
                        )}>
                          {isFreeDelivery 
                            ? "🆓 مجاني"
                            : formatPrice(deliveryFee, currency, app.lang)
                          }
                        </span>
                      </div>
                      
                      {/* الخصم */}
                      {hasDiscount && (
                        <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#2a655f]/10 text-emerald-500">
                          <span className="text-sm flex items-center gap-1.5">
                            <Percent className="h-4 w-4 text-emerald-500" />
                            {isArabic ? "💚 الخصم (كود خصم)" : "💚 Discount (Promo Code)"}
                            <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[9px]">
                              -{Math.round((promoDiscount / (subtotal + deliveryFee)) * 100)}%
                            </Badge>
                          </span>
                          <span className="text-sm font-bold">
                            -{formatPrice(promoDiscount, currency, app.lang)}
                          </span>
                        </div>
                      )}
                      
                      {/* توصيل مجاني + خصم */}
                      {hasDiscount && isFreeDelivery && (
                        <div className="flex items-center gap-2 mt-2 p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-3 duration-300">
                          <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
                          <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                            {isArabic 
                              ? "🎉 تم تطبيق كود الخصم + التوصيل المجاني!"
                              : "🎉 Promo code applied + Free delivery!"}
                          </span>
                        </div>
                      )}
                      
                      {/* فقط توصيل مجاني */}
                      {isFreeDelivery && !hasDiscount && (
                        <div className="flex items-center gap-2 mt-2 p-2.5 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200/50 dark:border-blue-800/30 animate-in fade-in slide-in-from-top-3 duration-300">
                          <Gift className="h-4 w-4 text-blue-500 animate-pulse" />
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                            {isArabic 
                              ? "🎁 التوصيل مجاني لهذا الطلب!"
                              : "🎁 Free delivery for this order!"}
                          </span>
                        </div>
                      )}
                      
                      {/* فقط خصم */}
                      {hasDiscount && !isFreeDelivery && (
                        <div className="flex items-center gap-2 mt-2 p-2.5 bg-purple-50/50 dark:bg-purple-950/20 rounded-lg border border-purple-200/50 dark:border-purple-800/30 animate-in fade-in slide-in-from-top-3 duration-300">
                          <Percent className="h-4 w-4 text-purple-500 animate-pulse" />
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
                            {isArabic 
                              ? `💚 تم تطبيق خصم ${Math.round((promoDiscount / (subtotal + deliveryFee)) * 100)}% على الطلب!`
                              : `💚 ${Math.round((promoDiscount / (subtotal + deliveryFee)) * 100)}% discount applied!`}
                          </span>
                        </div>
                      )}
                      
                      {/* الإجمالي الكامل */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-[#2a655f]/20">
                        <span className="text-sm font-semibold text-[#0d2e2a] dark:text-white flex items-center gap-1.5">
                          {isFreeDelivery && <Gift className="h-4 w-4 text-emerald-500" />}
                          {isArabic ? "الإجمالي الكامل" : "Total"}
                        </span>
                        <span className="text-2xl font-bold text-[#0d2e2a] dark:text-[#3a8a82]">
                          {formatPrice(totalWithDelivery, currency, app.lang)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground">
                          {totalItems} {isArabic ? "منتج" : "items"}
                          {hasDiscount && (
                            <span className="ml-2 text-emerald-500">💚 {isArabic ? "خصم" : "discount"}</span>
                          )}
                          {isFreeDelivery && (
                            <span className="ml-2 text-emerald-500">🎁 {isArabic ? "توصيل مجاني" : "free delivery"}</span>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(selectedOrderForDetails.created_at || Date.now()).toLocaleString(
                            isArabic ? "ar-SA" : "en-US",
                            { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#2a655f]" />
                <p className="text-sm text-muted-foreground mt-2">{isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..."}</p>
              </div>
            )}
            
            {/* ✅✅✅ زر إغلاق واحد فقط */}
            <DialogFooter className="border-t border-[#2a655f]/10 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowOrderDetails(false)} 
                className="rounded-xl border-[#2a655f]/20 hover:bg-[#2a655f]/10"
              >
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إغلاق" : "Close"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ديالوج رفع صورة الموزع */}
        {currentDistributor && !currentDistributor.avatar_url && (
          <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
            <DialogContent className="w-[95vw] max-w-md rounded-2xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-slate-900 border-[#2a655f]/30">
              <div className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] p-4 md:p-6 text-white rounded-t-2xl">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative">
                    <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                      <Camera className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                    <div className="absolute -inset-1 rounded-2xl bg-[#d4af37]/30 blur-lg animate-pulse" />
                  </div>
                  <div>
                    <DialogTitle className="text-lg md:text-2xl font-bold">
                      {isArabic ? "📸 أضف صورة ملفك الشخصي" : "📸 Add Your Profile Picture"}
                    </DialogTitle>
                    <p className="text-white/80 text-xs md:text-sm mt-0.5">
                      {isArabic 
                        ? "ساعد العملاء على التعرف عليك بشكل أفضل"
                        : "Help customers recognize you better"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div className="flex flex-col items-center gap-3 md:gap-4">
                  <div className="relative">
                    <div className="h-28 w-28 md:h-32 md:w-32 rounded-full border-4 border-dashed border-[#2a655f]/30 bg-[#2a655f]/5 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-[#2a655f]/50 group">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-muted-foreground">
                          <Camera className="h-8 w-8 md:h-10 md:w-10 text-[#2a655f]/30 group-hover:text-[#2a655f]/50 transition-colors" />
                          <span className="text-[10px] md:text-xs">{isArabic ? "اختر صورة" : "Choose image"}</span>
                        </div>
                      )}
                    </div>
                    {avatarPreview && (
                      <button
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        className="absolute -top-1 -right-1 h-5 w-5 md:h-6 md:w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-all duration-300 hover:scale-110 shadow-lg"
                      >
                        <X className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-[#2a655f]/30 hover:bg-[#2a655f]/10 transition-all duration-300 h-9 md:h-10 text-sm"
                    onClick={() => document.getElementById('avatar-input')?.click()}
                  >
                    <Camera className="h-3 w-3 md:h-4 md:w-4 mr-2 text-[#2a655f]" />
                    {avatarPreview 
                      ? (isArabic ? "تغيير الصورة" : "Change image") 
                      : (isArabic ? "اختر صورة من جهازك" : "Choose image from your device")}
                  </Button>
                  <input
                    id="avatar-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setAvatarFile(file);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setAvatarPreview(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  <p className="text-[10px] md:text-xs text-muted-foreground text-center">
                    {isArabic 
                      ? "📷 يفضل استخدام صورة واضحة بحجم 500x500 بكسل على الأقل"
                      : "📷 Use a clear image at least 500x500 pixels"}
                  </p>
                </div>

                <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30">
                  <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs md:text-sm font-medium text-amber-700 dark:text-amber-300">
                      {isArabic ? "⚠️ صورة الموزع مهمة جداً" : "⚠️ Distributor photo is very important"}
                    </p>
                    <p className="text-[10px] md:text-xs text-amber-600/80 dark:text-amber-400/70">
                      {isArabic
                        ? "ستظهر هذه الصورة للعملاء عند اختيار الموزع المناسب لتوصيل طلباتهم"
                        : "This photo will appear to customers when choosing the right distributor for their orders"}
                    </p>
                  </div>
                </div>

                <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <p className="text-[10px] md:text-xs font-medium text-muted-foreground mb-2 md:mb-3">
                    {isArabic ? "📌 كيف ستبدو صورته للعملاء:" : "📌 How it will look to customers:"}
                  </p>
                  <div className="flex items-center gap-3 md:gap-4 p-2 md:p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-[#2a655f]/20 flex items-center justify-center flex-shrink-0">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Preview" 
                          className="h-full w-full object-cover rounded-full"
                        />
                      ) : (
                        <Users className="h-5 w-5 md:h-6 md:w-6 text-[#2a655f]/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs md:text-sm">
                        {currentDistributor?.full_name_ar || currentDistributor?.full_name_en || isArabic ? "الموزع" : "Distributor"}
                      </p>
                      <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-muted-foreground">
                        <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-yellow-400 text-yellow-400" />
                        <span>{currentDistributor?.rating || 0}</span>
                        <span className="text-muted-foreground/30">|</span>
                        <Package className="h-2.5 w-2.5 md:h-3 md:w-3" />
                        <span>{currentDistributor?.completed_orders || 0} {isArabic ? "طلب" : "orders"}</span>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[8px] md:text-[9px]">
                      ● {isArabic ? "متاح" : "Available"}
                    </Badge>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-3 md:p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30 gap-2 flex-col sm:flex-row rounded-b-2xl">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAvatarDialog(false);
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }}
                  className="w-full sm:w-auto rounded-xl h-9 md:h-10 text-sm border-[#2a655f]/30 hover:bg-[#2a655f]/10"
                  disabled={isUploadingAvatar}
                >
                  <X className="h-3 w-3 md:h-4 md:w-4 mr-1.5" />
                  {isArabic ? "تخطي الآن" : "Skip for now"}
                </Button>
                <Button
                  onClick={handleUploadAvatar}
                  disabled={!avatarFile || isUploadingAvatar}
                  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white shadow-lg shadow-[#2a655f]/30 transition-all duration-300 h-9 md:h-10 text-sm"
                >
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                      {isArabic ? "جاري الرفع..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      <Camera className="h-3 w-3 md:h-4 md:w-4 mr-2" />
                      {isArabic ? "رفع الصورة" : "Upload Image"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <style>{`
          @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 4s linear infinite; }
          @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
          @keyframes drive-across { 0% { transform: translateX(-20%); } 100% { transform: translateX(120%); } }
          .animate-drive-across { animation: drive-across 14s linear infinite; }
          @keyframes bounce-truck { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-4px) rotate(-1deg); } 75% { transform: translateY(-4px) rotate(1deg); } }
          .animate-bounce-truck { animation: bounce-truck 2.5s ease-in-out infinite; }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          .animate-float { animation: float 3s ease-in-out infinite; }
          @keyframes gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease-in-out infinite; }
          @keyframes ping { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2); opacity: 0; } }
          .animate-ping { animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; }
          @keyframes float-logo { 0%, 100% { transform: translateY(0px) rotate(0deg); } 25% { transform: translateY(-6px) rotate(-2deg); } 75% { transform: translateY(4px) rotate(2deg); } }
          .animate-float-logo { animation: float-logo 4s ease-in-out infinite; }
          @keyframes pulse-glow { 0%, 100% { filter: drop-shadow(0 0 15px rgba(212,175,55,0.3)); } 50% { filter: drop-shadow(0 0 30px rgba(212,175,55,0.6)); } }
          .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
          @keyframes pulse-slow { 0%, 100% { opacity: 0.3; transform: scale(0.95); } 50% { opacity: 0.6; transform: scale(1.05); } }
          .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
          @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
          .animate-shimmer { animation: shimmer 3s infinite; }
        `}</style>
      </div>
    </TooltipProvider>
  );
}

// ============================================================
// 📦 StatCard Component
// ============================================================
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string; }) {
  const colors: Record<string, string> = {
    teal: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 hover:border-[#2a655f]/40",
    emerald: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:border-emerald-500/40",
    gold: "bg-[#d4af37]/10 text-[#d4af37] border-[#d4af37]/20 hover:border-[#d4af37]/40",
  };
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-[#2a655f]/30 transition-all duration-300 hover:scale-[1.03] group cursor-pointer">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground group-hover:text-[#2a655f] transition-colors duration-300">{label}</p>
          <p className="text-xl font-bold mt-1 text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-300">{value}</p>
        </div>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300", colors[color], "group-hover:scale-110 group-hover:rotate-12")}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 OrderCard Component
// ============================================================
const OrderCard = React.memo(function OrderCard({ 
  order, 
  onStatusUpdate, 
  onToggleMap, 
  showMap,
  distributorLocation,
  onShowDetails,
  getAvailableStatuses
}: { 
  order: any; 
  onStatusUpdate: () => void;
  onToggleMap: () => void;
  showMap: boolean;
  distributorLocation?: { lat: number; lng: number };
  onShowDetails?: (order: any) => void;
  getAvailableStatuses?: (status: string) => string[];
}) {
  const app = useApp();
  const navigate = useNavigate();
  const isArabic = app.lang === "ar";

  const { 
    data: orderDetails, 
    isLoading: loadingDetails 
  } = useDeliveryOrderDetails(order.id);

  const getCustomerName = () => {
    if (orderDetails?.buyer?.name) {
      return orderDetails.buyer.name;
    }
    if (orderDetails?.order?.buyer_name) {
      return orderDetails.order.buyer_name;
    }
    if (order?.orders?.buyer_name) {
      return order.orders.buyer_name;
    }
    if (order?.buyer_name) {
      return order.buyer_name;
    }
    if (orderDetails?.buyer_name) {
      return orderDetails.buyer_name;
    }
    return isArabic ? "عميل" : "Customer";
  };

  const getTotal = () => {
    if (orderDetails?.totals) {
      return orderDetails.totals.total_with_delivery || 
             orderDetails.totals.subtotal || 
             0;
    }
    if (order?.orders?.total_with_delivery) {
      return order.orders.total_with_delivery;
    }
    if (order?.orders?.total) {
      return order.orders.total;
    }
    return order.cod_amount || 0;
  };

  const getDeliveryFee = () => {
    if (orderDetails?.totals) {
      return orderDetails.totals.delivery_fee || 0;
    }
    return order.delivery_fee || 0;
  };

  const getCustomerPhone = () => {
    if (orderDetails?.buyer?.phone) {
      return orderDetails.buyer.phone;
    }
    if (orderDetails?.order?.buyer_phone) {
      return orderDetails.order.buyer_phone;
    }
    if (order?.orders?.buyer_phone) {
      return order.orders.buyer_phone;
    }
    if (order?.buyer_phone) {
      return order.buyer_phone;
    }
    return null;
  };

  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [fullscreenMapAddress, setFullscreenMapAddress] = useState<string | null>(null);
  const [fullscreenOrder, setFullscreenOrder] = useState<any>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
      assigned: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
      picked_up: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
      in_transit: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
      delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[status] || "bg-slate-500/10 text-slate-500";
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      assigned: isArabic ? "تم التعيين" : "Assigned",
      picked_up: isArabic ? "تم الاستلام" : "Picked up",
      in_transit: isArabic ? "قيد التوصيل" : "In Transit",
      delivered: isArabic ? "تم التوصيل" : "Delivered",
      cancelled: isArabic ? "ملغي" : "Cancelled",
    };
    return labels[status] || status;
  };

  const statusColors: Record<string, string> = {
    pending: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
    assigned: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
    picked_up: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
    in_transit: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
    delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const statusLabels: Record<string, string> = {
    assigned: isArabic ? "تم التعيين" : "Assigned",
    picked_up: isArabic ? "تم الاستلام" : "Picked up",
    in_transit: isArabic ? "قيد التوصيل" : "In Transit",
    delivered: isArabic ? "تم التوصيل" : "Delivered",
    cancelled: isArabic ? "ملغي" : "Cancelled",
  };

  const canUpdate = ["pending", "assigned", "picked_up", "in_transit"].includes(order.status);
  const address = order.delivery_address || order.pickup_address;
  const buyerPhone = getCustomerPhone();

  return (
    <>
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg hover:border-[#2a655f]/40 transition-all duration-300 hover:scale-[1.01] group">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-[#2a655f]/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0">
              <Package className="h-5 w-5 text-[#2a655f] dark:text-[#4a9f95] group-hover:scale-110 transition-all duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors duration-300">
                  #{order.tracking_number || order.id.substring(0, 8)}
                </p>
                <Badge className={cn("border transition-all duration-300 hover:scale-105", statusColors[order.status] || "bg-slate-500/10 text-slate-500")}>
                  {statusLabels[order.status] || order.status}
                </Badge>
                {order.status === "pending" && (
                  <Badge className="bg-yellow-500/20 text-yellow-600 border-0 text-[9px] animate-pulse">
                    {isArabic ? "جديد" : "New"}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <User className="h-3 w-3 text-[#2a655f]" />
                  {loadingDetails ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    getCustomerName()
                  )}
                </span>
                
                <span className="text-muted-foreground/30">|</span>
                
                <span className="flex items-center gap-1 group-hover:text-[#2a655f] transition-colors duration-300">
                  <MapPin className="h-3 w-3 group-hover:scale-110 transition-transform duration-300" />
                  <span className="truncate max-w-[150px]">
                    {address?.substring(0, 30) || (isArabic ? "عنوان غير محدد" : "No address")}
                  </span>
                </span>
                <span className="text-muted-foreground/30">|</span>
                
                <span className="flex items-center gap-1">
                  <Truck className="h-3 w-3 text-[#2a655f]" />
                  <span className="font-medium">{isArabic ? "توصيل:" : "Delivery:"}</span>
                  <span className="font-bold text-[#2a655f]">
                    {getDeliveryFee() === 0 
                      ? (isArabic ? "🆓 مجاني" : "🆓 Free")
                      : formatPrice(Number(getDeliveryFee()), app.currency, app.lang)
                    }
                  </span>
                </span>
                <span className="text-muted-foreground/30">|</span>
                
                <span className="flex items-center gap-1">
                  <Wallet className="h-3 w-3 text-[#2a655f]" />
                  <span className="font-medium">{isArabic ? "الإجمالي:" : "Total:"}</span>
                  <span className="font-bold text-[#2a655f]">
                    {formatPrice(Number(getTotal()), app.currency, app.lang)}
                  </span>
                </span>
                <span className="text-muted-foreground/30">|</span>
                
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {buyerPhone && (
                  <>
                    <span className="text-muted-foreground/30">|</span>
                    <Button
                      size="sm"
                      className="h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/50 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-emerald-500/60 border-0 flex items-center gap-2.5 text-sm animate-pulse-glow"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (buyerPhone) {
                          window.location.href = `tel:${buyerPhone}`;
                        }
                      }}
                    >
                      <Phone className="h-4 w-4" />
                      <span className="hidden sm:inline">{isArabic ? "اتصل بالعميل" : "Call Customer"}</span>
                      <span className="inline sm:hidden">{isArabic ? "اتصل" : "Call"}</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 flex-wrap">
            {canUpdate && (
              <Button 
                size="sm" 
                className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white transition-all duration-300 hover:scale-105 text-xs shadow-lg shadow-[#0d2e2a]/20"
                onClick={onStatusUpdate}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1 group-hover:rotate-180 transition-all duration-500" />
                {isArabic ? "تحديث" : "Update"}
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-3 rounded-xl transition-all duration-300 hover:scale-105 text-xs border-[#2a655f]/30 hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50"
              onClick={() => {
                if (onShowDetails) {
                  onShowDetails(order);
                }
              }}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-1" />
              {isArabic ? "التفاصيل" : "Details"}
            </Button>
            
            {address && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 rounded-xl transition-all duration-300 hover:scale-105 text-xs hover:bg-[#2a655f]/10 border-[#2a655f]/20"
                onClick={() => {
                  setFullscreenMapAddress(address);
                  setFullscreenOrder(order);
                  setIsMapFullscreen(true);
                }}
              >
                <Maximize2 className="h-3.5 w-3.5 mr-1 text-[#2a655f]" />
                {isArabic ? "خريطة" : "Map"}
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 px-4 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-600 hover:text-indigo-700 transition-all duration-300 hover:scale-110 border border-indigo-500/30 hover:border-indigo-500/50 flex items-center gap-2 text-xs font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
              onClick={(e) => {
                e.stopPropagation();
                const trackingId = order.tracking_number || order.id;
                if (trackingId) {
                  navigate({ to: `/tracking/${trackingId}` });
                } else {
                  toast.error(isArabic ? "لا يوجد رقم تتبع للطلب" : "No tracking number for this order");
                }
              }}
            >
              <Navigation className="h-4 w-4" />
              {isArabic ? "تتبع الطلب" : "Track Order"}
            </Button>
          </div>
        </div>

        {showMap && address && (
          <div className="mt-4 animate-in slide-in-from-top-3 duration-300 z-10 relative">
            <OrderTrackingMap 
              deliveryAddress={address}
              pickupAddress={order.pickup_address}
              distributorLocation={distributorLocation}
              order={order}
              isFullscreen={false}
            />
          </div>
        )}
      </div>

      {/* Fullscreen Map */}
      {isMapFullscreen && fullscreenMapAddress && (
        <div className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-md flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl mx-auto p-2 md:p-4">
            <button
              onClick={() => {
                setIsMapFullscreen(false);
                setFullscreenMapAddress(null);
                setFullscreenOrder(null);
              }}
              className="fixed top-4 left-4 z-[9999999] bg-black/80 hover:bg-black text-white rounded-full p-3 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2 backdrop-blur-sm border-2 border-white/20 hover:border-white/40"
            >
              <ArrowLeft className="h-6 w-6 md:h-7 md:w-7" />
              <span className="text-sm font-medium hidden sm:inline">
                {isArabic ? "رجوع" : "Back"}
              </span>
            </button>
            <button
              onClick={() => {
                setIsMapFullscreen(false);
                setFullscreenMapAddress(null);
                setFullscreenOrder(null);
              }}
              className="fixed top-4 right-4 z-[9999999] bg-red-500 hover:bg-red-600 text-white rounded-full p-3 md:p-4 shadow-2xl transition-all duration-300 hover:scale-110"
            >
              <X className="h-6 w-6 md:h-7 md:w-7" />
            </button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 dark:bg-slate-900/95 rounded-2xl px-6 py-3 shadow-2xl max-w-[80%] border border-[#2a655f]/20">
              <p className="text-sm md:text-base font-medium text-slate-900 dark:text-white flex items-center gap-3">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 text-[#2a655f] flex-shrink-0" />
                <span className="truncate font-bold">{fullscreenMapAddress}</span>
              </p>
            </div>
            <div className="w-full h-full rounded-xl md:rounded-2xl overflow-hidden border-2 border-[#2a655f]/30 shadow-2xl">
              <OrderTrackingMap 
                deliveryAddress={fullscreenMapAddress}
                pickupAddress={fullscreenOrder?.pickup_address}
                distributorLocation={distributorLocation}
                order={fullscreenOrder || order}
                isFullscreen={true}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
});

// ============================================================
// 📦 HistoryOrderCard Component
// ============================================================
function HistoryOrderCard({ 
  order, 
  isArabic,
  app,
  getStatusLabel,
  getStatusColor,
  onViewDetails
}: { 
  order: any; 
  isArabic: boolean;
  app: any;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  onViewDetails?: (order: any) => void;
}) {
  const navigate = useNavigate();
  const address = order.delivery_address || order.pickup_address;
  
  const { 
    data: orderDetails, 
    isLoading: loadingDetails 
  } = useDeliveryOrderDetails(order.id);

  const getCustomerName = () => {
    if (orderDetails?.buyer?.name) {
      return orderDetails.buyer.name;
    }
    if (orderDetails?.order?.buyer_name) {
      return orderDetails.order.buyer_name;
    }
    if (order?.orders?.buyer_name) {
      return order.orders.buyer_name;
    }
    if (order?.buyer_name) {
      return order.buyer_name;
    }
    if (orderDetails?.buyer_name) {
      return orderDetails.buyer_name;
    }
    return isArabic ? "عميل" : "Customer";
  };

  const getTotal = () => {
    if (orderDetails?.totals) {
      return orderDetails.totals.total_with_delivery || 
             orderDetails.totals.subtotal || 
             0;
    }
    if (order?.orders?.total_with_delivery) {
      return order.orders.total_with_delivery;
    }
    if (order?.orders?.total) {
      return order.orders.total;
    }
    return order.cod_amount || 0;
  };

  const statusColors: Record<string, string> = {
    pending: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
    assigned: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
    picked_up: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
    in_transit: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20",
    delivered: "bg-emerald-500/20 text-emerald-600 border-emerald-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  const statusLabels: Record<string, string> = {
    assigned: isArabic ? "تم التعيين" : "Assigned",
    picked_up: isArabic ? "تم الاستلام" : "Picked up",
    in_transit: isArabic ? "قيد التوصيل" : "In Transit",
    delivered: isArabic ? "تم التوصيل" : "Delivered",
    cancelled: isArabic ? "ملغي" : "Cancelled",
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-3 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md hover:border-[#2a655f]/40 transition-all duration-300 hover:scale-[1.005] group">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-8 w-8 rounded-lg bg-[#2a655f]/10 flex items-center justify-center group-hover:scale-110 transition-all duration-300 shrink-0">
            <Package className="h-4 w-4 text-[#2a655f] dark:text-[#4a9f95]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm text-slate-900 dark:text-white">
                #{order.tracking_number || order.id.substring(0, 8)}
              </p>
              <Badge className={cn("border-0 text-[9px] px-2 py-0.5", statusColors[order.status] || "bg-slate-500/10 text-slate-500")}>
                {statusLabels[order.status] || order.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                <User className="h-3 w-3 text-[#2a655f]" />
                {loadingDetails ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  getCustomerName()
                )}
              </span>
              
              <span className="text-muted-foreground/30">|</span>
              
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {address?.substring(0, 25) || (isArabic ? "عنوان غير محدد" : "No address")}
              </span>
              <span className="text-muted-foreground/30">|</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(order.created_at).toLocaleDateString()}
              </span>
              <span className="text-muted-foreground/30">|</span>
              
              <span className="flex items-center gap-1">
                <Truck className="h-3 w-3 text-[#2a655f]" />
                <span className="font-medium">{isArabic ? "توصيل:" : "Delivery:"}</span>
                <span className="font-bold text-[#2a655f]">
                  {formatPrice(Number(order.delivery_fee || 0), app.currency, app.lang)}
                </span>
              </span>
              <span className="text-muted-foreground/30">|</span>
              
              <span className="flex items-center gap-1">
                <Wallet className="h-3 w-3 text-[#2a655f]" />
                <span className="font-medium">{isArabic ? "الإجمالي:" : "Total:"}</span>
                <span className="font-bold text-[#2a655f]">
                  {formatPrice(Number(getTotal()), app.currency, app.lang)}
                </span>
              </span>
              <span className="text-muted-foreground/30">|</span>
              
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 px-2 rounded-lg hover:bg-[#2a655f]/10 transition-all duration-300 text-xs"
            onClick={() => {
              if (onViewDetails) {
                onViewDetails(order);
              } else {
                const trackingId = order.tracking_number || order.id;
                if (trackingId) {
                  navigate({ to: `/tracking/${trackingId}` });
                }
              }
            }}
          >
            <Eye className="h-3.5 w-3.5 mr-1 text-[#2a655f]" />
            {isArabic ? "عرض" : "View"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ✅ دالة formatTime
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