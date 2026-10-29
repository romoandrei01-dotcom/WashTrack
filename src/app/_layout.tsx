
import { Stack } from "expo-router";
import { WashTrackProvider } from "../context/WashTrackContext";

export default function RootLayout() {
  return (
    <WashTrackProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="create-order" />
        <Stack.Screen name="payment" />
        <Stack.Screen name="receipt" />
        <Stack.Screen name="track" />
      </Stack>
    </WashTrackProvider>
  );
}
