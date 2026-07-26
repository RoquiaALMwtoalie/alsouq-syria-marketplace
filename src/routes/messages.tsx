// src/routes/messages.tsx

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  MessageCircle, Search, Store, ChevronRight, 
  MoreVertical, Trash2
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
  // ✅ تأكد من إزالة useMarkAsRead من هنا
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

  // ====== Hooks ======
  const { data: conversations = [], isLoading, refetch } = useConversations();
  const { data: unreadCount = 0 } = useUnreadCount();
  const deleteConversation = useDeleteConversation();
  const getOrCreateConversation = useGetOrCreateConversation();
  // ❌ تم حذف useMarkAsRead

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600/20 border-t-blue-600 mx-auto" />
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
      `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(user))}&background=2563eb&color=fff&size=128`
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

  // ====== التصميم ======
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      {/* الرأس */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <MessageCircle className="h-5 w-5" />
            </div>
            {app.lang === "ar" ? "الرسائل" : "Messages"}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-muted-foreground">
              {app.lang === "ar"
                ? `لديك ${conversations.length} محادثة`
                : `You have ${conversations.length} conversations`}
            </p>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white rounded-full px-3 py-1">
                {unreadCount} {app.lang === "ar" ? "غير مقروءة" : "unread"}
              </Badge>
            )}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={app.lang === "ar" ? "بحث في المحادثات..." : "Search conversations..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full md:w-64 rounded-xl border-slate-200/50 dark:border-slate-800/50"
          />
        </div>
      </div>

      {/* قائمة المحادثات */}
      {isCreating ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600/20 border-t-blue-600" />
        </div>
      ) : filteredConversations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 p-12 text-center shadow-sm">
          <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold">
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
              ? "ابدأ محادثة جديدة مع متجر أو بائع"
              : "Start a new conversation with a store or seller"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
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
                    bg-white dark:bg-slate-900 rounded-2xl border p-4 hover:shadow-md transition-all 
                    hover:border-blue-400/50
                    ${
                      unread
                        ? "border-blue-300/50 dark:border-blue-700/50 bg-blue-50/30 dark:bg-blue-950/10"
                        : "border-slate-200/60 dark:border-slate-700/60"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-blue-400 transition">
                        <img src={avatar} alt={name} className="object-cover" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
                          {name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {isStore && (
                        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500/20 border-2 border-white dark:border-slate-900 flex items-center justify-center">
                          <Store className="h-2.5 w-2.5 text-emerald-500" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate text-slate-900 dark:text-white">
                            {name}
                          </span>
                          {isStore && (
                            <Badge
                              variant="secondary"
                              className="text-[8px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full"
                            >
                              {app.lang === "ar" ? "متجر" : "Store"}
                            </Badge>
                          )}
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
                      <Badge className="bg-blue-600 text-white rounded-full px-2.5 py-0.5 text-xs font-bold animate-pulse">
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
  );
}
