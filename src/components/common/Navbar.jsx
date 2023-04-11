import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Icon,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { DarkModeSwitch } from "./DarkModeSwitch";

import { useColorMode } from "@chakra-ui/react";

//sign in session
import { useSession } from "next-auth/react";
import { handleSignout as signOut } from "../../lib/auth";
import { signIn } from "next-auth/react";
import NavLogo from "./NavLogo";

// const Links = [

//     'Found',
//     'Lost',
//     'Create',
//     'Mail'

// ];

export default function Simple({}) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  return (
    <>
      {/* {
        isOpen && <Drawe
        user={session?.user}
        signIn={signIn}
        signOut={signOut}
        isOpen={isOpen}
        onClose={onClose}
        links={Links}

        />
    } */}
      <Box
        bg={useColorModeValue("gray.200", "gray.900")}
        px={4}
        m={0}

        // make the navbar sticky
        // position="sticky"
        // top="0"
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={4} alignItems={"center"}>
            <NavLogo />

            <Spacer />
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {/* {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))} */}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <HStack spacing={4} alignItems={"center"}>
                {session && (
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >
                    <Avatar size={"sm"} src={session.user.picture} />
                  </MenuButton>
                )}
                {!session && (
                  <Button
                    variant={"solid"}
                    colorScheme={"telegram"}
                    onClick={() => {
                      signIn("google");
                    }}
                  >
                    Sign In
                  </Button>
                )}

                <DarkModeSwitch />
              </HStack>
              <MenuList>
                <MenuItem pb={3}>
                  <Stack
                    _hover={{
                      textDecoration: "none",
                    }}
                  >
                    <Text fontWeight="bold" fontSize="lg">
                      {session?.user?.name}
                    </Text>
                    <Text fontSize="sm" textTransform="capitalize">
                      {session?.user?.role}
                    </Text>
                  </Stack>
                </MenuItem>

                <MenuDivider />
                <MenuItem
                  onClick={() => {
                    router.push("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    signOut();
                    router.push("/auth/signin");
                  }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
