/**
 * app/_layout.tsx
 * Root layout — correct placement of setNotificationHandler
 *
 * Rule: setNotificationHandler() must be called at the TOP LEVEL of your
 * app's entry file, OUTSIDE any component, so it runs before any
 * notification can arrive. Putting it inside a service or useEffect
 * is too late — the handler won't be registered in time.
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from '../src/store';
import { NotificationService } from '../src/services/NotificationService';

SplashScreen.preventAutoHideAsync();

// ─── ✅ CORRECT PLACEMENT ─────────────────────────────────────────────────────
// Must be at module top level — outside the component, outside useEffect.
// This registers the handler synchronously when the module loads,
// guaranteeing it is ready before any notification fires.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert:  true,   // legacy field — keep for older SDK compat
    shouldShowBanner: true,   // required in expo-notifications ≥ 0.29
    shouldShowList:   true,   // required in expo-notifications ≥ 0.29
    shouldPlaySound:  true,
    shouldSetBadge:   false,
  }),
});
// ─────────────────────────────────────────────────────────────────────────────

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Outfit-Regular':          require('../assets/fonts/Outfit-Regular.ttf'),
    'Outfit-Medium':           require('../assets/fonts/Outfit-Medium.ttf'),
    'Outfit-SemiBold':         require('../assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Bold':             require('../assets/fonts/Outfit-Bold.ttf'),
    'NotoSerifTamil-Regular':  require('../assets/fonts/NotoSerifTamil-Regular.ttf'),
    'NotoSerifTamil-SemiBold': require('../assets/fonts/NotoSerifTamil-SemiBold.ttf'),
  });

  useEffect(() => {
    if (!fontsLoaded) return;

    SplashScreen.hideAsync();

    // Init runs AFTER the handler is already registered above —
    // this just requests permission and creates the Android channel.
    NotificationService.init();
  }, [fontsLoaded]);

  // Listen for notification taps (foreground + background)
  useEffect(() => {
    // Fired when a notification is received while app is in foreground
    const receivedSub = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification.request.content.title);
    });

    // Fired when user taps a notification
    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as any;
      console.log('Notification tapped, data:', data);
      // Navigate based on type:
      // if (data?.type === 'daily_panchangam') router.push('/');
      // if (data?.type === 'festival_reminder') router.push('/calendar');
    });

    return () => {
      receivedSub.remove();
      responseSub.remove();
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <StatusBar style="light" backgroundColor="#1C1410" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="premium"         options={{ presentation: 'modal' }} />
          <Stack.Screen name="day-detail"       options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="festival-detail"  options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="muhurtham-result" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="planner"          options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="reminders"        options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="family-profiles"  options={{ animation: 'slide_from_right' }} />
        </Stack>
      </Provider>
    </GestureHandlerRootView>
  );
}