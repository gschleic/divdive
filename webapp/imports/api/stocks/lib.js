import {Meteor} from 'meteor/meteor';
import '../quotes/methods.js';

import './finscraper.js';

var FS = FinScraper;

var moment = require('moment-business-days');
var cheerio = require('cheerio');
var _ = require('underscore');



export default getHistoricalQuotesCSV = function (symbol, sdate, edate) {

    const sd = moment(sdate, "MM/DD/YY").format("MMM+DD%2C+YYYY");
    const ed = moment(edate, "MM/DD/YY").format("MMM+DD%2C+YYYY");

    result = Meteor.http.get('https://www.google.com/finance/historical?q=' + symbol + '&startdate=' + sd + '&enddate=' + ed + '&num=30');
    $ = cheerio.load(result.content);

    var quote = $('.historical_price').find('tr').text();

    var cells = quote.split('\n\n');

    const removefirst = cells.shift();
    let record = "";

    cells.forEach(function (cell) {
        const q = cell.split('\n');

        const thedate = new Date(q[0]);

        const thedate2 = String(moment(thedate).format("MM/DD/YY"));

        record = record + thedate2 + ",";
        record = record + q[1] + ",";
        record = record + q[2] + ",";
        record = record + q[3] + ",";
        record = record + q[4] + ",";
    });

    return record;
}


export default getDividendHistory = function (symbol) {

    //const sd = moment(sdate,"MM/DD/YY").format("MMM+DD%2C+YYYY");
    //const ed = moment(edate,"MM/DD/YY").format("MMM+DD%2C+YYYY");


    console.log("Dividend history for %s:", symbol);

    result = Meteor.http.get('http://www.nasdaq.com/symbol/' + symbol + '/dividend-history/');
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

export default evaluateFullDivPerformance = function (symbol) {
    var divHistory = FS.getDividendHistory(symbol);
    // loop through div history
    _.each(divHistory, function (divpayout) {
        console.log("Paid %d on %s", divpayout.amount, divpayout.exdate)
        const result = whatHappened(symbol, divpayout);
        console.log(result);
    });
}

export default whatHappened = function (symbol, divpayout) {

    const results = {}

    results.exDivDate = divpayout.exdate;
    results.amount = divpayout.amount;

    const xdiv = moment(divpayout.exdate, "MM/DD/YYYY");
    const xdiv_m0 = xdiv.format("MM/DD/YY");
    const xdiv_m1 = xdiv.businessSubtract(1).format("MM/DD/YY");
    const xdiv_m3 = xdiv.businessSubtract(3).format("MM/DD/YY");
    const xdiv_p3w = xdiv.businessAdd(22).format("MM/DD/YY");

    // Now let get quotes from m3d to p3w (minus 3 day to plus 3 weeks)

    const quotes = FS.getHistoricalQuotes(symbol, xdiv_m3, xdiv_p3w);

    results.xdiv_m1_open = quotes[xdiv_m1].open;
    results.xdiv_m1_close = quotes[xdiv_m1].close;
    results.before_rise = (quotes[xdiv_m1].close > quotes[xdiv_m1].open);

    const phaseB_profit_price = quotes[xdiv_m1].open * 1.005;
    results.before_profit = (quotes[xdiv_m1].high > phaseB_profit_price);

    results.xdiv_m0_open = quotes[xdiv_m0].open;
    results.xdiv_m0_close = quotes[xdiv_m0].close;
    results.xdiv_m0_high = quotes[xdiv_m0].high;
    results.on_rise = (quotes[xdiv_m0].close > quotes[xdiv_m0].open);

    const phaseO_profit_price = (quotes[xdiv_m1].close - results.amount) * 1.005;
    results.on_profit = (quotes[xdiv_m0].high > phaseO_profit_price);


    const basePrice = quotes[xdiv_m1].close;
    const bePrice = basePrice - results.amount;

    const dtbe = 0;
    const beArray = []
    for (i = 0; i <= 21; i++) {
        const dayToAnalyze = xdiv.businessAdd(i).format("MM/DD/YY");
        beArray.push(parseFloat(quotes[dayToAnalyze].high - bePrice).toFixed(3));  // save the delta off break even from days high
    }

    results.beArray = beArray;

    // find the first index > 0 ..this is the day we had the potential to break even...
    const gainLossArray = _.map(beArray, function (num) {
        return (num > 0);
    });

    results.gainLossArray = gainLossArray;

    return results;

}



