// src/lib/hooks/index.ts

export { useProfileWithUpdate } from './useProfileWithUpdate';
export { useFavoritesRealtime } from './useFavoritesRealtime';
// ✅ useListingsRealtime — معطّل (cache-invalidation-${userId} في __root.tsx يغطي تحديثات listings)
// export { useListingsRealtime } from './useListingsRealtime';
export { useCartRealtime } from './useCartRealtime';
export { useReviewsRealtime } from './useReviewsRealtime';
export { useOrdersRealtime } from './useOrdersRealtime';

export { useStoresRealtime } from './useStoresRealtime';
export { useCategoriesRealtime } from './useCategoriesRealtime';