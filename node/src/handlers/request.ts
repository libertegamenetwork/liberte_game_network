import { z } from "zod";
import { CONNECTION, NODE_1_CONFIG } from "../constants";

const RequestPayload = z.object({
  txSig: z.string(),
});

export async function newContainer(payload: any) {
  const request = RequestPayload.parse(payload);

  const data = await getModuleData(request.txSig);
}

async function getModuleData(sig: string) {
  // Looks up the Tx Sig
  // Return the Game Request PDA
  // Returns the ModuleRequest object
  const req: ModuleRequest = {
    sessionNodeKey: NODE_1_CONFIG.KEYPAIR.publicKey.toString(),
    verifierNode1Key: "",
    verifierNode2Key: "",
    moduleServerPackage: "",
    requesterKey: "",
  };

  return req;
}

// What's derived from on chain data
export interface ModuleRequest {
  sessionNodeKey: string;
  verifierNode1Key: string;
  verifierNode2Key: string;
  moduleServerPackage: string;
  requesterKey: string;
}

// What's on chain
export interface ModuleRequestPDA {
  sessionNodePDA: string;
  verifierNode1PDA: string;
  verifierNode2PDA: string;
  moduleCNFT: string;
  requesterKey: string;
}
