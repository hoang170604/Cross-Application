import 'package:flutterfrontend/domain/entities/nutrition_goal_entity.dart';

class UserSetupData {
  /// Mục tiêu được chọn từ CreateGoal_screen
  String? selectedGoal;

  /// Ngày sinh từ SecondScreen
  int? day;
  int? month;
  int? year;

  /// Thông tin cơ thể từ ThirdScreen
  bool? isCentimeters;
  bool? isKilograms;
  bool? isMale;
  double? height;
  double? weight;

  /// Dữ liệu tính toán
  double? bmi;
  int? calculatedAge;
  NutritionGoalEntity? nutritionGoal;

  UserSetupData({
    this.selectedGoal,
    this.day,
    this.month,
    this.year,
    this.isCentimeters,
    this.isKilograms,
    this.isMale,
    this.height,
    this.weight,
    this.bmi,
    this.calculatedAge,
    this.nutritionGoal,
  });

  /// Tính tuổi từ ngày sinh
  int calculateAge() {
    if (year == null || month == null || day == null) return 0;
    final birthYear = 1923 + (year ?? 0);
    final birthMonth = (month ?? 0) + 1;
    final birthDay = (day ?? 0) + 1;
    final today = DateTime.now();
    var age = today.year - birthYear;
    if (today.month < birthMonth || (today.month == birthMonth && today.day < birthDay)) {
      age--;
    }
    return age.clamp(0, 150);
  }

  /// Tính chiều cao theo mét
  double getHeightInMeters() {
    if (height == null) return 0;
    if (isCentimeters == true) {
      return height! / 100;
    } else {
      // Convert feet to meters (1 ft = 0.3048m)
      return height! * 0.3048;
    }
  }

  /// Tính cân nặng theo kg
  double getWeightInKg() {
    if (weight == null) return 0;
    if (isKilograms == true) {
      return weight!;
    } else {
      // Convert lbs to kg (1 lb = 0.453592kg)
      return weight! * 0.453592;
    }
  }

  UserSetupData copyWith({
    String? selectedGoal,
    int? day,
    int? month,
    int? year,
    bool? isCentimeters,
    bool? isKilograms,
    bool? isMale,
    double? height,
    double? weight,
    double? bmi,
    int? calculatedAge,
    NutritionGoalEntity? nutritionGoal,
  }) {
    return UserSetupData(
      selectedGoal: selectedGoal ?? this.selectedGoal,
      day: day ?? this.day,
      month: month ?? this.month,
      year: year ?? this.year,
      isCentimeters: isCentimeters ?? this.isCentimeters,
      isKilograms: isKilograms ?? this.isKilograms,
      isMale: isMale ?? this.isMale,
      height: height ?? this.height,
      weight: weight ?? this.weight,
      bmi: bmi ?? this.bmi,
      calculatedAge: calculatedAge ?? this.calculatedAge,
      nutritionGoal: nutritionGoal ?? this.nutritionGoal,
    );
  }
}
