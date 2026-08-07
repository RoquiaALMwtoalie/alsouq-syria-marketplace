// src/components/RouteGuard.tsx

import { useEffect, useState, useRef } from "react";
import { useApp } from "@/lib/i18n";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const app = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const hasRedirected = useRef(false);
  const hasChecked = useRef(false);

  useEffect(() => {
    // ✅ منع التنفيذ المتكرر
    if (hasChecked.current || hasRedirected.current) {
      if (loading) setLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        // ✅ إذا لم يكن هناك مستخدم
        if (!app.user) {
          // ✅ السماح بصفحات المصادقة
          if (pathname.startsWith('/auth') || pathname.startsWith('/reset-password') || pathname.startsWith('/complete')) {
            setAuthorized(true);
            setLoading(false);
            hasChecked.current = true;
            return;
          }
          // ✅ توجيه إلى صفحة تسجيل الدخول
          hasRedirected.current = true;
          hasChecked.current = true;
          navigate({ to: '/auth/login', replace: true });
          return;
        }

        // ✅ جلب الأدوار من قاعدة البيانات
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", app.user.id);

        if (error) throw error;
        
        const roles = data?.map((r: any) => r.role) || [];
        const isAdmin = roles.includes("admin");
        const isDeliveryCompany = roles.includes("delivery_company");
        const isDistributor = roles.includes("distributor");
        const isCustomer = !isAdmin && !isDeliveryCompany && !isDistributor;

        // ✅ إذا كان المستخدم في الصفحة الرئيسية
        if (pathname === '/' || pathname === '') {
          if (isDistributor) {
            hasRedirected.current = true;
            hasChecked.current = true;
            navigate({ to: '/distributor/dashboard', replace: true });
            return;
          }
          if (isDeliveryCompany) {
            hasRedirected.current = true;
            hasChecked.current = true;
            navigate({ to: '/delivery/dashboard', replace: true });
            return;
          }
          if (isAdmin) {
            hasRedirected.current = true;
            hasChecked.current = true;
            navigate({ to: '/admin/dashboard', replace: true });
            return;
          }
          setAuthorized(true);
          setLoading(false);
          hasChecked.current = true;
          return;
        }

        // ✅ إذا كان العميل يحاول دخول صفحات محمية
        if (isCustomer) {
          if (pathname.startsWith('/distributor') || pathname.startsWith('/delivery') || pathname.startsWith('/admin')) {
            hasRedirected.current = true;
            hasChecked.current = true;
            navigate({ to: '/', replace: true });
            return;
          }
          setAuthorized(true);
          setLoading(false);
          hasChecked.current = true;
          return;
        }

        // ✅ إذا كان الموزع
        if (isDistributor) {
          // ✅ منع الوصول إلى صفحات delivery و admin
          if (pathname.startsWith('/delivery') || pathname.startsWith('/admin')) {
            hasRedirected.current = true;
            hasChecked.current = true;
            navigate({ to: '/distributor/dashboard', replace: true });
            return;
          }
          // ✅ السماح بصفحات الموزع
          if (pathname.startsWith('/distributor')) {
            setAuthorized(true);
            setLoading(false);
            hasChecked.current = true;
            return;
          }
          // ✅ أي صفحة أخرى → لوحة التحكم
          hasRedirected.current = true;
          hasChecked.current = true;
          navigate({ to: '/distributor/dashboard', replace: true });
          return;
        }

        // ✅ إذا كانت شركة توصيل
        if (isDeliveryCompany) {
          if (pathname.startsWith('/distributor') || pathname.startsWith('/admin')) {
            hasRedirected.current = true;
            hasChecked.current = true;
            navigate({ to: '/delivery/dashboard', replace: true });
            return;
          }
          if (pathname.startsWith('/delivery')) {
            setAuthorized(true);
            setLoading(false);
            hasChecked.current = true;
            return;
          }
          hasRedirected.current = true;
          hasChecked.current = true;
          navigate({ to: '/delivery/dashboard', replace: true });
          return;
        }

        // ✅ الأدمن
        if (isAdmin) {
          setAuthorized(true);
          setLoading(false);
          hasChecked.current = true;
          return;
        }

        // ✅ أي شيء آخر
        setAuthorized(true);
        setLoading(false);
        hasChecked.current = true;
        
      } catch (error) {
        console.error("Error in RouteGuard:", error);
        // ✅ في حالة الخطأ، نسمح بالوصول (لتجنب تعطل التطبيق)
        setAuthorized(true);
        setLoading(false);
        hasChecked.current = true;
      }
    };

    checkAccess();
  }, [app.user, pathname, navigate]);

  // ✅ عرض شاشة تحميل
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2e2a]/5 via-white to-[#0d2e2a]/10">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0d2e2a]/20 border-t-[#0d2e2a]" />
          <p className="text-sm text-muted-foreground animate-pulse">
            {app.lang === 'ar' ? 'جاري التحقق...' : 'Checking...'}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}