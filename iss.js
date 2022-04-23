const request = require('request');

const fetchMyIp = function(callback) {
  const url = 'https://api.ipify.org?format=json';

  request(url, (error, response, body) => { //here comes the callback which takes these three paramenters
  
    if (error) { //first: what to do if error
      callback(error, null);
    }
    //if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null); //"Error(...)" creates new Error object we can pass around -- here we pass it back to the callback
      return;
    }
    const ip = JSON.parse(body).ip;
    callback(null, ip);
});
}

const fetchCoordsByIP = function(ip, callback) {
  const url = `https://api.freegeoip.app/json/?apikey=cadec1a0-c312-11ec-993e-555c8cf3660f`

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`));
      return;
    }

    const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });
    
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  })
}
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIp((error, ip) => {
    if (error) {
      return callback(error, null);
    }
    fetchCoordsByIP((error, coords) => {
      if (error) {
        return callback(error, null);
      }
      fetchISSFlyOverTimes(ip, (error, loc) => {
        if (error) {
          return callback(error, null);
        }
        fetchISSFlyOverTimes(loc, (error, nextPasses) => {
          if (error) {
            return callback(error, null);
          }

          callback(null, nextPasses);
        })
      })
    })
  })
  //orchestrates multiple API requests in order to determine the next 5 upcoming ISS flyovers
  //input:
    // - a callback with an error or results.
    //returns (via callback):
    // -an error, if any (nullable)
    // -the fly-over times as an array (null if error):
    //  [ { risetime: <number>, duration: <number> }, ...]
}


module.exports = {fetchMyIp, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation};