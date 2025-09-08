import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import { ProductDetailScreen } from '../features/product';
import { OrderDetailsScreen } from '../features/orders';
import { CheckoutScreen } from '../features/cart';
import { PaymentScreen } from '../features/payment';
import { AddressScreen, AddAddressScreen, EditAddressScreen } from '../features/address';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  ProductDetail: { productId: string };
  OrderDetail: { orderId: string };
  Checkout: { order: import('../types').Order };
  Payment: { order: import('../types').Order };
  Address: undefined;
  AddAddress: {};
  EditAddress: { address: import('../types').Address };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={MainTabNavigator} />
        <Stack.Screen 
          name="ProductDetail" 
          component={ProductDetailScreen}
          options={{ title: 'Product Details' }}
        />
        <Stack.Screen 
          name="OrderDetail" 
          component={OrderDetailsScreen}
          options={{ title: 'Order Details' }}
        />
        <Stack.Screen 
          name="Checkout" 
          component={CheckoutScreen}
          options={{ title: 'Checkout' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
          options={{ title: 'Payment' }}
        />
        <Stack.Screen 
          name="Address" 
          component={AddressScreen}
          options={{ title: 'Saved Addresses' }}
        />
        <Stack.Screen 
          name="AddAddress" 
          component={AddAddressScreen}
          options={{ title: 'Add Address' }}
        />
        <Stack.Screen 
          name="EditAddress" 
          component={EditAddressScreen}
          options={{ title: 'Edit Address' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;