const wsServer = require("ws").Server;
const wss = new wsServer({ port: 8080 });

const stocks = { AAPL: 0, MSFT: 0, AMZN: 0, GOOG: 0, YHOO: 0 };

function randomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let stockUpdater;
let randomStockUpdater = function () {
  for (let symbol in stocks) {
    if (stocks.hasOwnProperty(symbol)) {
      let randomizedChange = randomInterval(-150, 150);
      let floatChange = randomizedChange / 100;
      stocks[symbol] += floatChange;
    }
  }
  let randomMSTime = randomInterval(500, 2500);
  stockUpdater = setTimeout(function () {
    randomStockUpdater();
  }, randomMSTime);
};
randomStockUpdater();

wss.on("connection", function (ws) {
  let clientStockUpdater;

  let sendStockUpdates = function (ws) {
    if (ws.readyState == 1) {
      let stocksObj = {};
      for (let i = 0; i < clientStocks.length; i++) {
        symbol = clientStocks[i];
        stocksObj[symbol] = stocks[symbol];
      }
      ws.send(JSON.stringify(stocksObj));
    }
  };

  clientStockUpdater = setInterval(function () {
    sendStockUpdates(ws);
  }, 1000);
  let clientStocks = [];

  ws.on("message", function (message) {
    console.log("Received: " + message);
    let stock_request = JSON.parse(message);
    clientStocks = stock_request["stocks"];
    sendStockUpdates(ws);
  });

  ws.on("close", function () {
    if (typeof clientStockUpdater !== "undefined") {
      clearInterval(clientStockUpdater);
    }
  });
});
