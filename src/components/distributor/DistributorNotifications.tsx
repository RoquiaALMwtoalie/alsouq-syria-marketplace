// src/components/distributor/DistributorNotifications.tsx

import { useState } from "react";
import { Bell, BellOff, Check, Clock, X, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  useUserNotifications, 
  useMarkNotificationReadV2, 
  useMarkAllNotificationsReadV2 
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DistributorNotificationsProps {
  userId?: string;
  isArabic: boolean;
}

export function DistributorNotifications({ userId, isArabic }: DistributorNotificationsProps) {
  const [open, setOpen] = useState(false);
  const { data: notifications = [], refetch } = useUserNotifications(userId, { limit: 50 });
  const markRead = useMarkNotificationReadV2();
  const markAllRead = useMarkAllNotificationsReadV2();
  
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markRead.mutateAsync({ notificationId: id, userId: userId! });
      await refetch();
    } catch (error) {
      console.error("Error marking read:", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead.mutateAsync({ userId: userId! });
      await refetch();
      toast.success(isArabic ? "تم تحديد الكل كمقروء" : "All marked as read");
    } catch (error) {
      toast.error(isArabic ? "حدث خطأ" : "Error");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await supabase.from("notifications").delete().eq("id", id);
      await refetch();
      toast.success(isArabic ? "تم حذف الإشعار" : "Notification deleted");
    } catch (error) {
      toast.error(isArabic ? "حدث خطأ" : "Error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-9 w-9 rounded-xl text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4.5 min-w-4.5 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center animate-pulse border-2 border-[#1a4f4a]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
          <p>{isArabic ? "الإشعارات" : "Notifications"}</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#0d2e2a]/10 to-[#0d2e2a]/5 dark:from-[#0d2e2a]/30 dark:to-[#0d2e2a]/20 backdrop-blur-xl border-b border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-[#0d2e2a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/25">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  {isArabic ? "الإشعارات" : "Notifications"}
                </DialogTitle>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {unreadCount > 0
                    ? isArabic ? `${unreadCount} إشعار غير مقروء` : `${unreadCount} unread`
                    : isArabic ? "كل الإشعارات مقروءة" : "All caught up"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs gap-1.5 rounded-xl hover:bg-[#0d2e2a]/10 dark:hover:bg-[#0d2e2a]/30 text-[#0d2e2a] dark:text-[#3a8a82]" 
                  onClick={handleMarkAllRead}
                  disabled={markAllRead.isPending}
                >
                  {markAllRead.isPending ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  {isArabic ? "تحديد الكل كمقروء" : "Mark all read"}
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" 
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1.5">
          {notifications.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <BellOff className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                {isArabic ? "لا توجد إشعارات" : "No notifications"}
              </p>
            </div>
          ) : (
            notifications.map((notification: any) => {
              const isUnread = !notification.is_read;
              return (
                <div 
                  key={notification.id} 
                  className={`group relative rounded-xl transition-all duration-300 ${
                    isUnread 
                      ? "bg-gradient-to-r from-[#0d2e2a]/10 to-[#0d2e2a]/5 dark:from-[#0d2e2a]/30 dark:to-[#0d2e2a]/20 border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 hover:shadow-md" 
                      : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  }`}
                >
                  <div className="flex items-start gap-3 p-3 cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isUnread ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                        {notification.title_ar || notification.title_en || "إشعار"}
                      </p>
                      <p className={`text-xs mt-0.5 line-clamp-2 ${isUnread ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-500"}`}>
                        {notification.body_ar || notification.body_en || notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(notification.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US")}
                        </span>
                      </div>
                    </div>
                    {isUnread && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-[#0d2e2a]/10 text-[#0d2e2a] opacity-0 group-hover:opacity-100 transition-all" 
                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[160px]">
                        {isUnread && (
                          <DropdownMenuItem 
                            className="rounded-lg text-sm cursor-pointer gap-2" 
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <Check className="h-4 w-4" />
                            {isArabic ? "تحديد كمقروء" : "Mark as read"}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="rounded-lg text-sm cursor-pointer gap-2 text-red-500 hover:bg-red-50/50" 
                          onClick={(e) => handleDelete(notification.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                          {isArabic ? "حذف" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {notifications.length > 0 && (
          <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 p-3 flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {notifications.length} {isArabic ? "إشعار" : "notifications"}
              {unreadCount > 0 && ` · ${unreadCount} ${isArabic ? "غير مقروء" : "unread"}`}
            </span>
            <Button variant="ghost" size="sm" className="text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setOpen(false)}>
              {isArabic ? "إغلاق" : "Close"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}