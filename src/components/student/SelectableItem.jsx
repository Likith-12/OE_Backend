import React from "react";
import {
  ListItem,
  Flex,
  Spacer,
  Checkbox,
  Text,
  useColorModeValue,
  Box,
  Badge,
  HStack,
  Input,
} from "@chakra-ui/react";

const SelectableItem = ({
  item,
  index,
  courseList,
  id,
  selectedCourses,
  setSelectedCourses,
  setCourseList,
}) => {
  return (
    <ListItem
      textAlign={"left"}
      px={3}
      py={4}
      minW={"500px"}
      width={{
        base: "100%",
      }}
      // my={2}
      // _hover={{ bg: 'gray.100' }}
      // shadow="md"
      borderWidth="1px"
      borderRadius="md"
      //maxw in px
      maxW="500px"
      mx={"auto"}
      bg={useColorModeValue("white", "gray.800")}
    >
      <Flex alignItems={"center"}>
        <Checkbox
          type="checkbox"
          flexShrink={{ base: 0, md: 1 }}
          mr={4}
          isChecked={selectedCourses.some((course) => course.id === item.id)}
          onChange={(e) => {
            // const newCourseList = [...courseList]
            // newCourseList[index].checked = e.target.checked
            // setCourseList(newCourseList)
            //add to selected courses
            if (e.target.checked) {
              setSelectedCourses([...selectedCourses, item]);
            }
            //remove from selected courses
            else {
              setSelectedCourses(
                selectedCourses.filter((course) => course.id !== item.id)
              );
            }
          }}
        ></Checkbox>

        <Box flexShrink={{ base: 0, md: 1 }}>
          <Text
            size={"lg"}
            fontWeight={"bold"}
          >{`${item.name} (${item.course_id})`}</Text>
          <HStack>
            <Text
              size={"sm"}
              //make color lighter
              color={useColorModeValue("gray.600", "gray.400")}
            >
              {item.faculty}
            </Text>
            <Badge>{`Slot : ${item.slot}`}</Badge>
          </HStack>
        </Box>
      </Flex>
    </ListItem>
  );
};

export default SelectableItem;
