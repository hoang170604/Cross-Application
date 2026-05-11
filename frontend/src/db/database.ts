import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

/**
 * Tên cơ sở dữ liệu chính của ứng dụng
 */
const DATABASE_NAME = 'nutritrack.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Mở kết nối tới cơ sở dữ liệu SQLite
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) return dbInstance;
  
  if (Platform.OS === 'web') {
    return {
      execAsync: async () => {},
      runAsync: async () => ({ lastInsertRowId: 0, changes: 0 }),
      getFirstAsync: async () => null,
      getAllAsync: async () => [],
      prepareAsync: async () => ({
        executeAsync: async () => ({ lastInsertRowId: 0, changes: 0 }),
        finalizeAsync: async () => {},
      }),
      closeAsync: async () => {},
    } as unknown as SQLite.SQLiteDatabase;
  }

  try {
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    console.log('[SQLite] Database opened successfully:', DATABASE_NAME);
    return dbInstance;
  } catch (error: any) {
    console.error('[SQLite] Failed to open database:', error.message);
    throw error;
  }
}

/**
 * Khởi tạo cấu trúc các bảng (Schema) cho ứng dụng
 * Gọi hàm này khi ứng dụng bắt đầu khởi chạy
 */
export async function initDatabase() {
  const db = await getDatabase();

  // Bật hỗ trợ Foreign Keys
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // 1. Bảng lưu nhật ký bài tập (Activities)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT, -- ID từ server (nếu đã đồng bộ)
      activity_type TEXT NOT NULL,
      minutes INTEGER NOT NULL,
      calories_burned REAL NOT NULL,
      date TEXT NOT NULL, -- Định dạng YYYY-MM-DD
      synced INTEGER DEFAULT 0 -- 0: Local, 1: Synced to Server
    );
  `);

  // 2. Bảng lưu nhật ký ăn uống (Meal Logs)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS meal_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT,
      meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
      food_id INTEGER,
      food_name TEXT NOT NULL,
      calories REAL NOT NULL,
      protein REAL,
      carb REAL,
      fat REAL,
      quantity REAL DEFAULT 1,
      date TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );
  `);

  // 3. Bảng lưu nhật ký nước uống (Water Logs)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS water_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount_ml INTEGER NOT NULL,
      date TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );
  `);

  // 4. Bảng lưu nhật ký cân nặng (Weight Logs)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS weight_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      weight REAL NOT NULL,
      date TEXT NOT NULL,
      synced INTEGER DEFAULT 0
    );
  `);

  // 5. Bảng hàng đợi đồng bộ (Sync Queue) - LƯU CÁC LỆNH CHƯA GỬI ĐƯỢC LÊN SERVER
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action_type TEXT NOT NULL, -- ADD_MEAL, ADD_ACTIVITY, LOG_WATER, LOG_WEIGHT
      payload TEXT NOT NULL,    -- Dữ liệu dạng JSON string
      created_at TEXT NOT NULL,
      retry_count INTEGER DEFAULT 0
    );
  `);

  // 6. Bảng lưu hồ sơ người dùng (User Profile) — schema nhiều cột, hợp cho SQLite
  //    Mỗi user_id 1 dòng duy nhất; các trường derived (target*) cũng được lưu để
  //    đọc ngay lúc khởi động mà không phải tính lại từ AsyncStorage.
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_profile (
      user_id INTEGER PRIMARY KEY,
      name TEXT,
      email TEXT,
      age INTEGER,
      gender TEXT,
      height REAL,
      weight REAL,
      current_weight REAL,
      activity_level REAL,
      goal TEXT,
      fasting_goal TEXT,
      target_calories REAL,
      target_protein REAL,
      target_carb REAL,
      target_fat REAL,
      daily_meals_json TEXT,
      weight_history_json TEXT,
      updated_at TEXT NOT NULL
    );
  `);

  // 7. Bảng lưu trạng thái nhịn ăn theo user (thay AsyncStorage cũ).
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS fasting_state (
      user_id INTEGER PRIMARY KEY,
      start_time INTEGER NOT NULL,    -- epoch ms
      target_hours INTEGER NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // --- ĐÁNH CHỈ MỤC (INDEXING) ĐỂ TĂNG TỐC TRUY VẤN THEO NGÀY ---
  await db.execAsync('CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);');
  await db.execAsync('CREATE INDEX IF NOT EXISTS idx_meal_logs_date ON meal_logs(date);');
  await db.execAsync('CREATE INDEX IF NOT EXISTS idx_water_logs_date ON water_logs(date);');
  await db.execAsync('CREATE INDEX IF NOT EXISTS idx_weight_logs_date ON weight_logs(date);');

  console.log('[SQLite] Database updated with Sync Queue, Profile, Fasting & Indexes.');
}

/**
 * Xóa sạch toàn bộ dữ liệu trong các bảng (Dùng khi đăng xuất)
 */
export async function clearAllData() {
  if (Platform.OS === 'web') return;
  const db = await getDatabase();
  try {
    await db.execAsync('DELETE FROM activities;');
    await db.execAsync('DELETE FROM meal_logs;');
    await db.execAsync('DELETE FROM water_logs;');
    await db.execAsync('DELETE FROM weight_logs;');
    await db.execAsync('DELETE FROM sync_queue;');
    await db.execAsync('DELETE FROM user_profile;');
    await db.execAsync('DELETE FROM fasting_state;');
    console.log('[SQLite] All tables cleared successfully.');
  } catch (error: any) {
    console.error('[SQLite] Failed to clear tables:', error.message);
  }
}
