import { ownedGames as sampleOwnedGames } from "@/stores/sampleData";
import userStore from "@/stores/userStore";

export const fetchOwnedGames = async () => {
  const { loggedIn } = userStore.getState();

  if (!loggedIn) {
    console.error("User not logged in.");
  }

  return sampleOwnedGames; // This mimics an asynchronous fetch from '@/stores/sampleData'
};
