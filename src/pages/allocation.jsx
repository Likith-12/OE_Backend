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
  useDisclosure,
  ButtonGroup,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { DownloadIcon, CheckIcon } from "@chakra-ui/icons";
import ViewAllocation from "../components/admin/ViewAllocation";
import AlertDialog from "../components/admin/AlertDialog";
import { FaRedo } from "react-icons/fa";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useState } from "react";
import { getError } from "../lib/general";

const allocation = ({ passAlloc, appr }) => {
  const { data: session, status } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const approveAllocation = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/approve_allocation`;
      const res = await axios.post(
        url,
        {},
        {
          headers: {
            token: session.jwt,
          },
        }
      );

      console.log(res.data);
      toast.success("Allocation Approved");
    } catch (err) {
      if (err.response) {
        toast.error(getError(err));
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <Box px={5} mt={10}>
      <Heading size={"lg"}>{`Welcome ${session?.user?.name || ""}`}</Heading>

      <Divider my={5} />

      <Container
        maxW={"12xl"}
        bg={useColorModeValue("gray.200", "gray.900")}
        borderRadius="md"
        p={{ base: 4, md: 10 }}
        pos="relative"
        mt={10}
      >
        {/* <Box
       
       bg={'telegram.500'}
       color={'white'}
       px={2}
       py={1}
       borderRadius="md"
       
       pos={'absolute'}
       top={0}
       left={0}
       
        >
            <Heading
            size="md"
            >
                Faculty Advisor
            </Heading>
        </Box> */}

        <Center>
          <Heading
            // marginTop={2}
            size={"lg"}
            // py={2}
            // borderBottom="1px"
            // borderColor={'telegram.500'}
            // borderRadius={5}
            color={useColorModeValue("black.100", "gray.400")}
          >
            Allocation List
          </Heading>
        </Center>
        <Divider my={5} />
        <ViewAllocation data={passAlloc} />

        <AlertDialog
          isOpen={isOpen}
          onClose={onClose} //for cofirmation modal for approval
          message={"Are you sure you want to approve open elective allocation?"}
          title={"Approval of Allocation"}
        >
          <ButtonGroup spacing={4} mt={4}>
            <Button
              colorScheme={"green"}
              onClick={() => {
                approveAllocation();
                onClose();
              }}
            >
              Yes
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              No
            </Button>
          </ButtonGroup>
        </AlertDialog>

        <Center mt={2}>
          <Button // Download Button
            mt={2}
            colorScheme="blue"
            leftIcon={<DownloadIcon />}
            onClick={() =>
              window.open(
                `${process.env.NEXT_PUBLIC_API_URL}/download_allocation`,
                "_blank"
              )
            }
          >
            Download
          </Button>
          <Button // Approve Button
            mt={2}
            ml={4}
            colorScheme="green"
            leftIcon={<CheckIcon />}
            onClick={onOpen}
          >
            Approve
          </Button>
        </Center>
      </Container>
    </Box>
  );
};
export default allocation;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/timeline`, {
    headers: {
      token: `${session.jwt}`,
    },
  });

  // console.log(res.data)

  if (!res.data.allocated) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  const fetchAllocList = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/allocate`,
    {
      headers: {
        token: `${session.jwt}`,
      },
    }
  );

  const passAlloc = fetchAllocList.data;
  console.log(passAlloc.allocation_list);
  console.log(res.data);

  return {
    props: {
      session,
      passAlloc: passAlloc.allocation_list,
      appr: res.data.allocation_approved,
    },
  };
};
