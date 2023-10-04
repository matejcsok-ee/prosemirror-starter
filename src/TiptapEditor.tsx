import React, { useEffect, useState } from "react";
import {
    useEditor,
    EditorContent,
    FloatingMenu,
    BubbleMenu,
} from "@tiptap/react";
import * as Y from "yjs";
import StarterKit from "@tiptap/starter-kit";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { applyDevTools } from "prosemirror-dev-toolkit";
import { nanoid } from "nanoid";
import {Collaboration} from "@tiptap/extension-collaboration";
import {Mathematics, MathematicsNodes} from "./Mathematics";
import 'katex/dist/katex.css';
import "@benrbray/prosemirror-math/style/math.css";

export const TiptapEditor = () => {
    // Set up the Hocuspocus WebSocket provider
    const provider = new HocuspocusProvider({
        url: "ws://127.0.0.1:1236",
        name: "example-document",
    });

    const editor = useEditor({
        content: "asd $\\frac{1}{2}$ asd",
        extensions: [
            StarterKit.configure({
                // The Collaboration extension comes with its own history handling
                history: false,
            }),
            /*
            // Register the document with Tiptap
            Collaboration.configure({
                document: provider.document,
            }),*/
            ...MathematicsNodes,
            Mathematics,
        ],
    });

    useEffect(() => {
        if (!editor?.view) {
            return;
        }
        applyDevTools(editor.view);
    }, [editor]);

    const [currentComment, setCurrentComment] = useState<string | null>(null);

    useEffect(() => {
        if (!editor?.view.state) {
            return;
        }

        const {
            view: {
                state: { selection },
            },
        } = editor;

        const marks = selection.$head.marks();
        console.log({ marks });
        if (!marks.length) {
            setCurrentComment(null);
            return;
        }
        setCurrentComment(marks[0].attrs.comment.comment_id);
    }, [editor?.view.state]);

    console.log({ currentComment });

    if (!editor) {
        return null;
    }

    return (
        <>
            <EditorContent editor={editor} />
        </>
    );
};