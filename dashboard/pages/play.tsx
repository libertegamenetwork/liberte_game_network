import { Navbar } from "@/components/Navbar";
import userStore from "@/stores/userStore";
import theme from "@/styles/theme";
import { Box, Image, Flex, Grid, Input, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

function PlayPage() {
  const { loggedIn } = userStore();
  const router = useRouter();

  return (
    <>
      {loggedIn ? (
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
            <Flex
              direction="column"
              p="1rem"
              h="100%"
              w="17%"
              borderRightWidth="2px"
            >
              <Flex
                direction="column"
                justifyContent="space-between"
                mt="0.75rem"
              >
                <Input
                  placeholder="SEARCH MY GAMES"
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

                {/* <Flex justifyContent="space-between" mt="1rem">
                  <Text fontSize="0.75rem" cursor="pointer">
                    FILTER
                  </Text>
                  <Text fontSize="0.75rem" cursor="pointer">
                    SORT
                  </Text>
                </Flex> */}
              </Flex>
            </Flex>
            <Flex
              direction="column"
              px="2rem"
              py="1.5rem"
              h="100%"
              w="83%"
              overflowY="auto"
            >
              <Flex direction="column">
                <Text
                  fontSize="1rem"
                  fontWeight="600"
                  fontFamily={theme.fonts.heading}
                  color={theme.colors.lightBlue}
                >
                  MY GAMES
                </Text>
                <Grid templateColumns="repeat(6, 1fr)" gap={8} mt="1rem">
                  <Box w="10rem" h="100%">
                    <Image
                      src="https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S2_1200x1600-a0ffbc8c70fd33180b6f1bdb1dfd4eb2"
                      alt="Game"
                      borderRadius="2px"
                      h="10rem"
                      w="10rem"
                      cursor="pointer"
                      onClick={() => {
                        const gameId = "1234";
                        router.push(`/game/${gameId}`);
                      }}
                    />
                    <Button
                      w="100%"
                      h="2rem"
                      borderWidth="2px"
                      borderRadius="2px"
                      mt="1rem"
                      bg={theme.colors.lightBlue}
                      borderColor={theme.colors.lightBlue}
                      color={theme.colors.background}
                      fontWeight="700"
                      letterSpacing="1px"
                      fontSize="0.75rem"
                      onClick={() => {
                        const gameId = "1234";
                        router.push(`/game/${gameId}`);
                      }}
                    >
                      PLAY
                    </Button>
                  </Box>
                </Grid>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      ) : (
        <Box minHeight="100vh">
          <Navbar />
          <Flex
            h="92vh"
            w="100vw"
            bg={theme.colors.background}
            color={theme.colors.lightBlue}
            fontFamily="Montserrat"
            justifyContent="center"
            align="center"
          >
            <Grid>
              <Text>AW SHUCKS, PLEASE LOGIN TO USE LIBERTE!</Text>
            </Grid>
          </Flex>
        </Box>
      )}
    </>
  );
}

export default PlayPage;
