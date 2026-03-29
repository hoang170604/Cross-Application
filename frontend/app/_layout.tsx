import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { UserProfileProvider } from '../context/UserProfileContext';

export default function RootLayout() {
  return (
    <UserProfileProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="PrimaryGoal" />
        <Stack.Screen name="DietMode" />
        <Stack.Screen name="BiologicalStats" />
        <Stack.Screen name="AhaMoment" />
        <Stack.Screen name="PlanResult" />
        <Stack.Screen name="Authwall" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="SearchScan" />
        <Stack.Screen name="FoodDetail" />
      </Stack>
      <StatusBar style="dark" />
    </UserProfileProvider>
  );
}
