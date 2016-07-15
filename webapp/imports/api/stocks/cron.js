import {Meteor} from 'meteor/meteor';
import {Stocks} from './stocks';

import './finscraper';
import './finanalyzer';

var FS = FinScraper;
var FA = FinAnalyzer;

// var moment = require('moment');
var moment = require('moment-business-days');
var cheerio = require('cheerio');
var _ = require('underscore');

// Find new dividend stocks
export default findNewStocks = function (delta) {

    const stocklist = []

    if (delta == undefined) { var delta = 1 };

    const nextday = new moment().businessAdd(delta).format("YYYY-MMM-DD"); // 2016-Jul-04
    console.log("Finding stocks with an ex-dividend gate of " + nextday);

    result = Meteor.http.get('http://www.nasdaq.com/dividend-stocks/dividend-calendar.aspx?date=' + nextday);
    $ = cheerio.load(result.content);

    var fields = [];
    var Table = $('#Table1 tbody').find('tr').each(function (i, elem) {
        var rec = $(this).find('td').each(function (i, elem) {
            fields[i] = $(this).text();
        });

        let sname = String(fields[0]);
        let S = sname.split("(");

        let reSymbol = RegExp("[(]([A-Z.]+)[)]$");
        var sym = sname.match(reSymbol);


        var X = sym[0].slice(1, -1);   // (CSCO) --> CSCO
        stocklist.push(X);

        let record = {
            company: S[0].trim(),
            symbol: X,
            status: "new",
            exDivDate: new Date(fields[1]),
            payDate: new Date(fields[6]),
            recordDate: new Date(fields[4]),
            qdivAmt: Number(fields[2]),
            adivAmt: Number(fields[3]),
        }

        // check to see if we already have a "new" record for this symbol. If so, we can pass...
        const found = Stocks.find({symbol: X, status: "new"}).count()

        if (found == 0) {
            console.log("new dividend for %s", X);
            Stocks.insert(record);
        } else {
            console.log("skipped: %s already in db", X);
        }

        return stocklist;

    });
}

export default augmentStocks = function () {
    const S = Stocks.find({status: 'new'}).fetch();
    

    // LOOP THROUGH RESULTS AND GET INFO
    
    _.each(S, function (stock) {

        const stock_info = FS.getStockInfo(stock.symbol);
        // now lets get dividend history
        const divHistory = FS.getDividendHistory(stock.symbol);


        Stocks.update({_id: stock._id}, {
            $set: {
                lastUpdated: new Date(),
                info: stock_info,
                div_history: divHistory,
                status: 'augmented',
            }
        });

    });

}


export default analyzeStocks = function () {
    const S = Stocks.find({status: "augmented"}).fetch();

    _.each(S, function (stock) {
        
        const analysis = FA.analyze(stock);
        
        Stocks.update({_id: stock._id}, {
            $set: {
                analysis: analysis
            }
        });
        console.log("%s analyzed",stock.symbol);
    });
}


export default monitorStocks = function () {
    const S = Stocks.find({symbol: "T"}).fetch();

    _.each(S, function (stock) {
        result = Meteor.http.get('http://www.nasdaq.com/symbol/' + stock.symbol + '/real-time');
        $ = cheerio.load(result.content);
        var quote = Number($('#quotes_content_left__LastSale').text());
        var todays_high = Number($('#quotes_content_left__TodaysHigh').text());
        var todays_low = Number($('#quotes_content_left__TodaysLow').text());
        var previous_close = Number($('#quotes_content_left__PreviousClose').text());
        
        
        console.log("Real time quote for %s is %d",stock.symbol,quote);

    });
}