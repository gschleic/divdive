import {Meteor} from 'meteor/meteor';
var cheerio = require('cheerio');
var _ = require('underscore');
var moment = require('moment-business-days');

import {Stocks} from './stocks';

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
