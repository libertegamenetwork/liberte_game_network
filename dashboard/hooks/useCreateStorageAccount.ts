import { StorageAccountResponse } from "@/types/types";
import { createStorageAccount } from "@/utils";
import { useMutation } from "@tanstack/react-query";

const emptyStorageAccountResponse: StorageAccountResponse = {
  shdw_bucket: "",
  transaction_signature: "",
};

export const useCreateStorageAccount = (bucketName: string, size: string) => {
  // A default function that does nothing when bucketName and size are not provided.
  const defaultFunction = () => Promise.resolve(emptyStorageAccountResponse);

  const mutation = useMutation(
    bucketName && size
      ? () => createStorageAccount(bucketName, size)
      : defaultFunction,
    {
      // Handle the result of the mutation
      onSuccess: (data) => {
        // If you need to do anything with the data once it's fetched, you can do so here.
        console.log("Account created successfully:", data);
      },

      // Handle if the mutation results in an error
      onError: (error: Error) => {
        console.error("Error while creating storage account:", error);
      },
    }
  );

  return {
    accountData: mutation.data ?? emptyStorageAccountResponse,
    isLoading: mutation.isLoading,
    mutate: mutation.mutate,
  };
};
