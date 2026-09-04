// src/components/dashboard/admin/AdminNotifications.tsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "@/lib/i18n";
import { 
  Bell, Send, Users, Store, Package, Calendar, CheckCircle, XCircle,
  Clock, Filter, Search, RefreshCw, Eye, EyeOff, Trash2, Plus,
  AlertCircle, MapPin, Globe, Loader2, Settings, TrendingUp,
  Sparkles, Gift, Star, Check, X, ShoppingBag, Megaphone,
  User, UserCheck, UserX, Target, Rocket, Crown, Zap, Flame,
  ChevronDown, Layers, Building2, Phone, Mail, AtSign, Image as ImageIcon,
  Upload, FolderOpen, Shield, Link2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import {
  useUserNotifications,
  useSendBulkNotificationsV2,
  useMarkNotificationReadV2,
  useDeleteNotificationV2,
  useUserNotificationsStats,
} from "@/lib/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// ✅ استيراد نظام الإشعارات المركزي
import { NOTIFICATION_CONFIG, NOTIFICATION_TYPES, NotificationType as NotificationTypeV2 } from "@/types/notificationTypes";

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  oliveVeryLight: '#e8f0ee',
  pink: '#f9a8d4',
  pinkLight: '#fbcfe8',
  pinkDark: '#f48fb1',
  pinkVeryLight: '#fdf2f8',
  fuchsia: '#d81b60',
  fuchsiaDark: '#c2185b',
  fuchsiaGlow: 'rgba(216,27,96,0.2)',
};

// ============================================================
// الأنواع
// ============================================================

type TargetType = 'all' | 'customers' | 'sellers' | 'specific' | 'governorate' | 'new_users' | 'active_users';

interface UserTarget {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  store_name: string | null;
  governorate_id: string | null;
  governorate_name?: string;
  email?: string;
  is_seller?: boolean;
}

interface Governorate {
  id: string;
  name_ar: string;
  name_en: string;
}

interface NotificationFormData {
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  type: NotificationTypeV2;
  target: TargetType;
  governorate_ids: string[];
  specific_users: UserTarget[];
  link_url: string;
  image_url: string;
  image_file: File | null;
  scheduled_for: string;
}

// ✅ خريطة الأيقونات للإشعارات
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
  'bell': Bell,
};

// ✅ دالة للحصول على إعدادات الإشعار
const getNotificationConfig = (type: string) => {
  return NOTIFICATION_CONFIG[type as NotificationTypeV2] || NOTIFICATION_CONFIG[NOTIFICATION_TYPES.SYSTEM];
};

// ============================================================
// مكون الإحصائيات - بتصميم وردي
// ============================================================
const StatsCards = React.memo(({ stats, isArabic }: any) => {
  const items = [
    { 
      key: 'total', 
      label: isArabic ? '📊 الإجمالي' : '📊 Total', 
      value: stats?.total || 0, 
      icon: Bell,
      color: 'text-[#2a655f]',
    },
    { 
      key: 'sent', 
      label: isArabic ? '✅ مرسلة' : '✅ Sent', 
      value: stats?.read || 0, 
      icon: CheckCircle,
      color: 'text-emerald-500',
    },
    { 
      key: 'unread', 
      label: isArabic ? '📬 غير مقروءة' : '📬 Unread', 
      value: stats?.unread || 0, 
      icon: Clock,
      color: 'text-amber-500',
    },
    { 
      key: 'scheduled', 
      label: isArabic ? '📅 مجدولة' : '📅 Scheduled', 
      value: stats?.scheduled || 0, 
      icon: Calendar,
      color: 'text-[#d81b60]',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div 
          key={item.key} 
          className="group relative bg-[#fbcfe8] dark:bg-[#fbcfe8]/20 rounded-xl border-3 border-[#f9a8d4]/70 dark:border-[#f9a8d4]/40 hover:border-[#d81b60]/60 shadow-sm hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#f9a8d4]/10 to-[#fbcfe8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-[#fbcfe8]/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between p-3">
            <div>
              <p className="text-[10px] font-medium text-[#2a655f] dark:text-[#f9a8d4] uppercase tracking-wider">
                {item.label}
              </p>
              <p className={`text-xl font-bold mt-0.5 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                {item.value}
              </p>
            </div>
            <div className={`h-9 w-9 rounded-lg bg-[#f9a8d4]/30 dark:bg-[#f9a8d4]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#d81b60] to-[#f9a8d4] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        </div>
      ))}
    </div>
  );
});
StatsCards.displayName = 'StatsCards';

