import React from "react";
import {
  Box,
  Divider,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  chakra,
  Center,
} from "@chakra-ui/react";

import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import { getError } from "../../lib/general";

const SetDeadlines = ({
  deadline,
  setDeadline,
  isSetDeadline,
  setIsDeadlineSet,
  fetchData,
}) => {
  //deadline state
  const { data: session, status } = useSession();
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    const getData = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/deadline`;
        const res = await axios.get(url, {
          headers: {
            token: session.jwt,
          },
        });
        console.log(res.data);
        setDeadline(res.data.deadline);
        setIsDeadlineSet(deadline !== null);
      } catch (err) {
        if (err.response) {
          toast.error(getError(err));
        }
      }
    };

    console.log(deadline);

    getData();
  }, [session,isSetDeadline]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonLoading(true);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/deadline`;
    axios
      .post(
        url,
        {
          deadline,
        },
        {
          headers: {
            token: session.jwt,
          },
        }
      )
      .then((res) => {
        console.log(res);
        toast.success("Deadline set");
        setIsDeadlineSet(true);
        fetchData();
        setButtonLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err && err.response) {
          toast.error(getError(err));
          setButtonLoading(false);
        }
      });
  };

  return (
    <chakra.form
      display={{ base: "block", md: "flex" }}
      justifyContent="center"
      alignItems="center"
      onSubmit={handleSubmit}
    >
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
          {/* <FormControl id="profile" isRequired>
            <FormLabel
            mb={2}
         
            >Profile Completion</FormLabel>
            <Input type="date"
            
            
            py={2}
            />
        </FormControl> */}

          <FormControl id="preference" isRequired>
            <FormLabel>Preference Submission</FormLabel>

            <Input
              type="date"
              placeholder="mm--dd--yyyy"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                console.log(e.target.value);
              }}
            />
          </FormControl>
        </Flex>

        <Button type="submit" mt={4} colorScheme="telegram">
          {isSetDeadline ? "Edit Deadline" : "Set Deadline"}
        </Button>
      </Box>
    </chakra.form>
  );
};

export default SetDeadlines;
