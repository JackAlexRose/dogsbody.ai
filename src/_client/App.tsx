import logo from "./assets/dogsbody.svg";
import "./App.scss";
import { Button, Center, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useAdanaArticles } from "./lib/hooks/use-adana-articles";
import { useGPT } from "./lib/hooks/use-gpt";
import { useEffect, useState } from "react";
import Chat from "./components/Chat";

function App() {
  const [input, setInput] = useState("");

  const { currentMessage, fetchFromGPT, isLoading } = useGPT();

  const [messages, setMessages] = useState([]);

  const addMessageToHistory = (message: string, from: "me" | "dog") => {
    // @ts-ignore-next-line
    setMessages((messages) => [...messages, { message, from }]);
  };

  return (
    <Center height="100vh" flexDirection="column" pb={4}>
      <Center>
        <img src={logo} className="logo react" alt="Dogsbody logo" />
        <Heading as="h1" size="2xl">
          dogsbody.ai
        </Heading>
      </Center>

      <Chat messages={messages} isLoading={isLoading} />
      <form
        onSubmit={(event: any) => {
          event.preventDefault();
          setInput("");
        }}
        className="form"
      >
        <Flex w="full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Give me an Adana article..."
          ></Input>
          <Button
            ml={2}
            type="submit"
            onClick={async () => {
              addMessageToHistory(input, "me");
              addMessageToHistory("Woof woof", "dog");
              fetchFromGPT(input, (data) => addMessageToHistory(data, "dog"));
            }}
          >
            Fetch
          </Button>
        </Flex>
      </form>
    </Center>
  );
}

export default App;
