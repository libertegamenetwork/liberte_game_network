import { Server } from "@colyseus/core";
import { BunWebSockets } from "@colyseus/bun-websockets";
import { Room, Client } from "@colyseus/core";
import { Client as ProxyClient, Room as ProxyRoom } from "colyseus.js";

let clientProxy: Map<Client, ProxyClient> = new Map();
let roomProxy: Map<Client, ProxyRoom> = new Map();

class Lobby extends Room {
  onCreate(options: any) {
    console.log("Lobby room created!");

    this.onMessage("request", (client, message) => {
      console.log("Requesting a Pong Room!");
      // Pong room available at https://localhost:3002
      client.send("server", "port: 3002");
    });

    this.onMessage("connect", (client, message) => {
      // Send the port you want to connect to, then do auth on that message
      const proxyClient = new ProxyClient("ws://localhost:3002");
      clientProxy.set(client, proxyClient);
      client.send("server", "created proxy on port 3002");
    });

    this.onMessage("joinRoom", async (client, message) => {
      const proxyClient = clientProxy.get(client);
      if (!proxyClient) {
        client.send("server", "Not connected to any games!");
      } else {
        const proxyRoom = await proxyClient.joinOrCreate("lobby");
        client.send("server", "created a room on proxy 3002");
        roomProxy.set(client, proxyRoom);
        proxyRoom.onMessage("*", (type, msg) => {
          client.send("game", { type, msg });
        });
      }
    });

    this.onMessage("*", (client, type, message) => {
      //const proxyClient = clientProxy.get(client);
      const proxyRoom = roomProxy.get(client);
      if (!proxyRoom) {
        client.send("server", "Not connected to any games!");
      } else {
        proxyRoom.send(type, message);
      }
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

const gameServer = new Server({
  transport: new BunWebSockets({
    /* Bun.serve options */
  }),
});

gameServer.define("lobby", Lobby);

gameServer.listen(3000);
