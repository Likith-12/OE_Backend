import { useColorModeValue } from "@chakra-ui/color-mode";
import { Box } from "@chakra-ui/layout";
import { Button, Flex, Heading, Divider } from "@chakra-ui/react";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import { useEffect } from "react";
import PreferenceForm from "./PreferenceForm";
import ListSelecter from "./ListSelecter";
import ListSorter from "./ListSorter";
import { FaCheck } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import FinalStep from "./FinalStep";

const steps = [
  { label: "Step 1", description: "View your profile" },
  { label: "Step 2", description: "Enter your preferences" },
];

export function Clickable({
  courseList,
  setCourseList,
  selectedCourses,
  setSelectedCourses,
}) {
  const [isAllocationDone, setIsAllocationDone] = useState(false);
  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);
  const [isPreferenceFilled, setIsPreferenceFilled] = useState(false);
  const [message, setMessage] = useState("");

  const { nextStep, activeStep, setStep, prevStep } = useSteps({});
  const [buttonLoading, setButtonLoading] = useState(false);
  const { data: session, status } = useSession();
  const handlePreferenceSubmit = async () => {
    console.log(selectedCourses);
    setButtonLoading(true);

    try {
      if (selectedCourses.length === 0) {
        toast.error("Please select at least one course");
        setButtonLoading(false);
        return;
      }

      const headers = {
        token: `${session.jwt}`,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/preferences`,
        {
          user: session.user.email,
          preferences: selectedCourses,
        },
        { headers }
      );

      if (res.status === 200) {
        toast.success("Preferences saved successfully");
        setIsPreferenceFilled(true);
      }

      nextStep();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setButtonLoading(false);
    }

    setButtonLoading(false);
  };

  const hasCompletedAllSteps = activeStep === 2;
  const bg = useColorModeValue("gray.200", "gray.700");

  // allocated: false
  // deadline_passed: false
  // "preference_filled ": true

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/timeline`,
          {
            headers: {
              token: `${session.jwt}`,
            },
          }
        );

        console.log(res.data.allocation_approved);

        console.log(res.data);

        // setIsAllocationDone(res.data.allocated);
        setIsAllocationDone(res.data.allocation_approved);
        setIsDeadlinePassed(res.data.deadline_passed);

        setIsPreferenceFilled(res.data.preference_filled);
        console.log(isAllocationDone);
        console.log(isDeadlinePassed);
        console.log(isPreferenceFilled);
        // setTimelineData(res.data);
        // console.log(res.data);
        if (!res.data.preference_filled && !res.data.deadline_passed) {
          setStep(0);
        } else {
          setStep(2);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    // console.log("Hello");
  }, []);

  return (
    <Flex flexDir="column" width="100%">
      <Steps activeStep={activeStep} colorScheme="telegram" initialStep={0}>
        <Step label="Step 1" description="View your profile">
          <PreferenceForm nextStep={nextStep} setStep={setStep} />
        </Step>
        <Step label="Step 2" description="Select your preferences">
          <Flex
            p={2}
            w={"100%"}
            bg={useColorModeValue("gray.200", "gray.900")}
            mt={10}
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            alignItems="center"
            mx={{ base: "auto", md: "0" }}
            borderRadius="lg"
          >
            <Box p={2} py={4} my={2} mx="auto" w={{ base: "100%", md: "50%" }}>
              <ListSelecter
                courseList={courseList}
                setCourseList={setCourseList}
                selectedCourses={selectedCourses}
                setSelectedCourses={setSelectedCourses}
                nextStep={nextStep}
                prevStep={prevStep}
              />
            </Box>
            <Divider
              color="gray.800"
              orientation={{ base: "horizontal", md: "vertical" }}
            />

            <ListSorter
              items={courseList}
              setItems={setCourseList}
              courseList={courseList}
              setCourseList={setCourseList}
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              // courseList={selectedCourses}
              // setCourseList={setSelectedCourses}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          </Flex>

          <Button
            type="Submit"
            colorScheme="telegram"
            onClick={() => {
              handlePreferenceSubmit();
            }}
            //  isLoading={true}

            my={4}
            width={"150px"}
            alignSelf="flex-end"
            size={"md"}
            leftIcon={<FaCheck />}
            //center the button

            //if loading is true, disable the button and show a spinner
            isLoading={buttonLoading}
          >
            Submit
          </Button>
        </Step>
      </Steps>
      <FinalStep
        hasCompletedAllSteps={hasCompletedAllSteps}
        isAllocationDone={isAllocationDone}
        isDeadlinePassed={isDeadlinePassed}
        isPreferenceFilled={isPreferenceFilled}
      />
    </Flex>
  );
}
