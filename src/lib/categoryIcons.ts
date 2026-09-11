// src/lib/categoryIcons.ts
import * as LucideIcons from "lucide-react";

// ✅ خريطة أسماء الأيقونات إلى Components
export const iconMap: Record<string, any> = {
  // 📱 إلكترونيات
  'smartphone': LucideIcons.Smartphone,
  'laptop': LucideIcons.Laptop,
  'tablet': LucideIcons.Tablet,
  'watch': LucideIcons.Watch,
  'headphones': LucideIcons.Headphones,
  'camera': LucideIcons.Camera,
  'tv': LucideIcons.Tv,
  'speaker': LucideIcons.Speaker,
  'gamepad': LucideIcons.Gamepad2,
  'drone': LucideIcons.Drone,
  'printer': LucideIcons.Printer,
  'router': LucideIcons.Wifi,
  'battery': LucideIcons.Battery,
  'chip': LucideIcons.Cpu,

  // 👕 أزياء (مُصحّحة)
  'shirt': LucideIcons.Shirt,
  'dress': LucideIcons.Shirt,
  'jeans': LucideIcons.ShoppingBag,
  'shoes': LucideIcons.Footprints,
  'boots': LucideIcons.Footprints,
  'hat': LucideIcons.HardHat,
  'glasses': LucideIcons.Glasses,
  'bag': LucideIcons.ShoppingBag,
  'jewelry': LucideIcons.Gem,
  'perfume': LucideIcons.SprayCan,
  'makeup': LucideIcons.Palette,
  'scarf': LucideIcons.Wind,
  'belt': LucideIcons.Circle,
  'socks': LucideIcons.Footprints,
  'tie': LucideIcons.Circle,

  // 🏠 منزل (مُصحّحة)
  'home': LucideIcons.Home,
  'furniture': LucideIcons.Sofa,
  'bed': LucideIcons.Bed,
  'kitchen': LucideIcons.CookingPot,
  'fridge': LucideIcons.Refrigerator,
  'washing': LucideIcons.WashingMachine,
  'ac': LucideIcons.AirVent,
  'heater': LucideIcons.Heater,
  'lamp': LucideIcons.Lamp,
  'tools': LucideIcons.Wrench,
  'vacuum': LucideIcons.Wind,
  'iron': LucideIcons.Zap,
  'fan': LucideIcons.Fan,
  'mirror': LucideIcons.Square,
  'clock': LucideIcons.Clock,

  // 📚 كتب
  'book': LucideIcons.BookOpen,
  'magazine': LucideIcons.Book,
  'notebook': LucideIcons.Notebook,
  'pen': LucideIcons.Pen,
  'pencil': LucideIcons.Pencil,
  'art': LucideIcons.Palette,
  'music': LucideIcons.Music,
  'paper': LucideIcons.FileText,
  'ruler': LucideIcons.Ruler,

  // 🎮 ألعاب (مُصحّحة)
  'toys': LucideIcons.ToyBrick,
  'puzzle': LucideIcons.Puzzle,
  'ball': LucideIcons.Volleyball,
  'bike': LucideIcons.Bike,
  'swim': LucideIcons.Waves,
  'skateboard': LucideIcons.Skateboard, // ⚠️ إذا استمر الخطأ، استبدله بـ LucideIcons.Bike
  'dumbbell': LucideIcons.Dumbbell,

  // 🍕 طعام (مُصحّحة)
  'food': LucideIcons.Utensils,
  'pizza': LucideIcons.Pizza,
  'burger': LucideIcons.Sandwich,
  'coffee': LucideIcons.Coffee,
  'tea': LucideIcons.Coffee,
  'juice': LucideIcons.CupSoda,
  'cake': LucideIcons.Cake,
  'icecream': LucideIcons.IceCream,
  'pasta': LucideIcons.Utensils,
  'sushi': LucideIcons.Fish,

  // 🏥 صحة (مُصحّحة)
  'health': LucideIcons.HeartPulse,
  'medicine': LucideIcons.Pill,
  'stethoscope': LucideIcons.Stethoscope,
  'spa': LucideIcons.Flower2,
  'toothbrush': LucideIcons.Sparkles,
  'soap': LucideIcons.Droplets,

  // 🚗 سيارات (مُصحّحة)
  'car': LucideIcons.Car,
  'truck': LucideIcons.Truck,
  'motorcycle': LucideIcons.Bike,
  'plane': LucideIcons.Plane,
  'ship': LucideIcons.Ship,
  'train': LucideIcons.Train,

  // 🏢 خدمات (مُصحّحة)
  'office': LucideIcons.Building2,
  'bank': LucideIcons.Landmark,
  'shop': LucideIcons.Store,
  'restaurant': LucideIcons.UtensilsCrossed,
  'hotel': LucideIcons.Hotel,
  'school': LucideIcons.School,
  'mosque': LucideIcons.Landmark,
  'church': LucideIcons.Church,

  // 🎯 رياضة (مُصحّحة)
  'sports': LucideIcons.Dumbbell,
  'yoga': LucideIcons.PersonStanding,
  'running': LucideIcons.Footprints,
  'basketball': LucideIcons.Circle,
  'football': LucideIcons.Circle,
  'tennis': LucideIcons.Circle,
  'golf': LucideIcons.Flag,

  // 🌿 طبيعة (مُصحّحة)
  'nature': LucideIcons.TreePine,
  'flower': LucideIcons.Flower2,
  'tree': LucideIcons.TreeDeciduous,
  'mountain': LucideIcons.Mountain,
  'beach': LucideIcons.Umbrella,
  'sun': LucideIcons.Sun,
  'moon': LucideIcons.Moon,
  'star': LucideIcons.Star,
  'animal': LucideIcons.PawPrint,
  'cat': LucideIcons.Cat,
  'dog': LucideIcons.Dog,
  'bird': LucideIcons.Bird,

  // 💰 اقتصاد (مُصحّحة)
  'money': LucideIcons.Banknote,
  'credit': LucideIcons.CreditCard,
  'gift': LucideIcons.Gift,
  'discount': LucideIcons.BadgePercent,
  'barcode': LucideIcons.Barcode,

  // 🌐 عام
  'globe': LucideIcons.Globe,
  'location': LucideIcons.MapPin,
  'calendar': LucideIcons.Calendar,
  'bell': LucideIcons.Bell,
  'email': LucideIcons.Mail,
  'phone': LucideIcons.Phone,
  'chat': LucideIcons.MessageCircle,
  'user': LucideIcons.User,
  'group': LucideIcons.Users,
  'settings': LucideIcons.Settings,
  'heart': LucideIcons.Heart,
  'fire': LucideIcons.Flame,
  'sparkle': LucideIcons.Sparkles,
  'rocket': LucideIcons.Rocket,
  'package': LucideIcons.Package,
  'delivery': LucideIcons.Truck,
  'shield': LucideIcons.Shield,
  'award': LucideIcons.Award,
};

// ✅ دالة للحصول على الأيقونة
export function getCategoryIcon(iconName: string | null | undefined) {
  if (!iconName) return LucideIcons.Package;
  return iconMap[iconName] || LucideIcons.Package;
}