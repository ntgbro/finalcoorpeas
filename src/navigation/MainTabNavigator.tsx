import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import HomeScreen from '../features/home/HomeScreen';
import ProductGrid from '../features/home/components/ProductGrid';
import type { ServiceKey } from '../types';
import ServiceTabs from '../features/home/components/ServiceTabs';

type TabKey = 'Home' | 'Cart' | 'Orders' | 'Settings';

export default function MainTabNavigator() {
  const [active, setActive] = useState<TabKey>('Home');
  const [service, setService] = useState<ServiceKey>('FRESH_SERVE');
  const [vegOnly, setVegOnly] = useState<boolean>(true);
  const [query, setQuery] = useState<string | undefined>(undefined);

  function renderContent() {
    switch (active) {
      case 'Home':
        return (
          <View style={{ flex: 1 }}>
            <ServiceTabs selected={service} onSelect={setService} />
            <ProductGrid service={service} vegOnly={vegOnly} search={query} />
          </View>
        );
      case 'Cart':
        return <View style={styles.placeholder} />;
      case 'Orders':
        return <View style={styles.placeholder} />;
      case 'Settings':
        return <View style={styles.placeholder} />;
      default:
        return null;
    }
  }

  return (
    <View style={styles.container}>
      <Header
        onSearch={(t) => setQuery(t || undefined)}
        onVegToggle={(v) => setVegOnly(v)}
      />
      <View style={styles.content}>{renderContent()}</View>
      <BottomNavBar active={active} onPress={setActive} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  placeholder: { flex: 1 },
});

