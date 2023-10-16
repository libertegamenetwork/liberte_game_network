/**
 * Uses the Tx Sig to pull the Game Request PDA
 *  Game Request PDA: Module.json Link, Session Node PDA, Verifier PDAs
 * Returns the Container ID
 */
export interface MSG_REQUEST {
  type: "request";
  pubkey: String;
  sig: String;
  txSignature: String;
}

export interface Container {
  id: String;
  //pubkeys authorized to connect to this container
  // first one is always the container requester, as it's always allowed
  // if authorized.includes("*") then allow anyone to connect up to max connections
  authorized: String[];
  connected: number;
  maxConnections: number; //set to 1 by default
  logs: Map<String, String[]>; //websocketID > [logs]
  saveFiles: Map<String, any>; //websocketID > saveFileJSON
  resources: {
    cpu: String;
    mem: String;
  };
  prng: any;
}

// Returns running containers
export interface MSG_GET_CONTAINERS {
  type: "get_containers";
}

/**
 * Check if pubkey is in list of container.authorized, if so connect to Container
 */
export interface MSG_CONNECT {
  type: "connect";
  containerID: String;
  pubkey: String;
  sig: String;
  saveFile?: String;
}

//Log all state changes with timestamps
export interface MSG_STATE_CHANGE {
  type: "state_change";
  data: any;
}

// If pubkey == authorized[0] then shutdown the server
export interface MSG_CLOSE {
  type: "close";
  containerID: String;
  pubkey: String;
  sig: String;
}
