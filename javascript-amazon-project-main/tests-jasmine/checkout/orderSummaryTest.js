import {renderOrderSummary} from '../../scripts/checkout/orderSummary.js'
import { loadFromStorage } from '../../data/cart.js';
import { renderCheckoutHeader } from '../../scripts/checkout/checkoutHeader.js';

//Integration test: testing many units/pieces of code working together (e.g. renderOrderSummary)
//lets us test how the page looks, and how the page behaves

describe('Test suite : renderOrderSummary', () =>{
  const productId1 = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
  const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";

  //beforeEach : a hook, used to run code shared between tests before each test
  beforeEach(() => {
    document.querySelector('.js-test-container').innerHTML = `
    <div class="checkout-header js-checkout-header"></div>
    <div class="main">
      <div class="page-title">Review your order</div>
      <div class="checkout-grid">
        <div class="order-summary js-order-summary"></div>
        <div class="payment-summary js-payment-summary"></div>
      </div>
    </div>
    `;
    
    const productId = "e43638ce-6aa0-4b85-b27f-e1d07eb678c6";
    //create a mock/fake version of lcaolStorage.setItem and localStorage.getItem for the test (to avoid flaky tests)
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
      }, {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2'
      
      }]);
    });
    loadFromStorage();
    renderOrderSummary();
  });

  it('displays the cart', () => {

    //test whether we are displaying 2 cart item containers (for the 2 items in the cart) correctly
    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(2);

    //test whether we are displaying the quantity (2) of the item with the id = productId (i.e. the 1st item in the cart) correctly on the page 
    expect(
      document.querySelector(`.js-product-quantity-${productId1}`).innerText
    ).toContain('Quantity: 2');

    document.querySelector('.js-test-container').innerHTML = ``;

  });

  it('removes a product', () => {
    
    document.querySelector(`.js-delete-link-${productId1}`).click();

    //test whether we are displaying 1 cart item container (for the 1 items in the cart) after deleting the 2ns item correctly
    expect(
      document.querySelectorAll('.js-cart-item-container').length
    ).toEqual(1);

    //test whether the container for the 1st product is no longer displayed on the page, i.e. is equal to null
    expect(
      document.querySelector(`.js-cart-item-container-${productId1}`)
    ).toEqual(null);

    //test whether the container for the 2ns product is still longer displayed on the page, i.e. is not equal to null
    expect(
      document.querySelector(`.js-cart-item-container-${productId2}`)
    ).not.toEqual(null);

    document.querySelector('.js-test-container').innerHTML = ``;

  });

});