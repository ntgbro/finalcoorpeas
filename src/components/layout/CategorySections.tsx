import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { theme } from '../../config/theme';
import type { Product, ServiceKey, VegFlag } from '../../types';
import { getProductsByService } from '../../firebase/mockApi';
import ProductCard from './ProductCard';

type Props = {
  service: ServiceKey;
  vegMode: 'VEG' | 'NON_VEG' | 'ALL';
  search?: string;
};

type SubSection = { title: string; products: Product[] };
type CategorySection = { category: string; sub: SubSection[] };

export default function CategorySections({ service, vegMode, search }: Props) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await getProductsByService(service, { search, limit: 2000 });
      if (mounted) {
        setItems(data);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [service, search]);

  const sections: CategorySection[] = useMemo(() => {
    // Apply text search already handled upstream; vegMode handled in grouping below
    const filtered = items;
    const byCategory = new Map<string, Product[]>();
    for (const p of filtered) {
      const key = p.categories?.[0] ?? 'Other';
      const arr = byCategory.get(key) ?? [];
      arr.push(p);
      byCategory.set(key, arr);
    }

    const result: CategorySection[] = [];
    for (const [category, prods] of byCategory) {
      const vegProds = prods.filter(p => p.vegFlag === 'VEG');
      const nonVegProds = prods.filter(p => p.vegFlag === 'NON_VEG');
      const naProds = prods.filter(p => !p.vegFlag || p.vegFlag === 'NA');
      const sub: SubSection[] = [];

      const hasClassified = vegProds.length > 0 || nonVegProds.length > 0;
      if (!hasClassified) {
        // Non food catalogs (FMCG, GIFTING, SUPPLIES) or categories with NA → single block
        sub.push({ title: category, products: prods });
      } else {
        if (vegMode !== 'NON_VEG' && vegProds.length > 0) {
          sub.push({ title: `${category} — Veg`, products: vegProds });
        }
        if (vegMode !== 'VEG' && nonVegProds.length > 0) {
          sub.push({ title: `${category} — Non-Veg`, products: nonVegProds });
        }
        if (vegMode === 'ALL' && naProds.length > 0) {
          sub.push({ title: `${category}`, products: naProds });
        }
      }
      if (sub.length > 0) result.push({ category, sub });
    }
    // stable order: category name asc
    result.sort((a, b) => a.category.localeCompare(b.category));
    return result;
  }, [items, vegMode]);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sections.map(section => (
        <View key={section.category} style={styles.categoryBlock}>
          <Text style={styles.categoryTitle}>{section.category}</Text>
          {section.sub.map(sub => (
            <View key={sub.title} style={styles.subBlock}>
              <Text style={styles.subTitle}>{sub.title}</Text>
              <FlatList
                data={sub.products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => <ProductCard product={item} />}
                scrollEnabled={false}
                contentContainerStyle={styles.gridContent}
              />
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { paddingBottom: 16 },
  categoryBlock: { paddingHorizontal: 12, paddingTop: 12 },
  categoryTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 6 },
  subBlock: { marginBottom: 8 },
  subTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.textMuted, marginBottom: 6, paddingLeft: 4 },
  gridContent: { paddingHorizontal: 0 },
});


