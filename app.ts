import {schema} from "prosemirror-schema-basic"
import {EditorState} from "prosemirror-state"
import {EditorView} from "prosemirror-view"
// (Omitted repeated imports)
import {undo, redo, history} from "prosemirror-history"
import {keymap} from "prosemirror-keymap"
import {baseKeymap} from "prosemirror-commands"



// let state = EditorState.create({
//   schema,
//   plugins: [
//     history(),
//     keymap({"Mod-z": undo, "Mod-y": redo}),
//     keymap(baseKeymap)
//   ]
// })
// let view = new EditorView(document.body, {
//   state,
//   dispatchTransaction(transaction: any) {
//     console.log("Document size went from", transaction.before.content.size,
//                 "to", transaction.doc.content.size)
//     let newState = view.state.apply(transaction)
//     view.updateState(newState)
//   }
// })

let content = document.getElementById("content")
let state = EditorState.create({
  doc: DOMParser.fromSchema(schema).parse(content)
})
