import React from "react";
import {
  List,
  Box,
  HStack,
  Text,
  Spacer,
  useColorModeValue,
  Button,
  Heading,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import SelectableItem from "./SelectableItem";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../../lib/general";
import { useRouter } from "next/router";

const CourseDetails = ({courses}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <Box
      p={2}
      py={4}
      my={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w={"100%"}
      maxH={"500px"}
      mx="auto"

      // _hover={{ bg: 'gray.100' }}
    >
      <Box position="relative" maxH={"500px"}>
        <List spacing={3} p={2} w={"100%"} rounded="md">
          {courses.map((item, index) => (
            <SelectableItem
              id={item.id}
              item={item}
              index={index}
              courses={courses}
              // setCourseList={setCourseList}
            />
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default CourseDetails;
