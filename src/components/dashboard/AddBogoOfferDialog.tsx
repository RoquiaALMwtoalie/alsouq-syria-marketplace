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
import { Gift, Loader2, X, Store, Package, Calendar, Clock, AlertCircle, Plus, Minus, Trash2, Layers, Search, CheckCircle2, Zap, Folder, FolderTree, Info, CornerDownRight } from "lucide-react";
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
    
    // ✅ جلب منتجات المتجر
    const ownerId = app.user?.id;
    const { data: listingsData, isLoading: listingsLoading } = useListings({ 
        limit: 1000,
        ...(ownerId && { ownerId })
    });
    
    const listings = (listingsData?.data || []).filter((l: any) => !l.is_offer);

    // ============================================================
    // ✅ ✅ ✅ STATE (يجب أن يكون أولاً - قبل أي useMemo يستخدمه)
    // ============================================================
    const [offerType, setOfferType] = useState<OfferType>('bogo');
    
    // ✅ ✅ ✅ التصنيف الرئيسي والفرعي
    const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<string>("");
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("");
    const [parentCategorySearch, setParentCategorySearch] = useState("");
    const [subCategorySearch, setSubCategorySearch] = useState("");
    const [isParentCategoryOpen, setIsParentCategoryOpen] = useState(false);
    const [isSubCategoryOpen, setIsSubCategoryOpen] = useState(false);
    
    const parentCategoryInputRef = useRef<HTMLInputElement>(null);
    const parentCategoryDropdownRef = useRef<HTMLDivElement>(null);
    const subCategoryInputRef = useRef<HTMLInputElement>(null);
    const subCategoryDropdownRef = useRef<HTMLDivElement>(null);
    
    // ✅ الشروط (المنتجات المطلوبة)
    const [requirements, setRequirements] = useState<ProductRequirement[]>([
        { listing_id: '', variations: { mode: 'all', ids: [] }, quantity: 1, variationQuantities: {} }
    ]);
    
    // ✅ النتيجة (الهدية)
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
    const [selectedVariationPrice, setSelectedVariationPrice] = useState<number | null>(null);

    const isUpdatingFromExisting = useRef(false);

    // ============================================================
    // ✅ ✅ ✅ useMemo (بعد useState - آمن الآن)
    // ============================================================
    
    // ✅ التصنيفات الرئيسية
    const mainCategories = useMemo(() => {
        return categories.filter((c: any) => 
            !c.parent_id && c.active !== false
        );
    }, [categories]);

    // ✅ التصنيفات الفرعية للرئيسي المختار
    const subCategories = useMemo(() => {
        if (!selectedParentCategoryId) return [];
        return categories.filter((c: any) => 
            c.parent_id === selectedParentCategoryId && c.active !== false
        );
    }, [categories, selectedParentCategoryId]);

    // ✅ هل الرئيسي له فروع؟
    const hasSubCategories = subCategories.length > 0;

    // ✅ فلترة الرئيسية حسب البحث
    const filteredMainCategories = useMemo(() => {
        if (!parentCategorySearch.trim()) return mainCategories;
        const search = parentCategorySearch.toLowerCase().trim();
        return mainCategories.filter((cat: any) => {
            const nameAr = (cat.name_ar || "").toLowerCase();
            const nameEn = (cat.name_en || "").toLowerCase();
            return nameAr.includes(search) || nameEn.includes(search);
        });
    }, [mainCategories, parentCategorySearch]);

    // ✅ فلترة الفرعية حسب البحث
    const filteredSubCategories = useMemo(() => {
        if (!subCategorySearch.trim()) return subCategories;
        const search = subCategorySearch.toLowerCase().trim();
        return subCategories.filter((cat: any) => {
            const nameAr = (cat.name_ar || "").toLowerCase();
            const nameEn = (cat.name_en || "").toLowerCase();
            return nameAr.includes(search) || nameEn.includes(search);
        });
    }, [subCategories, subCategorySearch]);

    // ============================================================
    // ✅ إغلاق القوائم عند الضغط خارجها
    // ============================================================
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                parentCategoryDropdownRef.current && 
                !parentCategoryDropdownRef.current.contains(event.target as Node) &&
                parentCategoryInputRef.current &&
                !parentCategoryInputRef.current.contains(event.target as Node)
            ) {
                setIsParentCategoryOpen(false);
            }
            
            if (
                subCategoryDropdownRef.current && 
                !subCategoryDropdownRef.current.contains(event.target as Node) &&
                subCategoryInputRef.current &&
                !subCategoryInputRef.current.contains(event.target as Node)
            ) {
                setIsSubCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ============================================================
    // ✅ دوال مساعدة
    // ============================================================
    const getProductVariationsOrColors = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        if (!product) return [];
        
        const variations = product.variations || [];
        const colors = product.colors || product.product_colors || [];
        
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
        
        return [...variations, ...colorVariations];
    };

    const hasVariationsOrColors = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        if (!product) return false;
        
        const hasVariations = product.variations && product.variations.length > 0;
        const hasColors = product.colors && product.colors.length > 0;
        const hasProductColors = product.product_colors && product.product_colors.length > 0;
        
        return hasVariations || hasColors || hasProductColors;
    };

    const getProductTitle = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        return product?.title_ar || '';
    };

    const getProductPrice = (listingId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        return product?.price || 0;
    };

    const getVariationPrice = (listingId: string, variationId: string) => {
        const product = listings.find((l: any) => l.id === listingId);
        if (!product) return null;
        const variation = product.variations?.find((v: any) => v.id === variationId);
        if (variation) {
            return variation?.price || variation?.old_price || product.price || 0;
        }
        const colors = product.colors || product.product_colors || [];
        const color = colors.find((c: any) => c.id === variationId);
        if (color) {
            return product.price || 0;
        }
        return product.price || 0;
    };

    // ✅ دوال التصنيفات
    const getCategoryName = useCallback((categoryId: string) => {
        if (!categoryId) return "";
        const cat = categories.find((c: any) => c.id === categoryId);
        return cat ? (isArabic ? cat.name_ar : cat.name_en) : "";
    }, [categories, isArabic]);

    const handleParentCategorySelect = (cat: any) => {
        setSelectedParentCategoryId(cat.id);
        setParentCategorySearch(isArabic ? cat.name_ar : cat.name_en);
        setIsParentCategoryOpen(false);
        
        setSelectedSubCategoryId("");
        setSubCategorySearch("");
    };

    const handleSubCategorySelect = (cat: any) => {
        setSelectedSubCategoryId(cat.id);
        setSubCategorySearch(isArabic ? cat.name_ar : cat.name_en);
        setIsSubCategoryOpen(false);
    };

    const clearParentCategory = () => {
        setSelectedParentCategoryId("");
        setParentCategorySearch("");
        setSelectedSubCategoryId("");
        setSubCategorySearch("");
    };

    const clearSubCategory = () => {
        setSelectedSubCategoryId("");
        setSubCategorySearch("");
    };

    // ✅ دالة توليد اسم العرض
    const generateProfessionalDisplayText = () => {
        const mainProduct = listings.find((l: any) => l.id === requirements[0]?.listing_id);
        
        const productName = isArabic 
            ? mainProduct?.title_ar || "المنتج"
            : mainProduct?.title_en || mainProduct?.title_ar || "Product";
        
        const buyQty = requirements.reduce((sum, r) => sum + r.quantity, 0);
        const getQty = result.quantity;
        const giftProduct = listings.find((l: any) => l.id === result.listing_id);
        
        const giftName = isArabic 
            ? giftProduct?.title_ar || "منتج آخر"
            : giftProduct?.title_en || giftProduct?.title_ar || "another product";

        if (offerType === 'bogo') {
            if (mainProduct && productName !== (isArabic ? "المنتج" : "Product")) {
                return isArabic 
                    ? `🛒 عرض مزدوج: اشتري ${buyQty} من "${productName}" واحصل على ${getQty} مجاناً ✨`
                    : `🛒 Double Deal: Buy ${buyQty} "${productName}" & Get ${getQty} Free ✨`;
            }
            return isArabic 
                ? `🎁 عرض مميز: اشتري ${buyQty} واحصل على ${getQty} مجاناً`
                : `🎁 Special Offer: Buy ${buyQty} Get ${getQty} Free`;
        }

        if (offerType === 'cross_sell') {
            if (mainProduct && giftProduct) {
                return isArabic 
                    ? `🛍️ صفقة رائعة: ${productName} + ${giftName} مجاناً 🎉`
                    : `🛍️ Great Deal: ${productName} + ${giftName} Free 🎉`;
            }
            return isArabic 
                ? `💎 عرض حصري: منتج + آخر مجاناً`
                : `💎 Exclusive: Buy One Get One Free`;
        }

        if (offerType === 'bundle') {
            const productNames = requirements
                .map((r) => {
                    const p = listings.find((l: any) => l.id === r.listing_id);
                    return isArabic 
                        ? p?.title_ar || "منتج"
                        : p?.title_en || p?.title_ar || "Product";
                })
                .slice(0, 2)
                .join(isArabic ? " + " : " + ");
            
            const extraCount = requirements.length - 2;
            let bundleText = productNames;
            if (extraCount > 0) {
                bundleText += isArabic 
                    ? ` + ${extraCount} منتجات` 
                    : ` + ${extraCount} products`;
            }
            
            return isArabic 
                ? `📦 باقة ${bundleText} + ${getQty} مجاناً 🎁`
                : `📦 Bundle ${bundleText} + ${getQty} Free 🎁`;
        }

        return isArabic 
            ? `🏷️ عرض خاص: ${buyQty} + ${getQty} مجاناً`
            : `🏷️ Special Offer: ${buyQty} + ${getQty} Free`;
    };

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
    // ✅ ✅ ✅ حفظ العرض
    // ============================================================
    const handleSubmit = async () => {
        if (requirements.some(r => !r.listing_id)) {
            setError(isArabic ? "❌ الرجاء اختيار جميع المنتجات المطلوبة" : "❌ Please select all required products");
            return;
        }

        if (!result.listing_id) {
            setError(isArabic ? "❌ الرجاء اختيار منتج الهدية" : "❌ Please select the gift product");
            return;
        }

        if (!selectedParentCategoryId) {
            setError(isArabic ? "❌ الرجاء اختيار التصنيف الرئيسي" : "❌ Please select a main category");
            return;
        }

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

        let variationQuantities = { ...(result.variationQuantities || {}) };
        
        if (giftHasVariationsOrColors && result.variations.mode === 'selected' && result.variations.ids.length > 0) {
            const totalQty = result.quantity || 1;
            const distributedTotal = Object.values(variationQuantities).reduce((sum, qty) => sum + qty, 0);
            
            if (distributedTotal !== totalQty) {
                variationQuantities = autoDistributeQuantities(result.variations.ids, totalQty);
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
            const finalCategoryId = selectedSubCategoryId || selectedParentCategoryId;
            
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
                category_id: finalCategoryId,
                parent_category_id: selectedParentCategoryId,
                metadata: {
                    variation_quantities: variationQuantities,
                    requirement_variation_quantities: requirements.map(r => ({
                        product_id: r.listing_id,
                        quantities: r.variationQuantities || {}
                    }))
                }
            };

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
    // ✅ تحميل البيانات
    // ============================================================
    useEffect(() => {
        if (!open) {
            return;
        }

        if (existingOffer) {
            if (isUpdatingFromExisting.current) {
                return;
            }
            
            isUpdatingFromExisting.current = true;
            
            setOfferType(existingOffer.offer_type || 'bogo');
            
            // ✅ تحميل التصنيف الرئيسي والفرعي
            if (categories.length > 0) {
                if (existingOffer.parent_category_id) {
                    setSelectedParentCategoryId(existingOffer.parent_category_id);
                    setParentCategorySearch(getCategoryName(existingOffer.parent_category_id));
                    
                    if (existingOffer.category_id && existingOffer.category_id !== existingOffer.parent_category_id) {
                        setSelectedSubCategoryId(existingOffer.category_id);
                        setSubCategorySearch(getCategoryName(existingOffer.category_id));
                    } else {
                        setSelectedSubCategoryId("");
                        setSubCategorySearch("");
                    }
                } else if (existingOffer.category_id) {
                    const cat = categories.find((c: any) => c.id === existingOffer.category_id);
                    
                    if (cat) {
                        if (cat.parent_id) {
                            setSelectedParentCategoryId(cat.parent_id);
                            setParentCategorySearch(getCategoryName(cat.parent_id));
                            setSelectedSubCategoryId(existingOffer.category_id);
                            setSubCategorySearch(getCategoryName(existingOffer.category_id));
                        } else {
                            setSelectedParentCategoryId(existingOffer.category_id);
                            setParentCategorySearch(getCategoryName(existingOffer.category_id));
                            setSelectedSubCategoryId("");
                            setSubCategorySearch("");
                        }
                    }
                }
            }
            
            // ✅ تحميل الشروط
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
                        } else if (reqVar.variation_ids && reqVar.variation_ids.length > 0) {
                            variationQuantities = autoDistributeQuantities(reqVar.variation_ids, quantity);
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
            
            // ✅ تحميل الهدية
            const isBogo = existingOffer.offer_type === 'bogo';
            const giftListingId = isBogo 
                ? existingOffer.listing_id
                : existingOffer.free_listing_id;
            
            if (giftListingId) {
                let variations = { mode: 'all' as const, ids: [] as string[] };
                let variationQuantities: Record<string, number> = {};
                
                if (existingOffer.result_variation_ids && existingOffer.result_variation_ids.length > 0) {
                    variations = { mode: 'selected', ids: existingOffer.result_variation_ids };
                    
                    if (existingOffer.metadata?.variation_quantities) {
                        variationQuantities = existingOffer.metadata.variation_quantities;
                    } else {
                        const totalQty = existingOffer.get_quantity || 1;
                        const ids = existingOffer.result_variation_ids;
                        variationQuantities = autoDistributeQuantities(ids, totalQty);
                    }
                } else {
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
            } else {
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
            
            // ✅ التاريخ
            if (existingOffer.expires_at) {
                setIsPermanent(false);
                const date = new Date(existingOffer.expires_at);
                const formattedDate = date.toISOString().slice(0, 16);
                setExpiresAt(formattedDate);
            } else {
                setIsPermanent(true);
                setExpiresAt("");
            }
            
            isUpdatingFromExisting.current = false;
            return;
        }

        // ✅ حالة الإضافة الجديدة
        setOfferType('bogo');
        setSelectedParentCategoryId('');
        setSelectedSubCategoryId('');
        setParentCategorySearch('');
        setSubCategorySearch('');
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

    }, [open, existingOffer, initialProduct, categories, isArabic, autoDistributeQuantities, getCategoryName]);

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
                    
                    {/* ✅ التصنيف الرئيسي + الفرعي */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* ✅ التصنيف الرئيسي (إلزامي) */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span>📁</span>
                                {isArabic ? "التصنيف الرئيسي" : "Main Category"}
                                <span className="text-red-500">*</span>
                            </Label>
                            
                            <div className="relative" ref={parentCategoryDropdownRef}>
                                <div className="relative">
                                    <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#d81b60]/60" />
                                    <Input
                                        ref={parentCategoryInputRef}
                                        value={parentCategorySearch}
                                        onChange={(e) => {
                                            setParentCategorySearch(e.target.value);
                                            setIsParentCategoryOpen(true);
                                        }}
                                        onFocus={() => setIsParentCategoryOpen(true)}
                                        placeholder={isArabic ? "🔍 ابحث عن التصنيف الرئيسي..." : "🔍 Search main category..."}
                                        className="ps-9 h-11 rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40 focus:border-[#d81b60]/50 focus:ring-2 focus:ring-[#d81b60]/20 transition-all duration-300 bg-white dark:bg-slate-900"
                                    />
                                    {parentCategorySearch && (
                                        <button
                                            type="button"
                                            onClick={clearParentCategory}
                                            className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#d81b60] transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                
                                {isParentCategoryOpen && (
                                    <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40 bg-white dark:bg-slate-900 shadow-xl shadow-[#d81b60]/20">
                                        {filteredMainCategories.length === 0 ? (
                                            <div className="p-4 text-sm text-muted-foreground text-center">
                                                {isArabic ? "❌ لا توجد تصنيفات" : "❌ No categories"}
                                            </div>
                                        ) : (
                                            filteredMainCategories.map((cat: any) => {
                                                const childCount = categories.filter((c: any) => c.parent_id === cat.id && c.active !== false).length;
                                                const isSelected = selectedParentCategoryId === cat.id;
                                                
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        type="button"
                                                        className={cn(
                                                            "w-full text-start px-4 py-3 text-sm hover:bg-[#d81b60]/5 dark:hover:bg-[#d81b60]/20 transition-all flex items-center gap-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                                                            isSelected && "bg-[#d81b60]/10 dark:bg-[#d81b60]/30"
                                                        )}
                                                        onClick={() => handleParentCategorySelect(cat)}
                                                    >
                                                        {isSelected && (
                                                            <CheckCircle2 className="h-4 w-4 text-[#d81b60] flex-shrink-0" />
                                                        )}
                                                        <span className="flex-1">{isArabic ? cat.name_ar : cat.name_en}</span>
                                                        {childCount > 0 && (
                                                            <Badge className="bg-[#d81b60]/10 text-[#d81b60] border-0 text-[9px]">
                                                                {childCount} {isArabic ? "فرعي" : "sub"}
                                                            </Badge>
                                                        )}
                                                    </button>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ✅ التصنيف الفرعي (اختياري) */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span>📂</span>
                                {isArabic ? "التصنيف الفرعي" : "Subcategory"}
                                <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400">
                                    {isArabic ? "اختياري" : "Optional"}
                                </Badge>
                            </Label>
                            
                            {!selectedParentCategoryId ? (
                                <div className="flex items-center gap-2 h-11 px-4 rounded-xl border-3 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                                    <Info className="h-4 w-4 text-slate-400" />
                                    <span className="text-sm text-slate-500">
                                        {isArabic ? "اختر الرئيسي أولاً" : "Select main first"}
                                    </span>
                                </div>
                            ) : !hasSubCategories ? (
                                <div className="flex items-center gap-2 h-11 px-4 rounded-xl border-3 border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/20">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                        {isArabic ? "✅ سيُستخدم الرئيسي" : "✅ Main will be used"}
                                    </span>
                                </div>
                            ) : (
                                <div className="relative" ref={subCategoryDropdownRef}>
                                    <div className="relative">
                                        <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-[#2a655f]/60" />
                                        <Input
                                            ref={subCategoryInputRef}
                                            value={subCategorySearch}
                                            onChange={(e) => {
                                                setSubCategorySearch(e.target.value);
                                                setIsSubCategoryOpen(true);
                                            }}
                                            onFocus={() => setIsSubCategoryOpen(true)}
                                            placeholder={isArabic ? "🔍 ابحث عن التصنيف الفرعي..." : "🔍 Search subcategory..."}
                                            className="ps-9 h-11 rounded-xl border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 bg-white dark:bg-slate-900"
                                        />
                                        {subCategorySearch && (
                                            <button
                                                type="button"
                                                onClick={clearSubCategory}
                                                className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    {isSubCategoryOpen && (
                                        <div className="absolute z-50 w-full mt-1 max-h-52 overflow-y-auto rounded-xl border-3 border-[#2a655f]/30 dark:border-[#2a655f]/40 bg-white dark:bg-slate-900 shadow-xl shadow-[#2a655f]/20">
                                            {filteredSubCategories.length === 0 ? (
                                                <div className="p-4 text-sm text-muted-foreground text-center">
                                                    {isArabic ? "❌ لا توجد نتائج" : "❌ No results"}
                                                </div>
                                            ) : (
                                                filteredSubCategories.map((cat: any) => {
                                                    const isSelected = selectedSubCategoryId === cat.id;
                                                    return (
                                                        <button
                                                            key={cat.id}
                                                            type="button"
                                                            className={cn(
                                                                "w-full text-start px-4 py-3 text-sm hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/20 transition-all flex items-center gap-3 border-b border-slate-100/50 dark:border-slate-800/50 last:border-0",
                                                                isSelected && "bg-[#2a655f]/10 dark:bg-[#2a655f]/30"
                                                            )}
                                                            onClick={() => handleSubCategorySelect(cat)}
                                                        >
                                                            {isSelected && (
                                                                <CheckCircle2 className="h-4 w-4 text-[#2a655f] flex-shrink-0" />
                                                            )}
                                                            <span>{isArabic ? cat.name_ar : cat.name_en}</span>
                                                        </button>
                                                    );
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ✅ مؤشر التصنيف المختار */}
                    {selectedParentCategoryId && (
                        <div className="flex items-center gap-2 p-2.5 bg-gradient-to-r from-[#d81b60]/5 to-[#2a655f]/5 rounded-xl border-2 border-[#d81b60]/20 dark:border-[#d81b60]/30">
                            <Layers className="h-4 w-4 text-[#d81b60]" />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                {isArabic ? "التصنيف:" : "Category:"}
                            </span>
                            <Badge className="bg-[#d81b60]/10 text-[#d81b60] border-0 text-[10px]">
                                📁 {getCategoryName(selectedParentCategoryId)}
                            </Badge>
                            {selectedSubCategoryId && (
                                <>
                                    <CornerDownRight className="h-3 w-3 text-[#2a655f]" />
                                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
                                        📂 {getCategoryName(selectedSubCategoryId)}
                                    </Badge>
                                </>
                            )}
                        </div>
                    )}

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
                                onClick={() => setOfferType('cross_sell')}
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
                                onClick={() => setOfferType('bundle')}
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

                    {/* ===== الشروط ===== */}
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
                            const variations = getProductVariationsOrColors(req.listing_id);
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

                                            {hasSelectedVariations && (
                                                <div className="mt-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#d81b60]/30 dark:border-[#d81b60]/40">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                                            📊 {isArabic ? "توزيع الكميات" : "Distribution"}
                                                            <Badge className={cn(
                                                                "border-0 text-[9px]",
                                                                distributedTotal === totalQty 
                                                                    ? "bg-emerald-500/20 text-emerald-600" 
                                                                    : "bg-amber-500/20 text-amber-600"
                                                            )}>
                                                                {distributedTotal}/{totalQty}
                                                            </Badge>
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
                                                            
                                                            return (
                                                                <div key={id} className="flex items-center gap-2 p-2 border-3 rounded-xl border-[#d81b60]/30 bg-white/50 dark:bg-slate-800/50">
                                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                                        {comboText}
                                                                    </span>
                                                                    <div className="flex items-center gap-1">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRequirementVariationQuantityChange(index, id, -1)}
                                                                            className={cn(
                                                                                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all border-3",
                                                                                currentQty > 0 
                                                                                    ? "bg-slate-200 hover:bg-slate-300 border-slate-300"
                                                                                    : "bg-slate-100 text-slate-300 cursor-not-allowed border-slate-200"
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
                                                                                    ? "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-[#d81b60]"
                                                                                    : "bg-slate-200 text-slate-400 cursor-not-allowed border-slate-300"
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
                                                className="h-8 w-8 p-0 rounded-xl text-red-500 hover:bg-red-50/50"
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

                    {/* ===== الهدية ===== */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border-3 border-emerald-200/50 dark:border-emerald-800/30">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            🎁 {isArabic ? "النتيجة (الهدية)" : "Result (Gift)"}
                            <span className="text-red-500">*</span>
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
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {result.listing_id && (() => {
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
                                                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600"
                                                                )}
                                                            >
                                                                {isColor && v.combination?.hex && (
                                                                    <span 
                                                                        className="w-3 h-3 rounded-full border border-slate-200 flex-shrink-0"
                                                                        style={{ backgroundColor: v.combination.hex }}
                                                                    />
                                                                )}
                                                                {comboText || v.id.slice(0, 6)}
                                                                {isSelected && (
                                                                    <span className="text-[8px] text-emerald-600 ml-1">
                                                                        (×{currentQty})
                                                                    </span>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    {!giftHasVarsOrColors && (
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            ✅ {isArabic ? "هذا المنتج لا يحتوي على خيارات" : "No options"}
                                        </p>
                                    )}

                                    {giftHasVarsOrColors && result.variations.mode === 'selected' && result.variations.ids.length > 0 && (
                                        <div className="mt-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#d81b60]/30">
                                            <div className="flex items-center justify-between mb-2">
                                                <Label className="text-xs font-medium flex items-center gap-2">
                                                    📊 {isArabic ? "توزيع الكميات" : "Distribution"}
                                                    <Badge className={cn(
                                                        "border-0 text-[9px]",
                                                        distributedTotal === totalQty 
                                                            ? "bg-emerald-500/20 text-emerald-600" 
                                                            : "bg-amber-500/20 text-amber-600"
                                                    )}>
                                                        {distributedTotal}/{totalQty}
                                                    </Badge>
                                                </Label>
                                                {remaining > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => distributeRemainingGiftQuantity(
                                                            resultVariations.filter((v: any) => result.variations.ids.includes(v.id))
                                                        )}
                                                        className="text-[10px] text-[#d81b60] hover:underline flex items-center gap-1 px-2 py-1 border-3 border-[#d81b60]/30 rounded-lg hover:bg-[#d81b60]/5"
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
                                                    
                                                    return (
                                                        <div key={id} className="flex items-center gap-2 p-2 border-3 rounded-xl border-[#d81b60]/30 bg-white/50">
                                                            <span className="text-xs font-medium">
                                                                {comboText}
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleGiftVariationQuantityChange(id, -1)}
                                                                    className="h-6 w-6 rounded-full bg-slate-200 hover:bg-slate-300 text-xs font-bold border-3 border-slate-300"
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
                                                                        "h-6 w-6 rounded-full text-xs font-bold border-3",
                                                                        distributedTotal < totalQty
                                                                            ? "bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-[#d81b60]"
                                                                            : "bg-slate-200 text-slate-400 border-slate-300"
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

                    {/* ===== المدة ===== */}
                    <div className="space-y-3 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border-3 border-[#d81b60]/30">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            ⏰ {isArabic ? "المدة" : "Duration"}
                        </Label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => { setIsPermanent(true); setError(null); setExpiresAt(""); }}
                                className={cn(
                                    "px-4 py-2 rounded-xl border-3 text-sm font-medium transition-all duration-300 flex-1",
                                    isPermanent
                                        ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60]"
                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600"
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
                                    "px-4 py-2 rounded-xl border-3 text-sm font-medium transition-all duration-300 flex-1",
                                    !isPermanent
                                        ? "border-[#d81b60] bg-[#d81b60]/10 text-[#d81b60]"
                                        : "border-slate-200/50 hover:border-[#d81b60]/30 text-slate-600"
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
                                className="mt-1 rounded-xl border-3 border-[#d81b60]/30 focus:border-[#d81b60]"
                                disabled={isSubmitting}
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border-3 border-red-200 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* ===== معاينة العرض ===== */}
                    <div className="p-4 bg-gradient-to-r from-[#d81b60]/10 to-[#f48fb1]/10 dark:from-[#d81b60]/20 dark:to-[#f48fb1]/10 rounded-xl border-3 border-[#d81b60]/30">
                        <p className="text-sm font-bold text-[#d81b60] dark:text-[#f48fb1] text-center">
                            🎯 {getPreviewText()}
                        </p>
                        <div className="text-xs text-[#d81b60]/70 text-center mt-1 space-y-0.5">
                            <p>
                                {isArabic 
                                    ? `💰 عند شراء ${requirements.reduce((sum, r) => sum + r.quantity, 0)}، تحصل على ${result.quantity} مجاناً`
                                    : `💰 Buy ${requirements.reduce((sum, r) => sum + r.quantity, 0)}, get ${result.quantity} free`
                                }
                            </p>
                            {selectedParentCategoryId && (
                                <p className="text-[10px] text-muted-foreground">
                                    📁 {isArabic ? 'الرئيسي' : 'Main'}: {getCategoryName(selectedParentCategoryId)}
                                    {selectedSubCategoryId && ` → 📂 ${getCategoryName(selectedSubCategoryId)}`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 pt-2 border-t-3 border-[#d81b60]/30">
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)}
                        className="rounded-xl border-3 border-[#d81b60]/30 text-[#d81b60] hover:bg-[#d81b60]/10"
                        disabled={isSubmitting}
                    >
                        <X className="h-4 w-4 mr-1.5" />
                        {isArabic ? "إلغاء" : "Cancel"}
                    </Button>
                    <Button
                        className="rounded-xl bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 border-3 border-[#d81b60]/30"
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

export const AddBogoOfferDialog = React.memo(AddBogoOfferDialogComponent);