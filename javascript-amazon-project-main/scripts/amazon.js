import { cart } from '../data/cart.js';
import { products } from '../data/products.js';

let productsHTML = '';

products.forEach((product) => {
  productsHTML += `        
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src=${product.image}>
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart js-added-to-cart-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button js-add-to-cart button-primary" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
});

document.querySelector('.js-products-grid').innerHTML = productsHTML;

let timeoutId;

document.querySelectorAll('.js-add-to-cart').forEach((button) => {

  button.addEventListener('click', () => {
    const { productId } = button.dataset;
    let cartQuantity = 0;
    let matchingItem;
    const messageElement = document.querySelector(`.js-added-to-cart-${productId}`);
    
    const productQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

    cart.forEach(item => {
      if (productId === item.productId){
        matchingItem = item;
      }
    });
  
    if (matchingItem){
      matchingItem.productQuantity += productQuantity;
    } else {
      cart.push({
        productId,
        productQuantity
      });
    }

    if(!messageElement.classList.contains('is-added')){
      messageElement.classList.add('is-added');
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => messageElement.classList.remove('is-added'), 1500);

    }
  
    cart.forEach(item => {
      cartQuantity += item.productQuantity;
    });

    console.log(cart);
    
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  });

});



/*
document.querySelectorAll('.js-add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const { productId } = button.dataset;
    const messageElement = document.querySelector(`.js-added-to-cart-${productId}`);

    let matchingItem;

    if (!messageElement.classList.contains('is-added')) {
      messageElement.classList.add('is-added');

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => messageElement.classList.remove('is-added'), 1500);
    }

    const productQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

    console.log(productQuantity, cartQuantity);

    cart.forEach(item => {
      if(productId === item.productId) {
        matchingItem = item;
      }
    });

    if(matchingItem) {
      matchingItem.quantity += productQuantity;
    } else {
      cart.push({
        productId,
        productQuantity
      });
    }

    
    cart.forEach((item) => {
      cartQuantity += item.productQuantity;
    });


    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

  });
});
*/