import React, { useEffect, useMemo, useRef, useState } from "react";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { exampleSetup } from "prosemirror-example-setup";
import { applyDevTools } from "prosemirror-dev-toolkit";

import styled from "styled-components";
import { defaultSchema } from "./schema/schema";
import { useComment } from "./hooks/useComment";

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const StyledEditor = styled.div`
  width: 80%;
  margin-bottom: 0.625rem;
`;

const Button = styled.button`
  align-items: center;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0.02) 0 1px 3px 0;
  box-sizing: border-box;
  color: rgba(0, 0, 0, 0.85);
  cursor: pointer;
  display: inline-flex;
  font-family:
    system-ui,
    -apple-system,
    system-ui,
    "Helvetica Neue",
    Helvetica,
    Arial,
    sans-serif;
  font-size: 16px;
  font-weight: 600;
  justify-content: center;
  line-height: 1.25;
  margin: 0;
  min-height: 3rem;
  padding: calc(0.875rem - 1px) calc(1.5rem - 1px);
  position: relative;
  text-decoration: none;
  transition: all 250ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  vertical-align: baseline;
  width: 100%;

  hover,
  focus {
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.1) 0 4px 12px;
    color: rgba(0, 0, 0, 0.65);
  }

  hover {
    transform: translateY(-1px);
  }

  active {
    background-color: #f0f0f1;
    border-color: rgba(0, 0, 0, 0.15);
    box-shadow: rgba(0, 0, 0, 0.06) 0 2px 4px;
    color: rgba(0, 0, 0, 0.65);
    transform: translateY(0);
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
      doc: defaultSchema.nodeFromJSON(initialDoc),
      plugins: [...exampleSetup({ schema: defaultSchema })],
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

  const { addCommentMark, removeCommentMark } = useComment(editorView);

  return (
    <Root>
      <Row>
        <Button onClick={addCommentMark}>add comment mark</Button>
        <Button onClick={removeCommentMark}>remove comment mark</Button>
      </Row>
      <StyledEditor id="editor" ref={editorRef} />
    </Root>
  );
};
