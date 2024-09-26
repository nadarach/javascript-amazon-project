import {cart, deleteFromCart, updateCartQuantity, updateQuantity, updateDeliveryOption} from '../../data/cart.js'
import {getProduct, products} from '../../data/products.js'
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryOptions.js'
import { formatCurrency } from '../utils/money.js'; //named export
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';


export function renderOrderSummary(){

  let cartSummaryHtml = '';

  renderCheckoutHeader();

  cart.forEach(cartItem => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    let deliveryOption = getDeliveryOption(deliveryOptionId); 

    //formatting the date to display it
    const dateString = calculateDeliveryDate(deliveryOption);

    //generate the HTML for all the items in the cart (one at a time, and we concatenate them in one var.) in Checkout page
    cartSummaryHtml += `
      <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date js-delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src=${matchingProduct.image}>

          <div class="cart-item-details">
            <div class="product-name js-product-name-${matchingProduct.id}">
            ${matchingProduct.name}
            </div>
            <div class="product-price">
             $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}"> ${cartItem.quantity} </span>
              </span>
              <span class="update-quantity-link js-update-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProduct.id}">
              <span class="save-quantity-link js-save-quantity-link link-primary" data-product-id="${matchingProduct.id}">
                Save
              </span>
              <span class="delete-quantity-link js-delete-quantity-link 
              js-delete-link-${matchingProduct.id} link-primary" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>`;

  });

  //Inject the HTML generated for the cart into the checkout page
  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHtml;


  //Handling update buttons for each cart item (for updating items' quantities)
  document.querySelectorAll('.js-update-quantity-link').forEach(link => {
    //when clicking on the Update button
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');

      //Handling event of pressing the 'Enter' key after typing the new quantity in the input
      document.querySelectorAll(`.js-quantity-input-${productId}`).forEach(link => {
        link.addEventListener('keydown', (event) => {
          if(event.key === 'Enter'){
            handleQuantityInput(productId);
          }
        });
      });
    });
  });

  //Handle save buttons (when updating quantities) for each cart item
  document.querySelectorAll('.js-save-quantity-link').forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      handleQuantityInput(productId);
    });
  });


  //Handling delete buttons for each cart item
  document.querySelectorAll('.js-delete-quantity-link').forEach(link => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      deleteFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      renderOrderSummary();
      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });

  document.querySelectorAll('.js-delivery-option').forEach(element => {
    element.addEventListener('click', () => {
      let deliveryOption;
      const {productId, deliveryOptionId} = element.dataset;

      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
      /*
      deliveryOptions.forEach(option => {
        if (option.id === deliveryOptionId) {
          deliveryOption = option;
        }
      });
      const dateString = calculateDeliveryDate(deliveryOption);

      document.querySelector('.js-delivery-date').innerHTML = `Delivery date: ${dateString}`;
      */
    });
  });
}

  //Generate the HTML for delivery options of cart items
  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';
    deliveryOptions.forEach(deliveryOption => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString = deliveryOption.priceCents === 0
      ? 'FREE Shipping' 
      : `$${formatCurrency(deliveryOption.priceCents)}`;

      const isChecked = cartItem.deliveryOptionId === deliveryOption.id;

      html += `
      <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}" 
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked? 'checked' : ''}
          class="delivery-option-input 
          js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `;
    });
    return html;
  }

function handleQuantityInput(productId){
  const container = document.querySelector(`.js-cart-item-container-${productId}`);
  const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
  const quantity = Number(quantityInput.value);
  
  if (quantity <= 0 || quantity > 1000) {
    quantityInput.classList.add('invalid-quantity-input');
    alert('Quantity must be at least 1 and less than 1000');
    return;
  } else {
    container.classList.remove('is-editing-quantity');
    quantityInput.classList.remove('invalid-quantity-input');
    updateQuantity(productId, quantity);      
    renderOrderSummary();
    renderPaymentSummary();
    renderCheckoutHeader();

    //document.querySelector(`.js-quantity-label-${productId}`).innerHTML = quantity;
    //document.querySelector('.js-return-to-home-link').innerHTML = updateCartQuantity();
  }
}