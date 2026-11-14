// Общие функции проекта и поведение, одинаковое для всех страниц.
document.documentElement.classList.add('js');

function formatPrice(price) {
  return Math.round(price).toLocaleString('ru-RU') + ' ₽';
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent = 0) {
  return price - calculateDiscount(price, discountPercent);
}

function getAvailabilityText(isAvailable) {
  return isAvailable ? 'В наличии' : 'Нет в наличии';
}

function getProductDescription(item) {
  return item.title + ' — ' + formatPrice(calculateFinalPrice(item.price, item.discountPercent));
}

function getProductTitles(items) {
  const titles = [];
  for (const item of items) {
    titles.push(item.title);
  }
  return titles;
}

function getAvailableProducts(items) {
  return items.filter((item) => item.isAvailable);
}

function searchProducts(items, query) {
  const normalized = query.trim().toLowerCase();
  return normalized ? items.filter((item) => item.title.toLowerCase().includes(normalized)) : [...items];
}

function filterProductsByCategory(items, category) {
  return category === 'all' ? [...items] : items.filter((item) => item.category === category);
}

function sortProductsByPrice(items, direction = 'asc') {
  const copy = [...items];
  return copy.sort((a, b) => {
    const priceA = calculateFinalPrice(a.price, a.discountPercent);
    const priceB = calculateFinalPrice(b.price, b.discountPercent);
    return direction === 'desc' ? priceB - priceA : priceA - priceB;
  });
}

function findProductById(items, id) {
  return items.find((item) => item.id === id);
}

function calculateTotalPrice(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function countAvailableProducts(items) {
  let count = 0;
  for (let i = 0; i < items.length; i += 1) {
    if (items[i].isAvailable) count += 1;
  }
  return count;
}

function calculateAveragePrice(items) {
  return items.length ? Math.round(calculateTotalPrice(items) / items.length) : 0;
}

function getPreparedProducts(items, query, category, sortDirection) {
  return sortProductsByPrice(filterProductsByCategory(searchProducts(items, query), category), sortDirection);
}

const categoryNames = {
  costumes: 'Костюмы и маски',
  decor: 'Декор',
  makeup: 'Грим',
  sweets: 'Сладости'
};

function createProductCard(item) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.category = item.category;
  card.dataset.productId = String(item.id);

  const meta = document.createElement('div');
  meta.className = 'product-card__meta';
  const category = document.createElement('span');
  category.className = 'product-card__category';
  category.textContent = categoryNames[item.category];
  meta.append(category);

  if (item.discountPercent > 0 || item.isNew || item.isHit) {
    const badge = document.createElement('span');
    badge.className = 'product-card__badge ' +
      (item.discountPercent > 0 ? 'product-card__badge--discount' :
        item.isNew ? 'product-card__badge--new' : 'product-card__badge--hit');
    badge.textContent = item.discountPercent > 0 ? `−${item.discountPercent}%` : item.isNew ? 'Новинка' : 'Хит';
    meta.append(badge);
  }

  const picture = document.createElement('picture');
  const source = document.createElement('source');
  source.type = 'image/webp';
  const base = item.image.replace('.webp', '');
  if (item.id === 7) {
    source.srcset = `${base}-240.webp 240w, ${item.image} 400w`;
  } else {
    source.srcset = `${base}-480.webp 480w, ${base}-960.webp 960w, ${item.image} 1024w`;
  }
  source.sizes = '(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw';
  picture.append(source);

  const image = document.createElement('img');
  image.className = 'product-card__image';
  image.src = item.image;
  image.alt = item.title;
  image.loading = 'lazy';
  image.width = 400;
  image.height = 400;
  picture.append(image);

  const title = document.createElement('h3');
  title.className = 'product-card__title';
  title.textContent = item.title;

  const description = document.createElement('p');
  description.className = 'product-card__description';
  description.textContent = item.description;

  const price = document.createElement('p');
  price.className = 'product-card__price';
  price.textContent = formatPrice(calculateFinalPrice(item.price, item.discountPercent));
  if (item.discountPercent > 0) {
    const previous = document.createElement('s');
    previous.className = 'product-card__old-price';
    previous.textContent = formatPrice(item.price);
    price.prepend(previous);
  }

  const availability = document.createElement('p');
  availability.className = 'product-card__availability';
  availability.textContent = getAvailabilityText(item.isAvailable) + ' · ★ ' + item.rating;
  if (!item.isAvailable) availability.classList.add('is-unavailable');

  const actions = document.createElement('div');
  actions.className = 'product-card__actions';
  const link = document.createElement('a');
  link.className = 'button button--secondary';
  link.href = `product.html?product=${item.id}`;
  link.textContent = 'Подробнее';
  actions.append(link);

  const buy = document.createElement('button');
  buy.type = 'button';
  buy.className = 'button button--primary';
  buy.dataset.action = 'add-to-cart';
  buy.dataset.productId = String(item.id);
  buy.textContent = item.isAvailable ? 'В корзину' : 'Нет в наличии';
  buy.disabled = !item.isAvailable;
  actions.append(buy);

  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.className = 'product-card__favorite';
  favorite.dataset.action = 'toggle-favorite';
  favorite.dataset.productId = String(item.id);
  favorite.setAttribute('aria-pressed', String(isFavorite(item.id)));
  favorite.setAttribute('aria-label', isFavorite(item.id) ? `Убрать из избранного: ${item.title}` : `В избранное: ${item.title}`);
  favorite.textContent = isFavorite(item.id) ? '♥' : '♡';
  meta.append(favorite);
  card.append(meta, picture, title, description, price, availability, actions);
  return card;
}

