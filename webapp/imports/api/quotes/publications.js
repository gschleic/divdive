import {Quotes} from './quotes';

if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('quotes', function quotesPublication() {
        return Quotes.find();
    });
}
