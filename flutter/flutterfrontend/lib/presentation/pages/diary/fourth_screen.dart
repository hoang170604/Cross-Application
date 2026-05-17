import 'package:flutter/material.dart';
import 'dart:math';
import 'fifth_screen.dart';
import '../home/user_setup_data.dart';

class FourthScreen extends StatefulWidget {
  final UserSetupData setupData;
  
  const FourthScreen({super.key, required this.setupData});

  @override
  State<FourthScreen> createState() => _FourthScreenState();
}

class _FourthScreenState extends State<FourthScreen> {
  // Dữ liệu cho biểu đồ pie
  late List<PieSlice> slices;
  late double totalCalories;
  late double proteinGrams;
  late double carbsGrams;
  late double fatsGrams;

  @override
  void initState() {
    super.initState();
    _initializeNutritionData();
  }

  void _initializeNutritionData() {
    // Lấy dữ liệu từ setupData
    final nutrition = widget.setupData.nutritionGoal;
    
    if (nutrition != null) {
      totalCalories = nutrition.targetCalories ?? 2500;
      proteinGrams = nutrition.targetProtein ?? 0;
      carbsGrams = nutrition.targetCarb ?? 0;
      fatsGrams = nutrition.targetFat ?? 0;
    } else {
      // Fallback values
      totalCalories = 2500;
      proteinGrams = 100;
      carbsGrams = 281;
      fatsGrams = 56;
    }
    
    _initializeSlices();
  }

  void _initializeSlices() {
    // Tính calories từ mỗi macro
    double proteinCalories = proteinGrams * 4;
    double carbsCalories = carbsGrams * 4;
    double fatsCalories = fatsGrams * 9;
    double totalMacroCalories = proteinCalories + carbsCalories + fatsCalories;
    
    // Tính percentage
    double proteinPercent = totalMacroCalories > 0 ? (proteinCalories / totalMacroCalories) * 100 : 0;
    double carbsPercent = totalMacroCalories > 0 ? (carbsCalories / totalMacroCalories) * 100 : 0;
    double fatsPercent = totalMacroCalories > 0 ? (fatsCalories / totalMacroCalories) * 100 : 0;
    
    // Điều chỉnh để phù hợp (vì có thể lỗi làm tròn)
    double otherPercent = 100 - (proteinPercent + carbsPercent + fatsPercent);
    if (otherPercent < 0) otherPercent = 0;
    
    slices = [
      PieSlice(
        label: 'Protein',
        percentage: proteinPercent,
        color: const Color(0xFF2563EB), // Blue
      ),
      PieSlice(
        label: 'Carbs',
        percentage: carbsPercent,
        color: const Color(0xFFEF4444), // Red
      ),
      PieSlice(
        label: 'Fats',
        percentage: fatsPercent,
        color: const Color(0xFFFCD34D), // Yellow
      ),
      if (otherPercent > 0)
        PieSlice(
          label: 'Other',
          percentage: otherPercent,
          color: const Color(0xFF10B981), // Green
        ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 24),
            child: Column(
              children: [
                const Text(
                  'Lượng dinh dưỡng khuyến cáo',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                    height: 1.3,
                  ),
                ),
              ],
            ),
          ),

