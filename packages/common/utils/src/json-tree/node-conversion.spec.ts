import {describe, expect, test} from "vitest"

import {TreeCollection} from "@qualcomm-ui/utils/collection"

import {jsonToTree} from "./json-to-tree.js"
import {
  DEFAULT_PREVIEW_OPTIONS,
  getPreviewOptions,
  jsonPathToValue,
  keyPathToId,
  keyPathToKey,
  nodeToString,
  nodeToValue,
} from "./node-conversion.js"

describe("JSON array grouping options", () => {
  test.each([-1, -100, -0.5, 0.5, 1.5, NaN, Infinity, -Infinity])(
    "uses the default grouping size for %s",
    (groupArraysAfterLength) => {
      const options = getPreviewOptions({
        groupArraysAfterLength,
        maxPreviewItems: 2,
      })
      expect(options.groupArraysAfterLength).toBe(100)
      expect(options.maxPreviewItems).toBe(2)

      const node = jsonToTree(
        Array.from({length: 101}, (_, index) => index),
        {
          options: {...DEFAULT_PREVIEW_OPTIONS, groupArraysAfterLength},
        },
      )
      const groups = node.children?.filter((child) => child.children)

      expect(groups?.map((group) => group.keyPath.at(-1))).toEqual([
        "[0…99]",
        "[100…100]",
      ])
      expect(groups?.map((group) => group.children?.length)).toEqual([100, 1])
    },
  )

  test.each([
    [0, ["0", "1", "2", "length"]],
    [1, ["[0…0]", "[1…1]", "[2…2]", "length"]],
    [2, ["[0…1]", "[2…2]", "length"]],
    [3, ["0", "1", "2", "length"]],
  ])("preserves grouping size %s", (groupArraysAfterLength, expectedKeys) => {
    expect(
      getPreviewOptions({groupArraysAfterLength}).groupArraysAfterLength,
    ).toBe(groupArraysAfterLength)
    const node = jsonToTree([0, 1, 2], {
      options: {...DEFAULT_PREVIEW_OPTIONS, groupArraysAfterLength},
    })

    expect(node.children?.map((child) => child.keyPath.at(-1))).toEqual(
      expectedKeys,
    )
  })
})

describe("JSON node paths", () => {
  test.each([
    [["$", "user", "name"], "$.user.name"],
    [["$", "items", 0], "$.items.0"],
    [["$", "a.b"], "$.a\\.b"],
    [["$", "a", "b"], "$.a.b"],
    [["$", "a\\b"], "$.a\\\\b"],
    [["$", "a\\.b"], "$.a\\\\\\.b"],
    [["$", "a\\", "b"], "$.a\\\\.b"],
    [["$", ""], "$."],
  ])("serializes %j as %s", (keyPath, expected) => {
    expect(keyPathToId(keyPath)).toBe(expected)
    expect(jsonPathToValue(expected)).toBe(
      nodeToValue({keyPath, type: "object", value: null}),
    )
  })

  test("keeps special property names independently addressable", () => {
    const rootNode = jsonToTree({
      a: {b: {y: 2}},
      "a.b": {x: 1},
      "a\\": {b: {q: 5}},
      "a\\.b": {w: 4},
      "a\\b": {z: 3},
    })
    const collection = new TreeCollection({
      nodeChildren: "children",
      nodeText: nodeToString,
      nodeValue: nodeToValue,
      rootNode,
    })
    const values = collection.getValues()
    const branchValues = collection.getBranchValues()

    expect(new Set(values).size).toBe(values.length)
    expect(new Set(branchValues).size).toBe(branchValues.length)
    for (const node of collection.flatten()) {
      expect(collection.findNode(nodeToValue(node))?.keyPath).toEqual(
        node.keyPath,
      )
    }
  })

  test("preserves original data keys and displayed labels", () => {
    const data = {"a.b": 1, "a\\b": 2}
    const node = jsonToTree(data)

    expect(Object.keys(data)).toEqual(["a.b", "a\\b"])
    expect(node.children?.map((child) => keyPathToKey(child.keyPath))).toEqual([
      "a.b",
      "a\\b",
    ])
    expect(node.children?.map(nodeToString)).toEqual(["a.b", "a\\b"])
  })
})
