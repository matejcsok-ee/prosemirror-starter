import React, { useEffect, useMemo, useRef, useState } from "react";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "prosemirror-schema-basic";
import { exampleSetup } from "prosemirror-example-setup";
import { applyDevTools } from "prosemirror-dev-toolkit";

import styled from "styled-components";
import { Schema } from "prosemirror-model";
import {
  insertMathCmd,
  makeBlockMathInputRule,
  makeInlineMathInputRule, mathBackspaceCmd,
  mathPlugin,
  REGEX_BLOCK_MATH_DOLLARS
} from "@benrbray/prosemirror-math";
import { keymap } from "prosemirror-keymap";
import { chainCommands, deleteSelection, joinBackward, selectNodeBackward } from "prosemirror-commands";
import { inputRules } from "prosemirror-inputrules";

const Root = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const StyledEditor = styled.div`
  width: 80%;
  margin-bottom: 0.625rem;

`;

const mathSchema = new Schema({
  nodes: {
    doc: {
      content: "block+"
    },
    paragraph: {
      content: "inline*",
      group: "block",
      parseDOM: [{ tag: "p" }],
      toDOM() { return ["p", 0]; }
    },
    math_inline: {               // important!
      group: "inline math",
      content: "text*",        // important!
      inline: true,            // important!
      atom: true,              // important!
      toDOM: () => ["math-inline", { class: "math-node" }, 0],
      parseDOM: [{
        tag: "math-inline"   // important!
      }]
    },
    math_display: {              // important!
      group: "block math",
      content: "text*",        // important!
      atom: true,              // important!
      code: true,              // important!
      toDOM: () => ["math-display", { class: "math-node" }, 0],
      parseDOM: [{
        tag: "math-display"  // important!
      }]
    },
    text: {
      group: "inline"
    }
  }
});


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

const inlineMathInputRule = makeInlineMathInputRule(/\$\\(.+)\$/, mathSchema.nodes.math_inline);
const blockMathInputRule = makeBlockMathInputRule(REGEX_BLOCK_MATH_DOLLARS, mathSchema.nodes.math_display);

export const ProsemirrorEditor = () => {
  const [editorState, setEditorState] = useState<EditorState>();
  const [editorView, setEditorView] = useState<EditorView>();
  const editorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const state = EditorState.create({
      doc: mathSchema.nodeFromJSON(initialDoc),
      plugins: [
          ...exampleSetup({ schema: mathSchema }),
        mathPlugin,
        keymap({
          "Mod-Space" : insertMathCmd(schema.nodes.math_inline),
          // modify the default keymap chain for backspace
          "Backspace": chainCommands(deleteSelection, mathBackspaceCmd, joinBackward, selectNodeBackward),
        }),
        inputRules({ rules: [ inlineMathInputRule, blockMathInputRule ] })
      ],
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
