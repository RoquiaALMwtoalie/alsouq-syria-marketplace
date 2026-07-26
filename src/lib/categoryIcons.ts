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
  
  // 👕 أزياء
  'shirt': LucideIcons.Shirt,
  'dress': LucideIcons.Dress,
  'jeans': LucideIcons.Jeans,
  'shoes': LucideIcons.Footprints,
  'boots': LucideIcons.Boot,
  'hat': LucideIcons.Hat,
  'glasses': LucideIcons.Glasses,
  'bag': LucideIcons.Bag,
  'jewelry': LucideIcons.Gem,
  'perfume': LucideIcons.Perfume,
  'makeup': LucideIcons.Makeup,
  'scarf': LucideIcons.Scarf,
  'belt': LucideIcons.Belt,
  'socks': LucideIcons.Socks,
  'tie': LucideIcons.Tie,
  
  // 🏠 منزل
  'home': LucideIcons.Home,
  'furniture': LucideIcons.Sofa,
  'bed': LucideIcons.Bed,
  'kitchen': LucideIcons.Kitchen,
  'fridge': LucideIcons.Fridge,
  'washing': LucideIcons.WashingMachine,
  'ac': LucideIcons.AirVent,
  'heater': LucideIcons.Heater,
  'lamp': LucideIcons.Lamp,
  'tools': LucideIcons.Tools,
  'vacuum': LucideIcons.Vacuum,
  'iron': LucideIcons.Iron,
  'fan': LucideIcons.Fan,
  'mirror': LucideIcons.Mirror,
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
  
  // 🎮 ألعاب
  'toys': LucideIcons.ToyBrick,
  'puzzle': LucideIcons.Puzzle,
  'ball': LucideIcons.Ball,
  'bike': LucideIcons.Bike,
  'swim': LucideIcons.Swimming,
  'skateboard': LucideIcons.Skateboard,
  'dumbbell': LucideIcons.Dumbbell,
  
  // 🍕 طعام
  'food': LucideIcons.Utensils,
  'pizza': LucideIcons.Pizza,
  'burger': LucideIcons.Burger,
  'coffee': LucideIcons.Coffee,
  'tea': LucideIcons.Tea,
  'juice': LucideIcons.Juice,
  'cake': LucideIcons.Cake,
  'icecream': LucideIcons.IceCream,
  'pasta': LucideIcons.Pasta,
  'sushi': LucideIcons.Sushi,
  
  // 🏥 صحة
  'health': LucideIcons.HeartPulse,
  'medicine': LucideIcons.Pill,
  'stethoscope': LucideIcons.Stethoscope,
  'spa': LucideIcons.Spa,
  'toothbrush': LucideIcons.Toothbrush,
  'soap': LucideIcons.Soap,
  
  // 🚗 سيارات
  'car': LucideIcons.Car,
  'truck': LucideIcons.Truck,
  'motorcycle': LucideIcons.Motorcycle,
  'plane': LucideIcons.Plane,
  'ship': LucideIcons.Ship,
  'train': LucideIcons.Train,
  
  // 🏢 خدمات
  'office': LucideIcons.Building2,
  'bank': LucideIcons.Landmark,
  'shop': LucideIcons.Store,
  'restaurant': LucideIcons.Restaurant,
  'hotel': LucideIcons.Hotel,
  'school': LucideIcons.School,
  'mosque': LucideIcons.Mosque,
  'church': LucideIcons.Church,
  
  // 🎯 رياضة
  'sports': LucideIcons.Dumbbell,
  'yoga': LucideIcons.Yoga,
  'running': LucideIcons.Running,
  'basketball': LucideIcons.Basketball,
  'football': LucideIcons.Football,
  'tennis': LucideIcons.Tennis,
  'golf': LucideIcons.Golf,
  
  // 🌿 طبيعة
  'nature': LucideIcons.TreePine,
  'flower': LucideIcons.Flower2,
  'tree': LucideIcons.TreeDeciduous,
  'mountain': LucideIcons.Mountain,
  'beach': LucideIcons.Beach,
  'sun': LucideIcons.Sun,
  'moon': LucideIcons.Moon,
  'star': LucideIcons.Star,
  'animal': LucideIcons.PawPrint,
  'cat': LucideIcons.Cat,
  'dog': LucideIcons.Dog,
  'bird': LucideIcons.Bird,
  
  // 💰 اقتصاد
  'money': LucideIcons.Money,
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