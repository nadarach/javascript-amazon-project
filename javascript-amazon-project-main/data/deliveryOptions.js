import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js' //default export
import isWeekend from '../scripts/utils/time.js';

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

//Calculate the delivery date and format it (Day-of-week, month day-of-month format) 
export function calculateDeliveryDate(deliveryOption){
  let deliveryDays = deliveryOption.deliveryDays;
  let deliveryDate = dayjs();
  
  while(deliveryDays > 0) {
    deliveryDate = deliveryDate.add(1, 'days');
    
    if (!isWeekend(deliveryDate)) {
      deliveryDays--;
    } 
  }

  const dateString = deliveryDate.format('dddd, MMMM D');
  console.log(dateString);
  return dateString;
}