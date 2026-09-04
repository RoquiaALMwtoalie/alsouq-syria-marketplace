// src/routes/distributor/messages.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useCallback, useMemo } from "react";
import { 
  MessageCircle, Search, Truck, Store, ChevronRight, 
  MoreVertical, Trash2, Users, Package,
  Clock, Phone,
  User, Building2, RefreshCw,
  Check, Shield, 
  Plus, ShieldCheck, Crown,
  ArrowLeft, Filter, X, UsersRound,
  BadgeCheck, UserCog
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

export const Route = createFileRoute("/distributor/messages")({
  component: DistributorMessagesPage,
  head: () => ({ meta: [{ title: "مراسلة العملاء — السوق لعندك" }] }),
});

function DistributorMessagesPage() {
  const app = useApp();
  const navigate = useNavigate();
  const isArabic = app.lang === "ar";
  
  // ====== ✅ جميع الـ State في الأعلى ======
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "orders" | "distributors" | "admins">("all");
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [showDistributorDialog, setShowDistributorDialog] = useState(false);
  const [adminSearch, setAdminSearch] = useState("");
  const [distributorSearch, setDistributorSearch] = useState("");
  const [companyAdmins, setCompanyAdmins] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [userRolesMap, setUserRolesMap] = useState<Map<string, string[]>>(new Map());

  // ====== Hooks البيانات ======
  const { data: company } = useMyDeliveryCompany(app.user?.id);
  const { data: userRoles = [] } = useUserRoles(app.user?.id);
  const { data: allDistributors = [] } = useDistributors({});
  const { data: conversations = [], isLoading, refetch } = useConversations();
  const { data: unreadCount = 0 } = useUnreadCount();
  const deleteConversation = useDeleteConversation();
  const getOrCreateConversation = useGetOrCreateConversation();
  const { setConversations, deleteConversation: deleteFromStore } = useConversationStore();

  // ====== ✅ جميع الـ useCallback و useMemo في الأعلى ======
  const isDistributor = userRoles.includes('distributor');

  // ✅ دالة getOtherUser - محمية من null
  const getOtherUser = useCallback((conv: any) => {
    if (!app.user?.id) {
      console.warn("⚠️ getOtherUser: No user logged in");
      return null;
    }
    if (!conv || !conv.participant1_id || !conv.participant2_id) {
      console.warn("⚠️ getOtherUser: Invalid conversation", conv);
      return null;
    }
    return conv.participant1_id === app.user.id ? conv.participant2 : conv.participant1;
  }, [app.user?.id]);

  const getUserName = useCallback((user: any) => {
    if (!user) return app.lang === "ar" ? "مستخدم" : "User";
    return user?.store_name || user?.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  }, [app.lang]);

  const getUserAvatar = useCallback((user: any) => {
    if (!user) {
      return `https://ui-avatars.com/api/?name=${app.lang === "ar" ? "مستخدم" : "User"}&background=d81b60&color=fff&size=128`;
    }
    return (
      user?.store_logo_url ||
      user?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(user))}&background=d81b60&color=fff&size=128`
    );
  }, [getUserName, app.lang]);

  const getUserRole = useCallback((user: any) => {
    if (!user?.id) return "customer";
    const roles = userRolesMap.get(user.id) || [];
    const isCompanyAdmin = companyAdmins.some(admin => admin.id === user.id);
    if (isCompanyAdmin) return "company_admin";
    if (roles.includes("admin")) return "admin";
    if (roles.includes("delivery_company")) return "delivery_company";
    if (roles.includes("distributor")) return "distributor";
    if (roles.includes("seller")) return "store";
    if (user?.store_name) return "store";
    return "customer";
  }, [userRolesMap, companyAdmins]);

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
      case "company_admin": return "bg-pink-500/20 text-pink-600 border-pink-500/30";
      default: return "bg-slate-500/20 text-slate-600 border-slate-500/30";
    }
  }, []);

  const formatTime = useCallback((date: string) => {
    if (!date) return "";
    try {
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
    } catch (error) {
      console.warn("⚠️ formatTime error:", error);
      return "";
    }
  }, [app.lang]);

  // ====== ✅ جميع الـ useEffect في الأعلى ======
  useEffect(() => {
    if (conversations.length > 0) {
      setConversations(conversations);
    }
  }, [conversations, setConversations]);

  useEffect(() => {
    if (!app.authLoading && !app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
    }
  }, [app.authLoading, app.user, navigate]);

  // ✅ جلب أدمن الشركة
  useEffect(() => {
    const fetchCompanyAdmins = async () => {
      if (!company?.id) {
        console.log("ℹ️ No company found, skipping admin fetch");
        setCompanyAdmins([]);
        setLoadingAdmins(false);
        return;
      }

      console.log("🔍 Fetching admins for company:", company.id);
      setLoadingAdmins(true);

      try {
        const { data: adminRecords, error: adminError } = await supabase
          .from("delivery_company_admins")
          .select(`
            user_id,
            company_id,
            profiles:user_id (
              id,
              full_name,
              phone,
              avatar_url
            )
          `)
          .eq("company_id", company.id);

        if (adminError) {
          console.error("❌ Error fetching company admins:", adminError);
          throw adminError;
        }

        console.log("📋 Admin records found:", adminRecords?.length || 0);

        if (!adminRecords || adminRecords.length === 0) {
          console.log("ℹ️ No admins found for this company");
          setCompanyAdmins([]);
          setLoadingAdmins(false);
          return;
        }

        const adminProfiles = adminRecords
          .map((r: any) => r.profiles)
          .filter(Boolean)
          .map((profile: any) => ({
            ...profile,
            id: profile.id,
            full_name: profile.full_name || "غير معروف",
          }));

        console.log("👤 Admin profiles:", adminProfiles.length);
        setCompanyAdmins(adminProfiles);

      } catch (error) {
        console.error("❌ Error in fetchCompanyAdmins:", error);
        setCompanyAdmins([]);
      } finally {
        setLoadingAdmins(false);
      }
    };

    fetchCompanyAdmins();
  }, [company]);

  // ✅ جلب أدوار المستخدمين
  useEffect(() => {
    const fetchAllUserRoles = async () => {
      if (!conversations.length) return;
      
      const userIds = new Set<string>();
      conversations.forEach((conv: any) => {
        const user1 = conv.participant1;
        const user2 = conv.participant2;
        if (user1?.id) userIds.add(user1.id);
        if (user2?.id) userIds.add(user2.id);
      });
      
      if (!userIds.size) return;
      
      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", Array.from(userIds));
        
        if (error) throw error;
        
        const rolesMap = new Map<string, string[]>();
        data?.forEach((item: any) => {
          if (!rolesMap.has(item.user_id)) {
            rolesMap.set(item.user_id, []);
          }
          rolesMap.get(item.user_id)!.push(item.role);
        });
        
        setUserRolesMap(rolesMap);
      } catch (error) {
        console.error("Error fetching user roles:", error);
      }
    };
    
    fetchAllUserRoles();
  }, [conversations]);

  // ====== ✅ جميع الـ useCallback للدوال الأساسية ======
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
        to: "/distributor/conversation/$userId",
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

  const startAdminChat = useCallback(async (admin: any) => {
    if (!admin?.id) {
      toast.error(app.lang === "ar" ? "❌ هذا الأدمن ليس لديه حساب" : "❌ This admin does not have an account");
      setShowAdminDialog(false);
      return;
    }
    if (admin.id === app.user?.id) {
      toast.info(app.lang === "ar" ? "💬 أنت هذا الأدمن، لا يمكنك مراسلة نفسك" : "💬 You are this admin, you can't message yourself");
      setShowAdminDialog(false);
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

  // ====== ✅ جميع الـ useMemo في الأعلى ======
  const companyDistributors = useMemo(() => {
    return allDistributors.filter(
      (d: any) => 
        d.delivery_company_id === company?.id &&
        d.user_id !== app.user?.id &&
        d.user_id !== null
    );
  }, [allDistributors, company?.id, app.user?.id]);

  const filteredAdmins = useMemo(() => {
    const search = adminSearch.toLowerCase().trim();
    return companyAdmins.filter((admin: any) => {
      const name = admin.full_name?.toLowerCase() || '';
      const phone = admin.phone?.toLowerCase() || '';
      return name.includes(search) || phone.includes(search);
    });
  }, [companyAdmins, adminSearch]);

  const filteredDistributors = useMemo(() => {
    const search = distributorSearch.toLowerCase().trim();
    return companyDistributors.filter((dist: any) => {
      const name = (app.lang === "ar" ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar)?.toLowerCase() || '';
      const phone = dist.phone?.toLowerCase() || '';
      return name.includes(search) || phone.includes(search);
    });
  }, [companyDistributors, distributorSearch, app.lang]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv: any) => {
      const otherUser = getOtherUser(conv);
      if (!otherUser) return false;
      
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

  const stats = useMemo(() => {
    return {
      total: conversations.length,
      unread: unreadCount,
      customers: conversations.filter((c: any) => {
        const user = getOtherUser(c);
        if (!user) return false;
        const role = getUserRole(user);
        return role === "customer" || role === "store";
      }).length,
      distributors: conversations.filter((c: any) => {
        const user = getOtherUser(c);
        if (!user) return false;
        const role = getUserRole(user);
        return role === "distributor" || role === "delivery_company";
      }).length,
      admins: conversations.filter((c: any) => {
        const user = getOtherUser(c);
        if (!user) return false;
        const role = getUserRole(user);
        return role === "admin" || role === "company_admin";
      }).length,
    };
  }, [conversations, unreadCount, getOtherUser, getUserRole]);

  // ============================================================
  // ✅ الـ return بعد جميع الـ Hooks
  // ============================================================
  
  if (app.authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d81b60]/5 via-white to-[#d81b60]/10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d81b60]/20 border-t-[#d81b60]" />
      </div>
    );
  }

  if (!app.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d81b60]/5 via-white to-[#d81b60]/10">
        <div className="text-center">
          <p className="text-muted-foreground">
            {app.lang === "ar" ? "يرجى تسجيل الدخول" : "Please login"}
          </p>
          <Button 
            onClick={() => navigate({ to: "/auth/$mode", params: { mode: "login" } })}
            className="mt-4 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/30"
          >
            {app.lang === "ar" ? "تسجيل الدخول" : "Login"}
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================
  // التصميم مع الألوان الوردية
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d81b60]/5 via-white to-[#d81b60]/10 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#d81b60]/10">
      
      {/* ===== الهيدر - تدرج وردي ===== */}
      <div className="relative bg-gradient-to-r from-[#d81b60] via-[#f48fb1] to-[#d81b60] text-white overflow-hidden shadow-lg shadow-[#d81b60]/30">
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-spin-slow" />
        </div>
        
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
          <div className="absolute top-1/2 -translate-y-1/2 animate-drive-across">
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
              <Truck className="h-10 w-10 text-white animate-bounce-truck" />
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow" />
                <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow" style={{ animationDelay: '0.3s' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-white/30 animate-spin-slow" style={{ animationDelay: '0.6s' }} />
              </div>
              <span className="text-[10px] font-bold text-white/30 tracking-widest animate-pulse">● ● ●</span>
            </div>
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            {/* ✅ القسم الأيسر - زر الرجوع المحسن */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: "/distributor/dashboard" })}
                className="h-9 w-9 shrink-0 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 hover:scale-105 group border border-white/30"
              >
                {isArabic ? (
                  <ChevronRight className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <ChevronLeft className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" />
                )}
              </Button>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-sm text-white shadow-lg shadow-white/20 animate-float">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  {app.lang === "ar" ? "المراسلات" : "Messages"}
                  <Badge className="bg-white/20 text-white border-0 text-[10px] px-2 py-0.5 flex items-center gap-1 animate-pulse backdrop-blur-sm">
                    <Truck className="h-3 w-3 animate-bounce-slow" />
                    {app.lang === "ar" ? "موزع" : "Distributor"}
                  </Badge>
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-white/80">
                    {app.lang === "ar"
                      ? `${stats.total} محادثة`
                      : `${stats.total} conversations`}
                  </p>
                  {stats.unread > 0 && (
                    <Badge className="bg-red-500 text-white rounded-full px-3 py-1 animate-pulse shadow-lg shadow-red-500/50">
                      {stats.unread} {app.lang === "ar" ? "غير مقروءة" : "unread"}
                    </Badge>
                  )}
                  <span className="text-white/30">|</span>
                  <span className="text-xs text-white/70">
                    {stats.customers} {app.lang === "ar" ? "عملاء" : "customers"} · 
                    {stats.distributors} {app.lang === "ar" ? "موزعين" : "distributors"} ·
                    {stats.admins} {app.lang === "ar" ? "أدمن" : "admins"}
                  </span>
                </div>
              </div>
            </div>

            {/* ✅ القسم الأيمن - الأزرار */} 
            <div className="flex items-center gap-2 flex-wrap">
              
              {/* ✅ زر أدمن الشركة - وردي */}
              <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="h-10 px-5 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 border-white/20 hover:border-white/40 text-white hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 group font-medium"
                  >
                    <ShieldCheck className="h-4 w-4 mr-2 text-white/80 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    <span className="hidden sm:inline">{app.lang === "ar" ? "أدمن الشركة" : "Company Admin"}</span>
                    <span className="inline sm:hidden">{app.lang === "ar" ? "أدمن" : "Admin"}</span>
                    {companyAdmins.length > 0 && (
                      <Badge className="bg-gradient-to-r from-white/30 to-white/20 text-white border-0 text-[10px] px-2 py-0.5 ml-1.5 backdrop-blur-sm">
                        {companyAdmins.length}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl max-w-md border-2 border-[#d81b60]/30 shadow-2xl shadow-[#d81b60]/20 bg-white dark:bg-slate-900">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#d81b60] dark:text-white text-xl">
                      <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1]">
                        <ShieldCheck className="h-5 w-5 text-white" />
                      </div>
                      {app.lang === "ar" ? "أدمن الشركة" : "Company Admins"}
                    </DialogTitle>
                    <DialogDescription>
                      {app.lang === "ar"
                        ? `اختر أدمن من شركتك (${companyAdmins.length}) لبدء المحادثة`
                        : `Select an admin from your company (${companyAdmins.length}) to start chatting`}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d81b60]/50" />
                    <Input
                      placeholder={app.lang === "ar" ? "بحث عن أدمن..." : "Search admin..."}
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="pl-9 rounded-xl border-2 border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                    />
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-1.5 border-2 rounded-xl p-1.5 border-[#d81b60]/20">
                    {loadingAdmins ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#d81b60]/20 border-t-[#d81b60]" />
                      </div>
                    ) : filteredAdmins.length === 0 ? (
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
                      filteredAdmins.map((admin: any) => (
                        <div
                          key={admin.id}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#d81b60]/10 dark:hover:bg-[#d81b60]/20 cursor-pointer transition-all hover:border-[#d81b60]/40 border-2 border-transparent group"
                          onClick={() => startAdminChat(admin)}
                        >
                          <Avatar className="h-10 w-10 ring-2 ring-[#d81b60]/20 group-hover:ring-[#d81b60]/40 transition-all">
                            <img 
                              src={admin.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(admin.full_name || 'A')}&background=d81b60&color=fff`} 
                              alt={admin.full_name || 'Admin'}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white">
                              {(admin.full_name || 'A').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-[#d81b60] transition-colors">
                              {admin.full_name || (app.lang === "ar" ? "أدمن" : "Admin")}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                              <Phone className="h-3 w-3" />
                              <span>{admin.phone || (app.lang === "ar" ? "رقم غير متاح" : "No phone")}</span>
                              <Badge className="bg-[#d81b60]/20 text-[#d81b60] dark:text-[#f48fb1] text-[8px] px-2 py-0 flex items-center gap-0.5 border-0">
                                <ShieldCheck className="h-2.5 w-2.5" />
                                {app.lang === "ar" ? "أدمن" : "Admin"}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-[#d81b60]/20 opacity-0 group-hover:opacity-100 transition-all text-[#d81b60]"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAdminDialog(false)} className="border-2 border-[#d81b60]/30 hover:bg-[#d81b60]/10 text-[#d81b60]">
                      {app.lang === "ar" ? "إغلاق" : "Close"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* ✅ زر الموزعين - وردي */}
              <Dialog open={showDistributorDialog} onOpenChange={setShowDistributorDialog}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className="h-10 px-5 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 border-white/20 hover:border-white/40 text-white hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-white/10 group font-medium"
                  >
                    <UsersRound className="h-4 w-4 mr-2 text-white/80 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    <span className="hidden sm:inline">{app.lang === "ar" ? "الموزعين" : "Distributors"}</span>
                    <span className="inline sm:hidden">{app.lang === "ar" ? "موزعين" : "Dists"}</span>
                    {companyDistributors.length > 0 && (
                      <Badge className="bg-gradient-to-r from-white/30 to-white/20 text-white border-0 text-[10px] px-2 py-0.5 ml-1.5 backdrop-blur-sm">
                        {companyDistributors.length}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-2xl max-w-md border-2 border-[#d81b60]/30 shadow-2xl shadow-[#d81b60]/20 bg-white dark:bg-slate-900">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-[#d81b60] dark:text-white text-xl">
                      <div className="p-1.5 rounded-xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1]">
                        <UsersRound className="h-5 w-5 text-white" />
                      </div>
                      {app.lang === "ar" ? "الموزعين" : "Distributors"}
                    </DialogTitle>
                    <DialogDescription>
                      {app.lang === "ar"
                        ? `اختر موزعاً من شركتك (${companyDistributors.length}) لبدء المحادثة`
                        : `Select a distributor from your company (${companyDistributors.length}) to start chatting`}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d81b60]/50" />
                    <Input
                      placeholder={app.lang === "ar" ? "بحث عن موزع..." : "Search distributor..."}
                      value={distributorSearch}
                      onChange={(e) => setDistributorSearch(e.target.value)}
                      className="pl-9 rounded-xl border-2 border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                    />
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-1.5 border-2 rounded-xl p-1.5 border-[#d81b60]/20">
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
                          className={`flex items-center gap-3 p-3 rounded-xl hover:bg-[#d81b60]/10 dark:hover:bg-[#d81b60]/20 cursor-pointer transition-all hover:border-[#d81b60]/40 border-2 border-transparent group ${
                            !dist.user_id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          onClick={() => dist.user_id && startDistributorChat(dist)}
                        >
                          <Avatar className="h-10 w-10 ring-2 ring-[#d81b60]/20 group-hover:ring-[#d81b60]/40 transition-all">
                            <img 
                              src={dist.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(dist.full_name_ar || dist.full_name_en || 'D')}&background=d81b60&color=fff`} 
                              alt={dist.full_name_ar || dist.full_name_en || 'Distributor'}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white">
                              {(dist.full_name_ar || dist.full_name_en || 'D').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate group-hover:text-[#d81b60] transition-colors">
                              {app.lang === "ar" ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                              <Phone className="h-3 w-3" />
                              <span>{dist.phone}</span>
                              {dist.is_available && (
                                <Badge className="bg-emerald-500/20 text-emerald-600 text-[8px] px-2 py-0 flex items-center gap-1 border-0">
                                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  {app.lang === "ar" ? "متاح" : "Available"}
                                </Badge>
                              )}
                              {!dist.user_id && (
                                <Badge className="bg-red-500/20 text-red-600 text-[8px] px-2 py-0 border-0">
                                  ⚠️ {app.lang === "ar" ? "بدون حساب" : "No account"}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className={`h-8 w-8 rounded-full ${dist.user_id ? 'hover:bg-[#d81b60]/20 opacity-0 group-hover:opacity-100 text-[#d81b60]' : 'opacity-50 cursor-not-allowed'} transition-all`}
                            disabled={!dist.user_id}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDistributorDialog(false)} className="border-2 border-[#d81b60]/30 hover:bg-[#d81b60]/10 text-[#d81b60]">
                      {app.lang === "ar" ? "إغلاق" : "Close"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="w-px h-8 bg-[#d81b60]/30 mx-1 hidden sm:block" />

              {/* بحث في المحادثات */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#d81b60]/50 group-focus-within:text-[#d81b60] transition-all duration-300 group-focus-within:scale-110" />
                <Input
                  placeholder={app.lang === "ar" ? "🔍 بحث في المحادثات..." : "🔍 Search conversations..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full md:w-56 rounded-xl border-2 border-[#d81b60]/30 dark:border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>

              {/* فلتر */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="h-10 px-3 rounded-xl border-2 border-[#d81b60]/30 hover:bg-[#d81b60]/10 text-[#d81b60]"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl p-1 border-2 border-[#d81b60]/20">
                  <DropdownMenuItem 
                    onClick={() => setFilterType("all")}
                    className="rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#d81b60]/10"
                  >
                    <Users className="h-4 w-4" />
                    {app.lang === "ar" ? "الكل" : "All"}
                    {filterType === "all" && <Check className="h-4 w-4 text-[#d81b60] mr-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterType("distributors")}
                    className="rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#d81b60]/10"
                  >
                    <Truck className="h-4 w-4" />
                    {app.lang === "ar" ? "الموزعين" : "Distributors"}
                    {filterType === "distributors" && <Check className="h-4 w-4 text-[#d81b60] mr-auto" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setFilterType("admins")}
                    className="rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#d81b60]/10"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {app.lang === "ar" ? "الأدمن" : "Admins"}
                    {filterType === "admins" && <Check className="h-4 w-4 text-[#d81b60] mr-auto" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl hover:bg-[#d81b60]/10 transition-all duration-300 hover:rotate-180 group border-2 border-[#d81b60]/30 hover:border-[#d81b60]/60"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4 text-[#d81b60] group-hover:scale-110 transition-all duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== قائمة المحادثات ===== */}
      <div className="container mx-auto px-4 py-6">
        {isCreating ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#d81b60]/20 border-t-[#d81b60]" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/50 rounded-3xl border-2 border-[#d81b60]/20 dark:border-[#d81b60]/30 p-12 text-center shadow-sm hover:shadow-md hover:border-[#d81b60]/40 transition-all duration-300">
            <div className="h-20 w-20 rounded-full bg-[#d81b60]/10 dark:bg-[#d81b60]/20 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
              <MessageCircle className="h-10 w-10 text-[#d81b60]/40" />
            </div>
            <h3 className="text-xl font-semibold text-[#d81b60] dark:text-white">
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
                ? "سيظهر الموزعين والأدمن الذين تتواصل معهم هنا"
                : "Distributors and admins you communicate with will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conv: any) => {
              const otherUser = getOtherUser(conv);
              
              // ✅ إذا لم يكن هناك مستخدم آخر، تخطى هذه المحادثة
              if (!otherUser) {
                console.warn("⚠️ Skipping conversation with no other user:", conv);
                return null;
              }
              
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
                      bg-white dark:bg-slate-900 rounded-2xl border-2 p-4 hover:shadow-xl transition-all duration-300 
                      hover:border-[#d81b60]/50 hover:scale-[1.01]
                      ${
                        unread
                          ? "border-[#d81b60]/40 dark:border-[#d81b60]/50 bg-gradient-to-r from-[#d81b60]/5 to-transparent dark:from-[#d81b60]/10 dark:to-transparent"
                          : "border-[#d81b60]/20 dark:border-[#d81b60]/30"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-2 ring-[#d81b60]/30 dark:ring-[#d81b60]/40 group-hover:ring-[#d81b60] transition-all duration-300 group-hover:scale-105">
                          <img src={avatar} alt={name} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white text-sm font-bold">
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
                            <Truck className="h-2.5 w-2.5 text-blue-500 animate-bounce-slow" />
                          </div>
                        )}
                        {role === "admin" && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-yellow-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <Crown className="h-2.5 w-2.5 text-yellow-500 animate-spin-slow" />
                          </div>
                        )}
                        {role === "company_admin" && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-pink-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <ShieldCheck className="h-2.5 w-2.5 text-pink-500" />
                          </div>
                        )}
                        {role === "delivery_company" && (
                          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-purple-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                            <Building2 className="h-2.5 w-2.5 text-purple-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold truncate text-slate-900 dark:text-white group-hover:text-[#d81b60] transition-colors duration-300">
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
                          <p className="text-sm text-muted-foreground truncate mt-0.5 group-hover:text-[#d81b60]/70 transition-colors duration-300">
                            {conv.last_message}
                          </p>
                        )}
                      </div>

                      {unread && (
                        <Badge className="bg-[#d81b60] text-white rounded-full px-2.5 py-0.5 text-xs font-bold animate-pulse shadow-lg shadow-[#d81b60]/30 border-0">
                          {conv.unread_count_participant1 || conv.unread_count_participant2}
                        </Badge>
                      )}

                      <ChevronRight className="h-4 w-4 text-[#d81b60]/50 group-hover:translate-x-1 group-hover:text-[#d81b60] transition-all duration-300" />
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-[#d81b60]/10 border-2 border-[#d81b60]/20 hover:border-[#d81b60]/50 text-[#d81b60]"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-2 border-[#d81b60]/20">
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
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}