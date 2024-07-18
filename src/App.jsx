import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import UpdateChecker from './components/UpdateChecker';
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <h1>Welcome to your Watch List!</h1>

      <p>V1.0.8</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
        <UpdateChecker />
      </form>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;
