import 'package:flutter/material.dart';
import 'SignIn_screen.dart';

class ForgotPassword extends StatefulWidget {
  const ForgotPassword({super.key});

  @override
  State<ForgotPassword> createState() => _ForgotPasswordState();
}

class _ForgotPasswordState extends State<ForgotPassword> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _codeController = TextEditingController();
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  int _currentStep = 1; // 1: Email, 2: Code, 3: New Password
  bool _isLoading = false;
  bool _isNewPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;

  // Password validation flags
  late bool _hasMinLength;
  late bool _hasUppercase;
  late bool _hasLowercase;
  late bool _hasNumber;
  late bool _hasSpecialChar;

  @override
  void initState() {
    super.initState();
    _resetPasswordValidation();
  }

  void _resetPasswordValidation() {
    _hasMinLength = false;
    _hasUppercase = false;
    _hasLowercase = false;
    _hasNumber = false;
    _hasSpecialChar = false;
  }

  void _updatePasswordValidation(String password) {
    setState(() {
      _hasMinLength = password.length >= 8;
      _hasUppercase = password.contains(RegExp(r'[A-Z]'));
      _hasLowercase = password.contains(RegExp(r'[a-z]'));
      _hasNumber = password.contains(RegExp(r'[0-9]'));
      _hasSpecialChar = RegExp(r'[!@#$%^&*()_+=\-\[\]{};:,.<>?/\\|`~]').hasMatch(password);
    });
  }

  bool get _isEmailValid {
    return _emailController.text.isNotEmpty && _emailController.text.contains('@');
  }

  bool get _isCodeValid {
    return _codeController.text.isNotEmpty && _codeController.text.length >= 4;
  }

  bool get _isPasswordValid {
    return _hasMinLength &&
        _hasUppercase &&
        _hasLowercase &&
        _hasNumber &&
        _hasSpecialChar &&
        _newPasswordController.text == _confirmPasswordController.text &&
        _newPasswordController.text.isNotEmpty;
  }

  @override
  void dispose() {
    _emailController.dispose();
    _codeController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _handleNext() async {
    setState(() => _isLoading = true);
    await Future.delayed(const Duration(seconds: 1));

    if (mounted) {
      setState(() => _isLoading = false);

      if (_currentStep == 1 && _isEmailValid) {
        setState(() => _currentStep = 2);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Verification code sent to your email')),
        );
      } else if (_currentStep == 2 && _isCodeValid) {
        setState(() => _currentStep = 3);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Code verified successfully')),
        );
      } else if (_currentStep == 3 && _isPasswordValid) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Password reset successful')),
        );
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const SignIn()),
        );
      }
    }
  }

  void _handleBack() {
    if (_currentStep > 1) {
      setState(() => _currentStep--);
    } else {
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F1419),
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight),
                child: IntrinsicHeight(
                  child: Column(
                    children: [
                      // --- Header with Back Button ---
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 24),
                        child: Row(
                          children: [
                            GestureDetector(
                              onTap: _handleBack,
                              child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                            ),
                            const SizedBox(width: 16),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Reset Password',
                                  style: TextStyle(
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  'Step $_currentStep of 3',
                                  style: const TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),

                      // --- Progress Bar ---
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: _currentStep / 3,
                            minHeight: 4,
                            backgroundColor: const Color(0xFF2a3f5f),
                            valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF4DA6FF)),
                          ),
                        ),
                      ),

                      // --- Content Area ---
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 40),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              if (_currentStep == 1) ...[
                                _buildStep1Content(),
                              ] else if (_currentStep == 2) ...[
                                _buildStep2Content(),
                              ] else if (_currentStep == 3) ...[
                                _buildStep3Content(),
                              ],
                            ],
                          ),
                        ),
                      ),

                      // --- Footer Buttons ---
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 32),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            SizedBox(
                              height: 48,
                              child: ElevatedButton(
                                onPressed: (_currentStep == 1 && !_isEmailValid) ||
                                        (_currentStep == 2 && !_isCodeValid) ||
                                        (_currentStep == 3 && !_isPasswordValid) ||
                                        _isLoading
                                    ? null
                                    : _handleNext,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF2563EB),
                                  disabledBackgroundColor: const Color(0xFF1e40af).withOpacity(0.5),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                ),
                                child: _isLoading
                                    ? const SizedBox(
                                        width: 20,
                                        height: 20,
                                        child: CircularProgressIndicator(
                                          color: Colors.white,
                                          strokeWidth: 2,
                                        ),
                                      )
                                    : Text(
                                        _currentStep == 3 ? 'Reset Password' : 'Continue',
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 16,
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            Center(
                              child: GestureDetector(
                                onTap: () => Navigator.of(context).pushReplacement(
                                  MaterialPageRoute(builder: (context) => const SignIn()),
                                ),
                                child: const Text(
                                  'Back to Sign In',
                                  style: TextStyle(
                                    fontSize: 14,
                                    color: Color(0xFF4DA6FF),
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // --- Step 1: Email Verification ---
  Widget _buildStep1Content() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Enter your email address',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'We\'ll send you a verification code to reset your password',
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 32),
        const Text(
          'Email Address',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Colors.white70,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _emailController,
          style: const TextStyle(color: Colors.white),
          decoration: _buildInputDecoration('your.email@gmail.com'),
          onChanged: (_) => setState(() {}),
        ),
      ],
    );
  }

  // --- Step 2: Code Verification ---
  Widget _buildStep2Content() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Enter verification code',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'We\'ve sent a 6-digit code to your email. Please check your inbox and enter it below.',
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 32),
        const Text(
          'Verification Code',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Colors.white70,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _codeController,
          style: const TextStyle(color: Colors.white),
          decoration: _buildInputDecoration('000000'),
          keyboardType: TextInputType.number,
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 24),
        Row(
          children: [
            const Text(
              'Didn\'t receive code? ',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
            GestureDetector(
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Code resent to your email')),
                );
              },
              child: const Text(
                'Resend',
                style: TextStyle(
                  fontSize: 12,
                  color: Color(0xFF4DA6FF),
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  // --- Step 3: New Password ---
  Widget _buildStep3Content() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Create new password',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Please enter a strong password to protect your account',
          style: TextStyle(
            fontSize: 13,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 32),
        // New Password Field
        const Text(
          'New Password',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Colors.white70,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _newPasswordController,
          style: const TextStyle(color: Colors.white),
          obscureText: !_isNewPasswordVisible,
          decoration: InputDecoration(
            hintText: 'Enter new password',
            hintStyle: const TextStyle(color: Color(0xFF666666)),
            suffixIcon: GestureDetector(
              onTap: () => setState(() => _isNewPasswordVisible = !_isNewPasswordVisible),
              child: Icon(
                _isNewPasswordVisible ? Icons.visibility : Icons.visibility_off,
                color: Colors.grey,
                size: 18,
              ),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Color(0xFF2a3f5f)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Color(0xFF4DA6FF)),
            ),
          ),
          onChanged: (value) {
            _updatePasswordValidation(value);
            setState(() {});
          },
        ),
        const SizedBox(height: 16),

        // Password Requirements
        _buildPasswordRequirement('At least 8 characters', _hasMinLength),
        const SizedBox(height: 8),
        _buildPasswordRequirement('One uppercase letter', _hasUppercase),
        const SizedBox(height: 8),
        _buildPasswordRequirement('One lowercase letter', _hasLowercase),
        const SizedBox(height: 8),
        _buildPasswordRequirement('One number', _hasNumber),
        const SizedBox(height: 8),
        _buildPasswordRequirement('One special character', _hasSpecialChar),
        const SizedBox(height: 24),

        // Confirm Password Field
        const Text(
          'Confirm Password',
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: Colors.white70,
          ),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _confirmPasswordController,
          style: const TextStyle(color: Colors.white),
          obscureText: !_isConfirmPasswordVisible,
          decoration: InputDecoration(
            hintText: 'Confirm password',
            hintStyle: const TextStyle(color: Color(0xFF666666)),
            suffixIcon: GestureDetector(
              onTap: () => setState(() => _isConfirmPasswordVisible = !_isConfirmPasswordVisible),
              child: Icon(
                _isConfirmPasswordVisible ? Icons.visibility : Icons.visibility_off,
                color: Colors.grey,
                size: 18,
              ),
            ),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Color(0xFF2a3f5f)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: Color(0xFF4DA6FF)),
            ),
          ),
          onChanged: (_) => setState(() {}),
        ),
        if (_newPasswordController.text.isNotEmpty &&
            _confirmPasswordController.text.isNotEmpty &&
            _newPasswordController.text != _confirmPasswordController.text)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Row(
              children: [
                Icon(Icons.close_rounded, color: Colors.red.shade400, size: 16),
                const SizedBox(width: 8),
                Text(
                  'Passwords do not match',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.red.shade400,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  // --- Password Requirement Indicator ---
  Widget _buildPasswordRequirement(String text, bool isMet) {
    return Row(
      children: [
        Container(
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(
              color: isMet ? Colors.green : Colors.grey.shade700,
              width: 1.5,
            ),
          ),
          child: isMet
              ? const Icon(Icons.check, size: 14, color: Colors.green)
              : null,
        ),
        const SizedBox(width: 12),
        Text(
          text,
          style: TextStyle(
            fontSize: 12,
            color: isMet ? Colors.green : Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  // --- Input Decoration Builder ---
  InputDecoration _buildInputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Color(0xFF666666)),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Color(0xFF2a3f5f)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: Color(0xFF4DA6FF)),
      ),
    );
  }
}
