import {Meteor} from 'meteor/meteor';
var cheerio = require('cheerio');
var _ = require('underscore');
var fs = require('fs');

var moment = require('moment-business-days');
var SS = require('simple-statistics');

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

    evaluatePostPayoutPerf: function (payout,algo) {


        /*
        algo.gain_capture = % of div gain to capture
        algo.stop_loss = % of div to set as stop loss level
        algo.auto_close_day = day number to autosell at the close price. 1 = exdiv,

         */

        const analysis = {};
        const highs = [];
        const lows = [];
        const spread = [];

        const quotes = payout.exdiv;
        const gainPriceTrigger = parseFloat(payout.breakeven + (payout.amount * algo.gain_capture)).toFixed(2);
        const lossPriceTrigger = parseFloat(payout.breakeven - (payout.amount * algo.stop_loss)).toFixed(2);

        const baseline = quotes[0].close;

        analysis.results = []

        for (i=0; i < quotes.length; i++) {
            highs[i] = parseFloat((quotes[i].high - baseline) / baseline).toFixed(4);
            lows[i] = parseFloat((quotes[i].low - baseline) / baseline).toFixed(4);
            spread[i] = Math.abs(highs[i] - lows[i]);

            /* code each day as G,L,u, or - = Gain, Loss, Unknown, or "push" ) */
            if (quotes[i].high >= gainPriceTrigger) {
                if (quotes[i].low <= lossPriceTrigger) {
                    analysis.results.push("u");
                } else {
                    analysis.results.push("G");
                }
            } else if (quotes[i].low < lossPriceTrigger) {
                analysis.results.push("L");
            } else {
                analysis.results.push("-");
            }


        }

        /* lets see what the actual result would be using algo */
        let firstG = _.indexOf(analysis.results,"G");
        let firstL = _.indexOf(analysis.results,"L");
        let firstu = _.indexOf(analysis.results,"u");

        if (firstG == -1) firstG = 99;
        if (firstL == -1) firstL = 99;
        if (firstu == -1) firstu = 99;
        
        if (firstG < firstL) {
            analysis.outcome = "G";
            analysis.profit = parseFloat((gainPriceTrigger - payout.breakeven)/payout.breakeven).toFixed(4);
        } else if (firstL < firstG) {
            analysis.outcome = "L";
            analysis.profit = parseFloat((lossPriceTrigger - payout.breakeven)/payout.breakeven).toFixed(4);
        } else if ((firstu < firstL) && (firstu < firstG)) {
            analysis.outcome = "u";
            analysis.profit = 0;
        } else {
            analysis.outcome = "-";
            analysis.profit = 0;
        }
        
        /* Lets code the ACTUAL ALGO RESULTS HERE */
        analysis.algo = {}
        if ( (analysis.results[1] == "G") || (analysis.results[1] == "u") ) {
            // sell at the gain trigger price on day 1...
            analysis.algo.profit = parseFloat((gainPriceTrigger - payout.breakeven)/payout.breakeven).toFixed(4);
        } else if ( analysis.results[2] == "G" ) {
            // sell at the gain trigger price on day 2
            analysis.algo.profit = parseFloat((gainPriceTrigger - payout.breakeven)/payout.breakeven).toFixed(4);
        } else {
            // otherwise sell at/near the day 2 close...regardless of outcome.
            analysis.algo.profit = parseFloat((quotes[2].close - payout.breakeven)/payout.breakeven).toFixed(4);
        }
        

        analysis.high = _.max(highs);
        analysis.low = _.min(lows);
        analysis.mean_spread = SS.mean(spread);
        analysis.first_day_gain = (firstG == 1);
        analysis.first_day_loss = (firstL == 1);
        analysis.up_on_pre_exdiv = (quotes[0].close > quotes[0].open);
        analysis.firstG = firstG;
        analysis.firstL = firstL;

        return analysis;
        
        
    },


    exportPayoutHistoryToFile: function () {

        const filename = "/tmp/payouthistory-" + moment().format("YYYYMMDD") + ".csv";
        fs.writeFile(filename, "DivDive Payout History\n", function (err) {
            if (err) {
                return console.log(err);
            }
        });

        const records = PayoutHistory.find({complete: true}).fetch();

        _.each(records, function (record) {

            if (record.exdiv.length < 7 ) {
                console.error(`incomplete  record - ${record.symbol}, ${record.exdivdate} - skipping.`);
            } else {
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
                    + record.exdiv[6].close + ",";

                fs.appendFile(filename, line + "\r\n", function (err) {
                    if (err) {
                        return console.log(err);
                    }
                });

            }


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
