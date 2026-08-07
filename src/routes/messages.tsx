// src/routes/messages.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  MessageCircle, Search, Store, ChevronRight, 
  MoreVertical, Trash2, ArrowLeft, ArrowRight, Sparkles
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
import { useApp, useT } from "@/lib/i18n";
import {
  useConversations,
  useDeleteConversation,
  useUnreadCount,
  useGetOrCreateConversation,
} from "@/lib/hooks/useConversation";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { toast } from "sonner";

export const Route = createFileRoute("/messages")({
  component: MessagesPage,
  head: () => ({ meta: [{ title: "الرسائل — السوق اليك" }] }),
});

function MessagesPage() {
  const app = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const isRtl = app.lang === "ar";

  // ====== Hooks ======
  const { data: conversations = [], isLoading, refetch } = useConversations();
  const { data: unreadCount = 0 } = useUnreadCount();
  const deleteConversation = useDeleteConversation();
  const getOrCreateConversation = useGetOrCreateConversation();

  // ====== Store ======
  const { setConversations, deleteConversation: deleteFromStore } =
    useConversationStore();

  // ====== تحديث الـ store عند جلب البيانات ======
  useEffect(() => {
    if (conversations.length > 0) {
      setConversations(conversations);
    }
  }, [conversations, setConversations]);

  // ====== التحقق من المصادقة ======
  useEffect(() => {
    if (!app.authLoading && !app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
    }
  }, [app.authLoading, app.user, navigate]);

  // ====== فتح المحادثة ======
  const openConversation = async (otherUserId: string) => {
    if (!app.user) return;

    setIsCreating(true);

    try {
      const conversation = await getOrCreateConversation.mutateAsync({
        userId: app.user.id,
        otherUserId,
      });

      navigate({
        to: "/messages/$userId",
        params: { userId: otherUserId },
        search: { cid: conversation.id },
      });
    } catch (error) {
      console.error("❌ Error opening conversation:", error);
      toast.error(app.lang === "ar" ? "فشل فتح المحادثة" : "Failed to open conversation");
    } finally {
      setIsCreating(false);
    }
  };

  // ====== حذف المحادثة ======
  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!app.user) return;

    const confirmMessage =
      app.lang === "ar" ? "هل أنت متأكد من حذف هذه المحادثة؟" : "Are you sure?";
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
  };

  // ====== عرض التحميل ======
  if (app.authLoading || isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] mx-auto shadow-md" />
      </div>
    );
  }

  if (!app.user) return null;

  // ====== دوال مساعدة ======
  const filteredConversations = conversations.filter((conv: any) => {
    const otherUser =
      conv.participant1_id === app.user.id ? conv.participant2 : conv.participant1;
    const name = otherUser?.store_name || otherUser?.full_name || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getOtherUser = (conv: any) => {
    return conv.participant1_id === app.user.id ? conv.participant2 : conv.participant1;
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

  const formatTime = (date: string) => {
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
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8" dir={isRtl ? "rtl" : "ltr"}>
      
      {/* ستايل الحركات والأنيميشن للأيقونات */}
      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-3px) rotate(2deg); }
        }
        .animate-float-icon {
          animation: float-gentle 3s ease-in-out infinite;
        }
      `}</style>

      {/* زر العودة للخلف بتصميم أنيق */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: "/" })}
          className="group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#2a655f]/10 hover:bg-[#2a655f]/20 text-[#2a655f] dark:text-[#3a8a82] font-semibold text-sm transition-all duration-300 border border-[#2a655f]/20"
        >
          {isRtl ? <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />}
          <span>{isRtl ? "العودة للرئيسية" : "Back to Home"}</span>
        </Button>
      </div>

      {/* الرأس */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 bg-gradient-to-r from-[#173d38]/10 via-[#2a655f]/10 to-[#173d38]/10 p-6 rounded-3xl border border-[#2a655f]/20 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/30 animate-float-icon">
              <MessageCircle className="h-6 w-6" />
            </div>
            {app.lang === "ar" ? "الرسائل والمحادثات" : "Messages & Chats"}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm text-muted-foreground font-medium">
              {app.lang === "ar"
                ? `لديك ${conversations.length} محادثة نشطة`
                : `You have ${conversations.length} active conversations`}
            </p>
            {unreadCount > 0 && (
              <Badge className="bg-[#2a655f] text-white rounded-full px-3 py-1 font-bold shadow-sm animate-pulse">
                {unreadCount} {app.lang === "ar" ? "غير مقروءة" : "unread"}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f]" />
          <Input
            placeholder={app.lang === "ar" ? "بحث في المحادثات..." : "Search conversations..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full md:w-64 rounded-xl border-[#2a655f]/30 focus:border-[#2a655f] bg-white/80 dark:bg-slate-900/80 shadow-inner"
          />
        </div>
      </div>

      {/* قائمة المحادثات */}
      {isCreating ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f]" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#2a655f]/20 p-12 text-center shadow-lg">
          <div className="h-20 w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4 animate-float-icon">
            <MessageCircle className="h-10 w-10 text-[#2a655f]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {searchQuery
              ? app.lang === "ar"
                ? "لا توجد نتائج مطابقة"
                : "No results found"
              : app.lang === "ar"
              ? "لا توجد محادثات حالياً"
              : "No conversations yet"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            {searchQuery
              ? app.lang === "ar"
                ? `لا توجد محادثات تطابق "${searchQuery}"`
                : `No conversations match "${searchQuery}"`
              : app.lang === "ar"
              ? "ابدأ محادثة جديدة مع أي متجر أو بائع لتظهر هنا"
              : "Start a new conversation with a store or seller"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredConversations.map((conv: any) => {
            const otherUser = getOtherUser(conv);
            const name = getUserName(otherUser);
            const avatar = getUserAvatar(otherUser);
            const isStore = !!otherUser?.store_name;
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
                    bg-white dark:bg-slate-900 rounded-2xl border p-4 hover:shadow-xl transition-all duration-300
                    hover:border-[#2a655f]/60 hover:-translate-y-0.5
                    ${
                      unread
                        ? "border-[#2a655f]/50 bg-[#2a655f]/5 shadow-md"
                        : "border-slate-200/60 dark:border-slate-800"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-2 ring-[#2a655f]/30 group-hover:ring-[#2a655f] transition duration-300 shadow-sm">
                        <img src={avatar} alt={name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-sm font-bold">
                          {name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isStore && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#2a655f] border-2 border-white dark:border-slate-900 flex items-center justify-center shadow">
                          <Store className="h-2.5 w-2.5 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold truncate text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">
                            {name}
                          </span>
                          {isStore && (
                            <Badge
                              variant="secondary"
                              className="text-[9px] px-2 py-0.5 h-4 bg-[#2a655f]/15 text-[#2a655f] dark:text-[#3a8a82] border-[#2a655f]/30 rounded-full font-bold"
                            >
                              {app.lang === "ar" ? "متجر معتمد" : "Verified Store"}
                            </Badge>
                          )}
                        </div>
                        {conv.last_message_at && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                            {formatTime(conv.last_message_at)}
                          </span>
                        )}
                      </div>

                      {conv.last_message && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {conv.last_message}
                        </p>
                      )}
                    </div>

                    {unread && (
                      <Badge className="bg-[#2a655f] text-white rounded-full px-2.5 py-0.5 text-xs font-bold animate-pulse shadow-sm">
                        {conv.unread_count_participant1 || conv.unread_count_participant2}
                      </Badge>
                    )}

                    <ChevronRight className="h-4 w-4 text-[#2a655f]/50 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-[#2a655f]/10 text-slate-600 dark:text-slate-300"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-[#2a655f]/20 shadow-lg">
                      <DropdownMenuItem
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer font-medium"
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
  );
}