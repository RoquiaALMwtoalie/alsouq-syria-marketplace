// src/components/dashboard/ColorManager.tsx
import { useState } from "react";
import { 
  Plus, X, Image as ImageIcon, Trash2, 
  CheckCircle2, AlertCircle, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ImageInput } from "@/components/ImageInput";

export interface TempColor {
  id: string;
  color_name_ar: string;
  color_hex?: string;
  image_url: string;
  sort_order: number;
}

interface ColorManagerProps {
  userId: string;
  lang: string;
  sizes: string[];
  colors: TempColor[];
  onColorsChange: (colors: TempColor[]) => void;
  isTemp?: boolean;
}

export function ColorManager({ 
  userId, 
  lang, 
  sizes, 
  colors,
  onColorsChange,
  isTemp = true
}: ColorManagerProps) {
  const [newColorName, setNewColorName] = useState("");
  const [newColorImage, setNewColorImage] = useState("");
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [isAdding, setIsAdding] = useState(false);

  // ✅ إضافة لون جديد مع صورة (إجبارية)
  const handleAddColor = () => {
    if (!newColorName.trim()) {
      toast.error(lang === "ar" ? "الرجاء إدخال اسم اللون" : "Please enter color name");
      return;
    }
    if (!newColorImage.trim()) {
      toast.error(lang === "ar" ? "⚠️ الرجاء رفع صورة اللون" : "⚠️ Please upload color image");
      return;
    }

    const newColor: TempColor = {
      id: `temp-${Date.now()}`,
      color_name_ar: newColorName.trim(),
      color_hex: newColorHex || undefined,
      image_url: newColorImage.trim(),
      sort_order: colors.length,
    };

    onColorsChange([...colors, newColor]);
    
    toast.success(lang === "ar" ? "✅ تم إضافة اللون مع الصورة" : "✅ Color with image added");
    setNewColorName("");
    setNewColorImage("");
    setNewColorHex("#000000");
    setIsAdding(false);
  };

  // ✅ حذف لون
  const handleDeleteColor = (colorId: string, colorName: string) => {
    const confirm = window.confirm(
      lang === "ar" 
        ? `هل أنت متأكد من حذف اللون "${colorName}" مع صورته؟` 
        : `Are you sure you want to delete "${colorName}" with its image?`
    );
    if (!confirm) return;

    onColorsChange(colors.filter(c => c.id !== colorId));
    toast.success(lang === "ar" ? "✅ تم حذف اللون" : "✅ Color deleted");
  };

  // ✅ تحديث صورة اللون
  const handleUpdateImage = (colorId: string, imageUrl: string) => {
    const updated = colors.map(c => 
      c.id === colorId ? { ...c, image_url: imageUrl } : c
    );
    onColorsChange(updated);
    toast.success(lang === "ar" ? "✅ تم تحديث الصورة" : "✅ Image updated");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-indigo-500" />
          <h4 className="font-semibold text-sm">
            {lang === "ar" ? "🎨 الألوان والصور" : "🎨 Colors & Images"}
          </h4>
          <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700 border-blue-200">
            {colors.length} {lang === "ar" ? "لون" : "colors"}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="default"
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          {lang === "ar" ? "أضف لون" : "Add Color"}
        </Button>
      </div>

      {/* ✅ نافذة إضافة لون مع صورة */}
      {isAdding && (
        <div className="rounded-xl border-2 border-dashed border-blue-200/50 dark:border-blue-800/50 p-4 bg-blue-50/30 dark:bg-blue-950/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                {lang === "ar" ? "اسم اللون" : "Color Name"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder={lang === "ar" ? "مثال: أحمر" : "e.g. Red"}
                className="mt-1 h-9 text-sm rounded-lg"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">
                {lang === "ar" ? "رمز اللون" : "Color Hex"}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="h-9 w-12 rounded-lg cursor-pointer border border-slate-200/50"
                />
                <Input
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  placeholder="#FF0000"
                  className="h-9 text-sm rounded-lg flex-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                {lang === "ar" ? "صورة اللون" : "Color Image"}
                <span className="text-red-500">*</span>
              </Label>
              <ImageInput
                value={newColorImage}
                onChange={setNewColorImage}
                userId={userId}
                folder="product-colors"
                lang={lang}
                label={lang === "ar" ? "ارفع صورة اللون" : "Upload color image"}
                previewClassName="h-9 w-12 rounded-lg object-cover"
                showLabel={false}
                required
              />
              {!newColorImage && (
                <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {lang === "ar" ? "الرجاء رفع صورة اللون" : "Please upload color image"}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleAddColor}
              disabled={!newColorName || !newColorImage}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
            >
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
              {lang === "ar" ? "إضافة" : "Add"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsAdding(false)}
              className="rounded-xl"
            >
              <X className="h-3.5 w-3.5 mr-1.5" />
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
          </div>
        </div>
      )}

      {/* Colors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {colors.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <Palette className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{lang === "ar" ? "لا توجد ألوان مضافة" : "No colors added"}</p>
            <p className="text-sm">
              {lang === "ar" ? "أضف لوناً مع صورته (مطلوب)" : "Add a color with its image (required)"}
            </p>
          </div>
        ) : (
          colors.map((color) => (
            <div
              key={color.id}
              className="rounded-xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden bg-white dark:bg-slate-900 hover:shadow-md transition-all group"
            >
              <div className="relative aspect-square bg-slate-100 dark:bg-slate-800">
                <img
                  src={color.image_url}
                  alt={color.color_name_ar}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-color.png';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all"
                    onClick={() => {
                      const url = prompt(lang === "ar" ? "أدخل رابط الصورة الجديدة" : "Enter new image URL");
                      if (url) handleUpdateImage(color.id, url);
                    }}
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {color.color_hex && (
                      <span 
                        className="h-4 w-4 rounded-full border border-slate-200/50 shrink-0"
                        style={{ backgroundColor: color.color_hex }}
                      />
                    )}
                    <span className="text-sm font-medium">{color.color_name_ar}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    onClick={() => handleDeleteColor(color.id, color.color_name_ar)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                  ✅ {lang === "ar" ? "صورة" : "Image"} ✓
                </Badge>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tip */}
      <div className="rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 p-3">
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
          {lang === "ar" 
            ? "💡 كل لون يحتاج صورة واحدة فقط" 
            : "💡 Each color needs one image"}
        </p>
      </div>
    </div>
  );
}