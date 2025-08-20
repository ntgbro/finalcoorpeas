import { OTP_LENGTH, PHONE_MIN, PHONE_MAX } from '../config/constants';

export function sanitizeDigitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function isValidPhone(digits: string): boolean {
  return digits.length >= PHONE_MIN && digits.length <= PHONE_MAX;
}

export function isValidOtp(digits: string): boolean {
  const re = new RegExp(`^\\d{${OTP_LENGTH}}$`);
  return re.test(digits);
}


