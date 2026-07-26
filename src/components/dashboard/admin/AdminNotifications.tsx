// src/components/dashboard/admin/AdminNotifications.tsx
import { useState, useMemo, useEffect, useRef } from "react";
import { useApp } from "@/lib/i18n";
import { 
  Bell, Send, Users, Store, Package, Calendar, CheckCircle, XCircle,
  Clock, Filter, Search, RefreshCw, Eye, EyeOff, Trash2, Plus,
  AlertCircle, MapPin, Globe, Loader2, Settings, TrendingUp,
  Sparkles, Gift, Star, Check, X, ShoppingBag, Megaphone,
  User, UserCheck, UserX, Target, Rocket, Crown, Zap, Flame,
  ChevronDown, Layers, Building2, Phone, Mail, AtSign, Image as ImageIcon,
  Upload, FolderOpen
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
// المكون الرئيسي
// ============================================================

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
  const { data: notifications = [], refetch: refetchNotifications } = useUserNotifications(app.user?.id, { limit: 100 });
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

      await sendBulkNotification.mutateAsync({
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
      });

      toast.success(
        isRTL 
          ? `✅ تم إرسال الإشعار إلى ${userIds.length} مستخدم` 
          : `✅ Notification sent to ${userIds.length} users`
      );
      
      setIsCreateDialogOpen(false);
      resetForm();
      refetchNotifications();
      refetchStats();
      
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast.error(isRTL ? '❌ فشل إرسال الإشعار' : '❌ Failed to send notification');
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
  // دوال التنسيق - باستخدام NOTIFICATION_CONFIG
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
  // التصيير - جدول الإشعارات
  // ============================================================

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#2563eb]" />
            {isRTL ? 'إدارة الإشعارات' : 'Notifications Management'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isRTL 
              ? `إدارة وإرسال الإشعارات للمستخدمين • ${stats?.total || 0} إشعار` 
              : `Manage and send notifications to users • ${stats?.total || 0} notifications`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { refetchNotifications(); refetchStats(); fetchAllUsers(); }}
            className="rounded-xl"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" />
            {isRTL ? 'تحديث' : 'Refresh'}
          </Button>
          
          {/* ===== زر إنشاء إشعار جديد ===== */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl">
                <Plus className="h-4 w-4 mr-1.5" />
                {isRTL ? 'إشعار جديد' : 'New Notification'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#2563eb]" />
                  {isRTL ? 'إنشاء إشعار جديد' : 'Create New Notification'}
                </DialogTitle>
                <DialogDescription>
                  {isRTL 
                    ? 'املأ البيانات لإرسال إشعار للمستخدمين المستهدفين' 
                    : 'Fill in the details to send a notification to target users'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-5 py-4">
                
                {/* ===== اللغة ===== */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      {isRTL ? 'العنوان (عربي)' : 'Title (Arabic)'}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      placeholder={isRTL ? 'أدخل عنوان الإشعار' : 'Enter notification title'}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
                    <Input
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      placeholder="Enter notification title"
                      className="rounded-xl"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* ===== المحتوى ===== */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1">
                      {isRTL ? 'المحتوى (عربي)' : 'Content (Arabic)'}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      value={formData.body_ar}
                      onChange={(e) => setFormData({ ...formData, body_ar: e.target.value })}
                      placeholder={isRTL ? 'أدخل محتوى الإشعار' : 'Enter notification content'}
                      rows={4}
                      className="rounded-xl resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? 'المحتوى (إنجليزي)' : 'Content (English)'}</Label>
                    <Textarea
                      value={formData.body_en}
                      onChange={(e) => setFormData({ ...formData, body_en: e.target.value })}
                      placeholder="Enter notification content"
                      rows={4}
                      className="rounded-xl resize-none"
                      dir="ltr"
                    />
                  </div>
                </div>

                <Separator />

                {/* ===== النوع ===== */}
                <div className="space-y-2">
                  <Label>{isRTL ? 'نوع الإشعار' : 'Notification Type'}</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as NotificationTypeV2 })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={isRTL ? 'اختر النوع' : 'Select type'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NOTIFICATION_TYPES.ANNOUNCEMENT}>📢 {isRTL ? 'إعلان' : 'Announcement'}</SelectItem>
                      <SelectItem value={NOTIFICATION_TYPES.PROMOTION}>🎯 {isRTL ? 'ترويجي' : 'Promotion'}</SelectItem>
                      <SelectItem value={NOTIFICATION_TYPES.OFFER}>🎁 {isRTL ? 'عرض خاص' : 'Special Offer'}</SelectItem>
                      <SelectItem value={NOTIFICATION_TYPES.MARKETING}>📊 {isRTL ? 'تسويقي' : 'Marketing'}</SelectItem>
                      <SelectItem value={NOTIFICATION_TYPES.EVENT}>📅 {isRTL ? 'حدث' : 'Event'}</SelectItem>
                      <SelectItem value={NOTIFICATION_TYPES.NEWS}>📰 {isRTL ? 'أخبار' : 'News'}</SelectItem>
                      <SelectItem value={NOTIFICATION_TYPES.ORDER_UPDATE}>📦 {isRTL ? 'تحديث طلب' : 'Order Update'}</SelectItem>
                      <SelectItem value={NOTIFICATION_TYPES.SYSTEM}>⚙️ {isRTL ? 'نظام' : 'System'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ===== الهدف ===== */}
                <div className="space-y-2">
                  <Label>{isRTL ? 'المستهدفين' : 'Target Audience'}</Label>
                  <Select
                    value={formData.target}
                    onValueChange={(value) => setFormData({ ...formData, target: value as TargetType })}
                  >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={isRTL ? 'اختر الفئة المستهدفة' : 'Select target audience'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🌍 {isRTL ? 'الجميع' : 'All Users'}</SelectItem>
                      <SelectItem value="customers">🛒 {isRTL ? 'العملاء' : 'Customers'}</SelectItem>
                      <SelectItem value="sellers">🏪 {isRTL ? 'البائعين' : 'Sellers'}</SelectItem>
                      <SelectItem value="new_users">✨ {isRTL ? 'مستخدمين جدد' : 'New Users'}</SelectItem>
                      <SelectItem value="active_users">🔥 {isRTL ? 'مستخدمين نشطين' : 'Active Users'}</SelectItem>
                      <SelectItem value="governorate">📍 {isRTL ? 'حسب المحافظة' : 'By Governorate'}</SelectItem>
                      <SelectItem value="specific">👤 {isRTL ? 'مستخدمين محددين' : 'Specific Users'}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* ===== المحافظات ===== */}
                {formData.target === 'governorate' && (
                  <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <Label>{isRTL ? 'اختر المحافظات' : 'Select Governorates'}</Label>
                    <div className="flex flex-wrap gap-2">
                      {governorates.map((gov) => (
                        <Badge
                          key={gov.id}
                          variant={formData.governorate_ids.includes(gov.id) ? 'default' : 'outline'}
                          className="cursor-pointer px-3 py-1.5 rounded-xl"
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
                      <p className="text-sm text-slate-400">
                        {isRTL ? '⚠️ اختر محافظة واحدة على الأقل' : '⚠️ Select at least one governorate'}
                      </p>
                    )}
                  </div>
                )}

                {/* ===== مستخدمين محددين مع فلتر ذكي ===== */}
                {formData.target === 'specific' && (
                  <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <Label>{isRTL ? 'اختر المستخدمين' : 'Select Users'}</Label>
                      <Badge variant="secondary" className="rounded-xl">
                        {formData.specific_users.length} {isRTL ? 'مختار' : 'selected'}
                      </Badge>
                    </div>
                    
                    {/* ===== فلتر المستخدمين ===== */}
                    <div className="flex flex-wrap gap-2">
                      <Input
                        value={usersSearch}
                        onChange={(e) => setUsersSearch(e.target.value)}
                        placeholder={isRTL ? '🔍 بحث باسم أو هاتف أو متجر' : '🔍 Search by name, phone or store'}
                        className="flex-1 min-w-[150px] rounded-xl"
                      />
                      
                      <Select value={usersFilterGovernorate} onValueChange={setUsersFilterGovernorate}>
                        <SelectTrigger className="w-[140px] rounded-xl">
                          <SelectValue placeholder={isRTL ? 'المحافظة' : 'Governorate'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isRTL ? 'كل المحافظات' : 'All Governorates'}</SelectItem>
                          {governorates.map((gov) => (
                            <SelectItem key={gov.id} value={gov.id}>
                              {isRTL ? gov.name_ar : gov.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={usersFilterRole} onValueChange={setUsersFilterRole}>
                        <SelectTrigger className="w-[130px] rounded-xl">
                          <SelectValue placeholder={isRTL ? 'الدور' : 'Role'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                          <SelectItem value="seller">🏪 {isRTL ? 'بائع' : 'Seller'}</SelectItem>
                          <SelectItem value="customer">🛒 {isRTL ? 'عميل' : 'Customer'}</SelectItem>
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
                        className="rounded-xl"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* ===== قائمة المستخدمين ===== */}
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
                      </div>
                    ) : (
                      <ScrollArea className="h-[300px] border rounded-xl p-2">
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
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                                  isSelected 
                                    ? 'bg-[#2563eb]/10 dark:bg-[#2563eb]/20' 
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                }`}
                                onClick={() => {
                                  const users = isSelected
                                    ? formData.specific_users.filter(u => u.id !== user.id)
                                    : [...formData.specific_users, user];
                                  setFormData({ ...formData, specific_users: users });
                                }}
                              >
                                <Checkbox checked={isSelected} />
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={user.avatar_url || undefined} />
                                  <AvatarFallback className="bg-[#2563eb]/10 text-[#2563eb] text-xs">
                                    {user.full_name?.charAt(0) || 'U'}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium truncate">
                                      {user.full_name || isRTL ? 'مستخدم' : 'User'}
                                    </p>
                                    {user.is_seller && (
                                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-blue-300 text-blue-600">
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
                                {isSelected && <Check className="h-4 w-4 text-[#2563eb] flex-shrink-0" />}
                              </div>
                            );
                          })
                        )}
                      </ScrollArea>
                    )}

                    {/* ===== المستخدمين المختارين ===== */}
                    {formData.specific_users.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-400 flex items-center">
                          {isRTL ? 'المختارين:' : 'Selected:'}
                        </span>
                        {formData.specific_users.map((user) => (
                          <Badge key={user.id} variant="secondary" className="gap-1 px-3 py-1.5 rounded-xl">
                            {user.full_name || user.id.slice(0, 8)}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
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

                <Separator />

                {/* ===== الصورة - رفع وليس رابط ===== */}
                <div className="space-y-3">
                  <Label>{isRTL ? 'الصورة (اختياري)' : 'Image (Optional)'}</Label>
                  
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
                      className="rounded-xl"
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
                        className="text-red-500 hover:text-red-700 rounded-xl"
                      >
                        <X className="h-4 w-4 mr-1.5" />
                        {isRTL ? 'إزالة' : 'Remove'}
                      </Button>
                    )}
                  </div>

                  {/* ===== معاينة الصورة ===== */}
                  {(imagePreview || formData.image_url) && (
                    <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
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

                  {formData.image_url && !imagePreview && (
                    <p className="text-xs text-slate-400 truncate">
                      {isRTL ? 'الصورة الحالية:' : 'Current image:'} {formData.image_url}
                    </p>
                  )}
                </div>

                {/* ===== رابط الإجراء ===== */}
                <div className="space-y-2">
                  <Label>{isRTL ? 'رابط الإجراء (اختياري)' : 'Action URL (Optional)'}</Label>
                  <Input
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="/products/123"
                    className="rounded-xl"
                  />
                </div>

                {/* ===== جدولة الإرسال ===== */}
                <div className="space-y-2">
                  <Label>{isRTL ? 'جدولة الإرسال (اختياري)' : 'Schedule Send (Optional)'}</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduled_for}
                    onChange={(e) => setFormData({ ...formData, scheduled_for: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>

              <DialogFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="rounded-xl">
                  {isRTL ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  onClick={handleSendNotification}
                  disabled={isSending || isUploading}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl"
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
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ===== الإحصائيات ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border-slate-200/60 dark:border-slate-700/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{isRTL ? 'إجمالي' : 'Total'}</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200/60 dark:border-slate-700/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{isRTL ? 'مرسلة' : 'Sent'}</p>
                <p className="text-2xl font-bold text-green-600">{stats?.read || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200/60 dark:border-slate-700/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{isRTL ? 'غير مقروءة' : 'Unread'}</p>
                <p className="text-2xl font-bold text-amber-600">{stats?.unread || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-slate-200/60 dark:border-slate-700/60">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{isRTL ? 'مجدولة' : 'Scheduled'}</p>
                <p className="text-2xl font-bold text-purple-600">
                  {notifications.filter((n: any) => n.scheduled_for && !n.is_sent).length}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===== الفلتر والبحث ===== */}
      <Card className="border-slate-200/60 dark:border-slate-700/60">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`} />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isRTL ? 'بحث في الإشعارات...' : 'Search notifications...'}
                className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} rounded-xl border-slate-200 dark:border-slate-700`}
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] rounded-xl">
                <SelectValue placeholder={isRTL ? 'النوع' : 'Type'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'جميع الأنواع' : 'All Types'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.ANNOUNCEMENT}>📢 {isRTL ? 'إعلان' : 'Announcement'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.PROMOTION}>🎯 {isRTL ? 'ترويجي' : 'Promotion'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.OFFER}>🎁 {isRTL ? 'عرض خاص' : 'Special Offer'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.MARKETING}>📊 {isRTL ? 'تسويقي' : 'Marketing'}</SelectItem>
                <SelectItem value={NOTIFICATION_TYPES.SYSTEM}>⚙️ {isRTL ? 'نظام' : 'System'}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
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
                  className={`rounded-lg ${activeTab === tab.id ? 'bg-[#2563eb] text-white' : ''}`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== جدول الإشعارات - منظم ===== */}
      <Card className="border-slate-200/60 dark:border-slate-700/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {isRTL ? 'قائمة الإشعارات' : 'Notifications List'}
            </CardTitle>
            <Badge variant="secondary" className="rounded-xl px-3 py-1">
              {filteredNotifications.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <TableRow>
                    <TableHead className="w-[30%] min-w-[200px] text-right">
                      {isRTL ? 'الإشعار' : 'Notification'}
                    </TableHead>
                    <TableHead className="w-[12%] min-w-[100px] text-center">
                      {isRTL ? 'النوع' : 'Type'}
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[120px] text-center">
                      {isRTL ? 'المستهدفين' : 'Target'}
                    </TableHead>
                    <TableHead className="w-[12%] min-w-[100px] text-center">
                      {isRTL ? 'الحالة' : 'Status'}
                    </TableHead>
                    <TableHead className="w-[16%] min-w-[140px] text-center">
                      {isRTL ? 'تاريخ الإرسال' : 'Sent Date'}
                    </TableHead>
                    <TableHead className="w-[15%] min-w-[140px] text-center">
                      {isRTL ? 'إجراءات' : 'Actions'}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                          <Bell className="h-12 w-12 text-slate-300" />
                          <p className="font-medium">
                            {isRTL ? 'لا توجد إشعارات' : 'No notifications found'}
                          </p>
                          <p className="text-sm">
                            {isRTL 
                              ? 'ابدأ بإنشاء أول إشعار لك' 
                              : 'Start by creating your first notification'}
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="rounded-xl"
                          >
                            <Plus className="h-4 w-4 mr-1.5" />
                            {isRTL ? 'إنشاء إشعار' : 'Create Notification'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredNotifications.map((notification: any) => {
                      // ✅ استخدام NOTIFICATION_CONFIG بدلاً من الدوال المبعثرة
                      const config = getNotificationConfig(notification.type);
                      const Icon = ICON_MAP[config.icon] || Bell;
                      const isSent = notification.is_sent === true;
                      const isScheduled = notification.scheduled_for && !isSent;
                      const isRead = notification.is_read === true;
                      
                      return (
                        <TableRow 
                          key={notification.id} 
                          className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                            !isRead && isSent ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''
                          }`}
                        >
                          {/* عمود الإشعار */}
                          <TableCell className="py-3">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg flex-shrink-0 ${config.color}`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {isRTL ? notification.title_ar : notification.title_en || notification.title_ar}
                                </p>
                                <p className="text-sm text-slate-500 truncate">
                                  {isRTL ? notification.body_ar : notification.body_en || notification.body_ar}
                                </p>
                                {!isRead && isSent && (
                                  <Badge variant="default" className="mt-1 text-[10px] bg-[#2563eb] rounded-full px-2 py-0">
                                    {isRTL ? 'جديد' : 'New'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          
                          {/* عمود النوع - استخدام config */}
                          <TableCell className="text-center py-3">
                            <Badge className={`${config.color} whitespace-nowrap`}>
                              {isRTL ? config.ar : config.en}
                            </Badge>
                          </TableCell>
                          
                          {/* عمود المستهدفين */}
                          <TableCell className="text-center py-3">
                            <Badge variant="outline" className="rounded-xl whitespace-nowrap">
                              {getTargetLabel(notification.metadata?.target || 'all')}
                            </Badge>
                          </TableCell>
                          
                          {/* عمود الحالة */}
                          <TableCell className="text-center py-3">
                            {isSent ? (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl whitespace-nowrap">
                                <CheckCircle className="h-3 w-3 inline mr-1" />
                                {isRTL ? 'مرسل' : 'Sent'}
                              </Badge>
                            ) : isScheduled ? (
                              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl whitespace-nowrap">
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {isRTL ? 'مجدول' : 'Scheduled'}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="rounded-xl whitespace-nowrap">
                                <Clock className="h-3 w-3 inline mr-1" />
                                {isRTL ? 'مسودة' : 'Draft'}
                              </Badge>
                            )}
                          </TableCell>
                          
                          {/* عمود التاريخ */}
                          <TableCell className="text-center py-3">
                            <span className="text-sm text-slate-500 whitespace-nowrap">
                              {notification.sent_at 
                                ? formatDate(notification.sent_at)
                                : notification.scheduled_for
                                  ? formatDate(notification.scheduled_for)
                                  : formatDate(notification.created_at)}
                            </span>
                          </TableCell>
                          
                          {/* عمود الإجراءات */}
                          <TableCell className="text-center py-3">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedNotification(notification);
                                  setIsViewDialogOpen(true);
                                }}
                                className="rounded-xl h-8 w-8 p-0"
                                title={isRTL ? 'عرض التفاصيل' : 'View details'}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {isSent && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkRead(notification.id, !isRead)}
                                  className="rounded-xl h-8 w-8 p-0"
                                  title={isRTL ? (isRead ? 'تحديد كغير مقروء' : 'تحديد كمقروء') : (isRead ? 'Mark as unread' : 'Mark as read')}
                                >
                                  {isRead ? (
                                    <EyeOff className="h-4 w-4 text-slate-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-[#2563eb]" />
                                  )}
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-xl h-8 w-8 p-0 text-red-500 hover:text-red-700"
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
          </div>
        </CardContent>
      </Card>

      {/* ===== عرض تفاصيل الإشعار ===== */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#2563eb]" />
              {isRTL ? 'تفاصيل الإشعار' : 'Notification Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="space-y-4 py-4">
              <div className="space-y-1">
                <Label className="text-sm text-slate-500">{isRTL ? 'العنوان' : 'Title'}</Label>
                <p className="font-semibold text-lg">
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
                    className="rounded-xl max-h-[200px] w-full object-cover"
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
                    className="text-[#2563eb] hover:underline break-all"
                  >
                    {selectedNotification.link_url}
                  </a>
                </div>
              )}
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">{isRTL ? 'النوع' : 'Type'}</Label>
                  {/* ✅ استخدام config */}
                  {(() => {
                    const config = getNotificationConfig(selectedNotification.type);
                    return (
                      <Badge className={config.color}>
                        {isRTL ? config.ar : config.en}
                      </Badge>
                    );
                  })()}
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">{isRTL ? 'المستهدفين' : 'Target'}</Label>
                  <Badge variant="outline" className="rounded-xl">
                    {getTargetLabel(selectedNotification.metadata?.target || 'all')}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">{isRTL ? 'الحالة' : 'Status'}</Label>
                  {selectedNotification.is_sent ? (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {isRTL ? 'مرسل' : 'Sent'}
                    </Badge>
                  ) : selectedNotification.scheduled_for ? (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-xl">
                      <Calendar className="h-3 w-3 mr-1" />
                      {isRTL ? 'مجدول' : 'Scheduled'}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="rounded-xl">
                      <Clock className="h-3 w-3 mr-1" />
                      {isRTL ? 'مسودة' : 'Draft'}
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">{isRTL ? 'تاريخ الإنشاء' : 'Created'}</Label>
                  <p className="text-sm">{formatDate(selectedNotification.created_at)}</p>
                </div>
              </div>
              
              {selectedNotification.metadata?.governorate_ids?.length > 0 && (
                <div className="space-y-1">
                  <Label className="text-sm text-slate-500">{isRTL ? 'المحافظات' : 'Governorates'}</Label>
                  <div className="flex flex-wrap gap-1">
                    {selectedNotification.metadata.governorate_ids.map((id: string) => {
                      const gov = governorates.find(g => g.id === id);
                      return gov ? (
                        <Badge key={id} variant="outline" className="rounded-xl">
                          {isRTL ? gov.name_ar : gov.name_en}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)} className="rounded-xl">
              {isRTL ? 'إغلاق' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
}