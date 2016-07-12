import {Meteor} from 'meteor/meteor';
import '../quotes/methods.js';


var moment = require('moment-business-days');
var cheerio = require('cheerio');
var _ = require('underscore');

export default getDividendHistory = function (symbol) {

    //const sd = moment(sdate,"MM/DD/YY").format("MMM+DD%2C+YYYY");
    //const ed = moment(edate,"MM/DD/YY").format("MMM+DD%2C+YYYY");


    console.log("Dividend history for %s:",symbol);

    result = Meteor.http.get('http://www.nasdaq.com/symbol/'+symbol+'/dividend-history/');
    $ = cheerio.load(result.content);

    const dividends = {};

    var quote = $('#quotes_content_left_dividendhistoryGrid').text();

    dividends[0] = {};
    dividends[0].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_0').text();
    dividends[0].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_0').text());
    dividends[0].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_0').text();
    dividends[0].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_0').text();
    dividends[0].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_0').text();

    dividends[1] = {};
    dividends[1].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_1').text();
    dividends[1].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_1').text());
    dividends[1].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_1').text();
    dividends[1].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_1').text();
    dividends[1].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_1').text();

    dividends[2] = {};
    dividends[2].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_2').text();
    dividends[2].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_2').text());
    dividends[2].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_2').text();
    dividends[2].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_2').text();
    dividends[2].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_2').text();

    dividends[3] = {};
    dividends[3].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_3').text();
    dividends[3].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_3').text());
    dividends[3].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_3').text();
    dividends[3].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_3').text();
    dividends[3].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_3').text();

    dividends[4] = {};
    dividends[4].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_4').text();
    dividends[4].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_4').text());
    dividends[4].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_4').text();
    dividends[4].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_4').text();
    dividends[4].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_4').text();

    dividends[5] = {};
    dividends[5].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_5').text();
    dividends[5].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_5').text());
    dividends[5].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_5').text();
    dividends[5].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_5').text();
    dividends[5].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_5').text();

    dividends[6] = {};
    dividends[6].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_6').text();
    dividends[6].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_6').text());
    dividends[6].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_6').text();
    dividends[6].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_6').text();
    dividends[6].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_6').text();

    dividends[7] = {};
    dividends[7].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_7').text();
    dividends[7].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_7').text());
    dividends[7].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_7').text();
    dividends[7].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_7').text();
    dividends[7].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_7').text();

    dividends[8] = {};
    dividends[8].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_8').text();
    dividends[8].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_8').text());
    dividends[8].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_8').text();
    dividends[8].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_8').text();
    dividends[8].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_8').text();


    dividends[9] = {};
    dividends[9].exdate = $('#quotes_content_left_dividendhistoryGrid_exdate_9').text();
    dividends[9].amount = Number($('#quotes_content_left_dividendhistoryGrid_CashAmount_9').text());
    dividends[9].decldate = $('#quotes_content_left_dividendhistoryGrid_DeclDate_9').text();
    dividends[9].recdate = $('#quotes_content_left_dividendhistoryGrid_RecDate_9').text();
    dividends[9].paydate = $('#quotes_content_left_dividendhistoryGrid_PayDate_9').text();

    return dividends;
}


export default whatHappened = function (symbol,index) {

    var divHistory = getDividendHistory(symbol);

    if (divHistory.length == 0) {
        console.error("No dividend history found for %s", symbol)
    } else {

        // loop through div history
        _.each(divHistory, function (divpayout) {
            console.log("Paid %d on %s",divpayout.amount,divpayout.exdate)
        });

        console.log("XDiv date was %s",divHistory[index].exdate);
        console.log("The dividend amount was %d/share",divHistory[index].amount);


        const xdiv = moment(divHistory[index].exdate,"MM/DD/YYYY");
        const xdiv_m0 = xdiv.format("MM/DD/YY");
        const xdiv_m1 = xdiv.businessSubtract(1).format("MM/DD/YY");
        const xdiv_m3 = xdiv.businessSubtract(3).format("MM/DD/YY");
        const xdiv_p3w = xdiv.businessAdd(22).format("MM/DD/YY");

        // Now let get quotes from m3d to p3w (minus 3 day to plus 3 weeks)

        const quotes = historicalQuote(symbol, xdiv_m3, xdiv_p3w);

        console.log("Opening price on day before xdiv was %d", quotes[xdiv_m1].open);
        console.log("Closing price on day before xdiv was %d", quotes[xdiv_m1].close);
        if (quotes[xdiv_m1].close > quotes[xdiv_m1].open) {
            console.log("Traded up prior to xdiv! - morning buy...");
        }

        const phaseB_profit_price = quotes[xdiv_m1].open * 1.005;

        if (quotes[xdiv_m1].high > phaseB_profit_price) {
            console.log("PHASE B PROFIT!");
        }


        console.log("Opening price on xdiv was %d", quotes[xdiv_m0].open);
        console.log("Closing price on xdiv was %d", quotes[xdiv_m0].close);
        const amount = divHistory[index].amount;
        console.log("Should have been %d", Number(quotes[xdiv_m1].close - amount));

        const phaseO_profit_price = (quotes[xdiv_m1].close - amount)*1.005;

        if (quotes[xdiv_m0].high > phaseO_profit_price) {
            console.log("PHASE O PROFIT of 0.5% possible!");
        }



        console.log("High on xdiv was %d", quotes[xdiv_m0].high);

        // very key: dtbe - days to break even post div..
        // we need to assume some entry price. Let's take the close price on day -1
        // inouts:
        const basePrice = quotes[xdiv_m1].close;
        const bePrice = basePrice - amount;

        const dtbe = 0;
        const beArray = []
        for (i = 0; i <= 21; i++) {
            const dayToAnalyze = xdiv.businessAdd(i).format("MM/DD/YY");
            beArray.push(parseFloat(quotes[dayToAnalyze].high - bePrice).toFixed(3));  // save the delta off break even from days high
        }

        console.log("Break even array:")
        console.log(beArray);

        // find the first index > 0 ..this is the day we had the potential to break even...
        const gainLossArray = _.map(beArray, function(num) { return (num > 0); });

        console.log(gainLossArray);




        // symbol
        // xdivdate
        // days to reach price-xdiv
        //

        // console.log(quotes);

    }
}


