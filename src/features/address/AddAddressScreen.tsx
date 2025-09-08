import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../../config/theme';
import { addAddress } from '../../store/addressStore';
import TextInput from '../../components/common/TextInput';
import type { AddressType, Order } from '../../types';
import type { RootStackParamList } from '../../navigation/types';

const ADDRESS_TYPES: { type: AddressType; label: string; icon: string }[] = [
  { type: 'HOME', label: 'Home', icon: '🏠' },
  { type: 'OFFICE', label: 'Office', icon: '🏢' },
  { type: 'OTHER', label: 'Other', icon: '📍' },
];

type RouteParams = {
  order?: Order;
};

export default function AddAddressScreen() {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { order } = route.params as RouteParams;
  
  const [addressType, setAddressType] = useState<AddressType>('HOME');
  const [label, setLabel] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to auto-fill address details.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required to get your current location.');
      return;
    }

    setIsGettingLocation(true);
    
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        
        // Here you would typically reverse geocode to get address details
        // For now, we'll just show a success message
        Alert.alert(
          'Location Found',
          `Location: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Address details need to be filled manually.`,
          [{ text: 'OK' }]
        );
        
        setIsGettingLocation(false);
      },
      (error) => {
        console.log('Location error:', error);
        Alert.alert('Error', 'Unable to get your current location. Please try again.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const handleSaveAddress = async () => {
    // Validation
    if (!label.trim()) {
      Alert.alert('Error', 'Please enter a label for this address');
      return;
    }
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    if (!addressLine1.trim()) {
      Alert.alert('Error', 'Please enter address line 1');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter city');
      return;
    }
    if (!state.trim()) {
      Alert.alert('Error', 'Please enter state');
      return;
    }
    if (!pincode.trim()) {
      Alert.alert('Error', 'Please enter pincode');
      return;
    }

    // Phone number validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\D/g, ''))) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    // Pincode validation
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return;
    }

    setIsLoading(true);

    try {
      addAddress({
        userId: 'user_1', // In real app, get from auth store
        type: addressType,
        label: label.trim(),
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        isDefault,
        isActive: true,
      });

      if (order) {
        // If coming from cart, navigate to Checkout with the order
        navigation.navigate('Checkout', { order });
      } else {
        // If coming from address management, go back
        Alert.alert(
          'Success',
          'Address added successfully',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Address</Text>
      </View>

      {/* Address Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address Type</Text>
        <View style={styles.typeContainer}>
          {ADDRESS_TYPES.map((type) => (
            <TouchableOpacity
              key={type.type}
              style={[
                styles.typeButton,
                addressType === type.type && styles.typeButtonSelected,
              ]}
              onPress={() => setAddressType(type.type)}
            >
              <Text style={styles.typeIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.typeLabel,
                  addressType === type.type && styles.typeLabelSelected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Location Button */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get Current Location</Text>
        <TouchableOpacity
          style={[styles.locationButton, isGettingLocation && styles.locationButtonDisabled]}
          onPress={getCurrentLocation}
          disabled={isGettingLocation}
        >
          <Text style={styles.locationButtonIcon}>📍</Text>
          <Text style={styles.locationButtonText}>
            {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
          </Text>
        </TouchableOpacity>
        {location && (
          <Text style={styles.locationText}>
            Location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      {/* Address Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address Details</Text>
        
        <TextInput
          label="Label (e.g., Home, Office)"
          value={label}
          onChangeText={setLabel}
          placeholder="Enter address label"
          autoCapitalize="words"
        />

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          autoCapitalize="words"
        />

        <TextInput
          label="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter 10-digit phone number"
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TextInput
          label="Address Line 1"
          value={addressLine1}
          onChangeText={setAddressLine1}
          placeholder="House/Flat number, Street name"
          autoCapitalize="words"
          multiline
        />

        <TextInput
          label="Address Line 2 (Optional)"
          value={addressLine2}
          onChangeText={setAddressLine2}
          placeholder="Apartment, Floor, etc."
          autoCapitalize="words"
          multiline
        />

        <TextInput
          label="Landmark (Optional)"
          value={landmark}
          onChangeText={setLandmark}
          placeholder="Near landmark, building name"
          autoCapitalize="words"
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <TextInput
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="Enter city"
              autoCapitalize="words"
            />
          </View>
          <View style={styles.halfWidth}>
            <TextInput
              label="State"
              value={state}
              onChangeText={setState}
              placeholder="Enter state"
              autoCapitalize="words"
            />
          </View>
        </View>

        <TextInput
          label="Pincode"
          value={pincode}
          onChangeText={setPincode}
          placeholder="Enter 6-digit pincode"
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      {/* Default Address Toggle */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.defaultContainer}
          onPress={() => setIsDefault(!isDefault)}
        >
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isDefault && styles.checkboxSelected]}>
              {isDefault && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabel}>Set as default address</Text>
              <Text style={styles.checkboxSubtext}>
                This address will be used for future orders
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveAddress}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Address'}
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
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  section: {
    margin: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  typeButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF3FF',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.xs,
  },
  typeLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  typeLabelSelected: {
    color: theme.colors.primary,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  halfWidth: {
    flex: 1,
  },
  defaultContainer: {
    padding: theme.spacing.md,
    backgroundColor: '#F8F9FA',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  checkboxSubtext: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  actionsContainer: {
    padding: theme.spacing.md,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: '#16a34a',
    borderStyle: 'dashed',
  },
  locationButtonDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: theme.colors.border,
  },
  locationButtonIcon: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  locationButtonText: {
    fontSize: theme.typography.body,
    color: '#16a34a',
    fontWeight: '600',
  },
  locationText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
});
