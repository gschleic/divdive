import {Meteor} from 'meteor/meteor';
var cheerio = require('cheerio');
var _ = require('underscore');
var moment = require('moment-business-days');

import {Stocks} from './stocks';

import './lib';

export default convertNumberString = function (numberstring) {
    // converts numbers appended with M and B to millions, billions...
    const last_char = numberstring.slice(-1);

    if (last_char == "M" || last_char == "B") {
        const number_part = Number(numberstring.substring(0, numberstring.length - 1));

        if (last_char == "M") {
            return number_part * 1000000;
        } else if (last_char == "B") {
            return number_part * 1000000000;
        } else {
            return number_part;
        }
    }
}

export default FinScraper = {

    getStockInfo: function (symbol) {

        const record = {};

        result = Meteor.http.get('https://www.google.com/finance?q=' + symbol);
        $ = cheerio.load(result.content);

        record.lastUpdate = new Date();
        record.source = "google.finance";
        record.price = Number($('span[class="pr"]').text());
        record.shares = convertNumberString($('td[data-snapfield="shares"]').next().text().replace(/(\r\n|\n|\r)/gm, ""));
        record.beta = Number($('td[data-snapfield="beta"]').next().text());
        record.eps = Number($('td[data-snapfield="eps"]').next().text());


        const div_and_yield = $('td[data-snapfield="latest_dividend-dividend_yield"]').next().text()
            .replace(/(\r\n|\n|\r)/gm, "")
            .split('/');

        record.dividend_last = Number(div_and_yield[0]);
        record.dividend_yield = Number(div_and_yield[1] / 100);
        record.market_cap = convertNumberString($('td[data-snapfield="market_cap"]').next().text().replace(/(\r\n|\n|\r)/gm, ""));
        record.pe_ratio = Number($('td[data-snapfield="pe_ratio"]').next().text());
        record.inst_own = Number($('td[data-snapfield="inst_own"]').next().text().replace(/(%|\r\n|\n|\r)/gm, "")) / 100;

        const vol_and_avg = $('td[data-snapfield="vol_and_avg"]').next().text()
            .replace(/(\r\n|\n|\r)/gm, "")
            .split("/");

        record.volume = (vol_and_avg[0] == undefined ? undefined : convertNumberString(vol_and_avg[0]));
        record.average_volume = (vol_and_avg[1] == undefined ? undefined : convertNumberString(vol_and_avg[1]));

        const range = $('td[data-snapfield="range"]').next().text()
            .replace(/(\r\n|\n|\r)/gm, "")
            .split('-');
        record.price_low = (range[0] == undefined ? undefined : Number(range[0].trim()));
        record.price_high = (range[1] == undefined ? undefined : Number(range[1].trim()));

        const range52 = $('td[data-snapfield="range_52week"]').next().text()
            .replace(/(\r\n|\n|\r)/gm, "")
            .split('-');
        record.price_52week_low = (range52[0] == undefined ? undefined : Number(range52[0].trim()))
        record.price_52week_high = (range52[1] == undefined ? undefined : Number(range52[1].trim()));


        record.open = Number($('td[data-snapfield="open"]').next().text());
        record.payout_ratio = Number(parseFloat((record.dividend_last * 4) / record.eps).toFixed(2));

        record.pct_year_high = Number(parseFloat(record.price / record.price_52week_high).toFixed(3));

        console.log(record);

        return record;
    },

    getHistoricalQuotes: function (symbol, sdate, edate) {

        const sd = moment(sdate, "MM/DD/YY").format("MMM+DD%2C+YYYY");
        const ed = moment(edate, "MM/DD/YY").format("MMM+DD%2C+YYYY");

        // var startdate = "Jul+13%2C+2015";
        //var enddate = "Jul+14%2C+2015";

        console.log("Quotes from %s to %s", sd, ed);

        result = Meteor.http.get('https://www.google.com/finance/historical?q=' + symbol + '&startdate=' + sd + '&enddate=' + ed + '&num=30');
        $ = cheerio.load(result.content);

        var quote = $('.historical_price').find('tr').text();
        var cells = quote.split('\n\n');

        var quotes = {};

        cells.forEach(function (cell) {
            const q = cell.split('\n');
            const record = {};
            record.open = Number(q[1]);
            record.high = Number(q[2]);
            record.low = Number(q[3]);
            record.close = Number(q[4]);
            record.volume = Number(q[5].replace(/[,]/g, ''));  // "123,456" --> 123456

            const dateindex = moment(q[0], "MMM DD, YYYY").format("MM/DD/YY");

            quotes[dateindex] = record;
        });

        delete quotes['Invalid date'];

        return quotes;
    },


    getDividendHistory: function (symbol) {

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
    },


    saveStockInfo: function (symbol) {

        const record = this.getStockInfo(symbol);
        const div_history = this.getDividendHistory(symbol);

        const result = Stocks.update({symbol: symbol}, {
            $set: {
                updatedOn: new Date(),
                info: record,
                div_history: div_history,
                status: 'augmented',
            }
        });

        return result;
    }

}