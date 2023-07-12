import logo from "./assets/dogsbody.svg";
import "./App.scss";
import { Center, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
import { fetchAllLearnArticles } from "../lib/adana";

function App() {
  useEffect(() => {
    console.log('Testing');
    fetchAllLearnArticles().then((articles) => {
      console.log(articles.length);
    });
  }, [])

  return (
    <Center height="100vh" flexDirection="column">
      <img src={logo} className="logo react" alt="Dogsbody logo" />
      <Heading as="h1" size="2xl">
        dogsbody.ai
      </Heading>
    </Center>
  );
}

export default App;
