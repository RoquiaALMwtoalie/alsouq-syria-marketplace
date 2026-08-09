// src/components/distributor/OrderTrackingMap.tsx

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useApp } from "@/lib/i18n";

interface OrderTrackingMapProps {
  deliveryAddress: string;
  pickupAddress?: string;
  distributorLocation?: { lat: number; lng: number };
  order?: any;
}

export function OrderTrackingMap({ deliveryAddress, pickupAddress, distributorLocation, order }: OrderTrackingMapProps) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const [loading, setLoading] = useState(true);
  const [deliveryCoords, setDeliveryCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [pickupCoords, setPickupCoords] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // ✅ تحويل العناوين إلى إحداثيات
  useEffect(() => {
    const geocodeAddresses = async () => {
      if (!deliveryAddress && !pickupAddress) {
        setLoading(false);
        return;
      }

      try {
        const results: { delivery: { lat: number; lng: number } | null; pickup: { lat: number; lng: number } | null } = {
          delivery: null,
          pickup: null,
        };

        // ✅ تحويل عنوان التسليم
        if (deliveryAddress) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(deliveryAddress)}&limit=1`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            results.delivery = {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            };
          }
        }

        // ✅ تحويل عنوان الاستلام
        if (pickupAddress) {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupAddress)}&limit=1`
          );
          const data = await response.json();
          if (data && data.length > 0) {
            results.pickup = {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
            };
          }
        }

        // ✅ إذا ما لقى عنوان التسليم، استخدم موقع دمشق كافتراضي
        if (!results.delivery && !results.pickup) {
          const defaultCoords = { lat: 33.5138, lng: 36.2765 };
          results.delivery = defaultCoords;
        }

        setDeliveryCoords(results.delivery);
        setPickupCoords(results.pickup);

      } catch (error) {
        console.error("Error geocoding addresses:", error);
        const defaultCoords = { lat: 33.5138, lng: 36.2765 };
        setDeliveryCoords(defaultCoords);
        if (pickupAddress) setPickupCoords(defaultCoords);
      } finally {
        setLoading(false);
      }
    };

    geocodeAddresses();
  }, [deliveryAddress, pickupAddress]);

  // ✅ تحميل الخريطة
  useEffect(() => {
    if (loading || !deliveryCoords || !mapRef.current) return;

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

        // ✅ حساب مركز الخريطة (متوسط الإحداثيات)
        const centerLat = deliveryCoords.lat;
        const centerLng = deliveryCoords.lng;
        const zoomLevel = 14;

        // ✅ إنشاء الخريطة
        const map = L.map(mapRef.current!).setView([centerLat, centerLng], zoomLevel);
        
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
          maxZoom: 19,
        }).addTo(map);

        // ✅ إضافة التحكم في التكبير
        L.control.zoom({
          position: "bottomright",
        }).addTo(map);

        // ============================================================
        // 📍 ماركر: موقع التسليم (العميل)
        // ============================================================
        const deliveryIcon = L.divIcon({
          className: "custom-div-icon",
          html: `<div class="h-9 w-9 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg animate-bounce">
            🏠
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        L.marker([deliveryCoords.lat, deliveryCoords.lng], { icon: deliveryIcon })
          .addTo(map)
          .bindPopup(`
            <div class="text-sm font-medium">
              <span class="text-red-500">📍</span> ${isArabic ? 'موقع التسليم' : 'Delivery Location'}
              <br/>
              <span class="text-xs text-muted-foreground">${deliveryAddress}</span>
            </div>
          `)
          .openPopup();

        // ============================================================
        // 📍 ماركر: موقع الاستلام (البائع)
        // ============================================================
        if (pickupCoords) {
          const pickupIcon = L.divIcon({
            className: "custom-div-icon",
            html: `<div class="h-9 w-9 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg">
              🏪
            </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          });

          L.marker([pickupCoords.lat, pickupCoords.lng], { icon: pickupIcon })
            .addTo(map)
            .bindPopup(`
              <div class="text-sm font-medium">
                <span class="text-blue-500">📍</span> ${isArabic ? 'موقع الاستلام' : 'Pickup Location'}
                <br/>
                <span class="text-xs text-muted-foreground">${pickupAddress || ''}</span>
              </div>
            `);
        }

        // ============================================================
        // 📍 ماركر: موقع الموزع الحالي
        // ============================================================
        if (distributorLocation) {
          const distributorIcon = L.divIcon({
            className: "custom-div-icon",
            html: `<div class="h-9 w-9 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-sm font-bold shadow-lg animate-pulse">
              🚚
            </div>`,
            iconSize: [36, 36],
            iconAnchor: [18, 36],
          });

          L.marker([distributorLocation.lat, distributorLocation.lng], { icon: distributorIcon })
            .addTo(map)
            .bindPopup(`
              <div class="text-sm font-medium">
                <span class="text-emerald-500">🚚</span> ${isArabic ? 'موقعك الحالي' : 'Your Current Location'}
              </div>
            `);

          // ============================================================
          // 📍 رسم خط بين الموزع والوجهة مع المسافة
          // ============================================================
          const polyline = L.polyline(
            [[distributorLocation.lat, distributorLocation.lng], [deliveryCoords.lat, deliveryCoords.lng]],
            { 
              color: "#0d2e2a", 
              weight: 3, 
              opacity: 0.6, 
              dashArray: "8, 8" 
            }
          ).addTo(map);

          // ✅ حساب المسافة
          const distance = calculateDistance(
            distributorLocation.lat,
            distributorLocation.lng,
            deliveryCoords.lat,
            deliveryCoords.lng
          );
          
          if (distance) {
            const midLat = (distributorLocation.lat + deliveryCoords.lat) / 2;
            const midLng = (distributorLocation.lng + deliveryCoords.lng) / 2;
            
            // ✅ إضافة علامة المسافة
            L.marker([midLat, midLng], {
              icon: L.divIcon({
                className: "bg-white/95 dark:bg-slate-800/95 px-3 py-1 rounded-lg text-xs font-bold shadow-lg border border-slate-200 dark:border-slate-700",
                html: `🚗 ${distance < 1 ? (distance * 1000).toFixed(0) + ' م' : distance.toFixed(1) + ' كم'}`,
                iconSize: [80, 28],
                iconAnchor: [40, 14],
              })
            }).addTo(map);
          }

          // ============================================================
          // 📍 خط بين الموزع ومكان الاستلام (إذا موجود)
          // ============================================================
          if (pickupCoords) {
            const pickupDistance = calculateDistance(
              distributorLocation.lat,
              distributorLocation.lng,
              pickupCoords.lat,
              pickupCoords.lng
            );
            
            if (pickupDistance) {
              const midLat2 = (distributorLocation.lat + pickupCoords.lat) / 2;
              const midLng2 = (distributorLocation.lng + pickupCoords.lng) / 2;
              
              L.marker([midLat2, midLng2], {
                icon: L.divIcon({
                  className: "bg-white/95 dark:bg-slate-800/95 px-2 py-0.5 rounded-lg text-xs font-medium shadow-lg border border-blue-200 dark:border-blue-800",
                  html: `📦 ${pickupDistance < 1 ? (pickupDistance * 1000).toFixed(0) + ' م' : pickupDistance.toFixed(1) + ' كم'}`,
                  iconSize: [70, 22],
                  iconAnchor: [35, 11],
                })
              }).addTo(map);
            }
          }
        } else {
          // ============================================================
          // 📍 إذا ما في موقع موزع، ارسم خط بين التسليم والاستلام
          // ============================================================
          if (pickupCoords) {
            const distance = calculateDistance(
              pickupCoords.lat,
              pickupCoords.lng,
              deliveryCoords.lat,
              deliveryCoords.lng
            );
            
            const polyline = L.polyline(
              [[pickupCoords.lat, pickupCoords.lng], [deliveryCoords.lat, deliveryCoords.lng]],
              { color: "#2a655f", weight: 2, opacity: 0.4, dashArray: "5, 5" }
            ).addTo(map);

            if (distance) {
              const midLat = (pickupCoords.lat + deliveryCoords.lat) / 2;
              const midLng = (pickupCoords.lng + deliveryCoords.lng) / 2;
              
              L.marker([midLat, midLng], {
                icon: L.divIcon({
                  className: "bg-white/95 dark:bg-slate-800/95 px-3 py-1 rounded-lg text-xs font-medium shadow-lg border border-slate-200 dark:border-slate-700",
                  html: `📏 ${distance < 1 ? (distance * 1000).toFixed(0) + ' م' : distance.toFixed(1) + ' كم'}`,
                  iconSize: [80, 26],
                  iconAnchor: [40, 13],
                })
              }).addTo(map);
            }
          }
        }

        // ✅ إعادة حجم الخريطة
        setTimeout(() => map.invalidateSize(), 300);

        // ✅ تنظيف الخريطة عند الإزالة
        return () => {
          map.remove();
        };

      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    initMap();
  }, [loading, deliveryCoords, pickupCoords, deliveryAddress, pickupAddress, distributorLocation]);

  // ✅ حساب المسافة بين نقطتين (هافرسين)
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

  if (!deliveryCoords) {
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