/**
 * @file index.ts (Barrel Export)
 * @description Điểm xuất trung tâm cho toàn bộ Type Definitions.
 * Cho phép import gọn gàng: `import { UserProfile, FoodItem } from '@/src/types'`
 */

export type { FoodItem, DailyMeals, Macros } from './nutrition.types';
export type { UserProfile } from './user.types';
export { DEFAULT_PROFILE } from './user.types';
export type { ApiResponse } from './api.types';
export type { Activity, WorkoutChallenge, DailyNutrition, ActivityTypeInfo } from './workout.types';
