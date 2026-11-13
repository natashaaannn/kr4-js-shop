(() => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.has('product')
    ? Number(params.get('product'))
    : 1;

  const selectedProduct = products.find((item) => item.id === productId);

  if (!selectedProduct) {
    window.location.replace('catalog.html');
    return;
  }

  const title = document.querySelector('.product-detail__title');
  const description = document.querySelector('.product-detail__description');
  const price = document.querySelector('.product-detail__price');
  const image = document.querySelector('.product-detail__image');
  const picture = document.querySelector('.product-detail__image-wrapper picture');
  const orderLink = document.querySelector('.product-detail__button');
  const breadcrumb = document.querySelector('.breadcrumbs__current');

  title.textContent = selectedProduct.title;
  description.textContent = selectedProduct.description;

  const finalPrice = calculateFinalPrice(
    selectedProduct.price,
    selectedProduct.discountPercent
  );

  price.textContent = `Цена: ${formatPrice(finalPrice)}`;

  if (selectedProduct.id !== 1) {
    picture.querySelectorAll('source').forEach((source) => source.remove());
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');
  }

  image.src = selectedProduct.image;
  image.alt = selectedProduct.title;

  breadcrumb.textContent = selectedProduct.title;
  document.title = `${selectedProduct.title} — SpookyShop`;

  const availability = document.createElement('p');
  availability.classList.add('product-detail__description');
  availability.textContent = selectedProduct.isAvailable
    ? 'В наличии'
    : 'Нет в наличии';

  orderLink.before(availability);

  if (selectedProduct.isAvailable) {
    orderLink.href = `order.html?product=${selectedProduct.id}`;
  } else {
    orderLink.removeAttribute('href');
    orderLink.textContent = 'Нет в наличии';
    orderLink.setAttribute('aria-disabled', 'true');
    orderLink.style.opacity = '0.5';
  }

  const mobileSpecs = document.querySelector('.product-specs-mobile');
  const specsTable = document.querySelector('.table-wrapper');

  if (selectedProduct.id !== 1) {
    mobileSpecs.hidden = true;
    specsTable.hidden = true;
  }
})();
