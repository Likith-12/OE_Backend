import React from "react";
import {
  ListItem,
  Flex,
  Spacer,
  Checkbox,
  Text,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";

import { useRouter } from "next/router";

const SelectableItem = ({ item, index, courseList, id }) => {
  const router = useRouter();
  return (
    <ListItem
      textAlign={"center"}
      px={3}
      py={4}
      maxW="100%"
      minW={{
        base: "100%",
        md: "700px",
        lg: "800px",
      }}
      _hover={{ bg: "telegram.500", textColor: "white" }}
      cursor={"pointer"}
      width={{
        base: "100%",
      }}
      // my={2}
      // _hover={{ bg: 'gray.100' }}
      // shadow="md"
      borderWidth="1px"
      borderRadius="md"
      //maxw in px
      // maxW="500px"
      mx={"auto"}
      bg={useColorModeValue("white", "gray.800")}
      onClick={() => router.push(`/course/${id}`)}
    >
      <Flex alignItems={"center"} justifyContent={"center"}>
        <Box flexShrink={{ base: 0, md: 1 }}>
          <Text
            size={"lg"}
            fontWeight={"bold"}
          >{`${item.name} (${item.course_id})`}</Text>

          <Text
            size={"lg"}
            //make color lighter
            //fontWeight={'bold'}
            // color={useColorModeValue('#808080', 'white.400')}
          >
            Slot - {item.slot}
          </Text>
        </Box>
      </Flex>
    </ListItem>
  );
};

export default SelectableItem;
