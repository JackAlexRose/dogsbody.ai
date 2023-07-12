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

  const { fetchFromGPT, isLoading } = useGPT();
  const { fetchTagsFromGPT, isLoadingTags } = useGPTTags();

  const [messages, setMessages] = useState([]);

  const addMessageToHistory = (message: string, from: "me" | "dog") => {
    // @ts-ignore-next-line
    setMessages((messages) => [...messages, { message, from }]);
  };

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
          disabled={isLoading || isLoadingTags}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Prompt Input"
        ></Input>
        <Button
          type="submit"
          isLoading={isLoading || isLoadingTags}
          onClick={async () => {
            addMessageToHistory(input, "me");
            addMessageToHistory("Bleep bloop OpenAI is at work...", "dog");
            const content = await fetchFromGPT(input, () => addMessageToHistory('Content Loaded', "dog"));
            addMessageToHistory("Generating Tags...", "dog");
            const tags = await fetchTagsFromGPT(input, () => addMessageToHistory('Tags Loaded', "dog"));

            const adanaResponse = await fetchLearnArticle(input);
            const adanaTransformed = await transformAdanaArticle(adanaResponse);

            const data = transformGPTResponse(content as string, {
              title: adanaTransformed.title,
              description: adanaTransformed.description,
              url: adanaTransformed.url,
              tags: tags as string,
            });

            addMessageToHistory(`Tags Generated: ${data.metadata.tags.join(', ')}`, "dog");

            const url = await pushToContentful(data, (msg) => addMessageToHistory(msg, "dog"));
            addMessageToHistory(`Article Draft Created: ${url}`, "dog")
            window.open(url, "_blank");
            setInput('');
          }}
        >
          Fetch
        </Button>
      </form>
    </Center>
  );
}

export default App;
