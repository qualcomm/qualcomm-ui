// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import {unified} from "unified"
import {describe, expect, test} from "vitest"

import {remarkAlerts} from "../remark/remark-alerts.js"

const processor = unified()
  .use(remarkParse)
  .use(remarkAlerts)
  .use(remarkRehype)
  .use(rehypeStringify)

const render = (markdown: string) => String(processor.processSync(markdown))

describe("remarkAlerts", () => {
  test("renders a marker on its own line", () => {
    const html = render("> [!NOTE]\n> Org permissions still apply.")
    expect(html).toContain(
      '<div class="qui-notification__root mdx" data-emphasis="info"',
    )
    expect(html).toContain(
      '<div class="qui-notification__description" dir="auto">\n<p>Org permissions still apply.</p>',
    )
    expect(html).not.toContain("[!NOTE]")
  })

  test("renders a marker followed by a hard break", () => {
    const html = render("> [!TIP]  \n> Cache the token.")
    expect(html).toContain('data-emphasis="info"')
    expect(html).toContain("<p>Cache the token.</p>")
    expect(html).not.toContain("<br>")
  })

  test("renders a custom title as the label", () => {
    const html = render("> [!WARNING/Rate limits]\n> Requests are throttled.")
    expect(html).toContain(
      '<div class="qui-notification__label" dir="auto">Rate limits</div>',
    )
    expect(html).toContain("<p>Requests are throttled.</p>")
  })

  test("renders a marker followed by a list", () => {
    const html = render("> [!CAUTION]\n> * Comments are deleted.")
    expect(html).toContain('data-emphasis="danger"')
    expect(html).toContain("<li>Comments are deleted.</li>")
  })

  test("leaves plain blockquotes alone", () => {
    expect(render("> Just a quote.")).toBe(
      "<blockquote>\n<p>Just a quote.</p>\n</blockquote>",
    )
  })
})
