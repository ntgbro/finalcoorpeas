import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { getAllChefs } from '../../firebase/mockApi';
import ChefCard from './ChefCard';
import { theme } from '../../config/theme';
import type { Chef } from '../../types';

export default function ChefList() {
  const [items, setItems] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAllChefs();
      setItems(data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList data={items} keyExtractor={(i) => i.id} renderItem={({ item }) => <ChefCard chef={item} />} />
  );
}


