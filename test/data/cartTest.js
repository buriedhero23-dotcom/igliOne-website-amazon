import { addToCart, cart, loadFromStorage } from '../../data/cart.js';

describe('test suite: addToCart', () => {
  let qtyEl;

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.callFake(() => JSON.stringify([]));
    loadFromStorage();
  });

  afterEach(() => {
    if (qtyEl) {
      qtyEl.remove();
      qtyEl = null;
    }
  });

  it('adds a new product to the cart', () => {
    const productId = '11ieqsfgssa-15697-fae4-24h2hasgjt323c2';

    qtyEl = document.createElement('input');
    qtyEl.className = `js-quantity-selector-${productId}`;
    qtyEl.value = '1';
    document.body.appendChild(qtyEl);

    addToCart(productId);

    expect(cart.length).toEqual(1);
    expect(cart[0].productId).toEqual(productId);
    expect(cart[0].quantity).toEqual(1);
  });
});
