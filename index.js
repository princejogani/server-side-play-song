// server.js
const WebSocket = require("ws");
const https = require("https");
const fs = require("fs");

const server = https.createServer((req, res) => {
    const html = fs.readFileSync("index.html", "utf8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
});

const wss = new WebSocket.Server({ server });

let serverPCConnection = null;

wss.on("connection", (ws) => {
    ws.send("Welcome to the WebSocket server");

    wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
            // client.send('A new user has joined');
        }
    });

    ws.on("message", (messageBuffer) => {
        const message = messageBuffer.toString("utf-8");
        if (isServerPCConnection(ws, message)) {
            serverPCConnection = ws;
        }
    });

    ws.on("message", async (messageBuffer) => {
        const message = messageBuffer.toString("utf-8");
        if (serverPCConnection) {
            serverPCConnection.send(message);
        }
        // // play song on all users
        // wss.clients.forEach((client) => {
        //   if (client.readyState === WebSocket.OPEN) {
        //     client.send(message);
        //   }
        // });
    });

    ws.on("close", () => {
        console.log("disc");
        if (ws === serverPCConnection) {
            serverPCConnection = null;
        }
    });
});

function isServerPCConnection(ws, message) {
    return message.includes("server"); // set here passcode to make server
}

server.listen(3001, () => {
    console.log(
        "Server is running on http://localhost:3001/",
    );
});
