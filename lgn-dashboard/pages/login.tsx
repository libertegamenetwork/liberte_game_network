import {
  Button,
  Flex,
  Stack,
  Text,
  Spinner,
  Input,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import { FaDiscord, FaTwitter } from "react-icons/fa";
import { RPCError, RPCErrorCode } from "magic-sdk";
import { useMagic } from "@/contexts/MagicProvider";
import theme from "@/styles/theme";
import userStore from "@/stores/userStore";
import toast from "react-hot-toast";
import { WalletMultiButton } from "@/components/auth/WalletMultiButton";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";
import useOwnedGames from "@/hooks/useOwnedGames";
import { ShdwDrive } from "@shadow-drive/sdk";
import * as web3 from "@solana/web3.js";
import { setShdwConnection } from "@/utils";
import { Keypair } from "@solana/web3.js";

function LoginPage() {
  const router = useRouter();
  const { magic } = useMagic();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [isLoginInProgress, setLoginInProgress] = useState(false);

  // const { connection } = useConnection();
  const connection = new web3.Connection(process.env.NEXT_PUBLIC_RPC_URL!);
  const {
    wallet,
    publicKey,
    signTransaction,
    signAllTransactions,
    connecting,
  } = useWallet();
  const { refetch: refetchOwnedGames } = useOwnedGames();

  const { username, loggedIn } = userStore();

  useEffect(() => {
    if (loggedIn) {
      refetchOwnedGames();
      router.push("/play");
    }
  }, [loggedIn, refetchOwnedGames, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (connection && publicKey && !loggedIn && wallet) {
        setLoginInProgress(true);

        // console.log("connection: ", connection);
        // console.log("wallet: ", wallet);

        let keypair = Keypair.generate();

        let KEY: any = keypair;
        KEY.payer = keypair;

        const shadowConnection = await setShdwConnection(connection, KEY);
        userStore.setState({
          loggedIn: true,
          loginType: "SOLANA",
          username: publicKey.toString(),
          solana_wallet_address: publicKey.toString(),
          wallet: wallet,
          solanaConnection: connection,
          shadowDriveConnection: shadowConnection,
        });

        setLoginInProgress(false);
      }
    };

    fetchData();
  }, [
    connection,
    loggedIn,
    publicKey,
    refetchOwnedGames,
    router,
    signAllTransactions,
    signTransaction,
  ]);

  const handleLogin = async () => {
    setLoginInProgress(true);
    if (!loggedIn) {
      if (
        !email.match(
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        )
      ) {
        console.log("email error");
        setEmailError(true);
      } else {
        try {
          setEmailError(false);
          // console.log("magic: ", magic);
          // console.log("magic user: ", magic?.user);
          // console.log("magic rpc: ", magic?.rpcProvider);
          // console.log("magic wallet: ", magic?.wallet);

          const account = await magic?.auth.loginWithEmailOTP({
            email,
            showUI: true,
          });

          if (account) {
            const metadata = await magic?.user.getInfo();
            // console.log("metadata: ", magic?.user.getInfo());
            // const magWallet = magic?.wallet
            const solConnection = new web3.Connection(
              process.env.NEXT_PUBLIC_RPC_URL!
            );
            userStore.setState({
              loggedIn: true,
              loginType: "EMAIL",
              username: metadata?.email || "",
              solana_wallet_address: metadata?.publicAddress || "",
              solanaConnection: solConnection,
            });
            setEmail("");
          } else {
            console.log("no account");
          }
        } catch (e) {
          console.log("login error: " + JSON.stringify(e));
          if (e instanceof RPCError) {
            switch (e.code) {
              case RPCErrorCode.MagicLinkFailedVerification:
              case RPCErrorCode.MagicLinkExpired:
              case RPCErrorCode.MagicLinkRateLimited:
              case RPCErrorCode.UserAlreadyLoggedIn:
                toast.error(`${e.message}`);
                break;
              default:
                toast.error("Something went wrong. Please try again");
            }
          }
        } finally {
          setLoginInProgress(false);
        }
      }
    }
  };

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100vh"
      w="100vw"
      bg={theme.colors.background}
    >
      <Flex
        direction="column"
        alignItems="center"
        fontFamily="Montserrat"
        p="1rem"
        minWidth="22rem"
      >
        <Flex justifyContent="center">
          <Heading
            fontSize="1.75rem"
            letterSpacing="0.25rem"
            fontWeight="400"
            color={theme.colors.lightBlue}
            mb="1rem"
          >
            LIBERTÉ
          </Heading>
        </Flex>
        <Flex
          w="100%"
          // borderColor={theme.colors.white}
          // border="2px solid white"
          // borderRadius="2px"
        >
          {!isLoginInProgress && !connecting ? (
            <Stack spacing={5} w="100%">
              {/* <Flex
                    flexDirection="row"
                    w="100%"
                    mt="0rem"
                    justifyContent="center"
                  >
                    <Text fontWeight="600" my="0" py="0">
                      LOGIN
                    </Text>
                  </Flex> */}

              {/* <Flex flexDirection="row" w="100%" mt="1rem" gap="1rem">
                        <Button
                          leftIcon={
                            <Image
                              src="/googleLogo.webp"
                              alt="Google Logo"
                              boxSize="1rem"
                            />
                          }
                          variant="outline"
                          borderColor={theme.colors.lightBlue}
                          border="2px solid"
                          borderRadius="2px"
                          color={theme.colors.lightBlue}
                          width="100%"
                          fontSize="0.75rem"
                          fontWeight="700"
                          _hover={{
                            color: theme.colors.background,
                            backgroundColor: theme.colors.lightBlue,
                            borderColor: theme.colors.lightBlue,
                          }}
                        >
                          GOOGLE
                        </Button>
                        <Button
                          leftIcon={<FaDiscord size="1rem" color="#5666E2" />}
                          variant="outline"
                          borderColor={theme.colors.lightBlue}
                          border="2px solid"
                          borderRadius="2px"
                          color={theme.colors.lightBlue}
                          width="100%"
                          fontSize="0.75rem"
                          fontWeight="700"
                          _hover={{
                            color: theme.colors.background,
                            backgroundColor: theme.colors.lightBlue,
                            borderColor: theme.colors.lightBlue,
                          }}
                        >
                          DISCORD
                        </Button>
                        <Button
                          leftIcon={<FaTwitter size="1rem" color="#1DA1F1" />}
                          variant="outline"
                          borderColor={theme.colors.lightBlue}
                          border="2px solid"
                          borderRadius="2px"
                          color={theme.colors.lightBlue}
                          width="100%"
                          fontSize="0.75rem"
                          fontWeight="700"
                          _hover={{
                            color: theme.colors.background,
                            backgroundColor: theme.colors.lightBlue,
                            borderColor: theme.colors.lightBlue,
                          }}
                        >
                          TWITTER
                        </Button>
                      </Flex> */}

              <Flex flexDirection="column">
                <Flex flexDirection="column" mb="1rem">
                  <Input
                    bg={theme.colors.input}
                    w="100%"
                    borderRadius="2px"
                    border={theme.colors.input}
                    fontWeight="500"
                    fontSize="0.7rem"
                    letterSpacing="1px"
                    color={theme.colors.lightBlue}
                    focusBorderColor={theme.colors.lightBlue}
                    _placeholder={{ color: theme.colors.evenLighterBlue }}
                    isDisabled={isLoginInProgress || username.length > 0}
                    onChange={(e) => {
                      if (emailError) setEmailError(false);
                      setEmail(e.target.value);
                    }}
                    placeholder={"EMAIL ADDRESS"}
                    value={email}
                    isInvalid={emailError}
                    errorBorderColor={theme.red[700]}
                    _focus={{ boxShadow: "none" }}
                  />

                  {emailError && (
                    <Text
                      className="error"
                      color={theme.red[700]}
                      fontSize="0.75rem"
                    >
                      Please enter a valid email
                    </Text>
                  )}
                </Flex>

                <Button
                  bg={theme.colors.lightBlue}
                  color={theme.colors.background}
                  borderRadius="2px"
                  letterSpacing="0.25px"
                  fontSize="0.75rem"
                  fontWeight="600"
                  w="100%"
                  isDisabled={
                    isLoginInProgress ||
                    (username.length > 0 ? false : email.length === 0)
                  }
                  onClick={() => handleLogin()}
                  isLoading={isLoginInProgress}
                  spinner={
                    <Flex flexDirection="row" align="center">
                      <Spinner color={theme.colors.background} size="sm" />
                    </Flex>
                  }
                >
                  LOGIN W/ EMAIL
                </Button>
              </Flex>
              <Flex w="100%" justifyContent="center">
                <Text
                  fontWeight="600"
                  fontSize="0.75rem"
                  color={theme.colors.lightBlue}
                  py="0"
                >
                  OR{" "}
                </Text>
              </Flex>

              <WalletMultiButton />
            </Stack>
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
                LOGGING IN
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default LoginPage;
