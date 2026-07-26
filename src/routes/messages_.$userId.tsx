// src/routes/messages_.$userId.tsx

import { createFileRoute, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useApp } from "@/lib/i18n";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { Loader2, ArrowLeft, Store, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGetOrCreateConversation } from "@/lib/hooks/useConversation";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

console.log("🔴 CHAT PAGE LOADED");

export const Route = createFileRoute("/messages_/$userId")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "المحادثة — السوق اليك" }] }),
});

function ChatPage() {
  console.log("🟢 CHAT PAGE RENDERED");
  
  const { userId } = Route.useParams();
  const location = useLocation();
  const app = useApp();
  const navigate = useNavigate();

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

  // ✅ استخراج state
  const state = location.state as { 
    fromStore?: boolean; 
    storeId?: string; 
    storeName?: string;
  } | null;

  console.log("📌 userId:", userId);
  console.log("📌 conversationId from URL:", conversationIdFromUrl);
  console.log("📌 location.state:", state);

  // ====== 1. جلب بيانات المستخدم الآخر ======
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      console.log("👤 Fetching user data:", userId);
      
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

      console.log("✅ User fetched:", data);
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
        console.log("✅ Using conversationId from URL:", conversationIdFromUrl);
        setConversationId(conversationIdFromUrl);
        setActiveConversation(conversationIdFromUrl);
        initializedRef.current = true;
        return;
      }

      console.log("🆕 Creating new conversation...");
      setIsInitializing(true);

      try {
        const conversation = await getOrCreateConversation.mutateAsync({
          userId: app.user.id,
          otherUserId: userId,
        });

        console.log("✅ Conversation created:", conversation.id);
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
  }, [
    app.user,
    userId,
    conversationIdFromUrl,
    getOrCreateConversation,
    navigate,
    setActiveConversation,
    isInitializing,
    app.lang,
  ]);

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

  // ====== ✅ دالة الرجوع الذكية (احترافية) ======
  const handleBack = () => {
    // ✅ 1. تحقق من state (الأكثر دقة)
    if (state?.fromStore && state?.storeId) {
      console.log("🔙 Returning to store from state:", state.storeId);
      navigate({ 
        to: "/store/$id", 
        params: { id: state.storeId },
        state: { fromChat: true }
      });
      return;
    }
    
    // ✅ 2. تحقق من referrer
    const referrer = document.referrer;
    if (referrer.includes("/store/")) {
      console.log("🔙 Returning to store from referrer:", referrer);
      navigate({ to: "/store/$id", params: { id: userId } });
      return;
    }
    
    // ✅ 3. إذا كان في history state (قديم)
    if (location.state && (location.state as any)?.fromStore) {
      console.log("🔙 Returning to store from legacy state");
      navigate({ to: "/store/$id", params: { id: userId } });
      return;
    }
    
    // ✅ 4. إذا فيه conversationId → ارجع للرسائل
    if (conversationIdFromUrl) {
      console.log("🔙 Returning to messages list");
      navigate({ to: "/messages" });
      return;
    }
    
    // ✅ 5. افتراضياً: ارجع للرسائل
    console.log("🔙 Returning to messages (default)");
    navigate({ to: "/messages" });
  };

  // ====== عرض حالة التحميل ======
  if (loading || app.authLoading || isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0084ff] mx-auto" />
          <p className="text-muted-foreground mt-4 text-sm">
            {app.lang === "ar" ? "جاري تحميل المحادثة..." : "Loading conversation..."}
          </p>
        </div>
      </div>
    );
  }

  if (!app.user) return null;

  // ====== المستخدم غير موجود ======
  if (!otherUser) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]">
        <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">❌</span>
        </div>
        <h3 className="text-xl font-semibold text-red-600">
          {app.lang === "ar" ? "المستخدم غير موجود" : "User not found"}
        </h3>
        <p className="text-muted-foreground mt-2 text-sm">
          {app.lang === "ar"
            ? "لم يتم العثور على المستخدم المطلوب"
            : "The requested user was not found"}
        </p>
        <Button
          className="mt-4 rounded-full px-6 bg-[#0084ff] hover:bg-[#0073e6] text-white"
          onClick={() => navigate({ to: "/messages" })}
        >
          {app.lang === "ar" ? "العودة للرسائل" : "Back to messages"}
        </Button>
      </div>
    );
  }

  // ====== جاري تهيئة المحادثة ======
  if (!conversationId) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#1a1a2e]">
        <div className="h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-semibold text-yellow-600">
          {app.lang === "ar" ? "جاري تهيئة المحادثة..." : "Initializing conversation..."}
        </h3>
        <Loader2 className="h-6 w-6 animate-spin text-[#0084ff] mx-auto mt-4" />
      </div>
    );
  }

  console.log("✅✅✅ RENDERING FULL CHAT UI ✅✅✅");

  // ====== ✅ الواجهة الرئيسية مع هيدر مخصص ======
  return (
    <div className="h-screen bg-[#f0f2f5] dark:bg-[#1a1a2e]">
      {/* ✅ هيدر مخصص أعلى المحادثة (يظهر فوق ChatMessages) */}
      <div className="sticky top-0 z-50 bg-white/95 dark:bg-[#242538]/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-2.5 flex items-center gap-3">
        {/* ✅ زر الرجوع الذكي */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 shrink-0 h-9 w-9"
          title={app.lang === "ar" ? "رجوع" : "Back"}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* ✅ صورة المستخدم */}
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
          {otherUser?.avatar_url ? (
            <img 
              src={otherUser.avatar_url} 
              alt="" 
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            otherUser?.full_name?.charAt(0)?.toUpperCase() || 
            otherUser?.store_name?.charAt(0)?.toUpperCase() || 
            'U'
          )}
        </div>

        {/* ✅ اسم المستخدم */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">
            {otherUser?.store_name || otherUser?.full_name || (app.lang === "ar" ? "مستخدم" : "User")}
          </p>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {app.lang === "ar" ? "متصل" : "Online"}
          </p>
        </div>

        {/* ✅ زر المتجر (إذا كان المستخدم بائع) */}
        {otherUser?.store_name && (
          <Link
            to="/store/$id"
            params={{ id: userId }}
            className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shrink-0 group"
            title={app.lang === "ar" ? "زيارة المتجر" : "Visit store"}
          >
            <Store className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
          </Link>
        )}

        {/* ✅ زر الرئيسية */}
        <Link
          to="/"
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 group"
          title={app.lang === "ar" ? "الرئيسية" : "Home"}
        >
          <Home className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform" />
        </Link>
      </div>

      {/* ✅ مكون المحادثة */}
      <ChatMessages
        userId={app.user.id}
        conversationId={conversationId}
        otherUserId={userId}
        className="h-full max-w-4xl mx-auto shadow-xl bg-white dark:bg-[#242538]"
        onBack={handleBack}
      />
    </div>
  );
}