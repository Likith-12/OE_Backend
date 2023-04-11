import React, { useState } from "react";
import { Clickable } from "../components/student/Steps";
import { Box, Heading, Divider } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { getSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "axios";

// import {useEffect} from 'react'
const index = ({ preferences }) => {
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      console.log("hello");

      console.log(res.data);
    };
  }, [session]);

  //courseList state

  const [courseList, setCourseList] = React.useState(preferences.courses);

  const [selectedCourses, setSelectedCourses] = useState([]);

  //add checked property to each course in state

  return (
    <Box
      px={5}
      mt={10}
      // py={16}
    >
      <Heading size={"lg"}>{`Welcome ${session?.user?.name || ""}`}</Heading>
      <Divider my={5} />

      <Clickable
        courseList={courseList}
        setCourseList={setCourseList}
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
      />
    </Box>
  );
};

export default index;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (session.user.role == "admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  if (session.user.role == "faculty") {
    return {
      redirect: {
        destination: "/faculty",
        permanent: false,
      },
    };
  }
  if (session.user.role == "student") {
    await axios.get("http://localhost:3000/api/auth/session?update");

    const url = `${process.env.NEXT_PUBLIC_API_URL}/preferences`;

    const res = await axios.get(url, {
      headers: {
        token: `${session.jwt}`,
      },
    });

    return {
      props: {
        session,
        preferences: res.data,
      },
    };
  } else if (session.user.role == "fa") {
    return {
      redirect: {
        destination: "/faculty",
        permanent: false,
      },
    };
  } else if (session.user.role == "admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
}
