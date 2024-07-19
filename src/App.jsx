import React from "react";
import UpdateChecker from './components/UpdateChecker';
import ImageEditor from './components/ImageEditor';
import "./App.css";

function App() {

  return (
    <div className="container">
      <p>V1.0.10</p>

      <UpdateChecker />
      <ImageEditor />
    </div>
  );
}

export default App;
