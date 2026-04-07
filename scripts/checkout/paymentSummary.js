import {cart, cartQuantityCheckout} from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { getDeliveryOption } from '../../data/deliveryOption.js';
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
  let producPriceCents = 0;
  let shippingPriceCents = 0;
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    if (!product) return;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    if (!deliveryOption) return;

    producPriceCents += product.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryOption.priceCents;
    cartQuantity += cartItem.quantity;
  });

  const totalBeforeTaxCents = producPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = `
    
          <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$
            ${formatCurrency(producPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$
              ${formatCurrency(shippingPriceCents)}
            </div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$
              ${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$
              ${formatCurrency(taxCents)}
            </div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$
              ${formatCurrency(totalCents)}
            </div>
          </div>

          <button class="place-order-button button-primary
            js-place-order">
            Place your order
          </button>
    `;

  const container = document.querySelector('.js-payment-summary');
  if (container) container.innerHTML = paymentSummaryHTML;
  
  document.querySelector('.js-place-order')
    .addEventListener('click', async () => {
      try{
          const response = await fetch('https://supersimplebackend.dev/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cart: cart
        })
      });

      const order = await response.json()
      addOrder(order);
      } catch (error) {
        console.log('Unexpected error. Try again latter')
      }
    
      window.location.href = 'orders.html';
    });

  cartQuantityCheckout();
}