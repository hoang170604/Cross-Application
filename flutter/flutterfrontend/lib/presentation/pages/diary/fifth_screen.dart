import 'package:flutter/material.dart';
import '../home/user_setup_data.dart';
import 'package:flutterfrontend/core/services/user_session_manager.dart';
import 'package:flutterfrontend/domain/usecases/user_usecase.dart';
import 'package:flutterfrontend/domain/entities/nutrition_goal_entity.dart';
import 'package:flutterfrontend/domain/entities/user_profile_entity.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';

class FifthScreen extends StatefulWidget {
  final UserSetupData? setupData;
  
  const FifthScreen({super.key, this.setupData});

  @override
  State<FifthScreen> createState() => _FifthScreenState();
}

class _FifthScreenState extends State<FifthScreen> {
  int waterGlasses = 3; // Số cốc nước đã uống
  double weight = 45.0;
  int steps = 9;
  int selectedNavIndex = 0;
  
  // Nutrition data từ database
  NutritionGoalEntity? _nutritionGoal;
  UserProfileEntity? _userProfile;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  Future<void> _loadUserData() async {
    try {
      // Nếu có setupData, sử dụng dữ liệu từ đó
      if (widget.setupData?.nutritionGoal != null) {
        setState(() {
          _nutritionGoal = widget.setupData!.nutritionGoal;
          _isLoading = false;
        });
        return;
      }

      // Nếu không, load từ database
      final prefs = await SharedPreferences.getInstance();
      final sessionManager = UserSessionManager(prefs: prefs);
      final userId = sessionManager.getUserId();

      if (userId == null) {
        setState(() => _isLoading = false);
        return;
      }

      final userUsecase = GetIt.instance<UserUsecase>();
      
      // Load nutrition goal từ database
      final nutritionGoal = await userUsecase.getNutritionGoal(userId);
      final userProfile = await userUsecase.getUserProfile(userId);

      setState(() {
        _nutritionGoal = nutritionGoal;
        _userProfile = userProfile;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading user data: $e');
      setState(() => _isLoading = false);
    }
  }

  double get _targetCalories => _nutritionGoal?.targetCalories ?? 2500;
  double get _targetProtein => _nutritionGoal?.targetProtein ?? 100;
  double get _targetCarbs => _nutritionGoal?.targetCarb ?? 281;
  double get _targetFats => _nutritionGoal?.targetFat ?? 56;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Row(
        children: [
          // Sidebar Navigation
          NavigationRail(
            selectedIndex: selectedNavIndex,
            onDestinationSelected: (int index) {
              setState(() {
                selectedNavIndex = index;
              });
            },
            backgroundColor: Colors.grey[100],
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.book),
                label: Text('Nhật ký'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.restaurant),
                label: Text('Công thức'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.flag),
                label: Text('Mục tiêu'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.person),
                label: Text('Hồ sơ'),
              ),
            ],
          ),
          // Main content
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
            // Header
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: const [
                          Text(
                            'Hôm nay',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                          Text(
                            'Tuần 1',
                            style: TextStyle(fontSize: 14, color: Colors.grey),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          _buildHeaderIcon('💎', '0'),
                          const SizedBox(width: 16),
                          _buildHeaderIcon('🔥', '0'),
                          const SizedBox(width: 16),
                          _buildHeaderIcon('📊', ''),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Main content area with 2 columns
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Left column
                  Expanded(
                    child: Column(
                      children: [
                        // Summary section
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: const [
                                Text(
                                  'Sơ bộ',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  'Chi tiết',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.blue,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Colors.yellow[50],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceAround,
                                    children: [
                                      _buildSummaryItem('0', 'sắp đến'),
                                      Container(
                                        width: 120,
                                        height: 120,
                                        decoration: BoxDecoration(
                                          color: Colors.blue[100],
                                          shape: BoxShape.circle,
                                        ),
                                        child: Center(
                                          child: Column(
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: const [
                                              Text(
                                                '7,893',
                                                style: TextStyle(
                                                  fontSize: 20,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              Text(
                                                'Octopus',
                                                style: TextStyle(
                                                  fontSize: 12,
                                                  color: Colors.grey,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                      _buildSummaryItem('0', 'kỳ vọng'),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceEvenly,
                                    children: const [
                                      Text('Thực phẩm',
                                          style: TextStyle(fontSize: 12)),
                                      Text('Đạo đức',
                                          style: TextStyle(fontSize: 12)),
                                      Text('Dạy',
                                          style: TextStyle(fontSize: 12)),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 24),

                        // Nutrition section
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: const [
                                Text(
                                  'Dinh dưỡng',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  'Thêm',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Colors.blue,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            _buildNutritionItem('Breakfast', 'GỊ97 kcal'),
                            _buildNutritionItem('Lunch', 'GỊ72 kcal'),
                            _buildNutritionItem('Dinner', 'GỊ18 kcal'),
                            _buildNutritionItem('Snack', 'GỊ103 kcal'),

                            const SizedBox(height: 24),

                            // Macro breakdown section
                            Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Colors.grey[50],
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.grey[200]!),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Mục tiêu dinh dưỡng',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  _buildMacroItem(
                                    'Calo',
                                    '${_targetCalories.toStringAsFixed(0)} kcal',
                                    Colors.orange,
                                  ),
                                  const SizedBox(height: 12),
                                  _buildMacroItem(
                                    'Protein',
                                    '${_targetProtein.toStringAsFixed(0)} g',
                                    Colors.red,
                                  ),
                                  const SizedBox(height: 12),
                                  _buildMacroItem(
                                    'Carbs',
                                    '${_targetCarbs.toStringAsFixed(0)} g',
                                    Colors.blue,
                                  ),
                                  const SizedBox(height: 12),
                                  _buildMacroItem(
                                    'Fats',
                                    '${_targetFats.toStringAsFixed(0)} g',
                                    Colors.green,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(width: 24),

                  // Right column
                  Expanded(
                    child: Column(
                      children: [
                        // Water tracking section
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Theo dõi lượng nước',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Container(
                              padding: const EdgeInsets.all(24),
                              decoration: BoxDecoration(
                                color: Colors.blue[400],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Column(
                                children: [
                                  const Text(
                                    'Nước',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    'Tiêu 3:00 p',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: Colors.white70,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Text(
                                    '$waterGlasses.00 l',
                                    style: const TextStyle(
                                      fontSize: 40,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 20),
                                  GridView.builder(
                                    shrinkWrap: true,
                                    physics:
                                        const NeverScrollableScrollPhysics(),
                                    gridDelegate:
                                        const SliverGridDelegateWithFixedCrossAxisCount(
                                          crossAxisCount: 4,
                                          mainAxisSpacing: 8,
                                          crossAxisSpacing: 8,
                                        ),
                                    itemCount: 12,
                                    itemBuilder: (context, index) {
                                      bool isFilled = index < waterGlasses;
                                      return GestureDetector(
                                        onTap: () {
                                          setState(() {
                                            waterGlasses = index + 1;
                                          });
                                        },
                                        child: Container(
                                          decoration: BoxDecoration(
                                            color: isFilled
                                                ? Colors.white
                                                : Colors.blue[300],
                                            borderRadius:
                                                BorderRadius.circular(8),
                                          ),
                                          child: Icon(
                                            Icons.local_drink,
                                            color: isFilled
                                                ? Colors.blue[400]
                                                : Colors.white,
                                          ),
                                        ),
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 24),

                        // Weight measurement section
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Đo lường cơ thể',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 20,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.grey[800],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  GestureDetector(
                                    onTap: () {
                                      setState(() {
                                        if (weight > 30) weight -= 0.5;
                                      });
                                    },
                                    child: Container(
                                      width: 44,
                                      height: 44,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[700],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Icon(
                                        Icons.remove,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ),
                                  Column(
                                    children: [
                                      const Text(
                                        'Cân nặng',
                                        style: TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${weight.toStringAsFixed(1)} kg',
                                        style: const TextStyle(
                                          fontSize: 28,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ],
                                  ),
                                  GestureDetector(
                                    onTap: () {
                                      setState(() {
                                        if (weight < 150) weight += 0.5;
                                      });
                                    },
                                    child: Container(
                                      width: 44,
                                      height: 44,
                                      decoration: BoxDecoration(
                                        color: Colors.grey[700],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: const Icon(Icons.add,
                                          color: Colors.white),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 24),

                        // Activity section
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Hoạt động',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 24,
                                vertical: 20,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.amber[400],
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '$steps bước',
                                    style: const TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(8),
                                    child: LinearProgressIndicator(
                                      value: (steps / 10000),
                                      minHeight: 8,
                                      backgroundColor: Colors.white24,
                                      valueColor:
                                          const AlwaysStoppedAnimation<Color>(
                                        Colors.white,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 40),
          ],
            ),
          ),
        ),
      ],
    ),
    );
  }

  Widget _buildHeaderIcon(String icon, String count) {
    return Row(
      children: [
        Text(icon, style: const TextStyle(fontSize: 20)),
        if (count.isNotEmpty)
          Text(
            count,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
          ),
      ],
    );
  }

  Widget _buildSummaryItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }

  Widget _buildNutritionItem(String name, String calories) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            name,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500),
          ),
          Row(
            children: [
              Text(
                calories,
                style: const TextStyle(fontSize: 14, color: Colors.grey),
              ),
              const SizedBox(width: 12),
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: Colors.blue,
                  borderRadius: BorderRadius.circular(6),
                ),
                child: const Icon(Icons.add, color: Colors.white, size: 18),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMacroItem(String label, String value, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 12),
            Text(
              label,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.bold,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }
}
