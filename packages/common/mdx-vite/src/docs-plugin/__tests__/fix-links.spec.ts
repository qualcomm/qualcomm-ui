// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import {describe, expect, test} from "vitest"

import {fixFileLinks} from "../fix-links"

const routesDir = "/site/src/routes"
const sourceFile = `${routesDir}/components+/button+/_button.mdx`
const sourcePathname = "/components/button"
const pageFiles = {
  "/api/qui-docs-config": `${routesDir}/api+/qui-docs-config.mdx`,
  "/components/button": sourceFile,
  "/components/tooltip": `${routesDir}/components+/tooltip+/_tooltip.mdx`,
}

function fix(contents: string) {
  return fixFileLinks(contents, sourceFile, sourcePathname, pageFiles)
}

describe("fixFileLinks", () => {
  test("rewrites root-relative links to relative file paths", () => {
    const result = fix(
      "See [tooltip](/components/tooltip#placement) and [config](/api/qui-docs-config).",
    )
    expect(result.contents).toBe(
      "See [tooltip](../tooltip+/_tooltip.mdx#placement) and [config](../../api+/qui-docs-config.mdx).",
    )
    expect(result.fixes).toEqual([
      {
        from: "/components/tooltip#placement",
        line: 1,
        to: "../tooltip+/_tooltip.mdx#placement",
      },
      {
        from: "/api/qui-docs-config",
        line: 1,
        to: "../../api+/qui-docs-config.mdx",
      },
    ])
  })

  test("rewrites same-page links to bare fragments", () => {
    expect(fix("Use the [size](./#size) prop.").contents).toBe(
      "Use the [size](#size) prop.",
    )
  })

  test("rewrites URL-relative links", () => {
    expect(fix("[tooltip](./tooltip)").contents).toBe(
      "[tooltip](../tooltip+/_tooltip.mdx)",
    )
  })

  test("preserves link titles and angle brackets", () => {
    expect(
      fix('[a](/components/tooltip "Tooltip") [b](</components/tooltip>)')
        .contents,
    ).toBe(
      '[a](../tooltip+/_tooltip.mdx "Tooltip") [b](<../tooltip+/_tooltip.mdx>)',
    )
  })

  test("leaves file links, fragments, external links, and unknown pages alone", () => {
    const contents = [
      "[a](../tooltip+/_tooltip.mdx)",
      "[b](#size)",
      "[c](https://example.com)",
      "[d](/missing)",
      "[e](/favicon.svg)",
    ].join("\n\n")
    const result = fix(contents)
    expect(result.contents).toBe(contents)
    expect(result.fixes).toEqual([])
  })

  test("does not change link text that matches the URL", () => {
    expect(fix("[/components/tooltip](/components/tooltip)").contents).toBe(
      "[/components/tooltip](../tooltip+/_tooltip.mdx)",
    )
  })

  test("only edits link destinations in MDX with frontmatter and JSX", () => {
    const contents = [
      "---",
      "title: Button",
      "---",
      "",
      'import {Alert} from "./alert"',
      "",
      "# {frontmatter.title}",
      "",
      "<Alert>",
      "  Read the [tooltip docs](/components/tooltip).",
      "</Alert>",
      "",
      '<a href="/components/tooltip">raw</a>',
      "",
      "```md",
      "[code](/components/tooltip)",
      "```",
    ].join("\n")
    const result = fix(contents)
    expect(result.contents).toBe(
      contents.replace(
        "[tooltip docs](/components/tooltip)",
        "[tooltip docs](../tooltip+/_tooltip.mdx)",
      ),
    )
    expect(result.fixes).toHaveLength(1)
    expect(result.fixes[0].line).toBe(10)
  })

  test("skips links whose destination is not written verbatim", () => {
    const contents = "[a](/components/tool&#116;ip)"
    const result = fix(contents)
    expect(result.contents).toBe(contents)
    expect(result.skipped).toEqual([
      {from: "/components/tooltip", line: 1, to: "../tooltip+/_tooltip.mdx"},
    ])
  })
})
