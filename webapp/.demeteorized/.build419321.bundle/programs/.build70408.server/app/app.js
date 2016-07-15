var require = meteorInstall({"imports":{"api":{"positions":{"methods.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/positions/methods.js                                                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
    'positions.test': function positionsTest() {                                                                     // 2
        console.log("I am here...");                                                                                 // 3
    },                                                                                                               // 4
    'positions.insert': function positionsInsert(text) {                                                             // 5
        check(text, String);                                                                                         // 6
                                                                                                                     //
        // Make sure the user is logged in before inserting a task                                                   //
        if (!this.userId) {                                                                                          // 9
            throw new Meteor.Error('not-authorized');                                                                // 10
        }                                                                                                            // 11
                                                                                                                     //
        Positions.insert({                                                                                           // 13
            text: text,                                                                                              // 14
            createdAt: new Date(),                                                                                   // 15
            owner: this.userId                                                                                       // 16
        });                                                                                                          // 13
    },                                                                                                               // 18
    'psotions.remove': function psotionsRemove(positionId) {                                                         // 19
        check(positionId, String);                                                                                   // 20
                                                                                                                     //
        Positions.remove(positionId);                                                                                // 22
    },                                                                                                               // 23
    'positions.setChecked': function positionsSetChecked(taskId, setChecked) {                                       // 25
        check(taskId, String);                                                                                       // 26
        check(setChecked, Boolean);                                                                                  // 27
                                                                                                                     //
        Positions.update(taskId, { $set: { checked: setChecked } });                                                 // 29
    }                                                                                                                // 30
});                                                                                                                  // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"positions.js":["meteor/mongo",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/positions/positions.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({Positions:function(){return Positions}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});
                                                                                                                     //
var Positions = new Mongo.Collection("positions");                                                                   // 3
/*                                                                                                                   //
                                                                                                                     //
 # toBuy                                                                                                             //
 # buyOrderPlaced                                                                                                    //
 # bought                                                                                                            //
 # sellOrderPlaced                                                                                                   //
 # sold                                                                                                              //
 # dividendReceived                                                                                                  //
 # closed                                                                                                            //
                                                                                                                     //
 */                                                                                                                  //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"publications.js":["./positions",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/positions/publications.js                                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Positions;module.import('./positions',{"Positions":function(v){Positions=v}});                                   // 1
                                                                                                                     //
if (Meteor.isServer) {                                                                                               // 4
    // This code only runs on the server                                                                             //
    Meteor.publish('positions', function stocksPublication() {                                                       // 6
        return Positions.find({ owner: this.user });                                                                 // 7
    });                                                                                                              // 8
}                                                                                                                    // 9
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"quotes":{"cron.js":["meteor/meteor","../stocks/stocks","./quotes","moment","cheerio","underscore",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/quotes/cron.js                                                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Stocks;module.import('../stocks/stocks',{"Stocks":function(v){Stocks=v}});var Quotes;module.import('./quotes',{"Quotes":function(v){Quotes=v}});
                                                                                                                     //
                                                                                                                     // 3
                                                                                                                     // 4
                                                                                                                     //
var moment = require('moment');                                                                                      // 7
var cheerio = require('cheerio');                                                                                    // 8
var _ = require('underscore');                                                                                       // 9
                                                                                                                     //
module.export("default",exports.default=(realtimeQuotes = function realtimeQuotes() {                                // 11
    var S = Stocks.find({ symbol: "T" }).fetch();                                                                    // 12
                                                                                                                     //
    _.each(S, function (stock) {                                                                                     // 14
        result = Meteor.http.get('http://www.nasdaq.com/symbol/' + stock.symbol + '/real-time');                     // 15
        $ = cheerio.load(result.content);                                                                            // 16
        var quote = Number($('#quotes_content_left__LastSale').text());                                              // 17
        var todays_high = Number($('#quotes_content_left__TodaysHigh').text());                                      // 18
        var todays_low = Number($('#quotes_content_left__TodaysLow').text());                                        // 19
        var previous_close = Number($('#quotes_content_left__PreviousClose').text());                                // 20
                                                                                                                     //
        var Q = Quotes.findOne({ symbol: stock.symbol });                                                            // 22
                                                                                                                     //
        if (Q == undefined) {                                                                                        // 24
            Quotes.insert({                                                                                          // 25
                symbol: stock.symbol,                                                                                // 26
                quote: quote,                                                                                        // 27
                todays_low: todays_low,                                                                              // 28
                todays_high: todays_high,                                                                            // 29
                previous_close: previous_close,                                                                      // 30
                ts: new Date()                                                                                       // 31
            });                                                                                                      // 25
        } else {                                                                                                     // 33
                                                                                                                     //
            Quotes.update({ symbol: stock.symbol }, {                                                                // 35
                $set: {                                                                                              // 36
                    quote: quote,                                                                                    // 37
                    todays_low: todays_low,                                                                          // 38
                    todays_high: todays_high,                                                                        // 39
                    previous_close: previous_close,                                                                  // 40
                    ts: new Date()                                                                                   // 41
                }                                                                                                    // 36
            });                                                                                                      // 35
        }                                                                                                            // 44
                                                                                                                     //
        console.log("Real time quote for %s is %d", stock.symbol, quote);                                            // 46
    });                                                                                                              // 49
}));                                                                                                                 // 50
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"methods.js":["meteor/meteor","../stocks/stocks","./quotes","moment-business-days","cheerio","underscore",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/quotes/methods.js                                                                                     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Stocks;module.import('../stocks/stocks',{"Stocks":function(v){Stocks=v}});var Quotes;module.import('./quotes',{"Quotes":function(v){Quotes=v}});
                                                                                                                     //
// https://www.google.com/finance/historical?cid=665232&startdate=Jul+13%2C+2015&enddate=Jul+13%2C+2015&num=30&ei=uoeDV8m1EIyXe4yKgIgH
                                                                                                                     //
                                                                                                                     // 5
                                                                                                                     //
                                                                                                                     // 7
                                                                                                                     // 8
                                                                                                                     //
// var moment = require('moment');                                                                                   //
var moment = require('moment-business-days');                                                                        // 12
var cheerio = require('cheerio');                                                                                    // 13
var _ = require('underscore');                                                                                       // 14
                                                                                                                     //
module.export("default",exports.default=(historicalQuote = function historicalQuote(symbol, sdate, edate) {          // 16
                                                                                                                     //
    var sd = moment(sdate, "MM/DD/YY").format("MMM+DD%2C+YYYY");                                                     // 18
    var ed = moment(edate, "MM/DD/YY").format("MMM+DD%2C+YYYY");                                                     // 19
                                                                                                                     //
    // var startdate = "Jul+13%2C+2015";                                                                             //
    //var enddate = "Jul+14%2C+2015";                                                                                //
                                                                                                                     //
    console.log("Quotes from %s to %s", sd, ed);                                                                     // 24
                                                                                                                     //
    result = Meteor.http.get('https://www.google.com/finance/historical?q=' + symbol + '&startdate=' + sd + '&enddate=' + ed + '&num=30');
    $ = cheerio.load(result.content);                                                                                // 27
                                                                                                                     //
    var quote = $('.historical_price').find('tr').text();                                                            // 29
    var cells = quote.split('\n\n');                                                                                 // 30
                                                                                                                     //
    var quotes = {};                                                                                                 // 32
                                                                                                                     //
    cells.forEach(function (cell) {                                                                                  // 34
        var q = cell.split('\n');                                                                                    // 35
        var record = {};                                                                                             // 36
        record.open = Number(q[1]);                                                                                  // 37
        record.high = Number(q[2]);                                                                                  // 38
        record.low = Number(q[3]);                                                                                   // 39
        record.close = Number(q[4]);                                                                                 // 40
        record.volume = Number(q[5].replace(/[,]/g, '')); // "123,456" --> 123456                                    // 41
                                                                                                                     //
        var dateindex = moment(q[0], "MMM DD, YYYY").format("MM/DD/YY");                                             // 43
                                                                                                                     //
        quotes[dateindex] = record;                                                                                  // 45
    });                                                                                                              // 46
                                                                                                                     //
    return quotes;                                                                                                   // 48
}));                                                                                                                 // 49
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"publications.js":["./quotes",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/quotes/publications.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Quotes;module.import('./quotes',{"Quotes":function(v){Quotes=v}});                                               // 1
                                                                                                                     //
if (Meteor.isServer) {                                                                                               // 3
    // This code only runs on the server                                                                             //
    Meteor.publish('quotes', function quotesPublication() {                                                          // 5
        return Quotes.find();                                                                                        // 6
    });                                                                                                              // 7
}                                                                                                                    // 8
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"quotes.js":["meteor/mongo",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/quotes/quotes.js                                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({Quotes:function(){return Quotes}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});
                                                                                                                     //
var Quotes = new Mongo.Collection("quotes");                                                                         // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]},"stocks":{"cron.js":["meteor/meteor","./stocks","./finscraper","./finanalyzer","moment-business-days","cheerio","underscore",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/stocks/cron.js                                                                                        //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Stocks;module.import('./stocks',{"Stocks":function(v){Stocks=v}});module.import('./finscraper');module.import('./finanalyzer');
                                                                                                                     // 2
                                                                                                                     //
                                                                                                                     // 4
                                                                                                                     // 5
                                                                                                                     //
var FS = FinScraper;                                                                                                 // 7
var FA = FinAnalyzer;                                                                                                // 8
                                                                                                                     //
// var moment = require('moment');                                                                                   //
var moment = require('moment-business-days');                                                                        // 11
var cheerio = require('cheerio');                                                                                    // 12
var _ = require('underscore');                                                                                       // 13
                                                                                                                     //
// Find new dividend stocks                                                                                          //
module.export("default",exports.default=(findNewStocks = function findNewStocks(delta) {                             // 16
                                                                                                                     //
    var stocklist = [];                                                                                              // 18
                                                                                                                     //
    if (delta == undefined) {                                                                                        // 20
        var delta = 1;                                                                                               // 20
    };                                                                                                               // 20
                                                                                                                     //
    var nextday = new moment().businessAdd(delta).format("YYYY-MMM-DD"); // 2016-Jul-04                              // 22
    console.log("Finding stocks with an ex-dividend gate of " + nextday);                                            // 23
                                                                                                                     //
    result = Meteor.http.get('http://www.nasdaq.com/dividend-stocks/dividend-calendar.aspx?date=' + nextday);        // 25
    $ = cheerio.load(result.content);                                                                                // 26
                                                                                                                     //
    var fields = [];                                                                                                 // 28
    var Table = $('#Table1 tbody').find('tr').each(function (i, elem) {                                              // 29
        var rec = $(this).find('td').each(function (i, elem) {                                                       // 30
            fields[i] = $(this).text();                                                                              // 31
        });                                                                                                          // 32
                                                                                                                     //
        var sname = String(fields[0]);                                                                               // 34
        var S = sname.split("(");                                                                                    // 35
                                                                                                                     //
        var reSymbol = RegExp("[(]([A-Z.]+)[)]$");                                                                   // 37
        var sym = sname.match(reSymbol);                                                                             // 38
                                                                                                                     //
        var X = sym[0].slice(1, -1); // (CSCO) --> CSCO                                                              // 41
        stocklist.push(X);                                                                                           // 42
                                                                                                                     //
        var record = {                                                                                               // 44
            company: S[0].trim(),                                                                                    // 45
            symbol: X,                                                                                               // 46
            status: "new",                                                                                           // 47
            exDivDate: new Date(fields[1]),                                                                          // 48
            payDate: new Date(fields[6]),                                                                            // 49
            recordDate: new Date(fields[4]),                                                                         // 50
            qdivAmt: Number(fields[2]),                                                                              // 51
            adivAmt: Number(fields[3])                                                                               // 52
        };                                                                                                           // 44
                                                                                                                     //
        // check to see if we already have a "new" record for this symbol. If so, we can pass...                     //
        var found = Stocks.find({ symbol: X, status: "new" }).count();                                               // 56
                                                                                                                     //
        if (found == 0) {                                                                                            // 58
            console.log("new dividend for %s", X);                                                                   // 59
            Stocks.insert(record);                                                                                   // 60
        } else {                                                                                                     // 61
            console.log("skipped: %s already in db", X);                                                             // 62
        }                                                                                                            // 63
                                                                                                                     //
        return stocklist;                                                                                            // 65
    });                                                                                                              // 67
}));                                                                                                                 // 68
                                                                                                                     //
module.export("default",exports.default=(augmentStocks = function augmentStocks() {                                  // 70
    var S = Stocks.find({ status: 'new' }).fetch();                                                                  // 71
                                                                                                                     //
    // LOOP THROUGH RESULTS AND GET INFO                                                                             //
                                                                                                                     //
    _.each(S, function (stock) {                                                                                     // 76
                                                                                                                     //
        var stock_info = FS.getStockInfo(stock.symbol);                                                              // 78
        // now lets get dividend history                                                                             //
        var divHistory = FS.getDividendHistory(stock.symbol);                                                        // 80
                                                                                                                     //
        Stocks.update({ _id: stock._id }, {                                                                          // 83
            $set: {                                                                                                  // 84
                lastUpdated: new Date(),                                                                             // 85
                info: stock_info,                                                                                    // 86
                div_history: divHistory,                                                                             // 87
                status: 'augmented'                                                                                  // 88
            }                                                                                                        // 84
        });                                                                                                          // 83
    });                                                                                                              // 92
}));                                                                                                                 // 94
                                                                                                                     //
module.export("default",exports.default=(analyzeStocks = function analyzeStocks() {                                  // 97
    var S = Stocks.find({ status: "augmented" }).fetch();                                                            // 98
                                                                                                                     //
    _.each(S, function (stock) {                                                                                     // 100
                                                                                                                     //
        var analysis = FA.analyze(stock);                                                                            // 102
                                                                                                                     //
        Stocks.update({ _id: stock._id }, {                                                                          // 104
            $set: {                                                                                                  // 105
                analysis: analysis                                                                                   // 106
            }                                                                                                        // 105
        });                                                                                                          // 104
        console.log("%s analyzed", stock.symbol);                                                                    // 109
    });                                                                                                              // 110
}));                                                                                                                 // 111
                                                                                                                     //
module.export("default",exports.default=(monitorStocks = function monitorStocks() {                                  // 114
    var S = Stocks.find({ symbol: "T" }).fetch();                                                                    // 115
                                                                                                                     //
    _.each(S, function (stock) {                                                                                     // 117
        result = Meteor.http.get('http://www.nasdaq.com/symbol/' + stock.symbol + '/real-time');                     // 118
        $ = cheerio.load(result.content);                                                                            // 119
        var quote = Number($('#quotes_content_left__LastSale').text());                                              // 120
        var todays_high = Number($('#quotes_content_left__TodaysHigh').text());                                      // 121
        var todays_low = Number($('#quotes_content_left__TodaysLow').text());                                        // 122
        var previous_close = Number($('#quotes_content_left__PreviousClose').text());                                // 123
                                                                                                                     //
        console.log("Real time quote for %s is %d", stock.symbol, quote);                                            // 126
    });                                                                                                              // 128
}));                                                                                                                 // 129
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"finanalyzer.js":["meteor/meteor","./stocks","./lib","cheerio","underscore","moment-business-days",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/stocks/finanalyzer.js                                                                                 //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Stocks;module.import('./stocks',{"Stocks":function(v){Stocks=v}});module.import('./lib');
var cheerio = require('cheerio');                                                                                    // 2
var _ = require('underscore');                                                                                       // 3
var moment = require('moment-business-days');                                                                        // 4
                                                                                                                     //
                                                                                                                     // 6
                                                                                                                     //
                                                                                                                     // 8
                                                                                                                     //
module.export("default",exports.default=(FinAnalyzer = {                                                             // 10
                                                                                                                     //
    analyze: function analyze(stock) {                                                                               // 12
                                                                                                                     //
        // score                                                                                                     //
        var score = 0;                                                                                               // 15
                                                                                                                     //
        if (stock.info.pct_year_high != undefined) {                                                                 // 17
            if (stock.info.pct_year_high > 0.50) score += 1;                                                         // 18
        }                                                                                                            // 19
                                                                                                                     //
        if (stock.info.beta < 1.0) score += 1;                                                                       // 21
        if (stock.info.volume > 3000000) score += 1;                                                                 // 22
        if (stock.info.dividend_yield > 0.02) score += 1;                                                            // 23
        if (stock.info.payout_ratio < 0.8) score += 1;                                                               // 24
                                                                                                                     //
        var analysis = {};                                                                                           // 26
        analysis.lastAnalyzed = new Date();                                                                          // 27
        analysis.score = score;                                                                                      // 28
                                                                                                                     //
        return analysis;                                                                                             // 30
    },                                                                                                               // 31
                                                                                                                     //
    saveAnalysis: function saveAnalysis(symbol) {                                                                    // 33
                                                                                                                     //
        var record = this.getStockInfo(symbol);                                                                      // 35
        var div_history = this.getDividendHistory(symbol);                                                           // 36
                                                                                                                     //
        var result = Stocks.update({ symbol: symbol }, {                                                             // 38
            $set: {                                                                                                  // 39
                updatedOn: new Date(),                                                                               // 40
                info: record,                                                                                        // 41
                div_history: div_history,                                                                            // 42
                status: 'augmented'                                                                                  // 43
            }                                                                                                        // 39
        });                                                                                                          // 38
                                                                                                                     //
        return result;                                                                                               // 47
    }                                                                                                                // 48
                                                                                                                     //
}));                                                                                                                 // 10
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"finscraper.js":["meteor/meteor","./stocks","./lib","cheerio","underscore","moment-business-days",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/stocks/finscraper.js                                                                                  //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Stocks;module.import('./stocks',{"Stocks":function(v){Stocks=v}});module.import('./lib');
var cheerio = require('cheerio');                                                                                    // 2
var _ = require('underscore');                                                                                       // 3
var moment = require('moment-business-days');                                                                        // 4
                                                                                                                     //
                                                                                                                     // 6
                                                                                                                     //
                                                                                                                     // 8
                                                                                                                     //
module.export("default",exports.default=(convertNumberString = function convertNumberString(numberstring) {          // 10
    // converts numbers appended with M and B to millions, billions...                                               //
    var last_char = numberstring.slice(-1);                                                                          // 12
                                                                                                                     //
    if (last_char == "M" || last_char == "B") {                                                                      // 14
        var number_part = Number(numberstring.substring(0, numberstring.length - 1));                                // 15
                                                                                                                     //
        if (last_char == "M") {                                                                                      // 17
            return number_part * 1000000;                                                                            // 18
        } else if (last_char == "B") {                                                                               // 19
            return number_part * 1000000000;                                                                         // 20
        } else {                                                                                                     // 21
            return number_part;                                                                                      // 22
        }                                                                                                            // 23
    }                                                                                                                // 24
}));                                                                                                                 // 25
                                                                                                                     //
module.export("default",exports.default=(FinScraper = {                                                              // 27
                                                                                                                     //
    getStockInfo: function getStockInfo(symbol) {                                                                    // 29
                                                                                                                     //
        var record = {};                                                                                             // 31
                                                                                                                     //
        result = Meteor.http.get('https://www.google.com/finance?q=' + symbol);                                      // 33
        $ = cheerio.load(result.content);                                                                            // 34
                                                                                                                     //
        record.lastUpdate = new Date();                                                                              // 36
        record.source = "google.finance";                                                                            // 37
        record.price = Number($('span[class="pr"]').text());                                                         // 38
        record.shares = convertNumberString($('td[data-snapfield="shares"]').next().text().replace(/(\r\n|\n|\r)/gm, ""));
        record.beta = Number($('td[data-snapfield="beta"]').next().text());                                          // 40
        record.eps = Number($('td[data-snapfield="eps"]').next().text());                                            // 41
                                                                                                                     //
        var div_and_yield = $('td[data-snapfield="latest_dividend-dividend_yield"]').next().text().replace(/(\r\n|\n|\r)/gm, "").split('/');
                                                                                                                     //
        record.dividend_last = Number(div_and_yield[0]);                                                             // 48
        record.dividend_yield = Number(div_and_yield[1] / 100);                                                      // 49
        record.market_cap = convertNumberString($('td[data-snapfield="market_cap"]').next().text().replace(/(\r\n|\n|\r)/gm, ""));
        record.pe_ratio = Number($('td[data-snapfield="pe_ratio"]').next().text());                                  // 51
        record.inst_own = Number($('td[data-snapfield="inst_own"]').next().text().replace(/(%|\r\n|\n|\r)/gm, "")) / 100;
                                                                                                                     //
        var vol_and_avg = $('td[data-snapfield="vol_and_avg"]').next().text().replace(/(\r\n|\n|\r)/gm, "").split("/");
                                                                                                                     //
        record.volume = vol_and_avg[0] == undefined ? undefined : convertNumberString(vol_and_avg[0]);               // 58
        record.average_volume = vol_and_avg[1] == undefined ? undefined : convertNumberString(vol_and_avg[1]);       // 59
                                                                                                                     //
        var range = $('td[data-snapfield="range"]').next().text().replace(/(\r\n|\n|\r)/gm, "").split('-');          // 61
        record.price_low = range[0] == undefined ? undefined : Number(range[0].trim());                              // 64
        record.price_high = range[1] == undefined ? undefined : Number(range[1].trim());                             // 65
                                                                                                                     //
        var range52 = $('td[data-snapfield="range_52week"]').next().text().replace(/(\r\n|\n|\r)/gm, "").split('-');
        record.price_52week_low = range52[0] == undefined ? undefined : Number(range52[0].trim());                   // 70
        record.price_52week_high = range52[1] == undefined ? undefined : Number(range52[1].trim());                  // 71
                                                                                                                     //
        record.open = Number($('td[data-snapfield="open"]').next().text());                                          // 74
        record.payout_ratio = Number(parseFloat(record.dividend_last * 4 / record.eps).toFixed(2));                  // 75
                                                                                                                     //
        record.pct_year_high = Number(parseFloat(record.price / record.price_52week_high).toFixed(3));               // 77
                                                                                                                     //
        console.log(record);                                                                                         // 79
                                                                                                                     //
        return record;                                                                                               // 81
    },                                                                                                               // 82
                                                                                                                     //
    getHistoricalQuotes: function getHistoricalQuotes(symbol, sdate, edate) {                                        // 84
                                                                                                                     //
        var sd = moment(sdate, "MM/DD/YY").format("MMM+DD%2C+YYYY");                                                 // 86
        var ed = moment(edate, "MM/DD/YY").format("MMM+DD%2C+YYYY");                                                 // 87
                                                                                                                     //
        // var startdate = "Jul+13%2C+2015";                                                                         //
        //var enddate = "Jul+14%2C+2015";                                                                            //
                                                                                                                     //
        console.log("Quotes from %s to %s", sd, ed);                                                                 // 92
                                                                                                                     //
        result = Meteor.http.get('https://www.google.com/finance/historical?q=' + symbol + '&startdate=' + sd + '&enddate=' + ed + '&num=30');
        $ = cheerio.load(result.content);                                                                            // 95
                                                                                                                     //
        var quote = $('.historical_price').find('tr').text();                                                        // 97
        var cells = quote.split('\n\n');                                                                             // 98
                                                                                                                     //
        var quotes = {};                                                                                             // 100
                                                                                                                     //
        cells.forEach(function (cell) {                                                                              // 102
            var q = cell.split('\n');                                                                                // 103
            var record = {};                                                                                         // 104
            record.open = Number(q[1]);                                                                              // 105
            record.high = Number(q[2]);                                                                              // 106
            record.low = Number(q[3]);                                                                               // 107
            record.close = Number(q[4]);                                                                             // 108
            record.volume = Number(q[5].replace(/[,]/g, '')); // "123,456" --> 123456                                // 109
                                                                                                                     //
            var dateindex = moment(q[0], "MMM DD, YYYY").format("MM/DD/YY");                                         // 111
                                                                                                                     //
            quotes[dateindex] = record;                                                                              // 113
        });                                                                                                          // 114
                                                                                                                     //
        delete quotes['Invalid date'];                                                                               // 116
                                                                                                                     //
        return quotes;                                                                                               // 118
    },                                                                                                               // 119
                                                                                                                     //
    getDividendHistory: function getDividendHistory(symbol) {                                                        // 122
                                                                                                                     //
        //const sd = moment(sdate,"MM/DD/YY").format("MMM+DD%2C+YYYY");                                              //
        //const ed = moment(edate,"MM/DD/YY").format("MMM+DD%2C+YYYY");                                              //
                                                                                                                     //
        console.log("Dividend history for %s:", symbol);                                                             // 128
                                                                                                                     //
        result = Meteor.http.get('http://www.nasdaq.com/symbol/' + symbol + '/dividend-history/');                   // 130
        $ = cheerio.load(result.content);                                                                            // 131
                                                                                                                     //
        var dividends = {};                                                                                          // 133
                                                                                                                     //
        var quote = $('#quotes_content_left_dividendhistoryGrid').text();                                            // 135
                                                                                                                     //
        dividends[0] = {};                                                                                           // 137
        dividends[0].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_0').text();                         // 138
        dividends[0].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_0').text());             // 139
        dividends[0].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_0').text();                     // 140
        dividends[0].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_0').text();                       // 141
        dividends[0].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_0').text();                       // 142
                                                                                                                     //
        dividends[1] = {};                                                                                           // 144
        dividends[1].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_1').text();                         // 145
        dividends[1].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_1').text());             // 146
        dividends[1].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_1').text();                     // 147
        dividends[1].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_1').text();                       // 148
        dividends[1].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_1').text();                       // 149
                                                                                                                     //
        dividends[2] = {};                                                                                           // 151
        dividends[2].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_2').text();                         // 152
        dividends[2].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_2').text());             // 153
        dividends[2].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_2').text();                     // 154
        dividends[2].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_2').text();                       // 155
        dividends[2].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_2').text();                       // 156
                                                                                                                     //
        dividends[3] = {};                                                                                           // 158
        dividends[3].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_3').text();                         // 159
        dividends[3].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_3').text());             // 160
        dividends[3].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_3').text();                     // 161
        dividends[3].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_3').text();                       // 162
        dividends[3].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_3').text();                       // 163
                                                                                                                     //
        dividends[4] = {};                                                                                           // 165
        dividends[4].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_4').text();                         // 166
        dividends[4].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_4').text());             // 167
        dividends[4].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_4').text();                     // 168
        dividends[4].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_4').text();                       // 169
        dividends[4].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_4').text();                       // 170
                                                                                                                     //
        dividends[5] = {};                                                                                           // 172
        dividends[5].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_5').text();                         // 173
        dividends[5].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_5').text());             // 174
        dividends[5].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_5').text();                     // 175
        dividends[5].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_5').text();                       // 176
        dividends[5].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_5').text();                       // 177
                                                                                                                     //
        dividends[6] = {};                                                                                           // 179
        dividends[6].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_6').text();                         // 180
        dividends[6].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_6').text());             // 181
        dividends[6].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_6').text();                     // 182
        dividends[6].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_6').text();                       // 183
        dividends[6].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_6').text();                       // 184
                                                                                                                     //
        dividends[7] = {};                                                                                           // 186
        dividends[7].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_7').text();                         // 187
        dividends[7].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_7').text());             // 188
        dividends[7].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_7').text();                     // 189
        dividends[7].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_7').text();                       // 190
        dividends[7].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_7').text();                       // 191
                                                                                                                     //
        dividends[8] = {};                                                                                           // 193
        dividends[8].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_8').text();                         // 194
        dividends[8].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_8').text());             // 195
        dividends[8].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_8').text();                     // 196
        dividends[8].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_8').text();                       // 197
        dividends[8].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_8').text();                       // 198
                                                                                                                     //
        dividends[9] = {};                                                                                           // 201
        dividends[9].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_9').text();                         // 202
        dividends[9].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_9').text());             // 203
        dividends[9].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_9').text();                     // 204
        dividends[9].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_9').text();                       // 205
        dividends[9].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_9').text();                       // 206
                                                                                                                     //
        return dividends;                                                                                            // 208
    },                                                                                                               // 209
                                                                                                                     //
    saveStockInfo: function saveStockInfo(symbol) {                                                                  // 212
                                                                                                                     //
        var record = this.getStockInfo(symbol);                                                                      // 214
        var div_history = this.getDividendHistory(symbol);                                                           // 215
                                                                                                                     //
        var result = Stocks.update({ symbol: symbol }, {                                                             // 217
            $set: {                                                                                                  // 218
                updatedOn: new Date(),                                                                               // 219
                info: record,                                                                                        // 220
                div_history: div_history,                                                                            // 221
                status: 'augmented'                                                                                  // 222
            }                                                                                                        // 218
        });                                                                                                          // 217
                                                                                                                     //
        return result;                                                                                               // 226
    }                                                                                                                // 227
                                                                                                                     //
}));                                                                                                                 // 27
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"lib.js":["meteor/meteor","../quotes/methods.js","./finscraper","moment-business-days","cheerio","underscore",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/stocks/lib.js                                                                                         //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});module.import('../quotes/methods.js');module.import('./finscraper');
                                                                                                                     // 2
                                                                                                                     // 3
                                                                                                                     //
var FS = FinScraper;                                                                                                 // 5
                                                                                                                     //
var moment = require('moment-business-days');                                                                        // 7
var cheerio = require('cheerio');                                                                                    // 8
var _ = require('underscore');                                                                                       // 9
                                                                                                                     //
module.export("default",exports.default=(getDividendHistory = function getDividendHistory(symbol) {                  // 11
                                                                                                                     //
    //const sd = moment(sdate,"MM/DD/YY").format("MMM+DD%2C+YYYY");                                                  //
    //const ed = moment(edate,"MM/DD/YY").format("MMM+DD%2C+YYYY");                                                  //
                                                                                                                     //
    console.log("Dividend history for %s:", symbol);                                                                 // 17
                                                                                                                     //
    result = Meteor.http.get('http://www.nasdaq.com/symbol/' + symbol + '/dividend-history/');                       // 19
    $ = cheerio.load(result.content);                                                                                // 20
                                                                                                                     //
    var dividends = {};                                                                                              // 22
                                                                                                                     //
    var quote = $('#quotes_content_left_dividendhistoryGrid').text();                                                // 24
                                                                                                                     //
    dividends[0] = {};                                                                                               // 26
    dividends[0].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_0').text();                             // 27
    dividends[0].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_0').text());                 // 28
    dividends[0].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_0').text();                         // 29
    dividends[0].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_0').text();                           // 30
    dividends[0].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_0').text();                           // 31
                                                                                                                     //
    dividends[1] = {};                                                                                               // 33
    dividends[1].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_1').text();                             // 34
    dividends[1].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_1').text());                 // 35
    dividends[1].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_1').text();                         // 36
    dividends[1].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_1').text();                           // 37
    dividends[1].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_1').text();                           // 38
                                                                                                                     //
    dividends[2] = {};                                                                                               // 40
    dividends[2].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_2').text();                             // 41
    dividends[2].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_2').text());                 // 42
    dividends[2].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_2').text();                         // 43
    dividends[2].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_2').text();                           // 44
    dividends[2].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_2').text();                           // 45
                                                                                                                     //
    dividends[3] = {};                                                                                               // 47
    dividends[3].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_3').text();                             // 48
    dividends[3].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_3').text());                 // 49
    dividends[3].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_3').text();                         // 50
    dividends[3].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_3').text();                           // 51
    dividends[3].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_3').text();                           // 52
                                                                                                                     //
    dividends[4] = {};                                                                                               // 54
    dividends[4].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_4').text();                             // 55
    dividends[4].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_4').text());                 // 56
    dividends[4].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_4').text();                         // 57
    dividends[4].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_4').text();                           // 58
    dividends[4].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_4').text();                           // 59
                                                                                                                     //
    dividends[5] = {};                                                                                               // 61
    dividends[5].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_5').text();                             // 62
    dividends[5].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_5').text());                 // 63
    dividends[5].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_5').text();                         // 64
    dividends[5].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_5').text();                           // 65
    dividends[5].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_5').text();                           // 66
                                                                                                                     //
    dividends[6] = {};                                                                                               // 68
    dividends[6].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_6').text();                             // 69
    dividends[6].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_6').text());                 // 70
    dividends[6].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_6').text();                         // 71
    dividends[6].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_6').text();                           // 72
    dividends[6].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_6').text();                           // 73
                                                                                                                     //
    dividends[7] = {};                                                                                               // 75
    dividends[7].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_7').text();                             // 76
    dividends[7].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_7').text());                 // 77
    dividends[7].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_7').text();                         // 78
    dividends[7].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_7').text();                           // 79
    dividends[7].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_7').text();                           // 80
                                                                                                                     //
    dividends[8] = {};                                                                                               // 82
    dividends[8].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_8').text();                             // 83
    dividends[8].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_8').text());                 // 84
    dividends[8].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_8').text();                         // 85
    dividends[8].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_8').text();                           // 86
    dividends[8].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_8').text();                           // 87
                                                                                                                     //
    dividends[9] = {};                                                                                               // 90
    dividends[9].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_9').text();                             // 91
    dividends[9].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_9').text());                 // 92
    dividends[9].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_9').text();                         // 93
    dividends[9].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_9').text();                           // 94
    dividends[9].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_9').text();                           // 95
                                                                                                                     //
    return dividends;                                                                                                // 97
}));                                                                                                                 // 98
                                                                                                                     //
module.export("default",exports.default=(evaluateFullDivPerformance = function evaluateFullDivPerformance(symbol) {  // 100
    var divHistory = FS.getDividendHistory(symbol);                                                                  // 101
    // loop through div history                                                                                      //
    _.each(divHistory, function (divpayout) {                                                                        // 103
        console.log("Paid %d on %s", divpayout.amount, divpayout.exdate);                                            // 104
        var result = whatHappened(symbol, divpayout);                                                                // 105
        console.log(result);                                                                                         // 106
    });                                                                                                              // 107
}));                                                                                                                 // 108
                                                                                                                     //
module.export("default",exports.default=(whatHappened = function whatHappened(symbol, divpayout) {                   // 110
                                                                                                                     //
    var results = {};                                                                                                // 112
                                                                                                                     //
    results.exDivDate = divpayout.exdate;                                                                            // 114
    results.amount = divpayout.amount;                                                                               // 115
                                                                                                                     //
    var xdiv = moment(divpayout.exdate, "MM/DD/YYYY");                                                               // 117
    var xdiv_m0 = xdiv.format("MM/DD/YY");                                                                           // 118
    var xdiv_m1 = xdiv.businessSubtract(1).format("MM/DD/YY");                                                       // 119
    var xdiv_m3 = xdiv.businessSubtract(3).format("MM/DD/YY");                                                       // 120
    var xdiv_p3w = xdiv.businessAdd(22).format("MM/DD/YY");                                                          // 121
                                                                                                                     //
    // Now let get quotes from m3d to p3w (minus 3 day to plus 3 weeks)                                              //
                                                                                                                     //
    var quotes = FS.getHistoricalQuotes(symbol, xdiv_m3, xdiv_p3w);                                                  // 125
                                                                                                                     //
    results.xdiv_m1_open = quotes[xdiv_m1].open;                                                                     // 127
    results.xdiv_m1_close = quotes[xdiv_m1].close;                                                                   // 128
    results.before_rise = quotes[xdiv_m1].close > quotes[xdiv_m1].open;                                              // 129
                                                                                                                     //
    var phaseB_profit_price = quotes[xdiv_m1].open * 1.005;                                                          // 131
    results.before_profit = quotes[xdiv_m1].high > phaseB_profit_price;                                              // 132
                                                                                                                     //
    results.xdiv_m0_open = quotes[xdiv_m0].open;                                                                     // 134
    results.xdiv_m0_close = quotes[xdiv_m0].close;                                                                   // 135
    results.xdiv_m0_high = quotes[xdiv_m0].high;                                                                     // 136
    results.on_rise = quotes[xdiv_m0].close > quotes[xdiv_m0].open;                                                  // 137
                                                                                                                     //
    var phaseO_profit_price = (quotes[xdiv_m1].close - results.amount) * 1.005;                                      // 139
    results.on_profit = quotes[xdiv_m0].high > phaseO_profit_price;                                                  // 140
                                                                                                                     //
    var basePrice = quotes[xdiv_m1].close;                                                                           // 143
    var bePrice = basePrice - results.amount;                                                                        // 144
                                                                                                                     //
    var dtbe = 0;                                                                                                    // 146
    var beArray = [];                                                                                                // 147
    for (i = 0; i <= 21; i++) {                                                                                      // 148
        var dayToAnalyze = xdiv.businessAdd(i).format("MM/DD/YY");                                                   // 149
        beArray.push(parseFloat(quotes[dayToAnalyze].high - bePrice).toFixed(3)); // save the delta off break even from days high
    }                                                                                                                // 151
                                                                                                                     //
    results.beArray = beArray;                                                                                       // 153
                                                                                                                     //
    // find the first index > 0 ..this is the day we had the potential to break even...                              //
    var gainLossArray = _.map(beArray, function (num) {                                                              // 156
        return num > 0;                                                                                              // 157
    });                                                                                                              // 158
                                                                                                                     //
    results.gainLossArray = gainLossArray;                                                                           // 160
                                                                                                                     //
    return results;                                                                                                  // 162
}));                                                                                                                 // 164
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"methods.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/stocks/methods.js                                                                                     //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
Meteor.methods({                                                                                                     // 1
    'stocks.test': function stocksTest() {                                                                           // 2
        console.log("I am here...");                                                                                 // 3
    }                                                                                                                // 4
});                                                                                                                  // 1
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":["./stocks",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/stocks/publications.js                                                                                //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Stocks;module.import('./stocks',{"Stocks":function(v){Stocks=v}});                                               // 1
                                                                                                                     //
if (Meteor.isServer) {                                                                                               // 3
    // This code only runs on the server                                                                             //
    Meteor.publish('stocks', function stocksPublication() {                                                          // 5
        return Stocks.find();                                                                                        // 6
    });                                                                                                              // 7
}                                                                                                                    // 8
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}],"stocks.js":["meteor/mongo",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/api/stocks/stocks.js                                                                                      //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
module.export({Stocks:function(){return Stocks}});var Mongo;module.import('meteor/mongo',{"Mongo":function(v){Mongo=v}});
                                                                                                                     //
var Stocks = new Mongo.Collection("stocks");                                                                         // 3
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"startup":{"synced_cron_config.js":["meteor/percolate:synced-cron","../api/stocks/cron","../api/quotes/cron","../api/quotes/methods",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// imports/startup/synced_cron_config.js                                                                             //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var SyncedCron;module.import('meteor/percolate:synced-cron',{"SyncedCron":function(v){SyncedCron=v}});module.import('../api/stocks/cron');module.import('../api/quotes/cron');module.import('../api/quotes/methods');
                                                                                                                     //
// cron functions                                                                                                    //
                                                                                                                     // 4
                                                                                                                     // 5
                                                                                                                     //
// methods                                                                                                           //
                                                                                                                     // 8
                                                                                                                     //
// LOAD NEW STOCKS                                                                                                   //
                                                                                                                     //
SyncedCron.add({                                                                                                     // 12
    name: 'Load any new stocks',                                                                                     // 13
    schedule: function schedule(parser) {                                                                            // 14
        // parser is a later.parse object                                                                            //
        return parser.text('every four hours');                                                                      // 16
    },                                                                                                               // 17
    job: function job() {                                                                                            // 18
        console.log("CRON: Loading new stocks");                                                                     // 19
        findNewStocks(0);                                                                                            // 20
        findNewStocks(1);                                                                                            // 21
        findNewStocks(2);                                                                                            // 22
        findNewStocks(3);                                                                                            // 23
        return 64;                                                                                                   // 24
    }                                                                                                                // 25
});                                                                                                                  // 12
                                                                                                                     //
// AUGMENT STOCKS WITH DATA                                                                                          //
                                                                                                                     //
SyncedCron.add({                                                                                                     // 30
    name: 'Augment new stocks with data',                                                                            // 31
    schedule: function schedule(parser) {                                                                            // 32
        // parser is a later.parse object                                                                            //
        return parser.text('every 4 hours');                                                                         // 34
    },                                                                                                               // 35
    job: function job() {                                                                                            // 36
        console.log("CRON: stock data augmentation");                                                                // 37
        augmentStocks();                                                                                             // 38
        return 64;                                                                                                   // 39
    }                                                                                                                // 40
});                                                                                                                  // 30
                                                                                                                     //
// SCREEN STOCKS                                                                                                     //
                                                                                                                     //
SyncedCron.add({                                                                                                     // 45
    name: 'Screen stocks ',                                                                                          // 46
    schedule: function schedule(parser) {                                                                            // 47
        // parser is a later.parse object                                                                            //
        return parser.text('every 30 minutes');                                                                      // 49
    },                                                                                                               // 50
    job: function job() {                                                                                            // 51
        console.log("CRON: stock data screening and scoring");                                                       // 52
        screenStocks();                                                                                              // 53
        return 64;                                                                                                   // 54
    }                                                                                                                // 55
});                                                                                                                  // 45
                                                                                                                     //
// MONITOR STOCKS                                                                                                    //
SyncedCron.add({                                                                                                     // 60
    name: 'Monitor stocks - Real Time Quotes',                                                                       // 61
    schedule: function schedule(parser) {                                                                            // 62
        // parser is a later.parse object                                                                            //
        return parser.text('every 60 minutes');                                                                      // 64
    },                                                                                                               // 65
    job: function job() {                                                                                            // 66
        console.log("CRON: real time stock quotes");                                                                 // 67
        realtimeQuotes();                                                                                            // 68
        return 64;                                                                                                   // 69
    }                                                                                                                // 70
});                                                                                                                  // 60
                                                                                                                     //
SyncedCron.start();                                                                                                  // 74
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},"server":{"main.js":["meteor/meteor","../imports/api/stocks/stocks","../imports/api/positions/positions","../imports/api/positions/methods.js","../imports/api/stocks/methods.js","../imports/api/stocks/lib.js","../imports/api/stocks/finscraper","../imports/api/positions/publications.js","../imports/api/stocks/publications.js","../imports/api/quotes/publications.js","../imports/startup/synced_cron_config","moment","x-ray","twilio","cheerio",function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// server/main.js                                                                                                    //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
var Meteor;module.import('meteor/meteor',{"Meteor":function(v){Meteor=v}});var Stocks;module.import('../imports/api/stocks/stocks',{"Stocks":function(v){Stocks=v}});var Positions;module.import('../imports/api/positions/positions',{"Positions":function(v){Positions=v}});module.import('../imports/api/positions/methods.js');module.import('../imports/api/stocks/methods.js');module.import('../imports/api/stocks/lib.js');module.import('../imports/api/stocks/finscraper');module.import('../imports/api/positions/publications.js');module.import('../imports/api/stocks/publications.js');module.import('../imports/api/quotes/publications.js');module.import('../imports/startup/synced_cron_config');
var moment = require('moment');                                                                                      // 2
var Xray = require('x-ray');                                                                                         // 3
                                                                                                                     //
                                                                                                                     // 5
                                                                                                                     // 6
                                                                                                                     //
// Methods                                                                                                           //
                                                                                                                     // 9
                                                                                                                     // 10
                                                                                                                     //
// Libraries                                                                                                         //
                                                                                                                     // 13
                                                                                                                     //
                                                                                                                     // 15
                                                                                                                     //
// Publications                                                                                                      //
                                                                                                                     // 18
                                                                                                                     // 19
                                                                                                                     // 20
                                                                                                                     //
//require the Twilio module and create a REST client                                                                 //
var client = require('twilio')('AC07efeeac1388651380f7b08b02792486', '799f94a18f111a3b3762bbd19520ef7e');            // 23
                                                                                                                     //
                                                                                                                     // 26
                                                                                                                     //
var cheerio = require('cheerio');                                                                                    // 28
                                                                                                                     //
Meteor.startup(function () {                                                                                         // 31
                                                                                                                     //
    //result = Meteor.http.get('http://finance.yahoo.com/webservice/v1/symbols/CSCO,AAPL/quote?format=json&view=detail');
    //var stockinfo = JSON.parse(result.content);                                                                    //
    //console.log(stockinfo.list.resources[1].resource.fields.price);                                                //
    //$ = cheerio.load(result.content);                                                                              //
                                                                                                                     //
    // Test Twilio                                                                                                   //
                                                                                                                     //
    //Send an SMS text message                                                                                       //
    /* client.sendMessage({                                                                                          //
         to:'+19197203889', // Any number Twilio can deliver to                                                      //
        from: '+19292654022', // A number you bought from Twilio and can use for outbound communication              //
        body: 'Div Dive price alert!' // body of the SMS message                                                     //
     }, function(err, responseData) { //this function is executed when a response is received from Twilio            //
         if (!err) { // "err" is an error received during the request, if any                                        //
             // "responseData" is a JavaScript object containing data received from Twilio.                          //
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1                                             //
             console.log(responseData.from); // outputs "+14506667788"                                               //
            console.log(responseData.body); // outputs "word to your mother."                                        //
         } else {                                                                                                    //
            console.log(err);                                                                                        //
        }                                                                                                            //
    });*/                                                                                                            //
                                                                                                                     //
});                                                                                                                  // 64
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}]}},{"extensions":[".js",".json",".jsx"]});
require("./server/main.js");
//# sourceMappingURL=app.js.map
