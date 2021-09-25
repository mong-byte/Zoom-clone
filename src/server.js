import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log("Listening on http://localhost:3000");

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

// socket = > 연결된 Browser를 뜻함
wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "Anon";
  console.log("Connected to Browser");
  socket.on("close", () => console.log("Disconnected from the Browser"));
  socket.on("message", (msg) => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "newMessage":
        return sockets.forEach((browserSocket) =>
          browserSocket.send(
            `${socket.nickname}: ${message.payload.toString("utf-8")}`
          )
        );
      case "nickname":
        return (socket["nickname"] = message.payload);
    }
  });
});

server.listen(3000, handleListen);
