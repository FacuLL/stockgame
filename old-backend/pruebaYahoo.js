var yahooFinance = require('yahoo-finance');

yahooFinance.quote({
  symbol: 'GC=F',
  modules: [ 'price', 'summaryDetail' ] // see the docs for the full list
}, function (err, quotes) {
  console.log(quotes);
});

