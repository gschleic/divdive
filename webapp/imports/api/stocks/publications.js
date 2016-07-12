import { Stocks} from './stocks';

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('stocks', function stocksPublication() {
        return Stocks.find();
    });
}
