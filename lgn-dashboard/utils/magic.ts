import { Magic } from "magic-sdk";

export const magicLogout = async (magic: Magic | null) => {
  if (await magic?.user.isLoggedIn()) {
    await magic?.user.logout();
  }
};

const createMagic = (key: string) => {
  // We make sure that the window object is available
  // Then we create a new instance of Magic using a publishable key
  return typeof window !== "undefined" && new Magic(key);
};

// Pass in your publishable key from your .env file
export const magic = createMagic(process.env.NEXT_PUBLIC_MAGIC_API_KEY!);
