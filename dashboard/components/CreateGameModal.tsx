import theme from "@/styles/theme";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Input,
  Flex,
  VStack,
  Text,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import ChakraReactSelect from "./ChakraReactSelect";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
// import * as anchor from "@project-serum/anchor";
import { ShadowUploadResponse, ShdwDrive } from "@shadow-drive/sdk";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import userStore from "@/stores/userStore";
import {
  createNFTFromMetadata,
  createStorageAccount,
  getOwnedStorageAccounts,
  setShdwConnection,
  uploadSingleFile,
} from "@/utils";
import toast from "react-hot-toast";
import { ServiceCharge } from "@/types/types";
import { Keypair } from "@solana/web3.js";

export function CreateGameModal() {
  const {
    isOpen: isCreateGameModalOpen,
    onOpen: onCreateGameModalOpen,
    onClose: onCreateGameModalClose,
  } = useDisclosure();

  const {
    loggedIn,
    loginType,
    solana_wallet_address,
    solanaConnection,
    shadowDriveConnection,
    wallet,
  } = userStore();

  // const [selectedOption, setSelectedOption] = useState<OptionType[]>([]);
  const [creatingGame, setCreatingGame] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { handleSubmit, control, formState } = useForm<FormData>();
  const { errors } = formState;
  // const { connection } = useConnection();
  // const wallet = useWallet();

  const onSubmit = async (data: FormData) => {
    try {
      setCreatingGame(true);

      if (!loggedIn) {
        throw Error("Not logged in");
      }

      if (loginType === "EMAIL") {
        toast.error("Only solana wallet users can create games");
        throw Error("Only solana wallet users can use this feature");
      }

      if (!shadowDriveConnection) {
        throw Error("Shadow not connected");
      }

      console.log("0");

      const ownedStorageAccounts = await getOwnedStorageAccounts(
        solanaConnection,
        wallet
      );

      console.log("0.5");

      if (!ownedStorageAccounts || ownedStorageAccounts.length === 0) {
        const bucketName = data.gameName;

        if (!selectedFile) {
          throw new Error("No file selected");
        }

        // Get the size of the selectedFile (in bytes) and multiply by 3
        const fileSizeInBytes = selectedFile.size;
        const bucketSizeInBytes = fileSizeInBytes * 3;

        // Convert the bucketSizeInBytes to MB or GB as required
        const bucketSizeInMB = Math.ceil(bucketSizeInBytes / (1024 * 1024));
        const size = `${bucketSizeInMB}MB`;

        const storageAccountResponse = await createStorageAccount(
          bucketName,
          size
        );
        if (!storageAccountResponse) {
          throw new Error("Failed to create a storage account");
        }
      }

      console.log("1");
      // 1. Upload game assets to shadow drive to get its URI.
      if (!selectedFile) {
        throw new Error("No file selected");
      }
      const gameAssetUploadResponse = (await uploadSingleFile(
        solanaConnection,
        wallet,
        selectedFile as File
      )) as ShadowUploadResponse | null;

      console.log("1 - gameAssetUploadResponse", gameAssetUploadResponse);

      if (!gameAssetUploadResponse) {
        throw new Error("Failed to upload game asset");
      }
      if (gameAssetUploadResponse.message) {
        // Handle the presence of the message in the response if needed
      }
      let gameAssetLocation = gameAssetUploadResponse.finalized_locations[0];
      console.log("1 - gameAssetLocation", gameAssetLocation);

      console.log("2");

      // 2. Construct the metadata object with the game asset's URI.
      const socialAttributes = [
        {
          trait_type: "Game Creator Website",
          value: data.creatorWebsite || "",
        },
        {
          trait_type: "Game Creator Discord",
          value: data.creatorDiscord || "",
        },
        {
          trait_type: "Game Creator Twitter",
          value: data.creatorTwitter || "",
        },
      ];

      const collectionNFTMetadata = {
        name: data.gameName,
        symbol: data.gameName.slice(0, 3).toUpperCase(),
        description: data.gameDescription,
        image: gameAssetLocation,
        attributes: socialAttributes,
        properties: {
          files: [
            {
              type: "image/jpg",
              uri: gameAssetLocation,
            },
          ],
          collection: {
            name: data.gameName,
            family: data.gameName,
          },
          creators: [
            {
              address: solana_wallet_address,
              share: 100,
            },
          ],
        },
      };

      console.log("3");

      // 3. Convert the metadata object to a JSON file.
      const metadataBlob = new Blob([JSON.stringify(collectionNFTMetadata)], {
        type: "application/json",
      });
      const metadataFile = new File(
        [metadataBlob],
        `${data.gameName}_Game.json`
      );

      console.log("4");

      // 4. Upload the JSON metadata file to shadow drive to get its URI.
      const metadataUploadResponse = (await uploadSingleFile(
        solanaConnection,
        wallet,
        metadataFile
      )) as ShadowUploadResponse | null;

      if (!metadataUploadResponse) {
        throw new Error("Failed to upload game metadata");
      }
      if (metadataUploadResponse.message) {
        // Handle the presence of the message in the response if needed
      }
      // We know the structure of ShadowUploadResponse contains finalized_locations
      let metadataLocation = metadataUploadResponse?.finalized_locations[0];

      console.log("5");
      console.log("metadataLocation", metadataLocation);

      // 5. Mint the game NFT with the metadata URI from step 4.
      // const serviceChargeDetails: ServiceCharge = {
      //   receiver: "CECAa82xYqTUa8hb7Xu3Y8RBM1ijWDnP3uV17Utua7iy",
      //   amount: 0.001,
      // };

      const mintAddress = await createNFTFromMetadata(
        metadataLocation,
        1,
        solana_wallet_address,
        solana_wallet_address
      );

      console.log("6");

      if (!mintAddress) {
        console.error("Failed to mint NFT");
      } else {
        toast.success("Game created");
      }
      console.log("NFT minted at address:", mintAddress);
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Failed to create game");
    } finally {
      setCreatingGame(false);
    }
  };

  return (
    <>
      <Button
        onClick={onCreateGameModalOpen}
        variant="outline"
        borderColor={theme.colors.lightBlue}
        border="2px solid"
        borderRadius="2px"
        color={theme.colors.lightBlue}
        w="100%"
        h="3rem"
        fontSize="1rem"
        fontWeight="700"
        fontFamily={theme.fonts.heading}
        _hover={{
          color: theme.colors.background,
          backgroundColor: theme.colors.lightBlue,
          borderColor: theme.colors.lightBlue,
        }}
      >
        NEW GAME +
      </Button>
      <Modal
        isOpen={isCreateGameModalOpen}
        onClose={onCreateGameModalClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg={theme.colors.background}
          color={theme.colors.lightBlue}
        >
          <ModalHeader>
            <Heading fontSize="1.5rem">CREATE GAME</Heading>
          </ModalHeader>
          <ModalBody>
            {!creatingGame ? (
              <VStack as="form" gap="1rem" onSubmit={handleSubmit(onSubmit)}>
                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Game Name
                  </Text>
                  <Controller
                    name="gameName"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Name your game"
                        w="100%"
                        h="2rem"
                        fontSize="0.75rem"
                        bg={theme.colors.input}
                        borderWidth="2px"
                        borderRadius="2px"
                        borderColor={theme.colors.input}
                        fontWeight="500"
                        letterSpacing="1px"
                        color={theme.colors.lightBlue}
                        focusBorderColor={theme.colors.input}
                        _placeholder={{ color: theme.colors.evenLighterBlue }}
                        _focus={{ boxShadow: "none" }}
                      />
                    )}
                  />

                  {errors.gameName && <span>Game name is required</span>}
                </Flex>
                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Game Description
                  </Text>
                  <Controller
                    name="gameDescription"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Describe your game"
                        w="100%"
                        h="2rem"
                        fontSize="0.75rem"
                        bg={theme.colors.input}
                        borderWidth="2px"
                        borderRadius="2px"
                        borderColor={theme.colors.input}
                        fontWeight="500"
                        letterSpacing="1px"
                        color={theme.colors.lightBlue}
                        focusBorderColor={theme.colors.input}
                        _placeholder={{ color: theme.colors.evenLighterBlue }}
                        _focus={{ boxShadow: "none" }}
                      />
                    )}
                  />
                  {errors.gameDescription && (
                    <span>Game description is required</span>
                  )}
                </Flex>

                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Game Cover Art
                  </Text>
                  <Flex alignItems="end" marginBottom="0.5rem">
                    {/* Image Preview or Placeholder */}
                    {selectedFile ? (
                      <Flex
                        flexDirection="column"
                        alignItems="center"
                        marginRight="1rem"
                      >
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Selected cover art"
                          style={{
                            borderRadius: "4px",
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                        />
                      </Flex>
                    ) : (
                      <Flex
                        align="center"
                        justifyContent="center"
                        boxSize="100px"
                        backgroundColor={theme.colors.input}
                        borderRadius="4px"
                        marginRight="1rem"
                      >
                        <Text
                          textAlign="center"
                          w="80%"
                          color={theme.colors.lightBlue}
                          fontSize="0.75rem"
                        >
                          No image selected
                        </Text>
                      </Flex>
                    )}

                    <Flex
                      alignItems="start"
                      justifyContent="center"
                      borderRadius="4px"
                      flexDirection="column"
                      marginRight="1rem"
                      gap={2}
                    >
                      {selectedFile ? (
                        <Text fontSize="0.75rem">
                          {selectedFile && truncateFilename(selectedFile.name)}
                        </Text>
                      ) : (
                        <Text
                          w="100%"
                          h="100%"
                          color={theme.colors.lightBlue}
                          fontSize="0.75rem"
                        ></Text>
                      )}
                      <Controller
                        name="gameCoverArt"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                          <label
                            style={{
                              display: "inline-block",
                              width: "auto",
                              padding: "0.5rem 1rem",
                              fontSize: "0.75rem",
                              backgroundColor: theme.colors.background,
                              borderWidth: "2px",
                              borderRadius: "2px",
                              borderColor: theme.colors.lightBlue,
                              fontWeight: "500",
                              letterSpacing: "1px",
                              color: theme.colors.lightBlue,
                              cursor: "pointer",
                            }}
                          >
                            Select Image
                            <Input
                              {...field}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                if (
                                  e.target.files &&
                                  e.target.files.length > 0
                                ) {
                                  setSelectedFile(e.target.files[0]);
                                  field.onChange(e.target.files[0].name);
                                } else {
                                  setSelectedFile(null);
                                  field.onChange("");
                                }
                              }}
                              style={{
                                display: "none",
                              }}
                              value=""
                            />
                          </label>
                        )}
                      />
                    </Flex>
                  </Flex>
                  {errors.gameCoverArt && (
                    <span>Game cover art is required</span>
                  )}
                </Flex>

                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Website
                  </Text>
                  <Controller
                    name="creatorWebsite"
                    control={control}
                    defaultValue=""
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Website URL"
                        w="100%"
                        h="2rem"
                        fontSize="0.75rem"
                        bg={theme.colors.input}
                        borderWidth="2px"
                        borderRadius="2px"
                        borderColor={theme.colors.input}
                        fontWeight="500"
                        letterSpacing="1px"
                        color={theme.colors.lightBlue}
                        focusBorderColor={theme.colors.input}
                        _placeholder={{ color: theme.colors.evenLighterBlue }}
                        _focus={{ boxShadow: "none" }}
                      />
                    )}
                  />
                </Flex>
                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Discord
                  </Text>
                  <Controller
                    name="creatorDiscord"
                    control={control}
                    defaultValue=""
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Discord URL"
                        w="100%"
                        h="2rem"
                        fontSize="0.75rem"
                        bg={theme.colors.input}
                        borderWidth="2px"
                        borderRadius="2px"
                        borderColor={theme.colors.input}
                        fontWeight="500"
                        letterSpacing="1px"
                        color={theme.colors.lightBlue}
                        focusBorderColor={theme.colors.input}
                        _placeholder={{ color: theme.colors.evenLighterBlue }}
                        _focus={{ boxShadow: "none" }}
                      />
                    )}
                  />
                </Flex>
                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Twitter
                  </Text>
                  <Controller
                    name="creatorTwitter"
                    control={control}
                    defaultValue=""
                    rules={{ required: false }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Twitter URL"
                        w="100%"
                        h="2rem"
                        fontSize="0.75rem"
                        bg={theme.colors.input}
                        borderWidth="2px"
                        borderRadius="2px"
                        borderColor={theme.colors.input}
                        fontWeight="500"
                        letterSpacing="1px"
                        color={theme.colors.lightBlue}
                        focusBorderColor={theme.colors.input}
                        _placeholder={{ color: theme.colors.evenLighterBlue }}
                        _focus={{ boxShadow: "none" }}
                      />
                    )}
                  />
                </Flex>
                {/* <Flex flexDirection="column" w="100%" mt="0rem">
  <Text
    fontWeight="600"
    fontFamily={theme.fonts.heading}
    fontSize="0.75rem"
    pb="0.25rem"
  >
    Gameplay Media
  </Text>
  <Controller
    name="gameplayMedia"
    control={control}
    defaultValue=""
    rules={{ required: true }}
    render={({ field }) => (
      <Input
        {...field}
        placeholder="Enter an image URL"
        w="100%"
        h="2rem"
        fontSize="0.75rem"
        bg={theme.colors.input}
        borderWidth="2px"
        borderRadius="2px"
        borderColor={theme.colors.input}
        fontWeight="500"
        letterSpacing="1px"
        color={theme.colors.lightBlue}
        focusBorderColor={theme.colors.input}
        _placeholder={{ color: theme.colors.evenLighterBlue }}
        _focus={{ boxShadow: "none" }}
      />
    )}
  />
  {errors.gameplayMedia && (
    <span>Gameplay media URL is required</span>
  )}
</Flex> */}
                {/* <Flex flexDirection="column" w="100%">
  <Text
    fontWeight="600"
    fontFamily={theme.fonts.heading}
    fontSize="0.75rem"
    pb="0.25rem"
  >
    Game Modules
  </Text>
  <Controller
    name="modules"
    control={control}
    rules={{ required: true }}
    render={({ field }) => (
      <ChakraReactSelect
        {...field}
        isMulti
        options={options}
        placeholder="Select modules"
      />
    )}
  />
  {errors.modules && <span>At least one module is required</span>}
</Flex> */}
                <Flex
                  justifyContent="space-between"
                  w="100%"
                  py="1rem"
                  mt="1rem"
                >
                  <Button
                    onClick={onCreateGameModalClose}
                    variant="outline"
                    borderColor={theme.colors.lightBlue}
                    border="2px solid"
                    borderRadius="2px"
                    color={theme.colors.lightBlue}
                    w="47%"
                    h="2.5rem"
                    fontSize="0.75rem"
                    fontWeight="600"
                    isDisabled={creatingGame}
                    _disabled={{
                      opacity: 0.5, // Dim the button
                      cursor: "default", // Set cursor to default
                      backgroundColor: "transparent",
                    }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    type="submit"
                    variant="outline"
                    borderColor={theme.colors.lightBlue}
                    backgroundColor={theme.colors.lightBlue}
                    borderWidth="2px"
                    borderRadius="2px"
                    color={theme.colors.background}
                    w="47%"
                    h="2.5rem"
                    fontSize="0.75rem"
                    fontWeight="700"
                    _hover={{
                      color: theme.colors.background,
                      backgroundColor: theme.colors.lightBlue,
                      borderColor: theme.colors.lightBlue,
                    }}
                    isDisabled={creatingGame}
                    _disabled={{
                      opacity: 0.5, // Dim the button
                      cursor: "default", // Set cursor to default
                      borderColor: theme.colors.lightBlue,
                    }}
                  >
                    CREATE
                  </Button>
                </Flex>
              </VStack>
            ) : (
              <Flex
                w="100%"
                flexDirection="column"
                align="center"
                justifyContent="center"
                color={theme.colors.lightBlue}
                my="4.58rem"
              >
                <Spinner size="sm" />
                <Text mt={3} fontSize="0.75rem" fontWeight="500">
                  CREATING GAME
                </Text>
                <Text mt={10} fontSize="0.5rem" fontWeight="600" color="red">
                  WARNING: CLOSING WINDOW MAY RESULT IN GAME NOT BEING CREATED
                </Text>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

// type OptionType = {
//   value: string;
//   label: string;
// };

// const options: OptionType[] = [
//   { value: "module1", label: "Module 1" },
//   { value: "module2", label: "Module 2" },
//   { value: "module3", label: "Module 3" },
// ];

type FormData = {
  gameName: string;
  gameDescription: string;
  gameCoverArt: string;
  creatorWebsite: string;
  creatorDiscord: string;
  creatorTwitter: string;
  // gameplayMedia: string;
  // modules: OptionType[];
};

function truncateFilename(filename: string, maxLength = 30) {
  if (filename.length <= maxLength || !filename.includes(".")) return filename;

  const lastDotIndex = filename.lastIndexOf(".");
  const fileExtension = filename.slice(lastDotIndex);
  const threeCharsBeforeDot = filename.slice(lastDotIndex - 5, lastDotIndex);
  const mainPartLength =
    maxLength - threeCharsBeforeDot.length - fileExtension.length - 3; // -3 for "..."
  if (mainPartLength <= 0) return `...${threeCharsBeforeDot}${fileExtension}`;
  return `${filename.slice(
    0,
    mainPartLength
  )}...${threeCharsBeforeDot}${fileExtension}`;
}
