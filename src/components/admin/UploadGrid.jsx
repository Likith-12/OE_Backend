import React from "react";
import {
  SimpleGrid,
  Card,
  Box,
  CardBody,
  CardHeader,
  Input,
  Text,
  Heading,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import CustomFilePicker from "./CustomFilePicker";
import { useState } from "react";
import axios from "axios";
//usesession
import { useSession } from "next-auth/react";

const UploadGrid = () => {
  const [StudentFile, setStudentFile] = useState(null);
  const [CourseFile, setCourseFile] = useState(null);
  const [FacultyFile, setFacultyFile] = useState(null);
  const [uploadProgressStudent, setUploadProgressStudent] = useState(0);
  const [uploadProgressCourse, setUploadProgressCourse] = useState(0);
  const [uploadProgressFaculty, setUploadProgressFaculty] = useState(0);

  const { data: session, status } = useSession();

  //create message state
  const [studentMessage, setStudentMessage] = useState("Select a file");
  const [facultyMessage, setFacultyMessage] = useState("Select a file");
  const [courseMessage, setCourseMessage] = useState("Select a file");

  const handleCourseFileChange = (e) => {
    console.log("inside handleCourseFileChange");
    setCourseFile(e.target.files[0]);
    setCourseMessage(e.target.files[0]?.name || "Select a file");
  };
  const handleStudentFileChange = (e) => {
    console.log("inside handleStudentFileChange");
    console.log(e.target.files[0].name);
    setStudentFile(e.target.files[0]);
    setStudentMessage(e.target.files[0]?.name || "Select a file");
  };
  //onchange
  const handleFacultyFileChange = (e) => {
    console.log(e.target.files[0].name);
    setFacultyFile(e.target.files[0]);
    setFacultyMessage(e.target.files[0]?.name || "Select a file");
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setUploadProgressStudent(0);
    const formData = new FormData();
    formData.append("file", StudentFile);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/upload_students`;
      const headers = { token: `${session.jwt}` };
      const response = await axios.post(url, formData, {
        headers: headers,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgressStudent(progress);
          setStudentMessage("Uploading...");
        },
      });
      console.log(response.data);
      await setUploadProgressStudent(0);
      await setStudentMessage("File uploaded successfully");
      await setStudentFile(null);
      await setTimeout(() => {
        setStudentMessage("Select a file");
      }, 3000);
    } catch (error) {
      console.error(error);
      setUploadProgressStudent(0);
      setStudentMessage("Error uploading file");
      setStudentFile(null);
    }
  };

  const handleFacultySubmit = async (e) => {
    console.log("inside handleStudentSubmit");
    e.preventDefault();
    setUploadProgressFaculty(0);
    const formData = new FormData();
    formData.append("file", FacultyFile);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/upload_faculties`;
      const headers = { token: `${session.jwt}` };
      const response = await axios.post(url, formData, {
        headers: headers,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgressFaculty(progress);
          setFacultyMessage("Uploading...");
        },
      });
      console.log(response.data);
      await setUploadProgressFaculty(0);
      await setFacultyMessage("File uploaded successfully");
      await setFacultyFile(null);
      await setTimeout(() => {
        setFacultyMessage("Select a file");
      }, 3000);
    } catch (error) {
      console.error(error);
      setUploadProgressFaculty(0);
      setFacultyMessage("Error uploading file");
      setFacultyFile(null);
    }
    //upload to server
  };

  const handleCourseSubmit = async (e) => {
    console.log("inside handleStudentSubmit");
    console.log(CourseFile);

    e.preventDefault();
    setUploadProgressCourse(0);
    const formData = new FormData();
    formData.append("file", CourseFile);
    console.log(session);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/upload_courses`;
      const headers = { token: `${session.jwt}` };
      const response = await axios.post(url, formData, {
        headers: headers,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgressCourse(progress);
          setCourseMessage("Uploading...");
        },
      });
      console.log(response.data);
      await setUploadProgressCourse(0);
      await setCourseMessage("File uploaded successfully");
      await setCourseFile(null);
      await setTimeout(() => {
        setCourseMessage("Select a file");
      }, 3000);
    } catch (error) {
      console.error(error);
      setUploadProgressCourse(0);
      setCourseMessage("Error uploading file");
      setCourseFile(null);
    }
  };

  return (
    <SimpleGrid
      columns={{ base: 1, lg: 3, sm: 2 }}
      mx="auto"
      spacing={10}
      //center
      placeContent="center"
      p={5}
      w={"100%"}
      // display="flex"
      //   flexDirection={{ base: "column", md: "row" }}
      alignItems="center"
      bg={useColorModeValue("gray.200", "gray.900")}
      borderRadius="md"
      //   bg={useColorModeValue("gray.200", "gray.900")}
      borderColor="telegram.500"
      // borderWidth="1px"

      // height="300px"
    >
      <Card width={{ base: "100%", md: "100%" }}>
        <CardHeader>
          <Heading size="md">Add Courses</Heading>
        </CardHeader>
        <CardBody>
          <CustomFilePicker
            label={courseMessage}
            accept=".csv,.xlsx,.xls"
            onChange={handleCourseFileChange}
            uploadProgress={uploadProgressCourse}
            onsubmit={handleCourseSubmit}
            mb={4}
          />
        </CardBody>
      </Card>
      <Card width={{ base: "100%", md: "100%" }}>
        <CardHeader>
          <Heading size="md">Add Students</Heading>
        </CardHeader>
        <CardBody>
          <CustomFilePicker
            label={studentMessage}
            accept=".csv,.xlsx,.xls"
            onChange={handleStudentFileChange}
            uploadProgress={uploadProgressStudent}
            onsubmit={handleStudentSubmit}
            file={StudentFile}
            mb={4}
          />
        </CardBody>
      </Card>
      <Card width={{ base: "100%", md: "100%" }}>
        <CardHeader>
          <Heading size="md">Add Faculties</Heading>
        </CardHeader>
        <CardBody>
          <CustomFilePicker
            label={facultyMessage}
            accept=".csv,.xlsx,.xls"
            onChange={handleFacultyFileChange}
            onsubmit={handleFacultySubmit}
            file={FacultyFile}
            mb={4}
          />
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};

export default UploadGrid;
