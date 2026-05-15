import 'package:flutter/material.dart';
import 'dart:math';
import 'fifth_screen.dart';

class FourthScreen extends StatefulWidget {
  const FourthScreen({super.key});

  @override
  State<FourthScreen> createState() => _FourthScreenState();
}

class _FourthScreenState extends State<FourthScreen> {
  // Dữ liệu cho biểu đồ pie
  late List<PieSlice> slices;
  int totalCalories = 2500; // Tổng calories khuyến cáo trong một ngày

  @override
  void initState() {
    super.initState();
    _initializeSlices();
  }

  void _initializeSlices() {
    slices = [
      PieSlice(
        label: 'Protein',
        percentage: 17.5,
        color: const Color(0xFF2563EB), // Blue
      ),
      PieSlice(
        label: 'Carbs',
        percentage: 6.2,
        color: const Color(0xFFEF4444), // Red
      ),
      PieSlice(
        label: 'Fats',
        percentage: 5.0,
        color: const Color(0xFFFCD34D), // Yellow
      ),
      PieSlice(
        label: 'Vitamins & Minerals',
        percentage: 0.3,
        color: const Color(0xFF10B981), // Green
      ),
      PieSlice(
        label: 'Fiber',
        percentage: 31.8,
        color: const Color(0xFF14B8A6), // Teal
      ),
      PieSlice(
        label: 'Water',
        percentage: 43.2,
        color: const Color(0xFFFF9500), // Orange
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
                      builder: (context) => const FifthScreen(),
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
            '$totalCalories',
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
