import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { User, Heart, ShoppingCart, Calendar as CalendarIcon, Save } from "lucide-react";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useProfile, useUpdateProfile, useMyOrders, useMyBookings, useFavorites } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "@/components/ListingCard";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  head: () => ({ meta: [{ title: "Profile — Souqi" }] }),
});

function ProfilePage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();

  useEffect(() => {
    if (!app.authLoading && !app.user) navigate({ to: "/auth/$mode", params: { mode: "login" } });
  }, [app.authLoading, app.user, navigate]);

  const { data: profile } = useProfile(app.user?.id);
  const update = useUpdateProfile();
  const { data: orders = [] } = useMyOrders(app.user?.id);
  const { data: bookings = [] } = useMyBookings(app.user?.id);
  const { data: favs = [] } = useFavorites(app.user?.id);

  const [form, setForm] = useState({ full_name: "", phone: "", city: "", bio: "", avatar_url: "" });
  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      city: profile.city ?? "",
      bio: profile.bio ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
  }, [profile]);

  if (!app.user) return <div className="mx-auto max-w-5xl px-4 py-20 text-center text-muted-foreground">…</div>;

  async function save() {
    await update.mutateAsync({ id: app.user!.id, patch: form });
    toast.success(app.lang === "ar" ? "تم الحفظ" : "Saved");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl bg-card p-6 shadow-card flex items-center gap-4">
        <img src={form.avatar_url || `https://i.pravatar.cc/100?u=${app.user.id}`} alt="" className="h-20 w-20 rounded-full object-cover" />
        <div className="flex-1">
          <h1 className="text-2xl font-black">{form.full_name || app.user.name}</h1>
          <p className="text-sm text-muted-foreground">{app.user.email}</p>
          <div className="mt-2 flex gap-1">
            {app.roles.map((r) => <Badge key={r} variant="secondary" className="capitalize">{r}</Badge>)}
          </div>
        </div>
        <Button variant="outline" onClick={app.logout}>{t("logout")}</Button>
      </div>

      <Tabs defaultValue="edit" className="mt-8">
        <TabsList>
          <TabsTrigger value="edit"><User className="h-4 w-4 me-1" /> {t("profile")}</TabsTrigger>
          <TabsTrigger value="orders"><ShoppingCart className="h-4 w-4 me-1" /> {t("orders")}</TabsTrigger>
          <TabsTrigger value="bookings"><CalendarIcon className="h-4 w-4 me-1" /> {t("bookings")}</TabsTrigger>
          <TabsTrigger value="favorites"><Heart className="h-4 w-4 me-1" /> {t("favorites")}</TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-6">
          <div className="rounded-2xl bg-card p-6 shadow-card grid md:grid-cols-2 gap-4 max-w-3xl">
            <div><Label>{t("name")}</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></div>
            <div><Label>{t("phone")}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>{app.lang === "ar" ? "المدينة" : "City"}</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
            <div><Label>{app.lang === "ar" ? "رابط الصورة" : "Avatar URL"}</Label><Input value={form.avatar_url} onChange={(e) => setForm({ ...form, avatar_url: e.target.value })} /></div>
            <div className="md:col-span-2"><Label>{app.lang === "ar" ? "نبذة" : "Bio"}</Label><Textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} /></div>
            <div className="md:col-span-2"><Button onClick={save} disabled={update.isPending}><Save className="h-4 w-4 me-2" /> {t("save")}</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          {orders.length === 0 ? (
            <Empty msg={app.lang === "ar" ? "لا توجد طلبات." : "No orders."} />
          ) : (
            <div className="space-y-3">
              {orders.map((o: any) => (
                <div key={o.id} className="rounded-2xl bg-card p-4 shadow-card flex items-center gap-4">
                  <img src={o.listings?.cover_url || "https://placehold.co/64"} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold line-clamp-1">{app.lang === "ar" ? o.listings?.title_ar : (o.listings?.title_en || o.listings?.title_ar)}</div>
                    <div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-primary font-bold">{formatPrice(Number(o.total), app.currency, app.lang)}</div>
                  <Badge variant="outline" className="capitalize">{t(o.status)}</Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="bookings" className="mt-6">
          {bookings.length === 0 ? (
            <Empty msg={app.lang === "ar" ? "لا توجد حجوزات." : "No bookings."} />
          ) : (
            <div className="space-y-3">
              {bookings.map((b: any) => (
                <div key={b.id} className="rounded-2xl bg-card p-4 shadow-card flex items-center gap-4">
                  <img src={b.listings?.cover_url || "https://placehold.co/64"} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold line-clamp-1">{app.lang === "ar" ? b.listings?.title_ar : (b.listings?.title_en || b.listings?.title_ar)}</div>
                    <div className="text-xs text-muted-foreground">{new Date(b.starts_at).toLocaleString()}</div>
                  </div>
                  <div className="text-primary font-bold">{formatPrice(Number(b.total), app.currency, app.lang)}</div>
                  <Badge variant="outline" className="capitalize">{t(b.status)}</Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6">
          {favs.length === 0 ? (
            <Empty msg={app.lang === "ar" ? "لا توجد مفضلات." : "No favorites yet."} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {favs.map((f: any) => f.listings && <ListingCard key={f.listing_id} item={f.listings} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div className="rounded-2xl bg-card p-12 text-center shadow-card">
      <p className="text-muted-foreground">{msg}</p>
      <Link to="/"><Button className="mt-4">Explore</Button></Link>
    </div>
  );
}
