export type FoodItemDB = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carb: number;
  fat: number;
  portion: string;
  icon: string;
  category: string;
  tags: string[];
};

/**
 * VIETNAMESE_FOOD_DB
 * Đã chuẩn hóa toàn bộ giá trị dinh dưỡng về quy cách 100g (Lỗi #8).
 */
export const VIETNAMESE_FOOD_DB: FoodItemDB[] = [
  { id: 1, name: 'Phở bò chín', calories: 120, protein: 6, carb: 16, fat: 3.5, portion: '100g', icon: '🍲', category: 'Món nước', tags: ['high_protein'] },
  { id: 2, name: 'Phở gà', calories: 110, protein: 7, carb: 15, fat: 3, portion: '100g', icon: '🍲', category: 'Món nước', tags: ['high_protein'] },
  { id: 3, name: 'Bún chả Hà Nội', calories: 180, protein: 8, carb: 20, fat: 7, portion: '100g', icon: '🍜', category: 'Chiên nướng', tags: ['high_protein'] },
  { id: 4, name: 'Cơm tấm sườn bì chả', calories: 220, protein: 10, carb: 25, fat: 8, portion: '100g', icon: '🍛', category: 'Cơm/Xôi', tags: ['high_protein'] },
  { id: 5, name: 'Bánh mì thịt nướng', calories: 250, protein: 9, carb: 35, fat: 9, portion: '100g', icon: '🥖', category: 'Đồ ăn nhanh', tags: [] },
  { id: 6, name: 'Bánh mì ốp la', calories: 230, protein: 8, carb: 30, fat: 8, portion: '100g', icon: '🥖', category: 'Đồ ăn nhanh', tags: [] },
  { id: 7, name: 'Xôi xéo', calories: 280, protein: 6, carb: 50, fat: 6, portion: '100g', icon: '🍚', category: 'Cơm/Xôi', tags: [] },
  { id: 8, name: 'Gỏi cuốn', calories: 110, protein: 6, carb: 18, fat: 2, portion: '100g', icon: '🌯', category: 'Khác', tags: ['low_fat'] },
  { id: 9, name: 'Bún bò Huế', calories: 130, protein: 7, carb: 17, fat: 4, portion: '100g', icon: '🍜', category: 'Món nước', tags: ['high_protein'] },
  { id: 10, name: 'Hủ tiếu Nam Vang', calories: 125, protein: 6, carb: 16, fat: 4, portion: '100g', icon: '🍜', category: 'Món nước', tags: ['high_protein'] },
  { id: 11, name: 'Bánh cuốn nấm thịt', calories: 160, protein: 5, carb: 25, fat: 5, portion: '100g', icon: '🥟', category: 'Khác', tags: [] },
  { id: 12, name: 'Cơm chiên dương châu', calories: 190, protein: 5, carb: 28, fat: 7, portion: '100g', icon: '🍛', category: 'Cơm/Xôi', tags: [] },
  { id: 13, name: 'Mì xào hải sản', calories: 175, protein: 8, carb: 24, fat: 6, portion: '100g', icon: '🍝', category: 'Chiên nướng', tags: ['high_protein'] },
  { id: 14, name: 'Bánh xèo', calories: 210, protein: 6, carb: 20, fat: 12, portion: '100g', icon: '🌮', category: 'Chiên nướng', tags: [] },
  { id: 15, name: 'Chè đậu đen', calories: 100, protein: 2, carb: 22, fat: 0.5, portion: '100g', icon: '🍧', category: 'Tráng miệng', tags: ['low_fat'] },
  { id: 16, name: 'Trà sữa trân châu', calories: 80, protein: 0.5, carb: 15, fat: 2, portion: '100g', icon: '🧋', category: 'Đồ uống', tags: [] },
  { id: 17, name: 'Bánh bao nhân thịt', calories: 240, protein: 8, carb: 35, fat: 7, portion: '100g', icon: '🍘', category: 'Đồ ăn nhanh', tags: [] },
  { id: 18, name: 'Cháo lòng', calories: 85, protein: 5, carb: 12, fat: 2, portion: '100g', icon: '🍲', category: 'Món nước', tags: ['low_fat'] },
  { id: 19, name: 'Bún đậu mắm tôm', calories: 190, protein: 10, carb: 15, fat: 10, portion: '100g', icon: '🍱', category: 'Khác', tags: ['high_protein'] },
  { id: 20, name: 'Ức gà luộc', calories: 165, protein: 31, carb: 0, fat: 3, portion: '100g', icon: '🍗', category: 'Khác', tags: ['high_protein', 'low_carb', 'low_fat'] },
];
