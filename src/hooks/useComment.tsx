import React, { useCallback, useEffect, useState } from "react";
import { EditorView } from "prosemirror-view";
import { nanoid } from "nanoid";

import { defaultSchema } from "../schema/schema";

export const useComment = (view?: EditorView) => {
  const [commentId, setCommentId] = useState<string | null>(null);

  useEffect(() => {
    if (!view?.state) {
      setCommentId(null);
      return;
    }

    const marks = view.state.selection.$head.marks();
    if (!marks.length) {
      setCommentId(null);
      return;
    }
    setCommentId(marks[0].attrs.id);
  }, [view?.state]);

  const addCommentMark = useCallback(() => {
    if (!view) {
      return;
    }
    const { tr, selection } = view.state;
    const id = nanoid();
    if (!selection.empty) {
      tr.addMark(
        selection.from,
        selection.to,
        defaultSchema.mark("comment", { id }),
      );
      view.dispatch(tr);
    }
  }, [view]);

  const removeCommentMark = useCallback(() => {
    if (!view || !commentId) {
      return;
    }

    const { state, dispatch } = view;
    let tr = state.tr;

    state.doc.descendants((node, pos) => {
      if (node.isText) {
        node.marks.forEach((mark) => {
          if (mark.attrs.id === commentId) {
            console.log({ mark, node, pos });
            tr = tr.removeMark(
              pos,
              pos + node.nodeSize,
              view.state.schema.marks.comment.create({id:commentId}),
            );
          }
        });
      }
    });
    dispatch(tr);
  }, [view, commentId]);

  return { addCommentMark, removeCommentMark };
};
