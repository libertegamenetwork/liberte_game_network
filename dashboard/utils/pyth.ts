import {
  getPythProgramKeyForCluster,
  PriceStatus,
  PythConnection,
  PythHttpClient,
} from "@pythnetwork/client";
import { Connection } from "@solana/web3.js";

export const fetchPriceInSolUsd = async (): Promise<number> => {
  const CLUSTER = "pythnet";
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL as string);
  const pythPublicKey = getPythProgramKeyForCluster(CLUSTER);

  const pythClient = new PythHttpClient(connection, pythPublicKey);
  const data = await pythClient.getData();

  if (data) {
    const price = data.productPrice.get("Crypto.SOL/USD")!;
    if (price.price) {
      // console.log(
      //   `${"Crypto.SOL/USD"}: $${price.price} \xB1$${
      //     price.confidence
      //   } Status: ${PriceStatus[price.status]}`
      // );
      return price.price;
    }
  }
  return 0;
};
