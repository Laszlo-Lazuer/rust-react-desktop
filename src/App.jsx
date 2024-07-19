import React from "react";
import UpdateChecker from './components/UpdateChecker';
import ImageEditor from './components/ImageEditor';
import "./App.scss";
import { Flex, Text, Button } from '@radix-ui/themes';

function App() {

  return (
    <div className="container">
      <UpdateChecker />
      <ImageEditor />
    </div>
  );
}

export default App;
