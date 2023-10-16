import { Navbar } from "@/components/Navbar";
import { gameData, gameModules } from "@/stores/sampleData";
import userStore from "@/stores/userStore";
import theme from "@/styles/theme";
import {
  Box,
  Flex,
  Image,
  Text,
  Icon,
  Card,
  Button,
  VStack,
  Spinner,
  Grid,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { MdArrowBack, MdShare, MdLanguage } from "react-icons/md";

const GamePage = () => {
  const router = useRouter();
  const { ownedGames, loggedIn } = userStore();
  console.log("og: ", ownedGames);

  const { gameId } = router.query;

  //   const [gameData, setGameData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ownedGames && ownedGames.length > 0) {
      setIsLoading(false);
    }
  }, [ownedGames]);

  const currentOwnedGame = ownedGames.find((game) => game.gameId === gameId);
  console.log("currentOwnedGame: ", currentOwnedGame);

  const ownedModuleIds = currentOwnedGame ? currentOwnedGame.gameModules : [];
  console.log("ownedModuleIds: ", ownedModuleIds);

  gameModules.map((module) => {
    console.log("modid: ", typeof module.moduleId, module.moduleId);
  });

  //   useEffect(() => {
  //     // Fetch game data based on gameId
  //     if (gameId) {
  //       // Replace this with your actual API endpoint
  //       fetch(`/api/games/${gameId}`)
  //         .then((response) => response.json())
  //         .then((data) => {
  //           setGameData(data);
  //         })
  //         .catch((error) => {
  //           console.error('Error fetching game data:', error);
  //         });
  //     }
  //   }, [gameId]);
  // Render the game data on the page
  return (
    <>
      <Box minHeight="100vh">
        <Navbar />
        <Flex
          h="92vh"
          w="100vw"
          bg={theme.colors.background}
          color={theme.colors.lightBlue}
          fontFamily="Montserrat"
          justifyContent="spacebetween"
          align="center"
        >
          <Flex direction="column" p="2rem" h="100%" w="100%" overflowY="auto">
            {isLoading ? (
              <Flex
                h="100%"
                w="100%"
                bg={theme.colors.background}
                color={theme.colors.lightBlue}
                fontFamily="Montserrat"
                justifyContent="center"
                align="center"
              >
                <Flex
                  w="100%"
                  flexDirection="column"
                  align="center"
                  justifyContent="center"
                  color={theme.colors.lightBlue}
                  my="4.58rem"
                >
                  <Spinner color={theme.colors.lightBlue} size="sm" />
                  <Text mt={3} fontSize="0.75rem" fontWeight="500">
                    LOADING
                  </Text>
                </Flex>
              </Flex>
            ) : !gameData ? (
              <Flex
                h="100%"
                w="100%"
                bg={theme.colors.background}
                color={theme.colors.lightBlue}
                fontFamily="Montserrat"
                justifyContent="center"
                align="center"
              >
                <Box>
                  <Text>AW SHUCKS, PLEASE LOGIN TO USE LIBERTE!</Text>
                </Box>
              </Flex>
            ) : (
              <Flex flexDirection="row" w="100%" pt="1rem">
                <Flex direction="column" w="5%" justifyContent="start">
                  <Icon
                    as={MdArrowBack}
                    w="1.5rem"
                    h="1.5rem"
                    cursor="pointer"
                    color="lightBlue"
                    onClick={() => router.back()}
                  />
                </Flex>
                <Flex direction="column" w="95%" justifyContent="start">
                  <Flex>
                    <Flex direction="column" w="50%">
                      <Image
                        src="https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S2_1200x1600-a0ffbc8c70fd33180b6f1bdb1dfd4eb2"
                        alt="Game"
                        h="40vh"
                        borderRadius="2px"
                      />
                    </Flex>
                    <Flex direction="column" w="50%" pl="3rem">
                      <Flex
                        flexDirection="row"
                        w="100%"
                        mb="1.5rem"
                        justifyContent="space-between"
                      >
                        <Flex
                          w="70%"
                          h="100%"
                          justifyContent="start"
                          align="center"
                          gap="1rem"
                        >
                          <Card
                            borderRadius="2px"
                            borderWidth="2px"
                            px="0.75rem"
                            py="0.25rem"
                            fontSize="0.75rem"
                            fontWeight="700"
                            color={theme.colors.background}
                            borderColor={theme.colors.lightBlue}
                            bg={theme.colors.lightBlue}
                          >
                            {gameData.tags[0]}
                          </Card>
                          <Card
                            borderRadius="2px"
                            borderWidth="2px"
                            px="0.75rem"
                            py="0.25rem"
                            fontSize="0.75rem"
                            fontWeight="700"
                            color={theme.colors.background}
                            borderColor={theme.colors.lightBlue}
                            bg={theme.colors.lightBlue}
                          >
                            {gameData.tags[1]}
                          </Card>
                        </Flex>
                      </Flex>
                      <Flex w="100%" justifyContent="space-between">
                        <Text
                          w="70%"
                          fontSize="1.75rem"
                          fontWeight="600"
                          fontFamily={theme.fonts.heading}
                        >
                          {gameData.title}
                        </Text>
                        <Flex
                          w="30%"
                          h="100%"
                          justifyContent="space-between"
                          align="center"
                        >
                          <Icon
                            as={MdLanguage}
                            color={theme.colors.lightBlue}
                            fontSize="1.25rem"
                            fontWeight="800"
                            cursor="pointer"
                            onClick={() => router.back()}
                          />
                          <Icon
                            as={FaTwitter}
                            color={theme.colors.lightBlue}
                            fontSize="1.25rem"
                            fontWeight="800"
                            cursor="pointer"
                            onClick={() => router.back()}
                          />
                          <Icon
                            as={FaDiscord}
                            color={theme.colors.lightBlue}
                            fontSize="1.25rem"
                            fontWeight="800"
                            cursor="pointer"
                            onClick={() => router.back()}
                          />
                          <Icon
                            as={MdShare}
                            color={theme.colors.lightBlue}
                            fontSize="1.25rem"
                            fontWeight="800"
                            cursor="pointer"
                            onClick={() => router.back()}
                          />
                        </Flex>
                      </Flex>

                      <Flex w="100%" justifyContent="space-between">
                        <Text
                          fontWeight="400"
                          fontFamily={theme.fonts.heading}
                          fontSize="1rem"
                          w="70%"
                          my="0.5rem"
                          ml="0.1rem"
                        >
                          By: {gameData.creator}
                        </Text>
                      </Flex>

                      {/* <Flex my="1rem">
              <Button
                onClick={() => {}}
                variant="outline"
                backgroundColor={theme.colors.lightBlue}
                borderColor={theme.colors.lightBlue}
                border="2px solid"
                borderRadius="2px"
                color={theme.colors.background}
                w="100%"
                h="3rem"
                fontSize="0.75rem"
                fontWeight="700"
              >
                PURCHASE
              </Button>
            </Flex> */}

                      <Text
                        my="1rem"
                        fontSize="0.85rem"
                        fontFamily={theme.fonts.heading}
                      >
                        {gameData.description}
                      </Text>
                    </Flex>
                  </Flex>
                  <Flex direction="row" w="100%" mt="3rem">
                    <VStack w="100%" gap="1.5rem">
                      {gameModules.map((module) => (
                        <Flex
                          key={module.moduleId}
                          w="100%"
                          backgroundColor={theme.colors.background}
                          borderColor={theme.colors.lightBlue}
                          borderWidth="2px"
                          borderRadius="2px"
                          justifyContent="space-between"
                          align="center"
                          p="1rem"
                        >
                          <Flex
                            flexDirection="column"
                            h="100%"
                            w="100%"
                            justifyContent="start"
                            align="start"
                          >
                            <Text
                              fontSize="1rem"
                              fontWeight="600"
                              fontFamily={theme.fonts.heading}
                              pb="0.25rem"
                            >
                              {module.name}
                            </Text>
                            <Text
                              fontSize="0.75rem"
                              fontWeight="600"
                              fontFamily={theme.fonts.heading}
                              pb="0.5rem"
                            >
                              {module.description}
                            </Text>
                          </Flex>
                          <Flex
                            flexDirection="column"
                            h="100%"
                            justifyContent="center"
                            align="center"
                          >
                            {ownedModuleIds.includes(
                              String(module.moduleId)
                            ) ? (
                              <Button
                                onClick={() => {
                                  if (loggedIn) {
                                    toast.error("Game launched!");
                                  } else {
                                    toast.error(
                                      "Please login to play this game!"
                                    );
                                  }
                                }}
                                variant="outline"
                                backgroundColor={theme.colors.lightBlue}
                                borderColor={theme.colors.lightBlue}
                                borderWidth="2px"
                                borderRadius="2px"
                                color={theme.colors.background}
                                h="2rem"
                                fontSize="0.75rem"
                                fontWeight="700"
                              >
                                PLAY
                              </Button>
                            ) : (
                              <Button
                                onClick={() => {}}
                                variant="outline"
                                backgroundColor={theme.colors.background}
                                borderColor={theme.colors.lightBlue}
                                borderWidth="2px"
                                borderRadius="2px"
                                color={theme.colors.lightBlue}
                                h="2rem"
                                fontSize="0.75rem"
                                fontWeight="700"
                              >
                                PURCHASE
                              </Button>
                            )}
                          </Flex>
                        </Flex>
                      ))}
                    </VStack>
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default GamePage;
