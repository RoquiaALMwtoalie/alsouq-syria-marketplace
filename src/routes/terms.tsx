// src/routes/terms.tsx
// ✅ الشروط والأحكام — مبنية على عمل تطبيق ذوق الفعلي

import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Shield, FileText, CheckCircle, AlertCircle, 
  ShoppingBag, Truck, CreditCard, Scale, Users,
  BookOpen, Zap, Globe, Lock, Mail, Phone,
  Store, Package, Gift, Star, MessageCircle,
  MapPin, Clock, Ban, UserCheck, Crown,
  ArrowLeftRight, Wallet, Percent, Sparkles,
  KeyRound, Bell, Navigation
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  const app = useApp();
  const isRTL = app.lang === "ar";

  const sections = [
    // ============================================================
    // 1. مقدمة
    // ============================================================
    {
      id: "intro",
      icon: FileText,
      title: isRTL ? "1. مقدمة" : "1. Introduction",
      content: isRTL 
        ? `مرحباً بك في تطبيق «ذوق» (Zooq)، منصة إلكترونية تابعة لمؤسسة عمر فلوح التجارية، تربط المتاجر والبائعين بالعملاء عبر شركات توصيل وموزعين معتمدين.\n\nباستخدامك لهذا التطبيق، فإنك توافق على الالتزام بالشروط والأحكام التالية. يرجى قراءتها بعناية قبل استخدام التطبيق.`
        : `Welcome to Zooq, an electronic platform owned by Omar Falloh Trading Est., connecting stores and sellers with customers through approved delivery companies and distributors.\n\nBy using this application, you agree to comply with the following terms and conditions. Please read them carefully before using the application.`
    },

    // ============================================================
    // 2. الحساب والتسجيل
    // ============================================================
    {
      id: "account",
      icon: Users,
      title: isRTL ? "2. الحساب والتسجيل" : "2. Account & Registration",
      content: isRTL 
        ? `✅ التصفح كزائر (Guest Browsing):\n• يمكنك تصفح التطبيق كزائر بدون تسجيل حساب — تصفح المنتجات، العروض، المتاجر، والتصنيفات، والبحث، وعرض تفاصيل أي منتج.\n• 🔐 بعض الميزات تتطلب تسجيل دخول: إضافة للسلة، إتمام طلب، تقييم منتج، مراسلة بائع، إضافة للمفضلة، عرض طلباتي.\n• عند محاولة إضافة منتج للسلة كزائر، سيتم توجيهك لتسجيل الدخول، وبعد التسجيل سيُضاف المنتج تلقائياً للسلة.\n\n📌 شروط الحساب:\n• يجب أن تقدم معلومات صحيحة وكاملة عند إنشاء الحساب (الاسم، رقم الهاتف).\n• أنت المسؤول الوحيد عن الحفاظ على سرية بيانات حسابك وكلمة المرور.\n• لا يجوز مشاركة حسابك مع أي شخص آخر.\n• يحق للإدارة تعليق أو حذف أي حساب يخالف هذه الشروط.\n• يجب أن يكون عمرك 18 عاماً على الأقل لاستخدام التطبيق.\n\n📌 الأدوار المتاحة في التطبيق:\n• 👤 عميل (Customer) — الدور الافتراضي لكل مستخدم جديد\n• 🏪 بائع (Seller) — بعد موافقة الإدارة على طلب فتح متجر\n• 🚚 شركة توصيل (Delivery Company) — بعد موافقة الإدارة\n• 📦 موزع (Distributor) — يُنشئه مدير شركة التوصيل\n• 👑 أدمن (Admin) — إدارة كاملة للنظام\n\n📌 يمكن للمستخدم امتلاك أكثر من دور في نفس الوقت.`
        : `✅ Guest Browsing:\n• You can browse the app as a guest without creating an account — browse products, offers, stores, and categories, search, and view any product details.\n• 🔐 Some features require login: add to cart, complete an order, rate a product, message a seller, add to favorites, view my orders.\n• When trying to add a product to cart as a guest, you will be redirected to login, and after registration, the product will be automatically added to the cart.\n\n📌 Account Terms:\n• You must provide accurate and complete information when creating an account (name, phone number).\n• You are solely responsible for maintaining the confidentiality of your account and password.\n• You may not share your account with any other person.\n• The administration may suspend or delete any account that violates these terms.\n• You must be at least 18 years old to use the application.\n\n📌 Available Roles:\n• 👤 Customer — Default role for every new user\n• 🏪 Seller — After admin approval of a store request\n• 🚚 Delivery Company — After admin approval\n• 📦 Distributor — Created by the delivery company manager\n• 👑 Admin — Full system management\n\n📌 A user can have more than one role at the same time.`
    },

    // ============================================================
    // 3. التسوق وسلة الشراء
    // ============================================================
    {
      id: "cart",
      icon: ShoppingBag,
      title: isRTL ? "3. التسوق وسلة الشراء" : "3. Shopping & Cart",
      content: isRTL 
        ? `• يمكنك إضافة المنتجات إلى سلة الشراء من أي متجر.\n• ⚠️ قيد مهم: السلة تقبل منتجات من متجر واحد فقط. إذا أضفت منتجاً من متجر آخر، سيُطلب منك تفريغ السلة أولاً.\n• يمكنك تعديل كميات المنتجات أو حذفها من السلة في أي وقت.\n• الأسعار معروضة بالليرة السورية (SYP).\n• قد تختلف الصورة المعروضة عن المنتج الفعلي قليلاً.\n• الأسعار قابلة للتغيير من قبل البائع، لكن السعر المثبت في السلة عند الطلب هو السعر المعتمد.\n• عند إضافة منتج مشمول بعرض ترويجي (BOGO)، تُضاف المنتجات المجانية تلقائياً للسلة.`
        : `• You can add products to your cart from any store.\n• ⚠️ Important: The cart accepts products from one store only. If you add a product from another store, you will be asked to clear the cart first.\n• You can modify quantities or delete items from the cart at any time.\n• Prices are displayed in Syrian Pounds (SYP).\n• Displayed images may slightly differ from the actual product.\n• Prices are subject to change by the seller, but the price fixed in the cart at order placement is the adopted price.\n• When adding a product included in a promo offer (BOGO), free items are automatically added to the cart.`
    },

    // ============================================================
    // 4. الطلبات والدفع
    // ============================================================
    {
      id: "orders",
      icon: CreditCard,
      title: isRTL ? "4. الطلبات والدفع" : "4. Orders & Payment",
      content: isRTL 
        ? `• يتم إنشاء الطلب بحالة "قيد المراجعة" (Pending) بعد تأكيده من السلة.\n\n💰 طرق الدفع:\n• طريقة الدفع المعتمدة حالياً هي الدفع عند الاستلام (COD) حصراً.\n• 🔮 قد يتم إضافة طرق دفع إلكترونية (بطاقة، محفظة إلكترونية، إلخ) في المستقبل، وسيتم إشعارك بذلك عند تفعيلها.\n• 📌 عند إضافة طرق دفع جديدة، ستُحدَّث هذه الشروط تلقائياً وتُطبَّق على الطلبات الجديدة فقط.\n\n📌 قبول ورفض الطلب:\n• يحق للبائع قبول أو رفض الطلب. في حال الرفض، يجب ذكر السبب بوضوح.\n• في حال قبول الطلب، يتم توليد رقم تتبع (Tracking Number) فريد.\n\n📌 مراحل الطلب (8 حالات):\n1. ⏳ قيد المراجعة (Pending) — في انتظار موافقة البائع\n2. ✅ مقبول (Accepted) — وافق البائع، وتم توليد رقم التتبع\n3. 🔄 قيد المعالجة (Processing) — جاري تجهيز الطلب\n4. 🚚 تم الشحن (Shipped) — تم تعيين موزع وشحن الطلب\n5. 📦 تم التوصيل (Delivered) — وصل الطلب للعميل\n6. ✅ مكتمل (Completed) — اكتمل الطلب بنجاح\n7. ❌ مرفوض (Rejected) — رفضه البائع (مع ذكر السبب)\n8. 🚫 ملغي (Cancelled) — ألغاه العميل (فقط في مرحلة Pending)`
        : `• The order is created with "Pending" status after confirmation from the cart.\n\n💰 Payment Methods:\n• The currently accepted payment method is Cash on Delivery (COD) only.\n• 🔮 Electronic payment methods (card, e-wallet, etc.) may be added in the future, and you will be notified when they are activated.\n• 📌 When new payment methods are added, these terms will be updated automatically and will apply only to new orders.\n\n📌 Order Acceptance & Rejection:\n• The seller has the right to accept or reject the order. In case of rejection, the reason must be clearly stated.\n• If the order is accepted, a unique tracking number is generated.\n\n📌 Order Lifecycle (8 states):\n1. ⏳ Pending — awaiting seller approval\n2. ✅ Accepted — seller approved, tracking number generated\n3. 🔄 Processing — order being prepared\n4. 🚚 Shipped — distributor assigned and order shipped\n5. 📦 Delivered — order reached the customer\n6. ✅ Completed — order completed successfully\n7. ❌ Rejected — seller rejected (with reason)\n8. 🚫 Cancelled — customer cancelled (only in Pending stage)`
    },

    // ============================================================
    // 5. الإلغاء والرفض
    // ============================================================
    {
      id: "cancel",
      icon: Ban,
      title: isRTL ? "5. إلغاء الطلب ورفضه" : "5. Order Cancellation & Rejection",
      content: isRTL 
        ? `• ⏳ يمكنك إلغاء الطلب فقط عندما يكون بحالة "قيد المراجعة" (Pending).\n• 🚫 بعد قبول البائع للطلب (Accepted)، لا يمكن الإلغاء مباشرة — يجب التواصل مع الدعم.\n• في حال الرفض من البائع، سيتم إرسال سبب الرفض إليك في الإشعارات.\n• عند إلغاء الطلب، يتم إرسال إشعار للبائع.\n• إذا كان الطلب يستخدم كود خصم، يتم استرجاع الكود تلقائياً عند الإلغاء (يُخصم من used_count، ويُحذف من promo_code_usage).\n• يتم حجز المخزون مؤقتاً عند الطلب، ويُحرر عند الإلغاء/الرفض.`
        : `• ⏳ You can cancel the order only when it is in "Pending" status.\n• 🚫 After the seller accepts the order (Accepted), direct cancellation is not possible — you must contact support.\n• In case of rejection by the seller, the rejection reason will be sent to you via notifications.\n• When an order is cancelled, a notification is sent to the seller.\n• If the order uses a promo code, the code is automatically restored upon cancellation (used_count is decremented, and promo_code_usage record is deleted).\n• Stock is temporarily reserved upon ordering and released upon cancellation/rejection.`
    },

    // ============================================================
    // 6. التوصيل والتتبع
    // ============================================================
    {
      id: "delivery",
      icon: Truck,
      title: isRTL ? "6. التوصيل والتتبع" : "6. Delivery & Tracking",
      content: isRTL 
        ? `• يتم التوصيل عبر شركات توصيل معتمدة وموزعين.\n• يُحسب سعر التوصيل بناءً على المسافة بين المتجر وعنوان التوصيل (Haversine Formula).\n• قد يكون التوصيل مجانياً إذا تجاوز الطلب حداً معيناً (Free Delivery Threshold) يحدده كل متجر.\n• 📍 يُطلب منك تحديد موقعك الجغرافي على الخريطة لتحديد عنوان التوصيل.\n• ⚠️ إذا كانت المسافة بين موقعك الحالي والعنوان المختار أكثر من 10 كم، سيظهر لك تنبيه — يمكنك المتابعة أو تغيير العنوان.\n• يمكنك تتبع طلبك عبر رقم التتبع (Tracking Number) الذي سيظهر في صفحة "طلباتي".\n• أنت مسؤول عن توفير عنوان صحيح وتفاصيل واضحة (رقم الطابق، الشقة، معلم قريب).\n• قد يتأخر التوصيل بسبب ظروف خارجة عن إرادتنا (طقس، ازدحام، إلخ).\n\n📌 حالات التوصيل الداخلية:\n• ⏳ Pending → 📌 Assigned → 📦 Picked up → 🚚 In Transit → ✅ Delivered`
        : `• Delivery is performed via approved delivery companies and distributors.\n• Delivery fee is calculated based on the distance between the store and the delivery address (Haversine Formula).\n• Delivery may be free if the order exceeds a certain threshold set by each store (Free Delivery Threshold).\n• 📍 You will be asked to set your geographic location on the map to determine the delivery address.\n• ⚠️ If the distance between your current location and the selected address is more than 10 km, a warning will appear — you can continue or change the address.\n• You can track your order via the Tracking Number that appears on the "My Orders" page.\n• You are responsible for providing a correct address and clear details (floor number, apartment, nearby landmark).\n• Delivery may be delayed due to circumstances beyond our control (weather, traffic, etc.).\n\n📌 Internal Delivery Statuses:\n• ⏳ Pending → 📌 Assigned → 📦 Picked up → 🚚 In Transit → ✅ Delivered`
    },

    // ============================================================
    // 7. كوبونات الخصم
    // ============================================================
    {
      id: "promo",
      icon: Percent,
      title: isRTL ? "7. كوبونات الخصم" : "7. Promo Codes",
      content: isRTL 
        ? `• يمكنك تطبيق كود خصم واحد فقط لكل طلب.\n• أنواع الكوبونات:\n  • 💯 نسبة مئوية (Percentage)\n  • 💵 مبلغ ثابت (Fixed)\n  • 🚚 توصيل مجاني (Free Shipping)\n• قد يكون الكود مخصصاً لمتجر معين — لا يمكن استخدامه في متاجر أخرى.\n• لكل كود:\n  • حد أدنى للطلب (Min Order)\n  • حد أقصى للخصم (Max Discount)\n  • حد لعدد الاستخدامات (Usage Limit)\n  • تاريخ بداية ونهاية\n• لا يمكن الجمع بين أكثر من كود خصم في طلب واحد.\n• عند إلغاء الطلب، يتم استرجاع استخدام الكود تلقائياً.\n• لا يمكن تطبيق كود الخصم إذا كان الطلب يحتوي على منتجات من متجر مختلف.`
        : `• You can apply only one promo code per order.\n• Promo code types:\n  • 💯 Percentage\n  • 💵 Fixed amount\n  • 🚚 Free Shipping\n• A code may be store-specific — it cannot be used in other stores.\n• Each code has:\n  • Minimum order (Min Order)\n  • Maximum discount (Max Discount)\n  • Usage limit (Usage Limit)\n  • Start and end date\n• You cannot combine more than one promo code in a single order.\n• Upon order cancellation, the code usage is automatically restored.\n• Promo codes cannot be applied if the order contains products from a different store.`
    },

    // ============================================================
    // 8. العروض الترويجية
    // ============================================================
    {
      id: "offers",
      icon: Gift,
      title: isRTL ? "8. العروض الترويجية" : "8. Promo Offers",
      content: isRTL 
        ? `• يقدم التطبيق 3 أنواع من العروض الترويجية:\n  1. 🎁 اشتر X واحصل على Y مجاناً (BOGO)\n  2. 📦 باقة منتجات (Bundle)\n  3. 🔄 اشتر منتجاً واحصل على آخر (Cross-sell)\n• العروض محدودة بفترة زمنية (Start & Expiry Date).\n• بعض العروض مرتبطة بتركيبات محددة (Variations) من المنتج.\n• عند إضافة منتج مشمول بعرض ترويجي، يُضاف تلقائياً إلى السلة مع تفاصيل العرض (المنتجات المطلوبة + الهدية).\n• يحق للبائع إيقاف العرض في أي وقت.\n• العروض لا تُجمع مع كوبونات الخصم إلا إذا نص العرض على ذلك.`
        : `• The app offers 3 types of promo offers:\n  1. 🎁 Buy X Get Y Free (BOGO)\n  2. 📦 Product Bundle\n  3. 🔄 Buy product, get another (Cross-sell)\n• Offers are limited to a time period (Start & Expiry Date).\n• Some offers are tied to specific variations of the product.\n• When you add a product included in a promo offer, it is automatically added to the cart with the offer details (required products + gift).\n• The seller has the right to stop the offer at any time.\n• Offers are not combined with promo codes unless the offer specifies so.`
    },

    // ============================================================
    // 9. التقييمات والشكاوى
    // ============================================================
    {
      id: "reviews",
      icon: Star,
      title: isRTL ? "9. التقييمات والشكاوى" : "9. Reviews & Complaints",
      content: isRTL 
        ? `• ⭐ التقييم متاح فقط بعد أن يصبح الطلب "تم التوصيل" (Delivered) أو "مكتمل" (Completed).\n• ⚠️ يمكنك تقييم كل طلب مرة واحدة فقط.\n• التقييم من 1 إلى 5 نجوم، ويظهر في صفحة المنتج.\n• يمكنك تقديم شكوى على أي طلب عبر زر "تقديم شكوى" في صفحة "طلباتي".\n• تُحفظ الشكوى مع الموضوع والتفاصيل، ويتم الرد عليها من قبل فريق الدعم.\n• يحق للإدارة حذف أي تقييم مسيء أو غير حقيقي.`
        : `• ⭐ Rating is available only after the order becomes "Delivered" or "Completed".\n• ⚠️ You can rate each order only once.\n• Rating is from 1 to 5 stars, and appears on the product page.\n• You can submit a complaint on any order via the "Submit Complaint" button in the "My Orders" page.\n• The complaint is saved with subject and details, and responded to by the support team.\n• The administration may delete any offensive or false review.`
    },

    // ============================================================
    // 10. الإشعارات والموقع الجغرافي
    // ============================================================
    {
      id: "notifications",
      icon: MapPin,
      title: isRTL ? "10. الإشعارات والموقع الجغرافي" : "10. Notifications & Location",
      content: isRTL 
        ? `• 🔔 إشعارات المتصفح (Push Notifications) تتطلب موافقتك الصريحة.\n• يتم إرسال إشعارات فورية (Realtime) عند:\n  • استلام طلب جديد\n  • تغيير حالة الطلب (accepted, shipped, delivered, rejected, cancelled)\n  • استلام رسالة جديدة\n• يمكنك تفعيل/إلغاء الإشعارات من إعدادات المتصفح أو من التطبيق.\n• 📍 يُطلب منك الموقع الجغرافي لتحديد عنوان التوصيل فقط.\n• لا يتم تتبع موقعك باستمرار — فقط عند اختيار العنوان.\n• يتم تخزين إحداثيات العنوان (Lat/Lng) لتسهيل التوصيل.\n• يوجد صوت إشعار (notification.mp3) — يتطلب تفاعلاً أولياً من المستخدم (سياسة المتصفح).`
        : `• 🔔 Browser notifications (Push Notifications) require your explicit consent.\n• Realtime notifications are sent upon:\n  • Receiving a new order\n  • Order status change (accepted, shipped, delivered, rejected, cancelled)\n  • Receiving a new message\n• You can enable/disable notifications from browser settings or the app.\n• 📍 Your geographic location is requested only to determine the delivery address.\n• Your location is not continuously tracked — only when selecting an address.\n• Address coordinates (Lat/Lng) are stored to facilitate delivery.\n• There is a notification sound (notification.mp3) — requires initial user interaction (browser policy).`
    },

    // ============================================================
    // 11. المحادثات
    // ============================================================
    {
      id: "chat",
      icon: MessageCircle,
      title: isRTL ? "11. المحادثات" : "11. Chat",
      content: isRTL 
        ? `• يوفّر التطبيق نظام محادثات بين:\n  • العميل والبائع\n  • العميل والموزع\n  • البائع وشركة التوصيل\n• يمكنك بدء محادثة من صفحة المنتج أو من صفحة "طلباتي".\n• يُحظر استخدام المحادثات للإعلانات أو المحتوى المسيء أو غير القانوني.\n• يحق للإدارة مراجعة المحادثات عند وجود شكوى.\n• لا يمكن مراسلة نفسك.\n• يمكن حذف المحادثة من قبل الطرفين.`
        : `• The app provides a chat system between:\n  • Customer and Seller\n  • Customer and Distributor\n  • Seller and Delivery Company\n• You can start a chat from the product page or from the "My Orders" page.\n• Using chats for advertising, offensive, or illegal content is prohibited.\n• The administration may review chats in case of a complaint.\n• You cannot message yourself.\n• Chats can be deleted by either party.`
    },

    // ============================================================
    // 12. أدوار البائع وشركة التوصيل والموزع
    // ============================================================
    {
      id: "roles",
      icon: UserCheck,
      title: isRTL ? "12. أدوار البائع وشركة التوصيل والموزع" : "12. Seller, Delivery Company & Distributor Roles",
      content: isRTL 
        ? `🏪 البائع (Seller):\n• يجب التقدم بطلب فتح متجر والحصول على موافقة الإدارة.\n• يجب الالتزام بدقة معلومات المنتجات (السعر، الوصف، الصور).\n• يحق للبائع قبول أو رفض الطلبات مع ذكر السبب.\n• يحق للبائع إضافة عروض ترويجية وتخفيضات.\n\n🚚 شركة التوصيل (Delivery Company):\n• يجب الحصول على موافقة الإدارة.\n• مسؤولة عن تعيين الموزعين وإدارة الطلبات.\n• يجب عليها الالتزام بأوقات التوصيل المتفق عليها.\n\n📦 الموزع (Distributor):\n• يُنشئه مدير شركة التوصيل.\n• مسؤول عن توصيل الطلبات للعملاء.\n• يجب عليه تحديث حالة الطلب (picked_up → in_transit → delivered).\n• لا يمكن تعطيل موزع لديه طلبات نشطة.`
        : `🏪 Seller:\n• Must apply to open a store and obtain admin approval.\n• Must maintain accurate product information (price, description, images).\n• Has the right to accept or reject orders with a stated reason.\n• May add promo offers and discounts.\n\n🚚 Delivery Company:\n• Must obtain admin approval.\n• Responsible for assigning distributors and managing orders.\n• Must adhere to agreed delivery times.\n\n📦 Distributor:\n• Created by the delivery company manager.\n• Responsible for delivering orders to customers.\n• Must update order status (picked_up → in_transit → delivered).\n• A distributor with active orders cannot be deactivated.`
    },

    // ============================================================
    // 13. الملكية الفكرية
    // ============================================================
    {
      id: "intellectual",
      icon: Lock,
      title: isRTL ? "13. الملكية الفكرية" : "13. Intellectual Property",
      content: isRTL 
        ? `• جميع المحتويات في التطبيق (النصوص، الصور، الشعارات، التصميم) محمية بحقوق النشر.\n• لا يجوز نسخ أو استخدام أي محتوى دون إذن مسبق من الإدارة.\n• العلامات التجارية والاسم التجاري "ذوق" مملوكة لمؤسسة عمر فلوح التجارية.\n• محتوى المتاجر (صور المنتجات، الأوصاف) مملوك لأصحابها، وهم مسؤولون عنه.`
        : `• All content in the application (texts, images, logos, design) is protected by copyright.\n• No content may be copied or used without prior permission from the administration.\n• Trademarks and trade name "Zooq" are owned by Omar Falloh Trading Est.\n• Store content (product images, descriptions) is owned by its respective owners, who are responsible for it.`
    },

    // ============================================================
    // 14. إخلاء المسؤولية
    // ============================================================
    {
      id: "disclaimer",
      icon: AlertCircle,
      title: isRTL ? "14. إخلاء المسؤولية" : "14. Disclaimer",
      content: isRTL 
        ? `• التطبيق يقدم "كما هو" دون أي ضمانات صريحة أو ضمنية.\n• المنصة (ذوق) هي وسيط بين البائع والعميل — نحن لسنا طرفاً في العقد المباشر بينهما.\n• لسنا مسؤولين عن جودة المنتجات أو مطابقتها للوصف — هذه مسؤولية البائع.\n• لسنا مسؤولين عن أي أضرار ناتجة عن سوء استخدام التطبيق.\n• لا نضمن توفر جميع المنتجات في جميع الأوقات.\n• لا نضمن دقة المعلومات المقدمة من البائعين أو شركات التوصيل.`
        : `• The application is provided "as is" without any express or implied warranties.\n• The platform (Zooq) is an intermediary between seller and customer — we are not a party to the direct contract between them.\n• We are not responsible for product quality or description accuracy — that is the seller's responsibility.\n• We are not liable for any damages resulting from misuse of the application.\n• We do not guarantee the availability of all products at all times.\n• We do not guarantee the accuracy of information provided by sellers or delivery companies.`
    },

    // ============================================================
    // 15. التعديلات على الشروط
    // ============================================================
    {
      id: "changes",
      icon: Zap,
      title: isRTL ? "15. التعديلات على الشروط" : "15. Changes to Terms",
      content: isRTL 
        ? `• نحتفظ بالحق في تعديل هذه الشروط في أي وقت.\n• سيتم إخطارك بأي تغييرات جوهرية عبر الإشعارات.\n• استمرارك في استخدام التطبيق بعد التعديلات يعني موافقتك عليها.\n• يُنصح بمراجعة هذه الصفحة دورياً.`
        : `• We reserve the right to modify these terms at any time.\n• You will be notified of any material changes via notifications.\n• Your continued use of the application after modifications means you agree to them.\n• It is recommended to review this page periodically.`
    },

    // ============================================================
    // 16. القانون الحاكم
    // ============================================================
    {
      id: "law",
      icon: Scale,
      title: isRTL ? "16. القانون الحاكم" : "16. Governing Law",
      content: isRTL 
        ? `• تخضع هذه الشروط والأحكام لقوانين الجمهورية العربية السورية.\n• أي نزاع ينشأ عن استخدام التطبيق يحال إلى المحاكم السورية المختصة.\n• نطاق الخدمة: الجمهورية العربية السورية فقط.`
        : `• These terms and conditions are governed by the laws of the Syrian Arab Republic.\n• Any dispute arising from the use of the application shall be referred to the competent Syrian courts.\n• Service scope: Syrian Arab Republic only.`
    },

    // ============================================================
    // 17. التواصل معنا — ✅ مع LTR Mark لمنع انقلاب البريد والرقم
    // ============================================================
    {
      id: "contact",
      icon: Mail,
      title: isRTL ? "17. التواصل معنا" : "17. Contact Us",
      content: isRTL 
        ? `• الجهة المالكة والمسؤولة عن التطبيق: مؤسسة عمر فلوح التجارية.\n• البريد الإلكتروني: \u200EM.halabi@ici-sy.com\n• رقم التواصل: \u200E+963 944 323 352`
        : `• The entity owning and responsible for the app: Omar Falloh Trading Est.\n• Email: M.halabi@ici-sy.com\n• Phone: +963 944 323 352`
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a655f]/5 via-[#3a8a82]/5 to-[#4a9f95]/5 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950 py-16">
      <div className="mx-auto max-w-4xl px-4">
        
        {/* الهيدر */}
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

        {/* المحتوى */}
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

        {/* زر الموافقة */}
        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white font-medium hover:shadow-lg hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105">
            <CheckCircle className="h-5 w-5" />
            {isRTL ? "أوافق على الشروط والأحكام" : "I Agree to Terms & Conditions"}
          </Link>
        </div>

        {/* زر العودة */}
        <div className="mt-4 flex items-center justify-center gap-4 flex-wrap">
          <Link to="/" className="text-sm text-[#2a655f] dark:text-[#3a8a82] hover:underline">
            {isRTL ? "← العودة للرئيسية" : "Back to Home →"}
          </Link>
          <span className="text-muted-foreground/30">•</span>
          <Link to="/privacy" className="text-sm text-[#2a655f] dark:text-[#3a8a82] hover:underline">
            {isRTL ? "📋 سياسة الخصوصية" : "📋 Privacy Policy"}
          </Link>
        </div>
      </div>
    </div>
  );
}