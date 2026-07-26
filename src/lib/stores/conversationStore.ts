// src/lib/stores/conversationStore.ts

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IConversation, IMessage } from "@/lib/services/conversationService";

// ====== أنواع إضافية ======
interface TypingUser {
  userId: string;
  conversationId: string;
  startedAt: number;
}

interface MessageDraft {
  conversationId: string;
  content: string;
  replyToId?: string | null;
  attachments?: {
    type: 'image' | 'video' | 'audio' | 'file';
    url: string;
    name: string;
    size: number;
  }[];
}

// ====== حالة التخزين المؤقت (Cache) ======
interface CacheState {
  conversations: IConversation[];
  messages: Record<string, IMessage[]>; // conversationId -> messages[]
  activeConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

// ====== حالة المستخدم (User Preferences) - فقط هذه تُخزن ======
interface UserPreferences {
  drafts: Record<string, MessageDraft>; // conversationId -> draft
  pinnedConversations: string[]; // معرفات المحادثات المثبتة
  mutedConversations: string[]; // معرفات المحادثات المكتمة
}

// ====== الحالة الكاملة ======
interface ConversationState extends CacheState, UserPreferences {
  // ====== ميزات إضافية (لا تُخزن) ======
  typingUsers: TypingUser[];
  selectedMessages: string[];
  isSelectingMessages: boolean;
  replyToMessage: IMessage | null;
  forwardedMessage: IMessage | null;

  // ====== الإجراءات (Actions) ======
  // إدارة المحادثات
  setConversations: (conversations: IConversation[]) => void;
  setMessages: (conversationId: string, messages: IMessage[]) => void;
  addMessage: (conversationId: string, message: IMessage) => void;
  updateMessage: (conversationId: string, messageId: string, updates: Partial<IMessage>) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  
  setActiveConversation: (conversationId: string | null) => void;
  markAsRead: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  updateConversation: (conversation: IConversation) => void;
  
  // مؤشر الكتابة
  setTyping: (conversationId: string, userId: string, isTyping: boolean) => void;
  
  // المسودات
  setDraft: (conversationId: string, draft: Partial<MessageDraft>) => void;
  getDraft: (conversationId: string) => MessageDraft | undefined;
  clearDraft: (conversationId: string) => void;
  
  // تثبيت/كتم
  togglePinConversation: (conversationId: string) => void;
  toggleMuteConversation: (conversationId: string) => void;
  
  // اختيار الرسائل
  setSelectingMessages: (isSelecting: boolean) => void;
  toggleSelectMessage: (messageId: string) => void;
  clearSelectedMessages: () => void;
  
  // الرد/التوجيه
  setReplyToMessage: (message: IMessage | null) => void;
  setForwardedMessage: (message: IMessage | null) => void;
  
  // حالة التحميل والأخطاء
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  
  // ====== إجراءات جديدة لإدارة الكاش ======
  clearCache: () => void;
  getCachedMessages: (conversationId: string) => IMessage[] | undefined;
  hasCachedMessages: (conversationId: string) => boolean;
}

// ====== الحالة الابتدائية ======
const initialState: CacheState = {
  conversations: [],
  messages: {},
  activeConversationId: null,
  isLoading: false,
  error: null,
};

const initialPreferences: UserPreferences = {
  drafts: {},
  pinnedConversations: [],
  mutedConversations: [],
};

// ====== إنشاء الـ Store ======
export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      // ====== الحالة الأساسية ======
      ...initialState,
      ...initialPreferences,
      
      // ====== ميزات إضافية ======
      typingUsers: [],
      selectedMessages: [],
      isSelectingMessages: false,
      replyToMessage: null,
      forwardedMessage: null,

      // ============================================================
      // 1️⃣ إدارة المحادثات (Cache)
      // ============================================================
      
      setConversations: (conversations) => {
        // ترتيب المحادثات: المثبتة أولاً ثم حسب آخر رسالة
        const { pinnedConversations } = get();
        const sorted = [...conversations].sort((a, b) => {
          const aPinned = pinnedConversations.includes(a.id);
          const bPinned = pinnedConversations.includes(b.id);
          if (aPinned && !bPinned) return -1;
          if (!aPinned && bPinned) return 1;
          
          const aTime = new Date(a.last_message_at || a.created_at).getTime();
          const bTime = new Date(b.last_message_at || b.created_at).getTime();
          return bTime - aTime;
        });
        
        set({ conversations: sorted });
      },

      updateConversation: (conversation) => {
        const { conversations } = get();
        const updatedConversations = conversations.map((conv) =>
          conv.id === conversation.id ? conversation : conv
        );
        set({ conversations: updatedConversations });
      },

