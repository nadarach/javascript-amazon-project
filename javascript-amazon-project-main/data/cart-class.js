import { checkDeliveryOption } from "./deliveryOptions.js";

class Cart {
  cartItems;
  localStorageKey;

  constructor(localStorageKey) {
    this.localStorageKey = localStorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.localStorageKey)) || [{
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: '2'
    }];
  }

  saveToStorage(){
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, productQuantity){
    let matchingItem;
  
    this.cartItems.forEach(cartItem => {
      if (productId === cartItem.productId){
        matchingItem = cartItem;
      }
    });
  
    if (matchingItem){
      matchingItem.quantity += productQuantity;
    } else {
      this.cartItems.push({
        productId,
        quantity : productQuantity,
        deliveryOptionId: '1'
      });
    }
    this.saveToStorage();
  }

  removeFromCart(productId){
    const newCart = [];
  
    this.cartItems.forEach(cartItem => {
      if (cartItem.productId !== productId) {
        newCart.push(cartItem);
      }
    });
    this.cartItems = newCart;
    this.saveToStorage();
  }

  deleteFromCart(productId){
    let removeIndex = this.cartItems.map(cartItem => cartItem.productId).indexOf(productId);
  
    ~removeIndex && this.cartItems.splice(removeIndex, 1);

    this.saveToStorage();
  }

  updateCartQuantity(){
    let cartQuantity = 0;
    this.cartItems.forEach(cartItem => {
      //cartQuantity += cartItem.productQuantity;
      cartQuantity += cartItem.quantity;
    });
  
    return cartQuantity;
  }

  updateQuantity(productId, newQuantity){
    let matchingItem;
    this.cartItems.forEach(cartItem => {
      if (productId === cartItem.productId){
        matchingItem = cartItem;
      }
    });
  
    if(matchingItem){
      matchingItem.quantity = newQuantity;
    } 
  
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId){
    let matchingItem = null;
  
    if(!checkDeliveryOption(deliveryOptionId)) {
      return;
    }

    this.cartItems.forEach(cartItem => {
      if (productId === cartItem.productId){
        matchingItem = cartItem;
      }
    });
  
    if (!matchingItem) {
      return;
    }
  
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
  
}

const cart = new Cart('cart');
const businessCart = new Cart('cart-business');

cart.localStorageKey = 'cart';
businessCart.localStorageKey = 'cart-business';

cart.loadFromStorage();

console.log(cart);
console.log(businessCart);


