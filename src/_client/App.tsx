import logo from "./assets/dogsbody.svg";
import "./App.scss";
import {
  Button,
  Center,
  Heading,
  Input,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useAdanaArticles } from "./lib/hooks/use-adana-articles";
import { useGPT } from "./lib/hooks/use-gpt";
import { useEffect, useState } from "react";
import Chat from "./components/Chat";
import { set } from "lodash";

function App() {
  const [input, setInput] = useState("");

  const { articles, articlesLoading, fetchLearnArticle } = useAdanaArticles();

  const { currentMessage, fetchFromGPT, isLoading } = useGPT();

  const [messages, setMessages] = useState([]);

  const addMessageToHistory = (message: string, from: "me" | "dog") => {
    // @ts-ignore-next-line
    setMessages([...messages, { message, from }]);
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading) {
      addMessageToHistory(currentMessage, "dog");
    }
  }, [isLoading]);

  return (
    <Center height="100vh" flexDirection="column">
      <img src={logo} className="logo react" alt="Dogsbody logo" />
      <Heading as="h1" size="2xl">
        dogsbody.ai
      </Heading>
      <Text>
        {articlesLoading ? "Loading..." : `${articles.length} Total Articles`}
      </Text>
      <Chat messages={messages} />
      {isLoading ? <Spinner /> : null}
      <form
        onSubmit={(event: any) => {
          event.preventDefault();
          setInput("");
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Prompt Input"
        ></Input>
        <Button
          type="submit"
          onClick={async () => {
            addMessageToHistory(input, "me");
            fetchFromGPT(input);
          }}
        >
          Fetch
        </Button>
      </form>
    </Center>
  );
}

export default App;
