import 'package:flutterfrontend/domain/entities/nutrition_goal_entity.dart';

class NutritionCalculatorService {
  /// Tính BMI từ chiều cao (cm) và cân nặng (kg)
  static double calculateBMI(double heightCm, double weightKg) {
    double heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  /// Phân loại BMI
  static String getBMICategory(double bmi) {
    if (bmi < 18.5) {
      return 'Gầy';
    } else if (bmi < 25) {
      return 'Bình thường';
    } else if (bmi < 30) {
      return 'Thừa cân';
    } else {
      return 'Béo phì';
    }
  }

  /// Tính Basal Metabolic Rate (BMR) dùng Mifflin-St Jeor equation
  static double calculateBMR({
    required int age,
    required double weightKg,
    required double heightCm,
    required String gender, // 'male' hoặc 'female'
  }) {
    if (gender.toLowerCase() == 'male' || gender == 'Nam') {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
  }

  /// Tính TDEE dựa trên BMR và activity level
  /// activityLevel: 1.2 (sedentary), 1.375 (light), 1.55 (moderate), 1.725 (active), 1.9 (very active)
  static double calculateTDEE(double bmr, double activityLevel) {
    return bmr * activityLevel;
  }

  /// Điều chỉnh calo dựa trên mục tiêu
  static double adjustCaloriesForGoal(double tdee, String goal) {
    switch (goal.toLowerCase()) {
      case 'giảm cân nhanh chóng':
      case 'giảm cân':
      case 'lose weight':
        return tdee - 500; // Giảm 500 calo để mất 0.5kg/tuần
      case 'ăn uống lành mạnh hơn':
      case 'healthy eating':
        return tdee; // Ổn định cân nặng
      case 'tăng cường sức bền':
      case 'tăng cân':
      case 'gain weight':
        return tdee + 500; // Tăng 500 calo để tăng 0.5kg/tuần
      case 'cardio và cải thiện tim mạch':
      case 'cardio':
        return tdee - 300; // Nhẹ nhàng giảm cho cardio
      default:
        return tdee;
    }
  }

  /// Tính nutrition macro dựa trên calories và loại mục tiêu
  static Map<String, double> calculateMacroNutrients(double calories, String goal) {
    // Định nghĩa macro ratios cho mỗi mục tiêu (%)
    Map<String, List<double>> macroRatios = {
      'giảm cân nhanh chóng': [30, 40, 30], // protein, carbs, fats
      'giảm cân': [30, 40, 30],
      'lose weight': [30, 40, 30],
      'ăn uống lành mạnh hơn': [25, 45, 30],
      'healthy eating': [25, 45, 30],
      'tăng cường sức bền': [25, 50, 25],
      'tăng cân': [25, 55, 20],
      'gain weight': [25, 55, 20],
      'cardio và cải thiện tim mạch': [20, 55, 25],
      'cardio': [20, 55, 25],
    };

    final ratios = macroRatios[goal.toLowerCase()] ?? [25, 45, 30];

    // Calories per gram: protein và carbs = 4 cal/g, fat = 9 cal/g
    double proteinGrams = (calories * ratios[0] / 100) / 4;
    double carbsGrams = (calories * ratios[1] / 100) / 4;
    double fatsGrams = (calories * ratios[2] / 100) / 9;

    return {
      'calories': calories,
      'protein': proteinGrams,
      'carbs': carbsGrams,
      'fats': fatsGrams,
    };
  }

  /// Tính toán đầy đủ nutrition goal từ profile
  static NutritionGoalEntity calculateNutritionGoal({
    required int age,
    required String gender,
    required double heightCm,
    required double weightKg,
    required String goal,
    double activityLevel = 1.55, // Mặc định là moderate activity
  }) {
    // Tính BMR
    final bmr = calculateBMR(
      age: age,
      weightKg: weightKg,
      heightCm: heightCm,
      gender: gender,
    );

    // Tính TDEE
    final tdee = calculateTDEE(bmr, activityLevel);

    // Điều chỉnh calo dựa trên mục tiêu
    final targetCalories = adjustCaloriesForGoal(tdee, goal);

    // Tính macro nutrients
    final macros = calculateMacroNutrients(targetCalories, goal);

    return NutritionGoalEntity(
      targetCalories: macros['calories']!.toDouble(),
      targetProtein: macros['protein']!.toDouble(),
      targetCarb: macros['carbs']!.toDouble(),
      targetFat: macros['fats']!.toDouble(),
      createdAt: DateTime.now(),
    );
  }

  /// Chuyển đổi Activity Level từ string
  static double getActivityLevelMultiplier(String? activityLevel) {
    switch (activityLevel?.toLowerCase()) {
      case 'sedentary':
      case 'ít vận động':
        return 1.2;
      case 'light':
      case 'nhẹ':
        return 1.375;
      case 'moderate':
      case 'vừa phải':
        return 1.55;
      case 'active':
      case 'năng động':
        return 1.725;
      case 'very active':
      case 'rất năng động':
        return 1.9;
      default:
        return 1.55; // Mặc định là moderate
    }
  }
}
