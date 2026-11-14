// Одна страница товара для всех десяти позиций.
const params = new URLSearchParams(window.location.search);
const requestedId = params.has('product') ? Number(params.get('product')) : 1;
const selectedProduct = findProductById(products, requestedId);

if (!selectedProduct) {
  const content = document.querySelector('.product-detail');
  content.replaceChildren();
  const title = document.createElement('h1');
  title.className = 'product-detail__title';
  title.textContent = 'Товар не найден';
  const link = document.createElement('a');
  link.className = 'button button--primary';
  link.href = 'catalog.html';
  link.textContent = 'Вернуться в каталог';
  content.append(title, link);
  document.querySelector('.product-specs-mobile').hidden = true;
  document.querySelector('.table-wrapper').hidden = true;
  document.querySelector('.breadcrumbs__current').textContent = 'Товар не найден';
} else {
  document.querySelector('.product-detail__title').textContent = selectedProduct.title;
  document.querySelector('.product-detail__description').textContent = selectedProduct.description;
  const priceElement = document.querySelector('.product-detail__price');
  priceElement.textContent = formatPrice(calculateFinalPrice(selectedProduct.price, selectedProduct.discountPercent));
  if (selectedProduct.discountPercent > 0) {
    const previous = document.createElement('s');
    previous.className = 'product-card__old-price';
    previous.textContent = formatPrice(selectedProduct.price);
    priceElement.prepend(previous);
  }

  const image = document.querySelector('.product-detail__image');
  const picture = document.querySelector('.product-detail__image-wrapper picture');
  const base = selectedProduct.image.replace('.webp', '');
  const source = picture.querySelector('source');
  source.srcset = selectedProduct.id === 7
    ? `${base}-240.webp 240w, ${selectedProduct.image} 400w`
    : `${base}-480.webp 480w, ${base}-960.webp 960w, ${selectedProduct.image} 1024w`;
  source.sizes = '(max-width: 1023px) 100vw, 400px';
  image.removeAttribute('srcset');
  image.removeAttribute('sizes');
  image.src = selectedProduct.image;
  image.alt = selectedProduct.title;
  image.width = 800;
  image.height = 800;

  const info = document.querySelector('.product-detail__info');
  const availability = document.createElement('p');
  availability.className = 'product-card__availability';
  availability.textContent = getAvailabilityText(selectedProduct.isAvailable) + ' · ★ ' + selectedProduct.rating;
  priceElement.after(availability);

  const orderLink = document.querySelector('.product-detail__button');
  if (selectedProduct.isAvailable) {
    orderLink.href = `cart.html?product=${selectedProduct.id}`;
  } else {
    orderLink.removeAttribute('href');
    orderLink.textContent = 'Нет в наличии';
    orderLink.setAttribute('aria-disabled', 'true');
  }

  const actions = document.createElement('div');
  actions.className = 'product-detail__actions';
  const buy = document.createElement('button');
  buy.className = 'button button--primary';
  buy.type = 'button';
  buy.dataset.action = 'add-to-cart';
  buy.dataset.productId = String(selectedProduct.id);
  buy.textContent = selectedProduct.isAvailable ? 'В корзину' : 'Нет в наличии';
  buy.disabled = !selectedProduct.isAvailable;
  const favorite = document.createElement('button');
  favorite.className = 'button button--secondary product-favorite';
  favorite.type = 'button';
  favorite.dataset.action = 'toggle-favorite';
  favorite.dataset.productId = String(selectedProduct.id);
  favorite.textContent = isFavorite(selectedProduct.id) ? '♥' : '♡';
  actions.append(buy, favorite, orderLink);
  info.append(actions);

  document.querySelector('.breadcrumbs__current').textContent = selectedProduct.title;
  document.title = `${selectedProduct.title} — SpookyShop`;
  document.querySelector('meta[name="description"]').content = selectedProduct.description;
  // Одна таблица характеристик для любого товара: данные берутся из products.
  const characteristics = [
    ['Категория', categoryNames[selectedProduct.category]],
    ['Особенности', selectedProduct.feature],
    ['Рейтинг', `${selectedProduct.rating} из 5`],
    ['Наличие', getAvailabilityText(selectedProduct.isAvailable)]
  ];
  if (selectedProduct.discountPercent > 0) {
    characteristics.push(['Скидка', `${selectedProduct.discountPercent}%`]);
  }

  const mobileSpecs = document.querySelector('.product-specs-mobile');
  const specsBody = document.querySelector('.product-table tbody');
  mobileSpecs.replaceChildren();
  specsBody.replaceChildren();

  characteristics.forEach(([name, value]) => {
    const row = document.createElement('tr');
    row.className = 'product-table__row';
    const header = document.createElement('th');
    header.className = 'product-table__td product-table__property';
    header.scope = 'row';
    header.textContent = name;
    const cell = document.createElement('td');
    cell.className = 'product-table__td';
    cell.textContent = value;
    row.append(header, cell);
    specsBody.append(row);

    const detail = document.createElement('div');
    detail.className = 'product-specs-mobile__item';
    const term = document.createElement('dt');
    term.textContent = name;
    const description = document.createElement('dd');
    description.textContent = value;
    detail.append(term, description);
    mobileSpecs.append(detail);
  });
}
