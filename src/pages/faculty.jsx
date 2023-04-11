import React from "react";
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
import ViewStudentdetails from "../components/faculty/ViewStudentdetails";
import CourseDetails from "../components/faculty/CourseDetails";
import { FaRedo } from "react-icons/fa";
import { getSession } from "next-auth/react";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../lib/general";

import { useRouter } from "next/router";

const faculty = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [students, setstudents] = useState([]);
  //   const [currentTab, setCurrentTab] = useState(0);
  const [courses, setcourses] = useState([]);

  const getcourseList = async () => {
    //data fetching for faculty courses
    const url = `${process.env.NEXT_PUBLIC_API_URL}/faculty_courses`;
    try {
      const res = await axios.get(url, {
        headers: {
          token: `${session.jwt}`,
        },
      });
      console.log(res.data);
      setcourses(res.data.courses);
    } catch (error) {
      if (error && error.response) {
        toast.error(getError(error));
      }
    }
  };

  //data fetching for FA student list
  const getstudentsList = async () => {
    // setCurrentTab(1)
    const url = `${process.env.NEXT_PUBLIC_API_URL}/fa_students`;
    try {
      const res = await axios.get(url, {
        headers: {
          token: `${session.jwt}`,
        },
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
    if (session) getcourseList();
    if (session && session?.user?.role === "fa") getstudentsList();
  }, [session]);

  return (
    <Box px={5} mt={10}>
      <Heading size={"lg"}>{`Welcome ${session?.user?.name || ""}`}</Heading>

      <Divider my={5} />

      <Tabs>
        <TabList>
          <Tab>Course Faculty</Tab>
          <Tab isDisabled={session?.user?.role !== "fa"}> Faculty Advisor</Tab>
        </TabList>

        <TabPanels>
          {/* faculty tab starts */}
          <TabPanel>
            <Container
              maxW={"12xl"}
              bg={useColorModeValue("gray.200", "gray.900")}
              borderRadius="md"
              p={{ base: 4, md: 10 }}
              pos="relative"
              mt={10}
            >
              <Center>
                {courses.length !== 0 && (
                  <Heading
                    size={"lg"}
                    color={useColorModeValue("black.100", "gray.400")}
                  >
                    Courses
                  </Heading>
                )}
                {courses.length === 0 && (
                  <Heading
                    size={"lg"}
                    color={useColorModeValue("black.100", "gray.400")}
                  >
                    No courses available
                  </Heading>
                )}
              </Center>
              <Divider my={5} />
              <CourseDetails courses={courses} />
            </Container>
          </TabPanel>
          {/* faculty tab ends */}

          {/* Fa tab starts     */}
          <TabPanel>
            <Container
              maxW={"12xl"}
              bg={useColorModeValue("gray.200", "gray.900")}
              borderRadius="md"
              p={{ base: 4, md: 10 }}
              pos="relative"
              mt={10}
            >
              <Center>
                <Heading
                  size={"lg"}
                  color={useColorModeValue("black.100", "gray.400")}
                >
                  Student List
                </Heading>
              </Center>
              <Divider my={5} />
              <ViewStudentdetails students={students} />
              <Center mt={2}>
                <Button
                  mt={2}
                  colorScheme="blue"
                  leftIcon={<DownloadIcon />}
                  onClick={() =>
                    window.open(
                      `${process.env.NEXT_PUBLIC_API_URL}/fa_download?id=${session.user.email}`,
                      "_blank"
                    )
                  }
                >
                  Download
                </Button>
              </Center>
            </Container>
          </TabPanel>

          {/* FA tab ends */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};
export default faculty;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (
    !session ||
    (session?.user?.role !== "faculty" && session?.user?.role !== "fa")
  ) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
