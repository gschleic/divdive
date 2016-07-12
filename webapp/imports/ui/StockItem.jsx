import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class StockItem extends Component {

    render() {
        // Just render a placeholder container that will be filled in
        return (
            <li>Stock : {this.props.stock.symbol}</li>
        );
    }
}
