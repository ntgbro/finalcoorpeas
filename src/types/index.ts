export type ServiceKey = 'FRESH_SERVE' | 'FMCG' | 'GIFTING' | 'SUPPLIES' | 'LIVE_CHEF';

export type VegFlag = 'VEG' | 'NON_VEG' | 'NA';

export type CurrencyCode = 'INR';

export type UnitOfMeasure =
  | 'kg'
  | 'g'
  | 'l'
  | 'ml'
  | 'pcs'
  | 'pack'
  | 'plate'
  | 'serving';

export interface Price {
  currency: CurrencyCode;
  mrp?: number;
  selling: number;
  unit?: UnitOfMeasure;
  quantityPerUnit?: number;
}

export interface ProductVariant {
  skuId: string;
  name?: string;
  price: Price;
  stock?: number | null;
  barcode?: string;
  isActive?: boolean;
}

export interface Product {
  id: string;
  service: ServiceKey;
  name: string;
  description?: string;
  images?: string[];
  price: Price; // base/primary price
  variants?: ProductVariant[]; // optional additional SKUs
  vegFlag?: VegFlag;
  categories?: string[]; // e.g., ['Dairy', 'Paneer']
  tags?: string[];
  brand?: string;
  stock?: number | null; // null if not tracked
  isAvailable?: boolean;
  taxPercent?: number | null; // GST
  searchTokens?: string[]; // precomputed for simple search
  createdAt?: number;
  updatedAt?: number;
}

export interface ProductQueryOptions {
  vegOnly?: boolean; // legacy flag
  vegFlag?: VegFlag; // preferred: 'VEG' | 'NON_VEG'
  search?: string;
  limit?: number;
  offset?: number;
}

// Live Chef types
export type Gender = 'Male' | 'Female' | 'Other';

export interface Chef {
  id: string;
  name: string;
  age?: number;
  gender?: Gender;
  experienceYears?: number;
  expertise: string[]; // cuisines or categories
  signatureDishes?: string[];
  pricePerSlot: number; // INR per booking slot
  currency?: CurrencyCode; // defaults to INR
  rating?: number; // 0-5
  images?: string[];
  isAvailable?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

// Order Management Types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  name: string;
  price: number; // snapshot at time of order
  quantity: number;
  vegFlag?: VegFlag;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
  estimatedDelivery?: number; // timestamp
  notes?: string;
  deliveryAddress?: DeliveryAddress;
}

// Payment Types
export type PaymentMethod = 'UPI' | 'CARD' | 'NET_BANKING' | 'WALLET';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  upiId?: string;
  qrCode?: string;
  transactionId?: string;
  screenshotTaken?: boolean;
  transactionIdCopied?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface UPIDetails {
  upiId: string;
  qrCode: string;
  merchantName: string;
  merchantId: string;
}

// Promo Code Types
export interface PromoCode {
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  isActive: boolean;
  validUntil?: number;
}

export interface AppliedPromo {
  code: string;
  discountAmount: number;
  finalAmount: number;
}

// Address Types
export type AddressType = 'HOME' | 'OFFICE' | 'OTHER';

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface DeliveryAddress {
  addressId: string;
  address: Address;
  deliveryInstructions?: string;
}

