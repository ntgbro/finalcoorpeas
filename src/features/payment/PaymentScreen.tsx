import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Clipboard,
  Share,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { theme } from '../../config/theme';
import { clearCart } from '../../store/cartStore';
import type { Order, PaymentDetails, UPIDetails } from '../../types';
import Checkbox from '../../components/common/Checkbox';

// Mock UPI details - In real app, this would come from backend
const UPI_DETAILS: UPIDetails = {
  upiId: 'corpeas@paytm',
  qrCode: 'upi://pay?pa=corpeas@paytm&pn=CORPEAS&am=100&cu=INR&tr=ORDER123456',
  merchantName: 'CORPEAS',
  merchantId: 'CORPEAS123456',
};

// UPI Apps for redirection
const UPI_APPS = [
  { name: 'PhonePe', scheme: 'phonepe://', package: 'com.phonepe.app' },
  { name: 'Google Pay', scheme: 'gpay://', package: 'com.google.android.apps.nbu.paisa.user' },
  { name: 'Paytm', scheme: 'paytm://', package: 'net.one97.paytm' },
  { name: 'BHIM', scheme: 'bhim://', package: 'in.org.npci.upiapp' },
  { name: 'Amazon Pay', scheme: 'amazonpay://', package: 'in.amazon.mShop.android.shopping' },
];


type RouteParams = {
  order: Order;
};

export default function PaymentScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params as RouteParams;
  
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [transactionIdCopied, setTransactionIdCopied] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [generatedTransactionId, setGeneratedTransactionId] = useState('');


  useEffect(() => {
    // Generate a mock transaction ID
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setGeneratedTransactionId(transactionId);

    // Create payment details
    const payment: PaymentDetails = {
      id: `PAY${Date.now()}`,
      orderId: order.id,
      amount: order.total,
      method: 'UPI',
      status: 'PENDING',
      upiId: UPI_DETAILS.upiId,
      qrCode: UPI_DETAILS.qrCode,
      transactionId,
      screenshotTaken: false,
      transactionIdCopied: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setPaymentDetails(payment);
  }, [order]);

  const handleUPIAppPress = async (app: typeof UPI_APPS[0]) => {
    try {
      const upiUrl = `upi://pay?pa=${UPI_DETAILS.upiId}&pn=${UPI_DETAILS.merchantName}&am=${order.total}&cu=INR&tr=${generatedTransactionId}`;
      
      // Try to open the specific UPI app
      const canOpen = await Linking.canOpenURL(app.scheme);
      if (canOpen) {
        await Linking.openURL(upiUrl);
      } else {
        // Fallback to generic UPI URL
        await Linking.openURL(upiUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open UPI app. Please try again.');
    }
  };

  const handleCopyUPIId = async () => {
    try {
      await Clipboard.setString(UPI_DETAILS.upiId);
      Alert.alert('Copied', 'UPI ID copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy UPI ID');
    }
  };

  const handleCopyTransactionId = async () => {
    try {
      await Clipboard.setString(generatedTransactionId);
      setTransactionIdCopied(true);
      Alert.alert('Copied', 'Transaction ID copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy Transaction ID');
    }
  };

  const handleScreenshotTaken = () => {
    setScreenshotTaken(true);
    Alert.alert('Screenshot Taken', 'Thank you for taking the screenshot. Please keep it for your records.');
  };

  const handleSharePayment = async () => {
    try {
      const message = `Payment Details:\nOrder: ${order.orderNumber}\nAmount: ₹${order.total}\nUPI ID: ${UPI_DETAILS.upiId}\nTransaction ID: ${generatedTransactionId}`;
      await Share.share({ message });
    } catch (error) {
      Alert.alert('Error', 'Failed to share payment details');
    }
  };

  const handlePaymentComplete = () => {
    // Clear the cart after successful payment
    clearCart();
    
    Alert.alert(
      'Payment Submitted',
      'Your payment has been submitted for verification. You will receive a confirmation once verified.',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  if (!paymentDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading payment details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Payment</Text>
        <Text style={styles.headerSubtitle}>Order #{order.orderNumber}</Text>
      </View>

      {/* Payment Amount */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Amount</Text>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount to Pay:</Text>
          <Text style={styles.amountValue}>₹ {order.total}</Text>
        </View>
      </View>

      {/* UPI Payment Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UPI Payment</Text>
        
        {/* UPI ID */}
        <View style={styles.upiIdContainer}>
          <Text style={styles.upiIdLabel}>UPI ID:</Text>
          <View style={styles.upiIdRow}>
            <Text style={styles.upiIdText}>{UPI_DETAILS.upiId}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyUPIId}
            >
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* QR Code Placeholder */}
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>Scan QR Code to Pay</Text>
          <View style={styles.qrCodePlaceholder}>
            <Text style={styles.qrCodeText}>QR CODE</Text>
            <Text style={styles.qrCodeSubtext}>Scan with any UPI app</Text>
          </View>
        </View>

        {/* UPI Apps */}
        <View style={styles.upiAppsContainer}>
          <Text style={styles.upiAppsLabel}>Pay with UPI Apps:</Text>
          <View style={styles.upiAppsGrid}>
            {UPI_APPS.map((app, index) => (
              <TouchableOpacity
                key={index}
                style={styles.upiAppButton}
                onPress={() => handleUPIAppPress(app)}
              >
                <Text style={styles.upiAppText}>{app.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>


      {/* Checkboxes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Confirmation</Text>
        
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              checked={screenshotTaken}
              onChange={setScreenshotTaken}
            />
            <Text style={styles.checkboxLabel}>I have taken a screenshot of the payment</Text>
          </View>
        </View>
        
        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <Checkbox
              checked={transactionIdCopied}
              onChange={setTransactionIdCopied}
            />
            <Text style={styles.checkboxLabel}>I have copied the transaction ID</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.shareButton}
          onPress={handleSharePayment}
        >
          <Text style={styles.shareButtonText}>Share Payment Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.completeButton,
            (!screenshotTaken || !transactionIdCopied) && styles.completeButtonDisabled
          ]}
          onPress={handlePaymentComplete}
          disabled={!screenshotTaken || !transactionIdCopied}
        >
          <Text style={styles.completeButtonText}>Complete Payment</Text>
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
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
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
  headerSubtitle: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    marginTop: 4,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
  },
  summaryValue: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  totalRow: {
    paddingTop: theme.spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: theme.typography.subtitle,
    color: theme.colors.text,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: theme.typography.subtitle,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  amountContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: '#F8F9FA',
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
  },
  amountLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  amountValue: {
    fontSize: theme.typography.title,
    color: theme.colors.primary,
    fontWeight: '800',
  },
  upiIdContainer: {
    marginBottom: theme.spacing.lg,
  },
  upiIdLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.sm,
  },
  upiIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  upiIdText: {
    flex: 1,
    fontSize: theme.typography.subtitle,
    color: theme.colors.text,
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  qrLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F8F9FA',
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeText: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
  qrCodeSubtext: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  upiAppsContainer: {
    marginTop: theme.spacing.lg,
  },
  upiAppsLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  upiAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  upiAppButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  upiAppText: {
    color: '#fff',
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  checkboxContainer: {
    marginBottom: theme.spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  actionsContainer: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  shareButton: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  shareButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.subtitle,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.pill,
    alignItems: 'center',
  },
  completeButtonDisabled: {
    backgroundColor: theme.colors.textMuted,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
  },
});
