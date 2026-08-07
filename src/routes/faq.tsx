// src/routes/faq.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
  ChevronDown, ChevronUp, User, ShoppingBag, CreditCard, 
  Truck, Store, Bell, Shield, HelpCircle, Search,
  Phone, Mail, MessageCircle 
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
});

function FAQPage() {
  const app = useApp();
  const isRTL = app.lang === "ar";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // ✅ بيانات الأسئلة الشائعة
  const faqCategories = [
    {
      id: "account",
      icon: User,
      title: isRTL ? "الحساب والتسجيل" : "Account & Registration",
      questions: [
        {
          q: isRTL ? "كيف يمكنني إنشاء حساب جديد؟" : "How can I create a new account?",
          a: isRTL 
            ? "يمكنك إنشاء حساب جديد من خلال الضغط على زر 'تسجيل' في أعلى الصفحة، ثم إدخال رقم هاتفك واسمك الكامل وكلمة المرور، وتأكيد العنوان." 
            : "You can create a new account by clicking the 'Register' button at the top of the page, then entering your phone number, full name, password, and confirming your address."
        },
        {
          q: isRTL ? "كيف يمكنني إعادة تعيين كلمة المرور؟" : "How can I reset my password?",
          a: isRTL 
            ? "يمكنك إعادة تعيين كلمة المرور من خلال الضغط على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، وسنرسل لك رابطاً لإعادة التعيين." 
            : "You can reset your password by clicking 'Forgot password' on the login page, and we'll send you a reset link."
        },
        {
          q: isRTL ? "كيف أحذف حسابي؟" : "How do I delete my account?",
          a: isRTL 
            ? "يمكنك حذف حسابك من خلال التواصل مع فريق الدعم عبر زر 'مركز المساعدة' في أسفل الصفحة، وسنقوم بحذفه خلال 24 ساعة." 
            : "You can delete your account by contacting our support team through the 'Help Center' button at the bottom of the page, and we'll delete it within 24 hours."
        },
      ]
    },
    {
      id: "orders",
      icon: ShoppingBag,
      title: isRTL ? "الطلبات" : "Orders",
      questions: [
        {
          q: isRTL ? "كيف يمكنني تقديم طلب؟" : "How can I place an order?",
          a: isRTL 
            ? "تصفح المنتجات، اختر ما تريد، أضفه إلى السلة، ثم اتبع خطوات الدفع والتوصيل." 
            : "Browse products, choose what you want, add to cart, then follow the checkout and delivery steps."
        },
        {
          q: isRTL ? "كيف أتتبع طلبي؟" : "How do I track my order?",
          a: isRTL 
            ? "يمكنك تتبع طلبك من خلال الذهاب إلى 'طلباتي' في حسابك، حيث ستجد حالة الطلب وتفاصيل التوصيل." 
            : "You can track your order by going to 'My Orders' in your account, where you'll find the order status and delivery details."
        },
        {
          q: isRTL ? "هل يمكنني إلغاء طلبي؟" : "Can I cancel my order?",
          a: isRTL 
            ? "نعم، يمكنك إلغاء طلبك خلال 30 دقيقة من تقديمه من خلال الذهاب إلى 'طلباتي' والضغط على إلغاء الطلب." 
            : "Yes, you can cancel your order within 30 minutes of placing it by going to 'My Orders' and clicking cancel."
        },
      ]
    },
    {
      id: "payment",
      icon: CreditCard,
      title: isRTL ? "الدفع والفواتير" : "Payment & Invoices",
      questions: [
        {
          q: isRTL ? "ما هي طرق الدفع المتاحة؟" : "What payment methods are available?",
          a: isRTL 
            ? "نقبل الدفع عبر البطاقات الائتمانية، والمحافظ الرقمية، والدفع عند الاستلام." 
            : "We accept credit cards, digital wallets, and cash on delivery."
        },
        {
          q: isRTL ? "هل الدفع آمن؟" : "Is payment secure?",
          a: isRTL 
            ? "نعم، نستخدم أحدث تقنيات التشفير لحماية بياناتك المالية، وجميع المعاملات آمنة 100%." 
            : "Yes, we use the latest encryption technologies to protect your financial data, and all transactions are 100% secure."
        },
      ]
    },
    {
      id: "delivery",
      icon: Truck,
      title: isRTL ? "الشحن والتوصيل" : "Shipping & Delivery",
      questions: [
        {
          q: isRTL ? "كم تستغرق عملية التوصيل؟" : "How long does delivery take?",
          a: isRTL 
            ? "تستغرق عملية التوصيل من 2 إلى 5 أيام عمل حسب منطقتك." 
            : "Delivery takes 2 to 5 business days depending on your area."
        },
        {
          q: isRTL ? "كم تكلفة الشحن؟" : "How much does shipping cost?",
          a: isRTL 
            ? "تكلفة الشحن تعتمد على موقعك ووزن الطلب، وستظهر لك التكلفة قبل تأكيد الطلب." 
            : "Shipping cost depends on your location and order weight, and will be shown before order confirmation."
        },
      ]
    },
    {
      id: "security",
      icon: Shield,
      title: isRTL ? "الخصوصية والأمان" : "Privacy & Security",
      questions: [
        {
          q: isRTL ? "كيف تحمي بياناتي؟" : "How do you protect my data?",
          a: isRTL 
            ? "نحن نلتزم بأعلى معايير الأمان لحماية بياناتك، ولا نشاركها مع أي جهة خارجية." 
            : "We adhere to the highest security standards to protect your data, and we don't share it with any third parties."
        },
      ]
    },
    {
      id: "contact",
      icon: MessageCircle,
      title: isRTL ? "التواصل والدعم" : "Contact & Support",
      questions: [
        {
          q: isRTL ? "كيف أتواصل مع فريق الدعم؟" : "How can I contact support?",
          a: isRTL 
            ? "يمكنك التواصل معنا عبر زر 'مركز المساعدة' في أسفل الصفحة، أو عبر البريد الإلكتروني hello@alsouq.sy" 
            : "You can contact us through the 'Help Center' button at the bottom of the page, or via email at hello@alsouq.sy"
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a655f]/5 via-[#3a8a82]/5 to-[#4a9f95]/5 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950 py-16">
      <div className="mx-auto max-w-4xl px-4">
        
        {/* ✅ الهيدر */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-2xl shadow-[#2a655f]/30">
              <HelpCircle className="h-7 w-7 text-white" />
            </div>
            <div className="font-black text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
              {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? "جميع الأسئلة التي تبحث عنها في مكان واحد. اختر فئة لتصفح الأسئلة." 
              : "All the questions you're looking for in one place. Choose a category to browse questions."}
          </p>
        </div>

        {/* ✅ التصنيفات */}
        <div className="grid gap-6">
          {faqCategories.map((category, catIndex) => (
            <div key={category.id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-lg overflow-hidden">
              {/* ✅ عنوان التصنيف */}
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 border-b border-[#2a655f]/10 dark:border-[#2a655f]/20">
                <div className="h-8 w-8 rounded-lg bg-[#2a655f]/20 flex items-center justify-center">
                  <category.icon className="h-4 w-4 text-[#2a655f]" />
                </div>
                <h2 className="font-bold text-foreground">{category.title}</h2>
                <span className="text-xs text-muted-foreground ml-auto">
                  {category.questions.length} {isRTL ? "سؤال" : "questions"}
                </span>
              </div>

              {/* ✅ الأسئلة */}
              <div className="divide-y divide-[#2a655f]/10 dark:divide-[#2a655f]/20">
                {category.questions.map((item, qIndex) => {
                  const globalIndex = catIndex * 100 + qIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div key={qIndex} className="p-2">
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="flex items-center justify-between w-full text-start p-3 rounded-xl hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 transition-all duration-300 group"
                      >
                        <span className="font-medium text-foreground text-sm group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors">
                          {item.q}
                        </span>
                        <div className={cn(
                          "h-8 w-8 rounded-full bg-[#2a655f]/10 flex items-center justify-center transition-all duration-300 shrink-0 ml-2",
                          isOpen ? "bg-[#2a655f] text-white" : "group-hover:bg-[#2a655f]/20"
                        )}>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                      
                      {/* ✅ الإجابة */}
                      <div className={cn(
                        "overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      )}>
                        <p className="text-sm text-muted-foreground leading-relaxed px-3 pb-3">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ✅ هل لم تجد إجابتك؟ */}
        <div className="mt-12 p-6 text-center bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30">
          <p className="text-foreground font-medium">
            {isRTL ? "🤔 لم تجد إجابتك؟" : "🤔 Didn't find your answer?"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isRTL 
              ? "تواصل مع فريق الدعم وسنرد عليك خلال ثواني" 
              : "Contact our support team and we'll reply within seconds"}
          </p>
          <button
            onClick={() => {
              const event = new CustomEvent('openSupportChat');
              document.dispatchEvent(event);
            }}
            className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white font-medium hover:shadow-lg hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105"
          >
            {isRTL ? "📞 تواصل مع الدعم" : "📞 Contact Support"}
          </button>
        </div>

        {/* ✅ زر العودة */}
        <div className="mt-8 text-center">
          <Link to="/" className="text-[#2a655f] dark:text-[#3a8a82] hover:underline">
            {isRTL ? "← العودة للرئيسية" : "Back to Home →"}
          </Link>
        </div>
      </div>
    </div>
  );
}