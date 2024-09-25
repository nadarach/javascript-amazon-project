import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js' //default export

export function isWeekend(date){
  const dayOfTheWeek = date.format('dddd');

  return (dayOfTheWeek === 'Sunday' || dayOfTheWeek === 'Saturday');
}

export default isWeekend;