      deleteConversation: (conversationId) => {
        const { conversations, messages } = get();
        const filteredConversations = conversations.filter(
          (conv) => conv.id !== conversationId
        );
        const { [conversationId]: _, ...remainingMessages } = messages;
        
        // إزالة من المثبتات والمكتمات
        const pinned = get().pinnedConversations.filter(id => id !== conversationId);
        const muted = get().mutedConversations.filter(id => id !== conversationId);

        set({
          conversations: filteredConversations,
          messages: remainingMessages,
          pinnedConversations: pinned,
          mutedConversations: muted,
          activeConversationId:
            get().activeConversationId === conversationId
              ? null
              : get().activeConversationId,
        });
      },

      // ============================================================
      // 2️⃣ إدارة الرسائل (Cache)
      // ============================================================
      
      setMessages: (conversationId, messages) => {
        set((state) => ({
          messages: {
            ...state.messages,
            [conversationId]: messages,
          },
        }));
      },

      addMessage: (conversationId, message) => {
        set((state) => {
          const currentMessages = state.messages[conversationId] || [];
          // منع التكرار
          const exists = currentMessages.some((msg) => msg.id === message.id);
          if (exists) return state;
          
          return {
            messages: {
              ...state.messages,
              [conversationId]: [...currentMessages, message],
            },
          };
        });

        // تحديث آخر رسالة في المحادثة
        const { conversations } = get();
        const updatedConversations = conversations.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              last_message: message.content,
              last_message_at: message.created_at,
              last_message_sender_id: message.sender_id,
            };
          }
          return conv;
        });

        set({ conversations: updatedConversations });
      },

      updateMessage: (conversationId, messageId, updates) => {
        set((state) => {
          const currentMessages = state.messages[conversationId] || [];
          const updatedMessages = currentMessages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          );
          return {
            messages: {
              ...state.messages,
              [conversationId]: updatedMessages,
            },
          };
        });
      },

      deleteMessage: (conversationId, messageId) => {
        set((state) => {
          const currentMessages = state.messages[conversationId] || [];
          const updatedMessages = currentMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, is_deleted: true, content: "🗑️ تم حذف هذه الرسالة" }
              : msg
          );
          return {
            messages: {
              ...state.messages,
              [conversationId]: updatedMessages,
            },
          };
        });
      },

      // ============================================================
      // 3️⃣ إدارة المحادثة النشطة
      // ============================================================
      
      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
      },

      markAsRead: (conversationId) => {
        const { conversations } = get();
        const updatedConversations = conversations.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              unread_count_participant1: 0,
              unread_count_participant2: 0,
            };
          }
          return conv;
        });

        set({ conversations: updatedConversations });
      },

      // ============================================================
      // 4️⃣ مؤشر الكتابة (Typing Indicator)
      // ============================================================
      
      setTyping: (conversationId, userId, isTyping) => {
        const { typingUsers } = get();
        
        if (isTyping) {
          // إضافة المستخدم إلى قائمة من يكتبون
          const existing = typingUsers.find(
            (t) => t.userId === userId && t.conversationId === conversationId
          );
          if (!existing) {
            set({
              typingUsers: [
                ...typingUsers,
                { userId, conversationId, startedAt: Date.now() },
              ],
            });
          }
        } else {
          // إزالة المستخدم من قائمة من يكتبون
          set({
            typingUsers: typingUsers.filter(
              (t) => !(t.userId === userId && t.conversationId === conversationId)
            ),
          });
        }
        
        // تنظيف تلقائي بعد 5 ثواني إذا لم يتم إلغاء الكتابة
        setTimeout(() => {
          const current = get().typingUsers;
          const stillTyping = current.find(
            (t) => t.userId === userId && t.conversationId === conversationId
          );
          if (stillTyping) {
            set({
              typingUsers: current.filter(
                (t) => !(t.userId === userId && t.conversationId === conversationId)
              ),
            });
          }
        }, 5000);
      },

      // ============================================================
      // 5️⃣ حفظ المسودات (Drafts) - تُخزن في localStorage
      // ============================================================
      
      setDraft: (conversationId, draft) => {
        const { drafts } = get();
        const currentDraft = drafts[conversationId] || {
          conversationId,
          content: "",
          replyToId: null,
          attachments: [],
        };
        
        set({
          drafts: {
            ...drafts,
            [conversationId]: { ...currentDraft, ...draft },
          },
        });
      },

      getDraft: (conversationId) => {
        return get().drafts[conversationId];
      },

      clearDraft: (conversationId) => {
        const { drafts } = get();
        const { [conversationId]: _, ...remainingDrafts } = drafts;
        set({ drafts: remainingDrafts });
      },

      // ============================================================
      // 6️⃣ تثبيت/كتم المحادثة - تُخزن في localStorage
      // ============================================================
      
      togglePinConversation: (conversationId) => {
        const { pinnedConversations } = get();
        const isPinned = pinnedConversations.includes(conversationId);
        
        set({
          pinnedConversations: isPinned
            ? pinnedConversations.filter(id => id !== conversationId)
            : [...pinnedConversations, conversationId],
        });
        
        // إعادة ترتيب المحادثات
        const { conversations } = get();
        const sorted = [...conversations].sort((a, b) => {
          const aPinned = get().pinnedConversations.includes(a.id);
          const bPinned = get().pinnedConversations.includes(b.id);
          if (aPinned && !bPinned) return -1;
          if (!aPinned && bPinned) return 1;
          return 0;
        });
        set({ conversations: sorted });
      },

      toggleMuteConversation: (conversationId) => {
        const { mutedConversations } = get();
        const isMuted = mutedConversations.includes(conversationId);
        
        set({
          mutedConversations: isMuted
            ? mutedConversations.filter(id => id !== conversationId)
            : [...mutedConversations, conversationId],
        });
      },

      // ============================================================
      // 7️⃣ اختيار الرسائل (للحذف/التوجيه)
      // ============================================================
      
      setSelectingMessages: (isSelecting) => {
        set({ 
          isSelectingMessages: isSelecting,
          selectedMessages: isSelecting ? get().selectedMessages : [],
        });
      },

      toggleSelectMessage: (messageId) => {
        const { selectedMessages } = get();
        const isSelected = selectedMessages.includes(messageId);
        
        set({
          selectedMessages: isSelected
            ? selectedMessages.filter(id => id !== messageId)
            : [...selectedMessages, messageId],
        });
      },

      clearSelectedMessages: () => {
        set({ 
          selectedMessages: [],
          isSelectingMessages: false,
        });
      },

      // ============================================================
      // 8️⃣ الرد على رسالة / إعادة توجيه
      // ============================================================
      
      setReplyToMessage: (message) => {
        set({ replyToMessage: message });
      },

      setForwardedMessage: (message) => {
        set({ forwardedMessage: message });
      },

      // ============================================================
      // 9️⃣ إدارة حالة التحميل والأخطاء
      // ============================================================
      
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },

      reset: () => {
        set({ ...initialState, ...initialPreferences });
      },

      // ============================================================
      // 🔟 إدارة الكاش (جديد)
      // ============================================================
      
      clearCache: () => {
        set({
          conversations: [],
          messages: {},
          activeConversationId: null,
        });
      },

      getCachedMessages: (conversationId) => {
        return get().messages[conversationId];
      },

      hasCachedMessages: (conversationId) => {
        return !!get().messages[conversationId]?.length;
      },
    }),
    {
      name: "conversation-storage",
      // ✅ فقط هذه الأجزاء تُخزن في localStorage
      partialize: (state) => ({
        drafts: state.drafts,
        pinnedConversations: state.pinnedConversations,
        mutedConversations: state.mutedConversations,
        // ❌ لا تخزن conversations و messages (تأتي من Supabase)
      }),
    }
  )
);

