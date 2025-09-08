import type { Product, ProductQueryOptions, ServiceKey } from '../../types';

// In a real app, this file would wrap Firestore/Realtime Database collections.
// For now we keep an in-memory store that mirrors a Firestore-like API.

let PRODUCTS: Product[] = [];

export function seedProducts(products: Product[]) {
  PRODUCTS = products.map(p => ({ ...p, searchTokens: buildTokens(p) }));
}

export async function listProductsByService(service: ServiceKey, opts: ProductQueryOptions = {}): Promise<Product[]> {
  const { vegOnly, vegFlag, search, limit = 20, offset = 0 } = opts;
  let items = PRODUCTS.filter(p => p.service === service && (p.isAvailable ?? true));
  if (vegFlag) items = items.filter(p => p.vegFlag === vegFlag);
  else if (vegOnly) items = items.filter(p => p.vegFlag === 'VEG');
  if (search && search.trim().length > 0) {
    const q = normalize(search);
    items = items.filter(p => p.searchTokens?.some(t => t.includes(q)));
  }
  return items.slice(offset, offset + limit);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return PRODUCTS.find(p => p.id === id);
}

export async function listAllProducts(opts: ProductQueryOptions = {}): Promise<Product[]> {
  const { vegOnly, search, limit = 50, offset = 0 } = opts;
  let items = [...PRODUCTS];
  if (vegOnly) items = items.filter(p => p.vegFlag === 'VEG');
  if (search && search.trim().length > 0) {
    const q = normalize(search);
    items = items.filter(p => p.searchTokens?.some(t => t.includes(q)));
  }
  return items.slice(offset, offset + limit);
}

