import { lazy, Suspense, useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientOnly } from "@tanstack/react-router";

const LeafletMap = lazy(() => import("./LeafletMap"));

export type PickedLocation = {
  lat: number;
  lng: number;
  address: string;
  details: string;
  label: string;
};

// Approximate center of Syria
const DEFAULT_CENTER: [number, number] = [34.8021, 38.9968];

export function AddressPicker({
  value,
  onChange,
  lang = "ar",
  showLabel = true,
  showDetails = true,  // ← ✅ إضافة هذا
}: {
  value?: Partial<PickedLocation>;
  onChange: (v: PickedLocation) => void;
  lang?: "ar" | "en";
  showLabel?: boolean;
  showDetails?: boolean;  // ← ✅ إضافة هذا
}) {
  // ===== State =====
  const [label, setLabel] = useState(value?.label ?? "");
  const [details, setDetails] = useState(value?.details ?? "");
  const [address, setAddress] = useState(value?.address ?? "");
  const [pos, setPos] = useState<[number, number]>(
    value?.lat && value?.lng ? [value.lat, value.lng] : DEFAULT_CENTER
  );
  const [busy, setBusy] = useState(false);

  // ✅ مزامنة الـ state مع value عند التغيير من الخارج
  useEffect(() => {
    if (value) {
      if (value.label !== undefined && value.label !== label) {
        setLabel(value.label);
      }
      if (value.details !== undefined && value.details !== details) {
        setDetails(value.details);
      }
      if (value.address !== undefined && value.address !== address) {
        setAddress(value.address);
      }
      if (value.lat && value.lng) {
        setPos([value.lat, value.lng]);
      }
    }
  }, [value]);

  function emit(next: Partial<PickedLocation>) {
    onChange({
      lat: next.lat ?? pos[0],
      lng: next.lng ?? pos[1],
      address: next.address ?? address,
      details: next.details ?? details,
      label: next.label ?? label,
    });
  }

  async function reverseGeocode(lat: number, lng: number) {
    try {
      setBusy(true);
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=${lang}`
      );
      const j = await r.json();
      const addr = j.display_name ?? `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      setAddress(addr);
      emit({ lat, lng, address: addr });
    } catch {
      emit({ lat, lng, address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
    } finally {
      setBusy(false);
    }
  }

  function useMyLocation() {
    if (!("geolocation" in navigator)) return;
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const next: [number, number] = [p.coords.latitude, p.coords.longitude];
        setPos(next);
        reverseGeocode(next[0], next[1]);
      },
      () => setBusy(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div className="space-y-2">
      {showLabel && (
        <div>
          <Label className="text-sm">
            {lang === "ar" ? "اسم العنوان *" : "Address name *"}
          </Label>
          <Input
            value={label}
            onChange={(e) => { 
              setLabel(e.target.value); 
              emit({ label: e.target.value }); 
            }}
            placeholder={lang === "ar" ? "مثلاً: المنزل، العمل" : "e.g. Home, Work"}
            className="mt-1"
          />
        </div>
      )}
      
      <Label className="flex items-center gap-1 text-sm">
        <MapPin className="h-4 w-4" /> {lang === "ar" ? "الموقع على الخريطة" : "Location on map"}
      </Label>
      
      <div className="rounded-xl overflow-hidden border h-56">
        <ClientOnly fallback={<div className="h-full w-full grid place-items-center bg-muted text-muted-foreground text-sm">Loading map…</div>}>
          <Suspense fallback={<div className="h-full w-full grid place-items-center bg-muted"><Loader2 className="h-5 w-5 animate-spin" /></div>}>
            <LeafletMap
              center={pos}
              onPick={(lat, lng) => {
                setPos([lat, lng]);
                reverseGeocode(lat, lng);
              }}
            />
          </Suspense>
        </ClientOnly>
      </div>
      
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={useMyLocation} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (lang === "ar" ? "موقعي الحالي" : "Use my location")}
        </Button>
        <div className="text-xs text-muted-foreground self-center">
          {lang === "ar" ? "اضغط على الخريطة لتحديد الموقع" : "Tap the map to set location"}
        </div>
      </div>
      
      <Input
        value={address}
        onChange={(e) => { 
          setAddress(e.target.value); 
          emit({ address: e.target.value }); 
        }}
        placeholder={lang === "ar" ? "العنوان *" : "Address *"}
      />
      
      {/* ✅ حقل الوصف التفصيلي - يظهر فقط إذا showDetails = true */}
      {showDetails && (
        <div>
          <Input
            value={details}
            onChange={(e) => { 
              setDetails(e.target.value); 
              emit({ details: e.target.value }); 
            }}
            placeholder={lang === "ar" ? "وصف تفصيلي * (شارع، بناء، طابق، علامة مميزة...)" : "Detailed description * (street, building, floor, landmark…)"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "ar"
              ? "📍 كلما كان الوصف أدق، وصل الطلب أسرع وأسهل. اذكر أقرب علامة مميزة."
              : "📍 The more precise your description, the faster and easier delivery gets. Mention the nearest landmark."}
          </p>
        </div>
      )}
    </div>
  );
}