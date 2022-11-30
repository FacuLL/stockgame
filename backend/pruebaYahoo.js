var yahooFinance = require('yahoo-finance');

yahooFinance.quote({
    symbol: 'YPFD.BA',
    modules: [ 'price', 'summaryDetail' ] // see the docs for the full list
  }, function (err, quotes) {
    console.log(quotes);
  });