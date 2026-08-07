// src/lib/routeGuard.ts

import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'delivery_company' | 'distributor' | 'seller' | 'customer';

// ✅ تعريف الصفحات المسموحة لكل دور
export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  '/': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/auth': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/auth/*': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/reset-password': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  '/complete': ['admin', 'delivery_company', 'distributor', 'seller', 'customer'],
  
  // صفحات الأدمن
  '/admin': ['admin'],
  '/admin/*': ['admin'],
  '/admin/dashboard': ['admin'],
  
  // صفحات شركة التوصيل
  '/delivery': ['admin', 'delivery_company'],
  '/delivery/*': ['admin', 'delivery_company'],
  '/delivery/dashboard': ['admin', 'delivery_company'],
  '/delivery/messages': ['admin', 'delivery_company'],
  '/delivery/conversation': ['admin', 'delivery_company'],
  '/delivery/conversation/*': ['admin', 'delivery_company'],
  '/delivery/orders': ['admin', 'delivery_company'],
  '/delivery/orders/*': ['admin', 'delivery_company'],
  '/delivery/distributors': ['admin', 'delivery_company'],
  
  // صفحات الموزع
  '/distributor': ['admin', 'distributor'],
  '/distributor/*': ['admin', 'distributor'],
  '/distributor/dashboard': ['admin', 'distributor'],
  '/distributor/messages': ['admin', 'distributor'],
  '/distributor/conversation': ['admin', 'distributor'],
  '/distributor/conversation/*': ['admin', 'distributor'],
  '/distributor/settings': ['admin', 'distributor'],
  '/distributor/review': ['admin', 'distributor'],
  
  // صفحات البائع
  '/seller': ['admin', 'seller'],
  '/seller/*': ['admin', 'seller'],
  '/seller/dashboard': ['admin', 'seller'],
  '/seller/products': ['admin', 'seller'],
  '/seller/orders': ['admin', 'seller'],
};

// ✅ المسارات الافتراضية لكل دور
export const DEFAULT_ROUTES: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  delivery_company: '/delivery/dashboard',
  distributor: '/distributor/dashboard',
  seller: '/seller/dashboard',
  customer: '/',
};

// ✅ دالة الحصول على أعلى دور
export function getHighestRole(roles: string[]): UserRole {
  const priority: UserRole[] = ['admin', 'delivery_company', 'distributor', 'seller', 'customer'];
  for (const role of priority) {
    if (roles.includes(role)) return role;
  }
  return 'customer';
}

// ✅ دالة التحقق من الصلاحية
export function hasPermission(pathname: string, roles: string[]): boolean {
  // ✅ التحقق من الصفحات المطابقة
  for (const [route, allowedRoles] of Object.entries(ROUTE_PERMISSIONS)) {
    const isExact = !route.endsWith('/*');
    const isMatch = isExact 
      ? pathname === route
      : pathname.startsWith(route.replace('/*', ''));
    
    if (isMatch) {
      return allowedRoles.some(role => roles.includes(role));
    }
  }
  
  // ✅ إذا لم يتم العثور على قاعدة، نسمح (لصفحات 404)
  return true;
}

// ✅ دالة الحصول على المسار الافتراضي
export function getDefaultRoute(roles: string[]): string {
  const highestRole = getHighestRole(roles);
  return DEFAULT_ROUTES[highestRole];
}

// ✅ دالة جلب الأدوار (مع تخزين مؤقت)
let rolesCache: string[] | null = null;
let rolesCacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 دقائق

export async function fetchUserRoles(userId: string): Promise<string[]> {
  // ✅ استخدام الكاش إذا كان صالحاً
  if (rolesCache && (Date.now() - rolesCacheTimestamp) < CACHE_DURATION) {
    return rolesCache;
  }

  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (error) throw error;
    
    const roles = data?.map((r: any) => r.role) || [];
    
    // ✅ تحديث الكاش
    rolesCache = roles;
    rolesCacheTimestamp = Date.now();
    
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return rolesCache || [];
  }
}