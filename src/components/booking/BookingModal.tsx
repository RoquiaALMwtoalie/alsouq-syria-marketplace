import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { formatPrice, useT, useApp } from "@/lib/i18n";
import { 
  CalendarDays, 
  Users, 
  Clock, 
  Check, 
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Info,
  Shield,
  CreditCard,
  MapPin,
  Loader2,
  XCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isBefore, startOfDay, parseISO } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: any;
  storeName: string;
  onConfirm: (data: any) => void;
  isLoading?: boolean;
}

// ✅ الأوقات المتاحة (كل 30 دقيقة)
const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30",
  "21:00", "21:30", "22:00"
];

interface Service {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  listing_id: string;
}

export function BookingModal({ 
  isOpen, 
  onClose, 
  listing, 
  storeName,
  onConfirm,
  isLoading = false
}: BookingModalProps) {
  const app = useApp();
  const t = useT();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  
  // ✅ بيانات المتجر من قاعدة البيانات
  const [storeOffDays, setStoreOffDays] = useState<string[]>([]);
  const [storeOpenTime, setStoreOpenTime] = useState<string>("09:00");
  const [storeCloseTime, setStoreCloseTime] = useState<string>("22:00");
  const [storeDataLoaded, setStoreDataLoaded] = useState(false);
  
  // ✅ الخدمات الإضافية
  const [services, setServices] = useState<Service[]>([]);
  const [basePrice, setBasePrice] = useState<number>(0);

  // ============================================================
  // 1️⃣ جلب بيانات المتجر
  // ============================================================
  useEffect(() => {
    async function fetchStoreData() {
      if (!listing?.owner_id) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("weekly_off_days, store_opens_at, store_closes_at, allows_bookings")
          .eq("id", listing.owner_id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setStoreOffDays(data.weekly_off_days || []);
          if (data.store_opens_at) setStoreOpenTime(data.store_opens_at);
          if (data.store_closes_at) setStoreCloseTime(data.store_closes_at);
          setStoreDataLoaded(true);
          
          if (!data.allows_bookings) {
            toast.warning(
              app.lang === "ar" 
                ? "⚠️ هذا المتجر لا يسمح بالحجز حالياً" 
                : "⚠️ This store does not allow bookings at the moment"
            );
          }
        }
      } catch (error) {
        console.error("❌ Error fetching store data:", error);
        setStoreDataLoaded(true);
      }
    }

    if (isOpen) {
      fetchStoreData();
    }
  }, [isOpen, listing?.owner_id, app.lang]);

  // ============================================================
  // 2️⃣ جلب السعر الأساسي
  // ============================================================
  useEffect(() => {
    if (listing?.price) {
      setBasePrice(Number(listing.price));
    }
  }, [listing?.price]);

  // ============================================================
  // 3️⃣ جلب الخدمات الإضافية
  // ============================================================
  useEffect(() => {
    async function fetchServices() {
      if (!listing?.id) return;
      
      setLoadingServices(true);
      try {
        const { data, error } = await supabase
          .from("product_options")
          .select("id, option_value, option_label_ar, option_label_en")
          .eq("listing_id", listing.id)
          .eq("option_type", "service")
          .order("sort_order", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          const servicesList = data.map((item: any) => ({
            id: item.id,
            name_ar: item.option_label_ar || item.option_value,
            name_en: item.option_label_en || item.option_value,
            price: 0,
            listing_id: listing.id
          }));
          setServices(servicesList);
        } else {
          setServices([
            { id: "basic", name_ar: "خدمة أساسية", name_en: "Basic Service", price: 0, listing_id: listing.id },
            { id: "premium", name_ar: "خدمة مميزة", name_en: "Premium Service", price: 50, listing_id: listing.id },
            { id: "vip", name_ar: "خدمة VIP", name_en: "VIP Service", price: 100, listing_id: listing.id },
          ]);
        }
      } catch (error) {
        console.error("❌ Error fetching services:", error);
        setServices([
          { id: "basic", name_ar: "خدمة أساسية", name_en: "Basic Service", price: 0, listing_id: listing.id || "" },
          { id: "premium", name_ar: "خدمة مميزة", name_en: "Premium Service", price: 50, listing_id: listing.id || "" },
          { id: "vip", name_ar: "خدمة VIP", name_en: "VIP Service", price: 100, listing_id: listing.id || "" },
        ]);
      } finally {
        setLoadingServices(false);
      }
    }

    if (isOpen && listing?.id) {
      fetchServices();
    }
  }, [isOpen, listing?.id]);

  // ============================================================
  // 4️⃣ جلب الأوقات المحجوزة
  // ============================================================
  useEffect(() => {
    async function fetchBookedSlots() {
      if (!selectedDate || !listing?.id) return;
      
      setLoadingSlots(true);
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
          .from("bookings")
          .select("starts_at")
          .eq("listing_id", listing.id)
          .neq("status", "cancelled")
          .gte("starts_at", startOfDay.toISOString())
          .lte("starts_at", endOfDay.toISOString());

        if (error) throw error;

        const booked = data.map((booking: any) => {
          const date = new Date(booking.starts_at);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          return `${hours}:${minutes}`;
        });

        setBookedSlots(booked);
      } catch (error) {
        console.error("❌ Error fetching booked slots:", error);
      } finally {
        setLoadingSlots(false);
      }
    }

    fetchBookedSlots();
  }, [selectedDate, listing?.id]);

  // ============================================================
  // 5️⃣ دوال مساعدة
  // ============================================================

  const isOffDay = (date: Date): boolean => {
    if (!storeOffDays || storeOffDays.length === 0) return false;
    
    const dayNames: Record<number, string> = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    };
    
    const dayName = dayNames[date.getDay()];
    return storeOffDays.includes(dayName);
  };

  const disabledDates = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return true;
    if (isOffDay(date)) return true;
    return false;
  };

  const isWithinWorkingHours = (time: string): boolean => {
    const [hours, minutes] = time.split(':').map(Number);
    const timeMinutes = hours * 60 + minutes;
    
    const [openHours, openMinutes] = storeOpenTime.split(':').map(Number);
    const [closeHours, closeMinutes] = storeCloseTime.split(':').map(Number);
    
    const openMinutesTotal = openHours * 60 + openMinutes;
    const closeMinutesTotal = closeHours * 60 + closeMinutes;
    
    return timeMinutes >= openMinutesTotal && timeMinutes <= closeMinutesTotal;
  };

  const calculateTotal = () => {
    let total = basePrice * guests;
    const service = services.find(s => s.id === selectedService);
    if (service) total += service.price;
    return total;
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setGuests(1);
    setNotes("");
    setSelectedService("");
    setBookedSlots([]);
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast.error(app.lang === "ar" ? "الرجاء اختيار التاريخ والوقت" : "Please select date and time");
      return;
    }
    
    if (bookedSlots.includes(selectedTime)) {
      toast.error(app.lang === "ar" ? "⚠️ هذا الوقت محجوز بالفعل" : "⚠️ This time slot is already booked");
      return;
    }
    
    if (!isWithinWorkingHours(selectedTime)) {
      toast.error(app.lang === "ar" ? "⚠️ هذا الوقت خارج ساعات العمل" : "⚠️ This time is outside working hours");
      return;
    }
    
    if (isOffDay(selectedDate)) {
      toast.error(app.lang === "ar" ? "⚠️ هذا اليوم عطلة في المتجر" : "⚠️ This day is an off day");
      return;
    }
    
    onConfirm({
      startDate: selectedDate,
      endDate: selectedDate,
      time: selectedTime,
      guests,
      notes,
      service: selectedService,
      total: calculateTotal(),
    });
  };

  const nextStep = () => {
    if (step === 1) {
      if (!selectedDate) {
        toast.error(app.lang === "ar" ? "الرجاء اختيار التاريخ" : "Please select a date");
        return;
      }
      if (!selectedTime) {
        toast.error(app.lang === "ar" ? "الرجاء اختيار الوقت" : "Please select a time");
        return;
      }
      if (isOffDay(selectedDate)) {
        toast.error(app.lang === "ar" ? "⚠️ هذا اليوم عطلة في المتجر، اختر يوماً آخر" : "⚠️ This day is an off day, please choose another day");
        return;
      }
      if (!isWithinWorkingHours(selectedTime)) {
        toast.error(app.lang === "ar" ? "⚠️ هذا الوقت خارج ساعات العمل" : "⚠️ This time is outside working hours");
        return;
      }
      if (bookedSlots.includes(selectedTime)) {
        toast.error(app.lang === "ar" ? "⚠️ هذا الوقت محجوز، اختر وقتاً آخر" : "⚠️ This time is already booked");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const formatDate = (date: Date) => {
    return format(date, "EEEE, d MMMM yyyy", {
      locale: app.lang === "ar" ? arSA : enUS
    });
  };

  const translateDay = (day: string): string => {
    const map: Record<string, string> = {
      'Monday': 'الإثنين',
      'Tuesday': 'الثلاثاء',
      'Wednesday': 'الأربعاء',
      'Thursday': 'الخميس',
      'Friday': 'الجمعة',
      'Saturday': 'السبت',
      'Sunday': 'الأحد'
    };
    return app.lang === 'ar' ? map[day] || day : day;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* ===== HEADER ===== */}
        <DialogHeader className="p-6 pb-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="text-xl">
                  {app.lang === "ar" ? "حجز خدمة" : "Book Service"}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {app.lang === "ar" 
                    ? `احجز خدمة ${listing.title_ar} من ${storeName}` 
                    : `Book ${listing.title_en || listing.title_ar} from ${storeName}`}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                    step >= s 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
                      : "bg-slate-200 dark:bg-slate-700 text-muted-foreground"
                  )}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={cn(
                      "w-8 h-0.5 transition-all",
                      step > s ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* ===== CONTENT ===== */}
        <div className="p-6">
          {/* ✅ الخطوة 1: اختيار التاريخ والوقت */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {app.lang === "ar" ? "اختر التاريخ والوقت" : "Select Date & Time"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {app.lang === "ar" ? "اختر الموعد المناسب لك" : "Choose your preferred time"}
                  </p>
                  {storeOffDays.length > 0 && (
                    <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50">
                      <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {app.lang === "ar" ? "أيام العطل: " : "Off days: "}
                        <span className="font-medium">{storeOffDays.map(translateDay).join(', ')}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {app.lang === "ar" ? "ساعات العمل: " : "Working hours: "}
                        <span className="font-medium">{storeOpenTime} - {storeCloseTime}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* ✅ التقويم */}
                <div className="border rounded-xl p-4 bg-card">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDates}
                    initialFocus
                    className="rounded-md"
                    locale={app.lang === "ar" ? arSA : enUS}
                    components={{
                      IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                      IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                    }}
                  />
                  {selectedDate && isOffDay(selectedDate) && (
                    <div className="mt-2 p-2 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200/50 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                        {app.lang === "ar" ? "❌ هذا اليوم عطلة في المتجر" : "❌ This day is an off day"}
                      </p>
                    </div>
                  )}
                  {selectedDate && !isOffDay(selectedDate) && (
                    <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200/50 flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {app.lang === "ar" ? "✅ هذا اليوم متاح للحجز" : "✅ This day is available for booking"}
                      </p>
                    </div>
                  )}
                </div>

                {/* ✅ الأوقات المتاحة */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {app.lang === "ar" ? "الأوقات المتاحة" : "Available Times"}
                    </Label>
                    {selectedDate && (
                      <span className="text-xs text-muted-foreground">
                        {formatDate(selectedDate)}
                      </span>
                    )}
                  </div>
                  
                  {selectedDate ? (
                    loadingSlots ? (
                      <div className="flex items-center justify-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-1">
                        {TIME_SLOTS.map((time) => {
                          const isBooked = bookedSlots.includes(time);
                          const isSelected = selectedTime === time;
                          const isWithinHours = isWithinWorkingHours(time);
                          const isDisabled = isBooked || !isWithinHours || (selectedDate && isOffDay(selectedDate));
                          
                          return (
                            <button
                              key={time}
                              onClick={() => !isDisabled && setSelectedTime(time)}
                              disabled={isDisabled}
                              className={cn(
                                "py-2.5 rounded-lg border-2 text-sm font-medium transition-all relative",
                                isSelected && !isDisabled
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 shadow-md shadow-emerald-500/20"
                                  : isBooked
                                  ? "border-red-200 bg-red-50/50 text-muted-foreground line-through cursor-not-allowed dark:bg-red-950/20"
                                  : !isWithinHours
                                  ? "border-gray-200 bg-gray-50/50 text-muted-foreground cursor-not-allowed dark:bg-gray-950/20"
                                  : isOffDay(selectedDate)
                                  ? "border-gray-200 bg-gray-50/50 text-muted-foreground cursor-not-allowed dark:bg-gray-950/20"
                                  : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-700 dark:hover:bg-emerald-950/20"
                              )}
                            >
                              <span className="text-xs font-medium">{time}</span>
                              {isBooked && (
                                <span className="block text-[9px] text-red-500 font-normal mt-0.5">
                                  ❌ {app.lang === "ar" ? "محجوز" : "Booked"}
                                </span>
                              )}
                              {!isWithinHours && !isBooked && (
                                <span className="block text-[9px] text-gray-400 font-normal mt-0.5">
                                  ⏰ {app.lang === "ar" ? "خارج الدوام" : "Closed"}
                                </span>
                              )}
                              {isSelected && !isDisabled && (
                                <span className="absolute -top-1 -right-1">
                                  <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                                    ✓
                                  </span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-64 bg-muted/30 rounded-xl">
                      <CalendarDays className="h-12 w-12 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground mt-2">
                        {app.lang === "ar" ? "📅 اختر تاريخ أولاً" : "📅 Select a date first"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {selectedDate && selectedTime && !loadingSlots && !isOffDay(selectedDate) && isWithinWorkingHours(selectedTime) && !bookedSlots.includes(selectedTime) && (
                <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {formatDate(selectedDate)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          🕐 {app.lang === "ar" ? "الساعة" : "Time"}: {selectedTime}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                      onClick={nextStep}
                    >
                      {app.lang === "ar" ? "التالي →" : "Next →"}
                    </Button>
                  </div>
                </div>
              )}

              {selectedDate && (isOffDay(selectedDate)) && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30 rounded-xl p-4 flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-red-700 dark:text-red-300">
                      {app.lang === "ar" ? "⚠️ يوم عطلة" : "⚠️ Off Day"}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {app.lang === "ar" 
                        ? `هذا اليوم (${formatDate(selectedDate)}) عطلة في المتجر، يرجى اختيار يوم آخر` 
                        : `This day (${formatDate(selectedDate)}) is an off day, please choose another day`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ✅ الخطوة 2: التفاصيل */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {app.lang === "ar" ? "تفاصيل الحجز" : "Booking Details"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {app.lang === "ar" ? "حدد عدد الضيوف والخدمات" : "Specify guests and services"}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* ✅ عدد الضيوف */}
                <div className="border rounded-xl p-4 space-y-3">
                  <Label className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {app.lang === "ar" ? "عدد الضيوف" : "Number of Guests"}
                  </Label>
                  <div className="flex items-center gap-4 justify-center py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 w-12 rounded-full"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      disabled={guests <= 1}
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <span className="text-3xl font-bold w-16 text-center">{guests}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-12 w-12 rounded-full"
                      onClick={() => setGuests(Math.min(20, guests + 1))}
                      disabled={guests >= 20}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    {app.lang === "ar" ? "الحد الأقصى 20 ضيف" : "Maximum 20 guests"}
                  </p>
                </div>

                {/* ✅ خدمات إضافية */}
                <div className="border rounded-xl p-4 space-y-3">
                  <Label className="font-semibold flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {app.lang === "ar" ? "خدمات إضافية" : "Additional Services"}
                  </Label>
                  {loadingServices ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => setSelectedService(service.id)}
                          className={cn(
                            "w-full p-3 rounded-lg border-2 text-sm transition-all text-right",
                            selectedService === service.id
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 shadow-md shadow-emerald-500/10"
                              : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">
                                {app.lang === "ar" ? service.name_ar : service.name_en}
                              </span>
                              {service.price > 0 && (
                                <span className="block text-xs text-muted-foreground">
                                  +{formatPrice(service.price, app.currency, app.lang)}
                                </span>
                              )}
                            </div>
                            {selectedService === service.id && (
                              <Check className="h-5 w-5 text-emerald-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ✅ ملاحظات */}
              <div className="border rounded-xl p-4">
                <Label className="font-semibold flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4" />
                  {app.lang === "ar" ? "ملاحظات إضافية" : "Additional Notes"}
                </Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={app.lang === "ar" 
                    ? "أي تفاصيل إضافية تريد إضافتها..." 
                    : "Any additional details..."}
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* ✅ أزرار التنقل */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  ← {app.lang === "ar" ? "رجوع" : "Back"}
                </Button>
                <Button 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={nextStep}
                >
                  {app.lang === "ar" ? "مراجعة الحجز →" : "Review Booking →"}
                </Button>
              </div>
            </div>
          )}

          {/* ✅ الخطوة 3: مراجعة وتأكيد */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {app.lang === "ar" ? "مراجعة الحجز" : "Review Booking"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {app.lang === "ar" ? "تأكد من التفاصيل قبل التأكيد" : "Verify details before confirming"}
                  </p>
                </div>
              </div>

              {/* ✅ ملخص الحجز */}
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-emerald-200/30 dark:border-emerald-800/30">
                    <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                      <img 
                        src={listing.cover_url || '/placeholder.png'} 
                        alt={listing.title_ar}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{listing.title_ar}</h4>
                      <p className="text-sm text-muted-foreground">{storeName}</p>
                    </div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {formatPrice(basePrice, app.currency, app.lang)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {app.lang === "ar" ? "📅 التاريخ" : "📅 Date"}
                      </p>
                      <p className="font-semibold">
                        {selectedDate && formatDate(selectedDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {app.lang === "ar" ? "🕐 الوقت" : "🕐 Time"}
                      </p>
                      <p className="font-semibold">{selectedTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {app.lang === "ar" ? "👥 الضيوف" : "👥 Guests"}
                      </p>
                      <p className="font-semibold">{guests}</p>
                    </div>
                    {selectedService && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {app.lang === "ar" ? "✨ خدمة إضافية" : "✨ Extra Service"}
                        </p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {app.lang === "ar" 
                            ? services.find(s => s.id === selectedService)?.name_ar 
                            : services.find(s => s.id === selectedService)?.name_en}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-emerald-200/30 dark:border-emerald-800/30">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {app.lang === "ar" ? "سعر الخدمة" : "Service Price"}
                      </span>
                      <span>{formatPrice(basePrice * guests, app.currency, app.lang)}</span>
                    </div>
                    {selectedService && services.find(s => s.id === selectedService)?.price > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {app.lang === "ar" ? "خدمة إضافية" : "Extra Service"}
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          +{formatPrice(
                            services.find(s => s.id === selectedService)?.price || 0,
                            app.currency,
                            app.lang
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-lg font-bold mt-2 pt-2 border-t border-emerald-200/30 dark:border-emerald-800/30">
                      <span>{app.lang === "ar" ? "💰 الإجمالي" : "💰 Total"}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {formatPrice(calculateTotal(), app.currency, app.lang)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ سياسة الحجز */}
              <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/50 dark:border-yellow-800/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">
                      {app.lang === "ar" ? "📋 سياسة الحجز" : "📋 Booking Policy"}
                    </p>
                    <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                      <li>
                        {app.lang === "ar" 
                          ? "✅ يمكنك إلغاء الحجز قبل 24 ساعة من الموعد" 
                          : "✅ You can cancel up to 24 hours before"}
                      </li>
                      <li>
                        {app.lang === "ar" 
                          ? "💰 سيتم خصم 50% في حال الإلغاء المتأخر" 
                          : "💰 50% fee for late cancellation"}
                      </li>
                      <li>
                        {app.lang === "ar" 
                          ? "⏳ سيتم تأكيد الحجز خلال 24 ساعة" 
                          : "⏳ Booking will be confirmed within 24 hours"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ✅ أزرار التنقل */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={prevStep} className="flex-1">
                  ← {app.lang === "ar" ? "رجوع" : "Back"}
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-5 w-5 me-2" />
                      {app.lang === "ar" ? "✅ تأكيد الحجز" : "✅ Confirm Booking"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="p-6 pt-0 border-t bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>
                {app.lang === "ar" 
                  ? "🔒 حجز آمن ومضمون 100%" 
                  : "🔒 100% Secure Booking"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>
                {app.lang === "ar" 
                  ? "💳 دفع عند الخدمة" 
                  : "💳 Pay at Service"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>
                {app.lang === "ar" 
                  ? "📍 خدمة في الموقع" 
                  : "📍 On-site Service"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}