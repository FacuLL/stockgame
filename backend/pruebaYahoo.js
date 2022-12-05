var yahooFinance = require('yahoo-finance');

yahooFinance.historical({
  symbol: 'BRLARS=X',
  from: '2018-10-01',
  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
}, function (err, quotes) {
  console.log(quotes);
});