export function AdminNotifications() {
  const app = useApp();
  const isRTL = app.lang === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== State =====
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'scheduled' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ===== Form State =====
  const [formData, setFormData] = useState<NotificationFormData>({
    title_ar: '', title_en: '', body_ar: '', body_en: '',
    type: NOTIFICATION_TYPES.ANNOUNCEMENT,
    target: 'all',
    governorate_ids: [], specific_users: [],
    link_url: '', image_url: '', image_file: null,
    scheduled_for: '',
  });

  // ===== Queries (V2) =====
  const { data: notifications = [], refetch: refetchNotifications } = useUserNotifications(app.user?.id, { limit: 10 });
  const { data: stats, refetch: refetchStats } = useUserNotificationsStats(app.user?.id);
  const sendBulkNotification = useSendBulkNotificationsV2();
  const deleteNotification = useDeleteNotificationV2();
  const markRead = useMarkNotificationReadV2();

  // ===== جلب المحافظات =====
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [allUsers, setAllUsers] = useState<UserTarget[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserTarget[]>([]);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersFilterGovernorate, setUsersFilterGovernorate] = useState<string>('all');
  const [usersFilterRole, setUsersFilterRole] = useState<string>('all');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // ===== جلب البيانات =====
  useEffect(() => {
    fetchGovernorates();
    fetchAllUsers();
  }, []);

  const fetchGovernorates = async () => {
    const { data, error } = await supabase
      .from('governorates')
      .select('id, name_ar, name_en')
      .order('sort_order');
    if (!error && data) {
      setGovernorates(data);
    }
  };

  const fetchAllUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, avatar_url, store_name, governorate_id');

      if (profilesError) throw profilesError;

      const { data: sellers, error: sellersError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'seller');

      if (sellersError) throw sellersError;

      const sellerIds = new Set(sellers?.map((s: any) => s.user_id) || []);
      const governorateMap = new Map();
      governorates.forEach(g => governorateMap.set(g.id, g));

      const users = (profiles || []).map((p: any) => ({
        ...p,
        governorate_name: governorateMap.get(p.governorate_id)?.name_ar || '',
        is_seller: sellerIds.has(p.id),
      }));

      setAllUsers(users);
      setFilteredUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // ===== فلترة المستخدمين =====
  useEffect(() => {
    let result = allUsers;

    if (usersSearch.trim()) {
      const q = usersSearch.toLowerCase().trim();
      result = result.filter((u: any) =>
        u.full_name?.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.store_name?.toLowerCase().includes(q)
      );
    }

    if (usersFilterGovernorate !== 'all') {
      result = result.filter((u: any) => u.governorate_id === usersFilterGovernorate);
    }

    if (usersFilterRole === 'seller') {
      result = result.filter((u: any) => u.is_seller === true);
    } else if (usersFilterRole === 'customer') {
      result = result.filter((u: any) => u.is_seller !== true);
    }

    setFilteredUsers(result);
  }, [allUsers, usersSearch, usersFilterGovernorate, usersFilterRole]);

  // ============================================================
  // رفع الصورة
  // ============================================================

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `notifications/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl || '';

      setFormData({ ...formData, image_url: publicUrl, image_file: file });
      setImagePreview(URL.createObjectURL(file));

      toast.success(isRTL ? '✅ تم رفع الصورة بنجاح' : '✅ Image uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(isRTL ? '❌ فشل رفع الصورة' : '❌ Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image_url: '', image_file: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ============================================================
  // فلترة الإشعارات
  // ============================================================

  const filteredNotifications = useMemo(() => {
    let result = notifications;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((n: any) =>
        n.title_ar?.toLowerCase().includes(q) ||
        n.title_en?.toLowerCase().includes(q) ||
        n.body_ar?.toLowerCase().includes(q) ||
        n.body_en?.toLowerCase().includes(q)
      );
    }
    
    if (filterType !== 'all') {
      result = result.filter((n: any) => n.type === filterType);
    }
    
    if (activeTab === 'sent') {
      result = result.filter((n: any) => n.is_sent === true);
    } else if (activeTab === 'scheduled') {
      result = result.filter((n: any) => n.scheduled_for && !n.is_sent);
    } else if (activeTab === 'draft') {
      result = result.filter((n: any) => !n.is_sent && !n.scheduled_for);
    }
    
    return result;
  }, [notifications, searchQuery, filterType, activeTab]);

  // ============================================================
  // إرسال الإشعار (V2)
  // ============================================================
  
const handleSendNotification = async () => {
    if (!formData.title_ar || !formData.body_ar) {
      toast.error(isRTL ? '⚠️ الرجاء ملء العنوان والمحتوى بالعربية' : '⚠️ Please fill title and body in Arabic');
      return;
    }

    setIsSending(true);

    try {
      let userIds: string[] = [];
      
      if (formData.target === 'all') {
        const { data: allUsers } = await supabase.from('profiles').select('id');
        userIds = allUsers?.map((u: any) => u.id) || [];
      } 
      else if (formData.target === 'customers') {
        const { data: sellers } = await supabase.from('user_roles').select('user_id').eq('role', 'seller');
        const sellerIds = new Set(sellers?.map((s: any) => s.user_id) || []);
        const { data: allUsers } = await supabase.from('profiles').select('id');
        userIds = allUsers?.filter((u: any) => !sellerIds.has(u.id)).map((u: any) => u.id) || [];
      }
      else if (formData.target === 'sellers') {
        const { data: sellers } = await supabase.from('user_roles').select('user_id').eq('role', 'seller');
        userIds = sellers?.map((s: any) => s.user_id) || [];
      }
      else if (formData.target === 'governorate' && formData.governorate_ids.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id').in('governorate_id', formData.governorate_ids);
        userIds = profiles?.map((p: any) => p.id) || [];
      }
      else if (formData.target === 'specific' && formData.specific_users.length > 0) {
        userIds = formData.specific_users.map((u: any) => u.id);
      }
      else if (formData.target === 'new_users') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const { data: newUsers } = await supabase.from('profiles').select('id').gte('created_at', thirtyDaysAgo.toISOString());
        userIds = newUsers?.map((u: any) => u.id) || [];
      }
      else if (formData.target === 'active_users') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const { data: activeUsers } = await supabase.from('profiles').select('id').gte('last_seen_at', sevenDaysAgo.toISOString());
        userIds = activeUsers?.map((u: any) => u.id) || [];
      }

      if (userIds.length === 0) {
        toast.warning(isRTL ? '⚠️ لا يوجد مستلمون لهذا الهدف' : '⚠️ No recipients found for this target');
        setIsSending(false);
        return;
      }

      // إرسال الإشعار بدون انتظار (في الخلفية)
      sendBulkNotification.mutateAsync({
        userIds: userIds,
        type: formData.type,
        titleAr: formData.title_ar,
        bodyAr: formData.body_ar,
        titleEn: formData.title_en || formData.title_ar,
        bodyEn: formData.body_en || formData.body_ar,
        linkUrl: formData.link_url || null,
        imageUrl: formData.image_url || null,
        metadata: {
          target: formData.target,
          governorate_ids: formData.governorate_ids,
          scheduled_for: formData.scheduled_for || null,
        }
      }).then(() => {
        toast.success(
          isRTL 
            ? `✅ تم إرسال الإشعار إلى ${userIds.length} مستخدم` 
            : `✅ Notification sent to ${userIds.length} users`
        );
        refetchNotifications();
        refetchStats();
      }).catch((error) => {
        console.error('Error sending notification:', error);
        toast.error(isRTL ? '❌ فشل إرسال الإشعار' : '❌ Failed to send notification');
      });

      // نغلق الـ Dialog فوراً
      setIsCreateDialogOpen(false);
      resetForm();
      
      toast.success(
        isRTL 
          ? `✅ جاري إرسال الإشعار إلى ${userIds.length} مستخدم...` 
          : `✅ Sending notification to ${userIds.length} users...`
      );

    } catch (error: any) {
      console.error('Error preparing notification:', error);
      toast.error(isRTL ? '❌ فشل تجهيز الإشعار' : '❌ Failed to prepare notification');
    } finally {
      setIsSending(false);
    }
  };

  // ============================================================
  // دوال مساعدة
  // ============================================================

  const resetForm = () => {
    setFormData({
      title_ar: '', title_en: '', body_ar: '', body_en: '',
      type: NOTIFICATION_TYPES.ANNOUNCEMENT,
      target: 'all',
      governorate_ids: [], specific_users: [],
      link_url: '', image_url: '', image_file: null,
      scheduled_for: '',
    });
    setImagePreview(null);
    setUsersSearch('');
    setUsersFilterGovernorate('all');
    setUsersFilterRole('all');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا الإشعار؟' : 'Are you sure you want to delete this notification?')) return;
    try {
      await deleteNotification.mutateAsync({ 
        notificationId: id, 
        userId: app.user!.id 
      });
      toast.success(isRTL ? '✅ تم حذف الإشعار' : '✅ Notification deleted');
      refetchNotifications();
      refetchStats();
    } catch (error) {
      toast.error(isRTL ? '❌ فشل حذف الإشعار' : '❌ Failed to delete notification');
    }
  };

  const handleMarkRead = async (id: string, isRead: boolean) => {
    try {
      if (!isRead) {
        await markRead.mutateAsync({ 
          notificationId: id, 
          userId: app.user!.id 
        });
        refetchNotifications();
        refetchStats();
      }
    } catch (error) {
      toast.error(isRTL ? '❌ فشل تحديث الحالة' : '❌ Failed to update status');
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString(
      app.lang === 'ar' ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    );
  };

  // ============================================================
  // دوال التنسيق
  // ============================================================

  const getTargetLabel = (target: string) => {
    const labels: Record<string, { ar: string; en: string }> = {
      all: { ar: 'الجميع', en: 'All Users' },
      customers: { ar: 'العملاء', en: 'Customers' },
      sellers: { ar: 'البائعين', en: 'Sellers' },
      specific: { ar: 'مستخدمين محددين', en: 'Specific Users' },
      governorate: { ar: 'حسب المحافظة', en: 'By Governorate' },
      new_users: { ar: 'مستخدمين جدد', en: 'New Users' },
      active_users: { ar: 'مستخدمين نشطين', en: 'Active Users' },
    };
    return isRTL ? (labels[target]?.ar || target) : (labels[target]?.en || target);
  };

  // ============================================================
  // التصيير
  // ============================================================

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#f9a8d4]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#f9a8d4]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Bell className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {isRTL ? "الإشعارات" : "Notifications"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {stats?.total || 0}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats?.read || 0}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "مرسلة" : "sent"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/50 transition-colors">
              <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span className="text-amber-600 dark:text-amber-400 font-medium">{stats?.unread || 0}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "غير مقروءة" : "unread"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="text-xs text-[#2a655f] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isRTL ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
    <DialogTrigger asChild>
      <Button className="bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] hover:from-[#3a8a82] hover:to-[#f48fb1] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#f9a8d4]/30 rounded-xl border-2 border-[#f9a8d4]/50">
        <Plus className="h-4 w-4 mr-1.5" />
        {isRTL ? 'إشعار جديد' : 'New Notification'}
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto border-3 border-[#f9a8d4]/60 shadow-2xl shadow-[#f9a8d4]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 rounded-2xl">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
        onClick={() => setIsCreateDialogOpen(false)}
      >
        <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
      </Button>
      <div className="p-6">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#f9a8d4]/30 border-2 border-[#f9a8d4]/40">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                {isRTL ? 'إنشاء إشعار جديد' : 'Create New Notification'}
              </DialogTitle>
              <DialogDescription>
                {isRTL 
                  ? 'املأ البيانات لإرسال إشعار للمستخدمين المستهدفين'
                  : 'Fill in the details to send a notification to target users'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          {/* ===== اللغة ===== */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#2a655f] dark:text-white font-semibold flex items-center gap-1">
                {isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}
                <span className="text-[#d81b60]">*</span>
              </Label>
              <Input
                value={formData.title_ar}
                onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                placeholder={isRTL ? 'أدخل عنوان الإشعار' : 'Enter notification title'}
                className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2a655f] dark:text-white font-semibold">
                {isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}
              </Label>
              <Input
                value={formData.title_en}
                onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                placeholder="Enter notification title"
                className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
                dir="ltr"
              />
            </div>
          </div>

          {/* ===== المحتوى ===== */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#2a655f] dark:text-white font-semibold flex items-center gap-1">
                {isRTL ? 'المحتوى (عربي)' : 'Content (Arabic)'}
                <span className="text-[#d81b60]">*</span>
              </Label>
              <Textarea
                value={formData.body_ar}
                onChange={(e) => setFormData({ ...formData, body_ar: e.target.value })}
                placeholder={isRTL ? 'أدخل محتوى الإشعار' : 'Enter notification content'}
                rows={4}
                className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 resize-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[#2a655f] dark:text-white font-semibold">
                {isRTL ? 'المحتوى (إنجليزي)' : 'Content (English)'}
              </Label>
              <Textarea
                value={formData.body_en}
                onChange={(e) => setFormData({ ...formData, body_en: e.target.value })}
                placeholder="Enter notification content"
                rows={4}
                className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 resize-none"
                dir="ltr"
              />
            </div>
          </div>

          <Separator className="bg-[#f9a8d4]/30" />

          {/* ===== النوع ===== */}
          <div className="space-y-2">
            <Label className="text-[#2a655f] dark:text-white font-semibold">
              {isRTL ? 'نوع الإشعار' : 'Notification Type'}
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as NotificationTypeV2 })}
            >
              <SelectTrigger className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300">
                <SelectValue placeholder={isRTL ? 'اختر النوع' : 'Select type'} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
                <SelectItem value={NOTIFICATION_TYPES.ANNOUNCEMENT} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📢 {isRTL ? 'إعلان' : 'Announcement'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.PROMOTION} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🎯 {isRTL ? 'ترويجي' : 'Promotion'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.OFFER} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🎁 {isRTL ? 'عرض خاص' : 'Special Offer'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.MARKETING} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📊 {isRTL ? 'تسويقي' : 'Marketing'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.EVENT} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📅 {isRTL ? 'حدث' : 'Event'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.NEWS} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📰 {isRTL ? 'أخبار' : 'News'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.ORDER_UPDATE} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📦 {isRTL ? 'تحديث طلب' : 'Order Update'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.SYSTEM} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">⚙️ {isRTL ? 'نظام' : 'System'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ===== الهدف ===== */}
          <div className="space-y-2">
            <Label className="text-[#2a655f] dark:text-white font-semibold">
              {isRTL ? 'المستهدفين' : 'Target Audience'}
            </Label>
            <Select
              value={formData.target}
              onValueChange={(value) => setFormData({ ...formData, target: value as TargetType })}
            >
              <SelectTrigger className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300">
                <SelectValue placeholder={isRTL ? 'اختر الفئة المستهدفة' : 'Select target audience'} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
                <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🌍 {isRTL ? 'الجميع' : 'All Users'}</SelectItem>
                <SelectItem value="customers" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🛒 {isRTL ? 'العملاء' : 'Customers'}</SelectItem>
                <SelectItem value="sellers" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🏪 {isRTL ? 'البائعين' : 'Sellers'}</SelectItem>
                <SelectItem value="new_users" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">✨ {isRTL ? 'مستخدمين جدد' : 'New Users'}</SelectItem>
                <SelectItem value="active_users" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🔥 {isRTL ? 'مستخدمين نشطين' : 'Active Users'}</SelectItem>
                <SelectItem value="governorate" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📍 {isRTL ? 'حسب المحافظة' : 'By Governorate'}</SelectItem>
                <SelectItem value="specific" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">👤 {isRTL ? 'مستخدمين محددين' : 'Specific Users'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ===== المحافظات ===== */}
          {formData.target === 'governorate' && (
            <div className="space-y-2 p-4 bg-[#fbcfe8]/60 dark:bg-[#fbcfe8]/20 rounded-xl border-3 border-[#f9a8d4]/70">
              <Label className="text-[#2a655f] dark:text-white font-semibold">
                {isRTL ? 'اختر المحافظات' : 'Select Governorates'}
              </Label>
              <div className="flex flex-wrap gap-2">
                {governorates.map((gov) => (
                  <Badge
                    key={gov.id}
                    variant={formData.governorate_ids.includes(gov.id) ? 'default' : 'outline'}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 rounded-xl transition-all duration-300 hover:scale-105 border-2",
                      formData.governorate_ids.includes(gov.id) 
                        ? "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white border-[#f9a8d4]/50" 
                        : "border-[#f9a8d4]/40 text-[#2a655f] hover:bg-[#f9a8d4]/20"
                    )}
                    onClick={() => {
                      const ids = formData.governorate_ids.includes(gov.id)
                        ? formData.governorate_ids.filter(id => id !== gov.id)
                        : [...formData.governorate_ids, gov.id];
                      setFormData({ ...formData, governorate_ids: ids });
                    }}
                  >
                    {isRTL ? gov.name_ar : gov.name_en}
                    {formData.governorate_ids.includes(gov.id) && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                  </Badge>
                ))}
              </div>
              {formData.governorate_ids.length === 0 && (
                <p className="text-sm text-[#d81b60]">
                  {isRTL ? '⚠️ اختر محافظة واحدة على الأقل' : '⚠️ Select at least one governorate'}
                </p>
              )}
            </div>
          )}

          {/* ===== مستخدمين محددين ===== */}
          {formData.target === 'specific' && (
            <div className="space-y-2 p-4 bg-[#fbcfe8]/60 dark:bg-[#fbcfe8]/20 rounded-xl border-3 border-[#f9a8d4]/70">
              <div className="flex items-center justify-between">
                <Label className="text-[#2a655f] dark:text-white font-semibold">
                  {isRTL ? 'اختر المستخدمين' : 'Select Users'}
                </Label>
                <Badge className="bg-[#f9a8d4]/30 text-[#2a655f] border-2 border-[#f9a8d4]/50 rounded-xl">
                  {formData.specific_users.length} {isRTL ? 'مختار' : 'selected'}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Input
                  value={usersSearch}
                  onChange={(e) => setUsersSearch(e.target.value)}
                  placeholder={isRTL ? '🔍 بحث باسم أو هاتف أو متجر' : '🔍 Search by name, phone or store'}
                  className="flex-1 min-w-[150px] rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
                />
                <Select value={usersFilterGovernorate} onValueChange={setUsersFilterGovernorate}>
                  <SelectTrigger className="w-[140px] rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300">
                    <SelectValue placeholder={isRTL ? 'المحافظة' : 'Governorate'} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
                    <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">{isRTL ? 'كل المحافظات' : 'All Governorates'}</SelectItem>
                    {governorates.map((gov) => (
                      <SelectItem key={gov.id} value={gov.id} className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">
                        {isRTL ? gov.name_ar : gov.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={usersFilterRole} onValueChange={setUsersFilterRole}>
                  <SelectTrigger className="w-[130px] rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300">
                    <SelectValue placeholder={isRTL ? 'الدور' : 'Role'} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
                    <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">{isRTL ? 'الكل' : 'All'}</SelectItem>
                    <SelectItem value="seller" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🏪 {isRTL ? 'بائع' : 'Seller'}</SelectItem>
                    <SelectItem value="customer" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🛒 {isRTL ? 'عميل' : 'Customer'}</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUsersSearch('');
                    setUsersFilterGovernorate('all');
                    setUsersFilterRole('all');
                  }}
                  className="rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isLoadingUsers ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[#2a655f]" />
                </div>
              ) : (
                <ScrollArea className="h-[300px] border-3 border-[#f9a8d4]/40 rounded-xl p-2">
                  {filteredUsers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                      <Users className="h-10 w-10 mb-2" />
                      <p>{isRTL ? 'لا يوجد مستخدمين مطابقين' : 'No matching users'}</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelected = formData.specific_users.some(u => u.id === user.id);
                      return (
                        <div
                          key={user.id}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] border-2",
                            isSelected 
                              ? 'border-[#d81b60] bg-[#f9a8d4]/20' 
                              : 'border-[#f9a8d4]/30 hover:bg-[#f9a8d4]/10'
                          )}
                          onClick={() => {
                            const users = isSelected
                              ? formData.specific_users.filter(u => u.id !== user.id)
                              : [...formData.specific_users, user];
                            setFormData({ ...formData, specific_users: users });
                          }}
                        >
                          <Checkbox 
                            checked={isSelected}
                            className="data-[state=checked]:bg-[#2a655f] data-[state=checked]:border-[#2a655f] border-2 border-[#f9a8d4]/40"
                          />
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white text-xs">
                              {user.full_name?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate text-[#2a655f] dark:text-white">
                                {user.full_name || isRTL ? 'مستخدم' : 'User'}
                              </p>
                              {user.is_seller && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-[#d81b60]/30 text-[#d81b60]">
                                  🏪 {isRTL ? 'بائع' : 'Seller'}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              {user.phone && <span>📱 {user.phone}</span>}
                              {user.store_name && <span>🏷️ {user.store_name}</span>}
                              {user.governorate_name && <span>📍 {user.governorate_name}</span>}
                            </div>
                          </div>
                          {isSelected && <Check className="h-4 w-4 text-[#d81b60] flex-shrink-0" />}
                        </div>
                      );
                    })
                  )}
                </ScrollArea>
              )}

              {formData.specific_users.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t-2 border-[#f9a8d4]/30">
                  <span className="text-xs text-slate-400 flex items-center">
                    {isRTL ? 'المختارين:' : 'Selected:'}
                  </span>
                  {formData.specific_users.map((user) => (
                    <Badge key={user.id} variant="secondary" className="gap-1 px-3 py-1.5 rounded-xl bg-[#f9a8d4]/20 border-2 border-[#f9a8d4]/40 text-[#2a655f]">
                      {user.full_name || user.id.slice(0, 8)}
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-rose-500 transition-colors"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            specific_users: formData.specific_users.filter(u => u.id !== user.id)
                          });
                        }}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          <Separator className="bg-[#f9a8d4]/30" />

          {/* ===== الصورة ===== */}
          <div className="space-y-3">
            <Label className="text-[#2a655f] dark:text-white font-semibold">
              {isRTL ? 'الصورة (اختياري)' : 'Image (Optional)'}
            </Label>
            
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Upload className="h-4 w-4 mr-1.5" />
                )}
                {isRTL ? 'اختر صورة' : 'Choose Image'}
              </Button>
              {formData.image_url && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={removeImage}
                  className="text-rose-500 hover:text-rose-700 rounded-xl border-2 border-rose-300/50 hover:bg-rose-50/50"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  {isRTL ? 'إزالة' : 'Remove'}
                </Button>
              )}
            </div>

            {(imagePreview || formData.image_url) && (
              <div className="relative w-48 h-48 rounded-xl overflow-hidden border-3 border-[#f9a8d4]/50">
                <img
                  src={imagePreview || formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
                  {isRTL ? 'معاينة' : 'Preview'}
                </div>
              </div>
            )}
          </div>

          {/* ===== رابط الإجراء ===== */}
          <div className="space-y-2">
            <Label className="text-[#2a655f] dark:text-white font-semibold">
              {isRTL ? 'رابط الإجراء (اختياري)' : 'Action URL (Optional)'}
            </Label>
            <Input
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="/products/123"
              className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
            />
          </div>

          {/* ===== جدولة الإرسال ===== */}
          <div className="space-y-2">
            <Label className="text-[#2a655f] dark:text-white font-semibold">
              {isRTL ? 'جدولة الإرسال (اختياري)' : 'Schedule Send (Optional)'}
            </Label>
            <Input
              type="datetime-local"
              value={formData.scheduled_for}
              onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
              className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
            />
          </div>
        </div>

        <DialogFooter className="gap-3 pt-4 border-t-3 border-[#f9a8d4]/30">
          <Button 
            variant="outline" 
            onClick={() => setIsCreateDialogOpen(false)}
            className="flex-1 rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
          >
            <X className="h-4 w-4 mr-1.5" />
            {isRTL ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button
            onClick={handleSendNotification}
            disabled={isSending || isUploading}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] hover:from-[#3a8a82] hover:to-[#f48fb1] text-white shadow-lg shadow-[#f9a8d4]/30 transition-all duration-300 hover:scale-[1.02] border-2 border-[#f9a8d4]/50"
          >
            {isSending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                {isRTL ? 'جاري الإرسال...' : 'Sending...'}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-1.5" />
                {formData.scheduled_for 
                  ? (isRTL ? 'جدولة' : 'Schedule') 
                  : (isRTL ? 'إرسال' : 'Send')}
              </>
            )}
          </Button>
        </DialogFooter>
      </div>
    </DialogContent>
  </Dialog>
</div>
      </div>

      {/* ===== STATS ===== */}
      <StatsCards stats={stats} isArabic={isRTL} />

      {/* ===== FILTERS - بوردرات وردية ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#d81b60] transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? '🔍 بحث في الإشعارات...' : '🔍 Search notifications...'}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-3 border-[#f9a8d4]/40 dark:border-[#f9a8d4]/30 bg-white dark:bg-[#1e293b] focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300 hover:border-[#d81b60]/50`}
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px] h-10 rounded-xl border-3 border-[#f9a8d4]/40 dark:border-[#f9a8d4]/30 hover:border-[#d81b60]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#d81b60]" />
              <SelectValue placeholder={isRTL ? 'النوع' : 'Type'} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
            <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">📋 {isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
            <SelectItem value={NOTIFICATION_TYPES.ANNOUNCEMENT} className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">📢 {isRTL ? 'إعلان' : 'Announcement'}</SelectItem>
            <SelectItem value={NOTIFICATION_TYPES.PROMOTION} className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">🎯 {isRTL ? 'ترويجي' : 'Promotion'}</SelectItem>
            <SelectItem value={NOTIFICATION_TYPES.OFFER} className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">🎁 {isRTL ? 'عرض خاص' : 'Special Offer'}</SelectItem>
            <SelectItem value={NOTIFICATION_TYPES.MARKETING} className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">📊 {isRTL ? 'تسويقي' : 'Marketing'}</SelectItem>
            <SelectItem value={NOTIFICATION_TYPES.SYSTEM} className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">⚙️ {isRTL ? 'نظام' : 'System'}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border-2 border-[#f9a8d4]/40 shadow-sm">
          {[
            { id: 'all', label: isRTL ? 'الكل' : 'All' },
            { id: 'sent', label: isRTL ? 'مرسلة' : 'Sent' },
            { id: 'scheduled', label: isRTL ? 'مجدولة' : 'Scheduled' },
            { id: 'draft', label: isRTL ? 'مسودات' : 'Drafts' },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "rounded-lg transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#f9a8d4]/30 border-2 border-white/30" 
                  : "text-[#2a655f] hover:bg-[#f9a8d4]/20 hover:text-[#d81b60]"
              )}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ===== TABLE - مع هوفر وردي ===== */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-[#f9a8d4]/40 dark:border-[#f9a8d4]/30 overflow-hidden shadow-lg shadow-[#f9a8d4]/10 hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 hover:bg-transparent bg-gradient-to-r from-[#f9a8d4]/20 to-[#fbcfe8]/20">
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] min-w-[200px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center gap-2">
                    <Bell className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? 'الإشعار' : 'Notification'}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? 'النوع' : 'Type'}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? 'المستهدفين' : 'Target'}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? 'الحالة' : 'Status'}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-[#d81b60]" />
                    {isRTL ? 'التاريخ' : 'Date'}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[140px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-[#d81b60] animate-pulse" />
                    {isRTL ? 'إجراءات' : 'Actions'}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-[#fbcfe8]/60 dark:bg-[#fbcfe8]/20 flex items-center justify-center animate-bounce-slow border-3 border-[#f9a8d4]/70">
                        <Bell className="h-8 w-8 text-[#2a655f]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {isRTL ? 'لا توجد إشعارات' : 'No notifications'}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isRTL 
                          ? 'ابدأ بإنشاء أول إشعار لك'
                          : 'Start by creating your first notification'}
                      </p>
                      <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="mt-2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] hover:from-[#3a8a82] hover:to-[#f48fb1] text-white rounded-xl border-2 border-[#f9a8d4]/50 transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="h-4 w-4 mr-1.5" />
                        {isRTL ? 'إنشاء إشعار' : 'Create Notification'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((notification: any) => {
                  const config = getNotificationConfig(notification.type);
                  const Icon = ICON_MAP[config.icon] || Bell;
                  const isSent = notification.is_sent === true;
                  const isScheduled = notification.scheduled_for && !isSent;
                  const isRead = notification.is_read === true;
                  
                  return (
                    <TableRow 
                      key={notification.id} 
                      className={cn(
                        "border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 hover:bg-[#f9a8d4]/20 dark:hover:bg-[#f9a8d4]/15 transition-all duration-300 group",
                        !isRead && isSent ? "bg-[#f9a8d4]/10 dark:bg-[#f9a8d4]/5" : ""
                      )}
                    >
                      <TableCell className="py-3 border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-2 rounded-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300 border-2",
                            config.color,
                            config.color.includes('text-') ? config.color.replace('text-', 'border-') + '/30' : ''
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-[#2a655f] dark:text-white group-hover:text-[#d81b60] transition-colors">
                              {isRTL ? notification.title_ar : notification.title_en || notification.title_ar}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                              {isRTL ? notification.body_ar : notification.body_en || notification.body_ar}
                            </p>
                            {!isRead && isSent && (
                              <Badge className="mt-1 text-[10px] bg-[#d81b60] text-white rounded-full px-2 py-0 animate-pulse border-2 border-white/30">
                                {isRTL ? 'جديد' : 'New'}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center py-3 border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <Badge className={cn(
                          "border-2 px-3 py-1 whitespace-nowrap",
                          config.color
                        )}>
                          {isRTL ? config.ar : config.en}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center py-3 border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40 rounded-xl whitespace-nowrap">
                          {getTargetLabel(notification.metadata?.target || 'all')}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-center py-3 border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        {isSent ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/30 rounded-xl whitespace-nowrap">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {isRTL ? 'مرسل' : 'Sent'}
                          </Badge>
                        ) : isScheduled ? (
                          <Badge className="bg-[#f9a8d4]/20 text-[#d81b60] border-2 border-[#f9a8d4]/40 rounded-xl whitespace-nowrap">
                            <Calendar className="h-3 w-3 mr-1" />
                            {isRTL ? 'مجدول' : 'Scheduled'}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-2 border-slate-200 rounded-xl whitespace-nowrap">
                            <Clock className="h-3 w-3 mr-1" />
                            {isRTL ? 'مسودة' : 'Draft'}
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-center py-3 border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                          {notification.sent_at 
                            ? formatDate(notification.sent_at)
                            : notification.scheduled_for
                              ? formatDate(notification.scheduled_for)
                              : formatDate(notification.created_at)}
                        </span>
                      </TableCell>
                      
                      <TableCell className="text-center py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedNotification(notification);
                              setIsViewDialogOpen(true);
                            }}
                            className="rounded-xl h-8 w-8 p-0 hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-all duration-300 hover:scale-105 border-2 border-[#f9a8d4]/30"
                            title={isRTL ? 'عرض التفاصيل' : 'View details'}
                          >
                            <Eye className="h-4 w-4 text-[#2a655f]" />
                          </Button>
                          
                          {isSent && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkRead(notification.id, !isRead)}
                              className="rounded-xl h-8 w-8 p-0 hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-all duration-300 hover:scale-105 border-2 border-[#f9a8d4]/30"
                              title={isRTL ? (isRead ? 'تحديد كغير مقروء' : 'تحديد كمقروء') : (isRead ? 'Mark as unread' : 'Mark as read')}
                            >
                              {isRead ? (
                                <EyeOff className="h-4 w-4 text-slate-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-[#2a655f]" />
                              )}
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-xl h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-300 hover:scale-105 border-2 border-rose-300/50"
                            onClick={() => handleDelete(notification.id)}
                            title={isRTL ? 'حذف' : 'Delete'}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* ===== Footer ===== */}
        <div className="px-4 py-2 border-t-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#f9a8d4]/10 to-[#fbcfe8]/10">
          <span className="flex items-center gap-2">
            <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
              {isRTL
                ? `عرض ${filteredNotifications.length} من ${notifications.length}`
                : `Showing ${filteredNotifications.length} of ${notifications.length}`}
            </Badge>
            <span className="text-[10px] text-[#d81b60]">
              {isRTL ? `إجمالي ${notifications.length}` : `Total ${notifications.length}`}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
              {activeTab === "all" && (isRTL ? "جميع" : "All")}
              {activeTab === "sent" && (isRTL ? "مرسلة" : "Sent")}
              {activeTab === "scheduled" && (isRTL ? "مجدولة" : "Scheduled")}
              {activeTab === "draft" && (isRTL ? "مسودات" : "Drafts")}
            </Badge>
            {searchQuery && (
              <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
                <Search className="h-3 w-3 mr-1 text-[#d81b60]" />
                {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ===== VIEW DETAILS DIALOG ===== */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl border-3 border-[#f9a8d4]/60 shadow-2xl shadow-[#f9a8d4]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => setIsViewDialogOpen(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
          </Button>
          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#f9a8d4]/30 border-2 border-[#f9a8d4]/40">
                  <Bell className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {isRTL ? 'تفاصيل الإشعار' : 'Notification Details'}
                  </DialogTitle>
                  <DialogDescription>
                    {isRTL ? 'جميع معلومات الإشعار في مكان واحد' : 'All notification information in one place'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            
            {selectedNotification && (
              <div className="space-y-4 py-2">
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">{isRTL ? 'العنوان' : 'Title'}</Label>
                  <p className="font-semibold text-lg text-[#2a655f] dark:text-white">
                    {isRTL ? selectedNotification.title_ar : selectedNotification.title_en || selectedNotification.title_ar}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">{isRTL ? 'المحتوى' : 'Content'}</Label>
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {isRTL ? selectedNotification.body_ar : selectedNotification.body_en || selectedNotification.body_ar}
                  </p>
                </div>
                
                {selectedNotification.image_url && (
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-500">{isRTL ? 'الصورة' : 'Image'}</Label>
                    <img 
                      src={selectedNotification.image_url} 
                      alt="Notification"
                      className="rounded-xl max-h-[200px] w-full object-cover border-2 border-[#f9a8d4]/30"
                    />
                  </div>
                )}
                
                {selectedNotification.link_url && (
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-500">{isRTL ? 'الرابط' : 'Link'}</Label>
                    <a 
                      href={selectedNotification.link_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#d81b60] hover:underline break-all"
                    >
                      {selectedNotification.link_url}
                    </a>
                  </div>
                )}
                
                <Separator className="bg-[#f9a8d4]/30" />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-500">{isRTL ? 'النوع' : 'Type'}</Label>
                    {(() => {
                      const config = getNotificationConfig(selectedNotification.type);
                      return (
                        <Badge className={cn("border-2", config.color)}>
                          {isRTL ? config.ar : config.en}
                        </Badge>
                      );
                    })()}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-500">{isRTL ? 'المستهدفين' : 'Target'}</Label>
                    <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40 rounded-xl">
                      {getTargetLabel(selectedNotification.metadata?.target || 'all')}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-500">{isRTL ? 'الحالة' : 'Status'}</Label>
                    {selectedNotification.is_sent ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-2 border-emerald-500/30 rounded-xl">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {isRTL ? 'مرسل' : 'Sent'}
                      </Badge>
                    ) : selectedNotification.scheduled_for ? (
                      <Badge className="bg-[#f9a8d4]/20 text-[#d81b60] border-2 border-[#f9a8d4]/40 rounded-xl">
                        <Calendar className="h-3 w-3 mr-1" />
                        {isRTL ? 'مجدول' : 'Scheduled'}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-2 border-slate-200 rounded-xl">
                        <Clock className="h-3 w-3 mr-1" />
                        {isRTL ? 'مسودة' : 'Draft'}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-500">{isRTL ? 'تاريخ الإنشاء' : 'Created'}</Label>
                    <p className="text-sm text-[#2a655f]">{formatDate(selectedNotification.created_at)}</p>
                  </div>
                </div>
                
                {selectedNotification.metadata?.governorate_ids?.length > 0 && (
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-500">{isRTL ? 'المحافظات' : 'Governorates'}</Label>
                    <div className="flex flex-wrap gap-1">
                      {selectedNotification.metadata.governorate_ids.map((id: string) => {
                        const gov = governorates.find(g => g.id === id);
                        return gov ? (
                          <Badge key={id} variant="outline" className="rounded-xl border-2 border-[#f9a8d4]/40">
                            {isRTL ? gov.name_ar : gov.name_en}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="gap-3 pt-4 border-t-3 border-[#f9a8d4]/30">
              <Button 
                variant="outline" 
                onClick={() => setIsViewDialogOpen(false)}
                className="flex-1 rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1.5" />
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
      
    </div>
  );
}

export default AdminNotifications;