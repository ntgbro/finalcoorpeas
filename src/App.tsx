import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './features/splash/SplashScreen';
import AppNavigator from './navigation/AppNavigator';
import { seedAll } from './firebase/seed';

// A mock function to simulate async tasks like loading auth state, data, etc.
const initializeApp = async () => {
  // In a real app, you might check for an auth token, load settings, etc.
  // The seedAll() is for development and should be conditional or removed for production.
  if (__DEV__) {
    await seedAll();
  }
  // Simulate a minimum splash time for branding, but let it hide once ready.
  await new Promise(resolve => setTimeout(resolve, 2000));
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    initializeApp().then(() => setAppReady(true));
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isAppReady ? <AppNavigator /> : <SplashScreen />}
    </SafeAreaProvider>
  );
}

export default App;
