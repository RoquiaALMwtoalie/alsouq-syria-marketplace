// src/components/AuthGuard.tsx

import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/auth': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/auth/*': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/reset-password': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/complete': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/admin': ['admin'],
  '/admin/*': ['admin'],
  '/delivery': ['admin', 'delivery_company'],
  '/delivery/*': ['admin', 'delivery_company'],
  '/distributor': ['admin', 'distributor'],
  '/distributor/*': ['admin', 'distributor'],
  '/distributor/dashboard': ['admin', 'distributor'],
  '/distributor/messages': ['admin', 'distributor'],
  '/distributor/conversation': ['admin', 'distributor'],
  '/distributor/conversation/*': ['admin', 'distributor'],
  '/distributor/settings': ['admin', 'distributor'],
  '/distributor/review': ['admin', 'distributor'],
  '/seller': ['admin', 'seller'],
  '/seller/*': ['admin', 'seller'],
};

const DEFAULT_ROUTES: Record<string, string> = {
  admin: '/admin/dashboard',
  delivery_company: '/delivery/dashboard',
  distributor: '/distributor/dashboard',
  seller: '/seller/dashboard',
  customer: '/',
};

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, roles, isLoading, isAuthenticated } = useAuth();
  const hasRedirected = useRef(false);
  const hasChecked = useRef(false);

  // ✅ ضبط السكرول إلى الأعلى عند تغيير الصفحة
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // ✅ منع التنفيذ المتكرر
    if (hasChecked.current || hasRedirected.current) {
      return;
    }

    if (isLoading) {
      console.log("⏳ [AuthGuard] Loading...");
      return;
    }

    // ✅ إذا لم يكن المستخدم مسجلاً
    if (!user || !isAuthenticated) {
      if (pathname.startsWith('/auth') || pathname.startsWith('/reset-password') || pathname.startsWith('/complete')) {
        console.log("🔓 [AuthGuard] Auth page, allowing access");
        hasChecked.current = true;
        return;
      }
      hasRedirected.current = true;
      hasChecked.current = true;
      console.log("🔒 [AuthGuard] Not authenticated, redirecting to /auth/login");
      navigate({ to: '/auth/login', replace: true });
      return;
    }

    // ✅ تحديد أعلى دور للمستخدم
    const highestRole = roles.includes('admin') ? 'admin' :
                        roles.includes('delivery_company') ? 'delivery_company' :
                        roles.includes('distributor') ? 'distributor' :
                        roles.includes('seller') ? 'seller' : 'customer';

    // ✅ إذا كان المستخدم في الصفحة الرئيسية
    if (pathname === '/' || pathname === '') {
      const defaultRoute = DEFAULT_ROUTES[highestRole] || '/';
      if (defaultRoute !== '/') {
        hasRedirected.current = true;
        hasChecked.current = true;
        console.log(`🔄 [AuthGuard] Redirecting from / to ${defaultRoute}`);
        navigate({ to: defaultRoute, replace: true });
        return;
      }
      hasChecked.current = true;
      return;
    }

    // ✅ التحقق من صلاحية الصفحة الحالية (فقط للمسارات المعروفة)
    let hasPermission = false;
    let routeFound = false;
    
    for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
      const isExact = !route.endsWith('/*');
      const isMatch = isExact 
        ? pathname === route
        : pathname.startsWith(route.replace('/*', ''));
      
      if (isMatch) {
        routeFound = true;
        hasPermission = allowedRoles.some(role => roles.includes(role));
        break;
      }
    }

    // ✅ إذا كانت الصفحة غير معروفة، نسمح
    if (!routeFound) {
      console.log("❓ [AuthGuard] Unknown route, allowing access");
      hasChecked.current = true;
      return;
    }
    
    // ✅ الصفحة ممنوعة → توجيه إلى لوحة التحكم المناسبة
    if (!hasPermission) {
      hasRedirected.current = true;
      hasChecked.current = true;
      const defaultRoute = DEFAULT_ROUTES[highestRole] || '/';
      console.log(`🚫 [AuthGuard] Access denied, redirecting to ${defaultRoute}`);
      navigate({ to: defaultRoute, replace: true });
      return;
    }

    hasChecked.current = true;
  }, [pathname, user, roles, isLoading, isAuthenticated, navigate]);

  // ✅ عرض شاشة تحميل سريعة
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d2e2a]/5 via-white to-[#0d2e2a]/10">
        <Loader2 className="h-8 w-8 animate-spin text-[#0d2e2a]" />
      </div>
    );
  }

  return <>{children}</>;
}