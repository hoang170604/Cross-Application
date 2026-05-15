import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class LoginEvent extends AuthEvent {
  final String email;
  final String password;

  const LoginEvent({
    required this.email,
    required this.password,
  });

  @override
  List<Object?> get props => [email, password];
}

class RegisterEvent extends AuthEvent {
  final String email;
  final String password;
  final String username;

  const RegisterEvent({
    required this.email,
    required this.password,
    required this.username,
  });

  @override
  List<Object?> get props => [email, password, username];
}

class LogoutEvent extends AuthEvent {
  const LogoutEvent();
}

class CheckAuthStatusEvent extends AuthEvent {
  const CheckAuthStatusEvent();
}

class ForgotPasswordEvent extends AuthEvent {
  final String email;

  const ForgotPasswordEvent({required this.email});

  @override
  List<Object?> get props => [email];
}

class VerifyEmailEvent extends AuthEvent {
  final String token;

  const VerifyEmailEvent({required this.token});

  @override
  List<Object?> get props => [token];
}

class ResetPasswordEvent extends AuthEvent {
  final String token;
  final String newPassword;

  const ResetPasswordEvent({
    required this.token,
    required this.newPassword,
  });

  @override
  List<Object?> get props => [token, newPassword];
}

class GoogleLoginEvent extends AuthEvent {
  const GoogleLoginEvent();
}

class FacebookLoginEvent extends AuthEvent {
  const FacebookLoginEvent();
}

class AppleLoginEvent extends AuthEvent {
  const AppleLoginEvent();
}
