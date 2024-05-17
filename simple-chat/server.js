var WebSocketServer = require("ws").Server,
  wss = new WebSocketServer({ port: 8181 });

const uuidv4 = require("uuid/v4");
const clients = [];

wss.on("connection", function (ws) {
  const clientId = uuidv4();
  clients.push({ id: clientId, ws });

  console.log("client [%s] connected", clientId);

  ws.on("message", function (message) {
    for (var i = 0; i < clients.length; i++) {
      var clientSocket = clients[i].ws;
      if (clientSocket.readyState === WebSocket.OPEN) {
        console.log("client [%s]: %s", clients[i].id, message);
        clientSocket.send(
          JSON.stringify({
            id: clients[i].id,
            message: message,
          })
        );
      }
    }
  });
});
