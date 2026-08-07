// src/lib/hooks/useAuth.ts

import { useEffect, useState } from "react";
import { 
  getAuthSession, 
  subscribeToAuthSession, 
  AuthSession,
  updateAuthSession,
  clearAuthSession,
  initAuthSession
} from "@/lib/authManager";
import { supabase } from "@/integrations/supabase/client";

// ============================================================
// ✅ Hook للجلسة (يُستخدم في أي مكان)
// ============================================================
export function useAuth(): AuthSession & {
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
} {
  const [session, setSession] = useState<AuthSession>(() => {
    // ✅ تهيئة الجلسة من localStorage فوراً
    return initAuthSession();
  });

  // ✅ الاشتراك في تحديثات الجلسة
  useEffect(() => {
    const unsubscribe = subscribeToAuthSession((newSession) => {
      setSession(newSession);
    });
    return unsubscribe;
  }, []);

  // ✅ دالة تحديث الجلسة
  const refreshSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await updateAuthSession(user);
  };

  // ✅ دالة تسجيل الخروج
  const logout = async () => {
    await supabase.auth.signOut();
    clearAuthSession();
  };

  return {
    ...session,
    refreshSession,
    logout,
  };
}

// ============================================================
// ✅ Hook للتحقق من الصلاحيات (فوري)
// ============================================================
export function usePermissions(): {
  isAdmin: boolean;
  isDeliveryCompany: boolean;
  isDistributor: boolean;
  isSeller: boolean;
  isCustomer: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isLoading: boolean;
} {
  const session = useAuth();

  return {
    isAdmin: session.roles.includes('admin'),
    isDeliveryCompany: session.roles.includes('delivery_company'),
    isDistributor: session.roles.includes('distributor'),
    isSeller: session.roles.includes('seller'),
    isCustomer: session.roles.length === 0 || session.roles.includes('customer'),
    hasRole: (role) => session.roles.includes(role),
    hasAnyRole: (roles) => roles.some(r => session.roles.includes(r)),
    isLoading: session.isLoading,
  };
}