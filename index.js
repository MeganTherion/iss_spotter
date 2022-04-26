const {fetchMyIp, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation} = require('./iss');
const exampleCoords = {latitude: '49.27670', longitude: '-123.13000'};


fetchMyIp((error, ip) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! Returned IP:', ip);
});

fetchCoordsByIP('64.108.146.137', (error, coordinates) => {
  if (error) {
    console.log("error", error);
  return;
  }
  console.log('It worked! Returned coordinates:', coordinates);
});

fetchISSFlyOverTimes(exampleCoords, (error, passTimes) => {
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  console.log('It worked! return flyover times:', passTimes)
})
const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`)
  }
}; 

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work", error);
  }
  printPassTimes(passTimes);
});

module.exports = { printPassTimes };
