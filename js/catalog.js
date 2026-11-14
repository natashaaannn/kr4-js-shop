// Каталог: состояние фильтров, поиск, сортировка, избранное и рендер DOM.
const productsContainer = document.querySelector('[data-products-container]');

if (productsContainer) {
  const searchInput = document.querySelector('#catalog-search');
  const categoryFilter = document.querySelector('#category-filter');
  const sortSelect = document.querySelector('#sort-select');
  const catalogCount = document.querySelector('#catalog-results-count');
  const catalogEmpty = document.querySelector('#catalog-empty');
  const filterForm = document.querySelector('#catalog-filter-form');
  const favoritesButton = document.querySelector('#favorites-filter');
  const resetButton = document.querySelector('#reset-catalog');

  const catalogState = {
    query: '', category: 'all', sort: 'default', statuses: [],
    minPrice: 0, maxPrice: Infinity,
    favoritesOnly: new URLSearchParams(window.location.search).get('favorites') === '1'
  };

  function getVisibleProducts() {
    let result = searchProducts(products, catalogState.query);
    result = filterProductsByCategory(result, catalogState.category);

    if (catalogState.favoritesOnly) {
      result = result.filter((item) => isFavorite(item.id));
    }
    if (catalogState.statuses.length) {
      result = result.filter((item) => catalogState.statuses.some((status) => {
        if (status === 'discount') return item.discountPercent > 0;
        if (status === 'hit') return item.isHit;
        if (status === 'new') return item.isNew;
        return false;
      }));
    }
    result = result.filter((item) => {
      const price = calculateFinalPrice(item.price, item.discountPercent);
      return price >= catalogState.minPrice && price <= catalogState.maxPrice;
    });

    if (catalogState.sort === 'price-asc') result = sortProductsByPrice(result, 'asc');
    if (catalogState.sort === 'price-desc') result = sortProductsByPrice(result, 'desc');
    if (catalogState.sort === 'title-asc') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'ru'));
    }
    return result;
  }

  function renderProducts() {
    const visibleProducts = getVisibleProducts();
    productsContainer.replaceChildren(...visibleProducts.map(createProductCard));
    catalogCount.textContent = `Показано товаров: ${visibleProducts.length} из ${products.length}`;
    catalogEmpty.hidden = visibleProducts.length > 0;
    if (visibleProducts.length === 0) {
      catalogEmpty.textContent = catalogState.favoritesOnly && getFavorites().length === 0
        ? 'В избранном пока ничего нет. Нажмите ♡ на понравившихся товарах.'
        : 'По выбранным параметрам товаров нет. Измените поиск или сбросьте фильтры.';
    }
    favoritesButton.classList.toggle('is-selected', catalogState.favoritesOnly);
    favoritesButton.setAttribute('aria-pressed', String(catalogState.favoritesOnly));
    favoritesButton.textContent = catalogState.favoritesOnly ? '♥ Только избранное' : '♡ Только избранное';
  }

  function resetAllFilters() {
    catalogState.query = '';
    catalogState.category = 'all';
    catalogState.sort = 'default';
    catalogState.statuses = [];
    catalogState.minPrice = 0;
    catalogState.maxPrice = Infinity;
    catalogState.favoritesOnly = false;
    searchInput.value = '';
    categoryFilter.value = 'all';
    sortSelect.value = 'default';
    filterForm.reset();
    filterForm.querySelector('[name="price-to"]').setCustomValidity('');
    renderProducts();
  }

  searchInput.addEventListener('input', (event) => {
    catalogState.query = event.target.value;
    renderProducts();
  });
  categoryFilter.addEventListener('change', (event) => {
    catalogState.category = event.target.value;
    renderProducts();
  });
  sortSelect.addEventListener('change', (event) => {
    catalogState.sort = event.target.value;
    renderProducts();
  });
  favoritesButton.addEventListener('click', () => {
    catalogState.favoritesOnly = !catalogState.favoritesOnly;
    renderProducts();
  });
  resetButton.addEventListener('click', resetAllFilters);

  filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const fromField = filterForm.querySelector('[name="price-from"]');
    const toField = filterForm.querySelector('[name="price-to"]');
    const minPrice = fromField.value === '' ? 0 : Number(fromField.value);
    const maxPrice = toField.value === '' ? Infinity : Number(toField.value);
    toField.setCustomValidity('');
    if (!filterForm.checkValidity()) {
      filterForm.reportValidity();
      return;
    }
    if (minPrice > maxPrice) {
      toField.setCustomValidity('Максимальная цена должна быть не меньше минимальной.');
      toField.reportValidity();
      return;
    }
    toField.setCustomValidity('');
    catalogState.statuses = Array.from(filterForm.querySelectorAll('[name="status"]:checked'), (field) => field.value);
    catalogState.minPrice = minPrice;
    catalogState.maxPrice = maxPrice;
    renderProducts();
  });
  filterForm.addEventListener('reset', () => {
    catalogState.statuses = [];
    catalogState.minPrice = 0;
    catalogState.maxPrice = Infinity;
    filterForm.querySelector('[name="price-to"]').setCustomValidity('');
    // Событие reset происходит до сброса полей браузером, а состояние уже обновлено.
    renderProducts();
  });
  filterForm.querySelector('[name="price-to"]').addEventListener('input', (event) => {
    event.target.setCustomValidity('');
  });
  filterForm.querySelector('[name="price-from"]').addEventListener('input', () => {
    filterForm.querySelector('[name="price-to"]').setCustomValidity('');
  });
  document.addEventListener('favorites-updated', renderProducts);
  renderProducts();
}
