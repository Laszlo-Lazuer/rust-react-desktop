import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import UpdateChecker from './components/UpdateChecker';
import ImageEditor from './components/ImageEditor';
import "./App.css";

function App() {
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");

  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <div className="container">
      <p>V1.0.9</p>

      {/* <form
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

      </form> */}
      <UpdateChecker />
      {/* <p>{greetMsg}</p> */}
      <ImageEditor />
    </div>
  );
}

export default App;
