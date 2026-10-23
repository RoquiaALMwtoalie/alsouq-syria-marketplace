// src/routes/privacy.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  Lock,
  Mail,
  Phone,
  Globe,
  Users,
  Database,
  Ban,
  UserCheck,
  MapPin,
} from "lucide-react";
import { useApp } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [{ title: "سياسة الخصوصية - ذوق | Zooq" }],
  }),
});

function PrivacyPage() {
  const app = useApp();
  const isRTL = app.lang === "ar";

  const sections = [
    {
      id: "intro",
      icon: FileText,
      title: isRTL ? "1. تعريف التطبيق وطبيعة عمله" : "1. About the App",
      content: isRTL
        ? "تطبيق «ذوق» (Zooq) هو منصة إلكترونية تابعة لمؤسسة عمر فلوح التجارية، تربط المتاجر والبائعين بالعملاء عبر شركات توصيل وموزعين معتمدين، لتسهيل عرض المنتجات وإنشاء الطلبات وتوصيلها وتتبّع حالتها بشكل مباشر."
        : "Zooq is an electronic platform owned by Omar Falloh Trading Est., connecting stores and sellers with customers through approved delivery companies and distributors, to facilitate product display, order creation, delivery, and real-time tracking.",
    },
    // ============================================================
    // ✅ 2. الجهة المسؤولة — مع LTR Mark لمنع انقلاب البريد والرقم
    // ============================================================
    {
      id: "responsible",
      icon: Shield,
      title: isRTL ? "2. الجهة المسؤولة عن التطبيق" : "2. Responsible Entity",
      content: isRTL
        ? "الجهة المالكة والمسؤولة عن التطبيق هي: مؤسسة عمر فلوح التجارية.\n\nالبريد الإلكتروني: \u200EM.halabi@ici-sy.com\nرقم التواصل: \u200E+963 944 323 352"
        : "The entity owning and responsible for the app is Omar Falloh Trading Est.\n\nEmail: M.halabi@ici-sy.com\nPhone: +963 944 323 352",
    },
    {
      id: "audience",
      icon: Users,
      title: isRTL ? "3. الفئات المستهدفة" : "3. Target Audience",
      content: isRTL
        ? "يستهدف التطبيق الفئات التالية:\n\n• العملاء\n• البائعون (المتاجر)\n• شركات التوصيل\n• الموزعون\n• الإدارة (الأدمن)"
        : "The app targets the following categories:\n\n• Customers\n• Sellers (Stores)\n• Delivery Companies\n• Distributors\n• Administration (Admin)",
    },
    {
      id: "operations",
      icon: CheckCircle,
      title: isRTL ? "4. وصف عمل التطبيق" : "4. App Operations",
      content: isRTL
        ? "يقوم التطبيق بتنظيم عمليات عرض المنتجات والطلب والتوصيل بين المتاجر والعملاء، مع إتاحة المحادثة بين العميل والبائع، وإشعارات فورية بحالة الطلبات، وذلك لتحسين جودة الخدمة وضمان وصول الطلبات بشكل دقيق وآمن."
        : "The app organizes product display, ordering, and delivery between stores and customers, with in-app chat between customer and seller, and instant notifications on order status, to improve service quality and ensure accurate and secure order delivery.",
    },
    {
      id: "rights",
      icon: UserCheck,
      title: isRTL ? "5. حقوق المستخدم ومسؤولياته" : "5. User Rights & Responsibilities",
      content: isRTL
        ? "• يلتزم المستخدم بتقديم معلومات صحيحة ودقيقة أثناء التسجيل.\n• يستخدم التطبيق بشكل قانوني ولا يسيء استخدام الخدمات.\n• لا يحاول الإضرار بالنظام أو بالمستخدمين الآخرين.\n• يتحمل مسؤولية الحفاظ على بيانات حسابه وكلمة المرور.\n• لا يشارك بيانات حسابه مع أي طرف آخر."
        : "• Users must provide accurate information during registration.\n• Use the app legally and do not misuse services.\n• Do not attempt to harm the system or other users.\n• Users are responsible for keeping account credentials secure.\n• Do not share account data with any third party.",
    },
    {
      id: "protection",
      icon: Lock,
      title: isRTL ? "6. آليات الحماية والخصوصية" : "6. Protection & Privacy",
      content: isRTL
        ? "يقوم التطبيق بجمع البيانات الضرورية لتقديم الخدمة فقط، وتشمل:\n\n• الاسم ورقم الهاتف\n• بيانات المتجر (للبائعين) وعناوين التوصيل والمحافظة\n• الموقع الجغرافي الذي يحدده المستخدم على الخريطة لعنوان التسليم أو المتجر\n• بيانات الطلبات والتقييمات والشكاوى ومحتوى المحادثات داخل التطبيق\n• الصور المتعلقة بالمنتجات والمتاجر\n• بيانات اشتراك إشعارات المتصفح عند موافقة المستخدم عليها\n\nوتُستخدم هذه البيانات حصراً لتقديم الخدمة وإدارة الطلبات والتوصيل وتحسين تجربة المستخدم، ولا تُباع لأي طرف ثالث.\n\nوتتخذ الإدارة إجراءات مناسبة لحماية البيانات ومنع الوصول غير المصرح به إليها، ومنها: تشفير الاتصالات (HTTPS)، وتخزين كلمات المرور بصيغة مجزّأة، والتحقق من هوية المستخدم قبل العمليات الحساسة، وتقييد الصلاحيات وفق دور كل مستخدم.\n\nولا تُفعَّل الإشعارات أو البحث الصوتي إلا بموافقة المستخدم وإذنه من المتصفح، ويمكنه سحب هذا الإذن في أي وقت."
        : "The app collects only data necessary to provide the service, including:\n\n• Name and phone number\n• Store data (for sellers), delivery addresses, and governorate\n• User-selected geographic location on the map for delivery or store address\n• Orders, reviews, complaints, and chat content within the app\n• Product and store images\n• Browser notification subscription data with user consent\n\nThis data is used exclusively to provide the service, manage orders and delivery, and improve user experience, and is never sold to any third party.\n\nThe administration takes appropriate measures to protect data and prevent unauthorized access, including: HTTPS encryption, hashed password storage, user identity verification for sensitive operations, and role-based access control.\n\nNotifications and voice search are only activated with user consent and browser permission, and the user can revoke this permission at any time.",
    },
    {
      id: "minors",
      icon: AlertCircle,
      title: isRTL ? "7. سياسة القاصرين" : "7. Minors Policy",
      content: isRTL
        ? "يُمنع استخدام التطبيق لمن هم دون سن 18 عاماً، ويُعتبر إنشاء الحساب أو استخدام التطبيق إقراراً من المستخدم بأنه تجاوز السن القانونية المطلوبة."
        : "Use of the app is prohibited for anyone under 18. Creating an account or using the app confirms the user has passed the legal age.",
    },
    {
      id: "actions",
      icon: Ban,
      title: isRTL ? "8. الإجراءات المتخذة عند مخالفة السياسة" : "8. Actions for Policy Violation",
      content: isRTL
        ? "تحتفظ إدارة التطبيق بحقها في اتخاذ الإجراءات المناسبة بحق أي مستخدم يخالف سياسة الاستخدام، وتشمل:\n\n• تعليق الحساب مؤقتاً\n• إيقاف الحساب بشكل دائم\n• حظر الوصول إلى التطبيق\n• اتخاذ الإجراءات القانونية عند الضرورة"
        : "The app administration reserves the right to take appropriate actions against any user who violates this policy, including:\n\n• Temporary account suspension\n• Permanent account termination\n• Banning access to the app\n• Legal action when necessary",
    },
    {
      id: "sharing",
      icon: Database,
      title: isRTL ? "9. مشاركة البيانات والاحتفاظ بها" : "9. Data Sharing & Retention",
      content: isRTL
        ? "لا تتم مشاركة البيانات الشخصية مع أطراف خارجية إلا عند الحاجة إلى تشغيل الخدمات أو تقديم الخدمة أو تنفيذ طلب المستخدم أو الامتثال لالتزام قانوني، وبالقدر الضروري لذلك.\n\nوتُحفظ البيانات طوال المدة اللازمة لتحقيق الأغراض التي جُمعت من أجلها، مع مراعاة متطلبات الاحتفاظ بالسجلات والقوانين المعمول بها."
        : "Personal data is not shared with external parties except when needed to operate services, provide the service, fulfill user requests, or comply with legal obligations, and only to the extent necessary.\n\nData is retained for the period necessary to achieve the purposes for which it was collected, in compliance with record retention requirements and applicable laws.",
    },
    {
      id: "scope",
      icon: Globe,
      title: isRTL ? "10. نطاق الخدمة" : "10. Service Scope",
      content: isRTL
        ? "يتم تقديم خدمات التطبيق ضمن أراضي الجمهورية العربية السورية فقط."
        : "App services are provided within the Syrian Arab Republic only.",
    },
    {
      id: "consent",
      icon: CheckCircle,
      title: isRTL ? "11. الموافقة على السياسة" : "11. Consent",
      content: isRTL
        ? "يُعتبر استخدام التطبيق موافقة صريحة من المستخدم على جميع البنود الواردة ضمن هذه السياسة."
        : "Use of the app constitutes explicit consent to all terms within this policy.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a655f]/5 via-[#3a8a82]/5 to-[#4a9f95]/5 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-2xl shadow-[#2a655f]/30">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-black text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
              {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="h-1 w-12 rounded-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82]" />
            <span>{isRTL ? "تطبيق ذوق (Zooq)" : "Zooq App"}</span>
            <span className="h-1 w-12 rounded-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82]" />
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            {isRTL ? "آخر تحديث: 2026" : "Last updated: 2026"}
          </p>
        </div>

        {/* Card */}
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#4a9f95]" />

          <div className="p-6 md:p-10 space-y-6">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isLast = index === sections.length - 1;

              return (
                <div
                  key={section.id}
                  className={
                    !isLast
                      ? "border-b border-[#2a655f]/10 dark:border-[#2a655f]/20 pb-6"
                      : ""
                  }
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

        {/* Contact */}
        <div className="mt-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-6">
          <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#2a655f] dark:text-[#3a8a82]" />
            {isRTL ? "للتواصل معنا" : "Contact Us"}
          </h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] shrink-0" />
              <span dir="ltr" className="font-mono">
                M.halabi@ici-sy.com
              </span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] shrink-0" />
              <span dir="ltr" className="font-mono">
                +963 944 323 352
              </span>
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] shrink-0" />
              <span>
                {isRTL
                  ? "مؤسسة عمر فلوح التجارية"
                  : "Omar Falloh Trading Est."}
              </span>
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link
            to="/"
            className="px-6 py-2.5 rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-[#2a655f]/25"
          >
            {isRTL ? "🏠 العودة للرئيسية" : "🏠 Back to Home"}
          </Link>
          <Link
            to="/terms"
            className="px-6 py-2.5 rounded-xl border border-[#2a655f]/20 hover:border-[#2a655f]/40 text-foreground hover:text-[#2a655f] transition-all duration-300 hover:scale-105"
          >
            {isRTL ? "📋 شروط الاستخدام" : "📋 Terms of Use"}
          </Link>
        </div>
      </div>
    </div>
  );
}