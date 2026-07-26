import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, TrendingUp, TrendingDown, Send } from "lucide-react";
import { useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { aiInsights, chartRevenue, chartCategory, categories } from "@/lib/mock-data";
import { useApp, useT } from "@/lib/i18n";

export const Route = createFileRoute("/ai")({
  component: AIPage,
  head: () => ({ meta: [{ title: "Souqi AI — Market Intelligence" }] }),
});

const colors = ["oklch(0.55 0.22 262)", "oklch(0.62 0.19 148)", "oklch(0.78 0.16 75)", "oklch(0.6 0.22 27)", "oklch(0.6 0.2 285)"];

function AIPage() {
  const app = useApp();
  const t = useT();
  const [q, setQ] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: app.lang === "ar" ? "مرحباً! أنا Souqi AI. اسألني عن اتجاهات السوق السوري." : "Hi! I'm Souqi AI. Ask me anything about Syria's market trends." },
  ]);

  const ask = () => {
    if (!q.trim()) return;
    const question = q;
    const answer = app.lang === "ar"
      ? "بناءً على بيانات آخر 30 يوم: هناك نمو قوي في قسم المطاعم (+34%) وخصوصاً في دمشق واللاذقية، مع طلب متزايد على العقارات في ريف دمشق. أنصح بزيادة الحملات الترويجية بين 18:00–22:00."
      : "Based on the last 30 days: strong growth in the Restaurants category (+34%), especially in Damascus and Latakia, with rising real estate demand in Rural Damascus. I recommend boosting promotions between 18:00–22:00.";
    setChat((c) => [...c, { role: "user", text: question }, { role: "ai", text: answer }]);
    setQ("");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="rounded-3xl gradient-hero text-primary-foreground p-8 relative overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="relative">
          <Badge className="bg-white/20 border-0"><Sparkles className="h-3 w-3 me-1" /> Souqi AI</Badge>
          <h1 className="mt-2 text-3xl md:text-4xl font-black">{app.lang === "ar" ? "ذكاء اصطناعي للسوق السوري" : "AI intelligence for Syria's market"}</h1>
          <p className="text-white/80 mt-1 max-w-2xl">{t("ai_desc")}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiInsights.map((s, idx) => (
          <div key={idx} className="rounded-2xl bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{app.lang === "ar" ? s.period_ar : s.period_en}</div>
              {s.trend === "up" ? <TrendingUp className="h-4 w-4 text-secondary" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
            </div>
            <div className={`text-3xl font-black mt-1 ${s.trend === "up" ? "text-secondary" : "text-destructive"}`}>{s.change}</div>
            <div className="text-sm font-semibold mt-1">{app.lang === "ar" ? s.title_ar : s.title_en}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-4">
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <h3 className="font-bold">{app.lang === "ar" ? "اتجاهات البحث خلال العام" : "Search trends this year"}</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer><LineChart data={chartRevenue}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} /><Tooltip />
              <Line type="monotone" dataKey="v" stroke="oklch(0.55 0.22 262)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart></ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-5 shadow-card">
          <h3 className="font-bold">{app.lang === "ar" ? "توزيع الأقسام" : "Category distribution"}</h3>
          <div className="h-72 mt-3">
            <ResponsiveContainer><PieChart>
              <Pie data={chartCategory.slice(0, 6)} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {chartCategory.slice(0, 6).map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart></ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-card p-5 shadow-card">
        <h3 className="font-bold">{app.lang === "ar" ? "أفضل الأقسام أداءً" : "Top-performing categories"}</h3>
        <div className="h-72 mt-3">
          <ResponsiveContainer><BarChart data={chartCategory}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" fontSize={10} angle={-25} textAnchor="end" height={70} interval={0} /><YAxis fontSize={11} /><Tooltip />
            <Bar dataKey="value" fill="oklch(0.62 0.19 148)" radius={[8, 8, 0, 0]} />
          </BarChart></ResponsiveContainer>
        </div>
      </div>

      {/* AI Chat */}
      <div className="rounded-2xl bg-card shadow-card overflow-hidden">
        <div className="p-5 border-b flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-hero grid place-items-center text-white"><Sparkles className="h-5 w-5" /></div>
          <div>
            <div className="font-bold">Souqi AI Assistant</div>
            <div className="text-xs text-muted-foreground">{app.lang === "ar" ? "متصل الآن" : "Online"}</div>
          </div>
        </div>
        <div className="p-5 space-y-3 max-h-80 overflow-auto bg-muted/30">
          {chat.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <form className="p-3 border-t flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(); }}>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={app.lang === "ar" ? "اسأل Souqi AI..." : "Ask Souqi AI..."} className="h-11" />
          <Button type="submit" size="lg" className="gap-1"><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </div>
  );
}
