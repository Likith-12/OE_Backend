import React from "react";
import {
  HStack,
  Image,
  Heading,
  useColorModeValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";

const NavLogo = () => {
  return (
    <HStack as="nav">
      <ChakraLink as={Link} href="/" spacing={4}>
        <Image boxSize="50px" src="/logo.svg" alt="logo" />
      </ChakraLink>
      <ChakraLink as={Link} href="/" textDecor="none">
        <Heading size="sm" color={useColorModeValue("gray.600", "gray.200")}>
          Open Elective Allocation Portal
        </Heading>
      </ChakraLink>
    </HStack>
  );
};

export default NavLogo;
