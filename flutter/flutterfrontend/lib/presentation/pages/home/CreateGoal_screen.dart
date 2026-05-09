import 'package:flutter/material.dart';
import 'CreateGoals_screen.dart';

class CreateGoal extends StatefulWidget {
  const CreateGoal({super.key});

  @override
  State<CreateGoal> createState() => _CreateGoalState();
}

class _CreateGoalState extends State<CreateGoal> {
  Set<String> selectedOptions = {};

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // Header with back button and progress bar
            Padding(
              padding: const EdgeInsets.only(top: 16, left: 12, right: 16),
              child: Row(
                children: [
                  GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                    },
                    child: const Icon(Icons.arrow_back, color: Colors.black),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: 0.5,
                        minHeight: 6,
                        backgroundColor: Colors.grey[300],
                        valueColor: const AlwaysStoppedAnimation<Color>(
                          Color(0xFF4CAF50),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Food emojis
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _FoodEmoji('🥕'),
                _FoodEmoji('🍎'),
                _FoodEmoji('🥖'),
                _FoodEmoji('🥣'),
                _FoodEmoji('🥦'),
              ],
            ),
            const SizedBox(height: 32),
            // Main content
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    // Title
                    const Text(
                      'Mục tiêu của bạn là gì?',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 12),
                    // Subtitle
                    Text(
                      '80 triệu người dùng trên toàn thế giới đã chọn chúng tôi để đạt được mục tiêu sức khỏe của họ. Bạn đã sẵn sàng để khám phá những điều tuyệt vời chưa?',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 32),
                    // Features list
                    Expanded(
                      child: ListView(
                        children: [
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                if (selectedOptions.contains('Giảm cân nhanh chóng')) {
                                  selectedOptions.remove('Giảm cân nhanh chóng');
                                } else {
                                  selectedOptions.add('Giảm cân nhanh chóng');
                                }
                              });
                            },
                            child: _FeatureItem(
                              icon: Icons.scale,
                              title: 'Giảm cân nhanh chóng',
                              backgroundColor: Colors.blue.shade50,
                              iconColor: Colors.blue,
                              isSelected: selectedOptions.contains('Giảm cân nhanh chóng'),
                            ),
                          ),
                          const SizedBox(height: 16),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                if (selectedOptions.contains('Ăn uống lành mạnh hơn')) {
                                  selectedOptions.remove('Ăn uống lành mạnh hơn');
                                } else {
                                  selectedOptions.add('Ăn uống lành mạnh hơn');
                                }
                              });
                            },
                            child: _FeatureItem(
                              icon: Icons.restaurant,
                              title: 'Ăn uống lành mạnh hơn',
                              backgroundColor: Colors.green.shade50,
                              iconColor: Colors.green,
                              isSelected: selectedOptions.contains('Ăn uống lành mạnh hơn'),
                            ),
                          ),
                          const SizedBox(height: 16),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                if (selectedOptions.contains('Tăng cường sức bền')) {
                                  selectedOptions.remove('Tăng cường sức bền');
                                } else {
                                  selectedOptions.add('Tăng cường sức bền');
                                }
                              });
                            },
                            child: _FeatureItem(
                              icon: Icons.schedule,
                              title: 'Tăng cường sức bền',
                              backgroundColor: Colors.orange.shade50,
                              iconColor: Colors.orange,
                              isSelected: selectedOptions.contains('Tăng cường sức bền'),
                            ),
                          ),
                          const SizedBox(height: 16),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                if (selectedOptions.contains('Cardio và cải thiện tim mạch')) {
                                  selectedOptions.remove('Cardio và cải thiện tim mạch');
                                } else {
                                  selectedOptions.add('Cardio và cải thiện tim mạch');
                                }
                              });
                            },
                            child: _FeatureItem(
                              icon: Icons.favorite,
                              title: 'Cardio và cải thiện tim mạch',
                              backgroundColor: Colors.red.shade50,
                              iconColor: Colors.red,
                              isSelected: selectedOptions.contains('Cardio và cải thiện tim mạch'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Forward button
            Padding(
              padding: const EdgeInsets.all(24),
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const CreateGoals(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.grey[800],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text(
                    'Tiếp theo',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FoodEmoji extends StatelessWidget {
  final String emoji;

  const _FoodEmoji(this.emoji);

  @override
  Widget build(BuildContext context) {
    return Text(
      emoji,
      style: const TextStyle(fontSize: 40),
    );
  }
}

class _FeatureItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color backgroundColor;
  final Color iconColor;
  final bool isSelected;

  const _FeatureItem({
    required this.icon,
    required this.title,
    required this.backgroundColor,
    required this.iconColor,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: backgroundColor,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            icon,
            color: iconColor,
            size: 24,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              color: Colors.black87,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        const SizedBox(width: 12),
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            border: Border.all(
              color: isSelected ? Colors.green : Colors.grey[300]!,
              width: 2,
            ),
            borderRadius: BorderRadius.circular(4),
            color: isSelected ? Colors.green : Colors.transparent,
          ),
          child: isSelected
              ? const Icon(
                  Icons.check,
                  color: Colors.white,
                  size: 16,
                )
              : null,
        ),
      ],
    );
  }
}
