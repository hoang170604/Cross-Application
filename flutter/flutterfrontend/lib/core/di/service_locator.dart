import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutterfrontend/core/network/dio_client.dart';
import 'package:flutterfrontend/core/services/token_service.dart';
import 'package:flutterfrontend/core/services/session_manager.dart';
import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/usecases/index.dart';
import 'package:flutterfrontend/presentation/bloc/auth/auth_bloc.dart';

final getIt = GetIt.instance;

Future<void> setupServiceLocator() async {
  try {
    print('🔧 Starting Service Locator setup...');
    
    // Secure Storage
    print('📦 Registering FlutterSecureStorage...');
    getIt.registerSingleton<FlutterSecureStorage>(
      const FlutterSecureStorage(),
    );

    // Shared Preferences
    print('📦 Registering SharedPreferences...');
    final sharedPreferences = await SharedPreferences.getInstance();
    getIt.registerSingleton<SharedPreferences>(sharedPreferences);

    // Services
    print('📦 Registering TokenService...');
    getIt.registerSingleton<TokenService>(
      TokenServiceImpl(secureStorage: getIt<FlutterSecureStorage>()),
    );

    print('📦 Registering SessionManager...');
    getIt.registerSingleton<SessionManager>(
      SessionManagerImpl(
        tokenService: getIt<TokenService>(),
        sharedPreferences: getIt<SharedPreferences>(),
      ),
    );

    // Network
    print('📦 Registering DioClient...');
    getIt.registerSingleton<DioClient>(DioClient());
    
    // Add auth interceptor to Dio after it's created
    getIt<DioClient>().addAuthInterceptor(getIt<TokenService>());

    // Datasources
    print('📦 Registering ActivityRemoteDatasource...');
    getIt.registerSingleton<ActivityRemoteDatasource>(
      ActivityRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    print('📦 Registering DiaryRemoteDatasource...');
    getIt.registerSingleton<DiaryRemoteDatasource>(
      DiaryRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    print('📦 Registering FastingRemoteDatasource...');
    getIt.registerSingleton<FastingRemoteDatasource>(
      FastingRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    print('📦 Registering FastingSessionRemoteDatasource...');
    getIt.registerSingleton<FastingSessionRemoteDatasource>(
      FastingSessionRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    print('📦 Registering FoodRemoteDatasource...');
    getIt.registerSingleton<FoodRemoteDatasource>(
      FoodRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    print('📦 Registering ProgressRemoteDatasource...');
    getIt.registerSingleton<ProgressRemoteDatasource>(
      ProgressRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    print('📦 Registering UserRemoteDatasource...');
    getIt.registerSingleton<UserRemoteDatasource>(
      UserRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    print('📦 Registering WaterRemoteDatasource...');
    getIt.registerSingleton<WaterRemoteDatasource>(
      WaterRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    print('📦 Registering WorkoutChallengeRemoteDatasource...');
    getIt.registerSingleton<WorkoutChallengeRemoteDatasource>(
      WorkoutChallengeRemoteDatasourceImpl(dio: getIt<DioClient>().client),
    );

    // Usecases
    print('📦 Registering ActivityUsecase...');
    getIt.registerSingleton<ActivityUsecase>(
      ActivityUsecaseImpl(remoteDatasource: getIt<ActivityRemoteDatasource>()),
    );

    print('📦 Registering DailyNutritionUsecase...');
    getIt.registerSingleton<DailyNutritionUsecase>(
      DailyNutritionUsecaseImpl(remoteDatasource: getIt<DiaryRemoteDatasource>()),
    );

    print('📦 Registering DiaryUsecase...');
    getIt.registerSingleton<DiaryUsecase>(
      DiaryUsecaseImpl(remoteDatasource: getIt<DiaryRemoteDatasource>()),
    );

    print('📦 Registering FastingSessionUsecase...');
    getIt.registerSingleton<FastingSessionUsecase>(
      FastingSessionUsecaseImpl(remoteDatasource: getIt<FastingSessionRemoteDatasource>()),
    );

    print('📦 Registering FastingStateUsecase...');
    getIt.registerSingleton<FastingStateUsecase>(
      FastingStateUsecaseImpl(remoteDatasource: getIt<FastingRemoteDatasource>()),
    );

    print('📦 Registering FoodUsecase...');
    getIt.registerSingleton<FoodUsecase>(
      FoodUsecaseImpl(remoteDatasource: getIt<FoodRemoteDatasource>()),
    );

    print('📦 Registering ProgressUsecase...');
    getIt.registerSingleton<ProgressUsecase>(
      ProgressUsecaseImpl(remoteDatasource: getIt<ProgressRemoteDatasource>()),
    );

    print('📦 Registering UserUsecase...');
    getIt.registerSingleton<UserUsecase>(
      UserUsecaseImpl(remoteDatasource: getIt<UserRemoteDatasource>()),
    );

    print('📦 Registering WaterUsecase...');
    getIt.registerSingleton<WaterUsecase>(
      WaterUsecaseImpl(remoteDatasource: getIt<WaterRemoteDatasource>()),
    );

    print('📦 Registering WorkoutChallengeUsecase...');
    getIt.registerSingleton<WorkoutChallengeUsecase>(
      WorkoutChallengeUsecaseImpl(remoteDatasource: getIt<WorkoutChallengeRemoteDatasource>()),
    );

    // BLoCs
    print('📦 Registering AuthBloc...');
    getIt.registerSingleton<AuthBloc>(
      AuthBloc(
        userUsecase: getIt<UserUsecase>(),
        tokenService: getIt<TokenService>(),
      ),
    );
    
    print('✅ Service Locator setup completed successfully!');
  } catch (e, stackTrace) {
    print('❌ Error during Service Locator setup: $e');
    print('Stack trace: $stackTrace');
    rethrow;
  }
}
