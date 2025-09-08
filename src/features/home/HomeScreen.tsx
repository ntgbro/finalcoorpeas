import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { theme } from '../../config/theme';
import ServiceTabs, { ServiceKey } from '../../components/layout/ServiceTabs';
import CategorySections from '../../components/layout/CategorySections';
import ChefList from '../../components/layout/ChefList';

function HomeScreen() {
  const [service, setService] = useState<ServiceKey>('FRESH_SERVE');
  const [vegMode, setVegMode] = useState<'VEG' | 'NON_VEG' | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <View style={styles.container}>
      <ServiceTabs selected={service} onSelect={setService} />
      <View style={styles.content}>
        {service === 'LIVE_CHEF' ? (
          <ChefList />
        ) : (
          <CategorySections 
            service={service} 
            vegMode={vegMode} 
            search={searchQuery} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: { 
    flex: 1,
  },
});

export default HomeScreen;
