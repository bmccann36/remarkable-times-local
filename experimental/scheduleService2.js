const nowDate = new Date();

// ? this timezone
const estOff = nowDate.getTimezoneOffset();
console.log('estOff :>> ', estOff);
const firstRunTime = 660;

//?  here (comes out as 6)
// console.log(convertToTime(660, estOff));
// 6pm = 1080mins
// console.log(convertToTime(1080,estOff));

//? australia in our morning (will be twenty)
// console.log(convertToLocal(660, -540));
// australia evening start time
// const firstRunInMins = convertToLocal(1320, -570);
// console.log(firstRunInMins); // 22:00

//? cali morning
console.log(convertToLocal(660, 480));
//? cali afternoon
console.log(convertToLocal(1380, 480))

function convertToLocal(startTimeMins, tzOffsetInMin) {
  const localStartMinutes = getLocalStartMinutes(startTimeMins, tzOffsetInMin);
//   console.log('localStartMinutes :>> ', localStartMinutes);
  return convertToTime(localStartMinutes);
}

function convertToTime(inMins) {
  const hoursWithDecimal = inMins / 60;
//   console.log('hoursWithDecimal :>> ', hoursWithDecimal);
  //   console.log('inMins :>> ', inMins);
  const asString = hoursWithDecimal.toString();
  const hours = asString.split('.')[0];
  const decimal = asString.split('.')[1];
  if (!decimal) {
    return hours + ':00';
  }
  const mins = (decimal * 60) / 10;
  const timeAsStr = hours + ':' + mins;
  return timeAsStr;
}

function getLocalStartMinutes(startTimeMins, tzOffsetInMins) {
  // subtract offset
  let firstRunInMinutes = startTimeMins - tzOffsetInMins;
  const oneDayInMins = 1440;
  if (firstRunInMinutes > oneDayInMins) {
    firstRunInMinutes = firstRunInMinutes - oneDayInMins;
  }
  return firstRunInMinutes;
}

// times to run
/**
 * 11 - 660 min
 * 11:30
 * 12
 * 12:30
 *
 * evening
 * 22:00 - 1320 min  
 * 22:30
 * 23:00 - 1380 min
 * 23:30
 */
