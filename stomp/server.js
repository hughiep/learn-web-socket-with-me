const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({
  port: 8181,
  handleProtocols: function (protocol, cb) {
    const v12_stomp = protocol[protocol.indexOf("v12.stomp")];
    if (v12_stomp) {
      cb(true, v12_stomp);
      return;
    }
    cb(false);
  },
});

amqp = require("amqp");

var connection = amqp.createConnection({
  host: "localhost",
  login: "websockets",
  password: "rabbitmq",
});
