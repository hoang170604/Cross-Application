package com.crossapplication.main.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.crossapplication.main.entity.Food;
import com.crossapplication.main.entity.FoodCategory;
import com.crossapplication.main.repository.interfaces.FoodCategoryRepository;
import com.crossapplication.main.repository.interfaces.FoodRepositoryInterface;

/**
 * Tự động nạp dữ liệu món ăn Việt Nam vào DB khi bảng food còn trống.
 * Dữ liệu khớp chính xác ID với frontend (foodDatabase.ts).
 */
@Component
public class FoodDataInitializer implements CommandLineRunner {

    @Autowired
    private FoodCategoryRepository categoryRepo;

    @Autowired
    private FoodRepositoryInterface foodRepo;

    @Override
    public void run(String... args) {
        // Chỉ seed nếu bảng food đang trống
        if (!foodRepo.findAllFood().isEmpty()) {
            System.out.println("[FoodDataInitializer] Bảng food đã có dữ liệu, bỏ qua seed.");
            return;
        }

        System.out.println("[FoodDataInitializer] Đang nạp dữ liệu món ăn Việt Nam...");

        // ─── Bước 1: Tạo danh mục ──────────────────────────────────────────
        FoodCategory catMonNuoc    = findOrCreateCategory("Món nước");
        FoodCategory catChienNuong = findOrCreateCategory("Chiên nướng");
        FoodCategory catComXoi     = findOrCreateCategory("Cơm/Xôi");
        FoodCategory catDoAnNhanh  = findOrCreateCategory("Đồ ăn nhanh");
        FoodCategory catKhac       = findOrCreateCategory("Khác");
        FoodCategory catTrangMieng = findOrCreateCategory("Tráng miệng");
        FoodCategory catDoUong     = findOrCreateCategory("Đồ uống");

        // ─── Bước 2: Tạo 20 món ăn (ID khớp frontend) ──────────────────────
        createFood("Phở bò chín",           120, 6,    16, 3.5f,  catMonNuoc);
        createFood("Phở gà",                110, 7,    15, 3,     catMonNuoc);
        createFood("Bún chả Hà Nội",        180, 8,    20, 7,     catChienNuong);
        createFood("Cơm tấm sườn bì chả",   220, 10,   25, 8,     catComXoi);
        createFood("Bánh mì thịt nướng",     250, 9,    35, 9,     catDoAnNhanh);
        createFood("Bánh mì ốp la",          230, 8,    30, 8,     catDoAnNhanh);
        createFood("Xôi xéo",               280, 6,    50, 6,     catComXoi);
        createFood("Gỏi cuốn",              110, 6,    18, 2,     catKhac);
        createFood("Bún bò Huế",            130, 7,    17, 4,     catMonNuoc);
        createFood("Hủ tiếu Nam Vang",      125, 6,    16, 4,     catMonNuoc);
        createFood("Bánh cuốn nấm thịt",    160, 5,    25, 5,     catKhac);
        createFood("Cơm chiên dương châu",   190, 5,    28, 7,     catComXoi);
        createFood("Mì xào hải sản",        175, 8,    24, 6,     catChienNuong);
        createFood("Bánh xèo",              210, 6,    20, 12,    catChienNuong);
        createFood("Chè đậu đen",           100, 2,    22, 0.5f,  catTrangMieng);
        createFood("Trà sữa trân châu",      80, 0.5f, 15, 2,     catDoUong);
        createFood("Bánh bao nhân thịt",     240, 8,    35, 7,     catDoAnNhanh);
        createFood("Cháo lòng",              85, 5,    12, 2,     catMonNuoc);
        createFood("Bún đậu mắm tôm",       190, 10,   15, 10,    catKhac);
        createFood("Ức gà luộc",            165, 31,    0, 3,     catKhac);

        System.out.println("[FoodDataInitializer] ✅ Đã nạp " + foodRepo.findAllFood().size() + " món ăn thành công!");
    }

    private FoodCategory findOrCreateCategory(String name) {
        var list = categoryRepo.findByName(name);
        if (list != null && !list.isEmpty()) {
            return list.get(0);
        }
        FoodCategory cat = new FoodCategory();
        cat.setName(name);
        return categoryRepo.save(cat);
    }

    private void createFood(String name, float calories, float protein, float carb, float fat, FoodCategory category) {
        Food food = new Food();
        food.setName(name);
        food.setCaloriesPer100g(calories);
        food.setProteinPer100g(protein);
        food.setCarbPer100g(carb);
        food.setFatPer100g(fat);
        food.setCategory(category);
        foodRepo.saveFood(food);
    }
}
