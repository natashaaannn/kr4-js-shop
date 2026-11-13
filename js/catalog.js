
const productsContainer = document.querySelector('[data-products-container]');
const searchInput = document.querySelector('#catalog-search');
const categoryFilter = document.querySelector('#category-filter');
const sortSelect = document.querySelector('#sort-select');
const catalogCount = document.querySelector('#catalog-results-count');
const catalogEmpty = document.querySelector('#catalog-empty');
const filterForm = document.querySelector('#catalog-filter-form');

const categoryNames = {
  costumes: 'Костюмы',
  decor: 'Декор',
  makeup: 'Грим',
  sweets: 'Сладости'
};

function createProductCard(item) {
  const card = document.createElement('article');
  card.classList.add('product-card');
  card.dataset.category = item.category;

  const category = document.createElement('span');
  category.classList.add('product-card__category');
  category.textContent = categoryNames[item.category];

  const image = document.createElement('img');
  image.classList.add('product-card__image');
  image.src = item.image;
  image.alt = item.title;
  image.loading = 'lazy';

  const title = document.createElement('h3');
  title.classList.add('product-card__title');
  title.textContent = item.title;

  const description = document.createElement('p');
  description.classList.add('product-card__description');
  description.textContent = item.description;

  const price = document.createElement('p');
  price.classList.add('product-card__price');
  price.textContent = `Цена: ${item.price.toLocaleString('ru-RU')} ₽`;

  const availability = document.createElement('p');
  availability.classList.add('product-card__description');
  availability.textContent = item.isAvailable
    ? 'В наличии'
    : 'Нет в наличии';

  const link = document.createElement('a');
  link.classList.add('button', 'button--primary', 'product-card__button');
  link.href = `product.html?product=${item.id}`;
  link.textContent = 'Подробнее';

  card.append(category, image, title, description, price, availability, link);

  return card;
}

const catalogState = {
  query: '',
  category: 'all',
  sort: 'default',
  types: [],
  statuses: [],
  minPrice: 0,
  maxPrice: Infinity
};


function getVisibleProducts() {
  let result = searchProducts(products, catalogState.query);

  result = filterProductsByCategory(result, catalogState.category);

  if (catalogState.types.length > 0) {
    result = result.filter((item) =>
      catalogState.types.includes(item.category)
    );
  }

  if (catalogState.statuses.length > 0) {
    result = result.filter((item) =>
      catalogState.statuses.some((status) => {
        if (status === 'discount') {
          return item.discountPercent > 0;
        }

        if (status === 'hit') {
          return item.isHit === true;
        }

        if (status === 'new') {
          return item.isNew === true;
        }

        return false;
      })
    );
  }

  result = result.filter((item) =>
    item.price >= catalogState.minPrice &&
    item.price <= catalogState.maxPrice
  );

  if (catalogState.sort === 'price-asc') {
    result = sortProductsByPrice(result, 'asc');
  } else if (catalogState.sort === 'price-desc') {
    result = sortProductsByPrice(result, 'desc');
  } else if (catalogState.sort === 'title-asc') {
    result = [...result].sort((a, b) =>
      a.title.localeCompare(b.title, 'ru')
    );
  }

  return result;
}


function renderProducts() {
  if (!productsContainer) {
    return;
  }

  const visibleProducts = getVisibleProducts();
  const cards = visibleProducts.map(createProductCard);

  productsContainer.replaceChildren(...cards);

  if (catalogCount) {
    catalogCount.textContent =
      `Показано товаров: ${visibleProducts.length} из ${products.length}`;
  }

  if (catalogEmpty) {
    catalogEmpty.hidden = visibleProducts.length !== 0;
  }
}

if (searchInput) {
  searchInput.addEventListener('input', (event) => {
    catalogState.query = event.target.value;
    renderProducts();
  });
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', (event) => {
    catalogState.category = event.target.value;
    renderProducts();
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', (event) => {
    catalogState.sort = event.target.value;
    renderProducts();
  });
}

if (filterForm) {
  filterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const fromField = filterForm.querySelector('[name="price-from"]');
    const toField = filterForm.querySelector('[name="price-to"]');

    const minPrice = fromField.value === '' ? 0 : Number(fromField.value);
    const maxPrice = toField.value === '' ? Infinity : Number(toField.value);

    if (minPrice > maxPrice) {
      toField.setCustomValidity('Максимальная цена должна быть не меньше минимальной.');
      toField.reportValidity();
      return;
    }

    toField.setCustomValidity('');

    catalogState.types = Array.from(
      filterForm.querySelectorAll('[name="type"]:checked'),
      (input) => input.value
    );

    catalogState.statuses = Array.from(
      filterForm.querySelectorAll('[name="status"]:checked'),
      (input) => input.value
    );

    catalogState.minPrice = minPrice;
    catalogState.maxPrice = maxPrice;

    renderProducts();
  });

  filterForm.addEventListener('reset', () => {
    catalogState.types = [];
    catalogState.statuses = [];
    catalogState.minPrice = 0;
    catalogState.maxPrice = Infinity;

    filterForm.querySelector('[name="price-to"]').setCustomValidity('');
    renderProducts();
  });

  filterForm.querySelector('[name="price-to"]').addEventListener('input', (event) => {
    event.target.setCustomValidity('');
  });
}

renderProducts();
