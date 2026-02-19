const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(express);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
    ws.on("message", function incoming(data) {
        wss.clients.forEach(function each(client) {
            const msgString = data.toString();
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(msgString);
            }
        });
    });
});

server.listen(6969, function () {
    console.log(`Server is listening on ${6969}!`);
});
