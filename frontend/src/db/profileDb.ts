/**
 * @file profileDb.ts
 * @description Lưu/đọc hồ sơ người dùng từ SQLite (thay AsyncStorage).
 *
 * Đối tượng `UserProfile` có schema nhiều cột (tuổi, giới tính, chiều cao,
 * cân nặng, mục tiêu, các target dinh dưỡng, dailyMeals, weightHistory…),
 * rất phù hợp với SQLite. Các field dạng object/array (`dailyMeals`,
 * `weightHistory`) được serialize JSON vào 1 cột riêng.
 */

import { getDatabase } from './database';
import { UserProfile, DEFAULT_PROFILE } from '../types';

interface ProfileRow {
  user_id: number;
  name: string | null;
  email: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  current_weight: number | null;
  activity_level: number | null;
  goal: string | null;
  fasting_goal: string | null;
  target_calories: number | null;
  target_protein: number | null;
  target_carb: number | null;
  target_fat: number | null;
  daily_meals_json: string | null;
  weight_history_json: string | null;
  updated_at: string;
}

function rowToProfile(row: ProfileRow): UserProfile {
  let dailyMeals = DEFAULT_PROFILE.dailyMeals;
  let weightHistory = DEFAULT_PROFILE.weightHistory;
  try {
    if (row.daily_meals_json) dailyMeals = JSON.parse(row.daily_meals_json);
  } catch {}
  try {
    if (row.weight_history_json) weightHistory = JSON.parse(row.weight_history_json);
  } catch {}

  return {
    age: row.age ?? 0,
    gender: row.gender ?? 'male',
    height: row.height ?? 0,
    weight: row.weight ?? 0,
    activityLevel: row.activity_level ?? 1.375,
    goal: row.goal ?? 'maintain',
    name: row.name ?? '',
    email: row.email ?? undefined,
    fastingGoal: row.fasting_goal ?? undefined,
    targetCalories: row.target_calories ?? 0,
    targetProtein: row.target_protein ?? undefined,
    targetCarb: row.target_carb ?? undefined,
    targetFat: row.target_fat ?? undefined,
    currentWeight: row.current_weight ?? 0,
    dailyMeals,
    weightHistory,
  };
}

/**
 * Lấy hồ sơ user từ SQLite. Trả null nếu chưa có record.
 */
export async function getUserProfile(userId: number): Promise<UserProfile | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ProfileRow>(
    'SELECT * FROM user_profile WHERE user_id = ?',
    [userId],
  );
  return row ? rowToProfile(row) : null;
}

/**
 * Upsert toàn bộ profile cho user. Dùng INSERT OR REPLACE — yêu cầu PK = user_id.
 */
export async function upsertUserProfile(userId: number, profile: UserProfile): Promise<void> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  await db.runAsync(
    `INSERT OR REPLACE INTO user_profile (
      user_id, name, email, age, gender, height, weight, current_weight,
      activity_level, goal, fasting_goal, target_calories, target_protein,
      target_carb, target_fat, daily_meals_json, weight_history_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      profile.name ?? null,
      profile.email ?? null,
      profile.age,
      profile.gender,
      profile.height,
      profile.weight,
      profile.currentWeight ?? null,
      profile.activityLevel,
      profile.goal,
      profile.fastingGoal ?? null,
      profile.targetCalories ?? null,
      profile.targetProtein ?? null,
      profile.targetCarb ?? null,
      profile.targetFat ?? null,
      profile.dailyMeals ? JSON.stringify(profile.dailyMeals) : null,
      profile.weightHistory ? JSON.stringify(profile.weightHistory) : null,
      now,
    ],
  );
}

/**
 * Patch một phần profile cho user. Nếu chưa có row, tạo mới từ DEFAULT_PROFILE.
 */
export async function patchUserProfile(
  userId: number,
  patch: Partial<UserProfile>,
): Promise<UserProfile> {
  const existing = (await getUserProfile(userId)) ?? { ...DEFAULT_PROFILE };
  const merged: UserProfile = { ...existing, ...patch };
  await upsertUserProfile(userId, merged);
  return merged;
}

export async function deleteUserProfile(userId: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM user_profile WHERE user_id = ?', [userId]);
}
