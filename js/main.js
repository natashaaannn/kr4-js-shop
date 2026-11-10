document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.site-nav__toggle');
  const navigation = document.getElementById('site-navigation');

  if (menuButton && navigation) {
    const closeMenu = (restoreFocus = false) => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
      if (restoreFocus) menuButton.focus();
    };

    menuButton.addEventListener('click', () => {
      const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isExpanded));
      navigation.classList.toggle('is-open', !isExpanded);
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu(true);
      }
    });

    document.addEventListener('click', (event) => {
      if (!navigation.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', () => closeMenu());
  }

  const filters = document.getElementById('catalog-filter-form');
  const filterDisclosure = document.querySelector('.catalog-filter-disclosure');

  if (filterDisclosure) {
    const wideScreen = window.matchMedia('(min-width: 1024px)');
    const updateDisclosure = () => {
      filterDisclosure.open = wideScreen.matches;
    };
    updateDisclosure();
    wideScreen.addEventListener('change', updateDisclosure);
  }

  if (filters) {
    const cards = Array.from(document.querySelectorAll('.catalog-products .product-card'));
    const count = document.getElementById('catalog-results-count');
    const empty = document.getElementById('catalog-empty');

    const filterCards = () => {
      const selectedTypes = Array.from(filters.querySelectorAll('[name="type"]:checked'), (input) => input.value);
      const selectedStatuses = Array.from(filters.querySelectorAll('[name="status"]:checked'), (input) => input.value);
      const fromField = filters.querySelector('[name="price-from"]');
      const toField = filters.querySelector('[name="price-to"]');
      const minPrice = fromField.value === '' ? 0 : Number(fromField.value);
      const maxPrice = toField.value === '' ? Infinity : Number(toField.value);

      if (minPrice > maxPrice) {
        toField.setCustomValidity('Максимальная цена должна быть не меньше минимальной.');
        toField.reportValidity();
        return false;
      }
      toField.setCustomValidity('');
      let visible = 0;

      cards.forEach((card) => {
        const price = Number(card.querySelector('.product-card__price').textContent.replace(/[^\d]/g, ''));
        const badge = card.querySelector('.product-card__badge');
        const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.some((status) =>
          badge && badge.classList.contains(`product-card__badge--${status}`));
        const matchesType = selectedTypes.length === 0 || selectedTypes.includes(card.dataset.category);
        const show = matchesType && matchesStatus && price >= minPrice && price <= maxPrice;
        card.hidden = !show;
        if (show) visible += 1;
      });

      count.textContent = `Показано товаров: ${visible} из ${cards.length}`;
      empty.hidden = visible !== 0;
      return true;
    };

    filters.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!filterCards()) return;
      if (filterDisclosure && !window.matchMedia('(min-width: 1024px)').matches) {
        filterDisclosure.open = false;
      }
    });

    filters.querySelector('[name="price-to"]').addEventListener('input', (event) => {
      event.target.setCustomValidity('');
    });

    filters.addEventListener('reset', () => {
      filters.querySelector('[name="price-to"]').setCustomValidity('');
      setTimeout(filterCards, 0);
    });
    filterCards();
  }

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

  document.querySelectorAll('.order-form').forEach((form) => {
    const status = form.nextElementSibling?.classList.contains('success-message')
      ? form.nextElementSibling
      : null;

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      const clearState = () => {
        field.removeAttribute('aria-invalid');
        if (status) status.hidden = true;
      };
      field.addEventListener('input', clearState);
      field.addEventListener('change', clearState);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = Array.from(form.elements).filter((field) => field.willValidate);
      fields.forEach((field) => field.removeAttribute('aria-invalid'));
      if (status) status.hidden = true;

      if (!form.checkValidity()) {
        fields.forEach((field) => {
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
  });

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
      const observer = new MutationObserver(() => {
        if (labelMap()) observer.disconnect();
      });
      observer.observe(map, { childList: true, subtree: true });
    }
  }
});

function formatPrice(price) {
  return price.toLocaleString('ru-RU') + ' ₽';
}

function calculateDiscount(price, discountPercent) {
  return price * discountPercent / 100;
}

function calculateFinalPrice(price, discountPercent) {
  const discountValue = calculateDiscount(price, discountPercent);
  return price - discountValue;
}

function getAvailabilityText(isAvailable) {
  if (isAvailable) {
    return 'В наличии';
  } else {
    return 'Нет в наличии';
  }
}

function getProductDescription(product) {
  return product.title + ' — ' + formatPrice(product.price);
}

