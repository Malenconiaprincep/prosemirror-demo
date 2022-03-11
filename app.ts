import { schema } from "prosemirror-schema-basic"
import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { exampleSetup } from "prosemirror-example-setup"
import applyDevTools from 'prosemirror-dev-tools'
import {
  defaultSettings,
  updateImageNode,
  imagePlugin,
} from "./packages/prosemirror-image-plugin/src"

import "./packages/prosemirror-image-plugin/src/styles/common.css"
import "./packages/prosemirror-image-plugin/src/styles/withResize.css"
import "./packages/prosemirror-image-plugin/src/styles/sideResize.css"
import { Schema } from "prosemirror-model"

// Update your settings here!
const imageSettings = { ...defaultSettings }

const imageSchema = new Schema({
  nodes: updateImageNode((schema.spec as any).nodes, {
    ...imageSettings,
  }),
  marks: (schema.spec as any).marks,
})

const initialDoc = {
  content: [
    {
      content: [
        {
          text: "Start typing!",
          type: "text",
        },
      ],
      type: "paragraph",
    },
  ],
  type: "doc",
}

console.log(schema.nodeFromJSON(initialDoc))
console.log(imageSchema.nodeFromJSON(initialDoc))

const state = EditorState.create({
  doc: schema.nodeFromJSON(initialDoc),
  plugins: [
    ...exampleSetup({
      schema: schema,
      menuBar: false
    }),
    imagePlugin(imageSchema, { ...imageSettings }),
  ],
})

const view: EditorView = new EditorView(document.getElementById("editor"), {
  state,
})

applyDevTools(view)

