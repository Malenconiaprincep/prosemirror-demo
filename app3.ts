import { EditorState } from "prosemirror-state"
import { EditorView } from "prosemirror-view"
import { Schema, DOMParser } from "prosemirror-model"
import { schema } from "prosemirror-schema-basic"
import { addListNodes } from "prosemirror-schema-list"
import { baseKeymap } from "prosemirror-commands"
import { keymap } from "prosemirror-keymap"
import { Plugin } from "prosemirror-state"
import { Decoration, DecorationSet } from "prosemirror-view"

const titlePlugin = new Plugin({
  props: {
    decorations({ doc, selection }: any) {
      const options = {
        emptyNodeClass: "empty-title",
        placeholder: "Write something …",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
        includeChildren: false,
      }
      const decorations: Decoration[] = []

      console.log(doc.firstChild)
      console.log(doc.firstChild.childCount)
      console.log(doc.firstChild.nodeSize)

      const isEmpty = doc.firstChild.childCount === 0
      if (isEmpty) {
        const classes = [options.emptyNodeClass]

        const decoration = Decoration.node(0, 0 + doc.firstChild.nodeSize, {
          class: classes.join(" "),
          "data-placeholder": options.placeholder,
        })

        decorations.push(decoration)
      }

      // doc.descendants((node: any, pos: any) => {
      //   const hasAnchor = anchor >= pos && anchor <= pos + node.nodeSize
      //   const isEmpty = !node.isLeaf && !node.childCount

      //   if ((hasAnchor || !options.showOnlyCurrent) && isEmpty) {
      //     const classes = [options.emptyNodeClass]

      //     const decoration = Decoration.node(pos, pos + node.nodeSize, {
      //       class: classes.join(" "),
      //       "data-placeholder": options.placeholder,
      //     })

      //     decorations.push(decoration)
      //   }

      //   return options.includeChildren
      // })

      return DecorationSet.create(doc, decorations)
    },
  },
})

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
    title: {
      content: "inline*",
      toDOM() {
        return ["h1", 0]
      },
      //@ts-ignore
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

function getAttrs(dom: HTMLElement) {
  console.log(dom)
}

// const mySchema = new Schema({
//   nodes: addListNodes((schema.spec as any).nodes, "paragraph block*", "block"),
//   marks: (schema.spec as any).marks,
// })

const view = new EditorView(document.querySelector("#editor"), {
  state: EditorState.create({
    doc: DOMParser.fromSchema(mySchema).parse(
      document.querySelector("#content")
    ),
    plugins: [keymap(baseKeymap), titlePlugin],
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
