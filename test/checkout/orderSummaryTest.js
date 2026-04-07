import { renderOrderSummary } from "../../scripts/checkout/orderSummery.js";
import {loadFromStorage } from "../../data/cart.js";
import { loadProducts, loadProductsFetch} from "../../data/products.js";

describe('test suite: renderOrderSummary', () => {
  it('displays the cart', () => {
    document.querySelector('.js-test-container').innerHTML = `
      <div class="js-order-summary"></div>
    `;
    const productId1 = '11ieqsfgssa-15697-fae4-24h2hasgjt323c2'
    const productId2 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6'

    beforeAll((done) => {
      loadProductsFetch().then(() => {
        done();   
      });                  
    });


    beforeEach(() => {
      spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify([
        {
        productId: productId1,
        quantity: 2,
        deliveryOption: '1'
      },
      {
        productId: productId2,
        quantity: 1,
        deliveryOption: '2'
      }
      ]));
      loadFromStorage();
      renderOrderSummary();
    });
    

    expect(
      document.querySelectorAll('.cart-item-container').length
    ).toEqual(2);

    expect(
      document.querySelector(`.js-cart-item-container-${productId1} .quantity-label`).textContent
    ).toEqual('2');

    expect(
      document.querySelector(`.js-cart-item-container-${productId2} .quantity-label`).textContent
    ).toEqual('1');
  });
  
  it('removes product when delete is clicked', () => {
  document.querySelector('.js-test-container').innerHTML = `
    <div class="js-order-summary"></div>
  `;

  const productId1 = '11ieqsfgssa-15697-fae4-24h2hasgjt323c2';

  spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify([
    {
      productId: productId1,
      quantity: 2,
      deliveryOptionId: '1'
    }
  ]));

  loadFromStorage();
  renderOrderSummary();

  // Проверяем, что товар есть
  expect(document.querySelectorAll('.cart-item-container').length).toEqual(1);

  // Кликаем delete
  document.querySelector('.js-delete-link').click();

  // Проверяем, что удалился из DOM
  expect(document.querySelectorAll('.cart-item-container').length).toEqual(0);
});

it('updates quantity when save is clicked', () => {
  document.querySelector('.js-test-container').innerHTML = `
    <div class="js-order-summary"></div>
  `;

  const productId1 = '11ieqsfgssa-15697-fae4-24h2hasgjt323c2';

  spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify([
    {
      productId: productId1,
      quantity: 2,
      deliveryOptionId: '1'
    }
  ]));

  loadFromStorage();
  renderOrderSummary();

  // Нажимаем Update
  document.querySelector('.update-quantity-link').click();

  // Меняем значение input
  const input = document.querySelector('.quantity-input');
  input.value = '5';

  // Нажимаем Save
  document.querySelector('.save-quantity-link').click();

  // Проверяем, что количество обновилось в DOM
  expect(
    document.querySelector(
      `.js-cart-item-container-${productId1} .quantity-label`
    ).textContent
  ).toEqual('5');
});


});