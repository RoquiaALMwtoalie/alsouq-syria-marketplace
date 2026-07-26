// src/routes/category/$slug.tsx
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import { SlidersHorizontal, X, Store, Package, Star, ChevronDown, Check } from "lucide-react";
import { useApp, useT } from "@/lib/i18n";
import { useGovernorates, useListings, useStoresByCategory, useCategories } from "@/lib/queries";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

// ✅ Dropdown مخصص للترتيب
function SortDropdown({ value, onChange, lang }: { value: string; onChange: (val: string) => void; lang: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = [
    { value: 'popularity', label: lang === 'ar' ? 'الأكثر رواجاً' : 'Most Popular', icon: '⭐' },
    { value: 'newest', label: lang === 'ar' ? 'الواصل حديثاً' : 'New Arrivals', icon: '🆕' },
    { value: 'price_low', label: lang === 'ar' ? 'السعر: من الأقل' : 'Price: Low to High', icon: '💰' },
    { value: 'price_high', label: lang === 'ar' ? 'السعر: من الأعلى' : 'Price: High to Low', icon: '💰' },
    { value: 'discount', label: lang === 'ar' ? 'أكبر خصم' : 'Biggest Discount', icon: '🏷️' },
    { value: 'rating', label: lang === 'ar' ? 'الأعلى تقييماً' : 'Highest Rated', icon: '⭐' },
  ];

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-200 min-w-[170px]
          ${isOpen 
            ? 'border-blue-500 bg-white dark:bg-[#1e293b] shadow-lg shadow-blue-500/10' 
            : 'border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-[#1e293b] hover:border-blue-400/50'
          }
        `}
      >
        <span className="text-base leading-none">{selectedOption.icon}</span>
        <span className="flex-1 text-start truncate">{selectedOption.label}</span>
        <ChevronDown className={`
          h-4 w-4 text-muted-foreground transition-transform duration-200 flex-shrink-0
          ${isOpen ? 'rotate-180' : ''}
        `} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="py-1.5">
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full px-4 py-2.5 text-sm text-start flex items-center gap-3 transition-colors duration-150
                    ${isSelected 
                      ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                    }
                  `}
                >
                  <span className="text-base leading-none w-6 text-center">{option.icon}</span>
                  <span className="flex-1 font-medium">{option.label}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryPage() {
  const { slug } = Route.useParams();
  const app = useApp();
  const t = useT();
  const { data: govs = [] } = useGovernorates();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const searchParams = Route.useSearch() as { q?: string; gov?: string } | undefined;

  const [tab, setTab] = useState<"products" | "stores">("products");
  const [gov, setGov] = useState<string>(searchParams?.gov ?? "all");
  const [sort, setSort] = useState<"popularity" | "newest" | "price_low" | "price_high" | "discount" | "rating">("popularity");
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState(searchParams?.q ?? "");

  // ✅ جلب بيانات التصنيف من قاعدة البيانات
  const category = useMemo(() => {
    return categories.find((c: any) => c.slug === slug);
  }, [categories, slug]);

  useEffect(() => {
    setSearch(searchParams?.q ?? "");
    setGov(searchParams?.gov ?? "all");
  }, [searchParams?.q, searchParams?.gov]);

  const isOffersPage = slug === "offers";

  const { data: rows = [], isLoading } = useListings({
    categorySlug: isOffersPage ? undefined : slug,
    isOffer: isOffersPage ? true : undefined,
    governorateSlug: gov === "all" ? undefined : gov,
    sort: sort === "popularity" ? "popular" : 
          sort === "newest" ? "recent" :
          sort === "price_low" ? "cheapest" :
          sort === "price_high" ? "price_high" :
          sort === "discount" ? "discount" :
          "rating",
    search: search || undefined,
  });
  
  const { data: stores = [], isLoading: storesLoading } = useStoresByCategory(isOffersPage ? undefined : slug);

  const items = useMemo(() => rating > 0 ? rows.filter((r) => Number(r.rating) >= rating) : rows, [rows, rating]);

  const Filters = (
    <div className="space-y-6">
      <div>
        <div className="font-semibold mb-2 text-sm">{app.lang === "ar" ? "بحث" : "Search"}</div>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("search_placeholder")} />
      </div>
      <div>
        <div className="font-semibold mb-2 text-sm">{app.lang === "ar" ? "المحافظة" : "Governorate"}</div>
        <Select value={gov} onValueChange={setGov}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-80">
            <SelectItem value="all">{t("all_governorates")}</SelectItem>
            {govs.map((g) => <SelectItem key={g.id} value={g.slug}>{app.lang === "ar" ? g.name_ar : g.name_en}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <div className="font-semibold mb-2 text-sm">{t("rating")}</div>
        <div className="space-y-2">
          {[0, 3, 4, 4.5].map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <Checkbox checked={rating === r} onCheckedChange={() => setRating(r)} />
              {r === 0 ? (app.lang === "ar" ? "الكل" : "All") : `${r}+ ★`}
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  // ✅ إذا كان التحميل جاري
  if (categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // ✅ إذا التصنيف غير موجود
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          {app.lang === "ar" ? "التصنيف غير موجود" : "Category not found"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {app.lang === "ar" ? "عذراً، التصنيف الذي تبحث عنه غير موجود" : "Sorry, the category you're looking for doesn't exist"}
        </p>
        <Link to="/">
          <Button className="rounded-xl">
            {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </Link>
      </div>
    );
  }

  // ✅ جلب الأيقونة من قاعدة البيانات
  const Icon = getCategoryIcon(category.icon);
  const categoryName = app.lang === "ar" ? category.name_ar : category.name_en;
  const categoryImage = category.image_url;

  return (
    <div>
      {/* ===== Header - من قاعدة البيانات ===== */}
      <div className="relative h-56 md:h-80 overflow-hidden">
        {categoryImage ? (
          <img 
            src={categoryImage} 
            className="absolute inset-0 h-full w-full object-cover scale-105" 
            alt={categoryName} 
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600`} />
        )}
        <div className={`absolute inset-0 bg-gradient-to-br from-primary/70 to-primary/40 opacity-70 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-7xl px-4 w-full pb-8 text-primary-foreground">
            <div className="text-sm opacity-90">
              <Link to="/" className="hover:underline">{t("home")}</Link> / {categoryName}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-5xl font-black drop-shadow-lg">{categoryName}</h1>
            </div>
            <div className="opacity-90 mt-1">
              {tab === "products" ? `${items.length} ${t("results")}` : `${stores.length} ${t("stores_tab")}`}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tabs ===== */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 flex gap-2">
          {([
            { id: "products" as const, icon: Package, label: t("products_tab") },
            { id: "stores" as const, icon: Store, label: t("stores_tab") },
          ]).map((tItem) => (
            <button key={tItem.id} onClick={() => setTab(tItem.id)}
              className={`flex items-center gap-2 px-4 py-3 -mb-px border-b-2 font-semibold text-sm transition ${tab === tItem.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
              <tItem.icon className="h-4 w-4" /> {tItem.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== Content ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6 grid lg:grid-cols-[280px_1fr] gap-6">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-2xl bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold">{t("filters")}</div>
              <Button variant="ghost" size="sm" onClick={() => { setGov("all"); setRating(0); setSearch(""); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {Filters}
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-between gap-3 mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> {t("filters")}
                </Button>
              </SheetTrigger>
              <SheetContent side={app.lang === "ar" ? "right" : "left"} className="w-80 overflow-auto">
                <SheetTitle>{t("filters")}</SheetTitle>
                <div className="mt-4">{Filters}</div>
              </SheetContent>
            </Sheet>
            
            {tab === "products" && (
              <div className="flex items-center gap-2 ms-auto">
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {app.lang === "ar" ? "ترتيب حسب:" : "Sort by:"}
                </span>
                <SortDropdown
                  value={sort}
                  onChange={(val) => setSort(val as any)}
                  lang={app.lang}
                />
              </div>
            )}
          </div>

          {tab === "products" ? (
            isLoading ? (
              <div className="rounded-2xl bg-card p-12 text-center shadow-card text-muted-foreground">جاري التحميل...</div>
            ) : items.length === 0 ? (
              <EmptyBlock title={app.lang === "ar" ? "لا توجد نتائج" : "No results"} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((i) => <ListingCard key={i.id} item={i} />)}
              </div>
            )
          ) : (
            storesLoading ? (
              <div className="rounded-2xl bg-card p-12 text-center shadow-card text-muted-foreground">جاري التحميل...</div>
            ) : stores.length === 0 ? (
              <EmptyBlock title={app.lang === "ar" ? "لا يوجد متاجر بعد" : "No stores yet"} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {stores.map((s) => (
                  <Link key={s.id} to="/store/$id" params={{ id: s.id }}
                    className="group rounded-2xl bg-card shadow-card overflow-hidden card-hover">
                    <div className="relative h-32 bg-gradient-to-br from-primary to-primary-glow">
                      {s.store_cover_url && <img src={s.store_cover_url} className="absolute inset-0 h-full w-full object-cover" alt="" />}
                    </div>
                    <div className="p-4 -mt-8 relative">
                      <div className="h-14 w-14 rounded-xl bg-card border-4 border-card shadow-md overflow-hidden grid place-items-center text-primary font-black text-xl">
                        {s.store_logo_url || s.avatar_url ? (
                          <img src={s.store_logo_url || s.avatar_url!} className="h-full w-full object-cover" alt="" />
                        ) : ((s.store_name || s.full_name || "?")[0])}
                      </div>
                      <div className="mt-2 font-bold line-clamp-1">{s.store_name || s.full_name || (app.lang === "ar" ? "متجر" : "Store")}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                        {s.store_description || (app.lang === "ar" ? "متجر على سوقي" : "A store on Souqi")}
                      </div>
                      <div className="flex items-center gap-3 mt-3 text-xs">
                        <span className="flex items-center gap-1 text-accent"><Star className="h-3.5 w-3.5 fill-current" />{s.avg_rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">{s.listing_count} {t("products_tab")}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyBlock({ title }: { title: string }) {
  const app = useApp();
  return (
    <div className="rounded-2xl bg-card p-12 text-center shadow-card">
      <div className="text-lg font-semibold">{title}</div>
      <p className="text-muted-foreground text-sm mt-1">{app.lang === "ar" ? "جرّب تعديل الفلاتر" : "Try changing your filters"}</p>
    </div>
  );
}