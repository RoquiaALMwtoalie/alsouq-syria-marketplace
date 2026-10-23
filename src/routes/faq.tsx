// src/routes/faq.tsx
// ✅ الأسئلة الشائعة — مطابقة لتطبيق ذوق الفعلي

import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { 
  ChevronDown, ChevronUp, User, ShoppingBag, CreditCard, 
  Truck, Store, Bell, Shield, HelpCircle, Search,
  Phone, Mail, MessageCircle, Gift, Star, MapPin,
  Package, Percent, Clock, Ban, Users, UserCheck,
  Wallet, Navigation, AlertCircle, CheckCircle
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

  // ✅ بيانات الأسئلة الشائعة — مطابقة للتطبيق
  const faqCategories = [
    // ============================================================
    // 1. الحساب والتسجيل
    // ============================================================
    {
      id: "account",
      icon: User,
      title: isRTL ? "الحساب والتسجيل" : "Account & Registration",
      questions: [
        {
          q: isRTL ? "هل يمكنني التصفح بدون تسجيل حساب؟" : "Can I browse without creating an account?",
          a: isRTL 
            ? `✅ نعم، يمكنك تصفح التطبيق كزائر (Guest) بدون تسجيل حساب!\n\n📌 ما يمكنك فعله كزائر:\n• تصفح الصفحة الرئيسية\n• تصفح المنتجات والعروض\n• تصفح المتاجر والتصنيفات\n• البحث عن منتجات\n• عرض تفاصيل أي منتج\n• عرض تقييمات المنتجات\n• إرسال رسالة للدعم (بإدخال رقم هاتفك)\n\n🔐 ما يتطلب تسجيل دخول:\n• إضافة منتج للسلة\n• إتمام طلب\n• تقييم منتج\n• مراسلة بائع\n• إضافة للمفضلة\n• عرض طلباتي\n\n💡 عند محاولة إضافة منتج للسلة كزائر، سيتم توجيهك لتسجيل الدخول، وبعد التسجيل سيُضاف المنتج تلقائياً للسلة.`
            : `✅ Yes, you can browse the app as a guest without creating an account!\n\n📌 What you can do as a guest:\n• Browse the home page\n• Browse products and offers\n• Browse stores and categories\n• Search for products\n• View any product details\n• View product reviews\n• Send a message to support (by entering your phone)\n\n🔐 What requires login:\n• Add product to cart\n• Complete an order\n• Rate a product\n• Message a seller\n• Add to favorites\n• View my orders\n\n💡 When trying to add a product to cart as a guest, you will be redirected to login, and after registering, the product will be automatically added to the cart.`
        },
        {
          q: isRTL ? "كيف يمكنني إنشاء حساب جديد؟" : "How can I create a new account?",
          a: isRTL 
            ? "يمكنك إنشاء حساب جديد من خلال الضغط على زر 'تسجيل' في أعلى الصفحة، ثم إدخال رقم هاتفك واسمك الكامل وكلمة المرور. رقم الهاتف هو وسيلة تسجيل الدخول الأساسية في التطبيق." 
            : "You can create a new account by clicking the 'Register' button at the top of the page, then entering your phone number, full name, and password. Phone number is the primary login method in the app."
        },
        {
          q: isRTL ? "ما هي الأدوار المتاحة في التطبيق؟" : "What roles are available in the app?",
          a: isRTL 
            ? "يدعم التطبيق 5 أدوار:\n• 👤 عميل (Customer) — الدور الافتراضي لكل مستخدم جديد\n• 🏪 بائع (Seller) — بعد موافقة الإدارة على طلب فتح متجر\n• 🚚 شركة توصيل (Delivery Company) — بعد موافقة الإدارة\n• 📦 موزع (Distributor) — يُنشئه مدير شركة التوصيل\n• 👑 أدمن (Admin) — إدارة كاملة للنظام\n\nيمكن للمستخدم امتلاك أكثر من دور في نفس الوقت." 
            : "The app supports 5 roles:\n• 👤 Customer — Default role for every new user\n• 🏪 Seller — After admin approval of a store request\n• 🚚 Delivery Company — After admin approval\n• 📦 Distributor — Created by the delivery company manager\n• 👑 Admin — Full system management\n\nA user can have more than one role at the same time."
        },
        {
          q: isRTL ? "كيف أصبح بائعاً (أفتح متجراً)؟" : "How do I become a seller (open a store)?",
          a: isRTL 
            ? "يمكنك التقدم بطلب فتح متجر من خلال صفحة 'كن بائعاً' (Become Seller)، وتعبئة بيانات المتجر (الاسم، الوصف، الشعار، صورة الغلاف، المحافظة، العنوان، أوقات العمل). بعد مراجعة الإدارة، سيتم إشعارك بالموافقة أو الرفض. عند الموافقة، سيُضاف دور 'بائع' إلى حسابك تلقائياً." 
            : "You can apply to open a store through the 'Become a Seller' page, filling in store details (name, description, logo, cover image, governorate, address, working hours). After admin review, you will be notified of approval or rejection. Upon approval, the 'Seller' role is automatically added to your account."
        },
        {
          q: isRTL ? "كيف أحذف حسابي؟" : "How do I delete my account?",
          a: isRTL 
            ? "يمكنك التواصل مع فريق الدعم عبر البريد الإلكتروني أو رقم الهاتف أدناه لحذف حسابك. سيتم حذف جميع بياناتك (المتجر، المنتجات، الطلبات، المحادثات) نهائياً." 
            : "You can contact our support team via email or phone below to delete your account. All your data (store, products, orders, chats) will be permanently deleted."
        },
      ]
    },

    // ============================================================
    // 2. التسوق والسلة
    // ============================================================
    {
      id: "cart",
      icon: ShoppingBag,
      title: isRTL ? "التسوق والسلة" : "Shopping & Cart",
      questions: [
        {
          q: isRTL ? "كيف يمكنني تقديم طلب؟" : "How can I place an order?",
          a: isRTL 
            ? "تصفح المنتجات، اختر ما تريد، أضفه إلى السلة، ثم اختر عنوان التوصيل (أو أضف عنواناً جديداً)، وأكّد الطلب. سيُرسل الطلب للبائع للمراجعة." 
            : "Browse products, choose what you want, add to cart, then select a delivery address (or add a new one), and confirm the order. The order will be sent to the seller for review."
        },
        {
          q: isRTL ? "لماذا يُطلب مني التسجيل عند إضافة منتج للسلة؟" : "Why am I asked to login when adding a product to cart?",
          a: isRTL 
            ? `🔐 التسجيل مطلوب لإضافة المنتجات للسلة للأسباب التالية:\n\n• 🛒 نحتاج لربط السلة بحسابك حتى لا تفقدها\n• 📦 نحتاج معلوماتك (الاسم، الهاتف، العنوان) لإتمام الطلب\n• 📊 نحتاج لتتبع طلباتك وتوصيلها\n\n💡 عند تسجيل الدخول بعد محاولة الإضافة:\n• سيُضاف المنتج تلقائياً للسلة\n• ستعود لنفس الصفحة\n• لن تفقد أي شيء اخترته\n\n✨ التصفح والبحث وعرض التفاصيل — كلها متاحة بدون تسجيل!`
            : `🔐 Login is required to add products to cart for these reasons:\n\n• 🛒 We need to link the cart to your account so you don't lose it\n• 📦 We need your info (name, phone, address) to complete the order\n• 📊 We need to track and deliver your orders\n\n💡 When you login after attempting to add:\n• The product will be automatically added to the cart\n• You'll return to the same page\n• You won't lose anything you selected\n\n✨ Browsing, searching, and viewing details — all available without registration!`
        },
        {
          q: isRTL ? "⚠️ هل يمكنني إضافة منتجات من متاجر مختلفة؟" : "⚠️ Can I add products from different stores?",
          a: isRTL 
            ? "⚠️ لا، السلة تقبل منتجات من متجر واحد فقط. إذا أضفت منتجاً من متجر آخر، سيظهر لك تنبيه يطلب تفريغ السلة أولاً قبل إضافة المنتج الجديد." 
            : "⚠️ No, the cart accepts products from one store only. If you add a product from another store, a warning will appear asking you to clear the cart first before adding the new product."
        },
        {
          q: isRTL ? "كيف أعدّل كمية منتج في السلة؟" : "How do I modify a product quantity in the cart?",
          a: isRTL 
            ? "من صفحة السلة، اضغط على زر + لزيادة الكمية أو - لتقليلها. يمكنك أيضاً حذف المنتج بالكامل بالضغط على أيقونة السلة الحمراء." 
            : "From the cart page, tap the + button to increase quantity or - to decrease it. You can also delete the product entirely by tapping the red trash icon."
        },
        {
          q: isRTL ? "هل تُضاف الهدايا المجانية تلقائياً؟" : "Are free gifts added automatically?",
          a: isRTL 
            ? "✅ نعم، عند إضافة منتج مشمول بعرض ترويجي (BOGO أو Bundle)، تُضاف المنتجات المجانية تلقائياً إلى السلة مع تفاصيل العرض (المنتجات المطلوبة + الهدية)." 
            : "✅ Yes, when adding a product included in a promo offer (BOGO or Bundle), free items are automatically added to the cart with the offer details (required products + gift)."
        },
      ]
    },

    // ============================================================
    // 3. الدفع
    // ============================================================
    {
      id: "payment",
      icon: CreditCard,
      title: isRTL ? "الدفع" : "Payment",
      questions: [
        {
          q: isRTL ? "ما هي طرق الدفع المتاحة؟" : "What payment methods are available?",
          a: isRTL 
            ? "💰 طريقة الدفع المعتمدة حالياً هي الدفع عند الاستلام (COD) حصراً.\n\n🔮 قد يتم إضافة طرق دفع إلكترونية (بطاقة، محفظة إلكترونية) في المستقبل، وسيتم إشعارك عند تفعيلها." 
            : "💰 The currently accepted payment method is Cash on Delivery (COD) only.\n\n🔮 Electronic payment methods (card, e-wallet) may be added in the future, and you will be notified when activated."
        },
        {
          q: isRTL ? "هل الدفع آمن؟" : "Is payment secure?",
          a: isRTL 
            ? "بما أن الدفع حالياً عند الاستلام، فلا توجد بيانات دفع إلكترونية مخزنة. عند إضافة الدفع الإلكتروني مستقبلاً، سنستخدم أحدث تقنيات التشفير لحماية بياناتك." 
            : "Since payment is currently Cash on Delivery, no electronic payment data is stored. When electronic payment is added in the future, we will use the latest encryption technologies to protect your data."
        },
        {
          q: isRTL ? "هل يمكنني الدفع بالتقسيط؟" : "Can I pay in installments?",
          a: isRTL 
            ? "❌ لا، التقسيط غير متاح حالياً. الدفع عند الاستلام فقط." 
            : "❌ No, installments are not currently available. Cash on Delivery only."
        },
      ]
    },

    // ============================================================
    // 4. الطلبات وحالاتها
    // ============================================================
    {
      id: "orders",
      icon: Package,
      title: isRTL ? "الطلبات وحالاتها" : "Orders & Statuses",
      questions: [
        {
          q: isRTL ? "ما هي مراحل الطلب؟" : "What are the order stages?",
          a: isRTL 
            ? "📌 مراحل الطلب (8 حالات):\n1. ⏳ قيد المراجعة (Pending) — في انتظار موافقة البائع\n2. ✅ مقبول (Accepted) — وافق البائع، وتم توليد رقم التتبع\n3. 🔄 قيد المعالجة (Processing) — جاري تجهيز الطلب\n4. 🚚 تم الشحن (Shipped) — تم تعيين موزع وشحن الطلب\n5. 📦 تم التوصيل (Delivered) — وصل الطلب للعميل\n6. ✅ مكتمل (Completed) — اكتمل الطلب بنجاح\n7. ❌ مرفوض (Rejected) — رفضه البائع (مع ذكر السبب)\n8. 🚫 ملغي (Cancelled) — ألغاه العميل (فقط في مرحلة Pending)" 
            : "📌 Order Lifecycle (8 states):\n1. ⏳ Pending — awaiting seller approval\n2. ✅ Accepted — seller approved, tracking number generated\n3. 🔄 Processing — order being prepared\n4. 🚚 Shipped — distributor assigned and order shipped\n5. 📦 Delivered — order reached the customer\n6. ✅ Completed — order completed successfully\n7. ❌ Rejected — seller rejected (with reason)\n8. 🚫 Cancelled — customer cancelled (only in Pending stage)"
        },
        {
          q: isRTL ? "كيف أتتبع طلبي؟" : "How do I track my order?",
          a: isRTL 
            ? "يمكنك تتبع طلبك من خلال الذهاب إلى 'طلباتي' (My Orders) في حسابك. سيظهر لك:\n• رقم الطلب (#XXXX)\n• رقم التتبع (Tracking Number) — بعد قبول البائع\n• حالة الطلب الحالية\n• تفاصيل التوصيل والموزع" 
            : "You can track your order by going to 'My Orders' in your account. You will see:\n• Order number (#XXXX)\n• Tracking Number — after seller approval\n• Current order status\n• Delivery and distributor details"
        },
        {
          q: isRTL ? "⚠️ هل يمكنني إلغاء طلبي؟" : "⚠️ Can I cancel my order?",
          a: isRTL 
            ? "⏳ يمكنك إلغاء الطلب فقط عندما يكون بحالة 'قيد المراجعة' (Pending) — قبل قبول البائع.\n\n🚫 بعد قبول البائع للطلب (Accepted)، لا يمكن الإلغاء مباشرة — يجب التواصل مع الدعم.\n\n📌 عند الإلغاء:\n• يتم إرسال إشعار للبائع\n• إذا كان الطلب يستخدم كود خصم، يتم استرجاعه تلقائياً" 
            : "⏳ You can cancel the order only when it is in 'Pending' status — before seller approval.\n\n🚫 After the seller accepts the order (Accepted), direct cancellation is not possible — you must contact support.\n\n📌 Upon cancellation:\n• A notification is sent to the seller\n• If the order uses a promo code, it is automatically restored"
        },
        {
          q: isRTL ? "لماذا تم رفض طلبي؟" : "Why was my order rejected?",
          a: isRTL 
            ? "عند رفض البائع للطلب، يجب أن يذكر السبب بوضوح. سيظهر سبب الرفض في:\n• صفحة 'طلباتي' (عند فتح تفاصيل الطلب)\n• الإشعارات\n\nأسباب الرفض الشائعة:\n• المنتج غير متوفر\n• السعر غير صحيح\n• العنوان غير صحيح\n• مشكلة في الدفع" 
            : "When the seller rejects an order, they must clearly state the reason. The rejection reason will appear in:\n• 'My Orders' page (when opening order details)\n• Notifications\n\nCommon rejection reasons:\n• Product unavailable\n• Incorrect price\n• Invalid address\n• Payment issue"
        },
      ]
    },

    // ============================================================
    // 5. التوصيل والتتبع
    // ============================================================
    {
      id: "delivery",
      icon: Truck,
      title: isRTL ? "التوصيل والتتبع" : "Delivery & Tracking",
      questions: [
        {
          q: isRTL ? "كم تستغرق عملية التوصيل؟" : "How long does delivery take?",
          a: isRTL 
            ? "⏰ وقت التوصيل يعتمد على:\n• المسافة بين المتجر وعنوان التوصيل\n• شركة التوصيل المعتمدة\n• ظروف الطريق (ازدحام، طقس)\n\n📌 سيظهر لك الوقت المتوقع عند قبول الطلب من شركة التوصيل." 
            : "⏰ Delivery time depends on:\n• Distance between store and delivery address\n• Approved delivery company\n• Road conditions (traffic, weather)\n\n📌 The estimated time will appear when the delivery company accepts the order."
        },
        {
          q: isRTL ? "كم تكلفة الشحن؟" : "How much does shipping cost?",
          a: isRTL 
            ? "💰 تكلفة الشحن تُحسب بناءً على:\n• المسافة بين المتجر وعنوان التوصيل (Haversine Formula)\n• السعر الأساسي لشركة التوصيل\n• سعر الكيلومتر\n• الحد الأدنى والأقصى للتوصيل\n\n🎁 قد يكون التوصيل مجانياً إذا تجاوز الطلب حداً معيناً (Free Delivery Threshold) يحدده كل متجر." 
            : "💰 Shipping cost is calculated based on:\n• Distance between store and delivery address (Haversine Formula)\n• Delivery company base price\n• Price per km\n• Min and max delivery fee\n\n🎁 Delivery may be free if the order exceeds a certain threshold (Free Delivery Threshold) set by each store."
        },
        {
          q: isRTL ? "📍 لماذا يُطلب موقعي الجغرافي؟" : "📍 Why is my location requested?",
          a: isRTL 
            ? "📍 يُطلب موقعك الجغرافي فقط عند اختيار عنوان التوصيل، لتسهيل حساب المسافة وسعر التوصيل.\n\n⚠️ إذا كانت المسافة بين موقعك الحالي والعنوان المختار أكثر من 10 كم، سيظهر لك تنبيه — يمكنك المتابعة أو تغيير العنوان.\n\n🔒 لا يتم تتبع موقعك باستمرار — فقط عند اختيار العنوان." 
            : "📍 Your location is requested only when selecting a delivery address, to calculate distance and delivery fee.\n\n⚠️ If the distance between your current location and the selected address is more than 10 km, a warning will appear — you can continue or change the address.\n\n🔒 Your location is not continuously tracked — only when selecting an address."
        },
        {
          q: isRTL ? "كيف يتم تعيين الموزع؟" : "How is the distributor assigned?",
          a: isRTL 
            ? "🚚 بعد قبول البائع للطلب، تقوم شركة التوصيل بتعيين موزع مناسب. سيظهر لك:\n• اسم الموزع\n• رقم هاتفه\n• الوقت المتوقع للوصول\n\n📦 يمكنك أيضاً تتبع حالة التوصيل:\nPending → Assigned → Picked up → In Transit → Delivered" 
            : "🚚 After seller approval, the delivery company assigns a suitable distributor. You will see:\n• Distributor name\n• Phone number\n• Estimated delivery time\n\n📦 You can also track delivery status:\nPending → Assigned → Picked up → In Transit → Delivered"
        },
      ]
    },

    // ============================================================
    // 6. كوبونات الخصم والعروض
    // ============================================================
    {
      id: "promo",
      icon: Percent,
      title: isRTL ? "كوبونات الخصم والعروض" : "Promo Codes & Offers",
      questions: [
        {
          q: isRTL ? "كيف أستخدم كود الخصم؟" : "How do I use a promo code?",
          a: isRTL 
            ? "🎫 من صفحة السلة:\n1. أدخل الكود في حقل 'كود الخصم'\n2. اضغط 'تطبيق'\n3. سيظهر الخصم فوراً إذا كان الكود صالحاً\n\n⚠️ قيود:\n• كود واحد فقط لكل طلب\n• قد يكون الكود مخصصاً لمتجر معين\n• يجب أن يتجاوز الطلب الحد الأدنى" 
            : "🎫 From the cart page:\n1. Enter the code in the 'Promo Code' field\n2. Tap 'Apply'\n3. The discount will appear immediately if the code is valid\n\n⚠️ Restrictions:\n• One code per order only\n• Code may be store-specific\n• Order must exceed minimum amount"
        },
        {
          q: isRTL ? "ما أنواع كوبونات الخصم؟" : "What types of promo codes are there?",
          a: isRTL 
            ? "يدعم التطبيق 3 أنواع:\n• 💯 نسبة مئوية (Percentage) — خصم X% من الطلب\n• 💵 مبلغ ثابت (Fixed) — خصم مبلغ معين\n• 🚚 توصيل مجاني (Free Shipping) — إلغاء رسوم التوصيل" 
            : "The app supports 3 types:\n• 💯 Percentage — X% off the order\n• 💵 Fixed — a specific amount discount\n• 🚚 Free Shipping — waive delivery fee"
        },
        {
          q: isRTL ? "ما هي العروض الترويجية؟" : "What are promo offers?",
          a: isRTL 
            ? "🎁 يقدم التطبيق 3 أنواع:\n1. 🎁 اشتر X واحصل على Y مجاناً (BOGO)\n2. 📦 باقة منتجات (Bundle)\n3. 🔄 اشتر منتجاً واحصل على آخر (Cross-sell)\n\n📌 عند إضافة منتج مشمول بعرض، تُضاف الهدايا تلقائياً للسلة.\n\n⏰ العروض محدودة بفترة زمنية." 
            : "🎁 The app offers 3 types:\n1. 🎁 Buy X Get Y Free (BOGO)\n2. 📦 Product Bundle\n3. 🔄 Buy product, get another (Cross-sell)\n\n📌 When adding a product included in an offer, gifts are automatically added to cart.\n\n⏰ Offers are limited to a time period."
        },
        {
          q: isRTL ? "هل يمكنني الجمع بين كود خصم وعرض ترويجي؟" : "Can I combine a promo code with a promo offer?",
          a: isRTL 
            ? "⚠️ لا، لا يمكن الجمع بين أكثر من كود خصم أو عرض ترويجي في طلب واحد، إلا إذا نص العرض على ذلك صراحةً." 
            : "⚠️ No, you cannot combine more than one promo code or promo offer in a single order, unless the offer explicitly states so."
        },
      ]
    },

    // ============================================================
    // 7. التقييمات والشكاوى
    // ============================================================
    {
      id: "reviews",
      icon: Star,
      title: isRTL ? "التقييمات والشكاوى" : "Reviews & Complaints",
      questions: [
        {
          q: isRTL ? "متى يمكنني تقييم المنتج؟" : "When can I rate the product?",
          a: isRTL 
            ? "⭐ يمكنك تقييم المنتج فقط بعد أن يصبح الطلب بحالة 'تم التوصيل' (Delivered) أو 'مكتمل' (Completed).\n\n⚠️ يمكنك تقييم كل طلب مرة واحدة فقط.\n\n📌 التقييم من 1 إلى 5 نجوم، ويظهر في صفحة المنتج." 
            : "⭐ You can rate the product only after the order becomes 'Delivered' or 'Completed'.\n\n⚠️ You can rate each order only once.\n\n📌 Rating is from 1 to 5 stars, and appears on the product page."
        },
        {
          q: isRTL ? "كيف أقدم شكوى؟" : "How do I submit a complaint?",
          a: isRTL 
            ? "📢 من صفحة 'طلباتي':\n1. افتح تفاصيل الطلب\n2. اضغط على زر 'تقديم شكوى'\n3. املأ الموضوع والتفاصيل\n4. اضغط 'إرسال'\n\n📌 سيتم مراجعة الشكوى من قبل فريق الدعم والرد عليك." 
            : "📢 From 'My Orders' page:\n1. Open order details\n2. Tap the 'Submit Complaint' button\n3. Fill in subject and details\n4. Tap 'Submit'\n\n📌 The complaint will be reviewed by the support team and responded to."
        },
      ]
    },

    // ============================================================
    // 8. الإشعارات والمحادثات
    // ============================================================
    {
      id: "notifications",
      icon: Bell,
      title: isRTL ? "الإشعارات والمحادثات" : "Notifications & Chat",
      questions: [
        {
          q: isRTL ? "كيف أفعّل الإشعارات؟" : "How do I enable notifications?",
          a: isRTL 
            ? "🔔 عند فتح التطبيق أول مرة، سيظهر لك تنبيه لتفعيل الإشعارات. اضغط 'تفعيل الآن' واسمح للمتصفح.\n\n📌 يمكنك إلغاء الإشعارات في أي وقت من إعدادات المتصفح أو من التطبيق.\n\n💡 ملاحظة: صوت الإشعار يتطلب تفاعلاً أولياً من المستخدم (سياسة المتصفح)." 
            : "🔔 When you first open the app, a prompt will appear to enable notifications. Tap 'Enable Now' and allow the browser.\n\n📌 You can disable notifications at any time from browser settings or the app.\n\n💡 Note: Notification sound requires initial user interaction (browser policy)."
        },
        {
          q: isRTL ? "كيف أتواصل مع البائع؟" : "How do I contact the seller?",
          a: isRTL 
            ? "💬 يمكنك بدء محادثة مع البائع من:\n• صفحة المنتج (زر 'مراسلة البائع')\n• صفحة 'طلباتي' (زر المحادثة)\n\n📌 المحادثات فورية (Realtime) وتدعم النصوص." 
            : "💬 You can start a chat with the seller from:\n• Product page ('Message Seller' button)\n• 'My Orders' page (chat button)\n\n📌 Chats are realtime and support text."
        },
      ]
    },

    // ============================================================
    // 9. الخصوصية والأمان
    // ============================================================
    {
      id: "security",
      icon: Shield,
      title: isRTL ? "الخصوصية والأمان" : "Privacy & Security",
      questions: [
        {
          q: isRTL ? "كيف تحمي بياناتي؟" : "How do you protect my data?",
          a: isRTL 
            ? "🔒 نتخذ إجراءات أمنية متعددة:\n• تشفير الاتصالات (HTTPS)\n• تخزين كلمات المرور بصيغة مجزّأة (Hashed)\n• التحقق من هوية المستخدم قبل العمليات الحساسة\n• تقييد الصلاحيات وفق دور كل مستخدم\n• عدم بيع البيانات لأي طرف ثالث" 
            : "🔒 We take multiple security measures:\n• HTTPS encryption\n• Hashed password storage\n• User identity verification for sensitive operations\n• Role-based access control\n• No data selling to third parties"
        },
        {
          q: isRTL ? "هل تُشارك بياناتي مع أطراف خارجية؟" : "Is my data shared with third parties?",
          a: isRTL 
            ? "لا تتم مشاركة البيانات الشخصية مع أطراف خارجية إلا:\n• عند الحاجة لتشغيل الخدمات (مثل شركات التوصيل)\n• تنفيذ طلب المستخدم\n• الامتثال لالتزام قانوني\n\n📌 وبالقدر الضروري فقط." 
            : "Personal data is not shared with external parties except:\n• When needed to operate services (e.g., delivery companies)\n• Fulfill user requests\n• Comply with legal obligations\n\n📌 And only to the necessary extent."
        },
      ]
    },

    // ============================================================
    // 10. التواصل والدعم — ✅ مع LTR Mark لمنع انقلاب البريد والرقم
    // ============================================================
    {
      id: "contact",
      icon: MessageCircle,
      title: isRTL ? "التواصل والدعم" : "Contact & Support",
      questions: [
        {
          q: isRTL ? "كيف أتواصل مع فريق الدعم؟" : "How can I contact support?",
          a: isRTL 
            ? `📞 يمكنك التواصل معنا عبر:\n• 📧 البريد الإلكتروني: \u200EM.halabi@ici-sy.com\n• 📱 رقم التواصل: \u200E+963 944 323 352\n\n📌 الجهة المالكة: مؤسسة عمر فلوح التجارية`
            : `📞 You can contact us via:\n• 📧 Email: M.halabi@ici-sy.com\n• 📱 Phone: +963 944 323 352\n\n📌 Owning entity: Omar Falloh Trading Est.`
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a655f]/5 via-[#3a8a82]/5 to-[#4a9f95]/5 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950 py-16">
      <div className="mx-auto max-w-4xl px-4">
        
        {/* الهيدر */}
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

        {/* التصنيفات */}
        <div className="grid gap-6">
          {faqCategories.map((category, catIndex) => (
            <div key={category.id} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-lg overflow-hidden">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 border-b border-[#2a655f]/10 dark:border-[#2a655f]/20">
                <div className="h-8 w-8 rounded-lg bg-[#2a655f]/20 flex items-center justify-center">
                  <category.icon className="h-4 w-4 text-[#2a655f]" />
                </div>
                <h2 className="font-bold text-foreground">{category.title}</h2>
                <span className="text-xs text-muted-foreground ml-auto">
                  {category.questions.length} {isRTL ? "سؤال" : "questions"}
                </span>
              </div>

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
                      
                      <div className={cn(
                        "overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                      )}>
                        <p className="text-sm text-muted-foreground leading-relaxed px-3 pb-3 whitespace-pre-line">
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

        {/* هل لم تجد إجابتك؟ */}
        <div className="mt-12 p-6 text-center bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30">
          <p className="text-foreground font-medium">
            {isRTL ? "🤔 لم تجد إجابتك؟" : "🤔 Didn't find your answer?"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {isRTL 
              ? "تواصل مع فريق الدعم وسنرد عليك في أقرب وقت" 
              : "Contact our support team and we'll reply as soon as possible"}
          </p>
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            <a
              href="mailto:M.halabi@ici-sy.com"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white font-medium hover:shadow-lg hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              {isRTL ? "البريد الإلكتروني" : "Email"}
            </a>
            <a
              href="tel:+963944323352"
              className="px-6 py-2.5 rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] dark:text-[#3a8a82] font-medium hover:bg-[#2a655f]/10 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              {isRTL ? "اتصل بنا" : "Call Us"}
            </a>
          </div>
        </div>

        {/* زر العودة */}
        <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
          <Link to="/" className="text-sm text-[#2a655f] dark:text-[#3a8a82] hover:underline">
            {isRTL ? "← العودة للرئيسية" : "Back to Home →"}
          </Link>
          <span className="text-muted-foreground/30">•</span>
          <Link to="/terms" className="text-sm text-[#2a655f] dark:text-[#3a8a82] hover:underline">
            {isRTL ? "📋 الشروط والأحكام" : "📋 Terms & Conditions"}
          </Link>
          <span className="text-muted-foreground/30">•</span>
          <Link to="/privacy" className="text-sm text-[#2a655f] dark:text-[#3a8a82] hover:underline">
            {isRTL ? "🔒 سياسة الخصوصية" : "🔒 Privacy Policy"}
          </Link>
        </div>
      </div>
    </div>
  );
}