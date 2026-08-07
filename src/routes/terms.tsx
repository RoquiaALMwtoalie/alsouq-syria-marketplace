// src/routes/terms.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Shield, FileText, CheckCircle, AlertCircle, 
  ShoppingBag, Truck, CreditCard, Scale, Users,
  BookOpen, Zap, Globe, Lock, Mail, Phone
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  const app = useApp();
  const isRTL = app.lang === "ar";

  // ✅ البيانات
  const sections = [
    {
      id: "intro",
      icon: FileText,
      title: isRTL ? "مقدمة" : "Introduction",
      content: isRTL 
        ? `مرحباً بك في ${app.brand || "منصتنا"}. باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل استخدام التطبيق.`
        : `Welcome to ${app.brand || "our platform"}. By using this application, you agree to comply with the following terms and conditions. Please read them carefully before using the application.`
    },
    {
      id: "account",
      icon: Users,
      title: isRTL ? "الحساب والتسجيل" : "Account & Registration",
      content: isRTL 
        ? `• يجب أن تقدم معلومات صحيحة وكاملة عند إنشاء الحساب.\n• أنت المسؤول الوحيد عن الحفاظ على سرية بيانات حسابك.\n• لا يجوز مشاركة حسابك مع أي شخص آخر.\n• نحتفظ بالحق في تعليق أو حذف أي حساب يخالف هذه الشروط.`
        : `• You must provide accurate and complete information when creating an account.\n• You are solely responsible for maintaining the confidentiality of your account data.\n• You may not share your account with any other person.\n• We reserve the right to suspend or delete any account that violates these terms.`
    },
    {
      id: "usage",
      icon: CheckCircle,
      title: isRTL ? "الاستخدام المقبول" : "Acceptable Use",
      content: isRTL 
        ? `• يجب استخدام التطبيق للأغراض القانونية فقط.\n• يحظر نشر أي محتوى غير لائق أو مسيء أو مخالف للقوانين.\n• لا يجوز استغلال التطبيق لأي نشاط غير مشروع.\n• نحتفظ بالحق في اتخاذ الإجراءات القانونية ضد أي مخالفة.`
        : `• The application must be used for legal purposes only.\n• It is prohibited to post any inappropriate, offensive, or illegal content.\n• The application may not be exploited for any illegal activity.\n• We reserve the right to take legal action against any violation.`
    },
    {
      id: "products",
      icon: ShoppingBag,
      title: isRTL ? "المنتجات والخدمات" : "Products & Services",
      content: isRTL 
        ? `• نسعى لعرض معلومات دقيقة عن المنتجات والخدمات.\n• نحتفظ بالحق في تعديل الأسعار في أي وقت.\n• لا نضمن توفر جميع المنتجات طوال الوقت.\n• الصور المعروضة قد تختلف عن المنتج الفعلي.`
        : `• We strive to display accurate information about products and services.\n• We reserve the right to modify prices at any time.\n• We do not guarantee the availability of all products at all times.\n• Displayed images may differ from the actual product.`
    },
    {
      id: "orders",
      icon: CreditCard,
      title: isRTL ? "الطلبات والدفع" : "Orders & Payment",
      content: isRTL 
        ? `• يتم تأكيد الطلب بعد إتمام عملية الدفع.\n• نقبل طرق الدفع المتاحة في التطبيق.\n• يمكن إلغاء الطلب خلال 30 دقيقة من تقديمه.\n• في حال وجود مشكلة في الطلب، يرجى التواصل مع الدعم.`
        : `• The order is confirmed after completing the payment process.\n• We accept the payment methods available in the application.\n• Orders can be canceled within 30 minutes of placement.\n• If there is an issue with the order, please contact support.`
    },
    {
      id: "delivery",
      icon: Truck,
      title: isRTL ? "الشحن والتوصيل" : "Shipping & Delivery",
      content: isRTL 
        ? `• نوفر خدمة التوصيل إلى المناطق المحددة.\n• أنت مسؤول عن توفير عنوان صحيح للتوصيل.\n• قد يتأخر التوصيل بسبب ظروف خارجة عن إرادتنا.\n• يرجى التواصل مع الدعم في حال تأخر الطلب.`
        : `• We provide delivery service to specified areas.\n• You are responsible for providing a correct delivery address.\n• Delivery may be delayed due to circumstances beyond our control.\n• Please contact support if the order is delayed.`
    },
    {
      id: "intellectual",
      icon: Lock,
      title: isRTL ? "الملكية الفكرية" : "Intellectual Property",
      content: isRTL 
        ? `• جميع المحتويات في التطبيق محمية بحقوق النشر.\n• لا يجوز نسخ أو استخدام أي محتوى دون إذن مسبق.\n• العلامات التجارية والاسم التجاري مملوكة للمنصة.`
        : `• All content in the application is protected by copyright.\n• No content may be copied or used without prior permission.\n• Trademarks and trade name are owned by the platform.`
    },
    {
      id: "disclaimer",
      icon: AlertCircle,
      title: isRTL ? "إخلاء المسؤولية" : "Disclaimer",
      content: isRTL 
        ? `• نقدم التطبيق "كما هو" دون أي ضمانات.\n• لسنا مسؤولين عن أي أضرار ناتجة عن استخدام التطبيق.\n• لا نضمن دقة جميع المعلومات في التطبيق.`
        : `• We provide the application "as is" without any warranties.\n• We are not liable for any damages resulting from the use of the application.\n• We do not guarantee the accuracy of all information in the application.`
    },
    {
      id: "changes",
      icon: Zap,
      title: isRTL ? "التعديلات" : "Changes to Terms",
      content: isRTL 
        ? `• نحتفظ بالحق في تعديل هذه الشروط في أي وقت.\n• سيتم إخطارك بأي تغييرات جوهرية.\n• استمرارك في استخدام التطبيق يعني موافقتك على التغييرات.`
        : `• We reserve the right to modify these terms at any time.\n• You will be notified of any material changes.\n• Continuing to use the application means you agree to the changes.`
    },
    {
      id: "law",
      icon: Scale,
      title: isRTL ? "القانون الحاكم" : "Governing Law",
      content: isRTL 
        ? `• تخضع هذه الشروط لقوانين الجمهورية العربية السورية.\n• أي نزاع يحال إلى المحاكم السورية المختصة.`
        : `• These terms are governed by the laws of the Syrian Arab Republic.\n• Any dispute shall be referred to the competent Syrian courts.`
    },
    {
      id: "contact",
      icon: Mail,
      title: isRTL ? "التواصل معنا" : "Contact Us",
      content: isRTL 
        ? `• للتواصل معنا، يمكنك استخدام زر "مركز المساعدة" في أسفل الصفحة.\n• أو عبر البريد الإلكتروني: hello@alsouq.sy\n• أو عبر الهاتف: +963 11 000 0000`
        : `• To contact us, you can use the "Help Center" button at the bottom of the page.\n• Or via email: hello@alsouq.sy\n• Or via phone: +963 11 000 0000`
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a655f]/5 via-[#3a8a82]/5 to-[#4a9f95]/5 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950 py-16">
      <div className="mx-auto max-w-4xl px-4">
        
        {/* ✅ الهيدر */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-2xl shadow-[#2a655f]/30">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <div className="font-black text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
              {isRTL ? "الشروط والأحكام" : "Terms & Conditions"}
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? "آخر تحديث: " + new Date().toLocaleDateString("ar-SA", { year: 'numeric', month: 'long', day: 'numeric' })
              : "Last updated: " + new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* ✅ المحتوى */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#4a9f95]" />
          
          <div className="p-6 md:p-10 space-y-8">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isLast = index === sections.length - 1;
              
              return (
                <div 
                  key={section.id}
                  className={cn(
                    "relative",
                    !isLast && "border-b border-[#2a655f]/10 dark:border-[#2a655f]/20 pb-6"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shrink-0 shadow-lg shadow-[#2a655f]/20">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-foreground mb-2">
                        {section.title}
                      </h2>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ زر الموافقة */}
        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white font-medium hover:shadow-lg hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105">
            <CheckCircle className="h-5 w-5" />
            {isRTL ? "أوافق على الشروط والأحكام" : "I Agree to Terms & Conditions"}
          </Link>
        </div>

        {/* ✅ زر العودة */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-[#2a655f] dark:text-[#3a8a82] hover:underline">
            {isRTL ? "← العودة للرئيسية" : "Back to Home →"}
          </Link>
        </div>
      </div>
    </div>
  );
}