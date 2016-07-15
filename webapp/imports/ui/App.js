import React, {Component, PropTypes} from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';

import {Stocks} from '../api/stocks/stocks';
import {Positions} from '../api/positions/positions';

import {StockItem} from '../ui/StockItem';

//var moment = require('moment');
var moment = require('moment-business-days');

import AccountsUIWrapper from './AccountsUIWrapper.jsx';


// App component - represents the whole app
//<StockItem key={stock._id} stock={stock} />
class App extends Component {

    renderStocks(day) {

        let stocks = [];

        if (day == "today") {
            stocks = this.props.todaystocks;
        } else if (day == "nextday") {
            stocks = this.props.nextdaystocks;
        } else if (day == "dayafter") {
            stocks = this.props.dayafterstocks
        };
        console.log("exDiv today:" + this.props.todaystocks.length);
        console.log("exDiv nextday:" + this.props.nextdaystocks.length);
        console.log("exDiv dayafter:" + this.props.dayafterstocks.length);

        // add a link to google
        stocks.map((stock) => {
            stock.googlelink = "https://www.google.com/finance?q="+stock.symbol;
            stock.newslink = "https://www.google.com/finance/company_news?q="+stock.symbol;
        })

        return stocks.map((stock) => (
            <tr key={stock.symbol}>
                <td><a href={stock.googlelink}>{stock.symbol}</a></td>
                <td><a href={stock.newslink}>news</a></td>
                <td>{stock.score}</td>
                <td>{moment(stock.exDivDate).format("MM/DD/YY")}</td>
                <td>{parseFloat(stock.info.price).toFixed(2)}</td>
                <td>{stock.qdivAmt}</td>
                <td>{parseFloat(stock.info.dividend_yield * 100).toFixed(2)}%</td>
                <td>{stock.info.average_volume}</td>
                <td>{stock.info.pct_year_high}</td>
                <td>{stock.info.payout_ratio}</td>
            </tr>
        ));
    }



    render() {
        return (
            <div className="container">
                <header>
                    <img src="/images/banner.png"/>

                    <AccountsUIWrapper />
                </header>
                <h2>ex-Div date next</h2>
        <table>
                {this.renderStocks("nextday")} </table>
                <h2>ex-Div date - day after</h2>
        <table>
                {this.renderStocks("dayafter")} </table>
                <h2>ex-Div date - today</h2>
        <table>
                {this.renderStocks("today")}</table>

            </div>
        );
    }
}

App.propTypes = {
    todaystocks: PropTypes.array.isRequired,
    nextdaystocks: PropTypes.array.isRequired,
    dayafterstocks: PropTypes.array.isRequired,
    positions: PropTypes.array.isRequired,
};

export default createContainer(() => {

    Meteor.subscribe('stocks');
    Meteor.subscribe('positions');

    const today = new moment().startOf('day').businessAdd(0).toDate();
    const nextday = new moment().startOf('day').businessAdd(1).toDate();
    const dayafter = new moment().startOf('day').businessAdd(2).toDate();

    return {
        todaystocks: Stocks.find({exDivDate: today}).fetch(),
        nextdaystocks: Stocks.find({exDivDate: nextday}).fetch(),
        dayafterstocks: Stocks.find({exDivDate: dayafter}).fetch(),
        positions: Positions.find({owner: Meteor.userId()}).fetch(),
    };
}, App);

