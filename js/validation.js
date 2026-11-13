const orderForm = document.querySelector('#order-form');

if (orderForm) {
  const productInput = orderForm.querySelector('#order-select-product');
  const nameInput = orderForm.querySelector('#full-order-name');
  const emailInput = orderForm.querySelector('#full-order-email');
  const phoneInput = orderForm.querySelector('#full-order-phone');
  const dateInput = orderForm.querySelector('#full-order-date');
  const agreementInput = orderForm.querySelector('#full-order-agreement');

  const productError = orderForm.querySelector('#order-product-error');
  const nameError = orderForm.querySelector('#order-name-error');
  const emailError = orderForm.querySelector('#order-email-error');
  const phoneError = orderForm.querySelector('#order-phone-error');
  const dateError = orderForm.querySelector('#order-date-error');
  const agreementError = orderForm.querySelector('#order-agreement-error');

  const formMessage = orderForm.querySelector('.form-message');

products.forEach((item) => {
  const option = document.createElement('option');

  option.value = String(item.id);
  option.textContent = item.isAvailable
    ? item.title
    : `${item.title} — нет в наличии`;

  option.disabled = !item.isAvailable;

  productInput.append(option);
});

const selectedId = new URLSearchParams(window.location.search).get('product');

if (selectedId) {
  const selectedProduct = products.find((item) =>
    item.id === Number(selectedId) && item.isAvailable
  );

  if (selectedProduct) {
    productInput.value = String(selectedProduct.id);
  }
}

  function showError(input, errorElement, message) {
    errorElement.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorElement.id);
  }

  function clearError(input, errorElement) {
    errorElement.textContent = '';
    input.removeAttribute('aria-invalid');
  }

function validateName() {
  const value = nameInput.value.trim();

  if (value.length < 2) {
    showError(nameInput, nameError, 'Введите имя не короче 2 символов.');
    return false;
  }

  clearError(nameInput, nameError);
  return true;
}

function validateEmail() {
  const value = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    showError(emailInput, emailError, 'Введите корректный e-mail.');
    return false;
  }

  clearError(emailInput, emailError);
  return true;
}

function validatePhone() {
  const digits = phoneInput.value.replace(/\D/g, '');

  if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
    showError(phoneInput, phoneError, 'Введите корректный номер телефона.');
    return false;
  }

  clearError(phoneInput, phoneError);
  return true;
}

function validateProduct() {
  if (productInput.value === '') {
    showError(productInput, productError, 'Выберите товар.');
    return false;
  }

  clearError(productInput, productError);
  return true;
}

function validateDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDate = new Date(dateInput.value + 'T00:00:00');

  if (!dateInput.value || selectedDate < today) {
    showError(dateInput, dateError, 'Выберите сегодняшнюю или будущую дату.');
    return false;
  }

  clearError(dateInput, dateError);
  return true;
}

function validateAgreement() {
  if (!agreementInput.checked) {
    showError(agreementInput, agreementError, 'Необходимо согласие на обработку данных.');
    return false;
  }

  clearError(agreementInput, agreementError);
  return true;
}

orderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const results = [
    validateProduct(),
    validateName(),
    validateEmail(),
    validatePhone(),
    validateDate(),
    validateAgreement()
  ];

  if (results.includes(false)) {
    formMessage.textContent = 'Проверьте правильность заполнения формы.';
    return;
  }

  formMessage.textContent = 'Заявка успешно проверена!';
  orderForm.reset();

  console.log('Форма заказа успешно прошла проверку.');
});

productInput.addEventListener('change', validateProduct);
nameInput.addEventListener('input', validateName);
emailInput.addEventListener('input', validateEmail);
phoneInput.addEventListener('input', validatePhone);
dateInput.addEventListener('change', validateDate);
agreementInput.addEventListener('change', validateAgreement);
}