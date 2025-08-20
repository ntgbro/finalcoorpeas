import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { theme } from '../../config/theme';
import { COUNTRY_CODE_DEFAULT } from '../../config/constants';
import { sanitizeDigitsOnly, isValidPhone, isValidOtp } from '../../utils/validators';
import { useResendCountdown } from '../../utils/useResendCountdown';
import { BrandHeader } from '../../components/common/Brand';
import PrimaryButton from '../../components/common/Button';

const COUNTRY_CODE = COUNTRY_CODE_DEFAULT;

// Manager-only prototype: accept any valid phone/OTP for now

function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otpDigits, setOtpDigits] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const { seconds: resendCooldown, start: startResendCooldown } = useResendCountdown();

  const otpRef = useRef<TextInput | null>(null);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const otpSlide = useRef(new Animated.Value(12)).current;
  const otpFade = useRef(new Animated.Value(0)).current;
  const policyFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (showOtp) {
      Animated.parallel([
        Animated.timing(otpSlide, {
          toValue: 0,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(otpFade, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        otpRef.current?.focus();
      });
    } else {
      otpSlide.setValue(12);
      otpFade.setValue(0);
    }
  }, [showOtp, otpFade, otpSlide]);

  useEffect(() => {
    Animated.timing(policyFade, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [policyFade]);

  const fullPhone = useMemo(() => `${COUNTRY_CODE}${phoneDigits}`, [phoneDigits]);

  const onChangePhone = useCallback((value: string) => {
    const digits = sanitizeDigitsOnly(value);
    setPhoneDigits(digits);
    if (phoneError) setPhoneError(null);
  }, [phoneError]);

  const onChangeOtp = useCallback((value: string) => {
    const digits = sanitizeDigitsOnly(value).slice(0, 6);
    setOtpDigits(digits);
    if (otpError) setOtpError(null);
  }, [otpError]);

  // Resend cooldown handled by hook

  const handleSendOtp = useCallback(async () => {
    const valid = isValidPhone(phoneDigits);
    if (!valid) {
      setPhoneError('Please enter a valid corporate phone number');
      return;
    }
    setRequestLoading(true);
    setOtpError(null);
    try {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 700));
      setShowOtp(true);
      startResendCooldown();
    } finally {
      setRequestLoading(false);
    }
  }, [phoneDigits, startResendCooldown]);

  const handleVerifyOtp = useCallback(async () => {
    const phoneOk = isValidPhone(phoneDigits);
    if (!phoneOk) {
      setPhoneError('Please enter a valid corporate phone number');
      return;
    }
    if (!isValidOtp(otpDigits)) {
      setOtpError('Invalid OTP. Try again.');
      return;
    }

    setVerifyLoading(true);
    try {
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 900));

      // Prototype success path: accept any OTP for valid phone format
      if (Platform.OS === 'android') {
        ToastAndroid.show('Login successful—Welcome, Manager!', ToastAndroid.SHORT);
      }
      Alert.alert('Success', 'Login successful—Welcome, Manager!');
      // Navigate to Home screen
      navigation.replace('Home');
    } finally {
      setVerifyLoading(false);
    }
  }, [fullPhone, otpDigits, phoneDigits]);

  const handleResend = useCallback(() => {
    if (resendCooldown > 0) return;
    // Simulate resend
    setRequestLoading(true);
    setTimeout(() => {
      setRequestLoading(false);
      startResendCooldown();
    }, 700);
  }, [resendCooldown, startResendCooldown]);

  // Placeholder for future biometric hookup after first login

  const phoneAccessibleLabel = 'Phone number input';
  const otpAccessibleLabel = 'One-time password input';

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Branding */}
        <View style={styles.brandingArea}>
          <BrandHeader tagline="Corporate Solutions for Managers" />
        </View>

        {/* Login Content */}
        <View style={styles.formCard}>
          
          
          

          <View style={styles.phoneRow}>
            <View style={styles.ccBox} accessibilityLabel="Country code"> 
              <Text style={styles.ccText}>{COUNTRY_CODE}</Text>
            </View>
            <TextInput
              value={phoneDigits}
              onChangeText={onChangePhone}
              placeholder="Enter Your Number"
              keyboardType="phone-pad"
              accessibilityLabel={phoneAccessibleLabel}
              accessibilityHint="Enter your mobile number"
              maxLength={14}
              style={styles.phoneInput}
              returnKeyType={showOtp ? 'next' : 'done'}
            />
          </View>
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

          {!showOtp ? (
            <PrimaryButton
              onPress={handleSendOtp}
              loading={requestLoading}
              disabled={requestLoading}
              title="Send OTP"
              accessibilityLabel="Send OTP"
              style={styles.primaryButton}
            />
          ) : null}

          {/* OTP Section */}
          {showOtp ? (
            <Animated.View
              style={{
                transform: [{ translateY: otpSlide }],
                opacity: otpFade,
                width: '100%',
              }}
            >
              <Text style={styles.otpLabel}>OTP</Text>
              <Text style={styles.otpInfo}>OTP will be sent to your registered corporate mobile.</Text>
              <TextInput
                ref={otpRef}
                value={otpDigits}
                onChangeText={onChangeOtp}
                placeholder="Enter OTP (6 digits)"
                keyboardType="number-pad"
                maxLength={6}
                secureTextEntry
                accessibilityLabel={otpAccessibleLabel}
                accessibilityHint="Enter the 6 digit one-time password"
                style={styles.otpInput}
                returnKeyType="done"
              />
              {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}

              <PrimaryButton
                onPress={handleVerifyOtp}
                loading={verifyLoading}
                disabled={verifyLoading || !isValidOtp(otpDigits)}
                title="Verify OTP"
                accessibilityLabel="Verify OTP"
                style={styles.primaryButton}
              />

              <View style={styles.resendRow}>
                <Text style={styles.resendText}>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Didn\'t receive the code?'}
                </Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={resendCooldown > 0 || requestLoading}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.resendLink,
                      (resendCooldown > 0 || requestLoading) && styles.resendLinkDisabled,
                    ]}
                  >
                    Resend OTP
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : null}
        </View>

        {/* Policy Disclaimer (optional) */}
        <Animated.View style={[styles.policyWrap, { opacity: policyFade }]}> 
          <Text style={styles.policyText}>
            Manager roles only. For employee features, visit our desktop platform or contact your administrator.
          </Text>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    justifyContent: 'space-between',
  },
  brandingArea: {
    alignItems: 'center',
    marginTop: 12,
  },
  logo: {
    fontSize: 56,
  },
  appName: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.primary,
  },
  tagline: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.textMuted,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
  },
  prompt: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    marginTop: 6,
    marginBottom: 6,
    textAlign: 'center',
  },
  note: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: 12,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ccBox: {
    height: 48,
    paddingHorizontal: 12,
    borderTopLeftRadius: 24,
    borderBottomLeftRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
  },
  ccText: {
    fontSize: theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    fontSize: theme.typography.body,
    color: theme.colors.text,
  },
  primaryButton: {
    marginTop: 14,
    // Button base handled by PrimaryButton
  },
  primaryButtonDisabled: {},
  primaryButtonText: {},
  otpLabel: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
  },
  otpInfo: {
    marginTop: -2,
    marginBottom: 8,
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
  },
  otpInput: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    fontSize: theme.typography.subtitle,
    letterSpacing: 6,
    color: theme.colors.text,
  },
  errorText: {
    marginTop: 6,
    color: theme.colors.error,
  },
  resendRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendText: {
    color: theme.colors.textMuted,
    marginRight: 8,
  },
  resendLink: {
    color: theme.colors.primary,
    fontWeight: '700',
  },
  resendLinkDisabled: {
    opacity: 0.5,
  },
  policyWrap: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  policyText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.typography.caption,
  },
});

export default LoginScreen;


