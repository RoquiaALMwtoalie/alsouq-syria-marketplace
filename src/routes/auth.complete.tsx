import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, User as UserIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";

export const Route = createFileRoute("/auth/complete")({
  component: CompleteProfilePage,
  head: () => ({ meta: [{ title: "أكمل ملفك — السوق اليك" }] }),
});

function CompleteProfilePage() {
  const app = useApp();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState<PickedLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.replace("/auth/login");
        return;
      }
      
      const [{ data: profile }, { data: addressRows }] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name, phone, address_text")
          .eq("id", userData.user.id)
          .maybeSingle(),
        supabase
          .from("user_addresses" as any)
          .select("address_text")
          .eq("user_id", userData.user.id)
          .eq("is_default", true)
          .maybeSingle(),
      ]);

      const hasStoredAddress = Boolean(profile?.address_text?.trim() || addressRows?.address_text?.trim());

      if (profile?.full_name?.trim() && profile?.phone?.trim() && hasStoredAddress) {
        window.location.replace("/");
        return;
      }
      
      const [{ data: p }, { data: roleRows }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone").eq("id", userData.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userData.user.id),
      ]);
      if (p?.full_name) setFullName(p.full_name);
      if (p?.phone) setPhone(p.phone);
      setIsAdmin((roleRows ?? []).some((r) => r.role === "admin"));
      setChecking(false);
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) { toast.error(app.lang === "ar" ? "الاسم الكامل مطلوب" : "Full name required"); return; }
    if (!phone.trim()) { toast.error(app.lang === "ar" ? "رقم الهاتف مطلوب" : "Phone required"); return; }
    if (!isAdmin && (!location || !location.label.trim() || !location.address.trim() || !location.details.trim())) {
      toast.error(app.lang === "ar" ? "أكمل بيانات العنوان (الاسم، العنوان، الوصف)" : "Complete address (name, address, description)");
      return;
    }
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error("Not signed in");

      const profilePatch: any = { id: uid, full_name: fullName.trim(), phone: phone.trim() };
      if (!isAdmin && location) {
        profilePatch.address_text = location.address;
        profilePatch.address_details = location.details;
        profilePatch.lat = location.lat;
        profilePatch.lng = location.lng;
      }
      await supabase.from("profiles").upsert(profilePatch, { onConflict: "id" });

      if (!isAdmin && location) {
        const { data: existingAddress } = await supabase
          .from("user_addresses" as any)
          .select("id")
          .eq("user_id", uid)
          .eq("is_default", true)
          .maybeSingle();

        const addressPayload = {
          user_id: uid,
          label: location.label.trim(),
          address_text: location.address,
          details: location.details,
          lat: location.lat,
          lng: location.lng,
          is_default: true,
        };

        if (existingAddress?.id) {
          await supabase.from("user_addresses" as any).update(addressPayload).eq("id", existingAddress.id);
        } else {
          await supabase.from("user_addresses" as any).insert(addressPayload as any);
        }
      }

      toast.success(app.lang === "ar" ? "تم إكمال ملفك" : "Profile completed");
      
      // ✅ استخدم window.location.replace بدلاً من nav
      window.location.replace(isAdmin ? "/dashboard" : "/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary/80 to-accent" />
      <div className="min-h-[calc(100vh-140px)] grid place-items-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="text-center text-white mb-6">
            <div className="inline-flex items-center gap-2">
              <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur grid place-items-center font-black text-xl">س</div>
              <div className="font-black text-2xl">{app.lang === "ar" ? "السوق اليك" : "AlSooq Elak"}</div>
            </div>
            <div className="mt-2 text-sm text-white/85">
              {app.lang === "ar" ? "خطوة أخيرة لإكمال حسابك" : "One last step to complete your account"}
            </div>
          </div>

          <div className="rounded-3xl border border-white/25 bg-white/15 backdrop-blur-2xl shadow-2xl p-6 md:p-8 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">{app.lang === "ar" ? "أكمل بياناتك" : "Complete your profile"}</h2>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <p className="text-white/80 text-sm mt-1">
              {isAdmin
                ? (app.lang === "ar" ? "الاسم والهاتف فقط مطلوبان للأدمن." : "Admins only need name and phone.")
                : (app.lang === "ar" ? "الاسم والهاتف والعنوان مطلوبة لتفعيل الطلبات." : "Name, phone and address are required to enable orders.")}
            </p>

            <form className="space-y-3 mt-5" onSubmit={handleSubmit}>
              <div>
                <Label className="text-xs font-semibold text-white/90 flex items-center gap-1"><UserIcon className="h-3.5 w-3.5" /> {app.lang === "ar" ? "الاسم الكامل *" : "Full name *"}</Label>
                <Input className="mt-1 h-11 bg-white/90 text-foreground border-0" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <Label className="text-xs font-semibold text-white/90 flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {app.lang === "ar" ? "رقم الهاتف *" : "Phone *"}</Label>
                <Input className="mt-1 h-11 bg-white/90 text-foreground border-0" type="tel" dir="ltr" placeholder="+9639..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>

              {!isAdmin && (
                <div className="rounded-xl bg-white/90 text-foreground p-3">
                  <AddressPicker value={location ?? undefined} onChange={setLocation} lang={app.lang} />
                </div>
              )}

              <Button type="submit" size="lg" className="w-full h-11 bg-accent text-accent-foreground hover:opacity-90 shadow-lg" disabled={loading}>
                {loading ? "…" : (app.lang === "ar" ? "حفظ ومتابعة" : "Save & continue")}
              </Button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}