import React from "react";
import UpdateChecker from './components/UpdateChecker';
import ImageEditor from './components/ImageEditor';
import "./App.scss";

function App() {

  return (
    <div className="container">
      <UpdateChecker />
      <ImageEditor />
    </div>
  );
}

export default App;
