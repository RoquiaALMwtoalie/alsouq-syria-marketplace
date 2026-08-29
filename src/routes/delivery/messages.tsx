// src/routes/delivery/messages.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo, lazy, Suspense } from "react";
import { 
  MessageCircle, Search, Truck, Store, ChevronRight, 
  MoreVertical, Trash2, Users, Package,
  Phone, Building2, Filter, RefreshCw,
  Check, Shield, ShieldCheck, UserCheck, Crown,
  Loader2, ChevronLeft, LayoutDashboard, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useApp } from "@/lib/i18n";
import {
  useConversations,
  useDeleteConversation,
  useUnreadCount,
  useGetOrCreateConversation,
} from "@/lib/hooks/useConversation";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { useMyDeliveryCompany, useUserRoles, useDistributors } from "@/lib/queries";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";

export const Route = createFileRoute("/delivery/messages")({
  component: DeliveryMessagesPage,
  head: () => ({ meta: [{ title: "المراسلات — شركة التوصيل" }] }),
});

function DeliveryMessagesPage() {
  // ============================================================
  // ✅ ✅ ✅ جميع الـ Hooks في الأعلى ✅ ✅ ✅
  // ============================================================
  
 const app = useApp();
const isArabic = app.lang === "ar"; // ✅ أضف هذا
  const navigate = useNavigate();
  
  // ====== State ======
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "orders" | "distributors" | "admins">("all");
  
  const [showDistributorDialog, setShowDistributorDialog] = useState(false);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [distributorSearch, setDistributorSearch] = useState("");
  const [adminSearch, setAdminSearch] = useState("");
  
  // ====== Queries ======
  const { data: company } = useMyDeliveryCompany(app.user?.id);
  const { data: userRoles = [] } = useUserRoles(app.user?.id);
  const { data: allDistributors = [] } = useDistributors({});
  
  const { data: conversations = [], isLoading, refetch } = useConversations();
  const { data: unreadCount = 0 } = useUnreadCount();
  const deleteConversation = useDeleteConversation();
  const getOrCreateConversation = useGetOrCreateConversation();
  
  // ====== Store ======
  const { setConversations, deleteConversation: deleteFromStore } = useConversationStore();
  
  // ====== State إضافية ======
  const [usersRolesMap, setUsersRolesMap] = useState<Map<string, string[]>>(new Map());
  const [systemAdmin, setSystemAdmin] = useState<any>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [companyAdmins, setCompanyAdmins] = useState<any[]>([]);
  const [loadingCompanyAdmins, setLoadingCompanyAdmins] = useState(true);
  
  // ============================================================
  // ✅ ✅ ✅ جميع الـ useEffect ✅ ✅ ✅
  // ============================================================
  
  useEffect(() => {
    if (conversations.length > 0) {
      setConversations(conversations);
    }
  }, [conversations, setConversations]);
  
  // ====== جلب أدوار المستخدمين ======
  useEffect(() => {
    const fetchAllUsersRoles = async () => {
      if (!conversations || conversations.length === 0) return;
      
      const userIds = new Set<string>();
      conversations.forEach((conv: any) => {
        if (conv.participant1_id) userIds.add(conv.participant1_id);
        if (conv.participant2_id) userIds.add(conv.participant2_id);
      });
      
      if (userIds.size === 0) return;
      
      try {
        const { data: rolesData, error } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", Array.from(userIds));
        
        if (error) throw error;
        
        const rolesMap = new Map<string, string[]>();
        rolesData?.forEach((item: any) => {
          if (!rolesMap.has(item.user_id)) {
            rolesMap.set(item.user_id, []);
          }
          rolesMap.get(item.user_id)!.push(item.role);
        });
        
        setUsersRolesMap(rolesMap);
      } catch (error) {
        console.error("❌ Error fetching users roles:", error);
      }
    };
    
    fetchAllUsersRoles();
  }, [conversations]);
  
  // ====== جلب أدمن النظام ======
  useEffect(() => {
    const fetchSystemAdmin = async () => {
      setLoadingAdmin(true);
      try {
        const { data: adminRoles, error: rolesError } = await supabase
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin")
          .limit(1);
        
        if (rolesError) throw rolesError;
        if (!adminRoles || adminRoles.length === 0) {
          setLoadingAdmin(false);
          return;
        }
        
        const adminUserId = adminRoles[0].user_id;
        const { data: adminProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, phone, avatar_url")
          .eq("id", adminUserId)
          .maybeSingle();
        
        if (profileError) throw profileError;
        setSystemAdmin(adminProfile);
      } catch (error) {
        console.error("Error fetching system admin:", error);
      } finally {
        setLoadingAdmin(false);
      }
    };
    fetchSystemAdmin();
  }, []);
  
  // ====== ✅✅✅ جلب أدمن الشركة من delivery_company_admins ✅✅✅ ======
  useEffect(() => {
    const fetchCompanyAdmins = async () => {
      if (!company?.id) {
        setLoadingCompanyAdmins(false);
        return;
      }
      
      setLoadingCompanyAdmins(true);
      try {
        const { data: adminRecords, error: adminError } = await supabase
          .from("delivery_company_admins")
          .select(`
            user_id,
            profiles:user_id (
              id,
              full_name,
              phone,
              avatar_url
            )
          `)
          .eq("company_id", company.id);
        
        if (adminError) throw adminError;
        
        if (!adminRecords || adminRecords.length === 0) {
          setCompanyAdmins([]);
          setLoadingCompanyAdmins(false);
          return;
        }
        
        const adminProfiles = adminRecords
          .map((r: any) => r.profiles)
          .filter(Boolean);
        
        setCompanyAdmins(adminProfiles);
        console.log("✅ [Messages] Company admins:", adminProfiles);
      } catch (error) {
        console.error("Error fetching company admins:", error);
        setCompanyAdmins([]);
      } finally {
        setLoadingCompanyAdmins(false);
      }
    };
    
    fetchCompanyAdmins();
  }, [company?.id]);
  
  // ============================================================
  // ✅ ✅ ✅ جميع الـ useCallback ✅ ✅ ✅
  // ============================================================
  
  const openConversation = useCallback(async (otherUserId: string) => {
    if (!app.user) return;
    if (otherUserId === app.user.id) {
      toast.info(app.lang === "ar" ? "💬 لا يمكنك مراسلة نفسك" : "💬 You can't message yourself");
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
      toast.error(app.lang === "ar" ? "فشل فتح المحادثة" : "Failed to open conversation");
    } finally {
      setIsCreating(false);
    }
  }, [app.user, app.lang, getOrCreateConversation, navigate]);
  
  const handleDeleteConversation = useCallback(async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!app.user) return;
    
    const confirmMessage = app.lang === "ar" ? "هل أنت متأكد من حذف هذه المحادثة؟" : "Are you sure?";
    if (!confirm(confirmMessage)) return;
    
    try {
      await deleteConversation.mutateAsync({
        conversationId: convId,
        userId: app.user.id,
      });
      deleteFromStore(convId);
      refetch();
    } catch (error) {
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }, [app.user, app.lang, deleteConversation, deleteFromStore, refetch]);
  
  const startAdminChat = useCallback(async () => {
    if (!systemAdmin) {
      toast.error(app.lang === "ar" ? "❌ لا يوجد أدمن للنظام" : "❌ No system admin found");
      return;
    }
    if (systemAdmin.id === app.user?.id) {
      toast.info(app.lang === "ar" ? "💬 أنت الأدمن، لا يمكنك مراسلة نفسك" : "💬 You are the admin, you can't message yourself");
      return;
    }
    await openConversation(systemAdmin.id);
  }, [systemAdmin, app.user, app.lang, openConversation]);
  
  const startCompanyAdminChat = useCallback(async (admin: any) => {
    if (!admin?.id) {
      toast.error(app.lang === "ar" ? "❌ هذا الأدمن ليس لديه حساب في النظام" : "❌ This admin does not have a system account");
      return;
    }
    if (admin.id === app.user?.id) {
      toast.info(app.lang === "ar" ? "💬 أنت هذا الأدمن، لا يمكنك مراسلة نفسك" : "💬 You are this admin, you can't message yourself");
      return;
    }
    setShowAdminDialog(false);
    await openConversation(admin.id);
  }, [app.user, app.lang, openConversation]);
  
  const startDistributorChat = useCallback(async (distributor: any) => {
    if (!distributor?.user_id) {
      toast.error(app.lang === "ar" ? "❌ هذا الموزع ليس لديه حساب في النظام" : "❌ This distributor does not have a system account");
      setShowDistributorDialog(false);
      return;
    }
    if (distributor.user_id === app.user?.id) {
      toast.info(app.lang === "ar" ? "💬 أنت هذا الموزع، لا يمكنك مراسلة نفسك" : "💬 You are this distributor, you can't message yourself");
      setShowDistributorDialog(false);
      return;
    }
    setShowDistributorDialog(false);
    await openConversation(distributor.user_id);
  }, [app.user, app.lang, openConversation]);
  
  const goBack = useCallback(() => {
    navigate({ to: "/delivery/dashboard" });
  }, [navigate]);
  
  // ============================================================
  // ✅ ✅ ✅ جميع الـ useMemo ✅ ✅ ✅
  // ============================================================
  
  const isDeliveryCompany = userRoles.includes('delivery_company');
  
  const companyDistributors = useMemo(() => {
    return allDistributors.filter(
      (d: any) => 
        d.delivery_company_id === company?.id &&
        d.user_id !== app.user?.id &&
        d.user_id !== null
    );
  }, [allDistributors, company?.id, app.user?.id]);
  
  const filteredDistributors = useMemo(() => {
    const search = distributorSearch.toLowerCase().trim();
    return companyDistributors.filter((d: any) => {
      const nameAr = d.full_name_ar?.toLowerCase() || '';
      const nameEn = d.full_name_en?.toLowerCase() || '';
      const phone = d.phone?.toLowerCase() || '';
      return nameAr.includes(search) || nameEn.includes(search) || phone.includes(search);
    });
  }, [companyDistributors, distributorSearch]);
  
  const filteredCompanyAdmins = useMemo(() => {
    const search = adminSearch.toLowerCase().trim();
    return companyAdmins.filter((a: any) => {
      const name = a.full_name?.toLowerCase() || '';
      const phone = a.phone?.toLowerCase() || '';
      return name.includes(search) || phone.includes(search);
    });
  }, [companyAdmins, adminSearch]);
  
  // ====== دوال مساعدة ======
  const getOtherUser = useCallback((conv: any) => {
    return conv.participant1_id === app.user?.id ? conv.participant2 : conv.participant1;
  }, [app.user?.id]);
  
  const getUserName = useCallback((user: any) => {
    return user?.store_name || user?.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  }, [app.lang]);
  
  const getUserAvatar = useCallback((user: any) => {
    return user?.store_logo_url || user?.avatar_url || 
      `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(user))}&background=0d2e2a&color=fff&size=128`;
  }, [getUserName]);
  
  // ✅✅✅ الدالة المحسنة لجلب الرول ✅✅✅
  const getUserRole = useCallback((user: any) => {
    if (!user?.id) return "customer";
    
    const roles = usersRolesMap.get(user.id) || [];
    
    // ✅ الأولوية القصوى: إذا كان المستخدم في delivery_company_admins
    const isCompanyAdmin = companyAdmins.some(admin => admin.id === user.id);
    if (isCompanyAdmin) return "company_admin";
    
    // ✅ باقي الأدوار
    if (roles.includes('admin')) return "admin";
    if (roles.includes('delivery_company')) return "delivery_company";
    if (roles.includes('distributor')) return "distributor";
    if (roles.includes('seller')) return "store";
    if (user?.store_name) return "store";
    
    return "customer";
  }, [usersRolesMap, companyAdmins]);
  
  const getRoleIcon = useCallback((role: string) => {
    switch (role) {
      case "store": return <Store className="h-3 w-3" />;
      case "distributor": return <Truck className="h-3 w-3" />;
      case "delivery_company": return <Building2 className="h-3 w-3" />;
      case "admin": return <Crown className="h-3 w-3" />;
      case "company_admin": return <ShieldCheck className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  }, []);
  
  const getRoleLabel = useCallback((role: string) => {
    if (app.lang === "ar") {
      switch (role) {
        case "store": return "متجر";
        case "distributor": return "موزع";
        case "delivery_company": return "شركة توصيل";
        case "admin": return "أدمن النظام";
        case "company_admin": return "أدمن الشركة";
        default: return "عميل";
      }
    } else {
      switch (role) {
        case "store": return "Store";
        case "distributor": return "Distributor";
        case "delivery_company": return "Delivery Co.";
        case "admin": return "System Admin";
        case "company_admin": return "Company Admin";
        default: return "Customer";
      }
    }
  }, [app.lang]);
  
  const getRoleColor = useCallback((role: string) => {
    switch (role) {
      case "store": return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
      case "distributor": return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "delivery_company": return "bg-purple-500/20 text-purple-600 border-purple-500/30";
      case "admin": return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      case "company_admin": return "bg-indigo-500/20 text-indigo-600 border-indigo-500/30";
      default: return "bg-slate-500/20 text-slate-600 border-slate-500/30";
    }
  }, []);
  
  const formatTime = useCallback((date: string) => {
    if (!date) return "";
    const now = new Date();
    const then = new Date(date);
    const diffMins = Math.floor((now.getTime() - then.getTime()) / 60000);

    if (app.lang === "ar") {
      if (diffMins < 1) return "الآن";
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffMins < 1440) return `منذ ${Math.floor(diffMins / 60)} ساعة`;
      return then.toLocaleDateString("ar-SA", { day: "numeric", month: "short" });
    } else {
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
      return then.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    }
  }, [app.lang]);
  
  // ====== فلترة المحادثات ======
  const filteredConversations = useMemo(() => {
    return conversations.filter((conv: any) => {
      const otherUser = getOtherUser(conv);
      const name = getUserName(otherUser);
      const role = getUserRole(otherUser);
      
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterType === "all") return matchesSearch;
      if (filterType === "orders") return matchesSearch && (role === "customer" || role === "store");
      if (filterType === "distributors") return matchesSearch && (role === "distributor" || role === "delivery_company");
      if (filterType === "admins") return matchesSearch && (role === "admin" || role === "company_admin");
      
      return matchesSearch;
    });
  }, [conversations, filterType, searchQuery, getOtherUser, getUserName, getUserRole]);
  
  // ====== إحصائيات المحادثات ======
  const stats = useMemo(() => {
    return {
      total: conversations.length,
      unread: unreadCount,
      customers: conversations.filter((c: any) => {
        const user = getOtherUser(c);
        const role = getUserRole(user);
        return role === "customer" || role === "store";
      }).length,
      distributors: conversations.filter((c: any) => {
        const user = getOtherUser(c);
        const role = getUserRole(user);
        return role === "distributor" || role === "delivery_company";
      }).length,
      admins: conversations.filter((c: any) => {
        const user = getOtherUser(c);
        const role = getUserRole(user);
        return role === "admin" || role === "company_admin";
      }).length,
    };
  }, [conversations, unreadCount, getOtherUser, getUserRole]);
  
  // ============================================================
  // ✅ شرط التحميل (بعد جميع الـ Hooks) ✅
  // ============================================================
  
  if (app.authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2e2a]/5 via-white to-[#0d2e2a]/10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0d2e2a]/20 border-t-[#0d2e2a]" />
      </div>
    );
  }
  
  if (!app.user) return null;
  
  // ============================================================
  // ✅ ✅ ✅ التصميم (JSX) ✅ ✅ ✅
  // ============================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2e2a]/5 via-white to-[#0d2e2a]/10 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#0d2e2a]/10">
      
      {/* ===== الهيدر ===== */}
      <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-[#0d2e2a]/10 dark:border-[#0d2e2a]/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* القسم الأيسر */}
            <div className="flex items-center gap-3">
             <div className="flex items-center gap-1">
  {/* ✅ زر الرجوع مع دعم الاتجاه حسب اللغة */}
  <Button
    variant="ghost"
    size="icon"
    className="h-10 w-10 rounded-xl bg-[#0d2e2a]/5 hover:bg-[#0d2e2a]/10 text-[#0d2e2a] hover:text-[#0d2e2a] transition-all duration-300 group border border-[#0d2e2a]/10 hover:border-[#0d2e2a]/20"
    onClick={goBack}
  >
    {isArabic ? (
      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
    ) : (
      <ChevronLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
    )}
  </Button>
  
  <Button
    variant="ghost"
    size="icon"
    className="h-10 w-10 rounded-xl bg-[#0d2e2a]/5 hover:bg-[#0d2e2a]/10 text-[#0d2e2a] hover:text-[#0d2e2a] transition-all duration-300 group border border-[#0d2e2a]/10 hover:border-[#0d2e2a]/20"
    onClick={goBack}
  >
    <LayoutDashboard className="h-4 w-4 group-hover:scale-110 transition-transform" />
  </Button>
  <div className="w-px h-6 bg-[#0d2e2a]/10 mx-1" />
</div>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-[#0d2e2a] dark:text-white">
                  <div className="p-2.5 rounded-2xl bg-[#0d2e2a] text-white shadow-lg shadow-[#0d2e2a]/20">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  {app.lang === "ar" ? "المراسلات" : "Messages"}
                  {isDeliveryCompany && (
                    <Badge className="bg-[#0d2e2a] text-white text-[10px] px-2 py-0.5 flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {app.lang === "ar" ? "شركة توصيل" : "Delivery Co."}
                    </Badge>
                  )}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-muted-foreground">
                    {app.lang === "ar"
                      ? `${stats.total} محادثة`
                      : `${stats.total} conversations`}
                  </p>
                  {stats.unread > 0 && (
                    <Badge className="bg-red-500 text-white rounded-full px-3 py-1 animate-pulse">
                      {stats.unread} {app.lang === "ar" ? "غير مقروءة" : "unread"}
                    </Badge>
                  )}
                  <span className="text-muted-foreground/30">|</span>
                  <span className="text-xs text-muted-foreground">
                    {stats.customers} {app.lang === "ar" ? "عملاء" : "customers"} · 
                    {stats.distributors} {app.lang === "ar" ? "موزعين" : "distributors"} ·
                    {stats.admins} {app.lang === "ar" ? "أدمن" : "admins"}
                  </span>
                </div>
              </div>
            </div>

            {/* القسم الأيمن: الأزرار */}
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* زر أدمن النظام */}
              {!loadingAdmin && systemAdmin && systemAdmin.id !== app.user?.id && (
                <Button 
                  variant="outline"
                  className="h-10 px-3 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/5 text-[#0d2e2a] transition-all duration-300 hover:scale-105 hover:border-[#0d2e2a]/40"
                  onClick={startAdminChat}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  ) : (
                    <Crown className="h-4 w-4 mr-1.5 text-yellow-500" />
                  )}
                  <span className="hidden sm:inline">
                    {app.lang === "ar" ? "أدمن النظام" : "System Admin"}
                  </span>
                </Button>
              )}

              {/* زر أدمن الشركة */}
              <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="h-10 px-3 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/5 text-[#0d2e2a] transition-all duration-300 hover:scale-105 hover:border-[#0d2e2a]/40"
                  >
                    <ShieldCheck className="h-4 w-4 mr-1.5 text-indigo-500" />
                    <span className="hidden sm:inline">
                      {app.lang === "ar" ? "أدمن الشركة" : "Company Admin"}
                    </span>
                    {companyAdmins.length > 0 && (
                      <Badge className="bg-indigo-500/20 text-indigo-600 text-[8px] px-1.5 py-0 ml-1">
                        {companyAdmins.length}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#0d2e2a]">
                      <ShieldCheck className="h-5 w-5 text-indigo-500" />
                      {app.lang === "ar" ? "محادثة مع أدمن الشركة" : "Chat with Company Admin"}
                    </DialogTitle>
                    <DialogDescription>
                      {app.lang === "ar"
                        ? "اختر أدمن من شركتك لبدء المحادثة"
                        : "Select an admin from your company to start chatting"}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={app.lang === "ar" ? "🔍 بحث عن أدمن (اسم أو رقم)..." : "🔍 Search admin (name or phone)..."}
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="pl-9 rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                    />
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-1.5 border rounded-xl p-1.5">
                    {loadingCompanyAdmins ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0d2e2a] mx-auto" />
                      </div>
                    ) : companyAdmins.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        <ShieldCheck className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        {app.lang === "ar"
                          ? "🚫 لا يوجد أدمن في الشركة حالياً"
                          : "🚫 No admins in the company yet"}
                      </div>
                    ) : filteredCompanyAdmins.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm">
                        {adminSearch
                          ? app.lang === "ar"
                            ? `لا يوجد أدمن باسم أو رقم "${adminSearch}"`
                            : `No admin named or phone "${adminSearch}"`
                          : app.lang === "ar"
                          ? "لا يوجد أدمن في الشركة"
                          : "No admins in the company"}
                      </div>
                    ) : (
                      filteredCompanyAdmins.map((admin: any) => (
                        <div
                          key={admin.id}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0d2e2a]/5 cursor-pointer transition-all hover:border-[#0d2e2a]/20 border border-transparent"
                          onClick={() => startCompanyAdminChat(admin)}
                        >
                          <Avatar className="h-10 w-10">
                            <OptimizedImage
                              src={admin.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.full_name || 'A')}&background=0d2e2a&color=fff`}
                              alt={admin.full_name || 'Admin'}
                              width={40}
                              height={40}
                              quality={80}
                              objectFit="cover"
                              className="h-full w-full object-cover"
                            />
                            <AvatarFallback className="bg-[#0d2e2a] text-white">
                              {(admin.full_name || 'A').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {admin.full_name || (app.lang === "ar" ? "أدمن" : "Admin")}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{admin.phone || (app.lang === "ar" ? "رقم غير متاح" : "No phone")}</span>
                              <Badge className="bg-indigo-500/20 text-indigo-600 text-[8px] px-1.5 py-0 flex items-center gap-0.5">
                                <ShieldCheck className="h-2.5 w-2.5" />
                                {app.lang === "ar" ? "أدمن" : "Admin"}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-[#0d2e2a]/10"
                          >
                            <ChevronRight className="h-4 w-4 text-[#0d2e2a]" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
                      {app.lang === "ar" ? "إلغاء" : "Cancel"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* زر الموزع */}
              {companyDistributors.length > 0 && (
                <Dialog open={showDistributorDialog} onOpenChange={setShowDistributorDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      className="h-10 px-3 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/5 text-[#0d2e2a] transition-all duration-300 hover:scale-105 hover:border-[#0d2e2a]/40"
                    >
                      <Truck className="h-4 w-4 mr-1.5 text-blue-500" />
                      <span className="hidden sm:inline">
                        {app.lang === "ar" ? "موزع" : "Distributor"}
                      </span>
                      <Badge className="bg-blue-500/20 text-blue-600 text-[8px] px-1.5 py-0 ml-1">
                        {companyDistributors.length}
                      </Badge>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-[#0d2e2a]">
                        <Truck className="h-5 w-5 text-blue-500" />
                        {app.lang === "ar" ? "محادثة مع موزع" : "Chat with Distributor"}
                      </DialogTitle>
                      <DialogDescription>
                        {app.lang === "ar"
                          ? "اختر موزعاً من شركتك لبدء المحادثة"
                          : "Select a distributor from your company to start chatting"}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={app.lang === "ar" ? "🔍 بحث عن موزع (اسم أو رقم)..." : "🔍 Search distributor (name or phone)..."}
                        value={distributorSearch}
                        onChange={(e) => setDistributorSearch(e.target.value)}
                        className="pl-9 rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                      />
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto space-y-1.5 border rounded-xl p-1.5">
                      {filteredDistributors.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          {distributorSearch
                            ? app.lang === "ar"
                              ? `لا يوجد موزع باسم أو رقم "${distributorSearch}"`
                              : `No distributor named or phone "${distributorSearch}"`
                            : app.lang === "ar"
                            ? "لا يوجد موزعين في الشركة"
                            : "No distributors in the company"}
                        </div>
                      ) : (
                        filteredDistributors.map((dist: any) => (
                          <div
                            key={dist.id}
                            className={`flex items-center gap-3 p-3 rounded-xl hover:bg-[#0d2e2a]/5 cursor-pointer transition-all hover:border-[#0d2e2a]/20 border border-transparent ${
                              !dist.user_id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => dist.user_id && startDistributorChat(dist)}
                          >
                            <Avatar className="h-10 w-10">
                              <OptimizedImage
                                src={dist.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(dist.full_name_ar || dist.full_name_en || 'D')}&background=0d2e2a&color=fff`}
                                alt={dist.full_name_ar || dist.full_name_en || 'Distributor'}
                                width={40}
                                height={40}
                                quality={80}
                                objectFit="cover"
                                className="h-full w-full object-cover"
                              />
                              <AvatarFallback className="bg-[#0d2e2a] text-white">
                                {(dist.full_name_ar || dist.full_name_en || 'D').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {app.lang === "ar" ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                <span>{dist.phone}</span>
                                {dist.is_available && (
                                  <Badge className="bg-emerald-500/20 text-emerald-600 text-[8px] px-1.5 py-0">
                                    ● {app.lang === "ar" ? "متاح" : "Available"}
                                  </Badge>
                                )}
                                {!dist.user_id && (
                                  <Badge className="bg-red-500/20 text-red-600 text-[8px] px-1.5 py-0">
                                    ⚠️ {app.lang === "ar" ? "بدون حساب" : "No account"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className={`h-8 w-8 rounded-full ${dist.user_id ? 'hover:bg-[#0d2e2a]/10' : 'opacity-50 cursor-not-allowed'}`}
                              disabled={!dist.user_id}
                            >
                              <ChevronRight className="h-4 w-4 text-[#0d2e2a]" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowDistributorDialog(false)}>
                        {app.lang === "ar" ? "إلغاء" : "Cancel"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <div className="w-px h-8 bg-[#0d2e2a]/10 mx-1 hidden sm:block" />

              {/* بحث + فلتر */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={app.lang === "ar" ? "بحث في المحادثات..." : "Search conversations..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-56 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-10 px-3 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/5"
                  >
                    <Filter className="h-4 w-4 text-[#0d2e2a]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl p-1">
                  <DropdownMenuItem 
                    onClick={() => setFilterType("all")}
                    className="rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="h-4 w-4" />
                    {app.lang === "ar" ? "الكل" : "All"}
                    {filterType === "all" && <Check className="h-4 w-4 text-[#0d2e2a] mr-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterType("orders")}
                    className="rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Package className="h-4 w-4" />
                    {app.lang === "ar" ? "العملاء" : "Customers"}
                    {filterType === "orders" && <Check className="h-4 w-4 text-[#0d2e2a] mr-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterType("distributors")}
                    className="rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Truck className="h-4 w-4" />
                    {app.lang === "ar" ? "الموزعين" : "Distributors"}
                    {filterType === "distributors" && <Check className="h-4 w-4 text-[#0d2e2a] mr-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterType("admins")}
                    className="rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {app.lang === "ar" ? "الأدمن" : "Admins"}
                    {filterType === "admins" && <Check className="h-4 w-4 text-[#0d2e2a] mr-auto" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-[#0d2e2a]/10"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4 text-[#0d2e2a]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== قائمة المحادثات ===== */}
      <div className="container mx-auto px-4 py-6">
        {isCreating ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0d2e2a]/20 border-t-[#0d2e2a]" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/50 rounded-3xl border border-[#0d2e2a]/10 dark:border-[#0d2e2a]/30 p-12 text-center shadow-sm">
            <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/5 dark:bg-[#0d2e2a]/20 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-10 w-10 text-[#0d2e2a]/40" />
            </div>
            <h3 className="text-xl font-semibold text-[#0d2e2a] dark:text-white">
              {searchQuery
                ? app.lang === "ar"
                  ? "لا توجد نتائج"
                  : "No results found"
                : app.lang === "ar"
                ? "لا توجد محادثات"
                : "No conversations"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              {searchQuery
                ? app.lang === "ar"
                  ? `لا توجد محادثات تطابق "${searchQuery}"`
                  : `No conversations match "${searchQuery}"`
                : app.lang === "ar"
                ? "سيظهر العملاء والموزعين والأدمن الذين تتواصل معهم هنا"
                : "Customers, distributors and admins you communicate with will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conv: any) => {
              const otherUser = getOtherUser(conv);
              const name = getUserName(otherUser);
              const avatar = getUserAvatar(otherUser);
              const role = getUserRole(otherUser);
              const roleLabel = getRoleLabel(role);
              const roleIcon = getRoleIcon(role);
              const roleColor = getRoleColor(role);
              const unread =
                conv.unread_count_participant1 > 0 || conv.unread_count_participant2 > 0;

              return (
                <div
                  key={conv.id}
                  className="relative group cursor-pointer"
                  onClick={() => openConversation(otherUser.id)}
                >
                  <div
                    className={`
                      bg-white dark:bg-slate-900 rounded-2xl border p-4 hover:shadow-lg transition-all 
                      hover:border-[#0d2e2a]/30 hover:scale-[1.01]
                      ${
                        unread
                          ? "border-[#0d2e2a]/30 dark:border-[#0d2e2a]/50 bg-[#0d2e2a]/5 dark:bg-[#0d2e2a]/10"
                          : "border-slate-200/60 dark:border-slate-700/60"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-[#0d2e2a] transition">
                          <OptimizedImage
                            src={avatar}
                            alt={name}
                            width={56}
                            height={56}
                            quality={80}
                            objectFit="cover"
                            className="h-full w-full object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-[#0d2e2a] to-[#2a655f] text-white text-sm font-bold">
                            {name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {role === "store" && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <Store className="h-2.5 w-2.5 text-emerald-500" />
                          </div>
                        )}
                        {role === "distributor" && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <Truck className="h-2.5 w-2.5 text-blue-500" />
                          </div>
                        )}
                        {role === "admin" && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-yellow-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <Crown className="h-2.5 w-2.5 text-yellow-500" />
                          </div>
                        )}
                        {role === "company_admin" && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-indigo-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <ShieldCheck className="h-2.5 w-2.5 text-indigo-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold truncate text-slate-900 dark:text-white">
                              {name}
                            </span>
                            <Badge 
                              className={cn(
                                "text-[9px] px-1.5 py-0 h-4 rounded-full flex items-center gap-1 border",
                                roleColor
                              )}
                            >
                              {roleIcon}
                              {roleLabel}
                            </Badge>
                          </div>
                          {conv.last_message_at && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTime(conv.last_message_at)}
                            </span>
                          )}
                        </div>

                        {conv.last_message && (
                          <p className="text-sm text-muted-foreground truncate mt-0.5">
                            {conv.last_message}
                          </p>
                        )}
                      </div>

                      {unread && (
                        <Badge className="bg-[#0d2e2a] text-white rounded-full px-2.5 py-0.5 text-xs font-bold animate-pulse">
                          {conv.unread_count_participant1 || conv.unread_count_participant2}
                        </Badge>
                      )}

                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {app.lang === "ar" ? "حذف المحادثة" : "Delete conversation"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryMessagesPage;