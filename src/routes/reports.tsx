import { createFileRoute } from "@tanstack/react-router";
import { Download, FileBarChart } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { chartCategory, chartRevenue, governorates } from "@/lib/mock-data";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({
  component: Reports,
  head: () => ({ meta: [{ title: "Reports — Souqi" }] }),
});

function Reports() {
  const app = useApp();
  const t = useT();
  const rows = governorates.slice(0, 8).map((g, i) => ({
    gov: g[app.lang], biz: 120 + i * 43, sales: (i + 1) * 34_500_000, users: 400 + i * 220,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2"><FileBarChart className="h-7 w-7 text-primary" /> {t("reports")}</h1>
          <p className="text-muted-foreground text-sm">{app.lang === "ar" ? "تحليلات شاملة عن نشاطك والسوق." : "Comprehensive analytics for your business and the market."}</p>
        </div>
        <Button className="gap-2" onClick={() => toast.success(app.lang === "ar" ? "تم تحميل التقرير" : "Report downloaded")}>
          <Download className="h-4 w-4" /> {app.lang === "ar" ? "تصدير" : "Export"}
        </Button>
      </div>

      <Tabs defaultValue="sales">
        <TabsList>
          <TabsTrigger value="sales">{app.lang === "ar" ? "المبيعات" : "Sales"}</TabsTrigger>
          <TabsTrigger value="biz">{app.lang === "ar" ? "الأنشطة" : "Businesses"}</TabsTrigger>
          <TabsTrigger value="users">{app.lang === "ar" ? "المستخدمون" : "Users"}</TabsTrigger>
          <TabsTrigger value="cats">{app.lang === "ar" ? "الأقسام" : "Categories"}</TabsTrigger>
          <TabsTrigger value="loc">{app.lang === "ar" ? "الموقع" : "Location"}</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="mt-6 rounded-2xl bg-card p-5 shadow-card">
          <h3 className="font-bold mb-3">{app.lang === "ar" ? "المبيعات الشهرية" : "Monthly sales"}</h3>
          <div className="h-80">
            <ResponsiveContainer><AreaChart data={chartRevenue}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} /><Tooltip /><Legend />
              <Area type="monotone" dataKey="v" name={app.lang === "ar" ? "المبيعات" : "Sales"} stroke="oklch(0.55 0.22 262)" fill="oklch(0.55 0.22 262 / 0.25)" />
            </AreaChart></ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="biz" className="mt-6 rounded-2xl bg-card p-5 shadow-card">
          <h3 className="font-bold mb-3">{app.lang === "ar" ? "عدد الأنشطة الجديدة" : "New businesses"}</h3>
          <div className="h-80">
            <ResponsiveContainer><BarChart data={chartCategory}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={10} angle={-25} textAnchor="end" height={70} interval={0} /><YAxis fontSize={11} /><Tooltip />
              <Bar dataKey="value" fill="oklch(0.62 0.19 148)" radius={[8, 8, 0, 0]} />
            </BarChart></ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6 rounded-2xl bg-card p-5 shadow-card">
          <h3 className="font-bold mb-3">{app.lang === "ar" ? "نمو المستخدمين" : "User growth"}</h3>
          <div className="h-80">
            <ResponsiveContainer><AreaChart data={chartRevenue.map((r, i) => ({ ...r, v: r.v * 5 + i * 20 }))}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
              <Area type="monotone" dataKey="v" stroke="oklch(0.78 0.16 75)" fill="oklch(0.78 0.16 75 / 0.3)" />
            </AreaChart></ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="cats" className="mt-6 rounded-2xl bg-card p-5 shadow-card">
          <div className="h-80">
            <ResponsiveContainer><BarChart data={chartCategory} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis type="number" fontSize={11} /><YAxis dataKey="name" type="category" width={110} fontSize={11} /><Tooltip />
              <Bar dataKey="value" fill="oklch(0.55 0.22 262)" radius={[0, 8, 8, 0]} />
            </BarChart></ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="loc" className="mt-6 rounded-2xl bg-card p-5 shadow-card">
          <Table>
            <TableHeader><TableRow>
              <TableHead>{app.lang === "ar" ? "المحافظة" : "Governorate"}</TableHead>
              <TableHead>{app.lang === "ar" ? "الأنشطة" : "Businesses"}</TableHead>
              <TableHead>{app.lang === "ar" ? "المبيعات" : "Sales"}</TableHead>
              <TableHead>{app.lang === "ar" ? "المستخدمون" : "Users"}</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.gov}>
                  <TableCell className="font-semibold">{r.gov}</TableCell>
                  <TableCell>{r.biz}</TableCell>
                  <TableCell className="font-semibold text-primary">{formatPrice(r.sales, app.currency, app.lang)}</TableCell>
                  <TableCell>{r.users.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
