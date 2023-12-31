import {
  Flex,
  HStack,
  IconButton,
  Input,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
} from "@chakra-ui/react";

import ChatBubble from "./ChatBubble";

type Props = {
  messages?: {
    from: "me" | "dog";
    message: string;
  }[];
};

const Chat = ({ messages }: Props) => {
  return (
    <Flex w="full" overflowY="scroll" flexDirection="column" py="4">
      <Flex px={6} overflowY="scroll" flexDirection="column" flex={1}>
        {messages ? (
          messages.map(({ message, from }, index) => (
            <ChatBubble
              key={index}
              message={message}
              from={from as "me" | "dog"}
            />
          ))
        ) : (
          <Spacer />
        )}
      </Flex>
    </Flex>
  );
};

export default Chat;
