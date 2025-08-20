import type { Chef } from '../../types';

let CHEFS: Chef[] = [];

export function seedChefs(chefs: Chef[]) {
  CHEFS = chefs.map(c => ({ currency: 'INR', isAvailable: true, createdAt: Date.now(), updatedAt: Date.now(), ...c }));
}

export async function listChefs(): Promise<Chef[]> {
  return CHEFS.filter(c => c.isAvailable ?? true);
}

export async function getChefById(id: string): Promise<Chef | undefined> {
  return CHEFS.find(c => c.id === id);
}

// Default dataset
function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function chefId(name: string) { return `chef-${slugify(name)}`; }

export const DEFAULT_CHEFS: Chef[] = [
  {
    id: chefId('Arjun Mehra'),
    name: 'Arjun Mehra',
    age: 38,
    gender: 'Male',
    experienceYears: 15,
    expertise: ['Indian', 'Chinese'],
    signatureDishes: ['Live Chaat', 'Dim Sum', 'Tandoori'],
    pricePerSlot: 3500,
  },
  {
    id: chefId('Ming Li'),
    name: 'Ming Li',
    age: 35,
    gender: 'Male',
    experienceYears: 12,
    expertise: ['Chinese', 'Pan-Asian'],
    signatureDishes: ['Stir-fry Noodles', 'Sushi Rolls'],
    pricePerSlot: 3800,
  },
  {
    id: chefId('Anjali Rao'),
    name: 'Anjali Rao',
    age: 33,
    gender: 'Female',
    experienceYears: 10,
    expertise: ['Indian', 'South Indian'],
    signatureDishes: ['Dosa Live Counter', 'Biryani'],
    pricePerSlot: 3200,
  },
  {
    id: chefId('Raj Kapoor'),
    name: 'Raj Kapoor',
    age: 42,
    gender: 'Male',
    experienceYears: 18,
    expertise: ['Indian Grill', 'Continental'],
    signatureDishes: ['BBQ Skewers', 'Pasta', 'Pizza'],
    pricePerSlot: 4200,
  },
  {
    id: chefId('Priya Verma'),
    name: 'Priya Verma',
    age: 29,
    gender: 'Female',
    experienceYears: 8,
    expertise: ['Desserts', 'Continental'],
    signatureDishes: ['Live Crepes', 'Tiramisu', 'Pastries'],
    pricePerSlot: 3000,
  },
];

export function seedDefaultChefs() {
  seedChefs(DEFAULT_CHEFS);
}


