import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, c as cn } from "./router-BU7AgYzK.mjs";
import "../_libs/sonner.mjs";
import { an as FileText, t as Users, e as CircleCheckBig, i as ShoppingBag, Q as CreditCard, m as Truck, cr as Lock, _ as CircleAlert, Z as Zap, cy as Scale, as as Mail } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./client-DEhnCGNP.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/react-intersection-observer.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function TermsPage() {
  const app = useApp();
  const isRTL = app.lang === "ar";
  const sections = [{
    id: "intro",
    icon: FileText,
    title: isRTL ? "مقدمة" : "Introduction",
    content: isRTL ? `مرحباً بك في ${app.brand || "منصتنا"}. باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل استخدام التطبيق.` : `Welcome to ${app.brand || "our platform"}. By using this application, you agree to comply with the following terms and conditions. Please read them carefully before using the application.`
  }, {
    id: "account",
    icon: Users,
    title: isRTL ? "الحساب والتسجيل" : "Account & Registration",
    content: isRTL ? `• يجب أن تقدم معلومات صحيحة وكاملة عند إنشاء الحساب.
• أنت المسؤول الوحيد عن الحفاظ على سرية بيانات حسابك.
• لا يجوز مشاركة حسابك مع أي شخص آخر.
• نحتفظ بالحق في تعليق أو حذف أي حساب يخالف هذه الشروط.` : `• You must provide accurate and complete information when creating an account.
• You are solely responsible for maintaining the confidentiality of your account data.
• You may not share your account with any other person.
• We reserve the right to suspend or delete any account that violates these terms.`
  }, {
    id: "usage",
    icon: CircleCheckBig,
    title: isRTL ? "الاستخدام المقبول" : "Acceptable Use",
    content: isRTL ? `• يجب استخدام التطبيق للأغراض القانونية فقط.
• يحظر نشر أي محتوى غير لائق أو مسيء أو مخالف للقوانين.
• لا يجوز استغلال التطبيق لأي نشاط غير مشروع.
• نحتفظ بالحق في اتخاذ الإجراءات القانونية ضد أي مخالفة.` : `• The application must be used for legal purposes only.
• It is prohibited to post any inappropriate, offensive, or illegal content.
• The application may not be exploited for any illegal activity.
• We reserve the right to take legal action against any violation.`
  }, {
    id: "products",
    icon: ShoppingBag,
    title: isRTL ? "المنتجات والخدمات" : "Products & Services",
    content: isRTL ? `• نسعى لعرض معلومات دقيقة عن المنتجات والخدمات.
• نحتفظ بالحق في تعديل الأسعار في أي وقت.
• لا نضمن توفر جميع المنتجات طوال الوقت.
• الصور المعروضة قد تختلف عن المنتج الفعلي.` : `• We strive to display accurate information about products and services.
• We reserve the right to modify prices at any time.
• We do not guarantee the availability of all products at all times.
• Displayed images may differ from the actual product.`
  }, {
    id: "orders",
    icon: CreditCard,
    title: isRTL ? "الطلبات والدفع" : "Orders & Payment",
    content: isRTL ? `• يتم تأكيد الطلب بعد إتمام عملية الدفع.
• نقبل طرق الدفع المتاحة في التطبيق.
• يمكن إلغاء الطلب خلال 30 دقيقة من تقديمه.
• في حال وجود مشكلة في الطلب، يرجى التواصل مع الدعم.` : `• The order is confirmed after completing the payment process.
• We accept the payment methods available in the application.
• Orders can be canceled within 30 minutes of placement.
• If there is an issue with the order, please contact support.`
  }, {
    id: "delivery",
    icon: Truck,
    title: isRTL ? "الشحن والتوصيل" : "Shipping & Delivery",
    content: isRTL ? `• نوفر خدمة التوصيل إلى المناطق المحددة.
• أنت مسؤول عن توفير عنوان صحيح للتوصيل.
• قد يتأخر التوصيل بسبب ظروف خارجة عن إرادتنا.
• يرجى التواصل مع الدعم في حال تأخر الطلب.` : `• We provide delivery service to specified areas.
• You are responsible for providing a correct delivery address.
• Delivery may be delayed due to circumstances beyond our control.
• Please contact support if the order is delayed.`
  }, {
    id: "intellectual",
    icon: Lock,
    title: isRTL ? "الملكية الفكرية" : "Intellectual Property",
    content: isRTL ? `• جميع المحتويات في التطبيق محمية بحقوق النشر.
• لا يجوز نسخ أو استخدام أي محتوى دون إذن مسبق.
• العلامات التجارية والاسم التجاري مملوكة للمنصة.` : `• All content in the application is protected by copyright.
• No content may be copied or used without prior permission.
• Trademarks and trade name are owned by the platform.`
  }, {
    id: "disclaimer",
    icon: CircleAlert,
    title: isRTL ? "إخلاء المسؤولية" : "Disclaimer",
    content: isRTL ? `• نقدم التطبيق "كما هو" دون أي ضمانات.
• لسنا مسؤولين عن أي أضرار ناتجة عن استخدام التطبيق.
• لا نضمن دقة جميع المعلومات في التطبيق.` : `• We provide the application "as is" without any warranties.
• We are not liable for any damages resulting from the use of the application.
• We do not guarantee the accuracy of all information in the application.`
  }, {
    id: "changes",
    icon: Zap,
    title: isRTL ? "التعديلات" : "Changes to Terms",
    content: isRTL ? `• نحتفظ بالحق في تعديل هذه الشروط في أي وقت.
• سيتم إخطارك بأي تغييرات جوهرية.
• استمرارك في استخدام التطبيق يعني موافقتك على التغييرات.` : `• We reserve the right to modify these terms at any time.
• You will be notified of any material changes.
• Continuing to use the application means you agree to the changes.`
  }, {
    id: "law",
    icon: Scale,
    title: isRTL ? "القانون الحاكم" : "Governing Law",
    content: isRTL ? `• تخضع هذه الشروط لقوانين الجمهورية العربية السورية.
• أي نزاع يحال إلى المحاكم السورية المختصة.` : `• These terms are governed by the laws of the Syrian Arab Republic.
• Any dispute shall be referred to the competent Syrian courts.`
  }, {
    id: "contact",
    icon: Mail,
    title: isRTL ? "التواصل معنا" : "Contact Us",
    content: isRTL ? `• للتواصل معنا، يمكنك استخدام زر "مركز المساعدة" في أسفل الصفحة.
• أو عبر البريد الإلكتروني: hello@alsouq.sy
• أو عبر الهاتف: +963 11 000 0000` : `• To contact us, you can use the "Help Center" button at the bottom of the page.
• Or via email: hello@alsouq.sy
• Or via phone: +963 11 000 0000`
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#2a655f]/5 via-[#3a8a82]/5 to-[#4a9f95]/5 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-2xl shadow-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-7 w-7 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent", children: isRTL ? "الشروط والأحكام" : "Terms & Conditions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: isRTL ? "آخر تحديث: " + (/* @__PURE__ */ new Date()).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }) : "Last updated: " + (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#4a9f95]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 md:p-10 space-y-8", children: sections.map((section, index) => {
        const Icon = section.icon;
        const isLast = index === sections.length - 1;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("relative", !isLast && "border-b border-[#2a655f]/10 dark:border-[#2a655f]/20 pb-6"), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shrink-0 shadow-lg shadow-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground mb-2", children: section.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground leading-relaxed whitespace-pre-line", children: section.content })
          ] })
        ] }) }, section.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white font-medium hover:shadow-lg hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5" }),
      isRTL ? "أوافق على الشروط والأحكام" : "I Agree to Terms & Conditions"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-sm text-[#2a655f] dark:text-[#3a8a82] hover:underline", children: isRTL ? "← العودة للرئيسية" : "Back to Home →" }) })
  ] }) });
}
export {
  TermsPage as component
};
