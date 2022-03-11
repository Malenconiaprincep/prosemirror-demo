import {schema as baseSchema} from "prosemirror-schema-basic"
import {EditorState, Plugin} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
// (Omitted repeated imports)
import {undo, redo, history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"
import {DOMParser, Schema, Slice} from "prosemirror-model"
import {addListNodes} from "prosemirror-schema-list"
import { ReplaceStep, Transform } from "prosemirror-transform"

console.log((baseSchema.spec as any).nodes)

// (The null arguments are where you can specify attributes, if necessary.)
// let doc = schema.node("doc", null, [
//   schema.node("paragraph", null, [schema.text("One.makuta")]),
//   schema.node("horizontal_rule"),
//   schema.node("paragraph", null, [schema.text("Two!")]),
//   schema.node("heading", null, [schema.text("heading")])
// ])

// let doc = schema.node("doc", null, [
//   schema.node("paragraph", null, [schema.text("a")]),
//   schema.node("paragraph", null, [schema.text("b")]),
//   schema.node("paragraph", null, [schema.text("c")]),
// ])

const headingNode = (baseSchema.nodes as any).heading.createAndFill({
  level: 2
}, baseSchema.text("标题2"))
const image = baseSchema.nodes.image.create({src: 'https://www.baidu.com/img/PC_880906d2a4ad95f5fafb2e540c5cdad7.png'})

// let doc = schema.node("doc", null, [
//   schema.node("paragraph", null, [image]),
//   schema.node("heading", null, [schema.text("标题1")]),
//   schema.node("paragraph", null, [schema.text("b", [schema.marks.strong.instance])]),
//   schema.node("paragraph", null, [schema.text("c", [schema.marks.strong.instance, schema.marks.em.instance, schema.marks.code.instance,])]),
// ])

var pDOM = ["div", { id: Math.random(), class: "c"}, 0], blockquoteDOM = ["blockquote", 0], hrDOM = ["hr"],
      preDOM = ["pre", ["code", 0]], brDOM = ["br"];
  const emDOM = ["em", 0], strongDOM = ["strong", 0], codeDOM = ["code", 0]

// const trivialSchema = new Schema({
//   nodes: {
//     // doc: {content: "block+"},
//     // paragraph: {group: "block", content: "text*", marks: "_", toDOM: function toDOM() { return pDOM}},
//     blockquote: {group: "block", content: "block+", marks: "_", toDOM: function toDOM() { return blockquoteDOM}},
//     // text: {}

//     // doc: {content: "paragraph+"},
//     // paragraph: {content: "text*", toDOM: function toDOM() { return pDOM }},
//     // text: {inline: true},

//     doc: {
//       content: "block+"
//     },

//     heading: {
//       attrs: {level: {default: 1}},
//       content: "inline*",
//       group: "block",
//       defining: true,
//       parseDOM: [{tag: "h1", attrs: {level: 1}},
//                  {tag: "h2", attrs: {level: 2}},
//                  {tag: "h3", attrs: {level: 3}},
//                  {tag: "h4", attrs: {level: 4}},
//                  {tag: "h5", attrs: {level: 5}},
//                  {tag: "h6", attrs: {level: 6}}],
//       toDOM(node: any) { return ["h" + node.attrs.level, 0] }
//     },
  
//     // :: NodeSpec A plain paragraph textblock. Represented in the DOM
//     // as a `<p>` element.
//     paragraph: {
//       content: "inline*",
//       group: "block",
//       parseDOM: [{tag: "p"}],
//       toDOM: function toDOM() { return pDOM }
//     },

//     image: {
//       inline: true,
//       attrs: {
//         src: {},
//         alt: {default: null},
//         title: {default: null}
//       },
//       group: "inline",
//       draggable: true,
//       parseDOM: [{tag: "img[src]", getAttrs(dom: any) {
//         return {
//           src: dom.getAttribute("src"),
//           title: dom.getAttribute("title"),
//           alt: dom.getAttribute("alt")
//         }
//       }}],
//       toDOM(node: any) { let {src, alt, title} = node.attrs; return ["img", {src, alt, title}] }
//     },

//     text: {
//       group: "inline"
//     },
//     /* ... and so on */
//   },
//   marks: {
//     strong: {
//       parseDOM: [{tag: "strong"},
//                  // This works around a Google Docs misbehavior where
//                  // pasted content will be inexplicably wrapped in `<b>`
//                  // tags with a font-weight normal.
//                  {tag: "b", getAttrs: (node: any): any => node.style.fontWeight != "normal" && null},
//                  {style: "font-weight", getAttrs: (value: any): any => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
//       toDOM() { return strongDOM }
//     },
//     // em: {}
//   }
// })
// console.log(trivialSchema)

const trivialSchema = new Schema({
  nodes: addListNodes((baseSchema.spec as any).nodes, "paragraph block*", "block"),
  marks: (baseSchema.spec as any).marks
})

console.log(trivialSchema, 'trivialSchema')

// console.log(trivialSchema.marks.strong.instance)
// console.log(schema.marks.strong.instance)



// 标题
const imageNode = trivialSchema.nodes.image.create({src: 'https://www.baidu.com/img/PC_880906d2a4ad95f5fafb2e540c5cdad7.png', title: 'xx'})
console.log(imageNode)
let doc = trivialSchema.node("doc", null, [
  trivialSchema.node("paragraph", null, [trivialSchema.text("abcdefgh")] ),
  trivialSchema.node("paragraph", null, [trivialSchema.text("hello")] ),
  trivialSchema.node("blockquote", null, [trivialSchema.node("paragraph", null,[trivialSchema.text("makuta")] )]),
  // trivialSchema.node("paragraph", null, [trivialSchema.text("c")]),
  trivialSchema.node("paragraph", null, [imageNode]),
  trivialSchema.node("heading", null, [trivialSchema.text("标题1")]),
  trivialSchema.node("heading", {
    level: 2
  } , [trivialSchema.text("标题2")]),
  trivialSchema.node("ordered_list", {
    order: 1
  }, [trivialSchema.node("list_item", null,[trivialSchema.node("paragraph", null,[trivialSchema.text("makuta")] )] )]),
  trivialSchema.node("ordered_list", {
    order: 2
  }, [trivialSchema.node("list_item", null,[trivialSchema.node("paragraph", null,[trivialSchema.text("makuta11")] )] )]),

  trivialSchema.node("bullet_list", null, [trivialSchema.node("list_item", null,[trivialSchema.node("paragraph", null,[trivialSchema.text("makuta11")] )] )]),


  trivialSchema.node("paragraph", null, [trivialSchema.text("abcdefgh")] ),
  trivialSchema.node("paragraph", null, [trivialSchema.text("hello")] ),
  trivialSchema.node("blockquote", null, [trivialSchema.node("paragraph", null,[trivialSchema.text("makuta")] )]),
  // trivialSchema.node("paragraph", null, [trivialSchema.text("c")]),
  trivialSchema.node("paragraph", null, [imageNode]),
  trivialSchema.node("heading", null, [trivialSchema.text("标题1")]),
  trivialSchema.node("heading", {
    level: 2
  } , [trivialSchema.text("标题2")]),
  trivialSchema.node("ordered_list", {
    order: 1
  }, [trivialSchema.node("list_item", null,[trivialSchema.node("paragraph", null,[trivialSchema.text("makuta")] )] )]),
  trivialSchema.node("ordered_list", {
    order: 2
  }, [trivialSchema.node("list_item", null,[trivialSchema.node("paragraph", null,[trivialSchema.text("makuta11")] )] )]),

  trivialSchema.node("bullet_list", null, [trivialSchema.node("list_item", null,[trivialSchema.node("paragraph", null,[trivialSchema.text("makuta11")] )] )])
  
])

let myPlugin = new Plugin({
  props: {
    handleKeyDown(view: any, event: any) {
      console.log("A key was pressed!")
      return false // We did not handle this
    }
  }
})


let state = EditorState.create({
  doc,
  plugins: [
    history(),
    keymap({"Mod-z": undo, "Mod-y": redo}),
    keymap(baseKeymap),
    myPlugin
  ]
})
let view = new EditorView(document.body, {
  state,
  // dispatchTransaction(transaction: any) {
  //   console.log(transaction)
  //   console.log("Document size went from", transaction.before.content.size,
  //               "to", transaction.doc.content.size)
  //   let newState = view.state.apply(transaction)
  //   view.updateState(newState)
  //   console.log(newState.selection.from)
  // }
})

let content = document.getElementById("content")
// let state = EditorState.create({
//   doc: DOMParser.fromSchema(schema).parse(content)
// })

// console.log(state)

// console.log(doc.slice(0, 2))
// console.log(doc.slice(0, 5))
// console.log(doc.slice(1, 8))
console.log(doc)
// console.log(doc.resolve(0))
// console.log(doc.content.content[0].resolve(1))


// let step = new ReplaceStep(3, 5, Slice.empty)
// let result = step.apply(doc)

// console.log(result)



// let tr = new Transform(doc)


// tr.delete(1, 3).split(3)

// console.log(tr.doc.toString())


//  console.log(doc.toString())

//  1 2 3 6 7 8
//  1 2 3 4 5 6 7 8
//  1 2 3 6 7 8

// let step = new ReplaceStep(4, 6, Slice.empty)
// let map = step.getMap()

// let result = step.apply(doc)
// console.log(result.doc.toString())

// console.log(map.map(5)) 
// console.log(map.map(2)) 



// 1 2 3 4 5 6 7 8 9 0 1
// 1 5 6 7 8 9 0 1

console.log(view)


let tr = view.state.tr
console.log(tr.doc.content.size) // 25
tr.insertText("插入新东西", 145, 145).scrollIntoView() // Replaces selection with 'hello'
let newState = state.apply(tr)
console.log(tr.doc.content.size) // 30
view.updateState(newState)