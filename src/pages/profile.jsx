import React from "react";
import { getSession } from "next-auth/react";

import {
  Box,
  Flex,
  Avatar,
  Container,
  Heading,
  Divider,
  IconButton,
  HStack,
  Spacer,
  Text,
  Card,
  Image,
  CardHeader,
  CardBody,
  SimpleGrid,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
const profile = ({ userData }) => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <>
      <Box
        p={5}
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <HStack mb={5} width={"100%"} display={"flex"} justifyContent="center">
          <Heading
            as="h1"
            size="xl"
            textAlign={{ base: "center", md: "center" }}
            ml={10}
          >
            PROFILE
          </Heading>
        </HStack>

        <Divider mb={5} />
      </Box>
      <Container
        maxW={"container.xl"}
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Card width={"100%"} borderRadius="lg" overflow="hidden" mb={5}>
          <CardHeader
            p={5}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <HStack spacing="24px">
              <Avatar
                size="lg"
                name={session?.user.name}
                src={session?.user.picture}
              />
              <Box>
                <Heading fontSize="xl" fontWeight="semibold">
                  {session?.user.name}
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  {session?.user.email}
                </Text>
              </Box>
            </HStack>
          </CardHeader>
          <CardBody p={5}>
            <Divider />
            <SimpleGrid
              columns={{ sm: 2, md: 3, lg: 4, xl: 4 }}
              spacing={5}
              mt={5}
            >
              {session?.user?.role === "student" && (
                <Box>
                  <Heading fontSize="md" fontWeight="semibold">
                    Roll Number
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {session?.user?.roll_no}
                  </Text>
                </Box>
              )}
              {(session?.user?.role === "faculty" ||session?.user?.role === "fa") && (
                <Box>
                  <Heading fontSize="md" fontWeight="semibold">
                    Employee Code
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {session?.user?.employee_code}
                  </Text>
                </Box>
              )}

              {(session?.user?.role === "faculty" ||session?.user?.role === "fa") && (
                <Box>
                  <Heading fontSize="md" fontWeight="semibold">
                    Department
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {session?.user?.department}
                  </Text>
                </Box>
              )}

              {session?.user?.role === "student" && (
                <Box>
                  <Heading fontSize="md" fontWeight="semibold">
                    Programme
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {session?.user?.programme}
                  </Text>
                </Box>
              )}
                {session?.user?.role === "student" && (
                <Box>
                  <Heading fontSize="md" fontWeight="semibold">
                    Semester
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {session?.user?.semester}
                  </Text>
                </Box>
              )}
              {/* <Box></Box> */}
              {session?.user?.role === "student" && (
                <Box>
                  <Heading fontSize="md" fontWeight="semibold">
                    Batch
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {session?.user?.batch}
                  </Text>
                </Box>
              )}
            </SimpleGrid>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default profile;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  } else {
    return {
      props: { session },
    };
  }
}
