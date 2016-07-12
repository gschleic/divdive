import { SyncedCron } from 'meteor/percolate:synced-cron';

// cron functions
import '../api/stocks/cron';
import '../api/quotes/cron';

// methods
import '../api/quotes/methods';

// LOAD NEW STOCKS

SyncedCron.add({
    name: 'Load any new stocks',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('at 7:08AM');
    },
    job: function() {
        console.log("CRON: Loading new stocks");
        findNewStocks();
        return 64;
    }
});

// AUGMENT STOCKS WITH DATA

SyncedCron.add({
    name: 'Augment new stocks with data',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 2 hours');
    },
    job: function() {
        console.log("CRON: stock data augmentation");
        augmentStocks();
        return 64;
    }
});

// SCREEN STOCKS

SyncedCron.add({
    name: 'Screen stocks ',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 1 hour');
    },
    job: function() {
        console.log("CRON: stock data screening and scoring");
        screenStocks();
        return 64;
    }
});


// MONITOR STOCKS
SyncedCron.add({
    name: 'Monitor stocks - Real Time Quotes',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 10 minutes');
    },
    job: function() {
        console.log("CRON: real time stock quotes");
        realtimeQuotes();
        return 64;
    }
});


SyncedCron.start();
