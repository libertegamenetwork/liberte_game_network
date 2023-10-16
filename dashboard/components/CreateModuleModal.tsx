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
  Textarea,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function CreateModuleModal() {
  const {
    isOpen: isCreateGameModalOpen,
    onOpen: onCreateGameModalOpen,
    onClose: onCreateGameModalClose,
  } = useDisclosure();

  const [creatingModule, setCreatingModule] = useState(false);
  const [selectedModuleImage, setSelectedModuleImage] = useState<File | null>(
    null
  );

  function truncateFilename(filename: string, maxLength = 30) {
    if (filename.length <= maxLength || !filename.includes("."))
      return filename;

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

  const [selectedModuleJSON, setSelectedModuleJSON] = useState<File | null>(
    null
  );
  const [selectedCapnp, setSelectedCapnp] = useState<File | null>(null);

  const [moduleJSONContent, setModuleJSONContent] = useState<string | null>(
    null
  );
  const [capnpContent, setCapnpContent] = useState<string | null>(null);

  useEffect(() => {
    async function loadFileContent() {
      if (selectedModuleJSON) {
        const content = await readFileContent(selectedModuleJSON);
        setModuleJSONContent(content);
      } else {
        setModuleJSONContent(null);
      }

      if (selectedCapnp) {
        const content = await readFileContent(selectedCapnp);
        setCapnpContent(content);
      } else {
        setCapnpContent(null);
      }
    }

    loadFileContent();
  }, [selectedModuleJSON, selectedCapnp]);

  const readFileContent = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target!.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
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
        NEW MODULE +
      </Button>
      <Modal isOpen={isCreateGameModalOpen} onClose={onCreateGameModalClose}>
        <ModalOverlay />
        <ModalContent
          bg={theme.colors.background}
          color={theme.colors.lightBlue}
        >
          <ModalHeader>
            <Heading fontSize="1.5rem">CREATE MODULE</Heading>
          </ModalHeader>
          <ModalBody>
            {!creatingModule ? (
              <VStack gap="1rem">
                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Module Name
                  </Text>
                  <Input
                    placeholder="Name your game module"
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
                </Flex>

                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Game Module Description
                  </Text>
                  <Input
                    placeholder="Describe your game module"
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
                </Flex>

                <Flex flexDirection="column" w="100%" mt="0rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    Game Module Image
                  </Text>
                  <Flex alignItems="end" marginBottom="0.5rem">
                    {/* Image Preview or Placeholder for Game Module Image */}
                    {selectedModuleImage ? (
                      <Flex
                        flexDirection="column"
                        alignItems="center"
                        marginRight="1rem"
                      >
                        <img
                          src={URL.createObjectURL(selectedModuleImage)}
                          alt="Selected game module image"
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
                      {selectedModuleImage ? (
                        <Text fontSize="0.75rem">
                          {selectedModuleImage &&
                            truncateFilename(selectedModuleImage.name)}
                        </Text>
                      ) : (
                        <Text
                          w="100%"
                          h="100%"
                          color={theme.colors.lightBlue}
                          fontSize="0.75rem"
                        ></Text>
                      )}
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
                        Select image
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              setSelectedModuleImage(e.target.files[0]);
                            } else {
                              setSelectedModuleImage(null);
                            }
                          }}
                          style={{
                            display: "none",
                          }}
                          value=""
                        />
                      </label>
                    </Flex>
                  </Flex>
                </Flex>

                {/* File Input for module.json */}
                <Flex flexDirection="column" w="100%" mt="1rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    module.json
                  </Text>
                  <Flex alignItems="end" marginBottom="0.5rem">
                    {/* Preview or Placeholder for module.json */}
                    {selectedModuleJSON ? (
                      <Textarea
                        value={moduleJSONContent || "No module.json uploaded"}
                        w="100%"
                        minHeight="4rem"
                        fontSize="0.75rem"
                        bg={theme.colors.input}
                        borderWidth="2px"
                        borderRadius="2px"
                        borderColor={theme.colors.input}
                        fontWeight="500"
                        letterSpacing="1px"
                        color={theme.colors.lightBlue}
                        focusBorderColor={theme.colors.input}
                        _focus={{ boxShadow: "none" }}
                        resize="vertical"
                        readOnly
                      />
                    ) : (
                      <Text
                        w="100%"
                        h="100%"
                        color={theme.colors.lightBlue}
                        fontSize="0.75rem"
                        textAlign="start"
                        paddingY="0.5rem"
                      >
                        No module.json uploaded
                      </Text>
                    )}
                  </Flex>
                  <label
                    style={{
                      display: "inline-block",
                      width: "auto",
                      textAlign: "center",
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
                    Upload File
                    <Input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setSelectedModuleJSON(e.target.files[0]);
                        } else {
                          setSelectedModuleJSON(null);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
                </Flex>

                {/* File Input for SaveTemplate.capnp */}
                <Flex flexDirection="column" w="100%" mt="2rem">
                  <Text
                    fontWeight="600"
                    fontFamily={theme.fonts.heading}
                    fontSize="0.75rem"
                    pb="0.25rem"
                  >
                    SaveTemplate.capnp
                  </Text>

                  <Flex alignItems="end" marginBottom="0.5rem">
                    {/* Preview or Placeholder for SaveTemplate.capnp */}
                    {selectedCapnp ? (
                      <Textarea
                        value={capnpContent || "No save file uploaded"}
                        w="100%"
                        minHeight="4rem"
                        fontSize="0.75rem"
                        bg={theme.colors.input}
                        borderWidth="2px"
                        borderRadius="2px"
                        borderColor={theme.colors.input}
                        fontWeight="500"
                        letterSpacing="1px"
                        color={theme.colors.lightBlue}
                        focusBorderColor={theme.colors.input}
                        _focus={{ boxShadow: "none" }}
                        resize="vertical"
                        readOnly
                      />
                    ) : (
                      <Text
                        w="100%"
                        h="100%"
                        color={theme.colors.lightBlue}
                        fontSize="0.75rem"
                        textAlign="start"
                        paddingY="0.5rem"
                      >
                        No save file uploaded
                      </Text>
                    )}
                  </Flex>
                  <label
                    style={{
                      display: "inline-block",
                      width: "auto",
                      padding: "0.5rem 1rem",
                      fontSize: "0.75rem",
                      textAlign: "center",

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
                    Upload File
                    <Input
                      type="file"
                      accept=".capnp"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setSelectedCapnp(e.target.files[0]);
                        } else {
                          setSelectedCapnp(null);
                        }
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
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
                  CREATING MODULE
                </Text>
                <Text mt={10} fontSize="0.5rem" fontWeight="600" color="red">
                  WARNING: CLOSING WINDOW MAY RESULT IN MODULE NOT BEING CREATED
                </Text>
              </Flex>
            )}
          </ModalBody>
          <ModalFooter>
            <Flex
              justifyContent="space-between"
              w="100%"
              py="0.75rem"
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
                isDisabled={creatingModule}
              >
                CANCEL
              </Button>
              <Button
                onClick={() => {}}
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
                isDisabled={creatingModule}
              >
                CREATE
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
