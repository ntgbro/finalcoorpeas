import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './features/splash/SplashScreen';
import AppNavigator from './navigation/AppNavigator';
import { seedAll } from './firebase/seed';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowSplash(false), 4000);
    seedAll();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {showSplash ? <SplashScreen /> : <AppNavigator />}
    </SafeAreaProvider>
  );
}

export default App;
