/*export let cart = JSON.parse(localStorage.getItem('cart')) || [{
  productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  quantity: 2,
  deliveryOptionId: '1'
}, {
  productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
  quantity: 1,
  deliveryOptionId: '2'

}];*/

export let cart;

export function loadFromStorage(){
  cart = JSON.parse(localStorage.getItem('cart')) || [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1,
    deliveryOptionId: '2'
  
  }];
}
loadFromStorage();

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, productQuantity){
  let matchingItem;

  cart.forEach(cartItem => {
    if (productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  if (matchingItem){
    matchingItem.quantity += productQuantity;
  } else {
    cart.push({
      productId,
      quantity : productQuantity,
      deliveryOptionId: '1'
    });
  }

  saveToStorage();
}


export function removeFromCart(productId){
  const newCart = [];

  cart.forEach(cartItem => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();

}

export function deleteFromCart(productId){
  let removeIndex = cart.map(cartItem => cartItem.productId).indexOf(productId);

  ~removeIndex && cart.splice(removeIndex, 1);
  saveToStorage();
}

export function updateCartQuantity(){
  let cartQuantity = 0;
  cart.forEach(cartItem => {
    //cartQuantity += cartItem.productQuantity;
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity){
  let matchingItem;
  cart.forEach(cartItem => {
    if (productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  if(matchingItem){
    matchingItem.quantity = newQuantity;
  } 

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingItem = null;

  cart.forEach(cartItem => {
    if (productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  if (matchingItem === null) {
    return;
  }

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}