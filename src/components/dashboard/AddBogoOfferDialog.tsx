// src/components/dashboard/AddBogoOfferDialog.tsx

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp, formatPrice } from "@/lib/i18n";
import { useCreateProductOffer, useUpdateProductOffer, type OfferType } from "@/lib/hooks/useProductOffers";
import { useListings, useCategories } from "@/lib/queries";
import { Gift, Loader2, X, Store, Package, Calendar, Clock, AlertCircle, Plus, Minus, Trash2, Layers, Search, CheckCircle2, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// ============================================================
// 📦 أنواع العروض
// ============================================================
type OfferType = 'bogo' | 'cross_sell' | 'bundle';

interface VariationSelection {
    mode: 'all' | 'selected';
    ids: string[];
}

interface ProductRequirement {
    listing_id: string;
    variations: VariationSelection;
    quantity: number;
}

interface OfferResult {
    listing_id: string;
    variations: VariationSelection;
    quantity: number;
    variationQuantities?: Record<string, number>;
}

interface AddOfferDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: any;
    existingOffer?: any;
    onSuccess: () => void;
}

function AddBogoOfferDialogComponent({ 
    open, 
    onOpenChange, 
    product: initialProduct,
    existingOffer,
    onSuccess 
}: AddOfferDialogProps) {
    const app = useApp();
    const isArabic = app.lang === "ar";
    const createOffer = useCreateProductOffer();
    const updateOffer = useUpdateProductOffer();
    
    // ✅ جلب التصنيفات
    const { data: categories = [] } = useCategories();
    
    // ✅ جلب منتجات المتجر - فقط المنتجات العادية (ليست عروض تخفيضية)
    const ownerId = app.user?.id;
    const { data: listingsData, isLoading: listingsLoading } = useListings({ 
        limit: 1000,
        ...(ownerId && { ownerId })
    });
    
    // ✅ تصفية المنتجات: فقط المنتجات العادية (is_offer !== true)
    const listings = (listingsData?.data || []).filter((l: any) => !l.is_offer);

    // ============================================================
    // ✅ STATE
    // ============================================================
    const [offerType, setOfferType] = useState<OfferType>('bogo');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    
    // ✅ State للبحث في التصنيفات
    const [categorySearch, setCategorySearch] = useState("");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    
    // ✅ الشروط (المنتجات المطلوبة)
    const [requirements, setRequirements] = useState<ProductRequirement[]>([
        { listing_id: '', variations: { mode: 'all', ids: [] }, quantity: 1 }
    ]);
    
    // ✅ النتيجة (الهدية) مع دعم الكميات لكل فيرنت
    const [result, setResult] = useState<OfferResult>({
        listing_id: '',
        variations: { mode: 'all', ids: [] },
        quantity: 1,
        variationQuantities: {}
    });
    
    // ✅ التواريخ
    const [expiresAt, setExpiresAt] = useState("");
    const [isPermanent, setIsPermanent] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ السعر الفعلي للفيرنت المحدد
    const [selectedVariationPrice, setSelectedVariationPrice] = useState<number | null>(null);

    // ✅ ✅ ✅ استخدام useRef لمنع التحديثات المتكررة
    const isUpdatingFromExisting = useRef(false);

    // ============================================================
    // ✅ فلتر التصنيفات حسب البحث
    // ============================================================
    const filteredCategories = useMemo(() => {
        if (!categorySearch.trim()) return categories;
        const search = categorySearch.toLowerCase().trim();
        return categories.filter((cat: any) => {
            const nameAr = (cat.name_ar || "").toLowerCase();
            const nameEn = (cat.name_en || "").toLowerCase();
            return nameAr.includes(search) || nameEn.includes(search);
        });
    }, [categories, categorySearch]);

    // ============================================================
    // ✅ إغلاق القائمة عند الضغط خارجها
    // ============================================================
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                categoryDropdownRef.current && 
                !categoryDropdownRef.current.contains(event.target as Node) &&
                categoryInputRef.current &&
                !categoryInputRef.current.contains(event.target as Node)
            ) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ============================================================
    // ✅ جلب فيرنتات المنتج
    // ============================================================
    const getProductVariations = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        return product?.variations || [];
    };

    const getProductTitle = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        return product?.title_ar || '';
    };

    const getProductPrice = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        return product?.price || 0;
    };

    // ✅ جلب سعر الفيرنت المحدد
    const getVariationPrice = (listingId: string, variationId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        if (!product) return null;
        const variation = product.variations?.find((v: any) => v.id === variationId);
        return variation?.price || variation?.old_price || product.price || 0;
    };

    // ✅ التحقق من أن المنتج لديه فيرنتات
    const hasVariations = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        return product?.variations && product.variations.length > 0;
    };

    // ✅ ✅ ✅ دالة توليد اسم العرض بشكل احترافي
    const generateProfessionalDisplayText = () => {
        const isArabic = app.lang === "ar";
        const mainProduct = listings.find((l: any) => l.id === requirements[0]?.listing_id);
        const productName = mainProduct?.title_ar || (isArabic ? "المنتج" : "Product");
        
        const buyQty = requirements.reduce((sum, r) => sum + r.quantity, 0);
        const getQty = result.quantity;
        const giftProduct = listings.find((l: any) => l.id === result.listing_id);
        const giftName = giftProduct?.title_ar || (isArabic ? "منتج آخر" : "another product");

        if (offerType === 'bogo') {
            if (mainProduct && productName !== (isArabic ? "المنتج" : "Product")) {
                return isArabic 
                    ? `اشتري ${buyQty} من ${productName} + ${getQty} مجاناً`
                    : `Buy ${buyQty} ${productName} + ${getQty} Free`;
            }
            return isArabic 
                ? `اشتري ${buyQty} واحصل على ${getQty} مجاناً`
                : `Buy ${buyQty} Get ${getQty} Free`;
        }

        if (offerType === 'cross_sell') {
            if (mainProduct && giftProduct) {
                return isArabic 
                    ? `اشتري ${productName} واحصل على ${giftName} مجاناً`
                    : `Buy ${productName} & Get ${giftName} Free`;
            }
            return isArabic 
                ? `اشتري منتج واحصل على منتج آخر مجاناً`
                : `Buy One Get One Free`;
        }

        if (offerType === 'bundle') {
            const productNames = requirements
                .map((r) => {
                    const p = listings.find((l: any) => l.id === r.listing_id);
                    return p?.title_ar || (isArabic ? "منتج" : "Product");
                })
                .slice(0, 2)
                .join(isArabic ? " + " : " + ");
            
            const extraCount = requirements.length - 2;
            let bundleText = productNames;
            if (extraCount > 0) {
                bundleText += isArabic ? ` + ${extraCount} أخرى` : ` + ${extraCount} more`;
            }
            
            return isArabic 
                ? `باقة ${bundleText} + ${getQty} مجاناً`
                : `Bundle ${bundleText} + ${getQty} Free`;
        }

        return isArabic 
            ? `عرض خاص: ${buyQty} + ${getQty} مجاناً`
            : `Special Offer: ${buyQty} + ${getQty} Free`;
    };

    // ============================================================
    // ✅ معاينة العرض
    // ============================================================
    const getPreviewText = () => {
        return generateProfessionalDisplayText();
    };

    // ============================================================
    // ✅ دوال إدارة الشروط
    // ============================================================
    const addRequirement = () => {
        setRequirements([...requirements, { listing_id: '', variations: { mode: 'all', ids: [] }, quantity: 1 }]);
    };

    const removeRequirement = (index: number) => {
        if (requirements.length > 1) {
            setRequirements(requirements.filter((_, i) => i !== index));
        }
    };

    const updateRequirement = (index: number, field: keyof ProductRequirement, value: any) => {
        const newReqs = [...requirements];
        newReqs[index] = { ...newReqs[index], [field]: value };
        if (field === 'listing_id') {
            newReqs[index].variations = { mode: 'all', ids: [] };
        }
        setRequirements(newReqs);
    };

    const toggleVariation = (target: 'requirements' | 'result', reqIndex: number | null, variationId: string) => {
        if (target === 'requirements' && reqIndex !== null) {
            const newReqs = [...requirements];
            const current = newReqs[reqIndex].variations.ids;
            newReqs[reqIndex].variations.ids = current.includes(variationId)
                ? current.filter(id => id !== variationId)
                : [...current, variationId];
            setRequirements(newReqs);
            
            if (newReqs[reqIndex].variations.ids.length === 1) {
                const price = getVariationPrice(newReqs[reqIndex].listing_id, newReqs[reqIndex].variations.ids[0]);
                setSelectedVariationPrice(price);
            } else {
                setSelectedVariationPrice(null);
            }
        } else if (target === 'result') {
            const current = result.variations.ids;
            setResult({
                ...result,
                variations: {
                    ...result.variations,
                    ids: current.includes(variationId)
                        ? current.filter(id => id !== variationId)
                        : [...current, variationId]
                }
            });
        }
    };

    const setVariationMode = (target: 'requirements' | 'result', reqIndex: number | null, mode: 'all' | 'selected') => {
        if (target === 'requirements' && reqIndex !== null) {
            const newReqs = [...requirements];
            newReqs[reqIndex].variations = { mode, ids: [] };
            setRequirements(newReqs);
            if (mode === 'all') {
                setSelectedVariationPrice(null);
            }
        } else if (target === 'result') {
            setResult({ ...result, variations: { mode, ids: [] } });
        }
    };

    // ✅ ✅ ✅ دالة تغيير كمية فيرنت الهدية
    const handleGiftVariationQuantityChange = useCallback((variationId: string, delta: number) => {
        setResult(prev => {
            const currentQuantities = prev.variationQuantities || {};
            const currentQty = currentQuantities[variationId] || 0;
            const newQty = Math.max(0, currentQty + delta);
            const totalQty = prev.quantity || 1;
            const currentTotal = Object.values(currentQuantities).reduce((sum, qty) => sum + qty, 0);
            
            // ✅ منع التجاوز
            if (delta > 0 && currentTotal >= totalQty) {
                toast.warning(isArabic ? "⚠️ تم الوصول للحد الأقصى للكمية" : "⚠️ Maximum quantity reached");
                return prev;
            }
            
            const newQuantities = { ...currentQuantities };
            if (newQty === 0) {
                delete newQuantities[variationId];
            } else {
                newQuantities[variationId] = newQty;
            }
            
            return { ...prev, variationQuantities: newQuantities };
        });
    }, [isArabic]);

    // ✅ ✅ ✅ دالة توزيع الكمية المتبقية بالتساوي
    const distributeRemainingGiftQuantity = useCallback((variations: any[]) => {
        setResult(prev => {
            const totalQty = prev.quantity || 1;
            const currentQuantities = prev.variationQuantities || {};
            const currentTotal = Object.values(currentQuantities).reduce((sum, qty) => sum + qty, 0);
            const remaining = totalQty - currentTotal;
            
            if (remaining <= 0) {
                toast.info(isArabic ? "✅ الكمية مكتملة" : "✅ Quantity is complete");
                return prev;
            }
            
            const availableVariations = variations.filter((v: any) => 
                !currentQuantities[v.id] || currentQuantities[v.id] > 0
            );
            
            if (availableVariations.length === 0) return prev;
            
            const perVariation = Math.floor(remaining / availableVariations.length);
            const remainder = remaining % availableVariations.length;
            const newQuantities = { ...currentQuantities };
            
            availableVariations.forEach((v: any, index: number) => {
                newQuantities[v.id] = (newQuantities[v.id] || 0) + perVariation + (index < remainder ? 1 : 0);
            });
            
            toast.success(
                isArabic 
                    ? `✅ تم توزيع ${remaining} المتبقية على ${availableVariations.length} فيرنتات`
                    : `✅ Distributed ${remaining} remaining to ${availableVariations.length} variations`
            );
            
            return { ...prev, variationQuantities: newQuantities };
        });
    }, [isArabic]);

    // ============================================================
    // ✅ دالة مساعدة لتوزيع الكميات تلقائيًا
    // ============================================================
    const autoDistributeQuantities = useCallback((variationIds: string[], totalQty: number): Record<string, number> => {
        if (!variationIds || variationIds.length === 0) return {};
        const perVariation = Math.floor(totalQty / variationIds.length);
        const remainder = totalQty % variationIds.length;
        const quantities: Record<string, number> = {};
        variationIds.forEach((id: string, index: number) => {
            quantities[id] = perVariation + (index < remainder ? 1 : 0);
        });
        return quantities;
    }, []);

    // ============================================================
    // ✅ حفظ العرض - المُصحح بالكامل
    // ============================================================
    const handleSubmit = async () => {
        // ✅ التحقق
        if (requirements.some(r => !r.listing_id)) {
            setError(isArabic ? "❌ الرجاء اختيار جميع المنتجات المطلوبة" : "❌ Please select all required products");
            return;
        }

        if (!result.listing_id) {
            setError(isArabic ? "❌ الرجاء اختيار منتج الهدية" : "❌ Please select the gift product");
            return;
        }

        if (!selectedCategoryId) {
            setError(isArabic ? "❌ الرجاء اختيار التصنيف" : "❌ Please select a category");
            return;
        }

        const giftHasVariations = hasVariations(result.listing_id);
        if (giftHasVariations && result.variations.mode === 'all') {
            setError(isArabic 
                ? "❌ منتج الهدية يحتوي على فيرنتات، الرجاء اختيار فيرنت محدد للهدية" 
                : "❌ Gift product has variations, please select a specific variation for the gift"
            );
            return;
        }

        if (giftHasVariations && result.variations.mode === 'selected' && result.variations.ids.length === 0) {
            setError(isArabic 
                ? "❌ الرجاء اختيار فيرنت واحد على الأقل للهدية" 
                : "❌ Please select at least one variation for the gift"
            );
            return;
        }

        // ✅ ✅ ✅ التحقق من توزيع الكميات مع التوزيع التلقائي إذا لزم الأمر
        let variationQuantities = { ...(result.variationQuantities || {}) };
        
        if (giftHasVariations && result.variations.mode === 'selected' && result.variations.ids.length > 0) {
            const totalQty = result.quantity || 1;
            const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
            
            // ✅ إذا لم يتم توزيع الكميات بالكامل، وزعها تلقائيًا
            if (distributedTotal !== totalQty) {
                variationQuantities = autoDistributeQuantities(result.variations.ids, totalQty);
                console.log("🔄 [handleSubmit] Auto-distributed quantities:", variationQuantities);
            }
            
            // ✅ التحقق النهائي
            const finalDistributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
            if (finalDistributedTotal !== totalQty) {
                setError(isArabic 
                    ? `❌ مجموع الكميات الموزعة (${finalDistributedTotal}) لا يساوي الكمية الإجمالية للهدية (${totalQty})`
                    : `❌ Total distributed quantity (${finalDistributedTotal}) doesn't match gift total (${totalQty})`
                );
                return;
            }
            
            // ✅ تأكد أن كل فيرنت مختار له كمية أكبر من 0
            const hasZeroQuantity = result.variations.ids.some(id => (variationQuantities[id] || 0) === 0);
            if (hasZeroQuantity) {
                setError(isArabic 
                    ? "❌ جميع الفيرنتات المختارة يجب أن يكون لها كمية أكبر من 0"
                    : "❌ All selected variations must have quantity greater than 0"
                );
                return;
            }
        }

        if (offerType === 'bundle' && requirements.length < 2) {
            setError(isArabic ? "❌ الباقة تحتاج إلى منتجين على الأقل" : "❌ Bundle needs at least 2 products");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const data = {
                listing_id: requirements[0].listing_id,
                store_id: app.user?.id,
                offer_type: offerType,
                buy_quantity: requirements.reduce((sum, r) => sum + r.quantity, 0),
                get_quantity: result.quantity,
                free_listing_id: offerType === 'bogo' ? null : result.listing_id,
                variation_ids: requirements[0].variations.mode === 'selected' ? requirements[0].variations.ids : null,
                required_product_ids: requirements.map(r => r.listing_id),
                required_variations: requirements.map(r => ({
                    product_id: r.listing_id,
                    variation_ids: r.variations.mode === 'selected' ? r.variations.ids : [],
                    quantity: r.quantity
                })),
                result_variation_ids: result.variations.mode === 'selected' ? result.variations.ids : null,
                starts_at: new Date().toISOString(),
                expires_at: isPermanent ? null : expiresAt || null,
                is_active: true,
                display_text_ar: getPreviewText(),
                display_text_en: getPreviewText(),
                category_id: selectedCategoryId || null,
                // ✅ ✅ ✅ حفظ الكميات لكل فيرنت في metadata - مع استخدام الكميات الموزعة تلقائيًا
                metadata: {
                    variation_quantities: variationQuantities
                }
            };

            console.log("📤 [handleSubmit] Final metadata:", data.metadata);
            console.log("📤 [handleSubmit] variationQuantities:", variationQuantities);

            if (existingOffer) {
                await updateOffer.mutateAsync({ id: existingOffer.id, ...data });
            } else {
                await createOffer.mutateAsync(data);
            }

            toast.success(isArabic ? "✅ تم إضافة العرض الترويجي بنجاح" : "✅ Promo offer added successfully");
            onSuccess();
            onOpenChange(false);

        } catch (error: any) {
            console.error("Error saving offer:", error);
            setError(error?.message || (isArabic ? "❌ فشل حفظ العرض" : "❌ Failed to save offer"));
        } finally {
            setIsSubmitting(false);
        }
    };

    // ============================================================
    // ✅ ✅ ✅ التحميل المسبق للبيانات (للتعديل والإضافة) - المُصحح بالكامل
    // ============================================================
    useEffect(() => {
        // ✅ إذا كان الفورم مغلق، لا تفعل شي
        if (!open) {
            console.log("🔍 [AddBogoOfferDialog] Dialog is closed, skipping");
            return;
        }

        // ✅ ✅ ✅ الأولوية القصوى: حالة التعديل (edit)
        if (existingOffer) {
            console.log("🔍 [AddBogoOfferDialog] Editing existing offer, type:", existingOffer.offer_type);
            
            // ⚠️ منع التحديثات المتكررة
            if (isUpdatingFromExisting.current) {
                console.log("⏳ [AddBogoOfferDialog] Already updating from existing, skipping...");
                return;
            }
            
            isUpdatingFromExisting.current = true;
            
            // 1️⃣ نوع العرض
            setOfferType(existingOffer.offer_type || 'bogo');
            
            // 2️⃣ التصنيف
            setSelectedCategoryId(existingOffer.category_id || '');
            setCategorySearch(
                categories.find((c: any) => c.id === existingOffer.category_id)?.[isArabic ? 'name_ar' : 'name_en'] || ''
            );
            
            // 3️⃣ ✅✅✅ المنتجات المطلوبة (requirements)
            if (existingOffer.required_product_ids && existingOffer.required_product_ids.length > 0) {
                const requirementsData = existingOffer.required_product_ids.map((productId: string, index: number) => {
                    let variations = { mode: 'all' as const, ids: [] as string[] };
                    let quantity = 1;
                    
                    if (existingOffer.required_variations && existingOffer.required_variations[index]) {
                        const reqVar = existingOffer.required_variations[index];
                        if (reqVar.variation_ids && reqVar.variation_ids.length > 0) {
                            variations = { mode: 'selected', ids: reqVar.variation_ids };
                        }
                        quantity = reqVar.quantity || 1;
                    }
                    
                    return {
                        listing_id: productId,
                        variations: variations,
                        quantity: quantity
                    };
                });
                setRequirements(requirementsData);
            }
            
            // 4️⃣ ✅✅✅ الهدية (result) مع الكميات لكل فيرنت
            const isBogo = existingOffer.offer_type === 'bogo';
            const giftListingId = isBogo 
                ? existingOffer.listing_id
                : existingOffer.free_listing_id;
            
            console.log("🟢 [Edit] isBogo:", isBogo);
            console.log("🟢 [Edit] giftListingId:", giftListingId);
            
            if (giftListingId) {
                let variations = { mode: 'all' as const, ids: [] as string[] };
                let variationQuantities: Record<string, number> = {};
                
                if (existingOffer.result_variation_ids && existingOffer.result_variation_ids.length > 0) {
                    variations = { mode: 'selected', ids: existingOffer.result_variation_ids };
                    
                    // ✅ ✅ ✅ استعادة الكميات من metadata
                    if (existingOffer.metadata?.variation_quantities) {
                        variationQuantities = existingOffer.metadata.variation_quantities;
                        console.log("🟢 [Edit] Restored variation quantities from metadata:", variationQuantities);
                    } else {
                        // ✅ إذا ما في كميات محفوظة، وزع بالتساوي
                        const totalQty = existingOffer.get_quantity || 1;
                        const ids = existingOffer.result_variation_ids;
                        variationQuantities = autoDistributeQuantities(ids, totalQty);
                        console.log("🟡 [Edit] Auto-distributed quantities:", variationQuantities);
                    }
                } else {
                    const giftHasVars = hasVariations(giftListingId);
                    if (giftHasVars) {
                        variations = { mode: 'selected', ids: [] };
                    }
                }
                
                setResult({
                    listing_id: giftListingId,
                    variations: variations,
                    quantity: existingOffer.get_quantity || 1,
                    variationQuantities: variationQuantities
                });
                
                console.log("✅ [Edit] Result set to:", {
                    listing_id: giftListingId,
                    variations: variations,
                    quantity: existingOffer.get_quantity || 1,
                    variationQuantities: variationQuantities
                });
            } else {
                console.warn("⚠️ [Edit] No giftListingId found, using listing_id as fallback");
                const fallbackListingId = existingOffer.listing_id;
                if (fallbackListingId) {
                    setResult({
                        listing_id: fallbackListingId,
                        variations: { mode: 'all', ids: [] },
                        quantity: existingOffer.get_quantity || 1,
                        variationQuantities: {}
                    });
                }
            }
            
            // 5️⃣ التاريخ
            if (existingOffer.expires_at) {
                setIsPermanent(false);
                setExpiresAt(existingOffer.expires_at);
            } else {
                setIsPermanent(true);
            }
            
            isUpdatingFromExisting.current = false;
            return;
        }

        // ✅ ✅ ✅ حالة الإضافة الجديدة (بدون existingOffer)
        console.log("🔍 [AddBogoOfferDialog] Creating new offer");
        
        // إعادة تعيين الفورم
        setOfferType('bogo');
        setSelectedCategoryId('');
        setCategorySearch('');
        setRequirements([{ 
            listing_id: initialProduct?.id || '', 
            variations: { mode: 'all', ids: [] }, 
            quantity: 1 
        }]);
        setResult({ 
            listing_id: initialProduct?.id && offerType === 'bogo' ? initialProduct.id : '', 
            variations: { mode: 'all', ids: [] }, 
            quantity: 1,
            variationQuantities: {}
        });
        setExpiresAt("");
        setIsPermanent(true);
        setError(null);
        setSelectedVariationPrice(null);

    }, [open, existingOffer, initialProduct, categories, isArabic, autoDistributeQuantities]);

    // ============================================================
    // ✅ RENDER
    // ============================================================
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto border-[#2a655f]/20 shadow-2xl shadow-[#2a655f]/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-[#0d2e2a]">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25">
                            <Gift className="h-5 w-5" />
                        </div>
                        {existingOffer 
                            ? (isArabic ? "✏️ تعديل عرض ترويجي" : "✏️ Edit Promo Offer")
                            : (isArabic ? "🎁 إضافة عرض ترويجي" : "🎁 Add Promo Offer")
                        }
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* ===== التصنيف مع بحث ذكي ===== */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Layers className="h-4 w-4 text-[#2a655f]" />
                            {isArabic ? "التصنيف" : "Category"}
                            <span className="text-red-500">*</span>
                        </Label>
                        
                        <div className="relative" ref={categoryDropdownRef}>
                            <div className="relative">
                                <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    ref={categoryInputRef}
                                    value={categorySearch}
                                    onChange={(e) => {
                                        setCategorySearch(e.target.value);
                                        setIsCategoryOpen(true);
                                    }}
                                    onFocus={() => setIsCategoryOpen(true)}
                                    placeholder={isArabic ? "🔍 ابحث عن تصنيف..." : "🔍 Search category..."}
                                    className="ps-9 h-11 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 bg-white dark:bg-slate-900"
                                />
                                {categorySearch && (
                                    <button
                                        onClick={() => {
                                            setCategorySearch("");
                                            setSelectedCategoryId("");
                                        }}
                                        className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-[#2a655f] transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            
                            {isCategoryOpen && (
                                <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 shadow-xl shadow-[#2a655f]/10">
                                    {filteredCategories.length === 0 ? (
                                        <div className="p-4 text-sm text-muted-foreground text-center">
                                            {isArabic ? "❌ لا توجد تصنيفات تطابق البحث" : "❌ No categories match search"}
                                        </div>
                                    ) : (
                                        filteredCategories.map((cat: any) => {
                                            const isSelected = selectedCategoryId === cat.id;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    className={cn(
                                                        "w-full text-start px-4 py-3 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                                                        isSelected && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30"
                                                    )}
                                                    onClick={() => {
                                                        setSelectedCategoryId(cat.id);
                                                        setCategorySearch(isArabic ? cat.name_ar : cat.name_en);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <CheckCircle2 className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <span>{isArabic ? cat.name_ar : cat.name_en}</span>
                                                        {cat.is_featured && (
                                                            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[8px]">
                                                                ⭐ {isArabic ? "مميز" : "Featured"}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {cat.slug}
                                                    </span>
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {selectedCategoryId && (
                            <div className="flex items-center gap-2 p-2 bg-[#2a655f]/5 rounded-lg border border-[#2a655f]/10">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm text-muted-foreground">
                                    {isArabic ? "التصنيف المختار:" : "Selected category:"}
                                </span>
                                <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0">
                                    {categories.find((c: any) => c.id === selectedCategoryId)?.[isArabic ? 'name_ar' : 'name_en'] || ""}
                                </Badge>
                            </div>
                        )}
                        
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Search className="h-3 w-3" />
                            {isArabic ? "💡 اكتب للبحث عن تصنيف معين" : "💡 Type to search for a specific category"}
                        </p>
                    </div>

                    {/* ===== نوع العرض ===== */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {isArabic ? "📌 نوع العرض" : "📌 Offer Type"}
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setOfferType('bogo')}
                                className={cn(
                                    "p-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                                    offerType === 'bogo'
                                        ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f] shadow-sm"
                                        : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-[#2a655f]/5"
                                )}
                            >
                                🎁 {isArabic ? "نفس المنتج" : "Same Product"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log("🔄 [AddBogoOfferDialog] Clicked cross_sell");
                                    setOfferType('cross_sell');
                                }}
                                className={cn(
                                    "p-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                                    offerType === 'cross_sell'
                                        ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f] shadow-sm"
                                        : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-[#2a655f]/5"
                                )}
                            >
                                🔄 {isArabic ? "منتج مختلف" : "Different Product"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    console.log("📦 [AddBogoOfferDialog] Clicked bundle");
                                    setOfferType('bundle');
                                }}
                                className={cn(
                                    "p-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                                    offerType === 'bundle'
                                        ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f] shadow-sm"
                                        : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-[#2a655f]/5"
                                )}
                            >
                                📦 {isArabic ? "باقة منتجات" : "Bundle"}
                            </button>
                        </div>
                    </div>

                    {/* ===== الشروط (المنتجات المطلوبة) ===== */}
                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                🛍️ {isArabic ? "الشروط (المنتجات المطلوبة)" : "Requirements (Required Products)"}
                                {offerType === 'bundle' && (
                                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
                                        {isArabic ? "باقة" : "Bundle"}
                                    </Badge>
                                )}
                            </Label>
                            {offerType === 'bundle' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-[10px] border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
                                    onClick={addRequirement}
                                    type="button"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    {isArabic ? "إضافة منتج" : "Add Product"}
                                </Button>
                            )}
                        </div>

                        {requirements.map((req, index) => {
                            const variations = getProductVariations(req.listing_id);
                            const isBogoAndSingle = offerType === 'bogo' && requirements.length === 1;

                            return (
                                <div key={index} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <Label className="text-xs text-muted-foreground">
                                                    {isArabic ? "المنتج" : "Product"}
                                                    {index === 0 && <span className="text-red-500 ml-1">*</span>}
                                                </Label>
                                                <Select
                                                    value={req.listing_id}
                                                    onValueChange={(v) => updateRequirement(index, 'listing_id', v)}
                                                >
                                                    <SelectTrigger className="mt-1 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20">
                                                        <SelectValue placeholder={isArabic ? "اختر المنتج" : "Select product"} />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl max-h-40">
                                                        {listings.map((l: any) => (
                                                            <SelectItem key={l.id} value={l.id}>
                                                                {l.title_ar} - {formatPrice(Number(l.price), app.currency, app.lang)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {variations.length > 0 && (
                                                <div>
                                                    <Label className="text-xs text-muted-foreground">
                                                        🎨 {isArabic ? "الفيرنتات" : "Variations"}
                                                        <span className="text-[10px] text-muted-foreground/60 ml-1">
                                                            ({isArabic ? "اختر ما يناسب" : "Select what applies"})
                                                        </span>
                                                    </Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setVariationMode('requirements', index, 'all')}
                                                            className={cn(
                                                                "px-2 py-0.5 rounded-lg border text-[10px] transition-all duration-300",
                                                                req.variations.mode === 'all'
                                                                    ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]"
                                                                    : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
                                                            )}
                                                        >
                                                            ✅ {isArabic ? "كل الفيرنتات" : "All"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setVariationMode('requirements', index, 'selected')}
                                                            className={cn(
                                                                "px-2 py-0.5 rounded-lg border text-[10px] transition-all duration-300",
                                                                req.variations.mode === 'selected'
                                                                    ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]"
                                                                    : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
                                                            )}
                                                        >
                                                            🎯 {isArabic ? "فيرنتات محددة" : "Specific"}
                                                        </button>
                                                    </div>

                                                    {req.variations.mode === 'selected' && (
                                                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                            {variations.map((v: any) => {
                                                                const combo = v.combination || {};
                                                                const comboText = Object.entries(combo)
                                                                    .map(([key, value]) => `${key}: ${value}`)
                                                                    .join(' ');
                                                                const isSelected = req.variations.ids.includes(v.id);
                                                                const price = v.price || v.old_price || getProductPrice(req.listing_id);

                                                                return (
                                                                    <button
                                                                        key={v.id}
                                                                        type="button"
                                                                        onClick={() => toggleVariation('requirements', index, v.id)}
                                                                        className={cn(
                                                                            "px-2 py-0.5 rounded-lg border text-[10px] transition-all duration-300",
                                                                            isSelected
                                                                                ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]"
                                                                                : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-slate-100/50"
                                                                        )}
                                                                    >
                                                                        {comboText || v.id.slice(0, 6)}
                                                                        {price && (
                                                                            <span className="text-[8px] text-emerald-500 ml-1">
                                                                                {formatPrice(Number(price), app.currency, app.lang)}
                                                                            </span>
                                                                        )}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                    {req.variations.mode === 'all' && (
                                                        <p className="text-[10px] text-emerald-500/60 mt-0.5">
                                                            ✅ {isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"}
                                                            {(() => {
                                                                const product = listings.find((l: any) => l.id === req.listing_id);
                                                                if (product) {
                                                                    return ` (${formatPrice(Number(product.price), app.currency, app.lang)})`;
                                                                }
                                                                return '';
                                                            })()}
                                                        </p>
                                                    )}
                                                    {req.variations.mode === 'selected' && req.variations.ids.length === 1 && (
                                                        <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
                                                            💰 {isArabic ? "سعر الفيرنت" : "Variation price"}: {
                                                                formatPrice(
                                                                    Number(getVariationPrice(req.listing_id, req.variations.ids[0]) || 0),
                                                                    app.currency,
                                                                    app.lang
                                                                )
                                                            }
                                                        </p>
                                                    )}
                                                    {req.variations.mode === 'selected' && req.variations.ids.length > 1 && (
                                                        <p className="text-[10px] text-amber-500/60 mt-0.5">
                                                            ⚠️ {isArabic ? "تم اختيار عدة فيرنتات، سيتم تطبيق العرض على جميعها" : "Multiple variations selected, offer will apply to all"}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div>
                                                <Label className="text-xs text-muted-foreground">
                                                    📦 {isArabic ? "الكمية المطلوبة" : "Required Quantity"}
                                                </Label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 w-7 rounded-full hover:bg-[#2a655f]/10"
                                                        onClick={() => {
                                                            const newReqs = [...requirements];
                                                            newReqs[index].quantity = Math.max(1, req.quantity - 1);
                                                            setRequirements(newReqs);
                                                        }}
                                                        type="button"
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-8 text-center font-bold text-[#2a655f]">
                                                        {req.quantity}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 w-7 rounded-full hover:bg-[#2a655f]/10"
                                                        onClick={() => {
                                                            const newReqs = [...requirements];
                                                            newReqs[index].quantity = req.quantity + 1;
                                                            setRequirements(newReqs);
                                                        }}
                                                        type="button"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {offerType === 'bundle' && requirements.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-xl text-red-500 hover:bg-red-50/50 hover:text-red-600 flex-shrink-0"
                                                onClick={() => removeRequirement(index)}
                                                type="button"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* ===== النتيجة (الهدية) ===== */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            🎁 {isArabic ? "النتيجة (الهدية)" : "Result (Gift)"}
                            <span className="text-red-500">*</span>
                            {offerType === 'bogo' && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                                    {isArabic ? "نفس المنتج" : "Same product"}
                                </Badge>
                            )}
                        </Label>

                        <div>
                            <Label className="text-xs text-muted-foreground">
                                {isArabic ? "المنتج" : "Product"}
                            </Label>
                            <Select
                                value={result.listing_id}
                                onValueChange={(v) => {
                                    const hasGiftVars = hasVariations(v);
                                    setResult({ 
                                        ...result, 
                                        listing_id: v, 
                                        variations: hasGiftVars ? { mode: 'selected', ids: [] } : { mode: 'all', ids: [] },
                                        variationQuantities: {}
                                    });
                                }}
                            >
                                <SelectTrigger className="mt-1 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20">
                                    <SelectValue placeholder={isArabic ? "اختر منتج الهدية" : "Select gift product"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl max-h-40">
                                    {listings.map((l: any) => (
                                        <SelectItem 
                                            key={l.id} 
                                            value={l.id}
                                            disabled={offerType === 'bogo' && l.id !== requirements[0]?.listing_id}
                                        >
                                            {l.title_ar} - {formatPrice(Number(l.price), app.currency, app.lang)}
                                            {offerType === 'bogo' && l.id === requirements[0]?.listing_id && (
                                                <span className="text-[10px] text-emerald-500 ml-1">
                                                    ✅ {isArabic ? "نفس المنتج" : "Same product"}
                                                </span>
                                            )}
                                            {hasVariations(l.id) && (
                                                <span className="text-[10px] text-amber-500 ml-1">
                                                    🎨 {isArabic ? "يحتوي فيرنتات" : "Has variations"}
                                                </span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {offerType === 'bogo' && (
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    ℹ️ {isArabic ? "في عرض BOGO، الهدية هي نفس المنتج" : "In BOGO, the gift is the same product"}
                                </p>
                            )}
                        </div>

                        {result.listing_id && (() => {
                            const resultVariations = getProductVariations(result.listing_id);
                            const giftHasVars = resultVariations.length > 0;
                            const totalQty = result.quantity || 1;
                            const variationQuantities = result.variationQuantities || {};
                            const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
                            const remaining = totalQty - distributedTotal;
                            
                            return (
                                <>
                                    {giftHasVars && (
                                        <>
                                            <div>
                                                <Label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                    🎨 {isArabic ? "فيرنتات الهدية (إجباري)" : "Gift Variations (Required)"}
                                                    <span className="text-red-500">*</span>
                                                    <span className="text-[10px] text-muted-foreground/60 ml-1">
                                                        ({isArabic ? "اختر فيرنت محدد" : "Select a specific variation"})
                                                    </span>
                                                </Label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setVariationMode('result', null, 'selected')}
                                                        className={cn(
                                                            "px-2 py-0.5 rounded-lg border text-[10px] transition-all duration-300",
                                                            result.variations.mode === 'selected'
                                                                ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]"
                                                                : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600"
                                                        )}
                                                    >
                                                        🎯 {isArabic ? "فيرنت محدد" : "Specific Variation"}
                                                    </button>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                    {resultVariations.map((v: any) => {
                                                        const combo = v.combination || {};
                                                        const comboText = Object.entries(combo)
                                                            .map(([key, value]) => `${key}: ${value}`)
                                                            .join(' ');
                                                        const isSelected = result.variations.ids.includes(v.id);
                                                        const price = v.price || v.old_price || getProductPrice(result.listing_id);
                                                        const currentQty = variationQuantities[v.id] || 0;

                                                        return (
                                                            <button
                                                                key={v.id}
                                                                type="button"
                                                                onClick={() => toggleVariation('result', null, v.id)}
                                                                className={cn(
                                                                    "px-2 py-0.5 rounded-lg border text-[10px] transition-all duration-300",
                                                                    isSelected
                                                                        ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f]"
                                                                        : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-slate-100/50"
                                                                )}
                                                            >
                                                                {comboText || v.id.slice(0, 6)}
                                                                {price && (
                                                                    <span className="text-[8px] text-emerald-500 ml-1">
                                                                        {formatPrice(Number(price), app.currency, app.lang)}
                                                                    </span>
                                                                )}
                                                                {isSelected && (
                                                                    <span className="text-[8px] text-emerald-600 ml-1">
                                                                        (×{currentQty})
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {result.variations.mode === 'selected' && result.variations.ids.length === 0 && (
                                                    <p className="text-[10px] text-red-500/70 mt-0.5">
                                                        ⚠️ {isArabic ? "الرجاء اختيار فيرنت للهدية" : "Please select a variation for the gift"}
                                                    </p>
                                                )}
                                                {result.variations.mode === 'selected' && result.variations.ids.length > 0 && (
                                                    <p className="text-[10px] text-emerald-500/60 mt-0.5">
                                                        ✅ {isArabic ? "تم اختيار" : "Selected"} {result.variations.ids.length} {isArabic ? "فيرنت" : "variation(s)"}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {!giftHasVars && (
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            ✅ {isArabic ? "هذا المنتج لا يحتوي على فيرنتات" : "This product has no variations"}
                                        </p>
                                    )}

                                    {/* ===== توزيع الكميات على الفيرنتات ===== */}
                                    {giftHasVars && result.variations.mode === 'selected' && result.variations.ids.length > 0 && (
                                        <div className="mt-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                    📊 {isArabic ? "توزيع الكميات" : "Quantity Distribution"}
                                                    <Badge className={cn(
                                                        "border-0 text-[9px]",
                                                        distributedTotal === totalQty 
                                                            ? "bg-emerald-500/20 text-emerald-600" 
                                                            : "bg-amber-500/20 text-amber-600"
                                                    )}>
                                                        {distributedTotal}/{totalQty}
                                                    </Badge>
                                                    {remaining > 0 && (
                                                        <Badge className="bg-amber-500/20 text-amber-600 border-0 text-[9px]">
                                                            {isArabic ? `متبقي ${remaining}` : `${remaining} remaining`}
                                                        </Badge>
                                                    )}
                                                </Label>
                                                {remaining > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => distributeRemainingGiftQuantity(
                                                            resultVariations.filter((v: any) => result.variations.ids.includes(v.id))
                                                        )}
                                                        className="text-[10px] text-[#2a655f] hover:underline transition-colors flex items-center gap-1 px-2 py-1 border border-[#2a655f]/20 rounded-lg hover:bg-[#2a655f]/5"
                                                    >
                                                        <Zap className="h-3 w-3" />
                                                        {isArabic ? `وزع ${remaining}` : `Distribute ${remaining}`}
                                                    </button>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {result.variations.ids.map((id: string) => {
                                                    const variation = resultVariations.find((v: any) => v.id === id);
                                                    if (!variation) return null;
                                                    const combo = variation.combination || {};
                                                    const comboText = Object.entries(combo)
                                                        .map(([key, value]) => `${key}: ${value}`)
                                                        .join(' • ');
                                                    const currentQty = variationQuantities[id] || 0;
                                                    const price = variation.price || getProductPrice(result.listing_id);
                                                    
                                                    return (
                                                        <div key={id} className="flex items-center gap-2 p-2 border rounded-xl border-slate-200/50 bg-white/50 dark:bg-slate-800/50">
                                                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                                {comboText}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                ({formatPrice(Number(price), app.currency, app.lang)})
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleGiftVariationQuantityChange(id, -1)}
                                                                    className={cn(
                                                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                                                        currentQty > 0 
                                                                            ? "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                                                                            : "bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800"
                                                                    )}
                                                                    disabled={currentQty === 0}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center font-bold text-[#0d2e2a] text-sm">
                                                                    {currentQty}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleGiftVariationQuantityChange(id, 1)}
                                                                    className={cn(
                                                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                                                        distributedTotal < totalQty
                                                                            ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white"
                                                                            : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700"
                                                                    )}
                                                                    disabled={distributedTotal >= totalQty}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            );
                        })()}

                        <div>
                            <Label className="text-xs text-muted-foreground">
                                📦 {isArabic ? "الكمية الإجمالية للهدية" : "Total Gift Quantity"}
                            </Label>
                            <div className="flex items-center gap-2 mt-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 rounded-full hover:bg-[#2a655f]/10"
                                    onClick={() => setResult({ ...result, quantity: Math.max(1, result.quantity - 1) })}
                                    type="button"
                                >
                                    -
                                </Button>
                                <span className="w-8 text-center font-bold text-[#2a655f]">
                                    {result.quantity}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 rounded-full hover:bg-[#2a655f]/10"
                                    onClick={() => setResult({ ...result, quantity: result.quantity + 1 })}
                                    type="button"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ===== المدة ===== */}
                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            ⏰ {isArabic ? "المدة" : "Duration"}
                        </Label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsPermanent(true); setError(null); }}
                                className={cn(
                                    "px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-300 flex-1 cursor-pointer",
                                    isPermanent
                                        ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f] shadow-sm"
                                        : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-[#2a655f]/5"
                                )}
                                disabled={isSubmitting}
                            >
                                <Clock className="h-4 w-4 inline mr-1.5" />
                                {isArabic ? "🔓 دائم" : "🔓 Permanent"}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setIsPermanent(false); setError(null); }}
                                className={cn(
                                    "px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all duration-300 flex-1 cursor-pointer",
                                    !isPermanent
                                        ? "border-[#2a655f] bg-[#2a655f]/10 text-[#2a655f] shadow-sm"
                                        : "border-slate-200/50 hover:border-[#2a655f]/30 text-slate-600 hover:bg-[#2a655f]/5"
                                )}
                                disabled={isSubmitting}
                            >
                                <Calendar className="h-4 w-4 inline mr-1.5" />
                                {isArabic ? "📅 محددة" : "📅 Limited"}
                            </button>
                        </div>
                        {!isPermanent && (
                            <Input
                                type="datetime-local"
                                value={expiresAt}
                                onChange={(e) => { setExpiresAt(e.target.value); setError(null); }}
                                className="mt-1 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
                                disabled={isSubmitting}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800/30 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300 text-center">
                            🎯 {getPreviewText()}
                        </p>
                        <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 text-center mt-1 space-y-0.5">
                            <p>
                                {isArabic 
                                    ? `💰 عند شراء ${requirements.reduce((sum, r) => sum + r.quantity, 0)}، تحصل على ${result.quantity} مجاناً`
                                    : `💰 Buy ${requirements.reduce((sum, r) => sum + r.quantity, 0)}, get ${result.quantity} free`
                                }
                            </p>
                            {!isPermanent && expiresAt && (
                                <p className="text-[10px] text-emerald-500/60">
                                    📅 {isArabic ? 'ينتهي في' : 'Expires'} {new Date(expiresAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')}
                                </p>
                            )}
                            {selectedCategoryId && (
                                <p className="text-[10px] text-muted-foreground">
                                    📂 {isArabic ? 'التصنيف' : 'Category'}: {
                                        categories.find((c: any) => c.id === selectedCategoryId)?.[isArabic ? 'name_ar' : 'name_en'] || ''
                                    }
                                </p>
                            )}
                            {result.variationQuantities && Object.keys(result.variationQuantities).length > 0 && (
                                <p className="text-[10px] text-emerald-500/60">
                                    🎨 {isArabic ? 'توزيع الكميات' : 'Quantity distribution'}: {
                                        Object.entries(result.variationQuantities)
                                            .map(([id, qty]) => `${qty}`)
                                            .join(' + ')
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl border-slate-200/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                        disabled={isSubmitting}
                    >
                        <X className="h-4 w-4 mr-1.5" />
                        {isArabic ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button
                        className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {isArabic ? "جاري الحفظ..." : "Saving..."}
                            </>
                        ) : (
                            <>
                                <Gift className="h-4 w-4 mr-2" />
                                {existingOffer 
                                    ? (isArabic ? "حفظ التغييرات" : "Save Changes")
                                    : (isArabic ? "إضافة العرض" : "Add Offer")
                                }
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ✅ ✅ ✅ استخدام React.memo لمنع التحميل المتكرر
export const AddBogoOfferDialog = React.memo(AddBogoOfferDialogComponent);