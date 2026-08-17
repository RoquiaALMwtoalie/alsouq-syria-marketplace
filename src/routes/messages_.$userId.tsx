// src/routes/messages_/$userId.tsx

import { createFileRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useApp } from "@/lib/i18n";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGetOrCreateConversation } from "@/lib/hooks/useConversation";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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

      {/* ====== ✅ استخدام ChatHeader بدلاً من الهيدر المخصص ====== */}
      <ChatHeader
        user={{
          id: otherUser.id,
          full_name: otherUser.full_name || null,
          avatar_url: otherUser.avatar_url || null,
          store_name: otherUser.store_name || null,
          store_logo_url: otherUser.store_logo_url || null,
          is_online: otherUser?.is_online || false,
          last_seen_at: otherUser?.last_seen_at || null,
        }}
        conversationId={conversationId}
        isStore={isStore}
        onBack={handleBack}
        onCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        onViewProfile={() => navigate({ to: "/profile" })}
        onViewStore={() => {
          if (isStore) {
            navigate({ to: "/store/$id", params: { id: userId } });
          }
        }}
        showBackButton={true}
        showActions={true}
      />

      {/* ====== منطقة نافذة الرسائل التفاعلية ====== */}
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