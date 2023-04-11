import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Container,
  Spacer,
  Button,
  Center,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { DownloadIcon } from "@chakra-ui/icons";
import CourseStudentdetails from "../../../components/faculty/CourseStudentdetails";
import CourseDetails from "../../../components/faculty/CourseDetails";
import { FaRedo } from "react-icons/fa";

import { useState, useEffect } from "react";

import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../../../lib/general";

const course = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [students, setstudents] = useState([]);
  const { id } = router.query;

  const getstudentsList = async () => {
    //data fetching for student list of this course

    const url = `${process.env.NEXT_PUBLIC_API_URL}/course_students`;
    try {
      const res = await axios.get(url, {
        headers: {
          token: `${session.jwt}`,
        },
        params: { id },
      });
      console.log(res.data);
      setstudents(res.data.students);
    } catch (error) {
      if (error && error.response) {
        toast.error(getError(error));
      }
    }
  };

  useEffect(() => {
    if (session) getstudentsList();
  }, [session]);

  return (
    <Box px={5} mt={10}>
      <Heading size={"lg"}>{`Welcome ${session?.user?.name || ""}`}</Heading>

      <Divider my={5} />

      {students.length !== 0 && ( // if student list is not empty
        <Container
          maxW={"12xl"}
          bg={useColorModeValue("gray.200", "gray.900")}
          borderRadius="md"
          p={{ base: 4, md: 10 }}
          pos="relative"
          mt={10}
        >
          <Box
            bg={"telegram.500"}
            color={"white"}
            px={2}
            py={1}
            borderRadius="md"
            pos={"absolute"}
            top={0}
            left={0}
          >
            <Heading size="sm">{id}</Heading>
          </Box>

          <Center>
            <Heading
              size={"lg"}
              color={useColorModeValue("black.100", "gray.400")}
              mt={2}
            >
              Student List
            </Heading>
          </Center>
          <Divider my={5} />

          <CourseStudentdetails //component for student table of course
            students={students}
          />

          <Center mt={2}>
            <Button
              mt={2}
              colorScheme="blue"
              leftIcon={<DownloadIcon />}
              onClick={() => {
                window.open(
                  `${process.env.NEXT_PUBLIC_API_URL}/course_students_download?id=${id}`,
                  "_blank"
                );
              }}
            >
              Download
            </Button>
          </Center>
        </Container>
      )}

      {students.length === 0 && ( // if student list is empty
        <Container
          maxW={"12xl"}
          bg={useColorModeValue("gray.200", "gray.900")}
          borderRadius="md"
          p={{ base: 4, md: 10 }}
          pos="relative"
          mt={10}
        >
          <center>
            <Heading
              size={"lg"}
              color={useColorModeValue("black.100", "gray.400")}
              mt={2}
            >
              No Students Currently Alloted
            </Heading>
          </center>
        </Container>
      )}
    </Box>
  );
};
export default course;
