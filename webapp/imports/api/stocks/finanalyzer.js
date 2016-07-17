import {Meteor} from 'meteor/meteor';
var cheerio = require('cheerio');
var _ = require('underscore');
var fs = require('fs');

var moment = require('moment-business-days');

import {Stocks} from './stocks';
import {PayoutHistory} from '../payouthistory/payouthistory';


import './lib';

export default FinAnalyzer = {

    analyze: function (stock) {

        // score
        let score = 0;

        if (stock.info.pct_year_high != undefined) {
            if (stock.info.pct_year_high > 0.50) score += 1;
        }

        if (stock.info.beta < 1.0) score += 1;
        if (stock.info.volume > 3000000) score += 1;
        if (stock.info.dividend_yield > 0.02) score += 1;
        if (stock.info.payout_ratio < 0.8) score += 1;

        const analysis = {};
        analysis.lastAnalyzed = new Date();
        analysis.score = score;

        return analysis;
    },

    exportPayoutHistoryToFile: function (date) {
        const getdate = moment(date,"MM/DD/YY").toDate();
        console.log(getdate);

        const stocks = Stocks.find({}).fetch();

        console.log("number of stocks = " + stocks.length);

        const filename = "/tmp/payouthistory-"+ moment(date,"MM/DD/YY").format("YYYYMMDD") + ".csv";

        console.log(filename);

        fs.writeFile(filename,"DivDive Payout History\n", function(err) {
            if(err) {
                return console.log(err);
            }
        });

        _.each(stocks, function (stock) {

            const lines = FinAnalyzer.exportPayoutHistorySymbolCSV(stock.symbol);

            _.each(lines, function (line) {

                // console.log(line);

                fs.appendFile(filename,line + "\r\n", function(err) {
                    if(err) {
                        return console.log(err);
                    }
                });

            });


        });
    },

    
    exportPayoutHistorySymbolCSV: function (symbol) {
        
        const records = PayoutHistory.find({symbol: symbol, complete: true}).fetch();

        const lines = [];

        _.each(records, function (record) {
            const line = record.symbol + ","
            + record.exdivdate + ","
            + record.amount + ","
            + record.beflag + ","
                + record.daystobreakeven + ","
                + record.exdiv[0].open + ","
                + record.exdiv[0].high + ","
                + record.exdiv[0].low + ","
                + record.exdiv[0].close + ","
                + record.exdiv[1].open + ","
                + record.exdiv[1].high + ","
                + record.exdiv[1].low + ","
                + record.exdiv[1].close + ","
                + record.exdiv[2].open + ","
                + record.exdiv[2].high + ","
                + record.exdiv[2].low + ","
                + record.exdiv[2].close + ","
                + record.exdiv[3].open + ","
                + record.exdiv[3].high + ","
                + record.exdiv[3].low + ","
                + record.exdiv[3].close + ","
                + record.exdiv[4].open + ","
                + record.exdiv[4].high + ","
                + record.exdiv[4].low + ","
                + record.exdiv[4].close + ","
                + record.exdiv[5].open + ","
                + record.exdiv[5].high + ","
                + record.exdiv[5].low + ","
                + record.exdiv[5].close + ","
                + record.exdiv[6].open + ","
                + record.exdiv[6].high + ","
                + record.exdiv[6].low + ","
                + record.exdiv[6].close + ","
            lines.push(line);
        });

        return lines;

    },

    saveAnalysis: function (symbol) {

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
