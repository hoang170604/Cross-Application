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

export const VIETNAMESE_FOOD_DB: FoodItemDB[] = [
  { id: 1, name: 'Phở bò chín', calories: 430, protein: 20, carb: 55, fat: 12, portion: '1 bát', icon: '🍲', category: 'Món nước', tags: ['high_protein'] },
  { id: 2, name: 'Phở gà', calories: 380, protein: 22, carb: 50, fat: 10, portion: '1 bát', icon: '🍲', category: 'Món nước', tags: ['high_protein'] },
  { id: 3, name: 'Bún chả Hà Nội', calories: 550, protein: 25, carb: 60, fat: 20, portion: '1 suất', icon: '🍜', category: 'Chiên nướng', tags: ['high_protein'] },
  { id: 4, name: 'Cơm tấm sườn bì chả', calories: 650, protein: 30, carb: 75, fat: 25, portion: '1 đĩa', icon: '🍛', category: 'Cơm/Xôi', tags: ['high_protein'] },
  { id: 5, name: 'Bánh mì thịt nướng', calories: 380, protein: 15, carb: 45, fat: 15, portion: '1 ổ', icon: '🥖', category: 'Đồ ăn nhanh', tags: [] },
  { id: 6, name: 'Bánh mì ốp la', calories: 280, protein: 12, carb: 35, fat: 10, portion: '1 ổ', icon: '🥖', category: 'Đồ ăn nhanh', tags: [] },
  { id: 7, name: 'Xôi xéo', calories: 400, protein: 8, carb: 65, fat: 10, portion: '1 gói', icon: '🍚', category: 'Cơm/Xôi', tags: [] },
  { id: 8, name: 'Gỏi cuốn', calories: 150, protein: 8, carb: 20, fat: 4, portion: '3 cuốn', icon: '🌯', category: 'Khác', tags: ['low_fat'] },
  { id: 9, name: 'Bún bò Huế', calories: 480, protein: 24, carb: 58, fat: 16, portion: '1 bát', icon: '🍜', category: 'Món nước', tags: ['high_protein'] },
  { id: 10, name: 'Hủ tiếu Nam Vang', calories: 420, protein: 18, carb: 50, fat: 14, portion: '1 bát', icon: '🍜', category: 'Món nước', tags: ['high_protein'] },
  { id: 11, name: 'Bánh cuốn nấm thịt', calories: 350, protein: 12, carb: 45, fat: 12, portion: '1 đĩa', icon: '🥟', category: 'Khác', tags: [] },
  { id: 12, name: 'Cơm chiên dương châu', calories: 580, protein: 15, carb: 70, fat: 22, portion: '1 đĩa', icon: '🍛', category: 'Cơm/Xôi', tags: [] },
  { id: 13, name: 'Mì xào hải sản', calories: 450, protein: 20, carb: 55, fat: 15, portion: '1 đĩa', icon: '🍝', category: 'Chiên nướng', tags: ['high_protein'] },
  { id: 14, name: 'Bánh xèo', calories: 350, protein: 10, carb: 30, fat: 20, portion: '1 cái', icon: '🌮', category: 'Chiên nướng', tags: [] },
  { id: 15, name: 'Chè đậu đen', calories: 250, protein: 5, carb: 55, fat: 2, portion: '1 ly', icon: '🍧', category: 'Tráng miệng', tags: ['low_fat'] },
  { id: 16, name: 'Trà sữa trân châu', calories: 380, protein: 2, carb: 65, fat: 10, portion: '1 ly', icon: '🧋', category: 'Đồ uống', tags: [] },
  { id: 17, name: 'Bánh bao nhân thịt', calories: 290, protein: 10, carb: 40, fat: 10, portion: '1 cái', icon: '🍘', category: 'Đồ ăn nhanh', tags: [] },
  { id: 18, name: 'Cháo lòng', calories: 320, protein: 15, carb: 45, fat: 9, portion: '1 bát', icon: '🍲', category: 'Món nước', tags: ['low_fat'] },
  { id: 19, name: 'Bún đậu mắm tôm', calories: 550, protein: 30, carb: 40, fat: 28, portion: '1 suất', icon: '🍱', category: 'Khác', tags: ['high_protein'] },
  { id: 20, name: 'Ức gà luộc', calories: 165, protein: 31, carb: 0, fat: 3, portion: '100g', icon: '🍗', category: 'Khác', tags: ['high_protein', 'low_carb', 'low_fat'] },
];
