import { getDatabase } from './database';

/**
 * Lưu nhật ký nước vào SQLite
 */
export async function logWater(amount: number, date: string) {
  const db = await getDatabase();
  // Kiểm tra xem ngày hôm đó đã có bản ghi chưa
  const existing = await db.getFirstAsync<{ id: number, amount_ml: number }>(
    'SELECT id, amount_ml FROM water_logs WHERE date = ?',
    [date]
  );

  if (existing) {
    await db.runAsync(
      'UPDATE water_logs SET amount_ml = ?, synced = 0 WHERE id = ?',
      [existing.amount_ml + amount, existing.id]
    );
  } else {
    await db.runAsync(
      'INSERT INTO water_logs (amount_ml, date, synced) VALUES (?, ?, 0)',
      [amount, date]
    );
  }
}

/**
 * Lấy tổng lượng nước theo ngày
 */
export async function getWaterByDate(date: string): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ amount_ml: number }>(
    'SELECT amount_ml FROM water_logs WHERE date = ?',
    [date]
  );
  return row ? row.amount_ml : 0;
}

/**
 * Lưu nhật ký cân nặng vào SQLite
 */
export async function logWeight(weight: number, date: string) {
  const db = await getDatabase();
  const existing = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM weight_logs WHERE date = ?',
    [date]
  );

  if (existing) {
    await db.runAsync(
      'UPDATE weight_logs SET weight = ?, synced = 0 WHERE id = ?',
      [weight, existing.id]
    );
  } else {
    await db.runAsync(
      'INSERT INTO weight_logs (weight, date, synced) VALUES (?, ?, 0)',
      [weight, date]
    );
  }
}