          // Pie Chart
          Expanded(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
                child: Column(
                  children: [
                    // Personal Info Section
                    _buildPersonalInfoSection(),
                    const SizedBox(height: 30),
                    // Pie chart with legend
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        CustomPaint(
                          size: const Size(300, 300),
                          painter: PieChartPainter(slices: slices),
                        ),
                      ],
                    ),
                    const SizedBox(height: 40),
                    // Calories Display
                    _buildCaloriesDisplay(),
                    const SizedBox(height: 30),
                    // Legend
                    _buildLegend(),
                  ],
                ),
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
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => FifthScreen(setupData: widget.setupData),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 26, 197, 63),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  elevation: 0,
                ),
                child: const Text(
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

  Widget _buildPersonalInfoSection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        border: Border.all(color: Colors.grey[300]!, width: 1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Thông tin cá nhân',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Column(
                children: [
                  Text(
                    'Tuổi',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${widget.setupData.calculatedAge ?? 0}',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Text(
                    'BMI',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${(widget.setupData.bmi ?? 0).toStringAsFixed(1)}',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Text(
                    'Giới tính',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    widget.setupData.isMale == true ? '♂ Nam' : '♀ Nữ',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Column(
                children: [
                  Text(
                    'Chiều cao',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${widget.setupData.height?.toStringAsFixed(0) ?? '0'} ${widget.setupData.isCentimeters == true ? 'cm' : 'ft'}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Text(
                    'Cân nặng',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${widget.setupData.weight?.toStringAsFixed(0) ?? '0'} ${widget.setupData.isKilograms == true ? 'kg' : 'lbs'}',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Text(
                    'Mục tiêu',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Flexible(
                    child: Text(
                      widget.setupData.selectedGoal ?? 'Không có',
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.center,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCaloriesDisplay() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        border: Border.all(color: Colors.blue[200]!, width: 2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Text(
            'Tổng Calories',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Colors.blue[700],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${totalCalories.toStringAsFixed(0)}',
            style: const TextStyle(
              fontSize: 44,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'kcal/ngày',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.grey[600],
            ),
          ),
          const SizedBox(height: 16),
          // Macro breakdown
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              Column(
                children: [
                  Text(
                    'Protein',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${proteinGrams.toStringAsFixed(0)}g',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF2563EB),
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Text(
                    'Carbs',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${carbsGrams.toStringAsFixed(0)}g',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFEF4444),
                    ),
                  ),
                ],
              ),
              Column(
                children: [
                  Text(
                    'Fats',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Colors.grey[600],
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${fatsGrams.toStringAsFixed(0)}g',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFFFCD34D),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLegend() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: slices.map((slice) {
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            children: [
              // Color box
              Container(
                width: 16,
                height: 16,
                decoration: BoxDecoration(
                  color: slice.color,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 12),
              // Label
              Expanded(
                child: Text(
                  slice.label,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                ),
              ),
              // Percentage
              Text(
                '${slice.percentage.toStringAsFixed(1)}%',
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.grey,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}

class PieSlice {
  final String label;
  double percentage;
  final Color color;

  PieSlice({
    required this.label,
    required this.percentage,
    required this.color,
  });
}

class PieChartPainter extends CustomPainter {
  final List<PieSlice> slices;

  PieChartPainter({required this.slices});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = min(size.width, size.height) / 2;
    final paint = Paint()..style = PaintingStyle.fill;

    double currentAngle = -pi / 2; // Start from top

    for (var slice in slices) {
      // Calculate the sweep angle based on percentage
      final sweepAngle = (slice.percentage / 100) * 2 * pi;

      // Set the color
      paint.color = slice.color;

      // Draw the arc
      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        currentAngle,
        sweepAngle,
        true,
        paint,
      );

      // Draw label and percentage on the slice
      _drawLabel(canvas, center, radius, currentAngle, sweepAngle, slice);

      currentAngle += sweepAngle;
    }
  }

  void _drawLabel(Canvas canvas, Offset center, double radius, double startAngle,
      double sweepAngle, PieSlice slice) {
    // Calculate the middle angle of the slice
    final middleAngle = startAngle + sweepAngle / 2;

    // Position for text (2/3 from center to edge)
    final textRadius = radius * 0.65;
    final textOffset = Offset(
      center.dx + textRadius * cos(middleAngle),
      center.dy + textRadius * sin(middleAngle),
    );

    // Draw percentage text
    final textPainter = TextPainter(
      text: TextSpan(
        text: '${slice.percentage.toStringAsFixed(1)}%',
        style: const TextStyle(
          color: Colors.white,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
      textDirection: TextDirection.ltr,
    );

    textPainter.layout();
    textPainter.paint(
      canvas,
      textOffset - Offset(textPainter.width / 2, textPainter.height / 2),
    );
  }

  @override
  bool shouldRepaint(PieChartPainter oldDelegate) => true;
}
