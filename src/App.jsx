import React from "react";
import UpdateChecker from './components/UpdateChecker';
import ImageEditor from './components/ImageEditor';
import "./App.scss";
import { Flex, Text, Button } from '@radix-ui/themes';

function App() {

  return (
    <div className="container">
      <p>V1.0.10</p>
      <Flex direction="column" gap="2">
      <Button>Test</Button>
      </Flex>
      <UpdateChecker />
      <ImageEditor />
    </div>
  );
}

export default App;
