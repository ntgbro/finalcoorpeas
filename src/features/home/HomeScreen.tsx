import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../config/theme';
import ServiceTabs, { ServiceKey } from './components/ServiceTabs';

function HomeScreen() {
  const [service, setService] = useState<ServiceKey>('FRESH_SERVE');

  return (
    <View style={styles.container}>
      <ServiceTabs selected={service} onSelect={setService} />
      <View style={styles.content}>
        <Text style={styles.title}>CORPEAS — {service.replace('_', ' ')}</Text>
        <Text style={styles.subtitle}>Placeholder grid for {service}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.primary,
  },
  subtitle: { marginTop: 6, color: theme.colors.textMuted },
});

export default HomeScreen;
