import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Grid,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  chakra,
  Center,
  Spinner,
  Badge,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Divider,
  Image,
  AspectRatio,
  useColorMode
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import { handleOAuthSignIn,handleSignout } from '../../lib/auth'

import { BsGithub, BsTwitter, BsGoogle } from "react-icons/bs";

//import error detection from next-auth to handle errors

const providers = [
  // {
  // 	name: 'github',
  // 	Icon: BsGithub,
  // },
  // {
  // 	name: 'twitter',
  // 	Icon: BsTwitter,
  // },
  {
    name: "google",
    Icon: BsGoogle,
  },
];

const Signin = () => {
  const { data: session, status } = useSession();
  const { push, query, asPath } = useRouter();

  if (status === "loading")
    return (
      <Center h={"100vh"}>
        <Spinner size={"xl"} color={"blue.500"} />
      </Center>
    );

  // if (session) {
  // push('/')

  // 	return <Heading>you are already signed in</Heading>
  // }

  

  return (
    <Center h={"100vh"}>
      <Card p={4}
	  maxW={"500px"}
	  >
        <CardHeader
          display={"flex"}
          justifyContent={"center"}
          flexDirection={"column"}
          alignItems={"center"}
        >
        
  <Image
    src="/logo.svg"
	alt="NITC Logo"
	w="100px"
	h="100px"
	mb={4}
	  />


          <Heading size={"md"} color={
			useColorMode().colorMode === "light" ? "gray.700" : "gray.200"
		  }
		  textAlign={"center"}
		  textTransform={"uppercase"}
		>
            NITC Open Elective Allocation Portal
          </Heading>
        </CardHeader>
        <Divider color={"gray.200"} />
        <CardBody>
          <VStack spacing={4}>
            {query.error && (
              <Badge colorScheme={"red"} size={"xl"}>
                An error occured
              </Badge>
            )}
            {providers.map(({ name, Icon }) => (
              <Button
                key={name}
                leftIcon={<Icon />}
                onClick={handleOAuthSignIn(name)}
                textTransform="uppercase"
                w="100%"
                size={"lg"}
				variant={"solid"}
				
              >
                Sign in with {name}
              </Button>
            ))}
          </VStack>
        </CardBody>
      </Card>
    </Center>
  );
};

export default Signin;
