import {addToCart, cart, deleteFromCart, loadFromStorage, updateDeliveryOption} from '../../data/cart.js'

const productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
const productId2 = "15b6fc6f-327a-4ec4-896f-486349e85a3d";
const productId3 = "3ebe75dc-64d2-4137-8860-1f5a963e534b";

describe('Test suite: addToCart', () => {

  const productId = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';

  beforeEach(() => {
    spyOn(localStorage, 'setItem');
  });
  
  it('adds an existing product to the cart', () => {
    
    //creating a mock version of the getItem function (as we don't know what is saved in localStorage at a given point in time, which can result in flaky tests)
    //this mock version returns a cart with only one item in it
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity : 1,
        deliveryOptionId : '1' 
      }]);
    });

    loadFromStorage();

    addToCart(productId, 1);

    //tests whether there is only one item in the cart (as we added to the only one existing product in the cart & only its quantity should increase)
    expect(cart.length).toEqual(1);

    //tests whether the setItem function has been called exactly 1 time (as we added one product to the cart)
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);
    
    //tests whether setItem received the correct cart values
    //as we are adding to an existing product, the quantity of the product with the productId id should increase by 1
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId,
      quantity : 2,
      deliveryOptionId : '1' 
    }]));

    expect(cart[0].productId).toEqual(productId);

    //expect(cart[0].quantity).toEqual(2);
  });

  it('adds a new product to the cart', () => {

    //the mock version returns an empty cart
    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([]);
    });

    loadFromStorage();

    addToCart(productId, 1);

    //tests whether there is only one item in the cart (as we added one item to the empty cart)
    expect(cart.length).toEqual(1);

    //tests whether the setItem function (which saves the cart to localStorage) has been called exactly once
    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

    //tests whether setItem received the correct cart values
    //as we are adding to an existing product, the quantity of the product with the productId id should increase by 1
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId,
      quantity : 1,
      deliveryOptionId : '1' 
    }]));

    //tests whether the product ID of the 1st item in the cart matches the ID of the product we added
    expect(cart[0].productId).toEqual(productId);
  });
});

describe('Test suite: deleteFromCart', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity : 1,
        deliveryOptionId : '1' 
      }, {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: '2'
      
      }]);
    });
  });

  it('removes a product that is in the cart', () => {
    loadFromStorage();
    deleteFromCart(productId1);

    //checks whether the cart only contains 1 item after deleting the 2nd one
    expect(cart.length).toEqual(1);

    //checks whether the ID of the 1st product in the cart now is the ID of the, previously, 2nd item (i.e. productId2)
    expect(cart[0].productId).toEqual(productId2);

    //tests whether setItem received the correct cart values
    //as we are removing 1 item (the 1st one) from the cart, there should only be the 2nd item in it
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: productId2,
      quantity : 1,
      deliveryOptionId : '2' 
    }]));
  });

  it('removes a product that is NOT in the cart', () => {
    loadFromStorage();
    deleteFromCart(productId3);

    //checks whether the cart still contains 2 items only
    expect(cart.length).toEqual(2);

    //check whether the 1st cart item's product ID is still the same
    expect(cart[0].productId).toEqual(productId1);

    //tests whether setItem received the correct cart values
    //as we are removing an item that doesn't exist in the cart, the cart should remain the same with the 2 items in it
    expect(localStorage.setItem).toHaveBeenCalledWith('cart', 
      JSON.stringify([{
        productId: productId1,
        quantity : 1,
        deliveryOptionId : '1' 
      }, {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: '2'
      }])
    );
  });
});

describe('Test suite: updateDeliveryOption', () => {
  beforeEach(() => {
    spyOn(localStorage, 'setItem');

    spyOn(localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify([{
        productId: productId1,
        quantity : 1,
        deliveryOptionId : '1' 
      }, {
        productId: productId2,
        quantity: 1,
        deliveryOptionId: '2'
      
      }]);
    });
  });

  it('updates the delivery option of a product in the cart', () => {
    loadFromStorage();
    updateDeliveryOption(productId1, '3');

    //checks whether there are still 2 items in the cart
    expect(cart.length).toEqual(2);

    //checks whether the product ID of the 1st item in the cart corresponds to productId1
    expect(cart[0].productId).toEqual(productId1);

    //checks whether the delivery option ID of the 1st item has been updated to 3
    expect(cart[0].deliveryOptionId).toEqual('3');

    expect(localStorage.setItem).toHaveBeenCalledTimes(1);

  });

  it('updates the delivery option of a product NOT in the cart', () => {
    loadFromStorage();
    updateDeliveryOption(productId3, '3');

    //checks whether there are still 2 items in the cart
    expect(cart.length).toEqual(2);

    //checks whether the product ID of the 1st item in the cart corresponds to productId1
    expect(cart[0].productId).toEqual(productId1);

    //If there's no product in the cart with the product ID given to it, the updateDeliveryOption neither updates the cart and nor saves to storage i.e. the setItem function shouldn't be called

    //this test checks whether the setItem function hasn't been called in this case
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

  it('updates with a deliveryOptionId that does not exist', () => {
    loadFromStorage();
    updateDeliveryOption(productId1, '5');

    //checks whether there are still 2 items in the cart
    expect(cart.length).toEqual(2);

    //checks whether the product ID of the 1st item in the cart corresponds to productId1
    expect(cart[0].productId).toEqual(productId1);

    //checks whether the delivery option ID of the 1st item is still 1
    expect(cart[0].deliveryOptionId).toEqual('1');

    //If there's no product in the cart with the product ID given to it, the updateDeliveryOption neither updates the cart and nor saves to storage i.e. the setItem function shouldn't be called

    //this test checks whether the setItem function hasn't been called in this case
    expect(localStorage.setItem).toHaveBeenCalledTimes(0);
  });

});