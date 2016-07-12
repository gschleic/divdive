

// https://www.google.com/finance/historical?cid=665232&startdate=Jul+13%2C+2015&enddate=Jul+13%2C+2015&num=30&ei=uoeDV8m1EIyXe4yKgIgH

import {Meteor} from 'meteor/meteor';

import {Stocks} from '../stocks/stocks';
import {Quotes} from './quotes';


// var moment = require('moment');
var moment = require('moment-business-days');
var cheerio = require('cheerio');
var _ = require('underscore');

export default historicalQuote = function (symbol,sdate,edate) {

    const sd = moment(sdate,"MM/DD/YY").format("MMM+DD%2C+YYYY");
    const ed = moment(edate,"MM/DD/YY").format("MMM+DD%2C+YYYY");

    // var startdate = "Jul+13%2C+2015";
    //var enddate = "Jul+14%2C+2015";

    console.log("Quotes from %s to %s",sd,ed);

    result = Meteor.http.get('https://www.google.com/finance/historical?q='+symbol+'&startdate='+sd+'&enddate='+ed+'&num=30');
    $ = cheerio.load(result.content);

    var quote = $('.historical_price').find('tr').text();
    var cells = quote.split('\n\n');

    var quotes={};

    cells.forEach(function(cell) {
        const q = cell.split('\n');
        const record = {};
        record.open = Number(q[1]);
        record.high = Number(q[2]);
        record.low = Number(q[3]);
        record.close = Number(q[4]);
        record.volume = Number(q[5].replace(/[,]/g,''));  // "123,456" --> 123456

        const dateindex = moment(q[0],"MMM DD, YYYY").format("MM/DD/YY");

        quotes[dateindex] = record;
    });

    return quotes;
}



