// src/components/RoleBasedGuard.tsx

import { useEffect, useState } from 'react';
import { useApp } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { useRouterState } from '@tanstack/react-router';
import { hasPermission, getBestDashboardForUser, UserRole } from '@/lib/roles';
import { Loader2 } from 'lucide-react';

interface RoleBasedGuardProps {
  children: React.ReactNode;
}

export function RoleBasedGuard({ children }: RoleBasedGuardProps) {
  const app = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!app.user) {
        setLoading(false);
        // ✅ المستخدم غير مسجل، السماح مؤقتاً
        setIsAuthorized(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', app.user.id);

        if (error) throw error;

        const roles = (data?.map((r: any) => r.role) || []) as UserRole[];
        setUserRoles(roles);

        // ✅ التحقق من الصلاحية
        const { allowed, redirectTo } = hasPermission(pathname, roles);

        if (!allowed && redirectTo) {
          setRedirecting(true);
          window.location.href = redirectTo;
          return;
        }

        // ✅ إذا كان في الصفحة الرئيسية، التوجيه إلى لوحة التحكم المناسبة
        if ((pathname === '/' || pathname === '') && roles.length > 0) {
          const dashboard = getBestDashboardForUser(roles);
          if (dashboard) {
            setRedirecting(true);
            window.location.href = dashboard;
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('Error fetching user roles:', error);
        setIsAuthorized(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [app.user, pathname]);

  // ✅ عرض شاشة تحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2e2a]/5 via-white to-[#0d2e2a]/10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0d2e2a]/20 border-t-[#0d2e2a]" />
          <p className="text-sm text-muted-foreground animate-pulse">
            {app.lang === 'ar' ? 'جاري التحقق من الصلاحيات...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2e2a]/5 via-white to-[#0d2e2a]/10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0d2e2a]/20 border-t-[#0d2e2a]" />
          <p className="text-sm text-muted-foreground animate-pulse">
            {app.lang === 'ar' ? 'جاري التوجيه...' : 'Redirecting...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2e2a]/5 via-white to-[#0d2e2a]/10">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🚫</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {app.lang === 'ar' ? 'غير مصرح بالدخول' : 'Access Denied'}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {app.lang === 'ar'
              ? 'ليس لديك الصلاحية لرؤية هذه الصفحة'
              : 'You do not have permission to view this page'}
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-6 px-6 py-2 bg-[#0d2e2a] text-white rounded-xl hover:bg-[#2a655f] transition-all"
          >
            {app.lang === 'ar' ? 'العودة للرئيسية' : 'Go Home'}
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}