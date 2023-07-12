import logo from "./assets/dogsbody.svg";
import "./App.scss";
import { Center, Heading, Text } from "@chakra-ui/react";
import { useAdanaArticles } from "./lib/hooks/use-adana-articles";

function App() {
  const {
    articles,
    articlesLoading
  } = useAdanaArticles();

  return (
    <Center height="100vh" flexDirection="column">
      <img src={logo} className="logo react" alt="Dogsbody logo" />
      <Heading as="h1" size="2xl">
        dogsbody.ai
      </Heading>
      <Text>{ articlesLoading ? 'Loading...' : `${articles.length} Total Articles` }</Text>
    </Center>
  );
}

export default App;
