import 'package:equatable/equatable.dart';
import 'package:flutterfrontend/domain/entities/index.dart';

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthSuccess extends AuthState {
  final UserEntity user;
  final String token;

  const AuthSuccess({
    required this.user,
    required this.token,
  });

  @override
  List<Object?> get props => [user, token];
}

class AuthFailure extends AuthState {
  final String message;
  final dynamic exception;

  const AuthFailure({
    required this.message,
    this.exception,
  });

  @override
  List<Object?> get props => [message, exception];
}

class AuthLoggedOut extends AuthState {
  const AuthLoggedOut();
}

class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated();
}

class PasswordResetSent extends AuthState {
  final String email;

  const PasswordResetSent({required this.email});

  @override
  List<Object?> get props => [email];
}

class PasswordResetSuccess extends AuthState {
  const PasswordResetSuccess();
}

class EmailVerificationSent extends AuthState {
  const EmailVerificationSent();
}

class EmailVerified extends AuthState {
  final UserEntity user;

  const EmailVerified({required this.user});

  @override
  List<Object?> get props => [user];
}

class AuthError extends AuthState {
  final String error;

  const AuthError({required this.error});

  @override
  List<Object?> get props => [error];
}
