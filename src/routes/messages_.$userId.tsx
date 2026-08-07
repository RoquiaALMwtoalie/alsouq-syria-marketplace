// src/routes/messages_/$userId.tsx

import { createFileRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useApp } from "@/lib/i18n";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { Loader2, ArrowLeft, ArrowRight, Search, Phone, MoreVertical, Video, Store, Sparkles, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGetOrCreateConversation } from "@/lib/hooks/useConversation";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

console.log("🔴 CHAT PAGE LOADED");

export const Route = createFileRoute("/messages_/$userId")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "المحادثة الفاخرة — السوق اليك" }] }),
});

function ChatPage() {
  console.log("🟢 CHAT PAGE RENDERED");
  
  const { userId } = Route.useParams();
  const location = useLocation();
  const app = useApp();
  const navigate = useNavigate();
  const isRtl = app.lang === "ar";

  // ====== State ======
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // ====== Refs ======
  const initializedRef = useRef(false);

  // ====== Hooks ======
  const getOrCreateConversation = useGetOrCreateConversation();
  const { setActiveConversation } = useConversationStore();

  // ====== استخراج conversationId من URL ======
  const searchParams = new URLSearchParams(location.search);
  const conversationIdFromUrl = searchParams.get("cid");

  const state = location.state as { 
    fromStore?: boolean; 
    storeId?: string; 
    storeName?: string;
  } | null;

  // ====== 1. جلب بيانات المستخدم الآخر ======
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error fetching user:", error);
        toast.error(app.lang === "ar" ? "حدث خطأ في جلب المستخدم" : "Error fetching user");
        setLoading(false);
        return;
      }

      setOtherUser(data);
      setLoading(false);
    };

    fetchUser();
  }, [userId, app.lang]);

  // ====== 2. تهيئة المحادثة ======
  useEffect(() => {
    const initializeConversation = async () => {
      if (initializedRef.current) return;
      if (!app.user || !userId) return;
      if (isInitializing) return;

      if (conversationIdFromUrl) {
        setConversationId(conversationIdFromUrl);
        setActiveConversation(conversationIdFromUrl);
        initializedRef.current = true;
        return;
      }

      setIsInitializing(true);

      try {
        const conversation = await getOrCreateConversation.mutateAsync({
          userId: app.user.id,
          otherUserId: userId,
        });

        setConversationId(conversation.id);
        setActiveConversation(conversation.id);

        navigate({
          to: "/messages_/$userId",
          params: { userId },
          search: { cid: conversation.id },
          replace: true,
        });

        initializedRef.current = true;
      } catch (error) {
        console.error("❌ Error initializing conversation:", error);
        toast.error(
          app.lang === "ar"
            ? "فشل تهيئة المحادثة. حاول مرة أخرى"
            : "Failed to initialize conversation. Please try again"
        );
      } finally {
        setIsInitializing(false);
      }
    };

    initializeConversation();
  }, [app.user, userId, conversationIdFromUrl, getOrCreateConversation, navigate, setActiveConversation, isInitializing, app.lang]);

  // ====== 3. تعيين المحادثة الحالية في الـ store ======
  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
  }, [conversationId, setActiveConversation]);

  // ====== 4. التحقق من المصادقة ======
  useEffect(() => {
    if (!app.authLoading && !app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
    }
  }, [app.authLoading, app.user, navigate]);

  // ====== ✅ دالة الرجوع الذكية ======
  const handleBack = () => {
    if (state?.fromStore && state?.storeId) {
      navigate({ 
        to: "/store/$id", 
        params: { id: state.storeId },
        state: { fromChat: true }
      });
      return;
    }
    
    const referrer = document.referrer;
    if (referrer.includes("/store/")) {
      navigate({ to: "/store/$id", params: { id: userId } });
      return;
    }
    
    navigate({ to: "/messages" });
  };

  // ====== دوال المكالمة ======
  const handleVoiceCall = () => {
    toast.info(app.lang === "ar" ? "📞 جاري الاتصال الصوتي..." : "📞 Calling...");
  };

  const handleVideoCall = () => {
    toast.info(app.lang === "ar" ? "📹 جاري بدء مكالمة الفيديو..." : "📹 Starting video call...");
  };

  const getUserName = (user: any) => {
    return user?.store_name || user?.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  };

  const getUserAvatar = (user: any) => {
    return (
      user?.store_logo_url ||
      user?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(user))}&background=2a655f&color=fff&size=128`
    );
  };

  // ====== عرض حالة التحميل ======
  if (loading || app.authLoading || isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-emerald-50/20 to-slate-100 dark:from-slate-950 dark:to-[#173d38]/20" dir={isRtl ? "rtl" : "ltr"}>
        <div className="text-center p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 shadow-2xl backdrop-blur-md border border-[#2a655f]/20">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#2a655f]" />
          <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">
            {app.lang === "ar" ? "جاري تجهيز محادثتك الفاخرة..." : "Loading luxury chat..."}
          </p>
        </div>
      </div>
    );
  }

  if (!app.user) return null;

  if (!otherUser) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4" dir={isRtl ? "rtl" : "ltr"}>
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-500/10 border border-red-500/20">
          <span className="text-3xl">❌</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          {app.lang === "ar" ? "المستخدم غير موجود" : "User not found"}
        </h3>
        <Button
          className="mt-6 rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] px-8 text-white font-bold shadow-lg hover:shadow-xl transition-all"
          onClick={() => navigate({ to: "/messages" })}
        >
          {app.lang === "ar" ? "العودة للرسائل" : "Back to messages"}
        </Button>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50 dark:bg-slate-950" dir={isRtl ? "rtl" : "ltr"}>
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#2a655f]" />
        <h3 className="mt-4 text-lg font-bold text-[#2a655f]">
          {app.lang === "ar" ? "جاري تهيئة الاتصال الآمن..." : "Initializing secure chat..."}
        </h3>
      </div>
    );
  }

  const name = getUserName(otherUser);
  const avatar = getUserAvatar(otherUser);
  const isStore = !!otherUser?.store_name;

  return (
    <div className="flex h-[100dvh] flex-col bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-[#112926]/30 dark:to-slate-950 overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* ستايل الحركات والأنيميشن المذهلة */}
      <style>{`
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-4px) rotate(3deg); }
        }
        .animate-chat-float {
          animation: float-icon 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* ====== هيدر المحادثة الفاخر (يتكيف مع كافة الشاشات) ====== */}
      <header className="relative shrink-0 flex items-center justify-between border-b border-[#2a655f]/20 bg-white/90 dark:bg-[#173d38]/90 backdrop-blur-xl px-4 py-3 shadow-lg z-20">
        
        {/* خط إشعاعي علوي متوهج */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#3a8a82] to-transparent" />

        {/* معلومات المستخدم الآخر وزر الرجوع المطور */}
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10 shrink-0 rounded-2xl bg-[#2a655f]/10 hover:bg-[#2a655f]/20 text-[#2a655f] dark:text-[#3a8a82] transition-all border border-[#2a655f]/20 shadow-sm cursor-pointer"
          >
            {isRtl ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
          </Button>

          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="h-11 w-11 ring-2 ring-[#2a655f]/40 shadow-md transition-transform hover:scale-105">
                <img src={avatar} alt={name} className="object-cover h-full w-full" />
                <AvatarFallback className="bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-sm font-extrabold">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isStore && (
                <div className="absolute -bottom-0.5 -right-0.5 h-4.5 w-4.5 rounded-full bg-[#2a655f] border-2 border-white dark:border-slate-900 flex items-center justify-center shadow">
                  <Store className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-black text-sm md:text-base text-slate-900 dark:text-white truncate tracking-wide">
                  {name}
                </span>
                {isStore && (
                  <Badge className="text-[9px] px-2 py-0.5 h-4 bg-[#2a655f]/15 text-[#2a655f] dark:text-emerald-300 border border-[#2a655f]/30 rounded-full font-extrabold hidden sm:inline-flex">
                    {app.lang === "ar" ? "متجر معتمد" : "Verified Store"}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase">
                  {app.lang === "ar" ? "متصل الآن" : "Active Now"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار الإجراءات الاحترافية والساحرة */}
        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          
          {/* زر المكالمة الصوتية */}
          <button 
            onClick={handleVoiceCall}
            className="group relative flex items-center justify-center h-10 w-10 rounded-2xl bg-[#2a655f]/10 hover:bg-[#2a655f] text-[#2a655f] hover:text-white transition-all duration-300 border border-[#2a655f]/20 shadow-sm cursor-pointer"
            title={app.lang === "ar" ? "مكالمة صوتية" : "Voice call"}
          >
            <Phone className="h-4 w-4 animate-chat-float" />
          </button>

          {/* زر مكالمة الفيديو */}
          <button 
            onClick={handleVideoCall}
            className="group relative flex items-center justify-center h-10 w-10 rounded-2xl bg-[#2a655f]/10 hover:bg-[#2a655f] text-[#2a655f] hover:text-white transition-all duration-300 border border-[#2a655f]/20 shadow-sm cursor-pointer"
            title={app.lang === "ar" ? "مكالمة فيديو" : "Video call"}
          >
            <Video className="h-4 w-4 animate-chat-float" style={{ animationDelay: '0.5s' }} />
          </button>

          {/* زر البحث السريع */}
          <button 
            className="hidden sm:flex items-center justify-center h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
            title={app.lang === "ar" ? "بحث في المحادثة" : "Search in chat"}
          >
            <Search className="h-4 w-4" />
          </button>

          {/* زر الخيارات الإضافية */}
          <button 
            className="flex items-center justify-center h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-all border border-slate-200/60 dark:border-slate-700/60 cursor-pointer"
            title={app.lang === "ar" ? "خيارات إضافية" : "More options"}
          >
            <MoreVertical className="h-4 w-4" />
          </button>

        </div>
      </header>

      {/* ====== منطقة نافذة الرسائل التفاعلية (معالجة الشاشات كاملة) ====== */}
      <div className="flex-1 overflow-hidden relative p-1 sm:p-3 max-w-5xl w-full mx-auto">
        <div className="h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-[#2a655f]/20 bg-white/95 dark:bg-[#1a2b28]/95 backdrop-blur-xl">
          <ChatMessages
            userId={app.user.id}
            conversationId={conversationId}
            otherUserId={userId}
            className="h-full w-full bg-transparent"
            onBack={handleBack}
            hideHeader={true}
          />
        </div>
      </div>

    </div>
  );
}