import {Meteor} from 'meteor/meteor';
var moment = require('moment');
var Xray = require('x-ray');

import { Stocks } from '../imports/api/stocks/stocks';
import { Positions } from '../imports/api/positions/positions';

// Methods
import '../imports/api/positions/methods.js';
import '../imports/api/stocks/methods.js';

// Libraries
import '../imports/api/stocks/lib.js';

import '../imports/api/stocks/finscraper';

// Publications
import '../imports/api/positions/publications.js';
import '../imports/api/stocks/publications.js';
import '../imports/api/quotes/publications.js';

//require the Twilio module and create a REST client
var client = require('twilio')('AC07efeeac1388651380f7b08b02792486', '799f94a18f111a3b3762bbd19520ef7e');


import '../imports/startup/synced_cron_config';

var cheerio = require('cheerio');


Meteor.startup(function () {

    //result = Meteor.http.get('http://finance.yahoo.com/webservice/v1/symbols/CSCO,AAPL/quote?format=json&view=detail');
    //var stockinfo = JSON.parse(result.content);
    //console.log(stockinfo.list.resources[1].resource.fields.price);
    //$ = cheerio.load(result.content);

    // Test Twilio

    //Send an SMS text message
    /* client.sendMessage({

        to:'+19197203889', // Any number Twilio can deliver to
        from: '+19292654022', // A number you bought from Twilio and can use for outbound communication
        body: 'Div Dive price alert!' // body of the SMS message

    }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."

        } else {
            console.log(err);
        }
    });*/


});


