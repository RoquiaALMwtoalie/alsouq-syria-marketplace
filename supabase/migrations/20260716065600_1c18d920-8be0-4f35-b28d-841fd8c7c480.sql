
-- 1. Extend profiles with store fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS store_name text,
  ADD COLUMN IF NOT EXISTS store_description text,
  ADD COLUMN IF NOT EXISTS store_phone text,
  ADD COLUMN IF NOT EXISTS store_logo_url text,
  ADD COLUMN IF NOT EXISTS store_cover_url text;

-- 2. Banners table (admin-managed homepage slider)
CREATE TABLE IF NOT EXISTS public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text NOT NULL,
  title_en text,
  subtitle_ar text,
  subtitle_en text,
  image_url text NOT NULL,
  link_url text,
  cta_label_ar text,
  cta_label_en text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.banners TO anon;
GRANT SELECT ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "banners_public_read" ON public.banners;
CREATE POLICY "banners_public_read" ON public.banners
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "banners_admin_all" ON public.banners;
CREATE POLICY "banners_admin_all" ON public.banners
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP TRIGGER IF EXISTS trg_banners_updated_at ON public.banners;
CREATE TRIGGER trg_banners_updated_at BEFORE UPDATE ON public.banners
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Reseed categories: remove restricted ones, insert new set
DELETE FROM public.categories
  WHERE slug IN ('supermarket','real-estate','cars','tourism','travel','farms','healthcare','pharmacy','property','vehicles');

INSERT INTO public.categories (slug, name_ar, name_en, icon, sort_order) VALUES
  ('fashion',      'أزياء',            'Fashion',        'shirt',        1),
  ('electronics',  'إلكترونيات',       'Electronics',    'smartphone',   2),
  ('home',         'منزل ومطبخ',       'Home & Kitchen', 'home',         3),
  ('clothing',     'ألبسة',            'Clothing',       'shirt',        4),
  ('shoes',        'أحذية',            'Shoes',          'footprints',   5),
  ('accessories',  'إكسسوارات',        'Accessories',    'watch',        6),
  ('beauty',       'مستحضرات تجميل',   'Beauty',         'sparkles',     7),
  ('books-music',  'كتب وموسيقى',      'Books & Music',  'book-open',    8),
  ('sports',       'رياضة',            'Sports',         'dumbbell',     9),
  ('toys',         'ألعاب',            'Toys',           'gamepad-2',   10),
  ('handmade',     'حرف يدوية',        'Handmade',       'palette',     11),
  ('services',     'خدمات',            'Services',       'wrench',      12),
  ('food',         'طعام',             'Food',           'utensils',    13)
ON CONFLICT (slug) DO UPDATE SET
  name_ar = EXCLUDED.name_ar,
  name_en = EXCLUDED.name_en,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order;

-- 4. Seed sample banners
INSERT INTO public.banners (title_ar, title_en, subtitle_ar, subtitle_en, image_url, cta_label_ar, cta_label_en, link_url, sort_order, active) VALUES
  ('عروض حصرية', 'Exclusive Deals', 'خصومات تصل إلى 50٪ على الإلكترونيات', 'Up to 50% off electronics', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1600&q=80', 'تسوّق الآن', 'Shop Now', '/category/electronics', 1, true),
  ('موضة الموسم', 'Season Fashion', 'أحدث صيحات الأزياء لعام 2026', 'Latest fashion trends 2026', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80', 'اكتشف', 'Discover', '/category/fashion', 2, true),
  ('منزلك أجمل', 'Beautiful Home', 'كل ما يحتاجه منزلك من مكان واحد', 'Everything for your home', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1600&q=80', 'اطّلع', 'Explore', '/category/home', 3, true)
ON CONFLICT DO NOTHING;
