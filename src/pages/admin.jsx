import React from "react";
import { useState } from "react";
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
  useDisclosure,
  ButtonGroup,
} from "@chakra-ui/react";
import UploadGrid from "../components/admin/UploadGrid";
import { useSession } from "next-auth/react";
import SetDeadlines from "../components/admin/SetDeadlines";
import AllocationControls from "../components/admin/AllocationControls";
import AlertDialog from "../components/admin/AlertDialog";
import axios from "axios";
import { getError } from "../lib/general";

import { useEffect } from "react";

//restart icon
import { FaRedo } from "react-icons/fa";
import { toast } from "react-toastify";
const admin = () => {
  const [isSetDeadline, setIsSetDeadline] = useState(false);
  const [isAllocationDone, setIsAllocationDone] = useState(false);
  const [isDeadlinepassed, setIsDeadlinepassed] = useState(false);
  const [isRandomPresent, setIsRandomPresent] = useState(false);
  const resetSession = async () => {
    console.log("resetting session");
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/reset`;
      const res = await axios.get(url, {
        headers: {
          token: session.jwt,
        },
      });
      console.log(res.data);
      toast.success(res.data.success);
      setDeadline("");
      setIsSetDeadline(false);
      setIsAllocationDone(false);
      setIsDeadlinepassed(false);
      setIsRandomPresent(false);
    } catch (err) {
      if (err.response) {
        toast.error(getError(err));
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const [deadline, setDeadline] = useState("");

  const { data: session, status } = useSession();
  const fetchData = async () => {
    if (!session) {
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_API_URL}/timeline`;
    const headers = {
      token: `${session.jwt}`,
    };
    const res = await axios.get(url, {
      headers: headers,
    });
    console.log(res.data);

    setIsDeadlinepassed(res.data.deadline_passed);
    setIsAllocationDone(res.data.allocated);
    setIsRandomPresent(res.data.random_list_present);
  };

  useEffect(() => {
    fetchData();
  }, [session, deadline, isAllocationDone,isSetDeadline]);

  //useDisclosure for modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        message={"Are you sure you want to start a new session?"}
        title={"Start a new session"}
      >
        <ButtonGroup spacing={4} mt={4}>
          <Button
            colorScheme={"telegram"}
            onClick={async () => {
              await window.open(`${process.env.NEXT_PUBLIC_API_URL}/backup`);
              resetSession();
              onClose();
            }}
          >
            Yes with backup
          </Button>
          <Button
            onClick={() => {
              resetSession();
              onClose();
            }}
          >
            Yes
          </Button>
          <Button colorScheme="red">Cancel</Button>
        </ButtonGroup>
      </AlertDialog>
      <Box px={5} mt={10}>
        <Heading size={"lg"}>{`Welcome ${session?.user?.name || ""}`}</Heading>

        <Divider my={5} />
        <Box w={"100%"} display="flex" justifyContent="flex-end">
          <Button
            colorScheme="blue"
            size="md"
            leftIcon={<FaRedo />}
            mb={5}
            onClick={onOpen}
          >
            Start a new session
          </Button>
        </Box>

        {!isDeadlinepassed && (
          <Box
            bg={useColorModeValue("gray.200", "gray.900")}
            borderRadius="md"
            p={4}
          >
            <Heading
              size={"md"}
              px={2}
              py={2}
              // borderBottom="1px"
              borderColor={"telegram.500"}
              color={useColorModeValue("black.600", "gray.400")}
              //semi opaque bg color

              borderRadius={5}
            >
              Upload Details
            </Heading>
            <UploadGrid />
          </Box>
        )}
        {!isAllocationDone && (
          <Container
            maxW={"4xl"}
            bg={useColorModeValue("gray.200", "gray.900")}
            borderRadius="md"
            p={{ base: 4, md: 10 }}
            mt={10}
          >
            <Heading
              // marginTop={2}
              size={"md"}
              px={2}
              // py={2}
              // borderBottom="1px"
              borderColor={"telegram.500"}
              borderRadius={5}
              color={useColorModeValue("black.600", "gray.400")}
            >
              {isSetDeadline == true ? "Edit Deadline" : "Set Deadline"}
            </Heading>
            <Divider my={5} />
            {!isAllocationDone && (
              <SetDeadlines
                deadline={deadline}
                fetchData={fetchData}
                setDeadline={setDeadline}
                isSetDeadline={isSetDeadline}
                setIsDeadlineSet={setIsSetDeadline}
              />
            )}
          </Container>
        )}
        {isDeadlinepassed && (
          <Container
            maxW={"4xl"}
            bg={useColorModeValue("gray.200", "gray.900")}
            borderRadius="md"
            p={{ base: 4, md: 10 }}
            mt={10}
          >
            <Heading
              // marginTop={2}
              size={"md"}
              px={2}
              // py={2}
              // borderBottom="1px"
              borderColor={"telegram.500"}
              borderRadius={5}
              color={useColorModeValue("black.600", "gray.400")}
            >
              Allocation Controls
            </Heading>
            <Divider my={5} />
            <AllocationControls
              isAllocationDone={isAllocationDone}
              setIsAllocationDone={setIsAllocationDone}
              isRandomPresent={isRandomPresent}
              setIsRandomPresent={setIsRandomPresent}
            />
          </Container>
        )}
      </Box>
    </>
  );
};

export default admin;
