import logo from "./assets/dogsbody.svg";
import "./App.scss";
import { Button, Center, Heading, Input, Text } from "@chakra-ui/react";
import { useAdanaArticles } from "./lib/hooks/use-adana-articles";
import { useGPT, useGPTTags } from "./lib/hooks/use-gpt";
import { useEffect, useState } from "react";
import Chat from "./components/Chat";
import { set } from "lodash";
import { transformGPTResponse } from "../lib/gpt";
import { fetchLearnArticle, transformAdanaArticle } from "../lib/adana";
import { pushToContentful } from "../lib/contentful";

function App() {
  const [input, setInput] = useState("");

  const { articles, articlesLoading } = useAdanaArticles();

  const { currentMessage, fetchFromGPT, isLoading } = useGPT();
  const { currentTags, fetchTagsFromGPT, isLoadingTags } = useGPTTags();

  const [messages, setMessages] = useState([]);

  const addMessageToHistory = (message: string, from: "me" | "dog") => {
    // @ts-ignore-next-line
    setMessages((messages) => [...messages, { message, from }]);
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            addMessageToHistory("Loading Content...", "dog");
            const content = await fetchFromGPT(input, () => addMessageToHistory('Content Loaded', "dog"));
            addMessageToHistory("Loading tags...", "dog");
            const tags = await fetchTagsFromGPT(input, () => addMessageToHistory('Tags Loaded', "dog"));

            addMessageToHistory("Transforming Content...", "dog");

            const adanaResponse = await fetchLearnArticle(input);
            const adanaTransformed = await transformAdanaArticle(adanaResponse);

            const data = transformGPTResponse(content as string, {
              title: adanaTransformed.title,
              description: adanaTransformed.description,
              url: adanaTransformed.url,
              tags: tags as string,
            });

            const url = await pushToContentful(data, (msg) => addMessageToHistory(msg, "dog"));
            addMessageToHistory(url, "dog")
          }}
        >
          Fetch
        </Button>
      </form>
    </Center>
  );
}

export default App;
