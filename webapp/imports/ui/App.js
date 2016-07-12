import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Stocks } from '../api/stocks/stocks';
import { Positions } from '../api/positions/positions';

import { StockItem } from '../ui/StockItem';

var moment = require('moment');


import AccountsUIWrapper from './AccountsUIWrapper.jsx';


// App component - represents the whole app
//<StockItem key={stock._id} stock={stock} />
class App extends Component {

    renderStocks() {
        console.log(this.props.stocks.length);
        console.log(this.props.stocks[4]);
        return this.props.stocks.map((stock) => (
            <p>{stock.symbol} - {parseFloat(stock.price).toFixed(2)} - {stock.score} - {parseFloat(stock.yield*100).toFixed(2)}%</p>
    ));
    }

    render() {
        return (
            <div className="container">
            <header>
                <img src="/images/banner.png" />
            <h1>Dividend Stocks</h1>
        <AccountsUIWrapper />
        </header>
                <div>
                {this.renderStocks()}
                    </div>
        </div>
    );
    }
}

App.propTypes = {
    stocks: PropTypes.array.isRequired,
    positions: PropTypes.array.isRequired,
};

export default createContainer(() => {

    Meteor.subscribe('stocks');
    Meteor.subscribe('positions');

    const nextday = new moment().startOf('day').add(1, "d");
    const ND = nextday.toDate();
    console.log(ND);

    return {
        stocks: Stocks.find({exDivDate: ND}).fetch(),
        positions: Positions.find({owner: Meteor.userId()}).fetch(),
    };
}, App);

