// src/components/dashboard/ReviewsPage.tsx
import { Star } from "lucide-react";
import { useApp, useT } from "@/lib/i18n";
import { useSellerReviews } from "@/lib/queries";

export function ReviewsPage() {
  const app = useApp();
  const t = useT();
  const { data: rows = [], isLoading } = useSellerReviews(app.user?.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-black">{app.lang === "ar" ? "التقييمات" : "Reviews"}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {app.lang === "ar" ? "تقييمات العملاء لمنتجاتك." : "Customer reviews for your products."}
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {isLoading && (
          <div className="rounded-2xl bg-card p-8 text-center text-muted-foreground md:col-span-2 shadow-lg border border-border/30">
            جار التحميل...
          </div>
        )}
        {!isLoading && rows.length === 0 && (
          <div className="rounded-2xl bg-card p-12 text-center text-muted-foreground md:col-span-2 shadow-lg border border-border/30">
            <Star className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
            {app.lang === "ar" ? "لا توجد تقييمات بعد." : "No reviews yet."}
          </div>
        )}
        {rows.map((review: any) => (
          <div key={review.id} className="rounded-2xl bg-card p-5 shadow-lg border border-border/30 hover:shadow-xl transition">
            <div className="flex items-center gap-3">
              <img
                src={review.profile?.avatar_url || review.listing?.cover_url || "/placeholder.svg"}
                className="h-12 w-12 rounded-full object-cover border"
                alt=""
              />
              <div>
                <div className="font-semibold">
                  {review.profile?.full_name || (app.lang === "ar" ? "عميل" : "Customer")}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < Number(review.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {review.comment || (app.lang === "ar" ? "بدون تعليق" : "No comment")}
            </p>
            <p className="mt-2 text-xs text-primary font-medium">
              {app.lang === "ar" ? review.listing?.title_ar : (review.listing?.title_en || review.listing?.title_ar)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}