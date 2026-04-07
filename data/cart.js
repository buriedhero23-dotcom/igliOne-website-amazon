// cart.js

// Храним корзину как массив объектов
export let cart = [];

// =========================
// Storage
// =========================
loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart"));

  if (!Array.isArray(cart)) {
    cart = [
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 2,
        deliveryOptionId: "1",
      },
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: "2",
      },
    ];
  }
}

export function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// =========================
// UI: "Added" badge timer
// =========================
let previousTimerId;

export function addedToCart(button) {
  const productContainer = button.closest(".product-container");
  if (!productContainer) return;

  const added = productContainer.querySelector(".added-to-cart");
  if (!added) return;

  clearTimeout(previousTimerId);

  added.classList.add("added-to-cart-visible");

  previousTimerId = setTimeout(() => {
    added.classList.remove("added-to-cart-visible");
  }, 2000);
}

// =========================
// Quantity in header / checkout
// =========================
export function updateCartQuantity() {
  let cartQuantity = 0;

  const cartQuantitySelect = document.querySelector(".js-cart-quantity");
  if (!cartQuantitySelect) return;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  cartQuantitySelect.textContent = cartQuantity <= 99 ? String(cartQuantity) : "99+";
  saveToStorage();
}

export function cartQuantityCheckout() {
  let cartQuantity = 0;

  const cartQuantitySelect = document.querySelector(".js-return-to-home-link");
  if (!cartQuantitySelect) return;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  cartQuantitySelect.textContent = cartQuantity <= 99 ? String(cartQuantity) : "99+";
}

// =========================
// Cart operations
// =========================
/**
 * Добавляет товар в корзину.
 * - Берёт количество из селекта .js-quantity-selector-${productId}
 * - Если селекта нет / значение 0 / NaN — ставит 1
 */
export function addToCart(productId) {
  const quantitySelect = document.querySelector(`.js-quantity-selector-${productId}`);

  // защита от null, 0, NaN
  const raw = Number(quantitySelect?.value);
  const selectedQuantity = Number.isFinite(raw) && raw > 0 ? raw : 1;

  const matchingItem = cart.find((item) => item.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += selectedQuantity;
  } else {
    cart.push({
      productId,
      quantity: selectedQuantity,
      deliveryOptionId: "1", // исправлено: единый ключ и без опечаток
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  cart = cart.filter((cartItem) => cartItem.productId !== productId);
  saveToStorage();
}

export function updateCartItemQuantity(productId, newQuantity) {
  const q = Number(newQuantity);
  if (!Number.isFinite(q)) return;

  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);
  if (!matchingItem) return;

  matchingItem.quantity = q;
  saveToStorage();
}

import {formatCurrency} from '../scripts/utils/money.js';

export function getProduct(productId) {
  let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    });

    return matchingProduct;
}

class Product{
  id;
  image;
  name; 
  rating;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
  }

  getStarsUrl(){
    return `images/ratings/rating-${this.rating.stars * 10}.png`
  }

  getPrice(){
    return `$${formatCurrency(this.priceCents)}`
  }

  extraInfoHTML() {
    return '';
  }
}

class Clothing extends Product{
  sizeChartLink;

  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }

  extraInfoHTML() {
   // super.extraInfoHTML();
    return `
      <a href="${this.sizeChartLink}" target="_blank">
      Size chart
      </a>
    `;
  }
};

class Appliance extends Product{
  instructionsLink;
  warrantyLink;

  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  };
  extraInfoHTML() {
   // super.extraInfoHTML();
    return `
      <a href="${this.instructionsLink}" target="_blank">
      Instructions
      </a>

      <a href="${this.warrantyLink}" target="_blank">
      Warranty
      </a>
    `;
  }

}
/*
const date = new Date();
console.log(date);
console.log(date.toLocaleDateString());
*/
/*
console.log(this);

const object2 = {
  a: 2,
  b: this.a
}
*/
/*
function logThis(){
  console.log(this);
}
logThis();
logThis.call('hello');

this
const obj3 = {
  method: () => {
    console.log(this);
  }
};

obj3.method();
*/

export let products = [];

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
  
    console.log(xhr.response);

    fun();
  });

  
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

/*
export const products = [
  {
    "id": "11ieqsfgssa-15697-fae4-24h2hasgjt323c2",
    "image": "images/products/coffe-machine-gray.jpg",
    "name": "the Barista Touch™",
    "rating": {
      "stars": 4,
      "count": 103
    },
    "priceCents": 39999,
    "keywords": [
      "coffemachine",
      "esspresso",
      "technics"
    ],
    "type": "appliance",
    "instructionsLink": "images/appliance-instructions.png",
    "warrantyLink": "images/appliance-warranty.png"
  },
  {
    "id": "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    "image": "images/products/athletic-cotton-socks-6-pairs.jpg",
    "name": "Black and Gray Athletic Cotton Socks - 6 Pairs",
    "rating": {
      "stars": 4.5,
      "count": 87
    },
    "priceCents": 1090,
    "keywords": [
      "socks",
      "sports",
      "apparel"
    ]
  },
  {
    "id": "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    "image": "images/products/intermediate-composite-basketball.jpg",
    "name": "Intermediate Size Basketball",
    "rating": {
      "stars": 4,
      "count": 127
    },
    "priceCents": 2095,
    "keywords": [
      "sports",
      "basketballs"
    ]
  },
  {
    "id": "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
    "image": "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
    "name": "Adults Plain Cotton T-Shirt - 2 Pack",
    "rating": {
      "stars": 4.5,
      "count": 56
    },
    "priceCents": 799,
    "keywords": [
      "tshirts",
      "apparel",
      "mens"
    ],
    "type": "clothing",
    "sizeChartLink": "images/clothing-size-chart.png"
  },
  {
    "id": "54e0eccd-8f36-462b-b68a-8182611d9add",
    "image": "images/products/black-2-slot-toaster.jpg",
    "name": "2 Slot Toaster - Black",
    "rating": {
      "stars": 5,
      "count": 2197
    },
    "priceCents": 1899,
    "keywords": [
      "toaster",
      "kitchen",
      "appliances"
    ],
    "type": "appliance",
    "instructionsLink": "images/appliance-instructions.png",
    "warrantyLink": "images/appliance-warranty.png"
  }
].map((productDetails) => {
  if (productDetails.type === 'clothing') {
    return new Clothing(productDetails);
  } else if (productDetails.type === 'appliance') {
    return new Appliance(productDetails);
  } else {
    return new Product(productDetails);
}});
*/
