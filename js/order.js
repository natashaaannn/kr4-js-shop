// Страница оформления: краткая сводка стоимости и пустое состояние.
// Данные корзины и промокод берутся из localStorage через store.js.
const orderSummary = document.querySelector('#order-summary');
const orderSection = document.querySelector('#checkout-section');
const orderEmpty = document.querySelector('#order-empty');
const orderSuccess = document.querySelector('#checkout-success');

function renderOrder() {
  const cart = getCart();
  const hasItems = cart.length > 0;
  orderSummary.hidden = !hasItems;
  orderSection.hidden = !hasItems;
  orderEmpty.hidden = hasItems || !orderSuccess.hidden;

  document.querySelector('#order-subtotal').textContent = formatPrice(getCartSubtotal());
  const discount = getPromoDiscount();
  document.querySelector('#order-discount-row').hidden = discount === 0;
  document.querySelector('#order-discount').textContent = '−' + formatPrice(discount);
  document.querySelector('#order-total').textContent = formatPrice(getCartTotal());
}

document.addEventListener('cart-updated', renderOrder);
renderOrder();
