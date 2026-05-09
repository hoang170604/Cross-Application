import 'package:flutter/material.dart';
import '../auth/SignUp_screen.dart';
import '../auth/SignIn_screen.dart';

class CreateGoals extends StatefulWidget {
  const CreateGoals({super.key});

  @override
  State<CreateGoals> createState() => _CreateGoalsState();
}

class _CreateGoalsState extends State<CreateGoals> {
  String? selectedOption;

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
                        value: 0.66,
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
                      'Hãy sẵn sàng để làm mới bản thân!',
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
                      'Sử dụng tài khoản khách để khám phá tất cả các tính năng của chúng tôi. Bạn có thể tạo tài khoản bất cứ lúc nào để lưu tiến trình của mình.',
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
                                selectedOption = selectedOption == 'Thiết lập tài khoản ngay bây giờ!'
                                    ? null
                                    : 'Thiết lập tài khoản ngay bây giờ!';
                              });
                            },
                            child: _FeatureItem(
                              icon: Icons.person,
                              title: 'Thiết lập tài khoản ngay bây giờ!',
                              backgroundColor: Colors.blue.shade50,
                              iconColor: Colors.blue,
                              isSelected: selectedOption == 'Thiết lập tài khoản ngay bây giờ!',
                            ),
                          ),
                          const SizedBox(height: 16),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                selectedOption = selectedOption == 'Tôi đã có tài khoản, đăng nhập ngay!'
                                    ? null
                                    : 'Tôi đã có tài khoản, đăng nhập ngay!';
                              });
                            },
                            child: _FeatureItem(
                              icon: Icons.settings,
                              title: 'Tôi đã có tài khoản, đăng nhập ngay!',
                              backgroundColor: Colors.grey.shade200,
                              iconColor: Colors.grey[700]!,
                              isSelected: selectedOption == 'Tôi đã có tài khoản, đăng nhập ngay!',
                            ),
                          ),
                          const SizedBox(height: 16),
                          GestureDetector(
                            onTap: () {
                              setState(() {
                                selectedOption = selectedOption == 'Thiết lập tài khoản Pro để có trải nghiệm cá nhân hóa hơn và truy cập vào các tính năng nâng cao.'
                                    ? null
                                    : 'Thiết lập tài khoản Pro để có trải nghiệm cá nhân hóa hơn và truy cập vào các tính năng nâng cao.';
                              });
                            },
                            child: _FeatureItem(
                              icon: Icons.emoji_people,
                              title: 'Thiết lập tài khoản Pro để có trải nghiệm cá nhân hóa hơn và truy cập vào các tính năng nâng cao.',
                              backgroundColor: Colors.yellow.shade100,
                              iconColor: Colors.orange,
                              isSelected: selectedOption == 'Thiết lập tài khoản Pro để có trải nghiệm cá nhân hóa hơn và truy cập vào các tính năng nâng cao.',
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
                  onPressed: selectedOption == null
                      ? null
                      : () {
                          if (selectedOption == 'Thiết lập tài khoản ngay bây giờ!') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const SignUp(),
                              ),
                            );
                          } else if (selectedOption == 'Tôi đã có tài khoản, đăng nhập ngay!') {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const SignIn(),
                              ),
                            );
                          } else {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const SignUp(),
                              ),
                            );
                          }
                        },
                  style: ElevatedButton.styleFrom(
                    backgroundColor:
                        selectedOption == null ? Colors.grey[400] : Colors.grey[800],
                    disabledBackgroundColor: Colors.grey[400],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: Text(
                    'Bắt đầu ngay!',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: selectedOption == null ? Colors.grey[600] : Colors.white,
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
              fontSize: 13,
              color: Colors.black87,
              fontWeight: FontWeight.w500,
              height: 1.4,
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