// ============================================================
// 🔥 Selectors محسّنة
// ============================================================

// جلب المحادثات المثبتة
export const usePinnedConversations = () => {
  return useConversationStore((state) => 
    state.conversations.filter((conv) => 
      state.pinnedConversations.includes(conv.id)
    )
  );
};

// جلب المحادثات العادية (غير مثبتة)
export const useUnpinnedConversations = () => {
  return useConversationStore((state) => 
    state.conversations.filter((conv) => 
      !state.pinnedConversations.includes(conv.id)
    )
  );
};

// جلب من يكتبون في محادثة معينة
export const useTypingUsers = (conversationId: string) => {
  return useConversationStore((state) =>
    state.typingUsers
      .filter((t) => t.conversationId === conversationId)
      .map((t) => t.userId)
  );
};

// جلب مسودة محادثة معينة
export const useDraft = (conversationId: string) => {
  return useConversationStore((state) => state.drafts[conversationId]);
};

// جلب عدد الرسائل غير المقروءة الكلي
export const useTotalUnreadCount = () => {
  return useConversationStore((state) => {
    let total = 0;
    state.conversations.forEach((conv) => {
      total += (conv.unread_count_participant1 || 0) + (conv.unread_count_participant2 || 0);
    });
    return total;
  });
};

// جلب المحادثات مع عدد غير مقروء
export const useConversationsWithUnread = () => {
  return useConversationStore((state) =>
    state.conversations.filter((conv) => 
      (conv.unread_count_participant1 || 0) > 0 || 
      (conv.unread_count_participant2 || 0) > 0
    )
  );
};