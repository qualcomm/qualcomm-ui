import {describe, expect, test} from "vitest"

import {normalizeProps} from "./normalize-props"

describe("normalizeProps", () => {
  describe("identity normalization", () => {
    test("element returns the props object", () => {
      const props = {bar: "baz", foo: 1}
      expect(normalizeProps.element(props)).toEqual(props)
    })

    test("button returns the props object", () => {
      const props = {disabled: true, type: "button" as const}
      expect(normalizeProps.button(props)).toEqual(props)
    })

    test("input returns the props object", () => {
      const props = {name: "email", type: "text"}
      expect(normalizeProps.input(props)).toEqual(props)
    })

    test("label returns the props object", () => {
      const props = {htmlFor: "x"}
      expect(normalizeProps.label(props)).toEqual(props)
    })

    test("select returns the props object", () => {
      const props = {name: "country"}
      expect(normalizeProps.select(props)).toEqual(props)
    })

    test("textarea returns the props object", () => {
      const props = {rows: 3}
      expect(normalizeProps.textarea(props)).toEqual(props)
    })

    test("img returns the props object", () => {
      const props = {alt: "alt", src: "/x.png"}
      expect(normalizeProps.img(props)).toEqual(props)
    })
  })
})
