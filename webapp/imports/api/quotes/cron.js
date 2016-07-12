import {Meteor} from 'meteor/meteor';

import {Stocks} from '../stocks/stocks';
import {Quotes} from './quotes';


var moment = require('moment');
var cheerio = require('cheerio');
var _ = require('underscore');

export default realtimeQuotes = function () {
    const S = Stocks.find({symbol: "T"}).fetch();

    _.each(S, function (stock) {
        result = Meteor.http.get('http://www.nasdaq.com/symbol/' + stock.symbol + '/real-time');
        $ = cheerio.load(result.content);
        var quote = Number($('#quotes_content_left__LastSale').text());
        var todays_high = Number($('#quotes_content_left__TodaysHigh').text());
        var todays_low = Number($('#quotes_content_left__TodaysLow').text());
        var previous_close = Number($('#quotes_content_left__PreviousClose').text());

        const Q = Quotes.findOne({symbol: stock.symbol});

        if (Q == undefined) {
            Quotes.insert({
                symbol: stock.symbol,
                quote: quote,
                todays_low: todays_low,
                todays_high: todays_high,
                previous_close: previous_close,
                ts: new Date()
            });
        } else {

            Quotes.update({symbol: stock.symbol}, {
                $set: {
                    quote: quote,
                    todays_low: todays_low,
                    todays_high: todays_high,
                    previous_close: previous_close,
                    ts: new Date()
                }
            });
        }

        console.log("Real time quote for %s is %d", stock.symbol, quote);


    });
}



