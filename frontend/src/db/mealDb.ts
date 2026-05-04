import { getDatabase } from './database';

export interface MealLog {
  id?: number;
  uid?: string;
  meal_type: string;
  food_id?: number;
  food_name: string;
  calories: number;
  protein?: number;
  carb?: number;
  fat?: number;
  quantity?: number;
  date: string;
  synced?: number;
}

export async function insertMeal(meal: MealLog) {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO meal_logs 
    (uid, meal_type, food_id, food_name, calories, protein, carb, fat, quantity, date, synced) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      meal.uid || null, 
      meal.meal_type, 
      meal.food_id || null, 
      meal.food_name, 
      meal.calories, 
      meal.protein || 0, 
      meal.carb || 0, 
      meal.fat || 0, 
      meal.quantity || 1, 
      meal.date, 
      meal.synced || 0
    ]
  );
  return result.lastInsertRowId;
}

export async function getMealsByDate(date: string): Promise<MealLog[]> {
  const db = await getDatabase();
  return await db.getAllAsync<MealLog>('SELECT * FROM meal_logs WHERE date = ?', [date]);
}

export async function deleteMeal(id: number) {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM meal_logs WHERE id = ?', [id]);
}