function updateShopCounters() {
  document.querySelectorAll('[data-cart-count]').forEach((node) => {
    node.textContent = String(getCartCount());
  });
  document.querySelectorAll('[data-favorite-count]').forEach((node) => {
    node.textContent = String(getFavorites().length);
  });
  document.querySelectorAll('[data-action="toggle-favorite"]').forEach((button) => {
    const id = Number(button.dataset.productId);
    const selected = isFavorite(id);
    const item = findProductById(products, id);
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', selected ? `Убрать из избранного: ${item.title}` : `В избранное: ${item.title}`);
    button.textContent = selected ? '♥' : '♡';
  });
}

function showShopNotice(text) {
  const notice = document.getElementById('shop-notice');
  if (!notice) return;
  const message = document.createElement('span');
  message.textContent = text;
  const close = document.createElement('button');
  close.className = 'shop-notice__close';
  close.type = 'button';
  close.dataset.action = 'hide-notice';
  close.setAttribute('aria-label', 'Закрыть сообщение');
  close.textContent = '×';
  notice.replaceChildren(message, close);
  notice.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.site-nav__toggle');
  const navigation = document.getElementById('site-navigation');
  if (menuButton && navigation) {
    const closeMenu = (focusButton = false) => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
      if (focusButton) menuButton.focus();
    };
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      navigation.classList.toggle('is-open', !expanded);
    });
    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
    window.matchMedia('(min-width: 768px)').addEventListener('change', () => closeMenu());
  }

  const filterDisclosure = document.querySelector('.catalog-filter-disclosure');
  if (filterDisclosure) {
    const wide = window.matchMedia('(min-width: 1024px)');
    const update = () => { filterDisclosure.open = wide.matches; };
    update();
    wide.addEventListener('change', update);
  }

  // Для обратной связи используется нативная проверка, заказ проверяется в validation.js.
  document.querySelectorAll('.js-demo-form').forEach((form) => {
    const status = form.nextElementSibling?.classList.contains('success-message')
      ? form.nextElementSibling : null;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      form.querySelectorAll('[aria-invalid="true"]').forEach((field) => field.removeAttribute('aria-invalid'));
      if (status) status.hidden = true;
      if (!form.checkValidity()) {
        form.querySelectorAll('input, textarea').forEach((field) => {
          if (!field.checkValidity()) field.setAttribute('aria-invalid', 'true');
        });
        form.reportValidity();
        return;
      }
      if (status) {
        status.hidden = false;
        status.focus();
      }
      form.reset();
    });
    form.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
    });
  });

  const dialog = document.getElementById('order-dialog');
  const openDialog = document.getElementById('open-callback-dialog');
  const closeDialog = document.getElementById('close-order-dialog');
  if (dialog && openDialog) {
    openDialog.addEventListener('click', () => {
      const status = dialog.querySelector('.success-message');
      if (status) status.hidden = true;
      dialog.showModal();
    });
    if (closeDialog) closeDialog.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => openDialog.focus());
  }

  const map = document.querySelector('.map-container');
  if (map) {
    const labelMap = () => {
      const frame = map.querySelector('iframe');
      if (!frame) return false;
      frame.title = 'Карта расположения магазина SpookyShop';
      frame.loading = 'lazy';
      return true;
    };
    if (!labelMap()) {
      const observer = new MutationObserver(() => { if (labelMap()) observer.disconnect(); });
      observer.observe(map, { childList: true, subtree: true });
    }
  }

  const popular = document.querySelector('#popular [data-products-container]');
  if (popular) {
    const featured = products.filter((item) => item.isHit || item.isNew || item.rating >= 4.9).slice(0, 6);
    popular.replaceChildren(...featured.map(createProductCard));
  }

  document.addEventListener('click', (event) => {
    const cartButton = event.target.closest('[data-action="add-to-cart"]');
    if (cartButton) {
      const item = findProductById(products, Number(cartButton.dataset.productId));
      if (item && addToCart(item.id)) showShopNotice(`${item.title} добавлен в корзину.`);
    }
    const favoriteButton = event.target.closest('[data-action="toggle-favorite"]');
    if (favoriteButton) {
      const id = Number(favoriteButton.dataset.productId);
      const item = findProductById(products, id);
      if (item) {
        const added = toggleFavorite(id);
        showShopNotice(added ? `${item.title} добавлен в избранное.` : `${item.title} удалён из избранного.`);
      }
    }
    if (event.target.closest('[data-action="hide-notice"]')) {
      document.getElementById('shop-notice').hidden = true;
    }
  });

  document.addEventListener('cart-updated', updateShopCounters);
  document.addEventListener('favorites-updated', updateShopCounters);
  updateShopCounters();
});
