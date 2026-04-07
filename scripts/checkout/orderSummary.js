import {
  cart,
  removeFromCart,
  cartQuantityCheckout,
  updateCartItemQuantity,
  saveToStorage,
} from '../../data/cart.js';

import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
import { deliveryOptions, getDeliveryOption} from '../../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentSummary.js';


export function renderOrderSummary() {
  let cartSummaryHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    
  
    if (!matchingProduct) return;

    // Если у cartItem нет deliveryOptionId — ставим первую опцию
    if (!cartItem.deliveryOptionId) {
      cartItem.deliveryOptionId = deliveryOptions[0].id;
      saveToStorage();
    }

    // Найдём выбранную опцию доставки, чтобы посчитать дату сверху
    const selectedDeliveryOption =
      deliveryOptions.find((opt) => opt.id === cartItem.deliveryOptionId) ||
      deliveryOptions[0];

    const deliveryDateString = dayjs()
      .add(selectedDeliveryOption.deliveryDays, 'days')
      .format('dddd, MMMM, D');

    cartSummaryHTML += `
      <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${deliveryDateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchingProduct.image}">
 
          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProduct.name}
            </div>

            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>

            <div class="product-quantity
              js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>

              <span class="update-quantity-link link-primary">
                Update
              </span>

              <span
                class="delete-quantity-link link-primary js-delete-link"
                data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          ${deliveryOptionHTML(matchingProduct, cartItem)}
        </div>
      </div>
    `;
  });

  const container = document.querySelector('.js-order-summary');
  if (!container) return;
  container.innerHTML = cartSummaryHTML;

  setupDeleteLinks();
  setupUpdateQuantityLinks();
  setupDeliveryOptionInputs();
}

function deliveryOptionHTML(matchingProduct, cartItem) {
  let html = `
    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
  `;

  deliveryOptions.forEach((deliveryOption) => {
    const dateString = dayjs()
      .add(deliveryOption.deliveryDays, 'days')
      .format('dddd, MMMM, D');

    const priceString =
      deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)}`;

    const isChecked =
      deliveryOption.id === cartItem.deliveryOptionId ? 'checked' : '';

    const inputId = `delivery-${matchingProduct.id}-${deliveryOption.id}`;

    html += `
      <label class="delivery-option" for="${inputId}">
        <input
          id="${inputId}"
          type="radio"
          class="delivery-option-input js-delivery-option-input"
          name="delivery-option-${matchingProduct.id}"
          value="${deliveryOption.id}"
          data-product-id="${matchingProduct.id}"
          data-delivery-days="${deliveryOption.deliveryDays}"
          ${isChecked}
        >
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} - Shipping
          </div>
        </div>
      </label>
    `;

  });

  html += `</div>`;
  return html;
}

function setupDeleteLinks() {
  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;

      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      if (container) container.remove();

      cartQuantityCheckout();
      renderPaymentSummary();
    });
  });
}

function setupUpdateQuantityLinks() {
  document.querySelectorAll('.update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (link.dataset.editing === '1') return;
      link.dataset.editing = '1';

      const container = link.closest('.cart-item-container');
      const quantityLabel = container.querySelector('.quantity-label');
      const quantity = quantityLabel.textContent;

      link.innerHTML = `
        <input class="quantity-input" type="number" value="${quantity}">
        <span class="save-quantity-link link-primary">Save</span>
      `;

      const inputElement = link.querySelector('.quantity-input');
      const saveElement = link.querySelector('.save-quantity-link');

      inputElement.focus();

      function save() {
        const newQuantity = Number(inputElement.value);
        const productId =
          container.querySelector('.js-delete-link').dataset.productId;


        if (Number.isNaN(newQuantity) || newQuantity < 0) {
          alert('Not a valid quantity');
          return;
        }

        if (newQuantity === 0) {
          removeFromCart(productId);
          container.remove();
        } else {
          updateCartItemQuantity(productId, newQuantity);
          quantityLabel.textContent = newQuantity;
        }

        cartQuantityCheckout();
        link.innerHTML = 'Update';
        link.dataset.editing = '';
      }

      saveElement.addEventListener('click', (e) => {
        e.stopPropagation();
        save();
        renderPaymentSummary()
      });

      inputElement.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          save();
          renderPaymentSummary()
        }
      });
    });
  });
}

function setupDeliveryOptionInputs() {
  document.querySelectorAll('.js-delivery-option-input').forEach((input) => {
    input.addEventListener('change', (e) => {
      const productId = e.currentTarget.dataset.productId;
      const deliveryOptionId = e.currentTarget.value;
      const deliveryDays = Number(e.currentTarget.dataset.deliveryDays);

      const cartItem = cart.find((item) => item.productId === productId);
      if (!cartItem) return;

      cartItem.deliveryOptionId = deliveryOptionId;
      saveToStorage();

      // дата
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      if (!container) return;

      const deliveryDateString = dayjs()
        .add(deliveryDays, 'days')
        .format('dddd, MMMM, D');

      container.querySelector('.delivery-date').innerHTML = `Delivery date: ${deliveryDateString}`;
      console.log('CHANGED TO:', e.currentTarget.value);


      renderPaymentSummary();
    });

  });
}
