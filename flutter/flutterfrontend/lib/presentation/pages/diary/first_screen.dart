import 'package:flutter/material.dart';
import 'second_screen.dart';
import '../home/user_setup_data.dart';

class FirstScreen extends StatelessWidget {
  const FirstScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Food icons section at the top
            Container(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildFoodIcon('🥕'), // Carrot
                  _buildFoodIcon('🍞'), // Bread
                  _buildFoodIcon('🍎'), // Apple
                  _buildFoodIcon('🥣'), // Bowl
                  _buildFoodIcon('🥦'), // Broccoli
                ],
              ),
            ),

            // Main content section
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  // Title
                  const Text(
                    'Chúc mừng bạn đã thiêt lập thành công tài khoản của mình!',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                      height: 1.3,
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Feature 1: Trophy
                  _buildFeatureItem(
                    icon: '🏆',
                    text:
                        'Việc đơn giản chỉ đếm lượng calo sẽ giúp bạn hình thành thói quen. Thói quen sẽ giúp bạn đạt được kết quả.',
                  ),

                  const SizedBox(height: 20),

                  // Feature 2: House/Family
                  _buildFeatureItem(
                    icon: '🏠',
                    text:
                        'Việc theo dõi lượng calo, lượng nước uống, hoạt động thể chất và lượng chất dinh dưỡng đa lượng giúp bạn duy trì lối sống lành mạnh.',
                  ),

                  const SizedBox(height: 20),

                  // Feature 3: Target
                  _buildFeatureItem(
                    icon: '🎯',
                    text:
                        'Để xác định chính xác hơn nhu cầu calo, chúng tôi muốn tìm hiểu thêm về bạn',
                  ),

                  const SizedBox(height: 40),
                ],
              ),
            ),

            // Button section at the bottom
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
              child: SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => SecondScreen(setupData: UserSetupData()),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF333333),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Hiểu rồi!',
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

  Widget _buildFoodIcon(String emoji) {
    return Container(
      width: 48,
      height: 48,
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(8),
      ),
      child: Center(
        child: Text(
          emoji,
          style: const TextStyle(fontSize: 32),
        ),
      ),
    );
  }

  Widget _buildFeatureItem({
    required String icon,
    required String text,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: Colors.grey[100],
            borderRadius: BorderRadius.circular(8),
          ),
          child: Center(
            child: Text(
              icon,
              style: const TextStyle(fontSize: 28),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text(
              text,
              style: const TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
                height: 1.5,
              ),
            ),
          ),
        ),
      ],
    );
  }
}
