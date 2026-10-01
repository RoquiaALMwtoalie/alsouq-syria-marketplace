// src/components/LeafletMap.tsx

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// ✅✅✅ [إضافة] استيراد CSS الخاص بـ Leaflet
// مهم: يجب أن يكون هنا وليس في styles.css العام
import "leaflet/dist/leaflet.css";

// ✅✅✅ [تحسين] استخدام الأيقونات المحلية بدل CDN خارجي
// هذا يقلل الطلبات الخارجية ويسرّع التحميل
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix marker icons (Vite bundling breaks default paths)
const icon = new L.Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    // ✅✅✅ [تحسين] استخدام flyTo بدل setView — انتقال سلس
    map.flyTo(center, map.getZoom(), { duration: 1 });
  }, [center, map]);
  return null;
}

export default function LeafletMap({
  center,
  onPick,
}: {
  center: [number, number];
  onPick: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer center={center} zoom={7} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={icon} />
      <ClickHandler onPick={onPick} />
      <Recenter center={center} />
    </MapContainer>
  );
}