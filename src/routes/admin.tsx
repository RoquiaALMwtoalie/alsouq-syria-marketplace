// src/routes/admin.tsx
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
  head: () => ({ meta: [{ title: "لوحة الأدمن — ذوق" }] }),
});

function AdminRoute() {
  const app = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // ✅ التحقق من صلاحيات الأدمن
  useEffect(() => {
    if (!app.authLoading) {
      const isAdmin = app.roles?.includes("admin");
      if (!app.user) {
        navigate({ to: "/auth/$mode", params: { mode: "login" } });
      } else if (!isAdmin) {
        navigate({ to: "/dashboard" });
      }
    }
  }, [app.authLoading, app.user, app.roles, navigate]);

  if (app.authLoading || !app.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        جار التحميل...
      </div>
    );
  }

  const isAdmin = app.roles?.includes("admin");
  if (!isAdmin) return null;

  // ✅ إذا كنا على /admin بالضبط → AdminDashboard
  // ✅ إذا كنا على /admin/xxx → Outlet (child route)
  const isAdminRoot = pathname === "/admin" || pathname === "/admin/";

  if (isAdminRoot) {
    return <AdminDashboard notificationButton={null} />;
  }

  // على child routes (مثل /admin/complaints/$id)
  return <Outlet />;
}