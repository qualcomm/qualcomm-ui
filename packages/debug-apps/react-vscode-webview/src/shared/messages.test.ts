import {deepStrictEqual, strictEqual} from "node:assert"
import {test} from "node:test"

import {respondToWebviewMessage} from "./messages"

test("acknowledges readiness and returns the requested greeting", () => {
  deepStrictEqual(respondToWebviewMessage({type: "ready"}), {
    type: "host-ready",
  })
  deepStrictEqual(respondToWebviewMessage({name: "  Dust  ", type: "greet"}), {
    text: "Hello, Dust!",
    type: "greeting",
  })
})

test("does not respond to invalid messages or unrestricted command requests", () => {
  for (const value of [
    null,
    "greet",
    {},
    {type: "greet"},
    {name: 123, type: "greet"},
    {name: "   ", type: "greet"},
    {name: "x".repeat(65), type: "greet"},
    {command: "workbench.action.closeWindow", type: "execute-command"},
  ]) {
    strictEqual(respondToWebviewMessage(value), undefined)
  }
})
