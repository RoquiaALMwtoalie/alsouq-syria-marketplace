// src/routes/admin.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
  head: () => ({ meta: [{ title: "لوحة الأدمن — السوق اليك" }] }),
});

function AdminRoute() {
  const app = useApp();
  const navigate = useNavigate();

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
  if (!isAdmin) {
    return null;
  }

  return <AdminDashboard notificationButton={null} />;
}