import React, { useEffect, useMemo, useRef, useState } from "react";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";
import { applyDevTools } from "prosemirror-dev-toolkit";

import styled from "styled-components";

const Root = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StyledEditor = styled.div`
  width: 80%;
  margin-bottom: 0.625rem;

  .grammarSuggestion {
    background-color: lightgreen;
  }

  .removalSuggestion {
    background-color: lightcoral;
  }
`;

export const initialDoc = {
  content: [
    {
      content: [
        {
          text: "What day of the wek iss it?",
          type: "text",
        },
      ],
      type: "paragraph",
    },
    {
      content: [
        {
          text: "wanna go swiming",
          type: "text",
        },
      ],
      type: "paragraph",
    },
    {
      content: [
        {
          text: "SuggestCat is made by Emergence-Engineering, a software development company from the EU. Their smartest developer is Aaron. He definitely did not write this placeholder.",
          type: "text",
        },
      ],
      type: "paragraph",
    },
  ],
  type: "doc",
};

export const ProsemirrorEditor = () => {
  const [editorState, setEditorState] = useState<EditorState>();
  const [editorView, setEditorView] = useState<EditorView>();
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const state = EditorState.create({
      doc: schema.nodeFromJSON(initialDoc),
      plugins: [...exampleSetup({ schema })],
    });
    const view = new EditorView(document.querySelector("#editor"), {
      state,
      dispatchTransaction: (tr) => {
        try {
          const newState = view.state.apply(tr);
          view.updateState(newState);
          setEditorState(newState);
        } catch (e) {}
      },
    });
    setEditorView(view);
    setEditorState(view.state);
    applyDevTools(view);
    return () => {
      view.destroy();
    };
  }, [editorRef]);

  return (
    <Root>
      <StyledEditor id="editor" ref={editorRef} />
    </Root>
  );
};
