// Корзина: DOM, количество, промокод и подсчёт итоговой суммы.
const cartList = document.querySelector('#cart-list');
const cartEmpty = document.querySelector('#cart-empty');
const cartSummary = document.querySelector('#cart-summary');
const promoForm = document.querySelector('#promo-form');
const promoInput = document.querySelector('#promo-code');
const promoMessage = document.querySelector('#promo-message');
const cartHeading = document.querySelector('#cart-items-heading');
const cartItemsSection = document.querySelector('#cart-items-section');

// Ссылка «Заказать» из карточки товара добавляет его в корзину один раз.
const productId = new URLSearchParams(window.location.search).get('product');
if (productId !== null) {
  const item = findProductById(products, Number(productId));
  if (item && item.isAvailable) addToCart(item.id);
  window.history.replaceState({}, '', 'cart.html');
}


function renderCart() {
  const cart = getCart();
  cartList.replaceChildren();
  cartEmpty.hidden = cart.length > 0;
  cartHeading.hidden = cart.length === 0;
  cartItemsSection.hidden = cart.length === 0;
  cartSummary.hidden = cart.length === 0;

  cart.forEach((entry) => {
    const item = findProductById(products, entry.id);
    const row = document.createElement('article');
    row.className = 'cart-item';
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = item.title;
    image.width = 100;
    image.height = 100;
    image.loading = 'lazy';
    const details = document.createElement('div');
    const title = document.createElement('h2');
    title.className = 'cart-item__title';
    const link = document.createElement('a');
    link.href = `product.html?product=${item.id}`;
    link.textContent = item.title;
    title.append(link);
    const unit = document.createElement('p');
    unit.textContent = `Цена за штуку: ${formatPrice(calculateFinalPrice(item.price, item.discountPercent))}`;
    const total = document.createElement('p');
    total.className = 'cart-item__total';
    total.textContent = `Сумма: ${formatPrice(calculateFinalPrice(item.price, item.discountPercent) * entry.quantity)}`;
    const controls = document.createElement('div');
    controls.className = 'cart-item__controls';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.className = 'button button--secondary';
    minus.textContent = '−';
    minus.dataset.action = 'cart-minus';
    minus.dataset.productId = String(item.id);
    minus.setAttribute('aria-label', `Уменьшить количество: ${item.title}`);
    const qty = document.createElement('span');
    qty.textContent = String(entry.quantity);
    qty.className = 'cart-item__quantity';
    qty.setAttribute('aria-label', `Количество: ${entry.quantity}`);
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.className = 'button button--secondary';
    plus.textContent = '+';
    plus.disabled = entry.quantity >= 99;
    plus.dataset.action = 'cart-plus';
    plus.dataset.productId = String(item.id);
    plus.setAttribute('aria-label', `Увеличить количество: ${item.title}`);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'button button--secondary';
    remove.textContent = 'Удалить';
    remove.dataset.action = 'cart-remove';
    remove.dataset.productId = String(item.id);
    controls.append(minus, qty, plus, remove);
    details.append(title, unit, total, controls);
    row.append(image, details);
    cartList.append(row);
  });

  document.querySelector('#cart-subtotal').textContent = formatPrice(getCartSubtotal());
  document.querySelector('#cart-discount').textContent = getPromoDiscount() ? '−' + formatPrice(getPromoDiscount()) : '0 ₽';
  document.querySelector('#cart-total').textContent = formatPrice(getCartTotal());
  document.querySelector('#cart-items-count').textContent = String(getCartCount());
  if (document.activeElement !== promoInput) promoInput.value = getPromoCode();
}

cartList.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const id = Number(button.dataset.productId);
  if (button.dataset.action === 'cart-plus') changeCartQuantity(id, 1);
  if (button.dataset.action === 'cart-minus') changeCartQuantity(id, -1);
  if (button.dataset.action === 'cart-remove') removeFromCart(id);
});

promoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const code = promoInput.value.trim().toUpperCase();
  if (!code) {
    setPromoCode('');
    promoMessage.textContent = 'Промокод удалён.';
  } else if (code === 'SPOOKY10') {
    setPromoCode(code);
    promoMessage.textContent = 'Промокод SPOOKY10 применён: скидка 10%.';
  } else {
    setPromoCode('');
    promoMessage.textContent = 'Такого промокода нет. Попробуйте SPOOKY10.';
  }
});

document.querySelector('#cart-clear').addEventListener('click', () => {
  clearCart();
  promoMessage.textContent = 'Корзина очищена.';
});
document.addEventListener('cart-updated', renderCart);
renderCart();
