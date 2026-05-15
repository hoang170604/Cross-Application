import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'third_screen.dart';

class SecondScreen extends StatefulWidget {
  const SecondScreen({super.key});

  @override
  State<SecondScreen> createState() => _SecondScreenState();
}

class _SecondScreenState extends State<SecondScreen> {
  late FixedExtentScrollController _dayController;
  late FixedExtentScrollController _monthController;
  late FixedExtentScrollController _yearController;

  int _selectedDay = 4;
  int _selectedMonth = 3;
  int _selectedYear = 28; // 1995

  final List<String> months = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  @override
  void initState() {
    super.initState();
    _dayController = FixedExtentScrollController(initialItem: _selectedDay);
    _monthController = FixedExtentScrollController(initialItem: _selectedMonth);
    _yearController = FixedExtentScrollController(initialItem: _selectedYear);
  }

  @override
  void dispose() {
    _dayController.dispose();
    _monthController.dispose();
    _yearController.dispose();
    super.dispose();
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
            child: Column(
              children: [
                const Text(
                  'Bạn sinh ngày bao nhiêu?',
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

          // Date picker wheels
          Expanded(
            child: Container(
              color: Colors.grey[50],
              child: Row(
                children: [
                  // Day picker
                  Expanded(
                    child: CupertinoPicker(
                      scrollController: _dayController,
                      itemExtent: 60,
                      backgroundColor: Colors.grey[50],
                      onSelectedItemChanged: (index) {
                        setState(() => _selectedDay = index);
                      },
                      children: List.generate(
                        31,
                        (i) => Center(
                          child: Text(
                            '${i + 1}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                              color: Colors.black87,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Month picker
                  Expanded(
                    flex: 2,
                    child: CupertinoPicker(
                      scrollController: _monthController,
                      itemExtent: 60,
                      backgroundColor: Colors.grey[50],
                      onSelectedItemChanged: (index) {
                        setState(() => _selectedMonth = index);
                      },
                      children: months
                          .map(
                            (month) => Center(
                              child: Text(
                                month,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w500,
                                  color: Colors.black87,
                                ),
                              ),
                            ),
                          )
                          .toList(),
                    ),
                  ),

                  // Year picker
                  Expanded(
                    child: CupertinoPicker(
                      scrollController: _yearController,
                      itemExtent: 60,
                      backgroundColor: Colors.grey[50],
                      onSelectedItemChanged: (index) {
                        setState(() => _selectedYear = index);
                      },
                      children: List.generate(
                        100,
                        (i) => Center(
                          child: Text(
                            '${1923 + i}',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w500,
                              color: Colors.black87,
                            ),
                          ),
                        ),
                      ),
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
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ThirdScreen(),
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color.fromARGB(255, 26, 201, 64),
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
}
