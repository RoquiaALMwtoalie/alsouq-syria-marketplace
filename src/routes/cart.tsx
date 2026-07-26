import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag, Trash2, Plus, Minus } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useCreateOrder } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Cart — Souqi" }] }),
});

function CartPage() {
  const app = useApp();
  const t = useT();
  const createOrder = useCreateOrder();

  const results = useQueries({
    queries: app.cart.map((c) => ({
      queryKey: ["listing", c.id],
      queryFn: async () => {
        const { data, error } = await supabase.from("listings").select("id, title_ar, title_en, cover_url, price, owner_id").eq("id", c.id).maybeSingle();
        if (error) throw error;
        return data;
      },
    })),
  });

  const items = app.cart
    .map((c, i) => ({ ...c, item: results[i]?.data as { id: string; title_ar: string; title_en: string | null; cover_url: string | null; price: number; owner_id: string } | undefined }))
    .filter((x): x is typeof x & { item: NonNullable<typeof x["item"]> } => !!x.item);

  const total = items.reduce((s, x) => s + Number(x.item.price) * x.qty, 0);

  async function checkout() {
    if (!app.user) { toast.error(app.lang === "ar" ? "سجّل الدخول أولاً" : "Sign in first"); return; }
    for (const it of items) {
      await createOrder.mutateAsync({
        buyer_id: app.user.id,
        seller_id: it.item.owner_id,
        listing_id: it.item.id,
        total: Number(it.item.price) * it.qty,
        quantity: it.qty,
      });
    }
    app.clearCart();
    toast.success(app.lang === "ar" ? "تم إرسال طلبك!" : "Order placed!");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-black flex items-center gap-2"><ShoppingBag className="h-7 w-7 text-primary" /> {t("cart")}</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-card p-12 text-center shadow-card">
          <div className="text-lg font-semibold">{app.lang === "ar" ? "السلة فارغة" : "Your cart is empty"}</div>
          <Link to="/"><Button className="mt-4">{t("explore")}</Button></Link>
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-3">
            {items.map(({ id, qty, item }) => (
              <div key={id} className="rounded-2xl bg-card p-4 shadow-card flex items-center gap-4">
                <img src={item.cover_url || "https://placehold.co/80"} alt="" className="h-20 w-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold line-clamp-1">{app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar)}</div>
                  <div className="text-sm text-primary font-bold mt-1">{formatPrice(Number(item.price), app.currency, app.lang)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => app.addToCart(id)}><Plus className="h-3 w-3" /></Button>
                  <span className="w-6 text-center font-semibold">{qty}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => app.removeFromCart(id)}><Minus className="h-3 w-3" /></Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => app.removeFromCart(id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-card h-fit sticky top-32">
            <div className="flex justify-between text-sm"><span>{app.lang === "ar" ? "المجموع الفرعي" : "Subtotal"}</span><span>{formatPrice(total, app.currency, app.lang)}</span></div>
            <div className="flex justify-between text-sm mt-2"><span>{app.lang === "ar" ? "التوصيل" : "Delivery"}</span><span className="text-secondary font-semibold">{app.lang === "ar" ? "مجاني" : "Free"}</span></div>
            <div className="border-t mt-4 pt-4 flex justify-between font-black text-lg"><span>{app.lang === "ar" ? "الإجمالي" : "Total"}</span><span className="text-primary">{formatPrice(total, app.currency, app.lang)}</span></div>
            <Button size="lg" className="w-full mt-4 shadow-soft" onClick={checkout} disabled={createOrder.isPending}>
              {app.lang === "ar" ? "إتمام الشراء" : "Checkout"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
