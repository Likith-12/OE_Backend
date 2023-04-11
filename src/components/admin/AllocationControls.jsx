import React from "react";
import {
  Container,
  Heading,
  Text,
  useColorModeValue,
  Box,
  Divider,
  Flex,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  chakra,
  Card,
  CardBody,
  CardHeader,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Center,
} from "@chakra-ui/react";
import { FaEye, FaRedo } from "react-icons/fa";
import { CheckIcon, DownloadIcon } from "@chakra-ui/icons";
import { toast } from "react-toastify";
import { getError } from "../../lib/general";
// import { Spreadsheet } from 'react-spreadsheet'
//react table
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

//react tables

import { useRouter } from "next/router";
import axios from "axios";

const AllocationControls = ({
  isAllocationDone,
  setIsAllocationDone,
  isRandomPresent,
  setIsRandomPresent,
}) => {
  const { data: session, status } = useSession();

  const [randomLoading, setRandomLoading] = useState(false);
  const [allocationLoading, setAllocationLoading] = useState(false);
  // const [isAllocationDone, setIsAllocationDone]=useState(false)
  const router = useRouter();

  const [random, setRandom] = useState([]);

  const regenerateRandomList = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/random_list`;
      const headers = {
        token: `${session.jwt}`,
      };
      setRandomLoading(true);
      const res = await axios.post(
        url,
        {},
        {
          headers: headers,
        }
      );
      console.log(res.data);
      setRandom(res.data.random_list);
      setRandomLoading(false);
      setIsRandomPresent(true);
    } catch (error) {
      if (error.response) {
        toast.error(getError(error));
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  const getRabdomList = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/random_list`;
    try {
      setRandomLoading(true);
      const res = await axios.get(url, {
        headers: {
          token: `${session.jwt}`,
        },
      });
      console.log(res.data);
      setRandom(res.data.random_list);
      setRandomLoading(false);
      setIsRandomPresent(true);
    } catch (error) {
      if (error && error.response) {
        console.log(getError(error));
      }
    }
  };

  const allocation = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/allocate`;
      setAllocationLoading(true);
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            token: `${session.jwt}`,
          },
        }
      );
      console.log(res.data);

      setAllocationLoading(false);
      setIsAllocationDone(true);

      toast.success("Allocation Done Successfully");
    } catch (error) {
      console.log(error);
      setAllocationLoading(false);

      if (error.response) {
        toast.error(getError(error));
      } else {
        console.log(error);
        toast.error("Something went wrong");
      }
    }
  };

  // const getTimeline = async () => {

  //     try {
  //         const url =`${process.env.NEXT_PUBLIC_API_URL}/timeline`;
  //         const res=await axios.get(url, {
  //             headers: {
  //                 token:`${session.jwt}`,

  //         }

  //         });

  //         console.log(res.data);
  //         setIsAllocationDone(res.data.allocated);
  //         toast.error(isAllocationDone)

  //     } catch (error) {
  //         if (error.response) {
  //             toast.error(getError(error))
  //         }
  //         else {
  //             toast.error('Something went wrong')
  //         }

  //     }
  // }

  useEffect(() => {
    // calling timeline

    if (session) {
      // regenerateRandomList()
      console.log("isRandomPresent");
      console.log(isRandomPresent);
      if (!isAllocationDone && !isRandomPresent) {
        regenerateRandomList();
      } else {
        getRabdomList();
      }
      // console.log(isAllocationDone);
      // getTimeline();
    }
  }, [session]);

  return (
    <Container maxW={"7xl"}>
      <Box
        py={4}
        // my={2}
        // mx="auto"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxW={{ base: "xl", md: "7xl" }}
        mx="auto"
        w={"100%"}
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="md"
        p={4}
        px={7}
      >
        <Flex flexDir={"column"} w="100%" maxW="xl">
          <Card
            bg={useColorModeValue("white", "gray.800")}
            shadow={"md"}
            my={2}
          >
            <CardHeader bg={useColorModeValue("white", "gray.800")}>
              <Heading size="md">Regenerate Random List</Heading>
            </CardHeader>
            <CardBody bg={useColorModeValue("white", "gray.800")}>
              <Text fontSize="sm"></Text>
              <ButtonGroup display={"flex"} flexWrap={"wrap"} mt={2}>
                <Button
                  mt={2}
                  leftIcon={<FaRedo />}
                  colorScheme="telegram"
                  isLoading={randomLoading}
                  onClick={regenerateRandomList}
                  isDisabled={isAllocationDone}
                >
                  Regenerate Random List
                </Button>
                <Button
                  mt={2}
                  colorScheme="green"
                  leftIcon={<CheckIcon />}
                  isLoading={allocationLoading}
                  onClick={allocation}
                  isDisabled={isAllocationDone}
                >
                  Generate Allocation
                </Button>
              </ButtonGroup>
            </CardBody>
          </Card>
          <Card
            shadow={"md"}
            my={2}
            bg={useColorModeValue("white", "gray.800")}
          >
            <CardHeader bg={useColorModeValue("white", "gray.800")}>
              <Heading size="md">Random List</Heading>
            </CardHeader>
            <CardBody bg={useColorModeValue("white", "gray.800")}>
              <Box w="100%" overflowX={"auto"}>
                <Table variant="simple" overflowX={"auto"}>
                  <Thead>
                    <Tr>
                      <Th>SlNo</Th>
                      <Th>Roll No</Th>
                      <Th>Name</Th>
                      <Th>Batch</Th>
                      <Th>Semester</Th>
                      <Th>Program</Th>
                      <Th>Email</Th>

                      {/* <Th>Course</Th>
                                    <Th>Code</Th> */}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {random.map((item, index) => (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{item.roll_no}</Td>
                        <Td>{item.name}</Td>
                        <Td>{item.batch}</Td>
                        <Td>{item.semester}</Td>
                        <Td>{item.programme}</Td>
                        <Td>{item.email}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Center mt={2}>
                <Button
                  mt={2}
                  leftIcon={<DownloadIcon />}
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_URL}/download_random_list`,
                      "_blank"
                    )
                  }
                >
                  Download
                </Button>
              </Center>
            </CardBody>
          </Card>
          {isAllocationDone && (
            <>
             <Card
              shadow={"md"}
              my={2}
              bg={useColorModeValue("white", "gray.800")}
            >
              <CardHeader bg={useColorModeValue("white", "gray.800")}>
                <Heading size="md">Allocation List</Heading>
              </CardHeader>
              <CardBody bg={useColorModeValue("white", "gray.800")}>
                <Text fontSize="sm"></Text>
                <ButtonGroup display={"flex"} flexWrap={"wrap"} mt={2} w="100%">
                  <Button
                    mt={2}
                    leftIcon={<DownloadIcon />}
                    colorScheme="telegram"
                    onClick={() =>
                      window.open(
                        `${process.env.NEXT_PUBLIC_API_URL}/download_allocation`,
                        "_blank"
                      )
                    }
                  >
                    Download
                  </Button>
                  <Button
                    mt={2}
                    leftIcon={<FaEye />}
                    onClick={() => router.push("/allocation")}
                  >
                    View Allocation
                  </Button>
                </ButtonGroup>
              </CardBody>
            </Card>
            <Card
              shadow={"md"}
              my={2}
              bg={useColorModeValue("white", "gray.800")}
            >
              <CardHeader bg={useColorModeValue("white", "gray.800")}>
                <Heading size="md">Preference List</Heading>
              </CardHeader>
              <CardBody bg={useColorModeValue("white", "gray.800")}>
                <Text fontSize="sm"></Text>
                <ButtonGroup display={"flex"} flexWrap={"wrap"} mt={2} w="100%">
                  <Button
                    mt={2}
                    leftIcon={<DownloadIcon />}
                    colorScheme="telegram"
                    onClick={() =>
                      window.open(
                        `${process.env.NEXT_PUBLIC_API_URL}/download_preference_list`,
                        "_blank"
                      )
                    }
                  >
                    Download
                  </Button>
                 
                </ButtonGroup>
              </CardBody>
            </Card>
            
            </>
           
          )}
        </Flex>
      </Box>
    </Container>
  );
};

export default AllocationControls;
