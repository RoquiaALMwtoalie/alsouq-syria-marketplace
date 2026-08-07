// src/components/distributor/OrderTrackingMap.tsx

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface OrderTrackingMapProps {
  deliveryAddress: string;
  pickupAddress?: string;
  distributorLocation?: { lat: number; lng: number };
  order?: any;
}

export function OrderTrackingMap({ deliveryAddress, pickupAddress, distributorLocation, order }: OrderTrackingMapProps) {
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // ✅ تحويل العنوان إلى إحداثيات باستخدام Nominatim (مجاني)
  useEffect(() => {
    const geocodeAddress = async () => {
      if (!deliveryAddress) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(deliveryAddress)}&limit=1`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
          setCoordinates({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
        } else {
          // ✅ إذا ما لقى العنوان، استخدم موقع دمشق كافتراضي
          setCoordinates({ lat: 33.5138, lng: 36.2765 });
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
        setCoordinates({ lat: 33.5138, lng: 36.2765 });
      } finally {
        setLoading(false);
      }
    };

    geocodeAddress();
  }, [deliveryAddress]);

  // ✅ تحميل الخريطة
  useEffect(() => {
    if (loading || !coordinates || !mapRef.current) return;

    const initMap = async () => {
      try {
        // ✅ تحميل Leaflet dynamically
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        // ✅ إصلاح مشكلة الأيقونات
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        // ✅ إنشاء الخريطة
        const map = L.map(mapRef.current!).setView([coordinates.lat, coordinates.lng], 14);
        
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);

        // ✅ ماركر للعنوان
        const deliveryIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div class="h-8 w-8 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg">
            📍
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });

        L.marker([coordinates.lat, coordinates.lng], { icon: deliveryIcon })
          .addTo(map)
          .bindPopup(`📍 ${deliveryAddress}`)
          .openPopup();

        // ✅ ماركر لموقع الموزع (إذا موجود)
        if (distributorLocation) {
          const distributorIcon = L.divIcon({
            className: "custom-div-icon",
            html: `<div class="h-8 w-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse">
              🚚
            </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          });

          L.marker([distributorLocation.lat, distributorLocation.lng], { icon: distributorIcon })
            .addTo(map)
            .bindPopup("📍 موقعك الحالي");
        }

        // ✅ رسم خط بين الموزع والوجهة
        if (distributorLocation) {
          const polyline = L.polyline(
            [[distributorLocation.lat, distributorLocation.lng], [coordinates.lat, coordinates.lng]],
            { color: "#0d2e2a", weight: 3, opacity: 0.7, dashArray: "8, 8" }
          ).addTo(map);

          // ✅ عرض المسافة
          const distance = calculateDistance(
            distributorLocation.lat,
            distributorLocation.lng,
            coordinates.lat,
            coordinates.lng
          );
          
          if (distance) {
            const midLat = (distributorLocation.lat + coordinates.lat) / 2;
            const midLng = (distributorLocation.lng + coordinates.lng) / 2;
            
            L.marker([midLat, midLng], {
              icon: L.divIcon({
                className: "bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-lg text-xs font-medium shadow-lg border border-slate-200 dark:border-slate-700",
                html: `🚗 ${distance.toFixed(1)} كم`,
                iconSize: [70, 20],
                iconAnchor: [35, 10],
              })
            }).addTo(map);
          }
        }

        // ✅ إعادة حجم الخريطة
        setTimeout(() => map.invalidateSize(), 200);

        return () => {
          map.remove();
        };
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    initMap();
  }, [loading, coordinates, deliveryAddress, distributorLocation]);

  // ✅ حساب المسافة بين نقطتين
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (loading) {
    return (
      <div className="w-full h-64 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-[#0d2e2a]" />
          <p className="text-sm text-muted-foreground">{isArabic ? "جاري تحميل الخريطة..." : "Loading map..."}</p>
        </div>
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div className="w-full h-64 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          {isArabic ? "لا يمكن عرض الخريطة" : "Cannot display map"}
        </p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-64 rounded-xl overflow-hidden" />;
}