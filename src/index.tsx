import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ProsemirrorEditor } from "./ProsemirrorEditor";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ProsemirrorEditor />
  </React.StrictMode>,
);
