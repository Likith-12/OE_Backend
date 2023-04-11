import React from "react";
import { Select } from "chakra-react-select";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Box,
  Text,
  chakra,
  Center,
  Spinner,
  Flex,
  VStack,
  useColorMode,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FaChevronRight } from "react-icons/fa";
import { useEffect } from "react";
const PreferenceForm = ({ nextStep, setStep }) => {
  const { data: session, status } = useSession();

  return (
    <Box
      // p={4}
      py={10}
      bg={useColorModeValue("gray.200", "gray.900")}
      px={{ base: 4, md: 10 }}
      maxw={"700px"}
      mt={10}
      borderRadius="md"
    >
      <Box
        p={4}
        // height="300px"
        // overflowY={"auto"}
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        w={"100%"}
        minH="300px"
        shadow="md"
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="md"
        borderWidth="1px"
      >
        <chakra.form
          onSubmit={(e) => {
            e.preventDefault();

            nextStep();
          }}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            w="100%"
            h="100%"
            p={4}
          >
            <Stack
              spacing={4}
              w="100%"
              direction={{ base: "column", md: "row" }}
            >
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  type="text"
                  value={session?.user?.name}
                  disabled
                  border={useColorModeValue("blue.300", "gray.700")}
                />
              </FormControl>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input type="email" value={session?.user?.email} disabled />
              </FormControl>
            </Stack>
            <Stack
              spacing={4}
              w="100%"
              direction={{ base: "column", md: "row" }}
            >
              <FormControl id="name" isRequired>
                <FormLabel>Roll no</FormLabel>
                <Input
                  type="text"
                  value={session?.user?.roll_no}
                  disabled
                  border={useColorModeValue("blue.300", "gray.700")}
                />
              </FormControl>
              <FormControl id="name" isRequired>
                <FormLabel>Department</FormLabel>
                <Input
                  type="text"
                  value={session?.user?.programme}
                  disabled
                  border={useColorModeValue("blue.300", "gray.700")}
                />
              </FormControl>
            </Stack>

            <Stack
              spacing={4}
              w="100%"
              direction={{ base: "column", md: "row" }}
            >
              <FormControl id="fa" isRequired>
                <FormLabel>Faculty Advisor</FormLabel>
                <Select
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                    }),
                  }}
                  z-index="100"
                  value={{ value: "1", label: `${session?.user?.FA}` }}
                  isDisabled={true}
                />
              </FormControl>
              <FormControl id="Semester" isRequired>
                <FormLabel>Semester</FormLabel>
                <Select
                  value={{
                    value: "1",
                    label: `Semester ${session?.user?.semester}`,
                  }}
                  isDisabled={true}
                />
              </FormControl>
            </Stack>
          </Flex>
          <Flex direction="column" justify="center" w="100%" h="100%">
            <Button
              type="Save"
              colorScheme="telegram"
              onClick={() => {
                setStep(0);
              }}
              mt={4}
              width={{ base: "100%", md: 200 }}
              mr={{ base: 0, md: 4 }}
              alignSelf="flex-end"
              size={"md"}
              rightIcon={<FaChevronRight />}
              //center the button

              //if loading is true, disable the button and show a spinner
              // isLoading={loading}
            >
              Next
            </Button>
          </Flex>
        </chakra.form>
      </Box>
    </Box>
  );
};

export default PreferenceForm;
