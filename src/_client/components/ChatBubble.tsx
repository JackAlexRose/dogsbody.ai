import { VStack, Box } from "@chakra-ui/react";

type Props = {
  message: string;
  from: "me" | "dog";
};

const ChatBubble = ({ message, from }: Props) => {
  const borderRadius = 10;
  const isResponse = from === "dog";
  const alignment = isResponse ? "flex-start" : "flex-end";
  const bottomRightRadius = isResponse ? 0 : borderRadius;
  const bottomLeftRadius = isResponse ? borderRadius : 0;

  return (
    <VStack mt={6} alignItems={alignment} alignSelf={alignment}>
      <Box
        bg={isResponse ? "gray.900" : "blue.500"}
        px={6}
        py={4}
        maxW={80}
        borderTopLeftRadius={borderRadius}
        borderTopRightRadius={borderRadius}
        borderBottomLeftRadius={bottomLeftRadius}
        borderBottomRightRadius={bottomRightRadius}
      >
        {message}
      </Box>
    </VStack>
  );
};

export default ChatBubble;
