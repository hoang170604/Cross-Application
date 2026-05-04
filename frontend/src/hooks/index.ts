/**
 * @file hooks/index.ts
 * @description Barrel export cho các Custom Hooks.
 * Giờ đây hook useNutrition sẽ lấy dữ liệu từ Zustand Store thay vì Context.
 */

export { useNutrition } from './useNutrition';
export { useTracking } from './useTracking';
export { useActivity } from './useActivity';
