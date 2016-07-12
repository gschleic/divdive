import {Meteor} from 'meteor/meteor';
import {Stocks} from './stocks';

// var moment = require('moment');
var moment = require('moment-business-days');
var cheerio = require('cheerio');
var _ = require('underscore');

// Find new dividend stocks
export default findNewStocks = function () {

    const nextday = new moment().businessAdd(1).format("YYYY-MMM-DD"); // 2016-Jul-04
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


    });
}

export default augmentStocks = function () {
    const S = Stocks.find({status: "new"}).fetch();

    _.each(S, function (stock) {

        result = Meteor.http.get('http://finance.yahoo.com/webservice/v1/symbols/' + stock.symbol + '/quote?format=json&view=detail');
        const sinfo = JSON.parse(result.content);

        if (sinfo.list.resources.length == 0) {
            console.error("Something is amiss getting data for " + stock.symbol);
        } else {
            const record = sinfo.list.resources[0].resource;
            const price = Number(record.fields.price);
            const volume = Number(record.fields.volume);
            const year_high = Number(record.fields.year_high);
            const day_high = Number(record.fields.day_high);
            const day_low = Number(record.fields.day_low);

            const yield = parseFloat(stock.qdivAmt / price).toFixed(5);
            const pct_year_high = parseFloat(price / year_high).toFixed(3);

            Stocks.update({_id: stock._id}, {
                $set: {
                    price: price,
                    volume: volume,
                    yield: yield,
                    pct_year_high: pct_year_high
                }
            });

            console.log(stock.symbol, price, yield, volume, year_high);
        }

        // additional info needed:
//   price - to calculate yield       -Y
//   beta - to calculate volatility   - N
//   market cap - to see the size  -N
//   volume - want to avoid thinly traded  - Y
//   price as a pct of 52week high - avoid trouble (if <80)  - Y


    })


    // NOT GET DATA FROM GOOGLE
    _.each(S, function (stock) {
        result = Meteor.http.get('https://www.google.com/finance?q=' + stock.symbol);
        $ = cheerio.load(result.content);
        var vals = $('td[class=val]').text();

        var beta = Number($('td[data-snapfield="beta"]').next().text());
        var eps = Number($('td[data-snapfield="eps"]').next().text());
        var market_cap = $('td[data-snapfield="market_cap"]').next().text();
        var pe_ratio = Number($('td[data-snapfield="pe_ratio"]').next().text());
        var inst_own = $('td[data-snapfield="inst_own"]').next().text();
        var vol_and_avg = $('td[data-snapfield="vol_and_avg"]').next().text();

        var payout_ratio = parseFloat(stock.adivAmt / eps).toFixed(2);

        console.log(stock.symbol, beta, eps, market_cap, pe_ratio, inst_own, vol_and_avg, payout_ratio);


        Stocks.update({_id: stock._id}, {
            $set: {
                beta: beta,
                eps: eps,
                market_cap: market_cap,
                pe_ratio: pe_ratio,
                inst_own: inst_own,
                vol_and_avg: vol_and_avg,
                div_payout_ratio: payout_ratio,
                status: 'augmented',
            }
        });


    });

}


export default screenStocks = function () {
    const S = Stocks.find({status: "augmented"}).fetch();

    _.each(S, function (stock) {

        // scoring criteria:
        //  +1 pct of high > 0.80  (company not in trouble)
        //  +1 beta < 1  -- less volaltile to market flucuations
        //  +1 volume > 5M  -- high volume / liquidity
        //  +1 yield > 0.01  -- more likely to get retracement
        //  +1 div payout < 0.9 sustainable div payment
        let score = 0;
        if (stock.pct_year_high > 0.50) score += 1;
        if (stock.beta < 1.0) score += 1;
        if (stock.volume > 3000000) score += 1;
        if (stock.yield > 0.01) score += 1;
        if (stock.div_payout_ratio < 0.8) score += 1;

        console.log("Stock %s scored as %d",stock.symbol,score);

        Stocks.update({_id: stock._id}, {
            $set: {
                score: score,
                status: 'screened',
            }
        });
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