import logo from "./assets/dogsbody.svg";
import "./App.css";
import { Center, Heading } from "@chakra-ui/react";

function App() {
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
