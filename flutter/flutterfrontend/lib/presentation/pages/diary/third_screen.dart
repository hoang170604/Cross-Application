import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'fourth_screen.dart';
import '../home/user_setup_data.dart';
import 'package:flutterfrontend/core/services/nutrition_calculator_service.dart';
import 'package:flutterfrontend/core/services/user_session_manager.dart';
import 'package:flutterfrontend/domain/usecases/user_usecase.dart';
import 'package:get_it/get_it.dart';
import 'package:flutterfrontend/domain/entities/user_profile_entity.dart';

class ThirdScreen extends StatefulWidget {
  final UserSetupData setupData;
  
  const ThirdScreen({super.key, required this.setupData});

  @override
  State<ThirdScreen> createState() => _ThirdScreenState();
}

class _ThirdScreenState extends State<ThirdScreen> {
  bool _isCentimeters = true;
  bool _isKilograms = true;
  bool _isMale = true;
  double _height = 168;
  double _weight = 70;
  bool _isLoading = false;

  double _calculateBMI() {
    // Convert to metric
    double heightM = _isCentimeters ? _height / 100 : _height * 0.3048;
    double weightKg = _isKilograms ? _weight : _weight * 0.453592;

    return weightKg / (heightM * heightM);
  }

  String _getBMICategory(double bmi) {
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

  Future<void> _saveProfileAndNavigate() async {
    if (_isLoading) return;

    setState(() => _isLoading = true);

    try {
      // Tính BMI
      double heightCm = _isCentimeters ? _height : _height * 30.48;
      double weightKg = _isKilograms ? _weight : _weight * 0.453592;
      double bmi = NutritionCalculatorService.calculateBMI(heightCm, weightKg);

      // Tính tuổi từ ngày sinh
      int age = widget.setupData.calculateAge();

      // Tính nutrition goal
      String gender = _isMale ? 'male' : 'female';
      var nutritionGoal = NutritionCalculatorService.calculateNutritionGoal(
        age: age,
        gender: gender,
        heightCm: heightCm,
        weightKg: weightKg,
        goal: widget.setupData.selectedGoal ?? 'healthy eating',
      );

      // Lấy userId từ session
      final sessionManager = UserSessionManager(prefs: await _getPrefs());
      final userId = sessionManager.getUserId();

      if (userId == null) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Chưa đăng nhập. Vui lòng đăng nhập lại.')),
        );
        setState(() => _isLoading = false);
        return;
      }

      // Gọi usecase để lưu vào database
      final userUsecase = GetIt.instance<UserUsecase>();
      final userProfile = UserProfileEntity(
        userId: userId,
        age: age,
        gender: gender,
        height: heightCm,
        weight: weightKg,
        goal: widget.setupData.selectedGoal ?? 'healthy eating',
        activityLevel: 1.55,
      );

      await userUsecase.updateProfileAndCalculateGoal(userId, userProfile);

      // Cập nhật setupData
      final updatedSetupData = widget.setupData.copyWith(
        height: _height,
        weight: _weight,
        isCentimeters: _isCentimeters,
        isKilograms: _isKilograms,
        isMale: _isMale,
        bmi: bmi,
        calculatedAge: age,
        nutritionGoal: nutritionGoal,
      );

      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => FourthScreen(setupData: updatedSetupData),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Lỗi: ${e.toString()}')),
      );
      setState(() => _isLoading = false);
    }
  }

  Future<SharedPreferences> _getPrefs() async {
    return await SharedPreferences.getInstance();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
            child: const Text(
              'Nhập thông tin cơ thể',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.black,
                height: 1.3,
              ),
            ),
          ),

          // Gender selection
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Male button
                GestureDetector(
                  onTap: () {
                    setState(() => _isMale = true);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: _isMale ? Colors.blue[300] : Colors.white,
                      border: Border.all(color: Colors.grey[400]!, width: 2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '♂ Nam',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: _isMale ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                // Female button
                GestureDetector(
                  onTap: () {
                    setState(() => _isMale = false);
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                    decoration: BoxDecoration(
                      color: !_isMale ? Colors.pink[300] : Colors.white,
                      border: Border.all(color: Colors.grey[400]!, width: 2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '♀ Nữ',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: !_isMale ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 8),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
              child: Row(
                children: [
                  // LEFT COLUMN - HEIGHT
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Chiều cao',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Height number
                        Text(
                          _height.toStringAsFixed(0),
                          style: const TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Divider(color: Colors.grey[300], thickness: 2),
                        const SizedBox(height: 16),
                        // Height unit toggle
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            GestureDetector(
                              onTap: () {
                                setState(() => _isCentimeters = true);
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: _isCentimeters
                                      ? Colors.green[300]
                                      : Colors.white,
                                  border: Border.all(
                                    color: Colors.grey[400]!,
                                    width: 2,
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'cm',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: _isCentimeters
                                        ? Colors.white
                                        : Colors.black87,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            GestureDetector(
                              onTap: () {
                                setState(() => _isCentimeters = false);
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: !_isCentimeters
                                      ? Colors.green[300]
                                      : Colors.white,
                                  border: Border.all(
                                    color: Colors.grey[400]!,
                                    width: 2,
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'ft',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: !_isCentimeters
                                        ? Colors.white
                                        : Colors.black87,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Height slider
                        Slider(
                          value: _height,
                          min: 100,
                          max: 250,
                          activeColor: Colors.green[300],
                          inactiveColor: Colors.grey[300],
                          onChanged: (value) {
                            setState(() => _height = value);
                          },
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(width: 20),

                  // RIGHT COLUMN - WEIGHT
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          'Cân nặng',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.black87,
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Weight number
                        Text(
                          _weight.toStringAsFixed(0),
                          style: const TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Divider(color: Colors.grey[300], thickness: 2),
                        const SizedBox(height: 16),
                        // Weight unit toggle
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            GestureDetector(
                              onTap: () {
                                setState(() => _isKilograms = true);
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: _isKilograms
                                      ? Colors.green[300]
                                      : Colors.white,
                                  border: Border.all(
                                    color: Colors.grey[400]!,
                                    width: 2,
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'kg',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: _isKilograms
                                        ? Colors.white
                                        : Colors.black87,
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            GestureDetector(
                              onTap: () {
                                setState(() => _isKilograms = false);
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: !_isKilograms
                                      ? Colors.green[300]
                                      : Colors.white,
                                  border: Border.all(
                                    color: Colors.grey[400]!,
                                    width: 2,
                                  ),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  'lbs',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w600,
                                    color: !_isKilograms
                                        ? Colors.white
                                        : Colors.black87,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Weight slider
                        Slider(
                          value: _weight,
                          min: 30,
                          max: 200,
                          activeColor: Colors.green[300],
                          inactiveColor: Colors.grey[300],
                          onChanged: (value) {
                            setState(() => _weight = value);
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // BMI Display
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[300]!, width: 2),
                borderRadius: BorderRadius.circular(12),
                color: Colors.grey[50],
              ),
              child: Column(
                children: [
                  Text(
                    'BMI',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _calculateBMI().toStringAsFixed(1),
                    style: const TextStyle(
                      fontSize: 36,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getBMICategory(_calculateBMI()),
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[700],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Bottom button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
            child: SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _isLoading ? null : _saveProfileAndNavigate,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 26, 197, 63),
                  disabledBackgroundColor: Colors.grey[400],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                          strokeWidth: 2,
                        ),
                      )
                    : const Text(
                        'Tiếp theo',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: Color.fromARGB(255, 255, 255, 255),
                        ),
                      ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
