// src/types/delivery.ts

export interface DeliveryCompany {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  logo_url: string | null;
  cover_url: string | null;
  description_ar: string | null;
  description_en: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  address_ar: string | null;
  address_en: string | null;
  governorate_id: string | null;
  rating: number;
  reviews_count: number;
  has_tracking: boolean;
  has_insurance: boolean;
  has_cod: boolean;
  has_express: boolean;
  base_price: number;
  price_per_km: number;
  free_delivery_threshold: number;
  min_delivery_fee: number;
  max_delivery_fee: number;
  coverage_areas: string[];
  avg_delivery_time: number;
  is_active: boolean;
  is_featured: boolean;
  featured_sort: number;
  created_at: string;
  updated_at: string;
}

// src/types/delivery.ts

export interface Distributor {
  id: string;
  user_id: string | null;  // ✅ تأكد من هذا
  full_name_ar: string;
  full_name_en: string | null;
  phone: string;
  email: string | null;
  avatar_url: string | null;
  address_ar: string | null;
  address_en: string | null;
  governorate_id: string | null;
  latitude: number | null;
  longitude: number | null;
  rating: number;
  reviews_count: number;
  completed_orders: number;
  is_active: boolean;
  is_available: boolean;
  delivery_company_id: string | null;
  distributor_type: 'freelance' | 'company_employee';
  created_at: string;
  updated_at: string;
}

export interface DeliveryOrder {
  id: string;
  order_id: string;
  delivery_company_id: string;
  distributor_id: string | null;
  pickup_address: string | null;
  pickup_latitude: number | null;
  pickup_longitude: number | null;
  pickup_phone: string | null;
  pickup_name: string | null;
  delivery_address: string | null;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  delivery_phone: string | null;
  delivery_name: string | null;
  status: 'pending' | 'assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled' | 'failed';
  delivery_fee: number;
  cod_amount: number;
  tracking_number: string | null;
  tracking_url: string | null;
  scheduled_pickup_at: string | null;
  scheduled_delivery_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  notes_ar: string | null;
  notes_en: string | null;
  distributor_rating: number | null;
  distributor_review: string | null;
  created_at: string;
  updated_at: string;
}

// ✅ وظيفة حساب تكلفة التوصيل
export function calculateDeliveryFee(
  company: DeliveryCompany,
  distance: number,
  orderTotal: number
): number {
  // 1️⃣ إذا الطلب أكبر من الحد الأدنى للتوصيل المجاني
  if (
    company.free_delivery_threshold > 0 && 
    orderTotal >= company.free_delivery_threshold
  ) {
    return 0;
  }

  // 2️⃣ حساب السعر: الأساسي + (المسافة × السعر لكل كيلو)
  let fee = company.base_price + (distance * company.price_per_km);

  // 3️⃣ الحد الأدنى والأقصى
  if (fee < company.min_delivery_fee) fee = company.min_delivery_fee;
  if (fee > company.max_delivery_fee) fee = company.max_delivery_fee;

  return Math.round(fee * 100) / 100;
}