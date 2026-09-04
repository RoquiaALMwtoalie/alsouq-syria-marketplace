// src/components/dashboard/AddBogoOfferDialog.tsx - الكود المُصحح بالكامل مع الألوان الوردية والزيتية

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
    variationQuantities?: Record<string, number>;
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
        { listing_id: '', variations: { mode: 'all', ids: [] }, quantity: 1, variationQuantities: {} }
    ]);
    
    // ✅ النتيجة (الهدية) مع دعم الكميات لكل تشكيل
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

    // ✅ السعر الفعلي للتشكيل المحدد
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
    // ✅ ✅ ✅ دوال مساعدة معدلة لدعم الألوان
    // ============================================================

    // ✅ دالة جلب التشكيلات والألوان معاً
    const getProductVariationsOrColors = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        if (!product) return [];
        
        // ✅ جلب التشكيلات (product_variations)
        const variations = product.variations || [];
        
        // ✅ جلب الألوان (product_colors)
        const colors = product.colors || product.product_colors || [];
        
        // ✅ تحويل الألوان إلى تنسيق مشابه للتشكيلات
        const colorVariations = colors.map((color: any) => ({
            id: color.id,
            combination: {
                colors: color.color_name_ar || color.color_name_en || 'لون',
                ...(color.color_hex && { hex: color.color_hex })
            },
            price: product.price || 0,
            old_price: product.old_price || null,
            image_url: color.image_url || null,
            is_active: true,
            stock_quantity: 0,
            _type: 'color'
        }));
        
        // ✅ دمج التشكيلات والألوان
        return [...variations, ...colorVariations];
    };

    // ✅ دالة التحقق من وجود تشكيلات أو ألوان
    const hasVariationsOrColors = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        if (!product) return false;
        
        const hasVariations = product.variations && product.variations.length > 0;
        const hasColors = product.colors && product.colors.length > 0;
        const hasProductColors = product.product_colors && product.product_colors.length > 0;
        
        return hasVariations || hasColors || hasProductColors;
    };

    // ✅ دالة جلب اسم المنتج
    const getProductTitle = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        return product?.title_ar || '';
    };

    // ✅ دالة جلب سعر المنتج
    const getProductPrice = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        return product?.price || 0;
    };

    // ✅ جلب سعر التشكيل المحدد
    const getVariationPrice = (listingId: string, variationId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        if (!product) return null;
        const variation = product.variations?.find((v: any) => v.id === variationId);
        if (variation) {
            return variation?.price || variation?.old_price || product.price || 0;
        }
        // ✅ البحث في الألوان إذا لم يتم العثور عليه في التشكيلات
        const colors = product.colors || product.product_colors || [];
        const color = colors.find((c: any) => c.id === variationId);
        if (color) {
            return product.price || 0;
        }
        return product.price || 0;
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
        setRequirements([...requirements, { listing_id: '', variations: { mode: 'all', ids: [] }, quantity: 1, variationQuantities: {} }]);
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
            newReqs[index].variationQuantities = {};
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
            
            if (newReqs[reqIndex].variations.ids.length === 0) {
                newReqs[reqIndex].variationQuantities = {};
            } else {
                const totalQty = newReqs[reqIndex].quantity || 1;
                const ids = newReqs[reqIndex].variations.ids;
                newReqs[reqIndex].variationQuantities = autoDistributeQuantities(ids, totalQty);
            }
            
            setRequirements(newReqs);
        } else if (target === 'result') {
            const current = result.variations.ids;
            const newIds = current.includes(variationId)
                ? current.filter(id => id !== variationId)
                : [...current, variationId];
            
            let newVariationQuantities = { ...(result.variationQuantities || {}) };
            if (newIds.length === 0) {
                newVariationQuantities = {};
            } else {
                const totalQty = result.quantity || 1;
                newVariationQuantities = autoDistributeQuantities(newIds, totalQty);
            }
            
            setResult({
                ...result,
                variations: { ...result.variations, ids: newIds },
                variationQuantities: newVariationQuantities
            });
        }
    };

    const setVariationMode = (target: 'requirements' | 'result', reqIndex: number | null, mode: 'all' | 'selected') => {
        if (target === 'requirements' && reqIndex !== null) {
            const newReqs = [...requirements];
            newReqs[reqIndex].variations = { mode, ids: [] };
            newReqs[reqIndex].variationQuantities = {};
            setRequirements(newReqs);
            if (mode === 'all') {
                setSelectedVariationPrice(null);
            }
        } else if (target === 'result') {
            setResult({ ...result, variations: { mode, ids: [] }, variationQuantities: {} });
        }
    };

    // ✅ دالة تغيير كمية تشكيل الشرط
    const handleRequirementVariationQuantityChange = useCallback((reqIndex: number, variationId: string, delta: number) => {
        setRequirements(prev => {
            const newReqs = [...prev];
            const req = newReqs[reqIndex];
            const currentQuantities = req.variationQuantities || {};
            const currentQty = currentQuantities[variationId] || 0;
            const newQty = Math.max(0, currentQty + delta);
            const totalQty = req.quantity || 1;
            const currentTotal = Object.values(currentQuantities).reduce((sum, qty) => sum + qty, 0);
            
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
            
            newReqs[reqIndex] = { ...req, variationQuantities: newQuantities };
            return newReqs;
        });
    }, [isArabic]);

    // ✅ دالة تغيير كمية تشكيل الهدية
    const handleGiftVariationQuantityChange = useCallback((variationId: string, delta: number) => {
        setResult(prev => {
            const currentQuantities = prev.variationQuantities || {};
            const currentQty = currentQuantities[variationId] || 0;
            const newQty = Math.max(0, currentQty + delta);
            const totalQty = prev.quantity || 1;
            const currentTotal = Object.values(currentQuantities).reduce((sum, qty) => sum + qty, 0);
            
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

    // ✅ دالة توزيع الكمية المتبقية على تشكيلات الشرط
    const distributeRemainingRequirementQuantity = useCallback((reqIndex: number, variations: any[]) => {
        setRequirements(prev => {
            const newReqs = [...prev];
            const req = newReqs[reqIndex];
            const totalQty = req.quantity || 1;
            const currentQuantities = req.variationQuantities || {};
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
                    ? `✅ تم توزيع ${remaining} المتبقية على ${availableVariations.length} تشكيلات`
                    : `✅ Distributed ${remaining} remaining to ${availableVariations.length} variations`
            );
            
            newReqs[reqIndex] = { ...req, variationQuantities: newQuantities };
            return newReqs;
        });
    }, [isArabic]);

    // ✅ دالة توزيع الكمية المتبقية بالتساوي على الهدية
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
                    ? `✅ تم توزيع ${remaining} المتبقية على ${availableVariations.length} تشكيلات`
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
    // ✅ ✅ ✅ حفظ العرض - المُصحح بالكامل
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

        // ✅ استخدام الدالة الجديدة للتحقق من وجود تشكيلات أو ألوان
        const giftHasVariationsOrColors = hasVariationsOrColors(result.listing_id);
        if (giftHasVariationsOrColors && result.variations.mode === 'all') {
            setError(isArabic 
                ? "❌ منتج الهدية يحتوي على تشكيلات أو ألوان، الرجاء اختيار تشكيل محدد للهدية" 
                : "❌ Gift product has variations or colors, please select a specific variation for the gift"
            );
            return;
        }

        if (giftHasVariationsOrColors && result.variations.mode === 'selected' && result.variations.ids.length === 0) {
            setError(isArabic 
                ? "❌ الرجاء اختيار تشكيل واحد على الأقل للهدية" 
                : "❌ Please select at least one variation for the gift"
            );
            return;
        }

        // ✅ التحقق من توزيع الكميات للشروط
        for (let i = 0; i < requirements.length; i++) {
            const req = requirements[i];
            const hasVariationsOrColors = getProductVariationsOrColors(req.listing_id).length > 0;
            
            if (hasVariationsOrColors && req.variations.mode === 'selected' && req.variations.ids.length > 0) {
                const totalQty = req.quantity || 1;
                const variationQuantities = req.variationQuantities || {};
                const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
                
                if (distributedTotal !== totalQty) {
                    const newQuantities = autoDistributeQuantities(req.variations.ids, totalQty);
                    const newReqs = [...requirements];
                    newReqs[i] = { ...req, variationQuantities: newQuantities };
                    setRequirements(newReqs);
                    
                    const finalDistributedTotal = Object.values(newQuantities).reduce((sum, qty) => sum + qty, 0);
                    if (finalDistributedTotal !== totalQty) {
                        setError(isArabic 
                            ? `❌ مجموع الكميات الموزعة في الشرط ${i+1} (${finalDistributedTotal}) لا يساوي الكمية الإجمالية (${totalQty})`
                            : `❌ Total distributed quantity in requirement ${i+1} (${finalDistributedTotal}) doesn't match total (${totalQty})`
                        );
                        return;
                    }
                }
                
                const finalDistributedTotal = Object.values(req.variationQuantities || {}).reduce((sum, qty) => sum + qty, 0);
                if (finalDistributedTotal !== totalQty) {
                    setError(isArabic 
                        ? `❌ مجموع الكميات الموزعة في الشرط ${i+1} (${finalDistributedTotal}) لا يساوي الكمية الإجمالية (${totalQty})`
                        : `❌ Total distributed quantity in requirement ${i+1} (${finalDistributedTotal}) doesn't match total (${totalQty})`
                    );
                    return;
                }
                
                const hasZeroQuantity = req.variations.ids.some(id => (req.variationQuantities?.[id] || 0) === 0);
                if (hasZeroQuantity) {
                    setError(isArabic 
                        ? `❌ جميع التشكيلات المختارة في الشرط ${i+1} يجب أن يكون لها كمية أكبر من 0`
                        : `❌ All selected variations in requirement ${i+1} must have quantity greater than 0`
                    );
                    return;
                }
            }
        }

        // ✅ التحقق من توزيع الكميات للهدية
        let variationQuantities = { ...(result.variationQuantities || {}) };
        
        if (giftHasVariationsOrColors && result.variations.mode === 'selected' && result.variations.ids.length > 0) {
            const totalQty = result.quantity || 1;
            const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
            
            if (distributedTotal !== totalQty) {
                variationQuantities = autoDistributeQuantities(result.variations.ids, totalQty);
                console.log("🔄 [handleSubmit] Auto-distributed quantities:", variationQuantities);
            }
            
            const finalDistributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
            if (finalDistributedTotal !== totalQty) {
                setError(isArabic 
                    ? `❌ مجموع الكميات الموزعة (${finalDistributedTotal}) لا يساوي الكمية الإجمالية للهدية (${totalQty})`
                    : `❌ Total distributed quantity (${finalDistributedTotal}) doesn't match gift total (${totalQty})`
                );
                return;
            }
            
            const hasZeroQuantity = result.variations.ids.some(id => (variationQuantities[id] || 0) === 0);
            if (hasZeroQuantity) {
                setError(isArabic 
                    ? "❌ جميع التشكيلات المختارة يجب أن يكون لها كمية أكبر من 0"
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
                    quantity: r.quantity,
                    variation_quantities: r.variationQuantities || {}
                })),
                result_variation_ids: result.variations.mode === 'selected' ? result.variations.ids : null,
                starts_at: new Date().toISOString(),
                expires_at: isPermanent ? null : expiresAt || null,
                is_active: true,
                display_text_ar: getPreviewText(),
                display_text_en: getPreviewText(),
                category_id: selectedCategoryId || null,
                metadata: {
                    variation_quantities: variationQuantities,
                    requirement_variation_quantities: requirements.map(r => ({
                        product_id: r.listing_id,
                        quantities: r.variationQuantities || {}
                    }))
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
        if (!open) {
            console.log("🔍 [AddBogoOfferDialog] Dialog is closed, skipping");
            return;
        }

        if (existingOffer) {
            console.log("🔍 [AddBogoOfferDialog] Editing existing offer, type:", existingOffer.offer_type);
            
            if (isUpdatingFromExisting.current) {
                console.log("⏳ [AddBogoOfferDialog] Already updating from existing, skipping...");
                return;
            }
            
            isUpdatingFromExisting.current = true;
            
            setOfferType(existingOffer.offer_type || 'bogo');
            
            setSelectedCategoryId(existingOffer.category_id || '');
            setCategorySearch(
                categories.find((c: any) => c.id === existingOffer.category_id)?.[isArabic ? 'name_ar' : 'name_en'] || ''
            );
            
            if (existingOffer.required_product_ids && existingOffer.required_product_ids.length > 0) {
                const requirementsData = existingOffer.required_product_ids.map((productId: string, index: number) => {
                    let variations = { mode: 'all' as const, ids: [] as string[] };
                    let quantity = 1;
                    let variationQuantities: Record<string, number> = {};
                    
                    if (existingOffer.required_variations && existingOffer.required_variations[index]) {
                        const reqVar = existingOffer.required_variations[index];
                        if (reqVar.variation_ids && reqVar.variation_ids.length > 0) {
                            variations = { mode: 'selected', ids: reqVar.variation_ids };
                        }
                        quantity = reqVar.quantity || 1;
                        
                        if (reqVar.variation_quantities) {
                            variationQuantities = reqVar.variation_quantities;
                            console.log(`🟢 [Edit] Restored variation quantities for requirement ${index}:`, variationQuantities);
                        } else if (reqVar.variation_ids && reqVar.variation_ids.length > 0) {
                            variationQuantities = autoDistributeQuantities(reqVar.variation_ids, quantity);
                            console.log(`🟡 [Edit] Auto-distributed quantities for requirement ${index}:`, variationQuantities);
                        }
                    }
                    
                    return {
                        listing_id: productId,
                        variations: variations,
                        quantity: quantity,
                        variationQuantities: variationQuantities
                    };
                });
                setRequirements(requirementsData);
            }
            
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
                    
                    if (existingOffer.metadata?.variation_quantities) {
                        variationQuantities = existingOffer.metadata.variation_quantities;
                        console.log("🟢 [Edit] Restored variation quantities from metadata:", variationQuantities);
                    } else {
                        const totalQty = existingOffer.get_quantity || 1;
                        const ids = existingOffer.result_variation_ids;
                        variationQuantities = autoDistributeQuantities(ids, totalQty);
                        console.log("🟡 [Edit] Auto-distributed quantities:", variationQuantities);
                    }
                } else {
                    // ✅ استخدام الدالة الجديدة للتحقق من وجود تشكيلات أو ألوان
                    const giftHasVarsOrColors = hasVariationsOrColors(giftListingId);
                    if (giftHasVarsOrColors) {
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
            
            if (existingOffer.expires_at) {
                setIsPermanent(false);
                const date = new Date(existingOffer.expires_at);
                const formattedDate = date.toISOString().slice(0, 16);
                setExpiresAt(formattedDate);
                console.log("🟢 [Edit] Restored expires_at:", formattedDate);
            } else {
                setIsPermanent(true);
                setExpiresAt("");
            }
            
            isUpdatingFromExisting.current = false;
            return;
        }

        console.log("🔍 [AddBogoOfferDialog] Creating new offer");
        
        setOfferType('bogo');
        setSelectedCategoryId('');
        setCategorySearch('');
        setRequirements([{ 
            listing_id: initialProduct?.id || '', 
            variations: { mode: 'all', ids: [] }, 
            quantity: 1,
            variationQuantities: {}
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
            <DialogContent className="max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40 shadow-2xl shadow-[#d81b60]/20 bg-white dark:bg-slate-900">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl text-[#d81b60]">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white shadow-lg shadow-[#d81b60]/25">
                            <Gift className="h-5 w-5" />
                        </div>
                        {existingOffer 
                            ? (isArabic ? "✏️ تعديل عرض ترويجي" : "✏️ Edit Promo Offer")
                            : (isArabic ? "🎁 إضافة عرض ترويجي" : "🎁 Add Promo Offer")
                        }
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* ===== التصنيف مع بحث ذكي - وردي/زيتي ===== */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <Layers className="h-4 w-4 text-[#d81b60]" />
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
                                    className="ps-9 h-11 rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40 focus:border-[#d81b60]/50 focus:ring-2 focus:ring-[#d81b60]/20 transition-all duration-300 bg-white dark:bg-slate-900"
                                />
                                {categorySearch && (
                                    <button
                                        onClick={() => {
                                            setCategorySearch("");
                                            setSelectedCategoryId("");
                                        }}
                                        className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-[#d81b60] transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            
                            {isCategoryOpen && (
                                <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40 bg-white dark:bg-slate-900 shadow-xl shadow-[#d81b60]/20">
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
                                                        "w-full text-start px-4 py-3 text-sm hover:bg-[#d81b60]/5 dark:hover:bg-[#d81b60]/20 transition-all flex items-center gap-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                                                        isSelected && "bg-[#d81b60]/10 dark:bg-[#d81b60]/30"
                                                    )}
                                                    onClick={() => {
                                                        setSelectedCategoryId(cat.id);
                                                        setCategorySearch(isArabic ? cat.name_ar : cat.name_en);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                >
                                                    {isSelected && (
                                                        <CheckCircle2 className="h-4 w-4 text-[#d81b60] flex-shrink-0" />
                                                    )}
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <span>{isArabic ? cat.name_ar : cat.name_en}</span>
                                                        {cat.is_featured && (
                                                            <Badge className="bg-[#d81b60]/10 text-[#d81b60] border-0 text-[8px]">
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
                            <div className="flex items-center gap-2 p-2 bg-[#d81b60]/5 rounded-lg border border-[#d81b60]/20">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm text-muted-foreground">
                                    {isArabic ? "التصنيف المختار:" : "Selected category:"}
                                </span>
                                <Badge className="bg-[#d81b60]/10 text-[#d81b60] border-0">
                                    {categories.find((c: any) => c.id === selectedCategoryId)?.[isArabic ? 'name_ar' : 'name_en'] || ""}
                                </Badge>
                            </div>
                        )}
                        
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Search className="h-3 w-3" />
                            {isArabic ? "💡 اكتب للبحث عن تصنيف معين" : "💡 Type to search for a specific category"}
                        </p>
                    </div>

                    {/* ===== نوع العرض - وردي/زيتي ===== */}
                    <div className="space-y-2">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {isArabic ? "📌 نوع العرض" : "📌 Offer Type"}
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setOfferType('bogo')}
                                className={cn(
                                    "p-3 rounded-xl border-3 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                                    offerType === 'bogo'
                                        ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60] shadow-sm shadow-[#d81b60]/10"
                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600 hover:bg-[#d81b60]/5"
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
                                    "p-3 rounded-xl border-3 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                                    offerType === 'cross_sell'
                                        ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60] shadow-sm shadow-[#d81b60]/10"
                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600 hover:bg-[#d81b60]/5"
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
                                    "p-3 rounded-xl border-3 text-sm font-medium transition-all duration-300 text-center cursor-pointer",
                                    offerType === 'bundle'
                                        ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60] shadow-sm shadow-[#d81b60]/10"
                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600 hover:bg-[#d81b60]/5"
                                )}
                            >
                                📦 {isArabic ? "باقة منتجات" : "Bundle"}
                            </button>
                        </div>
                    </div>

                    {/* ===== الشروط (المنتجات المطلوبة) - وردي/زيتي ===== */}
                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                🛍️ {isArabic ? "الشروط (المنتجات المطلوبة)" : "Requirements (Required Products)"}
                                {offerType === 'bundle' && (
                                    <Badge className="bg-[#d81b60]/10 text-[#d81b60] border-0 text-[10px]">
                                        {isArabic ? "باقة" : "Bundle"}
                                    </Badge>
                                )}
                            </Label>
                            {offerType === 'bundle' && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 px-2 text-[10px] border-3 border-[#d81b60]/30 text-[#d81b60] hover:bg-[#d81b60]/10"
                                    onClick={addRequirement}
                                    type="button"
                                >
                                    <Plus className="h-3 w-3 mr-1" />
                                    {isArabic ? "إضافة منتج" : "Add Product"}
                                </Button>
                            )}
                        </div>

                        {requirements.map((req, index) => {
                            // ✅ استخدام الدالة الجديدة
                            const variations = getProductVariationsOrColors(req.listing_id);
                            const isBogoAndSingle = offerType === 'bogo' && requirements.length === 1;
                            const totalQty = req.quantity || 1;
                            const variationQuantities = req.variationQuantities || {};
                            const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
                            const remaining = totalQty - distributedTotal;
                            const hasSelectedVariations = req.variations.mode === 'selected' && req.variations.ids.length > 0;

                            return (
                                <div key={index} className="p-3 bg-white dark:bg-slate-900 rounded-xl border-3 border-slate-200/50 dark:border-slate-700/50">
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
                                                    <SelectTrigger className="mt-1 rounded-xl border-3 border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20">
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
                                                        🎨 {isArabic ? "التشكيلات والألوان" : "Variations & Colors"}
                                                        <span className="text-[10px] text-muted-foreground/60 ml-1">
                                                            ({isArabic ? "اختر ما يناسب" : "Select what applies"})
                                                        </span>
                                                    </Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setVariationMode('requirements', index, 'all')}
                                                            className={cn(
                                                                "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300",
                                                                req.variations.mode === 'all'
                                                                    ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60]"
                                                                    : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600"
                                                            )}
                                                        >
                                                            ✅ {isArabic ? "كل الخيارات" : "All"}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setVariationMode('requirements', index, 'selected')}
                                                            className={cn(
                                                                "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300",
                                                                req.variations.mode === 'selected'
                                                                    ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60]"
                                                                    : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600"
                                                            )}
                                                        >
                                                            🎯 {isArabic ? "خيارات محددة" : "Specific"}
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
                                                                const currentQty = variationQuantities[v.id] || 0;
                                                                const isColor = v._type === 'color';

                                                                return (
                                                                    <button
                                                                        key={v.id}
                                                                        type="button"
                                                                        onClick={() => toggleVariation('requirements', index, v.id)}
                                                                        className={cn(
                                                                            "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300 flex items-center gap-1",
                                                                            isSelected
                                                                                ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60]"
                                                                                : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600 hover:bg-slate-100/50"
                                                                        )}
                                                                    >
                                                                        {isColor && v.combination?.hex && (
                                                                            <span 
                                                                                className="w-3 h-3 rounded-full border border-slate-200 flex-shrink-0"
                                                                                style={{ backgroundColor: v.combination.hex }}
                                                                            />
                                                                        )}
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
                                                    )}
                                                    {req.variations.mode === 'all' && (
                                                        <p className="text-[10px] text-emerald-500/60 mt-0.5">
                                                            ✅ {isArabic ? "جميع الخيارات مشمولة" : "All options included"}
                                                            {(() => {
                                                                const product = listings.find((l: any) => l.id === req.listing_id);
                                                                if (product) {
                                                                    return ` (${formatPrice(Number(product.price), app.currency, app.lang)})`;
                                                                }
                                                                return '';
                                                            })()}
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
                                                        className="h-7 w-7 rounded-full hover:bg-[#d81b60]/10 border-3 border-[#d81b60]/30"
                                                        onClick={() => {
                                                            const newReqs = [...requirements];
                                                            const newQty = Math.max(1, req.quantity - 1);
                                                            newReqs[index].quantity = newQty;
                                                            if (req.variations.mode === 'selected' && req.variations.ids.length > 0) {
                                                                newReqs[index].variationQuantities = autoDistributeQuantities(req.variations.ids, newQty);
                                                            }
                                                            setRequirements(newReqs);
                                                        }}
                                                        type="button"
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-8 text-center font-bold text-[#d81b60]">
                                                        {req.quantity}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 w-7 rounded-full hover:bg-[#d81b60]/10 border-3 border-[#d81b60]/30"
                                                        onClick={() => {
                                                            const newReqs = [...requirements];
                                                            const newQty = req.quantity + 1;
                                                            newReqs[index].quantity = newQty;
                                                            if (req.variations.mode === 'selected' && req.variations.ids.length > 0) {
                                                                newReqs[index].variationQuantities = autoDistributeQuantities(req.variations.ids, newQty);
                                                            }
                                                            setRequirements(newReqs);
                                                        }}
                                                        type="button"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* ✅ توزيع الكميات على التشكيلات - وردي/زيتي */}
                                            {hasSelectedVariations && (
                                                <div className="mt-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                            📊 {isArabic ? "توزيع الكميات على الخيارات" : "Variation Quantity Distribution"}
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
                                                                onClick={() => distributeRemainingRequirementQuantity(
                                                                    index,
                                                                    variations.filter((v: any) => req.variations.ids.includes(v.id))
                                                                )}
                                                                className="text-[10px] text-[#d81b60] hover:underline transition-colors flex items-center gap-1 px-2 py-1 border-3 border-[#d81b60]/30 rounded-lg hover:bg-[#d81b60]/5"
                                                            >
                                                                <Zap className="h-3 w-3" />
                                                                {isArabic ? `وزع ${remaining}` : `Distribute ${remaining}`}
                                                            </button>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-wrap gap-2">
                                                        {req.variations.ids.map((id: string) => {
                                                            const variation = variations.find((v: any) => v.id === id);
                                                            if (!variation) return null;
                                                            const combo = variation.combination || {};
                                                            const comboText = Object.entries(combo)
                                                                .map(([key, value]) => `${key}: ${value}`)
                                                                .join(' • ');
                                                            const currentQty = variationQuantities[id] || 0;
                                                            const price = variation.price || getProductPrice(req.listing_id);
                                                            const isColor = variation._type === 'color';
                                                            
                                                            return (
                                                                <div key={id} className="flex items-center gap-2 p-2 border-3 rounded-xl border-[#d81b60]/30 bg-white/50 dark:bg-slate-800/50">
                                                                    {isColor && combo?.hex && (
                                                                        <span 
                                                                            className="w-3 h-3 rounded-full border border-slate-200 flex-shrink-0"
                                                                            style={{ backgroundColor: combo.hex }}
                                                                        />
                                                                    )}
                                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                                        {comboText}
                                                                    </span>
                                                                    <span className="text-[10px] text-muted-foreground">
                                                                        ({formatPrice(Number(price), app.currency, app.lang)})
                                                                    </span>
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRequirementVariationQuantityChange(index, id, -1)}
                                                                            className={cn(
                                                                                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border-3",
                                                                                currentQty > 0 
                                                                                    ? "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 border-slate-300"
                                                                                    : "bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800 border-slate-200"
                                                                            )}
                                                                            disabled={currentQty === 0}
                                                                        >
                                                                            -
                                                                        </button>
                                                                        <span className="w-8 text-center font-bold text-[#d81b60] text-sm">
                                                                            {currentQty}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRequirementVariationQuantityChange(index, id, 1)}
                                                                            className={cn(
                                                                                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border-3",
                                                                                distributedTotal < totalQty
                                                                                    ? "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white border-[#d81b60] shadow-sm shadow-[#d81b60]/30"
                                                                                    : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 border-slate-300"
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

                    {/* ===== النتيجة (الهدية) - وردي/زيتي ===== */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border-3 border-emerald-200/50 dark:border-emerald-800/30">
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
                                    const hasGiftVarsOrColors = hasVariationsOrColors(v);
                                    setResult({ 
                                        ...result, 
                                        listing_id: v, 
                                        variations: hasGiftVarsOrColors ? { mode: 'selected', ids: [] } : { mode: 'all', ids: [] },
                                        variationQuantities: {}
                                    });
                                }}
                            >
                                <SelectTrigger className="mt-1 rounded-xl border-3 border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20">
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
                                            {hasVariationsOrColors(l.id) && (
                                                <span className="text-[10px] text-amber-500 ml-1">
                                                    🎨 {isArabic ? "يحتوي خيارات" : "Has options"}
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
                            // ✅ استخدام الدالة الجديدة
                            const resultVariations = getProductVariationsOrColors(result.listing_id);
                            const giftHasVarsOrColors = resultVariations.length > 0;
                            const totalQty = result.quantity || 1;
                            const variationQuantities = result.variationQuantities || {};
                            const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
                            const remaining = totalQty - distributedTotal;
                            
                            return (
                                <>
                                    {giftHasVarsOrColors && (
                                        <>
                                            <div>
                                                <Label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                    🎨 {isArabic ? "خيارات الهدية (إجباري)" : "Gift Options (Required)"}
                                                    <span className="text-red-500">*</span>
                                                    <span className="text-[10px] text-muted-foreground/60 ml-1">
                                                        ({isArabic ? "اختر خيار محدد" : "Select a specific option"})
                                                    </span>
                                                </Label>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setVariationMode('result', null, 'selected')}
                                                        className={cn(
                                                            "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300",
                                                            result.variations.mode === 'selected'
                                                                ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60]"
                                                                : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600"
                                                        )}
                                                    >
                                                        🎯 {isArabic ? "خيار محدد" : "Specific Option"}
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
                                                        const isColor = v._type === 'color';

                                                        return (
                                                            <button
                                                                key={v.id}
                                                                type="button"
                                                                onClick={() => toggleVariation('result', null, v.id)}
                                                                className={cn(
                                                                    "px-2 py-0.5 rounded-lg border-3 text-[10px] transition-all duration-300 flex items-center gap-1",
                                                                    isSelected
                                                                        ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60]"
                                                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600 hover:bg-slate-100/50"
                                                                )}
                                                            >
                                                                {isColor && v.combination?.hex && (
                                                                    <span 
                                                                        className="w-3 h-3 rounded-full border border-slate-200 flex-shrink-0"
                                                                        style={{ backgroundColor: v.combination.hex }}
                                                                    />
                                                                )}
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
                                                        ⚠️ {isArabic ? "الرجاء اختيار خيار للهدية" : "Please select an option for the gift"}
                                                    </p>
                                                )}
                                                {result.variations.mode === 'selected' && result.variations.ids.length > 0 && (
                                                    <p className="text-[10px] text-emerald-500/60 mt-0.5">
                                                        ✅ {isArabic ? "تم اختيار" : "Selected"} {result.variations.ids.length} {isArabic ? "خيار" : "option(s)"}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {!giftHasVarsOrColors && (
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            ✅ {isArabic ? "هذا المنتج لا يحتوي على خيارات" : "This product has no options"}
                                        </p>
                                    )}

                                    {/* ===== توزيع الكميات على التشكيلات - وردي/زيتي ===== */}
                                    {giftHasVarsOrColors && result.variations.mode === 'selected' && result.variations.ids.length > 0 && (
                                        <div className="mt-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40">
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
                                                        className="text-[10px] text-[#d81b60] hover:underline transition-colors flex items-center gap-1 px-2 py-1 border-3 border-[#d81b60]/30 rounded-lg hover:bg-[#d81b60]/5"
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
                                                    const isColor = variation._type === 'color';
                                                    
                                                    return (
                                                        <div key={id} className="flex items-center gap-2 p-2 border-3 rounded-xl border-[#d81b60]/30 bg-white/50 dark:bg-slate-800/50">
                                                            {isColor && combo?.hex && (
                                                                <span 
                                                                    className="w-3 h-3 rounded-full border border-slate-200 flex-shrink-0"
                                                                    style={{ backgroundColor: combo.hex }}
                                                                />
                                                            )}
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
                                                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border-3",
                                                                        currentQty > 0 
                                                                            ? "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 border-slate-300"
                                                                            : "bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800 border-slate-200"
                                                                    )}
                                                                    disabled={currentQty === 0}
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center font-bold text-[#d81b60] text-sm">
                                                                    {currentQty}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleGiftVariationQuantityChange(id, 1)}
                                                                    className={cn(
                                                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border-3",
                                                                        distributedTotal < totalQty
                                                                            ? "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white border-[#d81b60] shadow-sm shadow-[#d81b60]/30"
                                                                            : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700 border-slate-300"
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
                                    className="h-7 w-7 rounded-full hover:bg-[#d81b60]/10 border-3 border-[#d81b60]/30"
                                    onClick={() => {
                                        const newQty = Math.max(1, result.quantity - 1);
                                        let newVariationQuantities = { ...(result.variationQuantities || {}) };
                                        if (result.variations.mode === 'selected' && result.variations.ids.length > 0) {
                                            newVariationQuantities = autoDistributeQuantities(result.variations.ids, newQty);
                                        }
                                        setResult({ ...result, quantity: newQty, variationQuantities: newVariationQuantities });
                                    }}
                                    type="button"
                                >
                                    -
                                </Button>
                                <span className="w-8 text-center font-bold text-[#d81b60]">
                                    {result.quantity}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 w-7 rounded-full hover:bg-[#d81b60]/10 border-3 border-[#d81b60]/30"
                                    onClick={() => {
                                        const newQty = result.quantity + 1;
                                        let newVariationQuantities = { ...(result.variationQuantities || {}) };
                                        if (result.variations.mode === 'selected' && result.variations.ids.length > 0) {
                                            newVariationQuantities = autoDistributeQuantities(result.variations.ids, newQty);
                                        }
                                        setResult({ ...result, quantity: newQty, variationQuantities: newVariationQuantities });
                                    }}
                                    type="button"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ===== المدة - وردي/زيتي ===== */}
                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            ⏰ {isArabic ? "المدة" : "Duration"}
                        </Label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsPermanent(true); setError(null); setExpiresAt(""); }}
                                className={cn(
                                    "px-4 py-2 rounded-xl border-3 text-sm font-medium transition-all duration-300 flex-1 cursor-pointer",
                                    isPermanent
                                        ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60] shadow-sm shadow-[#d81b60]/10"
                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600 hover:bg-[#d81b60]/5"
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
                                    "px-4 py-2 rounded-xl border-3 text-sm font-medium transition-all duration-300 flex-1 cursor-pointer",
                                    !isPermanent
                                        ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60] shadow-sm shadow-[#d81b60]/10"
                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600 hover:bg-[#d81b60]/5"
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
                                className="mt-1 rounded-xl border-3 border-[#d81b60]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20"
                                disabled={isSubmitting}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border-3 border-red-200 dark:border-red-800/30 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* ===== معاينة العرض - وردي/زيتي ===== */}
                    <div className="p-4 bg-gradient-to-r from-[#d81b60]/10 to-[#f48fb1]/10 dark:from-[#d81b60]/20 dark:to-[#f48fb1]/10 rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40">
                        <p className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] text-center">
                            🎯 {getPreviewText()}
                        </p>
                        <div className="text-xs text-[#d81b60]/70 dark:text-[#f48fb1]/70 text-center mt-1 space-y-0.5">
                            <p>
                                {isArabic 
                                    ? `💰 عند شراء ${requirements.reduce((sum, r) => sum + r.quantity, 0)}، تحصل على ${result.quantity} مجاناً`
                                    : `💰 Buy ${requirements.reduce((sum, r) => sum + r.quantity, 0)}, get ${result.quantity} free`
                                }
                            </p>
                            {!isPermanent && expiresAt && (
                                <p className="text-[10px] text-emerald-500/60">
                                    📅 {isArabic ? 'ينتهي في' : 'Expires'} {new Date(expiresAt).toLocaleDateString(isArabic ? 'ar-SA' : 'en-US')} 
                                    {(() => {
                                        const date = new Date(expiresAt);
                                        if (!isNaN(date.getTime())) {
                                            return ` ${date.toLocaleTimeString(isArabic ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`;
                                        }
                                        return '';
                                    })()}
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
                                    🎨 {isArabic ? 'توزيع كميات الهدية' : 'Gift quantity distribution'}: {
                                        Object.entries(result.variationQuantities)
                                            .map(([id, qty]) => `${qty}`)
                                            .join(' + ')
                                    }
                                </p>
                            )}
                            {requirements.some(r => r.variationQuantities && Object.keys(r.variationQuantities).length > 0) && (
                                <p className="text-[10px] text-emerald-500/60">
                                    🎨 {isArabic ? 'توزيع كميات الشروط' : 'Requirements quantity distribution'}: {
                                        requirements.map((r, i) => {
                                            const qtyStr = Object.values(r.variationQuantities || {}).join('+');
                                            return qtyStr ? `شرط ${i+1}: ${qtyStr}` : null;
                                        }).filter(Boolean).join(' | ')
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 pt-2 border-t-3 border-[#d81b60]/30 dark:border-[#d81b60]/40">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl border-3 border-[#d81b60]/30 text-[#d81b60] hover:bg-[#d81b60]/10 dark:hover:bg-[#d81b60]/20"
                        disabled={isSubmitting}
                    >
                        <X className="h-4 w-4 mr-1.5" />
                        {isArabic ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button
                        className="rounded-xl bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/30 hover:shadow-[#d81b60]/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 border-3 border-[#d81b60]/30"
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