import logo from "./assets/dogsbody.svg";
import "./App.scss";
import { Button, Center, Heading, Input, Text } from "@chakra-ui/react";
import { useAdanaArticles } from "./lib/hooks/use-adana-articles";
import { useGPT } from "./lib/hooks/use-gpt";
import { useState } from "react";

function App() {
  const [ input, setInput ] = useState('');

  const {
    articles,
    articlesLoading
  } = useAdanaArticles();

  const {
    currentMessage,
    fetchFromGPT,
    isLoading
  } = useGPT()

  return (
    <Center height="100vh" flexDirection="column">
      <img src={logo} className="logo react" alt="Dogsbody logo" />
      <Heading as="h1" size="2xl">
        dogsbody.ai
      </Heading>
      <Text>{ articlesLoading ? 'Loading...' : `${articles.length} Total Articles` }</Text>
      <Text>{ currentMessage || 'No Response' }</Text>

      <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Prompt Input"></Input>
      <Button onClick={() => {
        fetchFromGPT(input)
      }}>Fetch</Button>
    </Center>
  );
}

export default App;
