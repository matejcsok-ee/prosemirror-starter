import { Extension, Mark, mergeAttributes } from "@tiptap/core";
import { Plugin } from "@tiptap/pm/state";
import { Node as TiptapNode } from "@tiptap/core";
import {
  makeBlockMathInputRule,
  makeInlineMathInputRule,
  REGEX_BLOCK_MATH_DOLLARS,
  insertMathCmd,
  mathBackspaceCmd,
  mathPlugin,
  mathSelectPlugin,
} from "@benrbray/prosemirror-math";
import { Schema } from "@tiptap/pm/model";
import { keymap } from "@tiptap/pm/keymap";
import {
  chainCommands,
  deleteSelection,
  joinBackward,
  selectNodeBackward,
} from "@tiptap/pm/commands";
import { inputRules } from "@tiptap/pm/inputrules";

const mathNodes = [
  TiptapNode.create({
    name: "math_inline",
    content: "text*",
    group: `inline math`,
    inline: true,
    atom: true,
    code: true, // important!
    renderHTML: ({ HTMLAttributes }) => {
      return [
        "math-inline",
        mergeAttributes({ class: "math-node" }, HTMLAttributes),
        0,
      ];
    },
    parseHTML: () => [
      {
        tag: "math-inline",
      },
    ],
  }),
  TiptapNode.create({
    name: "math_display",
    group: "block math",
    content: "text*", // important!
    atom: true, // important!
    code: true, // important!
    renderHTML: ({ HTMLAttributes }) => [
      "math-display",
      mergeAttributes({ class: "math-node" }, HTMLAttributes),
      0,
    ],
    parseHTML: () => [
      {
        tag: "math-display", // important!
      },
    ],
  }),
  Mark.create({
    name: "math_select",
    renderHTML: () => {
      return ["math-select", 0];
    },
    parseHTML: () => [{ tag: "math-select" }],
  }),
];

const inlineMathInputRule = (editorSchema: Schema) =>
  makeInlineMathInputRule(/\$\\(.+)\$/, editorSchema.nodes.math_inline);
const blockMathInputRule = (editorSchema: Schema) =>
  makeBlockMathInputRule(
    REGEX_BLOCK_MATH_DOLLARS,
    editorSchema.nodes.math_display,
  );

const mathematicsExtension = Extension.create({
  addProseMirrorPlugins(): Plugin[] {
    const { editor } = this;
    return [
      mathPlugin,
      keymap({
        "Mod-Space": insertMathCmd(editor.schema.nodes.math_inline),
        // modify the default keymap chain for backspace
        Backspace: chainCommands(
          deleteSelection,
          mathBackspaceCmd,
          joinBackward,
          selectNodeBackward,
        ),
      }),
      inputRules({
        rules: [
          inlineMathInputRule(editor.schema),
          blockMathInputRule(editor.schema),
        ],
      }),
      //mathSelectPlugin,
    ];
  },
});

const exp = [mathNodes, mathematicsExtension];

export {
  mathNodes as MathematicsNodes,
  mathematicsExtension as Mathematics,
  exp as default,
};
