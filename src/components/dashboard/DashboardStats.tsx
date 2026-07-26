// src/components/dashboard/DashboardStats.tsx
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { RecentOrders } from "./RecentOrders";

function buildRevenueChart(rows: any[], lang: "ar" | "en") {
  const labels = lang === "ar"
    ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"]
    : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return {
      key: `${d.getFullYear()}-${d.getMonth()}`,
      m: labels[d.getMonth()] ?? String(d.getMonth() + 1),
      v: 0,
    };
  });
  for (const row of rows) {
    const d = new Date(row.created_at);
    const item = months.find((month) => month.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (item) item.v += Number(row.total) || 0;
  }
  return months;
}

function buildListingCategoryChart(listings: any[], categories: any[], lang: "ar" | "en") {
  const names = new Map(categories.map((category: any) => [category.id, lang === "ar" ? category.name_ar : category.name_en]));
  const counts = new Map<string, number>();
  for (const listing of listings) {
    const name = names.get(listing.category_id) || (lang === "ar" ? "بدون تصنيف" : "Uncategorized");
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  const rows = Array.from(counts, ([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  return rows.length ? rows : [{ name: lang === "ar" ? "لا بيانات" : "No data", value: 0 }];
}

interface DashboardStatsProps {
  sellerOrders: any[];
  sellerListings: any[];
  sellerCustomers: any[];
  cats: any[];
}

export function DashboardStats({ sellerOrders, sellerListings, sellerCustomers, cats }: DashboardStatsProps) {
  const app = useApp();
  const t = useT();

  const stats = [
    {
      key: "revenue",
      label: t("revenue"),
      value: formatPrice(sellerOrders.reduce((sum: number, row: any) => sum + (Number(row.total) || 0), 0), app.currency, app.lang),
      delta: "+12.5%",
      icon: DollarSign,
      color: "from-blue-500 to-indigo-600",
    },
    {
      key: "orders",
      label: t("total_orders"),
      value: String(sellerOrders.length),
      delta: "+8.2%",
      icon: ShoppingCart,
      color: "from-emerald-500 to-teal-600",
    },
    {
      key: "customers",
      label: t("new_customers"),
      value: String(sellerCustomers.length),
      delta: "+23.1%",
      icon: Users,
      color: "from-violet-500 to-purple-600",
    },
    {
      key: "products",
      label: t("products"),
      value: String(sellerListings.length),
      delta: "+5.4%",
      icon: Package,
      color: "from-rose-500 to-pink-600",
    },
  ];

  const revenueChart = buildRevenueChart(sellerOrders, app.lang);
  const categoryChart = buildListingCategoryChart(sellerListings, cats, app.lang);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div
            key={s.key}
            className="group relative overflow-hidden rounded-2xl bg-card p-6 shadow-lg border border-border/30 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
            <div className="relative">
              <div className={`h-12 w-12 rounded-xl grid place-items-center bg-gradient-to-br ${s.color} text-white shadow-md group-hover:scale-110 transition`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mt-3 text-xs text-muted-foreground font-medium">{s.label}</div>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500 mt-1">
                <TrendingUp className="h-3 w-3" />
                {s.delta}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <div className="rounded-2xl bg-card p-6 shadow-lg border border-border/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{t("revenue")}</h3>
            <Badge variant="outline" className="bg-primary/5 rounded-xl">2026</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="m" stroke="currentColor" fontSize={11} />
                <YAxis stroke="currentColor" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="v" stroke="#3b82f6" fill="url(#g1)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-lg border border-border/30">
          <h3 className="font-bold text-lg mb-4">
            {app.lang === "ar" ? "الأقسام الأكثر مبيعاً" : "Top Categories"}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChart} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                <XAxis type="number" fontSize={11} />
                <YAxis dataKey="name" type="category" fontSize={10} width={60} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <RecentOrders />
    </div>
  );
}