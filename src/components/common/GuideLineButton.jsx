import React from "react";
import { IconButton, useColorMode, Icon } from "@chakra-ui/react";

import { FaQuestionCircle } from "react-icons/fa";
//circle question mark icon

const GuideLineButton = () => {
  return (
    <IconButton
      aria-label="Guidelines"
      icon={<Icon as={FaQuestionCircle} rounded="full" width={8} height={8} />}
      title="Guidelines"
      size="lg"
      variant="ghost"
      // colorScheme="telegram"
      colorScheme={"telegram"}
      rounded="full"
      onClick={() => {}}
      position="fixed"
      bottom={5}
      right={5}
      opacity={0.3}
      _hover={{
        opacity: 1,
      }}
    />
  );
};

export default GuideLineButton;
