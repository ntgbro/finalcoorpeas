import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/layout/Header';
import BottomNavBar from '../components/layout/BottomNavBar';
import CategorySections from '../components/layout/CategorySections';
import ChefList from '../components/layout/ChefList';
import CartScreen from '../features/cart/CartScreen';
import { OrdersScreen } from '../features/orders';
import { AddressScreen } from '../features/address';
import type { ServiceKey } from '../types';
import ServiceTabs from '../components/layout/ServiceTabs';

type TabKey = 'Home' | 'Cart' | 'Orders' | 'Settings';

export default function MainTabNavigator() {
  const [active, setActive] = useState<TabKey>('Home');
  const [service, setService] = useState<ServiceKey>('FRESH_SERVE');
  const [vegMode, setVegMode] = useState<'VEG' | 'NON_VEG' | 'ALL'>('VEG');
  const [query, setQuery] = useState<string | undefined>(undefined);

  function renderContent() {
    switch (active) {
      case 'Home':
        return (
          <View style={{ flex: 1 }}>
            <ServiceTabs selected={service} onSelect={setService} />
            {service === 'LIVE_CHEF' ? (
              <ChefList />
            ) : (
              <CategorySections service={service} vegMode={vegMode} search={query} />
            )}
          </View>
        );
      case 'Cart':
        return <CartScreen />;
      case 'Orders':
        return <OrdersScreen />;
      case 'Settings':
        return <AddressScreen />;
      default:
        return null;
    }
  }

  return (
    <View style={styles.container}>
      <Header
        onSearch={(t) => setQuery(t || undefined)}
        onVegModeChange={(mode) => setVegMode(mode)}
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

