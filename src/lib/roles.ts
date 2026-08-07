// src/lib/roles.ts

export type UserRole = 'admin' | 'delivery_company' | 'distributor' | 'seller' | 'customer';

export interface RouteConfig {
  path: string;
  allowedRoles: UserRole[];
  redirectTo?: string;
  exact?: boolean;
}

// ✅ تعريف جميع الصفحات والصلاحيات المسموحة
export const routePermissions: RouteConfig[] = [
  // ✅ الصفحات العامة (الكل)
  { path: '/', allowedRoles: ['admin', 'delivery_company', 'distributor', 'seller', 'customer'] },
  { path: '/auth', allowedRoles: ['admin', 'delivery_company', 'distributor', 'seller', 'customer'] },
  { path: '/reset-password', allowedRoles: ['admin', 'delivery_company', 'distributor', 'seller', 'customer'] },
  { path: '/complete', allowedRoles: ['admin', 'delivery_company', 'distributor', 'seller', 'customer'] },

  // ✅ صفحات الأدمن
  { path: '/admin', allowedRoles: ['admin'], redirectTo: '/admin/dashboard' },
  { path: '/admin/dashboard', allowedRoles: ['admin'] },
  { path: '/admin/users', allowedRoles: ['admin'] },
  { path: '/admin/settings', allowedRoles: ['admin'] },

  // ✅ صفحات شركة التوصيل
  { path: '/delivery', allowedRoles: ['admin', 'delivery_company'], redirectTo: '/delivery/dashboard' },
  { path: '/delivery/dashboard', allowedRoles: ['admin', 'delivery_company'] },
  { path: '/delivery/messages', allowedRoles: ['admin', 'delivery_company'] },
  { path: '/delivery/orders', allowedRoles: ['admin', 'delivery_company'] },
  { path: '/delivery/orders/new', allowedRoles: ['admin', 'delivery_company'] },
  { path: '/delivery/conversation', allowedRoles: ['admin', 'delivery_company'] },
  { path: '/delivery/distributors', allowedRoles: ['admin', 'delivery_company'] },

  // ✅ صفحات الموزع
  { path: '/distributor', allowedRoles: ['admin', 'distributor'], redirectTo: '/distributor/dashboard' },
  { path: '/distributor/dashboard', allowedRoles: ['admin', 'distributor'] },
  { path: '/distributor/messages', allowedRoles: ['admin', 'distributor'] },
  { path: '/distributor/conversation', allowedRoles: ['admin', 'distributor'] },
  { path: '/distributor/settings', allowedRoles: ['admin', 'distributor'] },

  // ✅ صفحات البائع (المتجر)
  { path: '/seller', allowedRoles: ['admin', 'seller'], redirectTo: '/seller/dashboard' },
  { path: '/seller/dashboard', allowedRoles: ['admin', 'seller'] },
  { path: '/seller/products', allowedRoles: ['admin', 'seller'] },
  { path: '/seller/orders', allowedRoles: ['admin', 'seller'] },
];

// ✅ دالة للتحقق من صلاحية المستخدم لدخول صفحة
export function hasPermission(
  path: string,
  userRoles: UserRole[]
): { allowed: boolean; redirectTo?: string } {
  // ✅ العثور على قاعدة الصفحة
  const rule = routePermissions.find((r) => {
    if (r.exact) {
      return r.path === path;
    }
    return path.startsWith(r.path);
  });

  if (!rule) {
    // ✅ إذا لم تجد قاعدة، السماح (أو منع حسب السياسة)
    return { allowed: true };
  }

  // ✅ التحقق من أن المستخدم لديه دور مسموح
  const hasRole = userRoles.some((role) => rule.allowedRoles.includes(role));

  if (!hasRole && rule.redirectTo) {
    return { allowed: false, redirectTo: rule.redirectTo };
  }

  // ✅ إذا كان المستخدم لديه صلاحية ولكن الصفحة الرئيسية
  if (path === '/' || path === '') {
    // ✅ تحديد أفضل صفحة للمستخدم حسب دوره
    const bestDashboard = getBestDashboardForUser(userRoles);
    if (bestDashboard && path !== bestDashboard) {
      return { allowed: true, redirectTo: bestDashboard };
    }
  }

  return { allowed: hasRole };
}

// ✅ دالة للحصول على أفضل لوحة تحكم للمستخدم
export function getBestDashboardForUser(roles: UserRole[]): string | null {
  if (roles.includes('admin')) return '/admin/dashboard';
  if (roles.includes('delivery_company')) return '/delivery/dashboard';
  if (roles.includes('distributor')) return '/distributor/dashboard';
  if (roles.includes('seller')) return '/seller/dashboard';
  return null;
}

// ✅ دالة للحصول على أعلى دور للمستخدم
export function getHighestRole(roles: UserRole[]): UserRole {
  const priority: UserRole[] = ['admin', 'delivery_company', 'distributor', 'seller', 'customer'];
  for (const role of priority) {
    if (roles.includes(role)) return role;
  }
  return 'customer';
}