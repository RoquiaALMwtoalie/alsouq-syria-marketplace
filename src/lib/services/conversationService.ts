// src/lib/services/conversationService.ts

import { supabase } from "@/integrations/supabase/client";

// ====== الأنواع ======
export interface IMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location';
  file_url?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  reply_to_id?: string | null;
  is_deleted: boolean;
  is_forwarded: boolean;
  forwarded_from_id?: string | null;
  location?: { latitude: number; longitude: number } | null;
}

export interface IConversation {
  id: string;
  participant1_id: string;
  participant2_id: string;
  last_message: string | null;
  last_message_at: string | null;
  last_message_sender_id: string | null;
  unread_count_participant1: number;
  unread_count_participant2: number;
  is_archived_participant1: boolean;
  is_archived_participant2: boolean;
  is_muted_participant1: boolean;
  is_muted_participant2: boolean;
  pinned_at_participant1: string | null;
  pinned_at_participant2: string | null;
  created_at: string;
  updated_at: string;
  participant1?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    store_name: string | null;
    store_logo_url: string | null;
    last_seen_at: string | null;
    is_online: boolean;
  };
  participant2?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    store_name: string | null;
    store_logo_url: string | null;
    last_seen_at: string | null;
    is_online: boolean;
  };
}

const BUCKET_NAME = 'uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB للصور

// ====== ✅ دالة ضغط الصور ======
async function compressImage(file: File, maxWidth: number = 1024, maxHeight: number = 1024): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // حساب النسب للحفاظ على الأبعاد
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // تحويل إلى Blob بجودة 80%
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', 0.8);
      };
      
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    
    reader.onerror = () => reject(new Error('Failed to read file for compression'));
  });
}

// ====== ✅ دالة التحقق من حجم الملف ======
function validateFileSize(file: File): void {
  const isImage = file.type.startsWith('image/');
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
  
  if (file.size > maxSize) {
    const sizeMB = (maxSize / 1024 / 1024).toFixed(1);
    throw new Error(`File too large. Maximum size is ${sizeMB}MB`);
  }
}

// ====== ✅ دالة رفع الملف مع إعادة المحاولة ======
async function uploadFileWithRetry(
  bucket: string,
  path: string,
  file: File,
  maxRetries: number = 3
): Promise<string> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // نجاح الرفع
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return urlData.publicUrl;
      
    } catch (error) {
      lastError = error as Error;
      console.error(`Upload attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // تأخير تزايدي قبل إعادة المحاولة
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed to upload file after ${maxRetries} attempts: ${lastError?.message}`);
}

class ConversationService {
  
