// src/routes/delivery/conversation.$userId.tsx

import { createFileRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/i18n";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { 
  Loader2, ArrowLeft, Phone, MoreVertical, Video, User, Building2, Truck, Crown, Store
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/delivery/conversation/$userId")({
  component: ConversationPage,
  head: () => ({ meta: [{ title: "المحادثة — شركة التوصيل" }] }),
});

function ConversationPage() {
  const { userId } = Route.useParams();
  const location = useLocation();
  const app = useApp();
  const navigate = useNavigate();

  const [otherUser, setOtherUser] = useState<any>(null);
  const [otherUserRoles, setOtherUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const { setActiveConversation } = useConversationStore();

  const searchParams = new URLSearchParams(location.search);
  const conversationIdFromUrl = searchParams.get("cid");

  // جلب بيانات المستخدم الآخر وأدواره
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      setLoading(true);
      
      try {
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (userError) throw userError;

        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId);

        if (rolesError) throw rolesError;

        const roles = rolesData?.map(r => r.role) || [];
        
        setOtherUser(userData);
        setOtherUserRoles(roles);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        toast.error(app.lang === "ar" ? "حدث خطأ في جلب المستخدم" : "Error fetching user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, app.lang]);

  // تعيين conversationId
  useEffect(() => {
    if (conversationIdFromUrl) {
      setConversationId(conversationIdFromUrl);
      setActiveConversation(conversationIdFromUrl);
    }
  }, [conversationIdFromUrl, setActiveConversation]);

  // التحقق من المصادقة
  useEffect(() => {
    if (!app.authLoading && !app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
    }
  }, [app.authLoading, app.user, navigate]);

  const handleBack = () => {
    navigate({ to: "/delivery/messages" });
  };

  // ====== ✅ دالة الحصول على أعلى دور (أعلى صلاحية) ======
  const getRoleInfo = () => {
    // ترتيب الصلاحيات من الأعلى إلى الأقل
    const rolePriority = [
      { role: 'admin', label: app.lang === "ar" ? "أدمن النظام" : "System Admin", icon: Crown, color: "text-yellow-500" },
      { role: 'delivery_company', label: app.lang === "ar" ? "شركة توصيل" : "Delivery Co.", icon: Building2, color: "text-emerald-500" },
      { role: 'seller', label: app.lang === "ar" ? "بائع" : "Seller", icon: Store, color: "text-purple-500" },
      { role: 'distributor', label: app.lang === "ar" ? "موزع" : "Distributor", icon: Truck, color: "text-blue-500" },
    ];

    // البحث عن أول دور موجود في قائمة أدوار المستخدم
    for (const priority of rolePriority) {
      if (otherUserRoles.includes(priority.role)) {
        return priority;
      }
    }

    // إذا ما في أي دور محدد، اعتبره عميل
    return { 
      role: 'customer',
      label: app.lang === "ar" ? "عميل" : "Customer", 
      icon: User, 
      color: "text-slate-500" 
    };
  };

  // عرض التحميل
  if (loading || app.authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0d2e2a]" />
          <p className="mt-4 text-sm text-muted-foreground">
            {app.lang === "ar" ? "جاري تحميل المحادثة..." : "Loading conversation..."}
          </p>
        </div>
      </div>
    );
  }

  if (!app.user) return null;

  // المستخدم غير موجود
  if (!otherUser) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <span className="text-3xl">❌</span>
        </div>
        <h3 className="text-xl font-semibold text-red-600">
          {app.lang === "ar" ? "المستخدم غير موجود" : "User not found"}
        </h3>
        <Button
          className="mt-4 rounded-full bg-[#0d2e2a] px-6 text-white hover:bg-[#2a655f]"
          onClick={handleBack}
        >
          {app.lang === "ar" ? "العودة للرسائل" : "Back to messages"}
        </Button>
      </div>
    );
  }

  // جاري تهيئة المحادثة
  if (!conversationId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-yellow-600">
          {app.lang === "ar" ? "جاري تهيئة المحادثة..." : "Initializing conversation..."}
        </h3>
        <Loader2 className="mx-auto mt-4 h-6 w-6 animate-spin text-[#0d2e2a]" />
      </div>
    );
  }

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // ====== واجهة المحادثة ======
  return (
    <div className="flex h-[100dvh] flex-col bg-[#f0f2f5] dark:bg-[#1a1a2e]">
      
      {/* هيدر المحادثة */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200/50 bg-white px-3 py-2 dark:border-slate-700/50 dark:bg-[#242538] sm:px-4 sm:py-3">
        
        {/* الجهة اليسرى: زر الرجوع + معلومات المستخدم */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8 shrink-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 sm:h-9 sm:w-9"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-slate-200 dark:ring-slate-700">
              <img 
                src={otherUser?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser?.full_name || 'User')}&background=0d2e2a&color=fff`} 
                alt={otherUser?.full_name || 'User'}
                className="object-cover"
              />
              <AvatarFallback className="bg-[#0d2e2a] text-white">
                {(otherUser?.full_name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate text-slate-900 dark:text-white">
                  {otherUser?.full_name || (app.lang === "ar" ? "مستخدم" : "User")}
                </span>
                {/* ✅ عرض دور واحد فقط (أعلى صلاحية) */}
                <Badge 
                  variant="secondary"
                  className="text-[9px] px-1.5 py-0 h-4 rounded-full flex items-center gap-0.5"
                >
                  <RoleIcon className={`h-2.5 w-2.5 ${roleInfo.color}`} />
                  {roleInfo.label}
                </Badge>
              </div>
              {/* ✅ عرض دور واحد فقط تحت الاسم */}
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <RoleIcon className={`h-3 w-3 ${roleInfo.color}`} />
                {roleInfo.label}
              </p>
            </div>
          </div>
        </div>

        {/* الجهة اليمنى: أزرار المكالمة */}
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <button className="rounded-full p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:p-2">
            <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button className="rounded-full p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:p-2">
            <Video className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button className="rounded-full p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 sm:p-2">
            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>

      {/* مكون المحادثة */}
      <div className="flex-1 overflow-hidden">
        <ChatMessages
          userId={app.user.id}
          conversationId={conversationId}
          otherUserId={userId}
          className="h-full w-full max-w-4xl mx-auto bg-white shadow-xl dark:bg-[#242538]"
          onBack={handleBack}
          hideHeader={true}
        />
      </div>

    </div>
  );
}