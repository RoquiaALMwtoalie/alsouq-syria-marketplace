// src/lib/authManager.ts

import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// ============================================================
// ✅ أنواع المستخدمين
// ============================================================
export type UserRole = 'admin' | 'delivery_company' | 'distributor' | 'seller' | 'customer';

export interface AuthSession {
  user: User | null;
  roles: UserRole[];
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ============================================================
// ✅ تخزين الجلسة في الذاكرة (أسرع من localStorage)
// ============================================================
let sessionCache: AuthSession = {
  user: null,
  roles: [],
  isLoading: true,
  isAuthenticated: false,
};

let sessionListeners: ((session: AuthSession) => void)[] = [];

// ============================================================
// ✅ دالة تحديث الجلسة (تُستدعى عند تغيير المستخدم)
// ============================================================
export async function updateAuthSession(user: User | null): Promise<void> {
  if (!user) {
    sessionCache = {
      user: null,
      roles: [],
      isLoading: false,
      isAuthenticated: false,
    };
    notifyListeners();
    return;
  }

  // ✅ جلب الأدوار من قاعدة البيانات (مرة واحدة فقط)
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching roles:", error);
    sessionCache = {
      user,
      roles: [],
      isLoading: false,
      isAuthenticated: true,
    };
    notifyListeners();
    return;
  }

  const roles = data?.map((r: any) => r.role) as UserRole[] || [];
  
  sessionCache = {
    user,
    roles,
    isLoading: false,
    isAuthenticated: true,
  };

  // ✅ تخزين في localStorage كنسخة احتياطية (للسرعة في下次 التحميل)
  try {
    localStorage.setItem('auth_session', JSON.stringify({
      user: { id: user.id, email: user.email },
      roles,
      timestamp: Date.now()
    }));
  } catch (e) {
    // تجاهل أخطاء localStorage
  }

  notifyListeners();
}

// ============================================================
// ✅ دالة الحصول على الجلسة الحالية (فورية)
// ============================================================
export function getAuthSession(): AuthSession {
  return sessionCache;
}

// ============================================================
// ✅ دالة الاشتراك في تحديثات الجلسة
// ============================================================
export function subscribeToAuthSession(listener: (session: AuthSession) => void): () => void {
  sessionListeners.push(listener);
  
  // ✅ إرسال الجلسة الحالية فوراً
  listener(sessionCache);
  
  return () => {
    sessionListeners = sessionListeners.filter(l => l !== listener);
  };
}

// ============================================================
// ✅ دالة إعلام المستمعين
// ============================================================
function notifyListeners(): void {
  sessionListeners.forEach(listener => listener(sessionCache));
}

// ============================================================
// ✅ دالة تهيئة الجلسة من localStorage (عند تحميل التطبيق)
// ============================================================
export function initAuthSession(): AuthSession {
  try {
    const stored = localStorage.getItem('auth_session');
    if (stored) {
      const data = JSON.parse(stored);
      // ✅ التحقق من صلاحية الكاش (لا يزيد عن 5 دقائق)
      if (data.timestamp && (Date.now() - data.timestamp) < 5 * 60 * 1000) {
        sessionCache = {
          user: data.user,
          roles: data.roles || [],
          isLoading: false,
          isAuthenticated: true,
        };
        return sessionCache;
      }
    }
  } catch (e) {
    // تجاهل الأخطاء
  }
  
  sessionCache = {
    user: null,
    roles: [],
    isLoading: true,
    isAuthenticated: false,
  };
  return sessionCache;
}

// ============================================================
// ✅ دالة مسح الجلسة (عند تسجيل الخروج)
// ============================================================
export function clearAuthSession(): void {
  sessionCache = {
    user: null,
    roles: [],
    isLoading: false,
    isAuthenticated: false,
  };
  try {
    localStorage.removeItem('auth_session');
  } catch (e) {
    // تجاهل
  }
  notifyListeners();
}