import type { Product, ProductQueryOptions, ServiceKey, Chef } from '../types';
import {
  listProductsByService,
  listAllProducts,
  getProductById,
} from './collections/products';
import { listChefs } from './collections/chefs';

// Facade for all Firebase data access used by the app.
// Swap implementations here when moving from mock/in-memory to real backend.

export async function getProductsByService(
  service: ServiceKey,
  opts: ProductQueryOptions = {},
): Promise<Product[]> {
  return listProductsByService(service, opts);
}

export async function getAllProducts(opts: ProductQueryOptions = {}): Promise<Product[]> {
  return listAllProducts(opts);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  return getProductById(id);
}

export async function getAllChefs(): Promise<Chef[]> {
  return listChefs();
}

export default {
  getProductsByService,
  getAllProducts,
  getProduct,
  getAllChefs,
};


