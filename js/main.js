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

  const filterDisclosure = document.querySelector('.catalog-filter-disclosure');

  if (filterDisclosure) {
    const wideScreen = window.matchMedia('(min-width: 1024px)');
    const updateDisclosure = () => {
      filterDisclosure.open = wideScreen.matches;
    };
    updateDisclosure();
    wideScreen.addEventListener('change', updateDisclosure);
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
    if (form.id === 'order-form') {
      return;
    }
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

const popularCards = document.querySelectorAll('#popular .product-card');

popularCards.forEach((card) => {
  const title = card.querySelector('.product-card__title')?.textContent.trim();
  const item = products.find((product) => product.title === title);

  if (!item) {
    card.remove();
    return;
  }

  const link = card.querySelector('.product-card__button');
  const price = card.querySelector('.product-card__price');

  if (link) {
    link.href = `product.html?product=${item.id}`;
  }

  if (price) {
    const finalPrice = calculateFinalPrice(item.price, item.discountPercent);
    price.textContent = `Цена: ${formatPrice(finalPrice)}`;
  }
});
