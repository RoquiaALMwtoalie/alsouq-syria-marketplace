import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, c as cn } from "./router-BU7AgYzK.mjs";
import "../_libs/sonner.mjs";
import { am as CircleQuestionMark, U as User, i as ShoppingBag, Q as CreditCard, m as Truck, a1 as Shield, o as MessageCircle, V as ChevronUp, y as ChevronDown } from "../_libs/lucide-react.mjs";
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
function FAQPage() {
  const app = useApp();
  const isRTL = app.lang === "ar";
  const [openIndex, setOpenIndex] = reactExports.useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const faqCategories = [{
    id: "account",
    icon: User,
    title: isRTL ? "الحساب والتسجيل" : "Account & Registration",
    questions: [{
      q: isRTL ? "كيف يمكنني إنشاء حساب جديد؟" : "How can I create a new account?",
      a: isRTL ? "يمكنك إنشاء حساب جديد من خلال الضغط على زر 'تسجيل' في أعلى الصفحة، ثم إدخال رقم هاتفك واسمك الكامل وكلمة المرور، وتأكيد العنوان." : "You can create a new account by clicking the 'Register' button at the top of the page, then entering your phone number, full name, password, and confirming your address."
    }, {
      q: isRTL ? "كيف يمكنني إعادة تعيين كلمة المرور؟" : "How can I reset my password?",
      a: isRTL ? "يمكنك إعادة تعيين كلمة المرور من خلال الضغط على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، وسنرسل لك رابطاً لإعادة التعيين." : "You can reset your password by clicking 'Forgot password' on the login page, and we'll send you a reset link."
    }, {
      q: isRTL ? "كيف أحذف حسابي؟" : "How do I delete my account?",
      a: isRTL ? "يمكنك حذف حسابك من خلال التواصل مع فريق الدعم عبر زر 'مركز المساعدة' في أسفل الصفحة، وسنقوم بحذفه خلال 24 ساعة." : "You can delete your account by contacting our support team through the 'Help Center' button at the bottom of the page, and we'll delete it within 24 hours."
    }]
  }, {
    id: "orders",
    icon: ShoppingBag,
    title: isRTL ? "الطلبات" : "Orders",
    questions: [{
      q: isRTL ? "كيف يمكنني تقديم طلب؟" : "How can I place an order?",
      a: isRTL ? "تصفح المنتجات، اختر ما تريد، أضفه إلى السلة، ثم اتبع خطوات الدفع والتوصيل." : "Browse products, choose what you want, add to cart, then follow the checkout and delivery steps."
    }, {
      q: isRTL ? "كيف أتتبع طلبي؟" : "How do I track my order?",
      a: isRTL ? "يمكنك تتبع طلبك من خلال الذهاب إلى 'طلباتي' في حسابك، حيث ستجد حالة الطلب وتفاصيل التوصيل." : "You can track your order by going to 'My Orders' in your account, where you'll find the order status and delivery details."
    }, {
      q: isRTL ? "هل يمكنني إلغاء طلبي؟" : "Can I cancel my order?",
      a: isRTL ? "نعم، يمكنك إلغاء طلبك خلال 30 دقيقة من تقديمه من خلال الذهاب إلى 'طلباتي' والضغط على إلغاء الطلب." : "Yes, you can cancel your order within 30 minutes of placing it by going to 'My Orders' and clicking cancel."
    }]
  }, {
    id: "payment",
    icon: CreditCard,
    title: isRTL ? "الدفع والفواتير" : "Payment & Invoices",
    questions: [{
      q: isRTL ? "ما هي طرق الدفع المتاحة؟" : "What payment methods are available?",
      a: isRTL ? "نقبل الدفع عبر البطاقات الائتمانية، والمحافظ الرقمية، والدفع عند الاستلام." : "We accept credit cards, digital wallets, and cash on delivery."
    }, {
      q: isRTL ? "هل الدفع آمن؟" : "Is payment secure?",
      a: isRTL ? "نعم، نستخدم أحدث تقنيات التشفير لحماية بياناتك المالية، وجميع المعاملات آمنة 100%." : "Yes, we use the latest encryption technologies to protect your financial data, and all transactions are 100% secure."
    }]
  }, {
    id: "delivery",
    icon: Truck,
    title: isRTL ? "الشحن والتوصيل" : "Shipping & Delivery",
    questions: [{
      q: isRTL ? "كم تستغرق عملية التوصيل؟" : "How long does delivery take?",
      a: isRTL ? "تستغرق عملية التوصيل من 2 إلى 5 أيام عمل حسب منطقتك." : "Delivery takes 2 to 5 business days depending on your area."
    }, {
      q: isRTL ? "كم تكلفة الشحن؟" : "How much does shipping cost?",
      a: isRTL ? "تكلفة الشحن تعتمد على موقعك ووزن الطلب، وستظهر لك التكلفة قبل تأكيد الطلب." : "Shipping cost depends on your location and order weight, and will be shown before order confirmation."
    }]
  }, {
    id: "security",
    icon: Shield,
    title: isRTL ? "الخصوصية والأمان" : "Privacy & Security",
    questions: [{
      q: isRTL ? "كيف تحمي بياناتي؟" : "How do you protect my data?",
      a: isRTL ? "نحن نلتزم بأعلى معايير الأمان لحماية بياناتك، ولا نشاركها مع أي جهة خارجية." : "We adhere to the highest security standards to protect your data, and we don't share it with any third parties."
    }]
  }, {
    id: "contact",
    icon: MessageCircle,
    title: isRTL ? "التواصل والدعم" : "Contact & Support",
    questions: [{
      q: isRTL ? "كيف أتواصل مع فريق الدعم؟" : "How can I contact support?",
      a: isRTL ? "يمكنك التواصل معنا عبر زر 'مركز المساعدة' في أسفل الصفحة، أو عبر البريد الإلكتروني hello@alsouq.sy" : "You can contact us through the 'Help Center' button at the bottom of the page, or via email at hello@alsouq.sy"
    }]
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#2a655f]/5 via-[#3a8a82]/5 to-[#4a9f95]/5 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950 py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-2xl shadow-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "h-7 w-7 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent", children: isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-2xl mx-auto", children: isRTL ? "جميع الأسئلة التي تبحث عنها في مكان واحد. اختر فئة لتصفح الأسئلة." : "All the questions you're looking for in one place. Choose a category to browse questions." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6", children: faqCategories.map((category, catIndex) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-lg overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 border-b border-[#2a655f]/10 dark:border-[#2a655f]/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 w-8 rounded-lg bg-[#2a655f]/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(category.icon, { className: "h-4 w-4 text-[#2a655f]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-bold text-foreground", children: category.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto", children: [
          category.questions.length,
          " ",
          isRTL ? "سؤال" : "questions"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-[#2a655f]/10 dark:divide-[#2a655f]/20", children: category.questions.map((item, qIndex) => {
        const globalIndex = catIndex * 100 + qIndex;
        const isOpen = openIndex === globalIndex;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleFAQ(globalIndex), className: "flex items-center justify-between w-full text-start p-3 rounded-xl hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition-all duration-300 group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground text-sm group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors", children: item.q }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-8 w-8 rounded-full bg-[#2a655f]/10 flex items-center justify-center transition-all duration-300 shrink-0 ml-2", isOpen ? "bg-[#2a655f] text-white" : "group-hover:bg-[#2a655f]/20"), children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("overflow-hidden transition-all duration-300", isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed px-3 pb-3", children: item.a }) })
        ] }, qIndex);
      }) })
    ] }, category.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 p-6 text-center bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: isRTL ? "🤔 لم تجد إجابتك؟" : "🤔 Didn't find your answer?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: isRTL ? "تواصل مع فريق الدعم وسنرد عليك خلال ثواني" : "Contact our support team and we'll reply within seconds" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
        const event = new CustomEvent("openSupportChat");
        document.dispatchEvent(event);
      }, className: "mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white font-medium hover:shadow-lg hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105", children: isRTL ? "📞 تواصل مع الدعم" : "📞 Contact Support" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-[#2a655f] dark:text-[#3a8a82] hover:underline", children: isRTL ? "← العودة للرئيسية" : "Back to Home →" }) })
  ] }) });
}
export {
  FAQPage as component
};
