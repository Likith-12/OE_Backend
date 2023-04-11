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
// import {FaEye, FaRedo} from 'react-icons/fa'
// import { DownloadIcon } from '@chakra-ui/icons'

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const CourseStudentdetails = ({ students }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <Container maxW={"10xl"}>
      <Box
        py={1}
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
        px={1}
      >
        <Flex flexDir={"column"} w="100%" maxW="7xl">
          <Card
            shadow={"md"}
            my={2}
            mx={2}
            bg={useColorModeValue("white", "gray.800")}
          >
            <CardBody bg={useColorModeValue("white", "gray.800")}>
              <Box w="100%" overflowX={"auto"} h="9cm">
                <Table variant="simple" overflowX={"auto"}>
                  <Thead>
                    <Tr>
                      <Th>Sl.no</Th>
                      <Th>Roll No</Th>
                      <Th>Name</Th>
                      <Th>Batch</Th>
                      <Th>Semester</Th>
                      <Th>Program</Th>
                      <Th>Email</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {students.map((item, index) => (
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
            </CardBody>
          </Card>
        </Flex>
      </Box>
    </Container>
  );
};
export default CourseStudentdetails;
