import {Extension, Mark, mergeAttributes} from "@tiptap/core";
import {Plugin, PluginKey, Transaction} from "@tiptap/pm/state";
import {Node as TiptapNode} from "@tiptap/core";
import {
    makeBlockMathInputRule,
    makeInlineMathInputRule,
    REGEX_BLOCK_MATH_DOLLARS,
    insertMathCmd,
    mathBackspaceCmd,
    mathPlugin,
    mathSelectPlugin,
} from "@benrbray/prosemirror-math";
import {Schema} from "@tiptap/pm/model";
import {keymap} from "@tiptap/pm/keymap";
import {
    chainCommands,
    deleteSelection,
    joinBackward,
    selectNodeBackward,
} from "@tiptap/pm/commands";
import {inputRules} from "@tiptap/pm/inputrules";
import {EditorState, TextSelection} from "prosemirror-state";
import {Decoration, DecorationSet} from "prosemirror-view";

export interface ClickTestPluginProps {
    regex: RegExp;
}
const createP = (text: string) => {
    const div = document.createElement("div");
    div.innerText = text
    div.style.backgroundColor = "red";
    div.addEventListener("click", (e) => {
        console.log("click");
        //e.preventDefault();
    });
    div.addEventListener("mousedown", (e) => {
        console.log("down");
        //e.preventDefault();
    });
    return div;
};

export const ClickTestPlugin = ({regex}: ClickTestPluginProps) => {
    return new Plugin({
        key: new PluginKey("clickTest"),
        state: {
            init: () => DecorationSet.empty,
            apply: (
                tr: Transaction,
                prevPluginState: DecorationSet,
                newEditorState: EditorState,
            ): DecorationSet => {
                const { selection } = newEditorState;
                const decorations: Decoration[] = [];

                newEditorState.doc.descendants((node, pos) => {
                    if (!node.isText || !node.text) {
                        return;
                    }

                    const text = node.text;
                    for (
                        let matches = regex.exec(text);
                        matches !== null;
                        matches = regex.exec(text)
                    ) {
                        const start = pos + matches.index;
                        const end = start + matches[0].length;
                        const exp = matches[1];

                        const w = Decoration.widget(start, (view) => {
                            return createP(exp);
                        });
                        decorations.push(w);
                    }
                });

                return DecorationSet.create(newEditorState.doc, decorations);
            },
        },
        props: {
            decorations(t) {
                return this.getState(t);
            },
        },
    });
};

export const ClickTestExtension = (props: ClickTestPluginProps) => Extension.create({
    name: "clickTest",
    addOptions: () => (props),
    addProseMirrorPlugins() {
        return [ClickTestPlugin({ ...this.options })];
    },
});