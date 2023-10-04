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
import 'katex/dist/katex.css';
import {ClickTestExtension} from "./ClickTest";

export const TiptapEditor = () => {
    const editor = useEditor({
        content: "asd \\(aasd\\) asd",
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
            ClickTestExtension({regex: /\\\(([^$]*)\\\)/gi})
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