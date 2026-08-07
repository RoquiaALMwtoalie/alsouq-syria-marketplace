// src/routes/privacy.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Eye, Database, UserCheck, Truck, ChartBar, Heart, Sparkles, CheckCircle, Zap } from "lucide-react";
import { useApp, useT } from "@/lib/i18n";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ 
    meta: [{ 
      title: "سياسة الخصوصية - السوق لعندك" 
    }] 
  }),
});

function PrivacyPage() {
  const app = useApp();
  const t = useT();
  const isRTL = app.lang === "ar";

  // ✅ أيقونات متحركة
  const FloatingIcon = ({ Icon, className = "", delay = 0 }: any) => (
    <div 
      className="relative inline-block"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-float-icon">
        <Icon className={className} />
      </div>
      <span className="absolute -inset-2 rounded-full border border-[#2a655f]/20 animate-ripple" />
      <span className="absolute -inset-4 rounded-full border border-[#2a655f]/10 animate-ripple delay-700" />
      <span className="absolute -inset-6 rounded-full border border-[#2a655f]/5 animate-ripple delay-1500" />
    </div>
  );

  // ✅ نقاط البيانات
  const dataPoints = [
    {
      icon: Shield,
      title: isRTL ? "أمن معلومات مطلق" : "Absolute Information Security",
      desc: isRTL 
        ? "نستخدم أحدث تقنيات التشفير المتاحة لحماية بياناتك الشخصية والمالية من أي اختراق أو تسريب." 
        : "We use the latest available encryption technologies to protect your personal and financial data from any breach or leak.",
      color: "from-[#2a655f] to-[#3a8a82]"
    },
    {
      icon: UserCheck,
      title: isRTL ? "جمع بيانات أساسي" : "Basic Data Collection",
      desc: isRTL 
        ? "نجمع معلوماتك الأساسية (الاسم، عنوان التوصيل، تفاصيل الاتصال) لغرض معالجة طلباتك بكفاءة وتخصيص تجربة التسوق." 
        : "We collect your basic information (name, delivery address, contact details) to process your orders efficiently and personalize your shopping experience.",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Truck,
      title: isRTL ? "مشاركة محدودة مع شركاء موثوقين" : "Limited Sharing with Trusted Partners",
      desc: isRTL 
        ? "نحن لا نبيع أو نؤجر أو نشارك بياناتك مع أي جهات خارجية، باستثناء شركاء الشحن والخدمات اللوجستية الموثوقين لإتمام التوصيل." 
        : "We do not sell, rent, or share your data with any third parties, except for trusted shipping and logistics partners to complete delivery.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: ChartBar,
      title: isRTL ? "تحليلات مجهولة المصدر" : "Anonymous Analytics",
      desc: isRTL 
        ? "نستخدم تحليلات مجهولة المصدر لتعزيز تجربة التسوق وتحسين خدماتنا بشكل مستمر." 
        : "We use anonymous analytics to enhance the shopping experience and continuously improve our services.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Heart,
      title: isRTL ? "ثقتك هي أولويتنا" : "Your Trust is Our Priority",
      desc: isRTL 
        ? "باستخدام تطبيقنا، فإنك تضع ثقتك بنا، ونعمل بلا كلل كل يوم لكسب هذه الثقة والحفاظ عليها باستمرار." 
        : "By using our app, you place your trust in us, and we work tirelessly every day to earn and maintain that trust.",
      color: "from-rose-500 to-red-500"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a655f]/5 via-[#3a8a82]/5 to-[#4a9f95]/5 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950">
      
      {/* ✅ خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#2a655f]/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#3a8a82]/10 blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#4a9f95]/5 blur-3xl animate-pulse-slow" />
        
        {/* شبكة نقطية */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0 animate-pulse-slow" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #2a655f 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, #2a655f 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }} />
        </div>
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-16 md:py-24">
        
        {/* ✅ الهيدر */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-2xl shadow-[#2a655f]/30">
              <FloatingIcon Icon={Shield} className="h-7 w-7 text-white" delay={0} />
            </div>
            <div className="font-black text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
              {isRTL ? "سياسة الخصوصية" : "Privacy Policy"}
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="h-1 w-12 rounded-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82]" />
            <span>{isRTL ? "السوق عندك" : "Souqi"}</span>
            <span className="h-1 w-12 rounded-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82]" />
          </div>
        </div>

        {/* ✅ البطاقة الرئيسية */}
        <div className="relative">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#2a655f]/20 via-[#3a8a82]/20 to-[#4a9f95]/20 blur-2xl opacity-50" />
          
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl overflow-hidden">
            
            {/* شريط علوي متدرج */}
            <div className="h-2 bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#4a9f95]" />

            <div className="p-6 md:p-10 space-y-8">
              
              {/* المقدمة */}
              <div className="relative">
                <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl" />
                <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 border border-[#2a655f]/20 dark:border-[#2a655f]/30">
                  <div className="h-12 w-12 rounded-xl bg-[#2a655f]/20 dark:bg-[#2a655f]/30 flex items-center justify-center shrink-0">
                    <FloatingIcon Icon={Shield} className="h-6 w-6 text-[#2a655f] dark:text-[#3a8a82]" delay={100} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#2a655f] dark:text-[#3a8a82] mb-2">
                      {isRTL ? "خصوصيتك وأمن بياناتك هما أولوياتنا المطلقة" : "Your Privacy and Data Security Are Our Absolute Priorities"}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {isRTL 
                        ? `في ${t("brand")}، نحن ملتزمون تمامًا وبصرامة بحماية بياناتك الشخصية والمالية باستخدام أحدث تقنيات التشفير المتاحة.`
                        : `At ${t("brand")}, we are fully and strictly committed to protecting your personal and financial data using the latest available encryption technologies.`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* نقاط البيانات */}
              <div className="grid gap-4">
                {dataPoints.map((point, index) => (
                  <div 
                    key={index}
                    className="group relative p-5 rounded-2xl bg-gradient-to-br from-white/50 to-[#2a655f]/5 dark:from-gray-800/50 dark:to-[#2a655f]/10 border border-[#2a655f]/10 dark:border-[#2a655f]/20 hover:border-[#2a655f]/30 transition-all duration-500 hover:shadow-lg hover:shadow-[#2a655f]/10 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        h-12 w-12 rounded-xl bg-gradient-to-br ${point.color} 
                        flex items-center justify-center shrink-0 shadow-lg 
                        group-hover:scale-110 transition-transform duration-500
                      `}>
                        <FloatingIcon Icon={point.icon} className="h-6 w-6 text-white" delay={index * 200} />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors">
                          {point.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                          {point.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* الخاتمة */}
              <div className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-[#2a655f]/10 to-[#3a8a82]/10 dark:from-emerald-500/20 dark:via-[#2a655f]/20 dark:to-[#3a8a82]/20 border border-emerald-500/20 dark:border-emerald-500/30">
                <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-emerald-500/20 blur-2xl animate-pulse" />
                <div className="absolute -bottom-3 -left-3 h-12 w-12 rounded-full bg-[#2a655f]/20 blur-2xl animate-pulse delay-1000" />
                
                <div className="relative flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
                    <FloatingIcon Icon={Heart} className="h-6 w-6 text-white" delay={500} />
                  </div>
                  <div>
                    <p className="text-emerald-700 dark:text-emerald-300 font-medium text-lg">
                      {isRTL 
                        ? "باستخدام تطبيقنا، فإنك تضع ثقتك بنا، ونعمل بلا كلل كل يوم لكسب هذه الثقة والحفاظ عليها باستمرار." 
                        : "By using our app, you place your trust in us, and we work tirelessly every day to earn and maintain that trust."
                      }
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-sm text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="h-4 w-4" />
                      <span>{isRTL ? "✅ ثقتك هي شرف لنا" : "✅ Your trust is our honor"}</span>
                      <span className="w-px h-4 bg-emerald-500/30 mx-2" />
                      <Zap className="h-4 w-4" />
                      <span>{isRTL ? "⚡ نحمي بياناتك كأعيننا" : "⚡ We protect your data like our own"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* شارات إضافية */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-[#2a655f]/10 dark:border-[#2a655f]/20">
                {[
                  { icon: Shield, label: isRTL ? "حماية متقدمة" : "Advanced Protection" },
                  { icon: Lock, label: isRTL ? "تشفير شامل" : "Full Encryption" },
                  { icon: Eye, label: isRTL ? "شفافية كاملة" : "Full Transparency" },
                  { icon: Database, label: isRTL ? "تخزين آمن" : "Secure Storage" },
                ].map((badge, i) => (
                  <span 
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2a655f]/10 dark:bg-[#2a655f]/20 border border-[#2a655f]/20 text-xs text-[#2a655f] dark:text-[#3a8a82] hover:scale-105 transition-transform duration-300 cursor-default"
                  >
                    <FloatingIcon Icon={badge.icon} className="h-3.5 w-3.5" delay={i * 150} />
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* تاريخ التحديث */}
              <div className="text-center pt-4 border-t border-[#2a655f]/10 dark:border-[#2a655f]/20">
                <p className="text-xs text-muted-foreground">
                  {isRTL ? "آخر تحديث:" : "Last updated:"} 
                  <span className="font-medium text-[#2a655f] dark:text-[#3a8a82]">
                    {new Date().toLocaleDateString(isRTL ? "ar-SA" : "en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ✅ أزرار التنقل السريع */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Link 
            to="/"
            className="px-6 py-2.5 rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-[#2a655f]/25"
          >
            {isRTL ? "🏠 العودة للرئيسية" : "🏠 Back to Home"}
          </Link>
          <button
            onClick={() => {
              const event = new CustomEvent('openSupportChat');
              document.dispatchEvent(event);
            }}
            className="px-6 py-2.5 rounded-xl border border-[#2a655f]/20 hover:border-[#2a655f]/40 text-foreground hover:text-[#2a655f] transition-all duration-300 hover:scale-105"
          >
            {isRTL ? "❓ مركز المساعدة" : "❓ Help Center"}
          </button>
        </div>

      </div>

      {/* ✅ CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(3deg); }
          75% { transform: translateY(6px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 1s;
        }
        .animate-float-icon {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 3s ease-out infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}