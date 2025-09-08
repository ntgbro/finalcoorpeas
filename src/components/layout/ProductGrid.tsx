import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import { theme } from '../../config/theme';
import type { Product, ServiceKey } from '../../types';
import ProductCard from '../layout/ProductCard';
import { getProductsByService } from '../../firebase/mockApi';

type Props = {
  service: ServiceKey;
  vegOnly?: boolean;
  search?: string;
};

export default function ProductGrid({ service, vegOnly, search }: Props) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getProductsByService(service, { vegOnly, search, limit: 50, offset: 0 });
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, vegOnly, search]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
      renderItem={({ item }) => <ProductCard product={item} />}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 8 }}
    />
  );
}


