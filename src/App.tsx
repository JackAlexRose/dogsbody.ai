import logo from "./assets/dogsbody.svg";
import "./App.css";

function App() {
  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={logo} className="logo react" alt="Dogsbody logo" />
        </a>
      </div>
      <h1>dogsbody.ai</h1>
      <div className="card">
        <p>Hello world</p>
      </div>
    </>
  );
}

export default App;
