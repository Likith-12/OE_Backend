//list with up and down arrows for moving courseList up and down in a list
import React from "react";
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  List,
  useColorModeValue,
  Button,
  ButtonGroup,
  Badge,
  Heading,
  Center,
} from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { arrayMoveImmutable } from "array-move";
import SortableListItem from "./SortableListItem";
//tick icon
import { CheckIcon } from "@chakra-ui/icons";

const ListSorter = ({
  nextStep,
  courseList,
  setCourseList,
  selectedCourses,
  setSelectedCourses,
  prevStep,
}) => {
  return (
    <Box
      p={2}
      py={4}
      my={2}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      // w={"100%"}
      maxH={"500px"}
      mx="auto"
      // h='100px'

      // _hover={{ bg: 'gray.100' }}
    >
      <Box
        position="relative"
        scrollBehavior={"smooth"}
        overflowY={"scroll"}
        maxH={"500px"}
        minH={"400px"}
        minW={"530px"}
        display="flex"

        // w={'100%'}
      >
        <Box
          position="absolute"
          top="0"
          right="0"
          bg={"telegram.500"}
          color={"white"}
          px={2}
          py={1}
          rounded="md"
        >
          <Heading size="sm">Sort Courses</Heading>
        </Box>

        {selectedCourses.length > 0 ? (
          <List spacing={3} p={2} rounded="md">
            {selectedCourses.map((item, index) => (
              <SortableListItem
                key={item.id}
                item={item}
                index={index}
                courseList={selectedCourses}
                setCourseList={setSelectedCourses}
              />
            ))}
          </List>
        ) : (
          <Center w={"100%"} h={"400px"}>
            <Text
              color={useColorModeValue("gray.600", "gray.400")}
              fontSize={"xl"}
            >
              No courses selected 📥
            </Text>
          </Center>
        )}
      </Box>
      {/* <ButtonGroup
    
        mt={2}
        >
        <Button
        onClick={nextStep}
       
        colorScheme="telegram"
        leftIcon={<CheckIcon />}

        >
        Save
        </Button>
        <Button
        onClick={prevStep}
        >
            Go Back
        </Button>
        </ButtonGroup> */}
    </Box>
  );
};

export default ListSorter;
