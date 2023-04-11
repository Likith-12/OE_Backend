import React from "react";
import {
  Flex,
  Text,
  Icon,
  IconButton,
  ListItem,
  List,
  ListIcon,
  OrderedList,
  UnorderedList,
  Spacer,
  useColorModeValue,
  VStack,
  Box,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { arrayMoveImmutable } from "array-move";

const SortableListItem = ({ item, index, courseList, setCourseList, id }) => {
  const moveItem = (from, to) => {
    setCourseList(arrayMoveImmutable(courseList, from, to));
  };
  return (
    <ListItem
      key={item.id}
      id={item.id}
      index={index}
      courseList={courseList}
      setCourseList={setCourseList}
      textAlign={"left"}
      minW={"500px"}
      width={"100%"}
      px={3}
      py={4}
      bg={useColorModeValue("white", "gray.800")}
      // my={2}
      // _hover={{ bg: 'gray.100' }}
      // shadow="md"
      borderWidth="1px"
      borderRadius="md"
      //maxw in px
      maxW="500px"
      mx={"auto"}
    >
      <Flex alignItems={"center"}>
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

        <Spacer />
        <IconButton
          aria-label="Move item up"
          icon={<Icon as={FaArrowUp} color="telegram.500" />}
          onClick={() => {
            moveItem(index, index - 1);
          }}
          isDisabled={index === 0}
          // isdisabled={index === 0}
          size="sm"
          variant={"ghost"}
        />
        <IconButton
          aria-label="Move item down"
          icon={<Icon as={FaArrowDown} color="telegram.500" />}
          onClick={() => {
            moveItem(index, index + 1);
          }}
          isDisabled={index === courseList.length - 1}
          // isdisabled={index === courseList.length - 1}
          size="sm"
          ml={2}
          variant={"ghost"}
        />
      </Flex>
    </ListItem>
  );
};

export default SortableListItem;