function buildTokens(p: Product): string[] {
  const base = [p.name, p.description, p.brand, ...(p.tags ?? []), ...(p.categories ?? [])]
    .filter(Boolean)
    .join(' ');
  return tokenize(base);
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(/\s+/)
    .filter(Boolean);
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

// ---------------------- Default dataset seeding ----------------------
function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function makeProductId(service: ServiceKey, name: string) {
  return `${service.toLowerCase()}-${slugify(name)}`;
}

function p(
  service: ServiceKey,
  name: string,
  opts: Omit<Partial<Product>, 'price'> & { veg?: boolean; cat?: string; price?: number } = {},
): Product {
  const vegFlag = opts.veg == null ? 'NA' : opts.veg ? 'VEG' : 'NON_VEG';
  const categories = opts.cat ? [opts.cat] : undefined;
  const selling = opts.price ?? 0;
  return {
    id: makeProductId(service, name),
    service,
    name,
    vegFlag: vegFlag as Product['vegFlag'],
    categories,
    price: { currency: 'INR', selling, unit: service === 'FMCG' ? 'pack' : 'serving' },
    isAvailable: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const DEFAULT_PRODUCTS: Product[] = [
  // FRESH SERVE — Salads (Veg)
  p('FRESH_SERVE', 'Classic Caesar Salad', { veg: true, cat: 'Salads', price: 180 }),
  p('FRESH_SERVE', 'Sprouted Chickpea Salad', { veg: true, cat: 'Salads', price: 160 }),
  p('FRESH_SERVE', 'Sprouted Moong Beans, Carrot, Onion Salad', { veg: true, cat: 'Salads', price: 170 }),
  p('FRESH_SERVE', 'Quinoa Salad', { veg: true, cat: 'Salads', price: 190 }),
  p('FRESH_SERVE', 'Asian Quinoa Barley Salad', { veg: true, cat: 'Salads', price: 195 }),
  p('FRESH_SERVE', 'Russian Salad', { veg: true, cat: 'Salads', price: 175 }),
  p('FRESH_SERVE', 'Ranch Pasta Salad', { veg: true, cat: 'Salads', price: 165 }),
  p('FRESH_SERVE', 'Greek Salad', { veg: true, cat: 'Salads', price: 185 }),
  p('FRESH_SERVE', 'Italian Pasta Salad', { veg: true, cat: 'Salads', price: 175 }),
  p('FRESH_SERVE', 'Quinoa Salad with Olives & Peppers', { veg: true, cat: 'Salads', price: 200 }),
  p('FRESH_SERVE', 'Macaroni Veggie Salad with Corn, Mushrooms', { veg: true, cat: 'Salads', price: 180 }),
  p('FRESH_SERVE', 'Soy & Sweet Potato Salad', { veg: true, cat: 'Salads', price: 170 }),
  p('FRESH_SERVE', 'Curried Paneer Sprout Salad', { veg: true, cat: 'Salads', price: 190 }),

  // FRESH SERVE — Salads (Non-Veg)
  p('FRESH_SERVE', 'Caesar Salad with Roast Chicken', { veg: false, cat: 'Salads', price: 220 }),
  p('FRESH_SERVE', 'Asian Chicken Salad', { veg: false, cat: 'Salads', price: 210 }),
  p('FRESH_SERVE', 'Russian Chicken Salad', { veg: false, cat: 'Salads', price: 200 }),
  p('FRESH_SERVE', 'Spinach, Chickpeas, Roasted Potato & Egg Salad', { veg: false, cat: 'Salads', price: 200 }),
  p('FRESH_SERVE', 'Smoked Salmon and Fennel Salad', { veg: false, cat: 'Salads', price: 290 }),
  p('FRESH_SERVE', 'Orange Chicken Salad with Cherry Tomatoes', { veg: false, cat: 'Salads', price: 230 }),
  p('FRESH_SERVE', 'Sweet Potato, Pumpkin & Quinoa Salad with Grilled Chicken', { veg: false, cat: 'Salads', price: 240 }),
  p('FRESH_SERVE', 'Muskmelon & Cucumber Salad and Grilled Chicken', { veg: false, cat: 'Salads', price: 230 }),
  p('FRESH_SERVE', 'Caesar Salad Chicken', { veg: false, cat: 'Salads', price: 220 }),
  p('FRESH_SERVE', 'Roasted Pepper, Mushroom, Minced Chicken & Corn Salad', { veg: false, cat: 'Salads', price: 235 }),
  p('FRESH_SERVE', 'Greek Salad with Prawns', { veg: false, cat: 'Salads', price: 260 }),
  p('FRESH_SERVE', 'Black Rice, Millet & Chicken Salad', { veg: false, cat: 'Salads', price: 250 }),

  // FRESH SERVE — Curries (Veg)
  p('FRESH_SERVE', 'Paneer Butter Masala', { veg: true, cat: 'Curries', price: 240 }),
  p('FRESH_SERVE', 'Dal Makhani', { veg: true, cat: 'Curries', price: 200 }),
  p('FRESH_SERVE', 'Chana Masala', { veg: true, cat: 'Curries', price: 195 }),
  p('FRESH_SERVE', 'Aloo Gobi', { veg: true, cat: 'Curries', price: 190 }),
  p('FRESH_SERVE', 'Baingan Bharta', { veg: true, cat: 'Curries', price: 190 }),
  p('FRESH_SERVE', 'Veg Korma', { veg: true, cat: 'Curries', price: 210 }),
  p('FRESH_SERVE', 'Palak Paneer', { veg: true, cat: 'Curries', price: 230 }),
  p('FRESH_SERVE', 'Mixed Vegetable Curry', { veg: true, cat: 'Curries', price: 200 }),
  p('FRESH_SERVE', 'Kadhi Pakora', { veg: true, cat: 'Curries', price: 190 }),
  p('FRESH_SERVE', 'Sambar', { veg: true, cat: 'Curries', price: 170 }),
  p('FRESH_SERVE', 'Rasam', { veg: true, cat: 'Curries', price: 160 }),
  p('FRESH_SERVE', 'Vegetable Kurma', { veg: true, cat: 'Curries', price: 210 }),
  p('FRESH_SERVE', 'Avial', { veg: true, cat: 'Curries', price: 220 }),
  p('FRESH_SERVE', 'Malai Kofta', { veg: true, cat: 'Curries', price: 240 }),
  p('FRESH_SERVE', 'Navratan Korma', { veg: true, cat: 'Curries', price: 240 }),
  p('FRESH_SERVE', 'Dum Aloo', { veg: true, cat: 'Curries', price: 210 }),
  p('FRESH_SERVE', 'Rajma', { veg: true, cat: 'Curries', price: 200 }),

  // FRESH SERVE — Curries (Non-Veg)
  p('FRESH_SERVE', 'Butter Chicken', { veg: false, cat: 'Curries', price: 280 }),
  p('FRESH_SERVE', 'Chicken Tikka Masala', { veg: false, cat: 'Curries', price: 280 }),
  p('FRESH_SERVE', 'Rogan Josh', { veg: false, cat: 'Curries', price: 300 }),
  p('FRESH_SERVE', 'Mutton Curry', { veg: false, cat: 'Curries', price: 320 }),
  p('FRESH_SERVE', 'Fish Curry', { veg: false, cat: 'Curries', price: 280 }),
  p('FRESH_SERVE', 'Prawn Masala', { veg: false, cat: 'Curries', price: 320 }),
  p('FRESH_SERVE', 'Chicken Chettinad', { veg: false, cat: 'Curries', price: 290 }),
  p('FRESH_SERVE', 'Egg Curry', { veg: false, cat: 'Curries', price: 220 }),
  p('FRESH_SERVE', 'Andhra Mutton Curry', { veg: false, cat: 'Curries', price: 330 }),
  p('FRESH_SERVE', 'Kerala Fish Curry', { veg: false, cat: 'Curries', price: 300 }),
  p('FRESH_SERVE', 'Chettinad Chicken Curry', { veg: false, cat: 'Curries', price: 290 }),
  p('FRESH_SERVE', 'Nihari', { veg: false, cat: 'Curries', price: 320 }),
  p('FRESH_SERVE', 'Chicken Curry', { veg: false, cat: 'Curries', price: 260 }),
  p('FRESH_SERVE', 'Keema Curry', { veg: false, cat: 'Curries', price: 300 }),

  // FRESH SERVE — Snacks & Chaats (Veg)
  p('FRESH_SERVE', 'Veggie Burger', { veg: true, cat: 'Snacks & Chaats', price: 120 }),
  p('FRESH_SERVE', 'Spicy Samosa', { veg: true, cat: 'Snacks & Chaats', price: 40 }),
  p('FRESH_SERVE', 'Cheese Sandwich', { veg: true, cat: 'Snacks & Chaats', price: 90 }),
  p('FRESH_SERVE', 'Paneer Tikka Sandwich', { veg: true, cat: 'Snacks & Chaats', price: 130 }),
  p('FRESH_SERVE', 'Aloo Tikki Burger', { veg: true, cat: 'Snacks & Chaats', price: 100 }),
  p('FRESH_SERVE', 'Dahi Puri', { veg: true, cat: 'Snacks & Chaats', price: 80 }),
  p('FRESH_SERVE', 'Bhel Puri', { veg: true, cat: 'Snacks & Chaats', price: 70 }),
  p('FRESH_SERVE', 'Veg Sandwich', { veg: true, cat: 'Snacks & Chaats', price: 80 }),
  p('FRESH_SERVE', 'Onion Samosa', { veg: true, cat: 'Snacks & Chaats', price: 30 }),
  p('FRESH_SERVE', 'Puff', { veg: true, cat: 'Snacks & Chaats', price: 35 }),
  p('FRESH_SERVE', 'Kachori', { veg: true, cat: 'Snacks & Chaats', price: 35 }),
  p('FRESH_SERVE', 'Medu Vada', { veg: true, cat: 'Snacks & Chaats', price: 60 }),
  p('FRESH_SERVE', 'Bonda', { veg: true, cat: 'Snacks & Chaats', price: 40 }),
  p('FRESH_SERVE', 'Murukku', { veg: true, cat: 'Snacks & Chaats', price: 50 }),
  p('FRESH_SERVE', 'Pav Bhaji', { veg: true, cat: 'Snacks & Chaats', price: 140 }),
  p('FRESH_SERVE', 'Vada Pav', { veg: true, cat: 'Snacks & Chaats', price: 60 }),

  // FRESH SERVE — Sweets / Desserts
  p('FRESH_SERVE', 'Gulab Jamun', { veg: true, cat: 'Sweets / Desserts', price: 90 }),
  p('FRESH_SERVE', 'Jalebi', { veg: true, cat: 'Sweets / Desserts', price: 80 }),
  p('FRESH_SERVE', 'Ladoo', { veg: true, cat: 'Sweets / Desserts', price: 80 }),
  p('FRESH_SERVE', 'Mysore Pak', { veg: true, cat: 'Sweets / Desserts', price: 100 }),

  // FMCG — sample items per category
  // 1. Chips & Snacks
  p('FMCG', 'Potato Chips', { cat: 'Chips & Snacks', price: 35 }),
  p('FMCG', 'Tortilla Chips', { cat: 'Chips & Snacks', price: 60 }),
  p('FMCG', 'Salted Snacks', { cat: 'Chips & Snacks', price: 30 }),
  p('FMCG', 'Popcorn', { cat: 'Chips & Snacks', price: 40 }),
  p('FMCG', 'Extruded Snacks', { cat: 'Chips & Snacks', price: 35 }),
  p('FMCG', 'Namkeen', { cat: 'Chips & Snacks', price: 45 }),

  // 2. Cookies & Biscuits
  p('FMCG', 'Cream Biscuits', { cat: 'Cookies & Biscuits', price: 30 }),
  p('FMCG', 'Marie Biscuits', { cat: 'Cookies & Biscuits', price: 28 }),
  p('FMCG', 'Digestive Biscuits', { cat: 'Cookies & Biscuits', price: 40 }),
  p('FMCG', 'Cookies (Chocolate Chip)', { cat: 'Cookies & Biscuits', price: 60 }),
  p('FMCG', 'Cookies (Butter)', { cat: 'Cookies & Biscuits', price: 55 }),
  p('FMCG', 'Cookies (Oatmeal)', { cat: 'Cookies & Biscuits', price: 65 }),
  p('FMCG', 'Wafer Biscuits', { cat: 'Cookies & Biscuits', price: 35 }),

  // 3. Dry Fruits & Nuts
  p('FMCG', 'Almonds', { cat: 'Dry Fruits & Nuts', price: 199 }),
  p('FMCG', 'Cashews', { cat: 'Dry Fruits & Nuts', price: 220 }),
  p('FMCG', 'Walnuts', { cat: 'Dry Fruits & Nuts', price: 260 }),
  p('FMCG', 'Pistachios', { cat: 'Dry Fruits & Nuts', price: 280 }),
  p('FMCG', 'Raisins', { cat: 'Dry Fruits & Nuts', price: 120 }),
  p('FMCG', 'Dates', { cat: 'Dry Fruits & Nuts', price: 140 }),
  p('FMCG', 'Dried Apricots', { cat: 'Dry Fruits & Nuts', price: 220 }),

  // 4. Tea & Coffee
  p('FMCG', 'Black Tea', { cat: 'Tea & Coffee', price: 120 }),
  p('FMCG', 'Green Tea', { cat: 'Tea & Coffee', price: 140 }),
  p('FMCG', 'Herbal Tea', { cat: 'Tea & Coffee', price: 150 }),
  p('FMCG', 'Instant Coffee', { cat: 'Tea & Coffee', price: 180 }),
  p('FMCG', 'Ground Coffee', { cat: 'Tea & Coffee', price: 220 }),
  p('FMCG', 'Coffee Pods', { cat: 'Tea & Coffee', price: 350 }),

  // 5. Beverages
  p('FMCG', 'Soft Drinks', { cat: 'Beverages', price: 40 }),
  p('FMCG', 'Fruit Juice (Mango)', { cat: 'Beverages', price: 110 }),
  p('FMCG', 'Fruit Juice (Orange)', { cat: 'Beverages', price: 110 }),
  p('FMCG', 'Fruit Juice (Apple)', { cat: 'Beverages', price: 110 }),
  p('FMCG', 'Energy Drinks', { cat: 'Beverages', price: 120 }),
  p('FMCG', 'Flavored Water', { cat: 'Beverages', price: 40 }),
  p('FMCG', 'Bottled Water', { cat: 'Beverages', price: 20 }),

  // 6. Instant Food
  p('FMCG', 'Instant Noodles', { cat: 'Instant Food', price: 25 }),
  p('FMCG', 'Ready-to-Eat Meals', { cat: 'Instant Food', price: 120 }),
  p('FMCG', 'Soup Mixes', { cat: 'Instant Food', price: 90 }),
  p('FMCG', 'Instant Porridge/Oats', { cat: 'Instant Food', price: 120 }),

  // 7. Sweeteners & Spreads
  p('FMCG', 'Nutella Hazelnut Spread with Cocoa', { cat: 'Sweeteners & Spreads', price: 349 }),
  p('FMCG', 'Peanut Butter', { cat: 'Sweeteners & Spreads', price: 199 }),
  p('FMCG', 'Honey', { cat: 'Sweeteners & Spreads', price: 199 }),
  p('FMCG', 'Jams & Jellies', { cat: 'Sweeteners & Spreads', price: 150 }),
  p('FMCG', 'Marmalade', { cat: 'Sweeteners & Spreads', price: 160 }),
  p('FMCG', 'Chocolate Spread', { cat: 'Sweeteners & Spreads', price: 220 }),
  p('FMCG', 'Sugar (White)', { cat: 'Sweeteners & Spreads', price: 50 }),
  p('FMCG', 'Sugar (Brown)', { cat: 'Sweeteners & Spreads', price: 60 }),
  p('FMCG', 'Artificial Sweeteners', { cat: 'Sweeteners & Spreads', price: 180 }),

  // 8. Dairy & Dairy Alternatives
  p('FMCG', 'Milk Powder', { cat: 'Dairy & Alternatives', price: 250 }),
  p('FMCG', 'UHT Milk', { cat: 'Dairy & Alternatives', price: 70 }),
  p('FMCG', 'Cheese Slices', { cat: 'Dairy & Alternatives', price: 120 }),
  p('FMCG', 'Yogurt & Lassi', { cat: 'Dairy & Alternatives', price: 40 }),
  p('FMCG', 'Plant-based Milk (Soy)', { cat: 'Dairy & Alternatives', price: 120 }),
  p('FMCG', 'Plant-based Milk (Almond)', { cat: 'Dairy & Alternatives', price: 160 }),

  // 9. Bakery Products
  p('FMCG', 'Bread (Sliced)', { cat: 'Bakery Products', price: 45 }),
  p('FMCG', 'Buns', { cat: 'Bakery Products', price: 35 }),
  p('FMCG', 'Cakes & Pastries', { cat: 'Bakery Products', price: 199 }),
  p('FMCG', 'Muffins', { cat: 'Bakery Products', price: 90 }),
  p('FMCG', 'Croissants', { cat: 'Bakery Products', price: 120 }),

  // 10. Personal Care
  p('FMCG', 'Soaps & Body Wash', { cat: 'Personal Care', price: 99 }),
  p('FMCG', 'Shampoos & Conditioners', { cat: 'Personal Care', price: 199 }),
  p('FMCG', 'Toothpaste', { cat: 'Personal Care', price: 99 }),
  p('FMCG', 'Deodorants', { cat: 'Personal Care', price: 199 }),
  p('FMCG', 'Moisturizers', { cat: 'Personal Care', price: 199 }),

  // 11. Household Essentials
  p('FMCG', 'Laundry Detergents', { cat: 'Household Essentials', price: 199 }),
  p('FMCG', 'Dishwashing Liquids', { cat: 'Household Essentials', price: 120 }),
  p('FMCG', 'Cleaning Sprays', { cat: 'Household Essentials', price: 180 }),
  p('FMCG', 'Air Fresheners', { cat: 'Household Essentials', price: 160 }),

  // GIFTING — sample
  p('GIFTING', 'Laptop Bag', { cat: 'Bags', price: 1499 }),
  p('GIFTING', 'Travel Mug', { cat: 'Drinkware', price: 699 }),
  p('GIFTING', 'Executive Diary', { cat: 'Diaries & Stationery', price: 399 }),
  p('GIFTING', 'Bluetooth Speaker', { cat: 'Electronics & Tech Gadgets', price: 1299 }),
  p('GIFTING', 'Chocolate Box', { cat: 'Food & Gourmet', price: 499 }),

  // GIFTING — Bags
  p('GIFTING', 'Backpack', { cat: 'Bags', price: 1699 }),
  p('GIFTING', 'Tote Bag', { cat: 'Bags', price: 899 }),
  p('GIFTING', 'Messenger Bag', { cat: 'Bags', price: 1599 }),
  p('GIFTING', 'Sling Bag', { cat: 'Bags', price: 799 }),

  // GIFTING — Accessories
  p('GIFTING', 'Cap', { cat: 'Accessories', price: 299 }),
  p('GIFTING', 'Sunglasses', { cat: 'Accessories', price: 799 }),
  p('GIFTING', 'Keychains', { cat: 'Accessories', price: 149 }),
  p('GIFTING', 'Wallets', { cat: 'Accessories', price: 699 }),
  p('GIFTING', 'Wristbands', { cat: 'Accessories', price: 199 }),

  // GIFTING — Diaries & Stationery
  p('GIFTING', 'Notebooks', { cat: 'Diaries & Stationery', price: 249 }),
  p('GIFTING', 'Pen Sets', { cat: 'Diaries & Stationery', price: 399 }),
  p('GIFTING', 'Planners', { cat: 'Diaries & Stationery', price: 499 }),
  p('GIFTING', 'Sticky Notes', { cat: 'Diaries & Stationery', price: 149 }),

  // GIFTING — Drinkware
  p('GIFTING', 'Reusable Water Bottle', { cat: 'Drinkware', price: 499 }),
  p('GIFTING', 'Coffee Tumbler', { cat: 'Drinkware', price: 599 }),
  p('GIFTING', 'Glassware Set', { cat: 'Drinkware', price: 1599 }),
  p('GIFTING', 'Insulated Flask', { cat: 'Drinkware', price: 899 }),

  // GIFTING — Electronics & Tech Gadgets
  p('GIFTING', 'Power Banks', { cat: 'Electronics & Tech Gadgets', price: 1299 }),
  p('GIFTING', 'USB Flash Drives', { cat: 'Electronics & Tech Gadgets', price: 599 }),
  p('GIFTING', 'Wireless Chargers', { cat: 'Electronics & Tech Gadgets', price: 1499 }),
  p('GIFTING', 'Earbuds / Headphones', { cat: 'Electronics & Tech Gadgets', price: 1999 }),

  // GIFTING — Apparel
  p('GIFTING', 'T-Shirts', { cat: 'Apparel', price: 499 }),
  p('GIFTING', 'Polo Shirts', { cat: 'Apparel', price: 699 }),
  p('GIFTING', 'Jackets', { cat: 'Apparel', price: 2499 }),
  p('GIFTING', 'Scarves', { cat: 'Apparel', price: 399 }),
  p('GIFTING', 'Socks', { cat: 'Apparel', price: 199 }),

  // GIFTING — Desk Accessories
  p('GIFTING', 'Desk Organizers', { cat: 'Desk Accessories', price: 899 }),
  p('GIFTING', 'Pen Holders', { cat: 'Desk Accessories', price: 249 }),
  p('GIFTING', 'Mouse Pads', { cat: 'Desk Accessories', price: 199 }),
  p('GIFTING', 'Desk Clocks', { cat: 'Desk Accessories', price: 999 }),
  p('GIFTING', 'Paperweights', { cat: 'Desk Accessories', price: 299 }),

  // GIFTING — Wellness & Personal Care
  p('GIFTING', 'Hand Sanitizers (Gift Pack)', { cat: 'Wellness & Personal Care', price: 249 }),
  p('GIFTING', 'Scented Candles', { cat: 'Wellness & Personal Care', price: 599 }),
  p('GIFTING', 'Essential Oil Diffusers', { cat: 'Wellness & Personal Care', price: 1499 }),
  p('GIFTING', 'Skincare Kits', { cat: 'Wellness & Personal Care', price: 1299 }),
  p('GIFTING', 'Yoga Mats', { cat: 'Wellness & Personal Care', price: 999 }),

  // GIFTING — Home & Lifestyle
  p('GIFTING', 'Coffee Mugs', { cat: 'Home & Lifestyle', price: 299 }),
  p('GIFTING', 'Photo Frames', { cat: 'Home & Lifestyle', price: 499 }),
  p('GIFTING', 'Plant Pots with Succulents', { cat: 'Home & Lifestyle', price: 799 }),
  p('GIFTING', 'Coasters', { cat: 'Home & Lifestyle', price: 249 }),
  p('GIFTING', 'Decorative Items', { cat: 'Home & Lifestyle', price: 1199 }),

  // GIFTING — Food & Gourmet
  p('GIFTING', 'Dry Fruit Hampers', { cat: 'Food & Gourmet', price: 1499 }),
  p('GIFTING', 'Tea/Coffee Gift Sets', { cat: 'Food & Gourmet', price: 1099 }),
  p('GIFTING', 'Cookies & Biscuit Assortments', { cat: 'Food & Gourmet', price: 799 }),
  p('GIFTING', 'Customized Snack Boxes', { cat: 'Food & Gourmet', price: 999 }),

  // SUPPLIES — sample
  p('SUPPLIES', 'Premium Notebook', { cat: 'Stationery', price: 99 }),
  p('SUPPLIES', 'Whiteboard Markers (Pack)', { cat: 'Stationery', price: 120 }),
  p('SUPPLIES', 'Eco-Friendly Paper Cups', { cat: 'Breakroom & Kitchen', price: 199 }),
  p('SUPPLIES', 'Hand Sanitizer Bottle', { cat: 'Cleaning & Hygiene', price: 79 }),
  p('SUPPLIES', 'USB Flash Drive 32GB', { cat: 'Technology & Electronics', price: 599 }),
  
  // SUPPLIES — Stationery
  p('SUPPLIES', 'Pens', { cat: 'Stationery', price: 20 }),
  p('SUPPLIES', 'Whiteboard Markers', { cat: 'Stationery', price: 120 }),
  p('SUPPLIES', 'Printing Paper (A4)', { cat: 'Stationery', price: 299 }),
  p('SUPPLIES', 'Sticky Notes', { cat: 'Stationery', price: 99 }),
  p('SUPPLIES', 'Organizer Set', { cat: 'Stationery', price: 499 }),
  p('SUPPLIES', 'Stapler', { cat: 'Stationery', price: 149 }),
  p('SUPPLIES', 'Clipboards', { cat: 'Stationery', price: 199 }),
  p('SUPPLIES', 'Rubber Bands', { cat: 'Stationery', price: 49 }),
  p('SUPPLIES', 'Paper Clips', { cat: 'Stationery', price: 39 }),
  p('SUPPLIES', 'Binder Clips', { cat: 'Stationery', price: 59 }),
  p('SUPPLIES', 'Push Pins', { cat: 'Stationery', price: 59 }),
  p('SUPPLIES', 'Calendars & Planners', { cat: 'Stationery', price: 249 }),
  p('SUPPLIES', 'Bulletin Boards', { cat: 'Stationery', price: 799 }),

  // SUPPLIES — Breakroom & Kitchen
  p('SUPPLIES', 'Coffee Machines', { cat: 'Breakroom & Kitchen', price: 8999 }),
  p('SUPPLIES', 'Water Dispensers', { cat: 'Breakroom & Kitchen', price: 3999 }),
  p('SUPPLIES', 'Snack Dispensers', { cat: 'Breakroom & Kitchen', price: 1499 }),
  p('SUPPLIES', 'Disposable Cutlery', { cat: 'Breakroom & Kitchen', price: 199 }),
  p('SUPPLIES', 'Sugar & Creamer Packs', { cat: 'Breakroom & Kitchen', price: 149 }),

  // SUPPLIES — Cleaning & Hygiene
  p('SUPPLIES', 'Eco-Friendly Detergent (Lizol)', { cat: 'Cleaning & Hygiene', price: 199 }),
  p('SUPPLIES', 'Heavy-Duty Mop', { cat: 'Cleaning & Hygiene', price: 399 }),
  p('SUPPLIES', 'Trash Bags', { cat: 'Cleaning & Hygiene', price: 149 }),
  p('SUPPLIES', 'Glass Cleaner', { cat: 'Cleaning & Hygiene', price: 129 }),
  p('SUPPLIES', 'Tissues', { cat: 'Cleaning & Hygiene', price: 99 }),
  p('SUPPLIES', 'Fresheners', { cat: 'Cleaning & Hygiene', price: 179 }),

  // SUPPLIES — Technology & Electronics
  p('SUPPLIES', 'Computer Mouse', { cat: 'Technology & Electronics', price: 499 }),
  p('SUPPLIES', 'Keyboard', { cat: 'Technology & Electronics', price: 799 }),
  p('SUPPLIES', 'Webcam', { cat: 'Technology & Electronics', price: 1499 }),
  p('SUPPLIES', 'External Hard Drive 1TB', { cat: 'Technology & Electronics', price: 4499 }),
  p('SUPPLIES', 'Wireless Router', { cat: 'Technology & Electronics', price: 1999 }),
  p('SUPPLIES', 'Headphones / Earphones', { cat: 'Technology & Electronics', price: 1299 }),
  p('SUPPLIES', 'Laptop Stand', { cat: 'Technology & Electronics', price: 999 }),
  p('SUPPLIES', 'Chargers & Adapters', { cat: 'Technology & Electronics', price: 699 }),
  p('SUPPLIES', 'Projector', { cat: 'Technology & Electronics', price: 24999 }),

  // SUPPLIES — Furniture & Ergonomics
  p('SUPPLIES', 'Office Chairs', { cat: 'Furniture & Ergonomics', price: 4999 }),
  p('SUPPLIES', 'Desks & Workstations', { cat: 'Furniture & Ergonomics', price: 11999 }),
  p('SUPPLIES', 'Filing Cabinets', { cat: 'Furniture & Ergonomics', price: 6999 }),
  p('SUPPLIES', 'Monitor Stands', { cat: 'Furniture & Ergonomics', price: 1299 }),
  p('SUPPLIES', 'Footrests', { cat: 'Furniture & Ergonomics', price: 899 }),
  p('SUPPLIES', 'Ergonomic Cushions', { cat: 'Furniture & Ergonomics', price: 999 }),
  p('SUPPLIES', 'Standing Desks', { cat: 'Furniture & Ergonomics', price: 18999 }),

  // SUPPLIES — Mailing & Packaging Supplies
  p('SUPPLIES', 'Envelopes (Various sizes)', { cat: 'Mailing & Packaging Supplies', price: 149 }),
  p('SUPPLIES', 'Parcel Boxes', { cat: 'Mailing & Packaging Supplies', price: 299 }),
  p('SUPPLIES', 'Bubble Wrap', { cat: 'Mailing & Packaging Supplies', price: 249 }),
  p('SUPPLIES', 'Packing Tape', { cat: 'Mailing & Packaging Supplies', price: 79 }),
  p('SUPPLIES', 'Labels & Stickers', { cat: 'Mailing & Packaging Supplies', price: 99 }),
  p('SUPPLIES', 'Mailing Tubes', { cat: 'Mailing & Packaging Supplies', price: 199 }),

  // SUPPLIES — Safety & Security
  p('SUPPLIES', 'Fire Extinguishers', { cat: 'Safety & Security', price: 2499 }),
  p('SUPPLIES', 'First Aid Kits', { cat: 'Safety & Security', price: 699 }),
  p('SUPPLIES', 'Security Cameras', { cat: 'Safety & Security', price: 3999 }),
  p('SUPPLIES', 'Access Card Readers', { cat: 'Safety & Security', price: 4999 }),
  p('SUPPLIES', 'Safety Signage', { cat: 'Safety & Security', price: 299 }),
  p('SUPPLIES', 'PPE (Gloves & Masks)', { cat: 'Safety & Security', price: 199 }),

  // SUPPLIES — Lighting & Electrical
  p('SUPPLIES', 'Desk Lamps', { cat: 'Lighting & Electrical', price: 899 }),
  p('SUPPLIES', 'Overhead Lighting Solutions', { cat: 'Lighting & Electrical', price: 4999 }),
  p('SUPPLIES', 'Extension Cords', { cat: 'Lighting & Electrical', price: 299 }),
  p('SUPPLIES', 'Power Strips', { cat: 'Lighting & Electrical', price: 399 }),
  p('SUPPLIES', 'Smart Plugs', { cat: 'Lighting & Electrical', price: 1299 }),
];

export function seedDefaultProducts() {
  seedProducts(DEFAULT_PRODUCTS);
}