console.log('Цена:', formatPrice(product.price));

console.log('Цена со скидкой:', formatPrice(
  calculateFinalPrice(product.price, product.discountPercent)
));

console.log('Наличие:', getAvailabilityText(product.isAvailable));

console.log('Описание:', getProductDescription(product));

console.log('Список товаров SpookyShop:');

for (let i = 0; i < products.length; i++) {
  console.log(`${i + 1}. ${products[i].title}`);
}

console.log('Товары и цены SpookyShop:');

for (const item of products) {
  console.log(`${item.title} — ${formatPrice(item.price)}`);
}

console.log('Наличие товаров SpookyShop:');

products.forEach((item, index) => {
  console.log(`${index + 1}. ${item.title} — ${getAvailabilityText(item.isAvailable)}`);
});

function getProductTitles(products) {
  return products.map((item) => item.title);
}

console.log('Названия товаров SpookyShop:');
console.log(getProductTitles(products));

function getAvailableProducts(products) {
  return products.filter((item) => item.isAvailable);
}

console.log('Товары в наличии:');
console.table(getAvailableProducts(products));

function searchProducts(products, query) {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === '') {
    return products;
  }

  return products.filter((item) => {
    return item.title.toLowerCase().includes(normalizedQuery);
  });
}

console.log('Результаты поиска по слову "костюм":');
console.table(searchProducts(products, 'костюм'));

function filterProductsByCategory(products, category) {
  if (category === 'all') {
    return products;
  }

  return products.filter((item) => {
    return item.category === category;
  });
}

console.log('Товары категории "Декор":');
console.table(filterProductsByCategory(products, 'decor'));

function sortProductsByPrice(products, direction = 'asc') {
  const productsCopy = [...products];

  if (direction === 'desc') {
    return productsCopy.sort((a, b) => b.price - a.price);
  }

  return productsCopy.sort((a, b) => a.price - b.price);
}

console.log('Товары по возрастанию цены:');
console.table(sortProductsByPrice(products, 'asc'));

console.log('Товары по убыванию цены:');
console.table(sortProductsByPrice(products, 'desc'));

function findProductById(products, id) {
  return products.find((item) => item.id === id);
}

console.log('Товар с ID 5:');
console.log(findProductById(products, 5));

console.log('Товар с ID 100:');
console.log(findProductById(products, 100));

function calculateTotalPrice(products) {
  return products.reduce((sum, item) => {
    return sum + item.price;
  }, 0);
}

console.log('Общая стоимость товаров:');
console.log(formatPrice(calculateTotalPrice(products)));

function countAvailableProducts(products) {
  return products.filter((item) => item.isAvailable).length;
}

console.log('Всего товаров:', products.length);
console.log('Товаров в наличии:', countAvailableProducts(products));

function calculateAveragePrice(products) {
  if (products.length === 0) {
    return 0;
  }

  const totalPrice = calculateTotalPrice(products);
  return Math.round(totalPrice / products.length);
}

console.log('Средняя цена товара:');
console.log(formatPrice(calculateAveragePrice(products)));

function getPreparedProducts(products, query, category, sortDirection) {
  let result = [...products];

  result = searchProducts(result, query);
  result = filterProductsByCategory(result, category);
  result = sortProductsByPrice(result, sortDirection);

  return result;
}

console.log('Результат объединённого поиска:');
console.table(getPreparedProducts(products, 'ведьм', 'decor', 'asc'));

console.log('Цена больше 2000 ₽:', product.price > 2000);

console.log('Цена равна 2490 ₽:', product.price === 2490);

console.log('Есть скидка:', product.discountPercent !== 0);

console.log('Можно заказать:', product.price > 0 && product.isAvailable);

console.log('Есть скидка или высокий рейтинг:',
  product.discountPercent > 0 || product.rating >= 4.5);

console.log('Товар отсутствует:', !product.isAvailable);

const messageElement = document.querySelector('.js-message');

if (messageElement) {
  messageElement.textContent = 'JavaScript подключён корректно!';
}

const productOutputElement = document.querySelector('.product-output');

if (productOutputElement) {
  productOutputElement.textContent = [
    `Всего товаров: ${products.length}`,
    `Товаров в наличии: ${countAvailableProducts(products)}`,
    `Средняя цена: ${formatPrice(calculateAveragePrice(products))}`,
    `Результатов поиска "костюм": ${searchProducts(products, 'костюм').length}`
  ].join('\n');
}

