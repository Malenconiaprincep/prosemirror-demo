import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { baseKeymap } from "prosemirror-commands"
import { keymap } from "prosemirror-keymap"
import { Plugin } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"
import {history} from "prosemirror-history"
import {exampleSetup} from "prosemirror-example-setup"

const titlePlugin = new Plugin({
  props: {
    decorations({ doc, selection }: any) {
      const options = {
        emptyNodeClass: "is-empty",
        placeholder: "Write something …",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
        includeChildren: false,
      }
      const { anchor } = selection
      const decorations: Decoration[] = []

      console.log(doc.firstChild)
      console.log(doc.firstChild.childCount)
      console.log(doc.firstChild.nodeSize)

      doc.descendants((node: any, pos: any) => {
        const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize
        const isEmpty = !node.isLeaf && !node.childCount

        if ((hasAnchor || !options.showOnlyCurrent) && isEmpty) {
          const classes = [options.emptyNodeClass]

          const decoration = Decoration.node(pos, pos + node.nodeSize, {
            class: classes.join(" "),
            "data-placeholder": options.placeholder,
          })

          decorations.push(decoration)
        }

        return options.includeChildren
      })

      return DecorationSet.create(doc, decorations)
    },
  },
})

const img = {
  attrs: {
    src: {},
  },
  inline: false,
  group: "block",
  draggable: true,
  parseDOM: [
    {
      tag: "img[src]",
      getAttrs,
    },
  ],
  toDOM(node: any) {
    const attrs = {
      src: node.attrs.src,
    }
    return [
      "div",
      {
        class: "image-with-description-container",
        "image-with-description": true,
      },
      [
        "img",
        {
          ...node.attrs,
          class: "image",
        },
      ],
      [
        "p",
        {
          class: "image-description",
        },
      ],
    ]
  },
}

function getAttrs(dom: HTMLElement) {
  const { cssFloat, display, marginTop, marginLeft } = dom.style
  let { width, height } = dom.style
  let align = dom.getAttribute("data-align") || dom.getAttribute("align")
  if (align) {
    align = /(left|right|center)/.test(align) ? align : null
  } else if (cssFloat === "left" && !display) {
    align = "left"
  } else if (cssFloat === "right" && !display) {
    align = "right"
  } else if (!cssFloat && display === "block") {
    align = "block"
  }

  width = width || (dom.getAttribute("width") ?? "")
  height = height || (dom.getAttribute("height") ?? "")

  return {
    align,
    alt: dom.getAttribute("alt") || null,
    height: parseInt(height, 10) || null,
    src: dom.getAttribute("src") || null,
    title: dom.getAttribute("title") || null,
    width: parseInt(width, 10) || null,
  }
}

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: {
    text: {
      group: "inline",
    },
    paragraph: {
      group: "block",
      content: "inline*",
      parseDOM: [{ tag: "p" }],
      toDOM: () => ["p", 0],
    },
    // @ts-ignore
    img,
    title: {
      content: "inline*",
      toDOM() {
        return ["h1", 0]
      },
      parseDOM: [{ tag: "h1", getAttrs }],
    },
    // body: {
    //   content: "text*",
    //   toDOM() {
    //     return ["body", 0]
    //   },
    //   parseDOM: [{ tag: "body" }],
    // },
    doc: {
      content: "title block+",
    },
  },
})

// const mySchema = new Schema({
//   nodes: addListNodes((schema.spec as any).nodes, "paragraph block*", "block"),
//   marks: (schema.spec as any).marks,
// })

const view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(
      document.querySelector("#content")
    ),
    plugins: [keymap(baseKeymap), titlePlugin, history()],
  }),
  dispatchTransaction: function (tr: any) {
    // const doc = this.state.doc

    const state = this.state.apply(tr)
    view.updateState(state)

    // if (handleDocChange && state.doc !== doc) {
    //   handleDocChange(state.doc)
    // }
  },
})
