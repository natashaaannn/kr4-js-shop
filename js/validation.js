// Форма единого оформления корзины. Данные клиента не отправляются и не сохраняются.
const orderForm = document.querySelector('#order-form');

if (orderForm) {
  const nameInput = orderForm.querySelector('#full-order-name');
  const emailInput = orderForm.querySelector('#full-order-email');
  const phoneInput = orderForm.querySelector('#full-order-phone');
  const dateInput = orderForm.querySelector('#full-order-date');
  const agreementInput = orderForm.querySelector('#full-order-agreement');
  const formMessage = orderForm.querySelector('.form-message');
  const successMessage = document.querySelector('#checkout-success');

  const fields = [
    { input: nameInput, error: document.querySelector('#order-name-error') },
    { input: emailInput, error: document.querySelector('#order-email-error') },
    { input: phoneInput, error: document.querySelector('#order-phone-error') },
    { input: dateInput, error: document.querySelector('#order-date-error') },
    { input: agreementInput, error: document.querySelector('#order-agreement-error') }
  ];

  function showError(input, element, message) {
    element.textContent = message;
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', element.id);
  }

  function clearError(input, element) {
    element.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }

  function validateName() {
    if (nameInput.value.trim().length < 2) {
      showError(nameInput, fields[0].error, 'Введите имя не короче двух символов.');
      return false;
    }
    clearError(nameInput, fields[0].error);
    return true;
  }

  function validateEmail() {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!pattern.test(emailInput.value.trim())) {
      showError(emailInput, fields[1].error, 'Введите корректный адрес электронной почты.');
      return false;
    }
    clearError(emailInput, fields[1].error);
    return true;
  }

  function validatePhone() {
    const digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length !== 11 || !['7', '8'].includes(digits[0])) {
      showError(phoneInput, fields[2].error, 'Введите 11 цифр номера, начиная с 7 или 8.');
      return false;
    }
    clearError(phoneInput, fields[2].error);
    return true;
  }

  function validateDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dateInput.value + 'T00:00:00');
    if (!dateInput.value || Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
      showError(dateInput, fields[3].error, 'Выберите сегодняшнюю или будущую дату.');
      return false;
    }
    clearError(dateInput, fields[3].error);
    return true;
  }

  function validateAgreement() {
    if (!agreementInput.checked) {
      showError(agreementInput, fields[4].error, 'Необходимо согласие на обработку данных.');
      return false;
    }
    clearError(agreementInput, fields[4].error);
    return true;
  }

  const validators = [validateName, validateEmail, validatePhone, validateDate, validateAgreement];

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const results = validators.map((validate) => validate());

    if (getCartCount() === 0) {
      formMessage.textContent = 'Сначала добавьте товары в корзину.';
      return;
    }
    if (results.includes(false)) {
      formMessage.classList.remove('is-success');
      formMessage.textContent = 'Проверьте выделенные поля и попробуйте ещё раз.';
      const firstInvalid = orderForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const orderTotal = formatPrice(getCartTotal());
    successMessage.textContent = `Заказ на ${orderTotal} оформлен в демонстрационном режиме. Реальная отправка и оплата не выполняются.`;
    successMessage.hidden = false;
    orderForm.reset();
    fields.forEach(({ input, error }) => clearError(input, error));
    formMessage.textContent = '';
    clearCart();
    successMessage.focus();
  });

  fields.forEach(({ input, error }, index) => {
    const eventType = index >= 3 ? 'change' : 'input';
    input.addEventListener(eventType, () => {
      if (error.textContent) validators[index]();
      formMessage.textContent = '';
      formMessage.classList.remove('is-success');
    });
  });
}
