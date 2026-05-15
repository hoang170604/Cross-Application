import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutterfrontend/core/di/service_locator.dart' show setupServiceLocator, getIt;
import 'package:flutterfrontend/presentation/bloc/auth/auth_bloc.dart';
import 'package:flutterfrontend/presentation/bloc/auth/auth_event.dart';
import 'presentation/pages/home/home_page_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set error handler
  FlutterError.onError = (FlutterErrorDetails details) {
    print('❌ Flutter Error: ${details.exception}');
    print('Stack trace: ${details.stack}');
  };

  // Initialize service locator (this is async due to SharedPreferences)
  try {
    await setupServiceLocator();
    print('✅ Service Locator initialized successfully');
  } catch (e, stackTrace) {
    print('❌ Error initializing Service Locator: $e');
    print('Stack trace: $stackTrace');
    rethrow;
  }
  
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();
    // Check auth status after widget is built
    WidgetsBinding.instance.addPostFrameCallback((_) {
      try {
        getIt<AuthBloc>().add(const CheckAuthStatusEvent());
        print('✅ Auth status check initiated');
      } catch (e, stackTrace) {
        print('❌ Error checking auth status: $e');
        print('Stack trace: $stackTrace');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider<AuthBloc>(
          create: (context) => getIt<AuthBloc>(),
        ),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        title: 'CrossApplication',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        ),
        home: const HomePage(),
      ),
    );
  }
}
