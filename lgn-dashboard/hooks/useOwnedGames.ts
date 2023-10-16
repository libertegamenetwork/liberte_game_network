import { useQuery } from "@tanstack/react-query";
import userStore from "@/stores/userStore";
import { fetchOwnedGames } from "@/utils/api";

const useOwnedGames = () => {
  const setOwnedGames = userStore((state) => state.setOwnedGames);
  const { loggedIn } = userStore();

  const { data, error, isLoading, refetch } = useQuery(
    ["ownedGames"],
    fetchOwnedGames,
    {
      enabled: loggedIn,
      onSuccess: (data) => {
        setOwnedGames(data);
      },
    }
  );

  return {
    ownedGames: data,
    error,
    isLoading,
    refetch,
  };
};

export default useOwnedGames;
