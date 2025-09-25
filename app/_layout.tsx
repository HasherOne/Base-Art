
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { SpaceGrotesk_400Regular, SpaceGrotesk_500Medium, SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { setupErrorLogging } from '../utils/errorLogger';
import { WalletProvider } from '../contexts/WalletContext';

const STORAGE_KEY = 'natively-emulate-device';

export default function RootLayout() {
  const [isEmulating, setIsEmulating] = useState(false);
  const params = useGlobalSearchParams();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });

  useEffect(() => {
    const emulate = params.emulate === 'true';
    console.log('Emulation mode:', emulate);
    setIsEmulating(emulate);
  }, [params.emulate]);

  useEffect(() => {
    setupErrorLogging();
    console.log('App initialized with wallet support');
  }, []);

  const insets = useSafeAreaInsets();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <WalletProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                paddingTop: Platform.OS === 'ios' ? insets.top : 0,
              },
            }}
          />
        </GestureHandlerRootView>
      </WalletProvider>
    </SafeAreaProvider>
  );
}
