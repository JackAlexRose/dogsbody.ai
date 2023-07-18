import logo from "./assets/dogsbody.svg";
import "./App.scss";
import { Button, Center, Flex, Heading, Input } from "@chakra-ui/react";
import { useGPT, useGPTTags } from "./lib/hooks/use-gpt";
import { useState } from "react";
import Chat from "./components/Chat";
import { transformGPTResponse } from "../lib/gpt";
import { fetchLearnArticle, transformAdanaArticle } from "../lib/adana";
import { pushToContentful } from "../lib/contentful";

function App() {
  const [input, setInput] = useState("");

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
            disabled={isLoading || isLoadingTags}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Give me a learn article url..."
          ></Input>
          <Button
            ml={2}
            type="submit"
            onClick={async () => {
              addMessageToHistory(input, "me");
              addMessageToHistory("Bleep bloop OpenAI is at work...", "dog");
              const content = await fetchFromGPT(input, () =>
                addMessageToHistory("Content Loaded", "dog")
              );
              addMessageToHistory("Generating Tags...", "dog");
              const tags = await fetchTagsFromGPT(input, () =>
                addMessageToHistory("Tags Loaded", "dog")
              );

              const adanaResponse = await fetchLearnArticle(input);
              const adanaTransformed = await transformAdanaArticle(
                adanaResponse
              );

              const data = transformGPTResponse(content as string, {
                title: adanaTransformed.title,
                description: adanaTransformed.description,
                url: adanaTransformed.url,
                tags: tags as string,
              });

              addMessageToHistory(
                `Tags Generated: ${data.metadata.tags.join(", ")}`,
                "dog"
              );

              const url = await pushToContentful(data, (msg) =>
                addMessageToHistory(msg, "dog")
              );
              addMessageToHistory(`Article Draft Created: ${url}`, "dog");
              window.open(url, "_blank");
              setInput("");
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
