// Copyright (c) Qualcomm Technologies, Inc. and/or its subsidiaries.
// SPDX-License-Identifier: BSD-3-Clause-Clear

import type {ComponentProps} from "react"

import type {Root} from "hast"
import {describe, expect, test} from "vitest"
import {render} from "vitest-browser-react"
import {page} from "vitest/browser"

import {Description} from "./description.js"

const tree: Root = {
  children: [
    {
      children: [
        {
          children: [{type: "text", value: "the guide"}],
          properties: {href: "https://example.com"},
          tagName: "a",
          type: "element",
        },
      ],
      properties: {},
      tagName: "p",
      type: "element",
    },
    {
      children: [
        {
          children: [{type: "text", value: '{"id": 1}\n'}],
          properties: {className: ["language-json"]},
          tagName: "code",
          type: "element",
        },
      ],
      properties: {},
      tagName: "pre",
      type: "element",
    },
  ],
  type: "root",
}

describe("Description", () => {
  test("doesn't leak the hast node into component props", async () => {
    const {container} = await render(
      <Description
        components={{a: (props: ComponentProps<"a">) => <a {...props} />}}
        tree={tree}
      />,
    )

    await expect
      .element(page.getByRole("link", {name: "the guide"}))
      .not.toHaveAttribute("node")
    expect(container.querySelector("[node]")).toBeNull()
  })

  test("renders fenced code through the code highlighter", async () => {
    const {container} = await render(<Description tree={tree} />)

    await expect
      .poll(() => container.querySelector(".qui-docs-openapi__code-block pre"))
      .not.toBeNull()
    expect(container.textContent).toContain('{"id": 1}')
  })

  test("renders alerts as inline notifications", async () => {
    const {container} = await render(
      <Description
        tree={{
          children: [
            {
              children: [{type: "text", value: "Requests are throttled."}],
              properties: {label: "Rate limits", type: "caution"},
              tagName: "alert",
              type: "element",
            },
          ],
          type: "root",
        }}
      />,
    )

    const root = container.querySelector(".qui-notification__root")
    expect(root).toHaveAttribute("data-emphasis", "danger")
    expect(root?.querySelector(".qui-notification__label")).toHaveTextContent(
      "Rate limits",
    )
    expect(
      root?.querySelector(".qui-notification__description"),
    ).toHaveTextContent("Requests are throttled.")
    expect(container.querySelector("alert")).toBeNull()
  })
})
