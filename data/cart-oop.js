// cart-oop.js
function Cart(localStorageKey){
  const cart = {
  cartItems: undefined,
  previousTimerId: undefined,

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(localStorageKey));

    if (!Array.isArray(this.cartItems)) {
      this.cartItems = [
        {
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOption: "1",
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 2,
          deliveryOption: "2",
        },
      ];
    }
  },

  saveToStorage() {
    localStorage.setItem(localStorageKey, JSON.stringify(this.cartItems));
  },

  // Берём количество из селекта, но НЕ падаем если селекта нет
  addToCart(productId, fallbackQuantity = 1) {
  let matchingItem = this.cartItems.find((item) => item.productId === productId);

    const quantitySelect = document.querySelector(
      `.js-quantity-selector-${productId}`
    );

    // если селекта нет — используем fallbackQuantity
    const raw = Number(quantitySelect?.value);
    const selectedQuantity =
      Number.isFinite(raw) && raw > 0 ? raw : Number(fallbackQuantity) || 1;

    if (matchingItem) {
      matchingItem.quantity += selectedQuantity;
    } else {
      this.cartItems.push({
        productId,
        quantity: selectedQuantity,
        deliveryOption: "1",
      });
    }

    this.saveToStorage();
  },

  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter((item) => item.productId !== productId);
    this.saveToStorage();
  },

  updateCartItemQuantity(productId, newQuantity) {
    const q = Number(newQuantity);
    if (!Number.isFinite(q)) return;

    const matchingItem = this.cartItems.find((item) => item.productId === productId);
    if (!matchingItem) return;

    matchingItem.quantity = q;
    this.saveToStorage();
  },

  addedToCart(button) {
    const productContainer = button.closest(".product-container");
    if (!productContainer) return;

    const added = productContainer.querySelector(".added-to-cart");
    if (!added) return;

    clearTimeout(this.previousTimerId);

    added.classList.add("added-to-cart-visible");

    this.previousTimerId = setTimeout(() => {
      added.classList.remove("added-to-cart-visible");
    }, 2000);
  },

  updateCartQuantity() {
    let cartQuantity = 0;

    const cartQuantitySelect = document.querySelector(".js-cart-quantity");
    if (!cartQuantitySelect) return;

    this.cartItems.forEach((item) => {
      cartQuantity += item.quantity;
    });

    cartQuantitySelect.textContent = cartQuantity <= 99 ? String(cartQuantity) : "99+";
    this.saveToStorage();
  },

  cartQuantityCheckout() {
    let cartQuantity = 0;

    const cartQuantitySelect = document.querySelector(".js-return-to-home-link");
    if (!cartQuantitySelect) return;

    this.cartItems.forEach((item) => {
      cartQuantity += item.quantity;
    });

    cartQuantitySelect.textContent = cartQuantity <= 99 ? String(cartQuantity) : "99+";
  },
};

return cart;
}

const cart = Cart('cart-oop');
const businessCart = Cart('business-cart');

export default cart;


// ---- init пример (лучше дергать по клику кнопки, а не сразу при загрузке) ----
businessCart.loadFromStorage();
cart.loadFromStorage();

// Если ты вызываешь addToCart вот так при загрузке файла:
cart.addToCart("15b6fc6f-327a-4ec4-896f-486349e85a3d"); // селекта может не быть => теперь не упадёт
