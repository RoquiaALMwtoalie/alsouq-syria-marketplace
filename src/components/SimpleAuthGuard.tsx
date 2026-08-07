// src/components/SimpleAuthGuard.tsx

import { useEffect, useRef } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface SimpleAuthGuardProps {
  children: React.ReactNode;
}

export function SimpleAuthGuard({ children }: SimpleAuthGuardProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, roles, isLoading, isAuthenticated } = useAuth();
  const hasRedirected = useRef(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // ✅ منع التوجيه المتكرر
    if (hasRedirected.current || hasChecked.current) return;
    if (isLoading) return;

    // ✅ إذا لم يكن المستخدم مسجلاً
    if (!user || !isAuthenticated) {
      if (pathname.startsWith('/auth') || pathname.startsWith('/reset-password')) {
        hasChecked.current = true;
        return;
      }
      hasRedirected.current = true;
      navigate({ to: '/auth/login', replace: true });
      return;
    }

    // ✅ تحديد أعلى دور
    const isAdmin = roles.includes('admin');
    const isDeliveryCompany = roles.includes('delivery_company');
    const isDistributor = roles.includes('distributor');
    const isCustomer = !isAdmin && !isDeliveryCompany && !isDistributor;

    // ✅ العميل → الصفحة الرئيسية فقط
    if (isCustomer) {
      if (pathname.startsWith('/distributor') || pathname.startsWith('/delivery') || pathname.startsWith('/admin')) {
        hasRedirected.current = true;
        navigate({ to: '/', replace: true });
        return;
      }
      hasChecked.current = true;
      return;
    }

    // ✅ الموزع → /distributor/dashboard
    if (isDistributor) {
      if (pathname === '/' || pathname === '') {
        hasRedirected.current = true;
        navigate({ to: '/distributor/dashboard', replace: true });
        return;
      }
      if (pathname.startsWith('/delivery') || pathname.startsWith('/admin')) {
        hasRedirected.current = true;
        navigate({ to: '/distributor/dashboard', replace: true });
        return;
      }
      hasChecked.current = true;
      return;
    }

    // ✅ شركة توصيل → /delivery/dashboard
    if (isDeliveryCompany) {
      if (pathname === '/' || pathname === '') {
        hasRedirected.current = true;
        navigate({ to: '/delivery/dashboard', replace: true });
        return;
      }
      if (pathname.startsWith('/distributor') || pathname.startsWith('/admin')) {
        hasRedirected.current = true;
        navigate({ to: '/delivery/dashboard', replace: true });
        return;
      }
      hasChecked.current = true;
      return;
    }

    // ✅ أدمن → /admin/dashboard
    if (isAdmin) {
      if (pathname === '/' || pathname === '') {
        hasRedirected.current = true;
        navigate({ to: '/admin/dashboard', replace: true });
        return;
      }
      hasChecked.current = true;
      return;
    }

    hasChecked.current = true;
  }, [pathname, user, roles, isLoading, isAuthenticated, navigate]);

  // ✅ عرض التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d2e2a]" />
      </div>
    );
  }

  return <>{children}</>;
}