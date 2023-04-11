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
} from "@chakra-ui/react";
import SelectableItem from "./SelectableItem";

const ListSelecter = ({
  nextStep,
  courseList,
  setCourseList,
  selectedCourses,
  setSelectedCourses,
}) => {
  //selected courses state

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

      // _hover={{ bg: 'gray.100' }}
    >
      <Box
        position="relative"
        scrollBehavior={"smooth"}
        overflowY={"scroll"}
        minH={"400px"}
      >
        <Box
          position="absolute"
          top="0"
          right="0"
          bg={"telegram.500"}
          color={"white"}
          px={2}
          py={1}
          borderRadius="md"
        >
          <Heading size="sm">Select Courses</Heading>
        </Box>
        <List
          spacing={3}
          p={2}
          // w={"100%"}

          rounded="md"
        >
          {courseList.map((item, index) => (
            <SelectableItem
              key={item.id}
              item={item}
              index={index}
              courseList={courseList}
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              setCourseList={setCourseList}
            />
          ))}
        </List>
      </Box>
      {/* <Button
    mt={2}
    onClick={nextStep}
    colorScheme="telegram"
    >
        Save
    </Button> */}
    </Box>
  );
};

export default ListSelecter;
