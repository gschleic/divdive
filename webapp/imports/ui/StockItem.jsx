import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class StockItem extends Component {

    render() {
        return (
            <li>{this.props.stock.symbol}</li>
        );
    }
}
