// src/lib/utils/compressImage.ts
// ✅ [ملف جديد] ضغط الصور قبل الرفع — لا يغير أي منطق موجود

import imageCompression from 'browser-image-compression';

interface CompressOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

export async function compressImageBeforeUpload(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const {
    maxSizeMB = 0.5,           // 500 KB كحد أقصى
    maxWidthOrHeight = 1920,   // 1920px كحد أقصى
    useWebWorker = true,       // لا يعطل الواجهة
  } = options;

  // ✅ إذا كان الملف أصغر من 100 KB — لا تضغطه
  if (file.size < 100 * 1024) {
    console.log(`✅ [Compress] File already small (${(file.size / 1024).toFixed(1)} KB), skipping`);
    return file;
  }

  try {
    console.log(`🔄 [Compress] Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`);

    const compressedFile = await imageCompression(file, {
      maxSizeMB,
      maxWidthOrHeight,
      useWebWorker,
      fileType: 'image/webp',    // ✅ تحويل إلى WebP
      initialQuality: 0.8,       // جودة أولية 80%
      exifOrientation: true,     // ✅ تصحيح دوران iPhone
    });

    // ✅ إعادة تسمية الملف إلى .webp
    const newName = file.name.replace(/\.[^.]+$/, '.webp');
    const finalFile = new File([compressedFile], newName, {
      type: 'image/webp',
      lastModified: Date.now(),
    });

    const savings = ((1 - finalFile.size / file.size) * 100).toFixed(1);
    console.log(`✅ [Compress] Done: ${(finalFile.size / 1024).toFixed(1)} KB (وفّر ${savings}%)`);

    return finalFile;
  } catch (error) {
    console.error('❌ [Compress] Failed:', error);
    // ✅ عند الفشل — أعد الملف الأصلي (لا تكسر التدفق)
    return file;
  }
}