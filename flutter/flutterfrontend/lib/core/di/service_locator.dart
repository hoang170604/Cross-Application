import 'package:get_it/get_it.dart';
import 'package:flutterfrontend/core/network/dio_client.dart';
import 'package:flutterfrontend/data/datasources/index.dart';
import 'package:flutterfrontend/domain/usecases/index.dart';

final getIt = GetIt.instance;

void setupServiceLocator() {
  // Network
  getIt.registerSingleton<DioClient>(DioClient());

  // Datasources
  getIt.registerSingleton<ActivityRemoteDatasource>(
    ActivityRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  getIt.registerSingleton<DiaryRemoteDatasource>(
    DiaryRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  getIt.registerSingleton<FastingRemoteDatasource>(
    FastingRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  getIt.registerSingleton<FastingSessionRemoteDatasource>(
    FastingSessionRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  getIt.registerSingleton<FoodRemoteDatasource>(
    FoodRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  getIt.registerSingleton<ProgressRemoteDatasource>(
    ProgressRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  getIt.registerSingleton<UserRemoteDatasource>(
    UserRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  getIt.registerSingleton<WaterRemoteDatasource>(
    WaterRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  getIt.registerSingleton<WorkoutChallengeRemoteDatasource>(
    WorkoutChallengeRemoteDatasourceImpl(dio: getIt<DioClient>().client),
  );

  // Usecases
  getIt.registerSingleton<ActivityUsecase>(
    ActivityUsecaseImpl(remoteDatasource: getIt<ActivityRemoteDatasource>()),
  );

  getIt.registerSingleton<DailyNutritionUsecase>(
    DailyNutritionUsecaseImpl(remoteDatasource: getIt<DiaryRemoteDatasource>()),
  );

  getIt.registerSingleton<DiaryUsecase>(
    DiaryUsecaseImpl(remoteDatasource: getIt<DiaryRemoteDatasource>()),
  );

  getIt.registerSingleton<FastingSessionUsecase>(
    FastingSessionUsecaseImpl(remoteDatasource: getIt<FastingSessionRemoteDatasource>()),
  );

  getIt.registerSingleton<FastingStateUsecase>(
    FastingStateUsecaseImpl(remoteDatasource: getIt<FastingRemoteDatasource>()),
  );

  getIt.registerSingleton<FoodUsecase>(
    FoodUsecaseImpl(remoteDatasource: getIt<FoodRemoteDatasource>()),
  );

  getIt.registerSingleton<ProgressUsecase>(
    ProgressUsecaseImpl(remoteDatasource: getIt<ProgressRemoteDatasource>()),
  );

  getIt.registerSingleton<UserUsecase>(
    UserUsecaseImpl(remoteDatasource: getIt<UserRemoteDatasource>()),
  );

  getIt.registerSingleton<WaterUsecase>(
    WaterUsecaseImpl(remoteDatasource: getIt<WaterRemoteDatasource>()),
  );

  getIt.registerSingleton<WorkoutChallengeUsecase>(
    WorkoutChallengeUsecaseImpl(remoteDatasource: getIt<WorkoutChallengeRemoteDatasource>()),
  );
}
