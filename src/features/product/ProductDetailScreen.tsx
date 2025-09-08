import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../../config/theme';
import { getProduct } from '../../firebase/mockApi';
import { addItem, useCartItemQuantity } from '../../store/cartStore';
import QuantityStepper from '../../components/common/QuantityStepper';
import type { Product } from '../../types';

type RouteParams = {
  productId: string;
};

export default function ProductDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params as RouteParams;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const cartQuantity = useCartItemQuantity(productId);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(productId);
      setProduct(data || null);
    } catch (error) {
      console.error('Failed to load product:', error);
      Alert.alert('Error', 'Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
        <Text style={styles.loadingText}>Loading product details...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Product not found</Text>
        <Text style={styles.errorSubtitle}>The product you're looking for doesn't exist.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      {/* Product Image Placeholder */}
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>Product Image</Text>
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <View style={styles.titleRow}>
          {product.vegFlag === 'VEG' ? <View style={[styles.dot, styles.veg]} /> : null}
          {product.vegFlag === 'NON_VEG' ? <View style={[styles.dot, styles.nonveg]} /> : null}
          <Text style={styles.productName}>{product.name}</Text>
        </View>

        <Text style={styles.price}>₹ {product.price.selling}</Text>

        {product.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        {product.categories && product.categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            <Text style={styles.categoriesTitle}>Categories</Text>
            <View style={styles.categoriesList}>
              {product.categories.map((category, index) => (
                <View key={index} style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{category}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {product.tags && product.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            <Text style={styles.tagsTitle}>Tags</Text>
            <View style={styles.tagsList}>
              {product.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {product.brand && (
          <View style={styles.brandContainer}>
            <Text style={styles.brandTitle}>Brand</Text>
            <Text style={styles.brandText}>{product.brand}</Text>
          </View>
        )}

        {/* Stock Information */}
        <View style={styles.stockContainer}>
          <Text style={styles.stockTitle}>Availability</Text>
          <Text style={[
            styles.stockText,
            product.isAvailable ? styles.stockAvailable : styles.stockUnavailable
          ]}>
            {product.isAvailable ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityTitle}>Quantity</Text>
          <QuantityStepper
            quantity={quantity}
            onIncrement={() => handleQuantityChange(quantity + 1)}
            onDecrement={() => handleQuantityChange(quantity - 1)}
            style={styles.quantityStepper}
          />
        </View>

        {/* Cart Status */}
        {cartQuantity > 0 && (
          <View style={styles.cartStatusContainer}>
            <Text style={styles.cartStatusText}>
              {cartQuantity} item(s) in cart
            </Text>
          </View>
        )}

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !product.isAvailable && styles.addToCartButtonDisabled
          ]}
          onPress={handleAddToCart}
          disabled={!product.isAvailable}
        >
          <Text style={styles.addToCartButtonText}>
            {!product.isAvailable ? 'Out of Stock' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    color: theme.colors.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  errorTitle: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  errorSubtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  imageContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 300,
    height: 200,
    backgroundColor: '#EEF2F7',
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
  },
  productInfo: {
    padding: theme.spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  veg: {
    backgroundColor: '#16a34a',
  },
  nonveg: {
    backgroundColor: '#b00020',
  },
  productName: {
    flex: 1,
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  price: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.lg,
  },
  descriptionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    lineHeight: 22,
  },
  categoriesContainer: {
    marginBottom: theme.spacing.lg,
  },
  categoriesTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  categoryTag: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
  },
  categoryText: {
    color: '#fff',
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  tagsContainer: {
    marginBottom: theme.spacing.lg,
  },
  tagsTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  tag: {
    backgroundColor: '#EFF3FF',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  tagText: {
    color: theme.colors.text,
    fontSize: theme.typography.caption,
    fontWeight: '500',
  },
  brandContainer: {
    marginBottom: theme.spacing.lg,
  },
  brandTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  brandText: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
  },
  stockContainer: {
    marginBottom: theme.spacing.lg,
  },
  stockTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  stockText: {
    fontSize: theme.typography.body,
    fontWeight: '600',
  },
  stockAvailable: {
    color: '#16a34a',
  },
  stockUnavailable: {
    color: '#dc2626',
  },
  quantityContainer: {
    marginBottom: theme.spacing.lg,
  },
  quantityTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  quantityStepper: {
    alignSelf: 'flex-start',
  },
  cartStatusContainer: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: '#EFF3FF',
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  cartStatusText: {
    color: theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartButtonDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
  addToCartButtonText: {
    color: '#fff',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
  },
});
