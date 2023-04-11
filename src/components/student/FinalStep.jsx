import React, { useEffect } from "react";
import { Box, Heading, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

import AllocationTable from "./AllocationTable";

const FinalStep = ({
  hasCompletedAllSteps,
  isAllocationDone,
  isDeadlinePassed,
  isPreferenceFilled,
}) => {
  const [Allocation, setAllocation] = useState({
    course_id: "CS 101",
    name: "Introduction to Computer Science",
    slot: "A1",
    faculty: "Dr. A",
  });
  const [message, setMessage] = useState("");

  // const Allocation=null;
  const messageAtStep2 = () => {
    console.log(isDeadlinePassed, isPreferenceFilled, isAllocationDone);
    if (isDeadlinePassed && !isPreferenceFilled) {
      return "You didnt fill the preferences in time. Please contact the admin";
    } else if (isDeadlinePassed && isPreferenceFilled && !isAllocationDone) {
      return "Hang on ! The Allocation is in progress ! ⌛";
    } else if (isDeadlinePassed && isPreferenceFilled && isAllocationDone) {
      if (Allocation == null) {
        return "You didnt get any course. Better luck next time !";
      }

      //  jamal please add the details of course the person got
      return <AllocationTable Allocation={Allocation} />;
    } else {
      return "Hang on ! The Allocation is in progress ! ⌛";
    }
  };

  useEffect(() => {
    setMessage(messageAtStep2());
  }, [isDeadlinePassed, isPreferenceFilled, isAllocationDone]);

  return (
    <>
      {hasCompletedAllSteps && (
        <Box
          bg={useColorModeValue("gray.200", "gray.900")}
          px={{ base: 4, md: 10 }}
          marginTop={8}
          py={8}
          borderRadius={"md"}
        >
          <Heading fontSize="xl" textAlign={"center"}>
            {message}
          </Heading>
        </Box>
      )}
    </>
  );
};

export default FinalStep;
