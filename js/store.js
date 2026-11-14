// Хранение корзины, избранного и промокода в браузере.
// В localStorage сохраняются только id товаров и количество, не личные данные.
const CART_KEY = 'spookyshop-cart-v1';
const FAVORITES_KEY = 'spookyshop-favorites-v1';
const PROMO_KEY = 'spookyshop-promo-v1';
const fallbackStorage = {};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? (fallbackStorage[key] ?? fallback) : JSON.parse(value);
  } catch (error) {
    return fallbackStorage[key] ?? fallback;
  }
}

function writeStorage(key, value) {
  fallbackStorage[key] = value;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Магазин остаётся работоспособным, даже если хранение браузером запрещено.
  }
}

function getCart() {
  const saved = readStorage(CART_KEY, []);
  if (!Array.isArray(saved)) return [];
  const unique = [];
  saved.forEach((entry) => {
    if (!entry || !Number.isInteger(entry.id) || !Number.isInteger(entry.quantity)) return;
    const item = products.find((product) => product.id === entry.id && product.isAvailable);
    if (!item || entry.quantity < 1) return;
    const existing = unique.find((row) => row.id === entry.id);
    if (existing) {
      existing.quantity = Math.min(99, existing.quantity + entry.quantity);
    } else {
      unique.push({ id: entry.id, quantity: Math.min(99, entry.quantity) });
    }
  });
  return unique;
}

function saveCart(cart) {
  writeStorage(CART_KEY, cart);
  document.dispatchEvent(new Event('cart-updated'));
}

function addToCart(id) {
  const item = products.find((product) => product.id === id && product.isAvailable);
  if (!item) return false;
  const cart = getCart();
  const row = cart.find((entry) => entry.id === id);
  if (row) {
    if (row.quantity >= 99) return false;
    row.quantity += 1;
  } else {
    cart.push({ id, quantity: 1 });
  }
  saveCart(cart);
  return true;
}

function changeCartQuantity(id, difference) {
  const cart = getCart();
  const row = cart.find((entry) => entry.id === id);
  if (!row) return;
  row.quantity = Math.min(99, row.quantity + difference);
  saveCart(cart.filter((entry) => entry.quantity > 0));
}

function removeFromCart(id) {
  saveCart(getCart().filter((entry) => entry.id !== id));
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((count, entry) => count + entry.quantity, 0);
}

function getCartSubtotal() {
  return getCart().reduce((total, entry) => {
    const item = products.find((product) => product.id === entry.id);
    return total + calculateFinalPrice(item.price, item.discountPercent) * entry.quantity;
  }, 0);
}

function getFavorites() {
  const saved = readStorage(FAVORITES_KEY, []);
  if (!Array.isArray(saved)) return [];
  return saved.filter((id, index) =>
    Number.isInteger(id) && saved.indexOf(id) === index &&
    products.some((item) => item.id === id)
  );
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

function toggleFavorite(id) {
  if (!products.some((item) => item.id === id)) return false;
  const favorites = getFavorites();
  const next = favorites.includes(id)
    ? favorites.filter((savedId) => savedId !== id)
    : [...favorites, id];
  writeStorage(FAVORITES_KEY, next);
  document.dispatchEvent(new Event('favorites-updated'));
  return next.includes(id);
}

function getPromoCode() {
  return readStorage(PROMO_KEY, '') === 'SPOOKY10' ? 'SPOOKY10' : '';
}

function setPromoCode(code) {
  writeStorage(PROMO_KEY, code === 'SPOOKY10' ? 'SPOOKY10' : '');
  document.dispatchEvent(new Event('cart-updated'));
}

function getPromoDiscount() {
  return getPromoCode() ? Math.round(getCartSubtotal() * 0.1) : 0;
}

function getCartTotal() {
  return getCartSubtotal() - getPromoDiscount();
}
