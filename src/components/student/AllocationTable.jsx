import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  useColorModeValue,
  Box,
  Heading,
  // useColorModeValue,
  // Box,
  // Heading,
  // useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { getError } from "../../lib/general";

const AllocationTable = () => {
  const { data: session } = useSession();
  const [Allocation, setAllocation] = useState(null);
  useEffect(() => {
    const getAllocation = async () => {
      if (!session) return;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/student_allocation`,
          {
            headers: {
              token: session.jwt,
            },
          }
        );
        console.log(res.data);
        setAllocation(res.data.allotted_course);
      } catch (error) {
        if (error && error.response) {
          setAllocation(null);
        }
      }
    };
    getAllocation();
  }, [session]);
  return (
    <Box
      bg={useColorModeValue("gray.200", "gray.900")}
      px={{ base: 4, md: 10 }}
      marginTop={2}
    >
      <Heading
        as="h2"
        size="lg"
        fontWeight="bold"
        textAlign="center"
        mb={4}
        // bg={useColorModeValue("telegram.500", "gray.500")}
      >
        Your Allocation
      </Heading>
      {Allocation ? (
        <Table
          variant="simple"
          bg={useColorModeValue("white", "grey.900")}
          borderRadius={"md"}
          fontSize={{ base: "sm", md: "md" }}
        >
          <Thead>
            <Tr>
              <Th>Course Code</Th>
              <Th>Course Name</Th>
              <Th>Faculty</Th>
              <Th>Slot</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{Allocation?.course_id}</Td>
              <Td>{Allocation?.name}</Td>
              <Td>{Allocation?.faculty}</Td>
              <Td>{Allocation?.slot}</Td>
            </Tr>
          </Tbody>
        </Table>
      ) : (
        <Heading fontSize={"xl"}>
          You were not alloted any course this time around. Better Luck Next
          Time
        </Heading>
      )}
    </Box>
  );
};

export default AllocationTable;
