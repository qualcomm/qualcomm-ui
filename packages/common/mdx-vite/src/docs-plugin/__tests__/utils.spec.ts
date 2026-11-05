// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {removeCodeAnnotations} from "../shiki"

describe("removeCodeAnnotations", () => {
  describe("inline annotations", () => {
    test("strips [!code focus] annotation but preserves code", () => {
      const input = "const foo = 'bar' // [!code focus]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const foo = 'bar' ")
    })

    test("strips [!code highlight] annotation but preserves code", () => {
      const input = "const highlighted = 'value' // [!code highlight]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const highlighted = 'value' ")
    })

    test("strips [!code ++] annotation but preserves code", () => {
      const input = "const added = true // [!code ++]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const added = true ")
    })

    test("removes line with [!code --] annotation", () => {
      const input = "const removed = true // [!code --]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("")
    })

    test("strips [!code error] annotation but preserves code", () => {
      const input = "const bad = null // [!code error]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const bad = null ")
    })

    test("strips [!code warning] annotation but preserves code", () => {
      const input = "const warn = undefined // [!code warning]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const warn = undefined ")
    })

    test("removes entire line when [!code hide] is inline with code", () => {
      const input = "const secret = 'hidden' // [!code hide]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("")
    })

    test("removes entire line when [!code hide:N] is inline with code", () => {
      const input = "const secret = 'hidden' // [!code hide:3]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("")
    })
  })

  describe("standalone annotation markers", () => {
    test("removes standalone [!code focus] marker line", () => {
      const input = "// [!code focus]\nconst visible = true"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const visible = true")
    })

    test("removes standalone [!code hide] marker line", () => {
      const input = "// [!code hide]\nconst visible = true"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const visible = true")
    })

    test("removes standalone [!code highlight] marker line", () => {
      const input = "// [!code highlight]\nconst visible = true"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const visible = true")
    })

    test("removes standalone [!code --] marker line", () => {
      const input = "// [!code --]\nconst visible = true"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const visible = true")
    })
  })

  describe("JSX block annotations", () => {
    test("strips JSX block annotation but preserves code", () => {
      const input = "<Button /> {/* [!code focus] */}"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("<Button /> ")
    })

    test("removes line if JSX block annotation leaves it empty", () => {
      const input = "{/* [!code focus] */}"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("")
    })
  })

  describe("HTML comment annotations", () => {
    test("strips HTML comment annotation but preserves code", () => {
      const input = "<div>content</div> <!-- [!code focus] -->"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("<div>content</div> ")
    })

    test("removes line if HTML comment annotation leaves it empty", () => {
      const input = "<!-- [!code highlight] -->"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("")
    })
  })

  describe("block comment annotations", () => {
    test("strips block comment annotation but preserves code", () => {
      const input = "const x = 1 /* [!code focus] */"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const x = 1 ")
    })
  })

  describe("multiline code", () => {
    test("handles multiple lines with different annotations", () => {
      const input = [
        "const a = 1 // [!code focus]",
        "const b = 2 // [!code highlight]",
        "const c = 3",
        "const d = 4 // [!code hide]",
      ].join("\n")

      const result = removeCodeAnnotations(input)
      expect(result).toBe(
        ["const a = 1 ", "const b = 2 ", "const c = 3"].join("\n"),
      )
    })

    test("preserves lines without annotations", () => {
      const input = [
        "const a = 1",
        "const b = 2 // [!code focus]",
        "const c = 3",
      ].join("\n")

      const result = removeCodeAnnotations(input)
      expect(result).toBe(
        ["const a = 1", "const b = 2 ", "const c = 3"].join("\n"),
      )
    })

    test("removes removed diff lines but keeps added diff lines", () => {
      const input = [
        "const before = false // [!code --]",
        "const after = true // [!code ++]",
        "const unchanged = true",
      ].join("\n")

      const result = removeCodeAnnotations(input)
      expect(result).toBe(
        ["const after = true ", "const unchanged = true"].join("\n"),
      )
    })

    test("handles code with no annotations", () => {
      const input = "const x = 1\nconst y = 2"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const x = 1\nconst y = 2")
    })
  })

  describe("edge cases", () => {
    test("handles empty string", () => {
      const result = removeCodeAnnotations("")
      expect(result).toBe("")
    })

    test("handles whitespace-only lines", () => {
      const input = "  \n\t\n"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("  \n\t\n")
    })

    test("does not match [!code] without annotation type", () => {
      const input = "const x = 1 // [!code]"
      const result = removeCodeAnnotations(input)
      expect(result).toBe("const x = 1 ")
    })
  })
})
