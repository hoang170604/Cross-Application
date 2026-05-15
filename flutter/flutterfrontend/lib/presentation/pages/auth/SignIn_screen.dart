import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutterfrontend/presentation/bloc/auth/auth_bloc.dart';
import 'package:flutterfrontend/presentation/bloc/auth/auth_event.dart';
import 'package:flutterfrontend/presentation/bloc/auth/auth_state.dart';
import 'SignUp_screen.dart';
import 'ForgotPassword_screen.dart';
import '../diary/first_screen.dart';

class SignIn extends StatefulWidget {
  const SignIn({super.key});

  @override
  State<SignIn> createState() => _SignInState();
}

class _SignInState extends State<SignIn> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isPasswordVisible = false;

  bool get _isFormValid {
    return _emailController.text.isNotEmpty &&
        _passwordController.text.isNotEmpty &&
        _emailController.text.contains('@');
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_isFormValid) {
      // Trigger LoginEvent in AuthBloc
      context.read<AuthBloc>().add(
        LoginEvent(
          email: _emailController.text,
          password: _passwordController.text,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state is AuthSuccess) {
          // Login successful - navigate to home
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Login successful!')),
          );
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => const FirstScreen()),
          );
        } else if (state is AuthFailure) {
          // Login failed - show error
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(state.message),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFF0F1419),
        body: SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return SingleChildScrollView(
                child: ConstrainedBox(
                  constraints: BoxConstraints(
                    minHeight: constraints.maxHeight,
                  ),
                  child: IntrinsicHeight(
                    child: Column(
                      children: [
                        // --- Header ---
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 48),
                          child: Column(
                            children: [
                              const Text(
                                'Log In',
                                style: TextStyle(
                                  fontSize: 42,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Text(
                                    'Don\'t have an account? ',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.grey,
                                    ),
                                  ),
                                  GestureDetector(
                                    onTap: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) => const SignUp(),
                                        ),
                                      );
                                    },
                                    child: const Text(
                                      'Sign Up',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Color(0xFF4DA6FF),
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),

                        // --- Main Content Area ---
                        Padding(
                          padding: const EdgeInsets.only(bottom: 40),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              // Left side - Sign in form
                              Expanded(
                                flex: 1,
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 40),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      const Text(
                                        'Email',
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
                                        decoration: _buildInputDecoration('xxxxxx@gmail.com'),
                                        onChanged: (_) => setState(() {}),
                                      ),
                                      const SizedBox(height: 24),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          const Text(
                                            'Password',
                                            style: TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.w500,
                                              color: Colors.white70,
                                            ),
                                          ),
                                          GestureDetector(
                                            onTap: () => setState(() => _isPasswordVisible = !_isPasswordVisible),
                                            child: Icon(
                                              _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                                              color: Colors.grey,
                                              size: 18,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      TextField(
                                        controller: _passwordController,
                                        style: const TextStyle(color: Colors.white),
                                        obscureText: !_isPasswordVisible,
                                        decoration: _buildInputDecoration('xxxxxxxx'),
                                        onChanged: (_) => setState(() {}),
                                      ),
                                      const SizedBox(height: 12),
                                      Align(
                                        alignment: Alignment.centerRight,
                                        child: GestureDetector(
                                          onTap: () {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder: (context) => const ForgotPassword(),
                                              ),
                                            );
                                          },
                                          child: const Text(
                                            'Quên mật khẩu?',
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: Color(0xFF4DA6FF),
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      _buildLoginButton(),
                                    ],
                                  ),
                                ),
                              ),

                              // Divider & "or"
                              Container(
                                height: 180,
                                width: 1,
                                color: const Color(0xFF2a3f5f),
                              ),
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 16),
                                child: Text(
                                  'or',
                                  style: TextStyle(color: Colors.grey[600], fontSize: 13),
                                ),
                              ),

                              // Right side - Social login buttons
                              Expanded(
                                flex: 1,
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(horizontal: 40),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      _buildSocialButton('Continue with Google', const Color(0xFF2563EB), Colors.white),
                                      const SizedBox(height: 12),
                                      _buildSocialButton('Continue with Facebook', const Color(0xFF4338ca), Colors.white),
                                      const SizedBox(height: 12),
                                      _buildSocialButton('Continue with Apple', Colors.white, const Color(0xFF0F1419)),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const Spacer(),

                        // --- Footer ---
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 24),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              _buildFooterLink('Terms of Use'),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 12),
                                child: Text('•', style: TextStyle(color: Colors.grey, fontSize: 11)),
                              ),
                              _buildFooterLink('Privacy Policy'),
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
      ),
    );
  }

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

  Widget _buildLoginButton() {
    return BlocBuilder<AuthBloc, AuthState>(
      builder: (context, state) {
        final isLoading = state is AuthLoading;
        return SizedBox(
          width: 120,
          height: 44,
          child: ElevatedButton(
            onPressed: (_isFormValid && !isLoading) ? _handleLogin : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF2563EB),
              disabledBackgroundColor: const Color(0xFF1e40af).withOpacity(0.5),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                  )
                : const Text('Log in', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
          ),
        );
      },
    );
  }

  Widget _buildSocialButton(String text, Color bgColor, Color textColor) {
    return SizedBox(
      width: double.infinity,
      height: 44,
      child: ElevatedButton(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Social login coming soon...')),
          );
        },
        style: ElevatedButton.styleFrom(
          backgroundColor: bgColor,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          elevation: 0,
        ),
        child: Text(text, style: TextStyle(color: textColor, fontSize: 14, fontWeight: FontWeight.w600)),
      ),
    );
  }

  Widget _buildFooterLink(String text) {
    return GestureDetector(
      onTap: () {},
      child: Text(
        text,
        style: const TextStyle(fontSize: 11, color: Color(0xFF4DA6FF)),
      ),
    );
  }
}