  // ====== 1️⃣ جلب المحادثات ======
  async getConversations(userId: string): Promise<IConversation[]> {
    const { data: conversations, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (convError) throw new Error(convError.message);
    if (!conversations?.length) return [];

    const userIds = new Set<string>();
    conversations.forEach((conv) => {
      userIds.add(conv.participant1_id);
      userIds.add(conv.participant2_id);
    });

    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, store_name, store_logo_url, last_seen_at, is_online")
      .in("id", Array.from(userIds));

    if (profilesError) throw new Error(profilesError.message);

    const profilesMap = new Map();
    profiles?.forEach((profile) => {
      profilesMap.set(profile.id, profile);
    });

    return conversations.map((conv) => ({
      ...conv,
      participant1: profilesMap.get(conv.participant1_id) || null,
      participant2: profilesMap.get(conv.participant2_id) || null,
    }));
  }

  // ====== 2️⃣ جلب رسائل محادثة ======
  async getMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<IMessage[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return (data || []).reverse();
  }

  // ====== 3️⃣ إرسال رسالة (محسّن مع ضغط الصور) ======
  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    options: {
      type?: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location';
      file?: File;
      file_url?: string;
      file_name?: string;
      file_size?: number;
      reply_to_id?: string;
      location?: { latitude: number; longitude: number };
    } = {}
  ): Promise<IMessage> {
    console.log("📤 sendMessage - START");
    console.log("📤 senderId:", senderId);
    console.log("📤 receiverId:", receiverId);
    console.log("📤 content:", content);
    console.log("📤 options:", options);
    console.log("📤 options.file:", options.file?.name);

    const conversation = await this.getOrCreateConversation(senderId, receiverId);

    let fileUrl: string | null = null;
    let fileName: string | null = null;
    let fileSize: number | null = null;
    let fileType: string | null = null;

    // ✅ معالجة الملف إذا وجد
    if (options.file) {
      let file = options.file;
      
      // ✅ التحقق من حجم الملف
      validateFileSize(file);
      
      // ✅ ضغط الصور إذا كانت كبيرة
      if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE) {
        console.log("📤 Compressing image...");
        try {
          file = await compressImage(file);
          console.log("✅ Image compressed:", file.size, "bytes");
        } catch (error) {
          console.warn("⚠️ Failed to compress image, using original:", error);
        }
      }
      
      const filePath = `messages/${conversation.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      console.log("📤 Uploading file to:", filePath);

      try {
        // ✅ رفع الملف مع إعادة المحاولة
        fileUrl = await uploadFileWithRetry(BUCKET_NAME, filePath, file);
        console.log("✅ File uploaded successfully:", fileUrl);
        
        fileName = file.name;
        fileSize = file.size;
        fileType = file.type;
      } catch (error) {
        console.error('❌ Upload error:', error);
        throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // ✅ تحديد نوع الرسالة
    let messageType = options.type || 'text';
    
    // ✅ إذا كان هناك موقع، نغير النوع إلى location
    if (options.location) {
      messageType = 'location';
    }
    
    if (options.file) {
      if (fileType?.startsWith('image/')) {
        messageType = 'image';
      } else if (fileType?.startsWith('video/')) {
        messageType = 'video';
      } else if (fileType?.startsWith('audio/')) {
        messageType = 'audio';
      } else {
        messageType = 'file';
      }
    }

    console.log("📤 messageType:", messageType);

    // ✅ إرسال الرسالة مع دعم الموقع
    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        sender_id: senderId,
        receiver_id: receiverId,
        content: content.trim() || (options.file ? '' : ''),
        type: messageType,
        file_url: fileUrl || options.file_url || null,
        file_name: fileName || options.file_name || null,
        file_size: fileSize || options.file_size || null,
        reply_to_id: options.reply_to_id || null,
        is_deleted: false,
        is_forwarded: false,
        location: options.location || null,
      })
      .select()
      .single();

    if (msgError) {
      console.error("❌ Message insert error:", msgError);
      throw new Error(msgError.message);
    }

    console.log("✅ Message inserted:", message);

    // ✅ تحديث المحادثة (تزيد عدد غير المقروء للمستقبل فقط)
    await this.updateConversationLastMessage(
      conversation.id,
      content || (options.file ? `📎 ${fileName || 'ملف'}` : ''),
      receiverId,
      senderId
    );

    return message;
  }

  // ====== 4️⃣ إنشاء أو جلب محادثة ======
  async getOrCreateConversation(userId: string, otherUserId: string): Promise<IConversation> {
    if (userId === otherUserId) {
      throw new Error("Cannot create conversation with yourself");
    }

    const { data: existing, error: findError } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`);

    if (findError) throw new Error(findError.message);

    const conversation = existing?.find(
      (conv) =>
        (conv.participant1_id === otherUserId && conv.participant2_id === userId) ||
        (conv.participant1_id === userId && conv.participant2_id === otherUserId)
    );

    if (conversation) return conversation;

    const { data: newConv, error: createError } = await supabase
      .from("conversations")
      .insert({
        participant1_id: userId,
        participant2_id: otherUserId,
        unread_count_participant1: 0,
        unread_count_participant2: 0,
        is_archived_participant1: false,
        is_archived_participant2: false,
        is_muted_participant1: false,
        is_muted_participant2: false,
      })
      .select()
      .single();

