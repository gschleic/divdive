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
        return parser.text('every 4 hours');
    },
    job: function() {
        console.log("CRON: Loading new stocks");
        findNewStocks(0);
        findNewStocks(1);
        findNewStocks(2);
        findNewStocks(3);
        return 64;
    }
});

// AUGMENT STOCKS WITH DATA

SyncedCron.add({
    name: 'Augment new stocks with data',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 4 hours');
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
        return parser.text('every 30 minutes');
    },
    job: function() {
        console.log("CRON: stock data screening and scoring");
        analyzeStocks();
        return 64;
    }
});


// MONITOR STOCKS
SyncedCron.add({
    name: 'Monitor stocks - Real Time Quotes',
    schedule: function(parser) {
        // parser is a later.parse object
        return parser.text('every 15 minutes');
    },
    job: function() {
        console.log("CRON: real time stock quotes");
        realtimeQuotes();
        return 64;
    }
});


SyncedCron.start();
