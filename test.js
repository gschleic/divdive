var moment = require("moment");

var request = require("request"),
    cheerio = require("cheerio"),
    url = "http://www.wunderground.com/cgi-bin/findweather/getForecast?&query=" + 27517;


var Xray = require('x-ray');
var moment

var x = Xray();

  
request(url, function (error, response, body) {
	if (!error) {
	    var $ = cheerio.load(body),
		temperature = $("[data-variable='temperature'] .wx-value").html();
      
	    console.log("It’s " + temperature + " degrees Fahrenheit.");
	} else {
	    console.log("We’ve encountered an error: " + error);
	}
    });
/*
x('https://www.dividendchannel.com/ex-dividend-calendar/', 'body@html')(function(err, title) {
	console.log(title) // Google 
	    })
*/

/* Get premarket data */
var premarket = Xray();
premarket('http://money.cnn.com/data/premarket/', 'body@html')(function(err, title) {
	console.log(title);
})


const divdate = '2016-Jul-06';

x('http://www.nasdaq.com/dividend-stocks/dividend-calendar.aspx?date='+divdate, '#Table1')(function(err, title) {
	console.log(title) //
})


console.log("Quote for Cisco");
var quoter = Xray();
quoter('https://www.google.com/finance?q=CSCO', '#ref_99624_l')(function(err, title) {
	console.log(title) //
})


