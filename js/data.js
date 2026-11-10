
const products = [
  {
    id: 1,
    title: 'Костюм скелета',
    category: 'costumes',
    price: 2490,
    discountPercent: 10,
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 2,
    title: 'Костюм привидения',
    category: 'costumes',
    price: 1890,
    discountPercent: 0,
    rating: 4.6,
    isAvailable: true
  },
  {
    id: 3,
    title: 'Костюм вампира',
    category: 'costumes',
    price: 3890,
    discountPercent: 0,
    rating: 4.9,
    isAvailable: true
  },
  {
    id: 4,
    title: 'Шляпа ведьмы',
    category: 'costumes',
    price: 1190,
    discountPercent: 10,
    rating: 4.5,
    isAvailable: true
  },
  {
    id: 5,
    title: 'Тыква Джек LED',
    category: 'decor',
    price: 1590,
    discountPercent: 0,
    rating: 4.7,
    isAvailable: true
  },
  {
    id: 6,
    title: 'Тюбик искусственной крови',
    category: 'makeup',
    price: 490,
    discountPercent: 0,
    rating: 4.4,
    isAvailable: false
  },
  {
    id: 7,
    title: 'Хоррор-маска Ghostface',
    category: 'costumes',
    price: 990,
    discountPercent: 0,
    rating: 4.7,
    isAvailable: true
  },
  {
    id: 8,
    title: 'Набор шариков Хеллоуин',
    category: 'decor',
    price: 590,
    discountPercent: 0,
    rating: 4.5,
    isAvailable: true
  },
  {
    id: 9,
    title: 'Ведьмина метла',
    category: 'decor',
    price: 1290,
    discountPercent: 0,
    rating: 4.6,
    isAvailable: true
  },
  {
    id: 10,
    title: 'Набор леденцов Spooky Candy',
    category: 'sweets',
    price: 350,
    discountPercent: 0,
    rating: 4.8,
    isAvailable: true
  }
];
const product = products[0];

console.log('Товары SpookyShop:');
console.table(products);
