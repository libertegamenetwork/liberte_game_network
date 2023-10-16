// Import the necessary modules
import { Client } from "colyseus.js";

// Create a new client instance
const client = new Client("ws://localhost:3000");

// Connect to a room (in this example, "my_room")
const room = await client.joinOrCreate("lobby");

room.onMessage("*", (type, message) => {
  console.log(type, message);
});

room.send("request"); //return a port
await new Promise((resolve) => setTimeout(resolve, 1000));
room.send("connect"); //create a proxy
await new Promise((resolve) => setTimeout(resolve, 1000));
room.send("joinRoom"); //create a room on the proxy
await new Promise((resolve) => setTimeout(resolve, 1000));

room.send("game", "ping");
room.send("game", "pong");
