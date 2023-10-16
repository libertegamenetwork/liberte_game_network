import { Server } from "@colyseus/core";
import { BunWebSockets } from "@colyseus/bun-websockets";
import { Room, Client } from "@colyseus/core";
import { Client as ProxyClient, Room as ProxyRoom } from "colyseus.js";
import { z } from "zod";
import { NODE_1_CONFIG, NODE_2_CONFIG, NODE_3_CONFIG } from "./constants";

const NodeAPI = z.object({
  mtype: z.string(),
  payload: z.any(),
});

class LiberteNode extends Room {
  onCreate(options: any) {
    console.log("Lobby room created!");

    this.onMessage("node", (client, message) => {
      /** Client API */
      // Request a Session Node
      // Get Running Containers
      // Connect to Container
      // Close Container
      /** Game Server API */
      // Make HTTP Request
      // Make WS Request
      // Make Blockchain Tx Request
      // Request Random Number
      try {
        const { mtype, payload } = NodeAPI.parse(message);
        switch (mtype) {
          //Client API
          case "request":
            break;
          case "list":
            break;
          case "connect":
            break;
          case "shutdown":
            break;

          // Game Server API
          case "http":
            break;
          case "ws":
            break;
          case "tx":
            break;
          case "random":
            break;
        }
      } catch (e: any) {
        console.error(e);
        client.send("error", { error: e.message || e });
      }
    });

    this.onMessage("game", (client, message) => {
      // Pass Along
    });

    this.onMessage("verifier", (client, message) => {
      /** Node API */
      // Request a Verifier Node
    });

    this.onMessage("*", (client, type, message) => {
      client.send("Unsupported Message Type!");
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("Dispose Lobby");
  }
}

let PORT = 3000;
if (process.argv[2] == "1") {
  PORT = NODE_1_CONFIG.PORT;
} else if (process.argv[2] == "2") {
  PORT = NODE_2_CONFIG.PORT;
} else if (process.argv[2] == "3") {
  PORT = NODE_3_CONFIG.PORT;
}

const nodeServer = new Server({
  greet: false,
  transport: new BunWebSockets({
    /* Bun.serve options */
  }),
});
nodeServer.define("node", LiberteNode);
nodeServer.listen(PORT);
console.log("Node started on Port: ", PORT);
