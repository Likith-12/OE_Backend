import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  Text,
  ButtonGroup,
  IconButton,
  chakra,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa";
import { useRef } from "react";
import { CheckIcon } from "@chakra-ui/icons";
import { useState } from "react";

function CustomFilePicker({
  label,
  onChange,
  accept,
  onsubmit,
  uploadProgress,
  ...rest
}) {
  const filePickerRef = useRef(null);

  const handleButtonClick = () => {
    filePickerRef.current.click();
  };

  return (
    <chakra.form
      onSubmit={(e) => {
        e.preventDefault();
        onsubmit(e);
        filePickerRef.current.value = null;
      }}
      encType="multipart/form-data"
    >
      <FormControl {...rest}>
        <Flex
          alignItems={"center"}
          justifyContent={"space-between"}
          p={3}
          border={"1px"}
          borderColor={"telegram.500"}
          borderRadius={"md"}
        >
          <Text>{label}</Text>
          <Input
            id="file-picker"
            type="file"
            accept={accept}
            onChange={onChange}
            display="none"
            ref={filePickerRef}
          />
          <ButtonGroup>
            <Button
              onClick={handleButtonClick}
              colorScheme="telegram"
              size={"sm"}
              leftIcon={<FaUpload />}
            >
              Select a File
            </Button>
            <IconButton
              colorScheme="green"
              type="submit"
              size={"sm"}
              aria-label="Upload"
              // making the onclick of button to upload files
              // onClick={onsubmit}
              icon={<CheckIcon />}
              isDisabled={label === "File Uploaded Successfully"}
            />
          </ButtonGroup>
        </Flex>
      </FormControl>
    </chakra.form>
  );
}

export default CustomFilePicker;
