import { Connection, Keypair } from "@solana/web3.js";
import { decode } from "bs58";

export const CONNECTION = new Connection("http://api.mainnet-beta.solana.com");

export const NODE_1_CONFIG = {
  PORT: 3000,
  KEYPAIR: Keypair.fromSecretKey(
    decode(process.env.NODE_1_PRIVATE_KEY as string)
  ),
};

export const NODE_2_CONFIG = {
  PORT: 3001,
  KEYPAIR: Keypair.fromSecretKey(
    decode(process.env.NODE_2_PRIVATE_KEY as string)
  ),
};

export const NODE_3_CONFIG = {
  PORT: 3002,
  KEYPAIR: Keypair.fromSecretKey(
    decode(process.env.NODE_3_PRIVATE_KEY as string)
  ),
};

export const REQUESTER_KEYPAIR = Keypair.fromSecretKey(
  decode(process.env.REQUESTER_PRIVATE_KEY as string)
);

export const PLAYER_1_KEYPAIR = Keypair.fromSecretKey(
  decode(process.env.PLAYER_1_PRIVATE_KEY as string)
);

export const PLAYER_2_KEYPAIR = Keypair.fromSecretKey(
  decode(process.env.PLAYER_2_PRIVATE_KEY as string)
);
