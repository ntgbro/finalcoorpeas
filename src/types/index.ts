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
  vegOnly?: boolean;
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

