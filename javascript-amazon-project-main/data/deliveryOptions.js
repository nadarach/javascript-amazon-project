import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js' //default export

export const deliveryOptions = [{
  id: '1',
  deliveryDays : 7,
  priceCents: 0
}, {
  id: '2',
  deliveryDays : 3,
  priceCents: 499
}, {
  id: '3',
  deliveryDays : 1,
  priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId){
  let deliveryOption; 

  //looping through the delivery options to retrieve the option associated with the item in the cart
  deliveryOptions.forEach(option => {
    if (option.id === deliveryOptionId) {
      deliveryOption = option;
      return option;
    }
  });
  return deliveryOption;
}

//Format the delivery date (Day-of-week, month day-of-month format)
export function formatDeliveryDate(deliveryOption){
  const today = dayjs();
  const deliveryDate = today.add(
    deliveryOption.deliveryDays, 'days'
  );

  const dateString = deliveryDate.format('dddd, MMMM D');
  return dateString;
}