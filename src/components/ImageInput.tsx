import { useRef, useState } from "react";
import { Image as ImageIcon, Link as LinkIcon, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type ImageInputProps = {
  value: string;
  onChange: (value: string) => void;
  userId?: string;
  folder: string;
  lang?: "ar" | "en";
  label?: string;
  required?: boolean;
  hint?: string;
  previewClassName?: string;
  disabled?: boolean;
};

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

export function getSupabaseImageUrl(path: string) {
  const { data } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
}

function extensionFor(file: File) {
  const byName = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (byName && byName.length <= 5) return byName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

export function ImageInput({
  value,
  onChange,
  userId,
  folder,
  lang = "ar",
  label,
  required,
  hint,
  previewClassName,
  disabled,
}: ImageInputProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file?: File) {
    if (!file || disabled) return;
    if (!userId) {
      toast.error(lang === "ar" ? "سجّل دخولك أولاً لرفع الصور" : "Sign in first to upload images");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error(lang === "ar" ? "الملف يجب أن يكون صورة" : "File must be an image");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(lang === "ar" ? "حجم الصورة كبير، الحد الأقصى 8MB" : "Image is too large. Max 8MB");
      return;
    }

    setUploading(true);
    try {
      const safeFolder = folder.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
      const ext = extensionFor(file);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const path = safeFolder ? `${safeFolder}/${fileName}` : fileName;
      const { error } = await supabase.storage.from("uploads").upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });
      if (error) throw error;
      
      // استخدام الدالة الجديدة للحصول على الرابط الصحيح من Supabase
      onChange(getSupabaseImageUrl(path));
      toast.success(lang === "ar" ? "تم رفع الصورة" : "Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-semibold flex items-center gap-1">
          {required && <span className="text-destructive">*</span>}
          {label}
        </Label>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="gap-2">
            <UploadCloud className="h-4 w-4" /> {lang === "ar" ? "رفع" : "Upload"}
          </TabsTrigger>
          <TabsTrigger value="url" className="gap-2">
            <LinkIcon className="h-4 w-4" /> URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-2">
          <button
            type="button"
            disabled={disabled || uploading}
            onClick={() => fileRef.current?.click()}
            onDrop={(event) => {
              event.preventDefault();
              void handleFile(event.dataTransfer.files?.[0]);
            }}
            onDragOver={(event) => event.preventDefault()}
            className="w-full rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-4 py-5 text-center transition hover:bg-primary/10 disabled:opacity-60"
          >
            <UploadCloud className="mx-auto h-8 w-8 text-primary" />
            <div className="mt-2 text-sm font-bold">
              {uploading ? (lang === "ar" ? "جاري الرفع…" : "Uploading…") : (lang === "ar" ? "اختر صورة من جهازك" : "Choose image from device")}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">PNG / JPG / WebP · 8MB</div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled || uploading}
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
        </TabsContent>

        <TabsContent value="url" className="mt-2">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://..."
            dir="ltr"
            disabled={disabled || uploading}
            className="h-11 bg-background"
          />
        </TabsContent>
      </Tabs>

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      {value ? (
        <div className="relative overflow-hidden rounded-2xl border bg-muted">
          <img src={value} alt="" className={cn("h-28 w-full object-cover", previewClassName)} />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            disabled={disabled || uploading}
            onClick={() => onChange("")}
            className="absolute end-2 top-2 h-8 w-8 shadow-card"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="rounded-2xl border bg-muted/50 p-4 text-center text-muted-foreground">
          <ImageIcon className="mx-auto h-5 w-5" />
        </div>
      )}
    </div>
  );
}