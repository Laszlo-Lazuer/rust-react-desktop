// The Design System theme is implemented here via the ThemeProvider
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider attribute="class">
     <Theme accentColor="orange" appearance="dark" grayColor="sage">
        <App />
      </Theme>
    </ThemeProvider>
  </React.StrictMode>,
);
