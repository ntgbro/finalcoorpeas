import { seedDefaultProducts } from './collections/products';
import { seedDefaultChefs } from './collections/chefs';

export function seedAll() {
  seedDefaultProducts();
  seedDefaultChefs();
}


