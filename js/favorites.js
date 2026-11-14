// Избранное: отдельная страница для товаров, отмеченных сердечком.
const favoritesGrid = document.querySelector('#favorites-grid');
const favoritesEmpty = document.querySelector('#favorites-empty');

function renderFavorites() {
  const favoriteIds = getFavorites();
  const chosen = products.filter((item) => favoriteIds.includes(item.id));
  favoritesGrid.replaceChildren(...chosen.map(createProductCard));
  favoritesEmpty.hidden = chosen.length !== 0;
  favoritesGrid.hidden = chosen.length === 0;
}

document.addEventListener('favorites-updated', renderFavorites);
renderFavorites();
