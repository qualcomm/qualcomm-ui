// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {filterFrontmatter} from "../markdown/knowledge/filter-frontmatter"

describe("filterFrontmatter", () => {
  describe("include patterns", () => {
    test('["*"] includes all fields', () => {
      const frontmatter = {
        component: "Button",
        description: "A button component",
        title: "Button",
      }
      const result = filterFrontmatter(frontmatter, {include: ["*"]})
      expect(result).toEqual({
        component: "Button",
        description: "A button component",
        title: "Button",
      })
    })

    test("specific field name includes only that field", () => {
      const frontmatter = {
        component: "Button",
        description: "A button",
        title: "Button",
      }
      const result = filterFrontmatter(frontmatter, {include: ["component"]})
      expect(result).toEqual({component: "Button"})
    })

    test("glob pattern matches matching fields", () => {
      const frontmatter = {
        component: "Button",
        metaDescription: "SEO description",
        metaTitle: "Button - QUI",
        title: "Button",
      }
      const result = filterFrontmatter(frontmatter, {include: ["meta*"]})
      expect(result).toEqual({
        metaDescription: "SEO description",
        metaTitle: "Button - QUI",
      })
    })

    test("multiple include patterns combine", () => {
      const frontmatter = {
        author: "Team",
        component: "Button",
        description: "A button",
        title: "Button",
      }
      const result = filterFrontmatter(frontmatter, {
        include: ["component", "author"],
      })
      expect(result).toEqual({author: "Team", component: "Button"})
    })
  })

  describe("exclude patterns", () => {
    test("excludes specific fields from include results", () => {
      const frontmatter = {
        component: "Button",
        description: "A button",
        title: "Button",
      }
      const result = filterFrontmatter(frontmatter, {
        exclude: ["title", "description"],
        include: ["*"],
      })
      expect(result).toEqual({component: "Button"})
    })

    test("glob exclude pattern", () => {
      const frontmatter = {
        component: "Button",
        internalId: "btn-001",
        internalNotes: "Do not publish",
        title: "Button",
      }
      const result = filterFrontmatter(frontmatter, {
        exclude: ["internal*"],
        include: ["*"],
      })
      expect(result).toEqual({component: "Button", title: "Button"})
    })

    test("exclude takes precedence over include", () => {
      const frontmatter = {
        metaDescription: "SEO",
        metaInternal: "Hidden",
        metaTitle: "Title",
      }
      const result = filterFrontmatter(frontmatter, {
        exclude: ["*Internal"],
        include: ["meta*"],
      })
      expect(result).toEqual({metaDescription: "SEO", metaTitle: "Title"})
    })
  })

  describe("edge cases", () => {
    test("skips undefined values", () => {
      const frontmatter = {
        component: "Button",
        description: undefined,
        title: "Button",
      }
      const result = filterFrontmatter(frontmatter, {include: ["*"]})
      expect(result).toEqual({component: "Button", title: "Button"})
    })

    test("returns full frontmatter when config is undefined", () => {
      const frontmatter = {component: "Button", title: "Button"}
      const result = filterFrontmatter(frontmatter, undefined)
      expect(result).toBe(frontmatter)
    })

    test("returns full frontmatter when include is absent", () => {
      const frontmatter = {component: "Button", title: "Button"}
      const result = filterFrontmatter(frontmatter, {})
      expect(result).toBe(frontmatter)
    })

    test("returns full frontmatter when include is empty", () => {
      const frontmatter = {component: "Button", title: "Button"}
      const result = filterFrontmatter(frontmatter, {include: []})
      expect(result).toBe(frontmatter)
    })

    test("returns empty object when frontmatter is empty", () => {
      const result = filterFrontmatter({}, {include: ["*"]})
      expect(result).toEqual({})
    })
  })
})
