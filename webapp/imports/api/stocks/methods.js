//import './cron.js';

Meteor.methods({
    'stocks.findNewStocks'(delta) {
       if (Meteor.userId() == 'glenn') {
           const result = findNewStocks(delta);
           return result;
       } else {
           return 'not authorized';
       }
    }

});