    if (createError) throw new Error(createError.message);
    return newConv;
  }

  // ====== 5️⃣ ✅ تحديث آخر رسالة (محسّن) ======
  async updateConversationLastMessage(
    conversationId: string,
    content: string,
    receiverId: string,
    senderId: string
  ): Promise<void> {
    const { data: conversation, error: fetchError } = await supabase
      .from("conversations")
      .select("unread_count_participant1, unread_count_participant2, participant1_id, participant2_id")
      .eq("id", conversationId)
      .single();

    if (fetchError) throw new Error(fetchError.message);
    if (!conversation) throw new Error("Conversation not found");

    // ✅ تحديد عمود عدد غير المقروء للمستقبل فقط
    let unreadColumn: string;
    if (conversation.participant1_id === receiverId) {
      unreadColumn = "unread_count_participant1";
    } else {
      unreadColumn = "unread_count_participant2";
    }

    // ✅ زيادة العداد للمستقبل فقط
    const currentUnread = (conversation as any)[unreadColumn] || 0;

    const { error: updateError } = await supabase
      .from("conversations")
      .update({
        last_message: content,
        last_message_at: new Date().toISOString(),
        last_message_sender_id: senderId,
        [unreadColumn]: currentUnread + 1,
      })
      .eq("id", conversationId);

    if (updateError) throw new Error(updateError.message);
  }

  // ====== 6️⃣ ✅ تعيين الرسائل كمقروءة (محسّن) ======
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    // ✅ تصفير عدد غير المقروء لكلا الطرفين
    const { error: convError } = await supabase
      .from("conversations")
      .update({
        unread_count_participant1: 0,
        unread_count_participant2: 0,
      })
      .eq("id", conversationId);

    if (convError) throw new Error(convError.message);

    // ✅ تحديث read_at لجميع رسائل المستخدم في هذه المحادثة
    const { error: msgError } = await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("conversation_id", conversationId)
      .eq("receiver_id", userId)
      .is("read_at", null);

    if (msgError) throw new Error(msgError.message);
  }

  // ====== 7️⃣ حذف محادثة ======
  async deleteConversation(conversationId: string, userId: string): Promise<void> {
    const participants = await this.getConversationParticipants(conversationId);
    
    const { error: convError } = await supabase
      .from("conversations")
      .update({
        is_archived_participant1: userId === participants.participant1_id,
        is_archived_participant2: userId === participants.participant2_id,
      })
      .eq("id", conversationId);

    if (convError) throw new Error(convError.message);
  }

  // ====== 8️⃣ جلب مشاركي المحادثة ======
  async getConversationParticipants(conversationId: string): Promise<{ participant1_id: string; participant2_id: string }> {
    const { data, error } = await supabase
      .from("conversations")
      .select("participant1_id, participant2_id")
      .eq("id", conversationId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ====== 9️⃣ عدد الرسائل غير المقروءة ======
// ====== 9️⃣ عدد الرسائل غير المقروءة ======
async getUnreadCount(userId: string): Promise<number> {
  // ✅ عد الرسائل التي وصلت للمستخدم ولم يقرأها
  const { count, error } = await supabase
    .from("messages")
    .select("*", { count: 'exact', head: true })
    .eq("receiver_id", userId)
    .is("read_at", null);

  if (error) {
    console.error("❌ Error getting unread count:", error);
    return 0;
  }

  return count || 0;
}

  // ====== 🔟 تحديث آخر ظهور ======
  async updateLastSeen(userId: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({
        last_seen_at: new Date().toISOString(),
        is_online: true,
      })
      .eq("id", userId);

    if (error) throw new Error(error.message);
  }

  // ====== 1️⃣1️⃣ تعيين المستخدم غير متصل ======
  async setOffline(userId: string): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({
        is_online: false,
        last_seen_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) throw new Error(error.message);
  }

  // ====== 1️⃣2️⃣ كتم إشعارات المحادثة ======
  async muteConversation(conversationId: string, userId: string): Promise<void> {
    const { data: conv } = await supabase
      .from("conversations")
      .select("participant1_id, participant2_id, is_muted_participant1, is_muted_participant2")
      .eq("id", conversationId)
      .single();

    if (!conv) throw new Error("Conversation not found");

    const updates: any = {};
    if (conv.participant1_id === userId) {
      updates.is_muted_participant1 = !conv.is_muted_participant1;
    } else {
      updates.is_muted_participant2 = !conv.is_muted_participant2;
    }

    const { error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", conversationId);

    if (error) throw new Error(error.message);
  }

  // ====== 1️⃣3️⃣ تثبيت محادثة ======
  async pinConversation(conversationId: string, userId: string): Promise<void> {
    const { data: conv } = await supabase
      .from("conversations")
      .select("participant1_id, participant2_id, pinned_at_participant1, pinned_at_participant2")
      .eq("id", conversationId)
      .single();

    if (!conv) throw new Error("Conversation not found");

    const updates: any = {};
    const now = new Date().toISOString();
    
    if (conv.participant1_id === userId) {
      updates.pinned_at_participant1 = conv.pinned_at_participant1 ? null : now;
    } else {
      updates.pinned_at_participant2 = conv.pinned_at_participant2 ? null : now;
    }

    const { error } = await supabase
      .from("conversations")
      .update(updates)
      .eq("id", conversationId);

    if (error) throw new Error(error.message);
  }

  // ====== 1️⃣4️⃣ حذف رسالة للجميع ======
  async deleteMessageForEveryone(messageId: string): Promise<void> {
    const { error } = await supabase
      .from("messages")
      .update({
        is_deleted: true,
        content: "🗑️ تم حذف هذه الرسالة",
      })
      .eq("id", messageId);

    if (error) throw new Error(error.message);
  }

  // ====== 1️⃣5️⃣ إعادة توجيه رسالة ======
  async forwardMessage(
    messageId: string,
    newConversationId: string,
    senderId: string
  ): Promise<IMessage> {
    const { data: original, error: fetchError } = await supabase
      .from("messages")
      .select("*")
      .eq("id", messageId)
      .single();

    if (fetchError) throw new Error(fetchError.message);
    if (!original) throw new Error("Message not found");

    const { data: message, error: msgError } = await supabase
      .from("messages")
      .insert({
        conversation_id: newConversationId,
        sender_id: senderId,
        receiver_id: original.receiver_id,
        content: original.content,
        type: original.type,
        file_url: original.file_url,
        file_name: original.file_name,
        file_size: original.file_size,
        is_forwarded: true,
        forwarded_from_id: original.id,
        is_deleted: false,
        location: original.location || null,
      })
      .select()
      .single();

    if (msgError) throw new Error(msgError.message);
    return message;
  }
}

export const conversationService = new ConversationService();