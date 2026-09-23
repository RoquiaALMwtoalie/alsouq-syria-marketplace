// src/routes/admin.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { AdminDashboard } from "@/components/dashboard/admin/AdminDashboard";

// ✅ قائمة التبويبات الصحيحة
const ADMIN_TABS = [
  "overview",
  "listings",
  "stores",
  "delivery",
  "promo",
  "complaints",
  "applications",
  "banners",
  "announcements",
  "categories",
  "notifications",
] as const;

export type AdminTab = typeof ADMIN_TABS[number];

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
  head: () => ({ meta: [{ title: "لوحة الأدمن — ذوق" }] }),
  // ✅ تعريف شكل الـ search params
  validateSearch: (search: Record<string, unknown>): { tab: AdminTab } => {
    const tab = search.tab;
    return {
      tab:
        typeof tab === "string" && (ADMIN_TABS as readonly string[]).includes(tab)
          ? (tab as AdminTab)
          : "overview",
    };
  },
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