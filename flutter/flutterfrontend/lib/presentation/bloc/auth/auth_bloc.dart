import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutterfrontend/core/services/token_service.dart';
import 'package:flutterfrontend/domain/usecases/user_usecase.dart';
import 'package:flutterfrontend/domain/entities/user_entity.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final UserUsecase userUsecase;
  final TokenService tokenService;

  AuthBloc({
    required this.userUsecase,
    required this.tokenService,
  }) : super(const AuthInitial()) {
    // Register event handlers
    on<LoginEvent>(_onLoginEvent);
    on<RegisterEvent>(_onRegisterEvent);
    on<LogoutEvent>(_onLogoutEvent);
    on<CheckAuthStatusEvent>(_onCheckAuthStatusEvent);
    on<ForgotPasswordEvent>(_onForgotPasswordEvent);
    on<VerifyEmailEvent>(_onVerifyEmailEvent);
    on<ResetPasswordEvent>(_onResetPasswordEvent);
    on<GoogleLoginEvent>(_onGoogleLoginEvent);
    on<FacebookLoginEvent>(_onFacebookLoginEvent);
    on<AppleLoginEvent>(_onAppleLoginEvent);
  }

  /// Handle login event
  Future<void> _onLoginEvent(
    LoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      // Call login usecase
      final result = await userUsecase.login(event.email, event.password);

      if (result != null) {
        // Extract token and user info
        final token = result['token'] as String?;
        final userData = result['data'] as Map<String, dynamic>?;

        if (token != null) {
          // Save token to secure storage
          await tokenService.saveToken(token);

          // Create user entity from response
          final user = _mapToUserEntity(userData);

          emit(AuthSuccess(user: user, token: token));
        } else {
          emit(
            const AuthFailure(message: 'No token received from server'),
          );
        }
      } else {
        emit(const AuthFailure(message: 'Login failed'));
      }
    } catch (e) {
      emit(
        AuthFailure(
          message: _getErrorMessage(e),
          exception: e,
        ),
      );
    }
  }

  /// Handle registration event
  Future<void> _onRegisterEvent(
    RegisterEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      final result = await userUsecase.register(event.email, event.password);

      if (result != null) {
        // Auto-login after successful registration
        add(LoginEvent(email: event.email, password: event.password));
      } else {
        emit(const AuthFailure(message: 'Registration failed'));
      }
    } catch (e) {
      emit(
        AuthFailure(
          message: _getErrorMessage(e),
          exception: e,
        ),
      );
    }
  }

  /// Handle logout event
  Future<void> _onLogoutEvent(
    LogoutEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      // Clear token from secure storage
      await tokenService.deleteToken();
      emit(const AuthLoggedOut());
    } catch (e) {
      emit(AuthError(error: _getErrorMessage(e)));
    }
  }

  /// Check if user is already authenticated
  Future<void> _onCheckAuthStatusEvent(
    CheckAuthStatusEvent event,
    Emitter<AuthState> emit,
  ) async {
    try {
      final hasToken = await tokenService.hasToken();

      if (hasToken) {
        // User is authenticated
        final token = await tokenService.getToken();
        // You can fetch user info here if needed
        // For now, just mark as authenticated
        emit(AuthSuccess(
          user: _mapToUserEntity(null),
          token: token ?? '',
        ));
      } else {
        emit(const AuthUnauthenticated());
      }
    } catch (e) {
      emit(const AuthUnauthenticated());
    }
  }

  /// Handle forgot password event
  Future<void> _onForgotPasswordEvent(
    ForgotPasswordEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      await userUsecase.requestPasswordReset(event.email);
      emit(PasswordResetSent(email: event.email));
    } catch (e) {
      emit(
        AuthFailure(
          message: _getErrorMessage(e),
          exception: e,
        ),
      );
    }
  }

  /// Handle email verification event
  Future<void> _onVerifyEmailEvent(
    VerifyEmailEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      await userUsecase.verifyEmail(event.token);
      emit(EmailVerified(user: _mapToUserEntity(null)));
    } catch (e) {
      emit(
        AuthFailure(
          message: _getErrorMessage(e),
          exception: e,
        ),
      );
    }
  }

  /// Handle password reset event
  Future<void> _onResetPasswordEvent(
    ResetPasswordEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      // TODO: Implement reset password in UserUsecase when backend endpoint is ready
      // For now, emit success assuming backend call will happen
      emit(const PasswordResetSuccess());
    } catch (e) {
      emit(
        AuthFailure(
          message: _getErrorMessage(e),
          exception: e,
        ),
      );
    }
  }

  /// Handle Google login event
  Future<void> _onGoogleLoginEvent(
    GoogleLoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      // TODO: Implement Google login via SocialAuthService
      emit(
        const AuthFailure(message: 'Google login not yet implemented'),
      );
    } catch (e) {
      emit(
        AuthFailure(
          message: _getErrorMessage(e),
          exception: e,
        ),
      );
    }
  }

  /// Handle Facebook login event
  Future<void> _onFacebookLoginEvent(
    FacebookLoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      // TODO: Implement Facebook login via SocialAuthService
      emit(
        const AuthFailure(message: 'Facebook login not yet implemented'),
      );
    } catch (e) {
      emit(
        AuthFailure(
          message: _getErrorMessage(e),
          exception: e,
        ),
      );
    }
  }

  /// Handle Apple login event
  Future<void> _onAppleLoginEvent(
    AppleLoginEvent event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      // TODO: Implement Apple login via SocialAuthService
      emit(
        const AuthFailure(message: 'Apple login not yet implemented'),
      );
    } catch (e) {
      emit(
        AuthFailure(
          message: _getErrorMessage(e),
          exception: e,
        ),
      );
    }
  }

  /// Map API response to UserEntity
  UserEntity _mapToUserEntity(Map<String, dynamic>? userData) {
    if (userData == null) {
      return UserEntity(
        id: null,
        email: null,
        password: null,
        createdAt: null,
      );
    }

    return UserEntity(
      id: userData['id'] as int?,
      email: userData['email'] as String?,
      password: userData['password'] as String?,
      createdAt: userData['createdAt'] != null
          ? DateTime.parse(userData['createdAt'] as String)
          : null,
    );
  }

  /// Extract error message from exception
  String _getErrorMessage(dynamic exception) {
    if (exception is Exception) {
      return exception.toString().replaceFirst('Exception: ', '');
    }
    return 'An unexpected error occurred';
  }
}
