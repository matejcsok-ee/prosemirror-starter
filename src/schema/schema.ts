import { Schema } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";

const nodes = basicSchema.spec.nodes;

const marks = basicSchema.spec.marks.addToEnd("comment", {
  excludes: "",
  attrs: {
    id: { default: "" },
  },
  parseDOM: [
    {
      tag: "span.comment",
      getAttrs: (dom: any) => ({ id: dom.getAttribute("data-id") || "" }),
    },
  ],
  toDOM: (mark) => ["span", { class: "comment", "data-id": mark.attrs.id }, 0],
});

const defaultSchema = new Schema({
  nodes,
  marks,
});

export { defaultSchema };
