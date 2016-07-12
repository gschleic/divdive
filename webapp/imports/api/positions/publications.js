import { Positions } from './positions';


if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('positions', function stocksPublication() {
        return Positions.find({owner: this.user});
    });
}

