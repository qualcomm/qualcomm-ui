import {describe, expect, test} from "vitest"

import {TreeCollection} from "@qualcomm-ui/utils/collection"

import {getAccessibleDescription} from "./accessibility.js"
import {jsonNodeToElement, TypedArrayType} from "./data-type.js"
import {jsonToTree} from "./json-to-tree.js"
import {nodeToString, nodeToValue} from "./node-conversion.js"
import type {JsonNodeHastElement} from "./types.js"

function getText(node: JsonNodeHastElement): string {
  return node.type === "text"
    ? String(node.value)
    : node.children.map(getText).join("")
}

function getInvalidText(node: JsonNodeHastElement): string[] {
  if (node.type === "text") {
    return []
  }
  return node.properties.kind === "invalid"
    ? [getText(node)]
    : node.children.flatMap(getInvalidText)
}

describe("JSON data type detection", () => {
  test.each([
    {constructor: null, name: "value"},
    {constructor: undefined, name: "value"},
    Object.assign(Object.create(null) as Record<string, unknown>, {
      name: "value",
    }),
  ])("renders objects with missing or null constructors", (value) => {
    const node = jsonToTree(value)

    expect(node.type).toBe("object")
    expect(node.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({keyPath: ["$", "name"], value: "value"}),
      ]),
    )
    expect(getText(jsonNodeToElement(node))).toContain('name: "value"')
    expect(getAccessibleDescription(node)).toContain("Object, expandable")
  })

  test("does not classify objects by a spoofed typed array constructor", () => {
    const value = {constructor: {name: "Uint8Array"}, name: "value"}

    expect(TypedArrayType.check(value)).toBe(false)
    expect(jsonToTree(value).type).toBe("object")
  })

  test("retains class instance names and properties", () => {
    class Example {
      name = "value"
    }
    const node = jsonToTree(new Example())

    expect(node.constructorName).toBe("Example")
    expect(getText(jsonNodeToElement(node))).toBe('Example { name: "value" }')
    expect(getAccessibleDescription(node)).toContain("Example, expandable")
  })

  test.each([
    [new Int8Array([1, 2]), "int8array", "Int8Array"],
    [new Uint8Array([1, 2]), "uint8array", "Uint8Array"],
    [new Uint8ClampedArray([1, 2]), "uint8clampedarray", "Uint8ClampedArray"],
    [new Int16Array([1, 2]), "int16array", "Int16Array"],
    [new Uint16Array([1, 2]), "uint16array", "Uint16Array"],
    [new Int32Array([1, 2]), "int32array", "Int32Array"],
    [new Uint32Array([1, 2]), "uint32array", "Uint32Array"],
    [new Float32Array([1, 2]), "float32array", "Float32Array"],
    [new Float64Array([1, 2]), "float64array", "Float64Array"],
    [new BigInt64Array([1n, 2n]), "bigint64array", "BigInt64Array"],
    [new BigUint64Array([1n, 2n]), "biguint64array", "BigUint64Array"],
  ])(
    "preserves %s typed array detection and descriptions",
    (value, type, name) => {
      const node = jsonToTree(value)

      expect(node.type).toBe(type)
      expect(getText(jsonNodeToElement(node))).toContain(`${name}(2)`)
      expect(getAccessibleDescription(node)).toContain(`${name}(2), expandable`)
    },
  )

  test("renders typed arrays with a missing constructor as iterables", () => {
    const value = new Uint8Array([1, 2])
    Object.defineProperty(value, "constructor", {value: null})
    const node = jsonToTree(value)

    expect(TypedArrayType.check(value)).toBe(false)
    expect(node.type).toBe("iterable")
    expect(getText(jsonNodeToElement(node))).toContain("Iterable(2)")
    expect(getAccessibleDescription(node)).toContain("Iterable, expandable")
  })
})

describe("JSON date formatting", () => {
  test.each([
    [new Date("2025-01-01T00:00:00.000Z"), "2025-01-01T00:00:00.000Z"],
    [new Date(NaN), "Invalid Date"],
  ])("renders %s as %s", (value, expected) => {
    const node = jsonToTree(value)
    const element = jsonNodeToElement(node)

    expect(node.type).toBe("date")
    expect(getText(element)).toBe(expected)
    expect(getInvalidText(element)).toEqual(
      expected === "Invalid Date" ? ["Invalid Date"] : [],
    )
  })

  test.each([
    [new Map([["date", new Date(NaN)]]), 'Map(1) { "date" => Invalid Date }'],
    [new Set([new Date(NaN)]), "Set(1) { Invalid Date }"],
    [
      new Map([["date", new Date("2025-01-01T00:00:00.000Z")]]),
      'Map(1) { "date" => 2025-01-01T00:00:00.000Z }',
    ],
    [
      new Set([new Date("2025-01-01T00:00:00.000Z")]),
      "Set(1) { 2025-01-01T00:00:00.000Z }",
    ],
  ])("renders dates in %s previews", (value, expected) => {
    const node = jsonToTree(value)
    const element = jsonNodeToElement(node)

    expect(getText(element)).toBe(expected)
    expect(getInvalidText(element)).toEqual(
      expected.includes("Invalid Date") ? ["Invalid Date"] : [],
    )
  })

  test.each([new Map([["date", "Invalid Date"]]), new Set(["Invalid Date"])])(
    "does not mark literal Invalid Date strings in %s as invalid",
    (value) => {
      const element = jsonNodeToElement(jsonToTree(value))

      expect(getText(element)).toContain('"Invalid Date"')
      expect(getInvalidText(element)).toEqual([])
    },
  )

  test("marks an invalid date used as a Map key", () => {
    const element = jsonNodeToElement(
      jsonToTree(new Map([[new Date(NaN), "value"]])),
    )

    expect(getText(element)).toBe('Map(1) { Invalid Date => "value" }')
    expect(getInvalidText(element)).toEqual(["Invalid Date"])
  })
})

describe("JSON entry identities", () => {
  test.each([
    {
      name: "repeated URL parameters",
      value: new URLSearchParams("tag=a&tag=b"),
    },
    {
      name: "numeric and string Map keys",
      value: new Map<unknown, unknown>([
        [1, "number"],
        ["1", "string"],
      ]),
    },
    {
      name: "distinct object Map keys",
      value: new Map([
        [{id: 1}, {name: "first"}],
        [{id: 2}, {name: "second"}],
      ]),
    },
    {
      name: "Headers entries",
      value: new Headers({"content-type": "application/json", "x-id": "123"}),
    },
  ])("keeps $name independently addressable", ({value}) => {
    const rootNode = jsonToTree(value)
    const collection = new TreeCollection({
      nodeChildren: "children",
      nodeText: nodeToString,
      nodeValue: nodeToValue,
      rootNode,
    })
    const values = collection.getValues()

    expect(new Set(values).size).toBe(values.length)

    const entries = rootNode.children?.find(
      (node) => node.keyPath.at(-1) === "[[Entries]]",
    )?.children
    expect(entries).toHaveLength(2)

    for (const entry of entries ?? []) {
      expect(entry.children).toHaveLength(2)
      for (const child of entry.children ?? []) {
        expect(child.keyPath.slice(0, -1)).toEqual(entry.keyPath)
        expect(collection.findNode(nodeToValue(child))).toBe(child)
      }
    }
  })
})
