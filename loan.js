//const request = require('request-promise-native');

let creditLimit = 140;

//Input: number of dollars to loan out
//Returns: promise of loan which may or may not fulfill, based on remaining credit
//If creditLimit is less than the requested amount, only the remaining limit is loaned out

const loanOut = function(amount) {
  return new Promise((resolve, reject) => {
    //empty for now
    if (creditLimit <= 0) {
      reject("Insufficient funds!");
    } else if (creditLimit > 0 && creditLimit < amount) {
      //creditLimit = 0 ;
      amount = amount - (amount - creditLimit);
      creditLimit = 0;
      resolve(amount);
    } else {
      creditLimit -= amount;
      resolve(amount);
    }
    
  });
};

console.log("Asking for $150, which should be okay...");
loanOut(150)
  .then((amountReceived) => {
    console.log(`\t-> I got $${amountReceived} loan from the bank! Remaining Credit Limit: $${creditLimit}`);
  })
  .catch((err) => {
    console.log(`\t-> Error: ${err}!`);
  });